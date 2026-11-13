'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const pick = a => a[Math.floor(Math.random() * a.length)], rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const up = s => s[0].toUpperCase() + s.slice(1);

/* ---------- DATA ---------- */
const FD = {
  fishball: { n: 'Fishball', p: 5, lv: 1, c: '#e3b778', tl: 'fishball' },
  kikiam: { n: 'Kikiam', p: 8, lv: 1, c: '#a8571c', tl: 'kikiam' },
  squid: { n: 'Squidballs', p: 10, lv: 2, c: '#f08a6c', tl: 'squidballs' },
  kwek: { n: 'Kwek-kwek', p: 10, lv: 3, c: '#f4a024', tl: 'kwek-kwek' },
  hotdog: { n: 'Hotdog', p: 15, lv: 4, c: '#c9362f', tl: 'hotdog' },
  banana: { n: 'Banana cue', p: 12, lv: 6, c: '#d9972f', tl: 'banana cue' },
  camote: { n: 'Camote cue', p: 10, lv: 7, c: '#e8943a', tl: 'camote cue' },
  turon: { n: 'Turon', p: 15, lv: 8, c: '#e0a640', tl: 'turon' },
  maruya: { n: 'Maruya', p: 18, lv: 9, c: '#e6b85c', tl: 'maruya' },
  palamig: { n: 'Palamig', p: 15, lv: 5, tl: 'palamig' }
};
const FRY = ['fishball', 'kikiam', 'squid', 'kwek', 'hotdog', 'banana', 'camote', 'turon', 'maruya'];
const SA = {
  sweet: { n: 'Sweet', c: '#7b2d12', tl: 'sweet sauce' },
  spicy: { n: 'Sweet & Spicy', c: '#c1121f', tl: 'tamis-anghang' },
  vinegar: { n: 'Spicy Vinegar', c: '#b9962a', tl: 'maanghang na suka' }
};
/* 40 levels. TH[L] = total pesos earned to reach level L. Levels 1-9 climb steadily, then each chapter of 10 levels has a flat cost. */
const MAXLV = 40, RAW = 4000, BURN = 9500, N = 8;
const TH = [0, 0];
for (let L = 2; L <= MAXLV; L++) TH[L] = TH[L - 1] + (L <= 9 ? 50 * L : L <= 19 ? 500 : L <= 29 ? 700 : 900);
const levelFor = e => { let L = 1; for (let i = 2; i <= MAXLV; i++) if (e >= TH[i]) L = i; return L; };
const STARTS = { 10: 1, 20: 2, 30: 3 };   /* level -> index of the stand that opens (see STANDS in map.js) */
const DM = { relaxed: .7, normal: 1, rush: 1.35 };
const DEF = { sfx: .7, amb: .35, diff: 'normal', easy: false, mute: false, unlockAll: false };
function loadBest() { try { return +localStorage.getItem('tusok-best') || 1; } catch (e) { return 1; } }
function saveBest() { try { localStorage.setItem('tusok-best', S.best); } catch (e) { /* storage blocked */ } }
/* progress is saved after every customer, so a 40 level game can be played over many sessions */
function saveGame() { try { localStorage.setItem('tusok-save', JSON.stringify({ earned: S.earned, served: S.served, mastered: S.mastered, stand: S.stand })); } catch (e) { /* storage blocked */ } }
function loadGame() {
  try {
    const d = JSON.parse(localStorage.getItem('tusok-save') || 'null');
    if (d) { S.earned = d.earned || 0; S.served = d.served || 0; S.mastered = !!d.mastered; S.level = levelFor(S.earned); const st = STANDS[d.stand || 0]; S.stand = st && st.built && S.level >= st.from ? (d.stand || 0) : 0; S.best = Math.max(S.best, S.level); }
  } catch (e) { /* ignore bad data */ }
}
function loadSet() { try { return { ...DEF, ...JSON.parse(localStorage.getItem('tusok-set') || '{}') }; } catch (e) { return { ...DEF }; } }
const CAP = l => l >= 4 ? 3 : l >= 2 ? 2 : 1;
const SEATS = { 1: [50], 2: [30, 70], 3: [17, 50, 83] };
const UNL = { 2: [{ k: 'squid' }, { cap: 2 }], 3: [{ k: 'kwek' }], 4: [{ k: 'hotdog' }, { cap: 3 }], 5: [{ k: 'palamig' }], 6: [{ k: 'banana' }], 7: [{ k: 'camote' }], 8: [{ k: 'turon' }], 9: [{ k: 'maruya' }] };
const DEN = [1, 5, 10, 20, 50, 100];
const SK = ['#f0bf94', '#e0a97c', '#c98f61', '#a8714a', '#8d5a3a'], HC = ['#2b1a12', '#1b120d', '#4a2c17', '#6b3e1f'];
/* 8 customer types, each with its own look and several Tagalog lines. o = order text, t = Ate/Kuya, n = player name */
const TYPES = [
  { n: 'School kid', mk: () => ({ style: pick(['short', 'long']), top: '#fff', extra: ['collar', 'id', 'strap'] }),
    say: (t, n, o) => pick([`${t} ${n}, pabili po ng ${o}!`, `Hi po, ${t} ${n}! ${up(o)} po, please.`]) },
  { n: 'Tricycle driver', mk: () => ({ style: 'cap', cap: '#2a9d8f', top: '#f4d35e', extra: ['mustache'] }),
    say: (t, n, o) => pick([`${t} ${n}, saglit lang po ako. Pabili ng ${o}!`, `Pahinga muna, ${t} ${n}. ${up(o)} nga po.`]) },
  { n: 'Neighbor on a break', mk: () => ({ style: 'bun', hair: '#c9c9c9', top: '#d6336c', extra: ['floral', 'glasses'] }),
    say: (t, n, o) => pick([`Magandang hapon, ${t} ${n}! Pabili nga ng ${o}.`, `${t} ${n}, para sa mga bata. ${up(o)} po.`]) },
  { n: 'Construction worker', mk: () => ({ style: 'short', top: '#e8e8e8', extra: ['vest', 'helmet'] }),
    say: (t, n, o) => pick([`Break time na, ${t} ${n}! ${up(o)} po.`, `${t} ${n}, gutom na gutom na ako. Pabili ng ${o}!`]) },
  { n: 'Office worker', mk: () => ({ style: 'short', top: '#cfe3ff', extra: ['tie', 'glasses'] }),
    say: (t, n, o) => pick([`${t} ${n}, merienda lang po. ${up(o)}, please.`, `Kumusta, ${t} ${n}! ${up(o)} po.`]) },
  { n: 'Teenager', mk: () => ({ style: 'long', top: '#7b6cf6', extra: ['headband'] }),
    say: (t, n, o) => pick([`Hi ${t} ${n}! Pabili po ng ${o}, ha?`, `Uy ${t} ${n}, ${o} nga po!`]) },
  { n: 'Lolo', mk: () => ({ style: 'short', hair: '#e8e8e8', top: '#6b8e5a', extra: ['glasses'] }),
    say: (t, n, o) => pick([`Magandang araw, ${t} ${n}. ${up(o)} po sana.`, `${t} ${n}, pabili ng ${o}. Salamat, ha.`]) },
  { n: 'Security guard', mk: () => ({ style: 'cap', cap: '#1d3557', top: '#4a6fa5', extra: ['mustache'] }),
    say: (t, n, o) => pick([`${t} ${n}, duty ko mamaya. Pabili ng ${o}.`, `Good afternoon po, ${t} ${n}. ${up(o)}!`]) }
];

