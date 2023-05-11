import { ResultModel } from "../../models/resultModel";

export interface ICopyFilesToBackupFolderTask {
  export copy(sourceFolder: string, destFolder: string): ResultModel;
}
