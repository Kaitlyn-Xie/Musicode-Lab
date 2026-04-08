// ════════════════════════════════════════════════════════════
// READ CHALLENGES
// ════════════════════════════════════════════════════════════
const READ_CHALLENGES = [
  {
    title:"How many times does it play?",
    desc:"Look at this code carefully. How many times does <code>variable1</code> get played in total?",
    code:`<span class="kw-repeat">repeat</span> <span class="kw-num">3</span> times:\n  <span class="kw-play">play</span>(<span class="kw-var">variable1</span>)\n<span class="kw-repeat">end</span>`,
    options:['1','2','3','4'],correct:2,
    playCode:[makeBlock('repeat',{count:3,body:[makeBlock('play',{varId:'v1'})]})]
  },
  {
    title:"Two variables in a loop",
    desc:"This loop plays two variables each time. How many <em>total</em> plays happen?",
    code:`<span class="kw-repeat">repeat</span> <span class="kw-num">2</span> times:\n  <span class="kw-play">play</span>(<span class="kw-var">variable1</span>)\n  <span class="kw-play">play</span>(<span class="kw-var">variable2</span>)\n<span class="kw-repeat">end</span>`,
    options:['2','3','4','6'],correct:2,
    playCode:[makeBlock('repeat',{count:2,body:[makeBlock('play',{varId:'v1'}),makeBlock('play',{varId:'v2'})]})]
  },
  {
    title:"Nested loops!",
    desc:"This is a loop inside a loop! How many total plays of <code>variable1</code>?",
    code:`<span class="kw-repeat">repeat</span> <span class="kw-num">2</span> times:\n  <span class="kw-repeat">repeat</span> <span class="kw-num">3</span> times:\n    <span class="kw-play">play</span>(<span class="kw-var">variable1</span>)\n  <span class="kw-repeat">end</span>\n<span class="kw-repeat">end</span>`,
    options:['3','4','5','6'],correct:3,
    playCode:[makeBlock('repeat',{count:2,body:[makeBlock('repeat',{count:3,body:[makeBlock('play',{varId:'v1'})]})]})]
  },
  {
    title:"What appears first?",
    desc:"This program has two <code>say</code> blocks. Which text appears on screen FIRST?",
    code:`<span class="kw-play">play</span>(<span class="kw-var">variable1</span>)\n<span class="kw-say">say</span>(<span class="kw-str">"Hello!"</span>)\n<span class="kw-play">play</span>(<span class="kw-var">variable2</span>)\n<span class="kw-say">say</span>(<span class="kw-str">"Goodbye!"</span>)`,
    options:['"Hello!"','"Goodbye!"','variable1','variable2'],correct:0,
    playCode:[makeBlock('play',{varId:'v1'}),makeBlock('say',{text:'Hello!'}),makeBlock('play',{varId:'v2'}),makeBlock('say',{text:'Goodbye!'})]
  }
];

let readAnswered=false;

