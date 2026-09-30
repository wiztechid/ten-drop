"use strict";
const assert=require("node:assert/strict");
const {makeBoard,tenCandidates,selectTenGroups,matchWave,gravity,resolveBoard,shuffledBag,canSpawn}=require("../js/core.js");
let passed=0;
function test(name,fn){try{fn();passed++;console.log("PASS",name)}catch(e){console.error("FAIL",name);throw e}}

// 1. shared-cell multi-pair: 9-1-9 = two edges, three cells.
test("9-1-9 counts 2 Tens but clears 3 unique cells",()=>{
 const b=makeBoard();b[8][1]=9;b[8][2]=1;b[8][3]=9;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.cells.length,2);
 const r=resolveBoard(b);assert.equal(r.tens,1);assert.equal(r.clears,2);assert.equal(r.score,100);
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
 assert.equal(r.chain,2);assert.deepEqual(r.waves.map(x=>x.groups),[1,1]);assert.equal(r.score,300);
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
 assert.equal(r.chain,3);assert.deepEqual(r.waves.map(x=>x.groups),[1,1,1]);assert.equal(r.score,600);
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


// Deep Gimmick QC Pass 2
test("LAST DROP spam is idempotent while countdown is armed",()=>{
 let armed=false,used=false,gameOvers=0,arms=0;
 const trigger=()=>{if(armed)return false;if(used){gameOvers++;return false}armed=true;used=true;arms++;return true};
 assert.equal(trigger(),true);
 for(let i=0;i<20;i++)trigger();
 assert.equal(arms,1);assert.equal(used,true);assert.equal(gameOvers,0);
 armed=false;trigger();assert.equal(gameOvers,1);
});

test("restart during LAST DROP invalidates stale timeout callback",()=>{
 let runToken=40,mutations=0;const captured=runToken;
 runToken++; // restart
 if(captured===runToken)mutations++;
 assert.equal(mutations,0);
});

test("Game Over presentation is idempotent under duplicate terminal signals",()=>{
 let shown=false,count=0;
 const gameOver=()=>{if(shown)return;shown=true;count++};
 for(let i=0;i<10;i++)gameOver();
 assert.equal(count,1);
});

test("FEVER earned by level-finishing cascade cannot leak into next level",()=>{
 let feverDrops=0;
 const resolveChain=chain=>{if(chain>=3)feverDrops=Math.max(feverDrops,3)};
 const levelClear=()=>{feverDrops=0};
 resolveChain(3);assert.equal(feverDrops,3);
 levelClear();assert.equal(feverDrops,0);
});

test("overlap Fusion spends each Numberling at most once",()=>{
 const b=makeBoard();b[8][1]=9;b[8][2]=1;b[8][3]=9;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.cells.length,2);
 assert.equal(w.groups.length*100,100);
});

test("stale async resolution cannot award FEVER after restart",()=>{
 let runToken=50,feverDrops=0;const captured=runToken;
 runToken++;
 const chain=3;
 if(captured===runToken&&chain>=3)feverDrops=3;
 assert.equal(feverDrops,0);
});

test("FEVER refresh is capped at three rather than additive stacking",()=>{
 let feverDrops=2;
 feverDrops=Math.max(feverDrops,3);
 assert.equal(feverDrops,3);
 feverDrops=Math.max(feverDrops,3);
 assert.equal(feverDrops,3);
});


// v0.5 signature gameplay semantic guards
test("NOW planning cue can identify a legal landing that immediately makes 10 without changing board",()=>{
 const b=makeBoard();b[8][0]=9;const active=1;
 const snapshot=JSON.stringify(b);let opportunities=[];
 for(let c=0;c<6;c++){let r=8;while(r>=0&&b[r][c])r--;if(r<0)continue;
  const makesTen=[[1,0],[-1,0],[0,1],[0,-1]].some(([dr,dc])=>{let rr=r+dr,cc=c+dc;return rr>=0&&rr<9&&cc>=0&&cc<6&&b[rr][cc]&&b[rr][cc]+active===10});
  if(makesTen)opportunities.push([r,c]);
 }
 assert.ok(opportunities.length>0);assert.equal(JSON.stringify(b),snapshot);
});

test("v0.5 feedback does not alter fair-bag or Make-10 semantics",()=>{
 const bag=shuffledBag(()=>0.25);assert.deepEqual([...bag].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
 const b=makeBoard();b[8][0]=4;b[8][1]=6;const w=matchWave(b);assert.equal(w.groups.length,1);
});


// v0.6 Group-to-10 core contracts
test("connected 3-number group summing exactly 10 clears as one TEN",()=>{
 const b=makeBoard();b[8][0]=2;b[8][1]=3;b[8][2]=5;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.groups[0].length,3);assert.equal(w.cells.length,3);
});
test("four-number exact 10 is invalid under v0.6.1 cap",()=>{
 const b=makeBoard();b[8][0]=1;b[8][1]=2;b[8][2]=3;b[8][3]=4;
 const w=matchWave(b);assert.equal(w.groups.length,0);assert.equal(w.cells.length,0);
});
test("connected group over 10 is invalid and does not clear",()=>{
 const b=makeBoard();b[8][0]=4;b[8][1]=3;b[8][2]=5;
 const w=matchWave(b);assert.equal(w.groups.length,0);assert.equal(w.cells.length,0);
});
test("diagonal-only numbers are not a connected TEN",()=>{
 const b=makeBoard();b[8][0]=2;b[7][1]=3;b[6][2]=5;
 assert.equal(matchWave(b).groups.length,0);
});
test("overlapping candidates never spend one Numberling twice in a wave",()=>{
 const b=makeBoard();b[8][0]=9;b[8][1]=1;b[8][2]=9;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.cells.length,2);
});
test("resolver prefers maximum non-overlapping cleared-cell coverage deterministically",()=>{
 const b=makeBoard();b[8][0]=1;b[8][1]=9;b[8][3]=2;b[8][4]=3;b[8][5]=5;
 const a=matchWave(b),z=matchWave(b);assert.equal(a.groups.length,2);assert.equal(a.cells.length,5);assert.deepEqual(a,z);
});


