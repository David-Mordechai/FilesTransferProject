<template>
    <div>
        <v-btn> <router-link :to="{ name: 'ActionSelector' }">
                Back</router-link>
        </v-btn>
    </div>
    <div>
        <PlatformInfo :platforms="platforms" @updateExportPlatformInfo="updateExportPlatformInfo"></PlatformInfo>
    </div>
    <v-row>
        <v-col>
            <v-select v-model="date" :items="datesList" item-title="value" @getTimes="getTimes" item-value="key" clearable
                density="compact" label="Choose Date" persistent-hint single-line></v-select>
        </v-col>
        <v-col>
            <v-select v-model="time" :items="timesList" item-title="value" item-value="key" clearable density="compact"
                label="Choose Time" persistent-hint single-line></v-select>
        </v-col>
    </v-row>
    <div class="uploadBtn">
        <v-btn rounded="sm" color="primary" @click="exportFiles">
            Export
        </v-btn>
    </div>
</templatE>

<script lang="ts">
import { ref, computed, } from 'vue'
import PlatformInfo from './PlatformInfo.vue';
import { watch } from 'vue';
import { platform } from 'os';
export default {
    name: `ExportFiles`,
    props: ['platforms', 'updateExportPlatformInfo', 'updatePlatformInfo', 'dates', 'time', 'datesList', 'timesList', 'getTimes'],
    emits: ['updateExportPlatformInfo', 'updatePlatformInfo', 'exportFiles', 'getTimes'],
    components: { PlatformInfo },
    setup(props, context) {
        const datesList = computed(() => {
            return props.datesList
        });

        const timesList = computed(() => {
            return props.timesList
        });

        watch(
            [datesList],
            ([newDate]) => {
                if (newDate) {
                    context.emit("getTimes");
                }
            }
        );

        const date = ref()
        const time = ref()

        function exportFiles(date: string, time: string) {
            context.emit('exportFiles', date, time);
        }

        function updateExportPlatformInfo(platform: string, tailNumber: number) {
            context.emit("updateExportPlatformInfo", platform, tailNumber);
        }

        function getTimes(platform: string, tailNumber: number, date: string) {
            context.emit("getTimes", platform, tailNumber, date);
        }

        function goHome() {
            //      this.$router.push("/");
        }

        return { PlatformInfo, date, datesList, timesList, time, updateExportPlatformInfo, exportFiles, getTimes, goHome }

    }
}
</script>

<style scoped>
.label {
    margin-left: 10px;
    margin-right: 8px;
}

.uploadBtn {
    margin-top: 40px;
    margin-left: 300px;
}

.date {
    height: 30px;
    width: 200px;
    background-color: darkgray;
}


.time {
    height: 30px;
    width: 100px;
    background-color: darkgray;
}
</style>