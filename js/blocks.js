// ════════════════════════════════════════════════════════════
// UNIQUE IDS
// ════════════════════════════════════════════════════════════
function uid() { return 'b'+(uidCtr++); }

// ════════════════════════════════════════════════════════════
// BLOCK FACTORIES
// ════════════════════════════════════════════════════════════
function makeBlock(type, opts={}) {
  const b = { id: uid(), type, ...opts };
  if (type === 'play')     { b.varId = opts.varId || VARS[0].id; }
  if (type === 'say')      { b.text = opts.text || 'Hello!'; }
  if (type === 'print')    { b.varId = opts.varId || VARS[0].id; }
  if (type === 'setTempo') { b.value = opts.value || 120; }
  if (type === 'setInst')  { b.value = opts.value || 'piano'; }
  if (type === 'wait')     { b.beats = opts.beats || 1; }
  if (type === 'playNote') { b.note = opts.note || 'C4'; b.beats = opts.beats || 1; }
  if (type === 'playChord'){ b.notes = opts.notes || 'C4,E4,G4'; }
  if (type === 'repeat')   { b.count = opts.count || 3; b.body = opts.body || []; }
  if (type === 'if')       { b.cond = opts.cond || 'always'; b.then = opts.then || []; b.else = opts.else || []; }
  return b;
}

// ════════════════════════════════════════════════════════════
// BLOCK RENDERING
// ════════════════════════════════════════════════════════════
function isValidNote(n) { return NOTES_LIST.includes(n); }

function renderBlockEl(b, isNested=false) {
  if (b.type === 'play')     return renderPlayBlock(b, isNested);
  if (b.type === 'say')      return renderSayBlock(b, isNested);
  if (b.type === 'print')    return renderPrintBlock(b, isNested);
  if (b.type === 'setTempo') return renderSetTempoBlock(b, isNested);
  if (b.type === 'setInst')  return renderSetInstBlock(b, isNested);
  if (b.type === 'wait')     return renderWaitBlock(b, isNested);
  if (b.type === 'playNote') return renderPlayNoteBlock(b, isNested);
  if (b.type === 'playChord')return renderPlayChordBlock(b, isNested);
  if (b.type === 'repeat')   return renderRepeatBlock(b, isNested);
  if (b.type === 'if')       return renderIfBlock(b, isNested);
  return document.createElement('div');
}

function delBtn(b, arr) {
  const btn = document.createElement('button');
  btn.className='block-del';btn.innerHTML=icon('close',11);btn.title='Delete';
  btn.onclick = e => { e.stopPropagation(); removeBlock(b.id, arr||canvas); syncAll(); };
  return btn;
}

function renderPlayBlock(b, isNested) {
  const v = allVars().find(x=>x.id===b.varId)||VARS[0];
  const el = document.createElement('div');
  el.className='block';el.style.background='#2E80D0';
  el.dataset.bid=b.id;
  el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};

  const lbl=document.createElement('span');lbl.innerHTML=icon('music',12)+' play( ';el.appendChild(lbl);
  const badge=document.createElement('span');badge.className='block-badge';badge.textContent=v.name;
  badge.style.background=v.dark||'#1860A0';el.appendChild(badge);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);

  // var selector (hidden, shown on click badge)
  const sel=document.createElement('select');
  sel.style.cssText='margin-left:4px;display:none;';
  allVars().forEach(vv=>{const o=document.createElement('option');o.value=vv.id;o.textContent=vv.name;if(vv.id===b.varId)o.selected=true;sel.appendChild(o);});
  sel.onchange=()=>{b.varId=sel.value;syncAll();};
  badge.onclick=e=>{e.stopPropagation();sel.style.display=sel.style.display==='none'?'inline':'none';};
  el.appendChild(sel);
  el.appendChild(delBtn(b));
  return el;
}

function renderSayBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#C02878';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('say',12)+' say( ';el.appendChild(lbl);
  const inp=document.createElement('input');inp.type='text';inp.value=b.text;inp.size=14;
  inp.style.maxWidth='160px';
  inp.oninput=()=>{b.text=inp.value;syncAll();};
  el.appendChild(inp);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderPrintBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#C02878';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('print',12)+' print( ';el.appendChild(lbl);
  const sel=document.createElement('select');
  allVars().forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=v.name;if(v.id===b.varId)o.selected=true;sel.appendChild(o);});
  sel.onchange=()=>{b.varId=sel.value;syncAll();};
  el.appendChild(sel);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderSetTempoBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#7050D0';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('volume',12)+' set tempo( ';el.appendChild(lbl);
  const inp=document.createElement('input');inp.type='number';inp.value=b.value;inp.min=40;inp.max=240;inp.style.width='60px';
  inp.oninput=()=>{b.value=+inp.value||120;syncAll();};
  el.appendChild(inp);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderSetInstBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#7050D0';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('instrument',12)+' set instrument( ';el.appendChild(lbl);
  const sel=document.createElement('select');
  ['piano','marimba','synth'].forEach(i=>{const o=document.createElement('option');o.value=i;o.textContent=i;if(i===b.value)o.selected=true;sel.appendChild(o);});
  sel.onchange=()=>{b.value=sel.value;syncAll();};
  el.appendChild(sel);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderWaitBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#2EA870';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('wait',12)+' wait( ';el.appendChild(lbl);
  const inp=document.createElement('input');inp.type='number';inp.value=b.beats;inp.min=0.5;inp.max=16;inp.step=0.5;inp.style.width='55px';
  inp.oninput=()=>{b.beats=+inp.value||1;syncAll();};
  el.appendChild(inp);
  const lbl2=document.createElement('span');lbl2.textContent=' beats )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderPlayNoteBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#2E80D0';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('music',12)+' play note( ';el.appendChild(lbl);
  const sel=document.createElement('select');
  NOTES_LIST.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;if(n===b.note)o.selected=true;sel.appendChild(o);});
  sel.onchange=()=>{b.note=sel.value;syncAll();};
  el.appendChild(sel);
  const lbl2=document.createElement('span');lbl2.textContent=', ';el.appendChild(lbl2);
  const inp=document.createElement('input');inp.type='number';inp.value=b.beats;inp.min=0.5;inp.max=8;inp.step=0.5;inp.style.width='50px';
  inp.oninput=()=>{b.beats=+inp.value||1;syncAll();};
  el.appendChild(inp);
  const lbl3=document.createElement('span');lbl3.textContent=' beats )';el.appendChild(lbl3);
  el.appendChild(delBtn(b));
  return el;
}

function renderPlayChordBlock(b, isNested) {
  const el=document.createElement('div');el.className='block';el.style.background='#2E80D0';
  el.dataset.bid=b.id;el.draggable=true;
  el.ondragstart=e=>{dragPayload={moveId:b.id};e.dataTransfer.effectAllowed='move';};
  const lbl=document.createElement('span');lbl.innerHTML=icon('chord',12)+' play chord( ';el.appendChild(lbl);
  const inp=document.createElement('input');inp.type='text';inp.value=b.notes;inp.size=12;
  inp.oninput=()=>{b.notes=inp.value;syncAll();};
  el.appendChild(inp);
  const lbl2=document.createElement('span');lbl2.textContent=' )';el.appendChild(lbl2);
  el.appendChild(delBtn(b));
  return el;
}

