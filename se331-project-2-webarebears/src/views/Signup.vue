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
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  },
})

const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const username = firstname // Bind username to firstname dynamically

const onSubmit = handleSubmit(async values => {
  try {
    // Pass username as firstname
    const user = {
      ...values,
      username: values.firstname, // Set username to equal firstname
    }

    await authStore.register(
      user.email,
      user.password,
      user.firstname,
      user.lastname,
      user.username,
    )
    console.log(
      user.email,
      user.password,
      user.firstname,
      user.lastname,
      user.username,
    )

    messageStore.updateMessage('Registration successful! Please log in.')
    setTimeout(() => {
      messageStore.resetMessage()
      router.push({ name: 'login' }) 
    }, 3000)
  } catch (error) {
    messageStore.updateMessage(
      'Registration failed: ' + error.response.data.message,
    )
    setTimeout(() => {
      messageStore.resetMessage()
    }, 3000)
  }
})
</script>

<template>
  <div class="flex justify-center pt-20">
    <div class="w-full max-w-md">
      <h3 class="text-center mb-4 mt-10 text-xl font-bold">Signup</h3>
      <hr class="my-4 border-t-1 border-gray-300" />
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="firstname" class="block ml-4 text-left text-gray-700"
            >Firstname</label
          >
          <InputText
            v-model="firstname"
            class="form-control mt-1 w-full p-2 rounded"
            placeholder="First Name"
            :error="errors['firstname']"
          />
        </div>
        <div class="form-group">
          <label for="lastname" class="block ml-4 text-left text-gray-700"
            >Lastname</label
          >
          <InputText
            v-model="lastname"
            class="form-control mt-1 w-full p-2 rounded"
            placeholder="Last Name"
            :error="errors['lastname']"
          />
        </div>
        <div class="form-group">
          <label class="block ml-4 text-left text-gray-700">Email</label>
          <InputText
            v-model="email"
            type="email"
            class="form-control mt-1 w-full p-2 rounded"
            placeholder="Email address"
            :error="errors['email']"
          />
        </div>
        <div class="form-group">
          <label class="block ml-4 text-left text-gray-700">Password</label>
          <InputText
            v-model="password"
            type="password"
            class="form-control mt-1 w-full p-2 rounded"
            placeholder="Password"
            :error="errors['password']"
          />
        </div>
        <!-- <div class="form-group">
          <label class="block text-left text-gray-700">Confirm Password</label>
          <InputText v-model="password" type="password" class="form-control mt-1 w-full p-2 border rounded" placeholder="Confirm Password" :error="errors['password']" />
        </div> -->
        <div class="my-3">
          <button
            type="submit"
            class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* You can remove most of your previous CSS since Tailwind handles it now */
h3 {
  font-weight: bold;
  color: #343a40;
  margin-top: 2rem;
}

hr {
  margin: 1rem auto;
  width: 100%;
}

@media (max-width: 430px) {
  hr {
    width: 95%; /* Shorter width on mobile */
  }
}
</style>
