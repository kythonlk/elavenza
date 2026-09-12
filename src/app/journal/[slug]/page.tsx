import {notFound} from 'next/navigation';
import Link from 'next/link';
import InfoPage from '@/components/storefront/InfoPage';
import {journal} from '@/lib/journal';
export function generateStaticParams(){return journal.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=journal.find(p=>p.slug===slug);return post?{title:post.title,description:post.intro,alternates:{canonical:`/journal/${slug}`}}:{title:'Story not found'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=journal.find(p=>p.slug===slug);if(!post)notFound();return <InfoPage eyebrow="THE WELLNESS JOURNAL" title={post.title} intro={post.intro}>{post.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}<Link className="text-link" href="/ritual-finder">Find your everyday ritual →</Link></InfoPage>}
