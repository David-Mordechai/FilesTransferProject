<template>
    <!-- <div class="container was-validated">
        <div class="row">
            <div class="col">
                <div class="input-group mb-3">
                    <label class="input-group-text" for="inputPlatform">Platform</label>
                    <select class="form-select" required id="inputPlatform" v-model="selectedPlatform">
                        <option value="" selected>Choose...</option>
                        <option v-for="platform in platformsList" :key="platform.key" :value="platform.key">
                            {{ platform.value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Tail #</span>
                    <input type="number" class="form-control" min="100" max="9999" placeholder="Between 100 to 9999"
                        required aria-label="Username" aria-describedby="basic-addon1" v-model="tailNumber">
                </div>
            </div>
        </div>
    </div> -->
    <v-container style="--v-theme-surface: transparent;">
        <v-row>
            <v-col>
                <v-text-field v-model="tailNumber" :rules="tailNumberRules" label="Tail Number" required></v-text-field>
            </v-col>
            <v-col>
                <v-select v-model="selectedPlatform" :items="platformsList" item-title="value" item-value="key"
                    label="Platform" persistent-hint return-object single-line></v-select>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
export default {
    name: 'platform-info',
    props: ['platforms'],
    emits: ['updatePlatformInfo'],
    setup(props, context) {
        const platformsList = ref(props.platforms);
        const tailNumber = ref()
        const selectedPlatform = ref()

        let isValid = ref(false)
        isValid = computed(() => {
            const validTailNumber = tailNumber.value && tailNumber.value > 99 && tailNumber.value < 10000;
            const validPlatform = selectedPlatform.value !== '';
            return validTailNumber && validPlatform;
        });

        const tailNumberRules = [
            (v: number) => !!v || 'Tail number is required',
            (v: number) => (v > 99 && v < 1000) || 'Tail # between 100 to 9999',
        ]

        watch(isValid, async (newValue) => {
            if (newValue) {
                context.emit('updatePlatformInfo', selectedPlatform.value, tailNumber.value)
            }
            else {
                context.emit('updatePlatformInfo', '', null)
            }
        });

        function reset() {
            selectedPlatform.value = ''
            tailNumber.value = null
        }

        return {
            platformsList,
            tailNumber,
            selectedPlatform,
            reset,
            tailNumberRules
        }
    }
}
</script>

<style scoped>
.col {
    display: inline-block;
}
</style>