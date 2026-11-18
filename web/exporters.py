"""Ekspor konten Markdown/teks ke Word (.docx), Excel (.xlsx), dan PowerPoint (.pptx).

Word mengikuti standar laporan: A4, margin 4-4-3-3, Times New Roman 12pt,
spasi 1.5, justify, indentasi awal paragraf, heading 14pt bold.
"""

import io
import re


def _clean(text: str) -> str:
    """Bersihkan sisa penanda markdown/HTML agar teks rapi."""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'^\s*```[\w-]*\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*---\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*#{1,6}\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'__(.+?)__', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'`(.+?)`', r'\1', text)
    text = re.sub(r'\[(.+?)\]\((.+?)\)', r'\1 (\2)', text)
    return text.strip()


def _unwrap(raw: str) -> str:
    """Buka jika seluruh konten dibungkus satu blok kode ```...```."""
    s = (raw or '').strip()
    m = re.match(r'^```[\w-]*\n([\s\S]*?)\n```$', s)
    return m.group(1) if m else raw


def _parse_blocks(md: str):
    """Pecah markdown menjadi blok: h, li, code, p, table."""
    md = _unwrap(md)
    blocks = []
    lines = (md or '').splitlines()
    in_code = False
    code_buf = []
    para_buf = []

    def flush_para():
        if para_buf:
            txt = '\n'.join(para_buf).strip()
            if txt:
                blocks.append(('p', txt))
            para_buf.clear()

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith('```'):
            if in_code:
                blocks.append(('code', '\n'.join(code_buf)))
                code_buf = []
                in_code = False
            else:
                flush_para()
                in_code = True
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue
        if not stripped:
            flush_para()
            i += 1
            continue

        m = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        if m:
            flush_para()
            blocks.append(('h', (len(m.group(1)), _clean(m.group(2)))))
            i += 1
            continue

        # tabel HTML <table>...</table>
        if stripped.lower().startswith('<table'):
            flush_para()
            html_chunk = stripped
            while '</table>' not in html_chunk.lower() and i + 1 < len(lines):
                i += 1
                html_chunk += '\n' + lines[i].strip()
            rows = []
            for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', html_chunk, flags=re.I | re.S):
                cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, flags=re.I | re.S)
                cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
                if cells:
                    rows.append([_clean(c) for c in cells])
            if rows:
                blocks.append(('table', rows))
            i += 1
            continue

        # tabel sederhana | a | b |
        if stripped.startswith('|') and stripped.endswith('|'):
            flush_para()
            table_rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{2,}:?', c) for c in cells if c):
                    table_rows.append([_clean(c) for c in cells])
                i += 1
            if table_rows:
                blocks.append(('table', table_rows))
            continue

        # heading tanpa spasi (mis. "##BAB I")
        m2 = re.match(r'^(#{1,6})([^#\s].*)$', stripped)
        if m2:
            flush_para()
            blocks.append(('h', (len(m2.group(1)), _clean(m2.group(2)))))
            i += 1
            continue

        m = re.match(r'^\s*[-*+]\s+(.*)$', stripped)
        if m:
            flush_para()
            blocks.append(('li', _clean(m.group(1))))
            i += 1
            continue

        para_buf.append(stripped)
        i += 1

    if in_code and code_buf:
        blocks.append(('code', '\n'.join(code_buf)))
    flush_para()
    return blocks


