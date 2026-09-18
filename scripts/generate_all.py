import os
import re
import json
import io
import base64
import psycopg2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PRODUCTS = [
    # --- ESSENTIAL OILS (ORGANIC) ---
    {
        "id_code": 1,
        "name": "Certified Organic Lavender Essential Oil",
        "slug": "organic-lavender-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Lavandula angustifolia",
        "plant_part": "Flowering Tops",
        "method": "Steam Distillation",
        "origin": "Provence, France",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 26.00,
        "compare_price": 32.00,
        "sku": "ELV-EO-LAV-ORG",
        "stock": 180,
        "featured": True,
        "short_desc": "Certified organic French alpine lavender oil. Renowned for soothing restlessness and inducing deep botanical calm.",
        "description": "Our Certified Organic Lavender Essential Oil (Lavandula angustifolia) is steam-distilled from high-altitude French alpine lavender blossoms grown organically without synthetic pesticides.\n\nAromatic Profile:\nRich, sweet herbaceous floral with subtle honeyed undertones.\n\nKey Ritual Benefits:\n• Eases evening tension and prepares the mind for restorative sleep\n• Calms skin redness when blended into a nourishing carrier\n• Purifies ambient indoor air with timeless floral serenity\n\n100% ACO Certified Organic | Pure Therapeutic Grade",
        "ingredients": "100% Certified Organic Lavandula angustifolia (Lavender) Flower Oil.",
        "directions": "Diffuser: Add 5–8 drops to water chamber. Topical: Dilute 2–3 drops per 10mL of carrier oil. Bath: Disperse 4 drops in 1 tbsp carrier oil or Epsom salts.",
        "cautions": "For external use only. Dilute before skin application. Avoid eyes and broken skin. Keep out of reach of children. Store below 30°C away from direct sunlight.",
        "bottle_type": "eo"
    },
    {
        "id_code": 2,
        "name": "Certified Organic Tea Tree Essential Oil",
        "slug": "organic-tea-tree-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Melaleuca alternifolia",
        "plant_part": "Leaves & Twigs",
        "method": "Steam Distillation",
        "origin": "Northern Rivers, NSW, Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 22.00,
        "compare_price": 28.00,
        "sku": "ELV-EO-TEA-ORG",
        "stock": 140,
        "featured": True,
        "short_desc": "Certified organic native Australian tea tree oil. Clinically treasured for purifying and clarifying rituals.",
        "description": "Steam-distilled from certified organic Melaleuca alternifolia trees indigenous to the pristine Northern Rivers of NSW. Rich in terpinen-4-ol for supreme clarifying effectiveness.\n\nAromatic Profile:\nCrisp, invigorating, green-medicinal with clean camphoraceous freshness.\n\nKey Ritual Benefits:\n• Cleanses blemish-prone complexions and clarifies the skin\n• Supports a hygienic home environment when diffused or added to green cleaning\n• Clears and enlivens congested breathing spaces\n\n100% ACO Certified Organic | Australian Grown",
        "ingredients": "100% Certified Organic Melaleuca alternifolia (Tea Tree) Leaf Oil.",
        "directions": "Diffuser: Add 4–6 drops to ultrasonic diffuser. Clarifying Touch: Dilute 1 drop in 5mL jojoba and dab onto target areas. Hair & Scalp: Add 2 drops to shampoo.",
        "cautions": "For external use only. Never apply undiluted to sensitive skin. Keep away from pets and children. Store below 30°C.",
        "bottle_type": "eo"
    },
    {
        "id_code": 3,
        "name": "Certified Organic Sweet Orange Essential Oil",
        "slug": "organic-sweet-orange-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Citrus sinensis",
        "plant_part": "Fresh Fruit Rind",
        "method": "Cold Pressed",
        "origin": "Riverina, Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 19.00,
        "compare_price": 24.00,
        "sku": "ELV-EO-ORA-ORG",
        "stock": 210,
        "featured": False,
        "short_desc": "Cold-pressed organic Australian sweet orange peel. Bursting with uplifting sunshine and joyful citrus warmth.",
        "description": "Expressed from the radiant rinds of certified organic sweet oranges grown in sun-drenched Australian groves. Rich in natural d-limonene, delivering an immediate wave of happiness and vitality.\n\nAromatic Profile:\nBright, effervescent, sweet citrus zest with juicy undertones.\n\nKey Ritual Benefits:\n• Instantly lifts spirits and dispels sluggish afternoon moods\n• Freshens kitchen and living spaces naturally\n• Blends harmoniously with lavender, frankincense, and rosemary\n\n100% ACO Certified Organic | Cold-Pressed",
        "ingredients": "100% Certified Organic Citrus sinensis (Sweet Orange) Peel Oil.",
        "directions": "Diffuser: Add 6–8 drops for a vibrant home ambiance. Linen Freshener: Add 5 drops to 50mL distilled water in a spray bottle. Blending: Pairs wonderfully with florals and spices.",
        "cautions": "For external use only. Citrus oils may be phototoxic; avoid direct sunlight on skin for 12 hours after application. Keep out of reach of children.",
        "bottle_type": "eo"
    },
    {
        "id_code": 4,
        "name": "Certified Organic Peppermint Essential Oil",
        "slug": "organic-peppermint-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Mentha arvensis",
        "plant_part": "Aerial Leaves",
        "method": "Steam Distillation",
        "origin": "India / Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 24.00,
        "compare_price": 29.00,
        "sku": "ELV-EO-PEP-ORG",
        "stock": 160,
        "featured": False,
        "short_desc": "Certified organic wild mint with potent natural menthol. Intensely revitalizing, cooling, and mentally focusing.",
        "description": "Steam-distilled from organic Mentha arvensis leaves, this high-menthol peppermint oil provides an invigorating icy-hot sensation that clears brain fog and renews physical alertness.\n\nAromatic Profile:\nIntense, crisp, piercingly clean sweet mint with cooling herbal depth.\n\nKey Ritual Benefits:\n• Stimulates cognitive focus and clears midday fatigue\n• Delivers a refreshing cooling sensation to tight temples and neck (when diluted)\n• Awakens respiration and sensory clarity\n\n100% ACO Certified Organic | Pure Therapeutic Grade",
        "ingredients": "100% Certified Organic Mentha arvensis (Wild Mint) Leaf Oil.",
        "directions": "Diffuser: Add 3–5 drops during study or workday focus. Temple Roll-On: Dilute 1 drop in 10mL carrier oil and massage onto temples and back of neck.",
        "cautions": "For external use only. Avoid eye area and mucous membranes. Do not use on infants or small children. Store in a cool, dark location.",
        "bottle_type": "eo"
    },
    {
        "id_code": 5,
        "name": "Certified Organic Rosemary Essential Oil",
        "slug": "organic-rosemary-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Rosmarinus officinalis",
        "plant_part": "Leaves & Sprigs",
        "method": "Steam Distillation",
        "origin": "Mediterranean / Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 25.00,
        "compare_price": 30.00,
        "sku": "ELV-EO-ROS-ORG",
        "stock": 190,
        "featured": True,
        "short_desc": "Certified organic cineole-rich rosemary. Renowned botanical for hair wellness, scalp vitality, and memory focus.",
        "description": "Our Certified Organic Rosemary Oil (Rosmarinus officinalis ct. cineole) is distilled from organic Mediterranean sprigs. Known since antiquity as the herb of remembrance, it sharpens the intellect while strengthening hair follicles.\n\nAromatic Profile:\nHerbaceous, woody, camphoraceous with fresh pine and resin notes.\n\nKey Ritual Benefits:\n• Massaged into scalp with jojoba to stimulate hair thickness and root health\n• Diffused in work areas to enhance memory recall and sustained attention\n• Relieves post-workout muscle stiffness in restorative body rubs\n\n100% ACO Certified Organic | Steam Distilled",
        "ingredients": "100% Certified Organic Rosmarinus officinalis (Rosemary) Leaf Oil.",
        "directions": "Scalp Ritual: Mix 3–4 drops into 15mL golden jojoba oil; massage into scalp 20 min before washing. Diffuser: Add 5–6 drops during work or meditation.",
        "cautions": "For external use only. Consult healthcare professional if pregnant or having epilepsy. Keep out of reach of children.",
        "bottle_type": "eo"
    },
    {
        "id_code": 6,
        "name": "Certified Organic Frankincense Olibanum Essential Oil",
        "slug": "organic-frankincense-essential-oil",
        "category_id": 6,
        "is_organic": True,
        "botanical": "Boswellia carterii",
        "plant_part": "Wild Tree Resin",
        "method": "Hydro-Distillation",
        "origin": "Somaliland",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 38.00,
        "compare_price": 46.00,
        "sku": "ELV-EO-FRA-ORG",
        "stock": 95,
        "featured": True,
        "short_desc": "Rare certified organic wild frankincense tears. The sacred king of oils for meditation, stillness, and radiant skin.",
        "description": "Ethically harvested from wild organic Boswellia carterii trees in Somaliland, where the precious resin tears are gently hydro-distilled into pure olibanum oil. Prized for millennia to deepen breath and restore graceful skin radiance.\n\nAromatic Profile:\nResinous, warm balsamic, woody-citrus with profound meditative stillness.\n\nKey Ritual Benefits:\n• Enhances slow, deep diaphragmatic breathing in yoga and contemplation\n• Supports cell rejuvenation and softens fine lines when blended into face oils\n• Brings emotional grounding in times of stress or transitions\n\n100% ACO Certified Organic | Sustainably Wild-Harvested",
        "ingredients": "100% Certified Organic Boswellia carterii (Frankincense) Resin Oil.",
        "directions": "Meditation Diffuser: Add 5 drops to your ceramic diffuser. Ageless Face Elixir: Blend 2 drops with 10mL rosehip seed oil for a nightly restorative glow.",
        "cautions": "For external use only. Perform patch test. Avoid eyes. Store in amber bottle below 30°C away from heat.",
        "bottle_type": "eo"
    },

    # --- ESSENTIAL OILS (100% PURE & NATURAL) ---
    {
        "id_code": 7,
        "name": "Pure Lavender Essential Oil",
        "slug": "pure-lavender-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Lavandula angustifolia",
        "plant_part": "Flowering Tops",
        "method": "Steam Distillation",
        "origin": "France",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 18.00,
        "compare_price": 22.00,
        "sku": "ELV-EO-LAV-NAT",
        "stock": 250,
        "featured": False,
        "short_desc": "100% pure botanical lavender oil. An everyday apothecary essential for peace, restful nights, and gentle relaxation.",
        "description": "Pure steam-distilled French alpine lavender (Lavandula angustifolia) with zero synthetic additives, fillers, or artificial extenders. The timeless staple for any natural wellness home.\n\nAromatic Profile:\nSoft, floral, sweet herbal with a clean rounded finish.\n\nKey Ritual Benefits:\n• Calms sensory overstimulation after demanding days\n• Perfect pillow mist companion for peaceful slumber\n• Soothes minor skin irritations and insect bites when properly diluted",
        "ingredients": "100% Pure Lavandula angustifolia (Lavender) Flower Oil.",
        "directions": "Diffuser: 5–8 drops in water chamber. Pillow Mist: 10 drops in 50mL witch hazel spray bottle. Skin: Dilute 2 drops in 10mL carrier oil.",
        "cautions": "External use only. Dilute before skin application. Store cool and dark.",
        "bottle_type": "eo"
    },
    {
        "id_code": 8,
        "name": "Pure Australian Tea Tree Essential Oil",
        "slug": "pure-tea-tree-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Melaleuca alternifolia",
        "plant_part": "Leaves",
        "method": "Steam Distillation",
        "origin": "New South Wales, Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 16.00,
        "compare_price": 20.00,
        "sku": "ELV-EO-TEA-NAT",
        "stock": 220,
        "featured": False,
        "short_desc": "100% pure Australian tea tree oil. Nature's premier clarifying defense for skin, scalp, and household rituals.",
        "description": "Native to the coastal tea tree wetlands of northeastern New South Wales. Steam-distilled to Australian therapeutic standards with minimum 38% terpinen-4-ol.\n\nAromatic Profile:\nSharp, herbaceous, clean medicinal camphor.\n\nKey Ritual Benefits:\n• Clarifies blemishes and excess oil naturally\n• Ideal for toenail care and scalp purifying rinses\n• Excellent eco-friendly disinfectant for laundry and surfaces",
        "ingredients": "100% Pure Melaleuca alternifolia (Tea Tree) Leaf Oil.",
        "directions": "Diffuser: 4–6 drops. Spot application: Dilute in carrier oil (1:10 ratio). Foot soak: 5 drops in warm foot bath with Epsom salts.",
        "cautions": "External use only. Toxic to pets if ingested. Keep out of reach of children.",
        "bottle_type": "eo"
    },
    {
        "id_code": 9,
        "name": "Pure Sweet Orange Essential Oil",
        "slug": "pure-sweet-orange-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Citrus sinensis",
        "plant_part": "Fruit Rind",
        "method": "Cold Pressed",
        "origin": "Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 15.00,
        "compare_price": 18.00,
        "sku": "ELV-EO-ORA-NAT",
        "stock": 260,
        "featured": False,
        "short_desc": "100% pure cold-expressed sweet orange. Radiates warmth, bright joy, and vibrant citrus optimism.",
        "description": "Cold-pressed directly from fresh Australian sweet orange peel. Bursting with natural limonene, it neutralizes stale odors and creates an inviting, sunny ambiance in your home.\n\nAromatic Profile:\nSweet, cheerful, freshly peeled orange zest.\n\nKey Ritual Benefits:\n• Transforms dull moods into energized optimism\n• Beloved by children and adults alike for gentle diffuser diffusion\n• Pairs seamlessly with wood and spice notes",
        "ingredients": "100% Pure Citrus sinensis (Sweet Orange) Peel Oil.",
        "directions": "Diffuser: 6–8 drops in diffuser. Room spray: 15 drops in 100mL water.",
        "cautions": "External use only. Avoid direct UV sunlight on applied skin for 12 hours.",
        "bottle_type": "eo"
    },
    {
        "id_code": 10,
        "name": "Pure Peppermint Essential Oil",
        "slug": "pure-peppermint-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Mentha piperita",
        "plant_part": "Flowering Herb",
        "method": "Steam Distillation",
        "origin": "USA / Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 17.00,
        "compare_price": 21.00,
        "sku": "ELV-EO-PEP-NAT",
        "stock": 200,
        "featured": False,
        "short_desc": "100% pure Mentha piperita peppermint. An icy-fresh botanical wake-up call for alertness and easy breathing.",
        "description": "Distilled from true Mentha piperita, yielding an exceptionally clean menthol profile that awakens the mind, relieves tension, and leaves the room smelling vividly clean.\n\nAromatic Profile:\nSharp, sweet, intensely refreshing peppermint.\n\nKey Ritual Benefits:\n• Fast relief from mental sluggishness and fatigue\n• Delivers a bracing cool tingling sensation when massaged into pulse points\n• Opens airways during seasonal changes",
        "ingredients": "100% Pure Mentha piperita (Peppermint) Oil.",
        "directions": "Diffuser: 3–5 drops. Pulse points: Dilute 1 drop in 10mL carrier oil.",
        "cautions": "External use only. Do not apply near eyes or to babies. Store below 30°C.",
        "bottle_type": "eo"
    },
    {
        "id_code": 11,
        "name": "Pure Rosemary Essential Oil",
        "slug": "pure-rosemary-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Rosmarinus officinalis",
        "plant_part": "Leaves",
        "method": "Steam Distillation",
        "origin": "Spain",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 18.00,
        "compare_price": 22.00,
        "sku": "ELV-EO-ROS-NAT",
        "stock": 210,
        "featured": False,
        "short_desc": "100% pure rosemary oil. Celebrated for hair growth rituals, mental focus, and stimulating wellness massages.",
        "description": "Pure steam-distilled Mediterranean rosemary sprigs. High in 1,8-cineole and alpha-pinene, creating a brisk herbaceous aura that clears the thoughts and enlivens tired muscles.\n\nAromatic Profile:\nHerbaceous, crisp, resinous pine with refreshing wood notes.\n\nKey Ritual Benefits:\n• Traditional scalp oiling to support thick, luscious hair\n• Diffused in offices or study spaces to maintain sharpness and retention\n• Invigorating body oil component for active lifestyles",
        "ingredients": "100% Pure Rosmarinus officinalis (Rosemary) Leaf Oil.",
        "directions": "Scalp Oil: 4 drops in 15mL carrier oil. Diffuser: 5–7 drops for sharp mental clarity.",
        "cautions": "External use only. Dilute before skin application. Store in amber glass.",
        "bottle_type": "eo"
    },
    {
        "id_code": 12,
        "name": "Pure Frankincense Olibanum Essential Oil",
        "slug": "pure-frankincense-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Boswellia carterii",
        "plant_part": "Resin Tears",
        "method": "Steam Distillation",
        "origin": "Oman",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 29.00,
        "compare_price": 35.00,
        "sku": "ELV-EO-FRA-NAT",
        "stock": 130,
        "featured": False,
        "short_desc": "100% pure olibanum resin oil. An ancient restorative aromatic for grounded presence and glowing skincare.",
        "description": "Distilled from natural tears of the Boswellia carterii tree. An opulent, meditative essential oil that fosters inner calm, emotional balance, and skin resilience.\n\nAromatic Profile:\nRich, resinous balsamic, sweet woody spice with citrus nuance.\n\nKey Ritual Benefits:\n• Quietens busy internal dialogue during evening wind-down\n• Enhances premium face serums for mature or tired skin\n• Promotes deep, tranquil respiration",
        "ingredients": "100% Pure Boswellia carterii (Frankincense) Resin Oil.",
        "directions": "Diffuser: 5 drops during yoga or meditation. Skin: 2 drops in nightly face oil.",
        "cautions": "External use only. Dilute properly. Store away from heat.",
        "bottle_type": "eo"
    },
    {
        "id_code": 13,
        "name": "Pure Eucalyptus Radiata Essential Oil",
        "slug": "pure-eucalyptus-radiata-essential-oil",
        "category_id": 6,
        "is_organic": False,
        "botanical": "Eucalyptus radiata",
        "plant_part": "Leaves & Twigs",
        "method": "Steam Distillation",
        "origin": "Victoria, Australia",
        "volume_ml": 15,
        "weight_g": 50,
        "price": 16.00,
        "compare_price": 20.00,
        "sku": "ELV-EO-EUC-NAT",
        "stock": 240,
        "featured": True,
        "short_desc": "Australian narrow-leaved peppermint gum. Sweeter and gentler than globulus, releasing pure bushland freshness.",
        "description": "Distilled from native Australian Eucalyptus radiata. Recognized by aromatherapists as the most pleasant and versatile eucalyptus, delivering smooth respiratory support with none of the harshness.\n\nAromatic Profile:\nCrisp, fresh, sweet camphoraceous with subtle herbaceous citrus notes.\n\nKey Ritual Benefits:\n• Opens clear airways and refreshes tired breathing\n• Transports the senses to the restorative Australian native bush\n• Revitalizing shower steam companion",
        "ingredients": "100% Pure Eucalyptus radiata (Eucalyptus) Leaf Oil.",
        "directions": "Shower Steam: Place 3 drops on shower floor away from water stream. Diffuser: Add 5–7 drops for crisp, clarifying home air.",
        "cautions": "External use only. Do not ingest. Keep out of reach of children.",
        "bottle_type": "eo"
    },

    # --- CARRIER OILS (ORGANIC) ---
    {
        "id_code": 14,
        "name": "Certified Organic Golden Jojoba Oil",
        "slug": "organic-golden-jojoba-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Simmondsia chinensis",
        "plant_part": "Cold-Pressed Seeds",
        "method": "Unrefined Cold Pressed",
        "origin": "Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 29.00,
        "compare_price": 35.00,
        "sku": "ELV-CO-JOJ-ORG",
        "stock": 190,
        "featured": True,
        "short_desc": "First-press unrefined virgin organic golden jojoba. Mimics human sebum for weightless balancing hydration.",
        "description": "Cold-pressed from certified organic jojoba beans grown in Australia. Technically a liquid wax ester rather than an oil, jojoba bio-mimics human skin lipids to balance moisture without clogging pores.\n\nTexture & Finish:\nSilky, golden, absorbs cleanly with non-greasy satin finish.\n\nKey Ritual Benefits:\n• Balances both dry and oily complexions\n• The premier hypoallergenic carrier oil for essential oil dilution\n• Softens beard hair and protects delicate cuticles\n\n100% ACO Certified Organic | Virgin First Cold Press",
        "ingredients": "100% Certified Organic Simmondsia chinensis (Jojoba) Seed Oil.",
        "directions": "Daily Face: Dispense 3–4 drops onto clean, damp palms; press into face and neck. Carrier Blending: Blend 3 drops essential oil into 10mL jojoba. Hair: Smooth 2 drops through dry ends.",
        "cautions": "For external use only. Perform patch test. Store below 25°C in a dry place.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 15,
        "name": "Certified Organic Rosehip Seed Oil",
        "slug": "organic-rosehip-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Rosa canina",
        "plant_part": "Wild Rose Fruit Seeds",
        "method": "Cold Pressed Virgin",
        "origin": "Patagonia, Chile",
        "volume_ml": 50,
        "weight_g": 130,
        "price": 32.00,
        "compare_price": 39.00,
        "sku": "ELV-CO-ROS-ORG",
        "stock": 170,
        "featured": True,
        "short_desc": "Rich amber virgin organic rosehip oil. Packed with pro-vitamin A and essential fatty acids for ageless renewal.",
        "description": "Cold-pressed from wild organic Rosa canina hips harvested in pristine Andean valleys. Unrefined and naturally deep orange-amber, delivering pure beta-carotene, trans-retinoic acid precursors, and omegas 3 and 6.\n\nTexture & Finish:\nRich yet fast-absorbing 'dry' oil with an earthy botanical scent.\n\nKey Ritual Benefits:\n• Supports collagen synthesis and softens fine lines\n• Evens out discoloration and post-blemish marks\n• Deeply nourishes sun-kissed or dry skin\n\n100% ACO Certified Organic | Unrefined Virgin",
        "ingredients": "100% Certified Organic Rosa canina (Rosehip) Seed Oil.",
        "directions": "Night Serum: Warm 3–5 drops between fingertips and gently press into damp face, eye contour, and decolletage every evening.",
        "cautions": "For external use only. Natural beta-carotene may tint very pale fabrics if not fully absorbed. Store in a cool dark place.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 16,
        "name": "Certified Organic Sweet Almond Oil",
        "slug": "organic-sweet-almond-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Prunus amygdalus dulcis",
        "plant_part": "Almond Kernels",
        "method": "Cold Pressed",
        "origin": "Mediterranean",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 22.00,
        "compare_price": 27.00,
        "sku": "ELV-CO-ALM-ORG",
        "stock": 180,
        "featured": False,
        "short_desc": "Gentle cold-pressed organic sweet almond oil. Rich in natural vitamin E for silky body massage and baby-soft skin.",
        "description": "Expressed from the ripe nuts of certified organic sweet almond trees. Luxuriously mild and deeply moisturizing, sweet almond oil is a cherished traditional remedy for soothing tight, dry, or irritated skin.\n\nTexture & Finish:\nSmooth, medium glide with delicate nutty warmth.\n\nKey Ritual Benefits:\n• The gold standard for full-body massage therapy and lymphatic drainage\n• Softens rough elbows, knees, and dry heels\n• Dissolves stubborn eye makeup gently and without stinging\n\n100% ACO Certified Organic | Cold Pressed",
        "ingredients": "100% Certified Organic Prunus amygdalus dulcis (Sweet Almond) Kernel Oil.",
        "directions": "Body Care: Apply liberally after shower while skin is slightly damp. Massage: Use as a rich, smooth base for therapeutic essential oil blends.",
        "cautions": "For external use only. Contains tree nut derivatives. Do not use if allergic to almonds.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 17,
        "name": "Certified Organic Moroccan Argan Oil",
        "slug": "organic-argan-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Argania spinosa",
        "plant_part": "Kernel of Argan Nut",
        "method": "Cold Pressed Virgin",
        "origin": "Southwestern Morocco",
        "volume_ml": 50,
        "weight_g": 130,
        "price": 34.00,
        "compare_price": 42.00,
        "sku": "ELV-CO-ARG-ORG",
        "stock": 140,
        "featured": True,
        "short_desc": "Authentic certified organic Moroccan argan oil. The legendary 'liquid gold' for radiant skin and glossy hair.",
        "description": "Hand-cracked and cold-pressed by certified organic women's cooperatives in Morocco. Supercharged with natural squalene, polyphenols, and vitamin E, providing intensive barrier repair and weightless hair shine.\n\nTexture & Finish:\nSilky, rich, non-comedogenic golden elixir.\n\nKey Ritual Benefits:\n• Restores lustrous shine and tames frizz in dry hair\n• Fortifies skin moisture barrier against environmental stressors\n• Softens brittle nails and cuticles\n\n100% ACO Certified Organic | Fair Trade Virgin",
        "ingredients": "100% Certified Organic Argania spinosa (Argan) Kernel Oil.",
        "directions": "Face: 2–3 drops morning and night. Hair Treatment: Apply 4–6 drops through damp mid-lengths and ends before styling or as overnight mask.",
        "cautions": "For external use only. Nut derivative. Store below 25°C.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 18,
        "name": "Certified Organic Refined Macadamia Oil",
        "slug": "organic-refined-macadamia-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Macadamia integrifolia",
        "plant_part": "Nut Kernels",
        "method": "Refined Cold Pressed",
        "origin": "Queensland, Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 24.00,
        "compare_price": 29.00,
        "sku": "ELV-CO-MAC-ORG",
        "stock": 160,
        "featured": False,
        "short_desc": "Certified organic Australian macadamia oil. Abundant in rare omega-7 palmitoleic acid for mature skin renewal.",
        "description": "Cold-pressed from organic Australian macadamia nuts and gently refined to remove heavy odors while keeping the precious fatty acid structure intact. Uniquely rich in palmitoleic acid (omega-7), which naturally decreases as skin ages.\n\nTexture & Finish:\nVelvety, cushiony, absorbs smoothly into parched skin.\n\nKey Ritual Benefits:\n• Replenishes vital lipids in mature or weather-beaten skin\n• Provides exceptional glide for facial gua sha and facial massage\n• Deep conditioning for damaged hair\n\n100% ACO Certified Organic | Native Australian",
        "ingredients": "100% Certified Organic Macadamia integrifolia (Macadamia) Seed Oil.",
        "directions": "Gua Sha & Facial Massage: Apply 5 drops over face and neck before stone work. Body: Massage into dry limbs.",
        "cautions": "For external use only. Contains macadamia nut oil. Avoid if nut allergic.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 19,
        "name": "Certified Organic Refined Apricot Kernel Oil",
        "slug": "organic-refined-apricot-kernel-oil",
        "category_id": 7,
        "is_organic": True,
        "botanical": "Prunus armeniaca",
        "plant_part": "Fruit Kernels",
        "method": "Refined Cold Pressed",
        "origin": "Italy / Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 22.00,
        "compare_price": 27.00,
        "sku": "ELV-CO-APR-ORG",
        "stock": 150,
        "featured": False,
        "short_desc": "Ultra-gentle organic apricot kernel oil. Feather-light emollient that absorbs quickly to nourish delicate skin.",
        "description": "Expressed from certified organic apricot pits and subtly refined for neutral scent and maximum stability. High in oleic and linoleic acids, it mirrors the skin's natural lipid film to quench dehydration without greasiness.\n\nTexture & Finish:\nFeatherweight, clear, silky glide with rapid absorption.\n\nKey Ritual Benefits:\n• Wonderful for sensitive, teenage, or easily irritated skin\n• Ideal base for eye contour rollers and delicate face formulas\n• Softens rough patches and flaky skin immediately\n\n100% ACO Certified Organic | Cold Pressed",
        "ingredients": "100% Certified Organic Prunus armeniaca (Apricot) Kernel Oil.",
        "directions": "Daily Hydration: Apply 3–4 drops to face after cleansing. Eye Contour: Gently pat 1 drop around orbital bone.",
        "cautions": "For external use only. Perform patch test. Store below 25°C.",
        "bottle_type": "carrier"
    },

    # --- CARRIER OILS (100% PURE & NATURAL) ---
    {
        "id_code": 20,
        "name": "Pure Golden Jojoba Oil",
        "slug": "pure-golden-jojoba-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Simmondsia chinensis",
        "plant_part": "Seeds",
        "method": "Cold Pressed",
        "origin": "Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 22.00,
        "compare_price": 26.00,
        "sku": "ELV-CO-JOJ-NAT",
        "stock": 230,
        "featured": False,
        "short_desc": "100% pure cold-pressed golden jojoba. The ultimate versatile botanical carrier for face, body, and aromatherapy.",
        "description": "Pure unrefined Australian golden jojoba oil. Stable, long-lasting, and non-comedogenic, making it the supreme choice for diluting essential oils, cleansing faces, and moisturizing hair.\n\nTexture & Finish:\nRich liquid wax, clear golden tone, soft satin finish.\n\nKey Ritual Benefits:\n• Regulates natural oil production\n• Dissolves clogged sebum without stripping moisture\n• Perfect carrier oil for custom essential oil blends",
        "ingredients": "100% Pure Simmondsia chinensis (Jojoba) Seed Oil.",
        "directions": "Oil Cleansing: Massage 1 tsp into dry face to dissolve makeup and grime, then wipe off with a warm damp cloth. Blend: 10mL jojoba + 3 drops essential oil.",
        "cautions": "External use only. Store in cool dark conditions.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 21,
        "name": "Pure Rosehip Seed Oil",
        "slug": "pure-rosehip-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Rosa canina",
        "plant_part": "Seeds",
        "method": "Cold Pressed",
        "origin": "Chile",
        "volume_ml": 50,
        "weight_g": 130,
        "price": 24.00,
        "compare_price": 29.00,
        "sku": "ELV-CO-ROS-NAT",
        "stock": 200,
        "featured": False,
        "short_desc": "100% pure virgin cold-pressed rosehip seed oil. The beauty classic for supple skin tone, radiance, and scar recovery.",
        "description": "Pure cold-pressed rosehip seed oil from wild Chilean roses. Rich in polyunsaturated fatty acids and antioxidants that assist cell turnover and leave skin velvety soft.\n\nTexture & Finish:\nAmber-toned, dry-oil absorption.\n\nKey Ritual Benefits:\n• Restores dull, fatigued complexions\n• Improves the appearance of stretch marks and sun spots\n• Provides intensive nighttime hydration",
        "ingredients": "100% Pure Rosa canina (Rosehip) Seed Oil.",
        "directions": "Warm 3–4 drops in palms; gently press into damp face and neck prior to sleeping.",
        "cautions": "External use only. Keep away from heat and light.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 22,
        "name": "Pure Sweet Almond Oil",
        "slug": "pure-sweet-almond-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Prunus dulcis",
        "plant_part": "Nut Kernels",
        "method": "Cold Pressed",
        "origin": "Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 16.00,
        "compare_price": 20.00,
        "sku": "ELV-CO-ALM-NAT",
        "stock": 240,
        "featured": False,
        "short_desc": "100% pure Australian sweet almond oil. Deeply nourishing, velvety soft emollient for massage and daily body care.",
        "description": "Pure cold-pressed sweet almond oil grown under the Australian sun. Odorless and deeply emollient, it glides smoothly across the body, locking in moisture and leaving skin cushioned and calm.\n\nTexture & Finish:\nMedium viscosity with long, relaxing massage glide.\n\nKey Ritual Benefits:\n• Relieves post-bath dryness and winter flaking\n• Perfect gentle base for aromatherapy massage\n• Softens cuticles and dry hands",
        "ingredients": "100% Pure Prunus dulcis (Sweet Almond) Oil.",
        "directions": "Body Massage: Pour 1–2 tablespoons into palms and massage with long, rhythmic strokes. Aromatherapy: Add 6 drops lavender oil per 30mL almond oil.",
        "cautions": "External use only. Nut oil. Avoid if allergic to nuts.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 23,
        "name": "Pure Fractionated Coconut Carrier Oil",
        "slug": "pure-fractionated-coconut-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Cocos nucifera",
        "plant_part": "Coconut Flesh",
        "method": "Fractionated Distillation",
        "origin": "Pacific Islands",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 18.00,
        "compare_price": 22.00,
        "sku": "ELV-CO-COC-NAT",
        "stock": 250,
        "featured": False,
        "short_desc": "Odorless liquid fractionated coconut oil. Ultra-light, non-greasy, and stays perfectly liquid in all temperatures.",
        "description": "Pure medium-chain triglyceride (MCT) oil derived from natural coconut oil through gentle fractionating steam distillation. Unlike raw coconut oil, it never solidifies, has no odor, and will not clog pores.\n\nTexture & Finish:\nClear, featherweight, instant dry finish with zero residue.\n\nKey Ritual Benefits:\n• The premier carrier for perfume rollerballs and sprays\n• Absorbs immediately with zero oily staining on clothing\n• Virtually unlimited shelf life with zero rancidity",
        "ingredients": "100% Pure Cocos nucifera (Coconut) Caprylic/Capric Triglycerides.",
        "directions": "Rollerball Blends: Fill a 10mL roller bottle with fractionated coconut oil and add 6 drops of your signature essential oil blend. Hair: Tame flyaways with 1 drop.",
        "cautions": "External use only. Store at room temperature.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 24,
        "name": "Pure Refined Macadamia Oil",
        "slug": "pure-refined-macadamia-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Macadamia integrifolia",
        "plant_part": "Kernels",
        "method": "Refined Cold Pressed",
        "origin": "Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 18.00,
        "compare_price": 22.00,
        "sku": "ELV-CO-MAC-NAT",
        "stock": 210,
        "featured": False,
        "short_desc": "100% pure refined Australian macadamia oil. Rich in palmitoleic acid to replenish dehydrated and mature skin.",
        "description": "Cold-pressed from Australian macadamia nuts and gently refined for exceptional clarity and stability. Provides long-lasting comfort to mature or dry skin that needs deep nourishment.\n\nTexture & Finish:\nLuxuriously rich yet smoothly absorbed lipid oil.\n\nKey Ritual Benefits:\n• Restores essential fatty acids to parched skin\n• Excellent deeply conditioning hair mask for dry or split ends\n• Protects hands and cuticles from drying elements",
        "ingredients": "100% Pure Macadamia integrifolia (Macadamia) Seed Oil.",
        "directions": "Apply 4 drops to clean face or massage into hair ends 30 min before washing.",
        "cautions": "External use only. Nut derivative. Store below 25°C.",
        "bottle_type": "carrier"
    },
    {
        "id_code": 25,
        "name": "Pure Refined Apricot Kernel Oil",
        "slug": "pure-refined-apricot-kernel-oil",
        "category_id": 7,
        "is_organic": False,
        "botanical": "Prunus armeniaca",
        "plant_part": "Kernels",
        "method": "Refined Cold Pressed",
        "origin": "Australia",
        "volume_ml": 100,
        "weight_g": 180,
        "price": 17.00,
        "compare_price": 21.00,
        "sku": "ELV-CO-APR-NAT",
        "stock": 220,
        "featured": False,
        "short_desc": "100% pure refined apricot kernel oil. Lightweight, silky nourishment that melts gracefully into delicate skin.",
        "description": "Expressed from the seeds of ripe apricots and delicately refined to create an ultra-light, gentle moisturizer. High in vitamin A and linoleic acid, it restores bounce and suppleness without greasiness.\n\nTexture & Finish:\nClear, light glide, quick absorption with soft satin finish.\n\nKey Ritual Benefits:\n• Excellent for delicate, sensitive, or combination skin\n• Gentle emollient for facial massage and after-sun soothing\n• Softens and conditions dry cuticles",
        "ingredients": "100% Pure Prunus armeniaca (Apricot) Kernel Oil.",
        "directions": "Face & Neck: Massage 3–5 drops into freshly cleansed skin morning or evening.",
        "cautions": "External use only. Store in a cool dark place.",
        "bottle_type": "carrier"
    }
]

