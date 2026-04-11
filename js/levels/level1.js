// ════════════════════════════════════════════════════════════
// LEVEL 1 — ALGORITHMS & SEQUENCING
// ════════════════════════════════════════════════════════════
let lv1Phase = 1;
const LV1_CORRECT_ORDER = ['C4','E4','G4','A4'];
let lv1ScrambleSrc = [];
let lv1Target = [null, null, null, null];
let lv1PickedIdx = null; // kept for compat, unused in drag mode
let lv1BlockSeq = [];
let lv1DraggedNote = null;
let lv1DragInfo = null; // { from: 'source'|'slot', idx, slotIdx, note }

function renderLevel1() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <span class="lv1-lvbadge">Level 1</span>
          <span class="lv1-title-text">Algorithms &amp; Sequencing</span>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv1-ph1">1 — Intro</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv1-ph2">2 — Blocks</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv1-ph3">3 — Python</div>
        </div>
      </div>
      <div class="lv1-body" id="lv1-body"></div>
    </div>
  `;
  lv1Phase = 1;
  lv1ShowPhase(1);
}

function lv1SetPhaseBar(p) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('lv1-ph' + i);
    if (!el) continue;
    el.className = 'lv1-phase' + (i === p ? ' active' : (i < p ? ' done' : ''));
  }
}

function lv1ShowPhase(p) {
  lv1Phase = p;
  lv1SetPhaseBar(p);
  const body = document.getElementById('lv1-body');
  if (!body) return;
  if (p === 1) lv1RenderPhase1(body);
  else if (p === 2) lv1RenderPhase2(body);
  else if (p === 3) lv1RenderPhase3(body);
}

// Pitch bar widths (%) — proportional to real frequency (C4=low, A4=high)
const LV1_PITCH_PCT = { 'C4': 20, 'E4': 48, 'G4': 76, 'A4': 100 };

/* ── Phase 1: Intro — Sort the Scale ─────────────────── */
function lv1RenderPhase1(body) {
  lv1ScrambleSrc = [
    {note:'G4', placed:false},
    {note:'C4', placed:false},
    {note:'A4', placed:false},
    {note:'E4', placed:false}
  ];
  lv1Target = [null, null, null, null];
  lv1PickedIdx = null;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Sort the Notes — Lowest to Highest</div>
      <p class="lv1-activity-sub">
        Four notes are scrambled below. Click <strong>🔊</strong> on each card to hear how it sounds,
        then pick a card and place it in the right slot — <strong>lowest pitch first</strong>.
      </p>

      <div class="lv1-source" id="lv1-source"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted)">
          lowest pitch → → → highest pitch
        </div>
        <button class="lv1-btn secondary" style="font-size:11px;padding:5px 12px" onclick="lv1ToggleHint()">Need a hint?</button>
      </div>

      <div class="lv1-hint-box" id="lv1-hint">
        <strong>Hint:</strong> A higher bar means a higher pitch. Lower sounds come first!
        <div class="lv1-hint-pitch-row">
          <div class="lv1-hint-note">
            <div class="lv1-hint-bar" style="height:18px"></div>
            <div class="lv1-hint-label">C4</div>
          </div>
          <div class="lv1-hint-note">
            <div class="lv1-hint-bar" style="height:28px"></div>
            <div class="lv1-hint-label">E4</div>
          </div>
          <div class="lv1-hint-note">
            <div class="lv1-hint-bar" style="height:40px"></div>
            <div class="lv1-hint-label">G4</div>
          </div>
          <div class="lv1-hint-note">
            <div class="lv1-hint-bar" style="height:52px"></div>
            <div class="lv1-hint-label">A4</div>
          </div>
        </div>
      </div>

      <div class="lv1-target-row">
        <div class="lv1-target-slot" id="lv1-slot-0"><span class="lv1-slot-num">1st</span></div>
        <div class="lv1-target-slot" id="lv1-slot-1"><span class="lv1-slot-num">2nd</span></div>
        <div class="lv1-target-slot" id="lv1-slot-2"><span class="lv1-slot-num">3rd</span></div>
        <div class="lv1-target-slot" id="lv1-slot-3"><span class="lv1-slot-num">4th</span></div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" id="lv1-p1-check" onclick="lv1CheckPhase1()" style="display:none">Check my order</button>
        <button class="lv1-btn primary" id="lv1-p1-next" onclick="lv1ShowPhase(2)" style="display:none">Next: Block Code →</button>
      </div>
      <div id="lv1-p1-feedback" class="lv1-feedback" style="display:none"></div>

      <!-- Revealed AFTER success -->
      <div class="lv1-success-concept" id="lv1-algo-reveal">
        <div class="lv1-success-concept-label">What you just did = an Algorithm!</div>
        <p>An <strong>algorithm</strong> is a precise, step-by-step set of instructions. By putting the notes in order, you told the computer <em>exactly</em> what to play first, second, third...</p>
        <p>That ordered sequence <strong>is</strong> the algorithm. Now let's write it as code!</p>
      </div>
    </div>
  `;
  lv1RenderSource();
  lv1RenderSlots();
}