function renderReadChallenge() {
  readAnswered=false;
  const c=READ_CHALLENGES[readIdx%READ_CHALLENGES.length];
  const inner=document.getElementById('challenge-inner');
  inner.innerHTML='';

  const left=document.createElement('div');left.className='ch-left';

  const badge=document.createElement('div');badge.className='ch-badge read';badge.textContent=`📖 Read Code — Challenge ${readIdx%READ_CHALLENGES.length+1}/${READ_CHALLENGES.length}`;
  left.appendChild(badge);

  const prog=document.createElement('div');prog.className='ch-prog';
  READ_CHALLENGES.forEach((_,i)=>{
    const d=document.createElement('div');d.className='ch-dot';
    if(i<readIdx%READ_CHALLENGES.length)d.classList.add('done');
    if(i===readIdx%READ_CHALLENGES.length)d.classList.add('active');
    prog.appendChild(d);
  });
  left.appendChild(prog);

  const title=document.createElement('div');title.className='ch-title';title.innerHTML=c.title;left.appendChild(title);
  const desc=document.createElement('div');desc.className='ch-desc';desc.innerHTML=c.desc;left.appendChild(desc);

  const codeBlock=document.createElement('div');codeBlock.className='ch-code-block';
  codeBlock.innerHTML=c.code.replace(/\n/g,'<br>');
  left.appendChild(codeBlock);

  const hearBtn=document.createElement('button');hearBtn.className='ch-btn secondary';hearBtn.textContent='▶ Hear it';
  hearBtn.onclick=async()=>{ await initTone(); await execBlocks(c.playCode); };
  left.appendChild(hearBtn);

  const opts=document.createElement('div');opts.className='ch-options';
  c.options.forEach((opt,i)=>{
    const btn=document.createElement('button');btn.className='ch-option';btn.textContent=opt;
    btn.onclick=()=>{
      if(readAnswered) return;
      readAnswered=true;
      const correct=i===c.correct;
      btn.classList.add(correct?'correct':'wrong');
      if(correct){ score+=10; document.getElementById('score-display').textContent=score; }
      else { opts.children[c.correct].classList.add('correct'); }
      fb.textContent=correct?'✅ Correct! Great job!':'❌ Not quite. The correct answer is highlighted.';
      fb.className='ch-feedback show '+(correct?'ok':'bad');
      nextBtn.style.display='inline-flex';
    };
    opts.appendChild(btn);
  });
  left.appendChild(opts);

  const fb=document.createElement('div');fb.className='ch-feedback';left.appendChild(fb);

  const nav=document.createElement('div');nav.className='ch-nav';
  const nextBtn=document.createElement('button');nextBtn.className='ch-btn primary';nextBtn.textContent='Next Challenge →';
  nextBtn.style.display='none';
  nextBtn.onclick=()=>{ readIdx++; renderReadChallenge(); };
  nav.appendChild(nextBtn);
  const backBtn=document.createElement('button');backBtn.className='ch-btn secondary';backBtn.textContent='← Back to Code';
  backBtn.onclick=()=>setMode('free');
  nav.appendChild(backBtn);
  left.appendChild(nav);

  inner.appendChild(left);
}

// ════════════════════════════════════════════════════════════
// LISTEN CHALLENGES
// ════════════════════════════════════════════════════════════
const LISTEN_CHALLENGES = [
  {
    title:"Play variable2 twice",
    desc:"Build a program that plays <strong>variable2 two times in a row</strong>.",
    hint:"Drag two 'play(variable2)' blocks into your program.",
    target:[makeBlock('play',{varId:'v2'}),makeBlock('play',{varId:'v2'})],
    check:(c)=>c.length===2&&c.every(b=>b.type==='play'&&b.varId==='v2')
  },
  {
    title:"Loop variable1 × 3",
    desc:"Use a <strong>repeat block</strong> to play variable1 three times using a loop.",
    hint:"Try: repeat(3) → play(variable1) inside.",
    target:[makeBlock('repeat',{count:3,body:[makeBlock('play',{varId:'v1'})]})],
    check:(c)=>c.length===1&&c[0].type==='repeat'&&c[0].count===3&&c[0].body.length===1&&c[0].body[0].type==='play'&&c[0].body[0].varId==='v1'
  },
  {
    title:"Two variables, repeated twice",
    desc:"Play both <strong>variable1 and variable2</strong> inside a <strong>repeat(2)</strong> loop.",
    hint:"Put both play blocks inside a repeat(2) block.",
    target:[makeBlock('repeat',{count:2,body:[makeBlock('play',{varId:'v1'}),makeBlock('play',{varId:'v2'})]})],
    check:(c)=>c.length===1&&c[0].type==='repeat'&&c[0].count===2&&c[0].body.length===2&&c[0].body[0].varId==='v1'&&c[0].body[1].varId==='v2'
  }
];

