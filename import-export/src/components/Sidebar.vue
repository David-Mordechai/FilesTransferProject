<template>
  <div class="buttonsWrapper">
    <v-btn>
      <router-link :to="{ name: 'Import' }">IMPORT</router-link>
    </v-btn>
    <v-btn>
      <router-link :to="{ name: 'Export' }">EXPORT</router-link>
    </v-btn>
  </div>
</template>

<script lang="ts">
// import router from "@/router";
export default {
  name: `Sidebar`,
  props: [],
  emits: [],
  setup(props, context) {


    function importFiles() {
      // router.push("/import");
    }

    function exportFiles() {
      // context.emit("uploadFiles");
    }

    return {
      importFiles, exportFiles
    };
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