# Diffuser data for label generation
DIFFUSER_PRODUCT = {
    "name": "Ceramic Ultrasonic Aroma Diffuser",
    "slug": "ceramic-ultrasonic-aroma-diffuser",
    "is_organic": False,
    "botanical": "Aromatherapy Device",
    "plant_part": "Artisan Ceramic & BPA-Free Reservoir",
    "method": "Ultrasonic Cool Mist 2.4MHz",
    "origin": "Designed in Australia",
    "volume_ml": 300,
    "sku": "ELV-DIF-001",
    "short_desc": "Artisan matte white ceramic ultrasonic diffuser with gentle ambient light and whisper-quiet misting.",
    "ingredients": "Handcrafted Artisan Ceramic Outer Shell, BPA-Free Polypropylene Water Tank, Ultrasonic Ceramic Vibrating Disc (2.4MHz), Warm Ambient LED Array.",
    "directions": "Setup: Remove ceramic cover. Add 250–300mL cool tap or filtered water to MAX line. Add 5–8 drops of pure Elavenza essential oil. Replace cover and press mist button for continuous or 30s intermittent mode.",
    "cautions": "Use only pure essential oils. Unplug before refilling or cleaning. Empty water tank when not in use. Clean ultrasonic plate weekly with white vinegar.",
    "bottle_type": "device"
}

