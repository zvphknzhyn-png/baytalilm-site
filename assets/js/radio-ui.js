/* BAYT AL-ILM — page Radio : compteurs, panneau latéral repliable, écoutés récemment, favoris réservés aux membres. */
(function(){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
/* compteurs : calculés sur l'index (en direct / thématiques) */
const ix=$$('#index .ix');const n=i=>ix[i]?$$('.ix-i',ix[i]).length:0;
const live=n(0),them=n(1),pre=+($('[data-k="pre"]')||{dataset:{count:298}}).dataset.count;
const setK=(k,v)=>{const e=$('[data-k="'+k+'"]');if(e&&v)e.dataset.count=String(v)};
setK('live',live);setK('them',them);setK('all',live+them+pre);
/* session : posée par l'espace membre (bt-session) */
const logged=()=>{try{return !!localStorage.getItem('bt-session')}catch(e){return false}};
let tip=null,tt=0;
function favMsg(){if(!tip){tip=document.createElement('div');tip.className='favmsg';tip.setAttribute('role','status');tip.innerHTML='<span>⭐</span><span>Créez un compte gratuit pour enregistrer vos radios favorites.</span><a class="btn btn-p btn-sm" href="inscription.html">Créer un compte</a>';document.body.appendChild(tip)}
 tip.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>tip.classList.remove('on'),5200)}
document.addEventListener('click',e=>{const f=e.target.closest('#player .fav,#stations .fav,#chips .chip[data-f="fav"]');if(f&&!logged()){e.preventDefault();e.stopImmediatePropagation();favMsg()}},true);
/* panneau latéral : groupes repliables */
const Q=$('#player .queue');if(!Q)return;
const RK='bt-radio-recent';const rec=()=>{try{return JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){return []}};
function group(title,icon,items,cls){const g=document.createElement('div');g.className='qg '+(cls||'');
 g.innerHTML='<button class="qg-h" aria-expanded="true"><span>'+icon+'</span><span class="qt-t"></span><span class="qn"></span><span class="qc">▾</span></button><div class="qg-b"><div></div></div>';
 $('.qt-t',g).textContent=title;$('.qn',g).textContent=items.length||'';items.forEach(i=>$('.qg-b>div',g).appendChild(i));
 const h=$('.qg-h',g);h.onclick=()=>{const s=g.classList.toggle('shut');h.setAttribute('aria-expanded',String(!s))};return g}
const kids=[...Q.children];const hs=kids.filter(k=>k.tagName==='H4');
const liveI=kids.filter(k=>k.matches('.qi[data-kind="live"]')),preI=kids.filter(k=>k.matches('.qi[data-kind="pl"]'));
const note=kids.find(k=>k.tagName==='P');
hs.forEach(h=>h.remove());
const gR=group('Écoutés récemment','🕘',[],'qg-recent');
const gL=group('En direct maintenant','<span class="rdot" style="font-size:30px;margin:0 2px"></span>',liveI);
const gP=group('Préenregistrées','💿',preI);
Q.prepend(gR,gL,gP);if(note)Q.appendChild(note);
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function drawRecent(){const L=rec();gR.style.display=L.length?'':'none';const box=$('.qg-b>div',gR);
 box.innerHTML=L.map(s=>'<div class="qi" role="button" tabindex="0" data-rid="'+esc(s.id)+'"><span class="qav ar">'+esc((s.a||s.n).split(' ')[0])+'</span><span class="qt"><b>'+esc(s.n)+'</b><small>n° '+esc(s.id)+'</small></span><span class="bdg '+(s.t==='l'?'bdg-live"><i></i>Direct':'bdg-pre">Préenr.')+'</span></div>').join('');
 $('.qn',gR).textContent=L.length||''}
gR.addEventListener('click',e=>{const q=e.target.closest('[data-rid]');if(q&&window.BaytRadio){BaytRadio.play(q.dataset.rid);$$('.qi',Q).forEach(x=>x.classList.toggle('on',x===q))}});
gR.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-rid]')){e.preventDefault();e.target.click()}});
document.addEventListener('bt:playing',e=>{const s=e.detail;if(!s)return;let L=rec().filter(x=>x.id!==s.id);L.unshift({id:s.id,n:s.n,a:s.a||'',t:s.t});L=L.slice(0,5);try{localStorage.setItem(RK,JSON.stringify(L))}catch(x){}drawRecent()});
drawRecent();
/* arrivée depuis l'accueil : #ecouter */
if(location.hash==='#ecouter'){addEventListener('load',()=>{const p=$('#ecouter');if(p)scrollTo({top:p.getBoundingClientRect().top+scrollY-84})})}
})();
