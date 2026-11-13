'use strict';
/* Market map: every stand, which are unlocked, and where you are. Loaded after creator.js. */
const STANDS = [
  { id: 'cart', name: 'Tusok-Tusok Stand', from: 1, to: 9, built: true, c: '#E76F51' },
  { id: 'halo', name: 'Halo-Halo Stand', from: 10, to: 19, built: false, c: '#a35fc0' },
  { id: 'ihaw', name: 'Ihawan', from: 20, to: 29, built: false, c: '#c1442e' },
  { id: 'xmas', name: 'Simbang Gabi Stand', from: 30, to: 39, built: false, c: '#2a9d8f' }
];
const SPOTS = [[120, 222], [320, 170], [540, 216], [700, 122]];
const ROAD = 'M-20 300C130 300 170 262 260 262S410 306 520 292S650 214 820 210';
const standOf = l => Math.min(3, l <= 9 ? 0 : l <= 19 ? 1 : l <= 29 ? 2 : 3);
const STAND_FN = {};   /* each stand registers: order tl ticket tip update tick reset icon unlock (+ optional render greet clr enter) */
const standIdx = id => STANDS.findIndex(s => s.id === id);
const standState = i => S.level < STANDS[i].from ? 'locked' : !STANDS[i].built ? 'soon' : i === S.stand ? 'here' : 'open';

/* one stall, centered at 0,0 on the ground line. Also used as the chapter popup icon. */
function stallSvg(i) {
  const s = STANDS[i], c = s.c;
  let aw = '';
  for (let k = 0; k < 8; k++) { const x0 = -56 + k * 14, b0 = -48 + k * 12; aw += `<path d="M${x0} -66H${x0 + 14}L${b0 + 12} -44H${b0}Z" fill="${k % 2 ? '#FAF3DD' : c}"/>`; }
  const icon = [
    `<ellipse cx="0" cy="-8" rx="27" ry="9" fill="#2b2b2b"/><ellipse cx="0" cy="-11" rx="21" ry="6" fill="#f4a261"/><circle cx="-8" cy="-12" r="4" fill="#e3b778"/><circle cx="2" cy="-10" r="4" fill="#e3b778"/><circle cx="11" cy="-13" r="4" fill="#e3b778"/>`,
    `<path d="M-13 -38L13 -38L9 -4H-9Z" fill="#fff" fill-opacity=".75" stroke="#4a2515" stroke-width="2"/><path d="M-12 -32H12L11 -25H-11Z" fill="#a35fc0"/><path d="M-11 -23H11L10 -16H-10Z" fill="#ffd166"/><path d="M-10 -14H10L9 -8H-9Z" fill="#ff8fab"/><circle cx="0" cy="-41" r="4" fill="#e63946"/>`,
    `<rect x="-30" y="-14" width="60" height="10" rx="3" fill="#3a2a22"/><rect x="-26" y="-12" width="52" height="4" fill="#e63946"/>` + [-18, -6, 6, 18].map(x => `<path d="M${x} -10L${x + 6} -32" stroke="#d9b382" stroke-width="2.5"/><circle cx="${x + 4}" cy="-24" r="3" fill="#a8571c"/>`).join(''),
    `<ellipse cx="-14" cy="-10" rx="12" ry="7" fill="#b5651d"/><ellipse cx="-14" cy="-13" rx="10" ry="5" fill="#76B041"/><ellipse cx="14" cy="-10" rx="12" ry="7" fill="#b5651d"/><ellipse cx="14" cy="-13" rx="10" ry="5" fill="#fff"/><path d="M0 -36L3 -28L11 -28L5 -23L7 -15L0 -20L-7 -15L-5 -23L-11 -28L-3 -28Z" fill="#f4c430" stroke="#e63946" stroke-width="1.5"/>`
  ][i];
  const smoke = i === 2 ? '<g class="puff"><circle cx="-8" cy="-48" r="5" fill="#fff" fill-opacity=".7"/></g><g class="puff p2"><circle cx="10" cy="-52" r="6" fill="#fff" fill-opacity=".6"/></g>' : '';
  const lights = i === 3 ? [-48, -24, 0, 24, 48].map((x, k) => `<circle cx="${x}" cy="-40" r="3" fill="${['#e63946', '#f4d35e', '#76B041'][k % 3]}"/>`).join('') : '';
  return `<g class="art"><ellipse cx="0" cy="42" rx="64" ry="9" fill="#000" fill-opacity=".18"/><rect x="-46" y="-66" width="5" height="56" fill="#7a4a2b"/><rect x="41" y="-66" width="5" height="56" fill="#7a4a2b"/><rect x="-48" y="-4" width="96" height="46" rx="6" fill="#a56a38" stroke="#4a2515" stroke-width="3"/><rect x="-52" y="-10" width="104" height="10" rx="4" fill="#e0a66b" stroke="#4a2515" stroke-width="3"/>${icon}${aw}<path d="M-56 -66H56L48 -44H-48Z" fill="none" stroke="#4a2515" stroke-width="2.5" stroke-linejoin="round"/>${lights}${smoke}<rect x="-62" y="-94" width="124" height="22" rx="8" fill="#fff" stroke="#4a2515" stroke-width="2.5"/><text x="0" y="-78.5" text-anchor="middle" font-size="${s.name.length > 15 ? 10 : 12}" font-weight="700" fill="#4a2515" font-family="Fredoka,Arial,sans-serif">${s.name}</text></g>`;
}
const standIcon = i => `<svg viewBox="-66 -98 132 144" class="stallicon">${stallSvg(i)}</svg>`;

