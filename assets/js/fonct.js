/* BAYT AL-ILM — fonctions des pages (boutons, sélecteurs, formulaires). Aucune règle de style n'est ajoutée ici. */
(function(){
const CFG=window.BAYT_CONFIG||{};
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const page=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'');
const on=(el,ev,fn)=>el&&el.addEventListener(ev,fn);
function keyable(el){if(!el)return;if(!el.hasAttribute('tabindex')&&!/^(a|button|input|select|textarea|summary)$/i.test(el.tagName))el.tabIndex=0;if(!el.getAttribute('role')&&!/^(a|button|input|select|textarea|summary)$/i.test(el.tagName))el.setAttribute('role','button');el.style.cursor='pointer';el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})}
let tt;function toast(msg){let t=$('#bt-toast');if(!t){t=document.createElement('div');t.id='bt-toast';t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);max-width:min(92vw,520px);padding:13px 20px;border-radius:14px;border:1px solid rgba(201,164,92,.55);background:var(--surf-solid,#10243d);color:var(--text,#e8eef2);font-size:14.5px;line-height:1.45;box-shadow:0 18px 50px -12px rgba(0,0,0,.6);z-index:9999;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;text-align:center';document.body.appendChild(t)}
 t.textContent=msg;requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translate(-50%,0)'});clearTimeout(tt);tt=setTimeout(()=>{t.style.opacity='0';t.style.transform='translate(-50%,20px)'},4200)}
function copy(text){return (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(text):Promise.reject()).catch(()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()})}
const ext=a=>{a.target='_blank';a.rel='noopener'};
/* ===== Discord : « Ajouter à Discord » -> vraie page d'invitation du bot ===== */
$$('a').forEach(a=>{if(/^\s*(Ajouter à Discord|Ajouter à mon serveur|Ajouter le bot)/i.test(a.textContent)&&CFG.DISCORD_ADD_BOT){a.href=CFG.DISCORD_ADD_BOT;ext(a)}});
/* ===== Abonnements : liens de paiement Stripe + FAQ ===== */
if(page==='abonnements'){
 const S={mensuel:'https://buy.stripe.com/5kQ8wP3Z27P2cGY22Uc7u00',annuel:'https://buy.stripe.com/3cI7sLfHKfhucGY0YQc7u01',a_vie:'https://buy.stripe.com/4gM9AT2UY7P29uM0YQc7u02',300:'https://buy.stripe.com/28E5kD536b1ebCU0YQc7u03',700:'https://buy.stripe.com/bJe00jgLO6KY7mE36Yc7u04',1500:'https://buy.stripe.com/5kQ8wP9jm4CQ7mEePGc7u05'};
 const setL=(a,u)=>{if(a&&u){a.href=u;ext(a)}};
 $$('.plan').forEach(p=>{const k=p.dataset.p;if(S[k])setL($$('a.btn',p).pop(),S[k])});
 setL($('.life a.btn'),S.a_vie);
 $$('.tk').forEach(t=>{const n=$('.big',t);const k=n&&(n.dataset.count||(n.textContent||'').replace(/\D/g,''));setL($('a.btn',t),S[k])});
 const ANS={
  'radio':'L’offre gratuite donne accès à 160 radios en direct en message privé, à écouter seul ou avec la communauté dans le salon Quran Radio. Premium débloque toutes les stations de la radio Coran, en direct et préenregistrées.',
  'bots':'Chaque formule indique ce qu’elle inclut dans sa liste. Pour savoir ce qui est activé sur un bot précis, écris-nous depuis la page Contact : nous te répondons avec le détail pour ton cas.',
  'vie':'L’accès à vie se règle une seule fois, sans renouvellement. Il inclut la radio Coran 24h/24, l’usage illimité, 15 000 tokens API offerts, l’accès à la banque d’images, le support prioritaire à vie et l’accès bêta aux nouvelles fonctions.',
  'resilier':'L’offre mensuelle est sans engagement et résiliable à tout moment. Pour changer d’offre ou résilier, écris-nous depuis la page Contact et nous nous en occupons.'};
 const keyOf=t=>/radio avec l’offre gratuite/i.test(t)?'radio':/3 bots/i.test(t)?'bots':/accès à vie/i.test(t)?'vie':/changer d’offre|résilier/i.test(t)?'resilier':null;
 $$('.faq .q').forEach(q=>{const sym=q.lastElementChild;let a=q.nextElementSibling&&q.nextElementSibling.classList.contains('a')?q.nextElementSibling:null;
  const key=keyOf(q.firstElementChild.textContent);
  if(!a&&key){a=document.createElement('div');a.className='a';a.textContent=ANS[key]}
  const store=a;let open=!!(q.nextElementSibling&&q.nextElementSibling===a);
  keyable(q);q.setAttribute('aria-expanded',open);
  q.addEventListener('click',()=>{if(!store)return;open=!open;if(open)q.after(store);else store.remove();sym.textContent=open?'−':'+';q.setAttribute('aria-expanded',open)});
  if(!store)sym.textContent=''});
}
/* ===== Contact : vrais champs + envoi ===== */
if(page==='contact'){(function(){
 const form=$('.card.form');if(!form)return;
 const mk=(tag,ph,cls)=>{const e=document.createElement(tag);e.className=cls;e.placeholder=ph;e.style.cssText='width:100%;font:inherit;color:var(--text);outline:none;'+(tag==='textarea'?'height:140px;padding:14px 16px;resize:vertical;display:block':'');return e};
 const rows=$$('.f',form);
 const sujetRow=rows[0],nomRow=rows[1],mailRow=rows[2],orgRow=rows[3],volRow=rows[4],msgRow=rows[5];
 const SUJ=['Offre API sur mesure (gros volumes, sur devis)','Question sur un bot','Abonnement ou paiement','Signaler un contenu','Partenariat','Autre'];
 const sel=document.createElement('select');sel.className='inp fill';sel.style.cssText='width:100%;font:inherit;color:var(--text);outline:none';sel.innerHTML=SUJ.map(s=>`<option>${s}</option>`).join('');
 const want=(new URLSearchParams(location.search).get('sujet')||'').toLowerCase();const map={abonnement:2,api:0,bot:1,signalement:3,partenariat:4};if(map[want]!==undefined)sel.selectedIndex=map[want];
 $('.inp',sujetRow).replaceWith(sel);
 const nom=mk('input','Votre nom','inp fill');const mail=mk('input','vous@exemple.com','inp');mail.type='email';mail.autocomplete='email';nom.autocomplete='name';
 const org=mk('input','Association, entreprise, projet…','inp');const msg=mk('textarea','Décrivez votre projet…','inp fill');
 $('.inp',nomRow).replaceWith(nom);$('.inp',mailRow).replaceWith(mail);$('.inp',orgRow).replaceWith(org);$('.inp',msgRow).replaceWith(msg);
 [nom,mail,org,msg,sel].forEach(i=>{i.addEventListener('focus',()=>i.classList.add('focus'));i.addEventListener('blur',()=>i.classList.remove('focus'))});
 let vol=1;const pills=$$('.pill',volRow);
 const paint=()=>pills.forEach((p,i)=>{p.style.borderColor=i===vol?'var(--gold)':'';p.style.color=i===vol?'var(--text)':''});
 pills.forEach((p,i)=>{keyable(p);p.addEventListener('click',()=>{vol=vol===i?-1:i;paint()})});paint();
 const syncVol=()=>{volRow.hidden=sel.selectedIndex!==0;volRow.style.display=sel.selectedIndex!==0?'none':''};sel.addEventListener('change',syncVol);syncVol();
 const btn=$('a.btn',form);keyable(btn);
 const err=document.createElement('p');err.style.cssText='font-size:13.5px;margin-top:12px;text-align:center;color:#e07070;min-height:1em';btn.after(err);
 async function submit(){
  err.textContent='';const m=mail.value.trim(),t=msg.value.trim();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){err.textContent='Indiquez une adresse e-mail valide pour recevoir notre réponse.';mail.focus();return}
  if(t.length<5){err.textContent='Écrivez votre message (quelques mots suffisent).';msg.focus();return}
  const data={subject:sel.value,name:nom.value.trim(),email:m,organisation:org.value.trim(),volume:sel.selectedIndex===0&&vol>=0?pills[vol].textContent.trim():'',message:t,page:location.href};
  const txt=`Sujet : ${data.subject}\nNom : ${data.name||'—'}\nE-mail : ${data.email}\nOrganisation : ${data.organisation||'—'}${data.volume?'\nVolume : '+data.volume:''}\n\n${data.message}`;
  if(CFG.CONTACT_ENDPOINT){try{const r=await fetch(CFG.CONTACT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw 0;toast('Message envoyé. Nous répondons sous 48 h.');msg.value='';return}catch(e){err.textContent='Envoi impossible pour le moment, réessayez ou écrivez-nous sur Telegram.'}}
  if(CFG.CONTACT_EMAIL){location.href='mailto:'+CFG.CONTACT_EMAIL+'?subject='+encodeURIComponent('[Site] '+data.subject)+'&body='+encodeURIComponent(txt);return}
  await copy(txt);toast('Message copié. Colle-le dans la conversation Telegram avec le bot (commande /contact) : nous te répondons là-bas.');
  setTimeout(()=>window.open(CFG.CONTACT_TELEGRAM||'https://t.me/Baytalilmapp','_blank','noopener'),900)}
 btn.addEventListener('click',submit);
})()}
/* ===== Accueil : invocation du jour — pas de faux abonnement par e-mail ===== */
if($('#duaday')){const f=$('#duaday form');on(f,'submit',()=>{const ok=$('#duaday .ok');if(!ok)return;
 const ep=CFG.CONTACT_ENDPOINT,em=$('input',f).value.trim();
 if(ep){fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:'Invocation du jour (e-mail)',email:em,page:location.href})}).catch(()=>{});return}
 ok.innerHTML='Pour la recevoir chaque jour, active les rappels dans le <a href="'+(CFG.CONTACT_TELEGRAM||'https://t.me/Baytalilmapp')+'" target="_blank" rel="noopener" style="text-decoration:underline">bot Telegram</a>.'})}
