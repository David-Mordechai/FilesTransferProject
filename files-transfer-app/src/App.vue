<template>
  <header id="header">
    <TitleBar appName="Files Uploader" />
  </header>

  <div id="mainWrapper">
    <div id="sideBar">
      <FilesPicker
          @updateSelectedFileList="updateSelectedFileList"
          @uploadFiles="uploadFiles"
        />
    </div>
    <div id="main">
      
        <FilesListTable v-if="selectedFiles.length > 0" :files="selectedFiles" />
    </div>
  </div>

  <footer id="footer">
    <div class="status-bar">
      <div class="status-summary">{{ statusSummary }}</div>
      <div class="status-progressBar">
        <ProgressBar :progressPercent="progressPercent" />
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import FilesPicker from "./components/FilesPicker.vue";
import FilesListTable from "./components/FilesListTable.vue";
import TitleBar from "./components/TitleBar.vue";
import { uploadFile } from "./services/fileUploaderService";

export default {
  name: "App",
  components: { ProgressBar, FilesPicker, FilesListTable, TitleBar },
  setup() {
    const selectedFiles = ref([]);
    const progressPercent = ref(0);
    const statusSummary = ref("");

    function updateSelectedFileList(files) {
      selectedFiles.value = files;
      progressPercent.value = 0;
      statusSummary.value = "";
    }

    async function uploadFiles() {
      progressPercent.value = 1;
      statusSummary.value = "";
      let progressStep = Math.round(100 / selectedFiles.value.length) - 1;
      for (let i = 0; i < selectedFiles.value.length; i++) {
        statusSummary.value = `Uploaded file: ${selectedFiles.value[i].name}`;
        await uploadFile(selectedFiles.value[i]);
        progressPercent.value += progressStep;
      }
      progressPercent.value = 100;
      statusSummary.value = "Files uploaded successfully.";
    }

    return {
      selectedFiles,
      progressPercent,
      updateSelectedFileList,
      uploadFiles,
      statusSummary,
    };
  },
};
</script>

<style>
#mainWrapper {
  display: grid;
  grid-template-areas:
    "header header"
    "side-bar main-side"
    "footer footer";
  grid-template-columns: 150px 1fr;
}
#main {
  grid-area: main-side;
  padding: 10px;
  width: 100%;
  height: calc(100vh - 72px);
}
#sideBar {
  grid-area: side-bar;
  width: 150px;
  background-color: #1c1c1cc0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* margin-top: 38px; */
}

header {
  /* position: absolute;
  top: 0; */
  width: 100%;
}

footer {
  /* position: absolute;
  bottom: 0; */
  width: 100%;
  height: 36px;
}

.status-bar {
  display: grid;
  grid-template-areas: "f1 f1 f2";
  height: 100%;
  place-items: center;
}

.status-progressBar {
  grid-area: f2;
  justify-self: end;
  width: 200px;
  padding-right: 10px;
}

.status-summary {
  grid-area: f1;
  justify-self: start;
  padding-left: 10px;
  height: 36px;
  line-height: 36px;
  vertical-align: middle;
}

@media (prefers-color-scheme: dark) {
  header,
  footer {
    background-color: #1c1c1cd9;
    color: whitesmoke;
  }
}

@media (prefers-color-scheme: light) {
  header,
  footer {
    background-color: whitesmoke;
    color: 1c1c1cd9;
  }
}
</style>
