import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/HomeView.vue";
import Login from "../views/LoginView.vue";
import Settings from "../views/SettingsView.vue";
import Graphics from "../views/GraphicsView.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login},
  { path: "/settings", component: Settings},
  { path: "/graphics", component: Graphics},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
