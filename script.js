const target=new Date('2026-09-12T19:30:00-03:00').getTime();
function tick(){let diff=Math.max(0,target-Date.now());const d=Math.floor(diff/86400000);diff%=86400000;const h=Math.floor(diff/3600000);diff%=3600000;const m=Math.floor(diff/60000);const s=Math.floor((diff%60000)/1000);days.textContent=String(d).padStart(2,'0');hours.textContent=String(h).padStart(2,'0');minutes.textContent=String(m).padStart(2,'0');seconds.textContent=String(s).padStart(2,'0')}
tick();setInterval(tick,1000);
const a=document.getElementById('audio'),p=document.getElementById('playBtn'),f=document.getElementById('musicFloat'),gate=document.getElementById('audioGate'),gateBtn=document.getElementById('audioGateBtn');
a.volume=.72;
const repoBase=location.hostname.endsWith('github.io')?'/larahmelo15/':'/';
const assetBase=repoBase+'assets/';
async function assembleAsset(prefix,count,mime){const parts=await Promise.all(Array.from({length:count},(_,i)=>fetch(assetBase+prefix+'-'+String(i).padStart(2,'0')+'.txt').then(r=>{if(!r.ok)throw new Error('asset '+r.status);return r.text()})));return 'data:'+mime+';base64,'+parts.join('')}
const assetsReady=(async()=>{const[photo,music]=await Promise.all([assembleAsset('photo35',3,'image/avif'),assembleAsset('music12',7,'audio/ogg')]);document.getElementById('heroPhoto').src=photo;a.src=music;a.load()})();
function syncMusicUI(){const playing=!a.paused&&!a.ended;p.textContent=playing?'❚❚':'▶';f.textContent=playing?'♪':'♫';f.classList.toggle('playing',playing)}
async function startMusic(){try{await assetsReady;await a.play();gate.classList.remove('show');syncMusicUI();return true}catch(err){gate.classList.add('show');syncMusicUI();return false}}
function toggle(){if(a.paused||a.ended){if(a.ended)a.currentTime=0;startMusic()}else{a.pause();syncMusicUI()}}
p.addEventListener('click',toggle);f.addEventListener('click',toggle);gateBtn.addEventListener('click',startMusic);a.addEventListener('play',syncMusicUI);a.addEventListener('pause',syncMusicUI);a.addEventListener('ended',syncMusicUI);
const carriageBtn=document.getElementById('carriageBtn');const invitePath=repoBase+'convite/';
function revealInvitation({push=true,play=true}={}){document.body.classList.remove('entry-locked');document.body.classList.add('invitation-open');if(push&&location.pathname!==invitePath)history.pushState({invite:true},'',invitePath);if(play)startMusic();setTimeout(()=>document.querySelector('main')?.scrollIntoView({block:'start'}),120)}
function showEntry(){document.body.classList.add('entry-locked');document.body.classList.remove('invitation-open');a.pause();syncMusicUI();window.scrollTo({top:0,behavior:'instant'})}
carriageBtn.addEventListener('click',()=>revealInvitation({push:true,play:true}));window.addEventListener('popstate',()=>{if(location.pathname===repoBase||location.pathname===repoBase.slice(0,-1)){showEntry()}else{revealInvitation({push:false,play:false})}});
if(location.hash==='#convite'||location.pathname.endsWith('/convite/')||location.pathname.endsWith('/convite')){revealInvitation({push:false,play:false});window.addEventListener('load',()=>setTimeout(startMusic,150),{once:true})}else{showEntry()}syncMusicUI();
