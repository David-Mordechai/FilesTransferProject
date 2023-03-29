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
                    <label class="input-group-text" for="inputDate">Date</label>
                    <select class="form-select" required id="inputDate" v-model="selectDate">
                        // <option value="" selected>Choose...</option>
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
export default {
    name: `Export`
}
</script>

<style scoped></style>