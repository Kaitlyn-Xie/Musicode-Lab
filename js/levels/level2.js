// ════════════════════════════════════════════════════════════
// LEVEL 2 — VARIABLES & MUSIC PHRASES
// ════════════════════════════════════════════════════════════

let lv2Phase = 1;
let lv2SelectedNotes = [];
let lv2MaxNotes = 4;
let lv2VarName = 'melody';
let lv2RepeatCount = 2;
let lv2BlockSeq = [];
let lv2DraggedBlock = null;
let lv2OwnNotes = ['C4', 'E4', 'G4'];
let lv2P3Step = 0;
let lv2ReadOpened = [false, false];

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
          <div class="lv1-phase" id="lv2-ph-2">3 — Python</div>
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
  lv2VarName = 'melody';
  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Pack Your Melody Box</div>
      <p class="lv1-activity-sub">
        In programming, a <strong>variable</strong> is a named box that stores information.
        Pick a name for your variable, fill it with notes, then hit <strong>Play</strong>!
      </p>

      <div class="lv2-name-row">
        <span class="lv2-max-label">Variable name:</span>
        <input class="lv2-name-input" id="lv2-name-input" value="melody" maxlength="16"
          oninput="lv2UpdateVarName(this.value)" autocomplete="off" spellcheck="false">
        <div class="lv2-name-chips">
          ${['melody','scale','tune','melody1','melody2'].map(n =>
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
        <div class="lv2-var-name" id="lv2-var-name-display">melody</div>
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
              <button class="lv1-play-btn" onclick="event.stopPropagation();lv2PlayNote('${note}')">🔊</button>
            </div>
            <div class="lv1-pitch-track">
              <div class="lv1-pitch-fill" style="width:${LV2_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions" style="margin-top:4px">
        <button class="lv1-btn secondary" id="lv2-play-btn" onclick="lv2PlayMelody()">▶ Play</button>
        <button class="lv1-btn secondary" onclick="lv2ClearMelody()">Clear</button>
        <button class="lv1-btn primary" id="lv2-p1-next" onclick="lv2LockIn()" style="display:none">Lock it in! →</button>
      </div>

      <div id="lv2-p1-feedback" class="lv1-feedback" style="display:none"></div>

      <div class="lv1-success-concept" id="lv2-var-reveal">
        <div class="lv1-success-concept-label">That's a Variable!</div>
        <p><strong>Variables</strong> are named containers for data. <span id="lv2-reveal-name" style="font-family:monospace;font-weight:700;color:#1565C0">melody</span> is just the <strong>label</strong> on the box — you chose it, and you could call it anything. The notes are the <strong>value</strong>.</p>
        <p>Every time you write <span id="lv2-reveal-name2" style="font-family:monospace;font-weight:700;color:#1565C0">melody</span> in your code, Python fills in all those notes automatically.</p>
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
  lv2VarName = val || 'melody';
  const display = document.getElementById('lv2-var-name-display');
  if (display) display.textContent = lv2VarName;
  const btn = document.getElementById('lv2-play-btn');
  if (btn) btn.textContent = '▶ Play ' + lv2VarName;
}

function lv2SetVarName(name) {
  lv2VarName = name;
  const input = document.getElementById('lv2-name-input');
  if (input) input.value = name;
  const display = document.getElementById('lv2-var-name-display');
  if (display) display.textContent = name;
  const btn = document.getElementById('lv2-play-btn');
  if (btn) btn.textContent = '▶ Play ' + name;
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
        `<div class="lv2-note-pill">${n}<button onclick="lv2RemoveNote(${i})">✕</button></div>`
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
        <button class="lv1-play-btn" style="background:rgba(46,128,208,0.15);color:var(--text)" onclick="lv2PlayMelody()">🔊</button>
      </div>

      <!-- Palette — full-width stacked blocks like main app -->
      <div class="lv2-p2-palette">
        <div class="lv1-palette-label" style="margin-bottom:6px">🧩 Available Blocks</div>
        <div class="lv2-pal-block" style="background:#2E80D0"
          draggable="true" ondragstart="lv2DragStart(event,'play')" onclick="lv2TapAdd('play')">
          <span>🎵 play(</span>
          <span class="lv2-pal-badge">${lv2VarName}</span>
          <span>)</span>
        </div>
        <div class="lv2-pal-block" style="background:#D4A020"
          draggable="true" ondragstart="lv2DragStart(event,'repeat')" onclick="lv2TapAdd('repeat')">
          <span>🔁 repeat(</span>
          <span class="lv2-pal-badge">${lv2VarName}</span>
          <span>)</span>
        </div>
        <div class="lv2-repeat-ctrl">
          <span class="lv2-max-label">Repeat:</span>
          <button class="lv2-max-btn" onclick="lv2ChangeRepeat(-1)">−</button>
          <span class="lv2-max-val" id="lv2-rep-val">${lv2RepeatCount}</span>
          <button class="lv2-max-btn" onclick="lv2ChangeRepeat(1)">+</button>
          <span class="lv2-max-hint">times &nbsp;·&nbsp; Python: <code style="font-size:11px">for i in range(<span id="lv2-rep-py">${lv2RepeatCount}</span>):</code></span>
        </div>
        <div class="lv1-palette-hint" style="text-align:left;margin-top:2px">click or drag to add →</div>
      </div>

      <!-- Canvas -->
      <div class="lv1-activity-heading" style="margin-top:16px">Your Program</div>
      <div class="lv1-dropzone lv2-p2-canvas" id="lv2-dropzone"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="lv2DropBlock(event)">
        <div class="lv1-dz-placeholder" id="lv2-dz-ph">Click a block above or drag it here...</div>
      </div>

      <div class="lv1-actions" style="margin-top:10px">
        <button class="lv1-btn secondary" onclick="lv2P2Clear()">🗑 Clear</button>
        <button class="lv1-btn secondary" onclick="lv2P2Play()">▶ Play</button>
        <button class="lv1-btn secondary" onclick="lv2P2Check()">✓ Check</button>
        <button class="lv1-btn primary" id="lv2-p2-next" onclick="lv2ShowPhase(3)" style="display:none">Next: Python →</button>
      </div>
      <div id="lv2-p2-feedback" class="lv1-feedback" style="display:none"></div>
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
    const rmBtn = `<button class="lv1-rm-btn" onclick="lv2RemoveBlock(${idx})">✕</button>`;
    if (bt === 'play') {
      el.className = 'lv1-seq-block';
      el.innerHTML = `🎵 play( ${badge} ) ${rmBtn}`;
    } else {
      // Container-style repeat block matching main app
      el.className = 'lv2-seq-repeat';
      el.innerHTML = `
        <div class="lv2-seq-repeat-header">
          🔁 repeat ${badge} <span style="margin-left:4px">${lv2RepeatCount}×</span> ${rmBtn}
        </div>
        <div class="lv2-seq-repeat-body">
          <span style="opacity:0.5;font-size:12px">🎵 play( ${lv2VarName} )</span>
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
  fb.innerHTML = 'Great! <code>play(melody)</code> uses the variable — one name, all the notes. Change the variable\'s notes and every play block updates automatically!';
  document.getElementById('lv2-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — Python stepper
// ══════════════════════════════════════════════════════
function lv2GetCodeLines(notes) {
  const vn = lv2VarName || 'melody';
  const noteList = notes.map(n => `<span class="py-str">"${n}"</span>`).join('<span class="py-op">, </span>');
  return [
    {
      code: `<span class="py-var">${vn}</span> <span class="py-op">=</span> [${noteList}]`,
      explain: `<strong>${vn}</strong> is a <em>variable</em> — a named container. The <code>=</code> sign assigns the value on the right to the name on the left. The square brackets <code>[ ]</code> create a <em>list</em> of note strings.<br><br><strong>Naming tip:</strong> you could call it <code>mySong</code>, <code>phrase_1</code>, or <code>notes</code> — as long as you use the same name consistently throughout your code.`
    },
    {
      code: `<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${vn}</span><span class="py-op">)</span>`,
      explain: `This calls the <strong>play()</strong> function and passes <code>${vn}</code> as the argument. Python looks up what <code>${vn}</code> contains and plays each note in order.<br><br>You only write the variable name — not the notes themselves. The variable does the remembering.`
    }
  ];
}

const LV2_QUIZZES = [
  {
    q: 'What does <code>melody = ["C4", "E4", "G4"]</code> do?',
    opts: [
      { t: 'Creates a variable named melody and stores 3 notes in it', ok: true },
      { t: 'Plays the notes C4, E4, and G4 immediately', ok: false },
      { t: 'Defines a function called melody', ok: false },
      { t: 'Checks if the notes are in the right order', ok: false }
    ],
    exp: '<strong>Correct!</strong> The <code>=</code> sign <em>assigns</em> a value. Left side is the name (<code>melody</code>), right side is the value (a list of notes).'
  },
  {
    q: 'You change <code>melody = ["A4", "G4", "E4"]</code>. What does <code>play(melody)</code> now play?',
    opts: [
      { t: 'The original notes — variables don\'t change after creation', ok: false },
      { t: 'A4, then G4, then E4 — the updated value', ok: true },
      { t: 'An error — you can\'t reassign a variable', ok: false },
      { t: 'Nothing — play() needs specific note names, not a variable', ok: false }
    ],
    exp: '<strong>Exactly!</strong> When you update the variable, every use of it updates too. Change once, affect everywhere — that\'s the power of variables.'
  },
  {
    q: 'Which of these is a valid Python variable name?',
    opts: [
      { t: 'my melody (with a space)', ok: false },
      { t: '1melody (starts with a number)', ok: false },
      { t: 'melody! (special character)', ok: false },
      { t: 'myMelody', ok: true }
    ],
    exp: '<strong>Right!</strong> Variable names can use letters, numbers, and underscores, but must <em>start with a letter or underscore</em>. No spaces or special characters.'
  }
];

function lv2RenderPhase3(body) {
  lv2P3Step = 0;
  const notes = lv2SelectedNotes.length >= 2 ? lv2SelectedNotes : ['C4', 'E4', 'G4', 'A4'];
  const vn = lv2VarName || 'melody';
  const notePyList = notes.map(n => `<span class="py-str">"${n}"</span>`).join('<span class="py-op">, </span>');

  body.innerHTML = `
    <div class="lv1-p3-split">
      <div class="lv1-p3-sidebar" id="lv2-p3-sidebar">
        <div class="lv1-p3-sidebar-label">Reference</div>
        <div>
          <div class="lv1-compare-title">Your block code</div>
          <div class="lv1-block-preview" style="margin-top:7px">
            <div class="lv1-prev-block" style="font-size:11px;padding:5px 9px;background:rgba(46,128,208,0.12);color:#1860A0">
              ${vn} = [${notes.join(', ')}]
            </div>
            <div class="lv1-prev-block" style="font-size:11px;padding:5px 9px;margin-top:4px">
              play( ${vn} )
            </div>
          </div>
        </div>
        <div>
          <div class="lv1-compare-title" style="margin-bottom:7px">Python equivalent</div>
          <div class="lv1-code-panel" style="font-size:11.5px;padding:11px 13px;line-height:1.85">
            <span class="lv1-code-line"><span class="py-var">${vn}</span><span class="py-op"> = </span>[${notePyList}]</span>
            <span class="lv1-code-line">&nbsp;</span>
            <span class="lv1-code-line"><span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${vn}</span><span class="py-op">)</span></span>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);font-weight:600;line-height:1.5;padding-top:4px">
          <code style="font-size:11px">${vn}</code> is just one option — variable names are up to you!
        </div>
      </div>

      <div class="lv1-p3-resizer" id="lv2-p3-resizer"></div>

      <div class="lv1-p3-right">
        <div class="lv1-p3-nav-bar">
          <div class="lv1-p3-nav" id="lv2-p3-nav"></div>
        </div>
        <div class="lv1-p3-right-scroll">
          <div id="lv2-p3-main"></div>
        </div>
      </div>
    </div>
  `;

  lv2P3Goto(0);

  const resizer = document.getElementById('lv2-p3-resizer');
  const sidebar = document.getElementById('lv2-p3-sidebar');
  if (resizer && sidebar) {
    let startX, startW;
    resizer.addEventListener('mousedown', e => {
      startX = e.clientX;
      startW = sidebar.getBoundingClientRect().width;
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      const onMove = ev => {
        sidebar.style.width = Math.min(420, Math.max(140, startW + (ev.clientX - startX))) + 'px';
      };
      const onUp = () => {
        resizer.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }
}

function lv2P3UpdateNav(step) {
  const labels = ['Read', 'Quiz 1', 'Quiz 2', 'Quiz 3', 'Fill in', 'Write!'];
  const nav = document.getElementById('lv2-p3-nav');
  if (!nav) return;
  nav.innerHTML = '';
  labels.forEach((label, i) => {
    const dot = document.createElement('div');
    dot.className = 'lv1-p3-dot' + (i === step ? ' active' : (i < step ? ' done' : ''));
    dot.textContent = i < step ? '✓' : (i + 1);
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
  else if (step >= 1 && step <= 3) lv2P3Quiz(main, step - 1);
  else if (step === 4) lv2P3FillIn(main);
  else if (step === 5) lv2P3WriteOwn(main);
}

function lv2P3Read(main) {
  lv2ReadOpened = [false, false];
  const notes = lv2SelectedNotes.length >= 2 ? lv2SelectedNotes : ['C4', 'E4', 'G4', 'A4'];
  const lines = lv2GetCodeLines(notes);
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">From Blocks to Python</div>
        <p>Your block code and Python express the same idea. Click each line to understand what it means.</p>
      </div>
      <div class="lv1-read-block" id="lv2-read-0">
        <button class="lv1-read-line-btn" onclick="lv2ReadToggle(0)">
          <span class="lv1-read-expand-icon">▶</span>
          <span class="lv1-read-code">${lines[0].code}</span>
        </button>
        <div class="lv1-read-explanation" id="lv2-re-0">${lines[0].explain}</div>
      </div>
      <div class="lv1-read-block" id="lv2-read-1">
        <button class="lv1-read-line-btn" onclick="lv2ReadToggle(1)">
          <span class="lv1-read-expand-icon">▶</span>
          <span class="lv1-read-code">${lines[1].code}</span>
        </button>
        <div class="lv1-read-explanation" id="lv2-re-1">${lines[1].explain}</div>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv2-read-next" onclick="lv2P3Goto(1)" style="display:none">Next: Quiz →</button>
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

function lv2P3Quiz(main, qIdx) {
  const q = LV2_QUIZZES[qIdx];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <p class="lv1-activity-sub" style="font-size:13px;color:var(--text)">Question ${qIdx + 1} of 3</p>
      <div class="lv1-activity-heading" style="font-size:14px">${q.q}</div>
      <div class="lv1-quiz-options" id="lv2-qz-opts">
        ${q.opts.map(o =>
          `<button class="lv1-quiz-opt" onclick="lv2P3Answer(this,${o.ok},${qIdx})">${o.t}</button>`
        ).join('')}
      </div>
      <div id="lv2-qz-fb" class="lv1-feedback" style="display:none"></div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv2-qz-next" onclick="lv2P3Goto(${lv2P3Step + 1})" style="display:none">
          ${qIdx < 2 ? 'Next question →' : 'Next: Fill in the blanks →'}
        </button>
      </div>
    </div>
  `;
}

