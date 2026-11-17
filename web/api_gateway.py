"""Router gateway OpenAI-compatible untuk Web AI.

Menyediakan:
- POST /v1/chat/completions  (kompatibel OpenAI, streaming & non-streaming)
- GET  /v1/models
- GET  /v1/usage            (ringkasan pemakaian per user)

Endpoint chat di sini memakai fungsi stream_fn dari server.py agar konsisten
dengan provider yang sudah dikonfigurasi. Auth & metering via gateway.py.
"""
import os
import json
import time
import asyncio
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

import gateway as gw

router = APIRouter()
REQUIRE_KEY = os.getenv('GATEWAY_REQUIRE_KEY', '1') != '0'


from fastapi import Header


def _auth(authorization: str | None = Header(default=None)):
    if not REQUIRE_KEY:
        return {'key': 'anonymous', 'name': 'anonymous'}
    return gw.require_key(authorization)


class OAIMessage(BaseModel):
    role: str
    content: str


class OAIRequest(BaseModel):
    model: str | None = None
    messages: list[OAIMessage]
    stream: bool = False
    temperature: float | None = None
    max_tokens: int | None = None


@router.get('/v1/models')
def list_models():
    import server
    return {
        'object': 'list',
        'data': [{'id': server.MODEL, 'object': 'model', 'owned_by': server.PROVIDER}],
    }


@router.get('/v1/usage')
def usage(auth=Depends(_auth)):
    summary = gw.usage_summary()
    return {'user': auth.get('name'), 'totals': summary.get(auth.get('name'), {})}


@router.post('/v1/chat/completions')
async def chat_completions(req: OAIRequest, request: Request, auth=Depends(_auth)):
    import server

    # rate-limit per key (rpm dari api_keys.json)
    try:
        gw.check_rate_limit(auth.get('key', ''), int(auth.get('rpm', 0) or 0))
    except Exception:
        raise

    msgs = server.prepare_messages([m.model_dump() for m in req.messages])
    if not msgs:
        raise HTTPException(400, 'messages kosong')

    temperature = req.temperature if req.temperature is not None else server.TEMPERATURE
    max_tokens = req.max_tokens if req.max_tokens is not None else server.MAX_TOKENS
    system = server.current_system_prompt()

    # --- cache (hanya untuk non-streaming) ---
    ckey = gw.cache_key(server.MODEL, msgs, system)
    if not req.stream:
        cached = gw.cache_get(ckey)
        if cached is not None:
            return JSONResponse(json.loads(cached))

    prompt_chars = sum(len(m['content']) for m in msgs) + len(system)
    tokens_in_est = gw.estimate_tokens('x' * prompt_chars)

    if req.stream:
        async def gen():
            collected = []
            try:
                async for delta in server.STREAM_FNS[0](msgs, system, temperature, max_tokens):
                    collected.append(delta)
                    chunk = {
                        'id': 'chatcmpl-webai',
                        'object': 'chat.completion.chunk',
                        'created': int(time.time()),
                        'model': server.MODEL,
                        'choices': [{'index': 0, 'delta': {'content': delta}, 'finish_reason': None}],
                    }
                    yield 'data: ' + json.dumps(chunk, ensure_ascii=False) + '\n\n'
            except Exception as e:
                err = {'error': {'message': server.friendly_error(str(e)), 'type': 'provider_error'}}
                yield 'data: ' + json.dumps(err, ensure_ascii=False) + '\n\n'
            finally:
                full = ''.join(collected)
                gw.record_usage(auth.get('key', ''), auth.get('name', 'anonymous'),
                                server.PROVIDER, server.MODEL, tokens_in_est, gw.estimate_tokens(full))
                yield 'data: [DONE]\n\n'
        return StreamingResponse(gen(), media_type='text/event-stream')

    # non-streaming
    collected = []
    try:
        async for delta in server.STREAM_FNS[0](msgs, system, temperature, max_tokens):
            collected.append(delta)
    except Exception as e:
        raise HTTPException(502, server.friendly_error(str(e)))

    content = ''.join(collected)
    tokens_out = gw.estimate_tokens(content)
    gw.record_usage(auth.get('key', ''), auth.get('name', 'anonymous'),
                    server.PROVIDER, server.MODEL, tokens_in_est, tokens_out)

    result = {
        'id': 'chatcmpl-webai',
        'object': 'chat.completion',
        'created': int(time.time()),
        'model': server.MODEL,
        'choices': [{'index': 0, 'message': {'role': 'assistant', 'content': content}, 'finish_reason': 'stop'}],
        'usage': {'prompt_tokens': tokens_in_est, 'completion_tokens': tokens_out,
                  'total_tokens': tokens_in_est + tokens_out},
    }
    gw.cache_set(ckey, json.dumps(result, ensure_ascii=False))
    return JSONResponse(result)
