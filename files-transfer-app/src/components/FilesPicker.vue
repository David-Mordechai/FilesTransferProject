<template>
    <div class="input-group mb-3">
        <input type="file" class="form-control shadow-none" id="fileInput" ref="fileInputRef" @change="selectFiles"
            multiple />
        <button @click="uploadFiles" :disabled="files.length === 0" class="btn btn-success shadow-none" type="button" id="button-addon2">
            Upload
        </button>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'files-picker',
    props: ['selectedFiles'],
    setup(_, context) {
        const files = ref([])
        const fileInputRef = ref(null)

        function selectFiles() {
            this.files = fileInputRef.value.files;
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

<style scoped></style>