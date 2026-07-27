<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <h2 class="fw-bold text-primary">Senior Health & Wellbeing Resources</h2>
      <div class="input-group w-auto mt-2 mt-md-0">
        <input type="text" class="form-control form-control-lg" placeholder="Search guides..." v-model="searchQuery">
      </div>
    </div>
    
    <div v-if="filteredResources.length === 0" class="alert alert-info fs-5">No resources found.</div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-xl-4" v-for="item in filteredResources" :key="item.id">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="flex-grow-1 d-flex flex-column align-items-start">
              <h3 class="card-title fw-bold fs-4">{{ item.title }}</h3>
              <p class="card-text fs-5">{{ item.description }}</p>
              <span class="badge bg-primary text-white mb-3 fs-6 mt-auto">{{ item.category }}</span>
            </div>
            
            <hr class="w-100">
            <div class="d-flex flex-column gap-3">
              <div>
                <span class="fw-bold fs-5 me-2">Rating:</span>
                <span class="badge bg-warning text-dark fs-5">{{ calculateAverage(item.ratings) }} / 5</span>
              </div>

              <div class="d-flex align-items-center">
                <select v-model="item.selectedRating" class="form-select form-select-sm me-2" style="width: 80px;">
                  <option :value="5">5 ★</option>
                  <option :value="4">4 ★</option>
                  <option :value="3">3 ★</option>
                  <option :value="2">2 ★</option>
                  <option :value="1">1 ★</option>
                </select>
                <button @click="submitRating(item)" class="btn btn-outline-primary btn-sm flex-grow-1">Submit Rating</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const resources = ref([]);
const searchQuery = ref('');

const initData = [
  { id: 1, title: "Overcoming Isolation", description: "Video series on joining online communities.", category: "Senior Video", ratings: [5, 4], selectedRating: 5 },
  { id: 2, title: "Nutrition for Seniors", description: "Easy to prepare, high-nutrient recipes.", category: "Health Guide", ratings: [4, 5], selectedRating: 5 }
];

const fetchResources = () => {
  const storedData = localStorage.getItem('senior_resources');
  if (storedData) {
    resources.value = JSON.parse(storedData);
  } else {
    resources.value = initData;
    localStorage.setItem('senior_resources', JSON.stringify(resources.value));
  }
};

const filteredResources = computed(() => {
  if (!searchQuery.value) return resources.value;
  const query = searchQuery.value.toLowerCase();
  return resources.value.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
});

const calculateAverage = (ratingsArray) => {
  if (!ratingsArray || ratingsArray.length === 0) return 0;
  return (ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1);
};

const submitRating = (item) => {
  item.ratings.push(item.selectedRating);
  localStorage.setItem('senior_resources', JSON.stringify(resources.value));
  alert(`Thank you for giving ${item.selectedRating} stars!`);
};

onMounted(() => fetchResources());
</script>