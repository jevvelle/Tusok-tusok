'use strict';
/* Character renderer. ch(o) = head, shoulders and arms. chFull(o, viewBox) = full body with pants and shoes.
   Options: skin hair style top accent ac eyes eyeColor smile face[] beard glasses hat neck ears bottom bottomColor shoes shoeColor extra[] mood */
const mix = (h, t, a) => {
  if (!/^#[0-9a-f]{6}$/i.test(h)) return h;
  const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), A = p(h), B = p(t);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * a).toString(16).padStart(2, '0')).join('');
};
const dk = (h, a = .22) => mix(h, '#000000', a), lt = (h, a = .3) => mix(h, '#ffffff', a);

/* ---------- hair: b = behind the body, f = in front of the face ---------- */
function hairParts(st, h, tie) {
  const s = dk(h, .3), light = lt(h, .35);
  const shine = `<path d="M44 16Q57 9 73 14" stroke="${light}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>`;
  const dome = `<path d="M31 44Q28 7 60 7Q92 7 89 44Q80 28 60 30Q40 28 31 44Z" fill="${h}"/>`;
  const dots = a => a.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${h}" stroke="${s}" stroke-width="1"/>`).join('');
  let b = '', f = dome + shine;
  if (st === 'straight') {
    b = `<path d="M29 44Q24 8 60 8Q96 8 91 44V104H29Z" fill="${h}"/>`;
    f = dome + `<rect x="27" y="66" width="13" height="42" rx="6" fill="${h}"/><rect x="80" y="66" width="13" height="42" rx="6" fill="${h}"/>` + shine;
  } else if (st === 'bob') {
    b = `<path d="M27 46Q22 4 60 4Q98 4 93 46V82Q93 90 84 90H36Q27 90 27 82Z" fill="${h}"/>`;
    f = `<path d="M29 46Q26 4 60 4Q94 4 91 46V38Q76 24 60 34Q44 24 29 38Z" fill="${h}"/><rect x="27" y="38" width="11" height="44" rx="5.5" fill="${h}"/><rect x="82" y="38" width="11" height="44" rx="5.5" fill="${h}"/>` + shine;
  } else if (st === 'sidepart') {
    f = `<path d="M30 46Q26 7 62 7Q94 9 90 46Q88 29 66 27Q44 25 36 41Q33 45 30 46Z" fill="${h}"/><path d="M66 27Q58 20 52 11" stroke="${s}" stroke-width="1.5" fill="none"/>` + shine;
  } else if (st === 'curly') {
    b = dots([[34, 26, 12], [46, 14, 12], [60, 10, 12], [74, 14, 12], [86, 26, 12], [29, 44, 9], [91, 44, 9], [26, 34, 8], [94, 34, 8]]);
    f = dome + dots([[35, 25, 9], [44, 17, 9], [54, 13, 9], [65, 12, 9], [75, 15, 9], [84, 23, 9], [88, 34, 7], [32, 36, 7], [45, 31, 7], [57, 29, 6], [69, 29, 6], [80, 32, 7]]);
  } else if (st === 'spiky') {
    f = dome + `<path d="M31 42L29 18L40 28L43 6L54 24L60 2L67 24L77 6L80 28L91 18L89 42Q80 28 60 30Q40 28 31 42Z" fill="${h}" stroke="${s}" stroke-width="1" stroke-linejoin="round"/>`;
  } else if (st === 'wavy') {
    b = `<path d="M30 44Q20 58 29 70Q20 80 30 92L40 92Q34 70 41 46ZM90 44Q100 58 91 70Q100 80 90 92L80 92Q86 70 79 46Z" fill="${h}"/>`;
    f = `<path d="M31 44Q28 7 60 7Q92 7 89 44Q84 34 78 32Q72 42 64 32Q56 42 48 32Q40 34 31 44Z" fill="${h}"/>` + shine;
  } else if (st === 'pigtails') {
    b = `<ellipse cx="20" cy="64" rx="9" ry="17" fill="${h}"/><ellipse cx="100" cy="64" rx="9" ry="17" fill="${h}"/><rect x="17" y="46" width="14" height="6" rx="3" fill="${tie}"/><rect x="89" y="46" width="14" height="6" rx="3" fill="${tie}"/>`;
  } else if (st === 'ponytail') {
    b = `<path d="M84 30Q116 34 110 84Q98 72 96 56Q92 44 84 42Z" fill="${h}"/><rect x="82" y="32" width="9" height="13" rx="4" fill="${tie}"/>`;
  } else if (st === 'braid') {
    f += `<path d="M86 34Q100 40 98 54Z" fill="${h}"/>` + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${98 + (i % 2 ? 3 : -3)}" cy="${54 + i * 9}" rx="6" ry="6.5" fill="${h}" stroke="${s}" stroke-width="1"/>`).join('') + `<rect x="92" y="106" width="12" height="5" rx="2" fill="${tie}"/>`;
  } else if (st === 'bun') {
    b = `<circle cx="60" cy="8" r="11" fill="${h}" stroke="${s}" stroke-width="1"/>`;
  } else if (st === 'twinbuns') {
    b = `<circle cx="36" cy="12" r="10" fill="${h}" stroke="${s}" stroke-width="1"/><circle cx="84" cy="12" r="10" fill="${h}" stroke="${s}" stroke-width="1"/>`;
  }
  return { b, f };
}

