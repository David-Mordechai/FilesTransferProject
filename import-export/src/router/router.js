import { createRouter, createWebHashHistory, VueRouter } from "vue-router";
import ExportFiles from "../components/ExportFiles.vue";
import ImportFiles from "../components/ImportFiles.vue";
import ActionSelector from "../components/ActionSelector.vue";
const routes = [
  { path: "/", name: "ActionSelector", component: ActionSelector },
  {
    path: "/import",
    name: "Import",
    component: ImportFiles,
  },
  {
    path: "/export",
    name: "Export",
    component: ExportFiles,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
