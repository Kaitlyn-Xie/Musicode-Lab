// ════════════════════════════════════════════════════════════
// LEVEL 5 — DEBUG THE MUSIC
// ════════════════════════════════════════════════════════════

let lv5Phase = 1;
let lv5P1Playing = false;
let lv5BugGuessed = false;
let lv5P2SelectedNote = null;
let lv5P2Checked = false;
let lv5P3Playing = false;
let lv5P3Step = 0;
let lv5ReadOpened = [false, false, false];

// ── Baby Shark (key of C, 5=G4 6=A4 7=B4 i=C5) ──────────────
// Correct opening phrase: "Ba-by Shark doo doo doo, Ba-by Shark"
const LV5_CORRECT   = ['G4','A4','C5','C5','C5','G4','A4','C5'];
// Bug: note index 2 = F4 instead of C5 (jumps DOWN — sounds very wrong)
const LV5_BUGGY     = ['G4','A4','F4','C5','C5','G4','A4','C5'];
const LV5_BUG_IDX   = 2;

// Full 5-bar listen sequence (simplified beat-by-beat):
// Bar 1 (pickup): G4 A4
// Bar 2: C5 C5 C5 C5 G4 A4  (Baby shark doo doo doo doo)
// Bar 3: C5 C5 C5 C5 G4 A4  (Baby shark doo doo doo doo)
// Bar 4: C5 C5 C5 C5 C5     (Baby shark!)
// Bar 5: B4 G4 G4 A4
const LV5_BABY_FULL = [
  'G4','A4',
  'C5','C5','C5','C5','G4','A4',
  'C5','C5','C5','C5','G4','A4',
  'C5','C5','C5','C5','C5',
  'B4','G4','G4','A4'
];

// Simplified 8-note phrase for Build step
const LV5_BABY        = ['G4','A4','C5','C5','C5','G4','A4','C5'];
const LV5_BABY_PALETTE = ['G4','A4','B4','C5'];
let lv5BabySeq = [];

const LV5_OWN_NOTE_OPTIONS = ['C4','D4','E4','F4','G4','A4','B4'];
const LV5_OWN_PITCH_PCT = { 'C4':12,'D4':25,'E4':38,'F4':50,'G4':63,'A4':75,'B4':88 };
let lv5OwnPickedNotes = ['G4','A4','C5'];

const LV5_CT_CONCEPTS = [
  {
    title: 'Debugging',
    icon: 'algorithm',
    body: 'A bug is any error that causes unexpected behavior. <strong>Debugging</strong> involves tracing a process step by step to identify where the output differs from what was expected.'
  },
  {
    title: 'Testing',
    icon: 'blocks',
    body: '<strong>Testing</strong> means running a sequence and checking whether the output matches the expected result. It helps you identify discrepancies and verify that your solution works as intended.'
  },
  {
    title: 'Decomposition',
    icon: 'variable',
    body: '<strong>Decomposition</strong> is the process of breaking a complex problem into smaller, manageable parts. By focusing on one part at a time, you can isolate issues more easily and solve problems more effectively.'
  }
];

