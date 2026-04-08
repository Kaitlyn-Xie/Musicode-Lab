function renderLevel4() {
  buildLevelShell(4, `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Coming up in Level 4</div>
        <p>Computers store everything as 0s and 1s. In this level you'll decode a binary rhythm — <strong>1 = clap, 0 = rest</strong> — and encode your own beat in binary. You'll see how binary connects to music timing and data.</p>
      </div>
      <div class="lvsh-coming">
        <div class="lvsh-phases-preview">
          ${LEVELS[3].phases.map((ph, i) =>
            `<div class="lvsh-phase-item">
              <div class="lvsh-phase-num">${i+1}</div>
              <div class="lvsh-phase-name">${ph}</div>
            </div>`
          ).join('<div class="lvsh-phase-arrow">→</div>')}
        </div>
        <div class="lvsh-badge">🚧 In Development</div>
      </div>
      <div class="lv1-actions">
        <button class="lv1-btn secondary" onclick="backToLevels()">← Back to Levels</button>
      </div>
    </div>
  `);
}
