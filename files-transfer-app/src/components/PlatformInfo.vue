<template>
    <div class="container was-validated">
        <div class="row">
            <div class="col">
                <div class="input-group mb-3">
                    <label class="input-group-text" for="inputPlatform">Platform</label>
                    <select class="form-select" required id="inputPlatform" v-model="seletedPlatform">
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
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
export default {
    name: 'input-form',
    props: ['platforms'],
    setup(props) {
        const platformsList = ref(props.platforms);
        const tailNumber = ref()
        const seletedPlatform = ref('')
        let isValid = ref(false)
        isValid = computed(() => {
            const validTailNumber = tailNumber.value && tailNumber.value > 99 && tailNumber.value < 10000;
            const validPlatform = seletedPlatform.value !== '';
            return validTailNumber && validPlatform;
        });

        watch(isValid, async (newValue) => {
            if (newValue) {
                console.log('true');
            }
            else {
                console.log('false');
            }
        });

        console.log(isValid);
        return {
            platformsList,
            tailNumber,
            seletedPlatform
        }
    }
}
</script>

<style scoped></style>