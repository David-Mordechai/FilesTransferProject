import { ImportUavDataWorkflow } from "../UavData/workflows/ImportUavDataWorkflow";
import { ExportUavDataWorkFlow } from "../UavData/workflows/ExportUavDataWorkFlow";
import { CreateFoldersByPlatformInfoTask } from "../UavData/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../UavData/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../UavData/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../UavData/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../UavData/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../UavData/workflows/tasks/GetFilesTask";
import { CopyFilesToUsbTask } from "../UavData/workflows/tasks/CopyFilesToUsbTask";
import { ipcRenderer } from "electron";
import { BaseUavDataModel } from "../../models/baseUavDataModel";

export class UavDataService {
  constructor() {}

  public exportData(
    //   sourceFolder: string,
    //   uavData: BaseUavDataModel,
    //   extensionsConfig: Array<string>
    // ) {
    //   let exportDataWorkflow = new ExportUavDataWorkFlow(
    //     new CopyFilesToUsbTask()
    //   );
    //   exportDataWorkflow.execute(sourceFolder, uavData);
    // }
    sourceFolder: string,
    usbFolder: string,
    platform: string,
    tailNumber: string,
    date: string,
    time: string,
    extensionsConfig: Array<string>
  ) {
    let exportDataWorkflow = new ExportUavDataWorkFlow(
      new CopyFilesToUsbTask()
    );
    exportDataWorkflow.execute(
      sourceFolder,
      platform,
      tailNumber,
      date,
      time,
      usbFolder
    );
  }
  public async importData(
    sourceFolder: string,
    uavData: BaseUavDataModel,
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
      await ImportWorkflow.execute(sourceFolder, uavData, extensionsConfig);
    }
  }
}
