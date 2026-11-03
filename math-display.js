/* KaTeX and its fonts are served locally. Input is our static course text. */
const MathDisplay=(()=>{
 const cache=new Map(),exact=new Map(),failures=[];
 const put=(source,tex)=>exact.set(source,Array.isArray(tex)?tex:[tex]);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const symbols={'α':'\\alpha ','β':'\\beta ','γ':'\\gamma ','δ':'\\delta ','ε':'\\varepsilon ','θ':'\\theta ','λ':'\\lambda ','μ':'\\mu ','ν':'\\nu ','ξ':'\\xi ','π':'\\pi ','ρ':'\\rho ','σ':'\\sigma ','τ':'\\tau ','φ':'\\varphi ','ω':'\\omega ','Γ':'\\Gamma ','Ω':'\\Omega ','Σ':'\\sum ','∑':'\\sum ','∏':'\\prod ','∫':'\\int ','∪':'\\bigcup ','∩':'\\bigcap ','ℝ':'\\mathbb{R}','ℕ':'\\mathbb{N}','ℱ':'\\mathcal{F}','∞':'\\infty ','∈':'\\in ','∉':'\\notin ','∅':'\\varnothing ','⊂':'\\subseteq ','≤':'\\le ','≥':'\\ge ','≠':'\\ne ','→':'\\to ','⇒':'\\Rightarrow ','⇔':'\\Longleftrightarrow ','∀':'\\forall ','∃':'\\exists ','±':'\\pm ','×':'\\times ','·':'\\cdot ','−':'-','‖':'\\Vert ','⊥':'\\perp '};
 const supers='⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵗˣʸᵅᵝᵏᵖᑫʳᵇᶜᵢᶠ';
 const superValues=['0','1','2','3','4','5','6','7','8','9','+','-','=','(',')','n','i','t','x','y','α','β','k','p','q','r','b','c','i','f'];
 const subs='₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₙᵢⱼₖₓᵧₘₚₜᵣᵤᵥ';
 const subValues=['0','1','2','3','4','5','6','7','8','9','+','-','=','(',')','n','i','j','k','x','y','m','p','t','r','u','v'];
 const supMap=new Map([...supers].map((c,i)=>[c,superValues[i]]));
 for(const [c,value] of Object.entries({'ʲ':'j','ᵐ':'m','ᴺ':'N','ᵀ':'T','ᵈ':'d','ᵘ':'u','ᵛ':'v','ᵃ':'a','ᵉ':'e','ᵒ':'o','ᵣ':'r','ᶻ':'z'}))supMap.set(c,value);
 const subMap=new Map([...subs].map((c,i)=>[c,subValues[i]]));
 // Some unicode letters can be both subscript and superscript: normalize common suffixes first.
 for(const [c,value] of Object.entries({'ₐ':'a','ₑ':'e','ₒ':'o','ₕ':'h','ₗ':'l','ₛ':'s'}))subMap.set(c,value);
 function normalize(s){return s.replace(/S₂ᵐ/g,'@STWOM@').replace(/([Σ∑∏∪∩])([₀-₉₊₋₌ₙᵢⱼₖₓᵧₘₚₜᵣᵤᵥ]+)∞/g,'$1$2^∞').replace(/Σₙ≥ₘ/g,'Σ_(n≥m)').replace(/1₍₀,ₙ⁻²₎/g,'@INDTHIN@').replace(/1₍₀,₁\/ₙ₎/g,'@INDSPIKE@').replace(/X̄/g,'@BARX@').replace(/θ̂/g,'@HATTHETA@').replace(/p̂/g,'@HATP@').replace(/σ̂/g,'@HATSIGMA@').replace(/θ̃/g,'@TILDETHETA@').replace(/ã/g,'@TILDEA@').replace(/b̃/g,'@TILDEB@').replace(/∪ₙ≥ₘ/g,'∪_(n≥m)').replace(/∩ₙ≥ₘ/g,'∩_(n≥m)').replace(/∩ₘ₌₁∞/g,'∩_(m=1)^∞').replace(/∪ₘ₌₁∞/g,'∪_(m=1)^∞').replace(/∫₋∞ˣ/g,'∫_(-∞)^x').replace(/∫ℝ/g,'∫_ℝ').replace(/∫₀∞/g,'∫_0^∞').replace(/lim supₙ→∞/g,'@LIMSUP@_(n→∞)').replace(/lim infₙ→∞/g,'@LIMINF@_(n→∞)').replace(/lim supₙ/g,'@LIMSUP@_n').replace(/lim infₙ/g,'@LIMINF@_n').replace(/limₙ→∞/g,'lim_(n→∞)').replace(/limₙ/g,'lim_n').replace(/limₘ/g,'lim_m')}
 const placeholders={'@STWOM@':'\\mathord{S}_{2^m}','@INDTHIN@':'\\mathbf1_{(0,n^{-2}]}','@INDSPIKE@':'\\mathbf1_{(0,1/n]}','@BARX@':'\\bar X','@HATTHETA@':'\\hat\\theta','@HATP@':'\\hat p','@HATSIGMA@':'\\hat\\sigma','@TILDETHETA@':'\\tilde\\theta','@TILDEA@':'\\tilde a','@TILDEB@':'\\tilde b','@LIMSUP@':'\\limsup','@LIMINF@':'\\liminf'};
 function tex(source){
  const s=normalize(source);let i=0;
  function atom(){
   for(const [marker,value] of Object.entries(placeholders))if(s.startsWith(marker,i)){i+=marker.length;return value}
   const c=s[i++];if(c===undefined)return '';
   if(c==='('||c==='{'||c==='['){const end=c==='('?')':c==='{'?'}':']';const inside=read(end);return c==='{'?'\\{'+inside+'\\}':c+inside+end}
   if(c==='√'){let result=atom();while(i<s.length&&(supMap.has(s[i])||subMap.has(s[i])))result+=script();return '\\sqrt{'+result.replace(/^\((.*)\)$/s,'$1')+'}'}
   if(c==='∪'||c==='∩'){const large=s[i]==='_'||subMap.has(s[i]);return c==='∪'?(large?'\\bigcup ':'\\cup '):(large?'\\bigcap ':'\\cap ')}
   if(symbols[c])return symbols[c];
   if(c==='&')return '\\&';if(c==='%')return '\\%';if(c==='#')return '\\#';if(c==='$')return '\\$';if(c==='\\')return '\\backslash ';
   return c;
  }
  function script(){const isSub=subMap.has(s[i]),map=isSub?subMap:supMap;let text='';while(i<s.length&&map.has(s[i]))text+=map.get(s[i++]);return (isSub?'_':'^')+'{'+tex(text)+'}'}
  function read(end){let out='';while(i<s.length){if(end&&s[i]===end){i++;break}
   if(supMap.has(s[i])||subMap.has(s[i])){out+=script();continue}
   if(s[i]==='^'||s[i]==='_'){let op=s[i++],body;if(s[i]==='('){i++;body=read(')')}else if(s[i]==='{'){i++;body=read('}')}else body=atom();out+=op+'{'+body+'}';continue}
   const rest=s.slice(i);const phrase=rest.match(/^(in probability|in distribution|otherwise|a\.s\.|iid|i\.o\.)/);if(phrase){out+='\\;\\text{'+({'in probability':'確率収束','in distribution':'法則収束','otherwise':'それ以外','a.s.':'概収束','iid':'独立同分布','i.o.':'無限回起こる'}[phrase[0]]||phrase[0])+'}';i+=phrase[0].length;continue}
   const word=rest.match(/^(lim sup|lim inf|argmax|Var|Cov|Bias|MSE|SD|SE|sup|inf|lim|max|min|log|exp|sin|cos)(?![a-z])/);if(word){const w=word[0];out+=w==='lim sup'?'\\limsup ':w==='lim inf'?'\\liminf ':['sup','inf','lim','max','min','log','exp','sin','cos'].includes(w)?'\\'+w+' ':'\\operatorname{'+w+'}';i+=w.length;continue}
   const prose=rest.match(/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー、。：・「」（）]+/u);if(prose){out+='\\;\\text{'+prose[0]+'}\\;';i+=prose[0].length;continue}
   if(s[i]==='\u0304'||s[i]==='\u0302'||s[i]==='\u0303'){i++;continue}
   out+=atom();
  }return out}
  return read();
 }
 function rows(source){return exact.get(source)||source.split('\n').flatMap(line=>line.includes(' かつ ')?line.split(' かつ ').flatMap((v,i)=>i?['\\text{かつ}',tex(v)]:[tex(v)]):[tex(line)])}
 function render(source,small=false){const key=source+'|'+small;if(cache.has(key))return cache.get(key);const chunks=rows(source).map(expression=>{
   if(!expression.trim())return '';
   try{return `<div class="math-line">${katex.renderToString(expression,{displayMode:true,throwOnError:true,strict:false,trust:false,output:'htmlAndMathml'})}</div>`}
   catch(error){failures.push({source,message:error.message});return `<div class="math-line math-fallback">${esc(source)}</div>`}
  });const html=`<div class="formula typeset-formula${small?' small':''}" data-formula="${esc(source)}">${chunks.join('')}</div>`;cache.set(key,html);return html}
 return {tex,rows,render,put,failures};
})();
