<template>
  <div v-if="loaded" class="relative bg-counter mt-20">
    <section
      class="flex flex-col md:flex-row justify-between items-center mx-auto my-2 mt-1 max-w-screen-lg"
    >
      <div class="text-container">
        <h5
          v-if="!expired"
          class="font-semibold text-3xl text-center text-white"
        >
          A Return to <span class="text-customRed"> the City of Angels </span>
        </h5>

        <h5 v-else class="font-semibold text-2xl text-center text-white">
          Welcome to Olympic 2028!
        </h5>

        <!-- Divider -->
        <div class="divider"></div>

        <p class="text-white text-base text-center mt-1 my-10">
          In 2028, the world will turn its eyes to Los Angeles as the city
          prepares to host the Olympic Games for the third time. Known for its
          dynamic culture, iconic skyline, and innovative spirit, LA will once
          again take center stage in the global sports arena. With a blend of
          historic venues and state-of-the-art facilities, athletes from every
          corner of the globe will come together to compete for glory, inspired
          by the city’s vibrant energy. As we approach this momentous event, the
          excitement is building for a truly unforgettable celebration of
          athleticism, unity, and diversity in the heart of Southern California.
        </p>
      </div>
    </section>

    <!-- Countdown timer below -->
    <section class="flex flex-wrap justify-center mt-8 text-white">
      <div class="countdown-unit mr-10 relative">
        {{ displayYears }}
        <div class="text-sm absolute">years</div>
      </div>

      <div class="countdown-unit mr-10 relative">
        {{ displayDays }}
        <div class="text-sm absolute">days</div>
      </div>

      <div class="countdown-unit mr-10 relative">
        {{ displayHours }}
        <div class="text-sm absolute">hours</div>
      </div>

      <div class="countdown-unit mr-10 relative">
        {{ displayMinutes }}
        <div class="text-sm absolute">minutes</div>
      </div>

      <div class="countdown-unit mr-10 relative">
        {{ displaySeconds }}
        <div class="text-sm absolute">seconds</div>
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
.bg-counter {
  background-image: url('@/assets/la.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
}

.divider {
  background-color: white;
  height: 100%;
  width: 2px;
  margin: 0 10px;
  display: block;
}

.text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px 10px;
}

/* Mobile View */
@media (max-width: 430px) {
  .divider {
    height: 1px;
    width: 80%;
  }
  h5 {
    text-align: center;
  }
  p{
    font-size: 0.8rem;
  }
  .countdown-unit {
    font-size: 2rem; /* Adjust font size for smaller screens */
    margin: 0 10px; /* Adjust margin for better spacing */
    text-align: center; /* Center text for better visibility */
  }

  .countdown-unit div {
    font-size: 0.8rem; /* Smaller label for mobile */
  }
}

/* Desktop View */
@media (min-width: 431px) {
  .text-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .divider {
    width: 1px;
    height: 80%;
    margin: 0 20px;
    display: inline-block;
  }
  .countdown-unit {
    font-size: 5rem; /* Original size for desktop */
  }
}

h5 {
  max-width: 600px;
  padding-bottom: 10px;
}

p {
  max-width: 600px;
  padding-top: 10px;
}

/* Countdown timer adjustments */
.countdown-unit {
  max-width: 60px;
}
</style>
