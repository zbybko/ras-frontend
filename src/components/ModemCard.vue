<template>
  <div :class="['p-4 rounded-lg', operatorClass]">
    <h3 class="text-xl font-bold mb-2">{{ modem.generic.name }}</h3>
    <p class="text-sm text-gray-300 mb-4">
      Оператор: {{ operatorName }}
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div>
        <p class="text-sm text-gray-400">IMEI</p>
        <p class="text-white font-mono">{{ modem.imei }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-400">Состояние</p>
        <p class="text-white font-mono">{{ modem.state }}</p>
      </div>
      <!-- Добавьте другие поля по необходимости -->
    </div>
    <div class="mt-4">
      <SimInfo :simName="modem.sim" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import SimInfo from "./SimInfo.vue";

const props = defineProps({
  modem: {
    type: Object,
    required: true,
  },
});

const operatorName = computed(() => props.modem["3gpp"]?.["operator-name"] || "Нет оператора");

const operatorClass = computed(() => {
  const operator = operatorName.value.toLowerCase();
  if (operator.includes("tele2"));
  if (operator.includes("mts")) ;
  if (operator.includes("megafon")) ;
  if (operator.includes("beeline")) ;
  return "bg-gray-700";
});
</script>