/* ---------- SVG FOOD + MONEY ---------- */
function food(k) {
  if (k === 'palamig') return cup();
  if (FD[k] && FD[k].stand) return STAND_FN[standIdx(FD[k].stand)].icon(k);
  const c = FD[k].c; let s = '';
  if (k === 'fishball' || k === 'squid') s = [14, 30, 46].map(y => `<circle cx="30" cy="${y}" r="9.5" fill="${c}" stroke="#0003"/><circle cx="26.5" cy="${y - 3}" r="2.6" fill="#fff9"/>${k === 'squid' ? `<circle cx="34" cy="${y + 3}" r="1.4" fill="#8a2f1a"/>` : ''}`).join('');
  if (k === 'kikiam') s = [8, 25, 42].map(y => `<rect x="19" y="${y}" width="22" height="15" rx="6" fill="${c}" stroke="#0004"/><path d="M24 ${y + 5}h12M24 ${y + 10}h12" stroke="#d9904a" stroke-width="1.6"/>`).join('');
  if (k === 'kwek') s = [18, 42].map(y => `<circle cx="30" cy="${y}" r="13" fill="${c}" stroke="#a8661a" stroke-width="1.5"/><circle cx="25" cy="${y - 3}" r="2" fill="#ffe08a"/><circle cx="34" cy="${y + 4}" r="2.4" fill="#ffe08a"/>`).join('');
  if (k === 'hotdog') s = `<rect x="21" y="5" width="18" height="50" rx="9" fill="${c}" stroke="#6a1510"/><path d="M21 17l18 6M21 30l18 6M21 43l18 6" stroke="#6a1510" stroke-width="1.6"/><rect x="25" y="9" width="3" height="30" rx="1.5" fill="#fff6"/>`;
  if (k === 'banana') s = [16, 44].map(y => `<ellipse cx="30" cy="${y}" rx="9" ry="13" fill="${c}" stroke="#7a4a12"/><path d="M25 ${y - 8}Q23 ${y} 25 ${y + 8}" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="34" cy="${y - 3}" r="1.2" fill="#7a4a12"/><circle cx="33" cy="${y + 5}" r="1.2" fill="#7a4a12"/>`).join('');
  if (k === 'camote') s = [8, 24, 40].map(y => `<rect x="19" y="${y}" width="22" height="15" rx="5" fill="${c}" stroke="#a8591a"/><path d="M23 ${y + 4}h8" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/><circle cx="36" cy="${y + 10}" r="1.1" fill="#7a3a10"/><circle cx="29" cy="${y + 11}" r="1.1" fill="#7a3a10"/>`).join('');
  if (k === 'turon') s = `<rect x="20" y="5" width="20" height="50" rx="10" fill="${c}" stroke="#8a5a1a"/><path d="M20 16l20 6M20 28l20 6M20 40l20 6" stroke="#a8661a" stroke-width="1.5"/><path d="M25 10V40" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/><circle cx="35" cy="20" r="1.4" fill="#7a3a10"/><circle cx="32" cy="42" r="1.4" fill="#7a3a10"/>`;
  if (k === 'maruya') s = [17, 43].map(y => `<ellipse cx="30" cy="${y}" rx="14" ry="11" fill="${c}" stroke="#a8761f"/><path d="M20 ${y - 3}Q30 ${y - 9} 40 ${y - 3}" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="24" cy="${y + 4}" r="1.2" fill="#fff"/><circle cx="34" cy="${y + 5}" r="1.2" fill="#fff"/><circle cx="37" cy="${y - 1}" r="1.2" fill="#fff"/>`).join('');
  return `<svg viewBox="0 0 60 60" class="fd"><g transform="rotate(-35 30 30)"><rect x="28" y="-8" width="4" height="76" rx="2" fill="#d9b382"/>${s}</g></svg>`;
}
const cup = () => '<svg viewBox="0 0 40 60"><path d="M26 2L22 30" stroke="#e63946" stroke-width="4" stroke-linecap="round"/><path d="M6 14H34L30 56H10Z" fill="#ffe8cc" stroke="#7a5230" stroke-width="2"/><path d="M8 26H32L29.6 54H10.4Z" fill="#ff8c42"/><rect x="13" y="30" width="8" height="8" rx="2" fill="#fff8"/><rect x="21" y="38" width="7" height="7" rx="2" fill="#fff8"/></svg>';
const BILL = { 20: '#f4a261', 50: '#e5484d', 100: '#8a63d2', 200: '#5fb760' };
const bill = d => `<svg viewBox="0 0 80 40" class="mn"><rect x="1" y="1" width="78" height="38" rx="5" fill="${BILL[d]}" stroke="#0006" stroke-width="2"/><circle cx="14" cy="20" r="9" fill="#fff4"/><rect x="60" y="7" width="14" height="26" rx="3" fill="#fff3"/><text x="40" y="26" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">${d}</text></svg>`;
const coin = d => `<svg viewBox="0 0 40 40" class="mn"><circle cx="20" cy="20" r="18" fill="${d >= 10 ? '#d9b44a' : '#d5d8dc'}" stroke="#7a6a3a" stroke-width="2"/><circle cx="20" cy="20" r="13" fill="none" stroke="#fff8" stroke-width="1.5"/><text x="20" y="25" text-anchor="middle" font-size="${String(d).length > 2 ? 11 : 14}" font-weight="700" fill="#4a3a10" font-family="Fredoka,sans-serif">${d}</text></svg>`;
const money = d => BILL[d] ? bill(d) : coin(d);

