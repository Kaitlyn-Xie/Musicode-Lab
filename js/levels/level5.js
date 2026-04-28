// ════════════════════════════════════════════════════════════
// LEVEL 5 — DEBUG THE MUSIC
// ════════════════════════════════════════════════════════════

let lv5Phase = 1;
let lv5P1Playing = false;
let lv5BugGuessed = false;
let lv5P2SelectedLine = null;
let lv5P2Checked = false;
let lv5FixedNotes = ['C4', 'E4', 'G4', 'A4']; // student edits note[2]
let lv5P3Playing = false;
let lv5P3Fixed = false;
let lv5P3Step = 0;
let lv5ReadOpened = [false, false, false];

// Song Workshop state
const LV5_MARY = ['E4','D4','C4','D4','E4','E4','E4'];
const LV5_MARY_PALETTE = ['C4','D4','E4'];
let lv5MarySeq = [];
const LV5_OWN_NOTE_OPTIONS = ['C4','D4','E4','F4','G4','A4','B4'];
const LV5_OWN_PITCH_PCT = { 'C4':12,'D4':25,'E4':38,'F4':50,'G4':63,'A4':75,'B4':88 };
let lv5OwnPickedNotes = ['C4','E4','G4'];

const LV5_CT_CONCEPTS = [
  {
    title: 'Debugging',
    icon: 'algorithm',
    body: 'A <strong>bug</strong> is any mistake that causes unexpected behaviour. Finding bugs requires <em>reading</em> code like a computer — step by step — until the behaviour diverges from expectation.'
  },
  {
    title: 'Testing',
    icon: 'blocks',
    body: '<strong>Testing</strong> means running code and checking if the output matches what you expected. A good test compares the <em>intended</em> result against the <em>actual</em> result — and flags the difference.'
  },
  {
    title: 'Decomposition',
    icon: 'variable',
    body: 'Break a complex problem into smaller pieces — <strong>decomposition</strong>. Debug one note at a time instead of the whole melody. One small fix often reveals the root cause.'
  }
];

// The "correct" scale is C4 E4 G4 A4
// The buggy code has B3 instead of G4 at index 2
const LV5_CORRECT = ['C4', 'E4', 'G4', 'A4'];
const LV5_BUGGY   = ['C4', 'E4', 'B3', 'A4']; // bug: B3 should be G4
const LV5_BUG_IDX = 2; // index of the wrong note

// Code lines shown in Phase 2
const LV5_CODE = [
  { n: 1, html: '<span class="py-var">scale</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"B3"</span><span class="py-op">, </span><span class="py-str">"A4"</span>]',
    plain: 'scale = ["C4", "E4", "B3", "A4"]',
    hasBug: true,
    bugExplain: 'The third note is <code>"B3"</code> — but B3 is <em>lower</em> than E4, so the scale jumps down instead of up. It should be <code>"G4"</code>.' },
  { n: 2, html: '',  plain: '', hasBug: false }, // blank separator
  { n: 3, html: '<span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span> <span class="py-var">scale</span><span class="py-op">:</span>',
    plain: 'for note in scale:', hasBug: false },
  { n: 4, html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span>',
    plain: '    play(note)', hasBug: false },
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
  lv5P2SelectedLine = null;
  lv5P2Checked = false;
  lv5FixedNotes = ['C4', 'E4', 'G4', 'A4'];
  lv5P3Playing = false;
  lv5P3Fixed = false;
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
// PHASE 1 — Reading Code (listen + compare)
// ══════════════════════════════════════════════════════
function lv5RenderPhase1(body) {
  lv5P1Playing = false;
  lv5BugGuessed = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Something Sounds Wrong…</div>
      <p class="lv1-activity-sub">
        A student wrote code to play a rising scale: <strong>C4 → E4 → G4 → A4</strong>.
        But when they ran it, it sounded wrong!
        Listen to both versions — can you hear the difference?
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
          <div class="lv5-listen-label">Student's code (buggy)</div>
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
            `<button class="lv5-note-opt" onclick="lv5P1GuessNote(${i},'${n}')">${n} (note ${i+1})</button>`
          ).join('')}
        </div>
        <div id="lv5-p1-fb" class="lv1-feedback" style="display:none"></div>
      </div>

      <div class="lv1-success-concept" id="lv5-bug-reveal">
        <div class="lv1-success-concept-label">You Found the Bug!</div>
        <p>The third note is <strong>"B3"</strong> — but B3 is <em>below</em> E4, so instead of going up, the scale dips down. The fix: change <code>"B3"</code> to <code>"G4"</code>.</p>
        <p>This is exactly what <strong>debugging</strong> is: reading output carefully, comparing to what was expected, and tracing the problem back to the source code.</p>
      </div>

      <div class="lv1-actions" id="lv5-p1-next-row" style="display:none">
        <button class="lv1-btn primary" onclick="lv5ShowPhase(2)">Next: Spot the Bug in Code →</button>
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
    await playNote(notes[i], 1);
  }
  document.querySelectorAll('.lv5-note-pill.playing').forEach(el => el.classList.remove('playing'));
  if (btn) btn.disabled = false;
  lv5P1Playing = false;
  // Show question after they've listened to at least one version
  const q = document.getElementById('lv5-p1-question');
  if (q) q.style.display = 'block';
}