def generate_dynamic_svg_label(prod, logo_b64, aus_made_b64=None):
    if aus_made_b64 is None:
        try:
            with open('public/images/australian-made-logo.png', 'rb') as f:
                aus_made_b64 = base64.b64encode(f.read()).decode('utf-8')
        except Exception:
            aus_made_b64 = ""
    slug = prod["slug"]
    name = prod["name"].upper()
    botanical = prod.get("botanical", "Botanical Specimen")
    is_organic = prod.get("is_organic", False)
    category = "ESSENTIAL OIL" if prod.get("category_id") == 6 else "CARRIER OIL" if prod.get("category_id") == 7 else "WELLBEING DEVICE"
    vol_text = f"{prod.get('volume_ml', 15)} mL ℮ {round(prod.get('volume_ml', 15) * 0.033814, 1)} fl. oz." if prod.get("volume_ml") else "300 mL Capacity"
    sku = prod.get("sku", "ELV-001")
    ingredients = prod.get("ingredients", "")
    directions = prod.get("directions", "")
    cautions = prod.get("cautions", "")
    method = prod.get("method", "Steam Distilled")
    origin = prod.get("origin", "Australia")
    plant_part = prod.get("plant_part", "Flowering Tops")
    
    badge_bg = "#2b4a36" if is_organic else "#3d3935"
    badge_text = "CERTIFIED ORGANIC" if is_organic else "100% PURE &amp; NATURAL"
    badge_sub = "ACO CERT. NO. 11849 • USDA ORGANIC" if is_organic else "PURE BOTANICAL • THERAPEUTIC GRADE"

    # SVG layout 1200 x 800
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F5"/>
      <stop offset="50%" stop-color="#F6F3EE"/>
      <stop offset="100%" stop-color="#EDE8E1"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#1e241c" flood-opacity="0.12"/>
    </filter>
    <pattern id="stripes" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 0,40 L 40,0 M -10,10 L 10,-10 M 30,50 L 50,30" stroke="#000000" stroke-opacity="0.015" stroke-width="2"/>
    </pattern>
  </defs>

  <style>
    .brand-serif {{ font-family: 'Playfair Display', 'Liberation Serif', Georgia, serif; font-weight: 700; }}
    .botanical-italic {{ font-family: 'Playfair Display', 'Liberation Serif', Georgia, serif; font-style: italic; }}
    .sans-bold {{ font-family: 'Montserrat', 'Lato', -apple-system, sans-serif; font-weight: 700; letter-spacing: 0.12em; }}
    .sans-med {{ font-family: 'Montserrat', 'Lato', -apple-system, sans-serif; font-weight: 600; }}
    .sans-reg {{ font-family: 'Lato', 'Liberation Sans', -apple-system, sans-serif; font-weight: 400; }}
    .col-title {{ font-size: 13px; font-weight: 700; letter-spacing: 0.16em; fill: #334438; text-transform: uppercase; }}
    .body-text {{ font-size: 12.5px; fill: #48443e; line-height: 1.55; }}
  </style>

  <!-- Background Base Canvas -->
  <rect width="1200" height="800" fill="#E8E4DC"/>
  
  <!-- Outer Packaging Label Sheet with shadow -->
  <rect x="35" y="35" width="1130" height="730" rx="12" fill="url(#bgGrad)" filter="url(#shadow)" stroke="#C8C0B2" stroke-width="1.5"/>
  <rect x="35" y="35" width="1130" height="730" rx="12" fill="url(#stripes)"/>
  
  <!-- Outer Gold/Sage Filigree Border -->
  <rect x="48" y="48" width="1104" height="704" rx="8" fill="none" stroke="#D1C7B7" stroke-width="1"/>
  <rect x="54" y="54" width="1092" height="692" rx="6" fill="none" stroke="#2C4837" stroke-width="1.5" stroke-opacity="0.75"/>

  <!-- Left Panel Divider (x=380) -->
  <line x1="380" y1="54" x2="380" y2="746" stroke="#D6CEC1" stroke-width="1.5" stroke-dasharray="6,4"/>
  
  <!-- Right Panel Divider (x=820) -->
  <line x1="820" y1="54" x2="820" y2="746" stroke="#D6CEC1" stroke-width="1.5" stroke-dasharray="6,4"/>

  <!-- ==================== LEFT PANEL: DIRECTIONS & SAFETY ==================== -->
  <g transform="translate(80, 85)">
    <!-- Header Badge -->
    <rect x="0" y="0" width="260" height="26" rx="4" fill="#2C4837" fill-opacity="0.1"/>
    <text x="130" y="17" text-anchor="middle" class="sans-bold col-title" fill="#2C4837">DIRECTIONS &amp; RITUAL</text>

    <!-- Directions Content -->
    <text x="0" y="55" class="sans-med" font-size="12" fill="#2C4837">RECOMMENDED USE</text>
    <foreignObject x="0" y="65" width="265" height="155">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Lato',sans-serif;font-size:12px;color:#45413a;line-height:1.55;">
        {directions}
      </div>
    </foreignObject>

    <!-- Caution Header -->
    <line x1="0" y1="230" x2="265" y2="230" stroke="#D8D0C2" stroke-width="1"/>
    <text x="0" y="258" class="sans-med" font-size="12" fill="#8B3A2B">SAFETY &amp; CAUTIONS</text>
    <foreignObject x="0" y="270" width="265" height="160">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Lato',sans-serif;font-size:11.5px;color:#555048;line-height:1.55;">
        {cautions}
      </div>
    </foreignObject>

    <!-- Storage & Recycling -->
    <line x1="0" y1="440" x2="265" y2="440" stroke="#D8D0C2" stroke-width="1"/>
    <text x="0" y="468" class="sans-bold" font-size="10.5" fill="#665F55">STORAGE</text>
    <text x="0" y="488" class="sans-reg" font-size="11" fill="#4B463E">Store below 30°C in a cool, dark space.</text>
    <text x="0" y="506" class="sans-reg" font-size="11" fill="#4B463E">Keep tightly sealed in amber UV glass.</text>

    <!-- Environmental Icons / Badges -->
    <g transform="translate(0, 540)">
      <circle cx="20" cy="20" r="18" fill="#EBF2EC" stroke="#2C4837" stroke-width="1.2"/>
      <path d="M 14,21 C 14,14 26,14 26,21 C 26,25 21,27 20,28 C 19,27 14,25 14,21 Z" fill="#2C4837"/>
      <text x="48" y="16" class="sans-bold" font-size="9" fill="#2C4837">100% BOTANICAL</text>
      <text x="48" y="28" class="sans-reg" font-size="9" fill="#666">Vegan &amp; Cruelty Free</text>

      <circle cx="150" cy="20" r="18" fill="#EBF2EC" stroke="#2C4837" stroke-width="1.2"/>
      <path d="M 144,17 L 150,11 L 156,17 M 150,12 L 150,26 M 143,26 L 157,26" stroke="#2C4837" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <text x="176" y="16" class="sans-bold" font-size="9" fill="#2C4837">RECYCLABLE</text>
      <text x="176" y="28" class="sans-reg" font-size="9" fill="#666">Amber Glass &amp; Pipette</text>
    </g>
  </g>

  <!-- ==================== CENTER PANEL: BRAND & PRODUCT IDENTITY ==================== -->
  <g transform="translate(410, 75)">
    <!-- Elavenza Logo -->
    <image href="data:image/png;base64,{logo_b64}" x="40" y="10" width="300" height="110" preserveAspectRatio="xMidYMid meet"/>

    <!-- Apothecary Subtitle -->
    <text x="190" y="145" text-anchor="middle" class="sans-bold" font-size="10.5" fill="#5F584E" letter-spacing="0.28em">BOTANICAL APOTHECARY • AUSTRALIA</text>
    
    <!-- Certification Seal / Pill -->
    <rect x="65" y="165" width="250" height="28" rx="14" fill="{badge_bg}"/>
    <text x="190" y="183" text-anchor="middle" class="sans-bold" font-size="11.5" fill="#FAF6EE" letter-spacing="0.18em">{badge_text}</text>
    <text x="190" y="206" text-anchor="middle" class="sans-bold" font-size="8.5" fill="#756C5F" letter-spacing="0.12em">{badge_sub}</text>

    <!-- Filigree ornament -->
    <path d="M 100,225 Q 190,215 280,225" stroke="#C5BBAA" stroke-width="1.2" fill="none"/>
    <circle cx="190" cy="221" r="3.5" fill="#2C4837"/>

    <!-- Product Title -->
    <foreignObject x="10" y="238" width="360" height="110">
      <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;">
        <h1 style="margin:0;font-family:'Playfair Display','Liberation Serif',serif;font-size:24px;font-weight:700;color:#202822;line-height:1.25;letter-spacing:0.04em;">
          {name}
        </h1>
      </div>
    </foreignObject>

    <!-- Botanical Latin Classification -->
    <text x="190" y="365" text-anchor="middle" class="botanical-italic" font-size="17" fill="#3B5745">{botanical}</text>

    <!-- Separation Line -->
    <line x1="80" y1="390" x2="300" y2="390" stroke="#C8BEAD" stroke-width="1"/>

    <!-- Botanical Specifications Table -->
    <g transform="translate(30, 410)">
      <rect x="0" y="0" width="320" height="120" rx="6" fill="#F4EFE6" stroke="#DDD4C5" stroke-width="1"/>
      
      <text x="20" y="28" class="sans-bold" font-size="10" fill="#6A6356">PART</text>
      <text x="110" y="28" class="sans-med" font-size="11" fill="#2C2720">{plant_part}</text>

      <line x1="20" y1="42" x2="300" y2="42" stroke="#E3DCD0" stroke-width="1"/>

      <text x="20" y="64" class="sans-bold" font-size="10" fill="#6A6356">METHOD</text>
      <text x="110" y="64" class="sans-med" font-size="11" fill="#2C2720">{method}</text>

      <line x1="20" y1="78" x2="300" y2="78" stroke="#E3DCD0" stroke-width="1"/>

      <text x="20" y="100" class="sans-bold" font-size="10" fill="#6A6356">ORIGIN</text>
      <text x="110" y="100" class="sans-med" font-size="11" fill="#2C2720">{origin}</text>
    </g>

    <!-- Volume & Standard Fill Statement -->
    <rect x="80" y="555" width="220" height="42" rx="6" fill="#2C4837" stroke="#1D3325" stroke-width="1.2"/>
    <text x="190" y="581" text-anchor="middle" class="sans-bold" font-size="16" fill="#FFFFFF" letter-spacing="0.12em">{vol_text}</text>

    <!-- Footer Tagline -->
    <text x="190" y="625" text-anchor="middle" class="botanical-italic" font-size="12" fill="#585247">"Pure botanical connection, bottled for your daily ritual."</text>
  </g>

  <!-- ==================== RIGHT PANEL: INGREDIENTS, BATCH & BARCODE ==================== -->
  <g transform="translate(850, 85)">
    <!-- Header Badge -->
    <rect x="0" y="0" width="265" height="26" rx="4" fill="#2C4837" fill-opacity="0.1"/>
    <text x="132" y="17" text-anchor="middle" class="sans-bold col-title" fill="#2C4837">FULL INGREDIENT LIST</text>

    <!-- INCI Ingredients Box -->
    <text x="0" y="55" class="sans-bold" font-size="10" fill="#6A6356">INCI DECLARATION (100% PURE)</text>
    <foreignObject x="0" y="65" width="265" height="160">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Lato',sans-serif;font-size:12px;color:#332F2A;line-height:1.6;background:#F6F1E7;padding:12px;border-radius:6px;border:1px solid #E0D7C7;">
        <strong>Active Formulation:</strong><br/>
        {ingredients}
        <br/><br/>
        <span style="font-size:10.5px;color:#6A645A;">Formulated without phthalates, synthetic fragrance, parabens, sulfates, mineral oil, or GMOs.</span>
      </div>
    </foreignObject>

    <!-- Batch and Manufacturing Info -->
    <g transform="translate(0, 255)">
      <rect x="0" y="0" width="265" height="85" rx="6" fill="#FAF6EE" stroke="#DDD5C7" stroke-width="1"/>
      <text x="16" y="24" class="sans-bold" font-size="10" fill="#6B6458">BATCH NO.</text>
      <text x="160" y="24" class="sans-bold" font-size="11" fill="#1B281F">ELV-2026-B812</text>
      
      <line x1="16" y1="36" x2="249" y2="36" stroke="#EAE2D4" stroke-width="1"/>

      <text x="16" y="54" class="sans-bold" font-size="10" fill="#6B6458">BEST BEFORE</text>
      <text x="160" y="54" class="sans-med" font-size="11" fill="#1B281F">08 / 2028</text>

      <line x1="16" y1="64" x2="249" y2="64" stroke="#EAE2D4" stroke-width="1"/>

      <text x="16" y="78" class="sans-bold" font-size="10" fill="#6B6458">PRODUCT SKU</text>
      <text x="160" y="78" class="sans-bold" font-size="10.5" fill="#2C4837">{sku}</text>
    </g>

    <!-- Authentic Vector Barcode -->
    <g transform="translate(25, 365)">
      <!-- Barcode background -->
      <rect x="0" y="0" width="215" height="85" fill="#FFFFFF" rx="4" stroke="#D1C7B5" stroke-width="1"/>
      <!-- Realistic Barcode Stripes -->
      <g fill="#1A1816" transform="translate(15, 10)">
        <rect x="0" y="0" width="2.5" height="50"/>
        <rect x="5" y="0" width="1.5" height="50"/>
        <rect x="10" y="0" width="3.5" height="50"/>
        <rect x="16" y="0" width="1.5" height="50"/>
        <rect x="20" y="0" width="4.5" height="50"/>
        <rect x="27" y="0" width="2.0" height="50"/>
        <rect x="32" y="0" width="1.0" height="50"/>
        <rect x="36" y="0" width="4.0" height="50"/>
        <rect x="43" y="0" width="2.0" height="50"/>
        <rect x="48" y="0" width="5.0" height="50"/>
        <rect x="56" y="0" width="2.0" height="50"/>
        <rect x="61" y="0" width="1.0" height="50"/>
        <rect x="65" y="0" width="3.0" height="50"/>
        <rect x="71" y="0" width="4.5" height="50"/>
        <rect x="78" y="0" width="2.0" height="50"/>
        <rect x="83" y="0" width="1.5" height="50"/>
        <rect x="88" y="0" width="3.5" height="50"/>
        <rect x="94" y="0" width="2.0" height="50"/>
        <rect x="99" y="0" width="4.5" height="50"/>
        <rect x="106" y="0" width="1.0" height="50"/>
        <rect x="110" y="0" width="3.5" height="50"/>
        <rect x="116" y="0" width="2.0" height="50"/>
        <rect x="121" y="0" width="5.0" height="50"/>
        <rect x="129" y="0" width="1.5" height="50"/>
        <rect x="133" y="0" width="3.0" height="50"/>
        <rect x="139" y="0" width="2.5" height="50"/>
        <rect x="144" y="0" width="4.0" height="50"/>
        <rect x="151" y="0" width="1.5" height="50"/>
        <rect x="155" y="0" width="3.0" height="50"/>
        <rect x="161" y="0" width="4.5" height="50"/>
        <rect x="168" y="0" width="2.0" height="50"/>
        <rect x="173" y="0" width="3.5" height="50"/>
        <rect x="180" y="0" width="2.0" height="50"/>
      </g>
      <text x="107" y="75" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#222">9 354812 00{prod.get('id_code', 1):02d}9</text>
    </g>

    <!-- Australian Made & Authenticity Statement -->
    <g transform="translate(0, 465)">
      <rect x="0" y="0" width="265" height="155" rx="6" fill="#F4EFE6" stroke="#DDD4C5" stroke-width="1"/>
      <g transform="translate(14, 12)">
        <!-- Australian Made Official Kangaroo Logo -->
        <image href="data:image/png;base64,{aus_made_b64}" x="0" y="0" width="46" height="40" preserveAspectRatio="xMidYMid meet"/>
        <text x="54" y="17" class="sans-bold" font-size="11" fill="#2C4837">AUSTRALIAN MADE</text>
        <text x="54" y="33" class="sans-reg" font-size="9.5" fill="#5E584D">&amp; Bottled with Care</text>
      </g>
      <line x1="14" y1="58" x2="251" y2="58" stroke="#E3DCD0" stroke-width="1"/>
      <text x="14" y="78" class="sans-med" font-size="10.5" font-weight="bold" fill="#3D372E">Elavenza Wellness</text>
      <text x="14" y="95" class="sans-med" font-size="9.5" fill="#5E584D">ABN 48 447 602 072</text>
      <text x="14" y="112" class="sans-reg" font-size="9.5" fill="#665F52">Brisbane QLD 4051 • Australia</text>
      <text x="14" y="132" class="sans-bold" font-size="10" fill="#2C4837">www.elavenza.com.au</text>
    </g>
  </g>
</svg>"""
    return svg

def generate_branded_bottle_image(prod, base_eo, base_carrier, logo_im):
    slug = prod["slug"]
    name = prod["name"]
    botanical = prod.get("botanical", "")
    is_organic = prod.get("is_organic", False)
    is_carrier = prod.get("category_id") == 7
    vol = prod.get("volume_ml", 15)

    base = base_carrier.copy() if is_carrier else base_eo.copy()
    
    # Coordinates on bottle
    if is_carrier:
        label_w = 205
        label_h = 275
        label_x = 522 - label_w // 2
        label_y = 525
    else:
        label_w = 195
        label_h = 240
        label_x = 517 - label_w // 2
        label_y = 538

    # Render label at 3x scale for crisp anti-aliased text
    scale = 3
    w, h = label_w * scale, label_h * scale

    # Realistic warm apothecary label background with slight gradient
    label = Image.new("RGBA", (w, h), (251, 249, 244, 252))
    draw = ImageDraw.Draw(label)

    # Double border: gold inner, sage/bronze outer
    border_col = (44, 72, 55, 180) if is_organic else (60, 55, 50, 180)
    draw.rectangle([(6*scale, 6*scale), (w - 6*scale, h - 6*scale)], outline=border_col, width=int(1.2*scale))
    draw.rectangle([(10*scale, 10*scale), (w - 10*scale, h - 10*scale)], outline=(195, 185, 170, 160), width=int(0.8*scale))

    # Paste Elavenza Logo
    target_logo_w = int(w * 0.72)
    logo_ratio = logo_im.height / logo_im.width
    target_logo_h = int(target_logo_w * logo_ratio)
    logo_resized = logo_im.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)
    logo_x = (w - target_logo_w) // 2
    logo_y = int(14 * scale)
    label.paste(logo_resized, (logo_x, logo_y), logo_resized)

    # Fonts
    font_bold_title = ImageFont.truetype('/usr/share/fonts/liberation-serif-fonts/LiberationSerif-Bold.ttf', int(12.5 * scale))
    font_botanical = ImageFont.truetype('/usr/share/fonts/liberation-serif-fonts/LiberationSerif-Italic.ttf', int(9.5 * scale))
    font_badge = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Bold.ttf', int(7.5 * scale))
    font_sub = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Regular.ttf', int(7.0 * scale))
    font_vol = ImageFont.truetype('/usr/share/fonts/lato-fonts/Lato-Bold.ttf', int(8.0 * scale))

    # Badge Pill
    badge_y = logo_y + target_logo_h + int(5 * scale)
    badge_w = int(105 * scale)
    badge_h = int(14 * scale)
    badge_x = (w - badge_w) // 2
    
    if is_organic:
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)], radius=int(6*scale), fill=(44, 72, 55, 230))
        draw.text((w // 2, badge_y + badge_h // 2), "CERTIFIED ORGANIC", fill=(255, 255, 255), font=font_badge, anchor="mm")
    else:
        draw.rounded_rectangle([(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)], radius=int(6*scale), fill=(70, 65, 60, 220))
        draw.text((w // 2, badge_y + badge_h // 2), "100% PURE & NATURAL", fill=(255, 255, 255), font=font_badge, anchor="mm")

    # Divider line
    div_y = badge_y + badge_h + int(6 * scale)
    draw.line([(int(w * 0.22), div_y), (int(w * 0.78), div_y)], fill=(195, 185, 170, 200), width=int(1*scale))

    # Extract short product display name (e.g. "LAVENDER", "TEA TREE", "GOLDEN JOJOBA")
    clean_name = name
    for prefix in ["Certified Organic ", "Pure Australian ", "Pure "]:
        if clean_name.startswith(prefix):
            clean_name = clean_name[len(prefix):]
    clean_name = clean_name.replace(" Essential Oil", "").replace(" Carrier Oil", "")
    
    # Text placement
    name_y = div_y + int(14 * scale)
    # Split if long
    if len(clean_name) > 16:
        words = clean_name.split()
        half = len(words) // 2
        line1 = " ".join(words[:half]).upper()
        line2 = " ".join(words[half:]).upper()
        draw.text((w // 2, name_y), line1, fill=(30, 35, 30), font=font_bold_title, anchor="mm")
        draw.text((w // 2, name_y + int(13 * scale)), line2, fill=(30, 35, 30), font=font_bold_title, anchor="mm")
        botanical_y = name_y + int(27 * scale)
    else:
        draw.text((w // 2, name_y), clean_name.upper(), fill=(30, 35, 30), font=font_bold_title, anchor="mm")
        botanical_y = name_y + int(14 * scale)

    # Botanical name
    draw.text((w // 2, botanical_y), botanical, fill=(65, 80, 70), font=font_botanical, anchor="mm")

    # Category note
    cat_note = "Single Essential Oil" if not is_carrier else "Cold-Pressed Carrier Oil"
    draw.text((w // 2, botanical_y + int(12 * scale)), cat_note, fill=(100, 95, 90), font=font_sub, anchor="mm")

    # Volume at bottom
    vol_str = f"{vol} mL • {round(vol * 0.033814, 1)} fl. oz."
    draw.line([(int(w * 0.3), h - int(24 * scale)), (int(w * 0.7), h - int(24 * scale))], fill=(200, 190, 175, 180), width=int(0.8*scale))
    draw.text((w // 2, h - int(14 * scale)), vol_str, fill=(40, 40, 40), font=font_vol, anchor="mm")

    # Downsample label with high-quality LANCZOS filter
    final_label = label.resize((label_w, label_h), Image.Resampling.LANCZOS)

    # Soft bottle curvature shading: vignette on left & right edge
    curv = Image.new("RGBA", (label_w, label_h), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(curv)
    for x in range(18):
        alpha = int((1.0 - (x / 18.0)) * 60)
        c_draw.line([(x, 0), (x, label_h)], fill=(0, 0, 0, alpha))
        c_draw.line([(label_w - 1 - x, 0), (label_w - 1 - x, label_h)], fill=(0, 0, 0, alpha))
    final_label = Image.alpha_composite(final_label, curv)

    # Paste onto base
    result = base.copy()
    result.paste(final_label, (label_x, label_y), final_label)
    return result

def main():
    print("Step 1: Loading assets and preparing generator...")
    base_eo = Image.open('public/images/test_eo_bottle_1789475181.jpg').convert('RGBA')
    base_carrier = Image.open('public/images/test_carrier_bottle_1789475270.jpg').convert('RGBA')
    logo = Image.open('public/images/elavenza-wellness-logo.png').convert('RGBA')

    # Prepare optimized logo base64 for SVGs
    w = 480
    h = int(w * logo.height / logo.width)
    logo_opt = logo.resize((w, h), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    logo_opt.save(buf, format='PNG', optimize=True)
    logo_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    os.makedirs('public/images/products', exist_ok=True)

    print(f"Step 2: Generating branded images and dynamic SVG labels for {len(PRODUCTS)} products...")
    for idx, prod in enumerate(PRODUCTS, 1):
        slug = prod["slug"]
        print(f"[{idx:2d}/{len(PRODUCTS)}] Generating {slug}...")

        # 1. Generate dynamic SVG label
        svg_content = generate_dynamic_svg_label(prod, logo_b64)
        svg_path = f"public/images/products/{slug}-label.svg"
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)

        # 2. Generate branded product photograph (JPG)
        bottle_im = generate_branded_bottle_image(prod, base_eo, base_carrier, logo)
        jpg_path = f"public/images/products/{slug}.jpg"
        bottle_im.convert("RGB").save(jpg_path, "JPEG", quality=92, optimize=True)

    # Also generate dynamic SVG label for Diffuser
    print("Generating Diffuser dynamic SVG label...")
    diffuser_svg = generate_dynamic_svg_label(DIFFUSER_PRODUCT, logo_b64)
    with open("public/images/products/ceramic-ultrasonic-aroma-diffuser-label.svg", "w", encoding="utf-8") as f:
        f.write(diffuser_svg)

    print("Step 3: Connecting to database to update product catalog...")
    conn_str = None
    with open(".env.local") as f:
        for line in f:
            if line.startswith("DATABASE_URL="):
                conn_str = line.strip().split("=", 1)[1].strip('"\'')
                break
    
    if not conn_str:
        with open(".env") as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    conn_str = line.strip().split("=", 1)[1].strip('"\'')
                    break

    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()

    try:
        # Delete old products except Diffuser
        print("Removing legacy products (keeping [Diffuser])...")
        cur.execute("DELETE FROM products WHERE slug NOT LIKE '%diffuser%' AND name NOT ILIKE '%diffuser%'")
        print(f"Deleted old products. Rows affected: {cur.rowcount}")

        # Update diffuser images to include the new dynamic SVG label
        cur.execute("""
            UPDATE products 
            SET images = ARRAY['/images/prod-diffuser.jpg', '/images/products/ceramic-ultrasonic-aroma-diffuser-label.svg']::text[]
            WHERE slug LIKE '%diffuser%' OR name ILIKE '%diffuser%'
        """)

        # Insert the 25 new products
        print(f"Inserting {len(PRODUCTS)} new products from Product List.xlsx...")
        for prod in PRODUCTS:
            images = [
                f"/images/products/{prod['slug']}.jpg",
                f"/images/products/{prod['slug']}-label.svg"
            ]
            
            cur.execute("""
                INSERT INTO products (
                    name, slug, description, short_desc, price, compare_price,
                    sku, stock, category_id, images, featured, is_active,
                    weight, volume_ml, meta_title, meta_description, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, NOW(), NOW()
                ) RETURNING id
            """, (
                prod["name"],
                prod["slug"],
                prod["description"],
                prod["short_desc"],
                prod["price"],
                prod["compare_price"],
                prod["sku"],
                prod["stock"],
                prod["category_id"],
                images,
                prod["featured"],
                True,
                prod["weight_g"] / 1000.0,
                prod["volume_ml"],
                f"{prod['name']} | Elavenza Wellness Australia",
                prod["short_desc"]
            ))
            new_id = cur.fetchone()[0]

            # Insert size variants
            if prod["category_id"] == 6:
                # Essential oil variants: 15ml (standard), 50ml (bulk)
                cur.execute("""
                    INSERT INTO product_variants (product_id, name, price, sku, stock, sort_order)
                    VALUES 
                    (%s, %s, %s, %s, %s, 1),
                    (%s, %s, %s, %s, %s, 2)
                """, (
                    new_id, "15 mL (Standard)", prod["price"], prod["sku"], prod["stock"],
                    new_id, "50 mL (Apothecary Size)", round(prod["price"] * 2.6, 2), f"{prod['sku']}-50ML", 45
                ))
            else:
                # Carrier oil variants: 50ml/100ml, 200ml
                base_vol = prod["volume_ml"]
                cur.execute("""
                    INSERT INTO product_variants (product_id, name, price, sku, stock, sort_order)
                    VALUES 
                    (%s, %s, %s, %s, %s, 1),
                    (%s, %s, %s, %s, %s, 2)
                """, (
                    new_id, f"{base_vol} mL (Standard)", prod["price"], prod["sku"], prod["stock"],
                    new_id, f"{base_vol * 2} mL (Family Size)", round(prod["price"] * 1.75, 2), f"{prod['sku']}-LGE", 50
                ))

        # Check total products in db
        cur.execute("SELECT count(*) FROM products")
        total_prods = cur.fetchone()[0]
        print(f"Total products now in database: {total_prods}")

        conn.commit()
        print("Database transaction committed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
        raise e
    finally:
        cur.close()
        conn.close()

    print("\nAll assets generated and database updated successfully!")

if __name__ == "__main__":
    main()
