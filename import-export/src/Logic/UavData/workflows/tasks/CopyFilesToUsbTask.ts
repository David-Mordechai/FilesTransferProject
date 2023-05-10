import { ICopyFilesToUsbTask } from "./tasks/interfaces/ICopyFilesToUsbTask";
import fs from "fs";
export class CopyFilesToUsbTask implements ICopyFilesToUsbTask {
  public constructor() {}
  public copy(path: string, usbPath: string) {
    try {
      console.log(path);

      fs.cp(path, usbPath, { recursive: true }, (error) => {
        if (error) console.error(error);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
