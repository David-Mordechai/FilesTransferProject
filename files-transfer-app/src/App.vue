<template>
  <div class="toolbar" >
    <div class="title-bar-buttons">
      <button class="btnMin" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h16v16H0z" fill="none" />
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      </button>
      <button class="btnMax" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      </button>
      <button class="btnScaleDown" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </svg>
      </button>
      <button @click="close" class="btnClose" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  </div>

  <div class="container mt-2">
    <div class="mb-3">
      <FilesPicker @updateSelectedFileList="updateSelectedFileList" @uploadFiles="uploadFiles" />
      <div v-if="selectedFiles.length > 0">
        <FilesListTable :files="selectedFiles" />
        <ProgressBar :progressPercent="progressPercent" />
      </div>
    </div>
  </div>
  <footer class="fixed-footer"></footer>
</template>

<script>
import { ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import FilesPicker from "./components/FilesPicker.vue";
import FilesListTable from "./components/FilesListTable.vue";
import { uploadFile } from "./services/fileUploaderService";

const electron = require('electron')
const ipc = electron.ipcRenderer

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
      for (let i = 0; i < selectedFiles.value.length; i++) {
        await uploadFile(selectedFiles.value[i]);
        progressPercent.value += progressStep;
      }
      progressPercent.value = 100;
    }

    function close() {
      ipc.send('close') 
    }

    return {
      selectedFiles,
      progressPercent,
      updateSelectedFileList,
      uploadFiles,
      close
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

.toolbar {
  height: 36px;
  width: 100%;
  position: fixed;
  top: 0px;
  -webkit-app-region: drag;
}

.title-bar-buttons {
  -webkit-app-region: no-drag;
  position: fixed;
  right: 0px;
}

.btnMin,
.btnMax,
.btnScaleDown,
.btnClose {
  border: none;
  background-color: transparent;
  height: 36px;
  width: 36px;
}

.btnClose {
  width: 42px;
}

.btnClose:hover {
  background-color: orangered;
  color: whitesmoke;
}

.btnMin:hover,
.btnMax:hover,
.btnScaleDown:hover {
  background-color: rgba(128, 128, 128, 0.597);
}

svg {
  width: 60%;
  height: 55%;
}

.btnClose svg {
  width: 80%;
  height: 60%;
}

@media (prefers-color-scheme: dark) {

  .btnMin,
  .btnMax,
  .btnScaleDown,
  .btnClose svg {
    fill: #fff;
  }

  .toolbar {
    background-color: #1c1c1cd9;
  }
}

@media (prefers-color-scheme: light) {

  .btnMin,
  .btnMax,
  .btnScaleDown,
  .btnClose svg {
    fill: #000000ab;
  }
}
</style>
