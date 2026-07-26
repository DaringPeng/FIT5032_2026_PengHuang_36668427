<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 border p-4 rounded bg-light">
        <h2 class="mb-4 text-primary">Login to Your Account</h2>
        
        <form @submit.prevent="handleLogin" class="p-fluid">
          <div class="field mb-3">
            <label for="email" class="form-label fw-bold">Email Address</label>
            <InputText id="email" v-model="form.email" type="email" required />
          </div>

          <div class="field mb-4">
            <label for="password" class="form-label fw-bold">Password</label>
            <InputText id="password" v-model="form.password" type="password" required />
          </div>

          <Button type="submit" label="Secure Login" class="w-100 btn-lg" />
        </form>

        <div class="mt-4 text-center">
          <p class="fs-5">Don't have an account? <router-link to="/register">Register here</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const router = useRouter()
const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, form.email, form.password)
    alert('Login Successful! Welcome back.')
    router.push('/')
  } catch (error) {
    alert('Login Failed: ' + error.message)
  }
}
</script>