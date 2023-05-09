
<template>
  <v-card>
    <div id="main">

      <div v-if="connectedUsb?.isConnected === false">
        <h1 class="noExternalDrive">Please attach external storage device to begin.</h1>
      </div>

      <div v-if="connectedUsb?.isConnected">
        <h2>External storage device attached {{ connectedUsb.label }}</h2>
        <router-view @importFiles="importFiles" @exportFiles="exportFiles" :platforms="platforms" :datesList="datesList"
          @updatePlatformInfo="updatePlatformInfo" @getDatesByPlatformInfo="getDatesByPlatformInfo"
          @getTimesByDates="getTimesByDates" :timesList="timesList"></router-view>
      </div>
    </div>
  </v-card>
</template>


<script lang="ts">
import { ref, watch } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import PlatformInfo from "./components/PlatformInfo.vue";
import ExportFiles from "./components/ExportFiles.vue";
import ImportFiles from "./components/ImportFiles.vue";
import importData from "./Logic/UavData/UavDataService";
import exportData from "./Logic/UavData/UavDataService";
import { uploadState, actionStatus } from "./Logic/services/enums";
import { unionBy } from "lodash"
import { ipcRenderer } from "electron";
import { appSettings } from './models/appSettings';
import ActionSelector from "./components/ActionSelector.vue";
import { UsbDevice } from "./models/usbDevice";
import { useRouter } from 'vue-router';
import router from "@/router";

export default {
  name: "App",
  components: { ProgressBar, PlatformInfo, ExportFiles, ImportFiles, ActionSelector },
  setup() {
    const config = ref<appSettings>();
    config.value = ipcRenderer.sendSync("getConfig");
    const testDevice: UsbDevice = new UsbDevice();
    testDevice.isConnected = true;
    testDevice.path = "C:\\Users\\barnoaa\\Desktop\\Jsons";
    testDevice.label = "test";
    const connectedUsb = ref<UsbDevice>(testDevice);
    // const connectedUsb = ref<UsbDevice>(new UsbDevice());
    ipcRenderer.on("usb-state", (_, data: UsbDevice) => {
      externalDrivePath.value = data.path;
      connectedUsb.value = data;
      if (connectedUsb.value.isConnected === false) {
        router.push("/");
      }
    });

    const router = useRouter();
    const localRootFolder = config.value!.localRootFolder;
    const extensionsConfig: any = config.value?.allowedFiles[0].extentions;

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


    function getDatesByPlatformInfo(
      platform: string,
      tailNumber: number
    ): [] {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;
      const details = ipcRenderer.sendSync(
        "PlatformDetailsQuery",
        platform,
        tailNumber
      );
      console.log(details);

      datesList.value = details;
    }

    function getTimesByDates(
      date: string
    ): [] {
      const path = `${localRootFolder}backup\\${selectedPlatform.value}-${selectedTailNumber.value}\\${date}`;
      const times = ipcRenderer.sendSync("getTimes", path);
      console.log(times);

      timesList.value = times;
    }

    async function importFiles(date: string, time: string) {
      console.log(date, time, selectedPlatform.value, selectedTailNumber.value);
      console.log(sourceFolder);

      await importData(sourceFolder, localRootFolder, date, time, selectedPlatform.value, selectedTailNumber.value, extensionsConfig);

    }

    async function exportFiles(date: string, time: string) {
      console.log(date, time, selectedPlatform.value, selectedTailNumber.value);
      console.log(sourceFolder);

      await exportData(sourceFolder, selectedPlatform.value, selectedTailNumber.value, date, time, extensionsConfig);

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
      reset,
      importFiles,
      externalDrivePath,
      extensionsConfig,
      sourceFolder,
      datesList, timesList,
      connectedUsb,
      exportFiles,
      getTimesByDates,
      getDatesByPlatformInfo
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
