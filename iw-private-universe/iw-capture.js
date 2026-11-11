class IWCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.position = 0;
    this.count = 0;
    this.sum = 0;
    this.buffer = new Int16Array(5120);
    this.index = 0;
  }
  process(inputs) {
    const ch = inputs[0]?.[0];
    if (ch)
      for (const v of ch) {
        this.position += 16000;
        this.sum += v;
        this.count++;
        if (this.position < sampleRate) continue;
        this.position -= sampleRate;
        this.buffer[this.index++] = Math.round(
          Math.max(-1, Math.min(1, this.sum / this.count)) * 32767,
        );
        this.sum = 0;
        this.count = 0;
        if (this.index === this.buffer.length) {
          this.port.postMessage(this.buffer.buffer, [this.buffer.buffer]);
          this.buffer = new Int16Array(5120);
          this.index = 0;
        }
      }
    return true;
  }
}
registerProcessor("iw-capture", IWCapture);
