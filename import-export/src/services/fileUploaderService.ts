import { deepStrictEqual } from "assert";
import axios from "axios";
import fs from "fs";

import path from "path";

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

export function exportFilesFunction(
  sourceFolder: string,
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string,
  extensionsConfig: Array<string>
) {
  if (sourceFolder.trim().length !== 0) {
    let finalFolder: string = backupfolderHandler(
      destFolder,
      date,
      time,
      platform,
      tailNumber
    );

    copyFileToBackupTask(sourceFolder, finalFolder);
    copyFileToInProgressTask(
      sourceFolder,
      destFolder,
      extensionsConfig,
      date,
      time,
      platform,
      tailNumber
    );
  }
}

export function copyFileToBackupTask(sourceFolder: string, destFolder: string) {
  console.log(sourceFolder, destFolder);
  try {
    fs.cp(sourceFolder, destFolder, { recursive: true }, (error) => {
      if (error) console.error(error);
    });
  } catch (error) {
    console.log(error);
  }
}

export function copyFileToInProgressTask(
  sourceFolder: string,
  destFolder: string,
  extensionsConfig: Array<string>,
  date: string,
  time: string,
  platform: string,
  tailNumber: string
) {
  const inProgressFolder = `${destFolder}inProgress\\`;

  if (!fs.existsSync(inProgressFolder)) {
    fs.mkdirSync(inProgressFolder, { recursive: true });
  }
  const files = fs
    .readdirSync(sourceFolder)
    .filter((file) => {
      if (path.extname(file) === "")
        copyFileToInProgressTask(
          `${sourceFolder}\\${file}`,
          destFolder,
          extensionsConfig,
          date,
          time,
          platform,
          tailNumber
        );
      else return extensionsConfig.includes(path.extname(file));
    })
    .map((file) => {
      let finalFileName = inProgressfolderHandler(
        inProgressFolder,
        date,
        time,
        platform,
        tailNumber,
        file
      );
      const source = `${sourceFolder}\\${file}`;
      const dest = `${inProgressFolder}\\${finalFileName}`;
      fs.copyFile(source, dest, (error) => {
        if (error) console.error(error);
      });
    });
}
