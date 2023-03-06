import axios from "axios";

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