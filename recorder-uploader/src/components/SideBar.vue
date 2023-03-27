<template>
  <div class="buttonsWrapper">
    <v-btn  rounded="sm"  color="primary" @click="selectFiles" :disabled="selectFilesButtonDisabled">
      Choose Files
    </v-btn>
    <v-btn  rounded="sm"  color="primary" @click="uploadFiles" :disabled="uploadFilesButtonDisabled">
      Upload
    </v-btn>
    <v-btn  rounded="sm"  color="primary" @click="reset" :disabled="resetButtonDisabled">
      Reset
    </v-btn>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { uploadState } from "../services/enums";
import { ipcRenderer } from "electron";

export default {
  name: "side-bar",
  props: ["selectedFiles", "uploadStat"],
  emits: ["updateSelectedFileList", "uploadFiles", "reset"],
  setup(props, context) {

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

    function selectFiles() {
      let newFiles = ipcRenderer.sendSync("choose-files");
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
/* .btnSideBar {
  height: 140px;
  width: 140px;
  margin: 0 5px;
  margin-top: 5px;
}

.buttonsWrapper{
  width: 95%;
  margin: auto;
}
.buttonsWrapper > button{
  width: 100%;
}
.v-btn{
  justify-content: left;
} */
.buttonsWrapper{
  margin-left: 10px;
}
.v-btn{
  margin-right: 10px;
}
</style>
