/* ── QUANTUM CHAIN — Info Page JS ── */

// ── BLOCH SPHERE ──
let bTheta = Math.PI / 4, bPhi = 0, bAnim;

function drawBloch() {
  const cv = document.getElementById('bloch'), ctx = cv.getContext('2d');
  const cx = 100, cy = 100, r = 82;
  ctx.clearRect(0, 0, 200, 200);
  const gr = ctx.createRadialGradient(cx - 18, cy - 18, 8, cx, cy, r);
  gr.addColorStop(0, 'rgba(0,245,255,.07)'); gr.addColorStop(1, 'rgba(0,0,40,.55)');
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
  ctx.strokeStyle = 'rgba(0,245,255,.18)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .33, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,245,255,.12)'; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = .7;
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.fillStyle = 'rgba(0,245,255,.7)'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('|0⟩', cx, cy - r - 6); ctx.fillText('|1⟩', cx, cy + r + 14);
  const sx = Math.sin(bTheta) * Math.cos(bPhi) * r;
  const sy = -Math.cos(bTheta) * r;
  const sz = Math.sin(bTheta) * Math.sin(bPhi) * r * .33;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + sx, cy + sy + sz * .3);
  const vg = ctx.createLinearGradient(cx, cy, cx + sx, cy + sy);
  vg.addColorStop(0, 'rgba(155,89,182,.7)'); vg.addColorStop(1, 'rgba(0,245,255,1)');
  ctx.strokeStyle = vg; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + sx, cy + sy + sz * .3, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#00f5ff'; ctx.fill();
  const a = Math.cos(bTheta / 2), b2 = Math.sin(bTheta / 2);
  document.getElementById('ma').style.width = (a ** 2 * 100) + '%';
  document.getElementById('mb').style.width = (b2 ** 2 * 100) + '%';
  document.getElementById('va').textContent = a.toFixed(4);
  document.getElementById('vb').textContent = b2.toFixed(4);
}

function animBloch() { bPhi += .014; drawBloch(); bAnim = requestAnimationFrame(animBloch); }
animBloch();

function applyH() {
  cancelAnimationFrame(bAnim);
  bTheta = Math.abs(bTheta - Math.PI / 2) < .1 ? 0 : Math.PI / 2;
  document.getElementById('qres').style.display = 'none';
  drawBloch(); setTimeout(animBloch, 80);
}
function mQubit() {
  cancelAnimationFrame(bAnim);
  const p0 = Math.cos(bTheta / 2) ** 2, res = Math.random() < p0 ? 0 : 1;
  bTheta = res === 0 ? 0 : Math.PI; bPhi = 0; drawBloch();
  const el = document.getElementById('qres'); el.style.display = 'block';
  el.innerHTML = `Medição: <span style="color:${res === 0 ? 'var(--q)' : 'var(--b)'}">${res === 0 ? '|0⟩ (0)' : '|1⟩ (1)'}</span> — qubit colapsado`;
  setTimeout(() => { bTheta = Math.PI / 4; animBloch(); el.style.display = 'none'; }, 2500);
}
function bellState() {
  const el = document.getElementById('qres'); el.style.display = 'block';
  const r = Math.random() < .5 ? '|00⟩' : '|11⟩';
  el.innerHTML = `Bell: (1/√2)(|00⟩+|11⟩) → Medir A: <span style="color:var(--q)">${r}</span> → B colapsa: <span style="color:var(--b)">${r}</span> (instante)`;
  setTimeout(() => el.style.display = 'none', 4000);
}

// ── QRNG ──
function qrng(n) {
  const bits = Array.from({ length: n }, () => Math.round(Math.random())).join('');
  document.getElementById('qout').textContent = bits;
  let hex = '';
  for (let i = 0; i < bits.length; i += 4)
    hex += (parseInt(bits.slice(i, i + 4) || '0000', 2)).toString(16).toUpperCase();
  document.getElementById('qhex').textContent = `0x${hex}`;
  const ct = document.getElementById('qbits'); ct.innerHTML = '';
  bits.slice(0, 32).forEach(b => {
    const el = document.createElement('div'); el.className = `qbit q${b}`; el.textContent = b; ct.appendChild(el);
  });
  if (n > 32) {
    const m = document.createElement('div');
    m.style.cssText = 'font-size:.68rem;color:var(--txt2);align-self:center';
    m.textContent = `+${n - 32}`; ct.appendChild(m);
  }
}

