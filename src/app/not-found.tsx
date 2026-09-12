import Link from 'next/link';
export default function NotFound(){return <div className="wrap section text-center"><p className="eyebrow">A SMALL DETOUR</p><h1 className="text-4xl mb-5">Let’s find your way back.</h1><p className="mb-8 text-text-muted">This page may have moved, or the product is no longer available.</p><Link href="/products" className="button">Explore the collection →</Link></div>}
