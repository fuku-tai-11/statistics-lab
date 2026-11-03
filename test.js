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
const elements=new Map(),listeners={};const el=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{toggle(){}},setAttribute(){}});return elements.get(selector)};
let appctx=vm.createContext({console,Stats:S,document:{querySelector:el,querySelectorAll:()=>[],addEventListener:(type,fn)=>(listeners[type]??=[]).push(fn)},window:{scrollTo(){}},localStorage:{getItem:()=>'{"2":true}',setItem(){}}});
const files=['data.js','probability.js','curriculum.js','learning-math.js','interpretation.js','app.js','course-ui.js'];
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n'),appctx);
vm.runInContext(`
 for(const d of distributions){state.dist=d.id;renderExplore();if(/NaN|Infinity/.test(document.querySelector('#chart').innerHTML))throw Error(d.id+' invalid SVG');if(!document.querySelector('#graph-reading').innerHTML.includes('何がわかる'))throw Error('missing reading');state.mode='cdf';renderExplore();state.mode='pdf';}
 renderRelations();renderHome();renderBridges();
 for(const [key,course] of Object.entries(courses)){
   state.course=key;for(let i=0;i<course.lessons.length;i++){state.chapter=i;renderLessons();}
   state.filter='all';state.kind='all';renderPractice();state.filter='1';state.kind='numeric';renderPractice();state.kind='proof';renderPractice();
 }
 const ids=Object.values(courses).flatMap(c=>c.questions.map(q=>String(q.id)));if(new Set(ids).size!==ids.length)throw Error('duplicate question ID');
 for(const course of Object.values(courses))for(const q of course.questions)if(q.chapter<1||q.chapter>course.lessons.length)throw Error('invalid chapter');
 for(const b of bridges)if(!probabilityLessons.some(l=>l.id===b.probability)||!lessons[b.statistics])throw Error('broken bridge');
 for(const model of ['spike','thin','typewriter']){experimentState.model=model;for(const n of [1,12,128]){experimentState.n=n;renderLab();if(/NaN|Infinity/.test(document.querySelector('#convergence-chart').innerHTML))throw Error('invalid experiment graph');}}
 state.course='statistics';state.view='practice';state.filter='all';state.kind='all';renderPractice();
 if(!solved[2])throw Error('old progress lost');
`,appctx);
function fire(type,event){for(const fn of listeners[type]||[])fn(event)}
el('#answer-2').value='4';fire('submit',{target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/正解/);
el('#answer-2').value='0';fire('submit',{target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/もう一度/);
vm.runInContext("state.course='probability';renderPractice()",appctx);
el('#answer-prob-geom-shift').value='4';fire('submit',{target:{dataset:{answer:'prob-geom-shift'}},preventDefault(){}});assert.match(el('#feedback-prob-geom-shift').textContent,/正解/);
vm.runInContext(`
 if(Math.abs(LearningMath.convergence('spike',20,.5).mean-1)>1e-12)throw Error('spike mean');
 if(Math.abs(LearningMath.convergence('thin',20,.5).mean-.05)>1e-12)throw Error('thin mean');
 for(const omega of [.005,.25,.5,1])for(let k=0;k<7;k++){let hits=0;for(let n=2**k;n<2**(k+1);n++)hits+=LearningMath.convergence('typewriter',n,omega).value;if(hits!==1)throw Error('typewriter partition');}
 for(const n of [10,100,1000])for(const p of [.1,.4,.9])for(const e of [.02,.1,.3]){let b=LearningMath.bernoulliBound(n,p,e);if(b.exact>b.bound+1e-9||b.exact<0)throw Error('invalid probability bound');}
`,appctx);
console.log('PASS: distribution identities and endpoints; both courses; all lessons, exercises and bridge targets; old progress; numeric grading; convergence examples; exact binomial tails vs Chebyshev.');
