"use client";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  {icon:"🎯",name:"First Quiz",desc:"Completed your first quiz",xp:50,unlocked:true},
  {icon:"🔥",name:"7-Day Streak",desc:"Maintained a 7-day study streak",xp:200,unlocked:false},
  {icon:"💯",name:"Perfect Score",desc:"Got 100% on any quiz",xp:300,unlocked:false},
  {icon:"🧠",name:"Neurology Master",desc:"Scored 90%+ in 10 Neurology quizzes",xp:500,unlocked:false},
  {icon:"❤️",name:"Cardio Champion",desc:"Completed 20 Cardiology quizzes",xp:400,unlocked:false},
  {icon:"📹",name:"Video Scholar",desc:"Completed 5 Video Quizzes",xp:250,unlocked:false},
  {icon:"📚",name:"All Categories",desc:"Complete a quiz in all 6 categories",xp:600,unlocked:false},
  {icon:"🤖",name:"AI Pioneer",desc:"Complete 20 AI-generated quizzes",xp:400,unlocked:false},
  {icon:"🦴",name:"Ortho Expert",desc:"Score 85%+ in Orthopedics",xp:350,unlocked:false},
  {icon:"👶",name:"Peds Pro",desc:"Complete 15 Pediatrics quizzes",xp:300,unlocked:false},
  {icon:"🏆",name:"Top 10",desc:"Reach top 10 on the leaderboard",xp:1000,unlocked:false},
  {icon:"⚡",name:"Speed Demon",desc:"Complete a 20-question quiz in 10 minutes",xp:300,unlocked:false},
  {icon:"🌟",name:"Level 10",desc:"Reach Level 10",xp:800,unlocked:false},
  {icon:"🎖️",name:"Consistency King",desc:"30-day study streak",xp:1500,unlocked:false},
  {icon:"🔬",name:"Derm Detective",desc:"Identify 50 skin conditions correctly",xp:450,unlocked:false},
  {icon:"🩺",name:"Clinical Genius",desc:"Score 95%+ on a case-based quiz",xp:600,unlocked:false},
  {icon:"💊",name:"Pharma Pro",desc:"Get 100% in any pharmacology section",xp:400,unlocked:false},
  {icon:"🎓",name:"Graduation Ready",desc:"Complete 500 total questions",xp:2000,unlocked:false},
  {icon:"🧬",name:"Genetics Guru",desc:"Complete all Oncology advanced questions",xp:500,unlocked:false},
  {icon:"🌍",name:"Global Learner",desc:"Study topics from 10+ specialties",xp:200,unlocked:false},
];

const unlocked=ACHIEVEMENTS.filter(a=>a.unlocked);
const locked=ACHIEVEMENTS.filter(a=>!a.unlocked);

function Card({icon,name,desc,xp,unlocked}:{icon:string;name:string;desc:string;xp:number;unlocked:boolean}){
  return(
    <div className="flex items-center gap-3 p-4 rounded-xl transition-all"
      style={{background:"var(--surface)",border:`1px solid ${unlocked?"var(--border2)":"var(--border)"}`,opacity:unlocked?1:0.55}}
      onMouseEnter={e=>{if(unlocked)(e.currentTarget as HTMLElement).style.transform="translateX(3px)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";}}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{background:unlocked?"rgba(255,201,60,0.12)":"var(--bg3)",border:`1px solid ${unlocked?"rgba(255,201,60,0.25)":"var(--border)"}`,filter:unlocked?"none":"grayscale(1)"}}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold mb-0.5" style={{color:"var(--text)"}}>{name}</div>
        <div className="text-xs mb-2 leading-relaxed" style={{color:"var(--text3)"}}>{desc}</div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{background:unlocked?"rgba(255,201,60,0.12)":"var(--bg3)",color:unlocked?"var(--yellow)":"var(--text3)",border:`1px solid ${unlocked?"rgba(255,201,60,0.25)":"var(--border)"}`}}>
          {unlocked?"✓":"🔒"} +{xp} XP
        </span>
      </div>
    </div>
  );
}

export default function AchievementsPage(){
  return(
    <div className="page-in">
      <div className="mb-6">
        <h2 className="font-syne text-2xl font-bold mb-1" style={{color:"var(--text)"}}>Achievements 🎖️</h2>
        <p className="text-sm" style={{color:"var(--text2)"}}>Collect badges as you progress through your medical journey</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          {label:"Unlocked",value:unlocked.length,color:"var(--green)",icon:"🔓"},
          {label:"Locked",value:locked.length,color:"var(--text3)",icon:"🔒"},
          {label:"Completion",value:`${Math.round((unlocked.length/ACHIEVEMENTS.length)*100)}%`,color:"var(--accent)",icon:"📊"},
          {label:"Badge XP",value:`${unlocked.reduce((s,a)=>s+a.xp,0).toLocaleString()}`,color:"var(--yellow)",icon:"⚡"},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="glass-card p-4 text-center hover:-translate-y-1 transition-all">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-syne text-xl font-bold mb-0.5" style={{color:s.color}}>{s.value}</div>
            <div className="text-xs" style={{color:"var(--text3)"}}>{s.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="glass-card p-4 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold" style={{color:"var(--text)"}}>Overall Progress</span>
          <span className="text-sm font-bold" style={{color:"var(--accent)"}}>{unlocked.length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{background:"var(--bg3)"}}>
          <motion.div initial={{width:0}} animate={{width:`${(unlocked.length/ACHIEVEMENTS.length)*100}%`}}
            transition={{duration:1.2,ease:"easeOut"}} className="h-full rounded-full"
            style={{background:"linear-gradient(90deg,#4f7fff,#a78bfa)"}}/>
        </div>
      </div>
      <h3 className="font-syne text-base font-bold mb-3" style={{color:"var(--green)"}}>✅ Unlocked ({unlocked.length})</h3>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
        initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.05}}}}>
        {unlocked.map((a,i)=>(
          <motion.div key={i} variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0}}}>
            <Card {...a}/>
          </motion.div>
        ))}
      </motion.div>
      <h3 className="font-syne text-base font-bold mb-3" style={{color:"var(--text3)"}}>🔒 Locked ({locked.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {locked.map((a,i)=><Card key={i} {...a}/>)}
      </div>
    </div>
  );
}
