<template>
  <header
    class="container flex justify-between mb-12 max-w-full bg-linear-to-br from-[#452587] to-[#470ABF] px-3"
  >
    <div class="flex items-center">
      <img src="../assets/logo.svg" alt="Zarinit logo" />
      <p class="ml-5 text-lg">
        {{ info.manufacturer }}
        {{ info.model }}
        <span class="text-sm text-gray-300">{{ info.modelVersion }} </span>
      </p>
    </div>

    <div class="flex justify-center items-center gap-2">
      <!-- TODO: Fix styles -->
      <RouterLink
        v-for="l in navLinks"
        :to="l.to"
        class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg cursor-pointer active:bg-white/5"
        activeClass="bg-white/30 text-neutral-300"
      >
        {{ l.title }}
      </RouterLink>
    </div>

    <div id="button" class="flex items-center">
      <RebootButton />

      <button
        class="px-6 py-2 flex items-center bg-[#222228] hover:bg-zinc-800 justify-center rounded-xl cursor-pointer"
        @click="logout"
      >
        <img src="../assets/header_buttons/exit.svg" alt="" />
      </button>
    </div>
  </header>
</template>

<script setup>
const authMode = import.meta.env.VITE_AUTH_MODE;
import { useRouter } from "vue-router";
import { ref } from "vue";
import RebootButton from "./RebootButton.vue";
import { RouterLink } from "vue-router";

const navLinks = [
  {
    title: "Дашборд",
    to: "/",
  },
  {
    title: "Настройки",
    to: "/settings",
  },
];

const router = useRouter();

const logout = () => {
  localStorage.removeItem("authToken");
  router.push("/login");
};

const selectedLanguage = ref("ru");
import { onMounted } from "vue";
import axios from "axios";

const info = ref({});

onMounted(() => {
  axios.get("/api/device-info").then((res) => {
    info.value = res.data;
  });
});
</script>
