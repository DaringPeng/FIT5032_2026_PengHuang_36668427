<template>
  <div class="container mt-5">
    <h2>Register Account</h2>
    <form @submit.prevent="handleRegister" class="p-fluid">
      
      <!-- Two-way binding and validation: Email format -->
      <div class="field mb-3">
        <label for="email">Email</label>
        <InputText id="email" v-model="form.email" type="email" :class="{'p-invalid': errors.email}" @blur="validateEmail" />
        <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
      </div>

      <!-- Two-way binding and validation: Password length (must be at least 6 characters) -->
      <div class="field mb-3">
        <label for="password">Password (Min 6 chars)</label>
        <InputText id="password" v-model="form.password" type="password" :class="{'p-invalid': errors.password}" @blur="validatePassword" />
        <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
      </div>

      <!-- Role Selection -->
      <div class="field mb-4">
        <label>Select Your Role:</label>
        <select v-model="form.role" class="form-select">
          <option value="elderly">Senior / Elderly</option>
          <option value="caregiver">Caregiver</option>
        </select>
      </div>

      <Button type="submit" label="Register" :disabled="!isFormValid" />
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ email: '', password: '', role: 'elderly' })
const errors = reactive({ email: '', password: '' })

const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.email = emailPattern.test(form.email) ? '' : 'Please enter a valid email format.'
}
const validatePassword = () => {
  errors.password = form.password.length >= 6 ? '' : 'Password must be at least 6 characters.'
}

const isFormValid = computed(() => {
  return form.email && form.password && !errors.email && !errors.password
})

const handleRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: form.email,
      role: form.role
    })
    alert('Registration Successful!')
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}
</script>