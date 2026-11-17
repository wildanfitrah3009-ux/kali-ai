"""CLI manajemen API key untuk Web AI gateway.

Contoh:
    python manage_keys.py add --name alice --plan free --rpm 10
    python manage_keys.py list
    python manage_keys.py disable --name alice
    python manage_keys.py enable  --name alice
"""
import argparse
import json
from pathlib import Path

BASE = Path(__file__).parent
KEYS_PATH = BASE / 'api_keys.json'


def _load():
    try:
        return json.loads(KEYS_PATH.read_text(encoding='utf-8'))
    except Exception:
        return {'keys': []}


def _save(data):
    KEYS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')


def cmd_add(args):
    import gateway
    gateway.KEYS_PATH = KEYS_PATH
    entry = gateway.generate_key(args.name, args.plan, args.rpm)
    print('Key dibuat untuk', entry['name'])
    print('API key:', entry['key'])
    print('(Simpan baik-baik; tidak ditampilkan lagi.)')


def cmd_list(_args):
    data = _load()
    if not data.get('keys'):
        print('Belum ada key.')
        return
    print(f"{'name':20} {'plan':8} {'rpm':>4}  {'active':6}  key")
    for k in data['keys']:
        masked = k['key'][:12] + '...'
        print(f"{k.get('name',''):20} {k.get('plan',''):8} {k.get('rpm',0):>4}  {str(k.get('active',True)):6}  {masked}")


def _set_active(name, active):
    data = _load()
    found = False
    for k in data.get('keys', []):
        if k.get('name') == name:
            k['active'] = active
            found = True
    if not found:
        print('Tidak ada key dengan nama:', name)
        return
    _save(data)
    print(f"Key '{name}' -> active={active}")


def main():
    p = argparse.ArgumentParser(description='Manajemen API key Web AI')
    sub = p.add_subparsers(dest='cmd', required=True)

    a = sub.add_parser('add', help='buat key baru')
    a.add_argument('--name', required=True)
    a.add_argument('--plan', default='free')
    a.add_argument('--rpm', type=int, default=10)
    a.set_defaults(func=cmd_add)

    sub.add_parser('list', help='daftar key').set_defaults(func=cmd_list)

    d = sub.add_parser('disable', help='nonaktifkan key')
    d.add_argument('--name', required=True)
    d.set_defaults(func=lambda args: _set_active(args.name, False))

    e = sub.add_parser('enable', help='aktifkan key')
    e.add_argument('--name', required=True)
    e.set_defaults(func=lambda args: _set_active(args.name, True))

    args = p.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
