'use strict';
/* Halo-Halo stand (levels 10 to 19). Loaded after map.js.
   Build each order in a tall glass: toppings, shaved ice, then milk. Tap an item again to take it out. */
const HALO_TOPS = ['beans', 'sago', 'nata', 'kaong', 'saba', 'langka', 'macapuno', 'flan', 'ube', 'icecream'];
const HALO_ALL = [...HALO_TOPS, 'corn', 'milo'];
Object.assign(FD, {
  ice: { n: 'Shaved ice', p: 15, lv: 10, tl: 'shaved ice', stand: 'halo' },
  milk: { n: 'Milk', p: 10, lv: 10, tl: 'gatas', stand: 'halo' },
  beans: { n: 'Sweet beans', p: 8, lv: 10, tl: 'sweet beans', stand: 'halo' },
  sago: { n: 'Sago', p: 8, lv: 10, tl: 'sago', stand: 'halo' },
  nata: { n: 'Nata de coco', p: 8, lv: 11, tl: 'nata de coco', stand: 'halo' },
  kaong: { n: 'Kaong', p: 8, lv: 12, tl: 'kaong', stand: 'halo' },
  corn: { n: 'Mais con yelo', bin: 'Corn', p: 15, lv: 13, tl: 'mais con yelo', stand: 'halo' },
  saba: { n: 'Saba banana', p: 10, lv: 14, tl: 'saging na saba', stand: 'halo' },
  langka: { n: 'Langka', p: 10, lv: 15, tl: 'langka', stand: 'halo' },
  macapuno: { n: 'Macapuno', p: 10, lv: 16, tl: 'macapuno', stand: 'halo' },
  flan: { n: 'Leche flan', p: 15, lv: 17, tl: 'leche flan', stand: 'halo' },
  ube: { n: 'Ube halaya', p: 15, lv: 18, tl: 'ube', stand: 'halo' },
  milo: { n: 'Milo dinosaur', bin: 'Milo', p: 15, lv: 19, tl: 'Milo dinosaur', stand: 'halo' },
  icecream: { n: 'Ice cream', p: 15, lv: 19, tl: 'ice cream', stand: 'halo' }
});
Object.assign(UNL, { 10: [{ k: 'beans' }, { k: 'sago' }], 11: [{ k: 'nata' }], 12: [{ k: 'kaong' }], 13: [{ k: 'corn' }], 14: [{ k: 'saba' }], 15: [{ k: 'langka' }], 16: [{ k: 'macapuno' }], 17: [{ k: 'flan' }], 18: [{ k: 'ube' }], 19: [{ k: 'milo' }, { k: 'icecream' }] });
STANDS[1].built = true;

