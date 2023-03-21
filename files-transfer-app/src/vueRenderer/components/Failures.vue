<template>
    <div>
        <h1>FAILURES</h1>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th class="th-name">File Name</th>
                    <th>Size</th>
                    <th>Copied</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="file in files" :key="file.path">
                    <td>{{ file.name }}</td>
                    <td>{{ formatSize(file.size) }}</td>
                    <td :class="statusClass(file.copied)">{{ file.copied }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { computed } from '@vue/reactivity';
const electron = require("electron");

const ipc = electron.ipcRenderer;
export default {
    name: `Failures`,
    props: ["failuresFiles"],
    setup(props) {
        const files = computed(() => {
            return props.failuresFiles
        })

        ipc.on('filesCounter', (_, args) => {
            console.log(args);
            // props.failuresFiles = args
        })

        return {
            files
        }
    }
}
</script>

<style scoped></style>