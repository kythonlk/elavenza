"use client";
import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
export interface Favourite {id:number;slug:string;name:string;image:string;category:string}
const Context=createContext<{items:Favourite[];toggle:(item:Favourite)=>void;ready:boolean;error:string}|null>(null);
export function FavouritesProvider({children}:{children:ReactNode}) {
  const [items,setItems]=useState<Favourite[]>([]);
  const [ready,setReady]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{
    const read=()=>{try{const parsed:unknown=JSON.parse(localStorage.getItem('elavenza-favourites')||'[]');if(Array.isArray(parsed))setItems(parsed.filter((x):x is Favourite=>x&&Number.isSafeInteger(x.id)&&typeof x.slug==='string'&&typeof x.name==='string'&&typeof x.image==='string'&&typeof x.category==='string'));}catch{setError('Saved for this visit only: browser storage is unavailable.')}setReady(true)};
    read();const sync=(e:StorageEvent)=>{if(e.key==='elavenza-favourites')read()};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
  },[]);
  function toggle(item:Favourite){const next=items.some(x=>x.id===item.id)?items.filter(x=>x.id!==item.id):[...items,item];setItems(next);try{localStorage.setItem('elavenza-favourites',JSON.stringify(next));setError('')}catch{setError('Saved for this visit only: browser storage is unavailable.')}}
  return <Context.Provider value={{items,toggle,ready,error}}>{children}</Context.Provider>;
}
export function useFavourites(){const value=useContext(Context);if(!value)throw new Error('FavouritesProvider required');return value}
