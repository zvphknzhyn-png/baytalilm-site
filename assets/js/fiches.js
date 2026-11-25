/* BAYT AL-ILM — fiches des récitateurs et des radios thématiques (index de la page Radio).
   Biographies : résumés factuels rédigés à partir de Wikipédia (en) et de sources publiques ; aucune image de visage. */
(function(){
const W='https://en.wikipedia.org/wiki/';
const BIO={
'Mishary Alafasy':['Mishary bin Rashid Alafasy est un récitateur (qāri’), imam, prédicateur et chanteur de nashid koweïtien. Il a étudié à la faculté du Saint Coran de l’Université islamique de Médine, où il s’est spécialisé dans les dix lectures (qirâ’ât) et dans le tafsir.','Mishari_bin_Rashid_Alafasy'],
'Abdulrahman Al-Sudais':['Abdurrahman ibn Abdulaziz As-Sudais est l’imam principal de la Grande Mosquée de La Mecque (Masjid al-Haram) et président général des affaires des deux Saintes Mosquées. Récitateur écouté dans le monde entier, il a reçu en 2005 le titre de « personnalité islamique de l’année » du Prix international du Saint Coran de Dubaï.','Abdul-Rahman_Al-Sudais'],
'Saud Al-Shuraim':['Saoud ibn Ibrahim Ach-Chouraïm est un récitateur et savant saoudien, ancien imam et prédicateur (khatîb) de la Mosquée sacrée de La Mecque. Docteur en jurisprudence islamique (fiqh) de l’université Umm al-Qura, il a enseigné cette matière à l’université.','Saud_Al-Shuraim'],
'Maher Al-Muaiqly':['Maher ibn Hamad Al-Mu’ayqli est imam et prédicateur de la Grande Mosquée de La Mecque. En 2024, il a prononcé le sermon du Hajj à ‘Arafat à l’issue de la prière devant les pèlerins rassemblés.','Maher_al-Mu\'aiqly'],
'Saad Al-Ghamdi':['Sa‘d Al-Ghâmidi est un récitateur saoudien, imam invité de la Mosquée du Prophète à Médine. Il a également dirigé la prière au sein de communautés musulmanes à l’étranger.','Saad_al_Ghamdi'],
'Yasser Al-Dosari':['Yasser ibn Rashid Ad-Dawsari est un savant saoudien, l’un des imams de la Mosquée sacrée de La Mecque depuis 2019. Prédicateur et récitateur, il y a dirigé les prières de tarawih et de tahajjud pendant le Ramadan à partir de 2015, et il est imam de mosquées de Riyad depuis 1995.','Yasir_al-Dawsari'],
'Mahmoud Khalil Al-Hussary':['Mahmoud Khalil Al-Hussary (1917-1980) était un récitateur égyptien et un spécialiste des lectures (qirâ’ât) du Coran. Connu pour sa récitation posée (murattal), il fut le premier à enregistrer le Coran complet dans ce style, et a contribué à l’étude et à l’enseignement du tajwid.','Mahmoud_Khalil_Al-Hussary'],
'Abdulbasit Abdulsamad':['Abdulbasit Abdussamad (1927-1988) était un récitateur égyptien, célèbre pour son style mélodieux (mujawwad), sa maîtrise de la voix et son timbre unique. On le surnommait « la Gorge d’or » et « la Voix de La Mecque ».','Abdul_Basit_\'Abd_us-Samad'],
'Mohammed Siddiq Al-Minshawi':['Mohammed Siddiq Al-Minshawi (1920-1969) était un récitateur égyptien, engagé comme récitateur à la radio égyptienne en 1953. Sa voix expressive et émouvante lui a valu le surnom de « la voix qui pleure » (as-sawt al-bâkî).','Muhammad_Siddiq_Al-Minshawi'],
'Mustafa Ismail':['Mustafa Ismail (1905-1978) était un récitateur égyptien. Ses récitations étaient diffusées à la radio égyptienne et lors de cérémonies religieuses en Égypte et à l’étranger. Reconnu sous le roi Farouk, il l’a aussi été sous la présidence de Nasser.','Mustafa_Ismail'],
'Ali Alhuthaifi':['Ali ibn Abderrahman Al-Houdhayfi est l’imam principal de la Mosquée du Prophète à Médine et ancien imam de la mosquée de Qubâ. Sa récitation lente et grave est largement reconnue.','\'Ali_al-Hudhayfi'],
'Abdullah Al-Johany':['Abdullah ibn Awad Al-Juhany est l’un des imams de la Grande Mosquée de La Mecque. Il est titulaire d’une licence de la faculté du Coran de l’Université islamique de Médine et d’un doctorat de l’université Umm al-Qura de La Mecque.','Abdullah_Awad_Al_Juhany'],
'Abu Bakr Al-Shatri':['Abou Bakr ibn Mohammed Ach-Chatri est un récitateur (qāri’) et imam saoudien.','Abu_Bakr_ash-Shatry'],
'Ahmad Al-Ajmy':['Ahmad ibn Ali Al-Ajmi est un récitateur et imam saoudien.','Ahmad_bin_Ali_Al-Ajmi'],
'Salah Albudair':['Salah Al-Budayr est imam de la Mosquée du Prophète et juge à la Haute Cour de Médine. Il a dirigé la prière de tarawih à la Grande Mosquée de La Mecque de 2005 à 2006.','Salah_Al_Budair'],
'Abdelbari Al-Toubayti':['Abdelbari ibn Awad Ath-Thubaity est imam et prédicateur de la Mosquée du Prophète à Médine, et ancien imam invité pour les tarawih à la Mosquée sacrée de La Mecque.','Abdulbari_ath-Thubaity'],
'Ali Jaber':['Ali Abdullah Jaber était un récitateur, imam et savant saoudien. Imam de la Mosquée sacrée de La Mecque, il enseignait aussi la jurisprudence comparée à l’université King Abdulaziz de Djeddah. Il était reconnu pour sa récitation mélodieuse.','Ali_Abdullah_Jaber'],
'Mohammad Al-Tablaway':['Mohamed Mahmoud Al-Tablawi était un récitateur égyptien, président du syndicat égyptien des récitateurs du Coran. Il a enregistré plusieurs lectures canoniques, récité lors de cérémonies en Égypte et à l’étranger, et siégé dans le jury de concours internationaux.','Mohamed_Mahmoud_al-Tablawi'],
'Mohammed Ayyub':['Mohammed Ayyub (mort le 16 avril 2016) était un récitateur, imam et savant saoudien. Imam de la Mosquée du Prophète à Médine de 1990 à 1997, puis en 2015, et de la mosquée de Qubâ, il a aussi enseigné le tafsir à l’Université islamique de Médine.','Muhammad_Ayyub'],
'Bandar Baleela':['Bandar ibn Abdulaziz Balila, né à La Mecque en 1975, est un savant et récitateur saoudien, membre du Conseil des grands savants, imam et prédicateur de la Mosquée sacrée.','Bandar_Baleela'],
'Abdullah Al-Mattrod':['Abdullah ibn Mohammed Al-Matroud, né à Al-Kharj en 1963, est un récitateur saoudien, imam de mosquées de Diriyya.','Abdullah_Matroud'],
'Mohammad Refat':['Muhammad Rifaat (1882-1950) est considéré comme le premier récitateur de la radio égyptienne, dont les ondes ont diffusé sa voix dès 1934. Il compte parmi les figures fondatrices de l’école égyptienne de récitation.',null],
'Mahmoud Ali Al-Banna':['Mahmoud Ali Al-Banna (1926-1985) était un récitateur égyptien, de la grande génération des voix de la radio égyptienne.',null]
};
const STYLE={
'Warsh':'Lecture de Warsh (riwâya de Warsh d’après Nâfi‘), répandue en Afrique du Nord et de l’Ouest.',
'Qalun':'Lecture de Qâlûn (riwâya de Qâlûn d’après Nâfi‘), en usage notamment en Libye et en Tunisie.',
'Mujawwad':'Récitation mujawwad : lente, ornée et mélodique.',
'Mu’allim':'Version pédagogique (mu‘allim) : récitation découpée pour apprendre, que l’on répète après le maître.',
'Ad-Douri':'Riwâya d’Ad-Dûrî (d’après Abû ‘Amr ou Al-Kisâ’î selon la mention).',
'Al-Bazzi':'Riwâya d’Al-Bazzî (d’après Ibn Kathîr de La Mecque).','Qunbul':'Riwâya de Qunbul (d’après Ibn Kathîr de La Mecque).',
'Shu’ba':'Riwâya de Shu‘ba (d’après ‘Âsim).','Khalaf':'Riwâya de Khalaf (d’après Hamza).','Hicham':'Riwâya de Hishâm (d’après Ibn ‘Âmir).',
'Ibn Dhakwan':'Riwâya d’Ibn Dhakwân (d’après Ibn ‘Âmir).','Ibn Jammaz':'Riwâya d’Ibn Jammâz (d’après Abû Ja‘far).','As-Sussi':'Riwâya d’As-Sûsî (d’après Abû ‘Amr).','Ruways':'Riwâyas de Ruways et Rawh (d’après Ya‘qûb).',
'Hafs':'Lecture de Hafs d’après ‘Âsim, la plus répandue dans le monde musulman.'};
const THEME=[
[/Adhkar du matin/,'Les adhkâr (invocations et rappels) à réciter le matin, diffusés en continu.'],
[/Adhkar du soir/,'Les adhkâr (invocations et rappels) à réciter le soir, diffusés en continu.'],
[/Fatwas/,'Avis juridiques (fatwas) de savants, diffusés en continu.'],
[/Fiqh/,'Enseignement de jurisprudence islamique (fiqh) : « Al-Ikhtiyârât al-fiqhiyya ».'],
[/Riyad as-Salihin/,'Lecture de « Riyâd as-Sâlihîn », recueil de hadiths compilé par l’imam An-Nawawî (XIIIe siècle).'],
[/Bukhari/,'Lecture du « Sahîh » d’Al-Bukhârî (810-870), l’un des deux recueils de hadiths les plus authentiques.'],
[/Sahih Muslim/,'Lecture du « Sahîh » de Muslim ibn al-Hajjâj (IXe siècle), l’un des deux recueils de hadiths les plus authentiques.'],
[/Histoires des prophètes/,'Récits des prophètes tels que rapportés par le Coran et la tradition.'],
[/Ramadan/,'Rappels sur les mérites du mois de Ramadan.'],
[/Ruqya/,'Récitations de versets et d’invocations de protection (ruqya).'],
[/Récitations mixtes/,'Sélection de récitations de plusieurs voix.'],
[/Compagnons/,'Récits de la vie des Compagnons et des Tâbi‘ûn.'],
[/Shama.il/,'Lecture des « Shamâ’il muhammadiyya » d’At-Tirmidhî, sur les qualités et le comportement du Prophète ﷺ.'],
[/Sira|Sîra/,'Enseignement sur la sîra, la biographie du Prophète ﷺ.'],
[/Al-Baqara/,'La sourate Al-Baqara récitée par plusieurs récitateurs.'],[/Al-Mulk/,'La sourate Al-Mulk récitée par plusieurs récitateurs.'],
[/Tabari/,'Résumé du tafsir d’At-Tabarî (839-923), grand commentaire du Coran.'],
[/Gharib/,'Explication des mots rares du Coran (gharîb al-Qur’ân).'],
[/Tafsir/,'Explication (tafsir) du Coran, diffusée en continu.'],
[/Takbirat/,'Les takbîrât de l’Aïd, diffusés en continu.'],
[/Traduction/,'Récitation du Coran avec traduction du sens des versets.'],
[/Sakina/,'Versets de la sérénité (sakîna), récités en continu.']];
function base(s){return s.replace(/&#x27;/g,'’').replace(/&amp;/g,'&').split(/ — | · /)[0].trim()}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
const modal=document.createElement('div');modal.id='fiche';modal.className='fiche';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.hidden=true;
modal.innerHTML='<div class="fbox"><button class="fclose" aria-label="Fermer">×</button><div class="fh"><div class="ar fa"></div><h3 class="serif fn"></h3><div class="fb"></div></div><p class="fp"></p><div class="fs"></div><div class="fl"></div><div class="fa2"><button class="btn btn-p btn-sm" data-go>Écouter dans la bibliothèque</button><button class="btn btn-g btn-sm" data-close>Fermer</button></div></div>';
document.body.appendChild(modal);
const $=s=>modal.querySelector(s);
function close(){modal.hidden=true;document.body.style.overflow=''}
modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.fclose,[data-close]'))close()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
let curName='';
$('[data-go]').addEventListener('click',()=>{close();const q=document.getElementById('q');if(q){q.value=curName;q.dispatchEvent(new Event('input',{bubbles:true}));document.getElementById('bibliotheque').scrollIntoView({behavior:'smooth'})}});
function open(item){const nm=item.querySelector('b').textContent.trim(),ar=(item.querySelector('.ix-ar')||{}).textContent||'',sec=item.closest('.ix').dataset.kind,b=base(nm);curName=b;
 $('.fa').textContent=ar;$('.fn').textContent=nm.replace(/&#x27;/g,'’');
 const kind={live:'<span class="bdg bdg-live"><i></i>En direct</span>',them:'<span class="bdg bdg-pre">Radio thématique</span>',pre:'<span class="bdg bdg-pre">Préenregistré</span>'}[sec]||'';$('.fb').innerHTML=kind;
 let bio='',src='';
 if(sec==='them'){const t=THEME.find(x=>x[0].test(nm));bio=t?t[1]:'Radio thématique de Bayt Al-Ilm, diffusée en continu.'}
 else if(BIO[b]){bio=BIO[b][0];if(BIO[b][1])src=BIO[b][1]}
 else bio='Voix présente sur la radio de Bayt Al-Ilm. La biographie détaillée de ce récitateur est en cours de rédaction.';
 $('.fp').textContent=bio;
 $('.fs').innerHTML=src?'Source : <a href="'+W+encodeURI(src)+'" target="_blank" rel="noopener">Wikipédia (en)</a>':'';
 // entrées liées dans les trois listes
 const all=[...document.querySelectorAll('.ix-i')].filter(i=>base(i.querySelector('b').textContent)===b);
 const sty=new Set();all.forEach(i=>{const t=i.querySelector('b').textContent.replace(/&#x27;/g,'’');Object.keys(STYLE).forEach(k=>{if(t.includes(k))sty.add(k)});});
 let h='';if(sec!=='them'){h+='<div class="fln"><b>'+all.length+'</b> entrée'+(all.length>1?'s':'')+' dans l’index : '+esc(all.map(i=>i.querySelector('b').textContent.replace(/&#x27;/g,'’').replace(b,'').replace(/^( — | · )/,'').trim()||'récitation principale').join(' · '))+'</div>'}
 if(sty.size)h+='<ul class="fsty">'+[...sty].map(k=>'<li>'+esc(STYLE[k])+'</li>').join('')+'</ul>';
 $('.fl').innerHTML=h;
 modal.hidden=false;document.body.style.overflow='hidden';modal.querySelector(".fclose").focus()}
// marquage des listes + clics
const heads=[...document.querySelectorAll('#index .ix')];const kinds=['live','them','pre'];
heads.forEach((ix,k)=>{ix.dataset.kind=kinds[k]||'live';ix.classList.add('coll')});
document.addEventListener('click',e=>{const i=e.target.closest('.ix-i');if(i&&i.closest('#index')){open(i)}});
document.querySelectorAll('.ix-i').forEach(i=>{i.setAttribute('role','button');i.setAttribute('tabindex','0');i.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}})});
// déroulants : les premières lignes, puis tout s'affiche en se déroulant vers le bas
const SHOW=40;
document.querySelectorAll('#index .ix-more').forEach((a,k)=>{const ix=a.previousElementSibling&&a.previousElementSibling.classList.contains('ix')?a.previousElementSibling:heads[k];
 const items=[...ix.querySelectorAll('.ix-i')],total=items.length;
 // masque les entrées au-delà des SHOW premières, et les lettres devenues vides
 const marks=[];items.forEach((it,i)=>{if(i>=SHOW){it.classList.add('xh');marks.push(it)}});
 ix.querySelectorAll('.ix-l').forEach(l=>{let nx=l.nextElementSibling,any=false;while(nx&&!nx.classList.contains('ix-l')){if(nx.classList.contains('ix-i')&&!nx.classList.contains('xh'))any=true;nx=nx.nextElementSibling}if(!any){l.classList.add('xh')}});
 [...ix.children].forEach(c=>{if(!c.classList.contains('ix-i')&&!c.classList.contains('ix-l')&&c.querySelector&&c.querySelector('.ix-i')&&![...c.querySelectorAll('.ix-i')].some(i=>!i.classList.contains('xh')))c.classList.add('xh')});
 const lab0=a.textContent.replace(/\s*↓\s*$/,'').replace(/\s*\(\d+\)$/,'');const lab=lab0+' ('+total+') ↓';a.textContent=lab;
 a.setAttribute('role','button');a.setAttribute('tabindex','0');a.setAttribute('aria-expanded','false');
 const tog=e=>{e.preventDefault();e.stopImmediatePropagation();const shut=ix.classList.toggle('coll');a.textContent=shut?lab:'Réduire la liste ↑';a.setAttribute('aria-expanded',String(!shut));a.style.display='';
  if(shut){const r=ix.getBoundingClientRect();if(r.top<0)scrollTo({top:scrollY+r.top-100})}};
 a.addEventListener('click',tog);a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')tog(e)})});
})();