function renderRepeatBlock(b, isNested) {
  const wrap=document.createElement('div');wrap.className='loop-block';wrap.dataset.bid=b.id;

  const header=document.createElement('div');header.className='loop-header';
  const ic=document.createElement('span');ic.innerHTML=icon('repeat',12)+' repeat ';header.appendChild(ic);
  const cbs=document.createElement('div');cbs.className='count-btns';
  const minus=document.createElement('button');minus.textContent='−';minus.onclick=e=>{e.stopPropagation();b.count=Math.max(1,b.count-1);syncAll();};
  const val=document.createElement('span');val.className='count-val';val.textContent=b.count;
  const plus=document.createElement('button');plus.textContent='+';plus.onclick=e=>{e.stopPropagation();b.count=Math.min(99,b.count+1);syncAll();};
  cbs.appendChild(minus);cbs.appendChild(val);cbs.appendChild(plus);
  header.appendChild(cbs);
  const lbl2=document.createElement('span');lbl2.textContent=' times:';header.appendChild(lbl2);
  const db=document.createElement('button');db.className='block-del';db.innerHTML=icon('close',11);db.style.opacity='0';
  db.onclick=e=>{e.stopPropagation();removeBlock(b.id,canvas);syncAll();};
  header.addEventListener('mouseenter',()=>db.style.opacity='1');
  header.addEventListener('mouseleave',()=>db.style.opacity='0');
  header.appendChild(db);
  wrap.appendChild(header);

  const body=document.createElement('div');body.className='loop-body';
  body.ondragover=e=>{e.preventDefault();e.stopPropagation();body.classList.add('drag-over');};
  body.ondragleave=()=>body.classList.remove('drag-over');
  body.ondrop=e=>{e.preventDefault();e.stopPropagation();body.classList.remove('drag-over');handleDropInto(b.body,e);syncAll();};

  if (b.body.length===0) {
    const hint=document.createElement('div');hint.className='drop-hint';hint.textContent='← drop blocks here';body.appendChild(hint);
  } else {
    b.body.forEach(child=>body.appendChild(renderBlockEl(child,true)));
  }
  wrap.appendChild(body);

  const footer=document.createElement('div');footer.className='loop-footer';
  const fe=document.createElement('span');fe.textContent='end';fe.style.opacity='0.6';fe.style.fontSize='11px';footer.appendChild(fe);
  wrap.appendChild(footer);

  return wrap;
}

function renderIfBlock(b, isNested) {
  const wrap=document.createElement('div');wrap.className='if-block';wrap.dataset.bid=b.id;

  const header=document.createElement('div');header.className='if-header';
  const ic=document.createElement('span');ic.innerHTML=icon('branch',12)+' if ';header.appendChild(ic);
  const sel=document.createElement('select');
  [{v:'always',l:'always'},{v:'tempo>120',l:'tempo > 120'},{v:'tempo<80',l:'tempo < 80'}].forEach(c=>{
    const o=document.createElement('option');o.value=c.v;o.textContent=c.l;if(c.v===b.cond)o.selected=true;sel.appendChild(o);
  });
  sel.onchange=()=>{b.cond=sel.value;syncAll();};
  header.appendChild(sel);
  const lbl=document.createElement('span');lbl.textContent=':';header.appendChild(lbl);
  const db=document.createElement('button');db.className='block-del';db.innerHTML=icon('close',11);db.style.opacity='0';
  db.onclick=e=>{e.stopPropagation();removeBlock(b.id,canvas);syncAll();};
  header.addEventListener('mouseenter',()=>db.style.opacity='1');
  header.addEventListener('mouseleave',()=>db.style.opacity='0');
  header.appendChild(db);
  wrap.appendChild(header);

  const thenBody=document.createElement('div');thenBody.className='if-body';
  thenBody.ondragover=e=>{e.preventDefault();e.stopPropagation();thenBody.classList.add('drag-over');};
  thenBody.ondragleave=()=>thenBody.classList.remove('drag-over');
  thenBody.ondrop=e=>{e.preventDefault();e.stopPropagation();thenBody.classList.remove('drag-over');handleDropInto(b.then,e);syncAll();};
  if(b.then.length===0){const h=document.createElement('div');h.className='drop-hint';h.textContent='← then: drop blocks';thenBody.appendChild(h);}
  else b.then.forEach(child=>thenBody.appendChild(renderBlockEl(child,true)));
  wrap.appendChild(thenBody);

  const elseHeader=document.createElement('div');elseHeader.className='else-header';
  elseHeader.textContent='else:';wrap.appendChild(elseHeader);

  const elseBody=document.createElement('div');elseBody.className='else-body';
  elseBody.ondragover=e=>{e.preventDefault();e.stopPropagation();elseBody.classList.add('drag-over');};
  elseBody.ondragleave=()=>elseBody.classList.remove('drag-over');
  elseBody.ondrop=e=>{e.preventDefault();e.stopPropagation();elseBody.classList.remove('drag-over');handleDropInto(b.else,e);syncAll();};
  if(b.else.length===0){const h=document.createElement('div');h.className='drop-hint';h.textContent='← else: drop blocks';elseBody.appendChild(h);}
  else b.else.forEach(child=>elseBody.appendChild(renderBlockEl(child,true)));
  wrap.appendChild(elseBody);

  const footer=document.createElement('div');footer.className='if-footer';
  footer.innerHTML='<span style="opacity:0.6;font-size:11px">end if</span>';
  wrap.appendChild(footer);
  return wrap;
}

