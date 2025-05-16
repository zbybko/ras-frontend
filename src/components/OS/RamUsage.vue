<template>
  <div class="flex flex-col">
    <h4>RAM</h4>
    <div class="text-sm text-white">
      Память: 
      <span class="font-mono">{{ (used / 1024 / 1024).toFixed(0) }}</span> из
      <span class="font-mono">{{ (total / 1024 / 1024).toFixed(0) }}</span> МБ
    </div>
    <div class="p-5 mx-1">
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
        {{ percent.toFixed(0) }}%
      </text>
    </svg>
   
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const used = ref(0);
const total = ref(1); // защита от деления на 0
let intervalId = null;

const fetchRamInfo = async () => {
  try {
    const response = await fetch("/api/os-info");
    if (!response.ok) throw new Error("Ошибка загрузки данных");
    const data = await response.json();
    used.value = data.Memory?.Used || 0;
    total.value = data.Memory?.Total || 1;
  } catch (err) {
    console.error("Ошибка при получении RAM info:", err.message);
  }
};

const percent = computed(() =>
  total.value ? (used.value / total.value) * 100 : 0,
);

const arcPath = computed(() => {
  const angle = (percent.value / 100) * 180;
  const r = 40;
  const cx = 50;
  const cy = 90;
  const rad = (Math.PI * angle) / 180;
  const x = cx + r * Math.cos(Math.PI - rad);
  const y = cy - r * Math.sin(rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `M${cx - r},${cy} A${r},${r} 0 ${largeArcFlag},1 ${x},${y}`;
});

onMounted(() => {
  fetchRamInfo(); // первая загрузка
  intervalId = setInterval(fetchRamInfo, 5000); // автообновление
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
