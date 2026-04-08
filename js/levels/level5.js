function renderLevel5() {
  buildLevelShell(5, `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Coming up in Level 5</div>
        <p>Good coders read code carefully and <strong>debug</strong> — find and fix errors. You'll listen to a melody that sounds wrong, read the block code, spot the bug, fix it, and test again. Just like a real programmer.</p>
      </div>
      <div class="lvsh-coming">
        <div class="lvsh-phases-preview">
          ${LEVELS[4].phases.map((ph, i) =>
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
