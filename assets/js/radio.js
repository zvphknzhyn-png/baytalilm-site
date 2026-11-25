/* BAYT AL-ILM بيت العلم — lecteur radio : même catalogue et mêmes flux que la radio du bot Discord */
(function(){
const {$,$$,esc,LS,data,API}=window.BT;
const root=$('#radio');if(!root)return;
const audio=new Audio();audio.preload='none';
let ST=[],SUR=[],cur=null,curSurah=null,filter='tout',query='',showAll=false,list=[];
const favs=new Set(LS.get('favs',[]));
const pad=n=>String(n).padStart(3,'0');
const kind=s=>/^(Tafsir|Fiqh|Sira|Adhkar|Ruqya)/.test(s.n)?'livre':/^Traduction/.test(s.n)?'trad':'rec';
const RIW=[['ورش','Warsh'],['حفص','Hafs'],['قالون','Qâlûn'],['الدوري','Ad-Dûrî'],['البزي','Al-Bazzî'],['قنبل','Qunbul'],['شعبة','Shu‘ba'],['خلف','Khalaf'],['السوسي','As-Sûsî'],['هشام','Hishâm'],['ذكوان','Ibn Dhakwân']];
const riwaya=s=>{const a=s.a.split('—')[1]||'';const r=RIW.find(x=>a.includes(x[0]));const st=a.includes('مجود')?'mujawwad':a.includes('مرتل')?'murattal':'';return [r?r[1]:'',st].filter(Boolean).join(' · ')};
const surName=n=>{const s=SUR[n-1];return s?`${n}. ${s.tr}`:'Sourate '+n};
const P={btn:$('#p-play'),prev:$('#p-prev'),next:$('#p-next'),mute:$('#p-mute'),vol:$('#p-vol'),name:$('#p-name'),ar:$('#p-ar'),sub:$('#p-sub'),state:$('#p-state'),sur:$('#p-surah'),box:$('.player',root)};
const ICON={play:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',pause:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4.5" height="16" rx="1"/><rect x="13.5" y="4" width="4.5" height="16" rx="1"/></svg>',vol:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>',muted:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>'};
function setState(t){P.state.textContent=t}
function ui(){const playing=!audio.paused&&!audio.ended;P.btn.innerHTML=playing?ICON.pause:ICON.play;P.btn.setAttribute('aria-label',playing?'Pause':'Lecture');P.box.classList.toggle('playing',playing);
 P.mute.innerHTML=audio.muted||audio.volume===0?ICON.muted:ICON.vol;P.mute.setAttribute('aria-pressed',audio.muted);
 if(cur){P.name.textContent=cur.n.split(' — ')[0];P.ar.textContent=cur.a.split(' — ')[0];P.sub.textContent=cur.t==='live'?'Radio en direct 24h/24':(curSurah?surName(curSurah)+' · ':'')+'Coran complet'+(riwaya(cur)?' · '+riwaya(cur):'');
  P.sur.classList.toggle('hide',cur.t!=='pre');P.prev.disabled=P.next.disabled=false}
 $$('.st',root).forEach(e=>e.classList.toggle('on',cur&&e.dataset.id===cur.id))}
function load(s,surah,autoplay=true){cur=s;tries=0;LS.set('last',s.id);
 if(s.t==='live'){curSurah=null;audio.src=s.u}else{const q=s.q||[];curSurah=surah&&q.includes(+surah)?+surah:q[0];audio.src=s.s+pad(curSurah)+'.mp3';
  P.sur.innerHTML=q.map(n=>`<option value="${n}"${n===curSurah?' selected':''}>${esc(surName(n))}</option>`).join('')}
 ui();if(autoplay)play();
 if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:s.n+(curSurah?' — '+surName(curSurah):''),artist:'Radio Coran BAYT AL-ILM',artwork:[{src:'assets/img/icon-512.png',sizes:'512x512',type:'image/png'}]});
  navigator.mediaSession.setActionHandler('play',play);navigator.mediaSession.setActionHandler('pause',()=>audio.pause());navigator.mediaSession.setActionHandler('previoustrack',()=>step(-1));navigator.mediaSession.setActionHandler('nexttrack',()=>step(1))}}
