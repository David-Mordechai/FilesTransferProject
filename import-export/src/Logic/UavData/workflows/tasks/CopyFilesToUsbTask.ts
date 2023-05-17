import { ICopyFilesToUsbTask } from "./interfaces/ICopyFilesToUsbTask";
import fs from "fs";
export class CopyFilesToUsbTask implements ICopyFilesToUsbTask {
  public constructor() {}
  public copy(filePath: string, destFolder: string) {
    try {
      fs.copyFile(filePath, destFolder, (error) => {
        if (error) console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
    // try {
    //   console.log(path);

    //   fs.cp(path, destFolder, { recursive: true }, (error) => {
    //     if (error) console.error(error);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
