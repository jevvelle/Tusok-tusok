'use strict';
/* Character creator, step by step. Loaded after game.js, before ui.js. */
const SKINS = [['Fair', '#f7d9bf'], ['Light', '#f0bf94'], ['Kayumanggi', '#d9a273'], ['Medium olive', '#c19a65'], ['Rich brown', '#8d5a3a'], ['Deep brown', '#6b4129']];
const HAIRS = [['Classic black', '#1b120d'], ['Dark chocolate', '#3b2314'], ['Chestnut', '#6b3e1f'], ['Golden caramel', '#c98a3a'], ['Honey blonde', '#e6bd5a'], ['Ginger', '#b4501f'], ['Silver', '#c9c9d1'], ['Bubblegum pink', '#ff7fb0'], ['Lavender purple', '#9b72e0'], ['Ocean blue', '#4aa3ff'], ['Mint', '#5fd1b0']];
const PAL = [['White', '#ffffff'], ['Cream', '#FAF3DD'], ['Sunshine yellow', '#f4d35e'], ['Warm gold', '#F4A261'], ['Terracotta', '#E76F51'], ['Red', '#e63946'], ['Pink', '#ff8fab'], ['Purple', '#8a63d2'], ['Sky blue', '#5aa9e6'], ['Navy', '#1d3557'], ['Teal', '#2a9d8f'], ['Leaf green', '#76B041'], ['Black', '#2b2b2b']];
const STYLES = [['short', 'Short'], ['straight', 'Straight'], ['pigtails', 'Pigtails'], ['ponytail', 'Ponytail'], ['wavy', 'Wavy bangs'], ['bun', 'Bun'], ['bandana', 'Bandana'], ['cap', 'Cap']];
const OUTFITS = [['school', 'School uniform'], ['apron', 'Vendor apron'], ['tee', 'Casual tee'], ['polo', 'Retro polo']];
const OUTX = { school: ['collar', 'id'], apron: ['apron'], tee: ['tee'], polo: ['polo'] };
const ACC = { school: 'ID lace color', apron: 'Apron color', tee: 'Print color', polo: 'Collar color' };
const PRESETS = {
  boy: { skin: '#d9a273', hair: '#1b120d', style: 'short', outfit: 'school', top: '#ffffff', accent: '#e63946' },
  girl: { skin: '#d9a273', hair: '#1b120d', style: 'pigtails', outfit: 'school', top: '#ffffff', accent: '#e63946' }
};
const STEPS = [null,
  ['Choose your character', 'Pick a look to start with. You can customize it next, or skip ahead.'],
  ['Pick your skin tone', 'Choose the tone that fits you best.'],
  ['Style your hair', 'Choose a hairstyle and a color.'],
  ['Choose your outfit', 'This is what you will wear behind the cart.'],
  ['Pick your colors', 'Match your outfit to your style.'],
  ["What's your name?", 'Customers will call you by this.']];
const STEP_NAMES = ['Character', 'Skin', 'Hair', 'Outfit', 'Colors', 'Name'];
const CR = { ...PRESETS.girl };
let step = 1, picked = null, reached = 1;

/* options object that ch() draws; game.js also uses crOpts() for the header avatar and the cooking hands */
const optsOf = c => ({ skin: c.skin, hair: c.hair, style: c.style, top: c.top, accent: c.accent, cap: c.accent, extra: OUTX[c.outfit], mood: 'happy' });
const crOpts = () => optsOf(CR);
const crop = (o, vb) => ch(o).replace('viewBox="0 0 120 150"', `viewBox="${vb}"`);
const nameOf = (list, v) => (list.find(x => x[1] === v) || ['Custom'])[0];

