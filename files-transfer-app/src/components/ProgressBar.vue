<template>
    <div class="progress" v-if="percent > 0">
        <div class="progress-bar" role="progressbar" :style="'width: ' + percent + '%;'" :aria-valuenow="percent"
            aria-valuemin="0" aria-valuemax="100">
            {{ percent }}%
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    name: 'progress-bar',
    props: ['progressPercent'],
    setup(props) {
        const percent = computed(() => {
            return props.progressPercent
        })

        return {
            percent
        }
    }
}
</script>

<style scoped>
.progress{
    border-radius: 2px;
}
 .progress-bar{
    background-color: rgba(0, 128, 0, 0.705);
    border-radius: 2px;
 }
</style>