import axios from "axios";
import fs from 'fs'

const successResponse = { 'success': true }
const errorResponse = { 'success': false, 'error': 'Upload fail'}

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

export const copyFileToLocalFolder = (file, localRootFolder) => {
    let localFilePath = `${localRootFolder}${file.name}`
    try {

        if (!fs.existsSync(localRootFolder)){
            fs.mkdirSync(localRootFolder);
        }
        
        fs.copyFileSync(file.path, localFilePath);
        
        return {copyStatus: true, copyError: '', localFilePath};
        
    } catch (error) {
        console.log(error);
        return {copyStatus: false, copyError: `Failed copy file ${file.name} to local folder`};
    }
}

export const deleteFileFromSourceFolder = (file) => {
    try {
        
        if (!fs.existsSync(file.path)){
            return {deleteStatus: true };
        }

        fs.unlinkSync(file.path);
        return {deleteStatus: true };

    } catch (error) {
        console.log(error);
        return { deleteStatus: false, deleteError: `Failed delete file ${file.name} from source folder`}
    }
}