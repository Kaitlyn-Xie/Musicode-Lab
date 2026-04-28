// ════════════════════════════════════════════════════════════
// LEVEL 6 — SEARCH & SORT
// ════════════════════════════════════════════════════════════

let lv6Phase = 1;
let lv6P3Step = 0;
let lv6ReadOpened = [false, false, false];

// Song Workshop state
const LV6_ODE = ['E4','E4','F4','G4','G4','F4','E4','D4'];
const LV6_ODE_PALETTE = ['D4','E4','F4','G4'];
let lv6OdeSeq = [];
const LV6_OWN_NOTE_OPTIONS = ['C4','D4','E4','F4','G4','A4','B4'];
const LV6_OWN_PITCH_PCT = { 'C4':12,'D4':25,'E4':38,'F4':50,'G4':63,'A4':75,'B4':88 };
let lv6OwnPickedNotes = ['C4','E4','G4'];

const LV6_CT_CONCEPTS = [
  {
    title: 'Sorting',
    icon: 'algorithm',
    body: '<strong>Sorting</strong> arranges data in order — low to high, A to Z, quiet to loud. Sorting makes everything else faster: once notes are sorted by pitch, you can search, compare, and analyse them instantly.'
  },
  {
    title: 'Searching',
    icon: 'blocks',
    body: '<strong>Searching</strong> finds a specific item in a collection. Linear search checks one by one (slow); binary search halves the list each step (fast). The right algorithm on sorted data is dramatically faster.'
  },
  {
    title: 'Efficiency',
    icon: 'variable',
    body: '<strong>Efficiency</strong> measures how much work an algorithm needs. A slow algorithm on 1 million notes could take hours; an efficient one finishes in milliseconds. This is why algorithm choice matters at scale.'
  }
];

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
          <div class="lv1-lvbadge lv-6">Level 6</div>
          <div class="lv1-title-text">Search &amp; Sort</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv6-ph-0">1 — Search</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv6-ph-1">2 — Sort</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv6-ph-2">3 — How Computers Think</div>
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
          Next: How Computers Think →
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
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv6RenderPhase3(body) {
  lv6P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv6-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv6-p3-main"></div>
      </div>
    </div>
  `;
  lv6P3Goto(0);
}

function lv6P3UpdateNav(step) {
  const labels = ['Concepts','Listen','Build','Discover','Create!'];
  const nav = document.getElementById('lv6-p3-nav');
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

function lv6P3Goto(step) {
  lv6P3Step = step;
  lv6P3UpdateNav(step);
  const main = document.getElementById('lv6-p3-main');
  if (!main) return;
  if (step === 0) lv6P3Read(main);
  else if (step === 1) lv6OdeListen(main);
  else if (step === 2) lv6OdeBuild(main);
  else if (step === 3) lv6OdeDiscover(main);
  else if (step === 4) lv6P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv6P3Read(main) {
  lv6ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just searched and sorted musical data. Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${LV6_CT_CONCEPTS.map((c, i) => `
        <div class="lv1-read-block" id="lv6-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv6ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv6-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv6-read-next" onclick="lv6P3Goto(1)" style="display:none">Next: Build the Song →</button>
      </div>
    </div>
  `;
}

function lv6ReadToggle(idx) {
  lv6ReadOpened[idx] = !lv6ReadOpened[idx];
  const btn = document.querySelector('#lv6-read-' + idx + ' .lv1-read-line-btn');
  const exp = document.getElementById('lv6-re-' + idx);
  if (btn) btn.classList.toggle('opened', lv6ReadOpened[idx]);
  if (exp) exp.classList.toggle('open', lv6ReadOpened[idx]);
  if (lv6ReadOpened.every(x => x)) {
    const nb = document.getElementById('lv6-read-next');
    if (nb) nb.style.display = 'inline-flex';
  }
}

/* Step 1 — Listen */
function lv6OdeListen(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">欢乐颂 — Ode to Joy</div>
        <p>Listen to the opening phrase of Ode to Joy! The notes step up and then back down — just like how sorted data makes searching and comparing easier.</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ Ode to Joy 欢乐颂</div>
        <div class="lv1-song-card-lyrics">"欢乐颂，欢乐颂，欢乐女神圣洁美..."</div>
        <div class="lv1-song-card-notes">
          ${LV6_ODE.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:14px;gap:8px" onclick="lv6OdePlayTarget()">
          ${icon('play',13)} Listen to the phrase
        </button>
        <div id="lv6-ode-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv6P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv6OdePlayTarget() {
  const ind = document.getElementById('lv6-ode-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV6_ODE) { await playNote(n, 0.75); }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Build */
function lv6OdeBuild(main) {
  lv6OdeSeq = [];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Sequence</div>
      <p class="lv1-activity-sub">
        Tap the note tiles below to place them in order. The song needs <strong>8 notes</strong>.
        Use the hint if you get stuck!
      </p>

      <div class="lv1-tw-slots" id="lv6-ode-slots"></div>

      <div class="lv1-tw-palette">
        ${LV6_ODE_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv6OdeTap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px" onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv6OdeClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv6OdePlaySeq()">Play</button>
        <button class="lv1-btn secondary" onclick="lv6OdeHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv6OdeCheck()">Check</button>
      </div>
      <div id="lv6-ode-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv6-ode-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> Ode to Joy goes E E F G G F E D — steps up then back down.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">E4 E4 F4 G4 G4 F4 E4 D4</span>
      </div>
    </div>
  `;
  lv6OdeRenderSlots();
}

