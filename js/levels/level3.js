// ════════════════════════════════════════════════════════════
// LEVEL 3 — LOOPS & FRÈRE JACQUES
// ════════════════════════════════════════════════════════════

let lv3Phase = 1;
let lv3P2Blocks = [];   // phrase keys for the 4 loop-blocks: ['p1','p2','p3','p4']
let lv3OwnNotes = ['C4', 'E4', 'G4'];
let lv3P3Step = 0;
let lv3ReadOpened = [false, false, false];

const LV3_NOTE_OPTIONS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
const LV3_PITCH_PCT = { 'C4': 12, 'D4': 25, 'E4': 38, 'F4': 50, 'G4': 63, 'A4': 75 };

// Frère Jacques: four phrases, each plays TWICE (= a loop!)
const LV3_PHRASE1 = ['C4', 'D4', 'E4', 'C4'];              // Frère Jacques
const LV3_PHRASE2 = ['E4', 'F4', 'G4'];                    // dormez-vous?
const LV3_PHRASE3 = ['G4', 'A4', 'G4', 'F4', 'E4', 'C4']; // Sonnez les matines
const LV3_PHRASE4 = ['C4', 'G3', 'C4'];                    // Din din don
const LV3_PHRASES    = { p1: LV3_PHRASE1, p2: LV3_PHRASE2, p3: LV3_PHRASE3, p4: LV3_PHRASE4 };
const LV3_PHRASE_LABELS = { p1: 'phrase1', p2: 'phrase2', p3: 'phrase3', p4: 'phrase4' };
const LV3_PHRASE_NAMES  = { p1: 'Frère Jacques', p2: 'dormez-vous?', p3: 'Sonnez les matines', p4: 'Din din don' };
const LV3_PHRASE_COLORS = { p1: '#2E80D0', p2: '#7050D0', p3: '#D06030', p4: '#20A060' };
const LV3_PHRASE_BGALPHA = { p1: 'rgba(46,128,208,0.14)', p2: 'rgba(112,80,208,0.14)', p3: 'rgba(208,96,48,0.14)', p4: 'rgba(32,160,96,0.14)' };
// target: 4 loop-blocks, one per phrase, each plays ×2 → full song
const LV3_LOOP_TARGET = ['p1','p2','p3','p4'];
const LV3_REPEAT = 2;   // how many times each phrase loops

