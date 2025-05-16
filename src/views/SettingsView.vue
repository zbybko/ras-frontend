<script setup>
import Diagnostics from "../components/Diagnostics.vue";
import DHCP from "../components/DHCP/DHCP.vue";
import LAN from "../components/LAN.vue";
import WIFI from "../components/WIFI.vue";
import SSH from "../components/SSH.vue";
import Journals from "../components/Journals.vue";
import DeviceTraceroute from "../components/OS/DeviceTraceroute.vue";
import Timezone from "../components/Timezone.vue";
import NtpServers from "../components/NtpServers.vue";
import FirewallSelect from "../components/FirewallSelect.vue";
import ModemList from "../components/ModemList.vue";

const components = [
  DHCP,
  LAN,
  WIFI,
  SSH,
  ModemList,
  Journals,
  Timezone,
  NtpServers,
  Diagnostics,
  FirewallSelect,
  DeviceTraceroute,
];
</script>
<template>
  <div class="mx-auto">
    <div class="grid grid-cols-1 gap-8">
      <div v-for="c in components" class="bg-grey p-4">
        <component :is="c" />
      </div>
    </div>
  </div>
</template>
