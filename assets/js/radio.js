/* BAYT AL-ILM — lecteur radio réel (flux en direct et Corans préenregistrés de la radio du bot Discord).
   Données : assets/data/stations.json (471 stations, station 227 exclue) ou l'API Bayt Al-Ilm si BAYT_API_BASE est renseignée. */
(function(){
const CFG=window.BAYT_CONFIG||{},BASE=(CFG.BAYT_API_BASE||'').replace(/\/$/,'');
const P=document.getElementById('player');if(!P)return;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const cv=$('canvas.viz',P),ctx=cv.getContext('2d'),STATIC=document.documentElement.classList.contains('static');
const pad3=n=>String(n).padStart(3,'0');
const norm=t=>(t||'').toLowerCase().normalize('NFD').replace(/[\u064B-\u065F\u0670\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
/* ---------- visualiseur (identique à l'original ; la lecture réelle pilote l'état) ---------- */
let W,H,dpr=devicePixelRatio||1;function rs(){W=cv.offsetWidth;H=cv.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener('resize',()=>{rs();if(STATIC)draw(0)});
const N=72;let amp=new Array(N).fill(.5),level=0,vol=.72,prog=0;
function noise(i,t){return .5+.5*(Math.sin(i*.55+t*.0031)*.45+Math.sin(i*1.37-t*.0047)*.3+Math.sin(i*.21+t*.0019)*.25)}
function draw(t){
 const playing=!P.classList.contains('paused');level+=((playing?1:0)-level)*.06;
 const live=P.dataset.mode==='live';ctx.clearRect(0,0,W,H);
 const bw=W/N;const light=document.documentElement.dataset.theme==='light';
 for(let i=0;i<N;i++){
  const target=STATIC?noise(i,4000):noise(i,t)*(.55+.45*Math.random()*.5);
  amp[i]+=(target-amp[i])*.25;
  const h=Math.max(2,(amp[i]*vol*1.25*level+.04)*H*.92);
  const x=i*bw+bw*.18,w=bw*.64,y=(H-h)/2;
  const played=live?playing:(i/N<prog);
  const g=ctx.createLinearGradient(0,y,0,y+h);
  if(played){g.addColorStop(0,'#F3DFA8');g.addColorStop(1,'#A8823C')}else{const c=light?'rgba(11,30,54,.22)':'rgba(232,238,242,.25)';g.addColorStop(0,c);g.addColorStop(1,c)}
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,w/2):ctx.rect(x,y,w,h);ctx.fill()}
 if(!live){const px=prog*W;ctx.fillStyle='#F3DFA8';ctx.fillRect(px-1,2,2,H-4)}
 if(!STATIC)requestAnimationFrame(draw)}
requestAnimationFrame(draw);
/* ---------- état ---------- */
const audio=new Audio();audio.preload='none';audio.volume=vol;
let ST=[],BYID={},SUR=[],cur=null,trk=0,errs=0,srcTry=0,cands=[],tracks=null;
const FAVK='bt-radio-fav';let FAV=[];try{FAV=JSON.parse(localStorage.getItem(FAVK)||'[]')}catch(e){}
const saveFav=()=>{try{localStorage.setItem(FAVK,JSON.stringify(FAV))}catch(e){}};
const el={pname:$('.pname',P),pnameAr:$('.pname-ar',P),pst:$('.pst-t',P),pstate:$('.pstate',P),pmeta:$('.pmeta',P),psub:$('.psub',P),t1:$('.t1',P),t2:$('.t2',P),t3:$('.t3',P),pp:$('.pp',P),vr:$('.vr',P)};
const recBtns=$$('.ctrl2 .rec-only',P),prevB=recBtns[0],nextB=recBtns[1],favB=$('.ctrl2 .fav',P);
const fmt=s=>{if(!isFinite(s))return '';s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(x).padStart(2,'0')};
const surLabel=n=>{const s=SUR[n-1];return s?`sourate ${n}, ${s.tr}`:`sourate ${n}`};
const setState=(txt)=>{el.pst.textContent=txt};
const isLive=s=>s.t==='l';
/* ---------- sources ---------- */
function liveCands(u){const a=[u];if(/backup\.qurango\.net/.test(u))a.push(u.replace('backup.qurango.net','qurango.net'));else if(/\/\/qurango\.net/.test(u))a.push(u.replace('//qurango.net','//backup.qurango.net'));return a}
function trackUrl(s,n){return s.s+pad3(n)+'.mp3'}
async function ensureTracks(s){if(s.r)return s.r;if(BASE&&CFG.BAYT_API_KEY){try{const r=await fetch(`${BASE}/api/radio/stations/${s.id}`,{headers:{'X-API-Key':CFG.BAYT_API_KEY}});const j=await r.json();const t=(j.data||j).tracks||[];s.r=t.map(x=>x.surah);s.s=s.s||(t[0]&&t[0].url.replace(/\d{3}\.mp3$/,''));return s.r}catch(e){}}return s.r||[]}
/* ---------- lecture ---------- */
function paused(b){P.classList.toggle('paused',b)}
function loadSrc(url){audio.src=url;const p=audio.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name==='NotAllowedError'){paused(true);setState('Prêt — appuie sur lecture')}})}
async function startStation(s,autoplay){
 cur=s;errs=0;srcTry=0;trk=0;tracks=null;audio.pause();
 const live=isLive(s);P.dataset.mode=live?'live':'pl';
 el.pname.textContent=s.n;el.pnameAr.textContent=s.a||'';
 el.pstate.classList.toggle('bdg-live',live);el.pstate.classList.toggle('bdg-pre',!live);
 el.pmeta.textContent='Station n° '+s.id+(live?' · radio 24h/24':' · Coran préenregistré');
 el.t1.textContent='';el.t2.textContent='';el.t3.textContent='';prog=live?1:0;
 $$('.qi').forEach(q=>q.classList.toggle('on',q.dataset.id===s.id));
 $$('.st',document).forEach(x=>x.classList.toggle('playing',x.dataset.id===s.id));
 syncFav();
 if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:s.n,artist:'BAYT AL-ILM',album:live?'Radio en direct':'Coran préenregistré'})}catch(e){}}
 if(live){cands=liveCands(s.u);el.psub.textContent=(s.f||[]).includes('theme')?'Radio thématique · en direct':'Radio en direct 24h/24';setState(autoplay?'Connexion…':'Prêt à écouter');paused(true);if(autoplay){paused(false);loadSrc(cands[0])}else audio.removeAttribute('src')}
 else{tracks=await ensureTracks(s);if(cur!==s)return;if(!tracks.length){el.psub.textContent='Aucune sourate disponible';setState('Indisponible');paused(true);return}
  playTrack(0,autoplay)}
 try{history.replaceState(null,'','?station='+s.id)}catch(e){}
}
function playTrack(i,autoplay){
 const s=cur;trk=(i+tracks.length)%tracks.length;const n=tracks[trk];
 el.psub.textContent='En cours : '+surLabel(n)+(tracks.length>1?`  ·  ${trk+1}/${tracks.length}`:'');
 el.t2.textContent='00:00';el.t3.textContent='';prog=0;cands=[trackUrl(s,n)];srcTry=0;
 setState(autoplay?'Chargement…':'Prêt à écouter');
 if(autoplay){paused(false);loadSrc(cands[0])}else{paused(true);audio.src=cands[0];audio.preload='metadata'}
}
function toggle(){
 if(!cur){const d=BYID['455']||ST[0];if(d)startStation(d,true);return}
 if(audio.paused||P.classList.contains('paused')){
  paused(false);errs=0;
  if(isLive(cur)){srcTry=0;setState('Connexion…');loadSrc(cands[0])}
  else if(audio.getAttribute('src')&&!audio.error){const p=audio.play();if(p&&p.catch)p.catch(()=>{})}
  else playTrack(trk,true)}
 else{audio.pause();if(isLive(cur)){audio.removeAttribute('src');audio.load()}}
}
audio.addEventListener('playing',()=>{paused(false);errs=0;setState(isLive(cur)?'En direct':'En lecture')});
audio.addEventListener('waiting',()=>{if(!audio.paused)setState('Mise en mémoire…')});
audio.addEventListener('pause',()=>{if(!audio.ended){paused(true);setState('En pause')}});
audio.addEventListener('play',()=>{paused(false)});
audio.addEventListener('loadedmetadata',()=>{if(!isLive(cur)&&isFinite(audio.duration))el.t3.textContent=fmt(audio.duration)});
audio.addEventListener('timeupdate',()=>{if(cur&&!isLive(cur)&&audio.duration){prog=audio.currentTime/audio.duration;el.t2.textContent=fmt(audio.currentTime);el.t3.textContent=fmt(audio.duration)}});
audio.addEventListener('ended',()=>{if(cur&&!isLive(cur))playTrack(trk+1,true)});
audio.addEventListener('error',()=>{
 if(!cur||!audio.getAttribute('src'))return;
 if(srcTry+1<cands.length){srcTry++;loadSrc(cands[srcTry]);return}
 if(isLive(cur)&&errs<2){errs++;srcTry=0;setState('Reconnexion…');setTimeout(()=>{if(cur&&isLive(cur)&&!audio.paused||P.classList.contains('paused')===false)loadSrc(cands[0])},1200);return}
 if(!isLive(cur)&&tracks&&errs<4){errs++;setState('Sourate suivante…');playTrack(trk+1,true);return}
 paused(true);setState('Flux indisponible');el.psub.textContent='Ce flux ne répond pas pour le moment. Essaie une autre station.';
});
el.pp.onclick=toggle;
el.vr.oninput=()=>{vol=el.vr.value/100;audio.volume=vol;el.vr.style.setProperty('--v',el.vr.value+'%')};
if(prevB)prevB.onclick=()=>{if(cur&&!isLive(cur)){if(audio.currentTime>5)audio.currentTime=0;else playTrack(trk-1,true)}};
if(nextB)nextB.onclick=()=>{if(cur&&!isLive(cur))playTrack(trk+1,true)};
cv.style.cursor='pointer';cv.addEventListener('click',e=>{if(cur&&!isLive(cur)&&audio.duration){const r=cv.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*audio.duration}});
function syncFav(){const on=cur&&FAV.includes(cur.id);if(favB)favB.classList.toggle('on',!!on);$$('#stations .st').forEach(c=>{const f=$('.fav',c);const o=FAV.includes(c.dataset.id);f.classList.toggle('on',o);f.textContent=o?'★':'☆'})}
function toggleFav(id){const i=FAV.indexOf(id);if(i>=0)FAV.splice(i,1);else FAV.push(id);saveFav();syncFav();if(F==='fav')render()}
if(favB)favB.onclick=()=>{if(cur)toggleFav(cur.id)};
if('mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',()=>toggle());navigator.mediaSession.setActionHandler('pause',()=>toggle());navigator.mediaSession.setActionHandler('nexttrack',()=>nextB&&nextB.click());navigator.mediaSession.setActionHandler('previoustrack',()=>prevB&&prevB.click())}catch(e){}}
/* ---------- bibliothèque ---------- */
const grid=$('#stations'),q=$('#q'),cnt=$('#cnt'),empty=$('#empty'),sortB=$('#sort');
let F='all',asc=true,shown=60,showAll=false,FEAT=[],more=null,tplL=null,tplP=null;
const RIW=s=>{const f=s.f||[];const r=f.includes('warsh')?'Warsh':f.includes('qalun')?'Qalun':'Hafs';return r+(f.includes('mujawwad')?' · mujawwad':'')+' · '+(f.includes('114')?'114 sourates':(s.r?s.r.length:'')+' sourates')};
function card(s){
 const live=isLive(s),c=(live?tplL:tplP).cloneNode(true);
 c.dataset.kind=live?'live':'pl';c.dataset.id=s.id;c.dataset.ar=s.a||'';c.dataset.label=s.n;c.dataset.name=norm(s.n+' '+(s.a||''));
 c.dataset.tags=(live?'live':'playlist pl')+' '+(s.f||[]).join(' ');
 c.classList.remove('playing','hide');if(cur&&cur.id===s.id)c.classList.add('playing');
 $('.cv .ar',c).textContent=(s.a||s.n).split(' ')[0];
 $('b',c).textContent=s.n;
 const sp=$$('.meta span',c);if(sp[1])sp[1].textContent='n° '+s.id;
 const m=$$('.meta',c);m[m.length-1].textContent=live?((s.f||[]).includes('theme')?'Radio thématique · ':'Radio 24h/24 · ')+((s.f||[]).includes('mp')?'Serveur et message privé':'Serveur seulement'):RIW(s);
 const fv=$('.fav',c),pl=$('.pl',c);const o=FAV.includes(s.id);fv.classList.toggle('on',o);fv.textContent=o?'★':'☆';
 [fv,pl].forEach(x=>{x.setAttribute('role','button');x.tabIndex=0});
 return c}
