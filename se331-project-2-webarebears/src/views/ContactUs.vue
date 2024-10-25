<template>
  <div class="row">
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
          <button type="submit" class="btn btn-primary w-100">Submit</button>
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
.flash-message {
  display: block;
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
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
  margin-bottom: 0.5rem;
  margin-left: 200px;
  display: block;
}

.form-control {
  width: 50%;
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

.comment-box {
  height: 150px;
  resize: vertical;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: white;
  border-color: #007bff;
  color: #343a40;
}

.btn-primary:hover {
  background-color: #e0e0e0;
  border-color: #004085;
  color: #28a745;
}

hr {
  margin: 1rem 0;
}
</style>
