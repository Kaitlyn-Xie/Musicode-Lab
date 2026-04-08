// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
function init() {
  buildViz();
  renderPalette();
  canvas = [makeBlock('play',{varId:'v1'}), makeBlock('play',{varId:'v2'})];
  syncAll();

  // Enter key on login
  document.getElementById('login-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // Auto-login if name saved
  const saved = localStorage.getItem('mcl-name');
  if (saved) {
    showHomeScreen(saved);
  }
  // else: login screen shows by default
}

// Keyboard shortcut: Ctrl+Enter to run/stop
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    toggleRun();
  }
});

init();
