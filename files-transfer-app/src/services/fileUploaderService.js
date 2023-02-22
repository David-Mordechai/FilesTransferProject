import axios from "axios";

export const uploadFile = async (file) => {
    try {
        const data = {
            "fileType": `${file.name}`,
            "filePath": `${file.path}`
        }
        const response = await axios.post('https://localhost:7180/transferFile', data)
        console.log(response.data);
    } catch (error) {
        console.error('Fail to upload file', error);
    }
}