// ─── Entry point ─────────────────────────────────────────────
function renderLevel3() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge lv-3">Level 3</div>
          <div class="lv1-title-text">Loops</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv3-ph-0">1 — Phrases</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv3-ph-1">2 — Build with Loops</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv3-ph-2">3 — How Computers Think</div>
        </div>
      </div>
      <div class="lv1-body" id="lv3-body"></div>
    </div>
  `;
  lv3Phase = 1;
  lv3ShowPhase(1);
}

function lv3ShowPhase(p) {
  lv3Phase = p;
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('lv3-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i === p - 1 ? ' active' : (i < p - 1 ? ' done' : ''));
  });
  const body = document.getElementById('lv3-body');
  if (!body) return;
  if (p === 1) lv3RenderPhase1(body);
  else if (p === 2) lv3RenderPhase2(body);
  else if (p === 3) lv3RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — Meet the Four Phrases
// ══════════════════════════════════════════════════════
function lv3RenderPhase1(body) {
  const phraseCards = ['p1','p2','p3','p4'].map(k => {
    const col   = LV3_PHRASE_COLORS[k];
    const bg    = LV3_PHRASE_BGALPHA[k];
    const lbl   = LV3_PHRASE_LABELS[k];
    const nm    = LV3_PHRASE_NAMES[k];
    const notes = LV3_PHRASES[k];
    return `
      <div style="background:var(--surface);border:1.5px solid var(--border);border-left:4px solid ${col};border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="background:${col};color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;font-family:'JetBrains Mono',monospace">${lbl}</span>
          <span style="font-size:12px;color:var(--text-muted);font-style:italic">"${nm}"</span>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${notes.map(n => `<span class="lv1-song-note-pill" style="background:${bg};border-color:${col}55">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn secondary" style="font-size:12px;padding:6px 12px;align-self:flex-start" onclick="lv3PlayPhrase('${k}')">
          ${icon('play',11)} Hear it
        </button>
      </div>`;
  }).join('');

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Meet the Four Phrases</div>
      <p class="lv1-activity-sub">
        <em>Frère Jacques</em> has four musical phrases — just like Level 2's Happy Birthday.
        But this time, notice something special: <strong>each phrase plays TWICE</strong>!
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${phraseCards}
      </div>
      <div class="lv1-concept" style="border-left-color:#D4A020;background:rgba(212,160,32,0.07)">
        <div class="lv1-concept-label" style="color:#B87800">🔁 Spot the Pattern!</div>
        <p>The full song is: <strong>phrase1 × 2 → phrase2 × 2 → phrase3 × 2 → phrase4 × 2</strong><br>
        Every phrase repeats exactly <strong>twice</strong>. Repeated actions = <em>loops</em>!<br>
        In Level 2 we used 4 blocks. Here we'll use 4 <strong>loop blocks</strong> — and each one plays its phrase twice automatically.</p>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv3ShowPhase(2)">Build with loops! →</button>
      </div>
    </div>
  `;
}

async function lv3PlayPhrase(k) {
  await initTone();
  for (const n of LV3_PHRASES[k]) { await playNote(n, 0.75); }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Build Frère Jacques with Loop Blocks (drag & drop)
// lv3P2Blocks: array of { phrase: 'p1'|null }
// ══════════════════════════════════════════════════════

// Drag state
let lv3P2DragType    = null; // 'loop' | 'var' | 'block'
let lv3P2DragKey     = null; // phrase key when type='var'
let lv3P2DragFromIdx = null; // canvas index when type='block'
let lv3P2DropIdx     = null;

function lv3RenderPhase2(body) {
  lv3P2Blocks = [];
  lv3P2DragType = lv3P2DragKey = lv3P2DragFromIdx = lv3P2DropIdx = null;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Build Frère Jacques with Loops</div>
      <p class="lv1-activity-sub">
        <strong>Drag</strong> a loop block onto the canvas, then <strong>drag</strong> a variable chip into the loop body.
        Build: phrase1 → phrase2 → phrase3 → phrase4, each looping <strong>2×</strong>.
      </p>
      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette" id="lv3-p2-palette">
          <div class="lv1-palette-label">Loop Block</div>
          <div class="lv3-pal-loop-chip" draggable="true"
               ondragstart="lv3P2DragStartLoop(event)">
            <div class="loop-header" style="border-radius:8px 8px 0 0;cursor:grab">
              <span>${icon('repeat',12)} repeat </span>
              <span class="count-val" style="margin:0 4px">2</span>
              <span>times:</span>
            </div>
            <div style="background:rgba(212,160,32,0.18);border-left:4px solid #C49020;border-right:4px solid #C49020;padding:7px 12px;font-size:11px;color:var(--text-muted);font-style:italic">
              ← drag variable to fill
            </div>
            <div class="loop-footer" style="border-radius:0 0 8px 8px">end</div>
          </div>
          <div class="lv1-palette-label" style="margin-top:10px">Variables</div>
          <div id="lv3-p2-var-chips"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;flex:1">
          <div class="lv1-dropzone" id="lv3-p2-canvas"
               style="min-height:180px;padding:10px;gap:0;display:flex;flex-direction:column"
               ondragover="lv3P2CanvasDragOver(event)"
               ondragleave="lv3P2CanvasDragLeave(event)"
               ondrop="lv3P2CanvasDrop(event)">
            <div class="lv1-dz-placeholder" id="lv3-p2-ph">Drag a loop block here to start…</div>
          </div>
          <div class="lv1-actions">
            <button class="lv1-btn secondary" onclick="lv3P2Clear()">Clear</button>
            <button class="lv1-btn secondary" onclick="lv3P2Play()">${icon('play',12)} Play</button>
            <button class="lv1-btn secondary" onclick="lv3P2CheckAnswer()">${icon('check',12)} Check</button>
            <button class="lv1-btn primary" id="lv3-p2-next" onclick="lv3ShowPhase(3)" style="display:none">Next: How Computers Think →</button>
          </div>
          <div id="lv3-p2-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
  lv3P2RenderVarChips();
  lv3P2RenderCanvas();
}

function lv3P2RenderVarChips() {
  const container = document.getElementById('lv3-p2-var-chips');
  if (!container) return;
  container.innerHTML = '';
  ['p1','p2','p3','p4'].forEach(k => {
    const col = LV3_PHRASE_COLORS[k];
    const lbl = LV3_PHRASE_LABELS[k];
    const chip = document.createElement('div');
    chip.className = 'lv3-pal-var-chip';
    chip.style.background = col;
    chip.draggable = true;
    chip.title = `Drag into a loop body`;
    chip.ondragstart = e => lv3P2DragStartVar(e, k);
    chip.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px">
        <span style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5);flex-shrink:0"></span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:12px;color:#fff">${lbl}</span>
      </div>
      <button style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:0 2px"
        onclick="event.stopPropagation();lv3PlayPhrase('${k}')" title="Preview">${icon('play',10)}</button>
    `;
    container.appendChild(chip);
  });
}

