(()=>{"use strict";
const COLS=6,ROWS=9,EMPTY=0;
const colors=n=>"n"+n;
const levels=[
 {type:"tens",target:5,label:"Make 5 Tens"},
 {type:"clears",target:16,label:"Clear 16 Numberlings"},
 {type:"score",target:600,label:"Reach 600 Score"},
 {type:"chain",target:2,label:"Make CHAIN ×2"},
 {type:"tens",target:10,label:"Make 10 Tens"}
];
let board,active,queue=[],score=0,best=+localStorage.getItem("tenDropBest")||0,level=0,progress=0,levelScoreStart=0,timer=null,fallMs=850,locked=false,bag=[],levelClearPending=false,levelTimer=null,runToken=0;
const $=s=>document.querySelector(s),boardEl=$("#board"),scoreEl=$("#score"),bestEl=$("#best"),callout=$("#callout");
function makeBoard(){return Array.from({length:ROWS},()=>Array(COLS).fill(EMPTY))}
function refillBag(){bag=[];for(let r=0;r<2;r++)for(let n=1;n<=9;n++)bag.push(n);for(let i=bag.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}}
function draw(){if(!bag.length)refillBag();return bag.pop()}
function ensureQueue(){while(queue.length<3)queue.push(draw())}
function spawn(){ensureQueue();active={n:queue.shift(),r:0,c:Math.floor(COLS/2)};ensureQueue();if(board[0][active.c])return gameOver();render();schedule()}
function schedule(){clearTimeout(timer);timer=setTimeout(step,fallMs)}
function can(r,c){return r>=0&&r<ROWS&&c>=0&&c<COLS&&!board[r][c]}
function step(){if(locked)return;if(can(active.r+1,active.c)){active.r++;render();schedule()}else lock()}
function move(dx){if(locked||!active)return;if(can(active.r,active.c+dx)){active.c+=dx;render()}}
function hardDrop(){if(locked||!active)return;while(can(active.r+1,active.c))active.r++;lock()}
async function lock(){clearTimeout(timer);locked=true;const token=runToken;board[active.r][active.c]=active.n;active=null;render();await resolve(token);if(token!==runToken)return;locked=false;if(level<levels.length&&!levelClearPending)spawn()}
function matchWave(){let cells=new Set,pairs=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){let n=board[r][c];if(!n)continue;[[1,0],[0,1]].forEach(([dr,dc])=>{let rr=r+dr,cc=c+dc;if(rr<ROWS&&cc<COLS&&board[rr][cc]&&n+board[rr][cc]===10){cells.add(r+","+c);cells.add(rr+","+cc);pairs.push([[r,c],[rr,cc]])}})}return{cells:[...cells].map(x=>x.split(",").map(Number)),pairs}}
function gravity(){for(let c=0;c<COLS;c++){let vals=[];for(let r=ROWS-1;r>=0;r--)if(board[r][c])vals.push(board[r][c]);for(let r=ROWS-1,i=0;r>=0;r--,i++)board[r][c]=vals[i]||0}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function resolve(token){let chain=0,totalCleared=0,totalTens=0;while(true){if(token!==runToken)return;let wave=matchWave(),m=wave.cells;if(!m.length)break;chain++;totalCleared+=m.length;totalTens+=wave.pairs.length;show(chain>=5?"FEVER 10!":chain>=3?"TEN-TASTIC!":"10! ×"+chain);m.forEach(([r,c])=>{let el=boardEl.children[r*COLS+c]?.querySelector(".blob");if(el)el.classList.add("pop")});await sleep(210);if(token!==runToken)return;m.forEach(([r,c])=>board[r][c]=0);score+=wave.pairs.length*100*chain;gravity();render();await sleep(160)}
if(token!==runToken)return;if(chain>=4)show("PERFECT TEN!");updateObjective(totalTens,totalCleared,chain);scoreEl.textContent=score;if(score>best){best=score;localStorage.setItem("tenDropBest",best);bestEl.textContent=best}}
function updateObjective(tens,clears,chain){let l=levels[level];if(!l)return;if(l.type==="tens")progress+=tens;if(l.type==="clears")progress+=clears;if(l.type==="score")progress=score-levelScoreStart;if(l.type==="chain")progress=Math.max(progress,chain);updateHud();if(progress>=l.target&&!levelClearPending){levelClearPending=true;const token=runToken;levelTimer=setTimeout(()=>{if(token===runToken)levelClear()},420)}}
function levelClear(){clearTimeout(timer);clearTimeout(levelTimer);levelTimer=null;locked=true;level++;progress=0;levelScoreStart=score;levelClearPending=false;if(level>=levels.length){showModal("CHAPTER CLEAR!","Five levels down. No ad here — this is the natural-break placeholder.","PLAY AGAIN",()=>reset())}else{showModal("LEVEL "+level+" CLEAR!","Next: "+levels[level].label,"NEXT LEVEL",()=>{locked=false;updateHud();spawn()})}}
function showModal(title,text,action,fn){$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalAction").textContent=action;$("#modal").classList.remove("hidden");$("#modalAction").onclick=()=>{$("#modal").classList.add("hidden");fn()}}
function gameOver(){clearTimeout(timer);locked=true;showModal("SO CLOSE!","Score "+score+" · Best "+Math.max(score,best),"ONE MORE RUN",reset)}
function reset(){runToken++;clearTimeout(timer);clearTimeout(levelTimer);levelTimer=null;board=makeBoard();active=null;queue=[];bag=[];score=0;level=0;progress=0;levelScoreStart=0;levelClearPending=false;fallMs=850;locked=false;scoreEl.textContent=0;bestEl.textContent=best;updateHud();spawn()}
function show(t){callout.textContent=t;callout.classList.remove("show");void callout.offsetWidth;callout.classList.add("show")}
function nearCells(){let out=new Set;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){let n=board[r][c];if(!n)continue;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{let rr=r+dr,cc=c+dc;if(rr>=0&&rr<ROWS&&cc>=0&&cc<COLS&&board[rr][cc]&&n+board[rr][cc]===10)out.add(r+","+c)})}return out}
function blob(n,activeFlag=false,near=false){let d=document.createElement("div");d.className="blob "+colors(n)+(activeFlag?" active":"")+(near?" near":"");d.textContent=n;return d}
function render(){boardEl.innerHTML="";let near=nearCells();for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){let cell=document.createElement("div");cell.className="cell"+(r<2?" danger":"");let n=board[r][c];if(n)cell.appendChild(blob(n,false,near.has(r+","+c)));if(active&&active.r===r&&active.c===c)cell.appendChild(blob(active.n,true,false));boardEl.appendChild(cell)}renderPreview()}
function mini(el,n){el.innerHTML="";let b=blob(n);b.classList.add("mini");el.appendChild(b)}
function renderPreview(){if(active)mini($("#now"),active.n);if(queue[0])mini($("#next1"),queue[0]);if(queue[1])mini($("#next2"),queue[1])}
function updateHud(){let l=levels[level]||levels[0];$("#levelLabel").textContent="LEVEL "+(level+1);$("#objective").textContent=l.label;$("#progress").style.width=Math.min(100,(progress/l.target)*100)+"%"}
$("#left").onclick=()=>move(-1);$("#right").onclick=()=>move(1);$("#drop").onclick=hardDrop;$("#restart").onclick=reset;
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);if(e.key==="ArrowDown"||e.key===" ")hardDrop()});
let sx=0,sy=0;boardEl.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});boardEl.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else if(dy>45)hardDrop()},{passive:true});
reset();
})();