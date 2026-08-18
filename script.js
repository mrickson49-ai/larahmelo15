const target=new Date('2026-09-12T19:30:00-03:00').getTime();
const $=id=>document.getElementById(id);
function tick(){let x=Math.max(0,target-Date.now());const D=Math.floor(x/86400000);x%=86400000;const H=Math.floor(x/3600000);x%=3600000;const M=Math.floor(x/60000),S=Math.floor((x%60000)/1000);$('days').textContent=String(D).padStart(2,'0');$('hours').textContent=String(H).padStart(2,'0');$('minutes').textContent=String(M).padStart(2,'0');$('seconds').textContent=String(S).padStart(2,'0')}
tick();setInterval(tick,1000);
const audio=$('audio'),playBtn=$('playBtn'),musicFloat=$('musicFloat'),gate=$('audioGate'),gateBtn=$('audioGateBtn'),carriage=$('carriageBtn');
audio.volume=.72;
const base=location.hostname.endsWith('github.io')?'/larahmelo15/':'/';
async function txt(path){const r=await fetch(base+path,{cache:'force-cache'});if(!r.ok)throw new Error(path+' '+r.status);return (await r.text()).trim()}
carriage.disabled=true;carriage.setAttribute('aria-busy','true');
const assetsReady=(async()=>{const [photo,m0,m1,m2,m3]=await Promise.all([txt('assets/live-photo.txt'),txt('assets/live-music-00.txt'),txt('assets/live-music-01.txt'),txt('assets/live-music-02.txt'),txt('assets/live-music-03.txt')]);$('heroPhoto').src='data:image/avif;base64,'+photo;audio.src='data:audio/ogg;base64,'+[m0,m1,m2,m3].join('');audio.load();carriage.disabled=false;carriage.removeAttribute('aria-busy')})().catch(err=>{console.error(err);carriage.disabled=false;carriage.removeAttribute('aria-busy')});
function sync(){const on=!audio.paused&&!audio.ended;playBtn.textContent=on?'❚❚':'▶';musicFloat.textContent=on?'♪':'♫';musicFloat.classList.toggle('playing',on)}
function tryPlay(){const p=audio.play();if(p&&p.catch)p.catch(()=>gate.classList.add('show'));sync()}
function toggle(){if(audio.paused||audio.ended){if(audio.ended)audio.currentTime=0;tryPlay()}else{audio.pause();sync()}}
carriage.addEventListener('click',async()=>{try{await assetsReady}catch(e){}document.body.classList.remove('entry-locked');document.body.classList.add('invitation-open');tryPlay();setTimeout(()=>document.querySelector('main')?.scrollIntoView({block:'start'}),100)});
playBtn.addEventListener('click',toggle);musicFloat.addEventListener('click',toggle);gateBtn.addEventListener('click',()=>{tryPlay();gate.classList.remove('show')});
audio.addEventListener('play',()=>{gate.classList.remove('show');sync()});audio.addEventListener('pause',sync);audio.addEventListener('ended',sync);sync();