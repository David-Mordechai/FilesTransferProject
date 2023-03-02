<template>
    <table class="table">
        <thead>
            <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Uploaded</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(file, index) in filesList" :key="index">
                <td>{{ file.name }}</td>
                <td>{{ formatSize(file.size) }}</td>
                <td>{{ file.uploaded }}</td>
            </tr>
        </tbody>
    </table>
    <div class="file-card" v-for="(file, index) in filesList" :key="index">
        <section class="file-name">{{ file.name }} ({{ formatSize(file.size) }})</section>
        <section class="file-size">{{ formatSize(file.size) }}</section>
        <section class="file-uploaded">{{ file.uploaded }}</section>
        <section class="file-deleted">{{ file.deleted }}</section>
    </div>
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
.file-card{
    display: grid;
    margin: 10px 0;
    width: 100%;
    grid-template-areas:
    "name size"
    "uploaded deleted";
    /* background-color: antiquewhite; */
}
.file-name{
    grid-area: name;
}
.file-size{
    grid-area: size;
}
.file-uploaded{
    grid-area: uploaded;
}
.file-deleted{
    grid-area: deleted;
}
</style>