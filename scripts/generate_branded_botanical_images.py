import os
import io
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Load base logo
logo_raw = Image.open('public/images/elavenza-wellness-logo.png').convert('RGBA')

# Botanical theme configurations for each product
BOTANICAL_PROFILES = {
    # Essential Oils
    "lavender": {
        "color_accent": (142, 116, 172), # Lavender purple
        "bg_tone": (245, 240, 248),
        "botanical_symbol": "lavender",
        "bottle_style": "eo"
    },
    "tea-tree": {
        "color_accent": (62, 115, 82),   # Tea tree deep herbal green
        "bg_tone": (240, 246, 242),
        "botanical_symbol": "tea-tree",
        "bottle_style": "eo"
    },
    "sweet-orange": {
        "color_accent": (224, 122, 45),  # Citrus orange
        "bg_tone": (252, 245, 238),
        "botanical_symbol": "orange",
        "bottle_style": "eo"
    },
    "peppermint": {
        "color_accent": (42, 148, 105),  # Crisp spearmint green
        "bg_tone": (238, 248, 244),
        "botanical_symbol": "mint",
        "bottle_style": "eo"
    },
    "rosemary": {
        "color_accent": (78, 108, 62),   # Piney rosemary olive
        "bg_tone": (242, 246, 238),
        "botanical_symbol": "rosemary",
        "bottle_style": "eo"
    },
    "frankincense": {
        "color_accent": (196, 142, 42), # Golden amber resin
        "bg_tone": (250, 245, 235),
        "botanical_symbol": "resin",
        "bottle_style": "eo"
    },
    "eucalyptus": {
        "color_accent": (92, 138, 126),  # Silver blue-green gum
        "bg_tone": (238, 246, 244),
        "botanical_symbol": "eucalyptus",
        "bottle_style": "eo"
    },
    # Carrier Oils
    "jojoba": {
        "color_accent": (212, 154, 38),  # Warm golden jojoba wax
        "bg_tone": (252, 247, 236),
        "botanical_symbol": "jojoba",
        "bottle_style": "carrier"
    },
    "rosehip": {
        "color_accent": (175, 52, 48),   # Ruby wild rosehip red
        "bg_tone": (252, 240, 238),
        "botanical_symbol": "rosehip",
        "bottle_style": "carrier"
    },
    "sweet-almond": {
        "color_accent": (180, 136, 92),  # Almond nut warm brown
        "bg_tone": (250, 246, 240),
        "botanical_symbol": "almond",
        "bottle_style": "carrier"
    },
    "argan": {
        "color_accent": (194, 130, 40),  # Moroccan golden argan
        "bg_tone": (250, 244, 234),
        "botanical_symbol": "argan",
        "bottle_style": "carrier"
    },
    "macadamia": {
        "color_accent": (170, 145, 105), # Macadamia cream nut
        "bg_tone": (248, 246, 240),
        "botanical_symbol": "macadamia",
        "bottle_style": "carrier"
    },
    "apricot": {
        "color_accent": (228, 140, 68),  # Golden apricot
        "bg_tone": (252, 246, 238),
        "botanical_symbol": "apricot",
        "bottle_style": "carrier"
    },
    "coconut": {
        "color_accent": (140, 125, 110), # Coconut husk brown
        "bg_tone": (246, 248, 248),
        "botanical_symbol": "coconut",
        "bottle_style": "carrier"
    },
}

# Available AI-generated photographic studio bases with real botanicals
PHOTO_BASES = {
    "lavender": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_lavender_botanical_1789476448659.jpg',
    "sweet-orange": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_sweet_orange_botanical_1789476693415.jpg',
    "peppermint": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_peppermint_botanical_1789476726102.jpg',
    "tea-tree": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_teatree_botanical_1789476768264.jpg',
    "rosemary": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_rosemary_botanical_1789476816193.jpg',
    "frankincense": '/home/kythonlk/.gemini/antigravity-ide/brain/6cdcce4f-1b5f-4470-8cd7-f174e2e2c75f/prod_frankincense_botanical_1789476860637.jpg',
    # Original studio photographs for other botanicals
    "eucalyptus": 'public/images/prod-eucalyptus.jpg',
    "jojoba": 'public/images/prod-jojoba.jpg',
    "rosehip": 'public/images/prod-rosehip.jpg',
    "sweet-almond": 'public/images/prod-almond.jpg',
    # Default studio bases
    "default_eo": 'public/images/test_eo_bottle_1789475181.jpg',
    "default_carrier": 'public/images/test_carrier_bottle_1789475270.jpg',
}

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())
from generate_all import PRODUCTS

