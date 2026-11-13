'use strict';
/* Ihawan (levels 20 to 29): put skewers on the grill, FLIP each one when it glows, take it when it is ready.
   Cooking: side 1 takes 3s (flip window until 6.5s, then it burns). Side 2 takes 3s (take it before 7.5s). Loaded after halo.js. */
const IHAW_ALL = ['porkbbq', 'isaw', 'chickenbbq', 'betamax', 'liempo', 'adidas', 'helmet', 'walkman', 'longganisa', 'ihawcorn'];
Object.assign(FD, {
  porkbbq: { n: 'Pork BBQ', p: 20, lv: 20, tl: 'pork barbecue', stand: 'ihaw' },
  isaw: { n: 'Isaw', p: 15, lv: 21, tl: 'isaw', stand: 'ihaw' },
  chickenbbq: { n: 'Chicken BBQ', p: 25, lv: 22, tl: 'chicken barbecue', stand: 'ihaw' },
  betamax: { n: 'Betamax', sub: 'grilled blood cubes', p: 12, lv: 23, tl: 'betamax', stand: 'ihaw' },
  liempo: { n: 'Liempo', sub: 'pork belly', p: 30, lv: 24, tl: 'liempo', stand: 'ihaw' },
  adidas: { n: 'Adidas', sub: 'chicken feet', p: 18, lv: 25, tl: 'adidas', stand: 'ihaw' },
  helmet: { n: 'Helmet', sub: 'chicken head', p: 15, lv: 26, tl: 'helmet', stand: 'ihaw' },
  walkman: { n: 'Walkman', sub: 'pig ears', p: 18, lv: 27, tl: 'walkman', stand: 'ihaw' },
  longganisa: { n: 'Longganisa', p: 20, lv: 28, tl: 'longganisa', stand: 'ihaw' },
  ihawcorn: { n: 'Grilled corn', p: 15, lv: 29, tl: 'inihaw na mais', stand: 'ihaw' }
});
Object.assign(UNL, { 20: [{ k: 'porkbbq' }], 21: [{ k: 'isaw' }], 22: [{ k: 'chickenbbq' }], 23: [{ k: 'betamax' }], 24: [{ k: 'liempo' }], 25: [{ k: 'adidas' }], 26: [{ k: 'helmet' }], 27: [{ k: 'walkman' }], 28: [{ k: 'longganisa' }], 29: [{ k: 'ihawcorn' }] });
STANDS[2].built = true;
S.grill = Array(8).fill(null);

