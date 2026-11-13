'use strict';
/* Simbang Gabi Stand (levels 30 to 39): bake bibingka, steam puto bumbong, add toppings, pair with salabat or hot chocolate.
   Reuses the cooking pots (same tap-when-glowing rules, different timings). Loaded after ihaw.js. */
const XCOOK = ['bibingka', 'putobumbong', 'suman', 'kutsinta'], XTOP = ['butter', 'sugar', 'egg', 'cheese', 'coconut'], XDRINK = ['salabat', 'tsokolate'], XALL = [...XCOOK, ...XTOP, ...XDRINK];
Object.assign(FD, {
  bibingka: { n: 'Bibingka', p: 25, lv: 30, tl: 'bibingka', stand: 'xmas', role: 'cook', cook: [5000, 11000] },
  putobumbong: { n: 'Puto bumbong', bin: 'Puto bumbong', p: 25, lv: 31, tl: 'puto bumbong', stand: 'xmas', role: 'cook', cook: [4000, 9500] },
  suman: { n: 'Suman', p: 15, lv: 37, tl: 'suman', stand: 'xmas', role: 'cook', cook: [3500, 8500] },
  kutsinta: { n: 'Kutsinta', p: 12, lv: 38, tl: 'kutsinta', stand: 'xmas', role: 'cook', cook: [3500, 8500] },
  butter: { n: 'Butter', p: 5, lv: 30, tl: 'mantikilya', stand: 'xmas', role: 'top' },
  sugar: { n: 'Sugar', p: 3, lv: 30, tl: 'asukal', stand: 'xmas', role: 'top' },
  egg: { n: 'Salted egg', p: 12, lv: 32, tl: 'salted egg', stand: 'xmas', role: 'top' },
  cheese: { n: 'Cheese', p: 10, lv: 33, tl: 'keso', stand: 'xmas', role: 'top' },
  coconut: { n: 'Grated coconut', bin: 'Coconut', p: 8, lv: 34, tl: 'niyog', stand: 'xmas', role: 'top' },
  salabat: { n: 'Salabat', p: 15, lv: 35, tl: 'salabat', stand: 'xmas', role: 'drink' },
  tsokolate: { n: 'Hot chocolate', bin: 'Tsokolate', p: 18, lv: 36, tl: 'tsokolate', stand: 'xmas', role: 'drink' }
});
Object.assign(UNL, { 30: [{ k: 'bibingka' }, { k: 'butter' }, { k: 'sugar' }], 31: [{ k: 'putobumbong' }], 32: [{ k: 'egg' }], 33: [{ k: 'cheese' }], 34: [{ k: 'coconut' }], 35: [{ k: 'salabat' }], 36: [{ k: 'tsokolate' }], 37: [{ k: 'suman' }], 38: [{ k: 'kutsinta' }] });
STANDS[3].built = true;

