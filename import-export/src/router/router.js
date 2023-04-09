import { createRouter, createWebHashHistory, VueRouter } from "vue-router";
import ExportFiles from "../components/ExportFiles.vue";
import ImportFiles from "../components/ImportFiles.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },

  {
    path: "/export",
    name: "Export",
    component: ExportFiles,
  },
  {
    path: "/import",
    name: "Import",
    component: ImportFiles,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
