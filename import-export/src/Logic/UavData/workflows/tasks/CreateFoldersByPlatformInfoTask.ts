import fs from "fs";
import { ICreateFoldersByPlatformInfoTask } from "./interfaces/ICreateFoldersByPlatformInfoTask";

export class CreateFoldersByPlatformInfoTask
  implements ICreateFoldersByPlatformInfoTask
{
  constructor() {}

  public create(
    destFolder: string,
    date: string,
    time: string,
    platform: string,
    tailNumber: string
  ): string {
    let platformTaiNumber = `${platform}-${tailNumber}`;
    let timeSplit = time.split(":");
    let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;

    let finalFolder: string = `${destFolder}backup\\${platformTaiNumber}\\${date}\\${fixedTime}`;

    if (!fs.existsSync(finalFolder)) {
      fs.mkdirSync(finalFolder, { recursive: true });
    }

    return finalFolder;
  }
}
