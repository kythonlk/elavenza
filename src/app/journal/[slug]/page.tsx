import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import InfoPage from '@/components/storefront/InfoPage';
import {journal} from '@/lib/journal';
export function generateStaticParams(){return journal.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=journal.find(p=>p.slug===slug);return post?{title:post.title,description:post.intro,alternates:{canonical:`/journal/${slug}`},openGraph:{type:'article',title:post.title,description:post.intro,images:[`/images/${post.image}.${post.image.startsWith('banner-')?'png':'jpg'}`]}}:{title:'Story not found'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=journal.find(p=>p.slug===slug);if(!post)notFound();return <InfoPage eyebrow={`THE WELLNESS JOURNAL / ${post.category.toUpperCase()}`} title={post.title} intro={post.intro}><div className="journal-feature-image"><Image src={`/images/${post.image}.${post.image.startsWith('banner-')?'png':'jpg'}`} alt="" fill sizes="(max-width:760px) 100vw, 780px" className="object-cover" priority/></div>{post.sections.map(([title,text])=><section className="journal-article-section" key={title}><h2>{title}</h2><p>{text}</p></section>)}<div className="flex flex-wrap gap-6"><Link className="text-link" href="/ritual-finder">Find your everyday ritual →</Link><Link className="text-link" href="/journal">More from the journal →</Link></div></InfoPage>}
