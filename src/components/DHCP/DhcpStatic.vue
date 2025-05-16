<template>
  <div class="p-4 rounded-xl shadow bg-gray-800 space-y-4">
    <h2 class="text-lg text-white">Статические IP-аренды</h2>

    <div v-if="staticLeases.length === 0" class="text-gray-400">
      Нет статических аренд.
    </div>
    <ul v-else class="divide-y divide-gray-700 text-sm text-gray-300">
      <li
        v-for="lease in staticLeases"
        :key="lease.mac"
        class="py-1 flex justify-between"
      >
        <span>{{ lease.ip }}</span>
        <span class="font-mono text-gray-400">{{ lease.mac }}</span>
      </li>
    </ul>

    <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
      <input v-model="mac" placeholder="MAC-адрес" class="input" />
      <input v-model="ip" placeholder="IP-адрес" class="input" />
      <button
        @click="addStaticLease"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Добавить
      </button>
      <button
        @click="removeStaticLease"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const staticLeases = ref([])
const mac = ref('')
const ip = ref('')

const fetchStaticLeases = async () => {
  try {
    const { data } = await axios.get('/api/dhcp/static/list')
    staticLeases.value = data.leases || []
  } catch (e) {
    console.error('Ошибка при загрузке статических аренд:', e)
  }
}

const addStaticLease = async () => {
  if (!validateInputs()) return

  try {
    await axios.post('/api/dhcp/static/add', { mac: mac.value, ip: ip.value })
    alert('Статическая аренда добавлена')
    await fetchStaticLeases()
  } catch (e) {
    console.error('Ошибка при добавлении:', e)
  }
}

const removeStaticLease = async () => {
  if (!validateInputs()) return

  try {
    await axios.post('/api/dhcp/static/remove', { mac: mac.value, ip: ip.value })
    alert('Статическая аренда удалена')
    await fetchStaticLeases()
  } catch (e) {
    console.error('Ошибка при удалении:', e)
  }
}

const validateInputs = () => {
  const macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  if (!macPattern.test(mac.value)) {
    alert('Некорректный MAC-адрес')
    return false
  }

  if (!ipPattern.test(ip.value)) {
    alert('Некорректный IP-адрес')
    return false
  }

  return true
}

onMounted(fetchStaticLeases)
</script>

<style scoped>

</style>