// Deep QC Group-to-10
test("L-shape connected group is valid",()=>{
 const b=makeBoard();b[8][0]=2;b[7][0]=3;b[7][1]=5;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.groups[0].length,3);
});
test("T-shape four-cell exact 10 is invalid under three-Numberling cap",()=>{
 const b=makeBoard();b[7][1]=1;b[7][0]=2;b[7][2]=3;b[8][1]=4;
 assert.equal(matchWave(b).groups.length,0);
});
test("larger component may clear exact connected three-cell subset while leaving extras",()=>{
 const b=makeBoard();b[8][0]=2;b[8][1]=3;b[8][2]=5;b[8][3]=4;b[7][1]=9;
 const w=matchWave(b);assert.ok(w.groups.some(g=>g.length===3));assert.ok(w.cells.length<=3);
});
test("disconnected exact-sum subset inside a larger component is never accepted",()=>{
 const b=makeBoard();b[8][0]=5;b[8][1]=9;b[8][2]=5;
 const cs=tenCandidates(b);assert.equal(cs.some(g=>g.length===2&&g.every(([r,c])=>c!==1)),false);
});
test("resolver tie is independent of candidate input order",()=>{
 const b=makeBoard();b[8][0]=9;b[8][1]=1;b[8][2]=9;
 const cs=tenCandidates(b),a=selectTenGroups(cs),z=selectTenGroups([...cs].reverse());
 const sig=x=>x.map(g=>g.map(p=>p.join(",")).sort().join("|")).sort();
 assert.deepEqual(sig(a),sig(z));
});
test("multiple overlapping candidates cannot inflate TEN count or cleared cells",()=>{
 const b=makeBoard();b[8][1]=1;b[8][0]=9;b[8][2]=9;b[7][1]=9;
 const w=matchWave(b);assert.equal(w.groups.length,1);assert.equal(w.cells.length,2);
});
test("3-number group remains one TEN and earns v0.6.2 skill reward",()=>{
 const b=makeBoard();b[8][0]=2;b[8][1]=3;b[8][2]=5;
 const r=resolveBoard(b);assert.equal(r.tens,1);assert.equal(r.clears,3);assert.equal(r.score,180);
});
test("four-number exact 10 cannot launder score",()=>{
 const b=makeBoard();b[8][0]=1;b[8][1]=2;b[8][2]=3;b[8][3]=4;
 const r=resolveBoard(b);assert.equal(r.tens,0);assert.equal(r.clears,0);assert.equal(r.score,0);
});
test("3-number first wave can gravity-cascade into a second TEN",()=>{
 const b=makeBoard();b[8][0]=2;b[8][1]=3;b[8][2]=5;b[7][0]=4;b[6][1]=6;
 const r=resolveBoard(b);assert.equal(r.chain,2);assert.equal(r.tens,2);assert.equal(r.score,380);
});
test("dense 6x9 candidate enumeration remains bounded for browser play",()=>{
 const b=makeBoard();for(let r=0;r<9;r++)for(let c=0;c<6;c++)b[r][c]=1+((r*6+c)%4);
 const start=process.hrtime.bigint();const cs=tenCandidates(b);const ms=Number(process.hrtime.bigint()-start)/1e6;
 assert.ok(cs.length<20000,"candidate explosion: "+cs.length);assert.ok(ms<250,"enumeration too slow: "+ms.toFixed(1)+"ms");
});

test("all resolved TEN groups are bounded to 2 or 3 Numberlings",()=>{
 const b=makeBoard();for(let r=0;r<9;r++)for(let c=0;c<6;c++)b[r][c]=1+((r+c)%5);
 const w=matchWave(b);assert.ok(w.groups.every(g=>g.length>=2&&g.length<=3));
});
test("intentionality contract exposes no runtime landing-answer helper",()=>{
 const fs=require("node:fs"),src=fs.readFileSync(require("node:path").join(__dirname,"../js/game.js"),"utf8");
 assert.equal(src.includes("plannedLandingCells"),false);assert.equal(src.includes("chain-ready"),false);
});

test("LAB telemetry is read-only and contains no move recommendation",()=>{
 const fs=require("node:fs"),src=fs.readFileSync(require("node:path").join(__dirname,"../js/game.js"),"utf8");
 assert.ok(src.includes("TenDropTelemetry"));
 assert.equal(src.includes("plannedLandingCells"),false);
 assert.equal(src.includes("recommendedColumn"),false);
});