/* ---------- drawings (60 x 60) ---------- */
const XI = {
  bibingka: () => '<circle cx="30" cy="30" r="25" fill="#5fb257" stroke="#2f6b2f"/><circle cx="30" cy="30" r="18" fill="#d9a441"/><circle cx="30" cy="30" r="14.5" fill="#f2d28b"/><path d="M18 24Q30 16 42 24" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>' + dots([[24, 34], [36, 35], [30, 27]], 2.2, '#e0a040'),
  putobumbong: () => '<ellipse cx="30" cy="46" rx="26" ry="9" fill="#5fb257" stroke="#2f6b2f"/>' + [[16, 34], [30, 30], [44, 34]].map(([x, y]) => `<rect x="${x - 6}" y="${y - 20}" width="12" height="34" rx="6" fill="#7a3aa8" stroke="#4a1f6b"/><rect x="${x - 3}" y="${y - 16}" width="3" height="22" rx="1.5" fill="#fff" fill-opacity=".35"/>`).join('') + dots([[16, 14], [30, 10], [44, 14], [24, 22], [37, 20]], 1.8, '#fff'),
  suman: () => '<g transform="rotate(-22 30 30)"><rect x="6" y="12" width="46" height="15" rx="7" fill="#5fb257" stroke="#2f6b2f"/><ellipse cx="51" cy="19.5" rx="3" ry="6.5" fill="#fff6e0"/><path d="M16 12V27M28 12V27M40 12V27" stroke="#c9a46a" stroke-width="2"/><rect x="4" y="32" width="46" height="15" rx="7" fill="#4f9d4a" stroke="#2f6b2f"/><ellipse cx="49" cy="39.5" rx="3" ry="6.5" fill="#fff6e0"/><path d="M14 32V47M26 32V47M38 32V47" stroke="#c9a46a" stroke-width="2"/></g>',
  kutsinta: () => [[16, 38], [32, 32], [46, 40]].map(([x, y]) => `<path d="M${x - 9} ${y - 8}H${x + 9}L${x + 7} ${y + 8}H${x - 7}Z" fill="#b5651d" stroke="#6b3a10"/><ellipse cx="${x}" cy="${y - 8}" rx="9" ry="3.5" fill="#fff" stroke="#e0d7c0"/>`).join(''),
  butter: () => '<rect x="9" y="20" width="42" height="22" rx="3" fill="#f7e070" stroke="#c9a928"/><path d="M9 27H51" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
  sugar: () => '<path d="M7 46Q30 6 53 46Z" fill="#fff" stroke="#d9d2b8"/>' + dots([[22, 38], [34, 30], [40, 40], [28, 24]], 1.6, '#ffd166'),
  egg: () => '<ellipse cx="30" cy="31" rx="18" ry="22" fill="#e07a5f" stroke="#a8452b"/><ellipse cx="30" cy="33" rx="9.5" ry="11" fill="#f4a024"/><ellipse cx="27" cy="29" rx="3" ry="3.6" fill="#fff" fill-opacity=".4"/>',
  cheese: () => '<path d="M5 42L47 22L56 42Z" fill="#f4c430" stroke="#b8902a"/>' + dots([[22, 37], [36, 36], [44, 38]], 2.4, '#b8902a'),
  coconut: () => '<path d="M8 34Q16 26 24 34T40 34T52 34M10 26Q18 18 26 26T42 26M12 43Q20 37 28 43T44 43" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M8 34Q16 26 24 34T40 34T52 34M10 26Q18 18 26 26T42 26M12 43Q20 37 28 43T44 43" stroke="#e6ddc4" stroke-width="1.2" fill="none"/>',
  salabat: () => '<path d="M12 22H44L40 50Q40 54 36 54H20Q16 54 16 50Z" fill="#e0a040" stroke="#7a4a1f"/><path d="M44 28Q54 28 52 38Q50 44 42 44" stroke="#7a4a1f" stroke-width="3" fill="none"/><circle cx="26" cy="32" r="5" fill="#f2d28b" stroke="#b8902a"/><path d="M22 14Q26 8 22 4M32 14Q36 8 32 4" stroke="#fff" stroke-opacity=".7" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  tsokolate: () => '<path d="M10 24H42L38 52Q38 55 35 55H17Q14 55 14 52Z" fill="#5a3520" stroke="#2f1c10"/><path d="M42 30Q53 30 51 40Q49 47 40 46" stroke="#2f1c10" stroke-width="3" fill="none"/><ellipse cx="26" cy="24" rx="16" ry="4" fill="#7a4a2b"/>' + dots([[20, 22], [27, 21], [33, 23]], 3, '#fff') + '<path d="M20 14Q24 8 20 4M30 14Q34 8 30 4" stroke="#fff" stroke-opacity=".7" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
};
const xIcon = k => `<svg viewBox="0 0 60 60" class="fd">${XI[k]()}</svg>`;
const PAROL = '<svg viewBox="-20 0 40 70"><path d="M0 0V14" stroke="#a8761f" stroke-width="1.5"/><polygon points="0,14 4,26 17,26 7,33 11,46 0,38 -11,46 -7,33 -17,26 -4,26" fill="#e63946" stroke="#a8761f" stroke-width="1.5"/><polygon points="0,22 2,29 9,29 4,33 6,40 0,36 -6,40 -4,33 -9,29 -2,29" fill="#ffd166"/><path d="M-3 46L-6 62M0 46V66M3 46L6 62" stroke="#ffd166" stroke-width="2" stroke-linecap="round"/></svg>';

