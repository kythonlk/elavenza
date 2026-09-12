"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="wrap section"><h1 className="text-3xl mb-4">A little pause.</h1><p className="mb-6">We couldn’t load this page. Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button></div>}