// ── Drag start ──────────────────────────────────────────
function lv3P2DragStartLoop(e) {
  lv3P2DragType = 'loop'; lv3P2DragKey = null; lv3P2DragFromIdx = null;
  e.dataTransfer.effectAllowed = 'copy';
}
function lv3P2DragStartVar(e, k) {
  lv3P2DragType = 'var'; lv3P2DragKey = k; lv3P2DragFromIdx = null;
  e.dataTransfer.effectAllowed = 'copy';
  e.stopPropagation();
}
function lv3P2DragStartBlock(e, idx) {
  lv3P2DragType = 'block'; lv3P2DragKey = null; lv3P2DragFromIdx = idx;
  e.dataTransfer.effectAllowed = 'move';
  e.stopPropagation();
}

// ── Canvas drop-line helpers ────────────────────────────
function lv3P2GetDropIdx(e) {
  const cv = document.getElementById('lv3-p2-canvas');
  if (!cv) return lv3P2Blocks.length;
  const blocks = [...cv.querySelectorAll('.lv3-canvas-loop')];
  if (!blocks.length) return 0;
  for (let i = 0; i < blocks.length; i++) {
    const rect = blocks[i].getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) return i;
  }
  return blocks.length;
}
function lv3P2ShowDropLine(idx) {
  lv3P2RemoveDropLine();
  const cv = document.getElementById('lv3-p2-canvas');
  if (!cv) return;
  const line = document.createElement('div');
  line.id = 'lv3-p2-drop-line';
  line.style.cssText = 'height:3px;background:#2E80D0;border-radius:2px;margin:2px 4px;pointer-events:none;flex-shrink:0';
  const blocks = [...cv.querySelectorAll('.lv3-canvas-loop')];
  if (idx >= blocks.length) cv.appendChild(line);
  else cv.insertBefore(line, blocks[idx]);
  lv3P2DropIdx = idx;
}
function lv3P2RemoveDropLine() {
  const line = document.getElementById('lv3-p2-drop-line');
  if (line) line.remove();
}

// ── Canvas drag handlers ────────────────────────────────
function lv3P2CanvasDragOver(e) {
  if (!['loop','var','block'].includes(lv3P2DragType)) return;
  e.preventDefault();
  const idx = lv3P2GetDropIdx(e);
  lv3P2ShowDropLine(idx);
  e.dataTransfer.dropEffect = lv3P2DragType === 'block' ? 'move' : 'copy';
}
function lv3P2CanvasDragLeave(e) {
  const cv = document.getElementById('lv3-p2-canvas');
  if (!cv || cv.contains(e.relatedTarget)) return;
  lv3P2RemoveDropLine();
}
function lv3P2CanvasDrop(e) {
  e.preventDefault();
  lv3P2RemoveDropLine();
  const idx = lv3P2DropIdx !== null ? lv3P2DropIdx : lv3P2Blocks.length;
  lv3P2DropIdx = null;

  if (lv3P2DragType === 'loop') {
    if (lv3P2Blocks.length >= 4) { showToast('Max 4 loop blocks!'); return; }
    lv3P2Blocks.splice(idx, 0, { phrase: null });
  } else if (lv3P2DragType === 'var') {
    // Drop variable on canvas → insert a pre-filled loop
    if (lv3P2Blocks.length >= 4) { showToast('Max 4 loop blocks!'); return; }
    lv3P2Blocks.splice(idx, 0, { phrase: lv3P2DragKey });
  } else if (lv3P2DragType === 'block') {
    const from = lv3P2DragFromIdx;
    if (from === null || from === idx || from === idx - 1) { lv3P2RenderCanvas(); return; }
    const block = lv3P2Blocks.splice(from, 1)[0];
    lv3P2Blocks.splice(from < idx ? idx - 1 : idx, 0, block);
  }
  lv3P2RenderCanvas();
}

