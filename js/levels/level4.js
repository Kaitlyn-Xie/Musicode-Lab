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
let lv4P3Step = 0;
let lv4ReadOpened = [false, false, false];

const LV4_INTRO_BITS = [1, 0, 1, 1]; // Phase 1 demo
const LV4_SECRET     = [1, 0, 1, 1, 0, 1, 0, 0]; // Phase 2 target

// "If You're Happy and You Know It" — opening phrase (key of F, 1=F4)
// 简谱: 5 5 | 1 1 1 1 1 7 1 | 2  (10 notes)
// "If you're hap-py and you know it clap your hands"
const LV4_IYHA        = ['C4','C4','F4','F4','F4','F4','F4','E4','F4','G4'];
const LV4_IYHA_PALETTE = ['C4','D4','E4','F4','G4'];
let lv4IYHASeq = [];
// Clap pattern: melody = 0, clap beats = 1 (two claps on "clap your hands")
const LV4_CLAP_PATTERN = [0,0,0,0,0,0,0,0,1,1];
// Own rhythm
let lv4OwnPattern = new Array(8).fill(0);

const LV4_CT_CONCEPTS = [
  {
    title: 'Encoding',
    icon: 'blocks',
    body: '<strong>Encoding</strong> is converting information into a format a computer can store and process. Notes become numbers, rhythms become 0s and 1s — all data starts as a human idea encoded into machine format.'
  },
  {
    title: 'Binary',
    icon: 'algorithm',
    body: 'Computers only understand <strong>0 and 1</strong> — but from two values alone they can represent every note, image, and word. C4 might be 60, E4 might be 64 — each stored as a sequence of bits.'
  },
  {
    title: 'Data Representation',
    icon: 'variable',
    body: 'The same note can be stored many ways: as text <code>"C4"</code>, as a number <code>60</code>, or as binary <code>0111100</code>. The note itself hasn\'t changed — only the <strong>representation</strong> has.'
  }
];

// ─── Entry point ─────────────────────────────────────────────
function renderLevel4() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge lv-4">Level 4</div>
          <div class="lv1-title-text">Binary</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv4-ph-0">1 — Binary?</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv4-ph-1">2 — Decode</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv4-ph-2">3 — How Computers Think</div>
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
          Next: How Computers Think →
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
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv4RenderPhase3(body) {
  lv4P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv4-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv4-p3-main"></div>
      </div>
    </div>
  `;
  lv4P3Goto(0);
}

function lv4P3UpdateNav(step) {
  const labels = ['Concepts','Listen','Build','Discover','Create!'];
  const nav = document.getElementById('lv4-p3-nav');
  if (!nav) return;
  nav.innerHTML = '';
  labels.forEach((label, i) => {
    const dot = document.createElement('div');
    dot.className = 'lv1-p3-dot' + (i === step ? ' active' : (i < step ? ' done' : ''));
    dot.innerHTML = i < step ? icon('check', 11) : (i + 1);
    nav.appendChild(dot);
    const lbl = document.createElement('div');
    lbl.className = 'lv1-p3-nav-label' + (i === step ? ' active' : '');
    lbl.textContent = label;
    nav.appendChild(lbl);
    if (i < labels.length - 1) {
      const sep = document.createElement('div');
      sep.className = 'lv1-p3-nav-sep';
      sep.textContent = '›';
      nav.appendChild(sep);
    }
  });
}

function lv4P3Goto(step) {
  lv4P3Step = step;
  lv4P3UpdateNav(step);
  const main = document.getElementById('lv4-p3-main');
  if (!main) return;
  if (step === 0) lv4P3Read(main);
  else if (step === 1) lv4IYHAListen(main);
  else if (step === 2) lv4IYHABuild(main);
  else if (step === 3) lv4IYHADiscover(main);
  else if (step === 4) lv4P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv4P3Read(main) {
  lv4ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just decoded and encoded binary rhythms. Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${LV4_CT_CONCEPTS.map((c, i) => `
        <div class="lv1-read-block" id="lv4-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv4ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv4-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv4-read-next" onclick="lv4P3Goto(1)" style="display:none">Next: Build the Song →</button>
      </div>
    </div>
  `;
}

function lv4ReadToggle(idx) {
  lv4ReadOpened[idx] = !lv4ReadOpened[idx];
  const btn = document.querySelector('#lv4-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv4-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv4ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv4ReadOpened[idx]);
  if (lv4ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv4-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Step 1 — Listen: "If You're Happy and You Know It" */
function lv4IYHAListen(main) {
  const clapRow = LV4_CLAP_PATTERN.map((b, i) => `
    <div class="lv4-intro-bit" style="cursor:default">
      <div class="lv4-bit-num">${b}</div>
      <div class="lv4-bit-icon" style="font-size:18px">${b === 1 ? '👏' : '—'}</div>
      <div class="lv4-bit-label">${b === 1 ? 'clap!' : 'rest'}</div>
    </div>`).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">👏 If You're Happy and You Know It!</div>
        <p>This song is <strong>literally about clapping and not clapping</strong> — which is exactly what binary is!
          <strong>1 = CLAP 👏</strong>, <strong>0 = rest (no clap)</strong>. The chorus ends with two big claps — that's <code>…0 0 0 0 0 0 0 0 <strong>1 1</strong></code> in binary!</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">🎶 If You're Happy and You Know It</div>
        <div class="lv1-song-card-lyrics">"If you're happy and you know it — <strong>CLAP CLAP</strong> 👏👏"</div>
        <div class="lv1-song-card-notes" style="margin-top:8px">
          ${LV4_IYHA.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
          <span class="lv1-song-note-pill" style="background:rgba(212,160,32,0.2);border-color:#C49020aa;font-size:15px">👏</span>
          <span class="lv1-song-note-pill" style="background:rgba(212,160,32,0.2);border-color:#C49020aa;font-size:15px">👏</span>
        </div>
        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv4IYHAPlayTarget()">
          ${icon('play',13)} Listen to the phrase
        </button>
        <div id="lv4-iyha-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-concept" style="border-left-color:#C49020;background:rgba(212,160,32,0.07)">
        <div class="lv1-concept-label" style="color:#B87800">The clap pattern in binary</div>
        <p>One line of the song = 10 beats. The melody plays for 8 beats, then <strong>CLAP CLAP</strong> on beats 9 & 10:</p>
        <div class="lv4-bit-row" style="margin-top:8px">${clapRow}</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv4P3Goto(2)">Next: Build the melody →</button>
      </div>
    </div>
  `;
}

