'use strict';
/* Character creator (step by step) + the in-game editor. Loaded after game.js, before ui.js. */
const SKINS = [['Fair', '#f7d9bf'], ['Light', '#f0bf94'], ['Kayumanggi', '#d9a273'], ['Medium olive', '#c19a65'], ['Rich brown', '#8d5a3a'], ['Deep brown', '#6b4129']];
const HAIRS = [['Classic black', '#1b120d'], ['Dark chocolate', '#3b2314'], ['Chestnut', '#6b3e1f'], ['Golden caramel', '#c98a3a'], ['Honey blonde', '#e6bd5a'], ['Ginger', '#b4501f'], ['Silver', '#c9c9d1'], ['Bubblegum pink', '#ff7fb0'], ['Lavender purple', '#9b72e0'], ['Ocean blue', '#4aa3ff'], ['Mint', '#5fd1b0']];
const PAL = [['White', '#ffffff'], ['Cream', '#FAF3DD'], ['Sunshine yellow', '#f4d35e'], ['Warm gold', '#F4A261'], ['Terracotta', '#E76F51'], ['Red', '#e63946'], ['Pink', '#ff8fab'], ['Purple', '#8a63d2'], ['Sky blue', '#5aa9e6'], ['Denim blue', '#4a79b5'], ['Navy', '#1d3557'], ['Teal', '#2a9d8f'], ['Leaf green', '#76B041'], ['Brown', '#7a4a2b'], ['Black', '#2b2b2b']];
const EYESL = [['round', 'Round'], ['dots', 'Dots'], ['sparkle', 'Sparkle'], ['lashes', 'Lashes'], ['happy', 'Happy'], ['sleepy', 'Sleepy']];
const EYECOL = [['Dark brown', '#3b2314'], ['Hazel', '#8a5a2b'], ['Amber', '#c98a3a'], ['Green', '#4f9d69'], ['Blue', '#4a8fd6'], ['Gray', '#7b8794'], ['Violet', '#8a63d2']];
const MOUTHL = [['grin', 'Grin'], ['smile', 'Smile'], ['smirk', 'Smirk'], ['tongue', 'Tongue out']];
const FACEX = [['freckles', 'Freckles'], ['mole', 'Mole'], ['blush', 'Rosy cheeks'], ['bandaid', 'Bandaid']];
const BEARDS = [['none', 'Clean'], ['stubble', 'Stubble'], ['mustache', 'Mustache'], ['goatee', 'Goatee'], ['beard', 'Full beard']];
const STYLES = [['short', 'Short'], ['bob', 'Bob'], ['straight', 'Straight'], ['sidepart', 'Side part'], ['curly', 'Curly'], ['spiky', 'Spiky'], ['wavy', 'Wavy bangs'], ['pigtails', 'Pigtails'], ['ponytail', 'Ponytail'], ['braid', 'Braid'], ['bun', 'Bun'], ['twinbuns', 'Twin buns']];
const OUTFITS = [['school', 'School uniform'], ['apron', 'Vendor apron'], ['tee', 'Casual tee'], ['overalls', 'Overalls'], ['polo', 'Retro polo'], ['jersey', 'Jersey'], ['hoodie', 'Hoodie'], ['barong', 'Barong']];
const BOTTOMS = [['jeans', 'Jeans'], ['slacks', 'Slacks'], ['shorts', 'Shorts'], ['skirt', 'Skirt'], ['pleated', 'Pleated skirt']];
const SHOES = [['sneakers', 'Sneakers'], ['school', 'School shoes'], ['tsinelas', 'Tsinelas'], ['boots', 'Boots'], ['barefoot', 'Barefoot']];
const GLASSL = [['none', 'None'], ['round', 'Round'], ['square', 'Square'], ['cat', 'Cat-eye'], ['shades', 'Shades']];
const HATL = [['none', 'None'], ['cap', 'Cap'], ['clip', 'Hair clip'], ['beanie', 'Beanie'], ['salakot', 'Salakot'], ['bucket', 'Bucket hat'], ['bandana', 'Bandana'], ['headband', 'Headband'], ['bow', 'Bow'], ['flowers', 'Flowers'], ['headphones', 'Headphones'], ['sunnies', 'Sunnies on head']];
const NECKL = [['none', 'None'], ['scarf', 'Scarf'], ['bowtie', 'Bow tie'], ['necklace', 'Necklace'], ['sampaguita', 'Sampaguita']];
const EARL = [['none', 'None'], ['studs', 'Studs'], ['hoops', 'Hoops']];
const OUTX = { school: ['collar', 'id'], apron: ['apron'], tee: ['tee'], overalls: ['overalls'], polo: ['polo'], jersey: ['jersey'], hoodie: ['hoodie'], barong: ['barong'] };
const ACC = { school: 'ID lace and badge color', apron: 'Apron color', tee: 'Print color', overalls: 'Overalls color', polo: 'Collar color', jersey: 'Trim and number color', hoodie: 'Drawstring color', barong: 'Embroidery color' };
const LISTS = { style: STYLES, outfit: OUTFITS, bottom: BOTTOMS, shoes: SHOES, glasses: GLASSL, hat: HATL, neck: NECKL, ears: EARL };