/* ---------- eyes: big and glossy ---------- */
function eyesSvg(style, ec, sk) {
  const y = 47;
  const eye = (cx, side) => {
    const sc = `<ellipse cx="${cx}" cy="${y}" rx="6.2" ry="6.8" fill="#fff"/>`;
    const iris = r => `<circle cx="${cx}" cy="${y + .6}" r="${r}" fill="${ec}"/><circle cx="${cx}" cy="${y + .6}" r="${r * .52}" fill="#140c0a"/>`;
    const glints = `<circle cx="${cx + 1.7}" cy="${y - 2}" r="2" fill="#fff"/><circle cx="${cx - 1.8}" cy="${y + 2.6}" r="1" fill="#fff"/>`;
    const lid = `<path d="M${cx - 6.2} ${y - 1.6}Q${cx} ${y - 8.2} ${cx + 6.2} ${y - 1.6}" stroke="#2b1a12" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>`;
    if (style === 'dots') return `<circle cx="${cx}" cy="${y}" r="4.8" fill="#2b1a12"/><circle cx="${cx + 1.5}" cy="${y - 1.7}" r="1.7" fill="#fff"/><circle cx="${cx - 1.4}" cy="${y + 1.8}" r=".8" fill="#fff"/>`;
    if (style === 'happy') return `<path d="M${cx - 5.5} ${y + 3}Q${cx} ${y - 5} ${cx + 5.5} ${y + 3}" stroke="#2b1a12" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (style === 'sleepy') return `${sc}${iris(4.6)}${glints}<path d="M${cx - 7} ${y + .5}Q${cx} ${y - 3} ${cx + 7} ${y + .5}V${y - 9}H${cx - 7}Z" fill="${sk}"/><path d="M${cx - 6.4} ${y + .4}Q${cx} ${y - 2.6} ${cx + 6.4} ${y + .4}" stroke="#2b1a12" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    if (style === 'sparkle') return `${sc}${iris(5)}<circle cx="${cx + 1.8}" cy="${y - 2.2}" r="2.3" fill="#fff"/><circle cx="${cx - 2}" cy="${y + 2.6}" r="1.2" fill="#fff"/>${lid}`;
    const lash = style === 'lashes' ? `<path d="M${cx + side * 5.8} ${y - 3}L${cx + side * 8.6} ${y - 5.4}M${cx + side * 6.3} ${y - .4}L${cx + side * 9.3} ${y - 1.2}" stroke="#2b1a12" stroke-width="1.4" stroke-linecap="round"/>` : '';
    return `${sc}${iris(4.8)}${glints}${lid}${lash}`;
  };
  return `<g class="eyes" style="animation-delay:-${(Math.random() * 5).toFixed(1)}s">${eye(48, -1)}${eye(72, 1)}</g>`;
}

const MOUTHS = {
  grin: '<path d="M52 58Q60 70 68 58Z" fill="#b5413a"/><path d="M56 63Q60 60.5 64 63Q60 65.2 56 63Z" fill="#ff8a8a"/>',
  smile: '<path d="M54 59Q60 65 66 59" stroke="#8a2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>',
  smirk: '<path d="M54 61Q60 63 67 58" stroke="#8a2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>',
  tongue: '<path d="M57 61.5Q60 70 63 61.5Z" fill="#ff7a8a"/><path d="M60 62V66" stroke="#e0566a" stroke-width=".8"/><path d="M54 59Q60 63.5 66 59" stroke="#8a2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
};