function swatches(id, list, key, labeled) {
  list.forEach(([n, c]) => {
    const b = labeled ? el('button', 'swl', `<span class="dot" style="background:${c}"></span>${n}`) : el('button', 'sw');
    if (!labeled) b.style.background = c;
    b.title = n; b.setAttribute('aria-label', n); b.dataset.v = c;
    b.onclick = () => { CR[key] = c; paintCreator(); };
    $(id).append(b);
  });
}
function chips(id, list, view, cur, set) {
  const box = $(id); box.innerHTML = '';
  list.forEach(([v, n]) => { const b = el('button', 'chip' + (cur === v ? ' sel' : ''), view(v) + n); b.onclick = () => set(v); box.append(b); });
}
function choose(g) {
  if (picked !== g) { picked = g; Object.assign(CR, PRESETS[g]); S.title = g === 'boy' ? 'Kuya' : 'Ate'; }
  paintCreator(); renderNav();
}
function paintCreator() {
  const o = crOpts();
  $('#cprev').innerHTML = ch(o);
  $('#cname').textContent = `${S.title} ${$('#nm').value.trim() || 'Your name'}`;
  [['#c_skin', 'skin', SKINS, '#n_skin'], ['#c_hair', 'hair', HAIRS, '#n_hair'], ['#c_top', 'top', PAL, '#n_top'], ['#c_acc', 'accent', PAL, '#n_acc']].forEach(([id, k, list, n]) => {
    $$(id + ' [data-v]').forEach(b => b.classList.toggle('sel', b.dataset.v === CR[k]));
    $(n).textContent = nameOf(list, CR[k]);
  });
  $('#h_acc').firstChild.textContent = ACC[CR.outfit] + ': ';
  chips('#c_style', STYLES, v => crop({ ...o, style: v }, '8 0 104 80'), CR.style, v => { CR.style = v; paintCreator(); });
  chips('#c_outfit', OUTFITS, v => crop({ ...o, extra: OUTX[v] }, '6 58 108 92'), CR.outfit, v => { CR.outfit = v; paintCreator(); });
  $$('#ti .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === S.title));
  $$('.ctag').forEach(t => t.classList.toggle('sel', t.dataset.g === picked));
}
function renderNav() {
  $$('#prog li').forEach((li, i) => { li.classList.toggle('on', i + 1 === step); li.classList.toggle('done', i + 1 < step); li.classList.toggle('ok', !!picked && i + 1 <= reached); });
  $('#wback').style.visibility = step > 1 ? 'visible' : 'hidden';
  $('#wskip').style.display = picked && step < 6 ? '' : 'none';
  $('#wnext').style.display = step < 6 ? '' : 'none';
  $('#wnext').disabled = !picked;
  $('#go').style.display = step === 6 ? '' : 'none';
  $('#wpick').style.display = picked ? 'none' : '';
}
function wzGo(n) {
  step = Math.max(1, Math.min(6, n)); reached = Math.max(reached, step);
  $('#wz').dataset.step = step;
  $$('.step').forEach((s, i) => s.classList.toggle('on', i + 1 === step));
  $('#wtitle').textContent = STEPS[step][0]; $('#wsub').textContent = STEPS[step][1];
  renderNav(); paintCreator();
  if (step === 6) setTimeout(() => $('#nm').focus(), 60);
}
(function initCreator() {
  STEP_NAMES.forEach((n, i) => { const li = el('li', '', `<b>${i + 1}</b><span>${n}</span>`); li.onclick = () => { if (picked && i + 1 <= reached) wzGo(i + 1); }; $('#prog').append(li); });
  ['boy', 'girl'].forEach(g => {
    const t = el('div', 'ctag', `<h3>${up(g)}</h3><div class="art">${ch(optsOf(PRESETS[g]))}</div><button type="button">Select</button>`);
    t.dataset.g = g; t.onclick = () => choose(g); $('#ctags').append(t);
  });
  swatches('#c_skin', SKINS, 'skin', true); swatches('#c_hair', HAIRS, 'hair', true); swatches('#c_top', PAL, 'top'); swatches('#c_acc', PAL, 'accent');
  ['Ate', 'Kuya'].forEach(t => { const b = el('button', 'opt ti', t); b.dataset.v = t; b.onclick = () => { S.title = t; paintCreator(); }; $('#ti').append(b); });
  $('#nm').oninput = paintCreator;
  $('#nm').onkeydown = e => { if (e.key === 'Enter') $('#go').click(); };
  $('#wnext').onclick = () => wzGo(step + 1);
  $('#wback').onclick = () => wzGo(step - 1);
  $('#wskip').onclick = () => wzGo(6);
  $('#rnd').onclick = () => {
    CR.skin = pick(SKINS)[1]; CR.hair = pick(HAIRS)[1]; CR.style = pick(STYLES)[0]; CR.outfit = pick(OUTFITS)[0]; CR.top = pick(PAL)[1];
    do { CR.accent = pick(PAL)[1]; } while (CR.accent === CR.top);
    paintCreator();
  };
  wzGo(1);
})();