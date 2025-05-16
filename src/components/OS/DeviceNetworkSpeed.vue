<template>
  <div class="flex gap-2 mb-6">
    <Listbox class="w-[270px]" v-model="selectedInterfaces" multiple>
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-[#37343D] py-3 pl-4 pr-10 text-left text-white shadow-md">
          <span class="block truncate">
            {{ selectedInterfaces.length ? selectedInterfaces.join(', ') : 'Выберите интерфейсы' }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg class="h-[5px] w-[10px] text-gray-400" height="4" viewBox="0 0 10 4" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4L0.669872 0.250001L9.33013 0.25L5 4Z" fill="white" />
            </svg>
          </span>
        </ListboxButton>
        <TransitionRoot enter="transition ease-out duration-100" enter-from="transform opacity-0 scale-95"
          enter-to="transform opacity-100 scale-100" leave="transition ease-in duration-75"
          leave-from="transform opacity-100 scale-100" leave-to="transform opacity-0 scale-95">
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#37343D] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption v-for="iface in availableInterfaces" :key="iface" :value="iface"
              class="relative cursor-pointer select-none py-2 pl-10 pr-4 text-white hover:bg-[#3b3b3b]">
              <span class="block truncate"
                :class="{ 'font-medium': selectedInterfaces.includes(iface), 'font-normal': !selectedInterfaces.includes(iface) }">
                {{ iface }}
              </span>
              <span v-if="selectedInterfaces.includes(iface)"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0l-3.536-3.535a1 1 0 111.414-1.415L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </span>
            </ListboxOption>
          </ListboxOptions>
        </TransitionRoot>
      </div>
    </Listbox>
    <Listbox class="w-[270px]" v-model="selectedMetric">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-[#37343D] py-3 pl-4 pr-10 text-left text-white shadow-md">
          <span class="block truncate">{{ selectedMetric || 'Выберите метрику' }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg class="h-[5px] w-[10px] text-gray-400" height="4" viewBox="0 0 10 4" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4L0.669872 0.250001L9.33013 0.25L5 4Z" fill="white" />
            </svg>
          </span>
        </ListboxButton>
        <TransitionRoot>
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#37343D] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption v-for="metric in availableMetrics" :key="metric" :value="metric"
              class="relative cursor-pointer select-none py-2 pl-10 pr-4 text-white hover:bg-[#3b3b3b]">
              <span class="block truncate" :class="{ 'font-medium': selectedMetric === metric }">
                {{ metric }}
              </span>
              <span v-if="selectedMetric === metric"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-white">

              </span>
            </ListboxOption>
          </ListboxOptions>
        </TransitionRoot>
      </div>
    </Listbox>
  </div>
  <div class="bg-[#222228] rounded-lg pt-[17px] pr-[30px] pb-[12px] pl-[17px]">
    <canvas ref="chartCanvas" width="620" height="330"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot
} from '@headlessui/vue'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend)

const chartCanvas = ref(null)
let chartInstance = null

const lastRx = {}
const lastTx = {}
const rxHistory = {}
const txHistory = {}
const labels = {}

const selectedInterfaces = ref(["eth0", "wwan0", "wwan1", "wwan2", "wwan3"])
const availableInterfaces = ["eth0", "wwan0", "wwan1", "wwan2", "wwan3"]
const selectedMetric = ref("Входящая скорость")
const availableMetrics = ["Входящая скорость", "Исходящая скорость"]

const fetchNetload = () => {
  axios.get('/api/os-info').then(res => {
    const interfaces = res.data.NetworkStats

    interfaces.forEach(iface => {
      const { Name, RxBytes, TxBytes } = iface

      if (Name === "eth0" || Name === "wwan0" || Name === "wwan1" || Name === "wwan2" || Name === "wwan3") {
        if (!(Name in lastRx)) {
          lastRx[Name] = RxBytes
          lastTx[Name] = TxBytes
          rxHistory[Name] = []
          txHistory[Name] = []
          labels[Name] = []
          return
        }

        const rxDelta = RxBytes - lastRx[Name]
        const txDelta = TxBytes - lastTx[Name]

        const rxKbps = (rxDelta / 1024).toFixed(2)
        const txKbps = (txDelta / 1024).toFixed(2)

        rxHistory[Name].push(rxKbps)
        txHistory[Name].push(txKbps)
        labels[Name].push(new Date().toLocaleTimeString())

        if (rxHistory[Name].length > 23) {
          rxHistory[Name].shift()
          txHistory[Name].shift()
          labels[Name].shift()
        }

        lastRx[Name] = RxBytes
        lastTx[Name] = TxBytes
      }
    })

    updateChart()
  })
}

const setupChart = () => {
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: [],
      datasets: [] // создадим по два для каждого интерфейса
    },
    options: {
      layout: {
        padding: 0
      },
      maintainAspectRatio: false,
      responsive: true,
      animation: false,
      plugins: {
        beforeInit: function (chart, options) {
          chart.legend.afterFit = function () {
            this.height = this.height + 50;
          };
        },
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            color: '#FFFFFF',
            boxWidth: 20,
            font: {
              size: 10,
              weight: 700,
              family: 'Montserrat'
            }
          },
        }
      },
      scales: {
        y: {
          grid: { drawTicks: false, drawBorder: false, color: '#555558' },
          ticks: {
            callback: function (value) {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + ' Gb'
              if (value >= 1000) return (value / 1000).toFixed(1) + ' Mb'
              return value + ' Kb'
            },
            count: 5,
            padding: 20, color: '#FFFFFF',
            font: {
              size: 10,
              weight: 300,
              family: 'Montserrat',
            }
          }
        },
        x: {
          grid: { drawTicks: false, drawBorder: false, color: '#555558', tickColor: '#FFFFFF' },
          ticks: {
            count: 24,
            autoSkip: false,
            color: '#FFFFFF', maxRotation: 41, minRotation: 41,
            padding: 8,
            maxTicksLimit: 24,
            font: {
              size: 8,
              weight: 'normal',
              family: 'Montserrat',
            }
          }
        }
      }
    }
  })
}

