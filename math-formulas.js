/* Explicit TeX for the principal definitions; text alternatives remain in data. */
(()=>{
 const R=String.raw,put=(source,...rows)=>MathDisplay.put(source,rows);
 const definitions=[
  [R`s=\sup S`,R`\Longleftrightarrow\quad \forall x\in S,\ x\le s`,R`\text{かつ}`,R`\forall\varepsilon>0,\ \exists x\in S:\ s-\varepsilon<x`,R`\text{Sは空でなく、上に有界な実数の集合}`],
  [R`r=\inf S`,R`\Longleftrightarrow\quad \forall x\in S,\ r\le x`,R`\text{かつ}`,R`\forall\varepsilon>0,\ \exists x\in S:\ x<r+\varepsilon`,R`\text{Sは空でなく、下に有界な実数の集合}`],
  [R`u_n=\sup\{a_k:k\ge n\}`,R`\limsup_{n\to\infty}a_n=\lim_{n\to\infty}u_n`,R`=\inf\{u_n:n\ge1\}`],
  [R`v_n=\inf\{a_k:k\ge n\}`,R`\liminf_{n\to\infty}a_n=\lim_{n\to\infty}v_n`,R`=\sup\{v_n:n\ge1\}`,R`a_n\to L\ \Longleftrightarrow\ \liminf a_n=\limsup a_n=L`,R`L\in\mathbb R`],
  [R`\limsup_{n\to\infty}A_n=\bigcap_{m=1}^{\infty}\bigcup_{n=m}^{\infty}A_n`,R`\omega\in\limsup A_n`,R`\Longleftrightarrow\quad \forall m\in\mathbb N,\ \exists n\ge m:\ \omega\in A_n`],
  [R`\liminf_{n\to\infty}A_n=\bigcup_{m=1}^{\infty}\bigcap_{n=m}^{\infty}A_n`,R`\omega\in\liminf A_n`,R`\Longleftrightarrow\quad \exists m\in\mathbb N,\ \forall n\ge m:\ \omega\in A_n`,R`\liminf A_n\subseteq\limsup A_n`]
 ];
 limitDefinitions.forEach((d,i)=>put(d.equation,...definitions[i]));
 const chapter={
  'probability:events':[
   [R`A_n=\{\omega\in\Omega:X(\omega)>n\}`,R`\mathbf1_{A_n}(\omega)=\begin{cases}1&\omega\in A_n\\0&\omega\notin A_n\end{cases}`],
   definitions[4],
   [R`\text{独立の定義：}\ P(A\cap B)=P(A)P(B)`,R`A_j\subseteq A_i\ \Longrightarrow\ P(A_i\cap A_j)=P(A_j)`]
  ],
  'probability:transforms':[
   [R`p(x)\ge0,\qquad\sum_xp(x)=1`,R`f(x)\ge0,\qquad\int_{\mathbb R}f(x)\,dx=1`],
   [R`M_X(t)=\mathbb E[e^{tX}]`,R`\mathbb E[X]=M_X'(0)`,R`\operatorname{Var}(X)=M_X''(0)-\{M_X'(0)\}^2`,R`\text{MGFが0の開近傍で有限なとき}`],
   [R`\varphi_X(t)=\mathbb E[e^{itX}]`,R`=\mathbb E[\cos(tX)]+i\mathbb E[\sin(tX)]`,R`\varphi_X(0)=1,\quad|\varphi_X(t)|\le1\quad(t\in\mathbb R)`]
  ],
  'probability:convergence':[
   [R`X_n\xrightarrow{\text{確率}}X`,R`\Longleftrightarrow\quad\forall\varepsilon>0,\ \lim_{n\to\infty}P(|X_n-X|>\varepsilon)=0`,R`\Longleftrightarrow\quad\forall\varepsilon>0,\ \forall\delta>0,\ \exists N,`,R`\forall n\ge N:\ P(|X_n-X|>\varepsilon)<\delta`],
   [R`X_n\xrightarrow{\text{概収束}}X`,R`\Longleftrightarrow\quad P\{\omega:X_n(\omega)\to X(\omega)\}=1`,R`\text{各結果での収束：}\ \forall\varepsilon>0,\ \exists N=N(\omega,\varepsilon),`,R`\forall n\ge N:\ |X_n(\omega)-X(\omega)|<\varepsilon`],
   [R`X_n\xrightarrow{L^p}X\ \Longleftrightarrow\ \mathbb E[|X_n-X|^p]\to0`,R`\text{各変数と極限が}L^p\text{に属する通常の定義。}p>0`],
   [R`X_n\xrightarrow{\text{法則}}X`,R`\Longleftrightarrow\quad F_n(x)\to F(x)`,R`\text{極限の分布関数Fが連続な、すべての点xで成立}`,R`\text{概収束}\ \Longrightarrow\ \text{確率収束}\ \Longrightarrow\ \text{法則収束}`,R`L^p\text{収束}\ \Longrightarrow\ \text{確率収束}`]
  ],
  'probability:limit-tools':[
   [R`P(|X_n-X|>\varepsilon)\le\frac{\mathbb E[|X_n-X|^p]}{\varepsilon^p}`,R`\mathbb E[|X_n-X|^p]\to0\ \Longrightarrow\ X_n\xrightarrow{\text{確率}}X`],
   [R`X_n\xrightarrow{\text{確率}}X\ \Longrightarrow\ g(X_n)\xrightarrow{\text{確率}}g(X)`,R`\text{Xがgの不連続点に入る確率が0}`],
   [R`X_n\xrightarrow{\text{法則}}X,\qquad Y_n\xrightarrow{\text{確率}}c`,R`X_n+Y_n\xrightarrow{\text{法則}}X+c`,R`X_nY_n\xrightarrow{\text{法則}}cX`,R`\frac{X_n}{Y_n}\xrightarrow{\text{法則}}\frac Xc\qquad(c\ne0)`]
  ],
  'probability:weak-law':[
   [R`P(Y\ge a)\le\frac{\mathbb E[Y]}a\qquad(Y\ge0,\ a>0)`],
   [R`P(|X-\mu|\ge\varepsilon)\le\frac{\sigma^2}{\varepsilon^2}`,R`\mu=\mathbb E[X],\quad\sigma^2=\operatorname{Var}(X)<\infty,\quad\varepsilon>0`],
   [R`\bar X_n=\frac1n\sum_{i=1}^{n}X_i`,R`\mathbb E[\bar X_n]=\mu,\quad\operatorname{Var}(\bar X_n)=\frac{\sigma^2}n`,R`P(|\bar X_n-\mu|\ge\varepsilon)\le\frac{\sigma^2}{n\varepsilon^2}\to0`],
   [R`S_n=\sum_{i=1}^{n}X_i,\qquad\hat p=\frac{S_n}n`,R`X_i\text{は独立同分布のベルヌーイ変数}`,R`\operatorname{Var}(S_n)=np(1-p)`,R`\operatorname{Var}(\hat p)=\frac{p(1-p)}n`]
  ],
  'probability:strong-law':[
   [R`\sum_{n=1}^{\infty}P(A_n)<\infty\ \Longrightarrow\ P(\limsup A_n)=0`,R`\text{第1ボレル・カンテリ。独立性は不要}`],
   [R`A_1,A_2,\ldots\text{が独立}`,R`\text{かつ}\quad\sum_{n=1}^{\infty}P(A_n)=\infty`,R`\Longrightarrow\quad P(\limsup A_n)=1`],
   [R`P\!\left(\left|\frac{S_{2^m}}{2^m}-\mu\right|>\varepsilon\right)\le\frac{\sigma^2}{\varepsilon^2 2^m}`,R`\sum_{m=1}^{\infty}2^{-m}=1`],
   [R`P\!\left(\max_{1\le k\le n}|T_k|\ge\lambda\right)\le\frac{\operatorname{Var}(T_n)}{\lambda^2}`,R`\text{独立、各増分の平均0、有限分散、}\lambda>0`,R`\text{有限分散の独立同分布標本なら}\quad\frac{S_n}n\xrightarrow{\text{概収束}}\mu`]
  ]
 };
 const stat={
  1:[[R`\mathbb E[X]=\sum_x xP(X=x)\quad\text{（離散）}`,R`\mathbb E[X]=\int_{\mathbb R}xf(x)\,dx\quad\text{（密度を持つ連続分布）}`,R`\text{有限な期待値には}\quad\mathbb E[|X|]<\infty\text{を確認}`],[R`\mu=\mathbb E[X],\quad\operatorname{Var}(X)=\mathbb E[(X-\mu)^2]`,R`=\mathbb E[X^2]-\mu^2\quad\text{（2次積率が有限）}`,R`\operatorname{SD}(X)=\sqrt{\operatorname{Var}(X)}`],[R`F_X(x)=P(X\le x)`,R`P(a<X\le b)=F_X(b)-F_X(a)`]],
  2:[[R`\mathrm{Ber}(p):\ P(X=x)=p^x(1-p)^{1-x},\quad x=0,1`,R`\mathrm{Bin}(n,p):\ P(X=x)=\binom nx p^x(1-p)^{n-x}`,R`x=0,\ldots,n`,R`\mathrm{Ge}(p):\ P(X=x)=p(1-p)^x,\quad x=0,1,\ldots`],[R`P(a<X\le b)=\int_a^bf(x)\,dx`,R`f(x)\ge0,\quad\int_{\mathbb R}f(x)\,dx=1`],[R`M_X(t)=\mathbb E[e^{tX}],\quad K_X(t)=\log M_X(t)`,R`\mathbb E[X]=M_X'(0)=K_X'(0)`,R`\operatorname{Var}(X)=M_X''(0)-\{M_X'(0)\}^2=K_X''(0)`,R`\text{0の開近傍でMGFが有限}`]],
  3:[[R`\Sigma_{ij}=\operatorname{Cov}(X_i,X_j)`,R`=\mathbb E[(X_i-\mu_i)(X_j-\mu_j)]`,R`\rho=\frac{\operatorname{Cov}(X_1,X_2)}{\operatorname{SD}(X_1)\operatorname{SD}(X_2)}`],[R`X_2\mid X_1=x_1\ \sim N\!\left(\mu_2+\frac{\sigma_{21}}{\sigma_{11}}(x_1-\mu_1),\ \sigma_{22}-\frac{\sigma_{21}^2}{\sigma_{11}}\right)`,R`\text{二変量正規、正定値の共分散行列}`],[R`\text{独立：}\ P(X_1\in A,X_2\in B)=P(X_1\in A)P(X_2\in B)`,R`\text{同時正規なら}\quad\text{無相関}\Longleftrightarrow\text{独立}`]],
  4:[[R`X_i\text{が独立同分布の}N(\mu,\sigma^2)`,R`\Longrightarrow\quad\bar X\sim N\!\left(\mu,\frac{\sigma^2}n\right)`,R`\bar X=\frac1n\sum_{i=1}^{n}X_i`],[R`S^2=\frac{1}{n-1}\sum_i(X_i-\bar X)^2,\quad\mathbb E[S^2]=\sigma^2`,R`\text{正規標本なら}\quad\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}`],[R`T=\frac{\sqrt n(\bar X-\mu)}S\sim t_{n-1}`,R`\text{正規標本、}\ n\ge2,\quad S=\sqrt{S^2}`]],
  5:[[R`P(X_{(n)}\le y)=F(y)^n\quad\text{（独立同分布）}`],[R`P(X_{(1)}\le y)=1-\{1-F(y)\}^n\quad\text{（独立同分布）}`],[R`P(X_{(i)}\le y)=\sum_{k=i}^{n}\binom nk F(y)^k\{1-F(y)\}^{n-k}`]],
  6:[[R`\text{不偏：}\ \mathbb E_\theta[T]=\theta\quad\text{（すべての母数）}`,R`\operatorname{Bias}_\theta(T)=\mathbb E_\theta[T]-\theta`],[R`\operatorname{MSE}_\theta(T)=\mathbb E_\theta[(T-\theta)^2]`,R`=\operatorname{Var}_\theta(T)+\{\operatorname{Bias}_\theta(T)\}^2`],[R`Q=\sum_i(X_i-\bar X)^2`,R`\frac{\operatorname{MSE}(cQ)}{\sigma^4}=2c^2(n-1)+\{c(n-1)-1\}^2`,R`c^*=\frac1{n+1}\quad\text{（正規標本）}`]],
  7:[[R`U(\theta)=\frac{\partial\log L(\theta)}{\partial\theta}`,R`I_n(\theta)=\mathbb E_\theta[U(\theta)^2]`],[R`\operatorname{Var}_\theta(T)\ge\frac{\{g'(\theta)\}^2}{I_n(\theta)}`,R`g(\theta)\text{の不偏推定量T、正則条件}`],[R`\mathbb E_\theta\!\left[\frac{\partial\log L}{\partial\theta}\right]=0\quad\text{（正則条件）}`,R`\text{台が母数に依存するときは、境界項にも注意}`]],
  8:[[R`f(x;\theta)=g(T(x),\theta)h(x)`,R`\Longrightarrow\quad T\text{は十分統計量}`,R`\text{因子分解定理が適用できるモデル}`],[R`\text{正規で平均・分散が未知：}\quad T=\left(\sum_iX_i,\sum_iX_i^2\right)\text{が十分}`],[R`\text{完備：}\ \mathbb E_\theta[h(T)]=0\quad\text{がすべての母数で成立}`,R`\Longrightarrow\quad P_\theta(h(T)=0)=1\quad\text{がすべての母数で成立}`]],
  9:[[R`L(\theta;x)=\prod_{i=1}^{n}f(x_i;\theta)`,R`\hat\theta\in\underset{\theta}{\operatorname{argmax}}\,L(\theta;x)`],[R`\ell(\theta)=\log L(\theta)=\sum_i\log f(x_i;\theta)`,R`\text{内点の候補：}\ \ell'(\theta)=0\quad\text{（最大性と境界も確認）}`],[R`\text{不偏：}\ \mathbb E_\theta[T_n]=\theta`,R`\text{一致：}\ T_n\xrightarrow{\text{確率}}\theta`,R`\text{最尤：}\ T_n\text{が尤度を最大化}`]],
  10:[[R`m_r=\frac1n\sum_iX_i^r`,R`\text{モーメント法：}\ \mathbb E_\theta[X^r]=m_r\text{を母数について解く}`],[R`U(a,b):\ \mathbb E[X]=\frac{a+b}2,\quad\operatorname{Var}(X)=\frac{(b-a)^2}{12}`,R`\tilde a=m_1-\sqrt{3(m_2-m_1^2)}`,R`\tilde b=m_1+\sqrt{3(m_2-m_1^2)}`],[R`f(x;\theta)=\theta x^{\theta-1},\quad0<x<1,\quad\theta>0`,R`\text{モーメント：}\ \tilde\theta=\frac{\bar X}{1-\bar X}`,R`\text{最尤：}\ \hat\theta=-\frac n{\sum_i\log X_i}`]],
  11:[[R`\operatorname{SE}(\bar X)=\frac\sigma{\sqrt n}`,R`Z=\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)`,R`\text{正規・母標準偏差が既知}`],[R`P_\mu(L(X)\le\mu\le U(X))=1-\alpha`,R`\text{正規・母標準偏差が既知：}`,R`\left[\bar X-z_{\alpha/2}\frac\sigma{\sqrt n},\quad\bar X+z_{\alpha/2}\frac\sigma{\sqrt n}\right]`],[R`T=\frac{\sqrt n(\bar X-\mu)}S\sim t_{n-1}`,R`\text{正規・母標準偏差が未知。平均の区間：}`,R`\bar X\pm t_{n-1,\alpha/2}\frac S{\sqrt n}`]],
  12:[[R`Q=(n-1)S^2`,R`\frac Q{\sigma^2}\sim\chi^2_{n-1}\quad\text{（正規、母平均が未知）}`],[R`P\!\left(a\le\frac Q{\sigma^2}\le b\right)=1-\alpha`,R`\Longleftrightarrow\quad P\!\left(\frac Qb\le\sigma^2\le\frac Qa\right)=1-\alpha`,R`\text{上側点：}\ P(\chi^2>q_u)=u`],[R`R=\frac{S_1^2}{S_2^2},\quad r=\frac{\sigma_1^2}{\sigma_2^2}`,R`\frac Rr\sim F(n_1-1,n_2-1)`,R`r\text{の区間：}\ \left[\frac R{f_{\alpha/2}},\quad\frac R{f_{1-\alpha/2}}\right]`]],
  13:[[R`\hat p=\frac1n\sum_iX_i,\quad X_i\text{は独立同分布のベルヌーイ変数}`,R`\mathbb E[\hat p]=p,\quad\operatorname{Var}(\hat p)=\frac{p(1-p)}n`],[R`\text{推定標準誤差}=\sqrt{\frac{\hat p(1-\hat p)}n}`,R`\text{ワルド区間：}\ \hat p\pm z_{\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}n}`],[R`\hat p=0\text{または}1\ \Longrightarrow\ \text{ワルドの推定標準誤差}=0`,R`\text{小標本や端の比率では、近似の被覆率が悪くなることがある}`]]
 };
 for(const [key,values] of Object.entries(chapterEquations)){const mapped=chapter[key]||stat[key.split(':')[1]];if(mapped)values.forEach((source,i)=>put(source,...mapped[i]));}
 const dist={
  normal:[R`f(x)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\quad x\in\mathbb R`,R`M(t)=\exp\!\left(\mu t+\frac{\sigma^2t^2}2\right)`],
  bernoulli:[R`P(X=x)=p^x(1-p)^{1-x},\quad x=0,1`,R`M(t)=1-p+pe^t`],
  binomial:[R`P(X=x)=\binom nx p^x(1-p)^{n-x},\quad x=0,\ldots,n`,R`M(t)=(1-p+pe^t)^n`],
  poisson:[R`P(X=x)=\frac{e^{-\lambda}\lambda^x}{x!},\quad x=0,1,\ldots`,R`M(t)=\exp\{\lambda(e^t-1)\}`],
  geometric:[R`P(X=x)=p(1-p)^x,\quad x=0,1,\ldots`,R`M(t)=\frac p{1-(1-p)e^t}`],
  nb:[R`P(X=x)=\binom{n+x-1}{x}p^n(1-p)^x,\quad x=0,1,\ldots`,R`M(t)=\left(\frac p{1-(1-p)e^t}\right)^n`],
  uniform:[R`f(x)=\frac1{b-a}\quad(a<x<b),\quad\text{区間外では0}`,R`M(t)=\frac{e^{bt}-e^{at}}{t(b-a)}\ (t\ne0),\quad M(0)=1`],
  exponential:[R`f(x)=\lambda e^{-\lambda x}\quad(x\ge0),\quad\text{範囲外では0}`,R`M(t)=\frac\lambda{\lambda-t}`],
  gamma:[R`f(x)=\frac{\beta^\alpha}{\Gamma(\alpha)}x^{\alpha-1}e^{-\beta x},\quad x>0`,R`M(t)=\left(\frac\beta{\beta-t}\right)^\alpha`],
  beta:[R`f(x)=\frac{x^{\alpha-1}(1-x)^{\beta-1}}{B(\alpha,\beta)},\quad0<x<1`,R`M(t)=\sum_{k=0}^{\infty}\frac{(\alpha)_k}{(\alpha+\beta)_k}\frac{t^k}{k!}`],
  chi2:[R`f(x)=\frac{x^{\nu/2-1}e^{-x/2}}{2^{\nu/2}\Gamma(\nu/2)},\quad x>0`,R`M(t)=(1-2t)^{-\nu/2}`],
  t:[R`f(x)=\frac{\Gamma((\nu+1)/2)}{\sqrt{\pi\nu}\,\Gamma(\nu/2)}\left(1+\frac{x^2}\nu\right)^{-(\nu+1)/2},\quad x\in\mathbb R`,R`\text{0の近傍で有限な積率母関数は存在しない}`],
  f:[R`f(x)=\frac{(n/m)^{n/2}x^{n/2-1}}{B(n/2,m/2)(1+nx/m)^{(n+m)/2}},\quad x>0`,R`\text{0の近傍で有限な積率母関数は存在しない}`],
  cauchy:[R`f(x)=\frac1{\pi(1+x^2)},\quad x\in\mathbb R`,R`\text{0の近傍で有限な積率母関数は存在しない}`]
 };
 for(const d of distributions){put(d.pdf,dist[d.id][0]);put(d.mgf,dist[d.id][1]);}
 const aliases=[
  ['f(x)=exp{−(x−μ)ᵀΣ⁻¹(x−μ)/2} / {(2π)^(d/2)|Σ|^(1/2)}',[R`f(\boldsymbol x)=\frac{\exp\{-\tfrac12(\boldsymbol x-\boldsymbol\mu)^\mathsf T\Sigma^{-1}(\boldsymbol x-\boldsymbol\mu)\}}{(2\pi)^{d/2}|\Sigma|^{1/2}}`]],
  ['M(t)=exp(μᵀt+tᵀΣt/2)',[R`M(\boldsymbol t)=\exp\!\left(\boldsymbol\mu^\mathsf T\boldsymbol t+\frac12\boldsymbol t^\mathsf T\Sigma\boldsymbol t\right)`]],
  ['P(|Xₙₖⱼ−X|>1/j)<2⁻ʲ\nΣⱼ2⁻ʲ<∞ ⇒ Xₙₖⱼ→X a.s.',[R`P(|X_{n_{k_j}}-X|>1/j)<2^{-j}`,R`\sum_j2^{-j}<\infty\ \Longrightarrow\ X_{n_{k_j}}\xrightarrow{\text{概収束}}X`]],
  ['P(max₁≤ₖ≤ₙ|Tₖ|≥λ)≤Var(Tₙ)/λ²',[R`P\!\left(\max_{1\le k\le n}|T_k|\ge\lambda\right)\le\frac{\operatorname{Var}(T_n)}{\lambda^2}`]],
  ['|Tₙ|/n ≤ 2 maxₖ≤₂ᵐ|Tₖ|/2ᵐ →0 a.s.\nしたがって Sₙ/n→μ a.s.',[R`\frac{|T_n|}n\le\frac{2}{2^m}\max_{k\le2^m}|T_k|\longrightarrow0\quad\text{（概収束）}`,R`\text{したがって}\quad S_n/n\xrightarrow{\text{概収束}}\mu`]]
 ];
 for(const [source,rows] of aliases)put(source, ...rows);
})();