def get_base_for_slug(slug, category_id):
    for key in ["lavender", "sweet-orange", "peppermint", "tea-tree", "rosemary", "frankincense", "eucalyptus", "jojoba", "rosehip", "sweet-almond"]:
        if key in slug:
            if key in PHOTO_BASES and os.path.exists(PHOTO_BASES[key]):
                return PHOTO_BASES[key], key
    # Fallback to category defaults
    if category_id == 6:
        return PHOTO_BASES["default_eo"], "eo"
    else:
        return PHOTO_BASES["default_carrier"], "carrier"

def get_botanical_key(slug):
    for key in ["lavender", "sweet-orange", "orange", "peppermint", "tea-tree", "rosemary", "frankincense", "eucalyptus", "jojoba", "rosehip", "sweet-almond", "almond", "argan", "macadamia", "apricot", "coconut"]:
        if key in slug:
            if key == "orange": return "sweet-orange"
            if key == "almond": return "sweet-almond"
            return key
    return "lavender"

def create_branded_product_image(prod):
    slug = prod["slug"]
    name = prod["name"]
    botanical = prod.get("botanical", "")
    is_organic = prod.get("is_organic", False)
    cat_id = prod.get("category_id", 6)
    vol = prod.get("volume_ml", 15)
    
    base_path, base_key = get_base_for_slug(slug, cat_id)
    bot_key = get_botanical_key(slug)
    profile = BOTANICAL_PROFILES.get(bot_key, BOTANICAL_PROFILES["lavender"])
    
    base_img = Image.open(base_path).convert("RGBA")
    if base_img.size != (1024, 1024):
        base_img = base_img.resize((1024, 1024), Image.Resampling.LANCZOS)
        
    # Determine label coordinates depending on the photo base
    if base_key in ["sweet-orange", "peppermint", "tea-tree", "rosemary", "frankincense", "lavender"]:
        # Centered amber bottle in AI studio photos
        label_w = 200
        label_h = 240
        label_x = 512 - label_w // 2
        label_y = 485
    elif base_key in ["eucalyptus", "jojoba", "rosehip", "sweet-almond"]:
        label_w = 200
        label_h = 240
        label_x = 512 - label_w // 2
        label_y = 510
    elif cat_id == 7:
        label_w = 210
        label_h = 270
        label_x = 522 - label_w // 2
        label_y = 525
    else:
        label_w = 195
        label_h = 240
        label_x = 517 - label_w // 2
        label_y = 538

    # Render label at 3x resolution for extreme sharpness
    scale = 3
    w, h = label_w * scale, label_h * scale
    
    # Cream apothecary paper texture background
    label = Image.new("RGBA", (w, h), (252, 250, 245, 252))
    draw = ImageDraw.Draw(label)
    
    accent_rgb = profile["color_accent"]
    border_col = (44, 72, 55, 200) if is_organic else (55, 50, 45, 200)
    
    # Luxury double border
    draw.rectangle([(6*scale, 6*scale), (w - 6*scale, h - 6*scale)], outline=border_col, width=int(1.2*scale))
    draw.rectangle([(9*scale, 9*scale), (w - 9*scale, h - 9*scale)], outline=(195, 185, 170, 160), width=int(0.8*scale))
    
    # Place Real Elavenza Brand Logo
    target_logo_w = int(w * 0.72)
    logo_ratio = logo_raw.height / logo_raw.width
    target_logo_h = int(target_logo_w * logo_ratio)
    logo_resized = logo_raw.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)
    logo_x = (w - target_logo_w) // 2
    logo_y = int(14 * scale)
    label.paste(logo_resized, (logo_x, logo_y), logo_resized)
    
    # Fonts
    font_bold_title = ImageFont.truetype('/usr/share/fonts/liberation-serif-fonts/LiberationSerif-Bold.ttf', int(13 * scale))
    font_botanical = ImageFont.truetype('/usr/share/fonts/liberation-serif-fonts/LiberationSerif-Italic.ttf', int(9.5 * scale))
    font_badge = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Bold.ttf', int(7.5 * scale))
    font_sub = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Regular.ttf', int(7.0 * scale))
    font_vol = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Bold.ttf', int(8.0 * scale))

    # Badge Pill (Certified Organic or 100% Pure & Natural)
    badge_y = logo_y + target_logo_h + int(5 * scale)
    badge_w = int(105 * scale)
    badge_h = int(14 * scale)
    badge_x = (w - badge_w) // 2
    
    if is_organic:
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)], radius=int(6*scale), fill=(44, 72, 55, 235))
        draw.text((w // 2, badge_y + badge_h // 2), "CERTIFIED ORGANIC", fill=(255, 255, 255), font=font_badge, anchor="mm")
    else:
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)], radius=int(6*scale), fill=(65, 60, 55, 225))
        draw.text((w // 2, badge_y + badge_h // 2), "100% PURE & NATURAL", fill=(255, 255, 255), font=font_badge, anchor="mm")

    # Divider
    div_y = badge_y + badge_h + int(6 * scale)
    draw.line([(int(w * 0.22), div_y), (int(w * 0.78), div_y)], fill=(195, 185, 170, 200), width=int(1*scale))

    # Clean short title
    clean_name = name
    for prefix in ["Certified Organic ", "Pure Australian ", "Pure "]:
        if clean_name.startswith(prefix):
            clean_name = clean_name[len(prefix):]
    clean_name = clean_name.replace(" Essential Oil", "").replace(" Carrier Oil", "")
    
    name_y = div_y + int(14 * scale)
    if len(clean_name) > 16:
        words = clean_name.split()
        half = len(words) // 2
        line1 = " ".join(words[:half]).upper()
        line2 = " ".join(words[half:]).upper()
        draw.text((w // 2, name_y), line1, fill=(28, 33, 28), font=font_bold_title, anchor="mm")
        draw.text((w // 2, name_y + int(13 * scale)), line2, fill=(28, 33, 28), font=font_bold_title, anchor="mm")
        botanical_y = name_y + int(27 * scale)
    else:
        draw.text((w // 2, name_y), clean_name.upper(), fill=(28, 33, 28), font=font_bold_title, anchor="mm")
        botanical_y = name_y + int(14 * scale)

    # Botanical Name
    draw.text((w // 2, botanical_y), botanical, fill=(55, 70, 60), font=font_botanical, anchor="mm")

    # Category note
    cat_note = "Therapeutic Grade Oil" if cat_id == 6 else "Cold-Pressed Carrier Oil"
    draw.text((w // 2, botanical_y + int(12 * scale)), cat_note, fill=(100, 95, 90), font=font_sub, anchor="mm")

    # Volume at bottom
    vol_str = f"{vol} mL • {round(vol * 0.033814, 1)} fl. oz."
    draw.line([(int(w * 0.3), h - int(24 * scale)), (int(w * 0.7), h - int(24 * scale))], fill=(200, 190, 175, 180), width=int(0.8*scale))
    draw.text((w // 2, h - int(14 * scale)), vol_str, fill=(40, 40, 40), font=font_vol, anchor="mm")

    # High quality LANCZOS resize
    final_label = label.resize((label_w, label_h), Image.Resampling.LANCZOS)

    # Shading vignette for realistic bottle curvature
    curv = Image.new("RGBA", (label_w, label_h), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(curv)
    for x in range(16):
        alpha = int((1.0 - (x / 16.0)) * 55)
        c_draw.line([(x, 0), (x, label_h)], fill=(0, 0, 0, alpha))
        c_draw.line([(label_w - 1 - x, 0), (label_w - 1 - x, label_h)], fill=(0, 0, 0, alpha))
    final_label = Image.alpha_composite(final_label, curv)

    # Composite onto the photo base
    result = base_img.copy()
    result.paste(final_label, (label_x, label_y), final_label)
    
    # Save to public/images/products/{slug}.jpg
    out_path = f"public/images/products/{slug}.jpg"
    result.convert("RGB").save(out_path, "JPEG", quality=92, optimize=True)
    print(f"Branded image generated for {slug} using {base_key} base.")

def main():
    print(f"Generating branded product images for {len(PRODUCTS)} products...")
    for p in PRODUCTS:
        create_branded_product_image(p)
    print("All 25 product images successfully branded with Elavenza logo!")

if __name__ == "__main__":
    main()
