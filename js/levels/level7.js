// ════════════════════════════════════════════════════════════
// LEVEL 7 — CREATE YOUR SONG (Capstone)
// ════════════════════════════════════════════════════════════

let lv7Phase = 1;

// ── Phase 1: Plan ──────────────────────────────────────
let lv7PlanTitle = '';
let lv7PlanMood = '';
let lv7PlanVarCount = 2;
let lv7PlanLoops = false;
let lv7PlanComplete = false;

// ── Phase 2: Build ─────────────────────────────────────
const LV7_ALL_NOTES = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','G3','A3','B3'];
const LV7_MAX_VARS = 4;

let lv7Vars = [
  { name: 'intro',  notes: ['C4','E4','G4'] },
  { name: 'chorus', notes: ['G4','A4','C5'] },
];
let lv7Program = []; // array of { type:'play'|'repeat', varIdx, count, body:[{varIdx}] }
let lv7DragType = null;
let lv7DragVarIdx = null;
let lv7BuildPlaying = false;

// ── Phase 3: Share ─────────────────────────────────────
let lv7SharedTitle = '';

// ─── Entry point ─────────────────────────────────────────────
function renderLevel7() {
  const inner = document.getElementById('challenge-inner');
  inner.innerHTML = `
    <div class="lv1-wrap">
      <div class="lv1-topbar">
        <button class="lv1-back" onclick="backToLevels()">← Levels</button>
        <div class="lv1-breadcrumb">
          <div class="lv1-lvbadge" style="background:#F5E8FF;color:#681888">Level 7</div>
          <div class="lv1-title-text">Create Your Song</div>
        </div>
        <div class="lv1-phases">
          <div class="lv1-phase active" id="lv7-ph-0">1 — Plan</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv7-ph-1">2 — Build</div>
          <div class="lv1-phase-sep">›</div>
          <div class="lv1-phase" id="lv7-ph-2">3 — Share</div>
        </div>
      </div>
      <div class="lv1-body" id="lv7-body"></div>
    </div>
  `;
  lv7Phase = 1;
  lv7PlanTitle = ''; lv7PlanMood = ''; lv7PlanVarCount = 2;
  lv7PlanLoops = false; lv7PlanComplete = false;
  lv7Vars = [
    { name: 'intro',  notes: ['C4','E4','G4'] },
    { name: 'chorus', notes: ['G4','A4','C5'] },
  ];
  lv7Program = [];
  lv7DragType = null; lv7DragVarIdx = null; lv7BuildPlaying = false;
  lv7ShowPhase(1);
}

function lv7ShowPhase(p) {
  lv7Phase = p;
  [0,1,2].forEach(i => {
    const el = document.getElementById('lv7-ph-' + i);
    if (el) el.className = 'lv1-phase' + (i===p-1?' active':(i<p-1?' done':''));
  });
  const body = document.getElementById('lv7-body');
  if (!body) return;
  if (p===1) lv7RenderPhase1(body);
  else if (p===2) lv7RenderPhase2(body);
  else if (p===3) lv7RenderPhase3(body);
}

