// ════════════════════════════════════════════════════════════
// LOGIN & HOME SCREEN
// ════════════════════════════════════════════════════════════
let studentName = '';

function doLogin() {
  try {
    const input = document.getElementById('login-name');
    const name = input.value.trim();
    if (!name) { input.focus(); input.style.borderColor='#FF8888'; return; }
    input.style.borderColor='';
    localStorage.setItem('mcl-name', name);
    showHomeScreen(name);
  } catch(err) {
    alert('Login error: ' + err.message);
  }
}

function doGuestLogin() {
  try {
    const saved = localStorage.getItem('mcl-name') || 'Guest';
    showHomeScreen(saved);
  } catch(err) {
    alert('Guest login error: ' + err.message);
  }
}

function doLogout() {
  localStorage.removeItem('mcl-name');
  localStorage.removeItem('mcl-completed');
  completedLevels = [];
  score = 0;
  document.getElementById('score-display').textContent = '0';
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-name').value = '';
}

function showHomeScreen(name) {
  try {
    studentName = name;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('home-greeting').textContent = 'Hello, ' + name + '!';
    document.getElementById('home-username').textContent = name;
    const done = JSON.parse(localStorage.getItem('mcl-completed') || '[]').length;
    document.getElementById('home-progress-badge').textContent = done + ' / 7 levels done';
    document.getElementById('user-name-display').textContent = name;
    document.getElementById('user-chip').style.display = 'inline-flex';
  } catch(err) {
    alert('showHomeScreen error: ' + err.message + '\nStack: ' + err.stack);
  }
}

function enterMode(m) {
  document.getElementById('home-screen').classList.add('hidden');
  setMode(m);
  updateExportBtn();
}

function showHomeFromApp() {
  document.getElementById('challenge-overlay').classList.remove('visible');
  document.getElementById('level-select').classList.remove('visible');
  const done = JSON.parse(localStorage.getItem('mcl-completed') || '[]').length;
  document.getElementById('home-progress-badge').textContent = done + ' / 7 levels done';
  document.getElementById('home-screen').classList.remove('hidden');
}
