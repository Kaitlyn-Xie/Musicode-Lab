// ════════════════════════════════════════════════════════════
// ICON LIBRARY — Custom SVG icons (no emojis)
// Usage: icon('play', 14)  →  returns HTML string of <svg>
//        <span data-icon="play" data-size="16"></span>  →  replaced by applyIcons()
// All icons are 16×16 viewBox, outlined stroke style, currentColor
// ════════════════════════════════════════════════════════════

// Replace all <span data-icon="..."> with SVG (call after DOM ready)
function applyIcons(root) {
  root = root || document;
  root.querySelectorAll('[data-icon]').forEach(function(el) {
    var name = el.getAttribute('data-icon');
    var sz = parseInt(el.getAttribute('data-size') || '15', 10);
    el.innerHTML = icon(name, sz);
    el.removeAttribute('data-icon');
    el.removeAttribute('data-size');
  });
}

function icon(name, size) {
  size = size || 14;
  var a = 'width="' + size + '" height="' + size + '" viewBox="0 0 16 16"' +
          ' class="icon" aria-hidden="true" focusable="false"' +
          ' xmlns="http://www.w3.org/2000/svg"';
  var ln = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

  var shapes = {

    // ── Playback ────────────────────────────────────────────
    play:
      '<path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/>',

    stop:
      '<rect x="3" y="3" width="10" height="10" rx="1.5" fill="currentColor"/>',

    record:
      '<circle cx="8" cy="8" r="6" ' + ln + '/>' +
      '<circle cx="8" cy="8" r="3.5" fill="currentColor" stroke="none"/>',

    // ── Music ───────────────────────────────────────────────
    music:
      '<ellipse cx="6.5" cy="12.5" rx="2.8" ry="1.8" fill="currentColor" stroke="none"/>' +
      '<line x1="9.3" y1="12.5" x2="9.3" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M9.3 3.5l4 1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',

    chord:
      '<ellipse cx="4.5" cy="13" rx="2.3" ry="1.6" fill="currentColor" stroke="none"/>' +
      '<line x1="6.8" y1="13" x2="6.8" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<ellipse cx="9" cy="11.5" rx="2.3" ry="1.6" fill="currentColor" stroke="none"/>' +
      '<line x1="11.3" y1="11.5" x2="11.3" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="6.8" y1="5" x2="11.3" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    volume:
      '<path d="M2 6v4h3l4 3V3L5 6H2z" ' + ln + ' stroke-linejoin="round"/>' +
      '<path d="M11.5 5.5a3 3 0 0 1 0 5" ' + ln + '/>',

    mic:
      '<rect x="5.5" y="2" width="5" height="8" rx="2.5" ' + ln + '/>' +
      '<path d="M3 8.5a5 5 0 0 0 10 0" ' + ln + '/>' +
      '<line x1="8" y1="13.5" x2="8" y2="15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    headphones:
      '<path d="M8 3a5 5 0 0 0-5 5v1H4.5a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 4.5 13H3a1 1 0 0 1-1-1v-2a6 6 0 0 1 12 0v2a1 1 0 0 1-1 1h-1.5A1.5 1.5 0 0 1 10 12.5v-1A1.5 1.5 0 0 1 11.5 10H13V8a5 5 0 0 0-5-5z" ' + ln + '/>',

    // ── Control flow ────────────────────────────────────────
    repeat:
      '<path d="M3.5 5.5H12a2.5 2.5 0 0 1 0 5H3" ' + ln + '/>' +
      '<polyline points="5.5,3 3.5,5.5 5.5,8" ' + ln + '/>' +
      '<polyline points="9.5,8 11.5,10.5 9.5,13" ' + ln + '/>',

    branch:
      '<line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M8 7l-4 3.5v2.5" ' + ln + '/>' +
      '<path d="M8 7l4 3.5v2.5" ' + ln + '/>',

    // ── Actions ─────────────────────────────────────────────
    trash:
      '<polyline points="2,4 14,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M6 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4" ' + ln + '/>' +
      '<path d="M3.5 4l1 9.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5L13 4" ' + ln + '/>',

    save:
      '<path d="M3 2h8.5L14 4.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" ' + ln + '/>' +
      '<rect x="5.5" y="9" width="5" height="5" rx="0.5" ' + ln + '/>' +
      '<rect x="5.5" y="2" width="4" height="3.5" rx="0.5" ' + ln + '/>',

    download:
      '<path d="M8 3v7.5" ' + ln + '/>' +
      '<path d="M5 8l3 3.5 3-3.5" ' + ln + '/>' +
      '<path d="M3 13.5h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    upload:
      '<path d="M8 11V3.5" ' + ln + '/>' +
      '<path d="M5 6l3-3.5 3 3.5" ' + ln + '/>' +
      '<path d="M3 13.5h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    folder:
      '<path d="M2 4.5a1 1 0 0 1 1-1h3.5l1.5 1.5H13a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5z" ' + ln + '/>',

    close:
      '<line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '<line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

    check:
      '<polyline points="2,8 6.5,12.5 14,4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',

    wrong:
      '<line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',

    edit:
      '<path d="M2.5 12.5l7.5-7.5 3 3-7.5 7.5H2.5v-3z" ' + ln + '/>' +
      '<path d="M10 5l1.5-1.5a1.5 1.5 0 0 1 2.1 2.1L12 7" ' + ln + '/>',

    // ── Status & UI ─────────────────────────────────────────
    trophy:
      '<path d="M5 2h6v5a3 3 0 0 1-6 0V2z" ' + ln + '/>' +
      '<path d="M2 2h3M11 2h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M2 2c0 2.5 1 4 3 4M14 2c0 2.5-1 4-3 4" ' + ln + '/>' +
      '<line x1="8" y1="10" x2="8" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M5.5 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    hint:
      '<circle cx="8" cy="7" r="4.5" ' + ln + '/>' +
      '<path d="M6 5.5a2 2 0 0 1 4 .5c0 1.5-2 2-2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>' +
      '<circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>',

    warning:
      '<path d="M8 2L14.5 13.5H1.5L8 2z" ' + ln + '/>' +
      '<line x1="8" y1="6.5" x2="8" y2="9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>',

    celebrate:
      '<path d="M3.5 12.5L6 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M3.5 12.5l2-0.5M3.5 12.5l0.5-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<circle cx="9" cy="4.5" r="1.2" fill="currentColor"/>' +
      '<circle cx="5.5" cy="9.5" r="1" fill="currentColor"/>' +
      '<path d="M10.5 7l1.5 1M12.5 9l-1.5-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M8.5 2l0.5 1.5M11 3l-0.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',

    // ── App chrome ──────────────────────────────────────────
    blocks:
      '<rect x="2" y="2" width="5.5" height="5.5" rx="1" ' + ln + '/>' +
      '<rect x="8.5" y="2" width="5.5" height="5.5" rx="1" ' + ln + '/>' +
      '<rect x="2" y="8.5" width="5.5" height="5.5" rx="1" ' + ln + '/>' +
      '<rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" ' + ln + '/>',

    code:
      '<polyline points="5,4.5 1.5,8 5,11.5" ' + ln + '/>' +
      '<polyline points="11,4.5 14.5,8 11,11.5" ' + ln + '/>' +
      '<line x1="9.5" y1="3" x2="6.5" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    book:
      '<path d="M3 2h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3" ' + ln + '/>' +
      '<path d="M3 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8" ' + ln + '/>' +
      '<line x1="7" y1="6" x2="9.5" y2="6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="7" y1="8.5" x2="9.5" y2="8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    search:
      '<circle cx="6.5" cy="6.5" r="4.5" ' + ln + '/>' +
      '<line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

    drag:
      '<line x1="4" y1="5" x2="12" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="4" y1="11" x2="12" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    pointer:
      '<path d="M4.5 2.5l8 7-4.5 0.5-1.5 5z" ' + ln + '/>',

    // ── Block-specific ───────────────────────────────────────
    say:
      '<path d="M3 3h10a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H8.5l-3 3V10.5H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" ' + ln + '/>',

    print:
      '<rect x="3" y="7" width="10" height="6" rx="1" ' + ln + '/>' +
      '<path d="M5.5 7V3.5h5V7" ' + ln + '/>' +
      '<line x1="5.5" y1="10" x2="10.5" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    instrument:
      '<circle cx="5" cy="11.5" r="2" ' + ln + '/>' +
      '<circle cx="11" cy="8.5" r="2" ' + ln + '/>' +
      '<line x1="7" y1="11.5" x2="7" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="13" y1="8.5" x2="13" y2="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="7" y1="3" x2="13" y2="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    tempo:
      '<circle cx="8" cy="9" r="6" ' + ln + '/>' +
      '<path d="M8 6v3.5l2 2" ' + ln + '/>',

    wait:
      '<path d="M5 2h6M5 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M5.5 2.5L10.5 7.5a1 1 0 0 1 0 1L5.5 13.5" ' + ln + '/>' +
      '<path d="M10.5 2.5L5.5 7.5a1 1 0 0 0 0 1L10.5 13.5" ' + ln + '/>',

    // ── CT Concepts (level icons) ────────────────────────────
    algorithm:
      '<line x1="3" y1="4.5" x2="13" y2="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="3" y1="8" x2="10" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="3" y1="11.5" x2="7" y2="11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    variable:
      '<rect x="2" y="4" width="12" height="9" rx="1.5" ' + ln + '/>' +
      '<path d="M2 7h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    loop:
      '<path d="M3 8a5 5 0 1 1 5 5" ' + ln + '/>' +
      '<polyline points="3,8 1,5 5.5,5" ' + ln + '/>',

    binary:
      '<text x="1.5" y="12" font-family="monospace" font-size="11" font-weight="800" fill="currentColor">01</text>',

    debug:
      '<ellipse cx="8" cy="9" rx="3.5" ry="4" ' + ln + '/>' +
      '<path d="M8 5V3.5M6 5a2 2 0 0 1 4 0" ' + ln + '/>' +
      '<line x1="4.5" y1="8" x2="11.5" y2="8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="2.5" y1="7" x2="4.5" y2="8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="13.5" y1="7" x2="11.5" y2="8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="2.5" y1="11" x2="4.5" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="13.5" y1="11" x2="11.5" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    compose:
      '<rect x="2" y="3" width="12" height="10" rx="1.5" ' + ln + '/>' +
      '<line x1="5" y1="7" x2="5" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="8" y1="5.5" x2="8" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="11" y1="7" x2="11" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',

    score:
      '<path d="M3 2h10v12H3z" ' + ln + '/>' +
      '<line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="5.5" y1="7.5" x2="10.5" y2="7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
      '<line x1="5.5" y1="9.5" x2="8" y2="9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    guitar:
      '<path d="M10 3a3.5 3.5 0 0 1 3 3.5C13 8.5 11 10 9 10c-.5 0-1 0-1.5-.2L5 13a1.5 1.5 0 0 1-2-2l3.2-2.5C6 8 6 7.5 6 7a4 4 0 0 1 4-4z" ' + ln + '/>' +
      '<circle cx="7.5" cy="8.5" r="1" fill="currentColor" stroke="none"/>',

    piano:
      '<rect x="2" y="3" width="12" height="10" rx="1" ' + ln + '/>' +
      '<rect x="5" y="3" width="2" height="6" rx="0.5" fill="currentColor" stroke="none"/>' +
      '<rect x="9" y="3" width="2" height="6" rx="0.5" fill="currentColor" stroke="none"/>',

  };

  var paths = shapes[name];
  if (!paths) {
    // Fallback: question mark circle
    paths = '<circle cx="8" cy="8" r="6" ' + ln + '/>' +
            '<path d="M6.5 6.5a1.5 1.5 0 0 1 3 .5c0 1-1.5 1.5-1.5 2.5" ' + ln + '/>' +
            '<circle cx="8" cy="12" r="0.8" fill="currentColor"/>';
  }

  return '<svg ' + a + '>' + paths + '</svg>';
}
