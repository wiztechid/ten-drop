"use strict";
const assert=require("node:assert/strict");
const Core=require("../js/core.js");
const ROWS=9,COLS=6,RUNS=100,MAX_DROPS=180;

function rng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296}}
function sequence(seed,n=MAX_DROPS+3,level=4){const r=rng(seed),out=[];while(out.length<n)out.push(...Core.shuffledBag(r,Core.unlockedPool(level)));return out.slice(0,n)}
function landing(board,c){for(let r=ROWS-1;r>=0;r--)if(!board[r][c])return r;return -1}
function place(board,c,n){const r=landing(board,c);if(r<0)return null;const b=board.map(x=>x.slice());b[r][c]=n;return Core.resolveBoard(b)}
function features(res){let t2=0,t3=0;for(const w of res.waves){t2+=w.sizes.filter(x=>x===2).length;t3+=w.sizes.filter(x=>x===3).length}return{t2,t3,chain:res.chain,score:res.score,clears:res.clears}}
function legal(board){return Array.from({length:COLS},(_,c)=>c).filter(c=>landing(board,c)>=0)}

function partialPotential(board,nexts){let p=0;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const a=board[r][c];if(!a)continue;for(const [dr,dc] of [[1,0],[0,1]]){const rr=r+dr,cc=c+dc;if(rr>=ROWS||cc>=COLS)continue;const b=board[rr][cc];if(!b)continue;const need=10-a-b;if(need>=1&&need<=9){if(nexts[0]===need)p+=5;if(nexts[1]===need)p+=2}}}return p}
function deliberate(board,n,nexts=[]){
 let best=null;
 for(const c of legal(board)){const res=place(board,c,n),f=features(res);
   const heights=Array.from({length:COLS},(_,cc)=>ROWS-1-landing(res.board,cc)).map(x=>x<0?ROWS:x);
   const maxH=Math.max(...heights),rough=heights.slice(1).reduce((a,h,i)=>a+Math.abs(h-heights[i]),0);
   const value=f.t2*8+f.t3*18+Math.max(0,f.chain-1)*28+f.clears*2+partialPotential(res.board,nexts)-maxH*.45-rough*.08;
   if(!best||value>best.value||(value===best.value&&c<best.c))best={c,value};
 }
 return best?.c??-1;
}
function spam(board,random){const a=legal(board);return a.length?a[Math.floor(random()*a.length)]:-1}

function run(seed,policy,level=4){let board=Core.makeBoard(ROWS,COLS),seq=sequence(seed,MAX_DROPS+3,level),r=rng(seed^0x9e3779b9);
 let m={drops:0,tens2:0,tens3:0,chains2:0,chains3:0,maxChain:0,score:0};
 for(let i=0;i<MAX_DROPS;i++){const a=legal(board);if(!a.length)break;const c=policy==="deliberate"?deliberate(board,seq[i],[seq[i+1],seq[i+2]]):spam(board,r);if(c<0)break;
   const res=place(board,c,seq[i]),f=features(res);board=res.board;m.drops++;m.tens2+=f.t2;m.tens3+=f.t3;m.score+=f.score;
   if(f.chain>=2)m.chains2++;if(f.chain>=3)m.chains3++;m.maxChain=Math.max(m.maxChain,f.chain);
 }
 return m;
}
function sum(a){return a.reduce((o,x)=>{for(const k in x)o[k]=(o[k]||0)+x[k];return o},{})}
const D=[],S=[];for(let seed=1;seed<=RUNS;seed++){D.push(run(seed,"deliberate",4));S.push(run(seed,"spam",4))}
function report(xs){const z=sum(xs),drops=z.drops||1;return{runs:RUNS,drops:z.drops,avgDrops:+(z.drops/RUNS).toFixed(2),ten2Per100:+(100*z.tens2/drops).toFixed(2),ten3Per100:+(100*z.tens3/drops).toFixed(2),ten3SharePct:+(100*z.tens3/Math.max(1,z.tens2+z.tens3)).toFixed(2),chain2Per100:+(100*z.chains2/drops).toFixed(2),chain3Per100:+(100*z.chains3/drops).toFixed(2),maxChain:Math.max(...xs.map(x=>x.maxChain)),scorePer100:+(100*z.score/drops).toFixed(1)}}
const d=report(D),s=report(S);
console.log(JSON.stringify({contract:"v0.6.1 2-3 exact-10; matched Fair-Bag seeds; deliberate=current-board heuristic; spam=random legal column",deliberate:d,spam:s},null,2));
assert.ok(Number.isFinite(d.avgDrops)&&Number.isFinite(s.avgDrops),"simulation metrics must be finite");
const signal={survival:d.avgDrops>s.avgDrops,ten3Skill:d.ten3Per100>s.ten3Per100,chainSkill:d.chain2Per100>s.chain2Per100};
console.log("CORE_DNA_SIGNAL",JSON.stringify(signal));

const progression=[];
for(let level=0;level<5;level++){const d=[],sp=[];for(let seed=1;seed<=RUNS;seed++){d.push(run(seed,"deliberate",level));sp.push(run(seed,"spam",level))}progression.push({level:level+1,pool:Core.unlockedPool(level),deliberate:report(d),spam:report(sp)})}
console.log("UNLOCK_PROGRESSION",JSON.stringify(progression));


function chainAware(board,n,nexts=[]){
 let best=null;
 for(const c of legal(board)){const res=place(board,c,n),f=features(res);
   const heights=Array.from({length:COLS},(_,cc)=>ROWS-1-landing(res.board,cc)).map(x=>x<0?ROWS:x);
   const maxH=Math.max(...heights),rough=heights.slice(1).reduce((a,h,i)=>a+Math.abs(h-heights[i]),0);
   // Same visible information as a player: current piece + truthful NEXT/NEXT. No future oracle.
   // CHAIN is prioritized over immediate TEN value to test whether current physics permits intentional cascades.
   const value=Math.max(0,f.chain-1)*250+f.t3*22+f.t2*8+f.clears*2+partialPotential(res.board,nexts)*1.5-maxH*.45-rough*.08;
   if(!best||value>best.value||(value===best.value&&c<best.c))best={c,value};
 }
 return best?.c??-1;
}
function runChainAware(seed,level=4){let board=Core.makeBoard(ROWS,COLS),seq=sequence(seed,MAX_DROPS+3,level);
 let m={drops:0,tens2:0,tens3:0,chains2:0,chains3:0,maxChain:0,score:0};
 for(let i=0;i<MAX_DROPS;i++){if(!legal(board).length)break;const c=chainAware(board,seq[i],[seq[i+1],seq[i+2]]);if(c<0)break;
  const res=place(board,c,seq[i]),f=features(res);board=res.board;m.drops++;m.tens2+=f.t2;m.tens3+=f.t3;m.score+=f.score;if(f.chain>=2)m.chains2++;if(f.chain>=3)m.chains3++;m.maxChain=Math.max(m.maxChain,f.chain);
 }return m;
}
const chainOpportunity=[];
for(let level=0;level<5;level++){const ca=[],sp=[];for(let seed=1;seed<=RUNS;seed++){ca.push(runChainAware(seed,level));sp.push(run(seed,"spam",level))}chainOpportunity.push({level:level+1,pool:Core.unlockedPool(level),chainAware:report(ca),spam:report(sp)})}
console.log("CHAIN_OPPORTUNITY",JSON.stringify(chainOpportunity));
