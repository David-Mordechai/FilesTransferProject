import IStructureNameInProgressFilesTask from "./tasks/interfaces/IStructureNameInProgressFilesTask";
import Path from "path";
import { BaseUavDataModel } from "../../models/baseUavDataModel";
export class StructureNameInProgressFilesTask
  implements IStructureNameInProgressFilesTask
{
  constructor() {}

  public structureName(uavData: BaseUavDataModel, file: string): string {
    let platformTailNumber = `${uavData.platform}-${uavData.tailNumber}`;
    let timeSplit = uavData.time.split(":");
    let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;
    let fileName = Path.basename(file);
    let finalFileName = `${platformTailNumber}-${uavData.date}-${fixedTime}-${fileName}`;

    return finalFileName;
  }
}
