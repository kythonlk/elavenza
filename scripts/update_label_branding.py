import base64
import glob
import os
import re
import xml.etree.ElementTree as ET

def update_labels():
    logo_path = 'public/images/australian-made-logo.png'
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo not found at {logo_path}")

    with open(logo_path, 'rb') as f:
        aus_b64 = base64.b64encode(f.read()).decode('utf-8')

    new_block = f'''    <!-- Australian Made & Authenticity Statement -->
    <g transform="translate(0, 465)">
      <rect x="0" y="0" width="265" height="155" rx="6" fill="#F4EFE6" stroke="#DDD4C5" stroke-width="1"/>
      <g transform="translate(14, 12)">
        <!-- Australian Made Official Kangaroo Logo -->
        <image href="data:image/png;base64,{aus_b64}" x="0" y="0" width="46" height="40" preserveAspectRatio="xMidYMid meet"/>
        <text x="54" y="17" class="sans-bold" font-size="11" fill="#2C4837">AUSTRALIAN MADE</text>
        <text x="54" y="33" class="sans-reg" font-size="9.5" fill="#5E584D">&amp; Bottled with Care</text>
      </g>
      <line x1="14" y1="58" x2="251" y2="58" stroke="#E3DCD0" stroke-width="1"/>
      <text x="14" y="78" class="sans-med" font-size="10.5" font-weight="bold" fill="#3D372E">Elavenza Wellness</text>
      <text x="14" y="95" class="sans-med" font-size="9.5" fill="#5E584D">ABN 48 447 602 072</text>
      <text x="14" y="112" class="sans-reg" font-size="9.5" fill="#665F52">Brisbane QLD 4051 • Australia</text>
      <text x="14" y="132" class="sans-bold" font-size="10" fill="#2C4837">www.elavenza.com.au</text>
    </g>'''

    pattern = re.compile(
        r'<!-- Australian Made & Authenticity Statement -->\s*<g transform="translate\(0, 480\)">.*?</g>',
        re.DOTALL
    )

    files = glob.glob('public/images/products/*-label.svg')
    print(f"Processing {len(files)} label SVG files...")
    
    updated_count = 0
    for fpath in sorted(files):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'Elavenza Wellness Pty Ltd' in content:
            content = pattern.sub(new_block.strip(), content)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
            print(f"✓ Updated from old details: {os.path.basename(fpath)}")
        elif 'ABN 48 447 602 072' in content:
            updated_count += 1
            print(f"✓ Already updated: {os.path.basename(fpath)}")
        else:
            print(f"⚠️ Unrecognized format: {os.path.basename(fpath)}")

    print(f"\nStatus: {updated_count}/{len(files)} product label SVGs have the new branding and ABN!")

if __name__ == '__main__':
    update_labels()