function lv1ToggleHint() {
  const h = document.getElementById('lv1-hint');
  if (h) h.classList.toggle('visible');
}

// Build one note card (shared by source + placed slots)
function lv1BuildNoteCard(note, options) {
  // options: { placed, dragInfo, onremove }
  const pct = LV1_PITCH_PCT[note] || 50;
  const card = document.createElement('div');
  card.className = 'lv1-note-card' + (options.placed ? ' placed' : '');
  card.draggable = true;

  card.innerHTML =
    '<div class="lv1-card-top">' +
      '<div class="lv1-note-name">' + note + '</div>' +
      '<button class="lv1-play-btn" title="Hear this note">🔊</button>' +
    '</div>' +
    '<div class="lv1-pitch-track"><div class="lv1-pitch-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="lv1-note-label">' + (options.placed ? 'drag to move' : 'drag to place') + '</div>';

  card.querySelector('.lv1-play-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    lv1PlaySingleNote(note);
  });

  card.addEventListener('dragstart', function(e) {
    lv1DragInfo = options.dragInfo;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  card.addEventListener('dragend', function() {
    card.classList.remove('dragging');
  });

  // Click placed card to return it to source
  if (options.onremove) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.lv1-play-btn')) return;
      options.onremove();
    });
  }

  return card;
}

function lv1RenderSource() {
  const src = document.getElementById('lv1-source');
  if (!src) return;
  src.innerHTML = '';
  const unplaced = lv1ScrambleSrc.filter(x => !x.placed);
  if (unplaced.length === 0) {
    src.innerHTML = '<div class="lv1-source-empty">All notes placed!</div>';
  } else {
    lv1ScrambleSrc.forEach((item, idx) => {
      if (item.placed) return;
      const card = lv1BuildNoteCard(item.note, {
        placed: false,
        dragInfo: { from: 'source', idx }
      });
      src.appendChild(card);
    });
  }
  // Source area accepts drops (drag from slot back)
  src.ondragover = e => { e.preventDefault(); src.classList.add('drag-over'); };
  src.ondragleave = () => src.classList.remove('drag-over');
  src.ondrop = e => {
    e.preventDefault();
    src.classList.remove('drag-over');
    if (!lv1DragInfo) return;
    if (lv1DragInfo.from === 'slot') {
      lv1UnplaceSlot(lv1DragInfo.slotIdx);
    }
    lv1DragInfo = null;
  };
}