/* ---------- skewer drawings (80 x 40, drawn along a stick) ---------- */
const IP = {
  porkbbq: () => [14, 31, 48, 65].map(x => `<rect x="${x - 9}" y="11" width="18" height="18" rx="4" fill="#b5472a" stroke="#6b2412"/><path d="M${x - 5} 16h8M${x - 5} 23h9" stroke="#6b2412" stroke-width="1.6" stroke-linecap="round"/><rect x="${x - 6}" y="13" width="7" height="3" rx="1.5" fill="#fff" fill-opacity=".35"/>`).join(''),
  isaw: () => '<path d="M6 20Q14 5 22 20T38 20T54 20T72 20" stroke="#c98f3a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20Q14 5 22 20T38 20T54 20T72 20" stroke="#8a5a1a" stroke-width="2" stroke-dasharray="3 5" fill="none"/>',
  chickenbbq: () => [16, 40, 64].map(x => `<rect x="${x - 11}" y="10" width="22" height="20" rx="9" fill="#d98a3a" stroke="#8a4a14"/><path d="M${x - 6} 16h12M${x - 6} 23h12" stroke="#8a4a14" stroke-width="1.6" stroke-linecap="round"/><rect x="${x - 7}" y="12" width="8" height="3" rx="1.5" fill="#fff" fill-opacity=".35"/>`).join(''),
  betamax: () => [13, 30, 47, 64].map(x => `<rect x="${x - 8}" y="12" width="16" height="16" rx="3" fill="#4a1820" stroke="#2a0c10"/><rect x="${x - 5}" y="14" width="6" height="2.5" rx="1" fill="#fff" fill-opacity=".3"/>`).join(''),
  liempo: () => [6, 42].map(x => `<rect x="${x}" y="9" width="32" height="22" rx="4" fill="#f3d6c4" stroke="#7a3a22"/><rect x="${x}" y="9" width="32" height="7" rx="3" fill="#b5472a"/><rect x="${x}" y="24" width="32" height="7" rx="3" fill="#9a3a22"/>`).join(''),
  adidas: () => [0, 38].map(o => `<path d="M${o + 30} 20H${o + 14}M${o + 14} 20L${o + 4} 10M${o + 14} 20L${o + 2} 20M${o + 14} 20L${o + 4} 30" stroke="#d9a24a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${o + 4}" cy="10" r="2.4" fill="#b87a2a"/><circle cx="${o + 2}" cy="20" r="2.4" fill="#b87a2a"/><circle cx="${o + 4}" cy="30" r="2.4" fill="#b87a2a"/>`).join(''),
  helmet: () => [18, 56].map(x => `<circle cx="${x}" cy="21" r="10" fill="#d9a050" stroke="#8a5a1a"/><circle cx="${x - 4}" cy="10" r="3.4" fill="#e63946"/><circle cx="${x}" cy="8" r="3.4" fill="#e63946"/><circle cx="${x + 4}" cy="10" r="3.4" fill="#e63946"/><path d="M${x + 8} 20L${x + 17} 23L${x + 8} 26Z" fill="#f2c14e" stroke="#a8761f"/><circle cx="${x + 2}" cy="18" r="1.6" fill="#2b1a12"/>`).join(''),
  walkman: () => [0, 38].map(o => `<path d="M${o + 8} 12Q${o + 22} 3 ${o + 30} 14Q${o + 34} 25 ${o + 22} 31Q${o + 9} 35 ${o + 8} 24Z" fill="#c98a6a" stroke="#7a4a2b"/><path d="M${o + 14} 16Q${o + 24} 12 ${o + 27} 19Q${o + 28} 25 ${o + 20} 27" stroke="#7a4a2b" stroke-width="1.6" fill="none"/>`).join(''),
  longganisa: () => [3, 28, 53].map(x => `<rect x="${x}" y="12" width="24" height="16" rx="8" fill="#a8381f" stroke="#5a1a0e"/><path d="M${x + 12} 12V28" stroke="#5a1a0e" stroke-width="1.2"/><rect x="${x + 4}" y="14" width="8" height="3" rx="1.5" fill="#fff" fill-opacity=".3"/>`).join(''),
  ihawcorn: () => '<rect x="5" y="9" width="70" height="22" rx="11" fill="#f4c430" stroke="#a8761f"/>' + [14, 24, 34, 44, 54, 64].map(x => `<circle cx="${x}" cy="15" r="2.4" fill="#fff3a0"/><circle cx="${x}" cy="25" r="2.4" fill="#fff3a0"/>`).join('') + '<path d="M20 10l6 5M46 24l7 6M60 12l5 4" stroke="#6b3e1f" stroke-width="2.4" stroke-linecap="round"/>'
};
const iIcon = k => `<svg viewBox="0 0 80 40" class="fd"><rect x="2" y="19" width="76" height="3" rx="1.5" fill="#d9b382"/>${IP[k]()}</svg>`;

/* ---------- cooking ---------- */
const G1 = 3000, GF = 6500, G2 = 3000, GR = 7500;
const gState = s => { const a = Date.now() - s.t; return !s.side ? (a < G1 ? 'cook1' : a < GF ? 'flip' : 'burnt') : (a < G2 ? 'cook2' : a < GR ? 'ready' : 'burnt'); };
let gEls = [];
function grillAdd(k) {
  if (FD[k].lv > S.level) return toast(`Reach Level ${FD[k].lv} to unlock ${FD[k].n}.`, 1);
  const i = S.grill.findIndex(s => !s); if (i < 0) return toast('The grill is full!', 1);
  S.grill[i] = { k, t: Date.now(), side: 0 }; act(); SND.splash(); grillPaint();
}
function grillTap(i) {
  const s = S.grill[i]; if (!s) return;
  const st = gState(s);
  if (st === 'cook1') return toast('Wait until it glows and says FLIP!', 1);
  if (st === 'cook2') return toast('Cooking the other side. Almost there!', 1);
  if (st === 'flip') { s.side = 1; s.t = Date.now(); s.f2 = 0; act(); SND.grab(); return grillPaint(); }
  if (st === 'burnt') { S.grill[i] = null; toast('Burnt! Thrown away.'); return grillPaint(); }
  const c = tgt(); if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting for food first.', 1);
  c.bag[s.k] = (c.bag[s.k] || 0) + 1; S.grill[i] = null; act(); SND.grab(); grillPaint(); draw();
}
function grillPaint() {
  S.grill.forEach((s, i) => {
    const d = gEls[i]; if (!d) return;
    if (!s) { d.className = 'gslot'; d.innerHTML = ''; d.dataset.k = ''; return; }
    const st = gState(s), a = Date.now() - s.t;
    if (st === 'flip' && !s.f1) { s.f1 = 1; SND.ding(); setTimeout(draw, 0); }
    if (st === 'ready' && !s.f2) { s.f2 = 1; SND.ding(); setTimeout(draw, 0); }
    if (st === 'burnt' && !s.fb) { s.fb = 1; SND.burnt(); setTimeout(draw, 0); }
    d.className = 'gslot ' + st + (s.side ? ' side2' : '');
    if (d.dataset.k !== s.k) { d.innerHTML = iIcon(s.k) + '<i><b></b></i>'; d.dataset.k = s.k; }
    d.style.setProperty('--p', Math.min(100, a / (s.side ? G2 : G1) * 100) + '%');
  });
}
const grillTick = () => { grillPaint(); SND.sizzle(S.grill.filter(s => s && gState(s) !== 'burnt').length); };

