<template>
  <div class="container mt-2">
    <div class="mb-3">
      <FilesPicker
        @updateSelectedFileList="updateSelectedFileList"
        @uploadFiles="uploadFiles"
      />
      <div v-if="selectedFiles.length > 0">
        <FilesListTable :files="selectedFiles" />
        <ProgressBar :progressPercent="progressPercent" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import FilesPicker from "./components/FilesPicker.vue";
import FilesListTable from "./components/FilesListTable.vue";
import { uploadFile } from "./services/fileUploaderService";

export default {
  name: "App",
  components: { ProgressBar, FilesPicker, FilesListTable },
  setup() {
    const selectedFiles = ref([]);
    const progressPercent = ref(0);

    function updateSelectedFileList(files) {
      selectedFiles.value = files;
      progressPercent.value = 0;
    }

    async function uploadFiles() {
      progressPercent.value = 0;
      let progressStep = Math.round(100 / selectedFiles.value.length);
      let files = selectedFiles.value;
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
        progressPercent.value += progressStep;
      }
      progressPercent.value = 100;
    }

    return {
      selectedFiles,
      progressPercent,
      updateSelectedFileList,
      uploadFiles,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
