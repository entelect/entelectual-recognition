<template>
  <div>
    <video id="live-video" width="320" height="247" hidden="hidden" autoplay />
    <canvas id="live-canvas" width="320" height="247" />

    <div>
      <b-modal
        id="confirm-modal"
        cancel-title="Close"
        ok-title="Confirm"
        @close="hideModal"
        @cancel="hideModal"
        @ok="confirmModal"
      >
        <p class="my-4">Hello {{currentMatch}}!</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      fps: 30,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: "",
      multipeSameMatch: false,
      currentMatch: "",
      pauseMatch: false
    };
  },

  watch: {
    multipeSameMatch: async function(multipeSameMatch) {
      this.showModal();
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
    async showModal() {
      //await this.$store.dispatch("camera/pauseCamera")
      this.pauseMatch = true;
      this.$bvModal.show("confirm-modal");
    },
    async hideModal() {
      //await this.$store.dispatch("camera/resumeCamera")
      this.pauseMatch = false;
      this.$bvModal.hide("confirm-modal");
      await this.$store.dispatch("face/resetMatch");
    },
    async confirmModal() {
      //await this.$store.dispatch("camera/resumeCamera")
      this.pauseMatch = false;
      this.$bvModal.hide("confirm-modal");
      await this.$store.dispatch("face/resetMatch");
    },

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

          if (!this.pauseMatch) {
            this.multipeSameMatch = await self.$store.dispatch(
              "face/isMultipeSameMatch"
            );
            this.currentMatch = await self.$store.dispatch(
              "face/getCurrentMatch"
            );
          }

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
