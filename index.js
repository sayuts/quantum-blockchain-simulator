/* ── QUANTUM CHAIN — Simulator & Blockchain JS ── */

// ── CURRENCIES ──
const CUR = {
  USD: { s: '$',   n: 'Dólar Americano',   f: '🇺🇸', r: 1 },
  BRL: { s: 'R$',  n: 'Real Brasileiro',   f: '🇧🇷', r: 5.05 },
  EUR: { s: '€',   n: 'Euro',              f: '🇪🇺', r: 0.93 },
  CNY: { s: '¥',   n: 'Yuan Chinês',       f: '🇨🇳', r: 7.26 },
  GBP: { s: '£',   n: 'Libra Esterlina',   f: '🇬🇧', r: 0.79 },
  JPY: { s: '¥',   n: 'Iene Japonês',      f: '🇯🇵', r: 155.2 },
  CHF: { s: 'Fr',  n: 'Franco Suíço',      f: '🇨🇭', r: 0.91 },
  ARS: { s: '$',   n: 'Peso Argentino',    f: '🇦🇷', r: 875 },
  CAD: { s: 'C$',  n: 'Dólar Canadense',   f: '🇨🇦', r: 1.37 },
  AUD: { s: 'A$',  n: 'Dólar Australiano', f: '🇦🇺', r: 1.53 },
};
function toUSD(a, c) { return a / CUR[c].r; }
function fromUSD(u, c) { return u * CUR[c].r; }
function conv(a, f, t) { return fromUSD(toUSD(a, f), t); }
function fmt(v, c) {
  const cur = CUR[c];
  if (c === 'JPY' || c === 'ARS') return cur.s + ' ' + Math.round(v).toLocaleString('pt-BR');
  return cur.s + ' ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
let ratesLive = false;

function updConv() {
  const a = parseFloat(document.getElementById('s-amount').value) || 0;
  const f = document.getElementById('s-cur').value;
  const t = document.getElementById('s-rcur').value;
  const cv = conv(a, f, t);
  document.getElementById('cpf').textContent = fmt(a, f);
  document.getElementById('cpt').textContent = fmt(cv, t);
  const rate = CUR[t].r / CUR[f].r;
  const src = ratesLive
    ? `<span class="rate-live"><span class="rate-dot live"></span>cotação ao vivo</span>`
    : `<span class="rate-live"><span class="rate-dot static"></span>cotação simulada</span>`;
  document.getElementById('cpr').innerHTML =
    `Taxa: 1 ${f} = ${rate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${t} · ${src}`;
}
updConv();

// ── LIVE CURRENCY RATES ──
async function fetchRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return false;
    const data = await res.json();
    if (data.result !== 'success') return false;
    const r = data.rates;
    Object.keys(CUR).forEach(k => { if (r[k]) CUR[k].r = r[k]; });
    ratesLive = true;
    updConv();
    return true;
  } catch (_) { return false; }
}
fetchRates();
setInterval(fetchRates, 5 * 60 * 1000);

// ── TICKER ──
(function () {
  const items = [
    ['BRL/USD', '5,0521', '+0,12%', true],  ['EUR/USD', '0,9301', '-0,05%', false],
    ['CNY/USD', '7,2634', '+0,08%', true],  ['GBP/USD', '0,7912', '-0,03%', false],
    ['JPY/USD', '155,20', '+0,22%', true],  ['CHF/USD', '0,9102', '-0,01%', false],
    ['BTC/USD', '62.847', '+1,4%',  true],  ['ETH/USD', '3.241',  '+0,9%',  true],
    ['IBOVESPA', '128.451', '+0,34%', true], ['S&P500', '5.248', '-0,12%', false],
    ['QKD Market', 'USD 6,3B', 'CAGR 44%', true],
    ['NIST PQC', '2024', 'Kyber/Dilithium', true],
    ['Dilithium-3', 'PQC Sign', '2420 bytes', true],
    ['Kyber-1024', 'KEM', '1568 bytes', true],
    ['D-Wave Adv2', '4.400+ qubits', 'Zephyr', true],
    ['QUIP Network', 'Testnet', 'Abr 2026', true],
  ];
  const t = document.getElementById('ticker');
  const h = items.map(([l, v, c, u]) =>
    `<span class="ti"><span class="tl">${l}</span><span class="tv">${v}</span><span class="${u ? 'up' : 'dn'}">${c}</span></span>`
  ).join('');
  t.innerHTML = h + h;
})();

