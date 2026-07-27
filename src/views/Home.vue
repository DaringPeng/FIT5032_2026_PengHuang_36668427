<template>
  <div class="text-center">
    <h1 class="display-4 fw-bold text-primary mb-4">Welcome to HealthCare Charity</h1>
    <p class="lead fs-3 text-dark mb-5">
      Reliable resources and support for seniors and dedicated family caregivers.
    </p>
    <div class="row g-4">
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
  </div>
</template>