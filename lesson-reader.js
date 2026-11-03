const lessonMemory={completed:{},positions:{}};
try{
  const saved=JSON.parse(localStorage.getItem('statistics-lab-lessons-v1')||'{}');
  if(saved&&typeof saved==='object'){
    for(const [k,v] of Object.entries(saved.completed||{}))if(v===true)lessonMemory.completed[k]=true;
    for(const [k,v] of Object.entries(saved.positions||{}))if(Number.isInteger(v)&&v>=0)lessonMemory.positions[k]=v;
  }
}catch{}
const saveLessonMemory=()=>{try{localStorage.setItem('statistics-lab-lessons-v1',JSON.stringify(lessonMemory))}catch{}};
const lessonKey=(course,index)=>course==='probability'?`probability:${courses[course].lessons[index].id}`:`statistics:${index+1}`;
function guideFor(course,index){
  const l=courses[course].lessons[index];
  return lessonGuides[lessonKey(course,index)]||{goal:l.lead,terms:[],steps:l.sections.map(([title,text,equation],i)=>({id:'section-'+i,title,explain:text,worked:[],equation,question:'この式が表すことを、自分の言葉で説明してみよう。',answer:text}))};
}
function renderLessons(){
  const c=activeCourse(),l=c.lessons[state.chapter],key=lessonKey(state.course,state.chapter),g=guideFor(state.course,state.chapter);
  const pos=Math.min(lessonMemory.positions[key]||0,g.steps.length-1),step=g.steps[pos];
  const done=id=>lessonMemory.completed[key+':'+id]===true;
  const count=g.steps.filter(s=>done(s.id)).length;
  const related=bridges.filter(b=>state.course==='probability'?b.probability===l.id:b.statistics===state.chapter);
  $('#content').innerHTML=heading(c.english+' / STEP BY STEP',c.name+'を、ひとつずつ理解する。','一度に全部覚えなくて大丈夫。例を追い、問いに答え、自分のペースで次へ。')+`<div class="lesson-grid"><div class="panel lesson-nav">${c.lessons.map((x,i)=>{const k=lessonKey(state.course,i),steps=guideFor(state.course,i).steps,n=steps.filter(s=>lessonMemory.completed[k+':'+s.id]).length;return `<button data-chapter="${i}" class="${i===state.chapter?'active':''}" aria-current="${i===state.chapter?'page':'false'}"><span>${String(i+1).padStart(2,'0')}　${escapeHTML(x.title)}</span><small>${n}/${steps.length} 確認済み</small></button>`}).join('')}</div><article class="panel lesson-body"><div class="eyebrow">${escapeHTML(l.ref)}</div><h2>${escapeHTML(l.title)}</h2><p class="lesson-lead">${escapeHTML(l.lead)}</p><div class="lesson-goal"><b>この章のゴール</b><p>${escapeHTML(g.goal)}</p></div>${g.terms.length?`<details class="term-guide"><summary>先に記号と言葉を確認する</summary><dl>${g.terms.map(([term,meaning])=>`<dt>${escapeHTML(term)}</dt><dd>${escapeHTML(meaning)}</dd>`).join('')}</dl></details>`:''}<div class="reader-progress"><span>ステップ ${pos+1} / ${g.steps.length}</span><span>${count} / ${g.steps.length} 確認済み</span></div><ol class="lesson-stepper" aria-label="この章のステップ">${g.steps.map((s,i)=>`<li><button data-lesson-step="${i}" class="${i===pos?'current':''} ${done(s.id)?'done':''}" aria-current="${i===pos?'step':'false'}"><span>${done(s.id)?'✓':i+1}</span>${escapeHTML(s.title)}</button></li>`).join('')}</ol><section class="guided-step" id="guided-step" tabindex="-1" aria-labelledby="guided-title"><div class="eyebrow">STEP ${String(pos+1).padStart(2,'0')} · ${done(step.id)?'確認済み':'ここに集中'}</div><h3 id="guided-title">${escapeHTML(step.title)}</h3><p class="step-explanation">${escapeHTML(step.explain)}</p>${step.worked.length?`<div class="worked-example"><h4>順番にたどってみよう</h4><ol>${step.worked.map(line=>`<li>${escapeHTML(line)}</li>`).join('')}</ol></div>`:''}<div class="equation-label">ここでの式</div>${formula(step.equation)}<div class="understanding-check"><div class="eyebrow">CHECK YOUR UNDERSTANDING</div><h4>ここまで、説明できる？</h4><p>${escapeHTML(step.question)}</p><details id="step-answer"><summary>答えと、その理由を確認する</summary><p>${escapeHTML(step.answer)}</p></details><p class="chart-note">まず自分で考えてから答えを開いてみよう。分からなければ、上の具体例へ戻って大丈夫。</p></div><div class="reader-actions"><button class="secondary" data-lesson-step="${Math.max(0,pos-1)}" ${pos===0?'disabled':''}>← 前へ</button><button class="primary" data-lesson-understood="${escapeHTML(step.id)}">${pos<g.steps.length-1?'理解できたので、次へ →':'このステップを理解できた ✓'}</button>${pos<g.steps.length-1?`<button class="reader-skip" data-lesson-step="${pos+1}">確認済みにせず次を見る →</button>`:''}</div></section>${count===g.steps.length?`<div class="chapter-complete" role="status"><b>この章の全ステップを確認できました。</b><p>次は演習で、自分の言葉や計算だけで答えられるか確かめよう。</p></div>`:''}<details class="chapter-reference"><summary>章全体の定義・導出・証明を読む</summary><p class="chart-note">小さなステップを終えた後や、詳しい条件を確認したいときの読み返し用です。</p>${state.course==='statistics'&&statisticsHelp[state.chapter]?`<div class="simple-explanation"><h3>この章の見取り図</h3><p>${escapeHTML(statisticsHelp[state.chapter][0])}</p><p>${escapeHTML(statisticsHelp[state.chapter][1])}</p></div>`:''}${l.sections.map(([title,text,eq])=>`<section class="lesson-section"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p>${formula(eq)}</section>`).join('')}<div class="callout">${escapeHTML(l.note)}</div></details><div class="lesson-actions"><button class="primary" data-action="chapter-practice">この章の問題に挑戦 →</button>${state.chapter<c.lessons.length-1?`<button class="secondary" data-chapter="${state.chapter+1}">次の章を読む →</button>`:''}</div>${related.length?`<div class="connection-box"><h3>↗ ${state.course==='probability'?'統計学で、ここに使う':'この内容を支える確率論'}</h3>${related.map(b=>`<p><b>${escapeHTML(b.title)}</b><br>${escapeHTML(b.why)}</p>${bridgeButtons(b)}`).join('')}</div>`:''}</article></div>`;
}
document.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.lessonStep===undefined&&!button.dataset.lessonUnderstood)return;
  const key=lessonKey(state.course,state.chapter),g=guideFor(state.course,state.chapter);
  if(button.dataset.lessonStep!==undefined){
    lessonMemory.positions[key]=Math.max(0,Math.min(g.steps.length-1,+button.dataset.lessonStep));
  }else if(button.dataset.lessonUnderstood){
    const index=g.steps.findIndex(s=>s.id===button.dataset.lessonUnderstood);if(index<0)return;
    lessonMemory.completed[key+':'+g.steps[index].id]=true;
    lessonMemory.positions[key]=Math.min(index+1,g.steps.length-1);
  }else return;
  saveLessonMemory();renderLessons();
  $('#guided-step')?.scrollIntoView?.({behavior:'smooth',block:'start'});
  $('#guided-step')?.focus?.({preventScroll:true});
});
render();
