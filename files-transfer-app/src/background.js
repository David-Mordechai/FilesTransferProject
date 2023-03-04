'use strict'

import electron, { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from "fs";
var path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production'
const ipc = electron.ipcMain

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.menuBarVisible = false

  win.on('closed', () => {
    ipc.removeAllListeners();
    win = null;
  })

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

  ipc.on('choose-files', (event) => {
    const files = dialog.showOpenDialogSync({ 
      properties: ['openFile', 'multiSelections'], 
      filters: [
        { 
          'name': 'csv files', 
          extensions: ['json'] 
        }]
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

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    // if (!process.env.IS_TEST) win.webContents.openDevTools()

  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}