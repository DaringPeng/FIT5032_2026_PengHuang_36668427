<template>
  <div>
    <h2 class="fw-bold mb-4">Community & Support</h2>
    <p class="fs-5 text-muted mb-5">Stay active locally or connect with friends online safely. Use our map to navigate to local events!</p>
    
    <div class="card shadow-sm border-0 mb-5">
      <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
        <h4 class="mb-0 fw-bold">🗺️ Navigation Map</h4>
        <span class="badge bg-warning text-dark">Powered by Mapbox</span>
      </div>
      <div id="map-container" style="height: 500px; width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"></div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="card shadow-sm h-100 border-0">
          <div class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
            <h4 class="mb-0 fw-bold">📅 Local Events Calendar</h4>
            <span class="badge bg-light text-primary">Click an event to book</span>
          </div>
          <div class="card-body p-4 bg-white">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card shadow-sm h-100 border-0">
          <div class="card-header bg-success text-white py-3">
            <h4 class="mb-0 fw-bold">💬 Safe Online Forums</h4>
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
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: [],
  eventClick: (clickInfo) => handleEventClick(clickInfo),
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'today'
  },
  height: 500
});

const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    calendarOptions.events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const displayTitle = `${data.title} (${data.current_attendees}/${data.capacity})`;
      
      return {
        id: doc.id,
        title: displayTitle,
        start: data.date,
        allDay: true,
        extendedProps: {
          rawTitle: data.title,
          location: data.location,
          capacity: data.capacity,
          current_attendees: data.current_attendees
        },
        backgroundColor: data.current_attendees >= data.capacity ? '#dc3545' : '#0d6efd',
        borderColor: data.current_attendees >= data.capacity ? '#dc3545' : '#0d6efd'
      };
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const handleEventClick = async (clickInfo) => {
  const ev = clickInfo.event;
  const props = ev.extendedProps;
  
  // Constraint 1: Capacity Limit
  if (props.current_attendees >= props.capacity) {
    alert(`❌ Booking Failed: "${props.rawTitle}" is fully booked!`);
    return;
  }

  // Constraint 2: Time Conflict
  const myBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
  const hasTimeConflict = myBookings.some(booking => booking.date === ev.startStr);
  
  if (hasTimeConflict) {
    alert(`⚠️ Time Conflict Detected: You already have an event booked on ${ev.startStr}. Please choose another date.`);
    return;
  }

  const confirmMsg = `Do you want to book "${props.rawTitle}" at ${props.location}?\nCurrent Attendees: ${props.current_attendees} / ${props.capacity}`;
  
  if (confirm(confirmMsg)) {
    try {
      const eventRef = doc(db, "events", ev.id);
      await updateDoc(eventRef, {
        current_attendees: props.current_attendees + 1
      });

      myBookings.push({ id: ev.id, title: props.rawTitle, date: ev.startStr });
      localStorage.setItem('user_bookings', JSON.stringify(myBookings));
      alert("✅ Successfully booked! We look forward to seeing you.");
      fetchEvents();
      
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Booking failed due to a network error.");
    }
  }
};

const hasJoined = ref(false);
const joinForum = () => {
  hasJoined.value = true;
};

let map = null;

onMounted(() => {
  fetchEvents();
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  // Initial map
  map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136],
    zoom: 12
  });

  // Search places of interest
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: 'Search places of interest'
  });
  map.addControl(geocoder, 'top-right');

  // Navigate between places
  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving'
  });

  map.addControl(directions, 'top-left');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>

<style>
.fc .fc-toolbar-title { font-size: 1.25rem !important; font-weight: bold; }
.fc .fc-button-primary { background-color: #0d6efd !important; border-color: #0d6efd !important; }
.fc .fc-daygrid-event { cursor: pointer; padding: 2px 4px; border-radius: 4px; }
.fc-theme-standard td, .fc-theme-standard th { border-color: #e9ecef; }
.mapboxgl-ctrl-geocoder { border-radius: 8px !important; box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important; }
.mapboxgl-ctrl-directions { box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important; border-radius: 8px !important; }
</style>