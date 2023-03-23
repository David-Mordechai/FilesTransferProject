import electron, { app, dialog } from "electron";
const ipc = electron.ipcMain;
import fs from "fs";
var path = require("path");

var config = {};
var mainWin;
export const addListeners = async (win, isDevelopment) => {
  mainWin = win;

  try {
    let configFilePath = path.join(
      isDevelopment ? __dirname : __static,
      "../public/config.json"
    );
    config = JSON.parse(fs.readFileSync(configFilePath));
  } catch (error) {
    console.log(error);
    config = { platforms: [], allowedFiles: [], localRootFolder: "" };
  }

  win.on("maximize", () => {
    win.webContents.send("full-screen", { isFullScreen: true });
  });

  win.on("unmaximize", () => {
    win.webContents.send("full-screen", { isFullScreen: false });
  });

  fs.watch(config.localRootFolder, () => {
    // if (eventType === "rename") {
    getFiles(win);
  });

  ipc.on("close", () => {
    app.quit();
  });

  ipc.on("minimize", () => {
    win.minimize();
  });

  ipc.on("maximize", () => {
    win.maximize();
  });

  ipc.on("restore", () => {
    win.restore();
  });

  ipc.on("getConfig", (event) => {
    event.returnValue = config;
  });

  ipc.on("getFilesCount", () => {
    getFiles(win);
  });

  ipc.on("choose-files", (event) => {
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

ipc.on("failure-files", (event) => {
  const files = fs.readdirSync(config.localRootFolder).filter((file) => {
    const fullPath = path.join(config.localRootFolder, file);
    const stats = fs.statSync(fullPath);

    return stats.isFile();
  });
  console.log(files);
  event.returnValue = files.map((file) => {
    try {
      const fullPath = path.join(config.localRootFolder, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        size: stats.size,
        path: fullPath,
      };
    } catch {
      return {
        name: "",
        size: null,
        path: "",
      };
    }
  });
});

export const removeListeners = () => {
  ipc.removeAllListeners();
  mainWin.removeAllListeners();
};

function getFiles(win) {
  const files = fs.readdirSync(config.localRootFolder).filter((file) => {
    console.log(file);
    const fullPath = path.join(config.localRootFolder, file);
    const stats = fs.statSync(fullPath);

    return stats.isFile();
  });
  console.log(files);
  win.webContents.send("filesCounter", files.length);
}