function play(){if(!cur){const d=ST.find(s=>s.id===(LS.get('last')||root.dataset.default))||ST[0];load(d,null,false)}setState('Connexion au flux…');const p=audio.play();if(p)p.catch(err=>{setState(err.name==='NotAllowedError'?'Appuie sur lecture pour démarrer.':'Flux indisponible pour le moment : essaie une autre station.');ui()})}
function step(d){if(!cur)return play();if(cur.t==='pre'){const q=cur.q,i=q.indexOf(curSurah)+d;if(i>=0&&i<q.length)return load(cur,q[i]);}const L=list.length?list:ST;let i=L.findIndex(s=>s.id===cur.id);i=(i+d+L.length)%L.length;load(L[i])}
P.btn.addEventListener('click',()=>{audio.paused?play():audio.pause()});
P.prev.addEventListener('click',()=>step(-1));P.next.addEventListener('click',()=>step(1));
P.mute.addEventListener('click',()=>{audio.muted=!audio.muted;ui()});
P.vol.addEventListener('input',()=>{audio.volume=P.vol.value/100;audio.muted=audio.volume===0;LS.set('vol',P.vol.value);ui()});
P.sur.addEventListener('change',()=>load(cur,+P.sur.value));
audio.volume=(P.vol.value=LS.get('vol',80))/100;
audio.addEventListener('playing',()=>{setState(cur&&cur.t==='live'?'En direct':'Lecture en cours');ui()});
audio.addEventListener('pause',()=>{setState('En pause');ui()});
audio.addEventListener('waiting',()=>setState('Mise en mémoire tampon…'));
audio.addEventListener('ended',()=>{if(cur&&cur.t==='pre'){const q=cur.q,i=q.indexOf(curSurah);if(i<q.length-1)load(cur,q[i+1])}});
let tries=0;audio.addEventListener('playing',()=>{tries=0});
audio.addEventListener('error',()=>{if(!audio.src)return;if(tries<3&&cur){tries++;setState('Reconnexion au flux… ('+tries+'/3)');const src=audio.src.split('#')[0];setTimeout(()=>{audio.src=src+(src.includes('?')?'&':'?')+'r='+Date.now();audio.play().catch(()=>{})},1500*tries);return}setState('Flux indisponible pour le moment : essaie une autre station.');ui()});
/* liste */
const grid=$('#st-grid'),more=$('#st-more'),count=$('#st-count');
function card(s){const fav=favs.has(s.id);const lab=s.t==='live'?'📻 En direct':'💿 Coran complet · '+(s.q||[]).length+' sourates';
 return `<div class="st${cur&&cur.id===s.id?' on':''}" data-id="${s.id}"><span class="nm" role="button" tabindex="0" data-info="${s.id}">${esc(s.n)}</span><span class="ar">${esc(s.a.split(' — ')[0])}</span><span class="ty">${lab}</span><span class="acts"><button type="button" data-play="${s.id}" aria-label="Écouter ${esc(s.n)}">▶</button><button type="button" class="fav" data-fav="${s.id}" aria-pressed="${fav}" aria-label="Favori">★</button></span></div>`}
function render(){const q=query.trim().toLowerCase();
 list=ST.filter(s=>(filter==='tout'||(filter==='fav'?favs.has(s.id):filter==='live'?s.t==='live'&&kind(s)==='rec':filter==='pre'?s.t==='pre'&&kind(s)==='rec':kind(s)===filter))&&(!q||(s.n+' '+s.a).toLowerCase().includes(q)));
 const lim=showAll||q?list.length:24;grid.innerHTML=list.slice(0,lim).map(card).join('')||`<p class="muted">${filter==='fav'?'Aucun favori pour l’instant : touche ★ sur une station. Tes favoris restent enregistrés sur cet appareil.':'Aucune station ne correspond.'}</p>`;
 count.textContent=list.length+' station'+(list.length>1?'s':'');more.classList.toggle('hide',list.length<=24||!!q);more.textContent=showAll?'Réduire la liste ▴':`Afficher les ${list.length} stations ▾`}
