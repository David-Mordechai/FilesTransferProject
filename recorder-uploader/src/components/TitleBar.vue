<template>
    <div class="toolbar">

        <div class="titleWrapper">
            <AppLogo />
            <div class="titleCaption">
                {{ applicationName }}
            </div>
        </div>
        <div class="logo">
            <Logo />
        </div>
        <div class="title-bar-buttons">
            <button @click="minimize" class="btnMin" tabindex="-1">
                <MinimizeIcon />
            </button>
            <button @click="maximize" v-if="!isFullScreen" class="btnMax" tabindex="-1">
                <MaximizeIcon />
            </button>
            <button @click="restore" v-if="isFullScreen" class="btnScaleDown" tabindex="-1">
                <RestoreIcon />
            </button>
            <button @click="close" class="btnClose" tabindex="-1">
                <CloseIcon />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import MaximizeIcon from "./Icons/MaximizeIcon.vue";
import MinimizeIcon from "./Icons/MinimizeIcon.vue";
import RestoreIcon from "./Icons/RestoreIcon.vue";
import CloseIcon from "./Icons/CloseIcon.vue";
import Logo from "./Icons/Logo.vue";
import AppLogo from './Icons/appLogo.vue'
import { ipcRenderer } from "electron";
export default {
    name: "title-bar",
    components: { Logo, MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon, AppLogo },
    props: ["appName"],
    setup(props) {
        const applicationName = ref(props.appName);

        const isFullScreen = ref(false);

        function close() {
            ipcRenderer.send("close");
        }

        function minimize() {
            ipcRenderer.send("minimize");
        }

        function maximize() {
            ipcRenderer.send("maximize");
        }

        function restore() {
            ipcRenderer.send("restore");
        }

        ipcRenderer.on("full-screen", (_, args) => {
            isFullScreen.value = args.isFullScreen;
        });

        return {
            applicationName,
            isFullScreen,
            close,
            minimize,
            maximize,
            restore,
        };
    },
};
</script>

<style scoped>
.toolbar {
    display: grid;
    grid-template-areas: "a b c";
    grid-template-columns: 1fr 1fr 1fr;
    -webkit-app-region: drag;
}

.title-bar-buttons {
    grid-area: c;
    -webkit-app-region: no-drag;
    justify-self: end;
}

.titleWrapper {
    display: inline-flex;
    align-items: center;
    grid-area: a;
    height: 36px;
    line-height: 36px;
    vertical-align: middle;
    padding-left: 10px;
    justify-self: start;
}

.titleCaption{
    margin-left: 5px;
}
.logo {
    grid-area: b;
    height: 100%;
    width: 80px;
    justify-self: center;
}

.btnMin,
.btnMax,
.btnScaleDown,
.btnClose {
    border: none;
    background-color: transparent;
    height: 36px;
    width: 36px;
}

.btnClose {
    width: 42px;
}

.btnClose:hover {
    background-color: orangered;
    color: whitesmoke;
}

.btnMin:hover,
.btnMax:hover,
.btnScaleDown:hover {
    background-color: rgba(128, 128, 128, 0.597);
}

.btnMin>svg,
.btnMax>svg,
.btnScaleDown>svg {
    width: 60%;
    height: 55%;
}

.btnClose>svg {
    width: 80%;
    height: 60%;
}

.btnMin>svg,
.btnMax>svg,
.btnScaleDown>svg,
.btnClose>svg {
    fill: #fff;
}
</style>
