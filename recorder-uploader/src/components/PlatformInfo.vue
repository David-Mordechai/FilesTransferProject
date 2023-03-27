<template>
    <div class="">
        <v-row >
            <v-col>
                <v-text-field v-model="tailNumber" :rules="tailNumberRules" label="Tail Number" required
                    density="compact"></v-text-field>
            </v-col>
            <v-col>
                <v-select v-model="selectedPlatform" :items="platformsList" item-title="value" item-value="key" clearable
                    density="compact" label="Choose Platform" persistent-hint  single-line></v-select>
            </v-col>
        </v-row>
    </div>
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
            if(!tailNumber.value) return false;
            if(!selectedPlatform.value) return false;

            const validTailNumber = tailNumber.value > 99 && tailNumber.value < 10000;
            const validPlatform = selectedPlatform.value !== '';
            console.log(`is valid ${validTailNumber && validPlatform}`);
            console.log(`platform ${selectedPlatform.value}`);
            console.log(`tail ${tailNumber.value}`);
            
            return validTailNumber && validPlatform;
        });

        const tailNumberRules = [
            (v: number) => !!v || 'Tail number is required',
            (v: number) => (v > 99 && v < 10000) || 'Tail # between 100 to 9999',
        ]

        watch(isValid, (newValue) => {
            // if(oldValue === newValue) return;

            if (newValue) {
                console.log(`updatePlatformInfo: platform:${selectedPlatform.value}, tail: ${tailNumber.value}`);
                
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
</style>