function matches(s){
 if(F==='fav'&&!FAV.includes(s.id))return false;
 if(F==='live'&&!isLive(s))return false;if(F==='pl'&&isLive(s))return false;
 if(!['all','fav','live','pl'].includes(F)&&!(s.f||[]).includes(F))return false;
 const v=norm(q.value).trim();return !v||norm(s.n+' '+(s.a||'')).includes(v)}
function render(){
 const v=q.value.trim(),def=(F==='all'&&!v&&!showAll);
 let list=ST.filter(matches);if(def)list=list.filter(s=>FEAT.includes(s.id));
 list.sort((a,b)=>(asc?1:-1)*a.n.localeCompare(b.n));
 const total=ST.filter(matches).length;
 const vis=def?list:list.slice(0,shown);
 grid.replaceChildren(...vis.map(card));
 cnt.textContent=vis.length;empty.style.display=total?'none':'block';
 if(more){const rest=total-vis.length;more.style.display=rest>0?'':'none';more.textContent=def?`Afficher toutes les stations (${total})`:`Afficher plus (${rest})`}
 syncFav()}
function counts(){const c={all:ST.length,live:ST.filter(isLive).length,pl:ST.filter(s=>!isLive(s)).length};['114','mp','warsh','qalun','mujawwad','tafsir','trad','theme'].forEach(k=>c[k]=ST.filter(s=>(s.f||[]).includes(k)).length);
 $$('#chips .chip').forEach(ch=>{const n=$('.n',ch);if(n&&c[ch.dataset.f]!=null)n.textContent=c[ch.dataset.f]});
 $$('[data-count]').forEach(e=>{if(e.dataset.count==='472')e.dataset.count=String(ST.length)});return c}
