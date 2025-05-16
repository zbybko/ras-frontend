<template>
  <div class="p-4 rounded-xl shadow bg-gray-800 space-y-4">
    <h2 class="text-lg text-white">Диапазоны IP-адресов</h2>

    <div v-if="range.start_ip && range.end_ip" class="text-gray-300">
      <p>Текущий диапазон: <span class="font-mono">{{ range.start_ip }} - {{ range.end_ip }}</span></p>
    </div>
    <div v-else class="text-gray-400">Диапазон не установлен</div>

    <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
      <input
        v-model="newRangeStart"
        type="text"
        placeholder="Начальный IP"
        class="input"
      />
      <input
        v-model="newRangeEnd"
        type="text"
        placeholder="Конечный IP"
        class="input"
      />
      <button
        @click="updateRange"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        Обновить диапазон
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const range = ref({ start_ip: '', end_ip: '' })
const newRangeStart = ref('')
const newRangeEnd = ref('')

const ipPattern =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const fetchRange = async () => {
  try {
    const { data } = await axios.get('/api/dhcp/ranges')
    range.value = data.current_range || { start_ip: '', end_ip: '' }
  } catch (e) {
    console.error('Ошибка при загрузке диапазона:', e)
  }
}

const updateRange = async () => {
  if (!ipPattern.test(newRangeStart.value) || !ipPattern.test(newRangeEnd.value)) {
    alert('Некорректный формат IP-адреса')
    return
  }

  try {
    await axios.post('/api/dhcp/ranges', {
      start: newRangeStart.value,
      end: newRangeEnd.value
    })
    alert('Диапазон обновлён')
    await fetchRange()
  } catch (e) {
    console.error('Ошибка при обновлении диапазона:', e)
  }
}

onMounted(fetchRange)
</script>

<style scoped>

</style>
