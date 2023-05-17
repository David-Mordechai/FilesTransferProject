import { ICopyFilesToUsbTask } from "./tasks/interfaces/ICopyFilesToUsbTask";

export class ExportUavDataWorkFlow {
  public constructor(private copyFilesToUsbTask: ICopyFilesToUsbTask) {}

  public execute(
    sourceFolder: string,
    platform: string,
    tailNumber: string,
    date: string,
    time: string,
    usbFolder: string
  ) {
    let fileCounter = 0;
    const path = `${sourceFolder}backup\\${platform}-${tailNumber}\\${date}\\${time}`;
    console.log(path);
    fileCounter = fileCounter + 1;
    const files = this.copyFilesToUsbTask.copy(path, usbFolder);
  }
}