/* what unlocks at each level (anything not listed is free from the start) */
const LOCK = {
  'style:curly': 2, 'style:braid': 2, 'style:twinbuns': 3, 'style:spiky': 3,
  'outfit:overalls': 2, 'outfit:polo': 2, 'outfit:jersey': 3, 'outfit:hoodie': 4, 'outfit:barong': 5,
  'bottom:skirt': 2, 'shoes:boots': 3,
  'glasses:round': 2, 'glasses:square': 2, 'glasses:cat': 3, 'glasses:shades': 4,
  'hat:beanie': 2, 'hat:bow': 2, 'hat:bucket': 3, 'hat:sunnies': 3, 'hat:headphones': 4, 'hat:flowers': 4, 'hat:salakot': 5,
  'neck:necklace': 2, 'neck:scarf': 2, 'neck:bowtie': 3, 'neck:sampaguita': 4,
  'ears:studs': 2, 'ears:hoops': 3
};
const unlockedLv = () => S.set.unlockAll ? 99 : Math.max(S.best || 1, S.level || 1);
const isFree = (key, v) => (LOCK[key + ':' + v] || 1) <= unlockedLv();
const labelOf = (key, v) => (LISTS[key].find(x => x[0] === v) || [0, v])[1];
const accNew = l => Object.keys(LOCK).filter(k => LOCK[k] === l).map(k => { const [key, val] = k.split(':'); return { key, val, label: labelOf(key, val) }; });
function previewWith(key, val) {
  const o = crOpts(); if (key === 'outfit') o.extra = OUTX[val]; else o[key] = val;
  return chFull(o);
}

const BASE = { skin: '#d9a273', hair: '#1b120d', outfit: 'school', top: '#ffffff', accent: '#e63946', eyes: 'round', eyeColor: '#3b2314', mouth: 'grin', face: [], beard: 'none', glasses: 'none', hat: 'none', neck: 'none', ears: 'none', ac: '#e63946', bottom: 'jeans', bottomColor: '#4a79b5', shoes: 'sneakers', shoeColor: '#ffffff' };
const PRESETS = {
  boy: { ...BASE, style: 'short', bottom: 'slacks', bottomColor: '#2b3a67', shoes: 'school', shoeColor: '#2b2b2b' },
  girl: { ...BASE, style: 'pigtails', bottom: 'pleated', bottomColor: '#2b3a67', shoes: 'school', shoeColor: '#2b2b2b' }
};
const STEPS = [null,
  ['Choose your character', 'Pick a look to start with. You can customize it next, or skip ahead.'],
  ['Skin tone and eyes', 'Pick the tone and eyes that feel like you.'],
  ['Face details', 'Smile, freckles and facial hair.'],
  ['Style your hair', 'Choose a hairstyle and a color.'],
  ['Choose your outfit', 'This is what you will wear behind the cart.'],
  ['Pants and shoes', 'Finish the look from the waist down.'],
  ['Add accessories', 'Glasses, hats and more. Level up to unlock new ones.'],
  ["What's your name?", 'Customers will call you by this.']];
const STEP_NAMES = ['Character', 'Skin & eyes', 'Face', 'Hair', 'Outfit', 'Pants & shoes', 'Extras', 'Name'], LAST = 8;
/* how much of the character the preview shows on each step */
const VIEW = { 2: '14 2 92 82', 3: '14 2 92 82', 4: '0 0 120 112', 5: '0 40 120 124', 6: '0 0 120 236', 7: '0 0 120 126', 8: '0 0 120 236' };
const CR = { ...PRESETS.girl, face: [] };
let step = 1, picked = null, reached = 1, tab = 'glasses', editing = false, snap = null, queued = false;

