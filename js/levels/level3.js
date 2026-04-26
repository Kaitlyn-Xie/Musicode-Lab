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

// Song Workshop state
const LV3_JINGLE = ['E4','E4','E4','G4','E4','D4','C4'];
const LV3_JINGLE_PALETTE = ['C4','D4','E4','G4'];
let lv3JingleSeq = [];
const LV3_OWN_NOTE_OPTIONS = ['C4','D4','E4','F4','G4','A4','B4'];
const LV3_OWN_PITCH_PCT = { 'C4':12,'D4':25,'E4':38,'F4':50,'G4':63,'A4':75,'B4':88 };
let lv3OwnPickedNotes = ['C4','E4','G4'];

const LV3_CT_CONCEPTS = [
  {
    title: 'Loop',
    icon: 'repeat',
    body: 'A <strong>loop</strong> runs the same code multiple times. Instead of writing <code>play(E4)</code> three separate times, a loop handles it automatically — saving effort and avoiding mistakes.'
  },
  {
    title: 'Pattern',
    icon: 'algorithm',
    body: 'Music is built on <strong>patterns</strong> — a short motif that repeats, varies, and combines. Computers recognize patterns too: your loop IS the pattern, encoded once and repeated.'
  },
  {
    title: 'DRY Principle',
    icon: 'blocks',
    body: '<strong>DRY</strong> stands for "Don\'t Repeat Yourself." Writing the same thing twice is a bug waiting to happen. Define it once, loop it. Change one place — everything updates.'
  }
];

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
          <div class="lv1-phase" id="lv3-ph-2">3 — How Computers Think</div>
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
            <button class="lv1-btn primary" id="lv3-p2-next" onclick="lv3ShowPhase(3)" style="display:none">Next: How Computers Think →</button>
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
// PHASE 3 — How Computers Think (Song Workshop)
// ══════════════════════════════════════════════════════

