import { ImportUavDataWorkflow } from "../UavData/workflows/ImportUavDataWorkflow";
import { CreateFoldersByPlatformInfoTask } from "../UavData/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../UavData/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../UavData/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../UavData/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../UavData/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../UavData/workflows/tasks/GetFilesTask";
import { CopyFilesToUsbTask } from "../UavData/workflows/tasks/CopyFilesToUsbTask";
import { BaseUavDataModel } from "../UavData/models/baseUavDataModel";
import { ExportUavDataWorkFlow } from "./workflows/ExportUavDataWorkflow";
import { count } from "console";

export class UavDataService {
  constructor() {}
  public exportData(
    sourceFolder: string,
    usbFolder: string,
    platform: string,
    tailNumber: string,
    date: string,
    time: string,
    extensionsConfig: Array<string>
  ): Promise<number> {
    let counter = 0;
    let exportDataWorkflow = new ExportUavDataWorkFlow(
      new CopyFilesToUsbTask()
    );

    exportDataWorkflow.on("filesCounter", (x) => {
      counter = x.fileCounter;
    });
    exportDataWorkflow.execute(
      sourceFolder,
      platform,
      tailNumber,
      date,
      time,
      usbFolder
    );

    return counter;
  }
  public async importData(
    sourceFolder: string,
    uavData: BaseUavDataModel,
    extensionsConfig: Array<string>
  ): Promise<number> {
    let counter = 0;
    let ImportWorkflow = new ImportUavDataWorkflow(
      new CreateFoldersByPlatformInfoTask(),
      new CopyFilesToBackupFolderTask(),
      new StructureNameInProgressFilesTask(),
      new GetFilesTask(),
      new FilterFilesByExtensionTask(),
      new CopyFilesToInProgressFolderTask()
    );
    ImportWorkflow.on("filesCounter", (x) => {
      counter = x.fileCounter;
    });
    if (sourceFolder.trim().length !== 0) {
      await ImportWorkflow.execute(sourceFolder, uavData, extensionsConfig);
    }
    return counter;
  }
}
