<template>
  <button class="btnSideBar btn btn-primary" @click="selectFiles" :disabled="selectFilesButtonDisabled">Choose
    Files</button>

  <button class="btnSideBar btn btn-success" @click="uploadFiles" :disabled="uploadFilesButtonDisabled">Upload</button>

  <button class="btnSideBar btn btn-primary" @click="reset" :disabled="resetButtonDisabled">Reset</button>

  <button class="btnSideBar btn btn-danger" @click="openFailures" v-if="failuresIsDisplay">
    Failures {{ failuresFilesCounter }}</button>


  <router-link :to="{ name: 'Export' }" class="btnSideBar btn btn-success">EXPORT</router-link>

  <router-link :to="{ name: 'Import' }" class="btnSideBar btn btn-primary">IMPORT</router-link>
</template>

<script>
import { computed, ref } from "vue";
import { uploadState } from '../services/enums';
const electron = require("electron");

const ipc = electron.ipcRenderer;
export default {
  name: "side-bar",
  props: ["selectedFiles", "uploadStat"],
  emits: ["updateSelectedFileList", "uploadFiles", "reset", "OpenFailures"],
  setup(props, context) {

    const failuresFilesCounter = ref(0);

    ipc.on('filesCounter', (_, args) => {
      console.log(args);
      failuresFilesCounter.value = args
    })
    ipc.send("getFilesCount");

    const files = computed(() => { return props.selectedFiles });

    const selectFilesButtonDisabled = computed(() => {
      return props.uploadStat === uploadState.IN_PROGRESS || props.uploadStat === uploadState.COMPLETED;
    });

    const uploadFilesButtonDisabled = computed(() => {
      return props.uploadStat !== uploadState.READY;
    });

    const resetButtonDisabled = computed(() => {
      return props.uploadStat === uploadState.IN_PROGRESS || props.uploadStat === uploadState.NONE;
    });

    const failuresIsDisplay = computed(() => {
      return props.uploadStat !== uploadState.IN_PROGRESS && failuresFilesCounter.value > 0
    })

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

    function openFailures() {
      let failuresFiles = ipc.sendSync("failure-files");
      context.emit("OpenFailures", failuresFiles)
    }

    return {
      files,
      selectFilesButtonDisabled,
      uploadFilesButtonDisabled,
      resetButtonDisabled,
      selectFiles,
      uploadFiles,
      openFailures,
      reset,
      failuresIsDisplay, failuresFilesCounter
    };
  },
};
</script>

<style scoped>
.btnSideBar {
  height: 50px;
  width: 145px;
  margin: 0 2px;
  margin-top: 4px;
  padding: 10px;
}
</style>
