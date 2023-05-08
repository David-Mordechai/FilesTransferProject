import { ICopyFilesToUsbTask } from "./tasks/interfaces/ICopyFilesToUsbTask";

export class ExportUavDataWorkFlow {
  public constructor(private copyFilesToUsbTask: ICopyFilesToUsbTask) {}

  public execute(
    platform: string,
    tailNumber: string,
    date: string,
    time: string
  ) {
    copyFilesToUsbTask.copy();
  }
}
