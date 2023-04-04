<template>
    <div class="progress">

        {{ currentFile }} of {{ totalFiles }} Files
        <v-progress-linear  absolute
        bottom color="primary" :model-value="percent"></v-progress-linear>
    </div>
   
</template>

<script lang="ts">
import { computed } from 'vue'

export default {
    name: 'progress-bar',
    props: ['total', 'current'],
    setup(props) {
        const percent = computed(() => {
            console.log(props.total);
            console.log(props.current);
            
            if(props.total === 0) return 0;
            return props.current / props.total * 100
        })

        const totalFiles = computed(() => {
            return props.total
        })

        const currentFile = computed(() => {
            return props.current
        })

        return {
            percent,
            totalFiles,
            currentFile
        }
    }
}
</script>

<style scoped>
</style>