// ── HERO PARTICLES ──
(function () {
  const c = document.getElementById('hc'), ctx = c.getContext('2d');
  let ps = [];
  function resize() {
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    ps = Array.from({ length: Math.min(55, ~~(c.width * c.height / 7000)) }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.4 + .4, a: Math.random() * .45 + .12
    }));
  }
  window.addEventListener('resize', resize); resize();
  function isLight() { return document.documentElement.getAttribute('data-theme') === 'light'; }
  function fr() {
    const light = isLight();
    ctx.fillStyle = light ? 'rgba(240,244,255,.14)' : 'rgba(5,5,15,.18)';
    ctx.fillRect(0, 0, c.width, c.height);
    const pColor = light ? '0,100,160' : '0,245,255';
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > c.width) p.vx *= -1;
      if (p.y < 0 || p.y > c.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pColor},${p.a})`; ctx.fill();
    });
    ps.forEach((p, i) => {
      for (let j = i + 1; j < ps.length; j++) {
        const q = ps[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 95) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${pColor},${.11 * (1 - d / 95)})`; ctx.lineWidth = .4; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(fr);
  }
  fr();
})();

// ── METHOD SELECTOR ──
function selMethod(el) {
  document.querySelectorAll('.mopt').forEach(m => m.classList.remove('on'));
  el.classList.add('on');
}

// ── SIMULATION ──
let simRunning = false;
const METH = {
  qkd:       'QKD · Fibra Óptica Quântica',
  satellite: 'Satélite Quântico LEO (Micius)',
  pqc:       'TLS 1.3 · Kyber-1024 Hybrid',
  classical: 'Fibra Clássica · TLS 1.2',
};
const CRYP = {
  dilithium: 'Dilithium-3 (NIST PQC 2024)',
  kyber:     'Kyber-1024 (NIST PQC 2024)',
  ecdsa:     'ECDSA secp256k1',
  rsa:       'RSA-2048',
};
const CWARN = {
  ecdsa: '⚠ ECDSA secp256k1 é vulnerável ao Algoritmo de Shor em QCs com qubits suficientes.',
  rsa:   '❌ RSA-2048 é quebrável por Shor em O(log³n) — NÃO recomendado para futuro quântico.',
};
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function fh() { return Array.from({ length: 64 }, () => rnd(0, 15).toString(16)).join(''); }
function qb(n) { return Array.from({ length: n }, () => rnd(0, 1)).join(''); }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function addLog(ic, tt, dt, cls) {
  const b = document.getElementById('lbody');
  const e = document.createElement('div');
  e.className = 'le ' + cls;
  e.innerHTML = `<div class="li">${ic}</div><div><div class="lt2">${tt}</div>${dt ? `<div class="ld2">${dt}</div>` : ''}</div>`;
  b.appendChild(e); b.scrollTop = b.scrollHeight;
}
function setProg(p) { document.getElementById('pfill').style.width = p + '%'; }
function setStat(s) { document.getElementById('lstat').textContent = s; }

