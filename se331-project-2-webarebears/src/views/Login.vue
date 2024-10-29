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
  margin-bottom: 0.5rem;
  display: block;
  margin-left: 30%;
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
@media (max-width: 430px) {
  .form-label {
    margin-left: 8%;
  }
  .form-control {
    max-width: 80%;
  }
  .flex .w-full .max-w-md hr {
    width: 10%; 
    margin: 1rem auto; 
  }
}

hr {
  margin: 1rem auto;
  width: 95%;
}
</style>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()
const router = useRouter()
const authStore = useAuthStore()

const validationSchema = yup.object({
  email: yup.string().required('The email is required'),
  password: yup.string().required('The password is required'),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(values => {
  authStore
    .login(values.email, values.password)
    .then(() => {
      router.push({ name: 'list-view' })
    })
    .catch(() => {
      messageStore.updateMessage('Could not login')
      setTimeout(() => {
        messageStore.resetMessage()
      }, 3000)
    })
})
</script>

<template>
  <div class="flex justify-center pt-20">
    <div class="w-full max-w-md">
      <h3 class="text-center mb-4 mt-10 text-2xl font-bold">Login</h3>
      <hr class="my-4 border-t-1 border-gray-300" />
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="form-group">
          <label class="block ml-4 text-left text-gray-700"
            >Email</label
          >
          <InputText
            type="text"
            class="w-full rounded-md p-2 focus:outline-none focus:ring-2"
            v-model="email"
            placeholder="Email"
            :error="errors['email']"
          />
        </div>
        <div class="form-group">
          <label class="block ml-4 text-left text-gray-700"
            >Password</label
          >
          <InputText
            type="password"
            class="w-full rounded-md p-2 focus:outline-none focus:ring-2"
            v-model="password"
            placeholder="Password"
            :error="errors['password']"
          />
        </div>
        <div class="my-3">
          <button
            type="submit"
            class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
