// ════════════════════════════════════════════════════════════
// LEVEL 2 — VARIABLES & MUSIC PHRASES  (Happy Birthday)
// ════════════════════════════════════════════════════════════

let lv2Phase = 1;
let lv2P2Blocks = [];
let lv2OwnNotes = ['C4', 'E4', 'G4'];
let lv2P3Step = 0;
let lv2ReadOpened = [false, false, false];
// User-typed phrase notes (starts empty; user fills them in Phase 1)
let lv2UserPhrases = { p1: [], p2: [], p3: [], p4: [] };

const LV2_NOTE_OPTIONS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
const LV2_PITCH_PCT = { 'C4': 12, 'D4': 25, 'E4': 38, 'F4': 50, 'G4': 63, 'A4': 75 };

// Happy Birthday: four phrases, each plays ONCE
const LV2_PHRASE1 = ['C4','C4','D4','C4','F4','E4'];   // Happy birthday to you
const LV2_PHRASE2 = ['C4','C4','D4','C4','G4','F4'];   // Happy birthday to you
const LV2_PHRASE3 = ['C4','C4','A4','F4','E4','D4'];   // Happy birthday, dear…
const LV2_PHRASE4 = ['F4','F4','E4','C4','D4','C4'];   // Happy birthday to you!
const LV2_PHRASES    = { p1: LV2_PHRASE1, p2: LV2_PHRASE2, p3: LV2_PHRASE3, p4: LV2_PHRASE4 };
const LV2_PHRASE_LABELS = { p1: 'phrase1', p2: 'phrase2', p3: 'phrase3', p4: 'phrase4' };
const LV2_PHRASE_NAMES  = { p1: 'Happy birthday to you', p2: 'Happy birthday to you', p3: 'Happy birthday, dear…', p4: 'Happy birthday to you!' };
const LV2_PHRASE_COLORS = { p1: '#2E80D0', p2: '#7050D0', p3: '#D06030', p4: '#20A060' };
const LV2_PHRASE_BGALPHA = { p1: 'rgba(46,128,208,0.14)', p2: 'rgba(112,80,208,0.14)', p3: 'rgba(208,96,48,0.14)', p4: 'rgba(32,160,96,0.14)' };
// target: play each phrase once in order → 4 blocks
const LV2_HCB_TARGET = ['p1','p2','p3','p4'];

// ─── Entry point ─────────────────────────────────────────────
function renderLevel2() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge lv-2">Level 2</div>
          <div class="lv1-title-text">Variables</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv2-ph-0">1 — Phrases</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv2-ph-1">2 — Build Song</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv2-ph-2">3 — How Computers Think</div>
        </div>
      </div>
      <div class="lv1-body" id="lv2-body"></div>
    </div>
  `;
  lv2Phase = 1;
  lv2ShowPhase(1);
}

function lv2ShowPhase(p) {
  lv2Phase = p;
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('lv2-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i === p - 1 ? ' active' : (i < p - 1 ? ' done' : ''));
  });
  const body = document.getElementById('lv2-body');
  if (!body) return;
  if (p === 1) lv2RenderPhase1(body);
  else if (p === 2) lv2RenderPhase2(body);
  else if (p === 3) lv2RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — Define Your Four Variables
// ══════════════════════════════════════════════════════
function lv2RenderPhase1(body) {
  // Reset user phrases
  lv2UserPhrases = { p1: [], p2: [], p3: [], p4: [] };

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Set Up Your Four Variables</div>
      <p class="lv1-activity-sub">
        <em>Happy Birthday</em> is built from four musical lines. We'll store each one as a
        <strong>variable</strong> — a named box that holds notes. Type the notes into each box
        (space-separated). We've included hints!
      </p>
      <div style="display:flex;flex-direction:column;gap:10px" id="lv2-p1-cards"></div>
      <div class="lv1-concept" style="border-left-color:#7050D0;margin-top:4px">
        <div class="lv1-concept-label">What is a Variable?</div>
        <p>Each phrase has a <strong>name</strong> (like <code>phrase1</code>) and a <strong>value</strong>
        (the list of notes). Write <code>play(phrase1)</code> and the computer plays all those notes
        automatically. Change the notes once — every use updates!</p>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv2-p1-next" onclick="lv2ShowPhase(2)" disabled style="opacity:0.45;cursor:not-allowed">
          Build the song! →
        </button>
        <span id="lv2-p1-hint" style="font-size:12px;color:var(--text-muted)">Fill all 4 phrases to continue</span>
      </div>
    </div>
  `;
  lv2P1RenderCards();
}

