import electron, { app, dialog } from 'electron'
const ipc = electron.ipcMain
import fs from "fs";
var path = require('path');

var config = {}

export const addListeners = async (win, isDevelopment) => {

    let configFilePath = path.join(
        isDevelopment ? __dirname : __static, '../public/config.json')
    config = JSON.parse(fs.readFileSync(configFilePath));

    win.on('maximize', () => {
        win.webContents.send('full-screen', { 'isFullScreen': true })
    })

    win.on('unmaximize', () => {
        win.webContents.send('full-screen', { 'isFullScreen': false })
    })

    ipc.on('close', () => {
        app.quit()
    })

    ipc.on('minimize', () => {
        win.minimize()
    })

    ipc.on('maximize', () => {
        win.maximize()
    })

    ipc.on('restore', () => {
        win.restore()
    })

    ipc.on('getConfig', (event) => {
        event.returnValue = config
    });

    ipc.on('choose-files', (event) => {
        const files = dialog.showOpenDialogSync({
            properties: ['openFile', 'multiSelections'],
            filters: config.allowedFiles
        })
        if (!files) {
            event.returnValue = []
            return
        }
        event.returnValue = files
            .map((file) => {
                try {
                    const stats = fs.statSync(file);
                    return {
                        name: path.basename(file),
                        size: stats.isFile() ? stats.size : null,
                        path: file,
                    };
                } catch {
                    return {
                        name: '',
                        size: null,
                        path: '',
                    };
                }
            })
            .filter(file => file.size !== null)
    })
}

export const removeListeners = () => {
    ipc.removeAllListeners();
}