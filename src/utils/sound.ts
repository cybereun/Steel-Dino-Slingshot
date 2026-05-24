class SoundManager {
  private ctx: AudioContext | null = null;
  private flyingOsc: OscillatorNode | null = null;
  private flyingGain: GainNode | null = null;
  private lastStretchTime = 0;
  private bgmInterval: any = null;
  private bgmGain: GainNode | null = null;
  private isBgmMuted = false;
  private bgmStep = 0;

  private initCtx() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. 고무줄 당기는 소리 (Stretch)
  playStretch(dragDist: number) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // 너무 자주 나지 않도록 스로틀링 (80ms 간격)
    if (now - this.lastStretchTime < 0.08) return;
    this.lastStretchTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    // 당길수록 소리가 팽팽해지며 톤이 올라감
    const freq = 120 + dragDist * 1.6;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    // 짧은 톡/찌리릭 틱음
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 2. 발사음 (Launch)
  playLaunch() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 피치가 고역에서 저역으로 빠르게 떨어지는 음 ("슝!")
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    // 노이즈 버스트 추가
    const noise = this.createNoiseBufferNode(0.12);
    if (noise) {
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(250, now + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 3. 비행 소리 (Flying wind loop)
  startFlyingWind() {
    this.initCtx();
    if (!this.ctx) return;
    this.stopFlyingWind(); // 기존 비행음 청소

    const now = this.ctx.currentTime;

    this.flyingOsc = this.ctx.createOscillator();
    this.flyingGain = this.ctx.createGain();

    this.flyingOsc.type = 'triangle';
    this.flyingOsc.frequency.setValueAtTime(140, now);

    this.flyingGain.gain.setValueAtTime(0.01, now);

    this.flyingOsc.connect(this.flyingGain);
    this.flyingGain.connect(this.ctx.destination);

    this.flyingOsc.start(now);
  }

  updateFlyingWind(speed: number) {
    if (!this.ctx || !this.flyingOsc || !this.flyingGain) return;
    const now = this.ctx.currentTime;

    // 공룡 속도에 비례한 다이내믹 피치/볼륨 제어
    const targetFreq = 120 + Math.min(speed * 15, 260);
    const targetVolume = Math.min(speed * 0.004, 0.05);

    this.flyingOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.flyingGain.gain.setTargetAtTime(targetVolume, now, 0.08);
  }

  stopFlyingWind() {
    if (this.flyingOsc) {
      try {
        this.flyingOsc.stop();
      } catch (e) {}
      this.flyingOsc.disconnect();
      this.flyingOsc = null;
    }
    if (this.flyingGain) {
      this.flyingGain.disconnect();
      this.flyingGain = null;
    }
  }

  // 4. 충돌 타격음 (Impact)
  playImpact(force: number) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = Math.min(force * 0.015, 0.32);
    if (vol < 0.02) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    // 타격 노이즈 어택 추가
    const noise = this.createNoiseBufferNode(0.04);
    if (noise) {
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(450, now);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    }

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 5. 블록 파괴 및 붕괴음 (Break)
  playBreak(material: string) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (material.includes('GLASS')) {
      // 유리 깨지는 챙그랑 금속성 고음역 불협화음
      const freqs = [1300, 1600, 1950, 2300];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.65, now + 0.18 + idx * 0.04);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.04);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      });
    } else if (material.includes('WOOD')) {
      // 나무 부서지는 다다닥 소리 (펄스 펄럭임)
      for (let i = 0; i < 3; i++) {
        const timeOffset = now + i * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 80, timeOffset);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(280, timeOffset);

        gain.gain.setValueAtTime(0.07, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + 0.05);
      }
    } else {
      // 돌(STONE) 또는 기타: 묵직한 크래시 붕괴음
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      const noise = this.createNoiseBufferNode(0.22);
      if (noise) {
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(180, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
      }

      osc.start(now);
      osc.stop(now + 0.35);
    }
  }

  // 6. 대폭발음 (Explosion / TNT)
  playExplosion() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1) 묵직한 초저음 서브 베이스 쿵!
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(10, now + 0.45);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.5);

    // 2) 화이트 노이즈 + 디스토션 셰이퍼 + 로우패스 필터로 화력 굉음 연출
    const noise = this.createNoiseBufferNode(0.55);
    if (noise) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      const shaper = this.ctx.createWaveShaper();
      shaper.curve = this.makeDistortionCurve(80) as any;
      shaper.oversample = '4x';

      noise.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    }
  }

  // 7. 공룡 액티브 특수 스킬음
  playSkill(type: string) {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'TYRANNO') {
      this.playExplosion();
    } else if (type === 'TRICERA') {
      // 트리케라 돌진 레이저 빔소리 ("피유우웅!")
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.32);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'PTERA') {
      // 프테라 3단 뿅뿅뿅
      for (let i = 0; i < 3; i++) {
        const timeOffset = now + i * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + i * 130, timeOffset);
        osc.frequency.exponentialRampToValueAtTime(580 + i * 130, timeOffset + 0.1);

        gain.gain.setValueAtTime(0.1, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + 0.12);
      }
    }
  }

  private createNoiseBufferNode(duration: number): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    return source;
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // BGM 시작 (알고리즘 작곡 루프)
  startBGM() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.bgmInterval) return; // 이미 실행 중

    const savedMute = localStorage.getItem('steel-dino-bgm-muted');
    this.isBgmMuted = savedMute === 'true';

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : 0.05, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    this.bgmStep = 0;
    
    const playBgmStep = () => {
      if (!this.ctx || !this.bgmGain) return;
      
      // 혹시 suspended 상태이면 무시
      if (this.ctx.state === 'suspended') return;
      
      const now = this.ctx.currentTime;
      
      // A Minor 펜타토닉 스케일 기반 멜로디 & 베이스라인
      const baseNotes = [55, 55, 65.41, 65.41, 73.42, 73.42, 98, 87.31]; // A1, C2, D2, G2, F2
      const trebleNotes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33]; // A3 ~ D5
      
      const step = this.bgmStep % 16;
      
      // 1. 저음 베이스 비트 (정박 4분음표마다)
      if (step % 2 === 0) {
        const baseIndex = Math.floor(step / 2) % baseNotes.length;
        const baseFreq = baseNotes[baseIndex];
        
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        
        oscGain.gain.setValueAtTime(0.35, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc.connect(oscGain);
        oscGain.connect(this.bgmGain);
        osc.start(now);
        osc.stop(now + 0.5);
      }
      
      // 2. 우주적인 느낌의 신디 아르페지오 멜로디 (리드미컬 엇박)
      const melodyPattern = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0];
      if (melodyPattern[step] === 1) {
        const noteIndex = (step * 3 + 2) % trebleNotes.length;
        const noteFreq = trebleNotes[noteIndex];
        
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, now);
        
        // 로우패스 필터로 공명감 부여
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(3, now);
        
        oscGain.gain.setValueAtTime(0.08, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.bgmGain);
        osc.start(now);
        osc.stop(now + 0.4);
      }
      
      this.bgmStep++;
    };

    // 0.25초(8분음표) 주기로 루프
    this.bgmInterval = setInterval(playBgmStep, 250);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
  }

  setBgmVolume(mute: boolean) {
    this.initCtx();
    this.isBgmMuted = mute;
    localStorage.setItem('steel-dino-bgm-muted', String(mute));

    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    
    // 0.3초간 볼륨을 스무스하게 페이드
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(mute ? 0 : 0.05, now + 0.3);
  }

  getBgmMuteState(): boolean {
    const savedMute = localStorage.getItem('steel-dino-bgm-muted');
    return savedMute === 'true';
  }
}

export const sound = new SoundManager();
