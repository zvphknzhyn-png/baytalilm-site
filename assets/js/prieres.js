/* BAYT AL-ILM بيت العلم — horaires de prière calculés en direct dans le navigateur (calcul astronomique Bayt Al-Ilm) */
(function(){
const {$,$$,esc,LS,data,API}=window.BT;
const D2R=Math.PI/180,R2D=180/Math.PI,sin=d=>Math.sin(d*D2R),cos=d=>Math.cos(d*D2R),tan=d=>Math.tan(d*D2R),asin=x=>R2D*Math.asin(x),acos=x=>R2D*Math.acos(x),atan2=(y,x)=>R2D*Math.atan2(y,x),acot=x=>R2D*Math.atan(1/x);
const fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
const METHODS={mwl:{n:'Ligue islamique mondiale (18° / 17°)',f:18,i:17},uoif:{n:'Musulmans de France (12° / 12°)',f:12,i:12},isna:{n:'Amérique du Nord, ISNA (15° / 15°)',f:15,i:15},egypt:{n:'Égypte (19,5° / 17,5°)',f:19.5,i:17.5},makkah:{n:'Umm al-Qura, La Mecque (18,5° / 90 min)',f:18.5,i:'90'},karachi:{n:'Karachi (18° / 18°)',f:18,i:18}};
function julian(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPos(jd){const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360),L=fix(q+1.915*sin(g)+.020*sin(2*g),360),e=23.439-.00000036*D;const RA=atan2(cos(e)*sin(L),cos(L))/15;return{decl:asin(sin(e)*sin(L)),eqt:q/15-fix(RA,24)}}
function times(date,lat,lng,tz,mk,asrF){const jd=julian(date.getFullYear(),date.getMonth()+1,date.getDate())-lng/(15*24);const M=METHODS[mk];
 const mid=t=>fix(12-sunPos(jd+t).eqt,24);
 const ang=(a,t,ccw)=>{const s=sunPos(jd+t),n=mid(t);const T=acos((-sin(a)-sin(s.decl)*sin(lat))/(cos(s.decl)*cos(lat)))/15;return n+(ccw?-T:T)};
 const asr=(f,t)=>{const d=sunPos(jd+t).decl;return ang(-acot(f+tan(Math.abs(lat-d))),t)};
 let t={fajr:5,sunrise:6,dhuhr:12,asr:13,maghrib:18,isha:18};
 for(let k=0;k<2;k++){const p=x=>x/24;t={fajr:ang(M.f,p(t.fajr),true),sunrise:ang(.833,p(t.sunrise),true),dhuhr:mid(p(t.dhuhr)),asr:asr(asrF,p(t.asr)),maghrib:ang(.833,p(t.maghrib)),isha:M.i==='90'?null:ang(M.i,p(t.isha))}; if(t.isha===null)t.isha=t.maghrib+1.5}
 // hautes latitudes : méthode de l'angle (portion de la nuit)
 const night=fix(t.sunrise-t.maghrib,24);
 if(isNaN(t.fajr)||fix(t.sunrise-t.fajr,24)>M.f/60*night)t.fajr=t.sunrise-M.f/60*night;
 if(M.i!=='90'&&(isNaN(t.isha)||fix(t.isha-t.maghrib,24)>M.i/60*night))t.isha=t.maghrib+M.i/60*night;
 const off=tz-lng/15;for(const k in t)t[k]+=off;t.dhuhr+=1/60;t.maghrib+=0;return t}
function tzOffset(zone,date){try{const f=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'longOffset'}).formatToParts(date).find(p=>p.type==='timeZoneName').value;const m=f.match(/GMT([+-])(\d{2}):?(\d{2})?/);return m?(m[1]==='-'?-1:1)*(+m[2]+(+m[3]||0)/60):0}catch(e){return -date.getTimezoneOffset()/60}}
const hm=h=>{h=fix(h+.5/60,24);const H=Math.floor(h),M=Math.floor((h-H)*60);return String(H).padStart(2,'0')+':'+String(M).padStart(2,'0')};
const NAMES=[['fajr','Fajr','الفجر'],['sunrise','Lever du soleil','الشروق'],['dhuhr','Dhuhr','الظهر'],['asr','Asr','العصر'],['maghrib','Maghrib','المغرب'],['isha','Isha','العشاء']];
window.BT_PRAYER={times,tzOffset,hm,NAMES,METHODS,fix};
const root=$('#prayer');if(!root)return;
let V=[],city=null,map,mini,mk,mk2,selKey=null,lastT=null;
const inp=$('#p-city'),list=$('#p-list'),meth=$('#p-method'),asrS=$('#p-asr');
meth.value=LS.get('pm',meth.value);asrS.value=LS.get('pa','1');
function nowIn(zone){const d=new Date();const off=tzOffset(zone,d);return new Date(d.getTime()+(off*60+d.getTimezoneOffset())*60000)}
function render(){if(!city)return;const local=nowIn(city.tz);const off=tzOffset(city.tz,new Date());const t=times(local,city.lat,city.lng,off,meth.value,+asrS.value);lastT=t;
 const cur=local.getHours()+local.getMinutes()/60;const nxt=NAMES.find(n=>n[0]!=='sunrise'&&fix(t[n[0]],24)>cur);
 $('#p-where').textContent=city.name+(city.country?', '+city.country:'');
 $('#p-date').textContent=local.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · '+new Intl.DateTimeFormat('fr-FR-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(local);
 $('#p-times').innerHTML=NAMES.map(([k,fr,ar])=>`<div class="pt${nxt&&nxt[0]===k?' next':''}${selKey===k?' sel':''}" data-k="${k}" tabindex="0" role="button" aria-label="${fr} ${hm(t[k])}"><span><b>${fr}</b> <span class="ar" style="font-size:16px;margin-left:6px">${ar}</span>${nxt&&nxt[0]===k?' <span class="vtag">prochaine</span>':''}</span><span class="faint" style="font-size:13px">${k==='sunrise'?'':'Sélectionner'}</span><time>${hm(t[k])}</time></div>`).join('');
 $('#p-src').textContent='Calcul astronomique en direct · '+METHODS[meth.value].n+' · Asr '+(asrS.value==='2'?'hanafite':'majoritaire (Shafi‘i, Maliki, Hanbali)')+' · heure locale de '+city.name+'.';
 history.replaceState(null,'','?ville='+encodeURIComponent(city.name)+'&lat='+city.lat+'&lng='+city.lng+'&tz='+encodeURIComponent(city.tz));
 const cal=$('#p-cal');if(cal)cal.href='calendrier.html'+location.search+'&m='+meth.value+'&asr='+asrS.value;
 if(map){map.flyTo([city.lat,city.lng],10,{duration:1.6});mk.setLatLng([city.lat,city.lng]).bindTooltip(city.name,{permanent:true,direction:'top',offset:[0,-8]});mini.setView([20,city.lng>100?100:city.lng<-100?-100:city.lng],0);mk2.setLatLng([city.lat,city.lng])}}
