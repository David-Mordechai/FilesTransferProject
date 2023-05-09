import { dialog, ipcMain } from "electron";
import { BrowserWindow } from "electron/main";
import fs from "fs";
import path from "path";
import { appSettings } from "../models/appSettings";
import UsbEventsContorller from "../usbDetection/UsbEventsContorller";
import { UsbDevice } from "../models/usbDevice";

var appSettings: appSettings;
var mainWin: BrowserWindow;
var usbEvents: UsbEventsContorller;
var connectedUsbDevice: UsbDevice = null;

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
    appSettings = JSON.parse(configContent.toString());
  } catch (error) {
    console.log(error);
    appSettings = { platforms: [], allowedFiles: [], localRootFolder: "" };
  }

  let dllPath = isDevelopment
    ? path.join(__dirname, "../../public/RemovableUsbInfo.dll")
    : "dependencies/RemovableUsbInfo.dll";
  usbEvents = new UsbEventsContorller(dllPath);
  await usbEvents.startListing();

  usbEvents.on("attach", (device: UsbDevice) => {
    if (connectedUsbDevice === null) {
      connectedUsbDevice = device;
      win.webContents.send("usb-state", {
        isConnected: true,
        path: device.Path,
        label: device.Label,
      });
    }
  });

  usbEvents.on("detach", (device: UsbDevice) => {
    if (connectedUsbDevice && connectedUsbDevice.Path === device.Path) {
      connectedUsbDevice = null;
      win.webContents.send("usb-state", {
        isConnected: false,
        path: "",
        label: "",
      });
    }
  });

  ipcMain.on("getConfig", (event) => {
    event.returnValue = appSettings;
  });

  ipcMain.on("PlatformDetailsQuery", (event, platform, tailNumber) => {
    const folderName = `${platform}-${tailNumber}`;

    if (
      fs.existsSync(`${appSettings.localRootFolder}backup\\${folderName}\\`)
    ) {
      const folders = fs.readdirSync(
        `${appSettings.localRootFolder}backup\\${folderName}\\`
      );
      event.returnValue = folders;
    }
  });

  ipcMain.on("getTimes", (event, path) => {
    // const path = `${appSettings.localRootFolder}backup\\${PlatformFolder}\\${date}`;
    if (fs.existsSync(path)) {
      const folders = fs.readdirSync(path);

      event.returnValue = folders;
    }
  });

  ipcMain.on("choose-files", (event) => {
    const files = dialog.showOpenDialogSync({
      properties: ["openFile", "multiSelections"],
      filters: appSettings.allowedFiles,
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
