<template>
  <div v-if="loaded">
    <!-- Section with flexbox layout -->
    <img src="@/assets/cloud1.png" alt="cloud" class="cloud-image" />
    <section
      class="flex justify-between items-center mx-auto mt-10 layout-container"
    >
      <!-- h5 title on the left with 40% width -->
      <h5 v-if="!expired" class="h5-center">
        A Return to <span> the City of Angels </span>
      </h5>

      <h5 v-else class="h5-center">Welcome to Olympic 2028!</h5>

      <!-- Description on the right with 60% width -->
      <p class="description-center">
        In 2028, the world will turn its eyes to Los Angeles as the city
        prepares to host the Olympic Games for the third time. Known for its
        dynamic culture, iconic skyline, and innovative spirit, LA will once
        again take center stage in the global sports arena. With a blend of
        historic venues and state-of-the-art facilities, athletes from every
        corner of the globe will come together to compete for glory, inspired by
        the city’s vibrant energy. As we approach this momentous event, the
        excitement is building for a truly unforgettable celebration of
        athleticism, unity, and diversity in the heart of Southern California.
      </p>
    </section>
    <div style="text-align: right">
      <img src="@/assets/cloud1.png" alt="cloud" class="cloud-image-2" />
    </div>

    <!-- Countdown timer below -->
    <section class="flex text-6xl justify-center content-center mt-8">
      <div class="years mr-10 relative">
        {{ displayYears }}
        <div class="label text-sm absolute">years</div>
      </div>

      <div class="days mr-10 relative">
        {{ displayDays }}
        <div class="label text-sm absolute">days</div>
      </div>

      <div class="hours mr-10 relative">
        {{ displayHours }}
        <div class="label text-sm absolute">hours</div>
      </div>

      <div class="minutes mr-10 relative">
        {{ displayMinutes }}
        <div class="label text-sm absolute">minutes</div>
      </div>

      <div class="seconds mr-10 relative">
        {{ displaySeconds }}
        <div class="label text-sm absolute">seconds</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'],
  data: () => ({
    displayYears: 0,
    displayDays: 0,
    displayHours: 0,
    displayMinutes: 0,
    displaySeconds: 0,
    loaded: false,
    expired: false,
  }),
  computed: {
    _seconds: () => 1000,
    _minutes() {
      return this._seconds * 60
    },
    _hours() {
      return this._minutes * 60
    },
    _days() {
      return this._hours * 24
    },
    _years() {
      return this._days * 365
    },
    end() {
      return new Date(
        this.year,
        this.month - 1,
        this.date,
        this.hour,
        this.minute,
        this.second,
        this.millisecond,
      )
    },
  },
  mounted() {
    this.showRemaining()
  },
  methods: {
    formatNum: num => (num < 10 ? '0' + num : num),

    showRemaining() {
      const timer = setInterval(() => {
        const now = new Date()
        const distance = this.end.getTime() - now.getTime()

        if (distance < 0) {
          clearInterval(timer)
          this.expired = true
          this.loaded = true
          return
        }
        const years = Math.floor(distance / this._years)
        const days = Math.floor((distance % this._years) / this._days)
        const hours = Math.floor((distance % this._days) / this._hours)
        const minutes = Math.floor((distance % this._hours) / this._minutes)
        const seconds = Math.floor((distance % this._minutes) / this._seconds)
        this.displayYears = this.formatNum(years)
        this.displayMinutes = this.formatNum(minutes)
        this.displaySeconds = this.formatNum(seconds)
        this.displayHours = this.formatNum(hours)
        this.displayDays = this.formatNum(days)
        this.loaded = true
      }, 1000)
    },
  },
}
</script>

<style scoped>
.layout-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Smaller cloud image */
.cloud-image {
  width: 100px; /* Set desired width */
  height: auto;
}

/* h5 with 40% width */
.h5-center {
  font-weight: 600;
  font-size: 30px;
  width: 40%;
  text-align: center;
  margin-left: 10px;
}

/* Description with 60% width */
.description-center {
  width: 50%;
  font-size: 0.875rem;
  color: #495057;
  line-height: 1.5;
  text-align: center;
  margin-right: 60px;
  margin-top: 30px;
}

/* Countdown timer adjustments */
.seconds {
  max-width: 60px;
}
.cloud-image-2 {
  width: 180px;
  height: auto;
  margin-left: auto; /* Pushes the image to the right */
}
</style>
