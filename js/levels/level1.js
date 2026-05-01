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
          <div class="lv1-phase" id="lv1-ph3">3 — How Computers Think</div>
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
        Four notes are scrambled below. Click the <strong>listen</strong> button on each card to hear how it sounds,
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
      '<button class="lv1-play-btn" title="Hear this note">'+icon('volume',12)+'</button>' +
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
    fb.innerHTML = 'Not quite! Click the <strong>listen</strong> button on each card to hear the notes — lower sounds come first. Try the hint button if you need help!';
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
                 onclick="lv1PlaySingleNote('${n}')">${icon('volume',12)}</button>
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
        <button class="lv1-btn primary" id="lv1-p2-next" onclick="lv1ShowPhase(3)" style="display:none">Next: How Computers Think →</button>
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
      '<button class="lv1-rm-btn" onclick="lv1RemoveBlock(' + idx + ')">'+icon('close',11)+'</button>';
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

/* ── Phase 3: How Computers Think ───────────────────────── */
let lv1P3Step = 0;

const LV1_CT_CONCEPTS = [
  {
    title: 'Sequencing',
    icon: 'algorithm',
    body: 'You put notes in a specific order — C4, then E4, then G4, then A4. This is <strong>sequencing</strong>: arranging steps in a precise order. Computers execute instructions exactly as written — change the order, change the result!',
    tag: 'Computational Thinking'
  },
  {
    title: 'Variable',
    icon: 'variable',
    body: '<code>scale</code> is a <strong>variable</strong> — a named container that holds your data. You chose that name; you could have called it <code>melody</code>, <code>myNotes</code>, or anything. The name is just a label — what\'s inside is what matters.',
    tag: 'Computational Thinking'
  },
  {
    title: 'Algorithm',
    icon: 'blocks',
    body: 'Your set of instructions is an <strong>algorithm</strong>: a complete, step-by-step process a computer can follow exactly. "Define the notes, then play each one in order" — precise, repeatable, always gives the same result.',
    tag: 'Computational Thinking'
  }
];

// Twinkle Twinkle state
const LV1_TWINKLE = ['C4','C4','G4','G4','A4','A4','G4'];
const LV1_TWINKLE_PALETTE = ['C4','G4','A4'];
let lv1TwinkleSeq = [];

