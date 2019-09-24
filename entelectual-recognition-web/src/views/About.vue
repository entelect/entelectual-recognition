<template>
  <div>
    <video id="live-video" width="320" height="247" hidden="hidden" autoplay />
    <canvas id="live-canvas" width="320" height="247" />

    <span>Real FPS: {{ realFps }}</span>
    <span>Duration: {{ duration }} ms</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      fps: 23,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: "",
      withOptions: [0, 1, 2, 3]
    };
  },

  watch: {
    recognition: function(recognition) {
      // const videoDiv = document.getElementById("live-video");
      // const canvasDiv = document.getElementById("live-canvas");
      // const canvasCtx = canvasDiv.getContext("2d");
      // this.start(videoDiv, canvasDiv, canvasCtx, newFps);
      //  console.log(recognition)
    }
  },

  async beforeMount() {
    await this.$store
      .dispatch("face/getAll")
      .then(() => this.$store.dispatch("face/getFaceMatcher"));

    await this.$store.dispatch("face/load");
  },

  async mounted() {
    await this.recognize();
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.$store.dispatch("camera/stopCamera");
  },

  methods: {
    async recognize() {
      this.increaseProgress();
      await this.$store.dispatch("camera/startCamera").then(stream => {
        const videoDiv = document.getElementById("live-video");
        const canvasDiv = document.getElementById("live-canvas");
        const canvasCtx = canvasDiv.getContext("2d");
        videoDiv.srcObject = stream;

        this.increaseProgress();
        this.start(videoDiv, canvasDiv, canvasCtx, this.fps);
      });
    },
    async start(videoDiv, canvasDiv, canvasCtx, fps) {
      let self = this;
      if (self.interval) {
        clearInterval(self.interval);
      }
      self.interval = setInterval(async () => {
        let t0 = performance.now();
        canvasCtx.drawImage(videoDiv, 0, 0, 320, 247);
        const detection = await self.$store.dispatch("face/getFaceDetection", {
          canvas: canvasDiv
        });
        if (detection) {
          if (self.isProgressActive) {
            self.increaseProgress();
            self.isProgressActive = false;
          }

          detection.recognition = await self.$store.dispatch("face/recognize", {
            descriptor: detection.descriptor
          });
          self.$store.dispatch("face/draw", {
            canvasCtx,
            detection
          });
        }
        let t1 = performance.now();
        self.duration = (t1 - t0).toFixed(2);
        self.realFps = (1000 / (t1 - t0)).toFixed(2);
      }, 1000 / fps);
    },

    increaseProgress() {
      this.progress = (100 / this.step) * ++this.counter;
    }
  }
};
</script>
