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

    <!-- Gemini API Integration -->
    <div class="card shadow border-0 mt-5 mb-5 border-start border-5 border-info">
      <div class="card-header bg-white pt-4 pb-0 border-0">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#0dcaf0" stroke="#0dcaf0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-info">
              <path d="M12 2c.132 5.827 4.173 9.868 10 10-5.827.132-9.868 4.173-10 10-0.132-5.827-4.173-9.868-10-10 5.827-.132 9.868-4.173 10-10z"></path>
            </svg>
            <h3 class="fw-bold mb-0 text-dark">Medical Terms Translator</h3>
          </div>
          <span class="badge bg-info text-white px-3 py-2 rounded-pill shadow-sm" style="font-size: 0.85rem; letter-spacing: 0.5px;">
            Powered by Gemini AI
          </span>
        </div>
        <p class="text-muted fs-6 mt-3">
          Paste complex medical reports or doctor's notes below. Our AI will instantly translate them into simple, warm, and easy-to-understand terms.
        </p>
      </div>
      
      <div class="card-body p-4">
        <textarea 
          v-model="medicalText" 
          class="form-control form-control-lg mb-3 shadow-sm" 
          rows="5" 
          placeholder="Paste medical text here..."
        ></textarea>
        
        <button 
          @click="translateText" 
          class="btn btn-info text-white fw-bold px-5 py-2 rounded-pill shadow-sm transition-all" 
          :disabled="isTranslating || !medicalText.trim()"
        >
          <span v-if="isTranslating" class="spinner-border spinner-border-sm me-2"></span>
          {{ isTranslating ? 'Translating via Gemini AI...' : '✨ Translate to Plain English' }}
        </button>

        <div v-if="aiErrorMessage" class="alert alert-danger mt-4 fw-bold shadow-sm">
          ❌ {{ aiErrorMessage }}
        </div>

        <div v-if="parsedResult" class="mt-4 p-4 bg-light rounded-4 border border-info shadow-sm transition-all">
          <div class="d-flex align-items-center mb-3">
            <span class="fs-4 me-2">💡</span>
            <h5 class="fw-bold text-info mb-0">Simple Explanation</h5>
          </div>
          <div class="fs-6 text-dark markdown-body" v-html="parsedResult"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { jsPDF } from "jspdf";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const resources = ref([]);
const searchQuery = ref('');

const initData = [
  { id: 101, title: "Home Safety Modifications", description: "A downloadable guide for preventing falls at home.", category: "Caregiver PDF", ratings: [4, 5], selectedRating: 5 },
  { id: 102, title: "Respite Care Options", description: "Understanding your local respite care support.", category: "Caregiver PDF", ratings: [5, 5], selectedRating: 5 },
  { id: 103, title: "Diet Guidelines for Seniors", description: "A downloadable guide to a healthy daily diet for seniors", category: "Caregiver PDF", ratings: [5, 5], selectedRating: 5 }
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
  doc.setTextColor(0, 0, 0);

  const splitDescription = doc.splitTextToSize(item.description, 170);
  doc.text(splitDescription, 20, 60);

  const safeFilename = item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeFilename}_guide.pdf`);
};

onMounted(() => fetchResources());

const medicalText = ref('');
const translatedResult = ref('');
const isTranslating = ref(false);
const aiErrorMessage = ref('');

const parsedResult = computed(() => {
  if (!translatedResult.value) return '';
  const rawHtml = marked.parse(translatedResult.value);
  return DOMPurify.sanitize(rawHtml);
});

const translateText = async () => {
  if (!medicalText.value.trim()) return;
  
  isTranslating.value = true;
  aiErrorMessage.value = '';
  translatedResult.value = '';

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-3.6-flash" });

    const prompt = `
      You are a highly empathetic, professional, and patient medical assistant working for a health charity.
      A caregiver or senior citizen has provided you with the following medical text. 
      Your task is to translate this complex medical jargon into simple, everyday language that someone without a medical background can easily understand.
      
      Requirements:
      - Use warm, reassuring, and supportive language.
      - Break down complex terms using bullet points if necessary.
      - Keep it concise but highly informative.
      
      Medical Text to Translate:
      "${medicalText.value}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    translatedResult.value = response.text();
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    aiErrorMessage.value = "Failed to connect to AI translator. Please check your API key or network connection.";
  } finally {
    isTranslating.value = false;
  }
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}
textarea:focus {
  border-color: #0dcaf0;
  box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
}
:deep(.markdown-body) {
  line-height: 1.8;
  font-size: 1.05rem;
}
:deep(.markdown-body p) {
  margin-bottom: 1.25rem;
}
:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-body strong) {
  color: #0dcaf0;
  font-weight: 700;
  background-color: rgba(13, 202, 240, 0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}
:deep(.markdown-body ul) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
:deep(.markdown-body li) {
  margin-bottom: 0.5rem;
}
</style>