// ─── Entry point ─────────────────────────────────────────────
function renderLevel5() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge lv-5">Level 5</div>
          <div class="lv1-title-text">Debug the Music</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv5-ph-0">1 — Read</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv5-ph-1">2 — Spot Bug</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv5-ph-2">3 — How Computers Think</div>
        </div>
      </div>
      <div class="lv1-body" id="lv5-body"></div>
    </div>
  `;
  lv5Phase = 1;
  lv5P1Playing = false;
  lv5BugGuessed = false;
  lv5P2SelectedNote = null;
  lv5P2Checked = false;
  lv5P3Playing = false;
  lv5ShowPhase(1);
}

function lv5ShowPhase(p) {
  lv5Phase = p;
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('lv5-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i === p - 1 ? ' active' : (i < p - 1 ? ' done' : ''));
  });
  const body = document.getElementById('lv5-body');
  if (!body) return;
  if (p === 1) lv5RenderPhase1(body);
  else if (p === 2) lv5RenderPhase2(body);
  else if (p === 3) lv5RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — Listen & hear the difference
// ══════════════════════════════════════════════════════
function lv5RenderPhase1(body) {
  lv5P1Playing = false;
  lv5BugGuessed = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Something Sounds Wrong…</div>
      <p class="lv1-activity-sub">
        A student coded the opening of <strong>Baby Shark 🦈</strong>:
        <strong>G4 → A4 → C5 → C5 → C5 → G4 → A4 → C5</strong>.
        But one note is wrong! Listen to both versions — can you hear the mistake?
      </p>

      <div class="lv5-listen-row">
        <div class="lv5-listen-card" id="lv5-target-card">
          <div class="lv5-listen-label">Target (correct)</div>
          <div class="lv5-listen-notes">
            ${LV5_CORRECT.map(n => `<div class="lv5-note-pill correct">${n}</div>`).join('')}
          </div>
          <button class="lv1-btn secondary" id="lv5-play-correct" onclick="lv5PlayVersion('correct')">
            ${icon('play', 12)} Play correct
          </button>
        </div>

        <div class="lv5-listen-vs">${icon('debug', 18)}</div>

        <div class="lv5-listen-card buggy" id="lv5-buggy-card">
          <div class="lv5-listen-label">Student's sequence (buggy)</div>
          <div class="lv5-listen-notes" id="lv5-buggy-notes">
            ${LV5_BUGGY.map((n, i) =>
              `<div class="lv5-note-pill ${i === LV5_BUG_IDX ? 'bug' : 'correct'}" id="lv5-bn-${i}">${n}</div>`
            ).join('')}
          </div>
          <button class="lv1-btn secondary" id="lv5-play-buggy" onclick="lv5PlayVersion('buggy')">
            ${icon('play', 12)} Play buggy
          </button>
        </div>
      </div>

      <div class="lv5-p1-question" id="lv5-p1-question" style="display:none">
        <div class="lv1-activity-heading" style="font-size:14px;margin-bottom:10px">
          Which note sounds out of place in the student's version?
        </div>
        <div class="lv5-note-opts" id="lv5-note-opts">
          ${LV5_BUGGY.map((n, i) =>
            `<button class="lv5-note-opt" onclick="lv5P1GuessNote(${i},'${n}')">note ${i+1}: ${n}</button>`
          ).join('')}
        </div>
        <div id="lv5-p1-fb" class="lv1-feedback" style="display:none"></div>
      </div>

      <div class="lv1-success-concept" id="lv5-bug-reveal">
        <div class="lv1-success-concept-label">You Found the Bug! 🐛</div>
        <p>Note 3 is <strong>F4</strong> — but Baby Shark rises from G4 → A4 → <em>C5</em>. F4 is <em>lower</em> than A4, so the melody dips down instead of jumping up. The fix: change <strong>F4</strong> to <strong>C5</strong>.</p>
        <p>This is exactly what <strong>debugging</strong> means: listen carefully, compare to the expected result, and trace the error back to its source.</p>
      </div>

      <div class="lv1-actions" id="lv5-p1-next-row" style="display:none">
        <button class="lv1-btn primary" onclick="lv5ShowPhase(2)">Next: Find it in the Sequence →</button>
      </div>
    </div>
  `;
}

async function lv5PlayVersion(version) {
  if (lv5P1Playing) return;
  lv5P1Playing = true;
  const notes = version === 'correct' ? LV5_CORRECT : LV5_BUGGY;
  const btnId = version === 'correct' ? 'lv5-play-correct' : 'lv5-play-buggy';
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = true;
  await initTone();
  for (let i = 0; i < notes.length; i++) {
    if (version === 'buggy') {
      document.querySelectorAll('.lv5-note-pill.playing').forEach(el => el.classList.remove('playing'));
      const pill = document.getElementById('lv5-bn-' + i);
      if (pill) pill.classList.add('playing');
    }
    await playNote(notes[i], 0.55);
  }
  document.querySelectorAll('.lv5-note-pill.playing').forEach(el => el.classList.remove('playing'));
  if (btn) btn.disabled = false;
  lv5P1Playing = false;
  const q = document.getElementById('lv5-p1-question');
  if (q) q.style.display = 'block';
}

