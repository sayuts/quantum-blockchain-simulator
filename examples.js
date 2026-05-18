/* ── QUANTUM CHAIN — Examples Page JS ── */

// ── EXAMPLES TAB SWITCHER ──
function swEx(id, btn) {
  document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.ex-content').forEach(c => c.classList.remove('on'));
  document.getElementById('ex-' + id).classList.add('on');
}

// ── AZURE SPARSE — HISTOGRAM ANIMATION ──
(function () {
  const histograms = {
    'hist-no-noise': {
      bars: [48, 2, 3, 1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1,
             2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 47],
      colors: ['#00f5ff', '#9b59b6'],
    },
    'hist-noise-1': {
      bars: [43, 3, 4, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2,
             3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 40],
      colors: ['#00f5ff', '#9b59b6'],
    },
    'hist-noise-25': {
      bars: Array.from({ length: 32 }, () => Math.floor(Math.random() * 12) + 1),
      colors: ['#f39c12', '#e74c3c'],
    },
  };

  Object.entries(histograms).forEach(([id, cfg]) => {
    const container = document.getElementById(id);
    if (!container) return;
    const max = Math.max(...cfg.bars);
    cfg.bars.forEach((v, i) => {
      const bar = container.querySelector(`.hbar:nth-child(${i + 1})`);
      if (bar) {
        bar.style.height = (v / max * 100) + '%';
        bar.style.background = i < 2 || i >= cfg.bars.length - 2
          ? cfg.colors[0] : cfg.colors[1];
        bar.style.opacity = .7 + (v / max) * .3;
      }
    });
  });

  // Animate the noise-25 histogram to show randomness
  setInterval(() => {
    const container = document.getElementById('hist-noise-25');
    if (!container) return;
    const bars = container.querySelectorAll('.hbar');
    bars.forEach(bar => {
      const h = Math.floor(Math.random() * 70) + 10;
      bar.style.height = h + '%';
      bar.style.background = `hsl(${Math.random() * 60 + 10},80%,55%)`;
    });
  }, 1200);
})();

// ── SPARSE STATE VISUALIZER ──
(function () {
  const canvas = document.getElementById('sparse-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;

  const states = [
    { label: '|000⟩', amp: 0.7071, phase: 0 },
    { label: '|001⟩', amp: 0,      phase: 0 },
    { label: '|010⟩', amp: 0,      phase: 0 },
    { label: '|011⟩', amp: 0,      phase: 0 },
    { label: '|100⟩', amp: 0,      phase: 0 },
    { label: '|101⟩', amp: 0,      phase: 0 },
    { label: '|110⟩', amp: 0,      phase: 0 },
    { label: '|111⟩', amp: 0.7071, phase: Math.PI },
  ];

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#050515';
    ctx.fillRect(0, 0, W, H);

    const barW = (W - 40) / states.length;
    const maxH = H - 60;

    states.forEach((s, i) => {
      const x = 20 + i * barW;
      const bh = Math.abs(s.amp) * maxH * (.85 + Math.sin(t * .04 + i) * .05);
      const isNonZero = s.amp !== 0;
      const alpha = isNonZero ? 1 : .18;

      ctx.fillStyle = isNonZero
        ? `rgba(0,245,255,${alpha})`
        : `rgba(100,100,180,${alpha})`;
      ctx.fillRect(x + 2, H - 45 - bh, barW - 6, bh);

      if (isNonZero) {
        ctx.fillStyle = 'rgba(0,245,255,.15)';
        ctx.fillRect(x + 2, H - 45 - bh - 3, barW - 6, 3);
      }

      ctx.fillStyle = isNonZero ? '#00f5ff' : '#444468';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(s.label, x + barW / 2, H - 30);

      if (isNonZero) {
        ctx.fillStyle = '#aaf0ff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(s.amp.toFixed(3), x + barW / 2, H - 45 - bh - 8);
      }
    });

    // Legend
    ctx.fillStyle = 'rgba(0,245,255,.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Sparse: apenas 2/8 amplitudes ≠ 0 (Bell state |Φ⁺⟩)', 8, 14);
    ctx.fillStyle = 'rgba(100,100,180,.5)';
    ctx.fillText('● = zero (não armazenado no simulador esparso)', 8, 28);

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();
