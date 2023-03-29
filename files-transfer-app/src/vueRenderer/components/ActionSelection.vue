<template>
    <div class="window">
        <div class="selection">
            <router-link :to="{ name: 'Import' }" class="btn btn-primary">IMPORT</router-link>
        </div>
        <div class="selection">
            <router-link :to="{ name: 'Export' }" class="btn btn-primary">EXPORT</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: `Action-Selection`
}
</script>

<style>
.selection {
    height: 50px;
    width: 100px;
    margin: 0 2px;
    margin-top: 4px;
}

.window {
    height: 100px;
    width: 300px;
    background-color: blue;
}
</style>