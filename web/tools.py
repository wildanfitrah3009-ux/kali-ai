"""Tool-calling aman (whitelist, hanya baca/hitung). Tidak mengeksekusi shell."""
import re
import ast
import datetime
import platform

# Daftar tool yang diizinkan beserta deskripsi untuk model
TOOLS_SPEC = [
    {
        'type': 'function',
        'function': {
            'name': 'calculate',
            'description': 'Hitung ekspresi matematika sederhana. Contoh: "2*(3+4)".',
            'parameters': {
                'type': 'object',
                'properties': {'expression': {'type': 'string'}},
                'required': ['expression'],
            },
        },
    },
    {
        'type': 'function',
        'function': {
            'name': 'current_time',
            'description': 'Ambil tanggal dan waktu saat ini (lokal server).',
            'parameters': {'type': 'object', 'properties': {}},
        },
    },
    {
        'type': 'function',
        'function': {
            'name': 'system_info',
            'description': 'Info ringkas sistem: OS, versi Python, arsitektur.',
            'parameters': {'type': 'object', 'properties': {}},
        },
    },
]

_ALLOWED_NODES = (
    ast.Expression, ast.BinOp, ast.UnaryOp, ast.Num, ast.Constant,
    ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow,
    ast.USub, ast.UAdd, ast.Load,
)


def _safe_eval(expr: str) -> str:
    expr = (expr or '').strip()
    if len(expr) > 200:
        return 'Ekspresi terlalu panjang.'
    if not re.fullmatch(r'[0-9+\-*/(). %]+', expr):
        return 'Ekspresi hanya boleh berisi angka dan operator.'
    try:
        tree = ast.parse(expr, mode='eval')
        for node in ast.walk(tree):
            if not isinstance(node, _ALLOWED_NODES):
                return 'Ekspresi tidak diizinkan.'
        return str(eval(compile(tree, '<calc>', 'eval'), {'__builtins__': {}}, {}))
    except Exception as e:
        return f'Gagal menghitung: {e}'


def run_tool(name: str, args: dict) -> str:
    args = args or {}
    if name == 'calculate':
        return _safe_eval(args.get('expression', ''))
    if name == 'current_time':
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if name == 'system_info':
        return f'OS: {platform.system()} {platform.release()}; Python: {platform.python_version()}; Arsitektur: {platform.machine()}'
    return f'Tool tidak dikenal: {name}'
