import { ImportUavDataWorkflow } from "../UavData/workflows/ImportUavDataWorkflow";
import { CreateFoldersByPlatformInfoTask } from "../UavData/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../UavData/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../UavData/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../UavData/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../UavData/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../UavData/workflows/tasks/GetFilesTask";
import { CopyFilesToUsbTask } from "../UavData/workflows/tasks/CopyFilesToUsbTask";
import { ipcRenderer } from "electron";
export default async function importData(
  sourceFolder: string,
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string,
  extensionsConfig: Array<string>
) {
  let ImportWorkflow = new ImportUavDataWorkflow(
    new CreateFoldersByPlatformInfoTask(),
    new CopyFilesToBackupFolderTask(),
    new StructureNameInProgressFilesTask(),
    new GetFilesTask(),
    new FilterFilesByExtensionTask(),
    new CopyFilesToInProgressFolderTask()
  );

  if (sourceFolder.trim().length !== 0) {
    await ImportWorkflow.execute(
      sourceFolder,
      destFolder,
      date,
      time,
      platform,
      tailNumber,
      extensionsConfig
    );
  }
}

export function exportData(
  usbFolder: string,
  platform: string,
  tailNumber: string,
  date: string,
  time: string,
  extensionsConfig: Array<string>
) {
  let exportDataWorkflow = new exportDataWorkflow(new CopyFilesToUsbTask());
  exportDataWorkflow.execute(platform, tailNumber, date, time);
}
