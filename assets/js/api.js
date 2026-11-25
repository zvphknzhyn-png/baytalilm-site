/* BAYT AL-ILM — catalogue des endpoints de l'API Bayt Al-Ilm (données : assets/data/api-docs.json, tirées de openapi.json).
   « Envoyer » appelle l'API réelle quand BAYT_API_BASE est renseignée dans config.js ; sinon il affiche l'exemple de réponse. */
(function(){
const host=document.getElementById('api-docs');if(!host)return;
const CFG=window.BAYT_CONFIG||{},LIVE=(CFG.BAYT_API_BASE||'').replace(/\/$/,'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
function hl(v,ind){ind=ind||0;const p='  '.repeat(ind),q='  '.repeat(ind+1);
 if(v===null)return '<span class="n">null</span>';
 if(typeof v==='string')return '<span class="s">"'+esc(v.replace(/\n/g,' '))+'"</span>';
 if(typeof v==='number'||typeof v==='boolean')return '<span class="n">'+v+'</span>';
 if(Array.isArray(v)){if(!v.length)return '[]';return '[\n'+v.map(x=>q+hl(x,ind+1)).join(',\n')+'\n'+p+']'}
 const k=Object.keys(v);if(!k.length)return '{}';return '{\n'+k.map(x=>q+'<span class="k">"'+esc(x)+'"</span>: '+hl(v[x],ind+1)).join(',\n')+'\n'+p+'}'}
const slug=(m,p)=>'ep-'+(m+p).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let DOC,base;
function pathParts(e){return e.path.split(/(\{\w+\})/).map(s=>/^\{\w+\}$/.test(s)?'<span class="pm">'+esc(s)+'</span>':esc(s)).join('')}
function exampleVals(e){const v={};const u=e.example&&e.example.url;
 if(u){const m=e.path.split('/'),a=u.split('?')[0].split('/');m.forEach((seg,i)=>{const t=seg.match(/^\{(\w+)\}$/);if(t)v[t[1]]=a[i]});new URLSearchParams(u.split('?')[1]||'').forEach((x,k)=>v[k]=x)}
 return v}
function build(e,cat){
 const id=slug(e.method,e.path),ev=exampleVals(e);
 const fields=e.params.filter(p=>p.required||p.name==='lang').map(p=>{
  const val=ev[p.name]!==undefined?ev[p.name]:(p.default||'');
  const inp=p.enum?`<select class="in" data-p="${p.name}" data-in="${p.in}" style="width:100%;color:var(--text);background:var(--surf-solid)">${p.enum.map(o=>`<option value="${o}"${o===(ev[p.name]||'fr')?' selected':''}>${o}</option>`).join('')}</select>`:`<input class="in" data-p="${p.name}" data-in="${p.in}" value="${esc(val)}" placeholder="${esc(p.name)}" style="width:100%;color:var(--text)" autocomplete="off">`;
  return `<div><label>${esc(p.name.toUpperCase())}${p.required?' *':''}</label>${inp}</div>`}).join('');
 const tbl=e.params.length?`<div class="lab">Paramètres</div><table class="ptab"><tr><th>Nom</th><th>Type</th><th>Description</th></tr>${e.params.map(p=>`<tr><td><b>${esc(p.name)}</b>${p.required?'<sup>*</sup>':''}<div>${p.in}</div></td><td><span class="ty">${esc(p.type)}${p.enum?' · '+p.enum.join('|'):''}</span></td><td>${esc(p.desc)}</td></tr>`).join('')}</table>`:'<p class="muted">Aucun paramètre.</p>';
 const needKey=e.auth?'Clé API requise : en-tête <code>X-API-Key</code> ou paramètre <code>api_key</code>.':'Accessible sans clé.';
 const d=document.createElement('div');d.className='ep';d.id=id;d.dataset.s=(e.summary+' '+e.path+' '+cat.fr+' '+cat.key).toLowerCase();
 d.innerHTML=`<div class="ep-h" role="button" tabindex="0" aria-expanded="false" style="cursor:pointer"><em${e.method==='POST'?' style="color:#e0b45a;background:rgba(224,180,90,.12);border-color:rgba(224,180,90,.35)"':''}>${e.method}</em><code>${pathParts(e)}</code><span>${esc(e.summary)}</span><i>⌄</i></div><div class="ep-b" hidden><p class="muted" style="margin-top:12px">${needKey} Ajoutez <code>lang=ar|fr|en|es</code> pour choisir la langue : le texte arabe est toujours renvoyé.</p>${tbl}<div class="try"><div class="lab" style="color:var(--gold)">▷ Essayer</div><div class="tf" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr)) auto">${fields}<a class="btn btn-gold btn-sm" role="button" tabindex="0" data-send>Envoyer</a></div>${LIVE&&e.auth?`<div style="margin-top:10px"><label class="lab">X-API-Key</label><input class="in" data-key value="" placeholder="Votre clé API" style="width:100%;color:var(--text);margin-top:4px" autocomplete="off"></div>`:''}<div class="rmeta lab" style="margin-top:14px" hidden></div><pre class="code" style="margin-top:8px;font-size:13px;max-height:360px;overflow:auto" data-out hidden></pre><div style="margin-top:12px"><a class="btn btn-g btn-sm" role="button" tabindex="0" data-copy>Copier la requête curl</a></div></div></div>`;
 return d}
function reqUrl(d,e){let path=e.path;const qs=new URLSearchParams();
 $$('[data-p]',d).forEach(i=>{const n=i.dataset.p,v=i.value.trim();if(i.dataset.in==='path')path=path.replace('{'+n+'}',encodeURIComponent(v||'1'));else if(v)qs.set(n,v)});
 const q=qs.toString();return {path,qs:q,rel:path+(q?'?'+q:'')}}
function curl(d,e){const r=reqUrl(d,e),u=(LIVE||DOC.base)+r.rel;
 if(e.method==='POST')return `curl -X POST "${u}" \\\n  -H "X-API-Key: VOTRE_CLE" -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(e.body||{})}'`;
 return `curl "${u}"`+(e.auth?` \\\n  -H "X-API-Key: VOTRE_CLE"`:'')}
async function send(d,e){
 const out=$('[data-out]',d),meta=$('.rmeta',d);out.hidden=false;meta.hidden=false;
 if(LIVE){const r=reqUrl(d,e),k=$('[data-key]',d);try{const t0=performance.now();const res=await fetch(LIVE+r.rel,{method:e.method,headers:Object.assign({},k&&k.value?{'X-API-Key':k.value.trim()}:{},e.method==='POST'?{'Content-Type':'application/json'}:{}),body:e.method==='POST'?JSON.stringify(e.body||{}):undefined});const j=await res.json();meta.textContent=res.status+' '+(res.ok?'OK':'Erreur')+' · '+Math.round(performance.now()-t0)+' ms';meta.style.color=res.ok?'var(--gold)':'#e07070';out.innerHTML=hl(j);return}catch(x){meta.textContent='Connexion impossible';meta.style.color='#e07070';out.textContent=String(x);return}}
 if(e.example){meta.style.color='var(--gold)';meta.textContent='Exemple de réponse (l’API en ligne s’ouvre prochainement)';out.innerHTML=hl(e.example.body)}
 else{meta.style.color='var(--gold)';meta.textContent='L’API en ligne s’ouvre prochainement';out.textContent=e.method==='POST'?'Envoyez ce corps JSON :\n'+JSON.stringify(e.body||{},null,2):'Pas encore d’exemple pour cet endpoint.'}}
function toggle(d,open){const b=$('.ep-b',d),h=$('.ep-h',d),i=$('.ep-h i',d),o=open===undefined?!d.classList.contains('open'):open;d.classList.toggle('open',o);b.hidden=!o;h.setAttribute('aria-expanded',o);if(i)i.textContent=o?'⌃':'⌄'}
(async function(){
 try{DOC=await (await fetch('assets/data/api-docs.json')).json()}catch(e){host.textContent='Catalogue indisponible pour le moment.';return}
 const lead=document.getElementById('api-lead');if(lead)lead.textContent=`${DOC.categories.length} catégories et ${DOC.total} endpoints : le Coran et son tafsîr, les hadiths avec leur source, les horaires de prière et le calendrier hégirien, les douas, les 99 noms d’Allah, la zakât, la radio Coran… Chaque réponse est en JSON, en arabe, français, anglais ou espagnol (paramètre lang), avec la source du contenu.`;
 const bar=document.createElement('div');bar.style.cssText='display:flex;flex-direction:column;gap:14px;margin:6px 0 34px';
 bar.innerHTML=`<div class="tf" style="grid-template-columns:1fr"><div><label>RECHERCHER UN ENDPOINT</label><input class="in" id="api-q" type="search" placeholder="ex. hadith, qibla, /api/radio…" style="width:100%;color:var(--text)" autocomplete="off"></div></div><div id="api-cats" style="display:flex;gap:8px;flex-wrap:wrap"></div>`;
 host.appendChild(bar);
 const pills=$('#api-cats',bar);let cur='all';
 const mk=(k,t,n)=>{const b=document.createElement('button');b.type='button';b.className='pill';b.dataset.k=k;b.style.cursor='pointer';b.textContent=t+' ('+n+')';pills.appendChild(b);return b};
 mk('all','Toutes',DOC.total);DOC.categories.forEach(c=>mk(c.key,c.fr,c.endpoints.length));
 const blocks=[];
 DOC.categories.forEach(c=>{const blk=document.createElement('div');blk.className='cblk';blk.dataset.k=c.key;
  blk.innerHTML=`<div class="cblk-h"><div><h3 class="serif">${esc(c.fr)}</h3><p class="muted">${esc(c.desc)}</p></div><span class="ar shine">${esc(c.ar)}</span></div>`;
  c.endpoints.forEach(e=>blk.appendChild(build(e,c)));host.appendChild(blk);blocks.push(blk)});
 const none=document.createElement('p');none.className='muted';none.textContent='Aucun endpoint ne correspond à cette recherche.';none.hidden=true;host.appendChild(none);
 const qi=$('#api-q');
 function apply(){const v=qi.value.trim().toLowerCase();let n=0;
  blocks.forEach(b=>{let any=false;$$('.ep',b).forEach(e=>{const ok=(cur==='all'||b.dataset.k===cur)&&(!v||e.dataset.s.includes(v));e.hidden=!ok;if(ok){any=true;n++}});b.hidden=!any});
  none.hidden=n>0;$$('.pill',pills).forEach(p=>{const on=p.dataset.k===cur;p.style.borderColor=on?'var(--gold)':'';p.style.color=on?'var(--text)':''})}
 qi.addEventListener('input',apply);
 pills.addEventListener('click',e=>{const b=e.target.closest('.pill');if(!b)return;cur=b.dataset.k;apply()});
 apply();
 const byId={};DOC.categories.forEach(c=>c.endpoints.forEach(e=>byId[slug(e.method,e.path)]=e));
 host.addEventListener('click',e=>{const d=e.target.closest('.ep');if(!d)return;const ep=byId[d.id];
  if(e.target.closest('.ep-h'))toggle(d);
  else if(e.target.closest('[data-send]'))send(d,ep);
  else if(e.target.closest('[data-copy]')){const t=curl(d,ep),b=e.target.closest('[data-copy]');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(x){}ta.remove()}).finally(()=>{const o=b.textContent;b.textContent='Copié ✓';setTimeout(()=>b.textContent=o,1400)})}});
 host.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.ep-h,[data-send],[data-copy]')){e.preventDefault();e.target.click()}});
 /* lien direct vers un endpoint : api.html#ep-get-api-quran-random */
 const h=location.hash.slice(1);if(h.startsWith('ep-')){const d=document.getElementById(h);if(d){toggle(d,true);setTimeout(()=>d.scrollIntoView({block:'center'}),100)}}
})();
})();
