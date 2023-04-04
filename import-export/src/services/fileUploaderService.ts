import axios from "axios";
import fs from "fs";
import { tail } from "lodash";
import { platform } from "os";

export const uploadFile = async (fileName: string, localFilePath: string) => {
  try {
    const response = await axios.post("https://localhost:7180/transferFile", {
      fileType: `${fileName}`,
      filePath: `${localFilePath}`,
    });

    if (response.status === 200) return { uploadStatus: true, uploadError: "" };

    return { uploadStatus: false, uploadError: `Upload ${fileName} Failed` };
  } catch (error) {
    console.log(error);
    return { uploadStatus: false, uploadError: `Upload ${fileName} Failed` };
  }
};

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

// export const ExportTask(){
//     //foldersHandler(platfomr,tailNumber,date,time,fileName);
//     // copyFileToBackupTask()
//     // if(extension equals to config.extensions){
//     //     copyFileToInProgressFolder()
//     // }
// }

export function folderHandler(
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

export function exportFilesFunction(
  sourceFolder: string,
  destFolder: string,
  date: string,
  time: string,
  platform: string,
  tailNumber: string
) {
  let finalFolder: string = folderHandler(
    destFolder,
    date,
    time,
    platform,
    tailNumber
  );

  copyFileToBackupTask(sourceFolder, finalFolder);
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