function wire(){
 q.addEventListener('input',()=>{shown=60;render()});
 $$('#chips .chip').forEach(c=>c.onclick=()=>{$$('#chips .chip').forEach(x=>x.classList.toggle('on',x===c));F=c.dataset.f;shown=60;render()});
 sortB.onclick=e=>{asc=!asc;sortB.querySelector('b').textContent=asc?'A → Z':'Z → A';render()};
 grid.addEventListener('click',e=>{const c=e.target.closest('.st');if(!c)return;const s=BYID[c.dataset.id];if(!s)return;
  if(e.target.closest('.fav')){toggleFav(s.id);return}
  startStation(s,true);const r=P.getBoundingClientRect();scrollTo({top:scrollY+r.top-90,behavior:STATIC?'auto':'smooth'})});
 grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.fav,.pl')){e.preventDefault();e.target.click()}});
 $$('.qi').forEach(x=>{x.tabIndex=0;x.setAttribute('role','button');x.addEventListener('click',()=>{const s=BYID[x.dataset.id];if(s)startStation(s,true)});x.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();x.click()}})});
 /* index A-Z : le triangle ▸ lance la station (la ligne est associée par son nom) */
 const byName={l:{},p:{}};ST.forEach(s=>{const k=norm(s.n.replace(/\s+—\s+/g,' — '));(byName[s.t][k]=byName[s.t][k]||s)});
 $$('#index .ix').forEach(ix=>{const head=ix.previousElementSibling&&ix.previousElementSibling.matches('.ix-head')?ix.previousElementSibling:null;const pre=head&&/enregistr/i.test(head.textContent);
  $$('.ix-i',ix).forEach(it=>{const b=$('b',it);if(!b)return;const k=norm(b.textContent.replace(/\s+—\s+/g,' — '));const s=byName[pre?'p':'l'][k]||byName[pre?'l':'p'][k]||ST.find(x=>norm(x.n).startsWith(k)&&(pre?!isLive(x):isLive(x)));
   const p=$('.ix-p',it);if(!p||!s)return;p.style.cursor='pointer';p.setAttribute('role','button');p.tabIndex=0;p.title='Écouter';p.addEventListener('click',()=>{startStation(s,true);const r=P.getBoundingClientRect();scrollTo({top:scrollY+r.top-90,behavior:STATIC?'auto':'smooth'})});p.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();p.click()}})})});
 $$('.ix-more').forEach(a=>{a.setAttribute('role','button');a.tabIndex=0;a.style.cursor='pointer';const open=()=>{const ix=a.previousElementSibling;if(ix&&ix.classList.contains('ix')){ix.style.maxHeight='none';ix.style.webkitMaskImage='none';ix.style.maskImage='none'}a.style.display='none'};a.addEventListener('click',e=>{e.preventDefault();open()});a.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();open()}})});
}
async function loadData(){
 if(BASE&&CFG.BAYT_API_KEY){try{const r=await fetch(`${BASE}/api/radio/stations?limit=500`,{headers:{'X-API-Key':CFG.BAYT_API_KEY}});const j=await r.json();const L=(j.data||j).stations;if(L&&L.length>100){const st=await (await fetch('assets/data/stations.json')).json();const fl={};st.stations.forEach(x=>fl[x.id]=x.f);return L.filter(x=>x.id!=='227').map(x=>({id:x.id,n:x.name_arabic&&x.name===x.name_arabic?x.name:x.name,a:x.name_arabic,t:x.type==='live'?'l':'p',u:x.stream_url||undefined,s:x.server,f:fl[x.id]}))}}catch(e){}}
 const r=await fetch('assets/data/stations.json');return (await r.json()).stations}