const optsOf = c => ({ skin: c.skin, hair: c.hair, style: c.style, top: c.top, accent: c.accent, ac: c.ac, eyes: c.eyes, eyeColor: c.eyeColor, smile: c.mouth, face: c.face, beard: c.beard, glasses: c.glasses, hat: c.hat, neck: c.neck, ears: c.ears, bottom: c.bottom, bottomColor: c.bottomColor, shoes: c.shoes, shoeColor: c.shoeColor, extra: OUTX[c.outfit], mood: 'happy' });
const crOpts = () => optsOf(CR);
const crop = (o, vb) => ch(o).replace('viewBox="0 0 120 150"', `viewBox="${vb}"`);
const nameOf = (list, v) => (list.find(x => x[1] === v) || ['Custom'])[0];
const raf = window.requestAnimationFrame ? f => requestAnimationFrame(f) : f => setTimeout(f, 16);

/* ---------- saving ---------- */
function saveLook() { try { localStorage.setItem('tusok-look', JSON.stringify({ CR, name: S.name || $('#nm').value, title: S.title, picked })); } catch (e) { /* storage blocked */ } }
function loadLook() {
  try {
    const d = JSON.parse(localStorage.getItem('tusok-look') || 'null');
    if (d && d.CR) { Object.assign(CR, d.CR); picked = d.picked || null; S.title = d.title || S.title; if (d.name) $('#nm').value = d.name; }
  } catch (e) { /* ignore bad data */ }
}
function applyLook() {
  $('#who').textContent = `${S.title} ${S.name}`;
  $('#mini').innerHTML = mini(crOpts());
  const sleeve = CR.outfit === 'jersey' ? CR.skin : CR.top;
  $$('.arm').forEach(x => { x.style.setProperty('--hand', CR.skin); x.style.setProperty('--sleeve', sleeve); });
  saveLook();
}

/* ---------- builders ---------- */
function swatches(id, list, key, labeled) {
  list.forEach(([n, c]) => {
    const b = labeled ? el('button', 'swl', `<span class="dot" style="background:${c}"></span>${n}`) : el('button', 'sw');
    if (!labeled) b.style.background = c;
    b.title = n; b.setAttribute('aria-label', n); b.dataset.v = c;
    b.onclick = () => { CR[key] = c; bump(); };
    $(id).append(b);
  });
}
/* key = which option this list controls; locked items show the level needed */
function chips(id, list, view, isSel, onPick, key) {
  const box = $(id); box.innerHTML = '';
  list.forEach(([v, n]) => {
    const need = key ? (LOCK[key + ':' + v] || 1) : 1, locked = need > unlockedLv();
    const b = el('button', 'chip' + (isSel(v) ? ' sel' : '') + (locked ? ' locked' : ''), view(v) + n + (locked ? `<span class="lk">Level ${need}</span>` : ''));
    b.onclick = () => locked ? toast(`Reach Level ${need} to unlock ${n}.`, 1) : onPick(v);
    box.append(b);
  });
}
function bump() {
  SND.equip();
  const p = $('#cprev'); p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop');
  queuePaint();
}
function queuePaint() { if (queued) return; queued = true; raf(() => { queued = false; paintCreator(); }); }

