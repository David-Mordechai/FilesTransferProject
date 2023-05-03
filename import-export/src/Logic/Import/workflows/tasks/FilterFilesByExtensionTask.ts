import path from "path";
import { IFilterFilesByExtensionTask } from "./tasks/interfaces/IFilterFilesByExtensionTask";
export class FilterFilesByExtensionTask implements IFilterFilesByExtensionTask {
  constructor() {}

  public filterList(
    files: string[],
    extensionsConfig: Array<string>
  ): string[] {
    files.filter((file) => {
      return extensionsConfig.includes(path.extname(file));
    });

    return files;
  }
}
