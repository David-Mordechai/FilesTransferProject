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

  <div class="dataTableWrapper">
    <v-data-table-virtual v-model="selected" :headers="headers" :items="files" item-value="name" show-select
      style="--v-theme-surface: transparent;font-size: 90%;--v-table-row-height:auto;" class="elevation-0">
      <template v-slot:item.size="{ item }">
        {{ formatSize(item.raw.size) }}
      </template>
      <template v-slot:item.copied="{ item }">
        <div :class="statusClass(item.raw.copied)">
          {{ item.raw.copied }}
        </div>
      </template>
      <template v-slot:item.deleted="{ item }">
        <div :class="statusClass(item.raw.deleted)">
          {{ item.raw.deleted }}
        </div>
      </template>
      <template v-slot:item.uploaded="{ item }">
        <div :class="statusClass(item.raw.uploaded)">
          {{ item.raw.uploaded }}
        </div>
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
      context.emit("removeFile", path);
    }

    let selected = ref([])
    const headers = [
      {
        title: 'File Name',
        align: 'start',
        sortable: true,
        key: 'name',
      },
      { title: 'Size', key: 'size' },
      { title: 'Copied', key: 'copied' },
      { title: 'Deleted', key: 'deleted' },
      { title: 'Uploaded', key: 'uploaded' },
    ]
    // const desserts = [
    //   {
    //     name: 'Frozen Yogurt',
    //     calories: 159,
    //     fat: 6.0,
    //     carbs: 24,
    //     protein: 4.0,
    //     iron: 1,
    //   },
    //   {
    //     name: 'Ice cream sandwich',
    //     calories: 237,
    //     fat: 9.0,
    //     carbs: 37,
    //     protein: 4.3,
    //     iron: 1,
    //   },
    //   {
    //     name: 'Eclair',
    //     calories: 262,
    //     fat: 16.0,
    //     carbs: 23,
    //     protein: 6.0,
    //     iron: 7,
    //   },
    //   {
    //     name: 'Cupcake',
    //     calories: 305,
    //     fat: 3.7,
    //     carbs: 67,
    //     protein: 4.3,
    //     iron: 8,
    //   },
    //   {
    //     name: 'Gingerbread',
    //     calories: 356,
    //     fat: 16.0,
    //     carbs: 49,
    //     protein: 3.9,
    //     iron: 16,
    //   },
    //   {
    //     name: 'Jelly bean',
    //     calories: 375,
    //     fat: 0.0,
    //     carbs: 94,
    //     protein: 0.0,
    //     iron: 0,
    //   },
    //   {
    //     name: 'Lollipop',
    //     calories: 392,
    //     fat: 0.2,
    //     carbs: 98,
    //     protein: 0,
    //     iron: 2,
    //   },
    //   {
    //     name: 'Honeycomb',
    //     calories: 408,
    //     fat: 3.2,
    //     carbs: 87,
    //     protein: 6.5,
    //     iron: 45,
    //   },
    //   {
    //     name: 'Donut',
    //     calories: 452,
    //     fat: 25.0,
    //     carbs: 51,
    //     protein: 4.9,
    //     iron: 22,
    //   },
    //   {
    //     name: 'KitKat',
    //     calories: 518,
    //     fat: 26.0,
    //     carbs: 65,
    //     protein: 7,
    //     iron: 6,
    //   },
    // ]

    function getColor(status: string) {
      if (status === 'Success') return 'green'
      else if (status === 'Failure') return 'red'
    }

    return {
      files,
      showDeleteFileColumn,
      formatSize,
      remove,
      statusClass,
      selected,
      headers,
      // desserts
      getColor
    };
  },
}
</script>

<style scoped>
.dataTableWrapper {
  width: 95%;
  margin: auto;
}

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
}
</style>