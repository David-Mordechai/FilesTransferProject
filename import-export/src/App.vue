<template>
  <v-card>
    <div id="main">
      <ActionSelector></ActionSelector>
      <router-view @exportFiles="exportFiles" :platforms="platforms"
        @updatePlatformInfo="updatePlatformInfo"></router-view>
    </div>
  </v-card>
</template>


<script lang="ts">
import { ref, watch, computed } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import SideBar from "./components/SideBar.vue";
import FilesListTable from "./components/FilesListTable.vue";
import TitleBar from "./components/TitleBar.vue";
import PlatformInfo from "./components/PlatformInfo.vue";
import ExportFiles from "./components/ExportFiles.vue";
import ImportFiles from "./components/ImportFiles.vue";
import {
  uploadFile,
  copyFileToLocalFolder,
  deleteFileFromSourceFolder,
  exportFilesFunction
} from "./services/fileUploaderService";
import { uploadState, actionStatus } from "./services/enums";
import { unionBy } from "lodash"
import { ipcRenderer } from "electron";
import { config } from './models/config';
import ActionSelector from "./components/ActionSelector.vue";


export default {
  name: "App",
  components: { ProgressBar, SideBar, FilesListTable, TitleBar, PlatformInfo, ExportFiles, ImportFiles, ActionSelector },
  setup() {
    const config = ref<config>();
    config.value = ipcRenderer.sendSync("getConfig");
    const localRootFolder = config.value!.localRootFolder;
    const extensionsConfig = config.value?.allowedFiles?.at(0)?.extensions;
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

    function removeFile(filePath: string) {
      selectedFiles.value = selectedFiles.value.filter(
        (file: any) => file.path !== filePath
      );
    }

    async function uploadFiles() {
      uploadStatus.value = uploadState.IN_PROGRESS;
      statusSummary.value = "";

      let localFolder = `${localRootFolder}${selectedPlatform.value}-${selectedTailNumber.value}\\`;
      for (let i = 0; i < selectedFiles.value.length; i++) {
        progressCurrent.value = i + 1;
        statusSummary.value = `Copying file: ${selectedFiles.value[i].name} to local folder`;
        let { copyStatus, copyError, localFilePath } = await copyFileToLocalFolder(
          selectedFiles.value[i],
          localFolder
        );
        if (copyStatus === false) {
          statusSummary.value = copyError;
          selectedFiles.value[i].copied = actionStatus.FAILURE;
          continue;
        } else {
          selectedFiles.value[i].copied = actionStatus.SUCCESS;
        }

        statusSummary.value = `Deleting file: ${selectedFiles.value[i].name} from source folder`;
        let { deleteStatus, deleteError } = await deleteFileFromSourceFolder(
          selectedFiles.value[i]
        );
        if (deleteStatus === false) {
          statusSummary.value = deleteError;
          selectedFiles.value[i].deleted = actionStatus.FAILURE;
        } else {
          selectedFiles.value[i].deleted = actionStatus.SUCCESS;
        }

        statusSummary.value = `Uploading file: ${selectedFiles.value[i].name}`;
        let { uploadStatus, uploadError } = await uploadFile(selectedFiles.value[i].name, localFilePath);
        if (uploadStatus === false) {
          statusSummary.value = uploadError;
          selectedFiles.value[i].uploaded = actionStatus.FAILURE
        } else {
          selectedFiles.value[i].uploaded = actionStatus.SUCCESS
        }
      }

      statusSummary.value = "Process complete";
      uploadStatus.value = uploadState.COMPLETED;
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
      uploadFiles,
      removeFile,
      reset,
      exportFiles,
      externalDrivePath,
      extensionsConfig
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