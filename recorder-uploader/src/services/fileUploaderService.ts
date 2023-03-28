import axios from "axios";
import fs from 'fs'

export const uploadFile = async (fileName: string, localFilePath: string) => {
    try {
        const response = await axios.post('https://localhost:7180/transferFile', {
            "fileType": `${fileName}`,
            "filePath": `${localFilePath}`
        })

        if (response.status === 200)
            return { uploadStatus: true, uploadError: '' }

        return { uploadStatus: false, uploadError: `Upload ${fileName} Failed` }

    } catch (error) {
        console.log(error);
        return { uploadStatus: false, uploadError: `Upload ${fileName} Failed` }
    }
}

export const copyFileToLocalFolder = async (file: any, localRootFolder: string) => {
    let localFilePath: string = `${localRootFolder}${file.name}`
    try {

        if (!fs.existsSync(localRootFolder)) {
            fs.mkdirSync(localRootFolder, { recursive: true });
        }

        fs.copyFileSync(file.path, localFilePath);

        return { copyStatus: true, copyError: '', localFilePath };

    } catch (error) {
        console.log(error);
        return { copyStatus: false, copyError: `Failed copy file ${file.name} to local folder`, localFilePath: ''};
    }
}

export const deleteFileFromSourceFolder = async (file: any) => {
    try {

        if (!fs.existsSync(file.path)) {
            return { deleteStatus: true };
        }

        fs.unlinkSync(file.path);
        return { deleteStatus: true };

    } catch (error) {
        console.log(error);
        return { deleteStatus: false, deleteError: `Failed delete file ${file.name} from source folder` }
    }
}