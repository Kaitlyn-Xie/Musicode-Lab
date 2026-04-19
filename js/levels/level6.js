// ════════════════════════════════════════════════════════════
// LEVEL 6 — SEARCH & SORT
// ════════════════════════════════════════════════════════════

let lv6Phase = 1;

// ── Phase 1 state ──────────────────────────────────────
const LV6_SEARCH_LIST = ['E4', 'C4', 'A4', 'G4', 'F4']; // A4 is max
let lv6SearchStep = -1;   // which index we're currently inspecting
let lv6SearchFound = false;
let lv6SearchPlaying = false;
let lv6SearchDone = false;
let lv6P1Answered = false;

// MIDI-like values for comparison display
const LV6_MIDI = { 'C4':60,'D4':62,'E4':64,'F4':65,'G4':67,'A4':69,'B4':71,'C5':72 };

// ── Phase 2 state ──────────────────────────────────────
const LV6_SORT_TARGET  = ['C4', 'E4', 'G4', 'A4'];
let lv6SortList = ['G4', 'C4', 'A4', 'E4']; // scrambled, student sorts
let lv6SortDrag = null;
let lv6SortDone = false;

// ── Phase 3 quizzes ────────────────────────────────────
const LV6_QUIZZES = [
  {
    q: 'You search through a list of 100 notes one-by-one. In the <strong>worst case</strong>, how many notes do you check?',
    opts: [
      { t: '1 — you get lucky', ok: false },
      { t: '50 — halfway through', ok: false },
      { t: '100 — you check every note', ok: true },
      { t: '10 — computers are fast', ok: false }
    ],
    exp: '<strong>Correct!</strong> In the worst case (the note is last or missing), you check all 100 — this is why we call linear search <em>O(n)</em> in computer science.'
  },
  {
    q: 'Bubble sort compares <strong>pairs</strong> of items. Which list needs <em>fewer swaps</em> to sort?',
    opts: [
      { t: '[C4, E4, G4, A4] — already in order', ok: true },
      { t: '[A4, G4, E4, C4] — completely reversed', ok: false },
      { t: 'Both need the same number', ok: false },
      { t: 'It depends on the computer speed', ok: false }
    ],
    exp: '<strong>Right!</strong> A sorted list needs <em>zero</em> swaps. A reversed list needs the most swaps. Bubble sort is fast on nearly-sorted data!'
  },
  {
    q: 'Why do programmers care about <strong>algorithm efficiency</strong>?',
    opts: [
      { t: 'Efficient code looks more professional', ok: false },
      { t: 'Slow algorithms crash computers', ok: false },
      { t: 'With large data, slow algorithms can take hours or years', ok: true },
      { t: 'Efficiency only matters for games', ok: false }
    ],
    exp: '<strong>Exactly!</strong> With 1 billion notes, a slow algorithm could take days. A faster algorithm finishes in seconds. This is the core of computer science!'
  }
];
let lv6QuizStep = 0;

