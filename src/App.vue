<script setup>
import { useRouter, RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import { isAuthenticated } from "./auth";
import TheHeader from "./components/TheHeader.vue";

const router = useRouter();
// Проверка авторизации при монтировании компонента
onMounted(() => {
  if (!isAuthenticated) {
    router.push("/login"); // Если токена нет, перенаправляем на страницу логина
  }
});
</script>

<template>
  <TheHeader></TheHeader>
  <div class="container mx-auto">
    <RouterView />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "./style.css";


body {
  background: #1b1b1f;
  font-family: Inter, "sans-serif";
  @apply text-white;
}
</style>
