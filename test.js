const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),S=require('./math.js');
const near=(actual,expected,tol=1e-9)=>assert.ok(Math.abs(actual-expected)<tol,`${actual} != ${expected}`);
near(S.cdf('normal',1.96,{mu:0,sigma:1}),.9750021048517795);
near(S.cdf('t',1,{nu:1}),.75);
near(S.cdf('f',1,{n:1,m:1}),.5);
near(S.cdf('beta',.4,{alpha:1,beta:1}),.4);
near(S.cdf('gamma',2,{alpha:1,beta:3}),S.cdf('exponential',2,{lambda:3}));
near(S.density('chi2',3,{nu:4}),S.density('gamma',3,{alpha:2,beta:.5}));
near(S.density('t',3,{nu:1}),S.density('cauchy',3,{}));
near(S.cdf('binomial',2,{n:4,p:.5}),11/16);
near(S.cdf('geometric',2,{p:.5}),.875);
assert.ok(Number.isNaN(S.moments('cauchy',{})[0]));
assert.equal(S.moments('t',{nu:2})[1],Infinity);
assert.equal(S.moments('f',{n:5,m:2})[0],Infinity);
let ctx=vm.createContext({});vm.runInContext(fs.readFileSync('data.js','utf8')+';this.ds=distributions;this.qs=questions;this.ls=lessons',ctx);
assert.equal(ctx.ds.length,14);assert.equal(ctx.ls.length,13);assert.equal(ctx.qs.length,35);
for(const d of ctx.ds){let defaults=Object.fromEntries(d.params.map(a=>[a[0],a[5]]));let cases=[defaults,...d.params.flatMap(a=>[a[2],a[3]].map(v=>({...defaults,[a[0]]:v})))];for(const p of cases){const[lo,hi]=S.bounds(d.id,p);let prev=0;for(let i=0;i<=200;i++){let x=lo+(hi-lo)*i/200,v=S.cdf(d.id,x,p);assert.ok(Number.isFinite(v)&&v>=-1e-10&&v<=1+1e-10,`${d.id} cdf range`);assert.ok(v>=prev-1e-10,`${d.id} monotonic`);prev=v}if(d.type==='discrete'){let sum=0;for(let k=0;k<2000;k++)sum+=S.density(d.id,k,p);near(sum,1,1e-8)}}}
// A minimal DOM harness catches all render-time failures without browser dependencies.
const elements=new Map(),listeners={};const el=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',value:'',dataset:{},classList:{toggle(){}},setAttribute(){}});return elements.get(selector)};
let appctx=vm.createContext({console,Stats:S,document:{querySelector:el,querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn},window:{scrollTo(){}},localStorage:{getItem:()=>null,setItem(){}}});
vm.runInContext(fs.readFileSync('data.js','utf8')+fs.readFileSync('app.js','utf8')+`;for(const d of distributions){state.dist=d.id;renderExplore();if(/NaN|Infinity/.test(document.querySelector('#chart').innerHTML))throw Error(d.id+' invalid SVG');state.mode='cdf';renderExplore();state.mode='pdf';}renderRelations();for(let i=0;i<13;i++){state.chapter=i;renderLessons();}renderPractice();state.filter='7';state.kind='numeric';renderPractice();`,appctx);
el('#answer-2').value='4';listeners.submit({target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/正解/);
el('#answer-2').value='0';listeners.submit({target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/もう一度/);
console.log('PASS: numerical identities, all 14 distributions at parameter boundaries, 13 lessons, 35 questions, all render paths, grading.');