(async function init(){
 try{SUR=await (await fetch('assets/data/surahs.json')).json()}catch(e){}
 try{ST=await loadData()}catch(e){setState('Données indisponibles');return}
 ST.forEach(s=>BYID[s.id]=s);
 /* gabarits repris des cartes d'origine (même rendu) */
 const c0=$$('#stations .st');tplL=c0.find(c=>c.dataset.kind==='live').cloneNode(true);tplP=c0.find(c=>c.dataset.kind!=='live').cloneNode(true);
 FEAT=c0.map(c=>c.dataset.id);
 counts();
 /* bouton « Afficher plus » avec les classes existantes */
 const foot=$('#cnt').parentElement;more=document.createElement('button');more.type='button';more.className='btn btn-g btn-sm';more.style.marginRight='10px';more.addEventListener('click',()=>{if(F==='all'&&!q.value.trim()&&!showAll){showAll=true;shown=60;render();return}shown+=60;render()});foot.insertBefore(more,foot.lastElementChild);
 /* chip « Radios thématiques » si elle n'existe pas encore */
 if(!$('#chips .chip[data-f="theme"]')){const ch=document.createElement('button');ch.className='chip';ch.dataset.f='theme';ch.innerHTML='Radios thématiques<span class="n">'+ST.filter(s=>(s.f||[]).includes('theme')).length+'</span>';const fav=$('#chips .chip[data-f="fav"]');$('#chips').insertBefore(ch,fav);}
 wire();
 render();
 const want=new URLSearchParams(location.search).get('station')||(location.hash.match(/^#station-(\d+)$/)||[])[1];
 const first=BYID[want]||BYID['455']||ST[0];
 if(first){await startStation(first,false)}
 if(want&&BYID[want]){const r=P.getBoundingClientRect();if(!STATIC)scrollTo({top:scrollY+r.top-90})}
})();
})();
