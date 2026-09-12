import Link from 'next/link';
import Image from 'next/image';
import InfoPage from '@/components/storefront/InfoPage';
import {journal} from '@/lib/journal';
export const metadata={title:'The wellness journal',description:'Thoughtful notes on botanical rituals, simple routines and slower living.',alternates:{canonical:'/journal'}};
export default function Page(){return <InfoPage eyebrow="NOTES FOR SLOWER LIVING" title="The wellness journal." intro="Small ideas to bring a little more intention to your everyday.">{journal.map(p=><Link className="block mb-12" key={p.slug} href={`/journal/${p.slug}`}><Image src={`/images/${p.image}.jpg`} alt="" width={780} height={390} className="w-full h-64 object-cover mb-6"/><h2>{p.title}</h2><p>{p.intro}</p><span className="text-link">Read the story →</span></Link>)}</InfoPage>}
