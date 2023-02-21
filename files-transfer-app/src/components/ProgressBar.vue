<template>
    <div class="progress">
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

<style scoped></style>