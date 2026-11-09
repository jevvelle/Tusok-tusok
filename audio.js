'use strict';
/* Procedural sound (Web Audio). No audio files needed. Everything is synthesized. */
const SND = {
  ctx: null, nb: null, sfx: null, amb: null, siz: null, looping: false,

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const x = this.ctx = new C();
    this.sfx = x.createGain(); this.amb = x.createGain();
    this.sfx.connect(x.destination); this.amb.connect(x.destination);
    this.nb = x.createBuffer(1, x.sampleRate * 2, x.sampleRate);
    const d = this.nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    /* kawali sizzle: looped white noise, high passed, volume follows how much food is frying */
    const src = x.createBufferSource(); src.buffer = this.nb; src.loop = true;
    const hp = x.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3200;
    this.siz = x.createGain(); this.siz.gain.value = 0;
    src.connect(hp).connect(this.siz).connect(this.sfx); src.start();
    this.vol();
  },
  vol() {
    if (!this.ctx) return;
    const m = S.set.mute ? 0 : 1;
    this.sfx.gain.value = S.set.sfx * m; this.amb.gain.value = S.set.amb * m;
  },
  tone(f, d = .15, type = 'sine', v = .3, at = 0, to = null, bus) {
    if (!this.ctx) return;
    const x = this.ctx, t = x.currentTime + at, o = x.createOscillator(), g = x.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(bus || this.sfx); o.start(t); o.stop(t + d + .03);
  },
  noise(d = .1, v = .3, f = 2000, type = 'highpass', at = 0) {
    if (!this.ctx) return;
    const x = this.ctx, t = x.currentTime + at, s = x.createBufferSource(), fl = x.createBiquadFilter(), g = x.createGain();
    s.buffer = this.nb; fl.type = type; fl.frequency.value = f;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    s.connect(fl).connect(g).connect(this.sfx); s.start(t, Math.random()); s.stop(t + d);
  },

  /* ---- cooking ---- */
  sizzle(n) { if (this.siz) this.siz.gain.setTargetAtTime(n ? Math.min(.28, .05 + .04 * n) : 0, this.ctx.currentTime, .15); },
  splash() { this.noise(.3, .35, 1500); this.tone(220, .18, 'sine', .12, 0, 80); },
  pop() { this.noise(.04, .1, 4200); },
  ding() { this.tone(1320, .3, 'sine', .12); },
  burnt() { this.noise(.4, .22, 700, 'lowpass'); this.tone(180, .35, 'sawtooth', .07, 0, 80); },
  glug() { this.tone(520, .12, 'sine', .2, 0, 260); this.tone(480, .12, 'sine', .2, .14, 240); },

  /* ---- ui + money ---- */
  click() { this.tone(900, .05, 'triangle', .1); },
  /* character editor: soft cloth rustle, a swoosh between steps, and a sparkle when you save */
  equip() { this.noise(.09, .13, 2600, 'bandpass'); this.tone(700, .09, 'triangle', .1, .02, 1050); },
  swoosh() { this.noise(.2, .1, 1000, 'bandpass'); this.noise(.16, .08, 2400, 'bandpass', .06); },
  sparkle() { [1568, 1976, 2349, 3136, 3951].forEach((f, i) => this.tone(f, .22, 'sine', .09, i * .07)); },
  grab() { this.tone(660, .07, 'triangle', .14); },
  err() { this.tone(170, .24, 'square', .12, 0, 110); },
  sad() { this.tone(420, .45, 'sine', .14, 0, 200); },
  clink(d) {
    if (d >= 20) { this.noise(.14, .16, 1400, 'bandpass'); return; }
    this.tone(2400 + d * 12, .2, 'triangle', .16); this.tone(3700 + d * 12, .12, 'sine', .08, .02);
  },
  bill() { this.noise(.18, .16, 1600, 'bandpass'); this.noise(.12, .12, 2200, 'bandpass', .12); },
  kaching() {
    this.noise(.05, .1, 5000);
    this.tone(1760, .5, 'sine', .18); this.tone(2637, .6, 'sine', .14, .08);
    this.tone(3100, .2, 'triangle', .08, .2); this.tone(3900, .15, 'triangle', .07, .26);
  },

  /* ---- the sorbetero handbell: rings when a customer walks up ---- */
  bell() {
    [0, .2].forEach(at => {
      this.tone(1568, .55, 'sine', .2, at); this.tone(2349, .4, 'sine', .1, at); this.tone(3136, .25, 'sine', .05, at);
    });
  },

  /* ---- level music ---- */
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .28, 'triangle', .2, i * .12)); this.tone(1047, .7, 'triangle', .18, .5); },
  unlock() { this.tone(784, .2, 'triangle', .2); this.tone(1175, .5, 'triangle', .2, .15); this.noise(.1, .08, 6000, 'highpass', .15); },
  win() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => this.tone(f, .3, 'triangle', .2, i * .11));
    [523, 659, 784, 1047].forEach(f => this.tone(f, 1.2, 'triangle', .1, .75));
    this.bell();
  },

  /* ---- street ambience: tricycle putt-putt and a jeepney horn drifting by ---- */
  trike() {
    const x = this.ctx; if (!x) return;
    const t = x.currentTime, o = x.createOscillator(), l = x.createOscillator(), lg = x.createGain(), am = x.createGain(), g = x.createGain(), f = x.createBiquadFilter();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(58, t); o.frequency.linearRampToValueAtTime(82, t + 1.6); o.frequency.linearRampToValueAtTime(52, t + 3.6);
    f.type = 'lowpass'; f.frequency.value = 380;
    l.frequency.value = 13; lg.gain.value = .5; am.gain.value = .5; l.connect(lg).connect(am.gain);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.6, t + 1.6); g.gain.linearRampToValueAtTime(0, t + 3.6);
    o.connect(f).connect(am).connect(g).connect(this.amb);
    o.start(t); l.start(t); o.stop(t + 3.7); l.stop(t + 3.7);
  },
  horn() { [0, .2, .4].forEach((at, i) => { this.tone(i === 2 ? 523 : 466, i === 2 ? .35 : .14, 'square', .05, at, null, this.amb); this.tone(i === 2 ? 659 : 587, i === 2 ? .35 : .14, 'square', .03, at, null, this.amb); }); },
  loop() {
    if (this.looping) return; this.looping = true;
    const go = () => setTimeout(() => {
      if (S.on && !S.paused && this.ctx && S.set.amb > 0 && !S.set.mute) pick([() => this.trike(), () => this.horn(), () => this.trike()])();
      go();
    }, rnd(7000, 15000));
    go();
  }
};