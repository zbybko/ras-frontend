<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="port in ports"
      :key="port.name"
      class="transition-colors duration-500 flex flex-row gap-2 items-center"
      :class="port.cableConnected ? CONNECTED_CLASS : DISCONNECTED_CLASS"
    >
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.19966 0H42.8004C46.2229 0.00363673 48.9964 2.77712 49 6.19918V42.8004C48.9964 46.2229 46.2229 48.9964 42.8008 49.0001H6.19952C2.77712 48.9964 0.00363673 46.2229 0 42.8008V6.19952C0.00363673 2.77717 2.77712 0.00368455 6.19918 4.78254e-05H6.19956L6.19966 0ZM42.8005 44.7392C43.8708 44.738 44.738 43.8707 44.7392 42.8007V6.19966C44.738 5.12941 43.8707 4.26215 42.8007 4.26095H6.19966C5.12941 4.26215 4.26215 5.12946 4.26095 6.19952V42.8005C4.26215 43.8708 5.12946 44.738 6.19952 44.7392H6.19961H42.8005ZM8.13823 10.1622H40.862V30.6997H36.7927V34.7688H30.6997V38.8379H18.3004V34.7689H12.2074V30.6996H8.13827L8.13823 10.1622ZM36.6009 14.4231H12.3992V26.4388H16.4684V30.5079H22.5614V34.5771H26.4389V30.5079H32.5319V26.4388H36.6011L36.6009 14.4231ZM18.4923 18.407H14.2314V12.2927H18.4923V18.407ZM26.6305 18.407H22.3697V12.2927H26.6305V18.407ZM34.7688 18.407H30.508V12.2927H34.7688V18.407Z"
        />
      </svg>
      <div class="">{{ port.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const ports = ref([]);
const CONNECTED_CLASS = "fill-[#0066FF]";
const DISCONNECTED_CLASS = "fill-[#B0B0B0]";

onMounted(() => {
  axios
    .get("/api/ethernet/status")
    .then((res) => {
      ports.value = res.data;
    })
    .catch((err) => {
      console.error("Ошибка при получении LAN портов:", err);
    });
});
</script>
