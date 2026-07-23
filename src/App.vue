<template>
  <div class="app-container">
    <header class="global-header">
      <div class="logo">Health Charity</div>
      <div class="accessibility-controls">
        <button class="access-btn" aria-label="Decrease Text Size">A-</button>
        <button class="access-btn" aria-label="Increase Text Size">A+</button>
        <button class="access-btn" aria-label="Toggle High Contrast">High Contrast</button>
      </div>
    </header>
    
    <nav class="main-nav">
      <router-link to="/">HOME</router-link>
      <router-link to="/health-resources">HEALTH RESOURCES</router-link>
      <router-link to="/community">COMMUNITY</router-link>
      <router-link to="/caregivers">CAREGIVERS</router-link>
      <router-link to="/contact">CONTACT</router-link>
    </nav>

    <main class="content-area">
      <router-view />
    </main>

    <footer class="global-footer">
      <p>Need immediate help? Call our 24/7 Helpline: <strong>1-800-XXX-XXXX</strong></p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, sans-serif;
  color: #111; 
  background-color: #fff;
  font-size: 18px; 
  line-height: 1.6;
}

.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #f4f4f4;
  border-bottom: 2px solid #000;
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  color: #0056b3;
}
.access-btn {
  margin-left: 15px;
  padding: 10px 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border: 2px solid #000;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.access-btn:hover {
  background-color: #000;
  color: #fff;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 15px 40px;
  background-color: #0056b3;
}
.main-nav a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px;
}
.main-nav a:hover, .main-nav a.router-link-active {
  background-color: #ffffff;
  color: #0056b3;
  border-radius: 4px;
}

.content-area {
  padding: 40px;
  min-height: 60vh;
}

.global-footer {
  background-color: #222;
  color: #fff;
  text-align: center;
  padding: 30px;
  font-size: 1.5rem;
}
</style>