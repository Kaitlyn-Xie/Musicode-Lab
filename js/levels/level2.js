// ════════════════════════════════════════════════════════════
// LEVEL 2 — VARIABLES & MUSIC PHRASES
// ════════════════════════════════════════════════════════════

let lv2Phase = 1;
let lv2SelectedNotes = [];
let lv2MaxNotes = 4;
let lv2VarName = 'notes';
let lv2RepeatCount = 2;
let lv2BlockSeq = [];
let lv2DraggedBlock = null;
let lv2OwnNotes = ['C4', 'E4', 'G4'];
let lv2P3Step = 0;
let lv2ReadOpened = [false, false, false];

const LV2_NOTE_OPTIONS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
const LV2_PITCH_PCT = { 'C4': 12, 'D4': 25, 'E4': 38, 'F4': 50, 'G4': 63, 'A4': 75 };

// ─── Entry point ─────────────────────────────────────────────
function renderLevel2() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge" style="background:#E8F5E9;color:#1B5E20">Level 2</div>
          <div class="lv1-title-text">Variables &amp; Music Phrases</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv2-ph-0">1 — Intro</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv2-ph-1">2 — Blocks</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv2-ph-2">3 — How Computers Think</div>
        </div>
      </div>
      <div class="lv1-body" id="lv2-body"></div>
    </div>
  `;
  lv2Phase = 1;
  lv2SelectedNotes = [];
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
// PHASE 1 — What is a variable?
// ══════════════════════════════════════════════════════
function lv2RenderPhase1(body) {
  lv2SelectedNotes = [];
  lv2VarName = 'notes';
  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Pack Your Melody Box</div>
      <p class="lv1-activity-sub">
        In programming, a <strong>variable</strong> is a named box that stores information.
        Pick a name for your variable, fill it with notes, then hit <strong>Play</strong>!
      </p>

      <div class="lv2-name-row">
        <span class="lv2-max-label">Variable name:</span>
        <input class="lv2-name-input" id="lv2-name-input" value="notes" maxlength="16"
          oninput="lv2UpdateVarName(this.value)" autocomplete="off" spellcheck="false">
        <div class="lv2-name-chips">
          ${['notes','scale','tune','phrase','song'].map(n =>
            `<button class="lv2-name-chip" onclick="lv2SetVarName('${n}')">${n}</button>`
          ).join('')}
        </div>
      </div>

      <div class="lv2-max-row">
        <span class="lv2-max-label">Length:</span>
        <button class="lv2-max-btn" onclick="lv2ChangeMax(-1)">−</button>
        <span class="lv2-max-val" id="lv2-max-val">${lv2MaxNotes}</span>
        <button class="lv2-max-btn" onclick="lv2ChangeMax(1)">+</button>
        <span class="lv2-max-hint">notes</span>
      </div>

      <div class="lv2-var-box" id="lv2-var-box">
        <div class="lv2-var-name" id="lv2-var-name-display">notes</div>
        <div class="lv2-var-eq">=</div>
        <div class="lv2-var-contents" id="lv2-var-contents">
          <span class="lv2-var-empty">[ empty ]</span>
        </div>
      </div>

      <div class="lv2-note-picker">
        ${LV2_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv2-tile-${note}" onclick="lv2AddNote('${note}')">
            <div class="lv1-card-top">
              <div class="lv1-note-name">${note}</div>
              <button class="lv1-play-btn" onclick="event.stopPropagation();lv2PlayNote('${note}')">${icon('volume',12)}</button>
            </div>
            <div class="lv1-pitch-track">
              <div class="lv1-pitch-fill" style="width:${LV2_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions" style="margin-top:4px">
        <button class="lv1-btn secondary" id="lv2-play-btn" onclick="lv2PlayMelody()">${icon('play',12)} Play</button>
        <button class="lv1-btn secondary" onclick="lv2ClearMelody()">Clear</button>
        <button class="lv1-btn primary" id="lv2-p1-next" onclick="lv2LockIn()" style="display:none">Lock it in! →</button>
      </div>

      <div id="lv2-p1-feedback" class="lv1-feedback" style="display:none"></div>

      <div class="lv1-success-concept" id="lv2-var-reveal">
        <div class="lv1-success-concept-label">That's a Variable!</div>
        <p><strong>Variables</strong> are named containers for data. <span id="lv2-reveal-name" style="font-family:monospace;font-weight:700;color:#1565C0">notes</span> is just the <strong>label</strong> on the box — you chose it, and you could call it anything. The notes are the <strong>value</strong>.</p>
        <p>Every time you write <span id="lv2-reveal-name2" style="font-family:monospace;font-weight:700;color:#1565C0">notes</span> in your code, Python fills in all those notes automatically.</p>
      </div>
    </div>
  `;
}

