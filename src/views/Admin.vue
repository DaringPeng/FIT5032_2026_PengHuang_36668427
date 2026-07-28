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
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const newResource = reactive({ title: '', category: '', description: '' });
const errors = reactive({ title: '', category: '', description: '' });

const validateForm = () => {
  let isValid = true;
  errors.title = errors.category = errors.description = '';

  if (!newResource.title.trim()) { 
    errors.title = 'Title required.'; 
    isValid = false; 
  }
  if (!newResource.category) { 
    errors.category = 'Category required.'; 
    isValid = false; 
  }
  if (newResource.description.trim().length < 10) { 
    errors.description = 'At least 10 chars required.'; 
    isValid = false; 
  }
  
  return isValid;
};

const handleAddResource = () => {
  if (validateForm()) {
    let storageKey = 'senior_resources';
    if (newResource.category.includes('Caregiver') || newResource.category.includes('Respite')) {
      storageKey = 'caregiver_resources';
    }
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const resourceToSave = {
      id: Date.now(),
      title: newResource.title,
      category: newResource.category,
      description: newResource.description,
      ratings: [],
      selectedRating: 5
    };
    
    stored.push(resourceToSave);
    localStorage.setItem(storageKey, JSON.stringify(stored));
    
    const targetPage = storageKey === 'senior_resources' ? 'Seniors Resources' : 'Caregiver Hub';
    alert(`Resource successfully published to ${targetPage}!`);
    
    newResource.title = '';
    newResource.category = '';
    newResource.description = '';
  }
};
</script>

<style scoped>
.admin-dashboard { 
  max-width: 800px; 
  margin: 0 auto; 
}
</style>