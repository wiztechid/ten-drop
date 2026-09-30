"use strict";

function makeBoard(rows=9,cols=6){return Array.from({length:rows},()=>Array(cols).fill(0))}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const key=([r,c])=>r+","+c;
const cmpCells=(a,b)=>{const aa=a.map(key).sort().join("|"),bb=b.map(key).sort().join("|");return aa.localeCompare(bb)};

function tenCandidates(board){
  const rows=board.length,cols=board[0].length,out=new Map(),seen=new Set();
  function canonical(cells){return [...cells].sort((a,b)=>a[0]-b[0]||a[1]-b[1])}
  function grow(cells,sum){
    const sorted=canonical(cells),sig=sorted.map(key).join("|");
    if(seen.has(sig))return;seen.add(sig);
    if(sum===10&&sorted.length>=2){out.set(sig,sorted);return}
    if(sum>=10||sorted.length>=3)return;
    const member=new Set(sorted.map(key)),frontier=new Map();
    for(const [r,c] of sorted)for(const [dr,dc] of DIRS){const rr=r+dr,cc=c+dc,k=rr+","+cc;if(rr>=0&&rr<rows&&cc>=0&&cc<cols&&board[rr][cc]&&!member.has(k))frontier.set(k,[rr,cc])}
    for(const p of [...frontier.values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1])){
      const v=board[p[0]][p[1]];if(sum+v<=10)grow([...sorted,p],sum+v);
    }
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(board[r][c])grow([[r,c]],board[r][c]);
  return [...out.values()].sort((a,b)=>b.length-a.length||cmpCells(a,b));
}

function selectTenGroups(candidates){
  let best=[],bestCells=-1;
  function signature(groups){return groups.map(g=>g.map(key).sort().join("|")).sort().join("~")}
  function walk(i,used,picked,count){
    if(i===candidates.length){
      if(count>bestCells||count===bestCells&&(picked.length>best.length||picked.length===best.length&&signature(picked)<signature(best))){best=picked.map(g=>g.slice());bestCells=count}
      return;
    }
    walk(i+1,used,picked,count);
    const g=candidates[i],ks=g.map(key);if(ks.every(k=>!used.has(k))){
      const nu=new Set(used);ks.forEach(k=>nu.add(k));walk(i+1,nu,[...picked,g],count+g.length);
    }
  }
  walk(0,new Set(),[],0);return best;
}

function matchWave(board){
  const groups=selectTenGroups(tenCandidates(board)),seen=new Map();
  for(const g of groups)for(const p of g)seen.set(key(p),p);
  return {cells:[...seen.values()],groups,pairs:groups.filter(g=>g.length===2)};
}

function gravity(board){
  const rows=board.length,cols=board[0].length;
  for(let c=0;c<cols;c++){const vals=[];for(let r=rows-1;r>=0;r--)if(board[r][c])vals.push(board[r][c]);for(let r=rows-1,i=0;r>=0;r--,i++)board[r][c]=vals[i]||0}
  return board;
}

function groupBaseScore(group){return group.length===3?180:100}

function resolveBoard(input){
  const board=input.map(r=>r.slice());let chain=0,score=0,tens=0,clears=0,waves=[];
  while(true){const wave=matchWave(board);if(!wave.cells.length)break;chain++;tens+=wave.groups.length;clears+=wave.cells.length;score+=wave.groups.reduce((n,g)=>n+groupBaseScore(g),0)*chain;waves.push({groups:wave.groups.length,pairs:wave.pairs.length,cells:wave.cells.length,sizes:wave.groups.map(g=>g.length)});for(const [r,c] of wave.cells)board[r][c]=0;gravity(board)}
  return {board,chain,score,tens,clears,waves};
}

function unlockedPool(level=0){const max=Math.min(9,5+Math.max(0,level));return Array.from({length:max},(_,i)=>i+1)}
function shuffledBag(random=Math.random,pool=unlockedPool(4)){const bag=[...pool];for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}return bag}
function unlockedMaxForLevel(level=0){return Math.min(9,5+Math.max(0,Math.floor(level)))}
function canSpawn(board,col=Math.floor(board[0].length/2)){return board[0][col]===0}
const api={makeBoard,tenCandidates,selectTenGroups,matchWave,gravity,resolveBoard,groupBaseScore,unlockedPool,unlockedMaxForLevel,shuffledBag,canSpawn};
if(typeof module!=="undefined")module.exports=api;
if(typeof window!=="undefined")window.TenDropCore=api;