// ── Loop-body drag handlers (for variable fill) ─────────
function lv3P2BodyDragOver(e, i) {
  if (lv3P2DragType !== 'var') return;
  e.preventDefault(); e.stopPropagation();
  const b = document.getElementById('lv3-body-' + i);
  if (b) b.classList.add('drag-over');
  e.dataTransfer.dropEffect = 'copy';
}
function lv3P2BodyDragLeave(e, i) {
  const b = document.getElementById('lv3-body-' + i);
  if (b) b.classList.remove('drag-over');
}
function lv3P2BodyDrop(e, i) {
  e.preventDefault(); e.stopPropagation();
  lv3P2RemoveDropLine();
  const b = document.getElementById('lv3-body-' + i);
  if (b) b.classList.remove('drag-over');
  if (lv3P2DragType === 'var' && lv3P2DragKey) {
    lv3P2Blocks[i].phrase = lv3P2DragKey;
    lv3P2RenderCanvas();
  }
}

// ── Fallback helpers (click still works) ───────────────
function lv3P2AddLoop() {
  if (lv3P2Blocks.length >= 4) { showToast('Max 4 loop blocks!'); return; }
  lv3P2Blocks.push({ phrase: null });
  lv3P2RenderCanvas();
}
function lv3P2AssignPhrase(k) {
  const emptyIdx = lv3P2Blocks.findIndex(b => b.phrase === null);
  if (emptyIdx < 0) { showToast('Add a loop block first!'); return; }
  lv3P2Blocks[emptyIdx].phrase = k;
  lv3P2RenderCanvas();
}
function lv3P2RemoveBlock(i) {
  lv3P2Blocks.splice(i, 1);
  lv3P2RenderCanvas();
}

function lv3P2RenderCanvas() {
  const cv = document.getElementById('lv3-p2-canvas');
  const ph = document.getElementById('lv3-p2-ph');
  if (!cv) return;
  cv.querySelectorAll('.lv3-canvas-loop').forEach(e => e.remove());
  if (ph) ph.style.display = lv3P2Blocks.length ? 'none' : '';

  lv3P2Blocks.forEach((b, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'loop-block lv3-canvas-loop';
    wrap.style.marginBottom = '8px';
    wrap.draggable = true;
    wrap.ondragstart = e => lv3P2DragStartBlock(e, i);

    // ── Header ──
    const header = document.createElement('div');
    header.className = 'loop-header';
    header.style.cursor = 'grab';
    header.innerHTML = icon('repeat', 12) + ' repeat ';
    const countWrap = document.createElement('div');
    countWrap.className = 'count-btns';
    countWrap.innerHTML = `<span class="count-val">${LV3_REPEAT}</span>`;
    header.appendChild(countWrap);
    const timesLbl = document.createElement('span');
    timesLbl.textContent = ' times:';
    header.appendChild(timesLbl);
    const delB = document.createElement('button');
    delB.className = 'block-del';
    delB.innerHTML = icon('close', 11);
    delB.style.opacity = '0';
    delB.ondragstart = e => e.stopPropagation();
    delB.onclick = e => { e.stopPropagation(); lv3P2RemoveBlock(i); };
    header.addEventListener('mouseenter', () => delB.style.opacity = '1');
    header.addEventListener('mouseleave', () => delB.style.opacity = '0');
    header.appendChild(delB);
    wrap.appendChild(header);

    // ── Body (drop target for variable chips) ──
    const loopBody = document.createElement('div');
    loopBody.className = 'loop-body';
    loopBody.id = 'lv3-body-' + i;
    loopBody.ondragover  = e => lv3P2BodyDragOver(e, i);
    loopBody.ondragleave = e => lv3P2BodyDragLeave(e, i);
    loopBody.ondrop      = e => lv3P2BodyDrop(e, i);

    if (b.phrase === null) {
      const hint = document.createElement('div');
      hint.className = 'drop-hint';
      hint.textContent = '← drag a variable here';
      loopBody.appendChild(hint);
    } else {
      const col = LV3_PHRASE_COLORS[b.phrase];
      const lbl = LV3_PHRASE_LABELS[b.phrase];
      const playEl = document.createElement('div');
      playEl.className = 'block';
      playEl.style.background = col;
      playEl.innerHTML = `${icon('music', 12)} play( <span class="block-badge" style="background:rgba(0,0,0,0.25)">${lbl}</span> )`;
      playEl.title = 'Click to remove';
      playEl.onclick = e => { e.stopPropagation(); lv3P2Blocks[i].phrase = null; lv3P2RenderCanvas(); };
      loopBody.appendChild(playEl);
    }
    wrap.appendChild(loopBody);

    // ── Footer ──
    const footer = document.createElement('div');
    footer.className = 'loop-footer';
    footer.innerHTML = '<span style="opacity:0.6;font-size:11px">end</span>';
    wrap.appendChild(footer);

    cv.appendChild(wrap);
  });
}

