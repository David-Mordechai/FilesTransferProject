import axios from "axios";
import fs from "fs";

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

export const copyFileToLocalFolder = (
  sourceFile,
  targetFile,
  localRootFolder
) => {
  //   let localFilePath = `${localRootFolder}${file.name}`;
  try {
    if (!fs.existsSync(localRootFolder)) {
      fs.mkdirSync(localRootFolder, { recursive: true });
    }
    console.log(sourceFile);
    console.log(targetFile);
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