function lv3RenderPhase3(body) {
  lv3P3Step = 0;
  body.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:0 4px">
      <div class="lv1-p3-nav-bar">
        <div class="lv1-p3-nav" id="lv3-p3-nav"></div>
      </div>
      <div style="padding:16px 0 24px">
        <div id="lv3-p3-main"></div>
      </div>
    </div>
  `;
  lv3P3Goto(0);
}

function lv3P3UpdateNav(step) {
  const labels = ['Concepts','Listen','Build','Discover','Create!'];
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
  else if (step === 1) lv3JingleListen(main);
  else if (step === 2) lv3JingleBuild(main);
  else if (step === 3) lv3JingleDiscover(main);
  else if (step === 4) lv3P3WriteOwn(main);
}

/* Step 0 — CT Concept Cards */
function lv3P3Read(main) {
  lv3ReadOpened = [false, false, false];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Three Big Ideas</div>
        <p>You just used loops to build repetition. Click each card to explore what that means in Computational Thinking.</p>
      </div>
      ${LV3_CT_CONCEPTS.map((c, i) => `
        <div class="lv1-read-block" id="lv3-read-${i}">
          <button class="lv1-read-line-btn" onclick="lv3ReadToggle(${i})">
            <span class="lv1-read-expand-icon">${icon(c.icon, 14)}</span>
            <span class="lv1-read-code" style="font-family:inherit;font-size:13px;font-weight:700;color:var(--text)">${c.title}</span>
            <span class="ct-concept-tag">CT Concept</span>
          </button>
          <div class="lv1-read-explanation" id="lv3-re-${i}">${c.body}</div>
        </div>
      `).join('')}
      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv3-read-next" onclick="lv3P3Goto(1)" style="display:none">Next: Build the Song →</button>
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

/* Step 1 — Listen */
function lv3JingleListen(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">新年好 — Happy New Year</div>
        <p>听这首家喻户晓的新年歌！注意前三个E4音符的重复——这就是循环在音乐里的样子。</p>
      </div>

      <div class="lv1-song-card">
        <div class="lv1-song-card-title">♪ 新年好 (Happy New Year)</div>
        <div class="lv1-song-card-lyrics">"新年好呀，新年好呀，祝贺大家新年好..."</div>
        <div class="lv1-song-card-notes">
          ${LV3_JINGLE.map(n => `<span class="lv1-song-note-pill">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:14px;gap:8px" onclick="lv3JinglePlayTarget()">
          ${icon('play',13)} Listen to the phrase
        </button>
        <div id="lv3-jingle-playing" style="display:none;font-size:12px;color:var(--text-muted);margin-top:8px;text-align:center">♩ playing...</div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv3P3Goto(2)">Next: Build it →</button>
      </div>
    </div>
  `;
}

async function lv3JinglePlayTarget() {
  const ind = document.getElementById('lv3-jingle-playing');
  if (ind) ind.style.display = 'block';
  await initTone();
  for (const n of LV3_JINGLE) { await playNote(n, 0.75); }
  if (ind) ind.style.display = 'none';
}

/* Step 2 — Build */
function lv3JingleBuild(main) {
  lv3JingleSeq = [];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Build the Sequence</div>
      <p class="lv1-activity-sub">
        Tap the note tiles below to place them in order. The song needs <strong>7 notes</strong>.
        Use the hint if you get stuck!
      </p>

      <div class="lv1-tw-slots" id="lv3-jingle-slots"></div>

      <div class="lv1-tw-palette">
        ${LV3_JINGLE_PALETTE.map(n => `
          <div class="lv1-tw-tile" onclick="lv3JingleTap('${n}')">
            <div class="lv1-tw-tile-name">${n}</div>
            <button class="lv1-play-btn" style="margin-top:4px" onclick="event.stopPropagation();lv1PlaySingleNote('${n}')">${icon('volume',11)}</button>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv3JingleClear()">Clear</button>
        <button class="lv1-btn secondary" onclick="lv3JinglePlaySeq()">Play</button>
        <button class="lv1-btn secondary" onclick="lv3JingleHint()">Hint</button>
        <button class="lv1-btn secondary" onclick="lv3JingleCheck()">Check</button>
      </div>
      <div id="lv3-jingle-fb" class="lv1-feedback" style="display:none"></div>
      <div id="lv3-jingle-hint" class="lv1-hint-box" style="display:none">
        <strong>Hint:</strong> 新年好 starts E E E, then goes up to G, then comes back down E D C.<br>
        <span style="font-family:monospace;font-size:12px;color:var(--text)">E4 E4 E4 D4 C4 D4 E4</span>
      </div>
    </div>
  `;
  lv3JingleRenderSlots();
}

function lv3JingleRenderSlots() {
  const container = document.getElementById('lv3-jingle-slots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const slot = document.createElement('div');
    slot.className = 'lv1-tw-slot' + (i < lv3JingleSeq.length ? ' filled' : '');
    if (i < lv3JingleSeq.length) {
      slot.textContent = lv3JingleSeq[i];
      slot.onclick = () => { lv3JingleSeq.splice(i, 1); lv3JingleRenderSlots(); };
      slot.title = 'Click to remove';
    } else {
      slot.textContent = (i + 1);
      slot.style.opacity = '0.35';
    }
    container.appendChild(slot);
  }
}

function lv3JingleTap(note) {
  if (lv3JingleSeq.length >= 7) return;
  lv3JingleSeq.push(note);
  lv3JingleRenderSlots();
}

function lv3JingleClear() {
  lv3JingleSeq = [];
  lv3JingleRenderSlots();
  const fb = document.getElementById('lv3-jingle-fb');
  if (fb) fb.style.display = 'none';
}

async function lv3JinglePlaySeq() {
  if (!lv3JingleSeq.length) return;
  await initTone();
  for (const n of lv3JingleSeq) { await playNote(n, 0.75); }
}

function lv3JingleHint() {
  const h = document.getElementById('lv3-jingle-hint');
  if (h) h.classList.toggle('visible');
}

async function lv3JingleCheck() {
  const fb = document.getElementById('lv3-jingle-fb');
  if (!fb) return;
  fb.style.display = 'block';
  if (lv3JingleSeq.length < 7) {
    fb.className = 'lv1-feedback error';
    fb.textContent = `You need 7 notes — you have ${lv3JingleSeq.length} so far. Keep going!`;
    return;
  }
  const correct = lv3JingleSeq.every((n, i) => n === LV3_JINGLE[i]);
  if (correct) {
    fb.className = 'lv1-feedback success';
    fb.textContent = 'Perfect! Listen to your sequence...';
    await initTone();
    for (const n of LV3_JINGLE) { await playNote(n, 0.75); }
    fb.textContent = '🎵 That\'s Jingle Bells! Now let\'s see what you discovered...';
    setTimeout(() => lv3P3Goto(3), 1400);
  } else {
    fb.className = 'lv1-feedback error';
    fb.textContent = 'Not quite — the order isn\'t right yet. Try playing your sequence and compare it to the Listen step!';
  }
}

/* Step 3 — Discover */
async function lv3JingleDiscover(main) {
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
      <div class="lv1-concept">
        <div class="lv1-concept-label">You spotted the Loop!</div>
        <p>E4 appears <strong>three times in a row</strong> — that's a loop pattern. Instead of writing it three times, a loop handles it automatically.</p>
      </div>

      <div class="lv1-song-card" style="background:linear-gradient(135deg,rgba(112,80,208,0.08),rgba(46,128,208,0.08))">
        <div class="lv1-song-card-title">Your sequence = loop + pattern</div>
        <div class="lv1-song-card-notes" id="lv3-disc-notes">
          ${LV3_JINGLE.map((n,i) => `<span class="lv1-song-note-pill" id="lv3-disc-${i}">${n}</span>`).join('')}
        </div>
        <button class="lv1-btn primary" style="margin-top:12px" onclick="lv3JinglePlayAndHighlight()">
          ${icon('play',13)} Play & highlight
        </button>
      </div>

      <div class="lv1-song-card" style="padding:14px 16px;align-items:flex-start;text-align:left;background:linear-gradient(135deg,rgba(112,80,208,0.07),rgba(46,128,208,0.05))">
        <div class="lv1-song-card-title" style="margin-bottom:10px">Computational Thinking in Action</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">
          <div style="background:rgba(112,80,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#7050D0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Loop</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Same code runs multiple times automatically</div>
          </div>
          <div style="background:rgba(46,128,208,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1860A0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Pattern</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">A short motif encoded once, repeated</div>
          </div>
          <div style="background:rgba(24,160,80,0.12);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:11px;font-weight:800;color:#1A7040;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">DRY Principle</div>
            <div style="font-size:11.5px;color:var(--text);line-height:1.5">Define once, change one place</div>
          </div>
        </div>
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" onclick="lv3P3Goto(4)">Next: Make it your own →</button>
      </div>
    </div>
  `;
  await initTone();
  for (const n of LV3_JINGLE) { await playNote(n, 0.75); }
}