/* ---------- hats and head accessories ---------- */
function hatSvg(hat, c) {
  const d = dk(c, .2);
  switch (hat) {
    case 'cap': return `<path d="M31 36Q33 6 60 6Q87 6 89 36Z" fill="${c}"/><path d="M28 33H92Q95 41 82 41H28Z" fill="${d}"/><circle cx="60" cy="6" r="3" fill="${d}"/>`;
    case 'beanie': return `<path d="M30 34Q30 5 60 5Q90 5 90 34Z" fill="${c}"/><rect x="29" y="30" width="62" height="10" rx="5" fill="${d}"/><path d="M38 31V39M46 31V39M54 31V39M62 31V39M70 31V39M78 31V39M86 31V39" stroke="${c}" stroke-width="1.4"/><circle cx="60" cy="4" r="6" fill="${lt(c, .3)}"/>`;
    case 'salakot': return `<ellipse cx="60" cy="27" rx="52" ry="11" fill="#d9a441" stroke="#a8761f" stroke-width="1.5"/><path d="M34 27Q36 0 60 0Q84 0 86 27Z" fill="#efc671" stroke="#a8761f" stroke-width="1.5"/><path d="M36 22Q60 30 84 22" stroke="${c}" stroke-width="4" fill="none"/><path d="M42 12Q60 18 78 12M46 5Q60 10 74 5" stroke="#c98f2e" stroke-width="1.2" fill="none"/>`;
    case 'bucket': return `<path d="M32 32Q34 7 60 7Q86 7 88 32Z" fill="${c}"/><path d="M18 36Q60 24 102 36Q98 44 60 42Q22 44 18 36Z" fill="${d}"/>`;
    case 'bandana': return `<rect x="30" y="21" width="60" height="9" rx="3" fill="${c}"/><circle cx="48" cy="25.5" r="1.4" fill="#fff" fill-opacity=".55"/><circle cx="62" cy="25.5" r="1.4" fill="#fff" fill-opacity=".55"/><circle cx="76" cy="25.5" r="1.4" fill="#fff" fill-opacity=".55"/><path d="M89 23l12 7-12 4z" fill="${d}"/>`;
    case 'headband': return `<rect x="30" y="19" width="60" height="6" rx="3" fill="${c}"/>`;
    case 'bow': return `<path d="M80 14L98 5V27Z" fill="${c}"/><path d="M80 14L62 5V27Z" fill="${c}"/><circle cx="80" cy="15" r="4.4" fill="${d}"/>`;
    case 'clip': return `<g transform="rotate(-18 82 24)"><rect x="72" y="21" width="16" height="4" rx="2" fill="${c}"/><rect x="74" y="27" width="14" height="4" rx="2" fill="${lt(c, .3)}"/></g>`;
    case 'sunnies': return `<g transform="rotate(-4 60 10)"><rect x="35" y="3" width="20" height="12" rx="5.5" fill="#1d1d1d" stroke="${c}" stroke-width="2"/><rect x="65" y="3" width="20" height="12" rx="5.5" fill="#1d1d1d" stroke="${c}" stroke-width="2"/><path d="M55 8H65" stroke="${c}" stroke-width="2.2"/><path d="M40 6l5 0M70 6l5 0" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/></g>`;
    case 'flowers': return [[36, 26], [46, 16], [60, 12], [74, 16], [84, 26]].map(([x, y], i) => `<g><circle cx="${x}" cy="${y}" r="5.4" fill="${i % 2 ? lt(c, .35) : c}"/><circle cx="${x}" cy="${y}" r="2" fill="#ffd166"/></g>`).join('') + '<path d="M30 30Q60 4 90 30" stroke="#5a9e3a" stroke-width="1.6" fill="none"/>';
    case 'headphones': return `<path d="M30 44Q28 5 60 5Q92 5 90 44" fill="none" stroke="#3a3a3a" stroke-width="5"/><rect x="23" y="38" width="13" height="22" rx="6" fill="${c}" stroke="#000" stroke-opacity=".3"/><rect x="84" y="38" width="13" height="22" rx="6" fill="${c}" stroke="#000" stroke-opacity=".3"/>`;
    case 'chef': return '<path d="M33 30Q25 18 36 12Q36 2 53 3Q60 -1 67 3Q84 2 84 12Q95 18 87 30Z" fill="#fff" stroke="#d9d2c0" stroke-width="1.2"/><rect x="33" y="28" width="54" height="9" rx="3" fill="#f6f6f6" stroke="#d9d2c0" stroke-width="1.2"/><path d="M46 12V26M60 8V26M74 12V26" stroke="#e4ddca" stroke-width="1.2"/>';
    case 'crown': return `<path d="M34 28L38 8L48 18L60 4L72 18L82 8L86 28Z" fill="#f4c430" stroke="#a8761f" stroke-width="1.5" stroke-linejoin="round"/><rect x="34" y="26" width="52" height="7" rx="2" fill="#e0a82e" stroke="#a8761f" stroke-width="1.2"/><circle cx="48" cy="29.5" r="2" fill="${c}"/><circle cx="60" cy="29.5" r="2" fill="#5aa9e6"/><circle cx="72" cy="29.5" r="2" fill="${c}"/>`;
    case 'helmet': return '<path d="M30 30Q32 3 60 3Q88 3 90 30Z" fill="#f4c430"/><rect x="27" y="28" width="66" height="8" rx="4" fill="#f4c430"/>';
  }
  return '';
}

