<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <h2 class="fw-bold text-success">Caregiver Support Hub</h2>
      <div class="input-group w-auto mt-2 mt-md-0">
        <input type="text" class="form-control form-control-lg" placeholder="Search guides..." v-model="searchQuery" aria-label="Search caregiver guides and resources">
      </div>
    </div>
    
    <div v-if="filteredResources.length === 0" class="alert alert-info fs-5" role="alert" aria-live="polite">No caregiver resources found.</div>

    <div class="row g-4" role="list">
      <div class="col-12 col-md-6 col-xl-4" v-for="item in filteredResources" :key="item.id" role="listitem">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="flex-grow-1 d-flex flex-column align-items-start">
              <!-- XSS protection handled automatically by Vue text interpolation {{}} -->
              <h3 class="card-title fw-bold fs-4">{{ item.title }}</h3>
              <p class="card-text fs-5">{{ item.description }}</p>
              <span class="badge bg-success text-white mb-3 fs-6 mt-auto">{{ item.category }}</span>
            </div>
            
            <hr class="w-100">
            <div class="d-flex flex-column gap-3">
              <div>
                <span class="fw-bold fs-5 me-2">Rating:</span>
                <span class="badge bg-warning text-dark fs-5" :aria-label="`Current rating is ${calculateAverage(item.ratings)} out of 5 stars`">{{ calculateAverage(item.ratings) }} / 5</span>
              </div>
              
              <div class="d-flex align-items-center">
                <select v-model="item.selectedRating" class="form-select form-select-sm me-2" style="width: 80px;" :aria-label="`Select rating for ${item.title}`">
                  <option :value="5">5 ★</option>
                  <option :value="4">4 ★</option>
                  <option :value="3">3 ★</option>
                  <option :value="2">2 ★</option>
                  <option :value="1">1 ★</option>
                </select>
                <button @click="submitRating(item)" class="btn btn-outline-success btn-sm flex-grow-1" :aria-label="`Submit rating for ${item.title}`">Submit Rating</button>
              </div>

              <button 
                @click="exportToPDF(item)" 
                class="btn btn-success w-100 fw-bold shadow-sm"
                :aria-label="`Export ${item.title} as PDF document`"
              >
                📄 Export Guide to PDF
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { jsPDF } from "jspdf";

const resources = ref([]);
const searchQuery = ref('');

const initData = [
  { id: 101, title: "Home Safety Modifications", description: "A downloadable guide for preventing falls at home.", category: "Caregiver PDF", ratings: [4, 5], selectedRating: 5 },
  { id: 102, title: "Respite Care Options", description: "Understanding your local respite care support.", category: "Caregiver PDF", ratings: [5, 5], selectedRating: 5 }
];

const fetchResources = () => {
  const storedData = localStorage.getItem('caregiver_resources');
  if (storedData) {
    resources.value = JSON.parse(storedData);
  } else {
    resources.value = initData;
    localStorage.setItem('caregiver_resources', JSON.stringify(resources.value));
  }
};

const filteredResources = computed(() => {
  if (!searchQuery.value) return resources.value;
  const query = searchQuery.value.toLowerCase();
  return resources.value.filter(item => item.title.toLowerCase().includes(query));
});

const calculateAverage = (ratingsArray) => {
  if (!ratingsArray || ratingsArray.length === 0) return 0;
  return (ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1);
};

const submitRating = (item) => {
  item.ratings.push(item.selectedRating);
  localStorage.setItem('caregiver_resources', JSON.stringify(resources.value));
  alert(`Thank you for giving ${item.selectedRating} stars!`);
};

const exportToPDF = (item) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(25, 135, 84);
  doc.text(item.title, 20, 30);

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`Category: ${item.category}`, 20, 45);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // 黑色

  const splitDescription = doc.splitTextToSize(item.description, 170);
  doc.text(splitDescription, 20, 60);

  const safeFilename = item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeFilename}_guide.pdf`);
};

onMounted(() => fetchResources());
</script>