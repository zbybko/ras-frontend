<template>
  <div class="p-5 bg-[#222228] mx-1 flex flex-col gap-4 text-white">
    <h2 class="text-2xl">Управление Wi-Fi</h2>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="flex flex-col gap-4">
      <div class="space-y-1">
        <p><strong>SSID:</strong> {{ wifiStatus.ssid }}</p>
        <p><strong>Статус:</strong> {{ wifiStatus.active ? 'Включен' : 'Выключен' }}</p>
        <p><strong>Скрытый SSID:</strong> {{ wifiStatus.hidden_ssid ? 'Да' : 'Нет' }}</p>
        <p><strong>Безопасность:</strong>
          {{
            wifiStatus.security === '0' ? 'Нет' :
            wifiStatus.security === '1' ? 'WPA2' :
            wifiStatus.security === '2' ? 'WPA3' :
            'Неизвестно'
          }}
        </p>
        <p><strong>Канал:</strong> {{ wifiStatus.channel }}</p>

        <Button class="btn" @click="toggleWiFi">
          {{ wifiStatus.active ? 'Выключить' : 'Включить' }} Wi-Fi
        </Button>
      </div>

      <div class="flex flex-col gap-3">
        <div>
          <label>SSID:</label>
          <input class="form-item" v-model="newSSID" type="text" placeholder="Введите SSID" />
          <Button class="btn" @click="setSSID">Установить SSID</Button>
        </div>

        <div>
          <label>Скрыть SSID:</label>
          <select class="form-item" v-model="hideSSID">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
          <Button class="btn" @click="setSSIDHidden">Скрыть SSID</Button>
        </div>

        <div>
          <label>Пароль:</label>
          <input class="form-item" v-model="newPassword" type="password" placeholder="Введите новый пароль" />
          <Button class="btn" @click="setPassword">Установить пароль</Button>
        </div>

        <div>
          <label>Тип безопасности:</label>
          <select class="form-item" v-model="securityType">
            <option value="0">Нет</option>
            <option value="1">WPA2</option>
            <option value="2">WPA3</option>
          </select>
          <Button class="btn" @click="setSecurity">Установить тип</Button>
        </div>

        <div>
          <label>Канал:</label>
          <input class="form-item" v-model.number="channel" type="number" min="1" max="13" />
          <Button class="btn" @click="setChannel">Установить канал</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "./Button.vue";
import axios from "axios";

const wifiStatus = ref({});
const newSSID = ref("");
const hideSSID = ref(false);
const newPassword = ref("");
const securityType = ref("1");
const channel = ref(1);

const loading = ref(true);
const error = ref(null);

const fetchWiFiStatus = async () => {
  try {
    const res = await axios.get("/api/wifi/status");
    wifiStatus.value = res.data;

    // Применяем данные в поля по умолчанию
    newSSID.value = res.data.ssid || "";
    hideSSID.value = res.data.hidden_ssid ?? false;
    newPassword.value = res.data.password || "";
    securityType.value = String(res.data.security ?? "1");
    channel.value = res.data.channel ?? 1;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const toggleWiFi = async () => {
  try {
    await axios.post(`/api/wifi/${wifiStatus.value.active ? "disable" : "enable"}`);
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

const setSSID = async () => {
  try {
    await axios.post("/api/wifi/ssid/set", { ssid: newSSID.value });
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

const setSSIDHidden = async () => {
  try {
    await axios.post("/api/wifi/ssid/hide", { hidden: hideSSID.value });
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

const setPassword = async () => {
  try {
    await axios.post("/api/wifi/password/set", { password: newPassword.value });
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

const setSecurity = async () => {
  try {
    await axios.post("/api/wifi/security/set", { type: securityType.value });
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

const setChannel = async () => {
  try {
    await axios.post("/api/wifi/channel/set", { channel: Number(channel.value) });
    await fetchWiFiStatus();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchWiFiStatus);
</script>
