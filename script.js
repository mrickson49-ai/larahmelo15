const target=new Date('2026-09-12T19:30:00-03:00').getTime();
const $=id=>document.getElementById(id);
function tick(){let x=Math.max(0,target-Date.now());const D=Math.floor(x/86400000);x%=86400000;const H=Math.floor(x/3600000);x%=3600000;const M=Math.floor(x/60000),S=Math.floor((x%60000)/1000);$('days').textContent=String(D).padStart(2,'0');$('hours').textContent=String(H).padStart(2,'0');$('minutes').textContent=String(M).padStart(2,'0');$('seconds').textContent=String(S).padStart(2,'0')}
tick();setInterval(tick,1000);

const audio=$('audio'),playBtn=$('playBtn'),musicFloat=$('musicFloat'),gate=$('audioGate'),gateBtn=$('audioGateBtn'),carriage=$('carriageBtn');
const base=location.hostname.endsWith('github.io')?'/larahmelo15/':'/';
let musicBytes=null,ctx=null,gain=null,source=null,decoded=null,started=false,paused=false;

async function txt(path){const r=await fetch(base+path+'?v=webaudio1',{cache:'no-store'});if(!r.ok)throw new Error(path+' '+r.status);return (await r.text()).trim()}
function b64ToBytes(b64){const bin=atob(b64);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
function sync(on){playBtn.textContent=on?'❚❚':'▶';musicFloat.textContent=on?'♪':'♫';musicFloat.classList.toggle('playing',on)}

carriage.disabled=true;carriage.setAttribute('aria-busy','true');
const photoReady=txt('assets/live-photo.txt').then(photo=>{$('heroPhoto').src='data:image/avif;base64,'+photo}).catch(console.error);
const musicReady=Promise.all([txt('assets/mp3fix-00.txt'),txt('assets/mp3fix-01.txt')]).then(([m0,m1])=>{musicBytes=b64ToBytes(m0+m1);const blob=new Blob([musicBytes],{type:'audio/mpeg'});audio.src=URL.createObjectURL(blob);audio.preload='auto'}).catch(err=>{console.error(err);gate.classList.add('show')}).finally(()=>{carriage.disabled=false;carriage.removeAttribute('aria-busy')});

async function webAudioPlay(){
  if(!musicBytes) await musicReady;
  if(!musicBytes) throw new Error('music unavailable');
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC) throw new Error('no AudioContext');
  if(!ctx){ctx=new AC();gain=ctx.createGain();gain.gain.value=.78;gain.connect(ctx.destination)}
  await ctx.resume();
  if(!decoded){const copy=musicBytes.buffer.slice(musicBytes.byteOffset,musicBytes.byteOffset+musicBytes.byteLength);decoded=await ctx.decodeAudioData(copy)}
  if(!started){source=ctx.createBufferSource();source.buffer=decoded;source.loop=true;source.connect(gain);source.start(0);started=true}
  paused=false;gate.classList.remove('show');sync(true);
}

async function nativePlay(){audio.volume=.78;audio.loop=true;audio.currentTime=0;await audio.play();gate.classList.remove('show');sync(true)}

function startMusic(){
  const AC=window.AudioContext||window.webkitAudioContext;
  if(AC){webAudioPlay().catch(err=>{console.error(err);nativePlay().catch(()=>{gate.classList.add('show');sync(false)})})}
  else{nativePlay().catch(()=>{gate.classList.add('show');sync(false)})}
}

function pauseMusic(){if(ctx&&started){ctx.suspend();paused=true;sync(false)}else if(!audio.paused){audio.pause();sync(false)}}
function toggleMusic(){const on=(ctx&&started&&ctx.state==='running')||(!audio.paused&&!audio.ended);if(on)pauseMusic();else startMusic()}

function openInvitationAndPlay(){document.body.classList.remove('entry-locked');document.body.classList.add('invitation-open');startMusic();setTimeout(()=>document.querySelector('main')?.scrollIntoView({block:'start'}),100)}
carriage.addEventListener('click',openInvitationAndPlay);
playBtn.addEventListener('click',toggleMusic);musicFloat.addEventListener('click',toggleMusic);gateBtn.addEventListener('click',startMusic);
audio.addEventListener('play',()=>{gate.classList.remove('show');sync(true)});audio.addEventListener('pause',()=>{if(!(ctx&&started&&ctx.state==='running'))sync(false)});
sync(false);