function lv5P1GuessNote(idx, note) {
  if (lv5BugGuessed) return;
  const fb = document.getElementById('lv5-p1-fb');
  const btns = document.querySelectorAll('.lv5-note-opt');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '0.45'; });
  const picked = [...btns].find((_, i) => i === idx);
  if (idx === LV5_BUG_IDX) {
    if (picked) { picked.style.opacity = '1'; picked.classList.add('correct'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback success';
      fb.innerHTML = `Correct! Note 3 (${note}) is wrong — it should be going <em>up</em> but B3 goes down.`;
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
      fb.textContent = 'That note sounds fine — it fits the rising pattern. Listen again and find which beat breaks the upward direction.';
    }
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Spot the Bug in Code
// ══════════════════════════════════════════════════════
function lv5RenderPhase2(body) {
  lv5P2SelectedLine = null;
  lv5P2Checked = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Read the Code — Find the Bug</div>
        <p>Below is the student's Python code. Click the line you think contains the bug.</p>
      </div>

      <div class="lv5-code-clickable" id="lv5-code-clickable">
        ${LV5_CODE.filter(l => l.plain !== '').map((line, i) => `
          <div class="lv5-code-line-btn" id="lv5-cl-${i}" onclick="lv5P2Select(${i})">
            <span class="lv5-ln">${line.n}</span>
            <span class="lv5-code-content">${line.html}</span>
            <span class="lv5-line-tag" id="lv5-tag-${i}"></span>
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
        <div class="lv1-success-concept-label">Line 1 has the bug</div>
        <p>The list <code>["C4", "E4", <strong>"B3"</strong>, "A4"]</code> has <code>"B3"</code> where it should say <code>"G4"</code>. Lines 3–4 (the loop) are perfectly fine — the problem is in the <em>data</em>, not the logic.</p>
        <p>This is a common bug type: <strong>wrong value</strong>. The code structure is correct, but one piece of data is wrong.</p>
      </div>
    </div>
  `;
}

function lv5P2Select(idx) {
  if (lv5P2Checked) return;
  lv5P2SelectedLine = idx;
  document.querySelectorAll('.lv5-code-line-btn').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  document.querySelectorAll('.lv5-line-tag').forEach(el => el.textContent = '');
}

function lv5P2Check() {
  const fb = document.getElementById('lv5-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';

  if (lv5P2SelectedLine === null) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Click a line in the code above to select it, then check.';
    return;
  }

  // Line index 0 = line 1 (the list definition = the bug)
  const isCorrect = lv5P2SelectedLine === 0;
  lv5P2Checked = true;

  document.querySelectorAll('.lv5-code-line-btn').forEach((el, i) => {
    el.classList.remove('selected');
    el.onclick = null;
    const tag = document.getElementById('lv5-tag-' + i);
    if (i === 0) {
      el.classList.add('bug-line');
      if (tag) tag.innerHTML = '<span class="lv5-bug-badge">bug here</span>';
    } else {
      el.classList.add('ok-line');
      if (tag) tag.innerHTML = '<span class="lv5-ok-badge">ok</span>';
    }
  });

  if (isCorrect) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = 'Correct! Line 1 has the wrong note value — <code>"B3"</code> should be <code>"G4"</code>. The loop on lines 3–4 is fine.';
  } else {
    fb.className = 'lv1-feedback error';
    fb.innerHTML = 'Not quite — the bug is actually on <strong>line 1</strong> in the list. See the highlight above.';
  }

  document.getElementById('lv5-p2-reveal').classList.add('visible');
  document.getElementById('lv5-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv5RenderPhase3(body) {
  lv5P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv5-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
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
  else if (step === 1) lv5MaryListen(main);
  else if (step === 2) lv5MaryBuild(main);
  else if (step === 3) lv5MaryDiscover(main);
  else if (step === 4) lv5P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv5P3Read(main) {
  lv5ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just debugged code by testing and isolating a bug. Click each card to explore what that means in Computational Thinking.</p>
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
        <button class="lv1-btn primary" id="lv5-read-next" onclick="lv5P3Goto(1)" style="display:none">Next: Build the Song →</button>
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

/* Step 1 — Listen */
function lv5MaryListen(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">玛丽有只小羊 — Mary Had a Little Lamb</div>
        <p>Listen to the opening phrase of Mary Had a Little Lamb! Notice how the melody steps down then comes back up — like tracing a bug step by step.</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ Mary Had a Little Lamb 玛丽有只小羊</div>
        <div class="lv1-song-card-lyrics">"玛丽有只小羊，小羊，小羊..."</div>
        <div class="lv1-song-card-notes">
          ${LV5_MARY.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:14px;gap:8px" onclick="lv5MaryPlayTarget()">
          ${icon('play',13)} Listen to the phrase
        </button>
        <div id="lv5-mary-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv5P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv5MaryPlayTarget() {
  const ind = document.getElementById('lv5-mary-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV5_MARY) { await playNote(n, 0.75); }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Build */
function lv5MaryBuild(main) {
  lv5MarySeq = [];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Sequence</div>
      <p class="lv1-activity-sub">
        Tap the note tiles below to place them in order. The song needs <strong>7 notes</strong>.
        Use the hint if you get stuck!
      </p>

      <div class="lv1-tw-slots" id="lv5-mary-slots"></div>

      <div class="lv1-tw-palette">
        ${LV5_MARY_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv5MaryTap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px" onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv5MaryClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv5MaryPlaySeq()">Play</button>
        <button class="lv1-btn secondary" onclick="lv5MaryHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv5MaryCheck()">Check</button>
      </div>
      <div id="lv5-mary-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv5-mary-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> Mary Had a Little Lamb steps down E D C D, then E E E.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">E4 D4 C4 D4 E4 E4 E4</span>
      </div>
    </div>
  `;
  lv5MaryRenderSlots();
}

function lv5MaryRenderSlots() {
  const container = document.getElementById('lv5-mary-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv5MarySeq.length ? ' filled' : '');
    if (i < lv5MarySeq.length) {
      slot.textContent = lv5MarySeq[i];
      slot.onclick = () => { lv5MarySeq.splice(i, 1); lv5MaryRenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv5MaryTap(note) {
  if (lv5MarySeq.length >= 7) return;
  lv5MarySeq.push(note);
  lv5MaryRenderSlots();
}

function lv5MaryClear() {
  lv5MarySeq = [];
  lv5MaryRenderSlots();
  const fb = document.getElementById('lv5-mary-fb');
  if (fb) fb.style.display = 'none';
}

async function lv5MaryPlaySeq() {
  if (!lv5MarySeq.length) return;
  await initTone();
  for (const n of lv5MarySeq) { await playNote(n, 0.75); }
}

function lv5MaryHint() {
  const h = document.getElementById('lv5-mary-hint');
  if (h) h.classList.toggle('visible');
}

async function lv5MaryCheck() {
  const fb = document.getElementById('lv5-mary-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv5MarySeq.length < 7) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need 7 notes — you have ${lv5MarySeq.length} so far. Keep going!`;
    return;
  }
  const correct = lv5MarySeq.every((n, i) => n === LV5_MARY[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Perfect! Listen to your sequence...';
    await initTone();
    for (const n of LV5_MARY) { await playNote(n, 0.75); }
    fb.textContent = '🎵 That\'s Mary Had a Little Lamb! Now let\'s see what you discovered...';
    setTimeout(() => lv5P3Goto(3), 1400);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — the order isn\'t right yet. Try playing your sequence and compare it to the Listen step!';
  }
}

/* Step 3 — Discover */
async function lv5MaryDiscover(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">You traced the melody!</div>
        <p>You stepped through note by note — exactly like debugging. <strong>Decompose</strong> the problem into small pieces, <strong>test</strong> each one, and fix what's wrong.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(200,50,50,0.08),rgba(200,120,30,0.08))">
        <div class="lv1-song-card-title">Your sequence = systematic tracing</div>
        <div class="lv1-song-card-notes" id="lv5-disc-notes">
          ${LV5_MARY.map((n,i) => `<span class="lv1-song-note-pill" id="lv5-disc-${i}">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv5MaryPlayAndHighlight()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left;background:linear-gradient(135deg,rgba(200,50,50,0.07),rgba(200,120,30,0.05))">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(200,50,50,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#882000;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Debugging</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Step-by-step until output diverges</div>
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
  for (const n of LV5_MARY) { await playNote(n, 0.75); }
}

async function lv5MaryPlayAndHighlight() {
  await initTone();
  for (let i = 0; i < LV5_MARY.length; i++) {
    document.querySelectorAll('#lv5-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
    const pill = document.getElementById('lv5-disc-' + i);
    if (pill) pill.classList.add('playing');
    await playNote(LV5_MARY[i], 0.75);
  }
  document.querySelectorAll('#lv5-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 4 — Create! */
function lv5P3WriteOwn(main) {
  lv5OwnPickedNotes = ['C4','E4','G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">Pick up to 7 notes to create your own melody, then play it!</p>

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
