const target=new Date('2026-09-12T19:30:00-03:00').getTime();
const $=id=>document.getElementById(id);
function tick(){let x=Math.max(0,target-Date.now());const D=Math.floor(x/86400000);x%=86400000;const H=Math.floor(x/3600000);x%=3600000;const M=Math.floor(x/60000),S=Math.floor((x%60000)/1000);$('days').textContent=String(D).padStart(2,'0');$('hours').textContent=String(H).padStart(2,'0');$('minutes').textContent=String(M).padStart(2,'0');$('seconds').textContent=String(S).padStart(2,'0')}
tick();setInterval(tick,1000);
const audio=$('audio'),playBtn=$('playBtn'),musicFloat=$('musicFloat'),gate=$('audioGate'),gateBtn=$('audioGateBtn'),carriage=$('carriageBtn');
audio.volume=.78;audio.loop=true;
const base=location.hostname.endsWith('github.io')?'/larahmelo15/':'/';
async function txt(path){const r=await fetch(base+path+'?v=mp3fix1',{cache:'no-store'});if(!r.ok)throw new Error(path+' '+r.status);return (await r.text()).trim()}
carriage.disabled=true;carriage.setAttribute('aria-busy','true');
const photoReady=txt('assets/live-photo.txt').then(photo=>{$('heroPhoto').src='data:image/avif;base64,'+photo}).catch(console.error);
const audioReady=Promise.all([txt('assets/mp3fix-00.txt'),txt('assets/mp3fix-01.txt')]).then(([m0,m1])=>{audio.src='data:audio/mpeg;base64,'+m0+m1;audio.load();return new Promise(resolve=>{if(audio.readyState>=2)return resolve();const done=()=>resolve();audio.addEventListener('canplay',done,{once:true});setTimeout(resolve,1800)})}).catch(err=>{console.error(err);gate.classList.add('show')}).finally(()=>{carriage.disabled=false;carriage.removeAttribute('aria-busy')});
function sync(){const on=!audio.paused&&!audio.ended;playBtn.textContent=on?'❚❚':'▶';musicFloat.textContent=on?'♪':'♫';musicFloat.classList.toggle('playing',on)}
function tryPlay(){if(audio.ended)audio.currentTime=0;const p=audio.play();if(p&&p.then)p.then(()=>{gate.classList.remove('show');sync()}).catch(()=>{gate.classList.add('show');sync()});else sync()}
function toggle(){if(audio.paused||audio.ended)tryPlay();else{audio.pause();sync()}}
carriage.addEventListener('click',()=>{document.body.classList.remove('entry-locked');document.body.classList.add('invitation-open');audio.currentTime=0;tryPlay();setTimeout(()=>document.querySelector('main')?.scrollIntoView({block:'start'}),100)});
playBtn.addEventListener('click',toggle);musicFloat.addEventListener('click',toggle);gateBtn.addEventListener('click',()=>{tryPlay()});
audio.addEventListener('play',()=>{gate.classList.remove('show');sync()});audio.addEventListener('pause',sync);audio.addEventListener('ended',()=>{audio.currentTime=0;tryPlay()});sync();