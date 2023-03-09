import axios from "axios";
import fs from 'fs'

const successResponse = { 'success': true }
const errorResponse = { 'success': false, 'error': 'Upload fail'}
const localFolderRootPath = 'C:\\Temp\\FilesTransferProject\\'

export const uploadFile = async (file) => {
    try {
        const response = await axios.post('https://localhost:7180/transferFile', {
            "fileType": `${file.name}`,
            "filePath": `${file.path}`
        })
        
        if(response.status === 200)
            return successResponse
        
        return errorResponse

    } catch (error) {
        console.log(error);
        return errorResponse
    }
}

export const copyFileToLocalFolder = (file) => {
    try {

        if (!fs.existsSync(localFolderRootPath)){
            fs.mkdirSync(localFolderRootPath);
        }
        
        let localFilePath = `${localFolderRootPath}${file.name}`
        fs.copyFileSync(file.path, localFilePath);
        
        return localFilePath;
        
    } catch (error) {
        console.log(error);
    }
}

export const deleteFileFromSourceFolder = (file) => {
    try {
        
        if (!fs.existsSync(file.path)){
            return;
        }

        fs.unlinkSync(file.path);

    } catch (error) {
        console.log(error);
    }
}