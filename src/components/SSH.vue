<script setup>
import { ref, onMounted } from 'vue'
import { Switch } from '@headlessui/vue'
import axios from 'axios'

const enabled = ref(false)
const loading = ref(true)

const fetchStatus = () => {
  axios.get('/api/ssh/status')
    .then(res => {
      enabled.value = res.data.enabled
    })
    .catch(err => {
      console.error('Ошибка получения статуса SSH:', err)
    })
    .finally(() => {
      loading.value = false
    })
}

const toggleSSH = () => {
  loading.value = true
  const url = enabled.value ? '/api/ssh/disable' : '/api/ssh/enable'
  axios.post(url)
    .then(() => {
      enabled.value = !enabled.value
    })
    .catch(err => {
      console.error('Ошибка переключения SSH:', err)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(fetchStatus)
</script>

<template>
  <div class="flex items-center space-x-4">
    <Switch
      :checked="enabled"
      @click="toggleSSH"
      :disabled="loading"
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      :class="enabled ? 'bg-green-600' : 'bg-gray-300'"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        :class="enabled ? 'translate-x-6' : 'translate-x-1'"
      />
    </Switch>
    <span class="text-sm">
      SSH {{ enabled ? 'включен' : 'выключен' }}
    </span>
  </div>
</template>

<style scoped>
/* Небольшая анимация при переключении */
</style>
