const assert=require('node:assert/strict');const E=require('../engine.js');
for(let seed of [0,1,7,42,999,E.hash('P01')]){
 let f=E.fpsSchedule(seed);assert.equal(f.length,60);let count={};for(let t of f){count[t.condition]=(count[t.condition]||0)+1;let a=E.targets(t,seed);assert.equal(a.length,t.size);assert.equal(new Set(a.map(x=>x.cell)).size,t.size);assert.equal(a.filter(x=>x.target).length,1);assert.equal(a.filter(x=>x.cell%6<3).length,t.size/2);assert.equal(a.find(x=>x.target).cell,t.targetCell)}assert.equal(Object.keys(count).length,12);assert(Object.values(count).every(n=>n===5));
 let n=E.navSchedule(seed);assert.equal(n.length,72);let nc={},turns={};for(let t of n){nc[t.condition]=(nc[t.condition]||0)+1;let k=t.condition+t.turn;turns[k]=(turns[k]||0)+1;assert([0,90,180,270].includes(E.turnHeading(t.heading,t.turn)))}assert.equal(Object.keys(nc).length,12);assert(Object.values(nc).every(x=>x===6));assert(Object.values(turns).every(x=>x===2));for(let i=0;i<72;i+=24)assert.equal(new Set(n.slice(i,i+24).map(t=>t.mode)).size,1);
 assert.deepEqual(E.fpsSchedule(seed),E.fpsSchedule(seed));assert.equal(E.navSchedule(seed,true).filter(t=>['left','straight','right'].indexOf(t.turn)===(t.heading/90+['north','heading','aided'].indexOf(t.mode))%3).length,12);
}
assert.equal(E.turnHeading(180,'left'),90);assert.equal(E.turnHeading(90,'right'),180);
let s=E.summary([{phase:'formal',correct:true,rt:300},{phase:'formal',correct:true,rt:500},{phase:'formal',correct:false,rt:200},{phase:'formal',invalid:true,correct:false,rt:400},{phase:'practice',correct:true,rt:200},{phase:'formal',correct:true,rt:30}]);assert.equal(s.n,4);assert.equal(s.accuracy,.75);assert.equal(s.rt,400);assert.equal(s.validRT,2);
console.log('PASS: balanced factorial schedules across 6 seeds; unique stimuli and matched halves; turn transforms; practice counts; reproducibility; analysis filtering.');

for (const t of E.fpsSchedule(42)){const a=E.targets(t,42);assert.equal(a.filter(x=>x.kind==='orangeCircle').length,1);assert(a.filter(x=>x.kind==='blueCircle').length>0);if(t.type==='feature')assert.equal(a.filter(x=>x.kind==='blueCircle').length,t.size-1);else assert(a.some(x=>x.kind==='orangeSquare'));}
const css=require('node:fs').readFileSync(require('node:path').join(__dirname,'../style.css'),'utf8');assert(!css.includes('.target.target{'));for(const kind of ['orangeCircle','blueCircle','orangeSquare'])assert(css.includes('.target.'+kind+'{'));
console.log('PASS: distinct stimulus classes and color selector regression checks.');
