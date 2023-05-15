<template>
    <div id="info">
        <div>
            <PlatformInfo :platforms="platforms" @getDatesByPlatformInfo="getDatesByPlatformInfo"></PlatformInfo>
        </div>
        <v-row>
            <v-select class="date" v-model="date" :items="datesList" item-title="value" item-value="key" clearable
                density="compact" @update:modelValue="getTimesByDates" label="Choose Date" persistent-hint
                single-line></v-select>
            <v-select class="time" v-model="time" :items="timesList" item-title="value" item-value="key" clearable
                density="compact" label="Choose Time" persistent-hint single-line></v-select>
        </v-row>
        <div class="exportBtn">
            <v-btn rounded="sm" color="primary" @click="exportFiles">
                Export
            </v-btn>
        </div>
    </div>
</templatE>

<script lang="ts">
import { ref, computed, } from 'vue'
import PlatformInfo from './PlatformInfo.vue';
import { watch } from 'vue';
import { platform } from 'os';
export default {
    name: `ExportFiles`,
    props: ['platforms', 'getDatesByPlatformInfo', 'updatePlatformInfo', 'dates', 'datesList', 'timesList', 'getTimesByDates'],
    emits: ['getDatesByPlatformInfo', 'updatePlatformInfo', 'exportFiles', 'getTimesByDates', 'importFiles', 'getTotal'],
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


        function exportFiles() {
            context.emit('getTotal');
            context.emit('exportFiles', date.value, time.value);
        }

        function getDatesByPlatformInfo(platform: string, tailNumber: number) {
            context.emit("getDatesByPlatformInfo", platform, tailNumber);
        }

        function getTimesByDates(date: string) {
            context.emit("getTimesByDates", date);
        }

        return { PlatformInfo, date, datesList, timesList, time, getDatesByPlatformInfo, exportFiles, getTimesByDates }

    }
}
</script>

<style scoped>
#info {
    margin-top: 10%;
}

.label {
    margin-left: 10px;
    margin-right: 8px;
}

.exportBtn {
    margin-top: 8%;
    margin-left: 46%;
}

.date {
    background-color: darkgray;
    margin-left: 11%;
    margin-right: 5%;
    margin-top: 3%;
    height: 38px;
    width: 37%;
}

.time {
    background-color: darkgray;
    margin-right: 11%;
    height: 38px;
    margin-top: 3%;
    width: 36%;
    position: relative;
}
</style>