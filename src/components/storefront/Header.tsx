"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, Search, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useFavourites } from '@/lib/favourites';
import { useCart } from '@/lib/cart';
const links = [['Shop all','/products'],['Essential oils','/products?category=essential-oils'],['Carrier oils','/products?category=carrier-oils'],['Skincare','/products?category=skincare'],['Home & wellbeing','/products?category=wellbeing'],['Our story','/about'],['The journal','/journal']];
export default function Header(){
 const {items:favourites}=useFavourites();
 const {itemCount,toggleCart}=useCart(); const [menu,setMenu]=useState(false);const [search,setSearch]=useState(false);
 return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape'){setMenu(false);setSearch(false)}}}>
 <div className="announcement"><span>A little nature. A little more you.</span><Link href="/shipping">Free AU shipping on orders $75+ <ArrowRight size={13}/></Link></div>
 <div className="brand-row wrap"><button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><Link href="/ritual-finder" className="header-note">Find your everyday ritual ↗</Link><Link href="/" aria-label="Elavenza Wellness home" className="brand-logo"><Image src="/images/elavenza-wellness-logo.png" alt="Elavenza Wellness" width={240} height={90} priority className="object-contain h-20 w-52"/></Link><div className="header-actions"><Link className="icon-button header-favourites" href="/favourites" aria-label={`Favourites, ${favourites.length} saved products`}><Heart size={20}/>{favourites.length>0&&<span>{favourites.length}</span>}</Link><button className="icon-button" aria-label="Search products" aria-expanded={search} onClick={()=>setSearch(!search)}><Search size={20}/></button><Link className="icon-button account-link" href="/account" aria-label="Your account"><User size={20}/></Link><button className="icon-button cart-trigger" onClick={toggleCart} aria-label={`Open bag, ${itemCount} items`}><ShoppingBag size={20}/><span>{itemCount}</span></button></div></div>
 <nav aria-label="Main navigation" className={`main-nav ${menu?'is-open':''}`}>{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setMenu(false)}>{label}</Link>)}</nav>
 {search&&<form className="search-panel wrap" action="/products"><label className="sr-only" htmlFor="header-search">Search products</label><input id="header-search" name="search" placeholder="What would you like to discover?" autoFocus required/><button className="button" type="submit">Search <ArrowRight size={16}/></button><button type="button" className="icon-button" aria-label="Close search" onClick={()=>setSearch(false)}><X/></button></form>}
 </header>
}