async function lv3JinglePlayAndHighlight() {
  await initTone();
  for (let i = 0; i < LV3_JINGLE.length; i++) {
    document.querySelectorAll('#lv3-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
    const pill = document.getElementById('lv3-disc-' + i);
    if (pill) pill.classList.add('playing');
    await playNote(LV3_JINGLE[i], 0.75);
  }
  document.querySelectorAll('#lv3-disc-notes .lv1-song-note-pill').forEach(p => p.classList.remove('playing'));
}

/* Step 4 — Create! */
function lv3P3WriteOwn(main) {
  lv3OwnPickedNotes = ['C4','E4','G4'];
  main.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;padding-top:4px">
      <div class="lv1-activity-heading">Make It Your Own</div>
      <p class="lv1-activity-sub">Pick up to 7 notes to create your own melody, then play it!</p>

      <div class="lv2-note-picker" id="lv3-own-picker">
        ${LV3_OWN_NOTE_OPTIONS.map(note => `
          <div class="lv2-note-tile" id="lv3-own-tile-${note}" onclick="lv3OwnToggleNote('${note}')">
            <div class="lv1-note-name" style="font-size:13px;font-weight:900;font-family:'JetBrains Mono',monospace">${note}</div>
            <div class="lv1-pitch-track" style="margin:5px 0 2px">
              <div class="lv1-pitch-fill" style="width:${LV3_OWN_PITCH_PCT[note]}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="lv3OwnPlay()">${icon('play',12)} Play my melody</button>
        <button class="lv1-btn success" onclick="lv3Complete()">Complete Level 3!</button>
      </div>
    </div>
  `;
  lv3UpdateOwnPicker();
}

function lv3OwnToggleNote(note) {
  const idx = lv3OwnPickedNotes.indexOf(note);
  if (idx >= 0) lv3OwnPickedNotes.splice(idx, 1);
  else { if (lv3OwnPickedNotes.length >= 7) return; lv3OwnPickedNotes.push(note); }
  lv3UpdateOwnPicker();
}

function lv3UpdateOwnPicker() {
  LV3_OWN_NOTE_OPTIONS.forEach(note => {
    const tile = document.getElementById('lv3-own-tile-' + note);
    if (tile) tile.classList.toggle('selected', lv3OwnPickedNotes.includes(note));
  });
}

async function lv3OwnPlay() {
  if (!lv3OwnPickedNotes.length) return;
  await initTone();
  for (const n of lv3OwnPickedNotes) { await playNote(n, 1); }
}

function lv3Complete() {
  completeLevel(3);
  backToLevels();
}