def to_docx(md: str, title: str = 'Laporan Kali AI') -> bytes:
    from docx import Document
    from docx.shared import Pt, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
    from docx.enum.section import WD_ORIENT
    from docx.oxml.ns import qn

    doc = Document()

    # --- Page setup: A4, margin 4-4-3-3 ---
    section = doc.sections[0]
    section.orientation = WD_ORIENT.PORTRAIT
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(4)
    section.left_margin = Cm(4)
    section.bottom_margin = Cm(3)
    section.right_margin = Cm(3)

    # --- Default style: Times New Roman 12pt, spasi 1.5, justify ---
    normal = doc.styles['Normal']
    normal.font.name = 'Times New Roman'
    normal.font.size = Pt(12)
    normal.element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')
    pf = normal.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf.space_after = Pt(0)

    def add_para(text, bold=False, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, indent=True, spacing=1.5):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.line_spacing = spacing
        if indent:
            p.paragraph_format.first_line_indent = Cm(1.27)
        r = p.add_run(text)
        r.bold = bold
        r.font.size = Pt(size)
        r.font.name = 'Times New Roman'
        return p

    # Judul laporan (center, bold, 14)
    add_para(_clean(title), bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, indent=False)
    doc.add_paragraph()

    BAB_KEYS = ('BAB ', 'KATA PENGANTAR', 'DAFTAR ISI', 'DAFTAR PUSTAKA', 'LAMPIRAN')

    for kind, val in _parse_blocks(md):
        if kind == 'h':
            level, text = val
            up = text.upper().strip()
            is_major = any(up.startswith(k) for k in BAB_KEYS)
            if is_major:
                doc.add_page_break()
                add_para(text, bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, indent=False, spacing=1.5)
            else:
                size = 14 if level <= 2 else 12
                add_para(text, bold=True, size=size, align=WD_ALIGN_PARAGRAPH.LEFT, indent=False, spacing=1.5)
        elif kind == 'li':
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.line_spacing = 1.5
            r = p.add_run(val)
            r.font.size = Pt(12)
            r.font.name = 'Times New Roman'
        elif kind == 'code':
            p = doc.add_paragraph()
            p.paragraph_format.line_spacing = 1.0
            r = p.add_run(val)
            r.font.name = 'Courier New'
            r.font.size = Pt(10)
        elif kind == 'table':
            rows = val
            cols = max(len(r) for r in rows)
            table = doc.add_table(rows=len(rows), cols=cols)
            table.style = 'Table Grid'
            for ri, row in enumerate(rows):
                for ci in range(cols):
                    cell = table.cell(ri, ci)
                    cell.text = row[ci] if ci < len(row) else ''
                    for para in cell.paragraphs:
                        para.alignment = WD_ALIGN_PARAGRAPH.LEFT
                        for run in para.runs:
                            run.font.name = 'Times New Roman'
                            run.font.size = Pt(11)
                            if ri == 0:
                                run.bold = True
            doc.add_paragraph()
        else:
            add_para(_clean(val))

    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def to_xlsx(md: str, title: str = 'Data') -> bytes:
    from openpyxl import Workbook
    from openpyxl.styles import Font

    wb = Workbook()
    ws = wb.active
    ws.title = 'Sheet1'
    ws.append([_clean(title)])
    ws['A1'].font = Font(bold=True, size=14)
    ws.append([])
    for kind, val in _parse_blocks(md):
        if kind == 'h':
            ws.append([val[1]])
            ws.cell(row=ws.max_row, column=1).font = Font(bold=True)
        elif kind == 'li':
            ws.append(['\u2022 ' + val])
        elif kind == 'table':
            for row in val:
                ws.append(row)
        elif kind == 'code':
            for ln in val.splitlines():
                ws.append([ln])
        else:
            ws.append([_clean(val)])
    ws.column_dimensions['A'].width = 80
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


def to_pptx(md: str, title: str = 'Presentasi Kali AI') -> bytes:
    from pptx import Presentation
    from pptx.util import Pt

    prs = Presentation()
    s = prs.slides.add_slide(prs.slide_layouts[0])
    s.shapes.title.text = _clean(title)

    blocks = _parse_blocks(md)
    slide = None
    body = None

    def new_content_slide(heading):
        sl = prs.slides.add_slide(prs.slide_layouts[1])
        sl.shapes.title.text = _clean(heading)
        tf = sl.placeholders[1].text_frame
        tf.clear()
        return sl, tf

    for kind, val in blocks:
        if kind == 'h' and val[0] <= 2:
            slide, body = new_content_slide(val[1])
            continue
        if slide is None:
            slide, body = new_content_slide(title)
        if kind == 'h':
            text = val[1]
        elif kind == 'li':
            text = '\u2022 ' + val
        elif kind == 'table':
            text = ' | '.join(val[0]) if val else ''
        elif kind == 'code':
            text = val.splitlines()[0] if val else ''
        else:
            text = _clean(val)
        if not text:
            continue
        if body.paragraphs[0].text == '' and len(body.paragraphs) == 1:
            p = body.paragraphs[0]
        else:
            p = body.add_paragraph()
        p.text = str(text)
        p.font.size = Pt(16 if kind != 'code' else 12)

    buf = io.BytesIO()
    prs.save(buf)
    return buf.getvalue()
