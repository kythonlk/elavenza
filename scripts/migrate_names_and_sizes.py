import os
import psycopg2

conn_str = ''
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('DATABASE_URL='):
            conn_str = line.strip().split('=', 1)[1].strip('"\'')
            break

if 'channel_binding=' in conn_str:
    conn_str = '&'.join([p for p in conn_str.split('&') if not p.startswith('channel_binding=')])

conn = psycopg2.connect(conn_str)
conn.autocommit = False
cur = conn.cursor()

# Get category IDs
cur.execute("SELECT slug, id FROM categories")
cat_map = dict(cur.fetchall())
print('Category Map:', cat_map)

# Deactivate legacy categories 6, 7, 8 so they do not show empty in the filters
cur.execute("UPDATE categories SET is_active = false WHERE slug IN ('essential-oils', 'carrier-oils', 'skincare')")

# Definition of products with new names, categories, and variant pricing
PRODUCTS_UPDATE = [
    # --- ORGANIC ESSENTIAL OILS (Category: organic-essential-oils) ---
    {
        "slug": "organic-lavender-essential-oil",
        "name": "Lavender Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 26.00,
        "price_10ml": 19.00,
        "sku": "ELV-EO-LAV-ORG",
    },
    {
        "slug": "organic-tea-tree-essential-oil",
        "name": "Tea Tree Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 22.00,
        "price_10ml": 16.00,
        "sku": "ELV-EO-TEA-ORG",
    },
    {
        "slug": "organic-sweet-orange-essential-oil",
        "name": "Sweet Orange Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 19.00,
        "price_10ml": 14.00,
        "sku": "ELV-EO-ORA-ORG",
    },
    {
        "slug": "organic-peppermint-essential-oil",
        "name": "Peppermint Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 24.00,
        "price_10ml": 18.00,
        "sku": "ELV-EO-PEP-ORG",
    },
    {
        "slug": "organic-rosemary-essential-oil",
        "name": "Rosemary Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 25.00,
        "price_10ml": 19.00,
        "sku": "ELV-EO-ROS-ORG",
    },
    {
        "slug": "organic-frankincense-essential-oil",
        "name": "Frankincense Olibanum Essential Oil - Certified Organic",
        "category_slug": "organic-essential-oils",
        "volume_ml": 15,
        "price_15ml": 38.00,
        "price_10ml": 28.00,
        "sku": "ELV-EO-FRA-ORG",
    },

    # --- PURE ESSENTIAL OILS (Category: pure-essential-oils) ---
    {
        "slug": "pure-eucalyptus-radiata-essential-oil",
        "name": "Eucalyptus Radiata Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 16.00,
        "price_10ml": 12.00,
        "sku": "ELV-EO-EUC-NAT",
    },
    {
        "slug": "pure-lavender-essential-oil",
        "name": "Lavender Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 18.00,
        "price_10ml": 13.00,
        "sku": "ELV-EO-LAV-NAT",
    },
    {
        "slug": "pure-tea-tree-essential-oil",
        "name": "Tea Tree Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 16.00,
        "price_10ml": 12.00,
        "sku": "ELV-EO-TEA-NAT",
    },
    {
        "slug": "pure-sweet-orange-essential-oil",
        "name": "Sweet Orange Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 15.00,
        "price_10ml": 11.00,
        "sku": "ELV-EO-ORA-NAT",
    },
    {
        "slug": "pure-peppermint-essential-oil",
        "name": "Peppermint Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 17.00,
        "price_10ml": 13.00,
        "sku": "ELV-EO-PEP-NAT",
    },
    {
        "slug": "pure-rosemary-essential-oil",
        "name": "Rosemary Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 18.00,
        "price_10ml": 13.00,
        "sku": "ELV-EO-ROS-NAT",
    },
    {
        "slug": "pure-frankincense-essential-oil",
        "name": "Frankincense Olibanum Pure Essential Oil",
        "category_slug": "pure-essential-oils",
        "volume_ml": 15,
        "price_15ml": 29.00,
        "price_10ml": 22.00,
        "sku": "ELV-EO-FRA-NAT",
    },

    # --- ORGANIC CARRIER OILS (Category: organic-carrier-oils, 100ml) ---
    {
        "slug": "organic-golden-jojoba-oil",
        "name": "Golden Jojoba Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 29.00,
        "sku": "ELV-CO-JOJ-ORG",
    },
    {
        "slug": "organic-rosehip-oil",
        "name": "Rosehip Seed Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 32.00,
        "sku": "ELV-CO-ROS-ORG",
    },
    {
        "slug": "organic-sweet-almond-oil",
        "name": "Sweet Almond Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 22.00,
        "sku": "ELV-CO-ALM-ORG",
    },
    {
        "slug": "organic-argan-oil",
        "name": "Moroccan Argan Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 34.00,
        "sku": "ELV-CO-ARG-ORG",
    },
    {
        "slug": "organic-refined-macadamia-oil",
        "name": "Refined Macadamia Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 24.00,
        "sku": "ELV-CO-MAC-ORG",
    },
    {
        "slug": "organic-refined-apricot-kernel-oil",
        "name": "Refined Apricot Kernel Oil - Certified Organic",
        "category_slug": "organic-carrier-oils",
        "volume_ml": 100,
        "price": 22.00,
        "sku": "ELV-CO-APR-ORG",
    },

    # --- PURE CARRIER OILS (Category: pure-carrier-oils, 100ml) ---
    {
        "slug": "pure-golden-jojoba-oil",
        "name": "Golden Jojoba Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 22.00,
        "sku": "ELV-CO-JOJ-NAT",
    },
    {
        "slug": "pure-rosehip-oil",
        "name": "Rosehip Seed Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 24.00,
        "sku": "ELV-CO-ROS-NAT",
    },
    {
        "slug": "pure-sweet-almond-oil",
        "name": "Sweet Almond Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 16.00,
        "sku": "ELV-CO-ALM-NAT",
    },
    {
        "slug": "pure-fractionated-coconut-oil",
        "name": "Fractionated Coconut Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 18.00,
        "sku": "ELV-CO-COC-NAT",
    },
    {
        "slug": "pure-refined-macadamia-oil",
        "name": "Refined Macadamia Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 18.00,
        "sku": "ELV-CO-MAC-NAT",
    },
    {
        "slug": "pure-refined-apricot-kernel-oil",
        "name": "Refined Apricot Kernel Pure Carrier Oil",
        "category_slug": "pure-carrier-oils",
        "volume_ml": 100,
        "price": 17.00,
        "sku": "ELV-CO-APR-NAT",
    },
]

