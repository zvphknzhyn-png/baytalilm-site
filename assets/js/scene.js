/* BAYT AL-ILM بيت العلم — décor vivant de l'accueil : mer animée, ciel, oiseaux, bateaux (à partir des gravures existantes) */
(function(){
const cv=document.getElementById('scene');if(!cv)return;const ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IM={dark:{src:'assets/img/hero-sea.jpg',hz:.575},light:{src:'assets/img/r-mer-clair.jpg',hz:.43}};
const imgs={};for(const k in IM){const i=new Image();i.src=IM[k].src;imgs[k]=i}
let W,H,dpr,rect,t0=performance.now(),boats=[],flocks=[],clouds=[],nextBoat=0,nextFlock=0,vis=true;
const theme=()=>document.documentElement.dataset.theme==='light'?'light':'dark';
function size(){dpr=Math.min(devicePixelRatio||1,2);const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);layout()}
function layout(){const im=imgs[theme()];const iw=im.naturalWidth||1600,ih=im.naturalHeight||900;const s=Math.max(W/iw,H/ih)*1.06;rect={s,w:iw*s,h:ih*s,x:(W-iw*s)/2,y:(H-ih*s)/2,iw,ih};rect.hz=rect.y+rect.h*IM[theme()].hz}
addEventListener('resize',size);document.addEventListener('bt-theme',()=>{layout();boats=[];flocks=[];nextBoat=0});
new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(cv);
const rnd=(a,b)=>a+Math.random()*(b-a);
function spawnBoat(now){const dir=Math.random()<.5?1:-1;const depth=rnd(.08,.9);boats.push({dir,depth,x:dir>0?-120:W+120,sp:rnd(6,14)*(.4+depth),ph:rnd(0,6),sail:rnd(.8,1.2),born:now})}
function spawnFlock(){const dir=Math.random()<.5?1:-1;const n=3+(Math.random()*6|0);const y=rnd(H*.08,Math.max(H*.12,rect.hz-H*.18));const sc=rnd(.6,1.25);const x0=dir>0?-80:W+80;const b=[];for(let i=0;i<n;i++){const row=Math.ceil(i/2),side=i%2?1:-1;b.push({dx:-dir*row*26*sc,dy:side*row*14*sc+rnd(-4,4),ph:rnd(0,6),f:rnd(5.5,7.5)})}flocks.push({dir,x:x0,y,sc,sp:rnd(28,46),b,drift:rnd(-.15,.15)})}
for(let i=0;i<5;i++)clouds.push({x:rnd(0,1),y:rnd(.08,.4),w:rnd(.18,.4),sp:rnd(.002,.006),a:rnd(.05,.12)});
function drawBoat(b,t){const hz=rect.hz,sea=H-hz;const y=hz+sea*(.04+b.depth*.42)+Math.sin(t*1.3+b.ph)*(1+b.depth*2.5);const s=(.18+b.depth*.75)*(Math.min(W,1400)/1400+.35);
 const tilt=Math.sin(t*1.1+b.ph)*.045;const dk=theme()==='dark';ctx.save();ctx.translate(b.x,y);ctx.rotate(tilt);ctx.scale(s*b.dir,s);
 ctx.fillStyle=dk?'rgba(8,20,38,.92)':'rgba(30,48,70,.78)';ctx.strokeStyle=dk?'rgba(232,238,242,.55)':'rgba(11,30,54,.6)';ctx.lineWidth=1.4/s;
 ctx.beginPath();ctx.moveTo(-58,-4);ctx.quadraticCurveTo(0,6,60,-12);ctx.lineTo(48,10);ctx.quadraticCurveTo(0,18,-46,10);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,-78);ctx.stroke();
 ctx.fillStyle=dk?'rgba(232,226,205,.86)':'rgba(255,255,255,.92)';ctx.beginPath();ctx.moveTo(30*b.sail,-90);ctx.quadraticCurveTo(-6,-52,-44,-10);ctx.quadraticCurveTo(-8,-14,6,-8);ctx.closePath();ctx.fill();ctx.stroke();
 if(dk){ctx.fillStyle='rgba(243,223,168,.9)';ctx.beginPath();ctx.arc(-40,-2,2.2,0,7);ctx.fill()}
 ctx.restore();
 // reflet
 ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=dk?'#C9A45C':'#ffffff';ctx.fillRect(b.x-40*s,y+12*s,80*s,2);ctx.restore()}