function lv1RenderSlots() {
  lv1Target.forEach((val, i) => {
    const slot = document.getElementById('lv1-slot-' + i);
    if (!slot) return;
    slot.innerHTML = '';
    // Remove old click handler
    slot.onclick = null;
    if (val) {
      const card = lv1BuildNoteCard(val, {
        placed: true,
        dragInfo: { from: 'slot', slotIdx: i, note: val },
        onremove: () => lv1UnplaceSlot(i)
      });
      slot.appendChild(card);
    } else {
      slot.innerHTML = '<span class="lv1-slot-num">' + ['1st','2nd','3rd','4th'][i] + '</span>';
    }
    // Slot drag-over / drag-leave
    slot.ondragover = e => { e.preventDefault(); slot.classList.add('drag-over'); };
    slot.ondragleave = () => slot.classList.remove('drag-over');
  });
  // Set drop handlers with correct closure over slot index
  [0,1,2,3].forEach(i => {
    const slot = document.getElementById('lv1-slot-' + i);
    if (!slot) return;
    slot.ondrop = function(e) {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (!lv1DragInfo) return;
      if (lv1DragInfo.from === 'source') {
        const srcItem = lv1ScrambleSrc[lv1DragInfo.idx];
        if (!srcItem) return;
        if (lv1Target[i] !== null) {
          const evicted = lv1ScrambleSrc.find(x => x.note === lv1Target[i] && x.placed);
          if (evicted) evicted.placed = false;
        }
        lv1Target[i] = srcItem.note;
        srcItem.placed = true;
      } else if (lv1DragInfo.from === 'slot') {
        const fromSlot = lv1DragInfo.slotIdx;
        if (fromSlot === i) return;
        const tmp = lv1Target[i];
        lv1Target[i] = lv1Target[fromSlot];
        lv1Target[fromSlot] = tmp;
      }
      lv1DragInfo = null;
      lv1RenderSource();
      lv1RenderSlots();
    };
  });
  const allFilled = lv1Target.every(x => x !== null);
  const checkBtn = document.getElementById('lv1-p1-check');
  if (checkBtn) checkBtn.style.display = allFilled ? 'inline-flex' : 'none';
}

async function lv1PlaySingleNote(note) {
  await initTone();
  await playNote(note, 1);
}

function lv1UnplaceSlot(slotIdx) {
  const note = lv1Target[slotIdx];
  if (!note) return;
  const item = lv1ScrambleSrc.find(x => x.note === note && x.placed);
  if (item) item.placed = false;
  lv1Target[slotIdx] = null;
  lv1RenderSource();
  lv1RenderSlots();
}

async function lv1CheckPhase1() {
  const correct = LV1_CORRECT_ORDER;
  const isCorrect = lv1Target.every((n, i) => n === correct[i]);
  const fb = document.getElementById('lv1-p1-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  if (isCorrect) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Correct! Listen to your scale play...';
    await initTone();
    for (const n of correct) { await playNote(n, 1); }
    fb.textContent = 'C4 → E4 → G4 → A4 — from lowest to highest. Great ear!';
    document.getElementById('lv1-p1-check').style.display = 'none';
    document.getElementById('lv1-p1-next').style.display = 'inline-flex';
    // Reveal the "what is an algorithm" concept AFTER they succeed
    const reveal = document.getElementById('lv1-algo-reveal');
    if (reveal) reveal.classList.add('visible');
  } else {
    fb.className = 'lv1-feedback error';
    fb.innerHTML = 'Not quite! Click <strong>🔊</strong> on each card to hear the notes — lower sounds come first. Try the hint button if you need help!';
  }
}

