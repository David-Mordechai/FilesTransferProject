import { deepStrictEqual } from "assert";
import axios from "axios";
import fs from "fs";
import path from "path";
import { ImportUavDataWorkflow } from "../UavData/workflows/ImportUavDataWorkflow";
import { CreateFoldersByPlatformInfoTask } from "../UavData/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../UavData/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../UavData/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../UavData/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../UavData/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../UavData/workflows/tasks/GetFilesTask";

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
