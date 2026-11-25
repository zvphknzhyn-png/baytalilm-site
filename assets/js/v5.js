/* BAYT AL-ILM بيت العلم — fonctions v5 (tout est réel : aucune donnée inventée) */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const CFG=window.BAYT_CONFIG||{}; const API=(CFG.BAYT_API_BASE||'').replace(/\/$/,'');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('bt-'+k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('bt-'+k,JSON.stringify(v))}catch(e){}}};
const cache={};
const data=n=>cache[n]||(cache[n]=fetch('assets/data/'+n+'.json').then(r=>{if(!r.ok)throw new Error(n);return r.json()}));
window.BT={$,$$,esc,LS,data,API};
/* ---------- thème ---------- */
$$('.theme button').forEach(b=>b.addEventListener('click',()=>{window.setTheme&&setTheme(b.dataset.t);document.dispatchEvent(new Event('bt-theme'))}));
/* ---------- toast + copier ---------- */
let tt; window.toast=m=>{let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2600)};
const copy=txt=>{(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Copié dans le presse-papiers'),()=>{const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();toast('Copié')})};
window.btCopy=copy;
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;const src=b.dataset.copy;copy(src.startsWith('#')?($(src).innerText||$(src).value):src)});
/* ---------- onglets ---------- */
$$('[data-tabs]').forEach(g=>{const bs=$$('[data-tab]',g),ps=$$('[data-panel]',g.parentElement).filter(p=>p.closest('[data-tabs-scope]')===g.closest('[data-tabs-scope]'));
 const go=(id,push)=>{bs.forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===id));ps.forEach(p=>p.hidden=p.dataset.panel!==id);if(push&&g.dataset.hash!==undefined)history.replaceState(null,'','#'+id)};
 bs.forEach(b=>b.addEventListener('click',()=>go(b.dataset.tab,true)));
 const h=location.hash.slice(1);go(bs.some(b=>b.dataset.tab===h)?h:bs[0].dataset.tab);
 window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(bs.some(b=>b.dataset.tab===h))go(h)})});
