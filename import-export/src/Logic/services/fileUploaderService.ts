import { deepStrictEqual } from "assert";
import axios from "axios";
import fs from "fs";
import path from "path";
import { TransferFilesWorkflow } from "../Import/workflows/TransferFilesWorkflow";
import { InProgressFilesWorkflow } from "../Import/workflows/InProgressFilesWorkflow";
import { CreateFoldersByPlatformInfoTask } from "../Import/workflows/tasks/CreateFoldersByPlatformInfoTask";
import { CopyFilesToBackupFolderTask } from "../Import/workflows/tasks/CopyFilesToBackupFolderTask";
import { CopyFilesToInProgressFolderTask } from "../Import/workflows/tasks/CopyFilesToInProgressFolderTask";
import { StructureNameInProgressFilesTask } from "../Import/workflows/tasks/StructureNameInProgressFilesTask";
import { FilterFilesByExtensionTask } from "../Import/workflows/tasks/FilterFilesByExtensionTask";
import { GetFilesTask } from "../Import/workflows/tasks/GetFilesTask";

export const copyFileToLocalFolder = async (
  file: any,
  localRootFolder: string
) => {
  let localFilePath: string = `${localRootFolder}${file.name}`;
  try {
    if (!fs.existsSync(localRootFolder)) {
      fs.mkdirSync(localRootFolder, { recursive: true });
    }

    fs.copyFileSync(file.path, localFilePath);

    return { copyStatus: true, copyError: "", localFilePath };
  } catch (error) {
    console.log(error);
    return {
      copyStatus: false,
      copyError: `Failed copy file ${file.name} to local folder`,
      localFilePath: "",
    };
  }
};

export const deleteFileFromSourceFolder = async (file: any) => {
  try {
    if (!fs.existsSync(file.path)) {
      return { deleteStatus: true };
    }

    fs.unlinkSync(file.path);
    return { deleteStatus: true };
  } catch (error) {
    console.log(error);
    return {
      deleteStatus: false,
      deleteError: `Failed delete file ${file.name} from source folder`,
    };
  }
};

export function backupfolderHandler(
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string
) {
  let platformTaiNumber = `${platform}-${tailNumber}`;
  let timeSplit = time.split(":");
  let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;

  let finalFolder: string = `${destFolder}backup\\${platformTaiNumber}\\${date}\\${fixedTime}`;

  if (!fs.existsSync(finalFolder)) {
    fs.mkdirSync(finalFolder, { recursive: true });
  }

  return finalFolder;
}

export function inProgressfolderHandler(
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string,
  file: string
) {
  let platformTailNumber = `${platform}-${tailNumber}`;
  let timeSplit = time.split(":");
  let fixedTime = `${timeSplit[0]}-${timeSplit[1]}`;

  let finalFileName = `${platformTailNumber}-${date}-${fixedTime}-${file}`;

  return finalFileName;
}

export async function exportFilesFunction(
  sourceFolder: string,
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string,
  extensionsConfig: Array<string>
) {
  let transferFilesWorkflow = new TransferFilesWorkflow(
    new CreateFoldersByPlatformInfoTask(),
    new CopyFilesToBackupFolderTask(),
    new StructureNameInProgressFilesTask(),
    new GetFilesTask(),
    new FilterFilesByExtensionTask(),
    new CopyFilesToInProgressFolderTask()
  );

  if (sourceFolder.trim().length !== 0) {
    await transferFilesWorkflow.execute(
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
