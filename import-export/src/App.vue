<template>
  <v-card>
    <div id="main">
      <!-- <div>
        <ActionSelector v-if="sourceFolder !== ''"></ActionSelector>
      </div> -->

      <div v-if="sourceFolder === ''">
        <h1 class="noExternalDrive">NO EXTERNAL DRIVE CONNECTED</h1>
      </div>

      <div v-if="sourceFolder !== ''">
        <router-view @exportFiles="exportFiles" :platforms="platforms" :datesList="datesList"
          @updatePlatformInfo="updatePlatformInfo" @updateExportPlatformInfo="updateExportPlatformInfo"
          @getTimes="getTimes" :timesList="timesList"></router-view>
      </div>
    </div>
  </v-card>
</template>


<script lang="ts">
import { ref, watch } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import TitleBar from "./components/TitleBar.vue";
import PlatformInfo from "./components/PlatformInfo.vue";
import ExportFiles from "./components/ExportFiles.vue";
import ImportFiles from "./components/ImportFiles.vue";
import {
  exportFilesFunction
} from "./services/fileUploaderService";
import { uploadState, actionStatus } from "./services/enums";
import { unionBy } from "lodash"
import { ipcRenderer } from "electron";
import { config } from './models/config';
import ActionSelector from "./components/ActionSelector.vue";


export default {
  name: "App",
  components: { ProgressBar, TitleBar, PlatformInfo, ExportFiles, ImportFiles, ActionSelector },
  setup() {
    const config = ref<config>();
    config.value = ipcRenderer.sendSync("getConfig");
    const localRootFolder = config.value!.localRootFolder;
    const extensionsConfig = config.value?.allowedFiles?.at(0);
    console.log(extensionsConfig);


    const sourceFolder = "C:\\Users\\barnoaa\\Desktop\\Jsons";
    const platforms = ref(config.value!.platforms);

    const externalDrivePath = ref('');


    const platformInfoComponent = ref();
    const selectedPlatform = ref();
    const selectedTailNumber = ref();
    const selectedFiles = ref();
    selectedFiles.value = []

    const progressTotal = ref(0);
    const progressCurrent = ref(0);

    const statusSummary = ref();
    const uploadStatus = ref();
    uploadStatus.value = uploadState.NONE;

    const datesList = ref();
    const timesList = ref();
    function reset() {
      progressTotal.value = 0;
      progressCurrent.value = 0;
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

    function updateExportPlatformInfo(platform: string, tailNumber: number) {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;

      const details = ipcRenderer.sendSync("PlatformDetailsQuery", selectedPlatform.value, selectedTailNumber.value)
      console.log(details);
      console.log(selectedPlatform.value, selectedTailNumber.value);

      datesList.value = details;
    }

    function getTimes(platform: string, tailNumber: number, date: string) {
      const times = ipcRenderer.sendSync("getTimes", platform, tailNumber, date);
      console.log(times);

      timesList.value = times;
    }
    function updatePlatformInfo(platform: string, tailNumber: number) {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;

      console.log(selectedPlatform.value, selectedTailNumber.value);
    }
    function updateSelectedFileList(files: any) {
      let newFiles = files.map((file: any) => {
        return {
          name: file.name,
          size: file.size,
          path: file.path,
          copied: actionStatus.PENDING,
          deleted: actionStatus.PENDING,
          uploaded: actionStatus.PENDING,
        };
      });

      progressTotal.value = newFiles.length;

      selectedFiles.value = unionBy(newFiles, selectedFiles.value, "path").sort(
        function (a: any, b: any) {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      );
    }

    function removeFile(filePath: string) {
      selectedFiles.value = selectedFiles.value.filter(
        (file: any) => file.path !== filePath
      );
    }


    function exportFiles(date: string, time: string) {
      console.log(date, time, selectedPlatform.value, selectedTailNumber.value);
      console.log(sourceFolder);

      exportFilesFunction(sourceFolder, localRootFolder, date, time, selectedPlatform.value, selectedTailNumber.value, extensionsConfig);

    }
    return {
      selectedFiles,
      progressTotal,
      progressCurrent,
      statusSummary,
      uploadStatus,
      platforms,
      platformInfoComponent,
      updateSelectedFileList,
      updatePlatformInfo,
      removeFile,
      reset,
      exportFiles,
      externalDrivePath,
      extensionsConfig, sourceFolder,
      datesList,
      getTimes, timesList,
      updateExportPlatformInfo
    };
  },
};

</script>

<style>
#main {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}

.status-bar {
  display: grid;
  grid-template-areas: "f1 f1 f2";
  place-items: center;
}

.noExternalDrive {
  margin-top: 20%;
  margin-bottom: 20%;
  margin-left: 28%;
  margin-right: 28%;
  text-shadow: 1px 1px 2px gray;
}

.status-progressBar {
  grid-area: f2;
  justify-self: end;
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
