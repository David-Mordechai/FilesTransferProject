<template>
    <div>
        <v-btn>
            <router-link :to="{ name: 'Export' }">EXPORT</router-link>
        </v-btn>
        <v-btn>
            <router-link :to="{ name: 'Import' }">IMPORT</router-link>
        </v-btn>

    </div>
</template>

<script  lang="ts">
export default {
    name: `ActionSelector`
}
</script>

<style scoped></style>