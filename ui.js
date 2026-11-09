'use strict';
/* Menu art, settings, pause, full screen, hotkeys. Loaded after creator.js. */
const ov = (id, on) => $('#' + id).classList.toggle('on', on);
const isOn = id => $('#' + id).classList.contains('on');
const mm = q => window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener() {} };
const FS = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);

function saveSet() { try { localStorage.setItem('tusok-set', JSON.stringify(S.set)); } catch (e) { /* storage blocked, settings just won't persist */ } }
function syncSet() {
  $('#set_sfx').value = S.set.sfx; $('#set_amb').value = S.set.amb; $('#set_diff').value = S.set.diff;
  $('#set_easy').checked = S.set.easy; $('#set_unlock').checked = S.set.unlockAll;
  $('#sbtn').textContent = 'Sound: ' + (S.set.mute ? 'Off' : 'On');
  $('#msound').classList.toggle('off', S.set.mute);
  SND.vol();
}
function openPause() { if (!S.on || S.holds > 0) return; hold(); ov('pausem', true); }
function closePause() { ov('pausem', false); release(); }
function toggleFS() {
  const d = document, e = d.documentElement, on = d.fullscreenElement || d.webkitFullscreenElement;
  const call = (f, o) => { try { const p = f.call(o); if (p && p.catch) p.catch(() => {}); } catch (x) { /* not allowed here */ } };
  if (!on) {
    call(e.requestFullscreen || e.webkitRequestFullscreen, e);
    try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) { /* only works in full screen on Android */ }
  } else call(d.exitFullscreen || d.webkitExitFullscreen, d);
}

/* main menu scenery: skyline, drifting skewers, and customers lined up at the counter */
function menuArt() {
  const sk = $('#skyline');
  [['#3a2350', 14, 18, .8], ['#2a1a3a', 20, 20, .85]].forEach(([c, hb, hr, step]) => {
    for (let x = -2; x < 100;) {
      const w = 4 + Math.random() * 6, b = el('i', 'bd');
      b.style.cssText = `left:${x}%;width:${w}%;height:${hb + Math.random() * hr}%;background-color:${c}`; sk.append(b); x += w * step;
    }
  });
  for (let i = 0; i < 10; i++) {
    const f = el('div', 'fl', food(pick(FRY)));
    f.style.cssText = `left:${rnd(2, 96)}%;width:${rnd(5, 9)}vmin;animation-duration:${rnd(14, 26)}s;animation-delay:-${rnd(0, 20)}s`;
    $('#floaters').append(f);
  }
  [[11, 0, 'Pabili po!'], [25, 3, ''], [75, 6, 'Isa pa po!'], [89, 5, '']].forEach(([x, t, say], i) => {
    const l = TYPES[t].mk(); l.skin = SK[(i * 2) % SK.length]; l.hair = l.hair || HC[i % HC.length];
    const c = el('div', 'mc', ch({ ...l, eyes: pick(['round', 'sparkle', 'lashes', 'dots']), mood: 'happy' }) + (say ? `<span class="sp">${say}</span>` : ''));
    c.style.left = x + '%'; c.style.animationDelay = `-${i * .7}s`; $('#mchars').append(c);
  });
}

(function initUI() {
  menuArt();
  $('#play').onclick = () => show('s1');
  $('#accept').onclick = () => show('s2');
  ['mhow', 'phow'].forEach(id => $('#' + id).onclick = () => ov('howm', true));
  const openSettings = () => { $('#sedit_row').style.display = S.on ? '' : 'none'; ov('settings', true); };
  ['msets', 'psets'].forEach(id => $('#' + id).onclick = openSettings);
  /* change how your character looks, even in the middle of a game */
  const edit = () => { ov('settings', false); openEditor(); };
  $('#sedit').onclick = edit; $('#pedit').onclick = edit;
  $('#hclose').onclick = () => ov('howm', false);
  $('#sclose').onclick = () => ov('settings', false);
  $('#pbtn').onclick = openPause;
  $('#resume').onclick = closePause;
  $('#quit').onclick = () => { if (confirm('Quit to the main menu? Your progress will be lost.')) location.reload(); };
  $('#mc2').onclick = () => location.reload();
  const mute = () => { S.set.mute = !S.set.mute; saveSet(); syncSet(); };
  $('#sbtn').onclick = mute; $('#msound').onclick = mute;
  ['mfull', 'fsbtn', 'sfull'].forEach(id => { $('#' + id).onclick = toggleFS; if (!FS) $('#' + id).style.display = 'none'; });
  if (!FS) $('#fsrow').style.display = 'none';

  $('#set_sfx').oninput = e => { S.set.sfx = +e.target.value; saveSet(); SND.init(); SND.vol(); SND.clink(5); };
  $('#set_amb').oninput = e => { S.set.amb = +e.target.value; saveSet(); SND.init(); SND.vol(); };
  $('#set_diff').onchange = e => { S.set.diff = e.target.value; saveSet(); };
  $('#set_unlock').onchange = e => { S.set.unlockAll = e.target.checked; saveSet(); };
  $('#set_easy').onchange = e => { S.set.easy = e.target.checked; saveSet(); syncSet(); if (S.on) drawCash(); };

  /* on phones and tablets, starting the game goes full screen and tries to lock landscape */
  $('#go').addEventListener('click', () => {
    if (FS && mm('(pointer:coarse)').matches && !(document.fullscreenElement || document.webkitFullscreenElement)) toggleFS();
  });

  /* first tap anywhere unlocks browser audio; every menu button gets a small tap sound */
  document.addEventListener('pointerdown', () => SND.init(), { once: true });
  document.addEventListener('click', e => { if (e.target.closest('.screen button, .ov button, .hud button, .ib') && !e.target.closest('.chip, .sw, .swl, .ctag')) SND.click(); });

  /* Esc or P: close the top overlay, otherwise pause. Switching tabs or rotating to portrait also pauses. */
  document.addEventListener('keydown', e => {
    if (editing) { if (e.key === 'Escape') cancelEdit(); return; }
    if (e.target.tagName === 'INPUT' && e.key !== 'Escape') return;
    if (e.key !== 'Escape' && e.key.toLowerCase() !== 'p') return;
    if (isOn('settings')) return ov('settings', false);
    if (isOn('howm')) return ov('howm', false);
    if (isOn('pausem')) return closePause();
    if (S.on && !isOn('modal')) openPause();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && S.on && !isOn('modal')) openPause(); });
  mm('(orientation:portrait) and (max-width:700px)').addEventListener('change', e => { if (e.matches && S.on && !isOn('modal')) openPause(); });

  syncSet();
})();