import fs from "fs";
import { ICopyFilesToInProgressFolderTask } from "./interfaces/ICopyFilesToInProgressFolderTask";
export class CopyFilesToInProgressFolderTask
  implements ICopyFilesToInProgressFolderTask
{
  constructor() {}

  public async copy(
    sourceFolder: string,
    finalFileName: string,
    destFolder: string,
    file: string
  ): void {
    const inProgressFolder = `${destFolder}inProgress`;

    if (!fs.existsSync(inProgressFolder)) {
      fs.mkdirSync(inProgressFolder, { recursive: true });
    }
    const source = `${file}`;
    const dest = `${inProgressFolder}\\${finalFileName}`;

    fs.copyFile(source, dest, (error) => {
      if (error) console.error(error);
    });
  }
}