/* ── Phase 2: Block Code ──────────────────────────────── */
function lv1RenderPhase2(body) {
  lv1BlockSeq = [];
  lv1DraggedNote = null;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">From Algorithm to Block Code</div>
        <p>You just wrote the algorithm in plain language. Now let's tell the computer using <strong>blocks</strong> — each block is one instruction.</p>
        <p>Goal: build the sequence <strong>C4 → E4 → G4 → A4</strong> by dragging (or tapping) blocks into the canvas below.</p>
      </div>

      <div class="lv1-activity-heading">Build the sequence</div>

      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette">
          <div class="lv1-palette-label">Blocks</div>
          ${['C4','E4','G4','A4'].map(n =>
            `<div style="display:flex;align-items:center;gap:4px">
               <div class="lv1-block-chip" style="flex:1" draggable="true"
                 ondragstart="lv1DragStart(event,'${n}')"
                 onclick="lv1TapAdd('${n}')">play note ${n}</div>
               <button class="lv1-play-btn" style="background:rgba(46,128,208,0.18);color:var(--text)"
                 onclick="lv1PlaySingleNote('${n}')">🔊</button>
             </div>`
          ).join('')}
          <div class="lv1-palette-hint">drag or tap to add</div>
        </div>
        <div class="lv1-dropzone" id="lv1-dropzone"
             ondragover="event.preventDefault();this.classList.add('drag-over')"
             ondragleave="this.classList.remove('drag-over')"
             ondrop="lv1DropNote(event)">
          <div class="lv1-dz-placeholder" id="lv1-dz-ph">Drop blocks here...</div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv1ClearBlocks()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv1PlayBlocks()">Play</button>
        <button class="lv1-btn secondary" onclick="lv1CheckPhase2()">Check</button>
        <button class="lv1-btn primary" id="lv1-p2-next" onclick="lv1ShowPhase(3)" style="display:none">Next: Python →</button>
      </div>
      <div id="lv1-p2-feedback" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv1DragStart(event, note) {
  lv1DraggedNote = note;
  event.dataTransfer.setData('text/plain', note);
}

function lv1DropNote(event) {
  event.preventDefault();
  document.getElementById('lv1-dropzone').classList.remove('drag-over');
  const note = lv1DraggedNote || event.dataTransfer.getData('text/plain');
  if (note) lv1AddBlock(note);
  lv1DraggedNote = null;
}

function lv1TapAdd(note) { lv1AddBlock(note); }

function lv1AddBlock(note) {
  lv1BlockSeq.push(note);
  lv1RenderBlocks();
}

function lv1RemoveBlock(idx) {
  lv1BlockSeq.splice(idx, 1);
  lv1RenderBlocks();
}

function lv1ClearBlocks() {
  lv1BlockSeq = [];
  lv1RenderBlocks();
}

function lv1RenderBlocks() {
  const dz = document.getElementById('lv1-dropzone');
  const ph = document.getElementById('lv1-dz-ph');
  if (!dz) return;
  dz.querySelectorAll('.lv1-seq-block').forEach(e => e.remove());
  if (ph) ph.style.display = lv1BlockSeq.length ? 'none' : 'block';
  lv1BlockSeq.forEach((note, idx) => {
    const el = document.createElement('div');
    el.className = 'lv1-seq-block';
    el.innerHTML = 'play note <strong style="margin-left:4px">' + note + '</strong>' +
      '<button class="lv1-rm-btn" onclick="lv1RemoveBlock(' + idx + ')">✕</button>';
    dz.appendChild(el);
  });
}

async function lv1PlayBlocks() {
  if (!lv1BlockSeq.length) return;
  await initTone();
  for (const n of lv1BlockSeq) { await playNote(n, 1); }
}

function lv1CheckPhase2() {
  const correct = LV1_CORRECT_ORDER;
  const fb = document.getElementById('lv1-p2-feedback');
  if (!fb) return;
  fb.style.display = 'block';
  const hasAll = correct.every(n => lv1BlockSeq.includes(n));
  if (!hasAll) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Make sure you include all four notes: C4, E4, G4, and A4.';
    return;
  }
  // Check order
  let lastIdx = -1, inOrder = true;
  for (const n of correct) {
    const idx = lv1BlockSeq.indexOf(n, lastIdx + 1);
    if (idx <= lastIdx) { inOrder = false; break; }
    lastIdx = idx;
  }
  if (inOrder) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Nice! Your blocks play C4 → E4 → G4 → A4 in order. That\'s an algorithm expressed as code!';
    document.getElementById('lv1-p2-next').style.display = 'inline-flex';
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'All four notes are there, but the order isn\'t right. They should go C4 → E4 → G4 → A4.';
  }
}