/* ---------- drawings ---------- */
const dots = (a, r, f) => a.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${typeof f === 'function' ? f(i) : f}"/>`).join('');
const HI = {
  beans: () => '<ellipse cx="14" cy="23" rx="8" ry="5.5" transform="rotate(-25 14 23)" fill="#a3303c"/><ellipse cx="27" cy="17" rx="8" ry="5.5" transform="rotate(20 27 17)" fill="#b83a46"/><ellipse cx="25" cy="30" rx="8" ry="5.5" transform="rotate(-10 25 30)" fill="#8e2a35"/><ellipse cx="12" cy="21" rx="2.5" ry="1.2" fill="#fff" fill-opacity=".4"/>',
  sago: () => dots([[12, 14], [23, 11], [31, 19], [17, 24], [27, 29], [10, 31], [20, 18]], 5, '#6b3e1f') + dots([[10.5, 12.5], [21.5, 9.5], [29.5, 17.5]], 1.4, '#fff'),
  nata: () => '<rect x="6" y="8" width="13" height="13" rx="2.5" transform="rotate(-12 12 14)" fill="#f6f2e6" stroke="#d9d2b8"/><rect x="21" y="12" width="13" height="13" rx="2.5" transform="rotate(14 27 18)" fill="#f6f2e6" stroke="#d9d2b8"/><rect x="12" y="25" width="13" height="12" rx="2.5" fill="#fbf8ee" stroke="#d9d2b8"/>',
  kaong: () => dots([[13, 14], [27, 13], [20, 25], [10, 30], [30, 29]], 6, i => i % 2 ? '#76B041' : '#e63946') + dots([[11, 12], [25, 11], [18, 23]], 1.6, '#fff'),
  saba: () => '<ellipse cx="15" cy="15" rx="8" ry="7" fill="#f4d35e" stroke="#b8902a"/><circle cx="15" cy="15" r="2.4" fill="#b8902a"/><ellipse cx="28" cy="22" rx="8" ry="7" fill="#f7dc72" stroke="#b8902a"/><circle cx="28" cy="22" r="2.4" fill="#b8902a"/><ellipse cx="14" cy="30" rx="7" ry="6" fill="#f4d35e" stroke="#b8902a"/><circle cx="14" cy="30" r="2" fill="#b8902a"/>',
  langka: () => '<path d="M8 10Q18 4 22 14Q18 22 10 20Z" fill="#f2b705" stroke="#b88700"/><path d="M20 20Q32 14 34 26Q28 34 20 30Z" fill="#f7c82e" stroke="#b88700"/><path d="M8 26Q16 22 18 32Q12 38 7 34Z" fill="#f2b705" stroke="#b88700"/>',
  macapuno: () => '<path d="M6 12Q14 6 22 12T36 12M6 20Q14 14 22 20T36 20M6 28Q14 22 22 28T36 28" stroke="#fff" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M6 12Q14 6 22 12T36 12M6 20Q14 14 22 20T36 20M6 28Q14 22 22 28T36 28" stroke="#eee6cf" stroke-width="1.2" fill="none"/>',
  flan: () => '<rect x="7" y="12" width="26" height="20" rx="5" fill="#f2c14e" stroke="#b8862a"/><path d="M7 17Q20 13 33 17V14Q33 12 31 12H9Q7 12 7 14Z" fill="#a8571c"/><rect x="11" y="20" width="6" height="8" rx="3" fill="#fff" fill-opacity=".4"/>',
  ube: () => '<circle cx="20" cy="18" r="12" fill="#8a4fbf"/><path d="M8 22Q10 34 16 33Q18 28 22 34Q28 34 32 22Z" fill="#8a4fbf"/><circle cx="15" cy="13" r="3" fill="#fff" fill-opacity=".4"/>',
  icecream: () => '<path d="M12 22L20 38L28 22Z" fill="#d9a05b" stroke="#a8761f"/><circle cx="20" cy="17" r="11" fill="#ffc2d6" stroke="#e08aa8"/><circle cx="16" cy="13" r="2.8" fill="#fff" fill-opacity=".6"/>',
  corn: () => '<rect x="10" y="6" width="20" height="30" rx="10" fill="#f4d03f" stroke="#b8902a"/>' + dots([[16, 14], [24, 14], [16, 21], [24, 21], [16, 28], [24, 28], [20, 11], [20, 18], [20, 25]], 2.3, '#fff3a0'),
  milo: () => '<path d="M9 12H31L29 35Q29 38 26 38H14Q11 38 11 35Z" fill="#5a3520" stroke="#2f1c10"/><path d="M8 12Q20 -2 32 12Z" fill="#7a4a2b"/>' + dots([[15, 9], [21, 6], [26, 10]], 1.3, '#a86b3c') + '<path d="M31 18Q38 18 37 26Q36 31 30 30" stroke="#2f1c10" stroke-width="2.5" fill="none"/>',
  ice: () => '<rect x="6" y="14" width="15" height="15" rx="3" fill="#dff3fb" stroke="#9fd2e6" transform="rotate(-10 13 21)"/><rect x="20" y="9" width="14" height="14" rx="3" fill="#eaf8fd" stroke="#9fd2e6" transform="rotate(12 27 16)"/><rect x="16" y="24" width="14" height="12" rx="3" fill="#dff3fb" stroke="#9fd2e6"/>',
  milk: () => '<rect x="9" y="8" width="22" height="28" rx="4" fill="#f4f7fb" stroke="#9aa8b8"/><rect x="9" y="16" width="22" height="12" fill="#4a8fd6"/><path d="M20 18Q16 23 20 26Q24 23 20 18Z" fill="#fff"/>'
};
const hIcon = k => `<svg viewBox="0 0 40 40" class="fd">${(HI[k] || (() => ''))()}</svg>`;

