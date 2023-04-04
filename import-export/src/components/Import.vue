<template>
    <div>
        <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo"></PlatformInfo>
    </div>
    <v-row>
        <v-col>
            <v-select v-model="selectDates" :items="datesList" item-title="value" item-value="key" clearable
                density="compact" label="Choose Date" persistent-hint single-line></v-select>
        </v-col>
        <v-col>
            <v-select v-model="selectTime" :items="timeList" item-title="value" item-value="key" clearable density="compact"
                label="Choose Time" persistent-hint single-line></v-select>
        </v-col>
    </v-row>
    <div class="uploadBtn">
        <v-btn rounded="sm" color="primary">
            Import
        </v-btn>
    </div>
</templatE>

<script lang="ts">
import { ref } from 'vue'
import PlatformInfo from './PlatformInfo.vue';
export default {
    name: `Import`,
    props: ['platforms', 'updatePlatformInfo', 'dates', 'time'],
    emits: ['updatePlatformInfo', "uploadFiles"],
    components: { PlatformInfo },
    setup(props, context) {
        const datesList = ref(props.dates);
        const timeList = ref(props.time);

        const date = ref();
        const time = ref();

        const selectDates = ref()
        const selectTime = ref()





        return { PlatformInfo, date, selectDates, time, datesList, timeList, selectTime }

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