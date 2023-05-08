<template>
  <header id="header">
    <TitleBar appName="Files Uploader" />
  </header>

  <div id="mainWrapper">
    <div id="sideBar">
      <SideBar @updateSelectedFileList="updateSelectedFileList" @uploadFiles="uploadFiles" @reset="reset"
        @OpenFailures="OpenFailures" :selectedFiles="selectedFiles" :uploadStat="uploadStatus" />
    </div>
    <div id="main1" v-if="Routes === false">
      <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo" ref="platformInfoComponent"
        v-show="openFailure === false" />
      <div class="center" v-if="selectedFiles.length === 0 && openFailure === false">
        Choose files to upload...
      </div>
      <Failures v-if="openFailure === true" :failuresFilesList="failuresFilesList" @retryUpload="retryUpload" />
      <FilesListTable v-if="selectedFiles.length > 0 && openFailure === false" :selectedFiles="selectedFiles"
        :uploadStat="uploadStatus" @removeFile="removeFile" />
    </div>
    <div id="main2" v-if="Routes === true">
      <Export :platforms="platforms" @uploadFiles="uploadFiles" @updatePlatformInfo="updatePlatformInfo"></Export>
      <!-- <RouterView :platforms="platforms" @uploadFiles="uploadFiles"></RouterView> -->

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
import Export from "./components/Export.vue";
import { uploadState, actionStatus } from "./services/enums";
import Failures from "./components/Failures.vue";
const { unionBy } = require("lodash");
const electron = require("electron");
const ipc = electron.ipcRenderer;

export default {
  name: "App",
  components: { ProgressBar, SideBar, FilesListTable, TitleBar, PlatformInfo, Failures, Export },
  setup() {
    const config = ref({});
    config.value = ipc.sendSync("getConfig");

    const failuresFilesList = ref([]);
    // const localRootFolder = config.value.localRootFolder;

    const platforms = ref(config.value.platforms);

    const platformInfoComponent = ref(null);
    const selectedPlatform = ref();
    const selectedTailNumber = ref();
    const selectedDate = ref('')
    const selectedFiles = ref([]);

    const progressPercent = ref(0);
    const statusSummary = ref("");
    const uploadStatus = ref(uploadState.NONE);

    const openFailure = ref(false);
    const Routes = ref(true);
    function reset() {
      progressPercent.value = 0;
      statusSummary.value = "";
      selectedFiles.value = [];
      uploadStatus.value = uploadState.NONE;
      platformInfoComponent.value.reset();
    }

    function OpenFailures(failuresFiles) {
      openFailure.value = !openFailure.value;

      console.log(failuresFiles);
      failuresFilesList.value = failuresFiles;
    }

    watch(
      [selectedFiles, selectedPlatform, selectedTailNumber, selectedDate],
      ([newFiles, newPlatform, newTailNumber, newDate]) => {
        if (newFiles.length === 0 && newPlatform && newTailNumber && newDate) {
          uploadStatus.value = uploadState.CHOOSE_FILES;
        } else if (newFiles.length > 0 && newPlatform && newTailNumber && newDate) {
          uploadStatus.value = uploadState.READY;
        } else {
          uploadStatus.value = uploadState.NONE;
        }
      }
    );

    function updatePlatformInfo(platform, tailNumber, date) {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;
      selectedDate.value = date;
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

    // async function uploadFiles() {
    //   await uploadFilesFunction(uploadStatus,
    //     progressPercent,
    //     statusSummary,
    //     selectedFiles,
    //     selectedPlatform,
    //     selectedTailNumber,
    //     selectedDate,
    //     localRootFolder)
    // }

    // async function retryUpload() {
    //   await retryUploadFunction(uploadStatus, progressPercent, statusSummary, failuresFilesList)
    //   let failuresFiles = ipc.sendSync("failure-files");

    //   failuresFilesList.value = failuresFiles;

    //   if (failuresFilesList.value.length === 0) {
    //     openFailure.value = false;
    //     reset();

    //   }
    // }

    return {
      selectedFiles,
      progressPercent,
      statusSummary,
      uploadStatus,
      platforms,
      platformInfoComponent,
      updateSelectedFileList,
      updatePlatformInfo,
      // uploadFiles,
      removeFile,
      reset,
      // retryUpload,
      openFailure,
      OpenFailures, failuresFilesList,
      Routes
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

#main1 {
  grid-area: main-side;
  padding: 10px;
  width: 100%;
  height: calc(100vh - 72px);
  overflow-y: auto;
}

#main2 {
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
