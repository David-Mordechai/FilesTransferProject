<template>
  <div class="dataTableWrapper">
    <v-data-table-virtual :headers="headers" :items="files" item-value="name" 
       class="dataTable">
      <template class="cellWidth"  v-slot:item.size="{ item }">
        {{ formatSize(item.raw.size) }}
      </template>
      <template v-slot:item.copied="{ item }">
        <div class="cellWidth" :class="statusClass(item.raw.copied)">
          {{ item.raw.copied }}
        </div>
      </template>
      <template v-slot:item.deleted="{ item }">
        <div class="cellWidth" :class="statusClass(item.raw.deleted)">
          {{ item.raw.deleted }}
        </div>
      </template>
      <template class="cellWidth" v-slot:item.uploaded="{ item }">
        <div :class="statusClass(item.raw.uploaded)">
          {{ item.raw.uploaded }}
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="error" size="small" 
        v-if="showDeleteFileColumn"
        @click="remove(item.raw.path)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
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
        return "0 KB";
      var i = Math.floor(Math.log(size) / Math.log(1024));
      return ((size / Math.pow(1024, i)).toFixed(2) +
        " " +
        ["B", "KB", "MB", "GB", "TB"][i]);
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
      console.log(path)
      context.emit("removeFile", path);
    }

    const headers = [
      { title: '', key: 'actions', sortable: false, width: '40px' },
      {
        title: 'File Name',
        align: 'start',
        sortable: true,
        key: 'name',
      },
      { title: 'Size', key: 'size', width: '100px' },
      { title: 'Copied', key: 'copied', width: '100px'},
      { title: 'Deleted', key: 'deleted', width: '100px' },
      { title: 'Uploaded', key: 'uploaded', width: '100px' },
    ]

    return {
      files,
      showDeleteFileColumn,
      formatSize,
      remove,
      statusClass,
      headers,
    };
  },
}
</script>

<style scoped>
.dataTableWrapper {
  width: 100%;
}
.dataTable{
  --v-theme-surface: transparent;
  font-size: 90%;
  --v-table-row-height:3em !important;
  --v-table-header-height:3em !important;
}
.regular {
  color: inherit;
}

.success {
  color: green;
  transition: color 1s;
}

.failure {
  color: red;
  transition: color 1s;
}
</style>