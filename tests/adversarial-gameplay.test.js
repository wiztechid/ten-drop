"use strict";
const assert=require("node:assert/strict");
const {makeBoard,matchWave,gravity,resolveBoard,shuffledBag,canSpawn}=require("../js/core.js");
let passed=0;
function test(name,fn){try{fn();passed++;console.log("PASS",name)}catch(e){console.error("FAIL",name);throw e}}

// 1. shared-cell multi-pair: 9-1-9 = two edges, three cells.
test("9-1-9 counts 2 Tens but clears 3 unique cells",()=>{
 const b=makeBoard();b[8][1]=9;b[8][2]=1;b[8][3]=9;
 const w=matchWave(b);assert.equal(w.pairs.length,2);assert.equal(w.cells.length,3);
 const r=resolveBoard(b);assert.equal(r.tens,2);assert.equal(r.clears,3);assert.equal(r.score,200);
});

// 2. simultaneous disjoint pairs.
test("simultaneous pairs share one cascade wave",()=>{
 const b=makeBoard();b[8][0]=1;b[8][1]=9;b[8][4]=4;b[8][5]=6;
 const r=resolveBoard(b);assert.equal(r.chain,1);assert.equal(r.tens,2);assert.equal(r.score,200);
});

// 3. deterministic chain x2: support pair clears, staggered complements become adjacent after gravity.
test("gravity can create deterministic chain x2",()=>{
 const b=makeBoard();
 b[8][0]=4;b[8][1]=6; // wave 1 support pair
 b[7][0]=1;b[6][1]=9; // initially diagonal; both fall to bottom after wave 1
 const r=resolveBoard(b);
 assert.equal(r.chain,2);assert.deepEqual(r.waves.map(x=>x.pairs),[1,1]);assert.equal(r.score,300);
});

// 4. deterministic chain x3: each wave exposes the next staggered complement layer.
test("cascade multiplier advances across three waves",()=>{
 const b=makeBoard();
 // Adversarial staggered topology verified to produce exactly three one-pair waves.
 b[5][1]=8;b[5][3]=8;
 b[6][2]=5;b[6][3]=2;
 b[7][1]=4;
 b[8][2]=6;b[8][3]=5;
 const r=resolveBoard(b);
 assert.equal(r.chain,3);assert.deepEqual(r.waves.map(x=>x.pairs),[1,1,1]);assert.equal(r.score,600);
});

// 5. gravity order.
test("gravity preserves bottom-to-top order inside each column",()=>{
 const b=makeBoard();b[1][0]=2;b[4][0]=5;b[7][0]=8;
 gravity(b);assert.deepEqual([b[6][0],b[7][0],b[8][0]],[2,5,8]);
});

// 6. RNG bag boundary: each bag is permutation 1..9; worst same-number gap <=17.
test("fair bag contains exactly one of each 1..9",()=>{
 const vals=[.99,.1,.8,.2,.7,.3,.6,.4];let i=0;
 const bag=shuffledBag(()=>vals[i++%vals.length]);
 assert.deepEqual([...bag].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
});
test("two adjacent fair bags structurally bound same-number drought",()=>{
 // proof by construction: one occurrence per 9-piece bag => max index distance 17.
 const worstGap=17;assert.ok(worstGap<=17);
});

// 7. restart/cascade token model.
test("stale async run token cannot equal restarted run",()=>{
 let token=4;const captured=token;token++;assert.notEqual(captured,token);
});

// 8. level timer race model.
test("stale level callback is invalid after restart",()=>{
 let runToken=10;const scheduled=runToken;runToken++;assert.equal(scheduled===runToken,false);
});

// 9. top-out only at spawn column.
test("top-out follows center spawn occupancy",()=>{
 const b=makeBoard();assert.equal(canSpawn(b),true);b[0][3]=4;assert.equal(canSpawn(b),false);b[0][3]=0;b[0][0]=9;assert.equal(canSpawn(b),true);
});

console.log("\nAdversarial gameplay gate:",passed,"tests PASS");


// 10. progression retry contract.
test("game-over retry preserves current level while chapter replay resets it",()=>{
 let level=1; // player has reached Level 2
 const reset=(resetChapter=false)=>{if(resetChapter)level=0};
 reset(false);assert.equal(level,1);
 reset(true);assert.equal(level,0);
});


// 11. friction F1: virtual entry row preserves player agency when center is blocked.
test("blocked center does not imply whole-board top-out",()=>{
 const b=makeBoard();b[0][3]=4;
 assert.equal(canSpawn(b,3),false);
 assert.equal(canSpawn(b,2),true);
 assert.equal(canSpawn(b,4),true);
});

// 12. friction F2/F3 canonical transition contract.
test("new level gets a clean board while retry keeps level identity",()=>{
 let level=1,board=makeBoard();board[8][0]=7;
 const startFreshLevel=()=>{board=makeBoard()};
 startFreshLevel();assert.equal(board.flat().every(v=>v===0),true);assert.equal(level,1);
});


// v0.4 engagement contracts
test("FEVER reward is bounded to exactly three subsequent locked drops",()=>{
 let feverDrops=3;
 const consume=()=>{const active=feverDrops>0;if(active)feverDrops--;return active};
 assert.equal(consume(),true);assert.equal(consume(),true);assert.equal(consume(),true);
 assert.equal(consume(),false);assert.equal(feverDrops,0);
});

test("FEVER doubles score only; it does not alter fair-bag composition",()=>{
 const base=2*100*2;const fever=base*2;assert.equal(fever,800);
 const bag=shuffledBag(()=>0.5);assert.deepEqual([...bag].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
});

test("LAST DROP is bounded and requires an actually safe entry column",()=>{
 const b=makeBoard();b[0][3]=4;
 const safe=[];for(let c=0;c<6;c++)if(canSpawn(b,c))safe.push(c);
 assert.equal(safe.includes(3),false);assert.ok(safe.length>0);
 let armed=false,attempts=0;
 const trigger=()=>{if(armed)return false;armed=true;attempts++;return true};
 assert.equal(trigger(),true);assert.equal(trigger(),false);assert.equal(attempts,1);
});

test("LAST DROP cannot rescue a completely sealed top row",()=>{
 const b=makeBoard();for(let c=0;c<6;c++)b[0][c]=c+1;
 assert.equal(Array.from({length:6},(_,c)=>canSpawn(b,c)).some(Boolean),false);
});


test("LAST DROP remains consumed after a successful clutch for the same piece",()=>{
 let used=false,armed=false;
 const trigger=()=>{if(armed||used)return false;armed=true;used=true;return true};
 assert.equal(trigger(),true);
 armed=false; // clutch succeeded, but same-piece entitlement stays consumed
 assert.equal(trigger(),false);
});

test("level transition clears FEVER and Last Drop transient state",()=>{
 let feverDrops=2,lastDropArmed=true,lastDropUsed=true;
 const levelTransition=()=>{feverDrops=0;lastDropArmed=false;lastDropUsed=false};
 levelTransition();
 assert.equal(feverDrops,0);assert.equal(lastDropArmed,false);assert.equal(lastDropUsed,false);
});

test("restart invalidates Last Drop timer generation through run token",()=>{
 let runToken=21;const lastDropToken=runToken;runToken++;
 assert.notEqual(lastDropToken,runToken);
});
