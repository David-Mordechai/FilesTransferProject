import { usb } from "usb";
import EventEmitter from "events";
import edge from "electron-edge-js";
import path from "path";
import { BrowserWindow, dialog } from "electron";

export default class UsbEventsContorller extends EventEmitter {
  drivesCache = {};
  dll: edge.Func<unknown, unknown>;
  dllPath: string;
  constructor(isDevelopment: boolean) {
    super();
    // const dllPath = path.join(process.env.PUBLIC, "RemovableUsbInfo.dll")
    try {
      this.dllPath = isDevelopment
        ? path.join(__dirname, "../../public/RemovableUsbInfo.dll")
        : path.join(process.env.PUBLIC, "RemovableUsbInfo.dll");
        
    } catch (error) {
      console.log(error)
    }

  }

  async startListing(win: BrowserWindow) {

    const shortPath = this.dllPath.indexOf("resources") === -1 ? this.dllPath : this.dllPath.substring(this.dllPath.indexOf("resources"));
    dialog.showMessageBox(win,{ message: `${shortPath}`,textWidth: 1000});
    // this.dll = edge.func(this.dllPath);
    this.dll = edge.func(this.dllPath);
    dialog.showMessageBox(win,{ message: `after loading dll`});

    usb.on("attach", (device) => {
      console.log("attach");
      var payload = {
        ProductId: device.deviceDescriptor.idProduct,
        VendorId: device.deviceDescriptor.idVendor,
      };
      var _this = this;
      this.dll(payload, function (error, result) {
        if (error) {
          console.error(error);
          return;
        }

        if (result == null) return;

        var driveKey = `${device.deviceDescriptor.idProduct}_${device.deviceDescriptor.idVendor}`;
        _this.drivesCache[driveKey] = result;
        _this.emit("attach", result);
      });
    });

    usb.on("detach", (device) => {
      console.log("detach");

      var driveKey = `${device.deviceDescriptor.idProduct}_${device.deviceDescriptor.idVendor}`;
      var result = this.drivesCache[driveKey];

      if (result) {
        delete this.drivesCache[driveKey];
        this.emit("detach", result);
      }
    });
  }

  stopListening(): void {
    usb.removeAllListeners();
    this.removeAllListeners();
  }
}