function choose(c){city=c;LS.set('city',c);inp.value=c.name;list.innerHTML='';list.classList.add('hide');selKey=null;$('#p-actions').classList.remove('on');render()}
inp.addEventListener('input',()=>{const q=inp.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(q.length<2){list.classList.add('hide');return}
 const r=V.filter(v=>v.k.startsWith(q)).slice(0,8).concat(V.filter(v=>!v.k.startsWith(q)&&v.k.includes(q)).slice(0,4));
 list.innerHTML=r.map((v,i)=>`<button type="button" data-i="${V.indexOf(v)}">${esc(v.name)} <span class="faint">${esc(v.country)}</span></button>`).join('')||'<span class="faint" style="padding:10px;display:block">Ville introuvable : essaie la localisation.</span>';list.classList.remove('hide')});
inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const b=$('button',list);if(b)b.click()}});
list.addEventListener('click',e=>{const b=e.target.closest('button');if(b)choose(V[+b.dataset.i])});
[meth,asrS].forEach(s=>s.addEventListener('change',()=>{LS.set('pm',meth.value);LS.set('pa',asrS.value);render()}));
$('#p-geo').addEventListener('click',()=>{if(!navigator.geolocation){toast('Localisation non disponible sur ce navigateur');return}toast('Recherche de ta position…');
 navigator.geolocation.getCurrentPosition(p=>{const{latitude:la,longitude:lo}=p.coords;let best=null,bd=1e9;V.forEach(v=>{const d=(v.lat-la)**2+((v.lng-lo)*Math.cos(la*D2R))**2;if(d<bd){bd=d;best=v}});
  choose({name:best&&bd<.5?best.name:'Ma position',country:best&&bd<.5?best.country:'',lat:+la.toFixed(4),lng:+lo.toFixed(4),tz:Intl.DateTimeFormat().resolvedOptions().timeZone})},()=>toast('Localisation refusée : choisis ta ville dans la liste'),{timeout:10000})});