async function lv2PlayNote(note) {
  await initTone();
  await playNote(note, 1);
}

function lv2UpdateVarName(val) {
  // Allow only valid Python identifier characters
  val = val.replace(/[^a-zA-Z0-9_]/g, '');
  lv2VarName = val || 'notes';
  const display = document.getElementById('lv2-var-name-display');
  if (display) display.textContent = lv2VarName;
  const btn = document.getElementById('lv2-play-btn');
  if (btn) btn.innerHTML = icon('play',12) + ' Play ' + lv2VarName;
}

function lv2SetVarName(name) {
  lv2VarName = name;
  const input = document.getElementById('lv2-name-input');
  if (input) input.value = name;
  const display = document.getElementById('lv2-var-name-display');
  if (display) display.textContent = name;
  const btn = document.getElementById('lv2-play-btn');
  if (btn) btn.innerHTML = icon('play',12) + ' Play ' + name;
  // highlight active chip
  document.querySelectorAll('.lv2-name-chip').forEach(c =>
    c.classList.toggle('active', c.textContent === name)
  );
}

function lv2AddNote(note) {
  if (lv2SelectedNotes.length >= lv2MaxNotes) return;
  lv2SelectedNotes.push(note);
  lv2UpdateVarBox();
}

function lv2ChangeMax(delta) {
  lv2MaxNotes = Math.max(2, Math.min(8, lv2MaxNotes + delta));
  const el = document.getElementById('lv2-max-val');
  if (el) el.textContent = lv2MaxNotes;
  // trim notes if over new limit
  if (lv2SelectedNotes.length > lv2MaxNotes) {
    lv2SelectedNotes = lv2SelectedNotes.slice(0, lv2MaxNotes);
  }
  lv2UpdateVarBox();
}

function lv2UpdateVarBox() {
  // Dim tiles when box is full
  const full = lv2SelectedNotes.length >= lv2MaxNotes;
  LV2_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv2-tile-' + note);
    if (tile) tile.classList.toggle('full', full);
  });
  const contents = document.getElementById('lv2-var-contents');
  if (!contents) return;
  if (lv2SelectedNotes.length === 0) {
    contents.innerHTML = '<span class="lv2-var-empty">[ empty ]</span>';
  } else {
    contents.innerHTML =
      lv2SelectedNotes.map((n, i) =>
        `<div class="lv2-note-pill">${n}<button onclick="lv2RemoveNote(${i})">${icon('close',10)}</button></div>`
      ).join('') +
      (!full ? '<span class="lv2-add-hint">+ add note</span>' : '');
  }
  const nextBtn = document.getElementById('lv2-p1-next');
  if (nextBtn) nextBtn.style.display = lv2SelectedNotes.length >= 2 ? 'inline-flex' : 'none';
}

function lv2RemoveNote(idx) {
  lv2SelectedNotes.splice(idx, 1);
  lv2UpdateVarBox();
}

function lv2ClearMelody() {
  lv2SelectedNotes = [];
  lv2UpdateVarBox();
}

async function lv2PlayMelody() {
  if (!lv2SelectedNotes.length) return;
  await initTone();
  for (const n of lv2SelectedNotes) { await playNote(n, 1); }
}

