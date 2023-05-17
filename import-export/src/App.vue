
<template>
  <v-card>
    <v-layout row wrap align-center>
      <v-navigation-drawer permanent>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-import" :disabled="connectedUsb?.isConnected === false">
            <v-btn @click="router.push('/import')">Import</v-btn></v-list-item>
          <v-list-item prepend-icon="mdi-export" :disabled="connectedUsb?.isConnected === false">
            <v-btn @click="router.push('/export')">Export</v-btn></v-list-item>
        </v-list>
        <v-footer id="footer" style="background-color:#007f61;">
          <div v-if="connectedUsb.isConnected">
            <h5>{{ connectedUsb.label }} is Connected</h5>
          </div>
        </v-footer>
        <v-footer id="footer" style="background-color:#ae2828;" v-if="connectedUsb.isConnected === false">
          <h3>No USB connected</h3>
        </v-footer>
      </v-navigation-drawer>

      <v-app-bar id="appBar" v-if="connectedUsb?.isConnected">
        <div id="appBarText">
          <div>
            <h3>External storage device attached {{ connectedUsb.label }}</h3>
          </div>
        </div>
        <v-card color="secondary" id="progressCard">
          <div class="status-bar">
            <div class="status-summary">{{ statusSummary }}</div>
            <ProgressBar class="status-progressBar" :total="progressTotal" :current="progressCurrent" />
          </div>
        </v-card>
      </v-app-bar>
      <v-main>
        <div id="main">
          <div v-if="connectedUsb?.isConnected === false">
            <h1 class="noExternalDrive">Please attach external storage device to begin.</h1>
          </div>
          <div v-if="connectedUsb?.isConnected">
            <router-view @importFiles="importFiles" @exportFiles="exportFiles" :platforms="platforms"
              :datesList="datesList" @updatePlatformInfo="updatePlatformInfo"
              @getDatesByPlatformInfo="getDatesByPlatformInfo" @getTimesByDates="getTimesByDates" :timesList="timesList"
              @getTotal="getTotal" :progressTotal="progressTotal"></router-view>
          </div>
        </div>

      </v-main>


    </v-layout>
  </v-card>
</template>


<script lang="ts">
import { ref, watch } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import PlatformInfo from "./components/PlatformInfo.vue";
import ExportFiles from "./components/ExportFiles.vue";
import ImportFiles from "./components/ImportFiles.vue";
import { UavDataService } from "./Logic/UavData/UavDataService";
import { uploadState, actionStatus } from "./Logic/services/enums";
import { ipcRenderer } from "electron";
import { appSettings } from './models/appSettings';
import ActionSelector from "./components/ActionSelector.vue";
import { UsbDevice } from "./models/usbDevice";
import { useRouter } from 'vue-router';
// import router from "@/router";
import { BaseUavDataModel } from "./Logic/UavData/models/baseUavDataModel";


export default {
  name: "App",
  components: { ProgressBar, PlatformInfo, ExportFiles, ImportFiles, ActionSelector },
  setup() {
    const config = ref<appSettings>();
    config.value = ipcRenderer.sendSync("getConfig");
    const testDevice: UsbDevice = new UsbDevice();
    testDevice.isConnected = true;
    testDevice.path = "C:\\Users\\barnoaa\\Desktop\\Jsons";
    testDevice.label = "TestUsb_X";
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
    selectedFiles.value = [];

    const progressTotal = ref(0);
    const progressCurrent = ref(0);

    const statusSummary = ref();
    const uploadStatus = ref();
    uploadStatus.value = uploadState.NONE;

    const uavDataService = new UavDataService();
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
    }

    function getDatesByPlatformInfo(
      platform: string,
      tailNumber: number
    ) {
      selectedPlatform.value = platform;
      selectedTailNumber.value = tailNumber;
      const details = ipcRenderer.sendSync(
        "getDatesByPlatformInfo",
        platform,
        tailNumber
      );
      datesList.value = details;
    }

    function getTimesByDates(
      date: string
    ) {
      const path = `${localRootFolder}backup\\${selectedPlatform.value}-${selectedTailNumber.value}\\${date}`;
      const times = ipcRenderer.sendSync("getTimes", path);
      timesList.value = times;
    }

    async function importFiles(date: string, time: string) {

      let platform = selectedPlatform.value;
      let tailNumber = selectedTailNumber.value;

      let importUavData: BaseUavDataModel = {
        destFolder: localRootFolder,
        date,
        time,
        platform,
        tailNumber
      }
      progressCurrent.value = await uavDataService.importData(sourceFolder, importUavData, extensionsConfig);
      console.log(progressCurrent.value);

    }

    function getTotal() {
      progressTotal.value = ipcRenderer.sendSync("totalFiles", sourceFolder);
      console.log(progressTotal.value);

    }

    function exportFiles(date: string, time: string) {
      console.log(connectedUsb.value.path);

      progressCurrent.value = uavDataService.exportData(localRootFolder, connectedUsb.value.path, selectedPlatform.value, selectedTailNumber.value, date, time, extensionsConfig);

    }
    return {
      progressTotal,
      progressCurrent,
      statusSummary,
      platforms,
      platformInfoComponent,
      updatePlatformInfo,
      importFiles,
      externalDrivePath,
      extensionsConfig,
      sourceFolder,
      datesList, timesList,
      connectedUsb,
      exportFiles,
      getTimesByDates,
      getDatesByPlatformInfo, getTotal, router
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

#appBarText {
  margin: auto;
  margin-top: 0.4%;
  margin-left: 2%;
}

#appBar {
  background-color: rgb(7, 84, 105);
  /* background-color: #2196F3; */
  height: 40px;
  margin: auto;
  font-size: medium;
  text-align: center;
  text-shadow: 1px 1px 2px #808080;
}

#footer {
  height: 26px;
  width: 100%;
  vertical-align: bottom;
  position: absolute;
  bottom: 0px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 1px 1px 2px #808080;
}


.noExternalDrive {
  margin-top: 20%;
  margin-bottom: 20%;
  margin-left: 28%;
  margin-right: 28%;
  text-shadow: 1px 1px 2px #808080;
}

.status-bar {
  display: grid;
  grid-template-areas: "f1 f1 f2";
  place-items: center;
}

.status-progressBar {
  grid-area: f2;
  justify-self: end;
  margin-right: 10px;
  margin-bottom: 25px;
}

.status-summary {
  grid-area: f1;
  justify-self: start;
  padding-left: 10px;
  height: 36px;
  line-height: 36px;
  vertical-align: middle;
}

#progressCard {
  width: 400px;
  margin-right: 0.3%;
  height: 30px;
  margin-left: 3%;
  margin-bottom: 2%;
}
</style>
