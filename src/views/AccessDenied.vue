<template>
  <div class="d-flex flex-column justify-content-center align-items-center py-5 mt-5">
    <h1 class="display-1 fw-bold text-danger mb-3">403</h1>
    <h2 class="fw-bold mb-4">Access Denied</h2>
    <p class="fs-4 text-muted mb-5 text-center" style="max-width: 600px;">
      Sorry, you do not have the administrator privileges required to access this page. 
    </p>
    
    <router-link to="/" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
      Return to Homepage
    </router-link>
  </div>
</template>

<script setup>
</script>