// ════════════════════════════════════════════════════════════
// CANVAS RENDERING
// ════════════════════════════════════════════════════════════
function renderBlocks() {
  const scroll = document.getElementById('canvas-scroll');
  // Keep empty state
  const empty = document.getElementById('canvas-empty');
  // Remove old blocks (not the empty div)
  Array.from(scroll.children).forEach(c=>{ if(c!==empty) scroll.removeChild(c); });
  empty.style.display = canvas.length===0 ? 'flex' : 'none';
  canvas.forEach(b => scroll.appendChild(renderBlockEl(b)));
}

function renderBlocksInto(container) {
  if (!container) return;
  container.innerHTML = '';
  if (canvas.length===0) {
    const hint=document.createElement('div');hint.className='canvas-empty';
    hint.innerHTML='<div class="empty-icon">'+icon('pointer',32)+'</div><p>Build your answer here!</p><small>Click or drag blocks from the left panel</small>';
    container.appendChild(hint);
  }
  canvas.forEach(b=>container.appendChild(renderBlockEl(b)));
}

function syncAll() {
  if (activeContainer) renderBlocksInto(activeContainer);
  else renderBlocks();
  updateCodePreview();
}

// ════════════════════════════════════════════════════════════
// DRAG & DROP — position-aware insertion
// ════════════════════════════════════════════════════════════
let dropLineIdx = -1;

function onCanvasDragOver(e) {
  e.preventDefault();
  const scroll = document.getElementById('canvas-scroll');
  scroll.classList.add('drag-over');
  dropLineIdx = getDropIndexFromY(scroll, e.clientY);
  showDropLine(scroll, dropLineIdx);
}

function onCanvasDragLeave(e) {
  const scroll = document.getElementById('canvas-scroll');
  if (!scroll.contains(e.relatedTarget)) {
    scroll.classList.remove('drag-over');
    removeDropLine();
  }
}

function onCanvasDrop(e) {
  e.preventDefault();
  const scroll = document.getElementById('canvas-scroll');
  scroll.classList.remove('drag-over');
  removeDropLine();
  if (!dragPayload) return;
  handleCanvasInsert(dropLineIdx >= 0 ? dropLineIdx : canvas.length);
}