function glassesSvg(g, c) {
  const fr = '#3a2a22', lens = '#fff', lo = ' fill-opacity=".15"';
  if (g === 'round') return `<g fill="${lens}"${lo} stroke="${fr}" stroke-width="2"><circle cx="48" cy="47" r="9.5"/><circle cx="72" cy="47" r="9.5"/></g><path d="M57.5 46H62.5M38.5 46H33M81.5 46H87" stroke="${fr}" stroke-width="2"/>`;
  if (g === 'square') return `<g fill="${lens}"${lo} stroke="${fr}" stroke-width="2"><rect x="38.5" y="39" width="19" height="16" rx="3.5"/><rect x="62.5" y="39" width="19" height="16" rx="3.5"/></g><path d="M57.5 44H62.5M38.5 44H33M81.5 44H87" stroke="${fr}" stroke-width="2"/>`;
  if (g === 'cat') return `<g fill="${lens}"${lo} stroke="${c}" stroke-width="2.2" stroke-linejoin="round"><path d="M38 40L57 43Q58 54 50 55Q41 56 38 48Z"/><path d="M82 40L63 43Q62 54 70 55Q79 56 82 48Z"/></g><path d="M57 44H63M38 42H33M82 42H87" stroke="${c}" stroke-width="2"/>`;
  if (g === 'heart') return `<g fill="${c}" fill-opacity=".35" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"><path d="M48 56C37 49 36 41 42 39.5C45.5 38.6 48 41 48 43C48 41 50.5 38.6 54 39.5C60 41 59 49 48 56Z"/><path d="M72 56C61 49 60 41 66 39.5C69.5 38.6 72 41 72 43C72 41 74.5 38.6 78 39.5C84 41 83 49 72 56Z"/></g><path d="M57 44H63M38 42H33M82 42H87" stroke="${c}" stroke-width="2"/>`;
  if (g === 'shades') return `<g fill="#1d1d1d" stroke="#000" stroke-width="1.5"><rect x="38.5" y="40" width="20" height="14" rx="6"/><rect x="61.5" y="40" width="20" height="14" rx="6"/></g><path d="M43 43L49 43M66 43L72 43" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/><path d="M58.5 44H61.5M38.5 44H33M81.5 44H87" stroke="#000" stroke-width="2"/>`;
  return '';
}

function neckSvg(n, c) {
  const d = dk(c, .22);
  if (n === 'scarf') return `<path d="M44 66Q60 82 76 66L80 80Q60 94 40 80Z" fill="${c}"/><path d="M40 80Q60 94 80 80" stroke="${d}" stroke-width="1.4" fill="none"/><path d="M62 82L76 106L66 108L58 88Z" fill="${d}"/>`;
  if (n === 'bowtie') return `<path d="M60 74L44 66V82Z" fill="${c}"/><path d="M60 74L76 66V82Z" fill="${c}"/><rect x="56" y="70" width="8" height="9" rx="3" fill="${d}"/>`;
  if (n === 'necklace') return `<path d="M47 68Q60 90 73 68" stroke="#e8b923" stroke-width="2" fill="none"/><circle cx="60" cy="85" r="4.2" fill="${c}" stroke="#a8761f" stroke-width="1"/>`;
  if (n === 'medal') return `<path d="M46 68L58 90M74 68L62 90" stroke="${c}" stroke-width="5"/><circle cx="60" cy="95" r="8.5" fill="#f4c430" stroke="#a8761f" stroke-width="2"/><path d="M60 89l2 4 4 .6-3 3 .8 4.2-3.8-2-3.8 2 .8-4.2-3-3 4-.6z" fill="#fff" fill-opacity=".6"/>`;
  if (n === 'sampaguita') return [[44, 68], [46, 74], [50, 80], [55, 85], [60, 87], [65, 85], [70, 80], [74, 74], [76, 68]].map(([x, y]) => `<g><circle cx="${x}" cy="${y}" r="3.6" fill="#fff" stroke="#d9d2b8" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.1" fill="#f4d35e"/></g>`).join('');
  return '';
}

