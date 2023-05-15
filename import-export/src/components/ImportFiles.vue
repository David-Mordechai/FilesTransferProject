<template>
    <div id="info">
        <PlatformInfo :platforms="platforms" @updatePlatformInfo="updatePlatformInfo"></PlatformInfo>
        <v-row>
            <input id="date" type="date" v-model="date">

            <input id="time" type="time" v-model="time">
        </v-row>
        <div id="importBtn">
            <v-btn @click="importFiles" rounded="sm" color="primary">
                Import
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import PlatformInfo from './PlatformInfo.vue';
export default {
    name: `ImportFiles`,
    props: ['platforms', 'updatePlatformInfo', 'importFiles', 'exportFiles', 'getDatesByPlatformInfo', 'datesList', 'timesList'],
    emits: ['updatePlatformInfo', 'getDatesByPlatformInfo', "importFiles", 'exportFiles', 'getTimesByDates', 'getTotal'],
    components: { PlatformInfo },

    setup(props, context) {

        const date = ref();
        const time = ref();

        function importFiles() {
            context.emit("getTotal");
            context.emit("importFiles", date.value, time.value);
        }

        function updatePlatformInfo(platform: string, tailNumber: number) {
            context.emit("updatePlatformInfo", platform, tailNumber);
        }

        return { PlatformInfo, date, time, importFiles, updatePlatformInfo }

    }
}
</script>

<style scoped>  #importBtn {
      margin-top: 8%;
      margin-left: 45.5%;
  }


  #info {
      margin-top: 10%;
  }

  #date {
      background-color: darkgray;
      margin-left: 11%;
      margin-right: 5%;
      width: 37%;
      height: 38px;
      margin-top: 3%;
      position: relative;

  }

  #time {
      background-color: darkgray;
      height: 38px;
      margin-right: 11%;
      width: 36%;
      margin-top: 3%;
      position: relative;
  }
</style>