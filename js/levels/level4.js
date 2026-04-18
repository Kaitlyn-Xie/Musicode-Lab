// ════════════════════════════════════════════════════════════
// LEVEL 4 — BINARY MUSIC
// ════════════════════════════════════════════════════════════

let lv4Phase = 1;
let lv4P1Playing = false;
let lv4P1Answered = false;
let lv4P2Playing = false;
let lv4DecodeAnswer = []; // null | 0 | 1 for each slot
let lv4P2Checked = false;
let lv4EncodePattern = [];
let lv4P3Playing = false;

const LV4_INTRO_BITS = [1, 0, 1, 1]; // Phase 1 demo
const LV4_SECRET     = [1, 0, 1, 1, 0, 1, 0, 0]; // Phase 2 target

// ─── Entry point ─────────────────────────────────────────────
function renderLevel4() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge" style="background:#E3FFE8;color:#186840">Level 4</div>
          <div class="lv1-title-text">Binary Music</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv4-ph-0">1 — Binary?</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv4-ph-1">2 — Decode</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv4-ph-2">3 — Encode</div>
        </div>
      </div>
      <div class="lv1-body" id="lv4-body"></div>
    </div>
  `;
  lv4Phase = 1;
  lv4P1Playing = false;
  lv4P1Answered = false;
  lv4P2Playing = false;
  lv4DecodeAnswer = new Array(LV4_SECRET.length).fill(null);
  lv4P2Checked = false;
  lv4EncodePattern = new Array(8).fill(0);
  lv4ShowPhase(1);
}

function lv4ShowPhase(p) {
  lv4Phase = p;
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('lv4-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i === p - 1 ? ' active' : (i < p - 1 ? ' done' : ''));
  });
  const body = document.getElementById('lv4-body');
  if (!body) return;
  if (p === 1) lv4RenderPhase1(body);
  else if (p === 2) lv4RenderPhase2(body);
  else if (p === 3) lv4RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — What is binary?
// ══════════════════════════════════════════════════════
function lv4RenderPhase1(body) {
  lv4P1Playing = false;
  lv4P1Answered = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">1 and 0 — Clap and Rest</div>
      <p class="lv1-activity-sub">
        Computers store everything using only two symbols: <strong>1</strong> and <strong>0</strong>.
        In binary music: <strong>1 = clap</strong>, <strong>0 = rest (silence)</strong>.
      </p>

      <div class="lv4-legend">
        <div class="lv4-legend-item">
          <div class="lv4-bit-box one">${icon('volume', 14)}</div>
          <div class="lv4-legend-label"><strong>1</strong> = Clap</div>
        </div>
        <div class="lv4-legend-sep">·</div>
        <div class="lv4-legend-item">
          <div class="lv4-bit-box zero">—</div>
          <div class="lv4-legend-label"><strong>0</strong> = Rest</div>
        </div>
      </div>

      <div class="lv1-concept" style="margin-top:8px">
        <div class="lv1-concept-label">Demo pattern: <code>1 0 1 1</code></div>
        <p>Each bit is one beat. Hit <strong>Play</strong> to hear it — watch which beats are claps and which are silent.</p>
      </div>

      <div class="lv4-bit-row" id="lv4-intro-row">
        ${LV4_INTRO_BITS.map((bit, i) => `
          <div class="lv4-intro-bit" id="lv4-ibit-${i}">
            <div class="lv4-bit-num">${bit}</div>
            <div class="lv4-bit-icon">${bit === 1 ? icon('volume', 16) : '—'}</div>
            <div class="lv4-bit-label">${bit === 1 ? 'clap' : 'rest'}</div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions" style="margin-top:4px">
        <button class="lv1-btn secondary" id="lv4-p1-play" onclick="lv4P1Play()">
          ${icon('play', 12)} Play pattern
        </button>
      </div>

      <div class="lv4-p1-question" id="lv4-p1-question" style="display:none">
        <div class="lv1-activity-heading" style="font-size:14px;margin-bottom:10px">
          How many <strong>claps</strong> are in <code>1 0 1 1</code>?
        </div>
        <div class="lv3-count-opts">
          ${[1, 2, 3, 4].map(n =>
            `<button class="lv3-count-opt" onclick="lv4P1Answer(${n})">${n}</button>`
          ).join('')}
        </div>
        <div id="lv4-p1-fb" class="lv1-feedback" style="display:none"></div>
      </div>

      <div class="lv1-success-concept" id="lv4-concept-reveal">
        <div class="lv1-success-concept-label">Binary = the Language of Computers</div>
        <p>Every file, image, and sound on a computer is stored as a sequence of 1s and 0s.
           In this level, 1s and 0s become a <strong>rhythm</strong> — a beat pattern.</p>
        <p>Up next: you'll hear a mystery pattern and figure out its binary code!</p>
      </div>

      <div class="lv1-actions" id="lv4-p1-next-row" style="display:none">
        <button class="lv1-btn primary" onclick="lv4ShowPhase(2)">Next: Decode the Beat →</button>
      </div>
    </div>
  `;
}

async function lv4P1Play() {
  if (lv4P1Playing) return;
  lv4P1Playing = true;
  const btn = document.getElementById('lv4-p1-play');
  if (btn) btn.disabled = true;
  await initTone();
  for (let i = 0; i < LV4_INTRO_BITS.length; i++) {
    document.querySelectorAll('.lv4-intro-bit.active').forEach(el => el.classList.remove('active'));
    const cell = document.getElementById('lv4-ibit-' + i);
    if (cell) cell.classList.add('active');
    await playNote(LV4_INTRO_BITS[i] === 1 ? 'clap' : 'rest', 1);
  }
  document.querySelectorAll('.lv4-intro-bit.active').forEach(el => el.classList.remove('active'));
  if (btn) btn.disabled = false;
  lv4P1Playing = false;
  document.getElementById('lv4-p1-question').style.display = 'block';
}

function lv4P1Answer(n) {
  if (lv4P1Answered) return;
  const correct = LV4_INTRO_BITS.filter(b => b === 1).length; // 3
  const fb = document.getElementById('lv4-p1-fb');
  const btns = document.querySelectorAll('#lv4-p1-question .lv3-count-opt');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '0.45'; });
  const picked = [...btns].find(b => +b.textContent === n);
  if (n === correct) {
    if (picked) { picked.style.opacity = '1'; picked.classList.add('correct'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback success';
      fb.textContent = `Correct! 1 0 1 1 has three 1s, so three claps.`;
    }
    lv4P1Answered = true;
    document.getElementById('lv4-concept-reveal').classList.add('visible');
    document.getElementById('lv4-p1-next-row').style.display = 'flex';
  } else {
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
    if (picked) { picked.disabled = true; picked.style.opacity = '0.35'; picked.classList.add('wrong'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback error';
      fb.textContent = 'Count the 1s in 1 0 1 1 — each 1 is one clap.';
    }
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Decode the Beat
// ══════════════════════════════════════════════════════
function lv4RenderPhase2(body) {
  lv4P2Playing = false;
  lv4P2Checked = false;
  lv4DecodeAnswer = new Array(LV4_SECRET.length).fill(null);

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Decode the Mystery Pattern</div>
      <p class="lv1-activity-sub">
        Below is an 8-beat mystery rhythm. Hit <strong>Play</strong> to hear it as many times as you need,
        then click each beat to mark it as <strong>1 (clap)</strong> or <strong>0 (rest)</strong>.
      </p>

      <div class="lv4-decode-grid" id="lv4-decode-grid"></div>

      <div class="lv4-decode-hint">
        Click a beat to toggle: <strong>?</strong> → <strong>1</strong> (clap) → <strong>0</strong> (rest) → <strong>?</strong>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" id="lv4-p2-play" onclick="lv4P2Play()">
          ${icon('play', 12)} Play again
        </button>
        <button class="lv1-btn secondary" onclick="lv4P2Reset()">Reset</button>
        <button class="lv1-btn secondary" onclick="lv4P2Check()">Check</button>
        <button class="lv1-btn primary" id="lv4-p2-next" onclick="lv4ShowPhase(3)" style="display:none">
          Next: Encode your own →
        </button>
      </div>
      <div id="lv4-p2-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;

  lv4P2RenderGrid();
  // Auto-play once to start
  lv4P2Play();
}

function lv4P2RenderGrid() {
  const grid = document.getElementById('lv4-decode-grid');
  if (!grid) return;
  grid.innerHTML = '';
  LV4_SECRET.forEach((_, i) => {
    const val = lv4DecodeAnswer[i]; // null | 0 | 1
    const slot = document.createElement('div');
    slot.className = 'lv4-decode-slot' + (val === 1 ? ' clap' : val === 0 ? ' rest' : '');
    slot.id = 'lv4-dslot-' + i;

    const num = document.createElement('div');
    num.className = 'lv4-ds-num';
    num.textContent = val === null ? '?' : val;
    slot.appendChild(num);

    const ic = document.createElement('div');
    ic.className = 'lv4-ds-icon';
    ic.innerHTML = val === 1 ? icon('volume', 15) : val === 0 ? '—' : '';
    slot.appendChild(ic);

    const lbl = document.createElement('div');
    lbl.className = 'lv4-ds-label';
    lbl.textContent = val === 1 ? 'clap' : val === 0 ? 'rest' : 'beat ' + (i + 1);
    slot.appendChild(lbl);

    if (!lv4P2Checked) {
      slot.onclick = () => lv4P2Toggle(i);
    }
    grid.appendChild(slot);
  });
}

function lv4P2Toggle(i) {
  const cur = lv4DecodeAnswer[i];
  lv4DecodeAnswer[i] = cur === null ? 1 : cur === 1 ? 0 : null;
  lv4P2RenderGrid();
}

function lv4P2Reset() {
  lv4P2Checked = false;
  lv4DecodeAnswer = new Array(LV4_SECRET.length).fill(null);
  lv4P2RenderGrid();
  const fb = document.getElementById('lv4-p2-fb');
  if (fb) fb.style.display = 'none';
  const next = document.getElementById('lv4-p2-next');
  if (next) next.style.display = 'none';
}

async function lv4P2Play() {
  if (lv4P2Playing) return;
  lv4P2Playing = true;
  const btn = document.getElementById('lv4-p2-play');
  if (btn) btn.disabled = true;
  await initTone();
  for (let i = 0; i < LV4_SECRET.length; i++) {
    // Highlight current slot
    document.querySelectorAll('.lv4-decode-slot').forEach(el => el.classList.remove('playing'));
    const slot = document.getElementById('lv4-dslot-' + i);
    if (slot) slot.classList.add('playing');
    await playNote(LV4_SECRET[i] === 1 ? 'clap' : 'rest', 1);
  }
  document.querySelectorAll('.lv4-decode-slot').forEach(el => el.classList.remove('playing'));
  if (btn) btn.disabled = false;
  lv4P2Playing = false;
}

function lv4P2Check() {
  const fb = document.getElementById('lv4-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';

  const allSet = lv4DecodeAnswer.every(v => v !== null);
  if (!allSet) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Set all 8 beats first — click each "?" to mark it as clap (1) or rest (0).';
    return;
  }

  const wrong = LV4_SECRET.filter((bit, i) => lv4DecodeAnswer[i] !== bit).length;
  lv4P2Checked = true;

  // Colour the grid based on right/wrong
  const grid = document.getElementById('lv4-decode-grid');
  if (grid) {
    LV4_SECRET.forEach((bit, i) => {
      const slot = document.getElementById('lv4-dslot-' + i);
      if (!slot) return;
      slot.onclick = null;
      if (lv4DecodeAnswer[i] === bit) {
        slot.classList.add('decode-correct');
      } else {
        slot.classList.add('decode-wrong');
        // Show correct value
        const num = slot.querySelector('.lv4-ds-num');
        if (num) num.textContent = bit;
        const lbl = slot.querySelector('.lv4-ds-label');
        if (lbl) lbl.textContent = bit === 1 ? 'clap' : 'rest';
        const ic = slot.querySelector('.lv4-ds-icon');
        if (ic) ic.innerHTML = bit === 1 ? icon('volume', 15) : '—';
      }
    });
  }

  if (wrong === 0) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = `Perfect decode! The pattern is <code>${LV4_SECRET.join(' ')}</code> — ${LV4_SECRET.filter(b=>b===1).length} claps, ${LV4_SECRET.filter(b=>b===0).length} rests.`;
    document.getElementById('lv4-p2-next').style.display = 'inline-flex';
  } else if (wrong <= 2) {
    fb.className = 'lv1-feedback error';
    fb.innerHTML = `${wrong} beat${wrong > 1 ? 's' : ''} off — corrected above in red. Hit Reset to try again!`;
    lv4P2Checked = false;
    setTimeout(() => {
      lv4P2Reset();
    }, 2500);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = `${wrong} beats off. Try listening again — pay attention to which beats are silent.`;
    lv4P2Checked = false;
    setTimeout(() => lv4P2Reset(), 2500);
  }
}

// ══════════════════════════════════════════════════════
// PHASE 3 — Encode Your Own
// ══════════════════════════════════════════════════════
function lv4RenderPhase3(body) {
  lv4P3Playing = false;
  lv4EncodePattern = new Array(8).fill(0);

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Encode Your Own Beat</div>
        <p>
          Now you're the composer. Click each beat to toggle it between
          <strong>1 (clap)</strong> and <strong>0 (rest)</strong> — build any rhythm you like!
        </p>
      </div>

      <div class="lv4-encode-grid" id="lv4-encode-grid"></div>

      <div class="lv4-binary-display" id="lv4-binary-display">
        <span class="lv4-bd-label">Binary:</span>
        <span class="lv4-bd-bits" id="lv4-bd-bits">0 0 0 0 0 0 0 0</span>
        <span class="lv4-bd-count" id="lv4-bd-count">0 claps</span>
      </div>

      <div class="lv4-py-hint">
        <span>Python:</span>
        <code id="lv4-py-code">rhythm = [0, 0, 0, 0, 0, 0, 0, 0]</code>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv4P3Play()">
          ${icon('play', 12)} Play my rhythm
        </button>
        <button class="lv1-btn secondary" onclick="lv4P3Clear()">Clear</button>
        <button class="lv1-btn success" onclick="lv4Complete()">Complete Level 4!</button>
      </div>
    </div>
  `;

  lv4P3RenderGrid();
}

