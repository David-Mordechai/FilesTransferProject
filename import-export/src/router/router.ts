import ExportFiles from "../components/ExportFiles.vue";
import ImportFiles from "../components/ImportFiles.vue";
import ActionSelector from "../components/ActionSelector.vue";

export default function getRoutes(): string[] {
  const routes = [
    {
      path: "/",
      name: "ActionSelector",
      component: ActionSelector,
    },
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

  return routes;
}
