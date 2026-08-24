<template>
  <div class="admin-dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-danger mb-0">Admin Dashboard</h2>
      <span class="badge bg-danger px-3 py-2 fs-6">Types of Users</span>
    </div>
    
    <div class="row g-3 mb-5">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card shadow-sm border-0 bg-white p-3 border-start border-4 border-primary h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fw-bold small text-uppercase mb-1">Total Users</p>
              <h3 class="fw-bold text-dark mb-0">{{ stats.totalUsers }}</h3>
            </div>
            <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-4">👥</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card shadow-sm border-0 bg-white p-3 border-start border-4 border-info h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fw-bold small text-uppercase mb-1">Seniors</p>
              <h3 class="fw-bold text-dark mb-0">{{ stats.seniorsCount }}</h3>
            </div>
            <div class="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-4">👴</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card shadow-sm border-0 bg-white p-3 border-start border-4 border-success h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fw-bold small text-uppercase mb-1">Caregivers</p>
              <h3 class="fw-bold text-dark mb-0">{{ stats.caregiversCount }}</h3>
            </div>
            <div class="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-4">🩺</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card shadow-sm border-0 bg-white p-3 border-start border-4 border-warning h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fw-bold small text-uppercase mb-1">Admins</p>
              <h3 class="fw-bold text-dark mb-0">{{ stats.adminsCount }}</h3>
            </div>
            <div class="bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-4">🛡️</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <!-- Create Local Event -->
      <div class="col-12 col-xl-6 mb-4">
        <div class="card shadow-sm border-0 bg-white p-4 h-100 border-start border-5 border-primary">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">📅 Create Local Event</h3>
          </div>

          <form @submit.prevent="createEvent" class="d-flex flex-column h-100">
            <div class="row g-3 flex-grow-1">
              <div class="col-md-6">
                <label class="form-label fw-bold">Event Title</label>
                <input type="text" class="form-control" v-model="newEvent.title" required placeholder="e.g., Senior Yoga Class">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Event Date</label>
                <input type="date" class="form-control" v-model="newEvent.date" required>
              </div>
              <div class="col-md-8">
                <label class="form-label fw-bold">Location</label>
                <input type="text" class="form-control" v-model="newEvent.location" required placeholder="e.g., Central Park">
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold">Max Capacity</label>
                <input type="number" class="form-control" v-model="newEvent.capacity" required min="1" placeholder="e.g., 20">
              </div>
            </div>
            
            <div class="d-flex align-items-center justify-content-between mt-4">
              <div>
                <span v-if="successMessage" class="text-success fw-bold">✅ {{ successMessage }}</span>
                <span v-if="errorMessage" class="text-danger fw-bold">❌ {{ errorMessage }}</span>
              </div>
              <button type="submit" class="btn btn-primary px-5" :disabled="isSubmitting">
                {{ isSubmitting ? 'Publishing...' : 'Publish Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Add New Resource -->
      <div class="col-12 col-xl-6 mb-4">
        <div class="card shadow-sm border-0 bg-white p-4 h-100 border-start border-5 border-primary">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">📚 Add New Resource</h3>
          </div>

          <form @submit.prevent="handleAddResource" novalidate class="d-flex flex-column h-100">
            <div class="row g-3 flex-grow-1">
              <div class="col-md-6">
                <label class="form-label fw-bold">Resource Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="newResource.title" 
                  :class="{ 'is-invalid': errors.title }"
                  @input="errors.title = ''"
                >
                <div class="invalid-feedback">{{ errors.title }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">Audience & Category</label>
                <select 
                  class="form-select" 
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

              <div class="col-12">
                <label class="form-label fw-bold">Description</label>
                <textarea 
                  class="form-control" 
                  rows="2" 
                  v-model="newResource.description" 
                  :class="{ 'is-invalid': errors.description }"
                  @input="errors.description = ''"
                ></textarea>
                <div class="invalid-feedback">{{ errors.description }}</div>
              </div>
            </div>

            <div class="text-end mt-4">
              <button type="submit" class="btn btn-primary px-5">Publish Resource</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Interactive Charts -->
    <div class="card shadow-sm border-0 bg-white p-4 mb-5 border-start border-5 border-primary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">📊 Event Capacity vs. Attendees</h3>
        <button class="btn btn-sm btn-outline-info fw-bold" @click="fetchDashboardData">
          🔄 Refresh Data
        </button>
      </div>
      
      <div v-if="isChartLoading" class="text-center py-5">
        <div class="spinner-border text-info" role="status"></div>
        <p class="mt-2 text-muted fw-bold">Loading live data from Firestore...</p>
      </div>
      
      <div v-else style="height: 360px; width: 100%;">
        <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center py-5 text-muted fw-bold">
          No event data found in Firestore. Create an event above!
        </div>
      </div>
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
import { reactive, ref, onMounted } from 'vue';
import InteractiveTable from '../components/InteractiveTable.vue';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const stats = reactive({
  totalUsers: 0,
  seniorsCount: 0,
  caregiversCount: 0,
  adminsCount: 0
});

const isChartLoading = ref(true);
const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        font: { size: 13, weight: 'bold' },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: { 
      mode: 'index', 
      intersect: false,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: { 
      beginAtZero: true, 
      ticks: { stepSize: 1 },
      grid: { color: '#f1f5f9' }
    },
    x: {
      grid: { display: false }
    }
  }
});

const fetchDashboardData = async () => {
  isChartLoading.value = true;
  try {
    // fetch users data
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      let seniors = 0;
      let caregivers = 0;
      let admins = 0;
      
      usersSnapshot.forEach((doc) => {
        const u = doc.data();
        const role = (u.role || u.userType || '').toLowerCase();
        if (role.includes('senior')) seniors++;
        else if (role.includes('caregiver')) caregivers++;
        else if (role.includes('admin')) admins++;
      });

      stats.totalUsers = usersSnapshot.size;
      stats.seniorsCount = seniors;
      stats.caregiversCount = caregivers;
      stats.adminsCount = admins;
    } catch (userErr) {
      console.error("Error fetching users data: ", userErr);
    }
    
    // fetch events data
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const labels = [];
    const attendees = [];
    const capacities = [];

    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      labels.push(data.title);
      attendees.push(data.current_attendees);
      capacities.push(data.capacity);
    });

    chartData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Current Attendees',
          backgroundColor: '#0D6EFD',
          hoverBackgroundColor: '#0056b3',
          data: attendees,
          borderRadius: 6,
          barPercentage: 0.6
        },
        {
          label: 'Max Capacity',
          backgroundColor: '#22b14c',
          hoverBackgroundColor: '#009900',
          data: capacities,
          borderRadius: 6,
          barPercentage: 0.6
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching chart data: ", error);
  } finally {
    isChartLoading.value = false;
  }
};

const newEvent = ref({
  title: '',
  date: '',
  location: '',
  capacity: null
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const createEvent = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await addDoc(collection(db, "events"), {
      title: newEvent.value.title,
      date: newEvent.value.date,
      location: newEvent.value.location,
      capacity: Number(newEvent.value.capacity),
      current_attendees: 0,
      createdAt: new Date()
    });
    
    successMessage.value = "Event successfully published!";
    newEvent.value = { title: '', date: '', location: '', capacity: null };
    fetchDashboardData();

    setTimeout(() => { successMessage.value = ''; }, 4000);
  } catch (error) {
    console.error("Firebase Error: ", error);
    errorMessage.value = "Failed to connect to Firebase. Check console.";
  } finally {
    isSubmitting.value = false;
  }
};

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

onMounted(() => {
  fetchDashboardData();
});

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
  max-width: 1200px; 
  margin: 0 auto; 
}
.card {
  transition: all 0.25s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.08)!important;
}
</style>