// ══════════════════════════════════════════════════════
// PHASE 1 — Plan Your Song
// ══════════════════════════════════════════════════════
function lv7RenderPhase1(body) {
  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-activity-heading">Plan Your Song</div>
      <p class="lv1-activity-sub">
        Every great song starts with a plan. Fill in the details below — this will set up your
        variables and structure in the next phase.
      </p>

      <div class="lv7-plan-form">

        <div class="lv7-plan-field">
          <label class="lv7-plan-label">Song title</label>
          <input class="lv7-plan-input" id="lv7-title-inp" maxlength="40"
            placeholder="e.g. My First Song" oninput="lv7PlanUpdate()">
        </div>

        <div class="lv7-plan-field">
          <label class="lv7-plan-label">Mood / vibe</label>
          <div class="lv7-mood-grid" id="lv7-mood-grid">
            ${['Happy','Mysterious','Calm','Epic','Funky','Sad'].map(m =>
              `<button class="lv7-mood-btn" onclick="lv7SetMood('${m}')">${m}</button>`
            ).join('')}
          </div>
        </div>

        <div class="lv7-plan-field">
          <label class="lv7-plan-label">How many musical phrases (variables)?</label>
          <div style="display:flex;align-items:center;gap:10px">
            <button class="lv2-max-btn" onclick="lv7PlanVarDelta(-1)">−</button>
            <span class="lv2-max-val" id="lv7-plan-var-val">${lv7PlanVarCount}</span>
            <button class="lv2-max-btn" onclick="lv7PlanVarDelta(1)">+</button>
            <span class="lv2-max-hint">phrases (2–4)</span>
          </div>
        </div>

        <div class="lv7-plan-field">
          <label class="lv7-plan-label">Will your song use any loops?</label>
          <div class="lv7-toggle-row">
            <button class="lv7-toggle-btn" id="lv7-loop-yes" onclick="lv7SetLoops(true)">Yes — repeat phrases</button>
            <button class="lv7-toggle-btn" id="lv7-loop-no"  onclick="lv7SetLoops(false)">No — play once through</button>
          </div>
        </div>

        <div class="lv7-plan-preview" id="lv7-plan-preview" style="display:none">
          <div class="lv7-pp-label">Your song blueprint:</div>
          <div id="lv7-pp-content"></div>
        </div>

      </div>

      <div class="lv1-actions">
        <button class="lv1-btn primary" id="lv7-p1-next" onclick="lv7P1Confirm()" style="display:none">
          Let's Build It →
        </button>
      </div>
      <div id="lv7-p1-fb" class="lv1-feedback" style="display:none"></div>
    </div>
  `;
}

function lv7PlanUpdate() {
  lv7PlanTitle = (document.getElementById('lv7-title-inp') || {}).value || '';
  lv7CheckPlanReady();
}

function lv7SetMood(mood) {
  lv7PlanMood = mood;
  document.querySelectorAll('.lv7-mood-btn').forEach(b =>
    b.classList.toggle('active', b.textContent === mood)
  );
  lv7CheckPlanReady();
}

function lv7PlanVarDelta(d) {
  lv7PlanVarCount = Math.max(2, Math.min(LV7_MAX_VARS, lv7PlanVarCount + d));
  const el = document.getElementById('lv7-plan-var-val');
  if (el) el.textContent = lv7PlanVarCount;
  lv7CheckPlanReady();
}

function lv7SetLoops(val) {
  lv7PlanLoops = val;
  document.getElementById('lv7-loop-yes').classList.toggle('active', val);
  document.getElementById('lv7-loop-no').classList.toggle('active', !val);
  lv7CheckPlanReady();
}

function lv7CheckPlanReady() {
  const ready = lv7PlanTitle.trim() && lv7PlanMood && lv7PlanLoops !== '';
  const btn = document.getElementById('lv7-p1-next');
  if (btn) btn.style.display = ready ? 'inline-flex' : 'none';

  // Show live preview
  const prev = document.getElementById('lv7-plan-preview');
  const content = document.getElementById('lv7-pp-content');
  if (!prev || !content) return;
  if (lv7PlanTitle.trim() || lv7PlanMood) {
    prev.style.display = 'block';
    const phrases = Array.from({length: lv7PlanVarCount}, (_, i) =>
      `<span class="lv7-pp-chip">phrase ${i+1}</span>`
    ).join('');
    content.innerHTML = `
      <div class="lv7-pp-row">${icon('music',12)} <strong>${lv7PlanTitle.trim() || '(no title yet)'}</strong></div>
      <div class="lv7-pp-row">${icon('note',12)} Mood: <strong>${lv7PlanMood || '—'}</strong></div>
      <div class="lv7-pp-row">${icon('variable',12)} ${lv7PlanVarCount} phrases: ${phrases}</div>
      <div class="lv7-pp-row">${icon('repeat',12)} Loops: <strong>${lv7PlanLoops===true?'Yes':lv7PlanLoops===false?'No':'—'}</strong></div>
    `;
  } else {
    prev.style.display = 'none';
  }
}

function lv7P1Confirm() {
  const title = (document.getElementById('lv7-title-inp')||{}).value||'';
  const fb = document.getElementById('lv7-p1-fb');
  if (!title.trim()) {
    fb.style.display='block'; fb.className='lv1-feedback error';
    fb.textContent='Add a title for your song!'; return;
  }
  if (!lv7PlanMood) {
    fb.style.display='block'; fb.className='lv1-feedback error';
    fb.textContent='Pick a mood for your song!'; return;
  }
  lv7PlanTitle = title.trim();
  // Set up vars based on plan
  const defaultNames = ['intro','verse','chorus','bridge','outro'];
  lv7Vars = Array.from({length: lv7PlanVarCount}, (_, i) => ({
    name: defaultNames[i] || ('phrase'+(i+1)),
    notes: [['C4','E4','G4'],['G4','A4','C5'],['E4','G4','A4'],['D4','F4','A4']][i] || ['C4','E4','G4']
  }));
  lv7Program = [];
  lv7ShowPhase(2);
}

// ══════════════════════════════════════════════════════
// PHASE 2 — Build & Refine
// ══════════════════════════════════════════════════════
function lv7RenderPhase2(body) {
  lv7DragType = null; lv7DragVarIdx = null; lv7BuildPlaying = false;

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Build: "${lv7PlanTitle}"</div>
        <p>
          Edit your phrase variables below, then drag blocks onto the canvas to arrange your song.
          Mix play blocks and repeat blocks — use everything you've learned!
        </p>
      </div>

      <!-- Variable editors -->
      <div class="lv7-vars-section">
        <div class="lv7-section-label">Your Variables</div>
        <div class="lv7-vars-list" id="lv7-vars-list"></div>
      </div>

      <!-- Block builder: palette | canvas -->
      <div class="lv7-section-label" style="margin-top:12px">Program Canvas</div>
      <div class="lv1-blocks-area">
        <div class="lv1-mini-palette" id="lv7-palette"></div>

        <div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0">
          <div class="lv1-dropzone" id="lv7-canvas"
            ondragover="event.preventDefault();this.classList.add('drag-over')"
            ondragleave="this.classList.remove('drag-over')"
            ondrop="lv7CanvasDrop(event)">
            <div class="lv1-dz-placeholder" id="lv7-dz-ph">Drop blocks here to arrange your song…</div>
          </div>
          <div class="lv1-actions" style="padding:0">
            <button class="lv1-btn secondary" onclick="lv7ClearCanvas()">Clear</button>
            <button class="lv1-btn secondary" onclick="lv7BuildPlay()">
              ${icon('play',12)} Play song
            </button>
            <button class="lv1-btn primary" id="lv7-p2-next" onclick="lv7P2Confirm()" style="display:none">
              Looks good! Share it →
            </button>
          </div>
          <div id="lv7-p2-fb" class="lv1-feedback" style="display:none"></div>
        </div>
      </div>

      <!-- Live Python preview -->
      <div class="lv7-section-label" style="margin-top:12px">Live Code Preview</div>
      <div class="lv1-code-panel" id="lv7-code-preview" style="font-size:12px;line-height:1.9;min-height:60px"></div>
    </div>
  `;

  lv7RenderVarList();
  lv7RenderPalette();
  lv7RenderCanvas();
  lv7RenderCodePreview();
}