print(f'Updating {len(PRODUCTS_UPDATE)} products...')

for prod in PRODUCTS_UPDATE:
    cat_id = cat_map[prod["category_slug"]]
    slug = prod["slug"]
    name = prod["name"]
    vol = prod["volume_ml"]
    
    # 1. Update product table
    cur.execute('''
        UPDATE products 
        SET name = %s, category_id = %s, volume_ml = %s
        WHERE slug = %s
        RETURNING id
    ''', (name, cat_id, vol, slug))
    
    res = cur.fetchone()
    if not res:
        print(f'WARNING: Product not found with slug {slug}')
        continue
    prod_id = res[0]
    
    # 2. Clear old variants
    cur.execute('DELETE FROM product_variants WHERE product_id = %s', (prod_id,))
    
    # 3. Add new variants according to requirements
    if "price_10ml" in prod:
        # Essential oil: 10ml & 15ml
        cur.execute('''
            INSERT INTO product_variants (product_id, name, price, sku, stock, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (prod_id, '10 mL', prod["price_10ml"], f"{prod['sku']}-10ML", 120, 1))
        
        cur.execute('''
            INSERT INTO product_variants (product_id, name, price, sku, stock, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (prod_id, '15 mL', prod["price_15ml"], f"{prod['sku']}-15ML", 180, 2))
    else:
        # Carrier oil: 100ml
        cur.execute('''
            INSERT INTO product_variants (product_id, name, price, sku, stock, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (prod_id, '100 mL', prod["price"], f"{prod['sku']}-100ML", 150, 1))

# Diffuser
cur.execute("UPDATE products SET category_id = %s WHERE slug = 'ceramic-ultrasonic-aroma-diffuser'", (cat_map['wellbeing'],))

conn.commit()
print('All products, categories, and variants successfully updated!')
conn.close()
