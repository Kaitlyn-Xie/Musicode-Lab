// ─── Level 2 shell ────────────────────────────────────────
function renderLevel2() {
  buildLevelShell(2, `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Coming up in Level 2</div>
        <p>You'll learn what a <strong>variable</strong> is — a named container for storing data. In music, a variable holds a melody phrase. You'll name your own melody, edit its notes, and play it back.</p>
      </div>
      <div class="lvsh-coming">
        <div class="lvsh-phases-preview">
          ${LEVELS[1].phases.map((ph, i) =>
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