async function lv2LockIn() {
  if (lv2SelectedNotes.length < 2) return;
  await lv2PlayMelody();
  const reveal = document.getElementById('lv2-var-reveal');
  if (reveal) {
    reveal.classList.add('visible');
    const r1 = document.getElementById('lv2-reveal-name');
    const r2 = document.getElementById('lv2-reveal-name2');
    if (r1) r1.textContent = lv2VarName;
    if (r2) r2.textContent = lv2VarName;
  }
  const fb = document.getElementById('lv2-p1-feedback');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'lv1-feedback success';
    fb.innerHTML = `${lv2VarName} = [${lv2SelectedNotes.map(n => '<strong>' + n + '</strong>').join(', ')}] — locked in! Now let's use it in block code.`;
  }
  const nextBtn = document.getElementById('lv2-p1-next');
  if (nextBtn) {
    nextBtn.textContent = 'Next: Block Code →';
    nextBtn.onclick = () => lv2ShowPhase(2);
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Block Code
// ══════════════════════════════════════════════════════
function lv2RenderPhase2(body) {
  lv2BlockSeq = [];
  lv2DraggedBlock = null;
  const notes = lv2SelectedNotes.length >= 2 ? lv2SelectedNotes : ['C4', 'E4', 'G4', 'A4'];

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Use Your Variable in Block Code</div>
        <p>Your <code>${lv2VarName}</code> variable is ready. Click blocks below to add them to your program, then hit <strong>Play</strong>!</p>
      </div>

      <div class="lv2-defined-var">
        <span class="lv2-dv-label">Variable defined:</span>
        <code class="lv2-dv-code">${lv2VarName} = [${notes.map(n => '"' + n + '"').join(', ')}]</code>
        <button class="lv1-play-btn" style="background:rgba(46,128,208,0.15);color:var(--text)" onclick="lv2PlayMelody()">${icon('volume',12)}</button>
      </div>

      <!-- Left-right split: palette | canvas -->
      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette">
          <div class="lv1-palette-label">Blocks</div>

          <div class="lv2-pal-block" style="background:#2E80D0"
            draggable="true" ondragstart="lv2DragStart(event,'play')" onclick="lv2TapAdd('play')">
            <span>${icon('music',12)} play(</span>
            <span class="lv2-pal-badge">${lv2VarName}</span>
            <span>)</span>
          </div>

          <div class="lv1-palette-label" style="margin-top:10px">Loop</div>
          <div class="lv2-pal-repeat-wrap" onclick="lv2TapAdd('repeat')" draggable="true" ondragstart="lv2DragStart(event,'repeat')">
            <div class="lv2-pal-repeat-header">
              <span>${icon('repeat',12)} repeat</span>
              <button class="lv2-rep-btn" onclick="event.stopPropagation();lv2ChangeRepeat(-1)">−</button>
              <span class="lv2-rep-val" id="lv2-rep-val">${lv2RepeatCount}</span>
              <button class="lv2-rep-btn" onclick="event.stopPropagation();lv2ChangeRepeat(1)">+</button>
              <span>times:</span>
            </div>
            <div class="lv2-pal-repeat-inner">← drop here</div>
            <div class="lv2-pal-repeat-end">end</div>
          </div>
          <div class="lv2-py-hint">
            Python:<br><code>for i in range(<span id="lv2-rep-py">${lv2RepeatCount}</span>):<br>&nbsp;&nbsp;play(<span class="py-var">${lv2VarName}</span>)</code>
          </div>

          <div class="lv1-palette-hint">drag or tap to add</div>
        </div>

        <!-- canvas + actions stacked in right column -->
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="lv1-dropzone" id="lv2-dropzone"
               ondragover="event.preventDefault();this.classList.add('drag-over')"
               ondragleave="this.classList.remove('drag-over')"
               ondrop="lv2DropBlock(event)">
            <div class="lv1-dz-placeholder" id="lv2-dz-ph">Drop blocks here...</div>
          </div>
          <div class="lv1-actions">
            <button class="lv1-btn secondary" onclick="lv2P2Clear()">${icon('trash',12)} Clear</button>
            <button class="lv1-btn secondary" onclick="lv2P2Play()">${icon('play',12)} Play</button>
            <button class="lv1-btn secondary" onclick="lv2P2Check()">${icon('check',12)} Check</button>
            <button class="lv1-btn primary" id="lv2-p2-next" onclick="lv2ShowPhase(3)" style="display:none">Next: How Computers Think →</button>
          </div>
          <div id="lv2-p2-feedback" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
}

function lv2DragStart(event, bt) {
  lv2DraggedBlock = bt;
  event.dataTransfer.setData('text/plain', bt);
}

function lv2DropBlock(event) {
  event.preventDefault();
  document.getElementById('lv2-dropzone').classList.remove('drag-over');
  const bt = lv2DraggedBlock || event.dataTransfer.getData('text/plain');
  if (bt) lv2AddBlock(bt);
  lv2DraggedBlock = null;
}

function lv2TapAdd(bt) { lv2AddBlock(bt); }

function lv2ChangeRepeat(delta) {
  lv2RepeatCount = Math.max(2, Math.min(8, lv2RepeatCount + delta));
  const val = document.getElementById('lv2-rep-val');
  if (val) val.textContent = lv2RepeatCount;
  const py = document.getElementById('lv2-rep-py');
  if (py) py.textContent = lv2RepeatCount;
}

function lv2AddBlock(bt) {
  lv2BlockSeq.push(bt);
  lv2P2Render();
}

function lv2RemoveBlock(idx) {
  lv2BlockSeq.splice(idx, 1);
  lv2P2Render();
}

function lv2P2Clear() { lv2BlockSeq = []; lv2P2Render(); }

function lv2P2Render() {
  const dz = document.getElementById('lv2-dropzone');
  const ph = document.getElementById('lv2-dz-ph');
  if (!dz) return;
  dz.querySelectorAll('.lv1-seq-block, .lv2-seq-repeat').forEach(e => e.remove());
  if (ph) ph.style.display = lv2BlockSeq.length ? 'none' : 'block';
  lv2BlockSeq.forEach((bt, idx) => {
    const el = document.createElement('div');
    const badge = `<span style="background:rgba(255,255,255,0.28);padding:1px 8px;border-radius:4px;font-weight:700;font-size:12px">${lv2VarName}</span>`;
    const rmBtn = `<button class="lv1-rm-btn" onclick="lv2RemoveBlock(${idx})">${icon('close',11)}</button>`;
    if (bt === 'play') {
      el.className = 'lv1-seq-block';
      el.innerHTML = `${icon('music',12)} play( ${badge} ) ${rmBtn}`;
    } else {
      // Container-style repeat block matching main app
      el.className = 'lv2-seq-repeat';
      el.innerHTML = `
        <div class="lv2-seq-repeat-header">
          ${icon('repeat',12)} repeat ${badge} <span style="margin-left:4px">${lv2RepeatCount}×</span> ${rmBtn}
        </div>
        <div class="lv2-seq-repeat-body">
          <span style="opacity:0.5;font-size:12px">${icon('music',12)} play( ${lv2VarName} )</span>
        </div>
        <div class="lv2-seq-repeat-footer">end</div>
      `;
    }
    dz.appendChild(el);
  });
}

async function lv2P2Play() {
  if (!lv2BlockSeq.length) return;
  const notes = lv2SelectedNotes.length >= 2 ? lv2SelectedNotes : ['C4', 'E4', 'G4', 'A4'];
  await initTone();
  for (const bt of lv2BlockSeq) {
    const times = bt === 'repeat' ? lv2RepeatCount : 1;
    for (let t = 0; t < times; t++) {
      for (const n of notes) { await playNote(n, 1); }
    }
  }
}

function lv2P2Check() {
  const fb = document.getElementById('lv2-p2-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  if (!lv2BlockSeq.length) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Add at least one block to your canvas first.';
    return;
  }
  fb.className = 'lv1-feedback success';
  fb.innerHTML = `Great! <code>play(${lv2VarName})</code> uses the variable — one name, all the notes. Change the variable's notes and every play block updates automatically!`;
  document.getElementById('lv2-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

// 两只老虎: four phrases
const LV2_PHRASE1 = ['C4', 'D4', 'E4', 'C4'];             // 两只老虎
const LV2_PHRASE2 = ['E4', 'F4', 'G4'];                   // 跑得快
const LV2_PHRASE3 = ['G4', 'A4', 'G4', 'F4', 'E4', 'C4'];// 一只没有耳朵/眼睛
const LV2_PHRASE4 = ['C4', 'G3', 'C4'];                   // 真奇怪
const LV2_PHRASES = { p1: LV2_PHRASE1, p2: LV2_PHRASE2, p3: LV2_PHRASE3, p4: LV2_PHRASE4 };
const LV2_PHRASE_LABELS = { p1: 'phrase1', p2: 'phrase2', p3: 'phrase3', p4: 'phrase4' };
const LV2_PHRASE_NAMES = { p1: '两只老虎', p2: '跑得快', p3: '没有耳朵/眼睛', p4: '真奇怪' };
// target: p1 p1 p2 p2 p3 p3 p4 p4
const LV2_HCB_TARGET = ['p1','p1','p2','p2','p3','p3','p4','p4'];
let lv2HCBBlocks = [];

function lv2GetCTConcepts() {
  return [
    {
      title: 'Variable',
      icon: 'variable',
      body: `A <em>variable</em> is a named container for data. <code>phrase1</code> = "两只老虎", <code>phrase2</code> = "跑得快", <code>phrase3</code> = "没有耳朵/眼睛", <code>phrase4</code> = "真奇怪" — four different variables, each storing a different musical idea.`
    },
    {
      title: 'Abstraction',
      icon: 'blocks',
      body: `Instead of listing every note every time, you give each phrase a name. <code>play(phrase3)</code> is simpler than writing <code>G4 A4 G4 F4 E4 C4</code> every time. This is <strong>abstraction</strong>: hiding complexity behind a label.`
    },
    {
      title: 'Reuse',
      icon: 'repeat',
      body: `Each of the four phrases is used <em>twice</em>. Define once, reuse anywhere. Change a variable once and every use updates automatically — that's the real power of variables.`
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
  const labels = ['Concepts', 'Listen', 'Build', 'Discover', 'Create!'];
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
  else if (step === 2) lv2HCBBuild(main);
  else if (step === 3) lv2HCBDiscover(main);
  else if (step === 4) lv2P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv2P3Read(main) {
  lv2ReadOpened = [false, false, false];
  const concepts = lv2GetCTConcepts();
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>两只老虎有四段旋律 — 四个变量！Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${concepts.map((c, i) => `
        <div class="lv1-read-block" id="lv2-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv2ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code" style="font-family:inherit;font-size:13px;font-weight:700;color:var(--text)">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv2-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv2-read-next" onclick="lv2P3Goto(1)" style="display:none">Next: Build the Song →</button>
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

const LV2_PHRASE_COLORS = { p1: '#2E80D0', p2: '#7050D0', p3: '#D06030', p4: '#20A060' };
const LV2_PHRASE_BGALPHA = { p1: 'rgba(46,128,208,0.14)', p2: 'rgba(112,80,208,0.14)', p3: 'rgba(208,96,48,0.14)', p4: 'rgba(32,160,96,0.14)' };

/* ── Song Workshop: Step 1 — Listen ─────────────────────── */
function lv2HCBListen(main) {
  const phraseRows = ['p1','p2','p3','p4'].map(k => {
    const col = LV2_PHRASE_COLORS[k];
    const bg = LV2_PHRASE_BGALPHA[k];
    const label = LV2_PHRASE_LABELS[k];
    const name = LV2_PHRASE_NAMES[k];
    const notes = LV2_PHRASES[k];
    return `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:800;color:${col};background:${bg};border-radius:6px;padding:3px 8px;white-space:nowrap;min-width:56px;text-align:center">${label}</span>
        <div class="lv1-song-card-notes" style="margin:0;flex-wrap:nowrap">
          ${notes.map(n => `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}40">${n}</span>`).join('')}
        </div>
        <span style="font-size:11.5px;color:var(--text-muted);white-space:nowrap">${name}</span>
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">两只老虎</div>
        <p>这首歌有<strong>四段旋律</strong>，我们用四个变量分别存储——注意每个变量颜色不同！</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ 两只老虎 (Two Tigers)</div>
        <div class="lv1-song-card-lyrics">"两只老虎，两只老虎，跑得快，跑得快，一只没有耳朵，一只没有眼睛，真奇怪，真奇怪"</div>

        <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;width:100%">
          ${phraseRows}
        </div>

        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv2HCBPlayFull()">
          ${icon('play',13)} Listen to the song
        </button>
        <div id="lv2-hcb-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv2P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv2HCBPlayFull() {
  const ind = document.getElementById('lv2-hcb-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    for (const n of LV2_PHRASES[k]) { await playNote(n, 0.75); }
  }
  if (ind) ind.style.display = 'none';
}

/* ── Song Workshop: Step 2 — Build ──────────────────────── */
function lv2HCBBuild(main) {
  lv2HCBBlocks = [];
  const varDefs = ['p1','p2','p3','p4'].map(k => {
    const col = LV2_PHRASE_COLORS[k];
    const bg = LV2_PHRASE_BGALPHA[k];
    const label = LV2_PHRASE_LABELS[k];
    const name = LV2_PHRASE_NAMES[k];
    const notes = LV2_PHRASES[k].map(n => `"${n}"`).join(', ');
    return `
      <div class="lv2-defined-var" style="font-size:12px">
        <span class="lv2-dv-label" style="color:${col}">${label} =</span>
        <code class="lv2-dv-code">[${notes}]</code>
        <span style="font-size:11px;color:var(--text-muted)">${name}</span>
        <button class="lv1-play-btn" style="background:${bg};color:var(--text)"
          onclick="lv2HCBPlayPhrase('${k}')">${icon('volume',12)}</button>
      </div>`;
  }).join('');

  const palBlocks = ['p1','p2','p3','p4'].map(k => {
    const col = LV2_PHRASE_COLORS[k];
    const label = LV2_PHRASE_LABELS[k];
    return `
      <div class="lv2-pal-block" style="background:${col};cursor:pointer;margin-bottom:5px" onclick="lv2HCBAddBlock('${k}')">
        ${icon('music',12)} play( <span class="lv2-pal-badge">${label}</span> )
      </div>`;
  }).join('');

  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Use All Four Variables!</div>
      <p class="lv1-activity-sub">
        四个变量都定义好了——每种颜色代表一个变量。按顺序拼出完整的歌：<strong>p1→p1→p2→p2→p3→p3→p4→p4</strong>（共8块）
      </p>

      <div style="display:flex;flex-direction:column;gap:5px">
        ${varDefs}
      </div>

      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette">
          <div class="lv1-palette-label">Blocks</div>
          ${palBlocks}
          <div class="lv1-palette-hint" style="margin-top:4px">tap to add</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;flex:1">
          <div class="lv1-dropzone" id="lv2-hcb-canvas" style="min-height:120px">
            <div class="lv1-dz-placeholder" id="lv2-hcb-ph">Tap blocks to build the song...</div>
          </div>
          <div class="lv1-actions">
            <button class="lv1-btn secondary" onclick="lv2HCBClear()">Clear</button>
            <button class="lv1-btn secondary" onclick="lv2HCBPlay()">Play</button>
            <button class="lv1-btn secondary" onclick="lv2HCBCheck()">Check</button>
          </div>
          <div id="lv2-hcb-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
  lv2HCBRenderCanvas();
}

async function lv2HCBPlayPhrase(k) {
  await initTone();
  for (const n of LV2_PHRASES[k]) { await playNote(n, 0.75); }
}

function lv2HCBAddBlock(type) {
  if (lv2HCBBlocks.length >= 8) return;
  lv2HCBBlocks.push(type);
  lv2HCBRenderCanvas();
}

function lv2HCBRemoveBlock(i) {
  lv2HCBBlocks.splice(i, 1);
  lv2HCBRenderCanvas();
}

function lv2HCBRenderCanvas() {
  const canvas = document.getElementById('lv2-hcb-canvas');
  const ph = document.getElementById('lv2-hcb-ph');
  if (!canvas) return;
  canvas.querySelectorAll('.lv1-seq-block').forEach(e => e.remove());
  if (ph) ph.style.display = lv2HCBBlocks.length ? 'none' : 'block';
  lv2HCBBlocks.forEach((type, i) => {
    const el = document.createElement('div');
    el.className = 'lv1-seq-block';
    el.style.background = LV2_PHRASE_COLORS[type];
    const label = LV2_PHRASE_LABELS[type];
    el.innerHTML = `${icon('music',12)} play( <span style="background:rgba(255,255,255,0.28);padding:1px 7px;border-radius:4px;font-weight:700;font-size:12px">${label}</span> )
      <button class="lv1-rm-btn" onclick="lv2HCBRemoveBlock(${i})">${icon('close',11)}</button>`;
    canvas.appendChild(el);
  });
}

function lv2HCBClear() {
  lv2HCBBlocks = [];
  lv2HCBRenderCanvas();
  const fb = document.getElementById('lv2-hcb-fb');
  if (fb) fb.style.display = 'none';
}

async function lv2HCBPlay() {
  if (!lv2HCBBlocks.length) return;
  await initTone();
  for (const type of lv2HCBBlocks) {
    for (const n of LV2_PHRASES[type]) { await playNote(n, 0.75); }
  }
}

async function lv2HCBCheck() {
  const fb = document.getElementById('lv2-hcb-fb');
  if (!fb) return;
  fb.style.display = 'block';
  const correct = lv2HCBBlocks.length === 8 &&
    lv2HCBBlocks.every((b, i) => b === LV2_HCB_TARGET[i]);
  if (!correct) {
    fb.className = 'lv1-feedback error';
    if (lv2HCBBlocks.length !== 8) {
      fb.textContent = `You need 8 blocks — you have ${lv2HCBBlocks.length}. Order: p1, p1, p2, p2, p3, p3, p4, p4.`;
    } else {
      fb.textContent = 'Order isn\'t right yet! Try: phrase1×2 → phrase2×2 → phrase3×2 → phrase4×2.';
    }
    return;
  }
  fb.className = 'lv1-feedback success';
  fb.textContent = 'Perfect! Listen to the full song...';
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    for (const n of LV2_PHRASES[k]) { await playNote(n, 0.75); }
  }
  fb.textContent = '🎵 两只老虎，两只老虎，跑得快，跑得快，一只没有耳朵，一只没有眼睛，真奇怪，真奇怪！';
  setTimeout(() => lv2P3Goto(3), 1800);
}

/* ── Song Workshop: Step 3 — Discover ───────────────────── */
async function lv2HCBDiscover(main) {
  // Build note-pill rows for all 8 uses: p1 p1 p2 p2 p3 p3 p4 p4
  const pillRows = LV2_HCB_TARGET.map((k, useIdx) => {
    const col = LV2_PHRASE_COLORS[k];
    const bg = LV2_PHRASE_BGALPHA[k];
    const label = LV2_PHRASE_LABELS[k];
    const repeatIdx = LV2_HCB_TARGET.slice(0, useIdx).filter(x => x === k).length; // 0 or 1
    const pills = LV2_PHRASES[k].map((n, j) =>
      `<span class="lv1-song-note-pill" style="background:${bg};border:1.5px solid ${col}50" id="lv2-disc-${k}-${repeatIdx}-${j}">${n}</span>`
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
        <div class="lv1-concept-label">Four variables. Eight plays.</div>
        <p>Every phrase plays twice. Four different ideas, each stored cleanly — that's the power of variables!</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(46,128,208,0.06),rgba(32,160,96,0.06))">
        <div class="lv1-song-card-title">Your song = p1×2 + p2×2 + p3×2 + p4×2</div>
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
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Reuse</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Change once, update everywhere</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv2P3Goto(4)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const k of LV2_HCB_TARGET) {
    for (const n of LV2_PHRASES[k]) { await playNote(n, 0.75); }
  }
}

async function lv2HCBDiscoverPlay() {
  await initTone();
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
  // Track repeat index per phrase key
  const repeatCount = { p1:0, p2:0, p3:0, p4:0 };
  for (const k of LV2_HCB_TARGET) {
    const rIdx = repeatCount[k];
    const phrase = LV2_PHRASES[k];
    for (let j = 0; j < phrase.length; j++) {
      document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
      const pill = document.getElementById(`lv2-disc-${k}-${rIdx}-${j}`);
      if (pill) pill.classList.add('playing');
      await playNote(phrase[j], 0.75);
    }
    repeatCount[k]++;
  }
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

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
  const nd = document.getElementById('lv2-own-name-display');
  if (nd) nd.textContent = valid ? name : '???';
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
