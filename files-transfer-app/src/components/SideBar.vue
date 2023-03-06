<template>
  <button class="btnSideBar btn btn-success" @click="uploadFiles" :disabled="files.length === 0">Upload</button>
  <button class="btnSideBar btn btn-primary" @click="selectFiles">Choose Files</button>
  <button class="btnSideBar btn btn-primary" @click="clearFiles" :disabled="files.length === 0">Clear All</button>
</template>

<script>
import { computed } from "vue";
const electron = require("electron");

const ipc = electron.ipcRenderer;
export default {
  name: "side-bar",
  props: ["selectedFiles"],
  emits: ["updateSelectedFileList", "uploadFiles"],
  setup(props, context) {
    
    const files = computed(() => {return props.selectedFiles});

    function selectFiles() {
      let newFiles = ipc.sendSync("choose-files");
      context.emit("updateSelectedFileList", newFiles);
    }

    function clearFiles() {
      context.emit("updateSelectedFileList", []);
    }

    function uploadFiles() {
      context.emit("uploadFiles");
    }

    return {
      files,
      selectFiles,
      uploadFiles,
      clearFiles
    };
  },
};
</script>

<style scoped>
.btnSideBar {
  height: 140px;
  width: 140px;
  margin: 0 5px;
  margin-top: 5px;
}
</style>