/* ---------- legs, pants and shoes (full body only) ---------- */
function shoeSvg(kind, c, sk) {
  const L = {
    sneakers: `<path d="M32 211H55Q63 213 63 224Q63 232 56 232H35Q29 232 29 226Q29 215 32 211Z" fill="${c}" stroke="#000" stroke-opacity=".25"/><path d="M29 227H63V232H33Q29 232 29 227Z" fill="#eaeaea" stroke="#000" stroke-opacity=".25"/><path d="M38 214l9 5M37 219l9 5" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>`,
    school: `<path d="M33 212H54Q63 214 63 225Q63 232 56 232H34Q29 232 29 227Q29 216 33 212Z" fill="${c}"/><path d="M29 228H63V232H33Q29 232 29 228Z" fill="#000" fill-opacity=".3"/><path d="M36 220H55" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`,
    tsinelas: `<ellipse cx="46" cy="224" rx="13" ry="7" fill="${sk}"/><path d="M33 229H61Q64 229 64 231Q64 233.5 61 233.5H33Q30 233.5 30 231Q30 229 33 229Z" fill="${c}"/><path d="M42 229L47 216L52 229" stroke="${lt(c, .5)}" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`,
    boots: `<path d="M34 196H56V224Q63 226 63 231Q63 233 61 233H33Q30 233 30 230Q30 227 34 225Z" fill="${c}"/><rect x="34" y="196" width="22" height="7" fill="${lt(c, .2)}"/>`,
    barefoot: `<ellipse cx="46" cy="226" rx="13" ry="7" fill="${sk}"/>`
  }[kind] || '';
  return `<g>${L}</g><g transform="translate(120 0) scale(-1 1)">${L}</g>`;
}
function legsSvg(o, sk, acc, ov) {
  const b = o.bottom || 'jeans', bc = ov ? acc : (o.bottomColor || '#4a79b5'), shoe = o.shoes || 'sneakers', sc = o.shoeColor || '#ffffff';
  const edge = `<path d="M33 150H87" stroke="${dk(bc, .22)}" stroke-width="3"/>`;
  const skin = y => `<rect x="41" y="${y}" width="13" height="${216 - y}" rx="5" fill="${sk}"/><rect x="66" y="${y}" width="13" height="${216 - y}" rx="5" fill="${sk}"/>` +
    (shoe === 'sneakers' || shoe === 'school' ? '<rect x="40.5" y="198" width="14" height="18" rx="5" fill="#fff"/><rect x="65.5" y="198" width="14" height="18" rx="5" fill="#fff"/>' : '');
  let under = '', pants = '';
  if (b === 'jeans') pants = `<path d="M33 144H87L85 214H63L60 170L57 214H35Z" fill="${bc}"/><path d="M60 170V146" stroke="${dk(bc, .25)}" stroke-width="1.5"/><rect x="35" y="203" width="22" height="11" fill="${lt(bc, .22)}"/><rect x="63" y="203" width="22" height="11" fill="${lt(bc, .22)}"/>${edge}`;
  else if (b === 'slacks') pants = `<path d="M33 144H87L84 214H63L60 170L57 214H36Z" fill="${bc}"/><path d="M46 160V212M74 160V212" stroke="${dk(bc, .2)}" stroke-width="1.2"/>${edge}`;
  else if (b === 'shorts') { under = skin(174); pants = `<path d="M33 144H87L86 178H63L60 164L57 178H34Z" fill="${bc}"/>${edge}`; }
  else if (b === 'skirt') { under = skin(190); pants = `<path d="M33 144H87L98 192H22Z" fill="${bc}"/>${edge}`; }
  else { under = skin(192); pants = `<path d="M33 144H87L99 194H21Z" fill="${bc}"/><path d="M42 150L34 193M51 150L46 193M60 150V194M69 150L74 193M78 150L86 193" stroke="${dk(bc, .22)}" stroke-width="1.4"/>${edge}`; }
  return under + pants + shoeSvg(shoe, sc, sk);
}

