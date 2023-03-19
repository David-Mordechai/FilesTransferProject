import  { app, dialog, ipcMain } from 'electron'
import { BrowserWindow } from 'electron/main';
import fs from 'fs';
import path from 'path';

var config: config;
var mainWin : BrowserWindow

interface config {
    localRootFolder: string;
    platforms: [];
    allowedFiles: [];
}
declare const __static: string;

export const addListeners = async (win: BrowserWindow, isDevelopment: boolean) => {
    mainWin = win;

    let configFilePath = path.join(__dirname,'../../public/config.json')
    
        var configConetet = fs.readFileSync(configFilePath)
        config = JSON.parse(configConetet.toString());

    win.on('maximize', () => {
        win.webContents.send('full-screen', { 'isFullScreen': true })
    })

    win.on('unmaximize', () => {
        win.webContents.send('full-screen', { 'isFullScreen': false })
    })

    ipcMain.on('close', () => {
        app.quit()
    })

    ipcMain.on('minimize', () => {
        win.minimize()
    })

    ipcMain.on('maximize', () => {
        win.maximize()
    })

    ipcMain.on('restore', () => {
        win.restore()
    })

    ipcMain.on('getConfig', (event) => {
        event.returnValue = config
    });

    ipcMain.on('choose-files', (event) => {
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
    ipcMain.removeAllListeners();
    mainWin.removeAllListeners();
}