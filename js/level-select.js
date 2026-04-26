// ════════════════════════════════════════════════════════════
// LEVEL SELECT
// ════════════════════════════════════════════════════════════
let completedLevels = JSON.parse(localStorage.getItem('mcl-completed') || '[]');

function renderLevelSelect() {
  const grid = document.getElementById('ls-grid');
  grid.innerHTML = '';
  LEVELS.forEach((lv, i) => {
    const card = document.createElement('div');
    const isCompleted = completedLevels.includes(lv.id);
    const isLocked = i > 0 && !completedLevels.includes(LEVELS[i-1].id);
    card.className = 'ls-card' + (isLocked ? ' locked' : '') + (isCompleted ? ' completed' : '');
    card.style.setProperty('--lv-color', lv.color);

    const phaseDots = (lv.phases || []).map(ph =>
      `<span class="ls-phase-chip">${ph}</span>`
    ).join('');

    card.innerHTML = `
      <div class="ls-card-top-row">
        <span class="ls-card-level">Level ${lv.id}</span>
        <span class="ls-card-tag" style="background:${lv.tagBg};color:${lv.tagColor}">${lv.tag}</span>
      </div>
      <div class="ls-card-title">${lv.title}</div>
      <div class="ls-card-desc">${lv.desc}</div>
      <div class="ls-phases-row">
        ${phaseDots}
        ${isCompleted ? '<span class="ls-done-chip">Done</span>' : ''}
      </div>
      ${isLocked ? '<div class="ls-lock-icon">&#128274;</div>' : ''}
    `;
    if (!isLocked) card.onclick = () => startLevel(lv.id);
    grid.appendChild(card);
  });
}

function startLevel(levelId) {
  document.getElementById('level-select').classList.remove('visible');
  document.getElementById('challenge-overlay').classList.add('visible');
  document.getElementById('palette').classList.add('hidden-in-challenge');
  activeContainer = null;
  canvas = [];
  const fn = [null, renderLevel1, renderLevel2, renderLevel3,
               renderLevel4, renderLevel5, renderLevel6, renderLevel7][levelId];
  if (fn) fn();
}

function completeLevel(levelId) {
  if (!completedLevels.includes(levelId)) {
    completedLevels.push(levelId);
    localStorage.setItem('mcl-completed', JSON.stringify(completedLevels));
  }
  score += 20;
  document.getElementById('score-display').textContent = score;
  fireConfetti(80);
  updateExportBtn();
}

function backToLevels() {
  document.getElementById('challenge-overlay').classList.remove('visible');
  document.getElementById('level-select').classList.add('visible');
  document.getElementById('palette').classList.remove('hidden-in-challenge');
  renderLevelSelect();
  canvas = [];
  activeContainer = null;
}

// ─── Shared level shell builder ───────────────────────────
function buildLevelShell(levelId, bodyHTML) {
  const lv = LEVELS[levelId - 1];
  const inner = document.getElementById('challenge-inner');
  const phasePills = (lv.phases || []).map((ph, i) =>
    `<div class="lv1-phase" id="lvsh-ph-${levelId}-${i}">${i+1} — ${ph}</div>` +
    (i < lv.phases.length - 1 ? '<div class="lv1-phase-sep">›</div>' : '')
  ).join('');

  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <span class="lv1-lvbadge" style="background:${lv.tagBg};color:${lv.tagColor}">Level ${lv.id}</span>
          <span class="lv1-title-text">${lv.title}</span>
        </div>
        <div class="lv1-phases">${phasePills}</div>
      </div>
      <div class="lv1-body" id="lvsh-body-${levelId}">${bodyHTML}</div>
    </div>
  `;
}

function setShellPhase(levelId, activeIdx) {
  const lv = LEVELS[levelId - 1];
  (lv.phases || []).forEach((_, i) => {
    const el = document.getElementById(`lvsh-ph-${levelId}-${i}`);
    if (!el) return;
    el.className = 'lv1-phase' + (i === activeIdx ? ' active' : (i < activeIdx ? ' done' : ''));
  });
}