async function lv4IYHAPlayTarget() {
  const ind = document.getElementById('lv4-iyha-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV4_IYHA) { await playNote(n, 0.6); }
  await playNote('clap', 0.8);
  await playNote('clap', 0.8);
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Build the melody */
function lv4IYHABuild(main) {
  lv4IYHASeq = [];
  const target = LV4_IYHA;
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Melody</div>
      <p class="lv1-activity-sub">
        Tap the note tiles to spell out <strong>"If you're happy and you know it"</strong> — 10 notes.
        Use the hint if you get stuck!
      </p>
      <div class="lv1-tw-slots" id="lv4-iyha-slots"></div>
      <div class="lv1-tw-palette">
        ${LV4_IYHA_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv4IYHATap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px" onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>`).join('')}
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv4IYHAClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv4IYHAPlaySeq()">${icon('play',12)} Play</button>
        <button class="lv1-btn secondary" onclick="lv4IYHAHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv4IYHACheck()">Check</button>
      </div>
      <div id="lv4-iyha-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv4-iyha-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> "If you're hap-py and you know it" — starts C C, then F F F F F, then down to E, up to F, then G.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">C4 C4 F4 F4 F4 F4 F4 E4 F4 G4</span>
      </div>
    </div>
  `;
  lv4IYHARenderSlots();
}

function lv4IYHARenderSlots() {
  const container = document.getElementById('lv4-iyha-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < LV4_IYHA.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv4IYHASeq.length ? ' filled' : '');
    if (i < lv4IYHASeq.length) {
      slot.textContent = lv4IYHASeq[i];
      slot.onclick = () => { lv4IYHASeq.splice(i, 1); lv4IYHARenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv4IYHATap(note) {
  if (lv4IYHASeq.length >= LV4_IYHA.length) return;
  lv4IYHASeq.push(note);
  lv4IYHARenderSlots();
}

function lv4IYHAClear() {
  lv4IYHASeq = [];
  lv4IYHARenderSlots();
  const fb = document.getElementById('lv4-iyha-fb');
  if (fb) fb.style.display = 'none';
}

async function lv4IYHAPlaySeq() {
  if (!lv4IYHASeq.length) return;
  await initTone();
  for (const n of lv4IYHASeq) { await playNote(n, 0.6); }
}

function lv4IYHAHint() {
  const h = document.getElementById('lv4-iyha-hint');
  if (h) h.classList.toggle('visible');
}

async function lv4IYHACheck() {
  const fb = document.getElementById('lv4-iyha-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv4IYHASeq.length < LV4_IYHA.length) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need ${LV4_IYHA.length} notes — you have ${lv4IYHASeq.length} so far.`;
    return;
  }
  const correct = lv4IYHASeq.every((n, i) => n === LV4_IYHA[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Perfect! Playing with the claps…';
    await initTone();
    for (const n of LV4_IYHA) { await playNote(n, 0.6); }
    await playNote('clap', 0.8);
    await playNote('clap', 0.8);
    fb.textContent = '👏👏 "If you\'re happy and you know it — CLAP CLAP!" Now let\'s see the binary connection…';
    setTimeout(() => lv4P3Goto(3), 1600);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — try playing your sequence and compare to the Listen step!';
  }
}

/* Step 3 — Discover: clap = 1, rest = 0 */
async function lv4IYHADiscover(main) {
  const discRow = LV4_CLAP_PATTERN.map((b, i) => `
    <div class="lv4-intro-bit" id="lv4-disc-bit-${i}" style="cursor:default">
      <div class="lv4-bit-num">${b}</div>
      <div class="lv4-bit-icon" style="font-size:16px">${b === 1 ? '👏' : '—'}</div>
      <div class="lv4-bit-label" style="font-size:9px">${b === 1 ? 'CLAP' : 'rest'}</div>
    </div>`).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">👏 Clapping IS binary encoding!</div>
        <p>The mystery pattern you decoded in Phase 2 (<code>${LV4_SECRET.join(' ')}</code>) was a <strong>clap rhythm</strong> just like this song! Computers store every note, beat, and sound using the exact same 0s and 1s.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(212,160,32,0.08),rgba(46,128,208,0.06))">
        <div class="lv1-song-card-title">One line of the song = 10 bits</div>
        <div class="lv4-bit-row" style="margin-top:8px" id="lv4-disc-row">${discRow}</div>
        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv4IYHADiscoverPlay()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(212,160,32,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#B87800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Encoding</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Clap / no-clap → 1 / 0</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Binary</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Two values = infinite patterns</div>
          </div>
          <div style="background:rgba(112,80,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#7050D0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Data</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Sound, music, images — all bits</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv4P3Goto(4)">Next: Make your own pattern →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const n of LV4_IYHA) { await playNote(n, 0.6); }
  await playNote('clap', 0.8); await playNote('clap', 0.8);
}

async function lv4IYHADiscoverPlay() {
  await initTone();
  // play melody beats (highlighted)
  for (let i = 0; i < LV4_CLAP_PATTERN.length; i++) {
    document.querySelectorAll('.lv4-intro-bit').forEach(el => el.classList.remove('active'));
    const bit = document.getElementById('lv4-disc-bit-' + i);
    if (bit) bit.classList.add('active');
    if (i < LV4_IYHA.length) {
      await playNote(LV4_IYHA[i], 0.6);
    } else {
      await playNote('clap', 0.8);
    }
  }
  document.querySelectorAll('.lv4-intro-bit').forEach(el => el.classList.remove('active'));
}

/* Step 4 — Create! — design your own 8-bit clap pattern */
function lv4P3WriteOwn(main) {
  lv4OwnPattern = new Array(8).fill(0);
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-activity-heading">Make Your Own Clap Pattern</div>
      <p class="lv1-activity-sub">
        Click each beat to toggle between <strong>1 (clap 👏)</strong> and <strong>0 (rest)</strong>.
        Design your own 8-bit rhythm, then play it!
      </p>
      <div class="lv4-bit-row" id="lv4-own-row"></div>
      <div class="lv1-concept" style="padding:10px 14px">
        <span style="font-size:12px;color:var(--text-muted)">Your binary code: </span>
        <code id="lv4-own-code" style="font-size:13px;color:var(--text);font-weight:700">0 0 0 0 0 0 0 0</code>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv4OwnPlay()">${icon('play',12)} Play my pattern</button>
        <button class="lv1-btn primary" onclick="lv4Complete()">Complete Level 4!</button>
      </div>
    </div>
  `;
  lv4OwnRenderRow();
}

function lv4OwnRenderRow() {
  const row = document.getElementById('lv4-own-row');
  if (!row) return;
  row.innerHTML = '';
  lv4OwnPattern.forEach((b, i) => {
    const bit = document.createElement('div');
    bit.className = 'lv4-intro-bit' + (b === 1 ? ' one' : ' zero');
    bit.style.cursor = 'pointer';
    bit.innerHTML = `
      <div class="lv4-bit-num">${b}</div>
      <div class="lv4-bit-icon" style="font-size:18px">${b === 1 ? '👏' : '—'}</div>
      <div class="lv4-bit-label">${b === 1 ? 'clap' : 'rest'}</div>`;
    bit.onclick = () => {
      lv4OwnPattern[i] = lv4OwnPattern[i] === 0 ? 1 : 0;
      lv4OwnRenderRow();
    };
    row.appendChild(bit);
  });
  const code = document.getElementById('lv4-own-code');
  if (code) code.textContent = lv4OwnPattern.join(' ');
}

async function lv4OwnPlay() {
  await initTone();
  for (let i = 0; i < lv4OwnPattern.length; i++) {
    document.querySelectorAll('#lv4-own-row .lv4-intro-bit').forEach(el => el.classList.remove('active'));
    const bits = document.querySelectorAll('#lv4-own-row .lv4-intro-bit');
    if (bits[i]) bits[i].classList.add('active');
    await playNote(lv4OwnPattern[i] === 1 ? 'clap' : 'rest', 0.7);
  }
  document.querySelectorAll('#lv4-own-row .lv4-intro-bit').forEach(el => el.classList.remove('active'));
}

function lv4Complete() {
  completeLevel(4);
  backToLevels();
}
