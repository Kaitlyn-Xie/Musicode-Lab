// ════════════════════════════════════════════════════════════
// TONE.JS SETUP
// ════════════════════════════════════════════════════════════
let synths = {};
let audioCtx = null;

async function initTone() {
  if (toneReady) return;
  await Tone.start();
  audioCtx = Tone.context.rawContext || Tone.context._context || Tone.context;
  synths.piano = new Tone.Synth({ oscillator:{type:'triangle'}, envelope:{attack:0.01,decay:0.3,sustain:0.4,release:0.8} }).toDestination();
  synths.marimba = new Tone.Synth({ oscillator:{type:'sine'}, envelope:{attack:0.005,decay:0.2,sustain:0.1,release:0.4} }).toDestination();
  synths.synth = new Tone.Synth({ oscillator:{type:'sawtooth'}, envelope:{attack:0.02,decay:0.1,sustain:0.5,release:0.5} }).toDestination();
  synths.clap = new Tone.NoiseSynth({ noise:{type:'white'}, envelope:{attack:0.001,decay:0.15,sustain:0,release:0.05} }).toDestination();
  toneReady = true;
}

function currentSynth() { return synths[instrument] || synths.piano; }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function beatMs(beats=1) { return (60/tempo)*1000*beats; }

async function playNote(note, beats=1) {
  if (!toneReady) return;
  if (note === 'rest') { await sleep(beatMs(beats)); return; }
  if (note === 'clap') { synths.clap.triggerAttackRelease('8n'); await sleep(beatMs(beats)); return; }
  try { currentSynth().triggerAttackRelease(note, `${beats*0.5}n`); } catch(e){}
  await sleep(beatMs(beats));
}

async function playVar(varId) {
  const v = allVars().find(x=>x.id===varId);
  if (!v) return;
  if (v.audioBuffer) {
    await playAudioBuffer(v.audioBuffer);
    return;
  }
  for (const n of v.notes) {
    if (stopFlag) break;
    await playNote(n, 1);
    animViz();
  }
}

async function playAudioBuffer(buf) {
  if (!audioCtx) return;
  return new Promise(res => {
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtx.destination);
    src.start(0);
    src.onended = res;
    animViz();
  });
}

// ════════════════════════════════════════════════════════════
// VISUALIZER
// ════════════════════════════════════════════════════════════
function buildViz() {
  const v = document.getElementById('visualizer');
  v.innerHTML = '';
  for (let i=0;i<24;i++) {
    const b = document.createElement('div');
    b.className = 'viz-bar';
    v.appendChild(b);
  }
}

function animViz() {
  const bars = document.querySelectorAll('.viz-bar');
  bars.forEach(b => {
    b.style.height = (4+Math.random()*26)+'px';
    b.style.background = `hsl(${200+Math.random()*80},70%,${60+Math.random()*20}%)`;
  });
  setTimeout(()=> bars.forEach(b=>{ b.style.height='4px'; b.style.background='rgba(168,212,255,0.3)'; }), 200);
}

// ════════════════════════════════════════════════════════════
// PLAYBACK ENGINE
// ════════════════════════════════════════════════════════════
async function execBlocks(blocks) {
  for (const b of blocks) {
    if (stopFlag) break;
    highlightCodeLine(b.id);
    animViz();

    if (b.type === 'play') {
      await playVar(b.varId);
    } else if (b.type === 'say') {
      showLyrics(b.text);
      await sleep(beatMs(2));
      hideLyrics();
    } else if (b.type === 'print') {
      const v=allVars().find(x=>x.id===b.varId)||VARS[0];
      showToast(`📋 ${v.name}: [${v.notes?v.notes.join(', '):'audio'}]`);
      await sleep(beatMs(1));
    } else if (b.type === 'setTempo') {
      tempo = b.value;
      document.getElementById('tempo-slider').value = tempo;
      document.getElementById('tempo-val').textContent = tempo;
    } else if (b.type === 'setInst') {
      instrument = b.value;
      document.getElementById('inst-select').value = instrument;
    } else if (b.type === 'wait') {
      await sleep(beatMs(b.beats));
    } else if (b.type === 'playNote') {
      await playNote(b.note, b.beats);
    } else if (b.type === 'playChord') {
      const notes=b.notes.split(',').map(n=>n.trim());
      notes.forEach(n=>{ try{ currentSynth().triggerAttackRelease(n,'8n'); }catch(e){} });
      await sleep(beatMs(1));
    } else if (b.type === 'repeat') {
      for (let i=0;i<b.count;i++) {
        if (stopFlag) break;
        await execBlocks(b.body);
      }
    } else if (b.type === 'if') {
      let cond=false;
      if(b.cond==='always') cond=true;
      else if(b.cond==='tempo>120') cond=tempo>120;
      else if(b.cond==='tempo<80') cond=tempo<80;
      await execBlocks(cond?b.then:b.else);
    }
  }
}

async function toggleRun() {
  if (running) { stopFlag=true; return; }
  await initTone();
  running=true; stopFlag=false;
  const btn=document.getElementById('run-btn');
  const lbl=document.getElementById('run-label');
  btn.className='running';btn.innerHTML=icon('stop',16);
  lbl.textContent='Stop';
  await execBlocks(canvas);
  running=false; stopFlag=false;
  btn.className='stopped';btn.innerHTML=icon('play',16);
  lbl.textContent='Run';
  document.querySelectorAll('.code-line.hl').forEach(el=>el.classList.remove('hl'));
}

// ════════════════════════════════════════════════════════════
// INSTRUMENT / TEMPO
// ════════════════════════════════════════════════════════════
function setInstrument(val) { instrument=val; }
function setTempo(val) {
  tempo=val;
  document.getElementById('tempo-val').textContent=val;
}

// ════════════════════════════════════════════════════════════
// DOWNLOAD
// ════════════════════════════════════════════════════════════
function downloadProgram() {
  const data={version:'1.0',tempo,instrument,program:JSON.stringify(canvas)};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my-music-program.json';a.click();
  showToast('Program saved!');
}

async function downloadAudio() {
  await initTone();
  const dest=Tone.context.createMediaStreamDestination();
  Tone.getDestination().connect(dest);
  const mr=new MediaRecorder(dest.stream);
  const chunks=[];
  mr.ondataavailable=e=>chunks.push(e.data);
  mr.onstop=()=>{
    const blob=new Blob(chunks,{type:'audio/webm'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my-music.webm';a.click();
    document.getElementById('rec-dot').classList.remove('show');
    showToast('Audio downloaded!');
  };
  mr.start();
  document.getElementById('rec-dot').classList.add('show');
  await execBlocks(canvas);
  await sleep(400);
  mr.stop();
  Tone.getDestination().disconnect(dest);
}
