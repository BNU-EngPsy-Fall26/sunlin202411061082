/* Shared deterministic experiment design; usable in a browser or Node. */
(function(root){
const VERSION='1.3.0';
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function hash(s){let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fpsSchedule(seed,practice=false){const r=rng(seed), a=[];for(let type of ['feature','conjunction'])for(let size of [8,16,24])for(let cue of ['neutral','valid'])for(let k=0;k<(practice?1:5);k++)a.push({type,size,cue,rep:k,targetCell:(k*7+seed%24)%24,condition:`${type}_${size}_${cue}`});return shuffle(a,r);}
const permutations=[['north','heading','aided'],['north','aided','heading'],['heading','north','aided'],['heading','aided','north'],['aided','north','heading'],['aided','heading','north']];
function navSchedule(seed,practice=false){const r=rng(seed),out=[];let order=permutations[seed%6];for(let mode of order){let a=[];for(let heading of [0,90,180,270])for(let turn of ['left','straight','right'])for(let k=0;k<(practice?1:2);k++)a.push({mode,heading,turn,rep:k,condition:`${mode}_${heading}`,scene:(heading/90*12+['left','straight','right'].indexOf(turn)*4+k+seed%3*16)%48});out.push(...shuffle(a,r));}return out;}
function targets(t,seed){const r=rng(seed), side=t.targetCell%6<3?0:1;let cells=[...Array(24).keys()];let same=cells.filter(i=>(i%6<3?0:1)===side&&i!==t.targetCell),other=cells.filter(i=>(i%6<3?0:1)!==side);let chosen=[t.targetCell,...shuffle(same,r).slice(0,t.size/2-1),...shuffle(other,r).slice(0,t.size/2)];chosen=shuffle(chosen,r);let d=0;return chosen.map(i=>({cell:i,x:((i%6)+.5)/6,y:(Math.floor(i/6)+.5)/4,target:i===t.targetCell,kind:i===t.targetCell?'orangeCircle':t.type==='feature'?'blueCircle':d++%2?'blueCircle':'orangeSquare'}));}
function turnHeading(h,t){return(h+({left:-90,straight:0,right:90}[t])+360)%360;}
function median(xs){if(!xs.length)return null;let a=xs.slice().sort((a,b)=>a-b),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
function summary(rows){let a=rows.filter(r=>r.phase==='formal'&&!r.invalid);let rt=a.filter(r=>r.correct&&!r.timeout&&r.rt>=150).map(r=>r.rt);return{n:a.length,accuracy:a.length?a.filter(r=>r.correct).length/a.length:null,rt:median(rt),validRT:rt.length};}
const api={VERSION,rng,hash,shuffle,fpsSchedule,navSchedule,targets,turnHeading,median,summary};root.LabEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