/* ---------- modale ---------- */
window.openModal=html=>{let m=$('#modal');if(!m){m=document.createElement('div');m.id='modal';m.className='modal';m.innerHTML='<div class="box" role="dialog" aria-modal="true"><button class="x" aria-label="Fermer">×</button><div class="mc"></div></div>';document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.x'))m.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('open')})}$('.mc',m).innerHTML=html;m.classList.add('open');$('.x',m).focus()};
/* ---------- rendu des messages du bot (format Discord réel) ---------- */
const AV='assets/img/logo-128.jpg';
function md(s){s=esc(s);return s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/`([^`]+)`/g,'<code>$1</code>').split('\n').map(l=>{const q=l.startsWith('&gt; ');l=q?l.slice(5):l;const ar=/[\u0600-\u06FF]/.test(l)&&!/[a-zA-Z]{3}/.test(l.replace(/<[^>]+>/g,''));return `<div${q?' style="border-left:3px solid #4e5058;padding-left:10px;margin:2px 0"':''}${ar?' class="ar" dir="rtl"':''}>${l||'&nbsp;'}</div>`}).join('')}
window.renderMsg=(desc,when,opt={})=>`<div class="dmsg"><img class="av" src="${AV}" alt=""><div style="min-width:0;flex:1"><div class="who"><b>BAYT AL-ILM - بيت العلم</b><span class="app">APP</span><span class="when">${esc(when)}</span></div>${opt.mention?'<div><span class="mention">@everyone</span></div>':''}${opt.plain?`<div style="margin-top:4px">${md(desc)}</div>`:`<div class="emb">${md(desc)}</div>`}</div></div>`;
const fmtDate=t=>new Date(t).toLocaleString('fr-FR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
/* démo des commandes : la commande choisie affiche un vrai message publié par le bot */
$$('[data-cmddemo]').forEach(async box=>{
 const sel=$('select',box),out=$('.cmdout',box);let M;try{M=await data('messages')}catch(e){out.textContent='Messages indisponibles.';return}
 const idx={};const show=()=>{const k=sel.value;const list=M[k];if(!list){return}idx[k]=((idx[k]??-1)+1)%list.length;const m=list[idx[k]];out.innerHTML=renderMsg(m.d,fmtDate(m.t))+`<p class="src faint" style="font-size:13px;margin-top:10px">Message réellement publié par le bot sur le serveur Discord BAYT AL-ILM le ${fmtDate(m.t)} (heure de Paris). Relance la commande pour en voir un autre.</p>`;out.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:400,easing:'ease-out'})};
 sel.addEventListener('change',show);$('button',box)?.addEventListener('click',show);show()});
/* ---------- étapes (Telegram) ---------- */
$$('[data-steps]').forEach(w=>{const st=$$('.step',w),bar=$('.progress i',w);const go=i=>{st.forEach((s,j)=>{s.classList.toggle('done',j<i);s.classList.toggle('active',j===i)});if(bar)bar.style.width=((i+1)/st.length*100)+'%'};st.forEach((s,i)=>{s.tabIndex=0;s.addEventListener('click',()=>go(i));s.addEventListener('keydown',e=>{if(e.key==='Enter')go(i)})});go(0)});
/* ---------- mini-jeux (données réelles des bots) ---------- */
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
$$('[data-game]').forEach(g=>{
 const area=$('.garea',g),score=$('.gscore',g);let pts=0,n=0;
 const sel=$('select',g);const run=()=>({sourate:sourate,vraifaux:vraifaux,quisuisje:qsj})[sel.value]();
 const fin=(ok,src)=>{n++;if(ok)pts++;score.textContent=`Score : ${pts} / ${n}`;const p=document.createElement('p');p.className='faint';p.style.cssText='font-size:13px;margin-top:14px';p.innerHTML=(ok?'✅ Bonne réponse. ':'❌ Raté. ')+(src?'Source : '+esc(src):'');area.appendChild(p);const b=document.createElement('button');b.className='btn btn-p btn-sm';b.style.marginTop='14px';b.textContent='Question suivante';b.onclick=run;area.appendChild(b)};
 const opts=(choices,good,src)=>{const w=document.createElement('div');w.className='opts';choices.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=()=>{$$('button',w).forEach(x=>{x.disabled=true;if(x.textContent===good)x.classList.add('ok')});if(c!==good)b.classList.add('ko');fin(c===good,src)};w.appendChild(b)});area.appendChild(w)};
 async function sourate(){const d=await data('jeu-sourate');const q=d[Math.random()*d.length|0];const others=shuffle([...new Set(d.map(x=>x.nom))].filter(x=>x!==q.nom)).slice(0,3);area.innerHTML=`<div class="kicker">Devine la sourate</div><div class="q">${esc(q.ar)}</div><p class="muted">${esc(q.fr)}</p>`;opts(shuffle([q.nom,...others]),q.nom,q.source)}
 async function vraifaux(){const d=await data('jeu-vraifaux');const q=d[Math.random()*d.length|0];area.innerHTML=`<div class="kicker">Vrai ou faux : le Prophète ﷺ a-t-il dit cela ?</div><p style="font-size:20px;margin:18px 0;font-family:var(--serif)">« ${esc(q.texte)} »</p>`;opts(['Vrai','Faux'],q.vrai?'Vrai':'Faux',q.source)}
 async function qsj(){const d=await data('jeu-quisuisje');const q=d.q[Math.random()*d.q.length|0];const pool=shuffle(d.q.filter(x=>x.c===q.c&&x.r!==q.r).map(x=>x.r)).slice(0,3);let k=1;area.innerHTML=`<div class="kicker">Qui suis-je ? (${esc(d.cat[q.c]||'')})</div><ol class="ind" style="text-align:left;margin:16px auto;max-width:520px;display:grid;gap:8px"></ol><button type="button" class="chip5 more-i">Indice suivant</button>`;const ol=$('.ind',area);const add=()=>{const i=q.i[k-1];const li=document.createElement('li');li.innerHTML=`${esc(i.texte)} <small class="faint">(${esc(i.source)})</small>`;ol.appendChild(li)};add();$('.more-i',area).onclick=e=>{if(k<q.i.length){k++;add()}if(k>=q.i.length)e.target.remove()};opts(shuffle([q.r,...pool]),q.r,'indices sourcés ci-dessus')}
 sel.addEventListener('change',run);run()});
/* ---------- formulaire de contact ---------- */
$$('form[data-contact]').forEach(f=>{
 const sub=new URLSearchParams(location.search).get('sujet');if(sub&&f.sujet){[...f.sujet.options].forEach(o=>{if(o.value===sub)o.selected=true})}
 f.addEventListener('submit',async e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(f));if(!fd.message||fd.message.trim().length<5){toast('Écris ton message.');return}
  const txt=`[Site BAYT AL-ILM] ${fd.sujet}\nNom : ${fd.nom||'-'}\nContact : ${fd.contact||'-'}${fd.org?'\nOrganisation : '+fd.org:''}${fd.volume?'\nVolume estimé : '+fd.volume:''}\n\n${fd.message}`;
  const res=$('.fres',f);
  if(CFG.CONTACT_ENDPOINT){try{const r=await fetch(CFG.CONTACT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(fd)});if(!r.ok)throw 0;res.innerHTML='<div class="note"><b>Message envoyé.</b> Nous te répondons au plus vite, in shâ’ Allah.</div>';f.reset();return}catch(err){}}
  res.innerHTML=`<div class="note"><b>Dernière étape :</b> ton message est prêt. Il est copié ; ouvre le bot Telegram, tape <code>/help</code> puis colle-le : il arrive directement chez l’administrateur.<div class="btns l" style="margin-top:14px"><a class="btn btn-p btn-sm" href="${CFG.CONTACT_TELEGRAM||'https://t.me/Baytalilmapp'}" target="_blank" rel="noopener">Ouvrir Telegram</a><button type="button" class="btn btn-g btn-sm" data-copy="${esc(txt)}">Copier à nouveau</button></div><p class="faint" style="font-size:13px;margin-top:10px">Sur Discord, la commande <code>/contact</code> fait la même chose.</p></div>`;copy(txt)})});
/* ---------- X : configurateur ---------- */
$$('[data-xconf]').forEach(w=>{const out=$('.xres',w);const upd=()=>{const types=$$('input[name=xt]:checked',w).map(i=>i.value);const nb=$('[name=xn]',w).value;const sl=$$('input[name=xs]:checked',w).map(i=>i.value);const lg=$('[name=xl]',w).value;
 out.innerHTML=types.length?`<b>Ta configuration :</b> ${nb} publication${nb>1?'s':''} par jour sur ton compte X, en ${lg}, parmi ${types.length} type${types.length>1?'s':''} : ${types.join(', ')}. Créneaux : ${sl.join(', ')||'au choix du bot'}.`:'Choisis au moins un type de publication.';
 if(types.length>5){out.innerHTML+='<br><span style="color:#e05a5a">Maximum 5 types de publications.</span>'}
 $('.xgo',w).href='contact.html?sujet=bot-x&conf='+encodeURIComponent(out.textContent)};
 $$('input,select',w).forEach(i=>i.addEventListener('change',upd));upd()});
/* ---------- banque d'images ---------- */
$$('[data-bankfilter]').forEach(g=>{const bs=$$('button',g);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.bimg').forEach(c=>c.classList.toggle('hide',b.dataset.f!=='tout'&&c.dataset.f!==b.dataset.f))}))});
})();