more.addEventListener('click',()=>{showAll=!showAll;render();if(!showAll)grid.scrollIntoView({behavior:'smooth',block:'start'})});
$$('[data-filter]',root).forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;showAll=false;$$('[data-filter]',root).forEach(x=>x.setAttribute('aria-pressed',x===b));render()}));
$('#st-q').addEventListener('input',e=>{query=e.target.value;render()});
grid.addEventListener('click',e=>{const p=e.target.closest('[data-play]'),f=e.target.closest('[data-fav]'),i=e.target.closest('[data-info]');
 if(p){load(ST.find(s=>s.id===p.dataset.play));P.box.scrollIntoView({behavior:'smooth',block:'nearest'})}
 else if(f){const id=f.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);LS.set('favs',[...favs]);f.setAttribute('aria-pressed',favs.has(id));toast(favs.has(id)?'Ajouté aux favoris (sur cet appareil)':'Retiré des favoris');if(filter==='fav')render()}
 else if(i)info(ST.find(s=>s.id===i.dataset.info))});
grid.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.info)info(ST.find(s=>s.id===e.target.dataset.info))});
function info(s){const nm=s.n.split(' — ')[0],k=kind(s);const wq=encodeURIComponent(k==='rec'?nm+' récitateur Coran':s.a.split(' — ').pop());
 const rows=[['Nom',esc(nm)],['En arabe',`<span class="ar">${esc(s.a)}</span>`],['Type',s.t==='live'?'Radio en direct, 24h/24':'Enregistrement, sourate par sourate'],k==='rec'&&riwaya(s)?['Lecture (riwâya)',riwaya(s)]:null,s.t==='pre'?['Sourates disponibles',(s.q||[]).length+' sur 114']:null,['Identifiant',`<code>${s.id}</code> (le même que <code>/radio switch ${s.id}</code> sur Discord)`]].filter(Boolean);
 openModal(`<div class="kicker">${k==='rec'?'Fiche du récitateur':k==='livre'?'Fiche de l’ouvrage':'Traduction des sens du Coran'}</div><h3 class="serif" style="font-size:30px;margin:8px 0 14px">${esc(nm)}</h3><table class="cmp">${rows.map(r=>`<tr><th style="width:38%">${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</table>
 <div class="btns l" style="margin-top:20px"><button type="button" class="btn btn-p btn-sm" data-mplay="${s.id}">▶ Écouter</button><a class="btn btn-g btn-sm" target="_blank" rel="noopener" href="https://fr.wikipedia.org/w/index.php?search=${wq}">Biographie sur Wikipédia ↗</a></div><p class="faint" style="font-size:12.5px;margin-top:12px">La biographie détaillée ouvre la recherche Wikipédia : nous n’affichons que des informations vérifiées.</p>`);
 $('[data-mplay]').onclick=()=>{load(s);$('#modal').classList.remove('open')}}
(async()=>{try{ST=API?await fetch(API+'/radio/stations').then(r=>r.json()).then(j=>j.data||j):await data('stations')}catch(e){ST=await data('stations')}
 try{SUR=await data('surahs')}catch(e){}
 ST.sort((a,b)=>a.n.localeCompare(b.n,'fr'));
 $('#n-live').textContent=ST.filter(s=>s.t==='live').length;$('#n-pre').textContent=ST.filter(s=>s.t==='pre').length;$('#n-all').textContent=ST.length;
 const d=ST.find(s=>s.id===(LS.get('last')||root.dataset.default))||ST[0];load(d,null,false);setState('Prêt : appuie sur lecture');render()})();
})();
