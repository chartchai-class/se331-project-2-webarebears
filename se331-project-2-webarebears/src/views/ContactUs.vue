<template>
  <div class="row pt-20">
    <div class="col-md-6 offset-md-3">
      <h3 class="text-center mb-4 mt-10">Contact Us</h3>
      <hr />
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input
            v-model="firstName"
            type="text"
            class="form-control"
            placeholder="First Name"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input
            v-model="lastName"
            type="text"
            class="form-control"
            placeholder="Last Name"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea
            v-model="message"
            class="form-control comment-box"
            placeholder="Type Here"
            required
          ></textarea>
        </div>
        <div class="my-3">
          <button
            @click="submitComment"
            class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
          >
            Submit
          </button>
        </div>

        <!-- Move flash message here -->
        <div
          v-if="successMessage"
          class="mt-3 bg-customYellow text-customBlue px-4 py-2 rounded-lg shadow-lg"
        >
          <h4>{{ successMessage }}</h4>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const WEB3FORMS_ACCESS_KEY = '7440b285-d635-4f2b-9b4f-390bc3a68499'

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      successMessage: '', // To hold the success message
    }
  },
  methods: {
    async submitForm() {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          firstname: this.firstName,
          lastname: this.lastName,
          email: this.email,
          message: this.message,
        }),
      })
      const result = await response.json()
      if (result.success) {
        this.successMessage = 'Your message has been sent successfully!' // Set success message
        this.resetForm() // Reset the form
        setTimeout(() => {
          this.successMessage = '' // Clear message after 3 seconds
        }, 3000)
        console.log(result)
      }
    },
    resetForm() {
      // Reset form data
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.message = ''
    },
  },
}
</script>

<style scoped>
h3 {
  font-weight: bold;
  color: #343a40;
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  text-align: left;
  color: #495057;
  margin-bottom: 0.5rem; /* Add space below the label */
  display: block; /* Make sure the label is on top of the input */
  margin-left: 30%;
}
@media (max-width: 430px) {
  .form-label {
    margin-left: 8%;
  }
  .form-control{
    max-width: 80%;
  }
}

.form-control {
  width: 500px;
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

hr {
  margin: 1rem auto;
  width: 40%;
}
</style>
