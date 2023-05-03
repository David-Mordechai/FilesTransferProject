import { deepStrictEqual } from "assert";
import axios from "axios";
import fs from "fs";
import path from "path";
import { ImportDataFromUavWorkflow } from "../Import/workflows/ImportDataFromUavWorkflow";
import { CreateFoldersByPlatformInfoTask } from "../Import/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../Import/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../Import/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../Import/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../Import/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../Import/workflows/tasks/GetFilesTask";

// export const copyFileToLocalFolder = async (
//   file: any,
//   localRootFolder: string
// ) => {
//   let localFilePath: string = `${localRootFolder}${file.name}`;
//   try {
//     if (!fs.existsSync(localRootFolder)) {
//       fs.mkdirSync(localRootFolder, { recursive: true });
//     }

//     fs.copyFileSync(file.path, localFilePath);

//     return { copyStatus: true, copyError: "", localFilePath };
//   } catch (error) {
//     console.log(error);
//     return {
//       copyStatus: false,
//       copyError: `Failed copy file ${file.name} to local folder`,
//       localFilePath: "",
//     };
//   }
// };

export async function exportFilesFunction(
  sourceFolder: string,
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string,
  extensionsConfig: Array<string>
) {
  let importDataFromUavWorkflow = new ImportDataFromUavWorkflow(
    new CreateFoldersByPlatformInfoTask(),
    new CopyFilesToBackupFolderTask(),
    new StructureNameInProgressFilesTask(),
    new GetFilesTask(),
    new FilterFilesByExtensionTask(),
    new CopyFilesToInProgressFolderTask()
  );

  if (sourceFolder.trim().length !== 0) {
    await importDataFromUavWorkflow.execute(
      sourceFolder,
      destFolder,
      date,
      time,
      platform,
      tailNumber,
      extensionsConfig
    );
  }
}