function lv4P3RenderGrid() {
  const grid = document.getElementById('lv4-encode-grid');
  if (!grid) return;
  grid.innerHTML = '';
  lv4EncodePattern.forEach((bit, i) => {
    const slot = document.createElement('div');
    slot.className = 'lv4-encode-slot' + (bit === 1 ? ' clap' : ' rest');
    slot.id = 'lv4-eslot-' + i;
    slot.onclick = () => lv4P3Toggle(i);

    const num = document.createElement('div');
    num.className = 'lv4-ds-num';
    num.textContent = bit;
    slot.appendChild(num);

    const ic = document.createElement('div');
    ic.className = 'lv4-ds-icon';
    ic.innerHTML = bit === 1 ? icon('volume', 15) : '—';
    slot.appendChild(ic);

    const lbl = document.createElement('div');
    lbl.className = 'lv4-ds-label';
    lbl.textContent = bit === 1 ? 'clap' : 'rest';
    slot.appendChild(lbl);

    grid.appendChild(slot);
  });
  lv4P3UpdateDisplay();
}

function lv4P3Toggle(i) {
  lv4EncodePattern[i] = lv4EncodePattern[i] === 1 ? 0 : 1;
  lv4P3RenderGrid();
}

function lv4P3UpdateDisplay() {
  const bitsEl = document.getElementById('lv4-bd-bits');
  const countEl = document.getElementById('lv4-bd-count');
  const pyEl = document.getElementById('lv4-py-code');
  if (bitsEl) bitsEl.textContent = lv4EncodePattern.join(' ');
  if (countEl) {
    const ones = lv4EncodePattern.filter(b => b === 1).length;
    countEl.textContent = ones + (ones === 1 ? ' clap' : ' claps');
  }
  if (pyEl) pyEl.textContent = 'rhythm = [' + lv4EncodePattern.join(', ') + ']';
}

function lv4P3Clear() {
  lv4EncodePattern = new Array(8).fill(0);
  lv4P3RenderGrid();
}

async function lv4P3Play() {
  if (lv4P3Playing) return;
  if (!lv4EncodePattern.some(b => b === 1)) return; // nothing to play
  lv4P3Playing = true;
  await initTone();
  for (let i = 0; i < lv4EncodePattern.length; i++) {
    document.querySelectorAll('.lv4-encode-slot.playing').forEach(el => el.classList.remove('playing'));
    const slot = document.getElementById('lv4-eslot-' + i);
    if (slot) slot.classList.add('playing');
    await playNote(lv4EncodePattern[i] === 1 ? 'clap' : 'rest', 1);
  }
  document.querySelectorAll('.lv4-encode-slot.playing').forEach(el => el.classList.remove('playing'));
  lv4P3Playing = false;
}

function lv4Complete() {
  completeLevel(4);
  backToLevels();
}
