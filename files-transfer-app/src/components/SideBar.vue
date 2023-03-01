<template>
    <button class="btnSideBar btn btn-primary" @click="selectFiles">Choose Files</button>
    <button class="btnSideBar btn btn-success" @click="uploadFiles" :disabled="files.length === 0">Upload</button>
</template>

<script>
import { ref } from 'vue'
const electron = require('electron')
const ipc = electron.ipcRenderer
export default {
    name: 'side-bar',
    props: ['selectedFiles'],
    emits: ['updateSelectedFileList', 'uploadFiles'],
    setup(_, context) {
        const files = ref([])
        const fileInputRef = ref(null)

        function selectFiles() {
            this.files = ipc.sendSync('choose-files')
            context.emit('updateSelectedFileList', this.files)
        }

        function uploadFiles() {
            context.emit('uploadFiles')
        }

        return {
            files,
            fileInputRef,
            selectFiles,
            uploadFiles
        };
    },
}
</script>

<style scoped>
.btnSideBar {
    height: 140px;
    width: 140px;
    margin: 0 5px;
    margin-top: 5px;
}
</style>