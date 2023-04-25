import { app, dialog, ipcMain } from "electron";
import { BrowserWindow } from "electron/main";
import fs from "fs";
import path from "path";
import { config } from "../models/config";
import UsbEventsContorller from "./usbDetection/UsbEventsContorller";

var config: config;
var mainWin: BrowserWindow;
var usbEvents: UsbEventsContorller;

export const addListeners = async (
    win: BrowserWindow,
    isDevelopment: boolean
) => {
    mainWin = win;

    try {
        let configFilePath = isDevelopment
            ? path.join(__dirname, "../../public/appsettings.json")
            : "appsettings.json";
        var configContent = fs.readFileSync(configFilePath);
        config = JSON.parse(configContent.toString());
    } catch (error) {
        console.log(error);
        config = { platforms: [], allowedFiles: [], localRootFolder: "" };
    }

    let dllPath = isDevelopment
        ? path.join(__dirname, "../../public/RemovableUsbInfo.dll")
        : "dependencies/RemovableUsbInfo.dll";
    usbEvents = new UsbEventsContorller(dllPath);
    await usbEvents.startListing();

    usbEvents.on("attach", (device) => {
        dialog.showMessageBox(mainWin, { message: `Usb attached ${device.Path} (${device.Label})` });
    });

    usbEvents.on("detach", (device) => {
        dialog.showMessageBox(mainWin, { message: `Usb detached ${device.Path} (${device.Label})` });
    });

    win.on("maximize", () => {
        win.webContents.send("full-screen", { isFullScreen: true });
    });

    win.on("unmaximize", () => {
        win.webContents.send("full-screen", { isFullScreen: false });
    });

    ipcMain.on("close", () => {
        app.quit();
    });

    ipcMain.on("minimize", () => {
        win.minimize();
    });

    ipcMain.on("maximize", () => {
        win.maximize();
    });

    ipcMain.on("restore", () => {
        win.restore();
    });

    ipcMain.on("getConfig", (event) => {
        event.returnValue = config;
    });

    ipcMain.on("PlatformDetailsQuery", (event, platform, tailNumber) => {
        const folderName = `${platform}-${tailNumber}`;

        if (fs.existsSync(`${config.localRootFolder}backup\\${folderName}\\`)) {
            const folders = fs.readdirSync(
                `${config.localRootFolder}backup\\${folderName}\\`
            );
            event.returnValue = folders;
        }
    });

    ipcMain.on("getTimes", (event, platform, tailNumber, date) => {
        const PlatformFolder = `${platform}-${tailNumber}`;
        const path = `${config.localRootFolder}backup\\${PlatformFolder}\\${date}`;
        if (fs.existsSync(path)) {
            const folders = fs.readdirSync(path);

            event.returnValue = folders;
        }
    });

    ipcMain.on("choose-files", (event) => {
        const files = dialog.showOpenDialogSync({
            properties: ["openFile", "multiSelections"],
            filters: config.allowedFiles,
        });
        if (!files) {
            event.returnValue = [];
            return;
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
                        name: "",
                        size: null,
                        path: "",
                    };
                }
            })
            .filter((file) => file.size !== null);
    });
};

export const removeListeners = () => {
    ipcMain.removeAllListeners();
    mainWin.removeAllListeners();
    usbEvents.stopListening();
};
