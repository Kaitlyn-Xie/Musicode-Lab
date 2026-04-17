// ════════════════════════════════════════════════════════════
// LEVEL 3 — LOOPS & REPETITION
// ════════════════════════════════════════════════════════════

let lv3Phase = 1;
let lv3P1Playing = false;
let lv3P1Answered = false;
let lv3Seq = [];
let lv3RepeatCount = 3;
let lv3DragType = null;
let lv3P3Step = 0;
let lv3ReadOpened = [false, false, false];
let lv3OwnCount = 3;

const LV3_PHRASE = ['C4', 'E4', 'G4'];
const LV3_VAR = 'phrase';

// ─── Entry point ─────────────────────────────────────────────
function renderLevel3() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge" style="background:#FFF8E1;color:#5D4200">Level 3</div>
          <div class="lv1-title-text">Loops &amp; Repetition</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv3-ph-0">1 — Patterns</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv3-ph-1">2 — Blocks</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv3-ph-2">3 — Python</div>
        </div>
      </div>
      <div class="lv1-body" id="lv3-body"></div>
    </div>
  `;
  lv3Phase = 1;
  lv3P1Playing = false;
  lv3P1Answered = false;
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
// PHASE 1 — Patterns in music
// ══════════════════════════════════════════════════════
function lv3RenderPhase1(body) {
  lv3P1Playing = false;
  lv3P1Answered = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Spot the Loop</div>
      <p class="lv1-activity-sub">
        Music loves repetition — verses, choruses, and riffs all repeat.
        Below is a sequence of 9 notes. Hit <strong>Play</strong> to hear it,
        then answer the question.
      </p>

      <div class="lv3-pattern-visual" id="lv3-pattern-visual">
        ${[0,1,2].map(row => `
          <div class="lv3-pattern-row">
            ${LV3_PHRASE.map((note, col) =>
              `<div class="lv3-pat-note" id="lv3-pat-${row}-${col}">${note}</div>`
            ).join('')}
            <div class="lv3-row-label">phrase ${row + 1}</div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions" style="margin-top:4px">
        <button class="lv1-btn secondary" id="lv3-play-btn" onclick="lv3P1Play()">
          ${icon('play', 12)} Play sequence
        </button>
      </div>

      <div class="lv3-p1-question" id="lv3-p1-question" style="display:none">
        <div class="lv1-activity-heading" style="font-size:14px;margin-bottom:10px">
          How many times does the phrase <code>[C4  E4  G4]</code> repeat?
        </div>
        <div class="lv3-count-opts">
          ${[2,3,4,5].map(n =>
            `<button class="lv3-count-opt" onclick="lv3P1Answer(${n})">${n}</button>`
          ).join('')}
        </div>
        <div id="lv3-p1-fb" class="lv1-feedback" style="display:none"></div>
      </div>

      <div class="lv1-success-concept" id="lv3-loop-reveal">
        <div class="lv1-success-concept-label">That Repetition = A Loop!</div>
        <p>Without a loop you'd need <strong>9 separate instructions</strong>.
           With a loop, just <strong>2 lines of logic</strong>:</p>
        <div class="lv3-compare-wrap">
          <div class="lv3-compare-col">
            <div class="lv3-compare-label">Without loop — 9 lines</div>
            <div class="lv3-compare-blocks">
              ${Array(3).fill(LV3_PHRASE).flat().map(n =>
                `<div class="lv3-compare-block">play note ${n}</div>`
              ).join('')}
            </div>
          </div>
          <div class="lv3-compare-vs">vs</div>
          <div class="lv3-compare-col">
            <div class="lv3-compare-label">With loop — 2 lines</div>
            <div class="lv3-compare-blocks">
              <div class="lv3-loop-vis-header">${icon('repeat',12)} repeat 3 times:</div>
              <div class="lv3-loop-vis-body">
                <div class="lv3-compare-block inner">${icon('music',12)} play( phrase )</div>
              </div>
              <div class="lv3-loop-vis-footer">end</div>
            </div>
          </div>
        </div>
        <p>A <strong>loop</strong> says "do these steps N times." Change one number → completely different output!</p>
      </div>

      <div class="lv1-actions" id="lv3-p1-next-row" style="display:none">
        <button class="lv1-btn primary" onclick="lv3ShowPhase(2)">Next: Build a Loop →</button>
      </div>
    </div>
  `;
}

async function lv3P1Play() {
  if (lv3P1Playing) return;
  lv3P1Playing = true;
  const btn = document.getElementById('lv3-play-btn');
  if (btn) btn.disabled = true;
  await initTone();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < LV3_PHRASE.length; col++) {
      document.querySelectorAll('.lv3-pat-note.active').forEach(el => el.classList.remove('active'));
      const cell = document.getElementById(`lv3-pat-${row}-${col}`);
      if (cell) cell.classList.add('active');
      await playNote(LV3_PHRASE[col], 1);
    }
  }
  document.querySelectorAll('.lv3-pat-note.active').forEach(el => el.classList.remove('active'));
  if (btn) btn.disabled = false;
  lv3P1Playing = false;
  const q = document.getElementById('lv3-p1-question');
  if (q) q.style.display = 'block';
}

function lv3P1Answer(n) {
  if (lv3P1Answered) return;
  const fb = document.getElementById('lv3-p1-fb');
  const btns = document.querySelectorAll('.lv3-count-opt');
  btns.forEach(b => { b.disabled = true; b.style.opacity = '0.45'; });
  const picked = [...btns].find(b => +b.textContent === n);
  if (n === 3) {
    if (picked) { picked.style.opacity = '1'; picked.classList.add('correct'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback success';
      fb.textContent = 'Correct! The phrase [C4  E4  G4] repeats exactly 3 times.';
    }
    lv3P1Answered = true;
    const reveal = document.getElementById('lv3-loop-reveal');
    if (reveal) reveal.classList.add('visible');
    const nextRow = document.getElementById('lv3-p1-next-row');
    if (nextRow) nextRow.style.display = 'flex';
  } else {
    btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
    if (picked) { picked.disabled = true; picked.style.opacity = '0.35'; picked.classList.add('wrong'); }
    if (fb) {
      fb.style.display = 'block';
      fb.className = 'lv1-feedback error';
      fb.textContent = 'Not quite — count the rows! Each row shows one phrase. How many rows are there?';
    }
  }
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Build a Loop (Block Code)
// ══════════════════════════════════════════════════════
function lv3RenderPhase2(body) {
  lv3Seq = [];
  lv3RepeatCount = 3;
  lv3DragType = null;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Build Your Loop in Block Code</div>
        <p>
          The variable <code>${LV3_VAR}</code> is already defined as
          <code>[${LV3_PHRASE.map(n => '"'+n+'"').join(', ')}]</code>.
          Goal: drag a <strong>repeat</strong> block onto the canvas, then drop a
          <strong>play</strong> block <em>inside</em> it.
        </p>
      </div>

      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette">
          <div class="lv1-palette-label">Blocks</div>

          <div class="lv2-pal-block" style="background:#2E80D0"
            draggable="true" ondragstart="lv3DragStart(event,'play')" onclick="lv3TapAdd('play')">
            ${icon('music',13)} play(
            <span class="lv2-pal-badge">${LV3_VAR}</span>
            )
          </div>

          <div class="lv1-palette-label" style="margin-top:10px">Loop</div>
          <div class="lv2-pal-repeat-wrap"
            onclick="lv3TapAdd('repeat')" draggable="true" ondragstart="lv3DragStart(event,'repeat')">
            <div class="lv2-pal-repeat-header">
              ${icon('repeat',13)} repeat
              <button class="lv2-rep-btn" onclick="event.stopPropagation();lv3ChangeRepeat(-1)">−</button>
              <span class="lv2-rep-val" id="lv3-rep-val">${lv3RepeatCount}</span>
              <button class="lv2-rep-btn" onclick="event.stopPropagation();lv3ChangeRepeat(1)">+</button>
              times:
            </div>
            <div class="lv2-pal-repeat-inner">← play block here</div>
            <div class="lv2-pal-repeat-end">end</div>
          </div>

          <div class="lv1-palette-hint">drag or tap to add</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0">
          <div class="lv1-dropzone" id="lv3-canvas"
            ondragover="event.preventDefault();this.classList.add('drag-over')"
            ondragleave="this.classList.remove('drag-over')"
            ondrop="lv3CanvasDrop(event)">
            <div class="lv1-dz-placeholder" id="lv3-dz-ph">Drop blocks here…</div>
          </div>
          <div class="lv1-actions" style="padding:0">
            <button class="lv1-btn secondary" onclick="lv3ClearCanvas()">Clear</button>
            <button class="lv1-btn secondary" onclick="lv3P2Play()">Play</button>
            <button class="lv1-btn secondary" onclick="lv3P2Check()">Check</button>
            <button class="lv1-btn primary" id="lv3-p2-next" onclick="lv3ShowPhase(3)" style="display:none">Next: Python →</button>
          </div>
          <div id="lv3-p2-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
}

function lv3ChangeRepeat(delta) {
  lv3RepeatCount = Math.max(2, Math.min(8, lv3RepeatCount + delta));
  const el = document.getElementById('lv3-rep-val');
  if (el) el.textContent = lv3RepeatCount;
  lv3Seq.forEach(b => { if (b.type === 'repeat') b.count = lv3RepeatCount; });
  lv3P2Render();
}

function lv3DragStart(event, type) {
  lv3DragType = type;
  event.dataTransfer.setData('text/plain', type);
}

function lv3TapAdd(type) {
  if (type === 'repeat') {
    if (!lv3Seq.find(b => b.type === 'repeat')) {
      lv3Seq.push({ type: 'repeat', count: lv3RepeatCount, body: [] });
    }
  } else if (type === 'play') {
    const rep = lv3Seq.find(b => b.type === 'repeat');
    if (rep) {
      rep.body.push({ type: 'play' });
    } else {
      lv3Seq.push({ type: 'play' });
    }
  }
  lv3P2Render();
}

function lv3CanvasDrop(event) {
  event.preventDefault();
  document.getElementById('lv3-canvas').classList.remove('drag-over');
  const type = lv3DragType || event.dataTransfer.getData('text/plain');
  lv3TapAdd(type);
  lv3DragType = null;
}

function lv3ClearCanvas() {
  lv3Seq = [];
  lv3P2Render();
}

function lv3P2Render() {
  const canvas = document.getElementById('lv3-canvas');
  if (!canvas) return;
  canvas.querySelectorAll('.lv1-seq-block, .lv2-seq-repeat').forEach(e => e.remove());
  const ph = document.getElementById('lv3-dz-ph');
  if (ph) ph.style.display = lv3Seq.length ? 'none' : 'block';

  lv3Seq.forEach((block, idx) => {
    if (block.type === 'play') {
      const el = document.createElement('div');
      el.className = 'lv1-seq-block';
      el.innerHTML = icon('music',13) + ' play( <strong>' + LV3_VAR + '</strong> )' +
        '<button class="lv1-rm-btn" onclick="lv3RemoveBlock(' + idx + ')">' + icon('close',11) + '</button>';
      canvas.appendChild(el);
    } else if (block.type === 'repeat') {
      const wrap = document.createElement('div');
      wrap.className = 'lv2-seq-repeat';

      const header = document.createElement('div');
      header.className = 'lv2-seq-repeat-header';
      header.innerHTML = icon('repeat',13) + ' repeat <strong>' + block.count + '</strong> times:' +
        '<button class="lv1-rm-btn" style="margin-left:auto" onclick="lv3RemoveBlock(' + idx + ')">' + icon('close',11) + '</button>';
      wrap.appendChild(header);

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'lv2-seq-repeat-body';
      bodyDiv.ondragover = e => { e.preventDefault(); e.stopPropagation(); bodyDiv.classList.add('drag-over'); };
      bodyDiv.ondragleave = () => bodyDiv.classList.remove('drag-over');
      bodyDiv.ondrop = e => {
        e.preventDefault(); e.stopPropagation();
        bodyDiv.classList.remove('drag-over');
        const type = lv3DragType || e.dataTransfer.getData('text/plain');
        if (type === 'play') {
          block.body.push({ type: 'play' });
          lv3DragType = null;
          lv3P2Render();
        }
      };

      if (block.body.length === 0) {
        const hint = document.createElement('div');
        hint.className = 'lv1-dz-placeholder';
        hint.style.cssText = 'font-size:11.5px;padding:10px;margin:0';
        hint.textContent = '← drop play block here';
        bodyDiv.appendChild(hint);
      } else {
        block.body.forEach((inner, innerIdx) => {
          const innerEl = document.createElement('div');
          innerEl.className = 'lv1-seq-block';
          innerEl.style.margin = '0';
          innerEl.innerHTML = icon('music',13) + ' play( <strong>' + LV3_VAR + '</strong> )' +
            '<button class="lv1-rm-btn" onclick="lv3RemoveInner(' + idx + ',' + innerIdx + ')">' + icon('close',11) + '</button>';
          bodyDiv.appendChild(innerEl);
        });
      }
      wrap.appendChild(bodyDiv);

      const footer = document.createElement('div');
      footer.className = 'lv2-seq-repeat-footer';
      footer.textContent = 'end';
      wrap.appendChild(footer);
      canvas.appendChild(wrap);
    }
  });
}

function lv3RemoveBlock(idx) {
  lv3Seq.splice(idx, 1);
  lv3P2Render();
}

function lv3RemoveInner(blockIdx, innerIdx) {
  lv3Seq[blockIdx].body.splice(innerIdx, 1);
  lv3P2Render();
}

async function lv3P2Play() {
  await initTone();
  for (const block of lv3Seq) {
    if (block.type === 'play') {
      for (const n of LV3_PHRASE) await playNote(n, 1);
    } else if (block.type === 'repeat') {
      for (let i = 0; i < block.count; i++) {
        for (const inner of block.body) {
          if (inner.type === 'play') {
            for (const n of LV3_PHRASE) await playNote(n, 1);
          }
        }
      }
    }
  }
}

function lv3P2Check() {
  const fb = document.getElementById('lv3-p2-fb');
  if (!fb) return;
  fb.style.display = 'block';
  const repeatBlock = lv3Seq.find(b => b.type === 'repeat');
  if (!repeatBlock) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Add a repeat block to the canvas first!';
    return;
  }
  if (repeatBlock.body.length === 0 || !repeatBlock.body.some(b => b.type === 'play')) {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Drop a play block inside the repeat block!';
    return;
  }
  fb.className = 'lv1-feedback success';
  const total = repeatBlock.count * LV3_PHRASE.length;
  fb.innerHTML = `Loop built! Your code plays <strong>${LV3_VAR}</strong> ${repeatBlock.count} time${repeatBlock.count !== 1 ? 's' : ''} — ${total} notes total!`;
  document.getElementById('lv3-p2-next').style.display = 'inline-flex';
}

// ══════════════════════════════════════════════════════
// PHASE 3 — Loop in Python
// ══════════════════════════════════════════════════════
const LV3_CODE_LINES = [
  {
    code: '<span class="py-var">phrase</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span>]',
    explain: '<strong>phrase</strong> is a <em>variable</em> storing a list of 3 notes — just like you learned in Level 2. The square brackets <code>[ ]</code> make it a <em>list</em>. Each note is a string in quotes.'
  },
  {
    code: '<span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span> <span class="py-fn">range</span><span class="py-op">(</span><span class="py-num">3</span><span class="py-op">):</span>',
    explain: 'This is a <strong>for loop</strong>. <code>range(3)</code> generates three numbers: <code>0, 1, 2</code>. The loop runs once per number, so the indented code below runs <strong>3 times total</strong>. The variable <code>i</code> holds the current number each round.'
  },
  {
    code: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">phrase</span><span class="py-op">)</span>',
    explain: 'This line is <em>indented</em> — 4 spaces in. Indentation tells Python this line is <em>inside</em> the loop. It plays all 3 notes in <code>phrase</code> every time the loop runs. With <code>range(3)</code>, that\'s 3 × 3 = 9 total notes.'
  }
];

const LV3_QUIZZES = [
  {
    q: 'What does <code>for i in range(3):</code> do?',
    opts: [
      { t: 'Runs the indented code 3 times', ok: true },
      { t: 'Plays 3 notes at the same time', ok: false },
      { t: 'Pauses the music for 3 beats', ok: false },
      { t: 'Loops forever until stopped', ok: false }
    ],
    exp: '<strong>Correct!</strong> <code>range(3)</code> produces three numbers (0, 1, 2), so the loop body runs 3 times — once per number.'
  },
  {
    q: '<code>phrase</code> has 3 notes and the loop runs <code>range(3)</code>. How many total notes play?',
    opts: [
      { t: '3 — the phrase plays once', ok: false },
      { t: '6 — range doubles it', ok: false },
      { t: '9 — 3 notes × 3 repetitions', ok: true },
      { t: '12 — loops add an extra round', ok: false }
    ],
    exp: '<strong>Right!</strong> Each loop run plays all 3 notes in <code>phrase</code>. 3 runs × 3 notes = 9 total.'
  },
  {
    q: 'We change <code>range(3)</code> to <code>range(10)</code>. What happens?',
    opts: [
      { t: 'Nothing — loops always run 3 times', ok: false },
      { t: 'The phrase plays 10 times instead of 3', ok: true },
      { t: 'The loop crashes — 10 is too large', ok: false },
      { t: 'The notes play faster', ok: false }
    ],
    exp: '<strong>Exactly!</strong> Change one number → completely different output. That\'s the power of loops: easy to scale without rewriting code.'
  }
];

function lv3RenderPhase3(body) {
  lv3P3Step = 0;
  lv3ReadOpened = [false, false, false];

  body.innerHTML = `
    <div class="lv1-p3-split">

      <div class="lv1-p3-sidebar">
        <div class="lv1-p3-sidebar-label">Reference</div>

        <div>
          <div class="lv1-compare-title">Block code</div>
          <div style="margin-top:7px">
            <div class="lv2-seq-repeat" style="font-size:11.5px">
              <div class="lv2-seq-repeat-header" style="font-size:11px;padding:6px 10px">
                ${icon('repeat',11)} repeat <strong>3</strong> times:
              </div>
              <div class="lv2-seq-repeat-body" style="padding:6px 10px">
                <div class="lv1-prev-block" style="font-size:11px;padding:4px 8px">
                  ${icon('music',11)} play( ${LV3_VAR} )
                </div>
              </div>
              <div class="lv2-seq-repeat-footer" style="font-size:10px;padding:4px 10px">end</div>
            </div>
          </div>
        </div>

        <div>
          <div class="lv1-compare-title" style="margin-bottom:7px">Python equivalent</div>
          <div class="lv1-code-panel" style="font-size:11.5px;padding:11px 13px;line-height:1.85">
            <span class="lv1-code-line"><span class="py-var">phrase</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span>]</span>
            <span class="lv1-code-line">&nbsp;</span>
            <span class="lv1-code-line"><span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span> <span class="py-fn">range</span><span class="py-op">(</span><span class="py-num">3</span><span class="py-op">):</span></span>
            <span class="lv1-code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">phrase</span><span class="py-op">)</span></span>
          </div>
        </div>

        <div style="font-size:11px;color:var(--text-muted);font-weight:600;line-height:1.5;padding-top:4px">
          <code style="font-size:10px">range(n)</code> gives numbers 0 to n−1.
          The loop body is <em>indented</em> with 4 spaces.
        </div>
      </div>

      <div class="lv1-p3-resizer" id="lv3-p3-resizer"></div>

      <div class="lv1-p3-right">
        <div class="lv1-p3-nav-bar">
          <div class="lv1-p3-nav" id="lv3-p3-nav"></div>
        </div>
        <div class="lv1-p3-right-scroll">
          <div id="lv3-p3-main"></div>
        </div>
      </div>
    </div>
  `;

  lv3P3Goto(0);

  const resizer = document.getElementById('lv3-p3-resizer');
  const sidebar = resizer && resizer.previousElementSibling;
  if (resizer && sidebar) {
    let startX, startW;
    resizer.addEventListener('mousedown', e => {
      startX = e.clientX; startW = sidebar.getBoundingClientRect().width;
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

function lv3P3UpdateNav(step) {
  const labels = ['Read', 'Quiz 1', 'Quiz 2', 'Quiz 3', 'Fill in', 'Write!'];
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
  else if (step >= 1 && step <= 3) lv3P3Quiz(main, step - 1);
  else if (step === 4) lv3P3FillIn(main);
  else if (step === 5) lv3P3WriteOwn(main);
}

function lv3P3Read(main) {
  lv3ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">From Blocks to Python</div>
        <p>The repeat block and Python's <code>for</code> loop express the same idea. Click each line to understand it.</p>
      </div>
      ${LV3_CODE_LINES.map((cl, i) => `
        <div class="lv1-read-block" id="lv3-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv3ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon('play', 10)}</span>
            <span class="lv1-read-code">${cl.code}</span>
          </button>
          <div class="lv1-read-explanation" id="lv3-re-${i}">${cl.explain}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv3-read-next" onclick="lv3P3Goto(1)" style="display:none">Next: Quiz →</button>
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