const circlePlugin = {
  id: 'xAxisCircles',
  afterDraw(chart) {
    const ctx = chart.ctx
    const xAxis = chart.scales.x

    const y = chart.chartArea.bottom

    xAxis.ticks.forEach((_, index) => {
      const x = xAxis.getPixelForTick(index)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
    })
  }
}


Chart.register(circlePlugin)

const updateChart = () => {
  if (!chartInstance) return

  chartInstance.data.datasets = []
  const colors = {
    eth0: { rx: '#0066FF', tx: '#0066FF' },
    wwan0: { rx: '#07B755', tx: '#07B755' },
    wwan1: { rx: '#FF1D8D', tx: '#FF1D8D' },
    wwan2: { rx: '#C70039', tx: '#C70039' },
    wwan3: { rx: '#00FFFF', tx: '#00FFFF' }
  }

  Object.keys(rxHistory).forEach(iface => {
    if (!selectedInterfaces.value.includes(iface)) return

    /*chartInstance.data.datasets.push({
      label: `${iface}`,
      data: rxHistory[iface],
      borderColor: colors[iface]?.rx || 'blue',
      backgroundColor: colors[iface]?.rx || 'blue',
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2
    })*/

    chartInstance.data.datasets.push({
      label: `${iface}`,
      data: selectedMetric.value === 'Входящая скорость' ? rxHistory[iface] : txHistory[iface],
      borderColor: colors[iface]?.rx || 'blue',
      backgroundColor: colors[iface]?.rx || 'blue',
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2
    })
  })

  // Используем метки одного интерфейса (например, первого)
  const firstIface = Object.keys(labels)[0]
  chartInstance.data.labels = labels[firstIface] || []

  chartInstance.update()
}

watch(selectedMetric, () => {
  updateChart()
})


onMounted(() => {
  setupChart()
  fetchNetload()
  setInterval(fetchNetload, 5000)
})
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>