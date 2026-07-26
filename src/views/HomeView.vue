<template>
  <!-- using container, row, and col -->
  <div class="container mt-4 home-page">
    <section class="row justify-content-center hero-section mb-5">
      <div class="col-12 col-lg-10 text-center p-5 bg-light border rounded">
        <h1 class="display-4 text-primary mb-4">Supporting Your Independence and Well-being.</h1>
        <div class="search-box mx-auto" style="max-width: 600px;">
          <label for="main-search" class="form-label fs-4 fw-bold">What do you need help finding today?</label>
          <div class="input-group input-group-lg">
            <input type="text" id="main-search" class="form-control border-primary border-3" placeholder="e.g., Joint pain exercises..." />
            <button class="btn btn-primary fw-bold px-4">Search</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Responsive grid: 1 column for mobile, 2 columns for tablet, 3 columns for desktop -->
    <section class="row g-4 quick-links">
      <div class="col-12 col-md-6 col-xl-4">
        <router-link to="/health-resources" class="card h-100 text-center p-4 text-decoration-none text-dark border-3">
          <div class="display-1 mb-3">📘</div>
          <h2 class="text-primary">Health Resource Guides</h2>
          <p class="fs-5">Read large-print guides on physical and mental health.</p>
        </router-link>
      </div>

      <div class="col-12 col-md-6 col-xl-4">
        <router-link to="/community" class="card h-100 text-center p-4 text-decoration-none text-dark border-3">
          <div class="display-1 mb-3">👥</div>
          <h2 class="text-primary">Local Community Events</h2>
          <p class="fs-5">Find safe, social groups and walking clubs near you.</p>
        </router-link>
      </div>

      <div class="col-12 col-md-6 col-xl-4">
        <router-link to="/caregivers" class="card h-100 text-center p-4 text-decoration-none text-dark border-3">
          <div class="display-1 mb-3">🏥</div>
          <h2 class="text-primary">Caregiver Support FAQs</h2>
          <p class="fs-5">Quick access to respite care and home safety info.</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s, border-color 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  border-color: #0056b3 !important;
  background-color: #f9f9f9;
}
</style>