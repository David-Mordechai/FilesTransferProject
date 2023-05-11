import fs from "fs";
import { ICreateFoldersByPlatformInfoTask } from "./interfaces/ICreateFoldersByPlatformInfoTask";
import { ResultModel } from "../../models/resultModel";
import { BaseUavDataModel } from "../../models/baseUavDataModel";

export class CreateFoldersByPlatformInfoTask
  implements ICreateFoldersByPlatformInfoTask
{
  constructor() {}

  public create(createBackupFoldersInfo: BaseUavDataModel): ResultModel {
    let platformTaiNumber = `${createBackupFoldersInfo.platform}-${createBackupFoldersInfo.tailNumber}`;
    if (createBackupFoldersInfo.time === null) return;
    let timeSplit = createBackupFoldersInfo.time.split(":");
    let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;

    let finalFolder: string = `${createBackupFoldersInfo.destFolder}backup\\${platformTaiNumber}\\${createBackupFoldersInfo.date}\\${fixedTime}`;

    if (!fs.existsSync(finalFolder)) {
      fs.mkdirSync(finalFolder, { recursive: true });
    }

    const result = new ResultModel();
    result.success = true;
    result.value = finalFolder;
    return result;
    // return finalFolder;
  }
}
