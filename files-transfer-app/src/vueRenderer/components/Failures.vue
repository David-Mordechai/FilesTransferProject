<template>
    <div>
        <h1>FAILURES</h1>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th class="th-name">File Name</th>
                    <th>Size</th>
                    <th>Path</th>
                    <th>Retry</th>


                </tr>
            </thead>
            <tbody>
                <tr v-for="file in files" :key="file.name">
                    <td>{{ file.name }}</td>
                    <td>{{ formatSize(file.size) }}</td>
                    <td>{{ file.path }}</td>
                    <td :class="statusClass(file.uploaded)">{{ file.uploaded }}</td>

                </tr>
            </tbody>
        </table>

        <button class="btn btn-success" @click="retry">Retry</button>
    </div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { actionStatus } from '../services/enums'

export default {
    name: `Failures`,
    props: ['failuresFilesList'],
    emits: ["retryUpload"],
    setup(props, context) {
        const files = computed(() => {
            console.log(props.failuresFilesList);
            return props.failuresFilesList;
        });

        function formatSize(size) {
            if (size === 0)
                return "0 kB";
            var i = Math.floor(Math.log(size) / Math.log(1024));
            return ((size / Math.pow(1024, i)).toFixed(2) * 1 +
                " " +
                ["B", "kB", "MB", "GB", "TB"][i]);
        }

        function statusClass(status) {
            switch (status) {
                case actionStatus.SUCCESS:
                    return "success";
                case actionStatus.FAILURE:
                    return "failure";
                default:
                    return "regular";
            }
        }
        function retry() {
            context.emit("retryUpload");
        }
        return {
            files,
            formatSize,
            retry,
            statusClass
        }
    }
}
</script>

<style scoped>
table {
    color: #1c1c1cd9;
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
</style>