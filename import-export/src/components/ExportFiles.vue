<template>
    <div>
        <v-btn> <router-link :to="{ name: 'ActionSelector' }">
                Back</router-link>
        </v-btn>
    </div>
    <div>
        <PlatformInfo :platforms="platforms" @getDatesByPlatformInfo="getDatesByPlatformInfo"></PlatformInfo>
    </div>
    <v-row>
        <v-col>
            <v-select v-model="date" :items="datesList" item-title="value" item-value="key" clearable density="compact"
                label="Choose Date" persistent-hint single-line></v-select>
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
    props: ['platforms', 'getDatesByPlatformInfo', 'updatePlatformInfo', 'dates', 'time', 'datesList', 'timesList', 'getTimesByDates'],
    emits: ['getDatesByPlatformInfo', 'updatePlatformInfo', 'exportFiles', 'getTimesByDates', 'importFiles'],
    components: { PlatformInfo },
    setup(props, context) {
        const datesList = computed(() => {
            return props.datesList
        });

        const timesList = computed(() => {
            return props.timesList
        });


        const date = ref()
        const time = ref()

        watch(date, (newValue) => {
            if (newValue) {
                console.log("New value");
                context.emit("getTimesByDates", selectedPlatform.value, selectedTailNumber.value, date);
                console.log();
            }
        })

        function exportFiles(date: string, time: string) {
            context.emit('exportFiles', date, time);
        }

        function getDatesByPlatformInfo(platform: string, tailNumber: number) {
            context.emit("getDatesByPlatformInfo", platform, tailNumber);
        }

        function getTimesByDates(platform: string, tailNumber: number, date: string) {
            context.emit("getTimesByDates", platform, tailNumber, date);
        }

        return { PlatformInfo, date, datesList, timesList, time, getDatesByPlatformInfo, exportFiles, getTimesByDates }

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