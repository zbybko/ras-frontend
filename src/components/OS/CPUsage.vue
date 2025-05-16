<template>
  <div >
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div>CPU</div>
      <div class="text-sm text-white">
        <p><strong>Процессор:</strong> {{ osInfo.CpuStats.CPUCount }} ядер</p>
          <strong>Загруженность процессора:</strong> {{ Math.round(cpuLoad) }} %
          
        </div>
      <!-- Круглый прогресс-бар -->
      <div class="flex flex-col p-5 mx-1">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path
            d="M10,90 A40,40 0 0,1 90,90"
            fill="none"
            stroke="#444"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            :d="arcPath"
            fill="none"
            stroke="#0066FF"
            stroke-width="10"
            stroke-linecap="round"
          />
          <text x="50" y="90" text-anchor="middle" font-size="16" fill="#fff">
            {{ cpuLoad.toFixed(0) }}%
          </text>
        </svg>
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const osInfo = ref({});
const loading = ref(true);
const error = ref(null);
let intervalId = null;

const cpuLoad = computed(() => {
  const load = osInfo.value.LoadAverage?.Loadavg1 || 0;
  const cpuCount = osInfo.value.CpuStats?.CPUCount || 1;
  const loadPercentage = (load / cpuCount) * 100;
  return Math.min(loadPercentage, 100);
});

const arcPath = computed(() => {
  const angle = (cpuLoad.value / 100) * 180;
  const r = 40;
  const cx = 50;
  const cy = 90;
  const rad = (Math.PI * angle) / 180;
  const x = cx + r * Math.cos(Math.PI - rad);
  const y = cy - r * Math.sin(rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `M${cx - r},${cy} A${r},${r} 0 ${largeArcFlag},1 ${x},${y}`;
});

const fetchOsInfo = async () => {
  try {
    const response = await fetch(`/api/os-info`);
    if (!response.ok) throw new Error("Ошибка загрузки данных");
    osInfo.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOsInfo(); // первая загрузка
  intervalId = setInterval(fetchOsInfo, 5000); // обновление каждые 5 секунд
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
text {
  dominant-baseline: middle;
}
</style>
