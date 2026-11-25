/* BAYT AL-ILM بيت العلم — documentation interactive de l'API Bayt Al-Ilm (64 endpoints) */
(function(){
const {$,$$,esc,data,API}=window.BT;const root=$('#docs');if(!root)return;
const SHOWN=root.dataset.base||'https://api.baytalilm.info';
const pick=a=>a[Math.random()*a.length|0];
function parseMsg(m){const L=m.d.split('\n').map(l=>l.replace(/^> /,'').trim()).filter(Boolean);const ar=L.find(l=>/[\u0600-\u06FF]{3}/.test(l)&&!/[a-zA-Z]{4}/.test(l))||'';const fr=L.find(l=>l.startsWith('"')&&!/[\u0600-\u06FF]/.test(l))||'';const src=(L.find(l=>/Source|📌/.test(l))||'').replace(/[📌*↳]/g,'').trim();return{arabic:ar.replace(/^"\s*|\s*"$/g,''),text:fr.replace(/^"\s*|\s*"$/g,''),source:src}}
const env=(service,d,lang)=>({success:true,service,lang:lang||'fr',data:d,attribution:'Données Bayt Al-Ilm (démonstration dans le navigateur)',timestamp:new Date().toISOString()});
const MM={MWL:'mwl',MuslimWorldLeague:'mwl',UOIF:'uoif',ISNA:'isna',NorthAmerica:'isna',Egyptian:'egypt',Egypt:'egypt',UmmAlQura:'makkah',Makkah:'makkah',Karachi:'karachi'};
const hij=(d,tz)=>{const f=new Intl.DateTimeFormat('fr-FR-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric',timeZone:tz||'UTC'}).formatToParts(d);const g=t=>+f.find(p=>p.type===t).value;return{day:g('day'),month:g('month'),year:parseInt(f.find(p=>p.type==='year').value),month_name:new Intl.DateTimeFormat('fr-FR-u-ca-islamic-umalqura',{month:'long',timeZone:tz||'UTC'}).format(d)}};
const LOCAL={
 '/api/quran/surahs':async p=>{const s=await data('surahs');return env('quran',s.map(x=>({number:x.n,name:x.tr,name_arabic:x.ar,translation:x.fr})),p.lang)},
 '/api/quran/random':async p=>{const v=pick(await data('jeu-sourate'));return env('quran',{surah:v.sourate,ayah:v.verset,surah_name:v.nom,arabic:v.ar,translation:v.fr,source:v.source},p.lang)},
 '/api/hadith/random':async p=>env('hadith',parseMsg(pick((await data('messages')).hadith)),p.lang),
 '/api/duas/random':async p=>env('duas',parseMsg(pick((await data('messages')).douas)),p.lang),
 '/api/prayer-times':async p=>{const P=window.BT_PRAYER,lat=+p.lat,lng=+p.lng;if(!p.lat||!p.lng||isNaN(lat)||isNaN(lng))throw{status:400,error:'lat et lng sont obligatoires'};const tz=p.timezone||'Europe/Paris';const d=p.date?new Date(p.date+'T12:00:00'):new Date();const m=MM[p.method]||'mwl';const t=P.times(d,lat,lng,P.tzOffset(tz,d),m,p.madhab==='Hanafi'?2:1);const o={};P.NAMES.forEach(([k])=>o[k]=P.hm(t[k]));return env('prayer-times',{date:d.toISOString().slice(0,10),timezone:tz,method:P.METHODS[m].n,times:o},p.lang)},
 '/api/qibla':async p=>{const la=+p.lat*Math.PI/180,lo=+p.lng*Math.PI/180;if(!p.lat||!p.lng)throw{status:400,error:'lat et lng sont obligatoires'};const kla=21.4225*Math.PI/180,klo=39.8262*Math.PI/180;const dir=(Math.atan2(Math.sin(klo-lo),Math.cos(la)*Math.tan(kla)-Math.sin(la)*Math.cos(klo-lo))*180/Math.PI+360)%360;const dist=6371*Math.acos(Math.sin(la)*Math.sin(kla)+Math.cos(la)*Math.cos(kla)*Math.cos(klo-lo));return env('qibla',{direction_degrees:+dir.toFixed(2),distance_km:Math.round(dist)},p.lang)},
 '/api/today-hijri':async p=>env('calendar',{gregorian:new Date().toISOString().slice(0,10),hijri:hij(new Date(),p.timezone)},p.lang),
 '/api/hijri-date':async p=>{const d=p.date?new Date(p.date+'T12:00:00Z'):new Date();if(isNaN(d))throw{status:400,error:'date au format AAAA-MM-JJ'};return env('calendar',{gregorian:d.toISOString().slice(0,10),hijri:hij(d,p.timezone)},p.lang)},
 '/api/health':async()=>({success:true,service:'health',status:'démonstration',timestamp:new Date().toISOString()})
};
function build(ep){const path=ep.dataset.path;const p={},q=[],body={};$$('input,select',ep).forEach(i=>{const v=i.value.trim();if(v==='')return;p[i.name]=v;if(i.dataset.in==='query')q.push(i.name+'='+encodeURIComponent(v));if(i.dataset.in==='body')body[i.name]=isNaN(+v)?v:+v});
 q.push('apikey=TA_CLE');const miss=$$('label',ep).filter(l=>l.textContent.endsWith('*')).map(l=>l.textContent.replace(' *','')).filter(n=>!p[n]);
 const url=path.replace(/\{(\w+)\}/g,(_,k)=>encodeURIComponent(p[k]||'{'+k+'}'))+'?'+q.join('&');return{path,p,url,body,miss}}
function curl(ep,b){const m=ep.dataset.method;$('.curl',ep).textContent=m==='POST'?`curl -X POST "${SHOWN}${b.url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(b.body)}'`:`curl "${SHOWN}${b.url}"`}
async function run(ep){const b=build(ep);curl(ep,b);const out=$('pre.out',ep),info=$('.rinfo',ep);
 if(b.miss.length){info.innerHTML=`<span style="color:#e05a5a">Paramètre obligatoire manquant : ${esc(b.miss.join(', '))}</span>`;return}
 out.textContent='…';const t0=performance.now();let status=200,body,note='';
 try{if(API){const r=await fetch(API+b.url.replace('apikey=TA_CLE','').replace(/[?&]$/,''),{method:ep.dataset.method,headers:{'content-type':'application/json'},body:ep.dataset.method==='POST'?JSON.stringify(b.body):undefined});status=r.status;body=await r.json()}
  else if(LOCAL[b.path]){body=await LOCAL[b.path](b.p);note=' · <span class="faint">démonstration calculée dans ton navigateur</span>'}
  else{status=null;body=null}}catch(e){status=e.status||500;body={success:false,error:e.error||'Requête impossible pour le moment.'}}
 if(status===null){out.textContent='L’API ouvre bientôt sur '+SHOWN+'.\nLa requête est prête : copie-la ci-dessous pour l’utiliser dès l’ouverture.';info.innerHTML=`<code>${esc(ep.dataset.method+' '+b.url)}</code>`;return}
 out.textContent=JSON.stringify(body,null,2);info.innerHTML=`<b style="color:${status<300?'#56c690':'#e05a5a'}">${status}</b> · ${Math.round(performance.now()-t0)} ms · <code>${esc(ep.dataset.method+' '+b.url)}</code>${note}`}
$$('.ep5',root).forEach(ep=>{curl(ep,build(ep));$('.trybtn',ep).addEventListener('click',()=>run(ep));$$('input,select',ep).forEach(i=>{i.addEventListener('input',()=>curl(ep,build(ep)));i.addEventListener('keydown',e=>{if(e.key==='Enter')run(ep)})})});
const q=$('#d-q');q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();$$('.dside a',root).forEach(a=>a.classList.toggle('hide',!!v&&!a.textContent.toLowerCase().includes(v)));if(v)$$('.dside details',root).forEach(d=>d.open=true);
 $$('[data-sec]',root).forEach(s=>s.classList.toggle('hide',!!v&&!s.textContent.toLowerCase().includes(v)));$$('[id^=sec-]',root).forEach(c=>c.classList.toggle('hide',!!v&&!$$('.ep5:not(.hide)',c).length));$('#d-none').classList.toggle('hide',!v||$$('[data-sec]:not(.hide)',root).length>0)});
const openT=h=>{const t=h&&$(h);if(t&&t.tagName==='DETAILS'){t.open=true;setTimeout(()=>t.scrollIntoView({block:'start'}),50)}};
$$('.dside a',root).forEach(a=>a.addEventListener('click',()=>openT(a.getAttribute('href'))));openT(location.hash);window.addEventListener('hashchange',()=>openT(location.hash));
})();