// ─── Entry point ─────────────────────────────────────────────
function renderLevel6() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge" style="background:#FFF3E0;color:#885020">Level 6</div>
          <div class="lv1-title-text">Search &amp; Sort</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv6-ph-0">1 — Search</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv6-ph-1">2 — Sort</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv6-ph-2">3 — Efficiency</div>
        </div>
      </div>
      <div class="lv1-body" id="lv6-body"></div>
    </div>
  `;
  lv6Phase = 1;
  lv6SearchStep = -1; lv6SearchFound = false;
  lv6SearchPlaying = false; lv6SearchDone = false; lv6P1Answered = false;
  lv6SortList = ['G4', 'C4', 'A4', 'E4'];
  lv6SortDrag = null; lv6SortDone = false;
  lv6QuizStep = 0;
  lv6ShowPhase(1);
}

function lv6ShowPhase(p) {
  lv6Phase = p;
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('lv6-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i === p - 1 ? ' active' : (i < p - 1 ? ' done' : ''));
  });
  const body = document.getElementById('lv6-body');
  if (!body) return;
  if (p === 1) lv6RenderPhase1(body);
  else if (p === 2) lv6RenderPhase2(body);
  else if (p === 3) lv6RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — Linear Search (find the highest note)
// ══════════════════════════════════════════════════════
function lv6RenderPhase1(body) {
  lv6SearchStep = -1; lv6SearchFound = false;
  lv6SearchPlaying = false; lv6SearchDone = false; lv6P1Answered = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Find the Highest Note</div>
      <p class="lv1-activity-sub">
        A computer finds the maximum by scanning the list one item at a time — this is called
        <strong>linear search</strong>. Click <strong>Step</strong> to walk through it yourself,
        or <strong>Auto-run</strong> to watch it animate automatically.
      </p>

      <div class="lv6-search-list" id="lv6-search-list"></div>

      <div class="lv6-search-log" id="lv6-search-log">
        <div class="lv6-log-row init">Start: current max = <strong>none</strong></div>
      </div>

      <div class="lv6-search-status" id="lv6-search-status">
        Step through the list to find the highest note.
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" id="lv6-step-btn" onclick="lv6SearchStep_()">
          Step →
        </button>
        <button class="lv1-btn secondary" id="lv6-auto-btn" onclick="lv6SearchAuto()">
          Auto-run
        </button>
        <button class="lv1-btn secondary" onclick="lv6SearchReset()">Reset</button>
        <button class="lv1-btn primary" id="lv6-p1-next" onclick="lv6ShowPhase(2)" style="display:none">
          Next: Sort →
        </button>
      </div>

      <div id="lv6-p1-question" style="display:none">
        <div class="lv6-search-question">
          <div class="lv1-activity-heading" style="font-size:14px;margin-bottom:10px">
            How many comparisons did the algorithm make?
          </div>
          <div class="lv3-count-opts" id="lv6-cmp-opts">
            ${[3,4,5,6].map(n =>
              `<button class="lv3-count-opt" onclick="lv6P1Answer(${n})">${n}</button>`
            ).join('')}
          </div>
          <div id="lv6-p1-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>

      <div class="lv1-success-concept" id="lv6-search-reveal">
        <div class="lv1-success-concept-label">That's Linear Search!</div>
        <p>You compared <strong>each item once</strong> — that's ${LV6_SEARCH_LIST.length} comparisons for a list of ${LV6_SEARCH_LIST.length} notes. For a list of 1,000 notes you'd need up to 1,000 comparisons. We call this <strong>O(n)</strong> — "order n".</p>
        <p>The key insight: you must check <em>every item</em> because the maximum could be anywhere.</p>
      </div>
    </div>
  `;
  lv6SearchRenderList();
}

function lv6SearchRenderList() {
  const el = document.getElementById('lv6-search-list');
  if (!el) return;
  const curMaxNote = lv6SearchStep >= 0
    ? LV6_SEARCH_LIST.slice(0, lv6SearchStep + 1).reduce((m, n) =>
        (LV6_MIDI[n] > LV6_MIDI[m] ? n : m), LV6_SEARCH_LIST[0])
    : null;

  el.innerHTML = LV6_SEARCH_LIST.map((note, i) => {
    let cls = 'lv6-search-card';
    if (i < lv6SearchStep) cls += ' checked';
    if (i === lv6SearchStep) cls += ' current';
    if (lv6SearchDone && note === curMaxNote) cls += ' max-found';
    const barH = Math.round(((LV6_MIDI[note] || 60) - 59) / 13 * 48 + 10);
    return `<div class="${cls}" id="lv6-sc-${i}">
      <div class="lv6-sc-note">${note}</div>
      <div class="lv6-sc-bar-wrap"><div class="lv6-sc-bar" style="height:${barH}px"></div></div>
      <div class="lv6-sc-idx">#${i + 1}</div>
    </div>`;
  }).join('');
}

let lv6SearchCurMax = null;
let lv6SearchComparisons = 0;

