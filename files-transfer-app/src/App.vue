<template>
  <header id="header">
    <TitleBar appName="Files Uploader" />
  </header>

  <div id="mainWrapper">
    <div id="sideBar">
      <SideBar @updateSelectedFileList="updateSelectedFileList" @uploadFiles="uploadFiles" @reset="reset"
        :selectedFiles="selectedFiles" :uploadStat="uploadStatus" />
    </div>
    <div id="main">
      <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo" ref="platformInfoComponent" />
      <div class="center" v-if="selectedFiles.length === 0">
        Choose files to upload...
      </div>

      <FilesListTable v-if="selectedFiles.length > 0" :selectedFiles="selectedFiles" :uploadStat="uploadStatus"
        @removeFile="removeFile" />
    </div>
  </div>

  <footer id="footer">
    <div class="status-bar">
      <div class="status-summary">{{ statusSummary }}</div>
      <ProgressBar class="status-progressBar" :progressPercent="progressPercent" />
    </div>
  </footer>
</template>

<script>
import { ref, watch } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import SideBar from "./components/SideBar.vue";
import FilesListTable from "./components/FilesListTable.vue";
import TitleBar from "./components/TitleBar.vue";
import PlatformInfo from "./components/PlatformInfo.vue";
import {
  uploadFile,
  copyFileToLocalFolder,
  deleteFileFromSourceFolder,
} from "./services/fileUploaderService";
import { uploadState, actionStatus } from "./services/enums";
const { unionBy } = require("lodash");
const electron = require("electron");
const ipc = electron.ipcRenderer;

export default {
  name: "App",
  components: { ProgressBar, SideBar, FilesListTable, TitleBar, PlatformInfo },
  setup() {
    const config = ref({});
    config.value = ipc.sendSync("getConfig");
    const localRootFolder = config.value.localRootFolder;

    const platforms = ref(config.value.platforms);

    const platformInfoComponent = ref(null);
    const selectedPlatform = ref();
    const selectedTailNumber = ref();
    const selectedFiles = ref([]);

    const progressPercent = ref(0);
    const statusSummary = ref("");
    const uploadStatus = ref(uploadState.NONE);

    function reset() {
      progressPercent.value = 0;
      statusSummary.value = "";
      selectedFiles.value = [];
      uploadStatus.value = uploadState.NONE;
      platformInfoComponent.value.reset();
    }

    watch(
      [selectedFiles, selectedPlatform, selectedTailNumber],
      ([newFiles, newPlatform, newTailNumber]) => {
        if (newFiles.length === 0 && newPlatform && newTailNumber) {
          uploadStatus.value = uploadState.CHOOSE_FILES;
        } else if (newFiles.length > 0 && newPlatform && newTailNumber) {
          uploadStatus.value = uploadState.READY;
        } else {
          uploadStatus.value = uploadState.NONE;
        }
      }
    );

    function updatePlatformInfo(platform, tailNumber) {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;
    }

    function updateSelectedFileList(files) {
      let newFiles = files.map((file) => {
        return {
          name: file.name,
          size: file.size,
          path: file.path,
          copied: actionStatus.PENDING,
          deleted: actionStatus.PENDING,
          uploaded: actionStatus.PENDING,
        };
      });

      selectedFiles.value = unionBy(newFiles, selectedFiles.value, "path").sort(
        function (a, b) {
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
        }
      );
    }

    function removeFile(filePath) {
      selectedFiles.value = selectedFiles.value.filter(
        (file) => file.path !== filePath
      );
    }

    async function uploadFiles() {
      uploadStatus.value = uploadState.IN_PROGRESS;
      progressPercent.value = 1;
      statusSummary.value = "";
      let progressStep = Math.round(100 / (selectedFiles.value.length * 3));

      let localFolder = `${localRootFolder}${selectedPlatform.value}-${selectedTailNumber.value}\\`;
      let localFilesToUpload = [];
      for (let i = 0; i < selectedFiles.value.length; i++) {
        
        statusSummary.value = `Copying file: ${selectedFiles.value[i].name} to local folder`;
        let { copyStatus, copyError, localFilePath } = copyFileToLocalFolder(
          selectedFiles.value[i],
          localFolder
        );
        if (copyStatus === false) {
          statusSummary.value = copyError;
          selectedFiles.value[i].copied = actionStatus.FAILURE;
          continue;
        } else {
          localFilesToUpload.push({ fileName: selectedFiles.value[i].name, localFilePath, index: i });
          selectedFiles.value[i].copied = actionStatus.SUCCESS;
          progressPercent.value += progressStep;
        }

        statusSummary.value = `Deleting file: ${selectedFiles.value[i].name} from source folder`;
        let { deleteStatus, deleteError } = deleteFileFromSourceFolder(
          selectedFiles.value[i]
        );
        if (deleteStatus === false) {
          statusSummary.value = deleteError;
          selectedFiles.value[i].deleted = actionStatus.FAILURE;
        } else {
          selectedFiles.value[i].deleted = actionStatus.SUCCESS;
          progressPercent.value += progressStep;
        }
      }

      for(let {fileName, localFilePath, index} of localFilesToUpload){
        statusSummary.value = `Uploading file: ${fileName}`;
        let {uploadStatus, uploadError} = await uploadFile(fileName, localFilePath);
        if (uploadStatus === false) {
          statusSummary.value = uploadError;
          selectedFiles.value[index].uploaded = actionStatus.FAILURE
        } else {
          selectedFiles.value[index].uploaded = actionStatus.SUCCESS
          progressPercent.value += progressStep;
        }
      }

      progressPercent.value = Math.ceil(progressPercent.value);
      statusSummary.value = "Process complete";
      uploadStatus.value = uploadState.COMPLETED;
    }

    return {
      selectedFiles,
      progressPercent,
      statusSummary,
      uploadStatus,
      platforms,
      platformInfoComponent,
      updateSelectedFileList,
      updatePlatformInfo,
      uploadFiles,
      removeFile,
      reset,
    };
  },
};
</script>

<style>
body {
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#mainWrapper {
  display: grid;
  grid-template-areas:
    "header header"
    "side-bar main-side"
    "footer footer";
  grid-template-columns: 150px 1fr;
}

#sideBar {
  grid-area: side-bar;
  width: 150px;
  background-color: #1c1c1cc0;
}

#main {
  grid-area: main-side;
  padding: 10px;
  width: 100%;
  height: calc(100vh - 72px);
  overflow-y: auto;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  font-size: xx-large;
  color: darkgray;
}

header,
footer {
  background-color: #1c1c1cd9;
  color: whitesmoke;
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
  margin-right: 10px;
}

.status-summary {
  grid-area: f1;
  justify-self: start;
  padding-left: 10px;
  height: 36px;
  line-height: 36px;
  vertical-align: middle;
}
</style>
