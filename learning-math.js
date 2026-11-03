const LearningMath = {
  convergence(model,n,omega){
    const k=Math.floor(Math.log2(n)),j=n-2**k;
    const lo=model==='typewriter'?j/2**k:0;
    const hi=model==='typewriter'?(j+1)/2**k:model==='thin'?1/n**2:1/n;
    const height=model==='typewriter'?1:n;
    return {lo,hi,height,probability:hi-lo,mean:height*(hi-lo),value:omega>lo&&omega<=hi?height:0,k,j};
  },
  bernoulliBound(n,p,epsilon){
    let exact=0;
    for(let k=0;k<=n;k++)if(Math.abs(k/n-p)>=epsilon-1e-12)exact+=Stats.density('binomial',k,{n,p});
    return {exact:Math.min(1,exact),bound:Math.min(1,p*(1-p)/(n*epsilon**2)),sd:Math.sqrt(p*(1-p)/n)};
  }
};
if(typeof module!=='undefined')module.exports=LearningMath;
