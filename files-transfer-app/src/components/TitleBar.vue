<template>
    <div class="toolbar">
        <div class="title">{{ applicationName }}</div>
        <div class="logo">
            <svg height="100%" width="100%" viewBox="0 0 52 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_230_215)">
                    <path
                        d="M27.8506 1.68244L26.511 1.00247C26.3713 0.935479 26.2203 0.898476 26.0669 0.893661C25.9142 0.898472 25.7639 0.935483 25.6251 1.00247L24.2855 1.68244L0 15.1063C0.282007 15.0049 9.26864 11.8029 13.017 10.6852C20.187 8.53654 25.9306 11.7064 26.0669 11.7064C26.2032 11.7064 31.942 8.53654 39.1191 10.6852C42.8674 11.8029 51.8517 15.0049 52.1337 15.1063L27.8506 1.68244Z"
                        fill="url(#paint0_linear_230_215)"></path>
                </g>
                <defs>
                    <linearGradient id="paint0_linear_230_215" x1="26.0669" y1="15.1063" x2="26.0669" y2="0.893661"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0.09" stop-color="#FF0A0A"></stop>
                        <stop offset="0.75" stop-color="#FF530A"></stop>
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div class="title-bar-buttons">
            <button @click="minimize" class="btnMin" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h16v16H0z" fill="none" />
                    <path d="M19 13H5v-2h14v2z" />
                </svg>
            </button>
            <button @click="maximize" v-if="!isFullScreen" class="btnMax" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
            </button>
            <button @click="restore" v-if="isFullScreen" class="btnScaleDown" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
            </button>
            <button @click="close" class="btnClose" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
const electron = require('electron')
const ipc = electron.ipcRenderer
export default {
    name: 'title-bar',
    props: ['appName'],
    setup(props) {

        const applicationName = ref(props.appName)

        const isFullScreen = ref(false)

        function close() {
            ipc.send('close')
        }

        function minimize() {
            ipc.send('minimize')
        }

        function maximize() {
            ipc.send('maximize')
        }

        function restore() {
            ipc.send('restore')
        }

        ipc.on('full-screen', (_, args) => {
            console.log(args);
            isFullScreen.value = args.isFullScreen
        })

        return {
            applicationName,
            isFullScreen,
            close,
            minimize,
            maximize,
            restore,
        }
    }
}
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

.title {
    grid-area: a;
    height: 36px;
    line-height: 36px;
    vertical-align: middle;
    padding-left: 10px;
    justify-self: start;
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
.btnScaleDownsvg>svg {
    width: 60%;
    height: 55%;
}

.btnClose>svg {
    width: 80%;
    height: 60%;
}

@media (prefers-color-scheme: dark) {

    .btnMin>svg,
    .btnMax>svg,
    .btnScaleDown>svg,
    .btnClose>svg {
        fill: #fff;
    }
}

@media (prefers-color-scheme: light) {

    .btnMin>svg,
    .btnMax>svg,
    .btnScaleDown>svg,
    .btnClose>svg {
        fill: #000000ab;
    }
}
</style>