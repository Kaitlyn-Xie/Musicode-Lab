// ════════════════════════════════════════════════════════════
// AUDIO UPLOAD & RECORD
// ════════════════════════════════════════════════════════════
async function handleUpload(input) {
  const file=input.files[0];if(!file)return;
  await initTone();
  const buf=await file.arrayBuffer();
  const decoded=await audioCtx.decodeAudioData(buf);
  const name=file.name.replace(/\.[^.]+$/,'').slice(0,12).replace(/\s/g,'_')||'audio';
  addCustomVar(name,decoded);
  input.value='';
}

function addCustomVar(name, audioBuffer) {
  const id='cv'+(++customVarCounter);
  const dedupedName=dedupeVarName(name);
  const color=CUSTOM_COLORS[customVarCounter%CUSTOM_COLORS.length];
  customVars.push({id,name:dedupedName,color,dark:darken(color),audioBuffer,duration:audioBuffer?audioBuffer.duration:0});
  renderPalette();
  updateCodePreview();
  showToast(`Added "${dedupedName}"!`);
}

function dedupeVarName(name) {
  let n=name,i=1;
  while(allVars().find(v=>v.name===n)) n=name+(i++);
  return n;
}
function darken(hex) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.floor(r*0.5)},${Math.floor(g*0.5)},${Math.floor(b*0.5)})`;
}

// Record
let mediaRecorder=null,recChunks=[],recTimer=null,recAnalyser=null;

function openRecordModal() {
  document.getElementById('rec-name').value='';
  document.getElementById('rec-timer').textContent='0:00';
  document.getElementById('rec-vol-fill').style.width='0%';
  document.getElementById('rec-start-btn').style.display='inline-flex';
  document.getElementById('rec-stop-btn').style.display='none';
  buildRecWaveform();
  document.getElementById('record-modal').classList.add('open');
}
function closeRecordModal() {
  if(mediaRecorder&&mediaRecorder.state!=='inactive') mediaRecorder.stop();
  clearInterval(recTimer);
  document.getElementById('record-modal').classList.remove('open');
}

function buildRecWaveform() {
  const wf=document.getElementById('rec-waveform');wf.innerHTML='';
  for(let i=0;i<48;i++){const b=document.createElement('div');b.className='rec-waveform-bar';wf.appendChild(b);}
}

async function startRecording() {
  await initTone();
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  mediaRecorder=new MediaRecorder(stream);recChunks=[];
  mediaRecorder.ondataavailable=e=>recChunks.push(e.data);

  // analyser
  recAnalyser=audioCtx.createAnalyser();recAnalyser.fftSize=128;
  const src=audioCtx.createMediaStreamSource(stream);src.connect(recAnalyser);

  let secs=0;
  recTimer=setInterval(()=>{
    secs++;
    const m=Math.floor(secs/60),s=secs%60;
    document.getElementById('rec-timer').textContent=`${m}:${s.toString().padStart(2,'0')}`;

    // Update vol + waveform
    const data=new Uint8Array(recAnalyser.frequencyBinCount);
    recAnalyser.getByteFrequencyData(data);
    const avg=data.reduce((a,b)=>a+b,0)/data.length;
    document.getElementById('rec-vol-fill').style.width=Math.min(100,avg/128*100*2.5)+'%';
    const bars=document.querySelectorAll('.rec-waveform-bar');
    bars.forEach((b,i)=>{b.style.height=Math.max(4,data[i]||0)/255*56+'px';});

    if(secs>=10) stopRecording();
  },1000);

  mediaRecorder.start();
  document.getElementById('rec-start-btn').style.display='none';
  document.getElementById('rec-stop-btn').style.display='inline-flex';
}

function stopRecording() {
  clearInterval(recTimer);
  mediaRecorder.onstop=async()=>{
    const blob=new Blob(recChunks,{type:'audio/webm'});
    const arrBuf=await blob.arrayBuffer();
    const decoded=await audioCtx.decodeAudioData(arrBuf);
    const name=document.getElementById('rec-name').value.trim().slice(0,12).replace(/\s/g,'_')||'mySound';
    addCustomVar(name,decoded);
    closeRecordModal();
  };
  mediaRecorder.stop();
}
