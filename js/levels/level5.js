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
          <div class="lv1-lvbadge" style="background:#FFE8E3;color:#882000">Level 5</div>
          <div class="lv1-title-text">Debug the Music</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv5-ph-0">1 — Read</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv5-ph-1">2 — Spot Bug</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv5-ph-2">3 — Fix &amp; Test</div>
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
          Next: Fix it →
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
// PHASE 3 — Fix & Test
// ══════════════════════════════════════════════════════
function lv5RenderPhase3(body) {
  lv5FixedNotes = [...LV5_BUGGY]; // start with buggy; student fixes index 2
  lv5P3Playing = false;
  lv5P3Fixed = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Fix the Bug</div>
        <p>
          Change the third note from <code>"B3"</code> to the correct value so the scale rises properly.
          Type the correct note in the blank, then <strong>Play Fixed</strong> to test it!
        </p>
      </div>

      <div class="lv1-code-panel" id="lv5-fixed-code" style="line-height:2.2">
        <span class="lv5-fix-line">
          <span class="py-var">scale</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"</span><input
            class="lv1-code-blank lv5-fix-input" id="lv5-fix-inp"
            placeholder="B3" value="B3" maxlength="3"
            autocomplete="off" spellcheck="false"
            oninput="lv5FixPreview()"
          ><span class="py-str">"</span><span class="py-op">, </span><span class="py-str">"A4"</span>]
          <span class="lv5-fix-hint" id="lv5-fix-hint"></span>
        </span>
        <span class="lv1-code-line">
          <span class="py-kw">for</span> <span class="py-var">note</span> <span class="py-kw">in</span> <span class="py-var">scale</span><span class="py-op">:</span>
        </span>
        <span class="lv1-code-line">
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">note</span><span class="py-op">)</span>
        </span>
      </div>

      <div class="lv5-test-compare" id="lv5-test-compare" style="display:none">
        <div class="lv5-tc-col">
          <div class="lv5-tc-label">Buggy</div>
          <div class="lv5-tc-notes">
            ${LV5_BUGGY.map((n, i) =>
              `<div class="lv5-note-pill ${i === LV5_BUG_IDX ? 'bug' : 'correct'}">${n}</div>`
            ).join('')}
          </div>
        </div>
        <div class="lv5-tc-arrow">→</div>
        <div class="lv5-tc-col">
          <div class="lv5-tc-label">Fixed</div>
          <div class="lv5-tc-notes" id="lv5-tc-fixed">
            ${LV5_CORRECT.map(n => `<div class="lv5-note-pill correct">${n}</div>`).join('')}
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv5P3PlayBuggy()">
          ${icon('play', 12)} Play buggy
        </button>
        <button class="lv1-btn secondary" onclick="lv5P3PlayFixed()">
          ${icon('play', 12)} Play fixed
        </button>
        <button class="lv1-btn secondary" onclick="lv5P3Check()">Check fix</button>
        <button class="lv1-btn success" id="lv5-complete-btn" onclick="lv5Complete()" style="display:none">
          Complete Level 5!
        </button>
      </div>
      <div id="lv5-p3-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv5FixPreview() {
  const inp = document.getElementById('lv5-fix-inp');
  const hint = document.getElementById('lv5-fix-hint');
  if (!inp) return;
  const val = inp.value.trim().toUpperCase().replace(/[^A-G#B0-9]/g, '');
  inp.value = val;
  lv5FixedNotes[LV5_BUG_IDX] = val || 'B3';
  if (hint) {
    if (val === 'G4') {
      hint.innerHTML = '<span style="color:#2E7D32;font-weight:700;font-size:11px">✓ correct!</span>';
    } else if (val.length >= 2) {
      hint.innerHTML = '<span style="color:#C62828;font-weight:700;font-size:11px">should go up from E4…</span>';
    } else {
      hint.textContent = '';
    }
  }
}

async function lv5P3PlayBuggy() {
  await initTone();
  for (const n of LV5_BUGGY) await playNote(n, 1);
}

async function lv5P3PlayFixed() {
  const inp = document.getElementById('lv5-fix-inp');
  const note = (inp ? inp.value.trim().toUpperCase() : 'B3') || 'B3';
  const notes = [...LV5_BUGGY];
  notes[LV5_BUG_IDX] = note;
  await initTone();
  for (const n of notes) await playNote(n, 1);
}

function lv5P3Check() {
  const inp = document.getElementById('lv5-fix-inp');
  const val = inp ? inp.value.trim().toUpperCase() : '';
  const fb = document.getElementById('lv5-p3-fb');
  fb.style.display = 'block';

  if (val === 'G4') {
    inp.className = 'lv1-code-blank ok';
    fb.className = 'lv1-feedback success';
    fb.innerHTML = 'Bug fixed! <code>scale = ["C4", "E4", "G4", "A4"]</code> — the scale now rises correctly. Hit "Play fixed" to confirm, then complete!';
    document.getElementById('lv5-complete-btn').style.display = 'inline-flex';
    document.getElementById('lv5-test-compare').style.display = 'flex';
    lv5P3Fixed = true;
  } else {
    inp.className = 'lv1-code-blank bad';
    fb.className = 'lv1-feedback error';
    if (!val) {
      fb.textContent = 'Type a note in the blank — the scale should go C4 → E4 → ? → A4, rising each step.';
    } else {
      fb.innerHTML = `<code>"${val}"</code> doesn't fix it. The pattern is a rising scale: C4 (low) → E4 → <em>?</em> → A4 (high). What note sits between E4 and A4?`;
    }
  }
}

function lv5Complete() {
  completeLevel(5);
  backToLevels();
}
