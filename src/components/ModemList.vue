<template>
  <div class="p-6 rounded-md space-y-4">
    <div v-if="loading" class="text-white">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <ul v-if="modems.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(modem, index) in modems" :key="index" @click="openModal(modem)" :class="[
        'cursor-pointer rounded-md flex flex-col justify-between text-white font-semibold select-none transition duration-200',
        operatorBgColor(modem['3gpp']?.['operator-name'])
      ]" style="aspect-ratio: 1 / 1; min-width: 150px;">
        <div class="flex items-center justify-between p-4">
          <img :src="getOperatorIconUrl(modem['3gpp']?.['operator-name'])" class="w-6 h-6 object-contain"
            v-if="getOperatorIconUrl(modem['3gpp']?.['operator-name'])" />
          <div class=" flex ">
            <div class="mr-2">
              <div class="flex items-end gap-[2px] h-5">
                <div v-for="i in 4" :key="i" :class="[
                  'w-1 rounded-sm transition-all duration-300',
                  i <= getSignalLevel(modem.generic?.['signal-quality']?.value) ? 'bg-white' : 'bg-gray-500',
                  ['h-2', 'h-3', 'h-4', 'h-5'][i - 1]
                ]" />
              </div>
            </div>
            <p class="font-bold">{{ modem.generic?.['access-technologies']?.[0] || 'нет данных' }}<br /></p>
          </div>

        </div>
        <div class="px-4 pb-4 text-sm text-gray-200 truncate">
          {{ modem['3gpp']?.['operator-name'] || 'Нет оператора' }}
          <div class="mt-1 text-xs text-gray-300">

            Уровень сигнала: {{ modem.generic?.['signal-quality']?.value || '0' }}<br />
            ⬇ {{ modem.rxSpeed || 0 }} Кбит/с<br />
            ⬆ {{ modem.txSpeed || 0 }} Кбит/с
          </div>

        </div>
      </li>
    </ul>

    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-10" @close="isOpen = false">
        <div class="fixed inset-0 bg-black/50" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md rounded-xl bg-[#363E4B] p-6 shadow-xl">
              <DialogTitle class="text-xl font-semibold mb-4">Информация о модеме</DialogTitle>
              <ModemCard :modem="selectedModem" />
              <div class="mt-4 flex justify-end">
                <button class="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700" @click="isOpen = false">
                  Закрыть
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";
import ModemCard from "./ModemCard.vue";

const modems = ref([]);
const loading = ref(true);
const error = ref(null);
const isOpen = ref(false);
const selectedModem = ref(null);

const openModal = (modem) => {
  selectedModem.value = modem;
  isOpen.value = true;
};

const operatorBgColor = (operator) => {
  if (!operator) return 'bg-gray-700 hover:bg-gray-800';
  const op = operator.toLowerCase();
  if (op.includes('tele2')) return 'bg-gradient-to-r from-[#001f4d] to-[#99256B] hover:from-[#001b45] hover:to-[#7a1f56]';
  if (op.includes('mts')) return 'bg-gradient-to-r from-[#EF313B] to-[#FF5280] hover:from-[#d2272f] hover:to-[#e34e76]';
  if (op.includes('beeline')) return 'bg-gradient-to-r from-[#E4B600] to-[#FEBB6C] hover:from-[#c49c00] hover:to-[#db9f4d]';
  if (op.includes('megafon')) return 'bg-gradient-to-r from-[#07B755] to-[#23E390] hover:from-[#059c49] hover:to-[#1fd47e]';
  return 'bg-gray-700 hover:bg-gray-800';
};

const getOperatorIconUrl = (name = '') => {
  const key = name?.toLowerCase() || '';
  if (key.includes('mts')) return new URL('../assets/oper/mts.svg', import.meta.url).href;
  if (key.includes('megafon')) return new URL('../assets/oper/megafon.svg', import.meta.url).href;
  if (key.includes('beeline')) return new URL('../assets/oper/beeline.svg', import.meta.url).href;
  if (key.includes('tele2')) return new URL('../assets/oper/tele2.svg', import.meta.url).href;
  return '';
};

const getSignalLevel = (signalQuality) => {
  const quality = Number(signalQuality);
  if (isNaN(quality)) return 0;
  if (quality >= 75) return 4;
  if (quality >= 50) return 3;
  if (quality >= 25) return 2;
  if (quality > 0) return 1;
  return 0;
};

const fetchNetLoad = async () => {
  try {
    const response = await fetch("/api/netload");
    if (!response.ok) throw new Error("Ошибка при получении netload");

    const netloadData = await response.json();

    modems.value = modems.value.map((modem) => {
      const device = modem.generic?.name || modem.device;
      const load = netloadData.find((item) => item.device === device);
      return {
        ...modem,
        rxSpeed: load?.rx ?? 0,
        txSpeed: load?.tx ?? 0,
      };
    });
  } catch (err) {
    console.error("Ошибка загрузки netload:", err);
  }
};

const fetchModems = async () => {
  try {
    const response = await fetch("/api/modems/list");
    if (!response.ok) throw new Error("Ошибка загрузки модемов");
    const data = await response.json();
    modems.value = data.modems;
    await fetchNetLoad();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchModems();
});
</script>
