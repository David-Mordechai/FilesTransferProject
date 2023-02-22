<template>
    <table class="table">
        <thead>
            <tr>
                <th>File Name</th>
                <th>Size</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(file, index) in filesList" :key="index">
                <td>{{ file.name }}</td>
                <td>{{ formatSize(file.size) }}</td>
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

<style scoped></style>