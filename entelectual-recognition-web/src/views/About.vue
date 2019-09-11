<template>
  <video id="live-video" width="320" height="247" autoplay />
  <!-- <canvas id="live-canvas" width="320" height="247" /> -->
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      fps: 15,
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
      await this.$store.dispatch("camera/startCamera").then(stream => {
        const videoDiv = document.getElementById("live-video");
        // const canvasDiv = document.getElementById('live-canvas')
        // const canvasCtx = canvasDiv.getContext('2d')
        videoDiv.srcObject = stream;
      });
    }
  }
};
</script>
