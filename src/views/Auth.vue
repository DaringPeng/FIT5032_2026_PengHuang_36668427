<!-- src/views/Auth.vue -->
<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-4 text-center fw-bold">{{ isLogin ? 'Sign In' : 'Create Account' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="p-4 border rounded bg-light" novalidate>
        <div class="mb-3">
          <label class="form-label fs-5 fw-bold">Email Address</label>
          <input type="email" class="form-control form-control-lg" v-model="form.email" :class="{ 'is-invalid': errors.email }">
          <div class="invalid-feedback fs-6">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fs-5 fw-bold">Password</label>
          <input type="password" class="form-control form-control-lg" v-model="form.password" :class="{ 'is-invalid': errors.password }">
          <div class="invalid-feedback fs-6">{{ errors.password }}</div>
        </div>

        <div class="mb-4" v-if="!isLogin">
          <label class="form-label fs-5 fw-bold">Select Role</label>
          <select class="form-select form-select-lg" v-model="form.role">
            <option value="user">Senior / Caregiver (Normal User)</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        
        <button type="button" class="btn btn-link fs-5 w-100" @click="toggleMode">
          {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(true);
const form = reactive({ email: '', password: '', role: 'user' });
const errors = reactive({ email: '', password: '' });

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errors.email = '';
  errors.password = '';
};

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email format.';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required.';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
    isValid = false;
  }
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: form.email,
        role: form.role, 
        createdAt: new Date()
      });
    }
    router.push('/');
  } catch (error) {
    errors.password = "Authentication failed: " + error.message;
  }
};
</script>