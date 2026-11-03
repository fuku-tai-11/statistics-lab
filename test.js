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
const storage=new Map([['statistics-lab-v1','{"2":true}'],['statistics-lab-lessons-v1','{"completed":{"statistics:1:cdf":true},"positions":{"statistics:1":2}}']]);
const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
let appctx=vm.createContext({console,katex:require('./vendor/katex/katex.min.js'),Stats:S,document:{querySelector:el,querySelectorAll:()=>[],addEventListener:(type,fn)=>(listeners[type]??=[]).push(fn)},window:{scrollTo(){}},localStorage});
const files=['data.js','probability.js','curriculum.js','lesson-guides.js','expanded-notes.js','interpretation.js','math-display.js','math-formulas.js','app.js','course-ui.js','chapter-reader.js'];
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n'),appctx);
vm.runInContext(`
 for(const d of distributions){state.dist=d.id;renderExplore();if(/NaN|Infinity/.test(document.querySelector('#chart').innerHTML))throw Error(d.id+' invalid SVG');if(!document.querySelector('#graph-reading').innerHTML.includes('何がわかる'))throw Error('missing reading');state.mode='cdf';renderExplore();state.mode='pdf';}
 renderRelations();renderHome();renderBridges();
 for(const [key,course] of Object.entries(courses)){
   state.course=key;for(let i=0;i<course.lessons.length;i++){
     state.chapter=i;const k=lessonKey(key,i),g=guideFor(key,i);
     if(!lessonGuides[k]||!g.goal||g.terms.length<2)throw Error('missing authored guide');
     const sections=readingSections(key,i);
     if(!chapterExplanations[k]||chapterExplanations[k].details.length!==g.steps.length||chapterEquations[k].length!==g.steps.length)throw Error('missing expanded notes');
     renderLessons();const html=document.querySelector('#content').innerHTML;
     for(const section of sections){
       if(!section.plain||!section.detail.length||!section.equation||!section.uses||!section.example.length)throw Error('incomplete concept explanation');
       if(!html.includes(escapeHTML(section.title))||!html.includes(escapeHTML(section.uses)))throw Error('concept hidden from chapter');
       const begin=html.indexOf('id="note-'+section.id+'"');
       if(html.indexOf(escapeHTML(section.equation),begin)>html.indexOf(escapeHTML(section.plain),begin))throw Error('definition not before explanation');
     }
     if(html.includes('data-lesson-step')||html.includes('reader-skip'))throw Error('step UI remains');
   }
   state.filter='all';state.kind='all';renderPractice();state.filter='1';state.kind='numeric';renderPractice();state.kind='proof';renderPractice();
 }
 const ids=Object.values(courses).flatMap(c=>c.questions.map(q=>String(q.id)));if(new Set(ids).size!==ids.length)throw Error('duplicate question ID');
 for(const course of Object.values(courses))for(const q of course.questions)if(q.chapter<1||q.chapter>course.lessons.length)throw Error('invalid chapter');
 for(const b of bridges)if(!probabilityLessons.some(l=>l.id===b.probability)||!lessons[b.statistics])throw Error('broken bridge');
 state.course='statistics';state.view='practice';state.filter='all';state.kind='all';renderPractice();
 if(!solved[2])throw Error('old progress lost');
`,appctx);
function fire(type,event){for(const fn of listeners[type]||[])fn(event)}
el('#answer-2').value='4';fire('submit',{target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/正解/);
el('#answer-2').value='0';fire('submit',{target:{dataset:{answer:'2'}},preventDefault(){}});assert.match(el('#feedback-2').textContent,/もう一度/);
vm.runInContext("state.course='probability';renderPractice()",appctx);
el('#answer-prob-geom-shift').value='4';fire('submit',{target:{dataset:{answer:'prob-geom-shift'}},preventDefault(){}});assert.match(el('#feedback-prob-geom-shift').textContent,/正解/);
vm.runInContext("state.course='statistics';state.chapter=0;state.view='lessons';renderLessons()",appctx);
const click=data=>fire('click',{target:{closest:()=>({dataset:data})}});
vm.runInContext("if(!lessonMemory.completed['statistics:1:cdf'])throw Error('old understanding history lost')",appctx);
click({noteUnderstood:'expectation'});
vm.runInContext("if(!lessonMemory.completed['statistics:1:expectation'])throw Error('mark note')",appctx);
click({noteUnderstood:'expectation'});
vm.runInContext("if(lessonMemory.completed['statistics:1:expectation'])throw Error('unmark note')",appctx);
const reloaded=vm.createContext({console,katex:require('./vendor/katex/katex.min.js'),Stats:S,document:{querySelector:el,querySelectorAll:()=>[],addEventListener(){}},window:{scrollTo(){}},localStorage});
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n')+";if(!lessonMemory.completed['statistics:1:cdf']||!solved[2])throw Error('progress restoration')",reloaded);
for(const file of ['index.html','app.js','course-ui.js','chapter-reader.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/data-view="lab"|renderLab|experimentState|learning-math\.js/);
vm.runInContext(`
 if(MathDisplay.tex('2⁻ᵐ')!=='2^{-m}')throw Error('superscript formatting');
 if(!MathDisplay.tex('Σₓ₌₁∞').includes('^{\\\\infty }'))throw Error('sum upper bound');
 if(!MathDisplay.tex('A∩B').includes('\\\\cap '))throw Error('binary intersection');
 for(const def of limitDefinitions){
  const rendered=MathDisplay.render(def.equation);if(!rendered.includes('katex-mathml')||rendered.includes('katex-error'))throw Error('definition rendering');
 }
 if(!MathDisplay.rows(limitDefinitions[4].equation)[0].includes('\\\\bigcup'))throw Error('indexed union');
 if(!MathDisplay.rows(distributions.find(d=>d.id==='exponential').pdf)[0].includes('e^{-\\\\lambda x}'))throw Error('exponential density exponent');
 for(const course of Object.values(courses))for(const lesson of course.lessons)for(const section of lesson.sections)MathDisplay.render(section[2]);
 if(MathDisplay.failures.length)throw Error(JSON.stringify(MathDisplay.failures));
`,appctx);
console.log('PASS: distribution identities and endpoints; both courses; all lessons, exercises and bridge targets; old progress; numeric grading; continuous expanded chapters; definition-first explanations; preserved understanding records.');