// ── TRANSMISSION TABS ──
const txAnims = {};
function swTx(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on')); btn.classList.add('on');
  document.querySelectorAll('.tcontent').forEach(c => c.classList.remove('on'));
  document.getElementById('tc-' + id).classList.add('on');
  setTimeout(() => startTxAnim(id), 30);
}
function startTxAnim(type) {
  Object.values(txAnims).forEach(a => cancelAnimationFrame(a));
  const cv = document.getElementById('tx-' + type); if (!cv) return;
  cv.width = cv.offsetWidth;
  const ctx = cv.getContext('2d'); let t = 0;
  const w = () => cv.width, h = cv.height;

  function fiber() {
    ctx.fillStyle = '#050515'; ctx.fillRect(0, 0, w(), h);
    ctx.fillStyle = '#0a0a25'; ctx.fillRect(0, h / 2 - 18, w(), 36);
    ctx.strokeStyle = 'rgba(0,245,255,.2)'; ctx.lineWidth = .8; ctx.strokeRect(0, h / 2 - 18, w(), 36);
    ctx.fillStyle = 'rgba(0,245,255,.5)'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText('Núcleo SiO₂ (9μm) λ=1550nm', 8, h / 2 - 24);
    for (let i = 0; i < 5; i++) {
      const x = ((t * 2.2 + i * 90) % w());
      ctx.beginPath(); ctx.arc(x, h / 2, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,.9)'; ctx.shadowBlur = 12; ctx.shadowColor = '#00f5ff';
      ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(0,245,255,.7)'; ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left'; ctx.fillText('⚛ QC', 6, h / 2 + 4);
    ctx.textAlign = 'right'; ctx.fillText('⛓ BC', w() - 6, h / 2 + 4);
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
    ctx.fillText('~200.000 km/s · QKD BB84 · QBER < 11%', w() / 2, h - 8);
    t++; txAnims[type] = requestAnimationFrame(fiber);
  }

  function qkdDraw() {
    ctx.fillStyle = '#050515'; ctx.fillRect(0, 0, w(), h);
    const pw = 65, bw = w();
    ctx.fillStyle = 'rgba(0,245,255,.12)'; ctx.fillRect(4, h / 2 - 35, pw, 70);
    ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 1; ctx.strokeRect(4, h / 2 - 35, pw, 70);
    ctx.fillStyle = '#00f5ff'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ALICE', 4 + pw / 2, h / 2 - 18);
    ctx.fillText('🏦', 4 + pw / 2, h / 2 + 4);
    ctx.fillText('(Banco A)', 4 + pw / 2, h / 2 + 20);
    ctx.fillStyle = 'rgba(155,89,182,.12)'; ctx.fillRect(bw - pw - 4, h / 2 - 35, pw, 70);
    ctx.strokeStyle = '#9b59b6'; ctx.strokeRect(bw - pw - 4, h / 2 - 35, pw, 70);
    ctx.fillStyle = '#9b59b6';
    ctx.fillText('BOB', bw - pw / 2 - 4, h / 2 - 18);
    ctx.fillText('🏦', bw - pw / 2 - 4, h / 2 + 4);
    ctx.fillText('(Banco B)', bw - pw / 2 - 4, h / 2 + 20);
    const pols = ['↑', '→', '↗', '↘'];
    for (let i = 0; i < 4; i++) {
      const x = pw + 10 + ((t * 1.6 + i * 62) % (bw - 2 * pw - 20));
      const y = h / 2 + (Math.sin(t * .05 + i) * 7);
      ctx.font = '14px sans-serif'; ctx.fillStyle = `hsl(${(t * 2 + i * 55) % 360},100%,75%)`;
      ctx.textAlign = 'center'; ctx.fillText(pols[(Math.floor(t * .07) + i) % 4], x, y);
    }
    if (Math.floor(t / 90) % 10 === 0) {
      ctx.fillStyle = 'rgba(231,76,60,.75)'; ctx.font = '10px monospace';
      ctx.textAlign = 'center'; ctx.fillText('⚠ Eve detectada! QBER > 11% → abortar', bw / 2, 22);
    }
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '9px monospace';
    ctx.textAlign = 'center'; ctx.fillText('BB84 · 4 polarizações · Canal quântico autenticado', bw / 2, h - 8);
    t++; txAnims[type] = requestAnimationFrame(qkdDraw);
  }

  function satelliteDraw() {
    ctx.fillStyle = '#050515'; ctx.fillRect(0, 0, w(), h);
    for (let i = 0; i < 35; i++) {
      const sx = (i * 139) % w(), sy = (i * 71) % (h * .6);
      ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${.25 + Math.sin(t * .05 + i) * .15})`; ctx.fill();
    }
    const bw = w();
    ctx.fillStyle = 'rgba(0,245,255,.12)'; ctx.fillRect(4, h - 55, 72, 48);
    ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 1; ctx.strokeRect(4, h - 55, 72, 48);
    ctx.fillStyle = '#00f5ff'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🏦 Beijing', 40, h - 35); ctx.fillText('(Alice)', 40, h - 20);
    ctx.fillStyle = 'rgba(0,245,255,.12)'; ctx.fillRect(bw - 76, h - 55, 72, 48);
    ctx.strokeRect(bw - 76, h - 55, 72, 48);
    ctx.fillStyle = '#9b59b6'; ctx.fillText('🏦 Viena', bw - 40, h - 35); ctx.fillText('(Bob)', bw - 40, h - 20);
    const sx2 = bw / 2 + Math.sin(t * .007) * 25, sy2 = 50 + Math.cos(t * .007) * 8;
    ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🛰', sx2, sy2);
    ctx.fillStyle = 'rgba(155,89,182,.7)'; ctx.font = '8px monospace';
    ctx.fillText('Micius LEO ~500km', sx2, sy2 + 18);
    const pr = (t % 200) / 200;
    if (t % 400 < 200) {
      ctx.beginPath(); ctx.moveTo(40, h - 55); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = `rgba(0,245,255,${.75 - pr * .5})`; ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      const px = 40 + (sx2 - 40) * pr, py = (h - 55) + (sy2 - (h - 55)) * pr;
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,.9)'; ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(bw - 40, h - 55);
      ctx.strokeStyle = `rgba(155,89,182,${.75 - pr * .5})`; ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      const px = sx2 + (bw - 40 - sx2) * pr, py = sy2 + (h - 55 - sy2) * pr;
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(155,89,182,.9)'; ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '9px monospace';
    ctx.textAlign = 'center'; ctx.fillText('QKD via Satélite · 7.600 km · Micius 2017 (Beijing↔Viena)', bw / 2, h - 5);
    t++; txAnims[type] = requestAnimationFrame(satelliteDraw);
  }

  function pqcDraw() {
    ctx.fillStyle = '#050515'; ctx.fillRect(0, 0, w(), h); const bw = w();
    const layers = [
      { y: h * .2, l: 'Aplicação: gRPC / HTTPS', c: 'rgba(243,156,18,.55)' },
      { y: h * .38, l: 'TLS 1.3: Kyber-1024 + X25519 Hybrid', c: 'rgba(0,245,255,.55)' },
      { y: h * .56, l: 'TCP/IP — Rede', c: 'rgba(155,89,182,.55)' },
      { y: h * .74, l: 'Fibra Óptica — Física', c: 'rgba(46,204,113,.55)' },
    ];
    layers.forEach(lyr => {
      ctx.strokeStyle = lyr.c; ctx.lineWidth = .8; ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.moveTo(70, lyr.y); ctx.lineTo(bw - 70, lyr.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = lyr.c; ctx.font = '9px monospace'; ctx.textAlign = 'left';
      ctx.fillText(lyr.l, 75, lyr.y - 4);
      const px = 75 + ((t * 2 + layers.indexOf(lyr) * 55) % (bw - 155));
      ctx.fillStyle = lyr.c.replace('.55)', '.95)'); ctx.fillRect(px, lyr.y - 3, 18, 6);
    });
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '9px monospace';
    ctx.textAlign = 'center'; ctx.fillText('TLS 1.3 Kyber Hybrid · Latência +2–5ms · >100 Gbps', bw / 2, h - 8);
    t++; txAnims[type] = requestAnimationFrame(pqcDraw);
  }

  function classicalDraw() {
    ctx.fillStyle = '#050515'; ctx.fillRect(0, 0, w(), h); const bw = w();
    ctx.fillStyle = 'rgba(243,156,18,.2)'; ctx.fillRect(0, h / 2 - 16, bw, 32);
    ctx.strokeStyle = 'rgba(243,156,18,.4)'; ctx.lineWidth = .8; ctx.strokeRect(0, h / 2 - 16, bw, 32);
    ctx.fillStyle = 'rgba(243,156,18,.5)'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText('TCP/IP · TLS 1.2 · RSA-2048 (⚠ vulnerável a Shor)', 8, h / 2 - 22);
    for (let i = 0; i < 6; i++) {
      const x = ((t * 2.5 + i * 75) % bw);
      ctx.fillStyle = `rgba(243,156,18,${.6 + Math.sin(t * .1 + i) * .3})`;
      ctx.fillRect(x, h / 2 - 6, 14, 12);
    }
    ctx.fillStyle = 'rgba(231,76,60,.6)'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('"Harvest now, decrypt later" — dados coletados hoje → decriptados com QCs futuros', bw / 2, h - 8);
    t++; txAnims[type] = requestAnimationFrame(classicalDraw);
  }

  const fns = { fiber, qkd: qkdDraw, satellite: satelliteDraw, pqc: pqcDraw, classical: classicalDraw };
  if (fns[type]) fns[type]();
}

startTxAnim('fiber');
window.addEventListener('resize', () => {
  ['fiber', 'qkd', 'satellite', 'pqc', 'classical'].forEach(t => {
    const c = document.getElementById('tx-' + t); if (c) c.width = c.offsetWidth;
  });
});
