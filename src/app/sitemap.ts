import type {MetadataRoute} from 'next';
import {query} from '@/lib/db';
import {journal} from '@/lib/journal';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const site=process.env.NEXT_PUBLIC_SITE_URL;if(!site)return [];const paths=['','/products','/about','/shipping','/shipping/international','/returns','/certifications','/faq','/journal','/ritual-finder',...journal.map(p=>`/journal/${p.slug}`)];const result=await query<{slug:string}>('SELECT slug FROM products WHERE is_active = true');paths.push(...result.rows.map(p=>`/products/${p.slug}`));return paths.map(path=>({url:new URL(path,site).href}))}
