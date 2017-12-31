import average from 'analyser-frequency-average';

// const audio = new Audio();
// audio.src = '/src/static/song.wav';

// music
const layer1 = new Audio();
layer1.src = '/src/static/track1.wav';
const ctx1 = new AudioContext();
const source1 = ctx1.createMediaElementSource(layer1);
const analyser1 = ctx1.createAnalyser();
source1.connect(analyser1);
analyser1.connect(ctx1.destination);
layer1.play();
layer1.loop = true;

const freq1 = new Uint8Array(analyser1.frequencyBinCount);
requestAnimationFrame(update);

var bands1 = {
  sub: {
    from: 20,
    to: 250
  },

  low: {
    from: 251,
    to: 500
  },

  mid: {
    from: 501,
    to: 3000
  },

  high: {
    from: 3001,
    to: 6000
  }
};

export { analyser1, freq1, bands1 };

const layer2 = new Audio();
layer2.src = '/src/static/track2.wav';
const ctx2 = new AudioContext();
const source2 = ctx2.createMediaElementSource(layer2);
const analyser2 = ctx2.createAnalyser();
source2.connect(analyser2);
analyser2.connect(ctx2.destination);
layer2.play();
layer2.loop = true;

const freq2 = new Uint8Array(analyser2.frequencyBinCount);
requestAnimationFrame(update);

var bands2 = {
  sub: {
    from: 20,
    to: 250
  },

  low: {
    from: 251,
    to: 500
  },

  mid: {
    from: 501,
    to: 3000
  },

  high: {
    from: 3001,
    to: 6000
  }
};

export { analyser2, freq2, bands2 };

const layer3 = new Audio();
layer3.src = '/src/static/track3.wav';
const ctx3 = new AudioContext();
const source3 = ctx3.createMediaElementSource(layer3);
const analyser3 = ctx3.createAnalyser();
source3.connect(analyser3);
analyser3.connect(ctx3.destination);
layer3.play();
layer3.loop = true;

const freq3 = new Uint8Array(analyser3.frequencyBinCount);
requestAnimationFrame(update);

var bands3 = {
  sub: {
    from: 20,
    to: 480
  },

  low: {
    from: 251,
    to: 500
  },

  mid: {
    from: 833,
    to: 1720
  },

  high: {
    from: 988,
    to: 9000
  }
};

export { analyser3, freq3, bands3 };

function update() {
  requestAnimationFrame(update);

  analyser1.getByteFrequencyData(freq1);
  analyser2.getByteFrequencyData(freq2);
  analyser3.getByteFrequencyData(freq3);
}