/* ---------- STATE ---------- */
const S = { name: '', title: 'Ate', earned: 0, level: 1, served: 0, slots: Array(N).fill(null), custs: [], sel: null, give: [], uid: 0, on: false, paused: false, pauseAt: 0, nextSpawn: 0, queue: [], holds: 0, mastered: false, set: loadSet(), best: loadBest(), stand: 0, mc2: null };
let slotEls = [], bagKey = '';
const tgt = () => S.custs.find(c => c.id === S.sel);
const cookOf = k => (FD[k] && FD[k].cook) || [RAW, BURN];   /* [ready after, burnt after] in ms */
const state = s => { const a = Date.now() - s.t, [r, b] = cookOf(s.k); return a < r ? 'raw' : a < b ? 'ready' : 'burnt'; };
const act = () => $$('.arm').forEach(a => { a.classList.remove('act'); void a.offsetWidth; a.classList.add('act'); });
const sum = a => a.reduce((x, y) => x + y, 0);
function toast(m, bad) { if (bad) SND.err(); const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.x); toast.x = setTimeout(() => t.classList.remove('on'), 2400); }
/* pause system: every overlay (pause menu, level popups) holds the game; timers resume where they stopped */
function hold() { if (S.holds++ === 0) { S.pauseAt = Date.now(); S.paused = true; SND.sizzle(0); } }
function release() {
  if (--S.holds > 0) return; S.holds = 0;
  const dt = Date.now() - S.pauseAt;
  S.slots.forEach(s => { if (s) s.t += dt; }); (S.grill || []).forEach(s => { if (s) s.t += dt; }); S.nextSpawn += dt; S.paused = false;
}
function show(id) { $$('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }

/* ---------- BUILD UI ---------- */
function build() {
  $('#nena').innerHTML = ch({ style: 'bun', hair: '#8a8a8a', skin: '#e0aa80', top: '#76B041', extra: ['apron', 'glasses'] });
  for (const k in SA) {
    const b = el('button', 'jar', `<b class="lid"></b><b class="gl"><i></i></b><span>${SA[k].n}</span>`);
    b.id = 'j_' + k; b.style.setProperty('--c', SA[k].c);
    b.onclick = () => setSauce(k);
    $('#jars').append(b);
  }
  const jg = el('button', 'jugbtn', `<div class="jug"></div><span id="pl"></span>`);
  jg.id = 'pal'; jg.onclick = pour; $('#jars').append(jg);
  FRY.forEach(k => {
    const b = el('button', 'bin', `${food(k)}<div><span>${FD[k].n}</span><em>₱${FD[k].p}</em></div>`);
    b.id = 'b_' + k; b.dataset.lock = `Unlocks at Level ${FD[k].lv}`; b.onclick = () => fry(k);
    $('#tray').append(b);
  });
  for (let i = 0; i < N; i++) { const d = el('div', 'slot'); d.onclick = () => takeSlot(i); $('#slots').append(d); slotEls.push(d); }
  $('#cash').innerHTML = '<div class="cinfo" id="cinfo"></div><div class="cgrid" id="cgrid"></div><div class="cgive" id="cgive"></div><div class="crow"><button id="cgo">Give change</button><button id="cclr" class="gray">Clear</button></div>';
  DEN.forEach(d => { const b = el('button', 'den', d < 20 ? coin(d) : bill(d)); b.onclick = () => { if (payer()) { S.give.push(d); SND.clink(d); drawCash(); } }; $('#cgrid').append(b); });
  $('#cgo').onclick = giveChange;
  $('#cclr').onclick = () => { S.give = []; drawCash(); };
  $('#accept').onclick = () => show('s2');
  $('#srv').onclick = handOver;
  $('#clr').onclick = () => { const c = tgt(); if (c && c.phase === 'order') { c.bag = {}; c.got = null; draw(); } };
  $('#mc').onclick = nextPopup;
}
function start() {
  S.name = $('#nm').value.trim() || 'Juan';
  loadGame(); applyLook(); applyStand();
  show(''); $('#game').classList.add('on');
  document.body.classList.add('ingame'); S.on = true; S.nextSpawn = Date.now() + 700; SND.init(); SND.loop(); syncSet();
  draw(); setInterval(tick, 200); setInterval(bubbles, 260);
}

/* ---------- COOKING ---------- */
function fry(k) {
  const i = S.slots.findIndex(s => !s);
  if (i < 0) return toast('The kawali is full!', 1);
  S.slots[i] = { k, t: Date.now() }; act(); paintSlots(); SND.splash();
}
function takeSlot(i) {
  const s = S.slots[i]; if (!s) return;
  const st = state(s);
  if (st === 'raw') return toast('Still raw. Wait for the golden glow!', 1);
  if (st === 'burnt') { S.slots[i] = null; toast('Burnt! Thrown away.'); paintSlots(); return; }
  const c = tgt();
  if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting for food first.', 1);
  c.bag[s.k] = (c.bag[s.k] || 0) + 1; S.slots[i] = null; act(); paintSlots(); SND.grab(); draw();
}
function pour() {
  const c = tgt();
  if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting for food first.', 1);
  c.bag.palamig = (c.bag.palamig || 0) + 1; act(); SND.glug(); draw();
}
function setSauce(k) {
  const c = tgt();
  if (!c || c.phase !== 'order') return toast('Tap a customer who is still waiting for food first.', 1);
  c.got = c.got === k ? null : k; draw();
}
function paintSlots() {
  S.slots.forEach((s, i) => {
    const d = slotEls[i];
    if (!s) { d.className = 'slot'; d.innerHTML = ''; d.dataset.k = ''; return; }
    const st = state(s);
    if (st === 'ready' && !s.dn) { s.dn = 1; SND.ding(); setTimeout(draw, 0); }
    if (st === 'burnt' && !s.bn) { s.bn = 1; SND.burnt(); setTimeout(draw, 0); }
    d.className = 'slot ' + st;
    if (d.dataset.k !== s.k) { d.innerHTML = food(s.k); d.dataset.k = s.k; }
    d.style.setProperty('--p', st === 'raw' ? Math.min(100, (Date.now() - s.t) / cookOf(s.k)[0] * 100) + '%' : '100%');
  });
}
function bubbles() {
  if (S.paused || !S.slots.some(Boolean)) return;
  const b = el('div', 'bub'), z = 3 + Math.random() * 5;
  b.style.cssText = `width:${z}%;aspect-ratio:1;left:${15 + Math.random() * 65}%;top:${20 + Math.random() * 55}%`;
  $('#oil').append(b); setTimeout(() => b.remove(), 1100); if (Math.random() < .5) SND.pop();
}

/* ---------- CUSTOMERS ---------- */
const lineText = c => c.order.map(l => `${l.qty} ${FD[l.k].n}`).join(', ');
const orderTl = c => { const p = c.order.map(l => `${l.qty} ${FD[l.k].tl}`); return p.length > 1 ? p.slice(0, -1).join(', ') + ' at ' + p[p.length - 1] : p[0]; };
const orderText = c => c.kind ? STAND_FN[S.stand].tl(c) : orderTl(c);
const ticketText = c => c.kind ? STAND_FN[S.stand].ticket(c) : lineText(c);
function makeOrder() {
  const pool = Object.keys(FD).filter(k => FD[k].lv <= S.level && (FD[k].stand || 'cart') === 'cart');
  const nl = S.level < 2 ? 1 : S.level < 4 ? (Math.random() < .55 ? 2 : 1) : pick([1, 2, 2, 3]);
  return [...pool].sort(() => Math.random() - .5).slice(0, Math.min(nl, pool.length))
    .map(k => ({ k, qty: (k === 'fishball' || k === 'kikiam') ? rnd(2, 5) : rnd(1, 3) }));
}
function payFor(t) {
  if (t % 5 === 0 && Math.random() < .3) return t;
  const c = [20, 50, 100, 200].filter(x => x >= t);
  return c[Math.floor(Math.random() * Math.min(c.length, 2))];
}
function faceOf(c) { c.el.querySelector('.face').innerHTML = ch({ ...c.look, mood: c.mood }); }
function render(c) {
  const w = c.el, o = c.phase === 'order';
  w.querySelector('small').textContent = c.ty.n + (c.rushed ? ' (in a hurry)' : '');
  w.querySelector('.say').textContent = o ? c.line : c.payLine;
  w.querySelector('.ticket').textContent = o ? `Order: ${ticketText(c)}${c.sauce ? ' + ' + SA[c.sauce].n : ''}` : `Paid ₱${c.paid}`;
  w.querySelector('.pay').innerHTML = o ? '' : money(c.paid);
  faceOf(c);
}
function seatUp() { const cp = CAP(S.level); S.custs.forEach(c => c.el.style.left = SEATS[cp][c.seat] + '%'); }
function spawn() {
  const ty = pick(TYPES), look = ty.mk(); look.skin = pick(SK); look.hair = look.hair || pick(HC);
  look.eyes = pick(['round', 'round', 'dots', 'sparkle', 'lashes']); look.eyeColor = pick(['#3b2314', '#3b2314', '#6b3e1f', '#4a8fd6']);
  look.ac = pick(['#e63946', '#5aa9e6', '#f4d35e', '#8a63d2']); if (Math.random() < .3) look.face = ['freckles']; if (Math.random() < .2) look.ears = 'studs';
  const cp = CAP(S.level), seat = [0, 1, 2].slice(0, cp).find(s => !S.custs.some(c => c.seat === s));
  const ho = S.stand ? STAND_FN[S.stand].order() : null, order = ho ? ho.order : makeOrder(), kind = ho ? ho.kind : null, rushed = Math.random() < .25;
  const total = sum(order.map(l => FD[l.k].p * l.qty));
  const sauce = !kind && order.some(l => l.k !== 'palamig') && Math.random() < .7 ? pick(Object.keys(SA)) : null;
  const c = { id: ++S.uid, ty, look, order, kind, total, sauce, got: null, bag: {}, seat, rushed, phase: 'order', pat: 100, mood: 'neutral', tip: 0 };
  let line = (S.stand && STAND_FN[S.stand].greet ? STAND_FN[S.stand].greet() : '') + (rushed ? 'Nagmamadali po ako! ' : '') + ty.say(S.title, S.name, orderText(c));
  if (sauce) line += pick([` Lagyan po ng ${SA[sauce].tl}.`, ` Dagdagan mo po ng maraming ${SA[sauce].tl}!`]);
  c.line = line;
  c.el = el('div', 'cw enter', '<div class="bubble"><small></small><p class="say"></p><div class="ticket"></div><div class="pat"><i></i></div></div><div class="face"></div><div class="pay"></div>');
  c.el.onclick = () => { S.sel = c.id; S.give = []; draw(); };
  S.custs.push(c); $('#custs').append(c.el); render(c); seatUp();
  if (S.sel == null) S.sel = c.id;
  S.nextSpawn = Date.now() + (S.custs.length ? rnd(5000, 9000) / DM[S.set.diff] : 800); SND.bell(); draw();
}
function removeCust(c, mood) {
  if (mood === 'angry') SND.sad();
  c.mood = mood; faceOf(c); c.el.classList.add('leave'); const e = c.el; setTimeout(() => e.remove(), 850);
  S.custs = S.custs.filter(x => x !== c); S.give = [];
  S.nextSpawn = Math.max(S.nextSpawn, Date.now() + 1800); draw();
}
function handOver() {
  const c = tgt(); if (!c || c.phase !== 'order') return;
  const ks = Object.keys(c.bag).filter(k => c.bag[k] > 0);
  if (ks.length !== c.order.length || !c.order.every(l => c.bag[l.k] === l.qty)) return toast(`That bag is not right. They want ${ticketText(c)}.`, 1);
  if (c.sauce && c.got !== c.sauce) return toast(`Wrong sauce. They want ${SA[c.sauce].n}.`, 1);
  c.phase = 'pay'; c.paid = payFor(c.total); c.change = c.paid - c.total;
  c.tip = (c.pat > 50 ? Math.ceil(c.total * .15) : 0) + (c.rushed && c.pat > 40 ? 5 : 0);
  c.pat = 100; c.payLine = pick([`${S.title} ${S.name}, eto po ang bayad ko.`, `Eto po ang ₱${c.paid}. Salamat po!`, `Bayad po! Pasensya na sa malaki.`]);
  S.give = []; render(c); SND.bill(); toast('Order handed over! Now give the right change.'); draw();
}
function giveChange() {
  const c = payer(); if (!c) return;
  if (sum(S.give) !== c.change) { S.give = []; drawCash(); return toast('That is not the right change. Try again.', 1); }
  S.earned += c.total + c.tip; S.served++; SND.kaching();
  toast(`Thank you! +₱${c.total}${c.tip ? ` and ₱${c.tip} tip` : ''}`);
  const old = S.level; S.level = levelFor(S.earned);
  if (S.level > S.best) { S.best = S.level; saveBest(); }
  removeCust(c, 'happy');
  levelUp(old); saveGame();
}
/* one popup per level up (kept short after level 9), plus unlock, accessory, chapter and victory popups */
function levelUp(old) {
  for (let l = old + 1; l <= S.level; l++) {
    const extras = (UNL[l] || []).length || accNew(l).length;
    if (STARTS[l]) S.queue.push({ t: 'chap', l });
    else if (l <= 9 || extras) S.queue.push({ t: 'lv', l });
    else setTimeout(() => { toast(`Level ${l}!`); SND.fanfare(); }, 2300);
    (UNL[l] || []).forEach(u => S.queue.push({ t: 'un', u, l }));
    if (accNew(l).length) S.queue.push({ t: 'acc', l });
  }
  if (!S.mastered && S.level >= MAXLV) { S.mastered = true; S.queue.push({ t: 'win' }); }
  if (S.queue.length) { hold(); nextPopup(); }
}
const payer = () => { const c = tgt(); return c && c.phase === 'pay' ? c : null; };

/* ---------- LEVEL POPUPS ---------- */
function nextPopup() {
  const q = S.queue.shift();
  if (!q) {
    $('#modal').classList.remove('on');
    release(); seatUp(); draw(); return;
  }
  let h, ic, d;
  const toMap = q.t === 'chap' && STANDS[STARTS[q.l]].built;
  $('#mc2').style.display = q.t === 'win' || toMap ? 'inline-block' : 'none';
  $('#mc2').textContent = toMap ? 'Open map' : 'Main menu';
  S.mc2 = toMap ? () => { S.queue.length = 0; $('#modal').classList.remove('on'); release(); openMap(); } : null;
  ({ lv: () => SND.fanfare(), un: () => SND.unlock(), acc: () => SND.unlock(), chap: () => SND.fanfare(), win: () => SND.win() })[q.t]();
  if (q.t === 'win') {
    h = 'You mastered the market!';
    ic = '<svg viewBox="0 0 80 80"><path d="M22 10h36v18a18 18 0 0 1-36 0z" fill="#f4c430" stroke="#a8661a" stroke-width="3"/><path d="M22 14H10q0 18 14 20M58 14h12q0 18-14 20" fill="none" stroke="#a8661a" stroke-width="4"/><rect x="34" y="44" width="12" height="14" fill="#e0a82e"/><rect x="24" y="58" width="32" height="10" rx="3" fill="#a8661a"/></svg>';
    d = `Level ${MAXLV}! You earned ₱${S.earned} and served ${S.served} customers. Aling Linda says: "Ikaw na ang pinakamagaling kong katulong, ${S.name}!" Keep playing with faster customers, or head back to the menu.`;
  } else if (q.t === 'chap') {
    const i = STARTS[q.l], st = STANDS[i]; h = `Chapter ${i} complete!`; ic = standIcon(i);
    d = st.built ? `The ${st.name} is open! Open the map to visit it, or find it later in the Pause menu.` : `Aling Linda is building the ${st.name}. It opens in the next update. Keep leveling up and it will be ready.`;
  } else if (q.t === 'acc') {
    const n = accNew(q.l); h = 'New styles unlocked!'; ic = previewWith(n[0].key, n[0].val);
    d = `You can now wear: ${n.map(i => i.label).join(', ')}. Open Customize in the Pause menu to try ${n.length > 1 ? 'them' : 'it'} on.`;
  } else if (q.t === 'lv') {
    h = `Level ${q.l - 1} complete!`; ic = `<div class="badge">${q.l}</div>`;
    d = `You are now Level ${q.l}, ${S.title} ${S.name}. Ang galing mo! Aling Linda is proud of you.`;
  } else if (q.u.cap) {
    h = 'More customers!'; ic = ch({ style: 'long', top: '#7b6cf6', extra: ['headband'], skin: '#e0a97c' });
    d = `The counter now has ${q.u.cap} spots. Tap a customer to switch between their orders.`;
  } else {
    const k = q.u.k; h = 'You unlocked ' + FD[k].n + '!'; ic = food(k);
    d = k === 'palamig' ? `Tap the palamig jug on the counter to fill a cup. ₱${FD[k].p} each.` : FD[k].stand ? STAND_FN[standIdx(FD[k].stand)].unlock(k) : `${FD[k].n} is now in the food bins, ₱${FD[k].p} each. Customers will start ordering it.`;
  }
  $('#mt').textContent = h; $('#mi').innerHTML = ic; $('#mi').classList.toggle('tall', q.t === 'acc'); $('#md').textContent = d;
  $('#mc').textContent = q.t === 'win' ? 'Keep playing' : S.queue.length ? 'Next' : 'Continue';
  $('#modal').classList.add('on');
}

/* ---------- LOOP + RENDER ---------- */
function tick() {
  if (!S.on || S.paused) return;
  SND.sizzle(S.slots.filter(s => s && state(s) !== 'burnt').length);
  S.custs.slice().forEach(c => {
    c.pat -= (c.rushed ? .55 : .33) * DM[S.set.diff] * (S.mastered ? 1.15 : 1) * (1 + .008 * Math.max(0, S.level - 5));
    const bar = c.el.querySelector('.pat i');
    bar.style.width = Math.max(0, c.pat) + '%'; bar.style.background = c.pat < 35 ? '#d9534f' : c.pat < 60 ? '#f4a261' : '';
    const m = c.pat < 35 ? 'angry' : 'neutral';
    if (m !== c.mood) { c.mood = m; faceOf(c); }
    if (c.pat <= 0) { toast(`${c.ty.n} got tired of waiting and left.`); removeCust(c, 'angry'); }
  });
  if (S.custs.length < CAP(S.level) && Date.now() >= S.nextSpawn) spawn();
  paintSlots(); if (S.stand) STAND_FN[S.stand].tick();
}
function drawCash() {
  const c = payer();
  $('#cinfo').innerHTML = !c ? '<span>Waiting for a customer to pay. Hand over an order first.</span>'
    : `${money(c.paid)}<ul>${c.order.map(l => `<li>${l.qty} × ${FD[l.k].n} (₱${FD[l.k].p})</li>`).join('')}${S.set.easy ? `<li><b>Total ₱${c.total}, change ₱${c.change}</b></li>` : ''}</ul>`;
  $('#cgive').innerHTML = S.give.length ? '' : '<small>Tap bills and coins to build the change</small>';
  S.give.forEach((d, i) => { const b = el('button', '', '₱' + d); b.onclick = () => { S.give.splice(i, 1); drawCash(); }; $('#cgive').append(b); });
  if (S.give.length) $('#cgive').append(el('b', '', '= ₱' + sum(S.give)));
  $('#cgo').disabled = !c;
}
function draw() {
  if (!S.custs.some(c => c.id === S.sel)) { const c = S.custs.find(x => x.phase === 'order') || S.custs[0]; S.sel = c ? c.id : null; }
  S.custs.forEach(c => c.el.classList.toggle('sel', c.id === S.sel));
  $('#lv').textContent = S.level; $('#cn').textContent = S.earned; $('#sv').textContent = S.served; $('#cc').textContent = `${S.custs.length}/${CAP(S.level)}`;
  const lo = TH[S.level], hi = TH[S.level + 1];
  $('#xp').style.width = S.mastered || !hi ? '100%' : Math.min(100, (S.earned - lo) / (hi - lo) * 100) + '%';
  $('#nx').textContent = S.mastered || !hi ? 'Market Master!' : `₱${hi} for Level ${S.level + 1}`;
  FRY.forEach(k => $('#b_' + k).classList.toggle('locked', FD[k].lv > S.level));
  $('#pal').disabled = S.level < 5; $('#pl').textContent = S.level < 5 ? 'Palamig (Lv 5)' : 'Palamig ₱15';
  const c = tgt(), bg = c && c.phase === 'order' ? c.bag : {}, ks = Object.keys(bg).filter(k => bg[k] > 0), got = c && c.phase === 'order' ? c.got : null;
  for (const k in SA) $('#j_' + k).classList.toggle('sel', got === k);
  const key = JSON.stringify([bg, got, c && c.id]);
  if (S.stand && STAND_FN[S.stand].render) STAND_FN[S.stand].render(c);
  else if (key !== bagKey) {
    bagKey = key;
    const inner = ks.map(k => food(k).repeat(Math.min(bg[k], 4)) + `<b>×${bg[k]}</b>`).join('');
    $('#bag').innerHTML = `<div class="bagb ${ks.length ? '' : 'empty'}"><div class="inner">${inner}</div><div class="front"></div>${got ? `<span class="sau" style="--c:${SA[got].c}">${SA[got].n}</span>` : ''}</div>`;
  }
  $('#srv').disabled = !(c && c.phase === 'order');
  $('#tip').textContent = S.stand && c && c.phase === 'order' ? STAND_FN[S.stand].tip(c) : !S.custs.length ? 'Waiting for the next customer...'
    : !c ? 'Tap a customer to work on their order.'
    : c.phase === 'pay' ? 'Give the exact change from the cash drawer on the right.'
    : !ks.length && !S.slots.some(Boolean) ? 'Tap a food bin on the left to start frying.'
    : !ks.length ? 'Tap food that glows golden to put it in the selected customer\'s bag.'
    : c.sauce && !c.got ? 'Tap the sauce jar the customer asked for.'
    : 'Check the order note, then press Hand over order.';
  if (S.stand) STAND_FN[S.stand].update();
  drawCash();
}
build();