/* sélection d'une prière : widget, alerte, calendrier */
$('#p-times').addEventListener('click',e=>{const r=e.target.closest('.pt');if(!r||r.dataset.k==='sunrise')return;selKey=r.dataset.k;$$('.pt').forEach(x=>x.classList.toggle('sel',x===r));const n=NAMES.find(x=>x[0]===selKey);$('#p-selname').textContent=n[1]+' à '+hm(lastT[selKey]);$('#p-actions').classList.add('on')});
$('#p-times').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.click()});
function ics(days){const n=NAMES.filter(x=>x[0]!=='sunrise');const off=tzOffset(city.tz,new Date());let ev='';const base=nowIn(city.tz);
 for(let d=0;d<days;d++){const dt=new Date(base.getFullYear(),base.getMonth(),base.getDate()+d);const t=times(dt,city.lat,city.lng,tzOffset(city.tz,dt),meth.value,+asrS.value);
  (days===1?n.filter(x=>x[0]===selKey):n).forEach(([k,fr])=>{const h=fix(t[k],24),H=Math.floor(h),M=Math.round((h-H)*60);const loc=new Date(Date.UTC(dt.getFullYear(),dt.getMonth(),dt.getDate(),H,M)-tzOffset(city.tz,dt)*3600000);const s=loc.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
   ev+=`BEGIN:VEVENT\r\nUID:${k}-${s}@baytalilm.info\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z\r\nDTSTART:${s}\r\nDURATION:PT15M\r\nSUMMARY:${fr} — ${city.name}\r\nDESCRIPTION:Horaires BAYT AL-ILM (${METHODS[meth.value].n})\r\nBEGIN:VALARM\r\nTRIGGER:-PT10M\r\nACTION:DISPLAY\r\nDESCRIPTION:${fr} dans 10 minutes\r\nEND:VALARM\r\nEND:VEVENT\r\n`})}
 const blob=new Blob([`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//BAYT AL-ILM//Horaires//FR\r\nCALSCALE:GREGORIAN\r\n${ev}END:VCALENDAR\r\n`],{type:'text/calendar'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`priere-${days===1?selKey:'30-jours'}-${city.name.replace(/\W+/g,'-')}.ics`;a.click();toast('Fichier calendrier téléchargé : ouvre-le pour l’ajouter')}
$('#p-ics').addEventListener('click',()=>ics(1));$('#p-ics30').addEventListener('click',()=>ics(30));
$('#p-alert').addEventListener('click',async()=>{if(!('Notification' in window)){toast('Alertes non disponibles sur ce navigateur');return}const p=await Notification.requestPermission();if(p!=='granted'){toast('Autorise les notifications pour recevoir l’alerte');return}
 const local=nowIn(city.tz);const cur=local.getHours()+local.getMinutes()/60+local.getSeconds()/3600;let dh=fix(lastT[selKey],24)-cur;if(dh<0)dh+=24;const k=selKey,n=NAMES.find(x=>x[0]===k)[1];
 setTimeout(()=>new Notification('BAYT AL-ILM — '+n,{body:`C’est l’heure de ${n} à ${city.name}.`,icon:'assets/img/icon-512.png'}),dh*3600000);toast(`Alerte programmée pour ${n} (garde cette page ouverte, ou utilise le calendrier)`)});
$('#p-widget').addEventListener('click',()=>openModal(`<div class="kicker">Widget sur ton téléphone</div><h3 class="serif" style="font-size:28px;margin:8px 0 14px">Ajoute les horaires de ${esc(city.name)} à ton écran d’accueil</h3><ol style="padding-left:20px;display:grid;gap:8px;color:var(--muted)"><li><b>iPhone (Safari)</b> : bouton Partager → « Sur l’écran d’accueil ».</li><li><b>Android (Chrome)</b> : menu ⋮ → « Ajouter à l’écran d’accueil ».</li></ol><p class="muted" style="margin-top:12px">L’icône ouvre directement cette page avec ta ville et tes réglages. Pour des rappels sans ouvrir le site, ajoute plutôt le calendrier des 30 prochains jours (alerte 10 minutes avant chaque prière).</p><div class="btns l" style="margin-top:16px"><button class="btn btn-p btn-sm" type="button" onclick="btCopy(location.href)">Copier le lien de ma ville</button></div>`));
/* carte */
function initMap(){if(!window.L)return;const dark=()=>document.documentElement.dataset.theme!=='light';const url=()=>`https://{s}.basemaps.cartocdn.com/${dark()?'dark_all':'light_all'}/{z}/{x}/{y}{r}.png`;
 map=L.map('map',{zoomControl:true,attributionControl:true,scrollWheelZoom:false}).setView([30,10],2);const tl=L.tileLayer(url(),{attribution:'© OpenStreetMap, © CARTO',maxZoom:18}).addTo(map);
 const ic=L.divIcon({className:'pdot',html:'<span></span>',iconSize:[18,18]});mk=L.marker([0,0],{icon:ic}).addTo(map);
 mini=L.map('worldmini',{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,touchZoom:false}).setView([20,0],0);const tl2=L.tileLayer(url(),{maxZoom:3}).addTo(mini);mk2=L.marker([0,0],{icon:ic}).addTo(mini);
 map.on('click',e=>{const la=e.latlng.lat,lo=e.latlng.lng;let best=null,bd=1e9;V.forEach(v=>{const d=(v.lat-la)**2+((v.lng-lo)*Math.cos(la*D2R))**2;if(d<bd){bd=d;best=v}});if(best)choose(best)});
 document.addEventListener('bt-theme',()=>{tl.setUrl(url());tl2.setUrl(url())})}
(async()=>{const raw=await data('villes');const DN=(()=>{try{return new Intl.DisplayNames(['fr'],{type:'region'})}catch(e){return null}})();V=raw.map(([name,cc,lat,lng,tz])=>({name,country:(DN&&cc&&cc.length===2?DN.of(cc):cc)||'',lat,lng,tz,k:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}));initMap();
 const q=new URLSearchParams(location.search);if(q.get('lat'))choose({name:q.get('ville')||'Ma position',country:'',lat:+q.get('lat'),lng:+q.get('lng'),tz:q.get('tz')||'Europe/Paris'});else choose(LS.get('city',V.find(v=>v.name==='Paris')));
 setInterval(render,60000)})();
})();
