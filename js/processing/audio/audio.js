class AudioAnalyzer {
    FPS = 60;
    FFT_SIZE = 256;
    SMOOTHING = 0.7;
    audio = null
    analyser = null;
    context = null
    aStream = null
    source = null

    constructor(audio, options = null) {
        this.audio = audio
        this.INCREMENT = 1 / this.FPS;
        if (options) {
            Object.keys(options).forEach(k => this[k] = options[k])
        }
    }


    analyzing() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        this.context = new AudioContext();

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.FFT_SIZE;
        this.analyser.smoothingTimeConstant = this.SMOOTHING;

        this.source = this.context.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
    }

    getFrame() {

        var rawFreq = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(rawFreq);

        // var rawTimeDom = new Uint8Array(this.analyser.fftSize);
        // this.analyser.getByteTimeDomainData(rawTimeDom);
        // var frame = [];
        // frame.push(this.peak(rawTimeDom), this.rms(rawTimeDom), this.low(rawFreq), this.high(rawFreq));

        return rawFreq;

    }

    initAudioStream() {
        // create a stream from our AudioContext
        var dest = this.context.createMediaStreamDestination();
        this.aStream = dest.stream;
        this.source.connect(dest)
        this.audio.play();
              
      }

    createWaveForm() {
        var rawFreq = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(rawFreq);

        return rawFreq
    }

    peak(data) {
        let peak = 0;
        for (let i = 0; i < data.length; i++) {
            const sample = (data[i] - 128) / 128; // Normalize to range between -1 and 1
            if (sample > peak) {
                peak = sample;
            }
        }

        return peak;
    }

    rms(data) {
        let rms = 0;
        for (var i = 0; i < data.length; i++) {
            rms += data[i] * data[i];
        }
        rms /= data.length;
        rms = Math.sqrt(rms);
        return rms;
    }

    high() {
        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(frequencyData);

        // Define the frequency range of interest (adjust as needed)
        const minFrequency = 20; // Minimum frequency of interest in Hz
        const maxFrequency = 20000; // Maximum frequency of interest in Hz

        const binSize = this.audio.sampleRate / this.analyser.fftSize;
        const minBin = Math.floor(minFrequency / binSize);
        const maxBin = Math.ceil(maxFrequency / binSize);

        let highFrequency = 0;
        let maxAmplitude = 0;

        for (let i = maxBin - 1; i >= minBin; i--) {
            if (frequencyData[i] > maxAmplitude) {
                maxAmplitude = frequencyData[i];
                highFrequency = i * binSize;
            }
        }

        return highFrequency;
    }

    low() {
        const minFrequency = 20; // Minimum frequency of interest in Hz
        const maxFrequency = 20000; // Maximum frequency of interest in Hz

        const binSize = this.audio.sampleRate / this.analyser.fftSize;
        const minBin = Math.floor(minFrequency / binSize);
        const maxBin = Math.ceil(maxFrequency / binSize);

        let lowFrequency = 0;
        let maxAmplitude = 0;

        for (let i = minBin; i < maxBin; i++) {
            if (frequencyData[i] > maxAmplitude) {
                maxAmplitude = frequencyData[i];
                lowFrequency = i * binSize;
            }
        }

        return lowFrequency;
    }
}