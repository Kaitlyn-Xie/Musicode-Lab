function renderLevel3() {
  buildLevelShell(3, `
    <div class="lv1-scroll">
      <div class="lv1-concept">
        <div class="lv1-concept-label">Coming up in Level 3</div>
        <p>Music is full of repetition — choruses, beats, riffs. You'll use a <strong>loop</strong> (repeat block) to play a phrase multiple times, write it in Python, and understand why loops make code shorter and smarter.</p>
      </div>
      <div class="lvsh-coming">
        <div class="lvsh-phases-preview">
          ${LEVELS[2].phases.map((ph, i) =>
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