/* ── Phase 3: Python — 4 steps ───────────────────────── */
let lv1P3Step = 0; // 0=read 1=quiz1 2=quiz2 3=quiz3 4=fillin 5=write

const LV1_QUIZZES = [
  {
    q: 'What is <code>scale</code> in <code>scale = ["C4","E4","G4","A4"]</code>?',
    opts: [
      { t: 'A variable that stores a list of 4 notes', ok: true },
      { t: 'A function that plays the notes automatically', ok: false },
      { t: 'A loop that repeats 4 times', ok: false },
      { t: 'The name of the song being played', ok: false }
    ],
    exp: '<strong>Correct!</strong> <code>scale</code> is a <em>variable</em> — a named container. Here it holds a <em>list</em> of strings, each being a note name.'
  },
  {
    q: 'If <code>scale</code> has 4 notes, how many times does <code>play(note)</code> run?',
    opts: [
      { t: '1 time — the loop runs once', ok: false },
      { t: '2 times — half of 4', ok: false },
      { t: '4 times — once per note in the list', ok: true },
      { t: '8 times — each note plays twice', ok: false }
    ],
    exp: '<strong>Right!</strong> The <code>for</code> loop runs <em>once per item</em>. 4 notes in <code>scale</code> → <code>play(note)</code> runs 4 times.'
  },
  {
    q: 'We change the code to <code>scale = ["C4", "E4"]</code>. How many notes play now?',
    opts: [
      { t: '4 — the loop always runs 4 times', ok: false },
      { t: '2 — one for each item in the new list', ok: true },
      { t: '0 — the list is too short to work', ok: false },
      { t: 'It depends on how fast the tempo is', ok: false }
    ],
    exp: '<strong>Exactly!</strong> The loop adapts to the list size. Fewer items = fewer runs. This is what makes algorithms <em>flexible</em>!'
  }
];

