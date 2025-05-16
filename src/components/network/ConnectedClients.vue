<script setup>
import { ref } from "vue";

const clients = ref([
  {
    interface: "eth0",
    name: "Client 1",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: true,
  },
  {
    interface: "wifi",
    name: "Client 2",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: true,
  },
  {
    interface: "wifi",
    name: "Client 3",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 4",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: true,
  },
  {
    interface: "wifi",
    name: "Client 5",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 6",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "eth1",
    name: "Client 7",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: true,
  },
  {
    interface: "wifi",
    name: "Client 8",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 9",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 10",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 11",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 110",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
  {
    interface: "wifi",
    name: "Client 100500",
    ip: "192.168.1.1",
    mac: "00:00:00:00:00:01",
    connected: false,
  },
]);
console.error("Connected clients with only dummy data, fix ASAP");
</script>
<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="client in clients"
      :key="client.mac"
      class="bg-neutral-700 p-1 rounded-lg flex flex-row px-4 gap-2 justify-between"
    >
      <div class="flex flex-row items-center gap-2">
        <div
          class="rounded-full h-2 w-2"
          :class="
            client.connected
              ? 'bg-green-400 shadow-green-600'
              : 'bg-yellow-300 shadow-yellow-500'
          "
          :title="client.connected ? 'Connected' : 'Disconnected'"
        ></div>
        <div>{{ client.name }}</div>
      </div>
      <div class="font-mono text-sm">
        <div>{{ client.ip }}</div>
        <div>{{ client.mac }}</div>
      </div>
      <div class="flex items-center">
        <div>{{ client.interface }}</div>
      </div>
    </div>
  </div>
</template>