/* only the chips on the current step are redrawn */
function renderStep(o) {
  const set = (k, v) => { CR[k] = v; bump(); }, none = { hat: 'none', glasses: 'none' };
  if (step === 2) chips('#c_eyes', EYESL, v => crop({ ...o, ...none, eyes: v }, '30 26 60 32'), v => CR.eyes === v, v => set('eyes', v));
  if (step === 3) {
    chips('#c_mouth', MOUTHL, v => crop({ ...o, ...none, smile: v }, '34 40 52 38'), v => CR.mouth === v, v => set('mouth', v));
    chips('#c_facex', FACEX, v => crop({ ...o, ...none, face: [v] }, '28 28 64 52'), v => CR.face.includes(v), v => { CR.face = CR.face.includes(v) ? CR.face.filter(f => f !== v) : [...CR.face, v]; bump(); });
    chips('#c_beard', BEARDS, v => crop({ ...o, ...none, beard: v }, '24 20 72 68'), v => CR.beard === v, v => set('beard', v));
  }
  if (step === 4) chips('#c_style', STYLES, v => crop({ ...o, ...none, style: v }, '6 0 108 100'), v => CR.style === v, v => set('style', v), 'style');
  if (step === 5) chips('#c_outfit', OUTFITS, v => crop({ ...o, extra: OUTX[v] }, '6 58 108 92'), v => CR.outfit === v, v => set('outfit', v), 'outfit');
  if (step === 6) {
    chips('#c_bottom', BOTTOMS, v => chFull({ ...o, bottom: v }, '14 140 92 96'), v => CR.bottom === v, v => set('bottom', v), 'bottom');
    chips('#c_shoes', SHOES, v => chFull({ ...o, shoes: v }, '14 192 92 46'), v => CR.shoes === v, v => set('shoes', v), 'shoes');
  }
  if (step === 7) {
    const T = { glasses: [GLASSL, '26 28 68 38'], hat: [HATL, '4 0 112 64'], neck: [NECKL, '24 54 72 54'], ears: [EARL, '20 32 80 42'] }[tab];
    $$('#acctabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    $$('.tabpane').forEach(p => p.classList.toggle('on', p.id === 'p_' + tab));
    chips('#c_' + tab, T[0], v => crop({ ...o, ...(tab === 'glasses' ? { hat: 'none' } : tab === 'hat' ? {} : none), [tab]: v }, T[1]), v => CR[tab] === v, v => set(tab, v), tab);
  }
}
function paintCreator() {
  const o = crOpts();
  $('#cprev').innerHTML = chFull(o, VIEW[step] || '0 0 120 236');
  $('#cprev').dataset.v = (step === 6 || step === 8) ? 'full' : 'bust';
  $('#cname').textContent = `${S.title} ${$('#nm').value.trim() || 'Your name'}`;
  [['#c_skin', 'skin', SKINS, '#n_skin'], ['#c_eyecol', 'eyeColor', EYECOL, '#n_eyecol'], ['#c_hair', 'hair', HAIRS, '#n_hair'], ['#c_top', 'top', PAL, '#n_top'], ['#c_acc', 'accent', PAL, '#n_acc'],
    ['#c_bcol', 'bottomColor', PAL, '#n_bcol'], ['#c_scol', 'shoeColor', PAL, '#n_scol'], ['#c_ac', 'ac', PAL, '#n_ac']].forEach(([id, k, list, n]) => {
    $$(id + ' [data-v]').forEach(b => b.classList.toggle('sel', b.dataset.v === CR[k]));
    $(n).textContent = nameOf(list, CR[k]);
  });
  $('#h_acc').firstChild.textContent = ACC[CR.outfit] + ': ';
  renderStep(o);
  $$('#ti .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === S.title));
  $$('.ctag').forEach(t => t.classList.toggle('sel', t.dataset.g === picked));
}

/* ---------- navigation ---------- */
const first = () => editing ? 2 : 1;
function renderNav() {
  $$('#prog li').forEach((li, i) => { li.classList.toggle('on', i + 1 === step); li.classList.toggle('done', i + 1 < step); li.classList.toggle('ok', !!picked && i + 1 <= reached); });
  $('#wback').style.visibility = step > first() ? 'visible' : 'hidden';
  $('#wcancel').style.display = editing ? '' : 'none';
  $('#wskip').style.display = !editing && picked && step < LAST ? '' : 'none';
  $('#wnext').style.display = step < LAST ? '' : 'none';
  $('#wnext').disabled = !picked;
  $('#go').style.display = step === LAST ? '' : 'none';
  $('#wpick').style.display = picked ? 'none' : '';
}
function wzGo(n) {
  const dir = n >= step ? 'fwd' : 'back', was = step;
  step = Math.max(first(), Math.min(LAST, n)); reached = Math.max(reached, step);
  if (step !== was) SND.swoosh();
  $('#wz').dataset.step = step;
  $$('.step').forEach((s, i) => { s.classList.toggle('on', i + 1 === step); s.classList.toggle('fwd', dir === 'fwd'); s.classList.toggle('back', dir === 'back'); });
  $('#wtitle').textContent = STEPS[step][0]; $('#wsub').textContent = STEPS[step][1];
  renderNav(); paintCreator();
  if (step === LAST) setTimeout(() => $('#nm').focus(), 60);
}
function choose(g) {
  if (picked !== g) { picked = g; Object.assign(CR, JSON.parse(JSON.stringify(PRESETS[g]))); S.title = g === 'boy' ? 'Kuya' : 'Ate'; SND.equip(); }
  paintCreator(); renderNav();
}

/* ---------- in-game editor (Settings or Pause menu) ---------- */
function lookJSON() { return JSON.stringify({ CR, name: $('#nm').value, title: S.title }); }
function openEditor() {
  snap = lookJSON(); editing = true; $('#nm').value = S.name;
  $('#wz').dataset.edit = '1'; $('#s2').classList.add('edit', 'on'); $('#go').textContent = 'Save changes';
  step = 1; wzGo(2);
}
function closeEditor() { editing = false; delete $('#wz').dataset.edit; $('#s2').classList.remove('edit', 'on'); $('#go').textContent = 'Start Game'; }
function saveEdit() { S.name = $('#nm').value.trim() || S.name; closeEditor(); applyLook(); SND.sparkle(); toast(`Looking good, ${S.title} ${S.name}!`); }
function cancelEdit() { const d = JSON.parse(snap); Object.assign(CR, d.CR); $('#nm').value = d.name; S.title = d.title; closeEditor(); }

(function initCreator() {
  STEP_NAMES.forEach((n, i) => { const li = el('li', '', `<b>${i + 1}</b><span>${n}</span>`); li.onclick = () => { if (picked && i + 1 <= reached && i + 1 >= first()) wzGo(i + 1); }; $('#prog').append(li); });
  ['boy', 'girl'].forEach(g => {
    const t = el('div', 'ctag', `<h3>${up(g)}</h3><div class="art">${chFull(optsOf(PRESETS[g]))}</div><button type="button">Select</button>`);
    t.dataset.g = g; t.onclick = () => choose(g); $('#ctags').append(t);
  });
  swatches('#c_skin', SKINS, 'skin', true); swatches('#c_hair', HAIRS, 'hair', true); swatches('#c_eyecol', EYECOL, 'eyeColor');
  swatches('#c_top', PAL, 'top'); swatches('#c_acc', PAL, 'accent'); swatches('#c_ac', PAL, 'ac');
  swatches('#c_bcol', PAL, 'bottomColor'); swatches('#c_scol', PAL, 'shoeColor');
  ['Ate', 'Kuya'].forEach(t => { const b = el('button', 'opt ti', t); b.dataset.v = t; b.onclick = () => { S.title = t; bump(); }; $('#ti').append(b); });
  $$('#acctabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; bump(); });
  $('#nm').oninput = queuePaint;
  $('#nm').onkeydown = e => { if (e.key === 'Enter') $('#go').click(); };
  $('#wnext').onclick = () => wzGo(step + 1);
  $('#wback').onclick = () => wzGo(step - 1);
  $('#wskip').onclick = () => wzGo(LAST);
  $('#wcancel').onclick = cancelEdit;
  $('#go').onclick = () => editing ? saveEdit() : start();
  $('#rnd').onclick = () => {
    const r = l => pick(l)[1], free = (l, key) => l.filter(x => isFree(key, x[0])), some = (l, key, p) => Math.random() < p ? pick(free(l, key))[0] : 'none';
    Object.assign(CR, { skin: r(SKINS), hair: r(HAIRS), style: pick(free(STYLES, 'style'))[0], eyes: r(EYESL), eyeColor: r(EYECOL), mouth: r(MOUTHL), outfit: pick(free(OUTFITS, 'outfit'))[0], top: r(PAL),
      face: FACEX.map(f => f[0]).filter(() => Math.random() < .25), beard: Math.random() < .2 ? r(BEARDS) : 'none',
      bottom: pick(free(BOTTOMS, 'bottom'))[0], bottomColor: r(PAL), shoes: pick(free(SHOES, 'shoes'))[0], shoeColor: r(PAL),
      glasses: some(GLASSL, 'glasses', .45), hat: some(HATL, 'hat', .5), neck: some(NECKL, 'neck', .35), ears: some(EARL, 'ears', .4), ac: r(PAL) });
    do { CR.accent = r(PAL); } while (CR.accent === CR.top);
    bump();
  };
  loadLook();
  wzGo(1);
})();