function lv7RenderVarList() {
  const el = document.getElementById('lv7-vars-list');
  if (!el) return;
  el.innerHTML = '';
  lv7Vars.forEach((v, vi) => {
    const card = document.createElement('div');
    card.className = 'lv7-var-card';

    const header = document.createElement('div');
    header.className = 'lv7-vc-header';

    const nameInp = document.createElement('input');
    nameInp.className = 'lv7-vc-name';
    nameInp.value = v.name;
    nameInp.maxLength = 16;
    nameInp.oninput = () => {
      const val = nameInp.value.replace(/[^a-zA-Z0-9_]/g,'').slice(0,16);
      nameInp.value = val;
      v.name = val || ('phrase'+(vi+1));
      lv7RenderPalette();
      lv7RenderCanvas();
      lv7RenderCodePreview();
    };

    const previewBtn = document.createElement('button');
    previewBtn.className = 'lv7-vc-play';
    previewBtn.innerHTML = icon('play',11);
    previewBtn.title = 'Preview';
    previewBtn.onclick = async () => {
      await initTone();
      for (const n of v.notes) await playNote(n, 1);
    };

    header.appendChild(nameInp);
    header.appendChild(previewBtn);
    card.appendChild(header);

    // Note grid
    const noteGrid = document.createElement('div');
    noteGrid.className = 'lv7-note-grid';
    v.notes.forEach((note, ni) => {
      const pill = document.createElement('div');
      pill.className = 'lv7-note-pill-edit';

      const sel = document.createElement('select');
      sel.className = 'lv7-note-sel';
      LV7_ALL_NOTES.forEach(n => {
        const o = document.createElement('option');
        o.value = n; o.textContent = n;
        if (n === note) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        v.notes[ni] = sel.value;
        lv7RenderCodePreview();
      };

      const del = document.createElement('button');
      del.className = 'lv7-note-del';
      del.innerHTML = icon('close',9);
      del.onclick = () => {
        if (v.notes.length > 1) {
          v.notes.splice(ni, 1);
          lv7RenderVarList();
          lv7RenderCodePreview();
        }
      };
      pill.appendChild(sel);
      pill.appendChild(del);
      noteGrid.appendChild(pill);
    });

    // Add note button
    const addBtn = document.createElement('button');
    addBtn.className = 'lv7-add-note-btn';
    addBtn.innerHTML = '+ note';
    addBtn.onclick = () => {
      if (v.notes.length < 8) {
        v.notes.push('C4');
        lv7RenderVarList();
        lv7RenderCodePreview();
      }
    };
    noteGrid.appendChild(addBtn);
    card.appendChild(noteGrid);
    el.appendChild(card);
  });
}

function lv7RenderPalette() {
  const pal = document.getElementById('lv7-palette');
  if (!pal) return;
  pal.innerHTML = '';

  const lbl = document.createElement('div');
  lbl.className = 'lv1-palette-label';
  lbl.textContent = 'Play Blocks';
  pal.appendChild(lbl);

  lv7Vars.forEach((v, vi) => {
    const chip = document.createElement('div');
    chip.className = 'lv2-pal-block';
    chip.style.background = ['#2E80D0','#2EA870','#D4A020','#9030D0'][vi % 4];
    chip.draggable = true;
    chip.innerHTML = icon('music',12) + ' play( <span class="lv2-pal-badge">' + v.name + '</span> )';
    chip.ondragstart = e => { lv7DragType='play'; lv7DragVarIdx=vi; e.dataTransfer.effectAllowed='copy'; };
    chip.onclick = () => lv7TapAdd('play', vi);
    pal.appendChild(chip);
  });

  const loopLbl = document.createElement('div');
  loopLbl.className = 'lv1-palette-label';
  loopLbl.style.marginTop = '10px';
  loopLbl.textContent = 'Loop';
  pal.appendChild(loopLbl);

  const repWrap = document.createElement('div');
  repWrap.className = 'lv2-pal-repeat-wrap';
  repWrap.innerHTML = `
    <div class="lv2-pal-repeat-header">
      ${icon('repeat',12)} repeat
      <button class="lv2-rep-btn" onclick="event.stopPropagation();lv7RepDelta(-1)">−</button>
      <span class="lv2-rep-val" id="lv7-rep-val">2</span>
      <button class="lv2-rep-btn" onclick="event.stopPropagation();lv7RepDelta(1)">+</button>
      times:
    </div>
    <div class="lv2-pal-repeat-inner">← drop play block</div>
    <div class="lv2-pal-repeat-end">end</div>
  `;
  repWrap.draggable = true;
  repWrap.ondragstart = e => { lv7DragType='repeat'; lv7DragVarIdx=null; e.dataTransfer.effectAllowed='copy'; };
  repWrap.onclick = () => lv7TapAdd('repeat', null);
  pal.appendChild(repWrap);

  const hint = document.createElement('div');
  hint.className = 'lv1-palette-hint';
  hint.textContent = 'drag or tap to add';
  pal.appendChild(hint);
}

let lv7RepCount = 2;
function lv7RepDelta(d) {
  lv7RepCount = Math.max(2, Math.min(8, lv7RepCount + d));
  const el = document.getElementById('lv7-rep-val');
  if (el) el.textContent = lv7RepCount;
  lv7Program.forEach(b => { if (b.type==='repeat') b.count = lv7RepCount; });
  lv7RenderCanvas();
  lv7RenderCodePreview();
}

function lv7TapAdd(type, varIdx) {
  if (type === 'play') {
    // If there's a repeat block on canvas (last one), add inside it
    const lastRepeat = [...lv7Program].reverse().find(b => b.type==='repeat');
    if (lastRepeat && lastRepeat.body.length === 0) {
      lastRepeat.body.push({ type:'play', varIdx });
    } else {
      lv7Program.push({ type:'play', varIdx });
    }
  } else if (type === 'repeat') {
    if (!lv7Program.find(b => b.type==='repeat' && b.body.length===0)) {
      lv7Program.push({ type:'repeat', count: lv7RepCount, body:[] });
    }
  }
  lv7RenderCanvas();
  lv7RenderCodePreview();
  lv7P2CheckReady();
}

function lv7CanvasDrop(event) {
  event.preventDefault();
  document.getElementById('lv7-canvas').classList.remove('drag-over');
  if (lv7DragType) lv7TapAdd(lv7DragType, lv7DragVarIdx);
  lv7DragType = null; lv7DragVarIdx = null;
}

function lv7ClearCanvas() {
  lv7Program = [];
  lv7RenderCanvas();
  lv7RenderCodePreview();
  const fb = document.getElementById('lv7-p2-fb');
  if (fb) fb.style.display = 'none';
  document.getElementById('lv7-p2-next').style.display = 'none';
}

function lv7RenderCanvas() {
  const canvas = document.getElementById('lv7-canvas');
  if (!canvas) return;
  canvas.querySelectorAll('.lv1-seq-block,.lv2-seq-repeat').forEach(e => e.remove());
  const ph = document.getElementById('lv7-dz-ph');
  if (ph) ph.style.display = lv7Program.length ? 'none' : 'block';

  const colors = ['#2E80D0','#2EA870','#D4A020','#9030D0'];

  lv7Program.forEach((block, idx) => {
    if (block.type === 'play') {
      const v = lv7Vars[block.varIdx] || { name:'?' };
      const el = document.createElement('div');
      el.className = 'lv1-seq-block';
      el.style.background = colors[block.varIdx % 4];
      el.innerHTML = icon('music',12) + ' play( <strong>' + v.name + '</strong> )' +
        '<button class="lv1-rm-btn" onclick="lv7RemoveBlock('+idx+')">' + icon('close',11) + '</button>';
      canvas.appendChild(el);
    } else if (block.type === 'repeat') {
      const wrap = document.createElement('div');
      wrap.className = 'lv2-seq-repeat';

      const header = document.createElement('div');
      header.className = 'lv2-seq-repeat-header';
      header.innerHTML = icon('repeat',12) + ' repeat <strong>' + block.count + '</strong> times:' +
        '<button class="lv1-rm-btn" style="margin-left:auto" onclick="lv7RemoveBlock('+idx+')">' + icon('close',11) + '</button>';
      wrap.appendChild(header);

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'lv2-seq-repeat-body';
      bodyDiv.ondragover = e => { e.preventDefault(); e.stopPropagation(); bodyDiv.classList.add('drag-over'); };
      bodyDiv.ondragleave = () => bodyDiv.classList.remove('drag-over');
      bodyDiv.ondrop = e => {
        e.preventDefault(); e.stopPropagation();
        bodyDiv.classList.remove('drag-over');
        if (lv7DragType === 'play') {
          block.body.push({ type:'play', varIdx: lv7DragVarIdx });
          lv7DragType = null; lv7DragVarIdx = null;
          lv7RenderCanvas(); lv7RenderCodePreview(); lv7P2CheckReady();
        }
      };

      if (block.body.length === 0) {
        const hint = document.createElement('div');
        hint.className = 'lv1-dz-placeholder';
        hint.style.cssText = 'font-size:11.5px;padding:10px;margin:0';
        hint.textContent = '← drop play block here';
        bodyDiv.appendChild(hint);
      } else {
        block.body.forEach((inner, ii) => {
          const v = lv7Vars[inner.varIdx] || { name:'?' };
          const innerEl = document.createElement('div');
          innerEl.className = 'lv1-seq-block';
          innerEl.style.cssText = 'margin:0;background:' + colors[inner.varIdx % 4];
          innerEl.innerHTML = icon('music',12) + ' play( <strong>' + v.name + '</strong> )' +
            '<button class="lv1-rm-btn" onclick="lv7RemoveInner('+idx+','+ii+')">' + icon('close',11) + '</button>';
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

function lv7RemoveBlock(idx) {
  lv7Program.splice(idx, 1);
  lv7RenderCanvas(); lv7RenderCodePreview(); lv7P2CheckReady();
}

function lv7RemoveInner(bi, ii) {
  lv7Program[bi].body.splice(ii, 1);
  lv7RenderCanvas(); lv7RenderCodePreview(); lv7P2CheckReady();
}

function lv7RenderCodePreview() {
  const el = document.getElementById('lv7-code-preview');
  if (!el) return;
  let lines = [];
  // Variable defs
  lv7Vars.forEach(v => {
    lines.push(`<span class="lv1-code-line"><span class="py-var">${v.name}</span><span class="py-op"> = </span>[${v.notes.map(n=>'<span class="py-str">"'+n+'"</span>').join('<span class="py-op">, </span>')}]</span>`);
  });
  lines.push('<span class="lv1-code-line">&nbsp;</span>');
  // Program
  lv7Program.forEach(block => {
    if (block.type === 'play') {
      const v = lv7Vars[block.varIdx] || {name:'?'};
      lines.push(`<span class="lv1-code-line"><span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${v.name}</span><span class="py-op">)</span></span>`);
    } else if (block.type === 'repeat') {
      lines.push(`<span class="lv1-code-line"><span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span> <span class="py-fn">range</span><span class="py-op">(</span><span class="py-num">${block.count}</span><span class="py-op">):</span></span>`);
      block.body.forEach(inner => {
        const v = lv7Vars[inner.varIdx] || {name:'?'};
        lines.push(`<span class="lv1-code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${v.name}</span><span class="py-op">)</span></span>`);
      });
    }
  });
  el.innerHTML = lines.join('');
}

function lv7P2CheckReady() {
  const hasPlay = lv7Program.some(b =>
    b.type === 'play' || (b.type === 'repeat' && b.body.length > 0)
  );
  const next = document.getElementById('lv7-p2-next');
  if (next) next.style.display = hasPlay ? 'inline-flex' : 'none';
}

async function lv7BuildPlay() {
  if (lv7BuildPlaying) return;
  lv7BuildPlaying = true;
  await initTone();
  for (const block of lv7Program) {
    if (block.type === 'play') {
      const v = lv7Vars[block.varIdx];
      if (v) for (const n of v.notes) await playNote(n, 1);
    } else if (block.type === 'repeat') {
      for (let i = 0; i < block.count; i++) {
        for (const inner of block.body) {
          const v = lv7Vars[inner.varIdx];
          if (v) for (const n of v.notes) await playNote(n, 1);
        }
      }
    }
  }
  lv7BuildPlaying = false;
}

function lv7P2Confirm() {
  const hasPlay = lv7Program.some(b =>
    b.type === 'play' || (b.type === 'repeat' && b.body.length > 0)
  );
  const fb = document.getElementById('lv7-p2-fb');
  if (!hasPlay) {
    fb.style.display = 'block'; fb.className = 'lv1-feedback error';
    fb.textContent = 'Add at least one play block to your song first!'; return;
  }
  lv7ShowPhase(3);
}

// ══════════════════════════════════════════════════════
// PHASE 3 — Share
// ══════════════════════════════════════════════════════
function lv7RenderPhase3(body) {
  // Count up program stats
  let totalNotes = 0;
  let usesLoop = false;
  let varNames = new Set();
  lv7Program.forEach(b => {
    if (b.type === 'play') {
      const v = lv7Vars[b.varIdx];
      if (v) { totalNotes += v.notes.length; varNames.add(v.name); }
    } else if (b.type === 'repeat') {
      usesLoop = true;
      b.body.forEach(inner => {
        const v = lv7Vars[inner.varIdx];
        if (v) { totalNotes += v.notes.length * b.count; varNames.add(v.name); }
      });
    }
  });

  const conceptsUsed = ['Variables', 'Sequencing'];
  if (usesLoop) conceptsUsed.push('Loops');

  body.innerHTML = `
    <div class="lv1-scroll">
      <div class="lv7-share-hero">
        <div class="lv7-share-hero-icon">${icon('trophy', 40)}</div>
        <div class="lv7-share-hero-title">"${lv7PlanTitle}"</div>
        <div class="lv7-share-hero-sub">by ${document.getElementById('user-name-display') ? document.getElementById('user-name-display').textContent || 'you' : 'you'}</div>
      </div>

      <div class="lv7-stats-row">
        <div class="lv7-stat">
          <div class="lv7-stat-val">${totalNotes}</div>
          <div class="lv7-stat-lbl">total notes</div>
        </div>
        <div class="lv7-stat">
          <div class="lv7-stat-val">${varNames.size}</div>
          <div class="lv7-stat-lbl">variables used</div>
        </div>
        <div class="lv7-stat">
          <div class="lv7-stat-val">${lv7Program.length}</div>
          <div class="lv7-stat-lbl">program blocks</div>
        </div>
        <div class="lv7-stat">
          <div class="lv7-stat-val">${lv7PlanMood}</div>
          <div class="lv7-stat-lbl">vibe</div>
        </div>
      </div>

      <div class="lv7-concepts-row">
        <div class="lv7-concepts-label">CS concepts you applied:</div>
        <div class="lv7-concepts-chips">
          ${conceptsUsed.map(c => `<span class="lv7-concept-chip">${c}</span>`).join('')}
        </div>
      </div>

      <div class="lv7-final-code">
        <div class="lv7-section-label">Your complete Python program</div>
        <div class="lv1-code-panel" id="lv7-final-code-panel" style="font-size:12px;line-height:1.9"></div>
      </div>

      <div class="lv7-share-actions">
        <button class="lv1-btn secondary" onclick="lv7SharePlay()">
          ${icon('play',12)} Play my song
        </button>
        <button class="lv1-btn secondary" onclick="lv7ShareSave()">
          ${icon('save',12)} Save program
        </button>
        <button class="lv1-btn secondary" onclick="lv7ShareAudio()">
          ${icon('music',12)} Export audio
        </button>
      </div>

      <div class="lv7-complete-wrap">
        <button class="lv7-complete-btn" onclick="lv7Complete()">
          ${icon('trophy',18)} Complete Level 7 — You're a MusiCoder!
        </button>
      </div>
    </div>
  `;

  // Render final code
  lv7RenderFinalCode();
}

function lv7RenderFinalCode() {
  const el = document.getElementById('lv7-final-code-panel');
  if (!el) return;
  let lines = [];
  lines.push(`<span class="lv1-code-line"><span class="py-comment"># "${lv7PlanTitle}" — mood: ${lv7PlanMood}</span></span>`);
  lines.push('<span class="lv1-code-line">&nbsp;</span>');
  lv7Vars.forEach(v => {
    lines.push(`<span class="lv1-code-line"><span class="py-var">${v.name}</span><span class="py-op"> = </span>[${v.notes.map(n=>'<span class="py-str">"'+n+'"</span>').join('<span class="py-op">, </span>')}]</span>`);
  });
  lines.push('<span class="lv1-code-line">&nbsp;</span>');
  lv7Program.forEach(block => {
    if (block.type === 'play') {
      const v = lv7Vars[block.varIdx] || {name:'?'};
      lines.push(`<span class="lv1-code-line"><span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${v.name}</span><span class="py-op">)</span></span>`);
    } else if (block.type === 'repeat') {
      lines.push(`<span class="lv1-code-line"><span class="py-kw">for</span> <span class="py-var">i</span> <span class="py-kw">in</span> <span class="py-fn">range</span><span class="py-op">(</span><span class="py-num">${block.count}</span><span class="py-op">):</span></span>`);
      block.body.forEach(inner => {
        const v = lv7Vars[inner.varIdx] || {name:'?'};
        lines.push(`<span class="lv1-code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="py-fn">play</span><span class="py-op">(</span><span class="py-var">${v.name}</span><span class="py-op">)</span></span>`);
      });
    }
  });
  el.innerHTML = lines.join('');
}

let lv7SharePlaying = false;
async function lv7SharePlay() {
  if (lv7SharePlaying) return;
  lv7SharePlaying = true;
  await initTone();
  for (const block of lv7Program) {
    if (block.type === 'play') {
      const v = lv7Vars[block.varIdx];
      if (v) for (const n of v.notes) await playNote(n, 1);
    } else if (block.type === 'repeat') {
      for (let i = 0; i < block.count; i++) {
        for (const inner of block.body) {
          const v = lv7Vars[inner.varIdx];
          if (v) for (const n of v.notes) await playNote(n, 1);
        }
      }
    }
  }
  lv7SharePlaying = false;
}

function lv7ShareSave() {
  // Reuse existing downloadProgram logic but with lv7 data
  const data = {
    title: lv7PlanTitle,
    mood: lv7PlanMood,
    vars: lv7Vars,
    program: lv7Program
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (lv7PlanTitle.replace(/[^a-z0-9]/gi,'_') || 'my_song') + '.json';
  a.click();
}

function lv7ShareAudio() {
  if (typeof downloadAudio === 'function') downloadAudio();
}

function lv7Complete() {
  completeLevel(7);
  fireConfetti && fireConfetti(120);
  backToLevels();
}
