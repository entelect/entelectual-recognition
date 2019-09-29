<template>
  <div>
    <b-card-group deck>
      <b-card bg-variant="secondary" text-variant="white" header="Recognition" class="text-center">
        <video id="live-video" width="320" height="247" hidden="hidden" autoplay />
        <canvas id="live-canvas" width="320" height="247" />
      </b-card>

      <b-card bg-variant="secondary" text-variant="white" header="Attendees" class="text-center">
        <b-card-text>
          <ul>
            <li v-for="(attendee, index) in sortedAttendees" v-bind:key="index">{{ attendee.username }}</li>
          </ul>
        </b-card-text>
      </b-card>
    </b-card-group>

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

    <div>
      <b-modal
        id="event-modal"
        no-close-on-backdrop="true"
        no-close-on-esc="true"
        hide-header-close="true"
        ok-title="Confirm"
        ok-only="true"
        @ok="confirmEventModal"
      >
        <b-form-group id="input-group" label="Event:" label-for="input">
          <b-form-select id="input" v-model="selectedEventId" :options="eventsOptions" required></b-form-select>
        </b-form-group>
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
      duration: 0,
      recognition: "",
      multipeSameMatch: false,
      currentMatch: "",
      pauseMatch: false,
      eventsOptions: [],
      selectedEventId: null,
      attendees: []
    };
  },

  watch: {
    multipeSameMatch: async function(multipeSameMatch) {
      this.showModal();
    }
  },

  computed: {
    sortedAttendees: function() {
      return this.$_.orderBy(this.attendees, "createdAt", "desc");
    }
  },
  
  async beforeMount() {
    await this.$store
      .dispatch("face/getAll")
      .then(() => this.$store.dispatch("face/getFaceMatcher"));

    await this.$store.dispatch("face/load");
  },

  async mounted() {
    await this.initialize();
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

    async confirmEventModal() {
      this.$bvModal.hide("event-modal");

      var response = await this.$store.dispatch("face/getAttendees", {
        eventId: this.selectedEventId
      });

      this.attendees = response.attendees;
      this.recognize();
    },

    async initialize() {
      const response = await this.$store.dispatch("face/getEvents");

      this.eventsOptions.push({
        text: "Please select an event",
        value: null
      });

      for (let i = 0; i < response.events.length; i++) {
        var event = response.events[i];
        this.eventsOptions.push({
          text: event.name,
          value: event.eventId
        });
      }

      this.$bvModal.show("event-modal");
    },

    async recognize() {
      await this.$store.dispatch("camera/startCamera").then(stream => {
        const videoDiv = document.getElementById("live-video");
        const canvasDiv = document.getElementById("live-canvas");
        const canvasCtx = canvasDiv.getContext("2d");
        videoDiv.srcObject = stream;
        this.startVideo(videoDiv, canvasDiv, canvasCtx, this.fps);
      });
    },
    async startVideo(videoDiv, canvasDiv, canvasCtx, fps) {
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
          detection.recognition = await self.$store.dispatch("face/recognize", {
            descriptor: detection.descriptor
          });

          // if (!this.pauseMatch) {
          //   this.multipeSameMatch = await self.$store.dispatch(
          //     "face/isMultipeSameMatch"
          //   );
          //   this.currentMatch = await self.$store.dispatch(
          //     "face/getCurrentMatch"
          //   );
          // }

          self.$store.dispatch("face/draw", {
            canvasCtx,
            detection
          });
        }
        let t1 = performance.now();
        self.duration = (t1 - t0).toFixed(2);
        self.realFps = (1000 / (t1 - t0)).toFixed(2);
      }, 1000 / fps);
    }
  },

  async addAttendee(username) {
    const response = await this.$store.dispatch("face/addAttendee");
    this.attendees.push(response.attendee);
  }
};
</script>