function renderListenChallenge() {
  const c=LISTEN_CHALLENGES[listenIdx%LISTEN_CHALLENGES.length];
  const inner=document.getElementById('challenge-inner');
  inner.innerHTML='';canvas=[];

  const left=document.createElement('div');left.className='ch-left';

  const badge=document.createElement('div');badge.className='ch-badge listen';badge.textContent=`🎧 Listen & Code — Challenge ${listenIdx%LISTEN_CHALLENGES.length+1}/${LISTEN_CHALLENGES.length}`;
  left.appendChild(badge);

  const prog=document.createElement('div');prog.className='ch-prog';
  LISTEN_CHALLENGES.forEach((_,i)=>{
    const d=document.createElement('div');d.className='ch-dot';
    if(i<listenIdx%LISTEN_CHALLENGES.length)d.classList.add('done');
    if(i===listenIdx%LISTEN_CHALLENGES.length)d.classList.add('active');
    prog.appendChild(d);
  });
  left.appendChild(prog);

  const title=document.createElement('div');title.className='ch-title';title.innerHTML=c.title;left.appendChild(title);
  const desc=document.createElement('div');desc.className='ch-desc';desc.innerHTML=c.desc;left.appendChild(desc);
  const hint=document.createElement('div');hint.className='ch-hint';hint.textContent='💡 Hint: '+c.hint;left.appendChild(hint);

  const hearBtn=document.createElement('button');hearBtn.className='ch-btn secondary';hearBtn.textContent='▶ Hear Target';
  hearBtn.onclick=async()=>{ await initTone(); await execBlocks(c.target); };
  left.appendChild(hearBtn);

  const fb=document.createElement('div');fb.className='ch-feedback';left.appendChild(fb);

  const nav=document.createElement('div');nav.className='ch-nav';
  const checkBtn=document.createElement('button');checkBtn.className='ch-btn primary';checkBtn.textContent='✓ Check Answer';
  checkBtn.onclick=async()=>{
    const ok=c.check(canvas);
    fb.textContent=ok?'✅ Perfect! That matches the target!':'❌ Not quite right. Try again!';
    fb.className='ch-feedback show '+(ok?'ok':'bad');
    if(ok){ score+=15;document.getElementById('score-display').textContent=score;nextBtn.style.display='inline-flex';}
  };
  nav.appendChild(checkBtn);

  const nextBtn=document.createElement('button');nextBtn.className='ch-btn primary';nextBtn.textContent='Next →';
  nextBtn.style.display='none';
  nextBtn.onclick=()=>{ listenIdx++;canvas=[];renderListenChallenge(); };
  nav.appendChild(nextBtn);

  const backBtn=document.createElement('button');backBtn.className='ch-btn secondary';backBtn.textContent='← Free Code';
  backBtn.onclick=()=>setMode('free');
  nav.appendChild(backBtn);
  left.appendChild(nav);

  inner.appendChild(left);

  // Right side: block canvas
  const right=document.createElement('div');right.className='ch-right';
  const rHeader=document.createElement('div');rHeader.className='col-header';
  rHeader.innerHTML='<div class="col-title"><span class="col-icon">🏗</span> Your Answer</div>';
  const clrBtn=document.createElement('button');clrBtn.className='clear-btn';clrBtn.textContent='🗑 Clear';
  clrBtn.onclick=()=>{canvas=[];syncAll();};
  rHeader.appendChild(clrBtn);
  right.appendChild(rHeader);

  const scroll=document.createElement('div');scroll.id='ch-blocks-scroll';
  scroll.className='drop-zone';
  scroll.style.cssText='flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:6px;';
  scroll.ondragover=e=>{e.preventDefault();scroll.classList.add('drag-over');};
  scroll.ondragleave=()=>scroll.classList.remove('drag-over');
  scroll.ondrop=e=>{e.preventDefault();scroll.classList.remove('drag-over');onCanvasDrop(e);};
  right.appendChild(scroll);
  inner.appendChild(right);

  activeContainer=scroll;
  syncAll();
}
