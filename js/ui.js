// ════════════════════════════════════════════════════════════
// LYRICS / TOAST
// ════════════════════════════════════════════════════════════
function showLyrics(text) {
  const el=document.getElementById('lyrics-overlay');
  el.textContent=text;el.classList.add('show');
}
function hideLyrics() {
  document.getElementById('lyrics-overlay').classList.remove('show');
}
let toastTimer;
function showToast(text) {
  const el=document.getElementById('toast');
  el.textContent=text;el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),3000);
}

// ════════════════════════════════════════════════════════════
// TUTORIAL
// ════════════════════════════════════════════════════════════
function openTutorial() {
  tutStep=0;renderTutStep();
  document.getElementById('tutorial-modal').classList.add('open');
}
function closeTutorial() { document.getElementById('tutorial-modal').classList.remove('open'); }

function renderTutStep() {
  document.querySelectorAll('.tut-step').forEach((el,i)=>el.classList.toggle('active',i===tutStep));
  const dots=document.getElementById('tut-dots');dots.innerHTML='';
  document.querySelectorAll('.tut-step').forEach((_,i)=>{
    const d=document.createElement('div');d.className='tut-dot';
    if(i<tutStep)d.classList.add('done');
    if(i===tutStep)d.classList.add('active');
    dots.appendChild(d);
  });
  const total=document.querySelectorAll('.tut-step').length;
  document.getElementById('tut-back').style.display=tutStep>0?'inline-flex':'none';
  document.getElementById('tut-next').textContent=tutStep>=total-1?'🎉 Start Coding!':'Next →';
}

function tutNav(dir) {
  const total=document.querySelectorAll('.tut-step').length;
  tutStep+=dir;
  if(tutStep>=total){closeTutorial();return;}
  if(tutStep<0)tutStep=0;
  renderTutStep();
}

// ════════════════════════════════════════════════════════════
// CONFETTI
// ════════════════════════════════════════════════════════════
function fireConfetti(count) {
  const colors = ['#2E80D0','#4CAF50','#E07830','#7050D0','#D04040','#FFD700','#FF69B4'];
  for (let i = 0; i < (count || 60); i++) {
    const dot = document.createElement('div');
    const size = 6 + Math.random() * 6;
    dot.style.cssText = [
      'position:fixed',
      'left:' + (10 + Math.random() * 80) + 'vw',
      'top:-12px',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'background:' + colors[Math.floor(Math.random() * colors.length)],
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
      'pointer-events:none',
      'z-index:9999',
      'animation:confettiFall ' + (1.4 + Math.random() * 1.4) + 's ease-in forwards',
      'animation-delay:' + (Math.random() * 0.6) + 's'
    ].join(';');
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 3200);
  }
}

// ════════════════════════════════════════════════════════════
// MODE SWITCHING
// ════════════════════════════════════════════════════════════
function setMode(m) {
  mode=m;
  document.querySelectorAll('.mode-tab').forEach(t=>t.classList.toggle('active',t.dataset.mode===m));
  const overlay=document.getElementById('challenge-overlay');
  const levelSelect=document.getElementById('level-select');
  if(m==='free') {
    overlay.classList.remove('visible');
    levelSelect.classList.remove('visible');
    document.getElementById('palette').classList.remove('hidden-in-challenge');
    activeContainer=null;
    syncAll();
  } else if(m==='challenge') {
    overlay.classList.remove('visible');
    levelSelect.classList.add('visible');
    renderLevelSelect();
  }
}
