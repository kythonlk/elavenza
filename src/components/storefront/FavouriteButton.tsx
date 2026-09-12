"use client";
import {Heart} from 'lucide-react';
import {useFavourites} from '@/lib/favourites';
export default function FavouriteButton({product,label=false}:{product:{id:number;slug:string;name:string;images?:string[];category?:{name:string}};label?:boolean}){
 const {items,toggle,ready,error}=useFavourites();const saved=items.some(x=>x.id===product.id);
 return <span className="favourite-control"><button type="button" disabled={!ready} className={`favourite-button ${saved?'is-saved':''} ${label?'with-label':''}`} aria-label={`${saved?'Remove':'Save'} ${product.name} ${saved?'from':'to'} favourites`} aria-pressed={saved} onClick={()=>toggle({id:product.id,slug:product.slug,name:product.name,image:product.images?.[0]||'/images/prod-lavender.jpg',category:product.category?.name||'Botanical wellness'})}><Heart size={19} fill={saved?'currentColor':'none'}/>{label&&<span>{saved?'Saved to favourites':'Save for later'}</span>}</button>{error&&<span className="favourite-error" role="status">{error}</span>}</span>
}
