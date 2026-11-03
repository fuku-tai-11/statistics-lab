// Keep prior understanding records while presenting each chapter as one document.
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
function readingSections(course,index){
  const key=lessonKey(course,index),guide=guideFor(course,index),extra=chapterExplanations[key];
  const concepts=guide.steps.map((step,i)=>({id:step.id,title:step.title,equation:chapterEquations[key]?.[i]||step.equation,plain:chapterPlain[key]?.[i]||step.explain,detail:[extra?.details[i]||step.explain],example:step.worked,uses:extra?.uses[i]||'この章の定義や関連する問題を読み解くために使います。',question:step.question,answer:step.answer}));
  if(key==='probability:events')return [...limitDefinitions.slice(0,4),concepts[0],...limitDefinitions.slice(4),concepts[2]];
  return [...(key==='probability:convergence'?limitDefinitions.slice(2,4):[]),...concepts];
}
function renderLessons(){
  const c=activeCourse(),l=c.lessons[state.chapter],key=lessonKey(state.course,state.chapter),g=guideFor(state.course,state.chapter),sections=readingSections(state.course,state.chapter);
  const terms=g.terms;
  const related=bridges.filter(b=>state.course==='probability'?b.probability===l.id:b.statistics===state.chapter);
  const done=id=>lessonMemory.completed[key+':'+id]===true;
  $('#content').innerHTML=heading(c.english+' / 講義ノート',c.name+'を、定義から理解する。','定義式 → やさしい日本語 → 式の詳しい読み方 → 使いどころ。章全体を続けて読めます。')+`<div class="lesson-grid"><div class="panel lesson-nav">${c.lessons.map((x,i)=>`<button data-chapter="${i}" class="${i===state.chapter?'active':''}" aria-current="${i===state.chapter?'page':'false'}">${String(i+1).padStart(2,'0')}　${escapeHTML(x.title)}</button>`).join('')}</div><article class="panel lesson-body continuous-notes"><div class="eyebrow">${escapeHTML(l.ref)}</div><h2>${escapeHTML(l.title)}</h2><p class="lesson-lead">${escapeHTML(l.lead)}</p><div class="lesson-goal"><b>この章で理解したいこと</b><p>${escapeHTML(g.goal)}</p></div>${terms.length?`<section class="note-glossary"><h3>この章で使う記号と言葉</h3><dl>${terms.map(([term,meaning])=>`<dt>${escapeHTML(term)}</dt><dd>${escapeHTML(meaning)}</dd>`).join('')}</dl></section>`:''}<nav class="reading-toc" aria-label="章の目次"><b>この章の目次</b><ol>${sections.map(s=>`<li><a href="#note-${s.id}">${escapeHTML(s.title)}</a></li>`).join('')}<li><a href="#additional-notes">関連する定理・公式・導出</a></li></ol></nav>${sections.map((s,i)=>`<section class="concept-note" id="note-${s.id}"><div class="note-number">解説 ${String(i+1).padStart(2,'0')}</div><h3>${escapeHTML(s.title)}</h3><h4 class="definition-heading">定義・基本式</h4>${formula(s.equation)}<div class="plain-definition"><h4>日本語で、かんたんに言うと</h4><p>${escapeHTML(s.plain)}</p></div><h4>式を詳しく読む</h4>${s.detail.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}${s.example.length?`<div class="note-example"><h4>具体例で確かめる</h4><ol>${s.example.map(line=>`<li>${escapeHTML(line)}</li>`).join('')}</ol></div>`:''}<div class="note-application"><h4>どんなところで使う？</h4><p>${escapeHTML(s.uses)}</p></div>${s.question?`<details class="note-check"><summary>理解の確認：${escapeHTML(s.question)}</summary><p>${escapeHTML(s.answer)}</p></details>`:''}<button class="reader-mark" data-note-understood="${escapeHTML(s.id)}" aria-pressed="${done(s.id)}">${done(s.id)?'✓ この項目は確認済み':'この項目を理解できた ✓'}</button></section>`).join('')}<section id="additional-notes" class="additional-notes"><div class="eyebrow">関連する説明</div><h3>関連する定理・公式・導出</h3><p class="chart-note">ここまでの考え方を、講義の式とつなげて整理します。どの仮定を使っているかも一緒に確認してください。</p>${l.sections.map(([title,text,eq])=>`<section class="supplement-note"><h4>${escapeHTML(title)}</h4>${formula(eq)}<p>${escapeHTML(text)}</p></section>`).join('')}<div class="callout">${escapeHTML(l.note)}</div></section><div class="lesson-actions"><button class="primary" data-action="chapter-practice">この章の問題に挑戦 →</button>${state.chapter<c.lessons.length-1?`<button class="secondary" data-chapter="${state.chapter+1}">次の章を読む →</button>`:''}</div>${related.length?`<div class="connection-box"><h3>↗ ${state.course==='probability'?'統計学で、ここに使う':'この内容を支える確率論'}</h3>${related.map(b=>`<p><b>${escapeHTML(b.title)}</b><br>${escapeHTML(b.why)}</p>${bridgeButtons(b)}`).join('')}</div>`:''}</article></div>`;
}
document.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button?.dataset.noteUnderstood)return;
  const key=lessonKey(state.course,state.chapter)+':'+button.dataset.noteUnderstood;
  lessonMemory.completed[key]=!lessonMemory.completed[key];saveLessonMemory();
  button.textContent=lessonMemory.completed[key]?'✓ この項目は確認済み':'この項目を理解できた ✓';
  button.setAttribute?.('aria-pressed',String(lessonMemory.completed[key]));
});
render();
