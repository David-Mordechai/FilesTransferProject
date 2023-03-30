<template>
    <h1>EXPORT</h1>
    <div class="container was-validated">
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
                <div class="input-group mb-3">
                    <label for="date" class="input-group-text">Date</label>
                    <input type="date" v-model="selectedDate" id="date">
                </div>
            </div>
            <div class=" col">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">Tail #</span>
                    <input type="number" class="form-control" min="100" max="9999" placeholder="Between 100 to 9999"
                        required aria-label="Username" aria-describedby="basic-addon1" v-model="tailNumber">
                </div>
            </div>
        </div>
        <button class="btnSideBar btn btn-success" @click="uploadFiles">Upload</button>
    </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
export default {
    name: `Export`,
    props: ['platforms'],
    emits: ["uploadFiles", "updatePlatformInfo"],

    setup(props, context) {
        const platformsList = ref(props.platforms);
        const tailNumber = ref()
        const selectedPlatform = ref('')
        const selectedTailNumber = ref('')
        const selectedDate = ref('')

        selectedDate.value = new Date().toISOString().slice(0, 10)
        let isValid = ref(false)
        isValid = computed(() => {
            const validTailNumber = tailNumber.value && tailNumber.value > 99 && tailNumber.value < 10000;
            const validPlatform = selectedPlatform.value !== '';
            return validTailNumber && validPlatform;
        });

        watch(isValid, async (newValue) => {
            if (newValue) {
                context.emit('updatePlatformInfo', selectedPlatform.value, tailNumber.value, selectedDate.value)
            }
            else {
                context.emit('updatePlatformInfo', '', null)
            }
        });

        function updatePlatformInfo(platform, tailNumber, date) {
            selectedPlatform.value = platform;
            selectedTailNumber.value = tailNumber;
            selectedDate.value = date
        }

        function uploadFiles() {
            context.emit("uploadFiles");
        }

        return {
            platformsList,
            tailNumber,
            selectedPlatform,
            selectedDate,
            uploadFiles,
            updatePlatformInfo

        }
    }
}
</script>

<style scoped></style>