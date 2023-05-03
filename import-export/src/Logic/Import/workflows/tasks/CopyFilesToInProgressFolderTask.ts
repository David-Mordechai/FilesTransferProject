import fs from "fs";
import path from "path";
export class CopyFilesToInProgressFolderTask {
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

    console.log(source);
    console.log(dest);

    fs.copyFile(source, dest, (error) => {
      if (error) console.error(error);
    });
  }
}
