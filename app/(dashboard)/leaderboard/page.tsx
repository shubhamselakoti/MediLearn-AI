"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LeaderboardEntry } from "@/types";

const MOCK: LeaderboardEntry[] = [
  { rank:1,userId:"1",name:"Arjun Mehta",xp:8920,streak:45,level:18},
  { rank:2,userId:"2",name:"Priya Nair",xp:7840,streak:32,level:16},
  { rank:3,userId:"3",name:"Rohan Singh",xp:7120,streak:28,level:15},
  { rank:4,userId:"4",name:"Ananya Patel",xp:6580,streak:21,level:14},
  { rank:5,userId:"5",name:"Vikram Raj",xp:5940,streak:19,level:12},
  { rank:6,userId:"6",name:"Deepa Kumar",xp:5230,streak:15,level:11},
  { rank:7,userId:"7",name:"Sanjay Iyer",xp:4810,streak:12,level:10},
  { rank:8,userId:"8",name:"Kavya Reddy",xp:4450,streak:9,level:9},
  { rank:9,userId:"9",name:"Aditya Gupta",xp:4100,streak:8,level:9},
  { rank:10,userId:"10",name:"Meera Joshi",xp:3780,streak:7,level:8},
  { rank:11,userId:"11",name:"Rahul Verma",xp:3420,streak:6,level:7},
  { rank:12,userId:"12",name:"Sneha Das",xp:3150,streak:5,level:7},
  { rank:13,userId:"13",name:"Karthik M.",xp:2900,streak:5,level:6},
  { rank:14,userId:"me",name:"You",xp:2450,streak:7,level:5,isCurrentUser:true},
];

const RANK_STYLES: Record<number,{badge:string;bg:string;border:string}> = {
  1:{badge:"🥇",bg:"rgba(255,201,60,0.08)",border:"rgba(255,201,60,0.25)"},
  2:{badge:"🥈",bg:"rgba(192,192,192,0.08)",border:"rgba(192,192,192,0.25)"},
  3:{badge:"🥉",bg:"rgba(205,127,50,0.08)",border:"rgba(205,127,50,0.25)"},
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(MOCK);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/user/leaderboard").then(r=>r.json())
      .then(d=>{if(d.success&&d.data.length>0)setEntries(d.data);})
      .catch(()=>{});
  }, []);

  const myEntry = entries.find(e=>e.isCurrentUser);

  return (
    <div className="page-in">
      <div className="mb-6">
        <h2 className="font-syne text-2xl font-bold mb-1" style={{color:"var(--text)"}}>Leaderboard 🏆</h2>
        <p className="text-sm" style={{color:"var(--text2)"}}>See how you rank among fellow medical students</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          {label:"Your Rank",value:`#${myEntry?.rank??14}`,color:"var(--accent)",icon:"🎯"},
          {label:"Percentile",value:"Top 6%",color:"var(--green)",icon:"📈"},
          {label:"Your XP",value:(myEntry?.xp??2450).toLocaleString(),color:"var(--yellow)",icon:"⚡"},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="glass-card p-4 text-center hover:-translate-y-1 transition-all">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-syne text-2xl font-bold mb-0.5" style={{color:s.color}}>{s.value}</div>
            <div className="text-xs" style={{color:"var(--text3)"}}>{s.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="glass-card p-5">
        <div className="flex justify-between items-center mb-5">
          <div className="font-syne text-base font-bold" style={{color:"var(--text)"}}>Global Rankings</div>
          <div className="flex gap-2">
            {["all","week","today"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={{
                  background:filter===f?"linear-gradient(135deg,#4f7fff,#a78bfa)":"var(--surface2)",
                  color:filter===f?"#fff":"var(--text2)",
                  border:`1px solid ${filter===f?"transparent":"var(--border)"}`,
                }}>
                {f==="all"?"All Time":f==="week"?"This Week":"Today"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-center gap-4 mb-6">
          {[entries[1],entries[0],entries[2]].map((e,i)=>e&&(
            <div key={e.userId} className="flex flex-col items-center gap-1.5 flex-1">
              {i===1&&<div className="text-xl">👑</div>}
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                style={{background:"linear-gradient(135deg,#4f7fff,#a78bfa)",color:"#fff"}}>
                {(e.name??"U").slice(0,2).toUpperCase()}
              </div>
              <div className="text-xs font-semibold truncate" style={{color:"var(--text)"}}>{e.name?.split(" ")[0]}</div>
              <div className="text-xs font-bold" style={{color:"var(--yellow)"}}>{e.xp.toLocaleString()}</div>
              <div className="w-full rounded-t-lg flex items-end justify-center"
                style={{height:[80,110,65][i],background:"linear-gradient(to top,rgba(79,127,255,0.2),rgba(167,139,250,0.08))",border:"1px solid rgba(79,127,255,0.15)"}}>
                <span className="mb-1 text-xs font-bold" style={{color:"var(--text3)"}}>#{e.rank}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {entries.map((entry,i)=>{
            const rs=RANK_STYLES[entry.rank];
            const isMe=entry.isCurrentUser;
            return (
              <motion.div key={entry.userId} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background:isMe?"rgba(79,127,255,0.10)":rs?rs.bg:"transparent",
                  border:`1px solid ${isMe?"rgba(79,127,255,0.30)":rs?rs.border:"transparent"}`,
                }}>
                <div className="w-8 text-center font-bold text-sm flex-shrink-0"
                  style={{color:rs?"var(--yellow)":isMe?"var(--accent)":"var(--text3)"}}>
                  {rs?rs.badge:`#${entry.rank}`}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{background:isMe?"linear-gradient(135deg,#4f7fff,#a78bfa)":"var(--surface3)",color:"#fff",border:isMe?"2px solid rgba(79,127,255,0.5)":"1px solid var(--border)"}}>
                  {(entry.name??"U").slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{color:isMe?"var(--accent)":"var(--text)"}}>
                    {entry.name}{isMe?" (You)":""}
                  </div>
                  <div className="text-xs" style={{color:"var(--text3)"}}>🔥 {entry.streak} streak · Level {entry.level}</div>
                </div>
                <div className="text-sm font-bold" style={{color:"var(--yellow)"}}>{entry.xp.toLocaleString()} XP</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