function lv1RenderPhase3(body) {
  lv1P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv1-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv1-p3-main"></div>
      </div>
    </div>
  `;
  lv1P3Goto(0);
}

function lv1P3UpdateNav(step) {
  const labels = ['Concepts','Listen','Build','Discover','Create!'];
  const nav = document.getElementById('lv1-p3-nav');
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

function lv1P3Goto(step) {
  lv1P3Step = step;
  lv1P3UpdateNav(step);
  const main = document.getElementById('lv1-p3-main');
  if (!main) return;
  if (step === 0) lv1P3Read(main);
  else if (step === 1) lv1TwinkleListen(main);
  else if (step === 2) lv1TwinkleBuild(main);
  else if (step === 3) lv1TwinkleDiscover(main);
  else if (step === 4) lv1P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
let lv1ReadOpened = [false, false, false];

function lv1P3Read(main) {
  lv1ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just used three core Computational Thinking concepts. Click each card to explore what they mean.</p>
      </div>
      ${LV1_CT_CONCEPTS.map((c, i) => `
        <div class="lv1-read-block" id="lv1-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv1ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">${c.tag}</span>
          </button>
          <div class="lv1-read-explanation" id="lv1-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv1-read-next" onclick="lv1P3Goto(1)" style="display:none">Next: Build the Song →</button>
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
  if (lv1ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv1-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* ── Song Workshop: Step 1 — Listen ─────────────────────── */
function lv1TwinkleListen(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Twinkle Twinkle Little Star</div>
        <p>Let's build a real song together! Listen to the first phrase, then you'll recreate it note by note.</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ Twinkle Twinkle Little Star</div>
        <div class="lv1-song-card-lyrics">"Twin-kle, twin-kle, lit-tle star..."</div>
        <div class="lv1-song-card-notes">
          ${LV1_TWINKLE.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:14px;gap:8px" onclick="lv1TwinklePlayTarget()">
          ${icon('play',13)} Listen to the phrase
        </button>
        <div id="lv1-tw-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv1P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv1TwinklePlayTarget() {
  const ind = document.getElementById('lv1-tw-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV1_TWINKLE) { await playNote(n, 0.75); }
  if (ind) ind.style.display = 'none';
}

/* ── Song Workshop: Step 2 — Build ──────────────────────── */
function lv1TwinkleBuild(main) {
  lv1TwinkleSeq = [];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Sequence</div>
      <p class="lv1-activity-sub">
        Tap the note tiles below to place them in order. The song needs <strong>7 notes</strong>.
        Use the hint if you get stuck!
      </p>

      <div class="lv1-tw-slots" id="lv1-tw-slots"></div>

      <div class="lv1-tw-palette">
        ${LV1_TWINKLE_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv1TwinkleTap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px" onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv1TwinkleClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv1TwinklePlaySeq()">Play</button>
        <button class="lv1-btn secondary" onclick="lv1TwinkleHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv1TwinkleCheck()">Check</button>
      </div>
      <div id="lv1-tw-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv1-tw-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> "Twinkle Twinkle" starts with the same note twice, jumps up, repeats that twice, goes even higher, repeats twice, then comes back down.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">C C G G A A G</span>
      </div>
    </div>
  `;
  lv1TwinkleRenderSlots();
}

function lv1TwinkleRenderSlots() {
  const container = document.getElementById('lv1-tw-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv1TwinkleSeq.length ? ' filled' : '');
    if (i < lv1TwinkleSeq.length) {
      slot.textContent = lv1TwinkleSeq[i];
      slot.onclick = () => { lv1TwinkleSeq.splice(i, 1); lv1TwinkleRenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv1TwinkleTap(note) {
  if (lv1TwinkleSeq.length >= 7) return;
  lv1TwinkleSeq.push(note);
  lv1TwinkleRenderSlots();
}

function lv1TwinkleClear() {
  lv1TwinkleSeq = [];
  lv1TwinkleRenderSlots();
  const fb = document.getElementById('lv1-tw-fb');
  if (fb) fb.style.display = 'none';
}

async function lv1TwinklePlaySeq() {
  if (!lv1TwinkleSeq.length) return;
  await initTone();
  for (const n of lv1TwinkleSeq) { await playNote(n, 0.75); }
}

function lv1TwinkleHint() {
  const h = document.getElementById('lv1-tw-hint');
  if (h) h.classList.toggle('visible');
}

async function lv1TwinkleCheck() {
  const fb = document.getElementById('lv1-tw-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv1TwinkleSeq.length < 7) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need 7 notes — you have ${lv1TwinkleSeq.length} so far. Keep going!`;
    return;
  }
  const correct = lv1TwinkleSeq.every((n, i) => n === LV1_TWINKLE[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Perfect! Listen to your sequence...';
    await initTone();
    for (const n of LV1_TWINKLE) { await playNote(n, 0.75); }
    fb.textContent = '🎵 That\'s Twinkle Twinkle! Now let\'s see what you discovered...';
    setTimeout(() => lv1P3Goto(3), 1400);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — the order isn\'t right yet. Try playing your sequence and compare it to the Listen step!';
  }
}

/* ── Song Workshop: Step 3 — Discover ───────────────────── */
async function lv1TwinkleDiscover(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">You built an Algorithm!</div>
        <p>Each note in exactly the right place, in exactly the right order. That's <strong>sequencing</strong> — and a sequence of instructions that solves a problem is an <strong>algorithm</strong>.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(112,80,208,0.08),rgba(46,128,208,0.08))">
        <div class="lv1-song-card-title">Your sequence = your algorithm</div>
        <div class="lv1-song-card-notes" id="lv1-disc-notes">
          ${LV1_TWINKLE.map((n,i) => `<span class="lv1-song-note-pill" id="lv1-disc-${i}">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv1TwinklePlayAndHighlight()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left;background:linear-gradient(135deg,rgba(112,80,208,0.07),rgba(46,128,208,0.05))">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(112,80,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#7050D0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Sequencing</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Right note, right place, right order</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Variable</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">A named list holding your notes</div>
          </div>
          <div style="background:rgba(24,160,80,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Algorithm</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Define → Sequence → Execute</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv1P3Goto(4)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const n of LV1_TWINKLE) { await playNote(n, 0.75); }
}

async function lv1TwinklePlayAndHighlight() {
  await initTone();
  for (let i = 0; i < LV1_TWINKLE.length; i++) {
    document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
    const pill = document.getElementById('lv1-disc-' + i);
    if (pill) pill.classList.add('playing');
    await playNote(LV1_TWINKLE[i], 0.75);
  }
  document.querySelectorAll('.lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 4 — Make it your own */
const LV1_OWN_NOTE_OPTIONS = ['C4','D4','E4','F4','G4','A4','B4'];
const LV1_OWN_PITCH_PCT = { 'C4': 12, 'D4': 25, 'E4': 38, 'F4': 50, 'G4': 63, 'A4': 75, 'B4': 88 };
let lv1OwnPickedNotes = ['C4','E4','G4','A4'];

function lv1P3WriteOwn(main) {
  lv1OwnPickedNotes = ['C4','E4','G4','A4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">Pick up to 7 notes to create your own melody sequence, then play it!</p>

      <div class="lv2-note-picker" id="lv1-own-picker">
        ${LV1_OWN_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv1-own-tile-${note}" onclick="lv1OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV1_OWN_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv1OwnPlay()">${icon('play',12)} Play my melody</button>
        <button class="lv1-btn success" onclick="lv1Complete()">Complete Level 1!</button>
      </div>
    </div>
  `;
  lv1UpdateOwnPicker();
}

function lv1OwnToggleNote(note) {
  const idx = lv1OwnPickedNotes.indexOf(note);
  if (idx >= 0) lv1OwnPickedNotes.splice(idx, 1);
  else { if (lv1OwnPickedNotes.length >= 7) return; lv1OwnPickedNotes.push(note); }
  lv1UpdateOwnPicker();
}

function lv1UpdateOwnPicker() {
  LV1_OWN_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv1-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv1OwnPickedNotes.includes(note));
  });
}

async function lv1OwnPlay() {
  if (!lv1OwnPickedNotes.length) return;
  await initTone();
  for (const n of lv1OwnPickedNotes) { await playNote(n, 1); }
}

function lv1Complete() {
  completeLevel(1);
  backToLevels();
}