function lv6SearchStep_() {
  if (lv6SearchDone) return;
  lv6SearchStep++;
  if (lv6SearchStep === 0) {
    lv6SearchCurMax = LV6_SEARCH_LIST[0];
    lv6SearchComparisons = 0;
  }
  const note = LV6_SEARCH_LIST[lv6SearchStep];
  const log = document.getElementById('lv6-search-log');
  const status = document.getElementById('lv6-search-status');

  lv6SearchComparisons++;
  let logMsg = '';
  if (lv6SearchStep === 0) {
    logMsg = `Check #1: <strong>${note}</strong> — first item, set as current max`;
  } else {
    const prev = lv6SearchCurMax;
    if ((LV6_MIDI[note] || 0) > (LV6_MIDI[prev] || 0)) {
      logMsg = `Check #${lv6SearchComparisons}: <strong>${note}</strong> > ${prev} — new max!`;
      lv6SearchCurMax = note;
    } else {
      logMsg = `Check #${lv6SearchComparisons}: <strong>${note}</strong> ≤ ${prev} — keep max as ${prev}`;
    }
  }

  if (log) {
    const row = document.createElement('div');
    row.className = 'lv6-log-row' + (lv6SearchStep === 0 || (LV6_MIDI[note] > LV6_MIDI[LV6_SEARCH_LIST[lv6SearchStep - 1]]) ? ' new-max' : '');
    row.innerHTML = logMsg;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  lv6SearchRenderList();

  if (lv6SearchStep === LV6_SEARCH_LIST.length - 1) {
    lv6SearchDone = true;
    lv6SearchRenderList();
    if (status) status.innerHTML = `Search complete! Highest note: <strong>${lv6SearchCurMax}</strong> — found after ${lv6SearchComparisons} comparisons.`;
    const stepBtn = document.getElementById('lv6-step-btn');
    const autoBtn = document.getElementById('lv6-auto-btn');
    if (stepBtn) stepBtn.disabled = true;
    if (autoBtn) autoBtn.disabled = true;
    document.getElementById('lv6-p1-question').style.display = 'block';
  } else {
    if (status) status.textContent = `Checked ${lv6SearchStep + 1} of ${LV6_SEARCH_LIST.length}. Current max: ${lv6SearchCurMax}`;
  }
}

async function lv6SearchAuto() {
  if (lv6SearchPlaying || lv6SearchDone) return;
  lv6SearchPlaying = true;
  document.getElementById('lv6-step-btn').disabled = true;
  document.getElementById('lv6-auto-btn').disabled = true;
  lv6SearchReset(true);
  for (let i = 0; i < LV6_SEARCH_LIST.length; i++) {
    lv6SearchStep_();
    await new Promise(r => setTimeout(r, 700));
  }
  lv6SearchPlaying = false;
}

function lv6SearchReset(silent) {
  lv6SearchStep = -1; lv6SearchFound = false;
  lv6SearchDone = false; lv6SearchCurMax = null; lv6SearchComparisons = 0;
  lv6SearchRenderList();
  const log = document.getElementById('lv6-search-log');
  if (log) log.innerHTML = '<div class="lv6-log-row init">Start: current max = <strong>none</strong></div>';
  const status = document.getElementById('lv6-search-status');
  if (status) status.textContent = 'Step through the list to find the highest note.';
  if (!silent) {
    const s = document.getElementById('lv6-step-btn');
    const a = document.getElementById('lv6-auto-btn');
    if (s) s.disabled = false;
    if (a) a.disabled = false;
    const q = document.getElementById('lv6-p1-question');
    if (q) q.style.display = 'none';
    const reveal = document.getElementById('lv6-search-reveal');
    if (reveal) reveal.classList.remove('visible');
  }
}

function lv6P1Answer(n) {
  if (lv6P1Answered) return;
  const correct = LV6_SEARCH_LIST.length; // 5
  const fb = document.getElementById('lv6-p1-fb');
  const btns = document.querySelectorAll('#lv6-cmp-opts .lv3-count-opt');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '0.45'; });
  const picked = [...btns].find(b => +b.textContent === n);
  if (n === correct) {
    if (picked) { picked.style.opacity = '1'; picked.classList.add('correct'); }
    fb.style.display = 'block';
    fb.className = 'lv1-feedback success';
    fb.textContent = `Correct! ${correct} items → ${correct} comparisons. One check per item.`;
    lv6P1Answered = true;
    document.getElementById('lv6-search-reveal').classList.add('visible');
    document.getElementById('lv6-p1-next').style.display = 'inline-flex';
  } else {
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
    if (picked) { picked.disabled = true; picked.style.opacity = '0.35'; picked.classList.add('wrong'); }
    fb.style.display = 'block';
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Count the steps in the log — each row is one comparison.';
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Bubble Sort (drag to sort)
// ══════════════════════════════════════════════════════
function lv6RenderPhase2(body) {
  lv6SortList = ['G4', 'C4', 'A4', 'E4'];
  lv6SortDrag = null; lv6SortDone = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Sort the Scrambled Scale</div>
      <p class="lv1-activity-sub">
        These 4 notes are out of order. Drag them into the correct order
        (<strong>lowest → highest pitch</strong>) to sort the scale.
        Then we'll see how bubble sort does it automatically!
      </p>

      <div class="lv6-target-hint">
        Target: lowest → highest &nbsp;·&nbsp;
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px">C4 → E4 → G4 → A4</span>
      </div>

      <div class="lv6-sort-row" id="lv6-sort-row"></div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv6SortCheck()">Check order</button>
        <button class="lv1-btn secondary" onclick="lv6SortReset()">Reset</button>
        <button class="lv1-btn secondary" id="lv6-autosort-btn" onclick="lv6BubbleSortAnimate()">
          Watch bubble sort
        </button>
        <button class="lv1-btn primary" id="lv6-p2-next" onclick="lv6ShowPhase(3)" style="display:none">
          Next: Efficiency →
        </button>
      </div>
      <div id="lv6-p2-fb" class="lv1-feedback" style="display:none"></div>

      <div class="lv1-success-concept" id="lv6-sort-reveal">
        <div class="lv1-success-concept-label">That's Bubble Sort!</div>
        <p>Bubble sort repeatedly compares <strong>adjacent pairs</strong> and swaps them if they're out of order. Large values "bubble up" to the end. For 4 items it takes at most <strong>6 comparisons</strong>.</p>
        <p>It's simple but not the fastest for large lists — smarter algorithms like <em>merge sort</em> or <em>quicksort</em> can sort a million items in a fraction of the time.</p>
      </div>
    </div>
  `;
  lv6SortRender();
}

function lv6SortRender() {
  const row = document.getElementById('lv6-sort-row');
  if (!row) return;
  row.innerHTML = '';
  lv6SortList.forEach((note, i) => {
    const barH = Math.round(((LV6_MIDI[note] || 60) - 59) / 13 * 40 + 10);
    const card = document.createElement('div');
    card.className = 'lv6-sort-card';
    card.draggable = true;
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="lv6-sc-note">${note}</div>
      <div class="lv6-sc-bar-wrap"><div class="lv6-sc-bar" style="height:${barH}px"></div></div>
    `;
    card.addEventListener('dragstart', e => {
      lv6SortDrag = i;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if (lv6SortDrag === null || lv6SortDrag === i) return;
      const tmp = lv6SortList[lv6SortDrag];
      lv6SortList[lv6SortDrag] = lv6SortList[i];
      lv6SortList[i] = tmp;
      lv6SortDrag = null;
      lv6SortRender();
    });
    row.appendChild(card);
  });
}

