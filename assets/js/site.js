// BAYT AL-ILM maquette v3 — animations (démo, pas du code de prod)
(function(){
const q=new URLSearchParams(location.search), root=document.documentElement;
const theme=q.get('theme')||localStorage.getItem('bt-theme')||'dark'; root.setAttribute('data-theme',theme);
const STATIC=q.get('static')==='1'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches); if(STATIC) root.classList.add('static'); if(q.get('ann')==='1') root.classList.add('show-ann');
window.setTheme=t=>{root.setAttribute('data-theme',t);try{localStorage.setItem('bt-theme',t)}catch(e){}document.querySelectorAll('.theme span').forEach(s=>s.setAttribute('aria-pressed',String(s.dataset.t===t)))};
document.addEventListener('DOMContentLoaded',()=>{
 // emojis style Apple : remplace chaque emoji par son image (assets/emoji/<code>.png)
 const BL='→↓⇄☆★☰⚇⚿✦✓⏮⏭▶◀⌘';const RE=/(\p{Extended_Pictographic})\uFE0F?/gu,RT=/\p{Extended_Pictographic}/u;
 const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>(n.parentElement&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentElement.tagName))?2:(RT.test(n.textContent)?1:2)});
 const tn=[];while(tw.nextNode())tn.push(tw.currentNode);
 tn.forEach(n=>{RE.lastIndex=0;const t=n.textContent,f=document.createDocumentFragment();let last=0,m;RE.lastIndex=0;while((m=RE.exec(t))){const ch=m[1];if((BL.includes(ch)&&!m[0].includes('\uFE0F'))||/[\u2190-\u21FF©®™]/.test(ch))continue;f.appendChild(document.createTextNode(t.slice(last,m.index)));const im=document.createElement('img');im.className='emo';im.alt=ch;im.src=(document.documentElement.dataset.base||'')+'assets/emoji/'+[...ch].map(c=>c.codePointAt(0).toString(16)).join('-')+'.png';im.onerror=()=>im.replaceWith(document.createTextNode(ch));f.appendChild(im);last=m.index+m[0].length}if(last){f.appendChild(document.createTextNode(t.slice(last)));n.replaceWith(f)}});
 // menu mobile
 document.querySelectorAll('.burger').forEach(b=>b.addEventListener('click',()=>document.body.classList.toggle('menu-open')));
 // reveal on scroll
 const rv=[...document.querySelectorAll('.rv')];
 if(STATIC) rv.forEach(e=>e.classList.add('in')); else {const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});rv.forEach((e,i)=>{e.style.transitionDelay=(e.dataset.d||0)+'ms';io.observe(e)})}
 // counters
 document.querySelectorAll('[data-count]').forEach(el=>{const end=+el.dataset.count,suf=el.dataset.suf||'',fmt=n=>Math.round(n).toLocaleString('fr-FR')+suf;
  if(STATIC){el.textContent=fmt(end);return}
  el.textContent=fmt(0);const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/(+el.dataset.dur||3400));el.textContent=fmt(end*(k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}});io.observe(el)});
 // gauges
 document.querySelectorAll('[data-fill]').forEach(el=>{if(STATIC){el.style.width=el.dataset.fill;return}el.style.width='0';el.style.transition='width 1.8s cubic-bezier(.2,.7,.2,1)';new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();setTimeout(()=>el.style.width=el.dataset.fill,200)}}).observe(el)});
 // waveform bars random delays
 document.querySelectorAll('.wave i').forEach((b,i)=>{b.style.animationDelay=(-Math.random()*1.2).toFixed(2)+'s';b.style.animationDuration=(0.7+Math.random()*0.8).toFixed(2)+'s'});
 // animated ink waves (svg)
 document.querySelectorAll('svg.fx-waves').forEach(svg=>{const n=+(svg.dataset.n||6),W=1600,H=+(svg.dataset.h||400);svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('preserveAspectRatio','none');
  const ps=[];for(let i=0;i<n;i++){const p=document.createElementNS('http://www.w3.org/2000/svg','path');if(i%3===1)p.setAttribute('class','gw');svg.appendChild(p);ps.push(p)}
  const draw=t=>{ps.forEach((p,i)=>{const y0=H*(0.25+0.6*i/n),a=10+i*3,f=0.004+i*0.0006,sp=0.0004+i*0.00012;let d=`M0 ${y0}`;for(let x=0;x<=W;x+=20){d+=` L${x} ${(y0+Math.sin(x*f+t*sp+i)*a+Math.sin(x*f*2.3-t*sp*1.7)*a*0.35).toFixed(1)}`}p.setAttribute('d',d)})};
  if(STATIC)draw(4000);else{const loop=t=>{draw(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}});
 // gold dust particles
 document.querySelectorAll('[data-dust]').forEach(host=>{const c=document.createElement('canvas');c.className='dust';host.prepend(c);const ctx=c.getContext('2d');let W,H,P=[];
  const rs=()=>{W=c.width=host.offsetWidth;H=c.height=host.offsetHeight;P=Array.from({length:Math.round(W*H/9000*(+host.dataset.dust||1))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.3,v:Math.random()*.35+.08,a:Math.random()*.7+.2,ph:Math.random()*6}))};rs();
  const draw=t=>{ctx.clearRect(0,0,W,H);P.forEach(p=>{if(!STATIC){p.y-=p.v;p.x+=Math.sin(t/1500+p.ph)*.2;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}}const al=p.a*(.55+.45*Math.sin(t/700+p.ph));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle=`rgba(201,164,92,${al})`;ctx.shadowColor='rgba(201,164,92,.9)';ctx.shadowBlur=6;ctx.fill()})};
  if(STATIC)draw(1000);else{const loop=t=>{draw(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}});
 // parallax
 const par=[...document.querySelectorAll('[data-par]')];
 const onScroll=()=>{const y=scrollY;par.forEach(e=>{const r=e.parentElement.getBoundingClientRect();e.style.transform=`translate3d(0,${(-(r.top)*(+e.dataset.par)).toFixed(1)}px,0) scale(${e.dataset.sc||1})`})};
 if(!STATIC){addEventListener('scroll',onScroll,{passive:true});onScroll()} else par.forEach(e=>e.style.transform=`scale(${e.dataset.sc||1})`);
 // lantern cursor glow
 document.querySelectorAll('[data-lantern]').forEach(h=>{const g=document.createElement('div');g.style.cssText='position:absolute;width:520px;height:520px;border-radius:50%;pointer-events:none;z-index:1;background:radial-gradient(circle,rgba(201,164,92,.22),transparent 62%);left:60%;top:20%;transform:translate(-50%,-50%);transition:left .4s ease-out,top .4s ease-out';h.appendChild(g);h.addEventListener('mousemove',e=>{const r=h.getBoundingClientRect();g.style.left=(e.clientX-r.left)+'px';g.style.top=(e.clientY-r.top)+'px'})});
 // typing code
 document.querySelectorAll('[data-type]').forEach(pre=>{const html=pre.innerHTML;if(STATIC)return;const tmp=document.createElement('div');tmp.innerHTML=html;const full=tmp.innerHTML;pre.innerHTML='';
  // type by characters of text nodes while preserving spans
  const nodes=[];(function walk(n,parent){n.childNodes.forEach(ch=>{if(ch.nodeType===3){nodes.push({parent,text:ch.textContent})}else{const cl=ch.cloneNode(false);parent.appendChild(cl);walk(ch,cl)}})})(tmp,pre);
  // rebuild: clear text, then fill progressively
  pre.innerHTML='';const targets=[];(function walk(n,parent){n.childNodes.forEach(ch=>{if(ch.nodeType===3){const t=document.createTextNode('');parent.appendChild(t);targets.push([t,ch.textContent])}else{const cl=ch.cloneNode(false);parent.appendChild(cl);walk(ch,cl)}})})(tmp,pre);
  const caret=document.createElement('span');caret.className='caret';pre.appendChild(caret);let i=0,j=0;const sp=+(pre.dataset.type||18);
  const tick=()=>{if(i>=targets.length)return;const [t,s]=targets[i];t.textContent=s.slice(0,++j);if(j>=s.length){i++;j=0}setTimeout(tick,s[j-1]==='\n'?sp*8:sp)};setTimeout(tick,600)});
 // marquee duplicate
 document.querySelectorAll('.marq-in').forEach(m=>{m.innerHTML+=m.innerHTML});
 // titres : découpe en mots (révélation flou -> net)
 document.querySelectorAll('h1.serif,h2.serif,.split').forEach(h=>{let k=0;const walk=n=>{[...n.childNodes].forEach(ch=>{if(ch.nodeType===3){const parts=ch.textContent.split(/(\s+)/);const f=document.createDocumentFragment();parts.forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const s=document.createElement('span');s.className='wd';s.textContent=w;s.style.transitionDelay=(k++*45)+'ms';f.appendChild(s)});ch.replaceWith(f)}else if(ch.nodeType===1&&!ch.classList.contains('ar')&&ch.tagName!=='BR')walk(ch)})};walk(h);
  if(STATIC){h.classList.add('words-in');return}const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();h.classList.add('words-in')}},{threshold:.3});io.observe(h)});
 // halo d'encre qui suit le curseur sur les cartes
 document.querySelectorAll('.card').forEach(c=>{if(!c.querySelector('.ihalo')){const h=document.createElement('div');h.className='ihalo';c.appendChild(h)}c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
 // forme d'onde : barres + tête de lecture dorée qui balaie, partie lue en or
 document.querySelectorAll('canvas.wf').forEach(c=>{const ctx=c.getContext('2d');const dpr=devicePixelRatio||1;const W=c.offsetWidth,H=c.offsetHeight;c.width=W*dpr;c.height=H*dpr;ctx.scale(dpr,dpr);
  const N=Math.floor(W/5),seed=[...Array(N)].map((_,i)=>.25+.75*Math.abs(Math.sin(i*.37)*Math.cos(i*.11)+Math.sin(i*1.7)*.3));const start=+(c.dataset.pos||.42);
  const draw=t=>{ctx.clearRect(0,0,W,H);const pos=STATIC?start:(start+t/60000)%1,px=pos*W;
   for(let i=0;i<N;i++){const x=i*5+1,live=STATIC?1:.82+.18*Math.sin(t/260+i*.6),h=Math.max(3,seed[i]*H*.86*live),d=Math.abs(x-px);
    ctx.fillStyle=x<px?`rgba(201,164,92,${.55+.45*Math.max(0,1-d/160)})`:((c.closest('.ink')||document.documentElement.dataset.theme!=='light')?'rgba(232,238,242,.3)':'rgba(11,30,54,.28)');ctx.fillRect(x,(H-h)/2,2.4,h)}
   const g=ctx.createRadialGradient(px,H/2,0,px,H/2,70);g.addColorStop(0,'rgba(243,223,168,.35)');g.addColorStop(1,'rgba(243,223,168,0)');ctx.fillStyle=g;ctx.fillRect(px-70,0,140,H);
   ctx.fillStyle='#F3DFA8';ctx.fillRect(px-1,4,2,H-8);ctx.beginPath();ctx.arc(px,6,4,0,7);ctx.fill()};
  if(STATIC)draw(0);else{const loop=t=>{draw(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}});
 // sommaire : progression + article actif
 document.querySelectorAll('[data-toc]').forEach(t=>{const bar=t.querySelector('.pr i'),links=[...t.querySelectorAll('a')],secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  if(STATIC){bar.style.width='38%';return}
  const up=()=>{const f=secs[0].getBoundingClientRect().top+scrollY-200,l=secs[secs.length-1].getBoundingClientRect().bottom+scrollY-innerHeight;bar.style.width=Math.max(0,Math.min(100,(scrollY-f)/(l-f)*100))+'%';let k=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.4)k=i});links.forEach((a,i)=>a.classList.toggle('on',i===k))};addEventListener('scroll',up,{passive:true});up()});
 // theme toggle
 document.querySelectorAll('.theme span').forEach(s=>{s.setAttribute('role','button');s.setAttribute('tabindex','0');s.setAttribute('aria-label',s.dataset.t==='light'?'Thème clair':'Thème sombre');s.addEventListener('click',()=>setTheme(s.dataset.t));s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setTheme(s.dataset.t)}})});setTheme(root.getAttribute('data-theme'));
});
})();