function lv2P3Answer(btn, correct, qIdx) {
  document.querySelectorAll('#lv2-qz-opts .lv1-quiz-opt').forEach(b => {
    b.disabled = true; b.style.opacity = '0.55';
  });
  btn.style.opacity = '1';
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    const correctText = LV2_QUIZZES[qIdx].opts.find(o => o.ok).t;
    document.querySelectorAll('#lv2-qz-opts .lv1-quiz-opt').forEach(b => {
      if (b.textContent === correctText) { b.classList.add('correct'); b.style.opacity = '1'; }
    });
  }
  const fb = document.getElementById('lv2-qz-fb');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'lv1-feedback ' + (correct ? 'success' : 'error');
    fb.innerHTML = correct ? LV2_QUIZZES[qIdx].exp : 'Not quite! ' + LV2_QUIZZES[qIdx].exp;
  }
  document.getElementById('lv2-qz-next').style.display = 'inline-flex';
}

function lv2P3FillIn(main) {
  const notes = lv2SelectedNotes.length >= 2 ? lv2SelectedNotes : ['C4', 'E4', 'G4', 'A4'];
  const noteSpans = notes.map(n => `<span class="py-str">"${n}"</span>`).join('<span class="py-op">, </span>');
  const vn = lv2VarName || 'melody';
  const blankW = Math.max(70, vn.length * 9 + 20) + 'px';
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Fill in the Blanks</div>
      <p class="lv1-activity-sub">
        Look at the Python code in the <strong>left panel</strong> — what variable name was used?
        Type it into both blanks below.
      </p>
      <div class="lv1-code-panel" style="line-height:2.2">
        <span class="lv1-code-line">
          <input class="lv1-code-blank" id="lv2-blank1" placeholder="?????" autocomplete="off" spellcheck="false" style="width:${blankW}">
          <span class="py-op"> = </span>[${noteSpans}]
        </span>
        <span class="lv1-code-line">
          <span class="py-fn">play</span><span class="py-op">(</span><input class="lv1-code-blank" id="lv2-blank2" placeholder="?????" autocomplete="off" spellcheck="false" style="width:${blankW}"><span class="py-op">)</span>
        </span>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv2P3CheckFill()">Check</button>
        <button class="lv1-btn primary" id="lv2-fill-next" onclick="lv2P3Goto(5)" style="display:none">Next: Write your own →</button>
      </div>
      <div id="lv2-fill-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv2P3CheckFill() {
  const vn = lv2VarName || 'melody';
  const b1 = document.getElementById('lv2-blank1').value.trim();
  const b2 = document.getElementById('lv2-blank2').value.trim();
  const fb = document.getElementById('lv2-fill-fb');
  fb.style.display = 'block';
  const ok1 = b1 === vn, ok2 = b2 === vn;
  document.getElementById('lv2-blank1').className = 'lv1-code-blank ' + (ok1 ? 'ok' : 'bad');
  document.getElementById('lv2-blank2').className = 'lv1-code-blank ' + (ok2 ? 'ok' : 'bad');
  if (ok1 && ok2) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = `Correct! Both blanks use <code>${vn}</code> — the same name in the definition and the call. That's how Python knows they refer to the same thing.`;
    document.getElementById('lv2-fill-next').style.display = 'inline-flex';
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Check the Python code in the left panel — what is the variable called?';
  }
}

function lv2P3WriteOwn(main) {
  lv2OwnNotes = ['C4', 'E4', 'G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-activity-heading">Write Your Own Variable</div>
      <p class="lv1-activity-sub">
        Choose your own variable name and pick up to 4 notes. Hit <strong>Play</strong> to hear your melody, then complete the level!
      </p>
      <div class="lv1-code-panel" style="line-height:2.2">
        <span class="lv1-code-line">
          <input class="lv1-code-blank" id="lv2-own-name" value="myMelody" maxlength="20"
            autocomplete="off" spellcheck="false" style="width:110px" oninput="lv2OwnPreview()">
          <span class="py-op"> = </span>[<span id="lv2-own-preview-notes" style="color:#CE9178">"C4", "E4", "G4"</span>]
        </span>
        <span class="lv1-code-line">
          <span class="py-fn">play</span><span class="py-op">(</span><span id="lv2-own-name-display" class="py-var">myMelody</span><span class="py-op">)</span>
        </span>
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
        <button class="lv1-btn secondary" onclick="lv2OwnPlay()">▶ Play</button>
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