function lv1RenderPhase3(body) {
  lv1P3Step = 0;
  body.innerHTML = `
    <div class="lv1-p3-split">

      <!-- Left sidebar: always-visible reference -->
      <div class="lv1-p3-sidebar">
        <div class="lv1-p3-sidebar-label">Reference</div>

        <div>
          <div class="lv1-compare-title">Your block code</div>
          <div class="lv1-block-preview" style="margin-top:7px">
            ${LV1_CORRECT_ORDER.map(n =>
              '<div class="lv1-prev-block" style="font-size:11px;padding:5px 9px">play note ' + n + '</div>'
            ).join('')}
          </div>
        </div>

        <div>
          <div class="lv1-compare-title" style="margin-bottom:7px">Python equivalent</div>
          <div class="lv1-code-panel" style="font-size:11.5px;padding:11px 13px;line-height:1.85">
            <span class="lv1-code-line"><span class="py-var">scale</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">,</span></span>
            <span class="lv1-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-str">"G4"</span><span class="py-op">, </span><span class="py-str">"A4"</span>]</span>
            <span class="lv1-code-line">&nbsp;</span>
            <span class="lv1-code-line"><span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span> <span class="py-var">scale</span><span class="py-op">:</span></span>
            <span class="lv1-code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span></span>
          </div>
        </div>

        <div style="font-size:11px;color:var(--text-muted);font-weight:600;line-height:1.5;padding-top:4px">
          The name <code style="font-size:11px">scale</code> is just one option — variable names are up to you!
        </div>
      </div>

      <!-- Resize handle -->
      <div class="lv1-p3-resizer" id="lv1-p3-resizer"></div>

      <!-- Right panel: stepper + activities -->
      <div class="lv1-p3-right">
        <div class="lv1-p3-nav-bar">
          <div class="lv1-p3-nav" id="lv1-p3-nav"></div>
        </div>
        <div class="lv1-p3-right-scroll">
          <div id="lv1-p3-main"></div>
        </div>
      </div>

    </div>
  `;
  lv1P3Goto(0);

  // Draggable sidebar resizer
  const resizer = document.getElementById('lv1-p3-resizer');
  const sidebar = resizer && resizer.previousElementSibling;
  if (resizer && sidebar) {
    let startX, startW;
    resizer.addEventListener('mousedown', e => {
      startX = e.clientX;
      startW = sidebar.getBoundingClientRect().width;
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      const onMove = ev => {
        const newW = Math.min(420, Math.max(140, startW + (ev.clientX - startX)));
        sidebar.style.width = newW + 'px';
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

function lv1P3UpdateNav(step) {
  const labels = ['Read','Quiz 1','Quiz 2','Quiz 3','Fill in','Write!'];
  const nav = document.getElementById('lv1-p3-nav');
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

function lv1P3Goto(step) {
  lv1P3Step = step;
  lv1P3UpdateNav(step);
  const main = document.getElementById('lv1-p3-main');
  if (!main) return;
  if (step === 0) lv1P3Read(main);
  else if (step >= 1 && step <= 3) lv1P3Quiz(main, step - 1);
  else if (step === 4) lv1P3FillIn(main);
  else if (step === 5) lv1P3WriteOwn(main);
}

/* Step 0 — Read the code */
const LV1_CODE_LINES = [
  {
    code: '<span class="py-var">scale</span> <span class="py-op">=</span> [<span class="py-str">"C4"</span><span class="py-op">,</span> <span class="py-str">"E4"</span><span class="py-op">,</span> <span class="py-str">"G4"</span><span class="py-op">,</span> <span class="py-str">"A4"</span>]',
    explain: '<strong>scale</strong> is a <em>variable</em> — a named box that stores data. The square brackets <code>[ ]</code> mean it\'s a <em>list</em>. This list holds 4 note names as text strings.<br><br><strong>Note on naming:</strong> the name <code>scale</code> is just what the programmer chose. You could call it <code>melody</code>, <code>my_notes</code>, or anything else — as long as you use the same name consistently throughout your code.'
  },
  {
    code: '<span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span> <span class="py-var">scale</span><span class="py-op">:</span>',
    explain: 'This is a <strong>for loop</strong>. It goes through every item in <code>scale</code> one by one. Each time, it puts the current item into a temporary variable called <code>note</code>.'
  },
  {
    code: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span>',
    explain: 'This line is <em>indented</em> (shifted right) — that tells Python it\'s <em>inside</em> the loop. It plays whatever note is currently in <code>note</code>. This runs once for each item in <code>scale</code>.'
  }
];

let lv1ReadOpened = [false, false, false];

function lv1P3Read(main) {
  lv1ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">From Blocks to Python</div>
        <p>Your block code and Python express the <em>same algorithm</em>. Click each line below to understand what it means.</p>
      </div>
      <div class="lv1-read-block" id="lv1-read-0">
        <button class="lv1-read-line-btn" onclick="lv1ReadToggle(0)">
          <span class="lv1-read-expand-icon">▶</span>
          <span class="lv1-read-code">${LV1_CODE_LINES[0].code}</span>
        </button>
        <div class="lv1-read-explanation" id="lv1-re-0">${LV1_CODE_LINES[0].explain}</div>
      </div>
      <div class="lv1-read-block" id="lv1-read-1">
        <button class="lv1-read-line-btn" onclick="lv1ReadToggle(1)">
          <span class="lv1-read-expand-icon">▶</span>
          <span class="lv1-read-code">${LV1_CODE_LINES[1].code}</span>
        </button>
        <div class="lv1-read-explanation" id="lv1-re-1">${LV1_CODE_LINES[1].explain}</div>
      </div>
      <div class="lv1-read-block" id="lv1-read-2">
        <button class="lv1-read-line-btn" onclick="lv1ReadToggle(2)">
          <span class="lv1-read-expand-icon">▶</span>
          <span class="lv1-read-code">${LV1_CODE_LINES[2].code}</span>
        </button>
        <div class="lv1-read-explanation" id="lv1-re-2">${LV1_CODE_LINES[2].explain}</div>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv1-read-next" onclick="lv1P3Goto(1)" style="display:none">Next: Quiz →</button>
      </div>
    </div>
  `;
}

function lv1ReadToggle(idx) {
  lv1ReadOpened[idx] = !lv1ReadOpened[idx];
  const btn = document.querySelector('#lv1-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv1-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv1ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv1ReadOpened[idx]);
  // show next button once all 3 opened
  if (lv1ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv1-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Steps 1-3 — Quizzes */
function lv1P3Quiz(main, qIdx) {
  const q = LV1_QUIZZES[qIdx];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <p class="lv1-activity-sub" style="font-size:13px;color:var(--text)">Question ${qIdx+1} of 3</p>
      <div class="lv1-activity-heading" style="font-size:14px">${q.q}</div>
      <div class="lv1-quiz-options" id="lv1-qz-opts">
        ${q.opts.map((o, i) =>
          `<button class="lv1-quiz-opt" onclick="lv1P3Answer(this,${o.ok},${qIdx})">${o.t}</button>`
        ).join('')}
      </div>
      <div id="lv1-qz-fb" class="lv1-feedback" style="display:none"></div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv1-qz-next" onclick="lv1P3Goto(${lv1P3Step + 1})" style="display:none">
          ${qIdx < 2 ? 'Next question →' : 'Next: Fill in the blanks →'}
        </button>
      </div>
    </div>
  `;
}

function lv1P3Answer(btn, correct, qIdx) {
  document.querySelectorAll('#lv1-qz-opts .lv1-quiz-opt').forEach(b => {
    b.disabled = true; b.style.opacity = '0.55';
  });
  btn.style.opacity = '1';
  btn.classList.add(correct ? 'correct' : 'wrong');
  // Also highlight the correct answer if they got it wrong
  if (!correct) {
    document.querySelectorAll('#lv1-qz-opts .lv1-quiz-opt').forEach(b => {
      if (b.onclick && b.textContent === LV1_QUIZZES[qIdx].opts.find(o => o.ok).t) {
        b.classList.add('correct'); b.style.opacity = '1';
      }
    });
  }
  const fb = document.getElementById('lv1-qz-fb');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'lv1-feedback ' + (correct ? 'success' : 'error');
    fb.innerHTML = correct ? LV1_QUIZZES[qIdx].exp :
      'Not quite! ' + LV1_QUIZZES[qIdx].exp;
  }
  const nb = document.getElementById('lv1-qz-next');
  if (nb) nb.style.display = 'inline-flex';
}

/* Step 4 — Fill in the blanks */
function lv1P3FillIn(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Fill in the Blanks</div>
      <p class="lv1-activity-sub">
        Look at the Python code in the <strong>left panel</strong> — what variable name was used there?
        Type it into both blanks below.
      </p>
      <div class="lv1-code-panel" style="line-height:2">
        <span class="lv1-code-line">
          <input class="lv1-code-blank" id="lv1-blank1" placeholder="your_name" autocomplete="off" spellcheck="false" style="width:90px">
          <span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span><span class="py-op">, </span><span class="py-str">"A4"</span>]
        </span>
        <span class="lv1-code-line">
          <span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span>
          <input class="lv1-code-blank" id="lv1-blank2" placeholder="your_name" autocomplete="off" spellcheck="false" style="width:90px"><span class="py-op">:</span>
        </span>
        <span class="lv1-code-line">
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span>
        </span>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv1P3CheckFill()">Check</button>
        <button class="lv1-btn primary" id="lv1-fill-next" onclick="lv1P3Goto(5)" style="display:none">Next: Write your own →</button>
      </div>
      <div id="lv1-fill-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv1P3CheckFill() {
  const b1 = document.getElementById('lv1-blank1').value.trim();
  const b2 = document.getElementById('lv1-blank2').value.trim();
  const fb = document.getElementById('lv1-fill-fb');
  const el1 = document.getElementById('lv1-blank1');
  const el2 = document.getElementById('lv1-blank2');
  fb.style.display = 'block';
  const ok1 = b1 === 'scale', ok2 = b2 === 'scale';
  el1.className = 'lv1-code-blank ' + (ok1 ? 'ok' : 'bad');
  el2.className = 'lv1-code-blank ' + (ok2 ? 'ok' : 'bad');
  if (ok1 && ok2) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = 'Correct! The variable in the reference code is called <code>scale</code>. Remember — that name was the programmer\'s choice. In your own programs you could name it anything valid.';
    document.getElementById('lv1-fill-next').style.display = 'inline-flex';
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Check the Python code in the left panel — what is the list variable called?';
  }
}

/* Step 5 — Write your own */
const LV1_VALID_NOTES = ['C3','D3','E3','F3','G3','A3','B3',
  'C4','D4','E4','F4','G4','A4','B4',
  'C5','D5','E5','F5','G5','A5','B5'];

function lv1P3WriteOwn(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Write Your Own</div>
      <p class="lv1-activity-sub">Change the last note in the scale to anything you like! Type a note (e.g. <code>B4</code>, <code>D5</code>, <code>F4</code>) into the blank, then hit Play to hear it.</p>

      <div class="lv1-code-panel" style="line-height:2">
        <span class="lv1-code-line">
          <span class="py-var">scale</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span><span class="py-op">, </span><span class="py-str">"</span><input class="lv1-note-input" id="lv1-own-note" value="A4" maxlength="3" autocomplete="off" spellcheck="false" oninput="lv1OwnPreview()"><span class="py-str">"</span>]
        </span>
        <span class="lv1-code-line">
          <span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span> <span class="py-var">scale</span><span class="py-op">:</span>
        </span>
        <span class="lv1-code-line">
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span>
        </span>
      </div>

      <div id="lv1-own-invalid" class="lv1-feedback error" style="display:none">
        That doesn't look like a valid note. Try something like <code>B4</code>, <code>D5</code>, or <code>F4</code>.
      </div>

      <p style="font-size:11.5px;color:var(--text-muted);font-weight:600">
        Available notes: C3–B5 &nbsp;·&nbsp; e.g. C4, D4, E4, F4, G4, A4, B4, C5 ...
      </p>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv1OwnPlay()">Play my scale</button>
        <button class="lv1-btn success" onclick="lv1Complete()">Complete Level 1!</button>
      </div>
    </div>
  `;
}

function lv1OwnPreview() {
  const inp = document.getElementById('lv1-own-note');
  const warn = document.getElementById('lv1-own-invalid');
  if (!inp || !warn) return;
  const v = inp.value.trim().toUpperCase().replace(/[^A-G#B0-9]/g,'');
  inp.value = v;
  const valid = LV1_VALID_NOTES.includes(v) || v === '';
  warn.style.display = (!valid && v.length >= 2) ? 'block' : 'none';
}

async function lv1OwnPlay() {
  const inp = document.getElementById('lv1-own-note');
  const warn = document.getElementById('lv1-own-invalid');
  const raw = (inp ? inp.value.trim().toUpperCase() : 'A4');
  const fourth = LV1_VALID_NOTES.includes(raw) ? raw : 'A4';
  if (inp && !LV1_VALID_NOTES.includes(raw)) {
    if (warn) warn.style.display = 'block';
    return;
  }
  if (warn) warn.style.display = 'none';
  await initTone();
  for (const n of ['C4','E4','G4', fourth]) { await playNote(n, 1); }
}

function lv1Complete() {
  completeLevel(1);
  backToLevels();
}