/* ---------- orders ---------- */
const xParts = c => ({ base: c.order.filter(l => FD[l.k].role === 'cook'), tops: c.order.filter(l => FD[l.k].role === 'top'), drinks: c.order.filter(l => FD[l.k].role === 'drink') });
function makeXmasOrder() {
  const ok = k => FD[k].lv <= S.level, bases = XCOOK.filter(ok), tops = XTOP.filter(ok), drinks = XDRINK.filter(ok), shuffle = a => [...a].sort(() => Math.random() - .5);
  const chosen = shuffle(bases).slice(0, rnd(1, Math.min(bases.length, S.level < 33 ? 1 : 2)));
  const order = chosen.map(k => ({ k, qty: (k === 'bibingka' || k === 'putobumbong') ? rnd(1, 2) : rnd(1, 3) }));
  if (chosen.some(k => k === 'bibingka' || k === 'putobumbong') && tops.length) shuffle(tops).slice(0, rnd(0, Math.min(3, tops.length))).forEach(k => order.push({ k, qty: 1 }));
  if (drinks.length && Math.random() < .4) order.push({ k: pick(drinks), qty: rnd(1, 2) });
  return { kind: 'xmas', order };
}
function xmasTl(c) {
  const { base, tops, drinks } = xParts(c);
  let t = andList(base.map(l => `${l.qty} ${FD[l.k].tl}`));
  if (tops.length) t += ' na may ' + andList(tops.map(l => FD[l.k].tl));
  if (drinks.length) t += ' at ' + andList(drinks.map(l => `${l.qty} ${FD[l.k].tl}`));
  return t;
}
function xmasTicket(c) {
  const { base, tops, drinks } = xParts(c);
  return base.map(l => `${l.qty} ${FD[l.k].n}`).join(', ') + (tops.length ? ' with ' + tops.map(l => FD[l.k].n).join(', ') : '') + (drinks.length ? ' + ' + drinks.map(l => `${l.qty} ${FD[l.k].n}`).join(', ') : '');
}
function xmasTip(c) {
  const need = {}; c.order.forEach(l => { need[l.k] = l.qty; });
  if (Object.keys(c.bag).some(k => !need[k] || c.bag[k] > need[k])) return 'Too much. Tap a topping again to remove it, or press Empty bag.';
  const miss = Object.keys(need).find(k => (c.bag[k] || 0) < need[k]);
  if (!miss) return 'Looks right. Press Hand over order.';
  if (FD[miss].role === 'cook') {
    const on = S.slots.filter(s => s && s.k === miss);
    if (on.some(s => state(s) === 'ready')) return `Tap the glowing ${FD[miss].n} to bag it.`;
    return on.length ? `Wait for the ${FD[miss].n} to glow, then tap it.` : `Tap ${FD[miss].bin || FD[miss].n} to start cooking it.`;
  }
  return `Tap ${FD[miss].bin || FD[miss].n} to add it.`;
}

/* ---------- the stand ---------- */
function xTap(k) {
  const f = FD[k];
  if (f.lv > S.level) return toast(`Reach Level ${f.lv} to unlock ${f.n}.`, 1);
  if (f.role === 'cook') {
    const i = S.slots.findIndex(s => !s); if (i < 0) return toast('The pots are full!', 1);
    S.slots[i] = { k, t: Date.now() }; act(); SND.grab(); return paintSlots();
  }
  const c = tgt(); if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting first.', 1);
  if (f.role === 'top') { if (c.bag[k]) delete c.bag[k]; else c.bag[k] = 1; }
  else { c.bag[k] = (c.bag[k] || 0) + 1; if (c.bag[k] > 3) delete c.bag[k]; SND.glug(); }
  act(); SND.grab(); draw();
}
function updateXmas() {
  const c = tgt(), on = c && c.phase === 'order';
  XALL.forEach(k => { const b = $('#xb_' + k); b.classList.toggle('locked', FD[k].lv > S.level); b.classList.toggle('has', !!(on && c.bag[k] && FD[k].role !== 'cook')); });
}
(function buildXmas() {
  const tray = el('div', 'xtray'); tray.id = 'xtray';
  XALL.forEach(k => {
    const b = el('button', 'bin hbin xbin', `${xIcon(k)}<div><span>${FD[k].bin || FD[k].n}</span><em>₱${FD[k].p}</em></div>`);
    b.id = 'xb_' + k; b.dataset.lock = `Level ${FD[k].lv}`; b.onclick = () => xTap(k); tray.append(b);
  });
  $('.fore').insertBefore(tray, $('#cash'));
  $('#scene').append(el('div', 'parols', `<div class="parol l">${PAROL}</div><div class="parol r">${PAROL}</div>`));
})();
STAND_FN[3] = { order: makeXmasOrder, tl: xmasTl, ticket: xmasTicket, tip: xmasTip, update: updateXmas, tick() {}, icon: xIcon, reset() {},
  greet: () => Math.random() < .35 ? pick(['Maligayang Pasko! ', 'Simbang Gabi na po! ', 'Merry Christmas po! ']) : '', enter: () => SND.sleigh(),
  unlock: k => `${FD[k].n} is now at the Simbang Gabi Stand, ₱${FD[k].p}. ` + (FD[k].role === 'cook' ? 'Put it in the pots, wait for the glow, then tap it to bag it.' : FD[k].role === 'top' ? 'Tap it to add it as a topping.' : 'Tap it to add a cup to the bag.') };