import getFilesRecursive from "../../../common/filesSystemHelper";
import { IGetFilesTask } from "./interfaces/IGetFilesTask";

export class GetFilesTask implements IGetFilesTask {
  constructor() {}

  public async get(sourceFolder: string): Promise<string[]> {
    return await getFilesRecursive(sourceFolder);
  }
}
