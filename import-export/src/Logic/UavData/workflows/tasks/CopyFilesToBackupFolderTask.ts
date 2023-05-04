import { ICopyFilesToBackupFolderTask } from "./interfaces/ICopyFilesToBackupFolderTask";
import fs from "fs";
import path from "path";

export class CopyFilesToBackupFolderTask
  implements ICopyFilesToBackupFolderTask
{
  constructor() {}

  public copy(sourceFolder: string, destFolder: string): void {
    console.log(sourceFolder, destFolder);
    try {
      fs.cp(sourceFolder, destFolder, { recursive: true }, (error) => {
        if (error) console.error(error);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