/* Calculate which index (0..canvas.length) the cursor is closest to */
function getDropIndexFromY(container, clientY) {
  const blockEls = Array.from(container.querySelectorAll(
    ':scope > .block, :scope > .loop-block, :scope > .if-block'
  ));
  for (let i = 0; i < blockEls.length; i++) {
    const rect = blockEls[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return i;
  }
  return canvas.length;
}

/* Show a thin blue insertion line at the target gap */
function showDropLine(container, idx) {
  let line = document.getElementById('canvas-drop-line');
  if (!line) {
    line = document.createElement('div');
    line.id = 'canvas-drop-line';
    line.className = 'canvas-drop-line';
    document.body.appendChild(line);
  }
  const blockEls = Array.from(container.querySelectorAll(
    ':scope > .block, :scope > .loop-block, :scope > .if-block'
  ));
  const cRect = container.getBoundingClientRect();
  let lineY;
  if (blockEls.length === 0) {
    lineY = cRect.top + 20;
  } else if (idx === 0) {
    lineY = blockEls[0].getBoundingClientRect().top - 4;
  } else if (idx >= blockEls.length) {
    lineY = blockEls[blockEls.length - 1].getBoundingClientRect().bottom + 4;
  } else {
    const above = blockEls[idx - 1].getBoundingClientRect().bottom;
    const below = blockEls[idx].getBoundingClientRect().top;
    lineY = (above + below) / 2;
  }
  line.style.cssText = [
    `position:fixed`,
    `left:${cRect.left + 8}px`,
    `top:${lineY - 2}px`,
    `width:${cRect.width - 16}px`,
    `height:4px`,
    `border-radius:2px`,
    `background:#2E80D0`,
    `pointer-events:none`,
    `z-index:9999`,
    `box-shadow:0 0 0 2px rgba(46,128,208,0.25)`,
  ].join(';');
}

function removeDropLine() {
  const line = document.getElementById('canvas-drop-line');
  if (line) line.remove();
  dropLineIdx = -1;
}

/* Insert a block (new or moved) at the given canvas index */
function handleCanvasInsert(idx) {
  if (!dragPayload) return;
  let nb;
  if (dragPayload.makeBlock) {
    nb = dragPayload.makeBlock();
  } else if (dragPayload.type === 'play') {
    nb = makeBlock('play', { varId: dragPayload.varId });
  } else if (dragPayload.moveId) {
    // Move existing top-level block to new position
    const origIdx = canvas.findIndex(b => b.id === dragPayload.moveId);
    const b = extractBlock(dragPayload.moveId, canvas);
    if (b) {
      // If we removed from before the target, shift index down by 1
      let pos = (origIdx >= 0 && origIdx < idx) ? idx - 1 : idx;
      pos = Math.max(0, Math.min(pos, canvas.length));
      canvas.splice(pos, 0, b);
      dragPayload = null;
      syncAll();
      return;
    }
  }
  if (nb) {
    const pos = Math.max(0, Math.min(idx, canvas.length));
    canvas.splice(pos, 0, nb);
    syncAll();
  }
  dragPayload = null;
}

function handleDropInto(arr, e) {
  if (!dragPayload) return;
  let nb;
  if (dragPayload.makeBlock) nb = dragPayload.makeBlock();
  else if (dragPayload.type==='play') nb = makeBlock('play',{varId:dragPayload.varId});
  else if (dragPayload.moveId) {
    // move from canvas to nested
    const found = extractBlock(dragPayload.moveId, canvas);
    if (found) { arr.push(found); return; }
  }
  if (nb) arr.push(nb);
  dragPayload = null;
}

function addBlockToCanvas(b) {
  canvas.push(b);
  syncAll();
}

function removeBlock(id, arr) {
  const idx = arr.findIndex(b=>b.id===id);
  if (idx>=0) { arr.splice(idx,1); return true; }
  for (const b of arr) {
    if (b.body && removeBlock(id,b.body)) return true;
    if (b.then && removeBlock(id,b.then)) return true;
    if (b.else && removeBlock(id,b.else)) return true;
  }
  return false;
}

function extractBlock(id, arr) {
  const idx = arr.findIndex(b=>b.id===id);
  if (idx>=0) return arr.splice(idx,1)[0];
  for (const b of arr) {
    let f;
    if (b.body && (f=extractBlock(id,b.body))) return f;
    if (b.then && (f=extractBlock(id,b.then))) return f;
    if (b.else && (f=extractBlock(id,b.else))) return f;
  }
  return null;
}

function clearCanvas() {
  canvas = [];
  syncAll();
}

// ════════════════════════════════════════════════════════════
// CODE PREVIEW
// ════════════════════════════════════════════════════════════
let lineMap = {}; // blockId -> lineNumber
let lineCounter = 0;

function updateCodePreview() {
  lineCounter = 1;
  lineMap = {};
  const preview = document.getElementById('code-preview');
  preview.innerHTML = '';

  function addLine(html, blockId=null) {
    const div=document.createElement('div');div.className='code-line';
    if(blockId){div.dataset.bid=blockId;lineMap[blockId]=lineCounter;}
    const ln=document.createElement('span');ln.className='ln';ln.textContent=lineCounter++;
    const code=document.createElement('span');code.className='code';code.innerHTML=html;
    div.appendChild(ln);div.appendChild(code);
    preview.appendChild(div);
    return div;
  }

  // Variable defs
  addLine(`<span class="kw-comment"># variable definitions</span>`);
  allVars().forEach(v=>{
    if(v.audioBuffer){
      addLine(`<span class="kw-def">def</span> <span class="kw-var">${v.name}</span> = <span class="kw-str">[audio: ${v.duration?v.duration.toFixed(1)+'s':'?'}]</span>`);
    } else {
      addLine(`<span class="kw-def">def</span> <span class="kw-var">${v.name}</span> = [<span class="kw-str">${v.notes.join(', ')}</span>]`);
    }
  });
  addLine('');
  addLine(`<span class="kw-comment"># program</span>`);

  function renderLines(blocks, indent=0) {
    const sp='  '.repeat(indent);
    blocks.forEach(b=>{
      if(b.type==='play'){
        const v=allVars().find(x=>x.id===b.varId)||VARS[0];
        addLine(`${sp}<span class="kw-play">play</span>(<span class="kw-var">${v.name}</span>)`,b.id);
      } else if(b.type==='say'){
        addLine(`${sp}<span class="kw-say">say</span>(<span class="kw-str">"${b.text}"</span>)`,b.id);
      } else if(b.type==='print'){
        const v=allVars().find(x=>x.id===b.varId)||VARS[0];
        addLine(`${sp}<span class="kw-say">print</span>(<span class="kw-var">${v.name}</span>)`,b.id);
      } else if(b.type==='setTempo'){
        addLine(`${sp}<span class="kw-set">set_tempo</span>(<span class="kw-num">${b.value}</span>)`,b.id);
      } else if(b.type==='setInst'){
        addLine(`${sp}<span class="kw-set">set_instrument</span>(<span class="kw-str">"${b.value}"</span>)`,b.id);
      } else if(b.type==='wait'){
        addLine(`${sp}<span class="kw-wait">wait</span>(<span class="kw-num">${b.beats}</span> beats)`,b.id);
      } else if(b.type==='playNote'){
        addLine(`${sp}<span class="kw-note">play_note</span>(<span class="kw-str">"${b.note}"</span>, <span class="kw-num">${b.beats}</span>)`,b.id);
      } else if(b.type==='playChord'){
        addLine(`${sp}<span class="kw-note">play_chord</span>([<span class="kw-str">${b.notes}</span>])`,b.id);
      } else if(b.type==='repeat'){
        addLine(`${sp}<span class="kw-repeat">repeat</span> <span class="kw-num">${b.count}</span> times:`,b.id);
        renderLines(b.body, indent+1);
        addLine(`${sp}<span class="kw-repeat">end</span>`);
      } else if(b.type==='if'){
        addLine(`${sp}<span class="kw-if">if</span> <span class="kw-str">${b.cond}</span>:`,b.id);
        renderLines(b.then, indent+1);
        addLine(`${sp}<span class="kw-if">else</span>:`);
        renderLines(b.else, indent+1);
        addLine(`${sp}<span class="kw-if">end if</span>`);
      }
    });
  }

  renderLines(canvas);
}

function highlightCodeLine(blockId) {
  document.querySelectorAll('.code-line.hl').forEach(el=>el.classList.remove('hl'));
  if (blockId && lineMap[blockId]) {
    const lines = document.querySelectorAll('.code-line');
    // find line with blockId
    const el = document.querySelector(`.code-line[data-bid="${blockId}"]`);
    if (el) { el.classList.add('hl'); el.scrollIntoView({block:'nearest'}); }
  }
}