const HCOL = { beans: '#8e2a35', sago: '#6b3e1f', nata: '#f3efe0', kaong: '#e8b0a8', saba: '#f4d35e', langka: '#f2b705', macapuno: '#fffdf0', corn: '#f4d03f', milo: '#5a3520' };
const HDOT = { beans: '#b83a46', sago: '#3f2410', nata: '#fff', kaong: '#e63946', saba: '#b8902a', langka: '#c98f00', macapuno: '#e9e0c4', corn: '#fff3a0', milo: '#7a4a2b' };
const HBOT = ['beans', 'sago', 'nata', 'kaong', 'saba', 'langka', 'macapuno', 'corn', 'milo'];
function glassSvg(bag) {
  const L = y => 16 + (y - 18) * 16 / 118, R = y => 84 - (y - 18) * 16 / 118;
  const poly = (y1, y2, f) => `<polygon points="${L(y1)},${y1} ${R(y1)},${y1} ${R(y2)},${y2} ${L(y2)},${y2}" fill="${f}"/>`;
  const bot = HBOT.filter(k => bag[k]), bh = bot.length ? Math.min(15, 72 / bot.length) : 0;
  let y = 134, s = '';
  bot.forEach(k => {
    const y2 = y - bh; s += poly(y, y2, HCOL[k]);
    for (let i = 0; i < 7; i++) s += `<circle cx="${(L(y2) + (R(y2) - L(y2)) * (i + .5) / 7).toFixed(1)}" cy="${(y - bh / 2 + (i % 2 ? 2.2 : -2.2)).toFixed(1)}" r="2.5" fill="${k === 'kaong' && i % 2 ? '#76B041' : HDOT[k]}"/>`;
    y = y2;
  });
  if (bag.ice) {
    if (y > 22) s += poly(y, 22, '#e6f5fb') + `<path d="M30 ${(y + 22) / 2}l8 5M54 ${(y + 22) / 2 + 4}l9 -4M42 ${y - 6}l6 4" stroke="#b9dff0" stroke-width="1.4"/>`;
    y = 22; s += `<path d="M${L(22)} 22Q50 -6 ${R(22)} 22Z" fill="#f4fbff" stroke="#cfe9f2" stroke-width="1.5"/>`;
  } else if (bag.milk) { s += poly(y, y - 10, '#fffdf5'); }
  if (bag.milk && bag.ice) s += '<path d="M25 15Q37 6 50 12T75 12" stroke="#fffdf5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M29 17V32M69 17V36" stroke="#fffdf5" stroke-width="4" stroke-linecap="round"/>';
  if (bag.milo) s += '<path d="M28 20Q50 -10 72 20Z" fill="#5a3520"/>' + dots([[40, 8], [52, 3], [62, 9], [48, 13]], 1.6, '#7a4a2b');
  let tx = 28;
  [['flan', '<rect x="0" y="0" width="20" height="13" rx="3" fill="#f2c14e" stroke="#b8862a"/><path d="M0 5Q10 2 20 5V3Q20 0 17 0H3Q0 0 0 3Z" fill="#a8571c"/>'],
   ['ube', '<circle cx="10" cy="7" r="9" fill="#8a4fbf"/><circle cx="7" cy="4" r="2.4" fill="#fff" fill-opacity=".4"/>'],
   ['icecream', '<circle cx="10" cy="6" r="9" fill="#ffc2d6" stroke="#e08aa8"/><circle cx="7" cy="3" r="2.4" fill="#fff" fill-opacity=".6"/>']
  ].forEach(([k, g]) => { if (bag[k]) { s += `<g transform="translate(${tx} -2)">${g}</g>`; tx += 20; } });
  return `<svg viewBox="0 0 100 150"><path d="M14 16H86L70 134Q70 142 62 142H38Q30 142 30 134Z" fill="#ffffff" fill-opacity=".28"/>${s}<path d="M14 16H86L70 134Q70 142 62 142H38Q30 142 30 134Z" fill="none" stroke="#d6eef7" stroke-width="3" stroke-linejoin="round"/><path d="M24 24L34 118" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`;
}
const SHAVER = '<svg viewBox="0 0 60 70"><rect x="10" y="58" width="40" height="8" rx="3" fill="#7a8896"/><rect x="14" y="30" width="32" height="30" rx="4" fill="#9fb4c2" stroke="#5f7282" stroke-width="2"/><path d="M12 8H48L42 30H18Z" fill="#dff3fb" stroke="#9fd2e6" stroke-width="2"/><path d="M22 14l6 6M34 12l6 8" stroke="#b9dff0" stroke-width="2"/><rect x="22" y="40" width="16" height="10" rx="2" fill="#5f7282"/><g class="crank"><circle cx="52" cy="40" r="7" fill="#e63946" stroke="#7a1f27" stroke-width="2"/><rect x="50" y="34" width="4" height="12" fill="#fff" fill-opacity=".5"/></g></svg>';
const MILKCAN = '<svg viewBox="0 0 60 70"><rect x="14" y="14" width="32" height="48" rx="5" fill="#f4f7fb" stroke="#7d8fa3" stroke-width="2.5"/><rect x="14" y="26" width="32" height="22" fill="#4a8fd6"/><path d="M30 28Q22 37 30 44Q38 37 30 28Z" fill="#fff"/><ellipse cx="30" cy="14" rx="16" ry="4" fill="#cfd8e3" stroke="#7d8fa3" stroke-width="2"/><path d="M30 10V4" stroke="#7d8fa3" stroke-width="3"/></svg>';

