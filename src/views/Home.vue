<template>
  <div class="text-center">
    <h1 class="display-4 fw-bold text-primary mb-4">Welcome to HealthCare Charity</h1>
    <p class="lead fs-3 text-dark mb-5">
      Reliable resources and support for seniors and dedicated family caregivers.
    </p>
    <div class="row g-4 mb-5">
      <div class="col-12 col-md-6">
        <div class="card h-100 shadow-sm border-0 bg-light p-4">
          <h2 class="card-title fw-bold">For Seniors</h2>
          <p class="card-text fs-5">Find step-by-step video guides, local walking groups, and simple community events to stay active and connected.</p>
          <router-link to="/senior" class="btn btn-primary btn-lg mt-auto">Senior Hub</router-link>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card h-100 shadow-sm border-0 bg-light p-4">
          <h2 class="card-title fw-bold">For Caregivers</h2>
          <p class="card-text fs-5">Access downloadable safety infographics, medical admin tools, and quick respite care options.</p>
          <router-link to="/caregiver" class="btn btn-success btn-lg mt-auto">Caregiver Hub</router-link>
        </div>
      </div>
    </div>

    <!-- Serverless Cloud Functions (Alibaba) -->
    <div class="d-flex justify-content-start mt-2 mb-3">
      <div class="bg-white rounded-pill shadow-sm border border-light px-3 py-2 d-flex align-items-center gap-2" aria-label="Website visitor counter">
        <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 64px; height: 64px;">
          <span class="fs-2">🌍</span>
        </div>

        <div class="d-flex align-items-center gap-2 pe-2">
          <span class="text-muted fw-bold" style="font-size: 1.0rem; letter-spacing: 0.5px;">
            Total Visits (Provided by Alibaba Cloud Function):
          </span>
          <h5 class="mb-0 fw-bold text-dark">
            <span v-if="isLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
            <span v-else-if="errorMessage" class="text-danger" style="font-size: 0.9rem;">Error</span>
            <span v-else>{{ totalVisits.toLocaleString() }}</span>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const totalVisits = ref(0);
const errorMessage = ref('');
const ALIBABA_CLOUD_FUNCTION_URL = 'https://visitcount-cbgqgpljgl.cn-hangzhou.fcapp.run'; 

onMounted(async () => {
  try {
    const response = await fetch(ALIBABA_CLOUD_FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    totalVisits.value = data.total_visits;
    
  } catch (error) {
    console.error("Alibaba Cloud Function Error:", error);
    errorMessage.value = "Counter unavailable";
  } finally {
    isLoading.value = false;
  }
});
</script>