function lv3P2Clear() {
  lv3P2Blocks = [];
  lv3P2RenderCanvas();
  const fb = document.getElementById('lv3-p2-fb');
  if (fb) fb.style.display = 'none';
  const nb = document.getElementById('lv3-p2-next');
  if (nb) nb.style.display = 'none';
}

async function lv3P2Play() {
  if (!lv3P2Blocks.length) return;
  await initTone();
  for (const b of lv3P2Blocks) {
    if (!b.phrase) continue;
    for (let r = 0; r < LV3_REPEAT; r++) {
      for (const n of LV3_PHRASES[b.phrase]) { await playNote(n, 0.75); }
    }
  }
}

async function lv3P2CheckAnswer() {
  const fb = document.getElementById('lv3-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';
  const hasEmpty = lv3P2Blocks.some(b => b.phrase === null);
  const correct = lv3P2Blocks.length === 4 && !hasEmpty &&
    lv3P2Blocks.every((b, i) => b.phrase === LV3_LOOP_TARGET[i]);
  if (!correct) {
    fb.className = 'lv1-feedback error';
    if (lv3P2Blocks.length !== 4)
      fb.textContent = `You need 4 loop blocks — you have ${lv3P2Blocks.length}. Add one loop block per phrase!`;
    else if (hasEmpty)
      fb.textContent = 'Some loops are still empty! Tap a variable chip to fill each loop.';
    else
      fb.textContent = 'Not quite! The order should be phrase1 → phrase2 → phrase3 → phrase4.';
    return;
  }
  fb.className = 'lv1-feedback success';
  fb.textContent = '🎵 Perfect! Playing Frère Jacques with loops…';
  await initTone();
  for (const k of LV3_LOOP_TARGET) {
    for (let r = 0; r < LV3_REPEAT; r++) {
      for (const n of LV3_PHRASES[k]) { await playNote(n, 0.75); }
    }
  }
  fb.innerHTML = '🎵 <strong>Frère Jacques!</strong> 4 loop blocks × 2 plays each = 8 phrases, one song!';
  document.getElementById('lv3-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv3GetCTConcepts() {
  return [
    {
      title: 'Loop',
      icon: 'repeat',
      body: `A loop repeats the same set of instructions multiple times. Instead of writing <code>play(phrase1)</code> twice, you can use a loop: <code>repeat 2 times: play(phrase1)</code>. This makes the process more systematic and reduces repetition.`
    },
    {
      title: 'Variables + Loops',
      icon: 'variable',
      body: `Loops become more powerful when combined with variables. You can define a phrase once as a variable, then repeat it using a loop. If the phrase changes, the loop still works — making your code more flexible and easier to update.`
    },
    {
      title: 'Efficiency',
      icon: 'blocks',
      body: `Using loops reduces unnecessary repetition. Instead of writing out every step, you can achieve the same result with fewer instructions. This makes your code shorter, clearer, and easier to modify — an important aspect of computational efficiency.`
    }
  ];
}

function lv3RenderPhase3(body) {
  lv3P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv3-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv3-p3-main"></div>
      </div>
    </div>
  `;
  lv3P3Goto(0);
}

function lv3P3UpdateNav(step) {
  const labels = ['Concepts', 'Listen', 'Discover', 'Create!'];
  const nav = document.getElementById('lv3-p3-nav');
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

function lv3P3Goto(step) {
  lv3P3Step = step;
  lv3P3UpdateNav(step);
  const main = document.getElementById('lv3-p3-main');
  if (!main) return;
  if (step === 0) lv3P3Read(main);
  else if (step === 1) lv3Listen(main);
  else if (step === 2) lv3Discover(main);
  else if (step === 3) lv3P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv3P3Read(main) {
  lv3ReadOpened = [false, false, false];
  const concepts = lv3GetCTConcepts();
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just used loops to build Frère Jacques. Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${concepts.map((c, i) => `
        <div class="lv1-read-block" id="lv3-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv3ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv3-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv3-read-next" onclick="lv3P3Goto(1)" style="display:none">Next: Listen →</button>
      </div>
    </div>
  `;
}

function lv3ReadToggle(idx) {
  lv3ReadOpened[idx] = !lv3ReadOpened[idx];
  const btn = document.querySelector('#lv3-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv3-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv3ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv3ReadOpened[idx]);
  if (lv3ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv3-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Step 1 — Listen */
function lv3Listen(main) {
  // Build phrase rows showing each phrase (played twice)
  const phraseRows = ['p1','p2','p3','p4'].map(k => {
    const col   = LV3_PHRASE_COLORS[k];
    const bg    = LV3_PHRASE_BGALPHA[k];
    const label = LV3_PHRASE_LABELS[k];
    const name  = LV3_PHRASE_NAMES[k];
    const notes = LV3_PHRASES[k];
    return `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:800;color:${col};background:${bg};border-radius:6px;padding:3px 8px;white-space:nowrap;min-width:56px;text-align:center">${label}</span>
        <div class="lv1-song-card-notes" style="margin:0;flex-wrap:nowrap">
          ${notes.map(n => `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}40">${n}</span>`).join('')}
        </div>
        <span style="font-size:11px;color:${col};font-weight:700;background:${bg};border-radius:5px;padding:2px 7px;white-space:nowrap">× 2</span>
        <span style="font-size:11.5px;color:var(--text-muted);font-style:italic">${name}</span>
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Frère Jacques</div>
        <p>This song has <strong>four distinct phrases</strong> — and each one plays <strong>twice</strong>. That repetition is exactly what loops are for!</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ Frère Jacques</div>
        <div class="lv1-song-card-lyrics">"Frère Jacques, Frère Jacques, dormez-vous? dormez-vous? Sonnez les matines! Sonnez les matines! Din din don! Din din don!"</div>

        <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;width:100%">
          ${phraseRows}
        </div>

        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv3PlayFull()">
          ${icon('play',13)} Listen to the song
        </button>
        <div id="lv3-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv3P3Goto(2)">Next: Discover →</button>
      </div>
    </div>
  `;
}

async function lv3PlayFull() {
  const ind = document.getElementById('lv3-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const k of LV3_LOOP_TARGET) {
    for (let r = 0; r < LV3_REPEAT; r++) {
      for (const n of LV3_PHRASES[k]) { await playNote(n, 0.75); }
    }
  }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Discover */
async function lv3Discover(main) {
  // Show the 4 loop-blocks visually: each phrase × 2
  const loopRows = LV3_LOOP_TARGET.map(k => {
    const col   = LV3_PHRASE_COLORS[k];
    const bg    = LV3_PHRASE_BGALPHA[k];
    const label = LV3_PHRASE_LABELS[k];
    // Two rows of pills for the two repeats
    const pillsRow = (rep) => LV3_PHRASES[k].map((n, j) =>
      `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}50" id="lv3-disc-${k}-${rep}-${j}">${n}</span>`
    ).join('');
    return `
      <div class="lv2-seq-repeat">
        <div class="lv2-seq-repeat-header" style="background:${col}">
          ${icon('repeat',11)} repeat 2× &nbsp;·&nbsp; ${label}
        </div>
        <div class="lv2-seq-repeat-body" style="border-left-color:${col};border-right-color:${col};background:${bg}">
          <div style="display:flex;flex-direction:column;gap:4px">
            <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
              <span style="font-size:10px;color:var(--text-muted);min-width:18px;font-family:'JetBrains Mono',monospace">1×</span>${pillsRow(0)}
            </div>
            <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
              <span style="font-size:10px;color:var(--text-muted);min-width:18px;font-family:'JetBrains Mono',monospace">2×</span>${pillsRow(1)}
            </div>
          </div>
        </div>
        <div class="lv2-seq-repeat-footer" style="background:${col}">end</div>
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">4 loop blocks. 8 phrase plays.</div>
        <p>Each loop block runs its phrase <strong>twice</strong>. Without loops you'd need 8 separate play blocks — with loops, just 4!</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(46,128,208,0.06),rgba(212,160,32,0.06))">
        <div class="lv1-song-card-title">Your song = 4 × (repeat 2×)</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;width:100%">
          ${loopRows}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv3DiscoverPlay()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(212,160,32,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#B87800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Loop</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Same code runs multiple times automatically</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Variable + Loop</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Name a phrase, loop it any number of times</div>
          </div>
          <div style="background:rgba(24,160,80,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Efficiency</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Half the blocks, same result — less code to maintain</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv3P3Goto(3)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const k of LV3_LOOP_TARGET) {
    for (let r = 0; r < LV3_REPEAT; r++) {
      for (const n of LV3_PHRASES[k]) { await playNote(n, 0.75); }
    }
  }
}

async function lv3DiscoverPlay() {
  await initTone();
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
  for (const k of LV3_LOOP_TARGET) {
    for (let r = 0; r < LV3_REPEAT; r++) {
      const phrase = LV3_PHRASES[k];
      for (let j = 0; j < phrase.length; j++) {
        document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
        const pill = document.getElementById(`lv3-disc-${k}-${r}-${j}`);
        if (pill) pill.classList.add('playing');
        await playNote(phrase[j], 0.75);
      }
    }
  }
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 3 — Create! */
function lv3P3WriteOwn(main) {
  lv3OwnNotes = ['C4', 'E4', 'G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">
        Pick up to 4 notes for your phrase and choose how many times to loop it. Hit <strong>Play</strong> then complete the level!
      </p>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:700;color:var(--text-muted)">Repeat:</span>
        <button class="lv2-rep-btn" onclick="lv3OwnChangeRepeat(-1)">−</button>
        <span class="lv2-rep-val" id="lv3-own-rep">2</span>
        <button class="lv2-rep-btn" onclick="lv3OwnChangeRepeat(1)">+</button>
        <span style="font-size:12px;color:var(--text-muted)">times</span>
      </div>
      <div class="lv2-note-picker" id="lv3-own-picker">
        ${LV3_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv3-own-tile-${note}" onclick="lv3OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV3_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv3OwnPlay()">${icon('play',12)} Play</button>
        <button class="lv1-btn primary" onclick="lv3Complete()">Complete Level 3!</button>
      </div>
    </div>
  `;
  lv3UpdateOwnPicker();
}

let lv3OwnRepeat = 2;

function lv3OwnChangeRepeat(delta) {
  lv3OwnRepeat = Math.max(1, Math.min(8, lv3OwnRepeat + delta));
  const el = document.getElementById('lv3-own-rep');
  if (el) el.textContent = lv3OwnRepeat;
}

function lv3OwnToggleNote(note) {
  const idx = lv3OwnNotes.indexOf(note);
  if (idx >= 0) lv3OwnNotes.splice(idx, 1);
  else { if (lv3OwnNotes.length >= 4) return; lv3OwnNotes.push(note); }
  lv3UpdateOwnPicker();
}

function lv3UpdateOwnPicker() {
  LV3_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv3-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv3OwnNotes.includes(note));
  });
}

async function lv3OwnPlay() {
  if (!lv3OwnNotes.length) return;
  await initTone();
  for (let r = 0; r < lv3OwnRepeat; r++) {
    for (const n of lv3OwnNotes) { await playNote(n, 1); }
  }
}

function lv3Complete() {
  completeLevel(3);
  backToLevels();
}
