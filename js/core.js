"use strict";

function makeBoard(rows=9,cols=6){return Array.from({length:rows},()=>Array(cols).fill(0))}

function matchWave(board){
  const rows=board.length,cols=board[0].length,cells=new Set(),pairs=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const n=board[r][c]; if(!n)continue;
    for(const [dr,dc] of [[1,0],[0,1]]){
      const rr=r+dr,cc=c+dc;
      if(rr<rows&&cc<cols&&board[rr][cc]&&n+board[rr][cc]===10){
        cells.add(r+","+c);cells.add(rr+","+cc);pairs.push([[r,c],[rr,cc]]);
      }
    }
  }
  return {cells:[...cells].map(x=>x.split(",").map(Number)),pairs};
}

function gravity(board){
  const rows=board.length,cols=board[0].length;
  for(let c=0;c<cols;c++){
    const vals=[];for(let r=rows-1;r>=0;r--)if(board[r][c])vals.push(board[r][c]);
    for(let r=rows-1,i=0;r>=0;r--,i++)board[r][c]=vals[i]||0;
  }
  return board;
}

function resolveBoard(input){
  const board=input.map(r=>r.slice());let chain=0,score=0,tens=0,clears=0,waves=[];
  while(true){
    const wave=matchWave(board);if(!wave.cells.length)break;
    chain++;tens+=wave.pairs.length;clears+=wave.cells.length;
    score+=wave.pairs.length*100*chain;
    waves.push({pairs:wave.pairs.length,cells:wave.cells.length});
    for(const [r,c] of wave.cells)board[r][c]=0;
    gravity(board);
  }
  return {board,chain,score,tens,clears,waves};
}

function shuffledBag(random=Math.random){
  const bag=Array.from({length:9},(_,i)=>i+1);
  for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}
  return bag;
}

function canSpawn(board,col=Math.floor(board[0].length/2)){return board[0][col]===0}

if(typeof module!=="undefined")module.exports={makeBoard,matchWave,gravity,resolveBoard,shuffledBag,canSpawn};