function lv6SortCheck() {
  const fb = document.getElementById('lv6-p2-fb');
  fb.style.display = 'block';
  const sorted = lv6SortList.every((n, i) => n === LV6_SORT_TARGET[i]);
  if (sorted) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = 'Correct order! C4 → E4 → G4 → A4 — the scale is sorted lowest to highest.';
    lv6SortDone = true;
    document.getElementById('lv6-sort-reveal').classList.add('visible');
    document.getElementById('lv6-p2-next').style.display = 'inline-flex';
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — drag the cards so lowest pitch (C4) is on the left, highest (A4) on the right.';
  }
}

function lv6SortReset() {
  lv6SortList = ['G4', 'C4', 'A4', 'E4'];
  lv6SortDone = false;
  lv6SortRender();
  const fb = document.getElementById('lv6-p2-fb');
  if (fb) fb.style.display = 'none';
  const next = document.getElementById('lv6-p2-next');
  if (next) next.style.display = 'none';
  const reveal = document.getElementById('lv6-sort-reveal');
  if (reveal) reveal.classList.remove('visible');
}

async function lv6BubbleSortAnimate() {
  const btn = document.getElementById('lv6-autosort-btn');
  if (btn) btn.disabled = true;
  // Reset to scrambled first
  lv6SortList = ['G4', 'C4', 'A4', 'E4'];
  lv6SortRender();
  await new Promise(r => setTimeout(r, 400));

  const arr = [...lv6SortList];
  const n = arr.length;
  for (let pass = 0; pass < n - 1; pass++) {
    for (let j = 0; j < n - 1 - pass; j++) {
      // Highlight comparing pair
      const cards = document.querySelectorAll('.lv6-sort-card');
      cards.forEach(c => c.classList.remove('comparing', 'swapping'));
      if (cards[j]) cards[j].classList.add('comparing');
      if (cards[j+1]) cards[j+1].classList.add('comparing');
      await new Promise(r => setTimeout(r, 500));

      if ((LV6_MIDI[arr[j]] || 0) > (LV6_MIDI[arr[j+1]] || 0)) {
        // Swap
        cards.forEach(c => c.classList.remove('comparing'));
        if (cards[j]) cards[j].classList.add('swapping');
        if (cards[j+1]) cards[j+1].classList.add('swapping');
        await new Promise(r => setTimeout(r, 350));
        const tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
        lv6SortList = [...arr];
        lv6SortRender();
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }
  lv6SortList = [...arr];
  lv6SortRender();
  lv6SortDone = true;
  document.getElementById('lv6-sort-reveal').classList.add('visible');
  document.getElementById('lv6-p2-next').style.display = 'inline-flex';
  const fb = document.getElementById('lv6-p2-fb');
  if (fb) { fb.style.display = 'block'; fb.className = 'lv1-feedback success'; fb.textContent = 'Sorted! That\'s bubble sort — compare pairs, swap if out of order, repeat.'; }
}

// ══════════════════════════════════════════════════════
// PHASE 3 — Efficiency (3 quizzes + completion)
// ══════════════════════════════════════════════════════
function lv6RenderPhase3(body) {
  lv6QuizStep = 0;
  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Why Does Efficiency Matter?</div>
        <p>Linear search and bubble sort work — but how <em>well</em> do they scale? Answer 3 questions to find out.</p>
      </div>
      <div id="lv6-quiz-area"></div>
    </div>
  `;
  lv6RenderQuiz(0);
}

function lv6RenderQuiz(idx) {
  const area = document.getElementById('lv6-quiz-area');
  if (!area) return;
  if (idx >= LV6_QUIZZES.length) {
    // All done — show completion
    area.innerHTML = `
      <div class="lv6-complete-card">
        <div class="lv6-complete-icon">${icon('trophy', 36)}</div>
        <div class="lv6-complete-title">All Questions Answered!</div>
        <div class="lv6-complete-sub">
          You've learned:<br>
          • <strong>Linear search</strong> — O(n), checks each item once<br>
          • <strong>Bubble sort</strong> — compares adjacent pairs, repeats until sorted<br>
          • <strong>Efficiency</strong> — why algorithm choice matters at scale
        </div>
      </div>
      <div class="lv1-actions" style="margin-top:16px">
        <button class="lv1-btn success" onclick="lv6Complete()">Complete Level 6!</button>
      </div>
    `;
    return;
  }

  const q = LV6_QUIZZES[idx];
  area.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <p class="lv1-activity-sub" style="font-size:13px;color:var(--text)">Question ${idx + 1} of ${LV6_QUIZZES.length}</p>
      <div class="lv1-activity-heading" style="font-size:14px">${q.q}</div>
      <div class="lv1-quiz-options" id="lv6-qz-opts">
        ${q.opts.map(o =>
          `<button class="lv1-quiz-opt" onclick="lv6Answer(this,${o.ok},${idx})">${o.t}</button>`
        ).join('')}
      </div>
      <div id="lv6-qz-fb" class="lv1-feedback" style="display:none"></div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv6-qz-next" onclick="lv6RenderQuiz(${idx + 1})" style="display:none">
          ${idx < LV6_QUIZZES.length - 1 ? 'Next question →' : 'See results →'}
        </button>
      </div>
    </div>
  `;
}

function lv6Answer(btn, correct, idx) {
  document.querySelectorAll('#lv6-qz-opts .lv1-quiz-opt').forEach(b => {
    b.disabled = true; b.style.opacity = '0.55';
  });
  btn.style.opacity = '1';
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    const correctText = LV6_QUIZZES[idx].opts.find(o => o.ok).t;
    document.querySelectorAll('#lv6-qz-opts .lv1-quiz-opt').forEach(b => {
      if (b.textContent.trim() === correctText) { b.classList.add('correct'); b.style.opacity = '1'; }
    });
  }
  const fb = document.getElementById('lv6-qz-fb');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'lv1-feedback ' + (correct ? 'success' : 'error');
    fb.innerHTML = correct ? LV6_QUIZZES[idx].exp : 'Not quite! ' + LV6_QUIZZES[idx].exp;
  }
  const nb = document.getElementById('lv6-qz-next');
  if (nb) nb.style.display = 'inline-flex';
}

function lv6Complete() {
  completeLevel(6);
  backToLevels();
}
