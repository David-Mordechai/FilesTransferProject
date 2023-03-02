<template>
    <table class="table table-sm">
        <thead>
            <tr>
                <th class="th-name">File Name</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Deleted</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(file, index) in filesList" :key="index">
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
    props: ['files'],
    setup(props) {
        const filesList = computed(() => {
            return props.files
        })

        function formatSize(size) {
            var i = Math.floor(Math.log(size) / Math.log(1024));
            return (
                (size / Math.pow(1024, i)).toFixed(2) * 1 +
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]
            );
        }

        return {
            filesList,
            formatSize,
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

.success {
    color: green;
    transition: color 1s;
}

.failure {
    color: red;
    transition: color 1s;
}
</style>