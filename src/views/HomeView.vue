<script setup>
import DeviceNetworkSpeed from "../components/OS/DeviceNetworkSpeed.vue";
import CPUsage from "../components/OS/CPUsage.vue";
import RamUsage from "../components/OS/RamUsage.vue";
import DiskUsage from "../components/OS/DiskUsage.vue";
import LAN from "../components/LAN.vue";
import ConnectedClients from "../components/network/ConnectedClients.vue";
import ModemList from "../components/ModemList.vue";
import OsInfo from "../components/OS/OsInfo.vue"

const miniStatisticsComponents = [
  { component: DeviceNetworkSpeed, title: "ЗАГРУЗКА СЕТИ" },
  { component: CPUsage, title: "CPU usage" },
  { component: RamUsage, title: "RAM usage" },
];
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2"> 
    <!-- Левая колонка -->
    <div class="flex-1 flex flex-col gap-2">
      <div class="bg-neutral-800 p-5">
        <h4 class="text-lg font-bold mb-2">ЗАГРУЗКА СЕТИ</h4>
        <DeviceNetworkSpeed />
      </div>
      <div class="bg-neutral-800 p-5">
        <h2 class="text-lg font-bold mb-2">О СИСТЕМЕ</h2>
        <div>
          <h3>
            Система
          </h3>
        </div>
        <RamUsage />
        <CPUsage />
        <h3>Сетевые интерфейсы</h3>
        <div>
          <OsInfo />
        </div>
        <h3>Диски</h3>
      
        <DiskUsage />
        
      </div>
    </div>

    <!-- Правая колонка -->
    <div class="w-full lg:w-1/3 flex flex-col gap-2" style="width: auto;"><!-- временно w-auto, пока sidebar не добавим и контейнер не снимем -->
      <div class="bg-neutral-800 p-5">
        <h4 class="text-lg font-bold mb-2">СИМ-КАРТЫ</h4>
        <ModemList />
      </div>
      <div class="bg-neutral-800 p-5">
        <h4 class="text-lg font-bold mb-2">WI-FI</h4>
        <!-- Компонент Wi-Fi (добавишь позже) -->
      </div>
      <div class="bg-neutral-800 p-5">
        <h4 class="text-lg font-bold mb-2">ЛОКАЛЬНАЯ СЕТЬ</h4>
        <LAN />
      </div>
      <div class="bg-neutral-800 p-5">
        <h4 class="text-lg font-bold mb-2">ПОДКЛЮЧЕННЫЕ УСТРОЙСТВА</h4>
        <ConnectedClients />
      </div>
    </div>
  </div>
</template>



<style>
@import "../style.css";

</style>