function lv2P1RenderCards() {
  const container = document.getElementById('lv2-p1-cards');
  if (!container) return;
  container.innerHTML = '';

  const hints = {
    p1: 'C4 C4 D4 C4 F4 E4',
    p2: 'C4 C4 D4 C4 G4 F4',
    p3: 'C4 C4 A4 F4 E4 D4',
    p4: 'F4 F4 E4 C4 D4 C4',
  };

  ['p1','p2','p3','p4'].forEach(k => {
    const col  = LV2_PHRASE_COLORS[k];
    const bg   = LV2_PHRASE_BGALPHA[k];
    const lbl  = LV2_PHRASE_LABELS[k];
    const nm   = LV2_PHRASE_NAMES[k];
    const hint = hints[k];

    const card = document.createElement('div');
    card.className = 'lv2-var-setup-card';
    card.style.borderLeftColor = col;
    card.id = 'lv2-p1-card-' + k;

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <span style="background:${col};color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;font-family:'JetBrains Mono',monospace">${lbl}</span>
        <span style="font-size:12px;color:var(--text-muted);font-style:italic">"${nm}"</span>
        <span id="lv2-p1-status-${k}" style="margin-left:auto;font-size:11px;font-weight:700;color:var(--text-muted)">empty</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-size:12px;font-weight:700;color:${col};font-family:'JetBrains Mono',monospace;white-space:nowrap">${lbl} =</span>
        <input
          id="lv2-p1-input-${k}"
          class="lv2-var-notes-input"
          placeholder="type notes here…"
          autocomplete="off" spellcheck="false"
          oninput="lv2P1OnInput('${k}')"
          style="border-color:${col}55;flex:1;min-width:180px"
        />
        <button class="lv1-btn secondary" style="font-size:11px;padding:5px 10px;white-space:nowrap"
          onclick="lv2P1HearPhrase('${k}')">${icon('play',10)} Hear it</button>
      </div>
      <div class="lv2-p1-hint-row" style="border-color:${col}33">
        <span style="font-size:10px;font-weight:800;color:${col};text-transform:uppercase;letter-spacing:.05em;margin-right:4px">Hint:</span>
        ${hint.split(' ').map(n =>
          `<span class="lv2-p1-hint-pill" style="background:${bg};border-color:${col}55;cursor:pointer"
            onclick="lv2P1ClickHint('${k}','${n}')">${n}</span>`
        ).join('')}
        <span style="font-size:10px;color:var(--text-muted);margin-left:4px">(tap a note to add it)</span>
      </div>
      <div id="lv2-p1-pills-${k}" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;min-height:22px"></div>
      <div id="lv2-p1-err-${k}" style="display:none;font-size:11px;color:#c04040;margin-top:2px"></div>
    `;
    container.appendChild(card);
  });
}

// Clicking a hint pill appends that note to the input
function lv2P1ClickHint(k, note) {
  const inp = document.getElementById('lv2-p1-input-' + k);
  if (!inp) return;
  const cur = inp.value.trimEnd();
  inp.value = cur ? cur + ' ' + note : note;
  inp.focus();
  lv2P1OnInput(k);
}

function lv2P1OnInput(k) {
  const inp = document.getElementById('lv2-p1-input-' + k);
  if (!inp) return;
  const raw = inp.value.trim();
  const parts = raw ? raw.split(/\s+/) : [];
  const valid = parts.filter(n => isValidNote(n));
  const invalid = parts.filter(n => n && !isValidNote(n));

  // Update stored phrase
  lv2UserPhrases[k] = valid;

  // Update pills
  const col = LV2_PHRASE_COLORS[k];
  const bg  = LV2_PHRASE_BGALPHA[k];
  const pillsEl = document.getElementById('lv2-p1-pills-' + k);
  if (pillsEl) {
    pillsEl.innerHTML = valid.map(n =>
      `<span class="lv1-song-note-pill" style="background:${bg};border-color:${col}55">${n}</span>`
    ).join('');
  }

  // Update status label
  const statusEl = document.getElementById('lv2-p1-status-' + k);
  if (statusEl) {
    if (valid.length === 0) {
      statusEl.textContent = 'empty';
      statusEl.style.color = 'var(--text-muted)';
    } else {
      statusEl.textContent = `✓ ${valid.length} note${valid.length>1?'s':''}`;
      statusEl.style.color = col;
    }
  }

  // Show error for unrecognised notes
  const errEl = document.getElementById('lv2-p1-err-' + k);
  if (errEl) {
    if (invalid.length) {
      errEl.textContent = `Unknown note${invalid.length>1?'s':''}: ${invalid.join(', ')} — use C4, D4, E4, F4, G4, A4, B4 (or other octaves)`;
      errEl.style.display = 'block';
    } else {
      errEl.style.display = 'none';
    }
  }

  // Highlight card border
  const card = document.getElementById('lv2-p1-card-' + k);
  if (card) card.style.borderLeftWidth = valid.length ? '5px' : '4px';

  // Enable/disable next button
  lv2P1UpdateNextBtn();
}

function lv2P1UpdateNextBtn() {
  const allFilled = ['p1','p2','p3','p4'].every(k => lv2UserPhrases[k].length > 0);
  const btn  = document.getElementById('lv2-p1-next');
  const hint = document.getElementById('lv2-p1-hint');
  if (btn) {
    btn.disabled = !allFilled;
    btn.style.opacity = allFilled ? '1' : '0.45';
    btn.style.cursor  = allFilled ? 'pointer' : 'not-allowed';
  }
  if (hint) {
    const filled = ['p1','p2','p3','p4'].filter(k => lv2UserPhrases[k].length > 0).length;
    hint.textContent = allFilled ? '✓ All phrases ready!' : `${filled} / 4 phrases filled`;
    hint.style.color  = allFilled ? '#20A060' : 'var(--text-muted)';
  }
}

async function lv2PlayP1Phrase(k) {
  const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
  await initTone();
  for (const n of notes) { await playNote(n, 0.65); }
}

async function lv2P1HearPhrase(k) {
  const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : [];
  if (!notes.length) { showToast('Type some notes first!'); return; }
  await initTone();
  for (const n of notes) { await playNote(n, 0.65); }
}

async function lv2PlayNote(note) {
  await initTone();
  await playNote(note, 1);
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Build Happy Birthday
// ══════════════════════════════════════════════════════
function lv2RenderPhase2(body) {
  lv2P2Blocks = [];

  const palBlocks = ['p1','p2','p3','p4'].map(k => {
    const col = LV2_PHRASE_COLORS[k];
    const lbl = LV2_PHRASE_LABELS[k];
    return `
      <div class="lv2-pal-block" style="background:${col}" onclick="lv2P2AddBlock('${k}')">
        ${icon('music',12)} play( <span class="lv2-pal-badge">${lbl}</span> )
      </div>`;
  }).join('');

  const varDefs = ['p1','p2','p3','p4'].map(k => {
    const col   = LV2_PHRASE_COLORS[k];
    const lbl   = LV2_PHRASE_LABELS[k];
    const nm    = LV2_PHRASE_NAMES[k];
    // Use the user-typed phrases if available, otherwise fall back to the defaults
    const notes = (lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k]).map(n => `"${n}"`).join(', ');
    return `
      <div class="lv2-defined-var" style="font-size:12px">
        <span class="lv2-dv-label" style="color:${col};font-weight:800">${lbl} =</span>
        <code class="lv2-dv-code">[${notes}]</code>
        <span style="font-size:11px;color:var(--text-muted);font-style:italic">"${nm}"</span>
        <button class="lv1-play-btn" style="background:${LV2_PHRASE_BGALPHA[k]};color:var(--text)"
          onclick="lv2PlayP1Phrase('${k}')">${icon('volume',12)}</button>
      </div>`;
  }).join('');

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Build Happy Birthday</div>
      <p class="lv1-activity-sub">
        All four variables are ready. Tap each block <strong>once</strong> to arrange the song:
        <strong>phrase1 → phrase2 → phrase3 → phrase4</strong>
      </p>
      <div style="display:flex;flex-direction:column;gap:4px">${varDefs}</div>
      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette">
          <div class="lv1-palette-label">Blocks</div>
          ${palBlocks}
          <div class="lv1-palette-hint" style="margin-top:4px">tap to add</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;flex:1">
          <div class="lv1-dropzone" id="lv2-p2-canvas" style="min-height:120px">
            <div class="lv1-dz-placeholder" id="lv2-p2-ph">Tap blocks to build the song...</div>
          </div>
          <div class="lv1-actions">
            <button class="lv1-btn secondary" onclick="lv2P2Clear()">Clear</button>
            <button class="lv1-btn secondary" onclick="lv2P2Play()">${icon('play',12)} Play</button>
            <button class="lv1-btn secondary" onclick="lv2P2CheckAnswer()">${icon('check',12)} Check</button>
            <button class="lv1-btn primary" id="lv2-p2-next" onclick="lv2ShowPhase(3)" style="display:none">Next: How Computers Think →</button>
          </div>
          <div id="lv2-p2-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
  lv2P2RenderCanvas();
}

function lv2P2AddBlock(k) {
  if (lv2P2Blocks.length >= 4) return;
  lv2P2Blocks.push(k);
  lv2P2RenderCanvas();
}

function lv2P2RemoveBlock(i) {
  lv2P2Blocks.splice(i, 1);
  lv2P2RenderCanvas();
}

function lv2P2RenderCanvas() {
  const cv = document.getElementById('lv2-p2-canvas');
  const ph = document.getElementById('lv2-p2-ph');
  if (!cv) return;
  cv.querySelectorAll('.lv1-seq-block').forEach(e => e.remove());
  if (ph) ph.style.display = lv2P2Blocks.length ? 'none' : 'block';
  lv2P2Blocks.forEach((k, i) => {
    const el = document.createElement('div');
    el.className = 'lv1-seq-block';
    el.style.background = LV2_PHRASE_COLORS[k];
    const lbl = LV2_PHRASE_LABELS[k];
    el.innerHTML = `${icon('music',12)} play( <span style="background:rgba(255,255,255,0.28);padding:1px 7px;border-radius:4px;font-weight:700;font-size:12px">${lbl}</span> )
      <button class="lv1-rm-btn" onclick="lv2P2RemoveBlock(${i})">${icon('close',11)}</button>`;
    cv.appendChild(el);
  });
}

function lv2P2Clear() {
  lv2P2Blocks = [];
  lv2P2RenderCanvas();
  const fb = document.getElementById('lv2-p2-fb');
  if (fb) fb.style.display = 'none';
  const nb = document.getElementById('lv2-p2-next');
  if (nb) nb.style.display = 'none';
}

async function lv2P2Play() {
  if (!lv2P2Blocks.length) return;
  await initTone();
  for (const k of lv2P2Blocks) {
    const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    for (const n of notes) { await playNote(n, 0.65); }
  }
}

async function lv2P2CheckAnswer() {
  const fb = document.getElementById('lv2-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';
  const correct = lv2P2Blocks.length === 4 &&
    lv2P2Blocks.every((b, i) => b === LV2_HCB_TARGET[i]);
  if (!correct) {
    fb.className = 'lv1-feedback error';
    fb.textContent = lv2P2Blocks.length !== 4
      ? `You need 4 blocks — you have ${lv2P2Blocks.length}. Tap phrase1, phrase2, phrase3, phrase4 in order!`
      : 'Not quite! The order should be phrase1 → phrase2 → phrase3 → phrase4.';
    return;
  }
  fb.className = 'lv1-feedback success';
  fb.textContent = '🎂 Perfect! Playing your Happy Birthday…';
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    for (const n of notes) { await playNote(n, 0.65); }
  }
  fb.innerHTML = '🎂 <strong>Happy Birthday!</strong> Four variables, one song — that\'s the power of variables!';
  document.getElementById('lv2-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv2GetCTConcepts() {
  return [
    {
      title: 'Variable',
      icon: 'variable',
      body: `A <em>variable</em> is a named container for data. <code>phrase1</code>, <code>phrase2</code>, <code>phrase3</code>, <code>phrase4</code> — four different variables, each storing one musical line of Happy Birthday.`
    },
    {
      title: 'Abstraction',
      icon: 'blocks',
      body: `Instead of listing every note every time, write <code>play(phrase2)</code>. The computer fills in all the notes automatically. This is <strong>abstraction</strong>: hiding complexity behind a simple, meaningful name.`
    },
    {
      title: 'Composition',
      icon: 'algorithm',
      body: `Four separate variables, played one after another, form a complete song. This is <strong>composition</strong> — combining small, independent pieces into something bigger. Each piece is self-contained and reusable.`
    }
  ];
}

function lv2RenderPhase3(body) {
  lv2P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv2-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv2-p3-main"></div>
      </div>
    </div>
  `;
  lv2P3Goto(0);
}

function lv2P3UpdateNav(step) {
  const labels = ['Concepts', 'Listen', 'Discover', 'Create!'];
  const nav = document.getElementById('lv2-p3-nav');
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

function lv2P3Goto(step) {
  lv2P3Step = step;
  lv2P3UpdateNav(step);
  const main = document.getElementById('lv2-p3-main');
  if (!main) return;
  if (step === 0) lv2P3Read(main);
  else if (step === 1) lv2HCBListen(main);
  else if (step === 2) lv2HCBDiscover(main);
  else if (step === 3) lv2P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv2P3Read(main) {
  lv2ReadOpened = [false, false, false];
  const concepts = lv2GetCTConcepts();
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>Happy Birthday has four musical phrases — four variables! Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${concepts.map((c, i) => `
        <div class="lv1-read-block" id="lv2-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv2ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv2-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv2-read-next" onclick="lv2P3Goto(1)" style="display:none">Next: Listen →</button>
      </div>
    </div>
  `;
}

function lv2ReadToggle(idx) {
  lv2ReadOpened[idx] = !lv2ReadOpened[idx];
  const btn = document.querySelector('#lv2-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv2-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv2ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv2ReadOpened[idx]);
  if (lv2ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv2-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Step 1 — Listen */
function lv2HCBListen(main) {
  const phraseRows = ['p1','p2','p3','p4'].map(k => {
    const col   = LV2_PHRASE_COLORS[k];
    const bg    = LV2_PHRASE_BGALPHA[k];
    const label = LV2_PHRASE_LABELS[k];
    const name  = LV2_PHRASE_NAMES[k];
    const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    return `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:800;color:${col};background:${bg};border-radius:6px;padding:3px 8px;white-space:nowrap;min-width:56px;text-align:center">${label}</span>
        <div class="lv1-song-card-notes" style="margin:0;flex-wrap:nowrap">
          ${notes.map(n => `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}40">${n}</span>`).join('')}
        </div>
        <span style="font-size:11.5px;color:var(--text-muted);white-space:nowrap;font-style:italic">${name}</span>
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Happy Birthday</div>
        <p>This song has <strong>four distinct phrases</strong> — we store each one in its own variable. Each phrase is a different colour!</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">🎂 Happy Birthday</div>
        <div class="lv1-song-card-lyrics">"Happy birthday to you, Happy birthday to you, Happy birthday dear [name], Happy birthday to you!"</div>

        <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;width:100%">
          ${phraseRows}
        </div>

        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv2HCBPlayFull()">
          ${icon('play',13)} Listen to the song
        </button>
        <div id="lv2-hcb-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv2P3Goto(2)">Next: Discover →</button>
      </div>
    </div>
  `;
}

async function lv2HCBPlayFull() {
  const ind = document.getElementById('lv2-hcb-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    const notes = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    for (const n of notes) { await playNote(n, 0.65); }
  }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Discover */
async function lv2HCBDiscover(main) {
  const pillRows = LV2_HCB_TARGET.map(k => {
    const col   = LV2_PHRASE_COLORS[k];
    const bg    = LV2_PHRASE_BGALPHA[k];
    const label = LV2_PHRASE_LABELS[k];
    const phrase = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    const pills = phrase.map((n, j) =>
      `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}50" id="lv2-disc-${k}-${j}">${n}</span>`
    ).join('');
    return `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span style="font-size:10px;font-weight:800;color:${col};background:${bg};border-radius:5px;padding:2px 7px;min-width:52px;text-align:center">${label}</span>
        ${pills}
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Four variables. One song.</div>
        <p>Each phrase plays <em>once</em>, one after another. Four different musical ideas, each stored cleanly in its own variable.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(46,128,208,0.06),rgba(32,160,96,0.06))">
        <div class="lv1-song-card-title">Your song = phrase1 + phrase2 + phrase3 + phrase4</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;width:100%">
          ${pillRows}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv2HCBDiscoverPlay()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Variable</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Named containers for different musical ideas</div>
          </div>
          <div style="background:rgba(112,80,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#7050D0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Abstraction</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Hide detail behind a simple label</div>
          </div>
          <div style="background:rgba(24,160,80,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Composition</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Combine pieces to build something bigger</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv2P3Goto(3)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    for (const n of LV2_PHRASES[k]) { await playNote(n, 0.65); }
  }
}

async function lv2HCBDiscoverPlay() {
  await initTone();
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
  for (const k of LV2_HCB_TARGET) {
    const phrase = lv2UserPhrases[k].length ? lv2UserPhrases[k] : LV2_PHRASES[k];
    for (let j = 0; j < phrase.length; j++) {
      document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
      const pill = document.getElementById(`lv2-disc-${k}-${j}`);
      if (pill) pill.classList.add('playing');
      await playNote(phrase[j], 0.65);
    }
  }
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 3 — Create! */
function lv2P3WriteOwn(main) {
  lv2OwnNotes = ['C4', 'E4', 'G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">
        Give your melody a name and pick up to 4 notes. Hit <strong>Play</strong> to hear it, then complete the level!
      </p>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:700;color:var(--text-muted)">Variable name:</span>
        <input class="lv1-code-blank" id="lv2-own-name" value="myMelody" maxlength="20"
          autocomplete="off" spellcheck="false" style="width:130px;font-size:13px;padding:6px 10px" oninput="lv2OwnPreview()">
        <span style="font-size:12px;color:var(--text-muted)">→ holds <span id="lv2-own-preview-notes" style="font-weight:700;color:var(--text)">"C4", "E4", "G4"</span></span>
      </div>
      <div class="lv2-note-picker" id="lv2-own-picker">
        ${LV2_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv2-own-tile-${note}" onclick="lv2OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV2_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div id="lv2-own-invalid" class="lv1-feedback error" style="display:none">
        Variable name must start with a letter and contain only letters, numbers, or underscores.
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv2OwnPlay()">${icon('play',12)} Play</button>
        <button class="lv1-btn primary" onclick="lv2Complete()">Complete Level 2!</button>
      </div>
    </div>
  `;
  lv2UpdateOwnPicker();
}

function lv2OwnToggleNote(note) {
  const idx = lv2OwnNotes.indexOf(note);
  if (idx >= 0) lv2OwnNotes.splice(idx, 1);
  else { if (lv2OwnNotes.length >= 4) return; lv2OwnNotes.push(note); }
  lv2UpdateOwnPicker();
  lv2OwnPreview();
}

function lv2UpdateOwnPicker() {
  LV2_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv2-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv2OwnNotes.includes(note));
  });
}

function lv2OwnPreview() {
  const nameInput = document.getElementById('lv2-own-name');
  if (!nameInput) return;
  const name = nameInput.value.trim();
  const valid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  const invalid = document.getElementById('lv2-own-invalid');
  if (invalid) invalid.style.display = (name && !valid) ? 'block' : 'none';
  const np = document.getElementById('lv2-own-preview-notes');
  if (np) np.textContent = lv2OwnNotes.length ? lv2OwnNotes.map(n => '"' + n + '"').join(', ') : '...';
}

async function lv2OwnPlay() {
  const nameInput = document.getElementById('lv2-own-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    const inv = document.getElementById('lv2-own-invalid');
    if (inv) inv.style.display = 'block';
    return;
  }
  if (!lv2OwnNotes.length) return;
  await initTone();
  for (const n of lv2OwnNotes) { await playNote(n, 1); }
}

function lv2Complete() {
  completeLevel(2);
  backToLevels();
}
