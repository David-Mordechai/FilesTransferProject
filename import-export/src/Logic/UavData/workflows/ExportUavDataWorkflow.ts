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
    const path = `${sourceFolder}backup\\${platform}-${tailNumber}\\${date}\\${time}`;
    console.log(path);

    this.copyFilesToUsbTask.copy(path, usbFolder);
  }
}
