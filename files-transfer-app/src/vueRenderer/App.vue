<template>
  <header id="header">
    <TitleBar appName="Files Uploader" />
  </header>

  <div id="mainWrapper">
    <div id="sideBar">
      <SideBar @updateSelectedFileList="updateSelectedFileList" @uploadFiles="uploadFiles" @reset="reset"
        @OpenFailures="OpenFailures" :selectedFiles="selectedFiles" :uploadStat="uploadStatus" />
    </div>
    <div id="main">
      <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo" ref="platformInfoComponent"
        v-show="openFailure === false" />
      <div class="center" v-if="selectedFiles.length === 0 && openFailure !== true">
        Choose files to upload...
      </div>
      <Failures v-if="openFailure === true" :failuresFilesList="failuresFilesList" @retryUpload="retryUpload" />

      <FilesListTable v-if="selectedFiles.length > 0 && openFailure === false" :selectedFiles="selectedFiles"
        :uploadStat="uploadStatus" @removeFile="removeFile" />
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
  deleteUploadFileFromSourceFolder
} from "./services/fileUploaderService";
import { uploadState, actionStatus } from "./services/enums";
import Failures from "./components/Failures.vue";
const { unionBy } = require("lodash");
const electron = require("electron");
const ipc = electron.ipcRenderer;

export default {
  name: "App",
  components: { ProgressBar, SideBar, FilesListTable, TitleBar, PlatformInfo, Failures },
  setup() {
    const config = ref({});
    config.value = ipc.sendSync("getConfig");

    const failuresFilesList = ref([]);
    const localRootFolder = config.value.localRootFolder;

    const platforms = ref(config.value.platforms);

    const platformInfoComponent = ref(null);
    const selectedPlatform = ref();
    const selectedTailNumber = ref();
    const selectedFiles = ref([]);

    const progressPercent = ref(0);
    const statusSummary = ref("");
    const uploadStatus = ref(uploadState.NONE);

    const openFailure = ref(false);

    function reset() {
      progressPercent.value = 0;
      statusSummary.value = "";
      selectedFiles.value = [];
      uploadStatus.value = uploadState.NONE;
      platformInfoComponent.value.reset();
    }
    function OpenFailures(failuresFiles) {
      if (openFailure.value)
        openFailure.value = false;
      else openFailure.value = true;

      console.log(failuresFiles);
      failuresFilesList.value = failuresFiles;
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

    async function uploadTask(files, statusSummary, index, fileName, filePath) {
      statusSummary.value = `Uploading file: ${files.value[index].name}`;
      let { uploadRetryStatus, uploadError } = await uploadFile(fileName, filePath);
      if (uploadRetryStatus === false) {
        statusSummary.value = uploadError;
        files.value[index].uploaded = actionStatus.FAILURE
      } else {
        files.value[index].uploaded = actionStatus.SUCCESS
        deleteUploadFileFromSourceFolder(filePath);
      }
    }

    function deleteTask(files, statusSummary, progressPercent, progressStep, index) {
      statusSummary.value = `Deleting file: ${files.value[index].name} from source folder`;
      let { deleteStatus, deleteError } = deleteFileFromSourceFolder(
        files.value[index]
      );
      if (deleteStatus === false) {
        statusSummary.value = deleteError;
        statusSummary.deleted = actionStatus.FAILURE;
        files.value[index].deleted = actionStatus.FAILURE;
      } else {
        statusSummary.value = deleteStatus.SUCCESS;
        files.value[index].deleted = actionStatus.SUCCESS;
        progressPercent.value += progressStep;
      }
    }

    function copyFileTask(files, targetFile, destFolder, localFilesToUpload, fullName, statusSummary, progressStep, index) {
      statusSummary.value = `Copying file: ${files.value[index].name} to local folder`;
      let { copyStatus, copyError } = copyFileToLocalFolder(
        files.value[index].path,
        targetFile,
        destFolder,
      );
      if (copyStatus === false) {
        statusSummary.value = copyError;
        files.value[index].copied = actionStatus.FAILURE;
        // continue;
      } else {
        localFilesToUpload.push({ fileName: fullName, localFilePath: targetFile, index: index });
        console.log(localFilesToUpload);
        files.value[index].copied = actionStatus.SUCCESS;
        progressPercent.value += progressStep;
      }
    }


    function fileHandler(files, index, platform, tailNumber, folder) {
      const seperateFileName = files.value[index].name.split('.');
      let originName = seperateFileName[0];
      const extension = seperateFileName[1];
      originName = `${originName}-${platform}-${tailNumber}`;
      const fullName = `${originName}.${extension}`;
      const targetFile = `${folder}${originName}.${extension}`;

      return { fullName, targetFile };
    }

    async function uploadFiles() {
      uploadStatus.value = uploadState.IN_PROGRESS;
      progressPercent.value = 1;
      statusSummary.value = "";
      let progressStep = Math.round(100 / (selectedFiles.value.length * 3));
      let localFilesToUpload = [];

      for (let i = 0; i < selectedFiles.value.length; i++) {
        let { fullName, targetFile } = fileHandler(selectedFiles, i, selectedPlatform.value, selectedTailNumber.value, localRootFolder);

        copyFileTask(selectedFiles, targetFile, localRootFolder, localFilesToUpload, fullName, statusSummary, progressStep, i);

        deleteTask(selectedFiles, statusSummary, progressPercent, progressStep, i);
      }

      for (let { fileName, localFilePath, index } of localFilesToUpload) {
        await uploadTask(selectedFiles, statusSummary, index, fileName, localFilePath);
      }

      progressPercent.value = Math.ceil(progressPercent.value);
      statusSummary.value = "Process complete";
      uploadStatus.value = uploadState.COMPLETED;

    }


    async function retryUpload() {
      uploadStatus.value = uploadState.IN_PROGRESS;
      progressPercent.value = 1;
      statusSummary.value = "";
      let progressStep = Math.round(100 / (failuresFilesList.value.length));

      for (let i = 0; i < failuresFilesList.value.length; i++) {
        uploadTask(failuresFilesList, statusSummary, i, failuresFilesList.value[i].name, failuresFilesList.value[i].path);
        progressPercent.value += progressStep;
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
      retryUpload,
      openFailure,
      OpenFailures, failuresFilesList
    };

  }
}


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
