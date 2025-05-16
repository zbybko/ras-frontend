<template>
  <div class=" my-5">

    <!-- Загрузка данных -->
    <div v-if="loading">Загрузка...</div>

    <!-- Ошибка загрузки данных -->
    <div v-else-if="error">{{ error }}</div>

    <!-- Данные системы -->
    <div v-else>
    

      <div class="grid grid-cols-1 gap-1">
        <div v-for="net in osInfo.NetworkStats || []" :key="net.Name"
          class="bg-[#37343D] rounded-lg p-1 px-4 flex flex-col gap-1 my-1">
          <div>{{ net.Name }}</div>
          <div>
            <i class="fas fa-upload"></i>
            {{ (net.TxBytes / 1024 / 1024).toFixed(0) }} kb
          </div>
          <div>
            <i class="fas fa-download"></i>
            {{ (net.RxBytes / 1024 / 1024).toFixed(0) }} kb
          </div>
          <div><strong>MAC-адрес:</strong> {{ net.MAC }}</div>
        </div>
      </div>

     

      <!-- Нагрузка -->
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import RamUsage from "./RamUsage.vue";
import CPUsage from "./CPUsage.vue";
import DiskUsage from "./DiskUsage.vue";

const osInfo = ref({});
const loading = ref(true);
const error = ref(null);

// Функция для получения данных о системе
const fetchOsInfo = async () => {
  try {
    const response = await fetch(`/api/os-info`);
    if (!response.ok) throw new Error("Ошибка загрузки данных");
    osInfo.value = await response.json();
    console.log(osInfo.value.NetworkStats); // Логируем данные, полученные с сервера
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Загружаем данные при монтировании компонента
onMounted(fetchOsInfo);
</script>
