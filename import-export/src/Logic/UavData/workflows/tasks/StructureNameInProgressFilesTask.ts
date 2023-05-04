import IStructureNameInProgressFilesTask from "./tasks/interfaces/IStructureNameInProgressFilesTask";
import Path from "path";

export class StructureNameInProgressFilesTask
  implements IStructureNameInProgressFilesTask
{
  constructor() {}

  public structureName(
    destFolder: string,
    date: string,
    time: string,
    platform: string,
    tailNumber: string,
    file: string
  ): string {
    let platformTailNumber = `${platform}-${tailNumber}`;
    let timeSplit = time.split(":");
    let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;
    let fileName = Path.basename(file);
    let finalFileName = `${platformTailNumber}-${date}-${fixedTime}-${fileName}`;

    return finalFileName;
  }
}