/* ---------- the character ---------- */
function buildChar(o, full) {
  const x = o.extra || [], sk = o.skin || '#f0bf94', hc = o.hair || '#2b1a12', tp = o.top || '#ffffff', acc = o.accent || '#e63946', ac = o.ac || o.cap || acc, m = o.mood || 'happy';
  let st = o.style || 'short', hat = o.hat || 'none', glasses = o.glasses || 'none', beard = o.beard || 'none';
  if (st === 'cap') { hat = 'cap'; st = 'short'; } else if (st === 'bandana') { hat = 'bandana'; st = 'short'; } else if (st === 'long') st = 'straight';
  if (x.includes('helmet')) hat = 'helmet'; if (x.includes('headband')) hat = 'headband';
  if (x.includes('glasses')) glasses = 'round'; if (x.includes('mustache')) beard = 'mustache';
  const jersey = x.includes('jersey'), overalls = x.includes('overalls');
  const shortSl = ['tee', 'polo', 'collar', 'overalls'].some(k => x.includes(k));
  const hair = hairParts(st, hc, ac);

  /* body + outfit */
  const torso = jersey ? 'M28 150V100Q28 74 46 68H74Q92 74 92 100V150Z' : 'M18 150V98Q18 72 44 68H76Q102 72 102 98V150Z';
  const arm = (ax) => jersey ? `<rect x="${ax}" y="76" width="20" height="74" rx="10" fill="${sk}"/>` : shortSl ? `<rect x="${ax}" y="76" width="20" height="74" rx="10" fill="${sk}"/><rect x="${ax}" y="76" width="20" height="32" rx="10" fill="${tp}"/>` : `<rect x="${ax}" y="76" width="20" height="74" rx="10" fill="${tp}"/>`;
  let body = arm(4) + arm(96) + `<rect x="17" y="82" width="7" height="${jersey || shortSl ? 26 : 64}" rx="3" fill="#000" fill-opacity=".08"/>` + `<path d="${torso}" fill="${tp}"/><path d="M82 70Q102 74 102 98V150H90Z" fill="#000" fill-opacity=".08"/>`;
  let hood = '';
  if (x.includes('strap')) body += '<rect x="30" y="68" width="9" height="82" fill="#1d3557" opacity=".9"/><rect x="81" y="68" width="9" height="82" fill="#1d3557" opacity=".9"/>';
  if (x.includes('vest')) body += '<path d="M20 150V98Q20 74 44 70L54 150ZM100 150V98Q100 74 76 70L66 150Z" fill="#ff7a1a"/><path d="M26 112H50M70 112H94" stroke="#f5f5a0" stroke-width="5"/>';
  if (x.includes('collar')) body += `<path d="M46 67L60 88L74 67L68 64L60 74L52 64Z" fill="#fff" stroke="#000" stroke-opacity=".15"/>`;
  if (x.includes('collar') && x.includes('id')) body += `<circle cx="60" cy="96" r="1.8" fill="#000" fill-opacity=".2"/><circle cx="60" cy="110" r="1.8" fill="#000" fill-opacity=".2"/><circle cx="60" cy="124" r="1.8" fill="#000" fill-opacity=".2"/><circle cx="80" cy="106" r="5.5" fill="${acc}"/><path d="M80 102.5l1.1 2.4 2.6.3-1.9 1.8.5 2.6-2.3-1.3-2.3 1.3.5-2.6-1.9-1.8 2.6-.3z" fill="#fff"/>`;
  if (x.includes('tie')) body += '<path d="M48 68L60 80L72 68Z" fill="#fff"/><path d="M56 78h8l4 30-8 8-8-8z" fill="#c1121f"/>';
  if (x.includes('id')) body += `<path d="M50 68L60 104L70 68" stroke="${acc}" stroke-width="3" fill="none"/><rect x="54" y="102" width="12" height="15" rx="2" fill="#fff" stroke="#555"/><rect x="56" y="105" width="8" height="5" fill="#cfd8e3"/>`;
  if (x.includes('apron')) body += `<path d="M32 150V104Q32 90 46 90H74Q88 90 88 104V150Z" fill="${acc}" opacity=".97"/><path d="M46 90L50 69M74 90L70 69" stroke="${acc}" stroke-width="4"/><rect x="47" y="119" width="26" height="17" rx="4" fill="#000" fill-opacity=".14"/>`;
  if (x.includes('floral')) body += [[34, 92], [52, 110], [76, 96], [90, 126], [40, 132], [66, 130]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#ffd6e0"/>`).join('');
  if (x.includes('polo')) body += `<path d="M44 68L60 94L76 68L68 65L60 77L52 65Z" fill="${acc}" stroke="#000" stroke-opacity=".15"/><path d="M60 80V106" stroke="#000" stroke-opacity=".2" stroke-width="2"/><circle cx="60" cy="90" r="2" fill="#000" fill-opacity=".35"/><circle cx="60" cy="100" r="2" fill="#000" fill-opacity=".35"/><rect x="4" y="100" width="20" height="7" fill="${acc}"/><rect x="96" y="100" width="20" height="7" fill="${acc}"/>`;
  if (x.includes('tee')) body += `<path d="M46 68Q60 88 74 68" fill="none" stroke="${acc}" stroke-width="4"/><path d="M60 98l4 9h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill="${acc}"/>`;
  if (overalls) body += `<path d="M48 68Q60 80 72 68" fill="none" stroke="${dk(tp, .2)}" stroke-width="2.5"/><path d="M38 108Q38 100 46 100H74Q82 100 82 108V150H38Z" fill="${acc}"/><path d="M45 100L47 70M75 100L73 70" stroke="${acc}" stroke-width="6" stroke-linecap="round"/><circle cx="46" cy="104" r="2.2" fill="#fff"/><circle cx="74" cy="104" r="2.2" fill="#fff"/><rect x="52" y="114" width="16" height="12" rx="3" fill="none" stroke="${dk(acc, .3)}" stroke-width="1.5"/>`;
  if (jersey) body += `<path d="M46 68Q60 88 74 68" fill="none" stroke="${acc}" stroke-width="4"/><path d="M30 100Q28 76 46 68M90 100Q92 76 74 68" fill="none" stroke="${acc}" stroke-width="4"/><text x="60" y="130" text-anchor="middle" font-size="30" font-weight="700" fill="${acc}" font-family="Fredoka,Arial,sans-serif">8</text>`;
  if (x.includes('hoodie')) {
    hood = `<path d="M30 64Q60 98 90 64Q104 84 88 98Q60 108 32 98Q16 84 30 64Z" fill="${dk(tp, .16)}"/><ellipse cx="60" cy="76" rx="14" ry="7" fill="${dk(tp, .45)}"/>`;
    body += `<path d="M34 128Q60 118 86 128V150H34Z" fill="${dk(tp, .1)}" stroke="#000" stroke-opacity=".15"/><path d="M52 84V106M68 84V106" stroke="${acc}" stroke-width="2.4" stroke-linecap="round"/><circle cx="52" cy="107" r="2.4" fill="${acc}"/><circle cx="68" cy="107" r="2.4" fill="${acc}"/>`;
  }
  if (x.includes('barong')) body += `<path d="M46 66L50 73L60 78L70 73L74 66Z" fill="${lt(tp, .4)}" stroke="#000" stroke-opacity=".15"/><path d="M46 84Q45 118 44 150M74 84Q75 118 76 150" stroke="${acc}" stroke-width="3" stroke-dasharray="2 3"/><path d="M60 78V150" stroke="#000" stroke-opacity=".15" stroke-width="1.6"/><circle cx="60" cy="92" r="1.6" fill="#000" fill-opacity=".3"/><circle cx="60" cy="108" r="1.6" fill="#000" fill-opacity=".3"/><circle cx="60" cy="124" r="1.6" fill="#000" fill-opacity=".3"/><path d="M52 96l4 4-4 4-4-4zM68 96l4 4-4 4-4-4z" fill="${acc}" opacity=".8"/>`;
  const lower = full ? legsSvg(o, sk, acc, overalls) + `<circle cx="14" cy="153" r="8.5" fill="${sk}"/><circle cx="106" cy="153" r="8.5" fill="${sk}"/>` : '';

  /* head: simple, soft and round. No harsh shadows. */
  const skD = dk(sk, .2);
  const neck = `<rect x="52" y="58" width="16" height="16" fill="${sk}"/><path d="M52 66Q60 73 68 66V74H52Z" fill="${skD}" fill-opacity=".4"/>`;
  const ears = `<circle cx="33" cy="48" r="6" fill="${sk}"/><circle cx="87" cy="48" r="6" fill="${sk}"/><circle cx="33" cy="49" r="3" fill="${dk(sk, .1)}"/><circle cx="87" cy="49" r="3" fill="${dk(sk, .1)}"/>` +
    (o.ears === 'studs' ? `<circle cx="33" cy="54" r="2.6" fill="${ac}"/><circle cx="87" cy="54" r="2.6" fill="${ac}"/>` : o.ears === 'hoops' ? `<circle cx="33" cy="59" r="5" fill="none" stroke="${ac}" stroke-width="1.8"/><circle cx="87" cy="59" r="5" fill="none" stroke="${ac}" stroke-width="1.8"/>` : '');
  const face = `<ellipse cx="60" cy="42" rx="27" ry="29" fill="${sk}"/>`;
  const fx = o.face || [];
  let cheeks = `<circle cx="41" cy="55" r="4.8" fill="#ff7f8f" fill-opacity=".38"/><circle cx="79" cy="55" r="4.8" fill="#ff7f8f" fill-opacity=".38"/><path d="M58.6 54.2Q60 55.6 61.4 54.2" stroke="${dk(sk, .3)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  if (fx.includes('blush')) cheeks += '<circle cx="41" cy="55" r="6.8" fill="#ff5c8a" fill-opacity=".3"/><circle cx="79" cy="55" r="6.8" fill="#ff5c8a" fill-opacity=".3"/>';
  if (fx.includes('freckles')) cheeks += [[43, 54], [47, 57], [51, 55], [69, 55], [73, 57], [77, 54]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1" fill="${dk(sk, .4)}"/>`).join('');
  if (fx.includes('mole')) cheeks += '<circle cx="75" cy="61" r="1.6" fill="#4a3020"/>';
  if (fx.includes('bandaid')) cheeks += '<g transform="rotate(-25 79 56)"><rect x="72" y="53" width="13" height="6.5" rx="3.2" fill="#f3c6a0" stroke="#c99a70" stroke-width=".6"/><rect x="76.5" y="53" width="4" height="6.5" fill="#e5ad80"/></g>';
  const bc = dk(hc, .1);
  const brows = m === 'angry' ? `<path d="M41.5 35.5L55 39.5M78.5 35.5L65 39.5" stroke="${bc}" stroke-width="2.6" stroke-linecap="round"/>` : `<path d="M42.5 38.5Q48 35 54 37.5M66 37.5Q72 35 77.5 38.5" stroke="${bc}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const hairy = beard === 'mustache' || beard === 'goatee' || beard === 'beard';
  const mouth = `<g transform="translate(0 ${hairy ? 2.5 : 0})">${m === 'angry' ? '<path d="M54 62Q60 57 66 62" stroke="#8a2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>' : m === 'happy' ? (MOUTHS[o.smile] || MOUTHS.grin) : '<path d="M55 60Q60 62 65 60" stroke="#8a2b2b" stroke-width="2.8" fill="none" stroke-linecap="round"/>'}</g>`;
  const bs = 'M33 52Q34 78 60 83Q86 78 87 52Q82 67 60 67Q38 67 33 52Z';
  const must = `<path d="M48 56Q60 51 72 56Q66 60 60 57Q54 60 48 56Z" fill="${hc}"/>`;
  const facial = beard === 'mustache' ? must : beard === 'goatee' ? must + `<path d="M52 67Q60 80 68 67Q60 71 52 67Z" fill="${hc}"/>` : beard === 'beard' ? `<path d="${bs}" fill="${hc}"/>` + must : beard === 'stubble' ? `<path d="${bs}" fill="#000" fill-opacity=".16"/>` : '';

  return `${hair.b}${body}${hood}${lower}${neck}${neckSvg(o.neck, ac)}${ears}${face}${cheeks}${eyesSvg(o.eyes || 'round', o.eyeColor || '#3b2314', sk)}${brows}${mouth}${facial}${glassesSvg(glasses, ac)}${hair.f}${hatSvg(hat, o.cap || ac)}`;
}
const ch = o => `<svg viewBox="0 0 120 150" class="ch">${buildChar(o, false)}</svg>`;
const chFull = (o, vb) => `<svg viewBox="${vb || '0 0 120 236'}" class="ch">${buildChar(o, true)}</svg>`;
const mini = o => ch(o).replace('viewBox="0 0 120 150"', 'viewBox="6 0 108 82"');