/* ---------- orders ---------- */
function makeIhawOrder() {
  const pool = IHAW_ALL.filter(k => FD[k].lv <= S.level), maxL = S.level < 24 ? 2 : 3;
  const order = [...pool].sort(() => Math.random() - .5).slice(0, rnd(1, Math.min(maxL, pool.length))).map(k => ({ k, qty: rnd(1, FD[k].p >= 25 ? 2 : 3) }));
  return { kind: 'ihaw', order };
}
const ihawTicket = c => c.order.map(l => `${l.qty} ${FD[l.k].n}${FD[l.k].sub ? ' (' + FD[l.k].sub + ')' : ''}`).join(', ');
function ihawTip(c) {
  const need = {}; c.order.forEach(l => { need[l.k] = l.qty; });
  if (Object.keys(c.bag).some(k => !need[k] || c.bag[k] > need[k])) return 'Too much. Press Empty bag to start over.';
  const miss = Object.keys(need).find(k => (c.bag[k] || 0) < need[k]);
  if (!miss) return 'Looks right. Press Hand over order.';
  const on = S.grill.filter(s => s && s.k === miss);
  if (on.some(s => gState(s) === 'flip')) return 'FLIP! Tap the glowing skewer now.';
  if (on.some(s => gState(s) === 'ready')) return 'Tap the ready skewer to put it in the bag.';
  if (on.length) return 'Wait for it to cook. Flip it when it glows.';
  return `Tap ${FD[miss].n} to put a skewer on the grill.`;
}
function updateIhaw() {
  IHAW_ALL.forEach(k => $('#ib_' + k).classList.toggle('locked', FD[k].lv > S.level));
}

(function buildIhaw() {
  const fore = $('.fore'), cash = $('#cash');
  const tray = el('div', 'itray'); tray.id = 'itray';
  IHAW_ALL.forEach(k => {
    const b = el('button', 'bin hbin ibin', `${iIcon(k)}<div><span>${FD[k].n}</span><em>₱${FD[k].p}</em></div>`);
    b.id = 'ib_' + k; b.dataset.lock = `Level ${FD[k].lv}`; if (FD[k].sub) b.title = FD[k].sub; b.onclick = () => grillAdd(k); tray.append(b);
  });
  const grill = el('div', 'grill', '<div class="coals"></div><div class="gslots" id="gslots"></div><div class="gsmoke"><i></i><i></i><i></i></div>');
  fore.insertBefore(tray, cash); fore.insertBefore(grill, cash);
  for (let i = 0; i < 8; i++) { const d = el('div', 'gslot'); d.onclick = () => grillTap(i); $('#gslots').append(d); gEls.push(d); }
})();
STAND_FN[2] = { order: makeIhawOrder, tl: c => orderTl(c), ticket: ihawTicket, tip: ihawTip, update: updateIhaw, tick: grillTick, icon: iIcon,
  unlock: k => `${FD[k].n}${FD[k].sub ? ' (' + FD[k].sub + ')' : ''} is now at the Ihawan, ₱${FD[k].p} each. Put it on the grill, flip it at the signal, then bag it.`,
  reset() { S.grill = Array(8).fill(null); grillPaint(); } };