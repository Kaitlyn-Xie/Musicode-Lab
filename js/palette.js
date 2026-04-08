// ════════════════════════════════════════════════════════════
// PALETTE RENDERING
// ════════════════════════════════════════════════════════════
function setCat(cat) {
  activeCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat===cat));
  renderPalette();
}

function renderPalette() {
  const scroll = document.getElementById('palette-scroll');
  scroll.innerHTML = '';

  if (activeCat === 'variables') {
    allVars().forEach(v => {
      const wrap = document.createElement('div');
      wrap.style.display='flex';wrap.style.flexDirection='column';

      const chip = document.createElement('div');
      chip.className = 'pal-chip';
      chip.style.background = v.dark;
      chip.draggable = true;
      chip.ondragstart = e => { dragPayload = { type:'play', varId:v.id }; e.dataTransfer.effectAllowed='copy'; };
      chip.onclick = e => { if(e.target.tagName!=='BUTTON') addBlockToCanvas(makeBlock('play',{varId:v.id})); };

      const dot = document.createElement('div');
      dot.className='chip-dot';dot.style.background=v.color;
      chip.appendChild(dot);

      const name = document.createElement('span');
      name.textContent = v.name;
      name.style.flex='1';
      chip.appendChild(name);

      if (v.audioBuffer) {
        const dur = document.createElement('span');
        dur.style.cssText='font-size:10px;opacity:0.7;background:rgba(255,255,255,0.15);padding:1px 6px;border-radius:4px;';
        dur.textContent = v.duration ? v.duration.toFixed(1)+'s' : 'audio';
        chip.appendChild(dur);
      }

      const btns = document.createElement('div');
      btns.className='chip-btns';

      const previewBtn = document.createElement('button');
      previewBtn.textContent='▶';previewBtn.title='Preview';
      previewBtn.onclick = async e => { e.stopPropagation(); await initTone(); await playVar(v.id); };
      btns.appendChild(previewBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent='✏';editBtn.title='Edit';
      editBtn.onclick = e => {
        e.stopPropagation();
        const drawer = wrap.querySelector('.var-edit-drawer');
        drawer.classList.toggle('open');
      };
      btns.appendChild(editBtn);

      if (v.id.startsWith('cv')) {
        const delBtn = document.createElement('button');
        delBtn.textContent='✕';delBtn.title='Delete';
        delBtn.onclick = e => { e.stopPropagation(); customVars = customVars.filter(x=>x.id!==v.id); renderPalette(); syncAll(); };
        btns.appendChild(delBtn);
      }

      chip.appendChild(btns);
      wrap.appendChild(chip);

      // Edit drawer
      const drawer = document.createElement('div');
      drawer.className='var-edit-drawer';

      const nameLabel = document.createElement('label');nameLabel.textContent='Name';
      drawer.appendChild(nameLabel);
      const nameInput = document.createElement('input');
      nameInput.value = v.name;
      nameInput.oninput = () => {
        const val = nameInput.value.trim().slice(0,16).replace(/\s/g,'_');
        if (val && !allVars().find(x=>x.name===val&&x.id!==v.id)) {
          v.name = val; syncAll();
        }
      };
      drawer.appendChild(nameInput);

      if (!v.audioBuffer) {
        const notesLabel = document.createElement('label');notesLabel.textContent='Notes (space separated)';
        drawer.appendChild(notesLabel);
        const notesInput = document.createElement('input');
        notesInput.value = v.notes.join(' ');
        notesInput.placeholder = 'E4 G4 A4 G4 E4';
        notesInput.oninput = () => {
          const parts = notesInput.value.trim().split(/\s+/).filter(n=>isValidNote(n));
          if (parts.length) { v.notes = parts; syncAll(); }
        };
        drawer.appendChild(notesInput);
      }

      wrap.appendChild(drawer);
      scroll.appendChild(wrap);
    });

    // Divider + add audio
    const hr = document.createElement('hr');hr.className='palette-divider';scroll.appendChild(hr);
    const title = document.createElement('div');title.className='palette-section-title';title.textContent='Add Audio Variable';
    scroll.appendChild(title);

    const uploadChip = makeChip('📁 Upload Audio File','#448844',()=>document.getElementById('upload-input').click());
    uploadChip.draggable=false;scroll.appendChild(uploadChip);
    const recordChip = makeChip('🎙 Record My Voice','#884444',()=>openRecordModal());
    recordChip.draggable=false;scroll.appendChild(recordChip);
    return;
  }

  if (activeCat === 'control') {
    const defs = [
      {label:'🔁 repeat … times', bg:'#D4A020', factory:()=>makeBlock('repeat')},
      {label:'❓ if … else …', bg:'#E07830', factory:()=>makeBlock('if')},
    ];
    defs.forEach(d => {
      const chip = makeChip(d.label, d.bg, ()=>addBlockToCanvas(d.factory()), true, ()=>({ type: d.factory().type }));
      chip.ondragstart = e => { dragPayload = { makeBlock: d.factory }; e.dataTransfer.effectAllowed='copy'; };
      scroll.appendChild(chip);
    });
    return;
  }

  if (activeCat === 'sound') {
    const defs = [
      {label:'🔊 set tempo', bg:'#7050D0', f:()=>makeBlock('setTempo')},
      {label:'🎸 set instrument', bg:'#7050D0', f:()=>makeBlock('setInst')},
      {label:'⏳ wait beats', bg:'#2EA870', f:()=>makeBlock('wait')},
    ];
    defs.forEach(d => {
      const chip = makeChip(d.label, d.bg, ()=>addBlockToCanvas(d.f()));
      chip.ondragstart = e => { dragPayload = { makeBlock: d.f }; e.dataTransfer.effectAllowed='copy'; };
      scroll.appendChild(chip);
    });
    return;
  }

  if (activeCat === 'music') {
    const defs = [
      {label:'🎵 play note', bg:'#2E80D0', f:()=>makeBlock('playNote')},
      {label:'🎶 play chord', bg:'#2E80D0', f:()=>makeBlock('playChord')},
    ];
    defs.forEach(d => {
      const chip = makeChip(d.label, d.bg, ()=>addBlockToCanvas(d.f()));
      chip.ondragstart = e => { dragPayload = { makeBlock: d.f }; e.dataTransfer.effectAllowed='copy'; };
      scroll.appendChild(chip);
    });
    return;
  }

  if (activeCat === 'output') {
    const defs = [
      {label:'💬 say "..."', bg:'#C02878', f:()=>makeBlock('say')},
      {label:'🖨 print variable', bg:'#C02878', f:()=>makeBlock('print')},
    ];
    defs.forEach(d => {
      const chip = makeChip(d.label, d.bg, ()=>addBlockToCanvas(d.f()));
      chip.ondragstart = e => { dragPayload = { makeBlock: d.f }; e.dataTransfer.effectAllowed='copy'; };
      scroll.appendChild(chip);
    });
    return;
  }
}

function makeChip(label, bg, clickFn, draggable=true, dragFn=null) {
  const chip = document.createElement('div');
  chip.className='pal-chip';
  chip.style.background=bg;
  chip.draggable=draggable;
  chip.textContent=label;
  chip.onclick=clickFn;
  return chip;
}