/* ---------- orders ---------- */
const andList = p => p.length > 1 ? p.slice(0, -1).join(', ') + ' at ' + p[p.length - 1] : p[0];
function makeHaloOrder() {
  const tops = HALO_TOPS.filter(k => FD[k].lv <= S.level), drinks = ['corn', 'milo'].filter(k => FD[k].lv <= S.level);
  const base = [{ k: 'ice', qty: 1 }, { k: 'milk', qty: 1 }];
  if (drinks.length && Math.random() < .3) { const k = pick(drinks); return { kind: k, order: [{ k, qty: 1 }, ...base] }; }
  const n = rnd(1, Math.min(tops.length, 2 + Math.floor((S.level - 10) / 2)));
  return { kind: 'halo', order: [...[...tops].sort(() => Math.random() - .5).slice(0, n).map(k => ({ k, qty: 1 })), ...base] };
}
const topsOf = c => c.order.filter(l => HALO_TOPS.includes(l.k)).map(l => l.k);
const haloTl = c => c.kind === 'corn' ? 'isang mais con yelo' : c.kind === 'milo' ? 'isang Milo dinosaur' : 'halo-halo na may ' + andList(topsOf(c).map(k => FD[k].tl));
const haloTicket = c => c.kind === 'corn' ? 'Mais con yelo (corn, ice, milk)' : c.kind === 'milo' ? 'Milo dinosaur (Milo, ice, milk)' : `Halo-halo: ${topsOf(c).map(k => FD[k].n).join(', ')} + ice + milk`;
function haloTip(c) {
  const need = c.order.map(l => l.k), has = Object.keys(c.bag).filter(k => c.bag[k]);
  const extra = has.filter(k => !need.includes(k)), miss = need.filter(k => !c.bag[k]);
  if (extra.length) return `Too much! Tap ${FD[extra[0]].bin || FD[extra[0]].n} again to take it out.`;
  if (!miss.length) return 'Looks right. Press Hand over order.';
  const k = miss[0];
  return k === 'ice' ? 'Tap the ice shaver to make shaved ice.' : k === 'milk' ? 'Tap the milk can to pour milk.' : `Tap ${FD[k].bin || FD[k].n} to add it to the glass.`;
}
const haloUnlockText = k => k === 'corn' || k === 'milo' ? `${FD[k].n} is now on the menu at the Halo-Halo Stand, ₱${FD[k].p}. Add ${FD[k].bin.toLowerCase()}, shaved ice and milk.` : `${FD[k].n} is a new topping at the Halo-Halo Stand, ₱${FD[k].p}. Visit the stand from the Market Map.`;

