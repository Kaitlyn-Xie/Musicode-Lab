function renderLevel7() {
  buildLevelShell(7, `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Level 7 — The Final Stage</div>
        <p>You've learned sequencing, variables, loops, binary, debugging, and searching. Now it's time to <strong>compose your own song</strong> using everything — plan it, build it with blocks and Python, and share it!</p>
      </div>
      <div class="lvsh-coming">
        <div class="lvsh-phases-preview">
          ${LEVELS[6].phases.map((ph, i) =>
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
