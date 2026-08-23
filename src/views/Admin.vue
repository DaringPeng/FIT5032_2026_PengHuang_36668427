<template>
  <div class="admin-dashboard">
    <h2 class="fw-bold mb-4 text-danger">Admin Dashboard</h2>
    <div class="card shadow-sm border-0 bg-light p-4 mb-5">
      <h3 class="fw-bold mb-3">Add New Resource</h3>

      <form @submit.prevent="handleAddResource" novalidate>
        <div class="mb-3">
          <label class="form-label fs-5 fw-bold">Resource Title</label>
          <input 
            type="text" 
            class="form-control form-control-lg" 
            v-model="newResource.title" 
            :class="{ 'is-invalid': errors.title }"
            @input="errors.title = ''"
          >
          <div class="invalid-feedback">{{ errors.title }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fs-5 fw-bold">Target Audience & Category</label>
          <select 
            class="form-select form-select-lg" 
            v-model="newResource.category" 
            :class="{ 'is-invalid': errors.category }"
            @change="errors.category = ''"
          >
            <option value="" disabled>Select category...</option>
            <optgroup label="For Seniors">
              <option value="Senior Video">Senior Video</option>
              <option value="Health Guide">Health Guide</option>
            </optgroup>
            <optgroup label="For Caregivers">
              <option value="Caregiver PDF">Caregiver PDF</option>
              <option value="Respite Guide">Respite Guide</option>
            </optgroup>
          </select>
          <div class="invalid-feedback">{{ errors.category }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label fs-5 fw-bold">Description</label>
          <textarea 
            class="form-control" 
            rows="3" 
            v-model="newResource.description" 
            :class="{ 'is-invalid': errors.description }"
            @input="errors.description = ''"
          ></textarea>
          <div class="invalid-feedback">{{ errors.description }}</div>
        </div>

        <button type="submit" class="btn btn-danger btn-lg px-5">Publish Resource</button>
      </form>
    </div>

    <hr class="my-5">
    <h3 class="fw-bold mb-4">Database Management</h3>
    
    <!-- Interactive Table 1 -->
    <div class="card shadow-sm border-0 p-4 mb-5">
      <h4 class="fw-bold text-primary mb-4">Table 1: Registered Volunteers</h4>
      <InteractiveTable :columns="volunteerColumns" :data="volunteerData" />
    </div>

    <!-- Interactive Table 2 -->
    <div class="card shadow-sm border-0 p-4 mb-5">
      <h4 class="fw-bold text-success mb-4">Table 2: Partner Health Clinics</h4>
      <InteractiveTable :columns="clinicColumns" :data="clinicData" />
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import InteractiveTable from '../components/InteractiveTable.vue';

const newResource = reactive({ title: '', category: '', description: '' });
const errors = reactive({ title: '', category: '', description: '' });

const validateForm = () => {
  let isValid = true;
  errors.title = errors.category = errors.description = '';
  if (!newResource.title.trim()) { errors.title = 'Title required.'; isValid = false; }
  if (!newResource.category) { errors.category = 'Category required.'; isValid = false; }
  if (newResource.description.trim().length < 10) { errors.description = 'At least 10 chars required.'; isValid = false; }
  return isValid;
};

const handleAddResource = () => {
  if (validateForm()) {
    let storageKey = newResource.category.includes('Caregiver') || newResource.category.includes('Respite') ? 'caregiver_resources' : 'senior_resources';
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    stored.push({ id: Date.now(), ...newResource, ratings: [], selectedRating: 5 });
    localStorage.setItem(storageKey, JSON.stringify(stored));
    alert(`Resource successfully published!`);
    newResource.title = newResource.category = newResource.description = '';
  }
};

const volunteerColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'role', label: 'Assigned Role' },
  { key: 'location', label: 'City Location' }
];

const volunteerData = ref([
  { id: 101, name: 'Alice Smith', role: 'Driver', location: 'New York' },
  { id: 102, name: 'Bob Johnson', role: 'Caregiver', location: 'Los Angeles' },
  { id: 103, name: 'Charlie Brown', role: 'Event Organizer', location: 'Chicago' },
  { id: 104, name: 'David Lee', role: 'Driver', location: 'New York' },
  { id: 105, name: 'Emma Davis', role: 'IT Support', location: 'Seattle' },
  { id: 106, name: 'Frank White', role: 'Caregiver', location: 'Boston' },
  { id: 107, name: 'Grace Hall', role: 'Event Organizer', location: 'Chicago' },
  { id: 108, name: 'Henry Ford', role: 'Driver', location: 'Austin' },
  { id: 109, name: 'Ivy Chen', role: 'IT Support', location: 'San Francisco' },
  { id: 110, name: 'Jack Ma', role: 'Caregiver', location: 'New York' },
  { id: 111, name: 'Kelly Brook', role: 'Event Organizer', location: 'Los Angeles' },
  { id: 112, name: 'Liam Neeson', role: 'Driver', location: 'Chicago' }
]);

const clinicColumns = [
  { key: 'code', label: 'Clinic Code' },
  { key: 'name', label: 'Clinic Name' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'status', label: 'Status' }
];

const clinicData = ref([
  { code: 'C-001', name: 'Downtown Medical', specialty: 'Geriatrics', status: 'Active' },
  { code: 'C-002', name: 'Sunrise Care', specialty: 'General', status: 'Active' },
  { code: 'C-003', name: 'Westside Rehab', specialty: 'Physiotherapy', status: 'Closed' },
  { code: 'C-004', name: 'North Health', specialty: 'Geriatrics', status: 'Active' },
  { code: 'C-005', name: 'East End Clinic', specialty: 'Cardiology', status: 'Pending' },
  { code: 'C-006', name: 'Valley Medical', specialty: 'General', status: 'Active' },
  { code: 'C-007', name: 'Summit Hospital', specialty: 'Neurology', status: 'Active' },
  { code: 'C-008', name: 'Oasis Wellness', specialty: 'Physiotherapy', status: 'Active' },
  { code: 'C-009', name: 'Pine Therapy', specialty: 'Mental Health', status: 'Closed' },
  { code: 'C-010', name: 'Riverfront Care', specialty: 'Geriatrics', status: 'Active' },
  { code: 'C-011', name: 'Highland Clinic', specialty: 'General', status: 'Pending' },
  { code: 'C-012', name: 'Silver Age Home', specialty: 'Geriatrics', status: 'Active' }
]);
</script>

<style scoped>
.admin-dashboard { 
  max-width: 1000px; 
  margin: 0 auto; 
}
</style>