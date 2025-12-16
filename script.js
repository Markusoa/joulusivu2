// script.js — enhanced snowfall, sparkles, music controls, reduced-motion support
(function(){
  // Canvas snowfall with parallax and sparkles
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const flakes = [];
  const sparkles = [];
  const flakeCount = Math.max(80, Math.floor(w/12));
  const sparkleCount = Math.max(8, Math.floor(w/200));

  function rand(min,max){return Math.random()*(max-min)+min}

  function init(){
    flakes.length = 0;
    for(let i=0;i<flakeCount;i++){
      flakes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: rand(0.8,3.6),
        d: rand(0.3,1.6),
        vx: rand(-0.6,0.6),
        sway: rand(0.01,0.06),
        phase: Math.random()*Math.PI*2
      });
    }
    sparkles.length = 0;
    for(let i=0;i<sparkleCount;i++){
      sparkles.push({
        x: Math.random()*w,
        y: Math.random()*h*0.6,
        r: rand(0.6,1.8),
        opacity: rand(0.2,0.8),
        tw: rand(1.2,2.8),
        phase: Math.random()*Math.PI*2
      });
    }
  }

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
  }
  window.addEventListener('resize', resize);

  // Respect reduced motion
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function update(t){
    ctx.clearRect(0,0,w,h);

    // subtle ambient gradient overlay
    // draw sparkles
    for(let s of sparkles){
      const a = 0.3 + Math.sin((t/1000)/s.tw + s.phase)*0.3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,244,214,${a*s.opacity})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }

    // draw flakes
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    for(let f of flakes){
      if(!reduceMotion){
        f.phase += f.sway;
        f.x += Math.sin(f.phase)*0.6 + f.vx;
        f.y += f.d;
      } else {
        f.y += f.d*0.35;
      }
      if(f.y > h + 10){ f.y = -10; f.x = Math.random()*w; }
      if(f.x > w + 20) f.x = -20;
      if(f.x < -20) f.x = w + 20;
      ctx.beginPath();
      ctx.globalAlpha = Math.min(1, 0.9 - (f.r/6));
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(update);
  }

  init();
  if(!reduceMotion) requestAnimationFrame(update);

  // Music controls
  const music = document.getElementById('music');
  const playBtn = document.getElementById('playMusic');
  const muteBtn = document.getElementById('muteBtn');
  let playing = false;

  // If audio file not provided in repo, buttons remain but do nothing (graceful)
  function setPlaying(state){
    playing = state;
    playBtn.setAttribute('aria-pressed', String(state));
    playBtn.textContent = state ? '⬛ Pysäytä musiikki' : '▶ Soita joulumelodia';
  }
  // function setMuted(state){
  //   muteBtn.setAttribute('aria-pressed', String(state));
  //   muteBtn.textContent = state ? 'Ääni päällä' : 'Hiljennä';
  // }

  playBtn.addEventListener('click', function(){
    if(!music || !music.src) {
      alert('Taustamusiikkia ei ole ladattu. Lisää tiedosto assets/jingle.mp3 reposi assets-kansioon.');
      return;
    }
    if(!playing){
      music.play().catch(()=>{/* user gesture required */});
      setPlaying(true);
    } else {
      music.pause();
      setPlaying(false);
    }
  });

  // muteBtn.addEventListener('click', function(){
  //   if(!music) return;
  //   music.muted = !music.muted;
  //   setMuted(music.muted);
  // });

  // init state
  setPlaying(false);
  setMuted(true);

  // Progressive enhancement: if reduced motion, stop snow animation but render a few static flakes
  if(reduceMotion){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<80;i++){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.arc(Math.random()*w, Math.random()*h, Math.random()*2, 0, Math.PI*2);
      ctx.fill();
    }
  }
})();
