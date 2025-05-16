<template>
  <div v-if="simData" class="mt-4 p-4 bg-gray-800 rounded-lg text-white">
    <h4 class="text-lg font-semibold mb-2">Информация о SIM</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div>
        <p class="text-sm text-gray-400">ICCID</p>
        <p class="font-mono">{{ simData.iccid }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-400">IMSI</p>
        <p class="font-mono">{{ simData.imsi }}</p>
      </div>
      <!-- Добавьте другие поля по необходимости -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  simName: {
    type: String,
    required: true,
  },
});

const simData = ref(null);

onMounted(async () => {
  try {
    const param = encodeURIComponent(props.simName.split("/").pop());
    const response = await fetch(`/api/sim/${param}`);
    if (!response.ok) throw new Error("Ошибка загрузки SIM данных");
    const data = await response.json();
    simData.value = data.properties;
  } catch (error) {
    console.error("Ошибка при загрузке данных SIM:", error);
  }
});
</script>
