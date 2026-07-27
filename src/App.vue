<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fs-3 fw-bold" to="/">HealthCare Charity</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto fs-5">
            <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/senior">Seniors</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/caregiver">Caregivers</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/community">Community</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/about">About</router-link></li>           
            <li class="nav-item" v-if="isAdmin">
              <router-link class="nav-link text-warning" to="/admin">Admin</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/auth">Login</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <button @click="handleLogout" class="nav-link btn btn-link text-decoration-none">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container py-5 my-4 bg-white rounded shadow-sm min-vh-100">
      <router-view />
    </main>

    <!-- Caregiver floating support button -->
    <button 
      class="btn btn-danger support-btn shadow-lg rounded-pill px-4 py-3 fw-bold"
      data-bs-toggle="modal" 
      data-bs-target="#supportModal"
    >
      Get Support Now
    </button>

    <div class="modal fade" id="supportModal" tabindex="-1" aria-labelledby="supportModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold" id="supportModalLabel">Immediate Help & Helplines</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <h6 class="fw-bold mb-3">Emergency Hotlines</h6>
            <div class="d-grid gap-2 mb-4">
              <a href="tel:911" class="btn btn-outline-danger d-flex justify-content-between align-items-center">
                <span>Medical Emergency</span> <strong>Call 911</strong>
              </a>
              <a href="tel:1800123456" class="btn btn-outline-primary d-flex justify-content-between align-items-center">
                <span>Caregiver Respite Line</span> <strong>1-800-123-456</strong>
              </a>
            </div>

            <hr>
            <h6 class="fw-bold mb-3 mt-3">Send us a direct message</h6>
            <!-- Contact Form with Validation -->
            <form @submit.prevent="submitContact" novalidate>
              <div class="mb-3">
                <input type="email" class="form-control" placeholder="Your Email" v-model="contactForm.email" required>
              </div>
              <div class="mb-3">
                <textarea class="form-control" rows="3" placeholder="How can we help you?" v-model="contactForm.message" required></textarea>
              </div>
              <div v-if="contactError" class="text-danger small mb-2">{{ contactError }}</div>
              <button type="submit" class="btn btn-success w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);

const contactForm = reactive({ email: '', message: '' });
const contactError = ref('');

// Listen to Firebase authentication state
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      isAdmin.value = userDoc.exists() && userDoc.data().role === 'admin';
    } else {
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  });
});

const handleLogout = async () => {
  await signOut(auth);
  router.push('/auth');
};

// Write contact form data to Firestore
const submitContact = async () => {
  if (!contactForm.email.includes('@') || contactForm.message.trim() === '') {
    contactError.value = 'Please enter a valid email and message.';
    return;
  }
  contactError.value = '';
  
  try {
    await addDoc(collection(db, 'contact_messages'), {
      email: contactForm.email,
      message: contactForm.message,
      timestamp: new Date()
    });
    
    alert('Your message has been securely sent to our support team!');
    contactForm.email = '';
    contactForm.message = '';
    
    // Automatically close modal
    const closeBtn = document.querySelector('#supportModal .btn-close');
    if(closeBtn) closeBtn.click();
    
  } catch (error) {
    console.error("Error adding document: ", error);
    contactError.value = 'Failed to send message. Please try again.';
  }
};
</script>

<style>
body { background-color: #f4f6f9; font-family: 'Arial', sans-serif; color: #212529; }
.support-btn { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
a:focus, button:focus { outline: 3px solid #ffc107 !important; }
</style>