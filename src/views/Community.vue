<template>
  <div>
    <h2 class="fw-bold mb-4">Community & Support</h2>
    <p class="fs-5 text-muted mb-5">Stay active locally or connect with friends online safely.</p>
    
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100 border-0">
          <div class="card-header bg-primary text-white py-3">
            <h4 class="mb-0 fw-bold">Local Events Calendar</h4>
          </div>
          <ul class="list-group list-group-flush fs-5">
            <li class="list-group-item p-4" v-for="event in events" :key="event.id">
              <div class="fw-bold mb-1">{{ event.name }}</div>
              <div class="text-muted"><small>📅 {{ event.date }}</small></div>
              <div class="text-muted"><small>📍 {{ event.location }}</small></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100 border-0">
          <div class="card-header bg-success text-white py-3">
            <h4 class="mb-0 fw-bold">Safe Online Forums</h4>
          </div>
          <div class="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
            <h5 class="fw-bold mb-3">Join the Conversation</h5>
            <p class="mb-4">Our forums are heavily moderated and completely safe. Share stories, overcome isolation, and find mental health support with one easy click.</p>
            
            <button 
              class="btn btn-lg px-5 rounded-pill fw-bold" 
              :class="hasJoined ? 'btn-secondary' : 'btn-success'"
              :disabled="hasJoined"
              @click="joinForum"
            >
              {{ hasJoined ? '✔ Joined Successfully' : 'Join Community' }}
            </button>
            <p v-if="hasJoined" class="mt-3 text-success fw-bold">Welcome to the safe forum area!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const events = ref([
  { id: 1, name: 'Senior Morning Walk Group', date: 'Saturday, 9:00 AM', location: 'Central Park Main Gate' },
  { id: 2, name: 'Joint-friendly Exercise Class', date: 'Monday, 10:30 AM', location: 'Community Center Hall' },
  { id: 3, name: 'Caregiver Coffee Morning', date: 'Wednesday, 2:00 PM', location: 'Downtown Library Cafe' }
]);

const hasJoined = ref(false);

const joinForum = () => {
  hasJoined.value = true;
};
</script>