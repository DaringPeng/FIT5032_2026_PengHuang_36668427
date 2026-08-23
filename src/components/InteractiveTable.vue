<template>
  <div class="interactive-table-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="m-0 fw-bold" tabindex="0">Data Table</h5>
      <button 
        class="btn btn-outline-success btn-sm fw-bold shadow-sm" 
        @click="exportToCSV"
        aria-label="Export table data to CSV format"
      >
        📥 Export to CSV
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover table-bordered bg-white shadow-sm align-middle" role="grid">
        <thead class="table-dark">
          <tr>
            <th v-for="col in columns" :key="col.key" style="min-width: 150px;" scope="col">
              <div 
                class="d-flex justify-content-between align-items-center mb-2 text-nowrap" 
                style="cursor: pointer;" 
                tabindex="0"
                @click="sortBy(col.key)"
                @keyup.enter="sortBy(col.key)"
                :aria-label="`Sort by ${col.label}`"
              >
                {{ col.label }}
                <span v-if="sortKey === col.key" aria-hidden="true">{{ sortAsc ? ' ▲' : ' ▼' }}</span>
                <span v-else class="text-muted" aria-hidden="true"> ⇅</span>
              </div>
              <!-- Search by individual column -->
              <input 
                type="text" 
                class="form-control form-control-sm" 
                :placeholder="`Search ${col.label}...`" 
                v-model="filters[col.key]"
                :aria-label="`Search in column ${col.label}`"
                @click.stop
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="index">
            <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="text-center py-4 text-muted fs-5">No matching data found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Limit to 10 rows per page -->
    <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
      <span class="text-muted fw-bold" aria-live="polite">
        Showing {{ startIndex + 1 }} to {{ Math.min(startIndex + 10, filteredAndSortedData.length) }} of {{ filteredAndSortedData.length }} entries
      </span>
      <div class="btn-group shadow-sm">
        <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="currentPage--" aria-label="Previous Page">Previous</button>
        <button class="btn btn-primary" disabled aria-label="Current Page">Page {{ currentPage }} of {{ totalPages || 1 }}</button>
        <button class="btn btn-outline-primary" :disabled="currentPage >= totalPages" @click="currentPage++" aria-label="Next Page">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true }
});

const filters = reactive({});
const sortKey = ref('');
const sortAsc = ref(true);
const currentPage = ref(1);
const rowsPerPage = 10;

props.columns.forEach(col => { filters[col.key] = ''; });

watch(filters, () => { currentPage.value = 1; }, { deep: true });

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const filteredAndSortedData = computed(() => {
  let result = props.data.filter(row => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      const cellValue = String(row[key]).toLowerCase();
      return cellValue.includes(filters[key].toLowerCase());
    });
  });

  if (sortKey.value) {
    result.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredAndSortedData.value.length / rowsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * rowsPerPage);
const paginatedData = computed(() => {
  return filteredAndSortedData.value.slice(startIndex.value, startIndex.value + rowsPerPage);
});

const exportToCSV = () => {
  if (filteredAndSortedData.value.length === 0) {
    alert("No data available to export.");
    return;
  }
  
  const headers = props.columns.map(col => `"${col.label}"`).join(',');
  const rows = filteredAndSortedData.value.map(row => {
    return props.columns.map(col => `"${row[col.key]}"`).join(',');
  });
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `table_export_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>