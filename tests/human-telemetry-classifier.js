"use strict";

const CLASS={INCOMPLETE:"INCOMPLETE",NO_DISCOVERY:"NO_DISCOVERY",INCIDENTAL:"INCIDENTAL",EMERGING:"EMERGING_DISCOVERY",DELIBERATE:"DELIBERATE_SIGNAL",STRONG:"STRONG_DELIBERATE_SIGNAL"};

function finiteInt(v){return Number.isInteger(v)&&v>=0}
function validate(t){
 if(!t||typeof t!=="object"||!finiteInt(t.sessionRestarts||0)||(t.sessionRestarts||0)>0)return false;
 for(const k of ["drops","tens2","tens3","chains2","chains3","maxChain","chainsAfterFirst"])if(!finiteInt(t[k]))return false;
 if(t.firstChainDrop!==null&&!finiteInt(t.firstChainDrop))return false;
 if(!Array.isArray(t.chainEvents))return false;
 return t.chainEvents.every(e=>e&&finiteInt(e.drop)&&finiteInt(e.level)&&Number.isInteger(e.depth)&&e.depth>=2);
}
function classify(t,{gameOver=false,automated=false,mutated=false}={}){
 if(!validate(t)||automated||mutated)return {class:CLASS.INCOMPLETE,valid:false};
 if(t.drops<60&&!(gameOver&&t.drops>=30))return {class:CLASS.INCOMPLETE,valid:false};
 const events=[...t.chainEvents].sort((a,b)=>a.drop-b.drop);
 if(!events.length||t.firstChainDrop===null)return {class:CLASS.NO_DISCOVERY,valid:true};
 const first=t.firstChainDrop;
 const post=events.filter(e=>e.drop>first);
 const distinct=new Set(post.map(e=>e.drop));
 if(t.chainsAfterFirst===0||post.length===0)return {class:CLASS.INCIDENTAL,valid:true};
 if(t.chainsAfterFirst<2||distinct.size<2||!post.some(e=>e.depth>=2))return {class:CLASS.EMERGING,valid:true};
 // Fail closed on impossible/duplicated accounting.
 if(t.chainsAfterFirst!==post.length||distinct.size!==post.length)return {class:CLASS.EMERGING,valid:true};
 const exposureAfter=Math.max(1,t.drops-first);
 const preCount=events.filter(e=>e.drop<=first).length;
 const exposureBefore=Math.max(1,first);
 const postRate=post.length/exposureAfter, preRate=preCount/exposureBefore;
 const strong=(post.length>=3&&post.some(e=>e.depth>=3))||(postRate>=2*preRate);
 return {class:strong?CLASS.STRONG:CLASS.DELIBERATE,valid:true,postRate,preRate};
}
function cohort(sessions){
 const valid=sessions.filter(x=>x&&x.valid);
 const deliberate=valid.filter(x=>x.class===CLASS.DELIBERATE||x.class===CLASS.STRONG).length;
 return {valid:valid.length,deliberate,freezeDirectional:valid.length>=5&&deliberate>=3};
}
module.exports={CLASS,validate,classify,cohort};
