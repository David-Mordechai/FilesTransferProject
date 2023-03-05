<template>
  <button class="btnSideBar btn btn-success" @click="uploadFiles" :disabled="files.length === 0">Upload
  </button>
  <button class="btnSideBar btn btn-primary" @click="selectFiles">
    Choose Files
  </button>
  <button class="btnSideBar btn btn-primary" @click="clearFiles" :disabled="files.length === 0">Clear All</button>
</template>

<script>
import { ref } from "vue";
const electron = require("electron");
const { unionBy } = require('lodash');
const ipc = electron.ipcRenderer;
export default {
  name: "side-bar",
  props: ["selectedFiles"],
  emits: ["updateSelectedFileList", "uploadFiles"],
  setup(props, context) {
    
    const files = ref(props.selectedFiles);

    function selectFiles() {
      let result = ipc.sendSync("choose-files");
      let newFiles = result.map((file) => {
        return {
          name: file.name,
          size: file.size,
          path: file.path,
          uploaded: 'Pending',
          deleted: 'Pending',
        };
      });

      files.value = unionBy(newFiles, files.value, 'path')
        .sort(function (a, b) {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          // sort in an ascending order
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

      context.emit("updateSelectedFileList", this.files);
    }

    function clearFiles() {
      files.value = [];
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
