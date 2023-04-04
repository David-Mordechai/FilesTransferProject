import { createRouter, createWebHashHistory, VueRouter } from "vue-router";
import Export from "../components/Export.vue";
import Import from "../components/Import.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },

  {
    path: "/export",
    name: "Export",
    component: Export,
  },
  {
    path: "/import",
    name: "Import",
    component: Import,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