function drawBird(x,y,s,ph,dk){const up=Math.sin(ph);const w=11*s,h=up*6*s;ctx.beginPath();ctx.moveTo(x-w,y-h);ctx.quadraticCurveTo(x-w*.45,y-h*.2-3*s,x,y);ctx.quadraticCurveTo(x+w*.45,y-h*.2-3*s,x+w,y-h);ctx.lineWidth=1.6*s;ctx.strokeStyle=dk?'rgba(232,238,242,.85)':'rgba(11,30,54,.72)';ctx.stroke();ctx.beginPath();ctx.arc(x,y+.5*s,1.2*s,0,7);ctx.fillStyle=ctx.strokeStyle;ctx.fill()}
function frame(now){requestAnimationFrame(frame);if(!vis||!W)return;const t=(now-t0)/1000;const th=theme(),im=imgs[th],dk=th==='dark';if(!im.complete||!im.naturalWidth)return;if(!rect||rect.iw!==im.naturalWidth)layout();
 const sx=Math.sin(t*.03)*rect.w*.012;
 // ciel (dérive lente)
 const hzSrc=rect.ih*IM[th].hz;ctx.drawImage(im,0,0,rect.iw,hzSrc,rect.x+sx,rect.y,rect.w,rect.hz-rect.y+1);
 // nuages qui passent
 clouds.forEach(c=>{c.x+=c.sp/60;if(c.x>1.3)c.x=-.4;const g=ctx.createRadialGradient(c.x*W,c.y*rect.hz,0,c.x*W,c.y*rect.hz,c.w*W);g.addColorStop(0,dk?`rgba(200,215,235,${c.a*.7})`:`rgba(255,255,255,${c.a*3})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,rect.hz)});
 // étoiles qui scintillent (nuit)
 if(dk){for(let i=0;i<40;i++){const x=(i*137.5%100)/100*W,y=((i*61.7)%100)/100*rect.hz*.8;const a=.25+.35*Math.sin(t*2+i);ctx.fillStyle=`rgba(255,250,230,${a})`;ctx.fillRect(x,y,1.3,1.3)}}
 // mer : bandes horizontales déplacées (houle réelle de la gravure)
 const top=rect.hz,step=3;for(let y=top;y<H;y+=step){const k=(y-top)/(H-top);const amp=(1.2+k*k*9);const off=Math.sin(t*(1.1+k*.6)+y*.045)*amp+Math.sin(t*.5+y*.013)*amp*.6;const srcY=hzSrc+(y-top)/rect.s;ctx.drawImage(im,0,srcY,rect.iw,step/rect.s+1,rect.x+off+sx*(1-k),y,rect.w,step+1)}
 // reflets dorés mobiles
 ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<26;i++){const k=((i*.618+t*.02)%1);const y=top+(H-top)*(k*k);const x=W*((i*.37+Math.sin(t*.2+i)*.05)%1);const l=14+k*60;ctx.fillStyle=dk?`rgba(201,164,92,${.05+.06*Math.sin(t*3+i)})`:`rgba(255,255,255,${.08+.08*Math.sin(t*3+i)})`;ctx.fillRect(x,y,l,1+k*1.5)}ctx.restore();
 // bateaux (sur la mer, de façon régulière)
 if(!reduce&&now>nextBoat&&boats.length<3){spawnBoat(now);nextBoat=now+rnd(7000,16000)}
 boats.sort((a,b)=>a.depth-b.depth).forEach(b=>{b.x+=b.dir*b.sp/60;drawBoat(b,t)});boats=boats.filter(b=>b.x>-200&&b.x<W+200);
 // oiseaux en vol (battements d'ailes)
 if(!reduce&&now>nextFlock&&flocks.length<2){spawnFlock();nextFlock=now+rnd(6000,14000)}
 flocks.forEach(f=>{f.x+=f.dir*f.sp/60;f.y+=Math.sin(t*.7)*.12+f.drift;f.b.forEach(b=>{b.ph+=b.f/60*2;drawBird(f.x+b.dx,f.y+b.dy+Math.sin(t*1.5+b.ph*.1)*2,f.sc,b.ph,dk)})});flocks=flocks.filter(f=>f.x>-300&&f.x<W+300);
 // voile pour la lisibilité du texte
 const g=ctx.createRadialGradient(W/2,H*.45,0,W/2,H*.45,Math.max(W,H)*.6);g.addColorStop(0,dk?'rgba(11,30,54,.45)':'rgba(243,245,247,.55)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
Promise.all(Object.values(imgs).map(i=>i.decode?i.decode().catch(()=>{}):0)).then(()=>{size();if(!reduce)spawnBoat(performance.now()-2000),boats[0]&&(boats[0].x=W*.25),spawnFlock(),flocks[0].x=W*.2;requestAnimationFrame(frame)});
})();