function drawMap() {
  const trees = [[40, 70], [215, 90], [430, 66], [610, 70], [770, 72], [60, 318], [430, 322], [760, 300]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-3" y="0" width="6" height="14" fill="#7a4a2b"/><circle cx="0" cy="-6" r="14" fill="#4f9d4a"/><circle cx="-6" cy="-2" r="9" fill="#5fb257"/></g>`).join('');
  const jeep = `<g><animateMotion dur="18s" repeatCount="indefinite" path="${ROAD}"/><rect x="-24" y="-18" width="48" height="18" rx="6" fill="#e63946" stroke="#4a2515" stroke-width="2"/><rect x="-18" y="-14" width="10" height="7" fill="#cfe9f2"/><rect x="-5" y="-14" width="10" height="7" fill="#cfe9f2"/><rect x="8" y="-14" width="10" height="7" fill="#cfe9f2"/><rect x="-24" y="-5" width="48" height="3" fill="#f4d35e"/><circle cx="-14" cy="1" r="5" fill="#2b2b2b"/><circle cx="14" cy="1" r="5" fill="#2b2b2b"/></g>`;
  const stalls = STANDS.map((s, i) => {
    const st = standState(i), [x, y] = SPOTS[i];
    const lock = st === 'locked' ? `<g transform="translate(60 -92)"><circle r="12" fill="#4a2515"/><rect x="-6" y="-2" width="12" height="9" rx="2" fill="#f4d35e"/><path d="M-4 -2V-5Q-4 -10 0 -10Q4 -10 4 -5V-2" stroke="#f4d35e" stroke-width="2.4" fill="none"/></g>` : '';
    return `<g class="stall ${st}" data-i="${i}" transform="translate(${x} ${y})">${stallSvg(i)}${lock}</g>`;
  }).join('');
  const [px, py] = SPOTS[S.stand];
  const pin = `<g transform="translate(${px} ${py - 118})"><g class="pin"><path d="M0 24L-9 10H9Z" fill="#e76f51"/><circle cx="0" cy="-8" r="22" fill="#fff" stroke="#e76f51" stroke-width="4"/><g clip-path="url(#pinclip)">${mini(crOpts()).replace('class="ch"', '').replace('<svg ', '<svg x="-18" y="-24" width="36" height="28" ')}</g></g></g>`;
  $('#mapsvg').innerHTML = `<svg viewBox="0 0 800 340"><defs><clipPath id="pinclip"><circle cx="0" cy="-8" r="19"/></clipPath></defs><rect width="800" height="340" fill="#9bd06b"/><circle cx="160" cy="330" r="120" fill="#8ec36a"/><circle cx="640" cy="40" r="110" fill="#8ec36a"/>${trees}<path d="${ROAD}" fill="none" stroke="#b7a583" stroke-width="54" stroke-linecap="round"/><path d="${ROAD}" fill="none" stroke="#d8c8a8" stroke-width="46" stroke-linecap="round"/><path d="${ROAD}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-dasharray="12 12"/>${jeep}${stalls}${pin}</svg>`;
  const c = standOf(S.level), s = STANDS[c], nextTH = TH[Math.min(MAXLV, s.to + 1)];
  $('#maplv').textContent = `Level ${S.level} of ${MAXLV}`;
  $('#mapchap').textContent = S.mastered ? 'Market Master!' : `Chapter ${c + 1}: ${s.name}`;
  $('#mapbar').style.width = (S.mastered ? 100 : Math.max(0, Math.min(100, (S.earned - TH[s.from]) / (nextTH - TH[s.from]) * 100))) + '%';
  $('#maplist').innerHTML = STANDS.map((t, i) => {
    const st = standState(i), label = { here: 'You are here', open: 'Open', soon: 'Opening soon', locked: `Unlocks at Level ${t.from}` }[st];
    return `<button class="mcx ${st}" data-i="${i}"><b>${t.name}</b><small>Levels ${t.from} to ${t.to}</small><span>${label}</span></button>`;
  }).join('');
}
function pickStand(i) {
  const st = standState(i), s = STANDS[i];
  if (st === 'locked') return toast(`Reach Level ${s.from} to unlock the ${s.name}.`, 1);
  if (st === 'soon') return toast(`The ${s.name} opens in the next update. Keep leveling up!`);
  if (i !== S.stand) switchStand(i);
  closeMap();
}
function openMap() { if (!S.on) return; hold(); drawMap(); ov('mapm', true); }
function closeMap() { if (!isOn('mapm')) return; ov('mapm', false); release(); }
$('#mapm').addEventListener('click', e => { const g = e.target.closest('[data-i]'); if (g) pickStand(+g.dataset.i); });

/* stands: the counter, customers, cash drawer and map are shared. Only the front table changes. */
function applyStand() {
  $('#scene').dataset.stand = STANDS[S.stand].id;
  $('#clr').textContent = (STAND_FN[S.stand] && STAND_FN[S.stand].clr) || 'Empty bag';
  S.sel = null; bagKey = ''; draw();
}
function switchStand(i) {
  S.custs.forEach(c => c.el.remove()); S.custs = []; S.slots.fill(null); S.give = [];
  Object.values(STAND_FN).forEach(f => f.reset && f.reset());
  S.stand = i; S.nextSpawn = Date.now() + 900;
  applyStand(); paintSlots(); saveGame(); toast(`Welcome to the ${STANDS[i].name}!`);
  if (STAND_FN[i] && STAND_FN[i].enter) STAND_FN[i].enter();
}