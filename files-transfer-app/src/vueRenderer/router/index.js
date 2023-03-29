import { createRouter, createWebHashHistory } from "vue-router";
import Export from "../components/Export.vue";
import Import from "../components/Import.vue";
const routes = [
  {
    path: "/",
    name: "Export",
    component: Export,
  },
  {
    path: "/import",
    name: "Import",
    component: Import,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
