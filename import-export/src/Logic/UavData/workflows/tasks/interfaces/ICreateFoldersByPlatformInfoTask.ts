import { BaseUavDataModel } from "../../../models/baseUavDataModel";
import { ResultModel } from "../../../models/resultModel";

export interface ICreateFoldersByPlatformInfoTask {
  create(createBackupFoldersModel: BaseUavDataModel): ResultModel;
}