function lv5P1GuessNote(idx, note) {
  if (lv5BugGuessed) return;
  const fb = document.getElementById('lv5-p1-fb');
  const btns = document.querySelectorAll('.lv5-note-opt');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '0.45'; });
  const picked = [...btns][idx];
  if (idx === LV5_BUG_IDX) {
    if (picked) { picked.style.opacity = '1'; picked.classList.add('correct'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback success';
      fb.innerHTML = `Correct! Note 3 (${note}) is wrong — Baby Shark goes <em>up</em> to C5, but F4 dips down.`;
    }
    lv5BugGuessed = true;
    document.getElementById('lv5-bug-reveal').classList.add('visible');
    document.getElementById('lv5-p1-next-row').style.display = 'flex';
  } else {
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
    if (picked) { picked.disabled = true; picked.style.opacity = '0.35'; picked.classList.add('wrong'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback error';
      fb.textContent = 'That note sounds fine — it fits the pattern. Listen again and find which beat sounds unexpectedly low.';
    }
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Spot the Bug in the Sequence (no Python)
// ══════════════════════════════════════════════════════
function lv5RenderPhase2(body) {
  lv5P2SelectedNote = null;
  lv5P2Checked = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Find the Bug in the Sequence</div>
        <p>Below is the student's note sequence. Each block is one note in the order it plays.
           Click the block you think has the wrong note — you can also tap ${icon('volume',11)} to hear each one.</p>
      </div>

      <div class="lv5-note-seq" id="lv5-note-seq">
        ${LV5_BUGGY.map((note, i) => `
          <div class="lv5-note-seq-item" id="lv5-nsi-${i}" onclick="lv5P2SelectNote(${i})">
            <div class="lv5-seq-idx">${i + 1}</div>
            <div class="lv5-seq-note-name">${note}</div>
            <button class="lv5-seq-play-btn" title="Play this note"
              onclick="event.stopPropagation();initTone().then(()=>playNote('${note}',0.6))">${icon('volume',11)}</button>
            <span class="lv5-line-tag" id="lv5-ntag-${i}"></span>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv5P2Check()">Check my guess</button>
        <button class="lv1-btn primary" id="lv5-p2-next" onclick="lv5ShowPhase(3)" style="display:none">
          Next: How Computers Think →
        </button>
      </div>
      <div id="lv5-p2-fb" class="lv1-feedback" style="display:none"></div>

      <div class="lv1-success-concept" id="lv5-p2-reveal">
        <div class="lv1-success-concept-label">Block 3 has the bug</div>
        <p>Note 3 is <strong>F4</strong> — but the correct Baby Shark melody needs <strong>C5</strong> there.
           Blocks 1, 2, 4–8 are all correct; only the data in block 3 is wrong.</p>
        <p>This is called a <strong>wrong-value bug</strong>: the structure (how many notes, what order) is correct,
           but one piece of data is wrong.</p>
      </div>
    </div>
  `;
}

function lv5P2SelectNote(idx) {
  if (lv5P2Checked) return;
  lv5P2SelectedNote = idx;
  document.querySelectorAll('.lv5-note-seq-item').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
}

function lv5P2Check() {
  const fb = document.getElementById('lv5-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';

  if (lv5P2SelectedNote === null) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Click a note block above to select it, then check.';
    return;
  }

  const isCorrect = lv5P2SelectedNote === LV5_BUG_IDX;
  lv5P2Checked = true;

  document.querySelectorAll('.lv5-note-seq-item').forEach((el, i) => {
    el.classList.remove('selected');
    el.onclick = null;
    const tag = document.getElementById('lv5-ntag-' + i);
    if (i === LV5_BUG_IDX) {
      el.classList.add('bug-note');
      if (tag) tag.innerHTML = '<span class="lv5-bug-badge">bug here</span>';
    } else {
      el.classList.add('ok-note');
      if (tag) tag.innerHTML = '<span class="lv5-ok-badge">ok</span>';
    }
  });

  if (isCorrect) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = `Correct! Block 3 has <strong>F4</strong> — it should be <strong>C5</strong>. The rest of the sequence is fine.`;
  } else {
    fb.className = 'lv1-feedback error';
    fb.innerHTML = `Not quite — the bug is actually in <strong>block 3</strong> (F4 should be C5). See the highlight above.`;
  }

  document.getElementById('lv5-p2-reveal').classList.add('visible');
  document.getElementById('lv5-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════
function lv5RenderPhase3(body) {
  lv5P3Step = 0;
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.innerHTML = `
    <div class="lv1-p3-nav-bar">
      <div class="lv1-p3-nav" id="lv5-p3-nav"></div>
    </div>
    <div class="lv1-p3-right-scroll">
      <div style="max-width:700px;margin:0 auto;width:100%;box-sizing:border-box">
        <div id="lv5-p3-main"></div>
      </div>
    </div>
  `;
  lv5P3Goto(0);
}

function lv5P3UpdateNav(step) {
  const labels = ['Concepts','Listen','Build','Discover','Create!'];
  const nav = document.getElementById('lv5-p3-nav');
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

function lv5P3Goto(step) {
  lv5P3Step = step;
  lv5P3UpdateNav(step);
  const main = document.getElementById('lv5-p3-main');
  if (!main) return;
  if (step === 0) lv5P3Read(main);
  else if (step === 1) lv5BabyListen(main);
  else if (step === 2) lv5BabyBuild(main);
  else if (step === 3) lv5BabyDiscover(main);
  else if (step === 4) lv5P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv5P3Read(main) {
  lv5ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just debugged a sequence by listening and tracing. Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${LV5_CT_CONCEPTS.map((c, i) => `
        <div class="lv1-read-block" id="lv5-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv5ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv5-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv5-read-next" onclick="lv5P3Goto(1)" style="display:none">Next: Listen to Baby Shark →</button>
      </div>
    </div>
  `;
}

function lv5ReadToggle(idx) {
  lv5ReadOpened[idx] = !lv5ReadOpened[idx];
  const btn = document.querySelector('#lv5-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv5-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv5ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv5ReadOpened[idx]);
  if (lv5ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv5-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Step 1 — Listen: Baby Shark (5 bars) */
function lv5BabyListen(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">🦈 Baby Shark — Bars 1–5</div>
        <p>Listen to the first five bars of Baby Shark! Notice how the melody is a pattern that repeats —
           just like a loop in code. Each bar builds on the same note shapes.</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">🎶 Baby Shark — opening phrase (5 bars)</div>
        <div class="lv1-song-card-lyrics">"Ba-by shark, doo doo doo doo doo doo…"</div>
        <div class="lv1-song-card-notes" style="flex-wrap:wrap;gap:6px">
          ${LV5_BABY_FULL.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:14px" onclick="lv5BabyPlayFull()">
          ${icon('play',13)} Listen to 5 bars
        </button>
        <div id="lv5-baby-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">🦈 playing...</div>
      </div>

      <div class="lv1-concept" style="border-left-color:#D04040;background:rgba(208,64,64,0.05)">
        <div class="lv1-concept-label" style="color:#D04040">The debug connection</div>
        <p>When the student swapped <strong>C5 → F4</strong> in note 3, the melody suddenly dipped down.
           A listener — or a programmer testing output — notices immediately because the pattern is broken.
           <strong>Testing = comparing expected vs actual, one step at a time.</strong></p>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv5P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv5BabyPlayFull() {
  const ind = document.getElementById('lv5-baby-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV5_BABY_FULL) { await playNote(n, 0.45); }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Build the opening phrase */
function lv5BabyBuild(main) {
  lv5BabySeq = [];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Phrase</div>
      <p class="lv1-activity-sub">
        Tap the note tiles to spell out the opening Baby Shark phrase — <strong>${LV5_BABY.length} notes</strong>.
        Use the hint if you get stuck!
      </p>

      <div class="lv1-tw-slots" id="lv5-baby-slots"></div>

      <div class="lv1-tw-palette">
        ${LV5_BABY_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv5BabyTap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px"
              onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>`).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv5BabyClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv5BabyPlaySeq()">${icon('play',12)} Play</button>
        <button class="lv1-btn secondary" onclick="lv5BabyHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv5BabyCheck()">Check</button>
      </div>
      <div id="lv5-baby-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv5-baby-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> "Ba-by shark" = G4 A4, then three C5s, then back to G4 A4, then C5 again.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">G4 A4 C5 C5 C5 G4 A4 C5</span>
      </div>
    </div>
  `;
  lv5BabyRenderSlots();
}

function lv5BabyRenderSlots() {
  const container = document.getElementById('lv5-baby-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < LV5_BABY.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv5BabySeq.length ? ' filled' : '');
    if (i < lv5BabySeq.length) {
      slot.textContent = lv5BabySeq[i];
      slot.onclick = () => { lv5BabySeq.splice(i, 1); lv5BabyRenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv5BabyTap(note) {
  if (lv5BabySeq.length >= LV5_BABY.length) return;
  lv5BabySeq.push(note);
  lv5BabyRenderSlots();
}

function lv5BabyClear() {
  lv5BabySeq = [];
  lv5BabyRenderSlots();
  const fb = document.getElementById('lv5-baby-fb');
  if (fb) fb.style.display = 'none';
}

async function lv5BabyPlaySeq() {
  if (!lv5BabySeq.length) return;
  await initTone();
  for (const n of lv5BabySeq) { await playNote(n, 0.55); }
}

function lv5BabyHint() {
  const h = document.getElementById('lv5-baby-hint');
  if (h) h.classList.toggle('visible');
}

async function lv5BabyCheck() {
  const fb = document.getElementById('lv5-baby-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv5BabySeq.length < LV5_BABY.length) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need ${LV5_BABY.length} notes — you have ${lv5BabySeq.length} so far.`;
    return;
  }
  const correct = lv5BabySeq.every((n, i) => n === LV5_BABY[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = '🦈 Perfect! Playing your sequence...';
    await initTone();
    for (const n of LV5_BABY) { await playNote(n, 0.55); }
    fb.textContent = '🎵 That\'s Baby Shark! Now let\'s see what you discovered...';
    setTimeout(() => lv5P3Goto(3), 1400);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — try playing your sequence and compare it to the Listen step!';
  }
}

/* Step 3 — Discover */
async function lv5BabyDiscover(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">You traced the melody — just like debugging!</div>
        <p>You placed note 1, then note 2, then note 3… checking each one matches the expected sound.
           That's exactly what a programmer does: <strong>decompose</strong> the problem, <strong>test</strong> each piece, and <strong>fix</strong> what's wrong.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(200,50,50,0.08),rgba(200,120,30,0.08))">
        <div class="lv1-song-card-title">Your phrase = systematic tracing</div>
        <div class="lv1-song-card-notes" id="lv5-disc-notes">
          ${LV5_BABY.map((n,i) => `<span class="lv1-song-note-pill" id="lv5-disc-${i}">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv5BabyPlayAndHighlight()">
          ${icon('play',13)} Play &amp; highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left;background:linear-gradient(135deg,rgba(200,50,50,0.07),rgba(200,120,30,0.05))">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(200,50,50,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#882000;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Debugging</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Trace step-by-step until output diverges</div>
          </div>
          <div style="background:rgba(200,120,30,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#885020;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Testing</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Compare intended vs actual result</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Decomposition</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">One note at a time reveals the root cause</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv5P3Goto(4)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const n of LV5_BABY) { await playNote(n, 0.55); }
}

async function lv5BabyPlayAndHighlight() {
  await initTone();
  for (let i = 0; i < LV5_BABY.length; i++) {
    document.querySelectorAll('#lv5-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
    const pill = document.getElementById('lv5-disc-' + i);
    if (pill) pill.classList.add('playing');
    await playNote(LV5_BABY[i], 0.55);
  }
  document.querySelectorAll('#lv5-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 4 — Create! */
function lv5P3WriteOwn(main) {
  lv5OwnPickedNotes = ['G4','A4','C5'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">Pick up to 7 notes to compose your own melody, then play it!</p>

      <div class="lv2-note-picker" id="lv5-own-picker">
        ${LV5_OWN_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv5-own-tile-${note}" onclick="lv5OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV5_OWN_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv5OwnPlay()">${icon('play',12)} Play my melody</button>
        <button class="lv1-btn success" onclick="lv5Complete()">Complete Level 5!</button>
      </div>
    </div>
  `;
  lv5UpdateOwnPicker();
}

function lv5OwnToggleNote(note) {
  const idx = lv5OwnPickedNotes.indexOf(note);
  if (idx >= 0) lv5OwnPickedNotes.splice(idx, 1);
  else { if (lv5OwnPickedNotes.length >= 7) return; lv5OwnPickedNotes.push(note); }
  lv5UpdateOwnPicker();
}

function lv5UpdateOwnPicker() {
  LV5_OWN_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv5-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv5OwnPickedNotes.includes(note));
  });
}

async function lv5OwnPlay() {
  if (!lv5OwnPickedNotes.length) return;
  await initTone();
  for (const n of lv5OwnPickedNotes) { await playNote(n, 1); }
}

function lv5Complete() {
  completeLevel(5);
  backToLevels();
}
