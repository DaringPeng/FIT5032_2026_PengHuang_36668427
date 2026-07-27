<template>
  <div class="about-page">
    <div class="text-center mb-5">
      <h2 class="display-5 fw-bold text-primary">About Our Charity</h2>
      <p class="fs-4 text-muted">Dedicated to supporting vulnerable groups through innovative technology.</p>
    </div>

    <div class="row g-5 mb-5">
      <!-- Mission Section -->
      <div class="col-md-6">
        <div class="p-4 bg-light rounded shadow-sm h-100 border-0">
          <h3 class="fw-bold text-success mb-3">Our Mission</h3>
          <p class="fs-5">
            We aim to bridge the digital divide for the elderly population and provide immediate, streamlined support for family caregivers. By blending strict accessibility standards with tailored digital resources, we empower our community to maintain independence and well-being.
          </p>
        </div>
      </div>
      <!-- Team Section -->
      <div class="col-md-6">
        <div class="p-4 bg-light rounded shadow-sm h-100 border-0">
          <h3 class="fw-bold text-info mb-3">Our Team</h3>
          <p class="fs-5">
            Our team consists of healthcare professionals, accessibility designers, and dedicated volunteers. We work closely with local communities to ensure our digital solutions meet real-world needs.
          </p>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mt-5">
      <h3 class="fw-bold mb-4 text-center">Frequently Asked Questions</h3>
      <div class="accordion shadow-sm" id="faqAccordion">
        <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
          <h2 class="accordion-header" :id="'heading' + index">
            <button 
              class="accordion-button collapsed fs-5 fw-bold" 
              type="button" 
              data-bs-toggle="collapse" 
              :data-bs-target="'#collapse' + index" 
              aria-expanded="false" 
              :aria-controls="'collapse' + index"
            >
              {{ faq.question }}
            </button>
          </h2>
          <div 
            :id="'collapse' + index" 
            class="accordion-collapse collapse" 
            :aria-labelledby="'heading' + index" 
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body fs-5 text-muted">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dynamic FAQ Data
const faqs = ref([
  {
    question: "How do I join a local walking group?",
    answer: "You can find local events in our Community section. No complex registration is required; just show up at the listed location and time!"
  },
  {
    question: "Are the resources really free?",
    answer: "Yes! All PDF guides, videos, and community forum access are completely free for seniors and their caregivers."
  },
  {
    question: "How can I contact support urgently?",
    answer: "Click the red 'Get Support Now' button at the bottom right of your screen to access our emergency hotlines and direct message form instantly."
  }
]);
</script>