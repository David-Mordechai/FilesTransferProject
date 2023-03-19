<template>
    <table class="table table-sm">
        <thead>
            <tr>
                <th class="th-remove" v-if="showDeleteFileColumn"> </th>
                <th class="th-name">File Name</th>
                <th>Size</th>
                <th>Copied</th>
                <th>Deleted</th>
                <th>Uploaded</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="file in files" :key="file.path">
                <td @click="remove(file.path)" class="removeBtn" v-if="showDeleteFileColumn">
                    <DeleteIcon />
                </td>
                <td>{{ file.name }}</td>
                <td>{{ formatSize(file.size) }}</td>
                <td :class="statusClass(file.copied)">{{ file.copied }}</td>
                <td :class="statusClass(file.deleted)">{{ file.deleted }}</td>
                <td :class="statusClass(file.uploaded)">{{ file.uploaded }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { computed } from 'vue'
import { uploadState, actionStatus } from '../services/enums'
import DeleteIcon from './Icons/DeleteIcon.vue';

export default {
    name: "files-list-table",
    components: { DeleteIcon },
    props: ["selectedFiles", "uploadStat"],
    emits: ["removeFile"],
    setup(props, context) {
        const files = computed(() => {
            return props.selectedFiles;
        });
        const showDeleteFileColumn = computed(() => {
            return props.uploadStat === uploadState.NONE ||
                props.uploadStat === uploadState.READY ||
                props.uploadStat === uploadState.CHOOSE_FILES;
        });
        function formatSize(size: number) {
            if (size === 0)
                return "0 kB";
            var i = Math.floor(Math.log(size) / Math.log(1024));
            return ((size / Math.pow(1024, i)).toFixed(2) +
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]);
        }
        function statusClass(status: string) {
            switch (status) {
                case actionStatus.SUCCESS:
                    return "success";
                case actionStatus.FAILURE:
                    return "failure";
                default:
                    return "regular";
            }
        }
        function remove(path: string) {
            context.emit("removeFile", path);
        }
        return {
            files,
            showDeleteFileColumn,
            formatSize,
            remove,
            statusClass,
        };
    },
}
</script>

<style scoped>
table {
    font-size: large;
}

th {
    width: 100px;
}

.th-name {
    width: auto;
}

.regular {
    color: inherit;
}

.th-remove {
    width: 40px;
}

.removeBtn {
    cursor: pointer;
}

.removeBtn>svg {
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
}</style>