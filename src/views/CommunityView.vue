<template>
  <div class="container mt-4">
    <h2>Community Services & Reviews</h2>
    
    <div class="row mt-4">
      <div class="col-12 mb-4" v-for="service in services" :key="service.id">
        <div class="card p-3">
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>

          <button @click="saveToFavorites(service)" class="btn btn-outline-primary mb-3">
             Save to Favorites (Local Storage)
          </button>

          <hr>          
          <!-- Rating -->
          <div class="rating-section">
            <p><strong>Average Rating:</strong> {{ averageRating.toFixed(1) }} / 5 (Based on {{ totalReviews }} reviews)</p>
            <div class="d-flex align-items-center gap-3">
              <span>Rate this service:</span>
              <Rating v-model="userRating" :cancel="false" />
              <button @click="submitRating" class="btn btn-sm btn-success">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import Rating from 'primevue/rating'

const services = ref([
  { id: 1, name: 'Senior Walking Club', description: 'A weekly slow-paced walking group.' }
])

const userRating = ref(0)
const allRatings = ref([])

const averageRating = computed(() => {
  if (allRatings.value.length === 0) return 0
  const sum = allRatings.value.reduce((acc, curr) => acc + curr, 0)
  return sum / allRatings.value.length
})

const totalReviews = computed(() => allRatings.value.length)

const saveToFavorites = (service) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []
  favorites.push(service)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  alert(`${service.name} saved to local storage!`)
}

const fetchRatings = async () => {
  const querySnapshot = await getDocs(collection(db, "ratings"))
  allRatings.value = querySnapshot.docs.map(doc => doc.data().score)
}

const submitRating = async () => {
  if (userRating.value > 0) {
    await addDoc(collection(db, "ratings"), {
      serviceId: 1,
      score: userRating.value,
      timestamp: new Date()
    })
    allRatings.value.push(userRating.value)
    alert('Thank you for your rating!')
  }
}

onMounted(() => {
  fetchRatings()
})
</script>