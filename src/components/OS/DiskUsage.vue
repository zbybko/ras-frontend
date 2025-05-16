<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 my-5">
    <div v-for="disk in disks" :key="disk.name" class="bg-[#2e2c35] p-1 rounded-lg flex flex-col items-center gap-2">
      <svg class="w-30 h-30">
        <path d="M10,90 A40,40 0 0,1 90,90" fill="none" stroke="#444" stroke-width="10" stroke-linecap="round" />
        <path :d="getArcPath(getPercent(disk))" fill="none" stroke="#0066FF" stroke-width="10" stroke-linecap="round" />
        <text x="50" y="90" text-anchor="middle" font-size="16" fill="#fff">
          {{ getPercent(disk).toFixed(0) }}%
        </text>
      </svg>
      <div class="text-sm text-white text-center">
        <div class="font-mono">{{ disk.name }}</div>
        <div>
          Использовано
          {{ formatMb(disk.used) }} из {{ formatMb(disk.size) }} МБ
        </div>
      </div>
    </div>
  
  </div>
  <div class="my-5 mx-5">
    <p v-if="osInfo">
      <strong>Нагрузка:</strong> {{ osInfo.LoadAverage?.Loadavg1 }} (1 минута)
    </p>
    <p v-else>
      Загрузка информации о нагрузке...
    </p>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";

const disks = ref([]);
const osInfo = ref(null); // Инициализируем osInfo

const getPercent = (disk) => {
  const used = parseInt(disk.used);
  const size = parseInt(disk.size);
  if (!size) return 0;
  return (used / size) * 100;
};

const getArcPath = (percent) => {
  const angle = (percent / 100) * 180;
  const r = 40;
  const cx = 50;
  const cy = 90;
  const rad = (Math.PI * angle) / 180;
  const x = cx + r * Math.cos(Math.PI - rad);
  const y = cy - r * Math.sin(rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `M${cx - r},${cy} A${r},${r} 0 ${largeArcFlag},1 ${x},${y}`;
};

const formatMb = (bytes) => {
  return (parseInt(bytes) / 1024 / 1024).toFixed(0);
};

const fetchOsInfo = async () => {
  try {
    const response = await fetch(`/api/os-info`);
    if (!response.ok) throw new Error("Ошибка загрузки данных");
    const data = await response.json();
    disks.value = data.DiskStats;
    osInfo.value = data; // Или { LoadAverage: data.LoadAverage } если у вас LoadAverage тоже в ответе
    console.log(data); // Логируем данные, полученные с сервера
  } catch (err) {
    console.error(err); // Логируем ошибку
  }
};

// Загружаем данные при монтировании компонента
onMounted(fetchOsInfo);
</script>