import { ResultModel } from "../../models/resultModel";
import { CreateBackupFoldersModel } from "../../models/createBackupFoldersModel";

export interface ICreateFoldersByPlatformInfoTask {
  export create(
    createBackupFoldersModel: CreateBackupFoldersModel
  ): ResultModel;
}