function lv3P3Quiz(main, qIdx) {
  const q = LV3_QUIZZES[qIdx];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <p class="lv1-activity-sub" style="font-size:13px;color:var(--text)">Question ${qIdx + 1} of 3</p>
      <div class="lv1-activity-heading" style="font-size:14px">${q.q}</div>
      <div class="lv1-quiz-options" id="lv3-qz-opts">
        ${q.opts.map(o =>
          `<button class="lv1-quiz-opt" onclick="lv3P3Answer(this,${o.ok},${qIdx})">${o.t}</button>`
        ).join('')}
      </div>
      <div id="lv3-qz-fb" class="lv1-feedback" style="display:none"></div>
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv3-qz-next" onclick="lv3P3Goto(${lv3P3Step + 1})" style="display:none">
          ${qIdx < 2 ? 'Next question →' : 'Next: Fill in the blanks →'}
        </button>
      </div>
    </div>
  `;
}

function lv3P3Answer(btn, correct, qIdx) {
  document.querySelectorAll('#lv3-qz-opts .lv1-quiz-opt').forEach(b => {
    b.disabled = true; b.style.opacity = '0.55';
  });
  btn.style.opacity = '1';
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    const correctText = LV3_QUIZZES[qIdx].opts.find(o => o.ok).t;
    document.querySelectorAll('#lv3-qz-opts .lv1-quiz-opt').forEach(b => {
      if (b.textContent.trim() === correctText) { b.classList.add('correct'); b.style.opacity = '1'; }
    });
  }
  const fb = document.getElementById('lv3-qz-fb');
  if (fb) {
    fb.style.display = 'block';
    fb.className = 'lv1-feedback ' + (correct ? 'success' : 'error');
    fb.innerHTML = correct ? LV3_QUIZZES[qIdx].exp : 'Not quite! ' + LV3_QUIZZES[qIdx].exp;
  }
  const nb = document.getElementById('lv3-qz-next');
  if (nb) nb.style.display = 'inline-flex';
}

function lv3P3FillIn(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Fill in the Blanks</div>
      <p class="lv1-activity-sub">
        Look at the Python code in the left panel. Fill in the two missing words.
      </p>
      <div class="lv1-code-panel" style="line-height:2">
        <span class="lv1-code-line">
          <span class="py-var">phrase</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span>]
        </span>
        <span class="lv1-code-line">&nbsp;</span>
        <span class="lv1-code-line">
          <span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span>
          <input class="lv1-code-blank" id="lv3-blank1" placeholder="____"
            autocomplete="off" spellcheck="false" style="width:62px">(<span class="py-num">3</span>)<span class="py-op">:</span>
        </span>
        <span class="lv1-code-line">
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><input
            class="lv1-code-blank" id="lv3-blank2" placeholder="____"
            autocomplete="off" spellcheck="false" style="width:70px"><span class="py-op">)</span>
        </span>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv3P3CheckFill()">Check</button>
        <button class="lv1-btn primary" id="lv3-fill-next" onclick="lv3P3Goto(5)" style="display:none">Next: Write your own →</button>
      </div>
      <div id="lv3-fill-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv3P3CheckFill() {
  const b1 = document.getElementById('lv3-blank1').value.trim();
  const b2 = document.getElementById('lv3-blank2').value.trim();
  const el1 = document.getElementById('lv3-blank1');
  const el2 = document.getElementById('lv3-blank2');
  const fb = document.getElementById('lv3-fill-fb');
  const ok1 = b1 === 'range';
  const ok2 = b2 === 'phrase';
  el1.className = 'lv1-code-blank ' + (ok1 ? 'ok' : 'bad');
  el2.className = 'lv1-code-blank ' + (ok2 ? 'ok' : 'bad');
  fb.style.display = 'block';
  if (ok1 && ok2) {
    fb.className = 'lv1-feedback success';
    fb.innerHTML = 'Correct! <code>range</code> generates the repeat count, and <code>phrase</code> is the variable holding your notes.';
    document.getElementById('lv3-fill-next').style.display = 'inline-flex';
  } else {
    fb.className = 'lv1-feedback error';
    const hints = [];
    if (!ok1) hints.push('Blank 1: what Python function generates a sequence of numbers? (check the left panel)');
    if (!ok2) hints.push('Blank 2: what is the list variable called?');
    fb.textContent = hints.join(' ');
  }
}

function lv3P3WriteOwn(main) {
  lv3OwnCount = 3;
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Write Your Own</div>
      <p class="lv1-activity-sub">
        Change the repeat count (2–8) and hit <strong>Play</strong> to hear the difference!
      </p>
      <div class="lv1-code-panel" style="line-height:2">
        <span class="lv1-code-line">
          <span class="py-var">phrase</span><span class="py-op"> = </span>[<span class="py-str">"C4"</span><span class="py-op">, </span><span class="py-str">"E4"</span><span class="py-op">, </span><span class="py-str">"G4"</span>]
        </span>
        <span class="lv1-code-line">&nbsp;</span>
        <span class="lv1-code-line">
          <span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span>
          <span class="py-fn">range</span><span class="py-op">(</span><input
            class="lv1-note-input" id="lv3-own-count" type="number"
            min="1" max="8" value="3" style="width:36px" oninput="lv3OwnPreview()"><span class="py-op">):</span>
        </span>
        <span class="lv1-code-line">
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">phrase</span><span class="py-op">)</span>
        </span>
      </div>
      <div id="lv3-own-preview" style="font-size:12px;color:var(--text-muted);font-weight:600">
        That's 3 × 3 = <strong>9 notes</strong>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv3OwnPlay()">Play my loop</button>
        <button class="lv1-btn success" onclick="lv3Complete()">Complete Level 3!</button>
      </div>
    </div>
  `;
}

function lv3OwnPreview() {
  const inp = document.getElementById('lv3-own-count');
  const preview = document.getElementById('lv3-own-preview');
  if (!inp || !preview) return;
  const n = Math.max(1, Math.min(8, +inp.value || 1));
  inp.value = n;
  lv3OwnCount = n;
  preview.innerHTML = `That's ${n} × ${LV3_PHRASE.length} = <strong>${n * LV3_PHRASE.length} notes</strong>`;
}

async function lv3OwnPlay() {
  const inp = document.getElementById('lv3-own-count');
  const count = inp ? Math.max(1, Math.min(8, +inp.value || 3)) : 3;
  await initTone();
  for (let i = 0; i < count; i++) {
    for (const n of LV3_PHRASE) await playNote(n, 1);
  }
}

function lv3Complete() {
  completeLevel(3);
  backToLevels();
}