/* ===== Bot X : réglages d'exemple sélectionnables ===== */
if(page==='bot-x'){
 $$('.xcfg .row').forEach((row,ri)=>{const chips=$$('.chip',row);if(!chips.length)return;const single=/par jour/i.test(row.firstElementChild.textContent);
  chips.forEach(c=>{keyable(c);c.addEventListener('click',()=>{if(single)chips.forEach(x=>x.classList.toggle('on',x===c));else{const n=chips.filter(x=>x.classList.contains('on')).length;if(c.classList.contains('on')&&n===1)return;c.classList.toggle('on')}})})});
 $$('.xcfg .sw').forEach(sw=>{keyable(sw);sw.setAttribute('role','switch');sw.setAttribute('aria-checked','true');sw.addEventListener('click',()=>{const off=sw.getAttribute('aria-checked')==='true';sw.setAttribute('aria-checked',!off);sw.style.background=off?'#6b7a8c':'';sw.style.transform=off?'scaleX(-1)':''})});
}
/* ===== Bot Discord : onglets « Les vrais messages du bot » ===== */
if(page==='bot-discord'){
 const tabs=$$('.tabs-ds span'),grid=$('.dgrid2');
 if(tabs.length&&grid){const kids=[...grid.children];
  const find=re=>{for(const k of kids){for(const w of $$('.dwin',k)){if(re.test($('.hd',w)?$('.hd',w).textContent:''))return w}}return null};
  const T=[/hadith/i,/coran/i,/doua/i,/radio|quran/i,/épingl|general/i];
  tabs.forEach((t,i)=>{keyable(t);t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('on',x===t));const w=find(T[i])||find(/radio|message privé/i);if(!w)return;const box=w.closest('.rv,.dcol')||w;box.scrollIntoView({behavior:'smooth',block:'center'});try{w.animate([{boxShadow:'0 0 0 0 rgba(201,164,92,0)'},{boxShadow:'0 0 0 4px rgba(201,164,92,.75)'},{boxShadow:'0 0 0 0 rgba(201,164,92,0)'}],{duration:1400})}catch(e){}})})}
}
/* ===== Mentions légales / confidentialité : sommaire qui suit la lecture ===== */
if(/^legal/.test(page)){
 const links=$$('a[href^="#"]').filter(a=>/^#(s\d+|droits)$/.test(a.getAttribute('href')));
 links.forEach(a=>{if(!document.querySelector(a.getAttribute('href'))&&a.getAttribute('href')==='#s6'&&document.getElementById('droits'))a.setAttribute('href','#droits')});
 const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
 if(links.length&&secs.every(Boolean)){const up=()=>{let k=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.35)k=i});links.forEach((a,i)=>a.classList.toggle('on',i===k))};addEventListener('scroll',up,{passive:true});up()}
}
/* ===== Tableau de bord : navigation interne et actions d'aperçu ===== */
if(page==='dashboard'){
 const card=t=>$$('.card,section').find(c=>{const h=$('h2,h3',c);return h&&new RegExp('^'+t,'i').test(h.textContent.trim())});
 const go=el=>el&&el.scrollIntoView({behavior:'smooth',block:'start'});
 const MAP={'vue d’ensemble':()=>scrollTo({top:0,behavior:'smooth'}),'mes bots':()=>go(card('Activité des bots')),'publications':()=>go(card('Prochaines publications')),'radio':()=>go(card('Stations écoutées')),'tokens api':()=>go(card('Tokens API')),'clés api':()=>go(card('Clé API')),'factures':()=>go(card('Factures')),'paramètres':()=>{const b=$('.pbtn');b&&b.click()},'documentation':()=>{location.href='api.html#demarrage'}};
 const side=$$('.side a').filter(a=>!a.getAttribute('href')||a.getAttribute('href')==='#');
 side.forEach(a=>{const k=a.textContent.trim().toLowerCase();if(MAP[k]){a.href='#';a.addEventListener('click',e=>{e.preventDefault();$$('.side a').forEach(x=>x.classList.toggle('on',x===a));MAP[k]()})}});
 const demo='Aperçu de démonstration : cette action sera active avec les comptes clients.';
 const wire=(el,fn)=>{if(!el)return;keyable(el);el.addEventListener('click',e=>{e.preventDefault();fn(e)})};
 $$('.ibtn').forEach(b=>wire(b,()=>toast('Aucune nouvelle notification.')));
 $$('.btn-gold').forEach(b=>{if(/Gérer l’abonnement/.test(b.textContent))wire(b,()=>{location.href='abonnements.html'})});
 $$('.btn').forEach(b=>{const t=b.textContent.trim();if(/^Voir le calendrier/.test(t))wire(b,()=>toast('Calendrier des publications : bientôt disponible.'));if(/^Tout télécharger/.test(t))wire(b,()=>toast(demo));if(/^Enregistrer/.test(t))wire(b,()=>toast(demo))});
 $$('.plink').forEach(p=>{if(/^Copier/.test(p.textContent.trim()))wire(p,()=>{const c=p.parentElement.querySelector('code');copy(c?c.textContent:'').then(()=>toast('Clé de démonstration copiée. Votre vraie clé s’obtient sur la page API.'))});else wire(p,()=>toast(demo))});
 $$('.pedit').forEach(p=>wire(p,()=>toast(demo)));
 $$('a').forEach(a=>{if(/^PDF/.test(a.textContent.trim()))wire(a,()=>toast('Les factures sont envoyées par Stripe à chaque paiement.'))});
}
/* ===== Liens externes : onglet séparé ===== */
$$('a[href^="http"]').forEach(a=>{if(!/baytalilm\.info/.test(a.href)&&!a.target){ext(a)}});
})();
