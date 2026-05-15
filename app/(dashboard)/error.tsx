"use client";
import { useEffect } from "react";
export default function DashboardError({error,reset}:{error:Error;reset:()=>void}){
  useEffect(()=>{console.error(error);},[error]);
  return(
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="text-5xl mb-4">🩺</div>
      <h2 className="font-syne text-xl font-bold mb-2" style={{color:"var(--text)"}}>Something went wrong</h2>
      <p className="text-sm mb-6 max-w-sm" style={{color:"var(--text3)"}}>{error.message??"An unexpected error occurred."}</p>
      <button onClick={reset} className="px-6 py-2.5 rounded-xl text-sm font-semibold"
        style={{background:"linear-gradient(135deg,#4f7fff,#a78bfa)",color:"#fff"}}>Try Again</button>
    </div>
  );
}
