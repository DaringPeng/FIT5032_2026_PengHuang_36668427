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
            <h6 class="fw-bold mb-3 mt-3">Send us a email</h6>
            <!-- Contact Form with Validation -->
            <form id="contactEmailForm" @submit.prevent="submitContact" enctype="multipart/form-data" novalidate>
              <div class="mb-3">
                <input 
                  type="email" 
                  name="user_email" 
                  class="form-control" 
                  placeholder="Your Email" 
                  v-model="contactForm.email" 
                  @input="contactError = ''"
                  required
                >
              </div>
              <div class="mb-3">
                <textarea 
                  name="message" 
                  class="form-control" 
                  rows="3" 
                  placeholder="How can we help you?" 
                  v-model="contactForm.message" 
                  @input="contactError = ''"
                  required
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted small mb-1">Attach Document (Optional)</label>
                <div class="input-group">
                  <label class="btn btn-outline-secondary mb-0" for="hiddenFileInput">
                    Choose File
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="fileName" 
                    placeholder="No file chosen" 
                    readonly 
                    style="background-color: #fff; cursor: pointer;"
                    @click="triggerFileInput"
                  >
                  <input 
                    type="file" 
                    id="hiddenFileInput" 
                    name="attachment" 
                    class="d-none" 
                    accept=".txt,.docx,.pdf,.png,.jpg,.jpeg"
                    @change="handleFileChange"
                  >
                </div>
              </div>
              
              <div v-if="contactError" class="text-danger small mb-2 fw-bold">{{ contactError }}</div>
              
              <button type="submit" class="btn btn-success w-100" :disabled="isSending">
                {{ isSending ? 'Sending securely...' : 'Send Email' }}
              </button>
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
import { doc, getDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);

const contactForm = reactive({ email: '', message: '' });
const contactError = ref('');
const isSending = ref(false);
const fileName = ref('');
const selectedFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    fileName.value = file.name;
    selectedFile.value = file;
  } else {
    fileName.value = '';
    selectedFile.value = null;
  }
};

const triggerFileInput = () => {
  document.getElementById('hiddenFileInput').click();
};

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
  isSending.value = true;
  
  try {
    let attachmentLink = 'No attachment included.';

    if (selectedFile.value) {
      const formData = new FormData();
      formData.append('file', selectedFile.value);
      
      const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadResponse.json();
      
      if (uploadData.status === 'success') {
        const directDownloadUrl = uploadData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        attachmentLink = `${directDownloadUrl} (Secure temporary download link)`;
      } else {
        throw new Error('File hosting API failed');
      }
    }

    const emailParams = {
      user_email: contactForm.email,
      message: contactForm.message,
      attachment_url: attachmentLink
    };

    await emailjs.send(
      'service_xfn5mwg',
      'template_ajyrp49',
      emailParams,
      'Vg0By7MUMLe_8miyl'
    );
    
    alert('Your email has been successfully sent to our support team!');
    contactForm.email = '';
    contactForm.message = '';
    fileName.value = '';
    selectedFile.value = null;

    document.getElementById('contactEmailForm').reset();
    document.querySelector('#supportModal .btn-close').click();  // Automatically close modal
  } catch (error) {
    console.error("Error sending email: ", error);
    contactError.value = 'Network error or file upload failed. Please try again.';
  } finally {
    isSending.value = false;
  }
};
</script>

<style>
body { background-color: #f4f6f9; font-family: 'Arial', sans-serif; color: #212529; }
.support-btn { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
a:focus, button:focus { outline: 3px solid #ffc107 !important; }
</style>