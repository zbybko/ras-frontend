<template>
  <button class="mr-3 flex cursor-pointer" @click="reboot" href="">
    Перезагрузка
    <img class="ml-1" src="../assets/header_buttons/refresh.svg" alt="" />
  </button>
</template>
<script setup>
import axios from "axios";

const reboot = () => {
  axios
    .post("/api/reboot")
    .then(() => alert("Устройство перезагружается..."))
    .catch((err) => alert("Ошибка перезагрузки: " + err.message));
};
</script>