function lv6OdeRenderSlots() {
  const container = document.getElementById('lv6-ode-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv6OdeSeq.length ? ' filled' : '');
    if (i < lv6OdeSeq.length) {
      slot.textContent = lv6OdeSeq[i];
      slot.onclick = () => { lv6OdeSeq.splice(i, 1); lv6OdeRenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv6OdeTap(note) {
  if (lv6OdeSeq.length >= 8) return;
  lv6OdeSeq.push(note);
  lv6OdeRenderSlots();
}

function lv6OdeClear() {
  lv6OdeSeq = [];
  lv6OdeRenderSlots();
  const fb = document.getElementById('lv6-ode-fb');
  if (fb) fb.style.display = 'none';
}

async function lv6OdePlaySeq() {
  if (!lv6OdeSeq.length) return;
  await initTone();
  for (const n of lv6OdeSeq) { await playNote(n, 0.75); }
}

function lv6OdeHint() {
  const h = document.getElementById('lv6-ode-hint');
  if (h) h.classList.toggle('visible');
}

async function lv6OdeCheck() {
  const fb = document.getElementById('lv6-ode-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv6OdeSeq.length < 8) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need 8 notes — you have ${lv6OdeSeq.length} so far. Keep going!`;
    return;
  }
  const correct = lv6OdeSeq.every((n, i) => n === LV6_ODE[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Perfect! Listen to your sequence...';
    await initTone();
    for (const n of LV6_ODE) { await playNote(n, 0.75); }
    fb.textContent = '🎵 That\'s Ode to Joy! Now let\'s see what you discovered...';
    setTimeout(() => lv6P3Goto(3), 1400);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — the order isn\'t right yet. Try playing your sequence and compare it to the Listen step!';
  }
}

/* Step 3 — Discover */
async function lv6OdeDiscover(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">You sorted the melody!</div>
        <p>The notes rise then fall — a sorted pattern. When data is ordered, searching is instant. That's why efficient algorithms matter.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(255,160,30,0.08),rgba(200,80,30,0.08))">
        <div class="lv1-song-card-title">Your sequence = ordered algorithm</div>
        <div class="lv1-song-card-notes" id="lv6-disc-notes">
          ${LV6_ODE.map((n,i) => `<span class="lv1-song-note-pill" id="lv6-disc-${i}">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv6OdePlayAndHighlight()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left;background:linear-gradient(135deg,rgba(255,160,30,0.07),rgba(200,80,30,0.05))">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(255,160,30,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#885020;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Sorting</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Ordered data enables faster search</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Searching</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Binary search halves the list each step</div>
          </div>
          <div style="background:rgba(24,160,80,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Efficiency</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Right algorithm finishes in milliseconds</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv6P3Goto(4)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const n of LV6_ODE) { await playNote(n, 0.75); }
}

async function lv6OdePlayAndHighlight() {
  await initTone();
  for (let i = 0; i < LV6_ODE.length; i++) {
    document.querySelectorAll('#lv6-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
    const pill = document.getElementById('lv6-disc-' + i);
    if (pill) pill.classList.add('playing');
    await playNote(LV6_ODE[i], 0.75);
  }
  document.querySelectorAll('#lv6-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 4 — Create! */
function lv6P3WriteOwn(main) {
  lv6OwnPickedNotes = ['C4','E4','G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">Pick up to 7 notes to create your own melody, then play it!</p>

      <div class="lv2-note-picker" id="lv6-own-picker">
        ${LV6_OWN_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv6-own-tile-${note}" onclick="lv6OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV6_OWN_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv6OwnPlay()">${icon('play',12)} Play my melody</button>
        <button class="lv1-btn success" onclick="lv6Complete()">Complete Level 6!</button>
      </div>
    </div>
  `;
  lv6UpdateOwnPicker();
}

function lv6OwnToggleNote(note) {
  const idx = lv6OwnPickedNotes.indexOf(note);
  if (idx >= 0) lv6OwnPickedNotes.splice(idx, 1);
  else { if (lv6OwnPickedNotes.length >= 7) return; lv6OwnPickedNotes.push(note); }
  lv6UpdateOwnPicker();
}

function lv6UpdateOwnPicker() {
  LV6_OWN_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv6-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv6OwnPickedNotes.includes(note));
  });
}

async function lv6OwnPlay() {
  if (!lv6OwnPickedNotes.length) return;
  await initTone();
  for (const n of lv6OwnPickedNotes) { await playNote(n, 1); }
}

function lv6Complete() {
  completeLevel(6);
  backToLevels();
}
