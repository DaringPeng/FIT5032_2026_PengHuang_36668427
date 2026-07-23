<template>
  <div class="home-page">
    <section class="hero-section">
      <h1>Supporting Your Independence and Well-being.</h1>
      <div class="search-box">
        <label for="main-search">What do you need help finding today?</label>
        <input type="text" id="main-search" placeholder="e.g., Joint pain exercises..." />
        <button class="search-btn">Search</button>
      </div>
    </section>

    <section class="quick-links">
      <router-link to="/health-resources" class="card">
        <div class="card-icon">📘</div>
        <h2>Health Resource Guides</h2>
        <p>Read large-print guides on physical and mental health.</p>
      </router-link>

      <router-link to="/community" class="card">
        <div class="card-icon">👥</div>
        <h2>Local Community Events</h2>
        <p>Find safe, social groups and walking clubs near you.</p>
      </router-link>

      <router-link to="/caregivers" class="card">
        <div class="card-icon">🏥</div>
        <h2>Caregiver Support FAQs</h2>
        <p>Quick access to respite care and home safety info.</p>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  text-align: center;
  padding: 40px 20px;
  background-color: #e6f2ff;
  border: 2px solid #b3d9ff;
  border-radius: 8px;
  margin-bottom: 40px;
}
.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #003366;
}
.search-box {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.search-box label {
  font-size: 1.3rem;
  font-weight: bold;
}
.search-box input {
  padding: 15px;
  font-size: 1.2rem;
  border: 3px solid #0056b3;
  border-radius: 6px;
}
.search-btn {
  padding: 15px;
  font-size: 1.3rem;
  font-weight: bold;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
.card {
  display: block;
  text-decoration: none;
  color: #111;
  border: 3px solid #ccc;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  transition: transform 0.2s, border-color 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  border-color: #0056b3;
  background-color: #f9f9f9;
}
.card-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}
.card h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #0056b3;
}
.card p {
  font-size: 1.2rem;
}
</style>