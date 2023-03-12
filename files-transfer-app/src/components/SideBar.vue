<template>
  <button class="btnSideBar btn btn-primary" 
  @click="selectFiles"
  :disabled="selectFilesButtonDisabled">Choose Files</button>
  
  <button class="btnSideBar btn btn-success" 
  @click="uploadFiles" 
  :disabled="uploadFilesButtonDisabled">Upload</button>
  
  <button class="btnSideBar btn btn-primary" 
  @click="reset" 
  :disabled="resetButtonDisabled">Reset</button>
</template>

<script>
import { computed } from "vue";
import { uploadState } from '../services/enums';
const electron = require("electron");

const ipc = electron.ipcRenderer;
export default {
  name: "side-bar",
  props: ["selectedFiles", "uploadStat"],
  emits: ["updateSelectedFileList", "uploadFiles", "reset"],
  setup(props, context) {
    
    const files = computed(() => {return props.selectedFiles});
    
    const selectFilesButtonDisabled = computed(() => {
      return props.uploadStat === uploadState.IN_PROGRESS || props.uploadStat === uploadState.COMPLETED;
    });

    const uploadFilesButtonDisabled = computed(() => {
      return props.uploadStat !== uploadState.READY;
    });
    
    const resetButtonDisabled = computed(() => {
      return props.uploadStat === uploadState.IN_PROGRESS || props.uploadStat === uploadState.NONE;
    });

    function selectFiles() {
      let newFiles = ipc.sendSync("choose-files");
      context.emit("updateSelectedFileList", newFiles);
    }

    function reset() {
      context.emit("reset", []);
    }

    function uploadFiles() {
      context.emit("uploadFiles");
    }

    return {
      files,
      selectFilesButtonDisabled,
      uploadFilesButtonDisabled,
      resetButtonDisabled,
      selectFiles,
      uploadFiles,
      reset,
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
