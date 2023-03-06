<template>
    <table class="table table-sm">
        <thead>
            <tr>
                <th class="th-remove"> </th>
                <th class="th-name">File Name</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Deleted</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="file in filesList" :key="file.path">
                <td @click="remove(file.path)" class="removeBtn" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                </td>
                <td>{{ file.name }}</td>
                <td>{{ formatSize(file.size) }}</td>
                <td :class="file.uploaded === 'No' ? 'failure' : file.uploaded === 'Yes' ? 'success' : 'regular'">{{ file.uploaded }}</td>
                <td :class="file.deleted === 'No' ? 'failure' : file.deleted === 'Yes' ? 'success' : 'regular'">{{ file.deleted }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { computed } from 'vue'
export default {
    name: 'files-list-table',
    props: ['selectedFiles'],
    emits: ['removeFile'],
    setup(props, context) {
        const filesList = computed(() => {return props.selectedFiles});

        function formatSize(size) {
            var i = Math.floor(Math.log(size) / Math.log(1024));
            return (
                (size / Math.pow(1024, i)).toFixed(2) * 1 +
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]
            );
        }

        function remove(path) {
            context.emit('removeFile', path)
        }

        return {
            filesList,
            formatSize,
            remove,
        };
    },
}
</script>

<style scoped>
table {
    color: #1c1c1cd9;
    font-size: large;
}

th{
    width: 100px;
}
.th-name{
    width: auto;
}

.regular{
    color: inherit;
}

.th-remove{
    width: 40px;
}
.removeBtn{
    cursor:pointer;    
}
.removeBtn>svg{
    width: 20px;
    height: 20px;
    fill: red;
}

.success {
    color: green;
    transition: color 1s;
}

.failure {
    color: red;
    transition: color 1s;
}
</style>