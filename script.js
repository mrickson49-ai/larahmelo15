const target=new Date('2026-09-12T19:30:00-03:00').getTime();
const $=id=>document.getElementById(id);
function tick(){let x=Math.max(0,target-Date.now());const D=Math.floor(x/86400000);x%=86400000;const H=Math.floor(x/3600000);x%=3600000;const M=Math.floor(x/60000),S=Math.floor((x%60000)/1000);$('days').textContent=String(D).padStart(2,'0');$('hours').textContent=String(H).padStart(2,'0');$('minutes').textContent=String(M).padStart(2,'0');$('seconds').textContent=String(S).padStart(2,'0')}
tick();setInterval(tick,1000);

const audio=$('audio');
const playBtn=$('playBtn');
const musicFloat=$('musicFloat');
const gate=$('audioGate');
const gateBtn=$('audioGateBtn');
const carriage=$('carriageBtn');
const base=location.hostname.endsWith('github.io')?'/larahmelo15/':'/';

function sync(on){
  playBtn.textContent=on?'❚❚':'▶';
  musicFloat.textContent=on?'♪':'♫';
  musicFloat.classList.toggle('playing',on);
}

// Foto do convite
fetch(base+'assets/live-photo.txt?v=photo-final',{cache:'force-cache'})
  .then(r=>{if(!r.ok)throw new Error('foto '+r.status);return r.text()})
  .then(photo=>{$('heroPhoto').src='data:image/avif;base64,'+photo.trim()})
  .catch(console.error);

// MP3 REAL: carregado diretamente pelo navegador antes do clique.
audio.src=base+'assets/music.mp3?v=realmp3-1';
audio.preload='auto';
audio.loop=true;
audio.volume=.78;
audio.load();

function startMusic(){
  // É importante chamar play() diretamente dentro do gesto do usuário.
  const attempt=audio.play();
  if(attempt&&typeof attempt.then==='function'){
    attempt.then(()=>{
      gate.classList.remove('show');
      sync(true);
    }).catch(err=>{
      console.error('Não foi possível iniciar o áudio:',err);
      gate.classList.add('show');
      sync(false);
    });
  }
}

function pauseMusic(){
  audio.pause();
  sync(false);
}

function toggleMusic(){
  if(audio.paused||audio.ended) startMusic();
  else pauseMusic();
}

function openInvitationAndPlay(){
  // O play acontece no MESMO clique que abre o convite.
  startMusic();
  document.body.classList.remove('entry-locked');
  document.body.classList.add('invitation-open');
  setTimeout(()=>document.querySelector('main')?.scrollIntoView({block:'start'}),100);
}

carriage.disabled=false;
carriage.removeAttribute('aria-busy');
carriage.addEventListener('click',openInvitationAndPlay);
playBtn.addEventListener('click',toggleMusic);
musicFloat.addEventListener('click',toggleMusic);
gateBtn.addEventListener('click',startMusic);
audio.addEventListener('play',()=>{gate.classList.remove('show');sync(true)});
audio.addEventListener('pause',()=>sync(false));
audio.addEventListener('error',()=>{console.error('Erro ao carregar assets/music.mp3',audio.error);gate.classList.add('show');sync(false)});
sync(false);
