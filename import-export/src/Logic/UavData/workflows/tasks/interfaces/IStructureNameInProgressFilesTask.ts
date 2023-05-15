import { BaseUavDataModel } from "../../../models/baseUavDataModel";

export interface IStructureNameInProgressFilesTask {
  structureName(uavData: BaseUavDataModel, file: string): string;
}
