import { ICopyFilesToBackupFolderTask } from "./tasks/interfaces/ICopyFilesToBackupFolderTask";
import { ICreateFoldersByPlatformInfoTask } from "./tasks/interfaces/ICreateFoldersByPlatformInfoTask";
import { IStructureNameInProgressFilesTask } from "./tasks/interfaces/IStructureNameInProgressFilesTask";
import { IGetFilesTask } from "./tasks/interfaces/IGetFilesTask";
import { IFilterFilesByExtensionTask } from "./tasks/interfaces/IFilterFilesByExtensionTask";
import { ICopyFilesToInProgressFolderTask } from "./tasks/interfaces/ICopyFilesToInProgressFolderTask";

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
    destFolder: string,
    date: string,
    time: string,
    platform: string,
    tailNumber: string,
    extensionsConfig: Array<string>
  ) {
    let backupFolder = this.createFoldersByPlatformInfoTask.create(
      destFolder,
      date,
      time,
      platform,
      tailNumber
    );
    this.copyFilesToBackupFolderTask.copy(sourceFolder, backupFolder);

    let files: string[] = await this.getFilesTask.get(sourceFolder);

    let filteredList = this.filterFilesByExtensionTask.filterList(
      files,
      extensionsConfig
    );

    filteredList.forEach((file) => {
      let finalName = this.structureNameInProgressFilesTask.structureName(
        destFolder,
        date,
        time,
        platform,
        tailNumber,
        file
      );

      this.copyFilesToInProgressFolderTask.copy(
        sourceFolder,
        finalName,
        destFolder,
        file
      );
    });
  }
}
