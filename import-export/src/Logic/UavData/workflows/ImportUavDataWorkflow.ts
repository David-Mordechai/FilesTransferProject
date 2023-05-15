import { ICopyFilesToBackupFolderTask } from "./tasks/interfaces/ICopyFilesToBackupFolderTask";
import { ICreateFoldersByPlatformInfoTask } from "./tasks/interfaces/ICreateFoldersByPlatformInfoTask";
import { IStructureNameInProgressFilesTask } from "./tasks/interfaces/IStructureNameInProgressFilesTask";
import { IGetFilesTask } from "./tasks/interfaces/IGetFilesTask";
import { IFilterFilesByExtensionTask } from "./tasks/interfaces/IFilterFilesByExtensionTask";
import { ICopyFilesToInProgressFolderTask } from "./tasks/interfaces/ICopyFilesToInProgressFolderTask";
import { BaseUavDataModel } from "../../models/baseUavDataModel";

export class ImportUavDataWorkflow {
  public constructor(
    private createFoldersByPlatformInfoTask: ICreateFoldersByPlatformInfoTask,
    private copyFilesToBackupFolderTask: ICopyFilesToBackupFolderTask,
    private structureNameInProgressFilesTask: IStructureNameInProgressFilesTask,
    private getFilesTask: IGetFilesTask,
    private filterFilesByExtensionTask: IFilterFilesByExtensionTask,
    private copyFilesToInProgressFolderTask: ICopyFilesToInProgressFolderTask
  ) {}

  public async execute(
    sourceFolder: string,
    baseUavDataModel: BaseUavDataModel,
    extensionsConfig: Array<string>
  ) {
    let backupFolder =
      this.createFoldersByPlatformInfoTask.create(baseUavDataModel);

    if (!backupFolder.success) return;
    this.copyFilesToBackupFolderTask.copy(sourceFolder, backupFolder.value);

    let files: string[] = await this.getFilesTask.get(sourceFolder);

    let filteredList = this.filterFilesByExtensionTask.filterList(
      files,
      extensionsConfig
    );
    filteredList.forEach((file) => {
      let finalName = this.structureNameInProgressFilesTask.structureName(
        baseUavDataModel,
        file
      );

      this.copyFilesToInProgressFolderTask.copy(
        sourceFolder,
        finalName,
        baseUavDataModel.destFolder,
        file
      );
    });
  }
}
