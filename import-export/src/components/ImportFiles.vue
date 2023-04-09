<template>
    <div>
        <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo"></PlatformInfo>
    </div>
    <v-row>
        <label for="date" class="label">DATE</label>
        <input id="date" class="data" type="date" v-model="date">

        <label for="time" class="timeLabel">TIME</label>
        <input id="time" class="data" type="time" v-model="time">
    </v-row>
    <div class="uploadBtn">
        <v-btn @click="exportFiles" rounded="sm" color="primary">
            Import
        </v-btn>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import PlatformInfo from './PlatformInfo.vue';
export default {
    name: `ImportFiles`,
    props: ['platforms', 'updatePlatformInfo', 'exportFiles'],
    emits: ['updatePlatformInfo', "exportFiles"],
    components: { PlatformInfo },

    setup(props, context) {

        const date = ref();
        const time = ref();

        function exportFiles() {
            context.emit("exportFiles", date.value, time.value);
        }

        function updatePlatformInfo(platform: string, tailNumber: number) {
            context.emit("updatePlatformInfo", platform, tailNumber);
        }

        return { PlatformInfo, date, time, exportFiles, updatePlatformInfo }

    }
}
</script>

<style scoped>
.label {
    margin-left: 20px;
    margin-right: 8px;
}

.uploadBtn {
    margin-top: 40px;
    margin-left: 300px;
}

.data {
    height: 40px;
    width: 320px;
    background-color: darkgray;
}


.timeLabel {
    margin-left: 20px;
    margin-right: 10px;
}
</style>