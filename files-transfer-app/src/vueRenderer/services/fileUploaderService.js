import axios from "axios";
import fs from "fs";
import { actionStatus, uploadState } from "./enums";

export const uploadFile = async (fileName, localFilePath) => {
  try {
    const response = await axios.post("https://localhost:7180/transferFile", {
      fileType: `${fileName}`,
      filePath: `${localFilePath}`,
    });

    if (response.status === 200) return { uploadStatus: true, uploadError: "" };

    return {
      uploadRetryStatus: false,
      uploadError: `Upload ${fileName} Failed`,
    };
  } catch (error) {
    console.log(error);
    return {
      uploadRetryStatus: false,
      uploadError: `Upload ${fileName} Failed`,
    };
  }
};

export const copyFileToLocalFolder = (sourceFile, targetFile, destFolder) => {
  //   let localFilePath = `${localRootFolder}${file.name}`;
  try {
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    console.log(sourceFile);
    console.log(targetFile);
    console.log(destFolder);

    fs.copyFileSync(sourceFile, targetFile);

    return { copyStatus: true, copyError: "", targetFile };
  } catch (error) {
    console.log(error);
    return {
      copyStatus: false,
      copyError: `Failed copy file ${sourceFile} to local folder`,
    };
  }
};

export const deleteFileFromSourceFolder = (file) => {
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

export const deleteUploadFileFromSourceFolder = (file) => {
  try {
    if (!fs.existsSync(file)) {
      return { deleteStatus: true };
    }

    fs.unlinkSync(file);
    return { deleteStatus: true };
  } catch (error) {
    console.log(error);
    return {
      deleteStatus: false,
      deleteError: `Failed delete file ${file.name} from source folder`,
    };
  }
};

export async function uploadTask(
  files,
  statusSummary,
  index,
  fileName,
  filePath
) {
  statusSummary.value = `Uploading file: ${files.value[index].name}`;
  let { uploadRetryStatus, uploadError } = await uploadFile(fileName, filePath);
  if (uploadRetryStatus === false) {
    statusSummary.value = uploadError;
    files.value[index].uploaded = actionStatus.FAILURE;
  } else {
    files.value[index].uploaded = actionStatus.SUCCESS;
    deleteUploadFileFromSourceFolder(filePath);
  }
}

export const deleteTask = (
  files,
  statusSummary,
  progressPercent,
  progressStep,
  index
) => {
  statusSummary.value = `Deleting file: ${files.value[index].name} from source folder`;
  let { deleteStatus, deleteError } = deleteFileFromSourceFolder(
    files.value[index]
  );
  if (deleteStatus === false) {
    statusSummary.value = deleteError;
    statusSummary.deleted = actionStatus.FAILURE;
    files.value[index].deleted = actionStatus.FAILURE;
  } else {
    statusSummary.value = deleteStatus.SUCCESS;
    files.value[index].deleted = actionStatus.SUCCESS;
    progressPercent.value += progressStep;
  }
};

export const copyFileTask = (
  files,
  targetFile,
  destFolder,
  localFilesToUpload,
  fullName,
  statusSummary,
  progressStep,
  progressPercent,
  index
) => {
  statusSummary.value = `Copying file: ${files.value[index].name} to local folder`;
  let { copyStatus, copyError } = copyFileToLocalFolder(
    files.value[index].path,
    targetFile,
    destFolder
  );
  if (copyStatus === false) {
    statusSummary.value = copyError;
    files.value[index].copied = actionStatus.FAILURE;
    // continue;
  } else {
    localFilesToUpload.push({
      fileName: fullName,
      localFilePath: targetFile,
      index: index,
    });
    console.log(localFilesToUpload);
    files.value[index].copied = actionStatus.SUCCESS;
    progressPercent.value += progressStep;
  }
};

export const fileHandler = (files, index, platform, tailNumber, folder) => {
  const seperateFileName = files.value[index].name.split(".");
  let originName = seperateFileName[0];
  const extension = seperateFileName[1];
  originName = `${originName}-${platform}-${tailNumber}`;
  const fullName = `${originName}.${extension}`;
  const targetFile = `${folder}${originName}.${extension}`;

  return { fullName, targetFile };
};

export async function uploadFilesFunction(
  uploadStatus,
  progressPercent,
  statusSummary,
  files,
  platform,
  tailNumber,
  folder
) {
  uploadStatus.value = uploadState.IN_PROGRESS;
  progressPercent.value = 1;
  statusSummary.value = "";
  let progressStep = Math.round(100 / (files.value.length * 3));
  let localFilesToUpload = [];

  for (let i = 0; i < files.value.length; i++) {
    let { fullName, targetFile } = fileHandler(
      files,
      i,
      platform.value,
      tailNumber.value,
      folder
    );

    copyFileTask(
      files,
      targetFile,
      folder,
      localFilesToUpload,
      fullName,
      statusSummary,
      progressStep,
      progressPercent,
      i
    );

    deleteTask(files, statusSummary, progressPercent, progressStep, i);
  }

  for (let { fileName, localFilePath, index } of localFilesToUpload) {
    await uploadTask(files, statusSummary, index, fileName, localFilePath);
  }

  progressPercent.value = Math.ceil(progressPercent.value);
  statusSummary.value = "Process complete";
  uploadStatus.value = uploadState.COMPLETED;

  return { uploadStatus, progressPercent, statusSummary };
}

export async function retryUploadFunction(
  uploadStatus,
  progressPercent,
  statusSummary,
  files
) {
  uploadStatus.value = uploadState.IN_PROGRESS;
  progressPercent.value = 1;
  statusSummary.value = "";
  let progressStep = Math.round(100 / files.value.length);

  for (let i = 0; i < files.value.length; i++) {
    uploadTask(
      files,
      statusSummary,
      i,
      files.value[i].name,
      files.value[i].path
    );
    progressPercent.value += progressStep;
  }

  progressPercent.value = Math.ceil(progressPercent.value);
  statusSummary.value = "Process complete";
  uploadStatus.value = uploadState.COMPLETED;
}