async function runSim() {
  if (simRunning) return;
  simRunning = true;
  document.getElementById('bstart').disabled = true;
  document.getElementById('rcard').classList.remove('show');
  document.getElementById('lbody').innerHTML = '';
  setProg(0); setStat('⚡ Processando...');

  const sender   = document.getElementById('s-sender').value;
  const receiver = document.getElementById('s-receiver').value;
  const amount   = parseFloat(document.getElementById('s-amount').value) || 1e6;
  const fc       = document.getElementById('s-cur').value;
  const tc       = document.getElementById('s-rcur').value;
  const method   = document.querySelector('input[name="met"]:checked').value;
  const cry      = document.getElementById('s-cry').value;
  const cvAmt    = conv(amount, fc, tc);
  const usdAmt   = toUSD(amount, fc);
  const txId     = 'TXQ-' + Date.now().toString(36).toUpperCase();
  const rate     = CUR[tc].r / CUR[fc].r;

  const steps = [
    async () => {
      addLog('⚛', 'Inicializando Computador Quântico',
        `Sistema: NISQ Gate-based Superconductor · <span class="hq">127 qubits ativos</span><br>Temperatura: <span class="hq">15 mK</span> (-273,135°C) · Estado: OPERACIONAL<br>TX-ID: <span class="hb">${txId}</span>`, 'le-q');
      setProg(7); await delay(900);
    },
    async () => {
      const bits = qb(256); let hex = '';
      for (let i = 0; i < 256; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16).toUpperCase();
      addLog('🎲', 'QRNG — Entropia Quântica (256 bits)',
        `Porta H|0⟩ → superposição → colapso = bit aleatório verdadeiro<br>Bits: <span class="hq">${bits.slice(0, 50)}...</span><br>Hex: <span class="hb">0x${hex.slice(0, 20)}...</span>`, 'le-q');
      setProg(16); await delay(950);
    },
    async () => {
      const prv = fh(), pub = fh();
      addLog('🔑', `Par de Chaves — ${CRYP[cry]}`,
        `Chave Privada: <span class="hr">${prv.slice(0, 24)}... [CONFIDENCIAL]</span><br>Chave Pública: <span class="hq">${pub.slice(0, 40)}...</span><br>Base matemática: ${cry === 'dilithium' ? 'Module-LWE (lattice)' : cry === 'kyber' ? 'Module-LWE / KEM' : cry === 'ecdsa' ? 'Logaritmo Discreto em CE' : 'Fatoração de inteiros'}`, 'le-q');
      if (CWARN[cry]) { await delay(400); addLog('⚠', 'Aviso de Segurança Quântica', `<span class="ho">${CWARN[cry]}</span>`, 'le-warn'); }
      setProg(26); await delay(1000);
    },
    async () => {
      addLog('📝', 'Payload da Transação Construído',
        `Remetente: <span class="hq">${sender}</span><br>Destinatário: <span class="hb">${receiver}</span><br>Envio: <span class="hg">${fmt(amount, fc)}</span> · Recebimento: <span class="hg">${fmt(cvAmt, tc)}</span><br>Equiv. USD: <span class="ho">USD ${usdAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>`, 'le-q');
      setProg(33); await delay(800);
    },
    async () => {
      const txH = fh(), sig = fh().slice(0, 48);
      addLog('✍', 'Assinatura Digital Aplicada',
        `Hash payload: <span class="hq">0x${txH.slice(0, 32)}...</span><br>Assinatura ${CRYP[cry]}: <span class="hb">${sig}...</span><br>Tamanho: ${cry === 'dilithium' ? '2.420' : '~72'} bytes`, 'le-q');
      setProg(41); await delay(1000);
    },
    async () => {
      if (method === 'qkd') {
        addLog('🔬', 'Canal QKD Estabelecido (BB84)',
          `Protocolo: BB84 · <span class="hq">4 polarizações quânticas</span> (↑ → ↗ ↘)<br>QBER: <span class="hg">3,2%</span> (< 11% = canal SEGURO) · Espião: <span class="hg">não detectado</span><br>Chave OTP: <span class="hq">${fh().slice(0, 32)}...</span>`, 'le-t');
      } else if (method === 'satellite') {
        addLog('🛰', 'Satélite Quântico Alinhado',
          `Micius LEO-500km · Janela: <span class="hg">4min 32s</span><br>QBER: <span class="hg">4,1%</span> · Entrelaçamento: <span class="hg">✓ distribuído</span>`, 'le-t');
      } else if (method === 'pqc') {
        addLog('🔒', 'TLS 1.3 Híbrido Negociado',
          `Kyber-1024 + X25519 KeyShare · AES-256-GCM<br>Handshake: <span class="hg">42ms</span> · Forward Secrecy: <span class="hg">✓</span> · PQC: <span class="hg">✓</span>`, 'le-t');
      } else {
        addLog('🔌', 'TLS 1.2 Clássico',
          `RSA-2048 + AES-128-GCM · <span class="ho">⚠ Sem proteção quântica</span><br>Latência: <span class="hg">11ms</span>`, 'le-t');
      }
      setProg(51); await delay(1100);
    },
    async () => {
      const info = {
        qkd:       `Fibra monomodo λ=1550nm · ${rnd(200, 580)} km · BB84`,
        satellite: `LEO 500km + ${rnd(100, 600)} km terrestre`,
        pqc:       `TCP/IP · ${rnd(8, 45)}ms · ${rnd(3, 8)} hops BGP`,
        classical: `TCP/IP · ${rnd(6, 30)}ms · ${rnd(3, 10)} hops`,
      };
      addLog('🌐', `Transmitindo via ${METH[method]}`,
        `${info[method]}<br>Payload cifrado: <span class="hq">${fh().slice(0, 32)}...</span><br>HMAC-SHA256: <span class="hg">✓ íntegro</span>`, 'le-t');
      setProg(62); await delay(1200);
    },
    async () => {
      addLog('📥', 'Recebido pelo Nó Validador',
        `IP: 10.${rnd(1, 254)}.${rnd(1, 254)}.${rnd(1, 254)} · Latência total: <span class="hg">${rnd(12, 80)}ms</span><br>Pacote íntegro: <span class="hg">✓</span> · Mempool: <span class="ho">247 txs pendentes</span>`, 'le-s');
      setProg(70); await delay(800);
    },
    async () => {
      addLog('🔍', 'Verificação e Validação',
        `Assinatura ${CRYP[cry]}: <span class="hg">✓ VÁLIDA</span><br>Double-spend: <span class="hg">✓ não detectado</span> · KYC/AML: <span class="hg">✓ aprovado</span><br>Smart contract: <span class="hg">✓ condições satisfeitas</span>`, 'le-s');
      setProg(78); await delay(950);
    },
    async () => {
      addLog('💱', 'Conversão Cambial Processada',
        `Enviado: <span class="hq">${fmt(amount, fc)}</span> (${fc})<br>Taxa: <span class="ho">1 ${fc} = ${rate.toLocaleString('pt-BR', { minimumFractionDigits: 4 })} ${tc}</span><br>Creditado: <span class="hg">${fmt(cvAmt, tc)}</span> (${tc}) · USD equiv: <span class="hb">$${usdAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>`, 'le-s');
      setProg(85); await delay(900);
    },
    async () => {
      addLog('📡', 'Propagado via P2P (libp2p gossip)',
        `Peers: <span class="hq">${rnd(14, 28)} nós</span> · Confirmações: <span class="hg">1/6 → 3/6 → 6/6</span><br>TX incluída no próximo bloco: <span class="hg">✓</span>`, 'le-s');
      setProg(91); await delay(900);
    },
    async () => {
      const bh = fh(), mr = fh(), bn = (21847000 + rnd(0, 2000)).toLocaleString('pt-BR');
      const fin = (method === 'qkd' || method === 'satellite') ? '~3,6s (PoR-Lite)' : '~12s (PoS Ethereum)';
      addLog('⛓', `Bloco #${bn} Finalizado na Blockchain`,
        `Merkle Root: <span class="hb">${mr.slice(0, 32)}...</span><br>H(Bloco) = SHA256(dados||hash_ant||<span class="ho">${rnd(10000, 99999)}</span>||ts) = <span class="hq">${bh.slice(0, 36)}...</span><br>Finalidade: <span class="hg">${fin}</span> · Confirmações: <span class="hg">6/6</span>`, 'le-b');
      await delay(700);
      addLog('✅', 'TRANSAÇÃO CONFIRMADA — Imutável na Blockchain',
        `Bloco: <span class="hq">#${bn}</span> · Hash: <span class="hq">${bh}</span>`, 'le-ok');
      setProg(100); setStat('✅ Confirmada!');

      const rc = document.getElementById('rcard');
      rc.classList.add('show');
      document.getElementById('ramts').innerHTML = `
        <div class="ra">
          <div class="rab">${CUR[fc].f} ${sender.split('(')[0].trim()}</div>
          <div class="raa" style="color:var(--q)">${fmt(amount, fc)}</div>
          <div class="rau">≈ USD ${usdAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="rar">⚡</div>
        <div class="ra">
          <div class="rab">${CUR[tc].f} ${receiver.split('(')[0].trim()}</div>
          <div class="raa" style="color:var(--g)">${fmt(cvAmt, tc)}</div>
          <div class="rau">≈ USD ${usdAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>`;
      document.getElementById('rdet').innerHTML =
        `Bloco <strong>#${bn}</strong> · Via <strong>${METH[method]}</strong> · Assinado: <strong>${CRYP[cry]}</strong><br>Conversão: ${fc}→${tc} · Taxa: ${rate.toLocaleString('pt-BR', { minimumFractionDigits: 4 })} · Hash: <code style="color:var(--q)">${bh.slice(0, 24)}...</code>`;

      const data = `${sender.slice(0, 9)}→${receiver.slice(0, 9)}: ${fmt(cvAmt, tc)}`;
      const prev = blockchain.length ? blockchain[blockchain.length - 1].hash : '0'.repeat(64);
      blockchain.push(mkBlk(data, prev));
      renderChain();
      document.getElementById('crow').scrollLeft = 99999;
    },
  ];

  for (const s of steps) await s();
  simRunning = false;
  document.getElementById('bstart').disabled = false;
}

