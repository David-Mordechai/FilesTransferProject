<template>
    <div class="actionSelection">
        <!-- <h1 class="title1">External drive connected</h1> -->
        <!-- <h2 class="title2">Choose your next action:</h2> -->
        <div class="buttons">
            <router-link :to="{ name: 'ActionSelector' }"></router-link>
            <!-- <v-btn>
                <router-link :to="{ name: 'Import' }">IMPORT</router-link>
            </v-btn>
            <v-btn>
                <router-link :to="{ name: 'Export' }">EXPORT</router-link>
            </v-btn> -->
        </div>
    </div>
</template>

<script  lang="ts">
export default {
    name: `ActionSelector`
}
</script>

<style scoped>
.actionSelection {
    margin-left: 25%;
    margin-right: 25%;
    margin-top: 20%;
    margin-bottom: 20%;
}

.title1 {
    text-shadow: 1px 1px 2px gray;
    margin-left: 20%;
    margin-right: 20%;
}

.title2 {
    text-shadow: 1px 1px 2px gray;
    margin-left: 25%;
    margin-right: 25%;
}

.buttons {
    margin-left: 30%;
    margin-right: 30%;
    margin-top: 2%;
}
</style>