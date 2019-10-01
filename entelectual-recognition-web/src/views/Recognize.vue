<template>
  <div>
    <div class="row">
      <div class="col-12">
        <b-card-group deck>
          <b-card class="text-center" no-body>
            <b-card-header>Sign In</b-card-header>

            <b-card-body>
              <div class="row">
                <div class="col-12 mb-3">
                  <video id="live-video" width="256" height="256" hidden="hidden" autoplay />
                  <canvas id="live-canvas" class="video-container" width="256" height="256" />
                </div>
                <div>FPS: {{realFps}}</div>
              </div>
            </b-card-body>

            <b-card-footer>
              <b-button class="float-right" variant="primary" v-on:click="register">Manual Registration</b-button>
            </b-card-footer>
          </b-card>

          <b-card text-variant="white" v-bind:header="'Last ' + showLastNAttendees + '  Registrations'" class="text-center">
            <b-card-text>
              <div
                v-for="(attendee, index) in attendeesTop"
                v-bind:key="index"
              >{{ attendee.username }}</div>
            </b-card-text>
          </b-card>
        </b-card-group>
      </div>

      <img class="entelect-logo" src="../assets/images/entelect-logo.png" />
    </div>

    <div>
      <b-modal
        id="confirm-modal"
        cancel-title="Close"
        ok-title="Confirm"
        @close="hideModal"
        @cancel="hideModal"
        @ok="confirmModal"
      >
        <p class="my-4">Hi, is this you?</p>
        <b-form-input v-model="currentMatch" placeholder="Enter your first and last name."></b-form-input>
        <p class="my-4">If it is not you please change the name with your first and last name.</p>
      </b-modal>
    </div>

    <div>
      <b-modal
        id="event-modal"
        @no-close-on-backdrop="true"
        @no-close-on-esc="true"
        @hide-header-close="true"
        ok-title="Confirm"
        @ok-only="true"
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
      attendeesTop: [],
      attendeesAll: [],
      showLastNAttendees: 20
    };
  },

  watch: {
    multipeSameMatch: async function(multipeSameMatch) {
      if (
        !this.attendeesAll.some(
          attendee => attendee.username === this.currentMatch
        )
      ) {
        this.showModal();
      }
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
      //this.pauseMatch = false;
      this.delayResume();
      this.$bvModal.hide("confirm-modal");
      await this.$store.dispatch("face/resetMatch");
    },
    async confirmModal() {
      //await this.$store.dispatch("camera/resumeCamera")
      //this.pauseMatch = false;
      this.delayResume();
      this.addAttendee(this.currentMatch);
      this.$bvModal.hide("confirm-modal");
      await this.$store.dispatch("face/resetMatch");
    },

    async delayResume(){
      setTimeout(() => {
        this.pauseMatch = false;
      }, 3000);
    },

    async register() {
      this.pauseMatch = true;
      this.currentMatch = null;
      this.$bvModal.show("confirm-modal");
    },

    async confirmEventModal() {
      this.$bvModal.hide("event-modal");

      var response = await this.$store.dispatch("face/getAttendees", {
        eventId: this.selectedEventId
      });

      this.attendeesAll = this.$_.orderBy(
        response.attendees,
        "createdAt",
        "desc"
      );
      this.attendeesTop = this.attendeesAll.slice(0, this.showLastNAttendees);
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

    async addAttendee(username) {
      const response = await this.$store.dispatch("face/addAttendee", {
        username: username,
        eventId: this.selectedEventId
      });
      this.attendeesAll.push(response.attendee);
      this.attendeesTop.push(response.attendee);

      this.attendeesTop = this.$_.orderBy(
        this.attendeesTop,
        "createdAt",
        "desc"
      ).slice(0, this.showLastNAttendees);
    }
  }
};
</script>