function resetLog() {
  if (simRunning) return;
  document.getElementById('lbody').innerHTML = '<div class="lempty">Configure os parâmetros e clique em <strong>Enviar Transação</strong>.</div>';
  document.getElementById('rcard').classList.remove('show');
  setProg(0); setStat('⏳ Aguardando...');
}

// ── BLOCKCHAIN ──
let blockchain = [], bidx = 0;
function sh(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
function mkH(d, p, n, t) {
  let o = '';
  for (let i = 0; i < 8; i++) o += sh(d + p + n + t + i);
  return o;
}
function mkBlk(data, prev) {
  const ts = Date.now(), nc = rnd(0, 999999), h = mkH(data, prev || '0'.repeat(64), nc, ts);
  const bks = ['BB', 'ITU', 'BRA', 'CEF', 'NUB', 'BTG', 'JPM', 'GS', 'ECB', 'BoE', 'BCB', 'DB', 'HSBC', 'DBS'];
  const txs = Array.from({ length: rnd(2, 5) }, () => ({
    from: bks[rnd(0, bks.length - 1)], to: bks[rnd(0, bks.length - 1)],
    amt: (Math.random() * 1e7).toFixed(0), id: Math.random().toString(36).slice(2, 10),
  }));
  return { idx: bidx++, data, prev: prev || '0'.repeat(64), nc, ts, hash: h, txs };
}
function renderChain() {
  const row = document.getElementById('crow'); row.innerHTML = '';
  blockchain.forEach((b, i) => {
    if (i > 0) { const l = document.createElement('div'); l.className = 'clink'; l.textContent = '⟵'; row.appendChild(l); }
    const inv = b.hash.startsWith('XXXX');
    const d = document.createElement('div');
    d.className = 'blk' + (i === 0 ? ' gen' : '') + (inv ? ' inv' : '');
    d.id = 'bl-' + b.idx; d.onclick = () => selBlk(b);
    d.innerHTML = `<div class="bkh"><span>${i === 0 ? 'GENESIS' : 'Blk #' + b.idx}</span><span>${b.txs.length}tx</span></div>
    <div class="bkb">
      <div class="bf2"><div class="bfl">Hash</div><div class="bfv ${inv ? 'ih' : 'qh'}">${b.hash.slice(0, 17)}...</div></div>
      <div class="bf2"><div class="bfl">Anterior</div><div class="bfv">${b.prev.slice(0, 13)}...</div></div>
      <div class="bf2"><div class="bfl">Nonce</div><div class="bfv">${b.nc}</div></div>
      <div class="bf2"><div class="bfl">Timestamp</div><div class="bfv">${new Date(b.ts).toISOString().slice(11, 22)}</div></div>
    </div>`;
    row.appendChild(d);
  });
}
function selBlk(b) {
  document.querySelectorAll('.blk').forEach(el => el.classList.remove('sel'));
  document.getElementById('bl-' + b.idx)?.classList.add('sel');
  const inv = b.hash.startsWith('XXXX');
  document.getElementById('hform').innerHTML =
    `H(Blk #${b.idx}) = SHA256("<span style="color:var(--o)">${b.data.slice(0, 28)}...</span>" || "${b.prev.slice(0, 14)}..." || <span style="color:var(--o)">${b.nc}</span> || ${b.ts})<br>= <span style="color:${inv ? 'var(--r)' : 'var(--q)'}">${b.hash}</span>${inv ? '<br><span style="color:var(--r)">⚠ HASH INVÁLIDO — adulteração detectada! Rede rejeita automaticamente.</span>' : ''}`;
  const dp = document.getElementById('bdp-body');
  dp.innerHTML = `
    <div class="bdf"><div class="bdl">Hash do Bloco</div><div class="bdv ${inv ? 'iv' : 'qv'}">${b.hash}</div></div>
    <div class="bdf"><div class="bdl">Hash Anterior</div><div class="bdv">${b.prev}</div></div>
    <div class="bdf"><div class="bdl">Dados</div><div class="bdv">${b.data}</div></div>
    <div class="bdf"><div class="bdl">Nonce / Timestamp</div><div class="bdv">${b.nc} / ${new Date(b.ts).toISOString()}</div></div>
    <div class="bdf"><div class="bdl">Merkle Root</div><div class="bdv bv">${mkH(b.txs.map(t => t.id).join(''), b.hash, 0, 0).slice(0, 32)}...</div></div>
    <div class="dvd" style="margin:.7rem 0"></div>
    <div style="font-size:.78rem;font-weight:600;color:var(--b);margin-bottom:.5rem">🌳 Merkle Tree (${b.txs.length} TXs)</div>
    <div class="mt" id="mtree"></div>`;
  renderMT(b.txs);
}
function renderMT(txs) {
  const t = document.getElementById('mtree'); if (!t) return; t.innerHTML = '';
  const l0 = document.createElement('div'); l0.className = 'ml2';
  txs.forEach(tx => {
    const n = document.createElement('div'); n.className = 'mn3 tx';
    n.textContent = tx.id; n.title = `${tx.from}→${tx.to}: $${Number(tx.amt).toLocaleString()}`;
    l0.appendChild(n);
  });
  t.appendChild(l0);
  let cur = txs.map(x => x.id);
  while (cur.length > 1) {
    const nxt = [], lv = document.createElement('div'); lv.className = 'ml2';
    for (let i = 0; i < cur.length; i += 2) {
      const h = sh(cur[i] + (cur[i + 1] || cur[i])); nxt.push(h);
      const n = document.createElement('div');
      n.className = 'mn3' + (nxt.length === 1 && cur.length <= 2 ? ' root' : '');
      n.textContent = h.slice(0, 8); lv.appendChild(n);
    }
    t.insertBefore(lv, t.firstChild); cur = nxt;
  }
}
function addBlk() {
  const data = 'TX:' + Date.now().toString(36).toUpperCase() + ':$' + rnd(1e5, 9e7);
  blockchain.push(mkBlk(data, blockchain[blockchain.length - 1].hash));
  renderChain(); document.getElementById('crow').scrollLeft = 99999;
}
function resetChain() {
  blockchain = []; bidx = 0;
  blockchain.push(mkBlk('GENESIS — QuantumChain · Bloco Raiz', null));
  blockchain.push(mkBlk('BB→ECB: R$ 500.000.000,00', blockchain[0].hash));
  blockchain.push(mkBlk('ITU→BoE: £ 120.000.000,00', blockchain[1].hash));
  renderChain(); selBlk(blockchain[0]);
}
function tamper() {
  if (blockchain.length < 2) return;
  blockchain[1].data = 'TX:ADULTERADA:$999.999.999.999';
  blockchain[1].hash = 'XXXX' + blockchain[1].hash.slice(4);
  for (let i = 2; i < blockchain.length; i++) {
    blockchain[i].prev = blockchain[i - 1].hash;
    blockchain[i].hash = 'XXXX' + mkH(blockchain[i].data, blockchain[i].prev, blockchain[i].nc, blockchain[i].ts).slice(4);
  }
  renderChain();
  document.getElementById('hform').innerHTML =
    `<span style="color:var(--r)">⚠ ADULTERAÇÃO DETECTADA no Bloco #1!</span><br>Todos os hashes subsequentes são inválidos.<br>A rede P2P rejeita automaticamente — seria necessário recalcular toda a cadeia com &gt;51% do hashrate.`;
  setTimeout(resetChain, 4500);
}
resetChain();

// ── ATTACK SIMULATION ──
let atkRunning = false;

const ATK = {
  mitm: {
    name: 'MITM — Interceptação em Trânsito',
    steps: [
      ['🕵', 'Atacante posicionado no canal de rede', 'IP proxy: 185.241.x.x · ARP poisoning ativo · BGP hijack simulado<br>Alvo: payload cifrado em trânsito · Método: man-in-the-middle clássico', 'le-atk', 700],
      ['🔓', 'Tentativa de decifragem do payload', 'Analisando cabeçalhos TLS 1.3 · Tentando downgrade para TLS 1.2<br>Payload: <span class="hr">CIFRADO — indisponível sem chave privada</span>', 'le-atk', 850],
      ['🔒', 'Assinatura Pós-Quântica detectada', 'Dilithium-3 identificado no pacote · Verificação de integridade obrigatória<br>Tentativa de forjar assinatura: <span class="hr">FALHOU — 2.420 bytes necessários (inviável)</span>', 'le-atk', 750],
      ['❌', 'ADULTERAÇÃO DETECTADA — HMAC inválido', 'HMAC-SHA256 falhou na verificação após modificação do payload<br>Nó validador rejeitou: hash divergente · <span class="hr">IP bloqueado por 24h</span><br>Alerta P2P propagado para 23 nós da rede', 'le-atk', 900],
      ['🛡', 'ATAQUE MITIGADO — Transação original intacta', '<span class="hg">Integridade verificada via Merkle proof + Dilithium-3 + HMAC-SHA256</span><br>Canal QKD re-autenticado · Log de anomalia registrado na blockchain', 'le-blk', 0],
    ]
  },
  shor: {
    name: 'Algoritmo de Shor — Quebra RSA/ECDSA',
    steps: [
      ['⚛', 'QC hipotético: preparando circuito de Shor', 'Alvos: RSA-2048 e ECDSA secp256k1<br>Qubits lógicos necessários (ECDSA): ~2.330 · (RSA-2048): ~4.096<br>Estado atual (2026): QC real possui ~1.000 qubits físicos sem correção de erro', 'le-atk', 800],
      ['📐', 'Aplicando QFT — Quantum Fourier Transform', 'Estimativa de período: r = ordem do grupo multiplicativo mod n<br>Fatorando n = p × q via algoritmo de Shor em O(log³ n)<br>Superposição: <span class="hr">2²⁰⁴⁸ estados simultâneos</span>', 'le-atk', 1000],
      ['💥', 'Resultado: chave privada RSA-2048 exposta (hipotético)', 'Fatoração concluída em QC com correção de erro completa<br>p e q recuperados · ECDSA: log. discreto em CE resolvido<br>Assinatura fraudulenta agora possível neste cenário', 'le-atk', 850],
      ['⚠', 'RSA-2048 e ECDSA confirmados VULNERÁVEIS', '<span class="ho">Realidade 2026: QC escalável com correção de erro ainda ~10–15 anos distante</span><br>Recomendação NIST/NSA CNSA 2.0: migrar para PQC agora, antes do prazo<br>Prazo NSA: sistemas críticos migrados até 2030', 'le-warn', 1000],
      ['🛡', 'Defesa: Dilithium-3 + Kyber-1024 — IMUNES a Shor', '<span class="hg">Module-LWE (problema do reticulado) não é afetado pelo algoritmo de Shor</span><br>NIST FIPS 203/204 (2024) · 128–256 bits de segurança quântica garantida<br>Ação recomendada: migração imediata para sistemas bancários críticos', 'le-blk', 0],
    ]
  },
  eve: {
    name: 'Eva — Espionagem QKD BB84',
    steps: [
      ['👁', 'Eva intercepta canal quântico (fibra monomodo λ=1550nm)', 'Estratégia: intercept-resend · Medindo fótons com base aleatória<br>Canal: 340 km · Taxa de detecção de fótons: 12 kHz · Eva: ativa', 'le-atk', 750],
      ['🎲', 'Eva mede polarizações → colapso quântico inevitável', 'Bases escolhidas aleatoriamente: ↑ → ↗ ↘ (50% corretas por acaso)<br>50% dos fótons colapsam para estado errado após medição<br>Teorema No-Cloning: impossível copiar qubit sem perturbar o original', 'le-atk', 900],
      ['📊', 'Alice e Bob comparam bases (sifting público)', `QBER medido: <span class="hr">22,4%</span> · Limiar seguro: &lt;11%<br>QBER esperado sem espião: ~3,1% · Desvio: <span class="hr">+19,3%</span> (espião detectado!)<br>Prova matemática: Eva introduz erro com prob. = 25% por bit`, 'le-atk', 950],
      ['🚫', 'Canal QKD ABORTADO — espião detectado pelo protocolo', 'Protocolo BB84 interrompido automaticamente por policy de segurança<br>Chave parcial descartada — nenhum bit comprometido<br>Alerta criptográfico emitido para ambas as partes', 'le-atk', 750],
      ['🔄', 'Nova sessão QKD em canal autenticado alternativo', '<span class="hg">Canal de backup (satélite Micius) estabelecido · QBER: 3,1% — seguro</span><br>Nova chave OTP de 256 bits gerada com QRNG real · Eva isolada<br>Protocolo pós-comprometimento: todas as sessões anteriores invalidadas', 'le-blk', 0],
    ]
  },
  replay: {
    name: 'Replay Attack — Reutilização de TX',
    steps: [
      ['📋', 'Atacante captura transação válida da blockchain pública', `TX-ID: <span class="hr">TXQ-${Date.now().toString(36).toUpperCase().slice(-8)}</span> · Assinatura Dilithium-3: copiada<br>Bloco de origem: #21.849.312 · Valor: R$ 12.000.000,00<br>Objetivo: reenviar para debitar a conta novamente`, 'le-atk', 700],
      ['🔁', 'Reenvio do payload capturado para a rede', 'Mesmo TX-ID · mesma assinatura · mesmo timestamp original<br>Nó de entrada: adicionando à mempool temporariamente<br>Propagando para validadores via gossip P2P...', 'le-atk', 850],
      ['⛓', 'Validadores verificam nonce e TX-ID na blockchain', `TX-ID já registrado no bloco imutável #21.849.312<br>Nonce de conta: esperado ${rnd(847, 2000)} · recebido ${rnd(800, 846)} (menor — inválido)<br>Verificação double-spend: <span class="hr">FALHOU — saldo já debitado e confirmado</span>`, 'le-atk', 800],
      ['❌', 'Transação REJEITADA — consensus unânime (21/21)', 'Motivos: TX-ID duplicado + nonce inválido + saldo insuficiente<br>EIP-155 chain ID: <span class="hr">cross-chain replay também bloqueado</span><br>IP do atacante adicionado à blacklist da rede', 'le-atk', 850],
      ['🛡', 'REPLAY bloqueado — imutabilidade da blockchain', '<span class="hg">Nonce incremental único + TX-ID por hash + cadeia imutável</span> tornam replay estruturalmente impossível<br>Nenhum bloco comprometido · Protocolo EIP-155 ativo · Auditoria registrada', 'le-blk', 0],
    ]
  },
  brute: {
    name: 'Força Bruta — Ataque Clássico/Quântico',
    steps: [
      ['💻', 'Força bruta clássica: 10¹² tentativas/segundo (GPU cluster)', 'Alvo: chave AES-256 de 256 bits · Taxa: 10¹² ops/s (exaFLOPS)<br>Combinações: 2²⁵⁶ ≈ 1,16 × 10⁷⁷<br>Estimativa: <span class="hr">3,7 × 10⁵⁷ anos</span> — computacionalmente inviável', 'le-atk', 800],
      ['⚛', 'Ataque Grover (computador quântico): busca quadrática', 'Grover reduz complexidade de 2²⁵⁶ para 2¹²⁸ (raiz quadrada)<br>AES-256 efetivo com Grover: 128 bits — ainda ~10²⁴ anos em QC<br><span class="ho">AES-256 resiste ao Grover — 128 bits efetivos são suficientes</span>', 'le-warn', 850],
      ['🎯', 'Ataque dicionário em credenciais de carteira', 'Testando 10⁸ senhas de dicionário · Função PBKDF2-SHA256 (100.000 rounds)<br>Argon2id: 64 MB × 100.000 iterações · ~2s por tentativa<br><span class="ho">Vulnerabilidade real: senhas fracas (&lt;12 caracteres) são quebráveis</span>', 'le-atk', 900],
      ['🔑', 'Análise: vetores de ataque por força bruta reais', '<span class="ho">PIN de 4 dígitos: 10.000 combinações = &lt;1ms · PIN de 6 dígitos: 1 segundo</span><br>Senha 8 chars sem complexidade: &lt;2 horas em GPU<br>Entropia baixa é a maior vulnerabilidade real, não o algoritmo', 'le-warn', 900],
      ['🛡', 'Defesa: QRNG + Argon2id + PQC — força bruta inviável', '<span class="hg">QRNG gera 256 bits de entropia quântica verdadeira (imprevisível)</span><br>Dilithium-3: 2.420 bytes de assinatura — sem backdoor · sem fraqueza estrutural<br>Argon2id (vencedor PHC 2015): memória-hard, resiste GPU/ASIC/QC', 'le-blk', 0],
    ]
  },
};

async function runAttack() {
  if (atkRunning || simRunning) return;
  atkRunning = true;
  document.getElementById('batk').disabled = true;
  document.getElementById('bstart').disabled = true;
  document.getElementById('rcard').classList.remove('show');

  const body = document.getElementById('lbody');
  body.innerHTML = '';
  setProg(0);

  const type = document.getElementById('s-atk').value;
  const scenario = ATK[type];
  setStat('⚔ Simulando Ataque...');

  addLog('⚔', `SIMULAÇÃO: ${scenario.name}`,
    `Cenário educacional — demonstra como ataques são detectados e bloqueados pela criptografia quântica.<br>Método selecionado: <span class="hr">${scenario.name}</span>`, 'le-warn');
  setProg(8);
  await delay(500);

  const total = scenario.steps.length;
  for (let i = 0; i < total; i++) {
    const [ic, tt, dt, cls, ms] = scenario.steps[i];
    addLog(ic, tt, dt, cls);
    setProg(Math.round((i + 1) / total * 88) + 8);
    if (ms > 0) await delay(ms);
  }

  setProg(100);
  setStat('🛡 Ataque Bloqueado!');
  atkRunning = false;
  document.getElementById('batk').disabled = false;
  document.getElementById('bstart').disabled = false;
}
