<template>
  <button class="btnSideBar btn btn-primary" 
  @click="selectFiles"
  :disabled="uploadStatus === 'inProgress' || uploadStatus === 'completed'">Choose Files</button>
  
  <button class="btnSideBar btn btn-success" 
  @click="uploadFiles" 
  :disabled="uploadStatus !== 'ready'">Upload</button>
  
  <button class="btnSideBar btn btn-primary" 
  @click="clearAll" 
  :disabled="uploadStatus === 'inProgress' || uploadStatus === 'none'">Clear All</button>
</template>

<script>
import { computed } from "vue";
const electron = require("electron");

const ipc = electron.ipcRenderer;
export default {
  name: "side-bar",
  props: ["selectedFiles", "uploadStat"],
  emits: ["updateSelectedFileList", "uploadFiles", "clearAll"],
  setup(props, context) {
    
    const files = computed(() => {return props.selectedFiles});
    const uploadStatus = computed(() => {return props.uploadStat});

    function selectFiles() {
      let newFiles = ipc.sendSync("choose-files");
      context.emit("updateSelectedFileList", newFiles);
    }

    function clearAll() {
      context.emit("clearAll", []);
    }

    function uploadFiles() {
      context.emit("uploadFiles");
    }

    return {
      files,
      uploadStatus,
      selectFiles,
      uploadFiles,
      clearAll,
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