/* ---------- the stand ---------- */
let sh = null;   // shaved ice in progress: { id, left }
function addItem(k) {
  const c = tgt(); if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting first.', 1);
  if (FD[k].lv > S.level) return toast(`Reach Level ${FD[k].lv} to unlock ${FD[k].n}.`, 1);
  if (c.bag[k]) delete c.bag[k]; else c.bag[k] = 1;
  act(); SND.grab(); draw();
}
function shave() {
  const c = tgt(); if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting first.', 1);
  if (c.bag.ice) { delete c.bag.ice; return draw(); }
  if (sh) return;
  sh = { id: c.id, left: 1400 }; act(); SND.shave(); $('#shaver').classList.add('busy'); draw();
}
function shaveStep() {
  if (!sh) return;
  sh.left -= 200; $('#shprog').style.width = (100 - sh.left / 14) + '%';
  if (sh.left > 0) return;
  const c = S.custs.find(x => x.id === sh.id);
  if (c && c.phase === 'order') c.bag.ice = 1;
  sh = null; $('#shaver').classList.remove('busy'); $('#shprog').style.width = '0'; draw();
}
function renderGlass(c) {
  const bg = c && c.phase === 'order' ? c.bag : {}, key = JSON.stringify(bg);
  if ($('#glass').dataset.k !== key) { $('#glass').dataset.k = key; $('#glass').innerHTML = glassSvg(bg); }
}
function updateHalo() {
  if (S.stand !== 1) return;
  const c = tgt(), on = c && c.phase === 'order';
  HALO_ALL.forEach(k => { const b = $('#hb_' + k); b.classList.toggle('locked', FD[k].lv > S.level); b.classList.toggle('has', !!(on && c.bag[k])); });
  $('#shaver').disabled = !on; $('#milkbtn').disabled = !on;
  $('#shaver').classList.toggle('done', !!(on && c.bag.ice)); $('#milkbtn').classList.toggle('done', !!(on && c.bag.milk));
}
(function buildHalo() {
  HALO_ALL.forEach(k => {
    const b = el('button', 'bin hbin', `${hIcon(k)}<div><span>${FD[k].bin || FD[k].n}</span><em>₱${FD[k].p}</em></div>`);
    b.id = 'hb_' + k; b.dataset.lock = `Level ${FD[k].lv}`; b.onclick = () => addItem(k); $('#htray').append(b);
  });
  $('#shaver').innerHTML = `${SHAVER}<span>Shave ice</span><i class="shbar"><b id="shprog"></b></i>`; $('#shaver').onclick = shave;
  $('#milkbtn').innerHTML = `${MILKCAN}<span>Pour milk</span>`; $('#milkbtn').onclick = () => addItem('milk');
  $('#glass').innerHTML = glassSvg({});
})();