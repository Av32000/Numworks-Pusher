const { WebUSB } = require("usb");
const customWebUSB = new WebUSB({
  allowAllDevices: true,
});
const navigator = { usb: customWebUSB };

var Numworks = (function (e) {
  var t = {};
  function r(i) {
    if (t[i]) return t[i].exports;
    var n = (t[i] = { i: i, l: !1, exports: {} });
    return e[i].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
  }
  return (
    (r.m = e),
    (r.c = t),
    (r.d = function (e, t, i) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
    }),
    (r.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (r.t = function (e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var i = Object.create(null);
      if (
        (r.r(i),
        Object.defineProperty(i, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var n in e)
          r.d(
            i,
            n,
            function (t) {
              return e[t];
            }.bind(null, n)
          );
      return i;
    }),
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, "a", t), t;
    }),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ""),
    r((r.s = 3))
  );
})([
  function (e, t, r) {
    const i = r(1),
      n = r(5);
    e.exports = { DFU: i, DFUse: n };
  },
  function (e, t, r) {
    "use strict";
    class i {
      static get DETACH() {
        return 0;
      }
      static get DNLOAD() {
        return 1;
      }
      static get UPLOAD() {
        return 2;
      }
      static get GETSTATUS() {
        return 3;
      }
      static get CLRSTATUS() {
        return 4;
      }
      static get GETSTATE() {
        return 5;
      }
      static get ABORT() {
        return 6;
      }
      static get appIDLE() {
        return 0;
      }
      static get appDETACH() {
        return 1;
      }
      static get dfuIDLE() {
        return 2;
      }
      static get dfuDNLOAD_SYNC() {
        return 3;
      }
      static get dfuDNBUSY() {
        return 4;
      }
      static get dfuDNLOAD_IDLE() {
        return 5;
      }
      static get dfuMANIFEST_SYNC() {
        return 6;
      }
      static get dfuMANIFEST() {
        return 7;
      }
      static get dfuMANIFEST_WAIT_RESET() {
        return 8;
      }
      static get dfuUPLOAD_IDLE() {
        return 9;
      }
      static get dfuERROR() {
        return 10;
      }
      static get STATUS_OK() {
        return 0;
      }
      static findDeviceDfuInterfaces(e) {
        let t = [];
        for (let r of e.configurations)
          for (let e of r.interfaces)
            for (let i of e.alternates)
              if (
                254 === i.interfaceClass &&
                1 === i.interfaceSubclass &&
                (1 === i.interfaceProtocol || 2 === i.interfaceProtocol)
              ) {
                let n = {
                  configuration: r,
                  interface: e,
                  alternate: i,
                  name: i.interfaceName,
                };
                t.push(n);
              }
        return t;
      }
      static findAllDfuInterfaces() {
        return navigator.usb.getDevices().then((e) => {
          let t = [];
          for (let r of e) {
            let e = i.findDeviceDfuInterfaces(r);
            for (let n of e) t.push(new i.Device(r, n));
          }
          return t;
        });
      }
      static parseDeviceDescriptor(e) {
        return {
          bLength: e.getUint8(0),
          bDescriptorType: e.getUint8(1),
          bcdUSB: e.getUint16(2, !0),
          bDeviceClass: e.getUint8(4),
          bDeviceSubClass: e.getUint8(5),
          bDeviceProtocol: e.getUint8(6),
          bMaxPacketSize: e.getUint8(7),
          idVendor: e.getUint16(8, !0),
          idProduct: e.getUint16(10, !0),
          bcdDevice: e.getUint16(12, !0),
          iManufacturer: e.getUint8(14),
          iProduct: e.getUint8(15),
          iSerialNumber: e.getUint8(16),
          bNumConfigurations: e.getUint8(17),
        };
      }
      static parseConfigurationDescriptor(e) {
        let t = new DataView(e.buffer.slice(9)),
          r = i.parseSubDescriptors(t);
        return {
          bLength: e.getUint8(0),
          bDescriptorType: e.getUint8(1),
          wTotalLength: e.getUint16(2, !0),
          bNumInterfaces: e.getUint8(4),
          bConfigurationValue: e.getUint8(5),
          iConfiguration: e.getUint8(6),
          bmAttributes: e.getUint8(7),
          bMaxPower: e.getUint8(8),
          descriptors: r,
        };
      }
      static parseInterfaceDescriptor(e) {
        return {
          bLength: e.getUint8(0),
          bDescriptorType: e.getUint8(1),
          bInterfaceNumber: e.getUint8(2),
          bAlternateSetting: e.getUint8(3),
          bNumEndpoints: e.getUint8(4),
          bInterfaceClass: e.getUint8(5),
          bInterfaceSubClass: e.getUint8(6),
          bInterfaceProtocol: e.getUint8(7),
          iInterface: e.getUint8(8),
          descriptors: [],
        };
      }
      static parseFunctionalDescriptor(e) {
        return {
          bLength: e.getUint8(0),
          bDescriptorType: e.getUint8(1),
          bmAttributes: e.getUint8(2),
          wDetachTimeOut: e.getUint16(3, !0),
          wTransferSize: e.getUint16(5, !0),
          bcdDFUVersion: e.getUint16(7, !0),
        };
      }
      static parseSubDescriptors(e) {
        let t,
          r = e,
          n = [],
          a = !1;
        for (; r.byteLength > 2; ) {
          let e = r.getUint8(0),
            s = r.getUint8(1),
            o = new DataView(r.buffer.slice(0, e));
          if (4 === s)
            (t = i.parseInterfaceDescriptor(o)),
              (a = 254 === t.bInterfaceClass && 1 === t.bInterfaceSubClass),
              n.push(t);
          else if (a && 33 === s) {
            let e = i.parseFunctionalDescriptor(o);
            n.push(e), t.descriptors.push(e);
          } else {
            let r = { bLength: e, bDescriptorType: s, data: o };
            n.push(r), t && t.descriptors.push(r);
          }
          r = new DataView(r.buffer.slice(e));
        }
        return n;
      }
    }
    (i.Device = class {
      constructor(e, t) {
        (this.device_ = e),
          (this.settings = t),
          (this.intfNumber = t.interface.interfaceNumber),
          (this.dnload = this.download),
          (this.clrStatus = this.clearStatus);
      }
      logDebug(e) {
        console.debug(e);
      }
      logInfo(e) {
        console.info(e);
      }
      logWarning(e) {
        console.warn(e);
      }
      logError(e) {
        console.error(e);
      }
      logProgress(e, t) {
        void 0 === t ? this.logDebug(e) : this.logDebug(e + "/" + t);
      }
      async open() {
        await this.device_.open();
        const e = this.settings.configuration.configurationValue;
        (null !== this.device_.configuration &&
          this.device_.configuration.configurationValue === e) ||
          (await this.device_.selectConfiguration(e));
        const t = this.settings.interface.interfaceNumber;
        this.device_.configuration.interfaces[t].claimed ||
          (await this.device_.claimInterface(t));
        const r = this.settings.alternate.alternateSetting;
        let i = this.device_.configuration.interfaces[t];
        (null !== i.alternate && i.alternate.alternateSetting === r) ||
          (await this.device_.selectAlternateInterface(t, r));
      }
      async close() {
        try {
          await this.device_.close();
        } catch (e) {
          console.log(e);
        }
      }
      readDeviceDescriptor() {
        return this.device_
          .controlTransferIn(
            {
              requestType: "standard",
              recipient: "device",
              request: 6,
              value: 256,
              index: 0,
            },
            18
          )
          .then((e) =>
            "ok" === e.status
              ? Promise.resolve(e.data)
              : Promise.reject(e.status)
          );
      }
      async readStringDescriptor(e, t) {
        void 0 === t && (t = 0);
        const r = {
          requestType: "standard",
          recipient: "device",
          request: 6,
          value: 768 | e,
          index: t,
        };
        var i = await this.device_.controlTransferIn(r, 1);
        if ("ok" === i.status) {
          const e = i.data.getUint8(0);
          if (
            "ok" === (i = await this.device_.controlTransferIn(r, e)).status
          ) {
            const r = (e - 2) / 2;
            let n = [];
            for (let e = 0; e < r; e++) n.push(i.data.getUint16(2 + 2 * e, !0));
            return 0 === t ? n : String.fromCharCode.apply(String, n);
          }
        }
        throw new Error(`Failed to read string descriptor ${e}: ${i.status}`);
      }
      async readInterfaceNames() {
        let e = {},
          t = new Set();
        for (let r = 0; r < this.device_.configurations.length; r++) {
          const n = await this.readConfigurationDescriptor(r);
          let a = i.parseConfigurationDescriptor(n),
            s = a.bConfigurationValue;
          e[s] = {};
          for (let r of a.descriptors)
            4 === r.bDescriptorType &&
              (r.bInterfaceNumber in e[s] || (e[s][r.bInterfaceNumber] = {}),
              (e[s][r.bInterfaceNumber][r.bAlternateSetting] = r.iInterface),
              r.iInterface > 0 && t.add(r.iInterface));
        }
        let r = {};
        for (let e of t)
          try {
            r[e] = await this.readStringDescriptor(e, 1033);
          } catch (t) {
            console.log(t), (r[e] = null);
          }
        for (let t in e)
          for (let i in e[t])
            for (let n in e[t][i]) {
              const a = e[t][i][n];
              e[t][i][n] = r[a];
            }
        return e;
      }
      readConfigurationDescriptor(e) {
        const t = 512 | e;
        return this.device_
          .controlTransferIn(
            {
              requestType: "standard",
              recipient: "device",
              request: 6,
              value: t,
              index: 0,
            },
            4
          )
          .then((e) => {
            if ("ok" === e.status) {
              let r = e.data.getUint16(2, !0);
              return this.device_.controlTransferIn(
                {
                  requestType: "standard",
                  recipient: "device",
                  request: 6,
                  value: t,
                  index: 0,
                },
                r
              );
            }
            return Promise.reject(e.status);
          })
          .then((e) =>
            "ok" === e.status
              ? Promise.resolve(e.data)
              : Promise.reject(e.status)
          );
      }
      requestOut(e, t, r = 0) {
        return this.device_
          .controlTransferOut(
            {
              requestType: "class",
              recipient: "interface",
              request: e,
              value: r,
              index: this.intfNumber,
            },
            t
          )
          .then(
            (e) =>
              "ok" === e.status
                ? Promise.resolve(e.bytesWritten)
                : Promise.reject(e.status),
            (e) => Promise.reject("ControlTransferOut failed: " + e)
          );
      }
      requestIn(e, t, r = 0) {
        return this.device_
          .controlTransferIn(
            {
              requestType: "class",
              recipient: "interface",
              request: e,
              value: r,
              index: this.intfNumber,
            },
            t
          )
          .then(
            (e) =>
              "ok" === e.status
                ? Promise.resolve(e.data)
                : Promise.reject(e.status),
            (e) => (
              console.error(e), Promise.reject("ControlTransferIn failed: " + e)
            )
          );
      }
      detach() {
        return this.requestOut(i.DETACH, void 0, 1e3);
      }
      async waitDisconnected(e) {
        let t = this,
          r = this.device_;
        return new Promise(function (i, n) {
          let a;
          e > 0 && (a = setTimeout(n, e)),
            navigator.usb.addEventListener("disconnect", function n(s) {
              s.device === r &&
                (e > 0 && clearTimeout(a),
                (t.disconnected = !0),
                navigator.usb.removeEventListener("disconnect", n),
                s.stopPropagation(),
                i(t));
            });
        });
      }
      download(e, t) {
        return this.requestOut(i.DNLOAD, e, t);
      }
      upload(e, t) {
        return this.requestIn(i.UPLOAD, e, t);
      }
      clearStatus() {
        return this.requestOut(i.CLRSTATUS);
      }
      getStatus() {
        return this.requestIn(i.GETSTATUS, 6).then(
          (e) =>
            Promise.resolve({
              status: e.getUint8(0),
              pollTimeout: 16777215 & e.getUint32(1, !0),
              state: e.getUint8(4),
            }),
          (e) => Promise.reject("DFU GETSTATUS failed: " + e)
        );
      }
      getState() {
        return this.requestIn(i.GETSTATE, 1).then(
          (e) => Promise.resolve(e.getUint8(0)),
          (e) => Promise.reject("DFU GETSTATE failed: " + e)
        );
      }
      abort() {
        return this.requestOut(i.ABORT);
      }
      async abortToIdle() {
        await this.abort();
        let e = await this.getState();
        if (
          (e === i.dfuERROR &&
            (await this.clearStatus(), (e = await this.getState())),
          e !== i.dfuIDLE)
        )
          throw new Error(
            "Failed to return to idle state after abort: state " + e.state
          );
      }
      async do_upload(e, t = 1 / 0, r = 0) {
        let i,
          n,
          a = r,
          s = [],
          o = 0;
        this.logInfo("Copying data from DFU device to browser"),
          this.logProgress(0);
        do {
          (n = Math.min(e, t - o)),
            (i = await this.upload(n, a++)),
            this.logDebug("Read " + i.byteLength + " bytes"),
            i.byteLength > 0 && (s.push(i), (o += i.byteLength)),
            Number.isFinite(t) ? this.logProgress(o, t) : this.logProgress(o);
        } while (o < t && i.byteLength === n);
        return (
          o === t && (await this.abortToIdle()),
          this.logInfo(`Read ${o} bytes`),
          new Blob(s, { type: "application/octet-stream" })
        );
      }
      async poll_until(e) {
        let t = await this.getStatus(),
          r = this;
        function n(e) {
          return new Promise(function (t, i) {
            r.logDebug("Sleeping for " + e + "ms"), setTimeout(t, e);
          });
        }
        for (; !e(t.state) && t.state !== i.dfuERROR; )
          await n(t.pollTimeout), (t = await this.getStatus());
        return t;
      }
      poll_until_idle(e) {
        return this.poll_until((t) => t === e);
      }
      async do_download(e, t, r) {
        let n = 0,
          a = t.byteLength,
          s = 0;
        for (
          this.logInfo("Copying data from browser to DFU device"),
            this.logProgress(n, a);
          n < a;

        ) {
          const r = a - n,
            o = Math.min(r, e);
          let c,
            l = 0;
          try {
            (l = await this.download(t.slice(n, n + o), s++)),
              this.logDebug("Sent " + l + " bytes"),
              (c = await this.poll_until_idle(i.dfuDNLOAD_IDLE));
          } catch (e) {
            throw new Error("Error during DFU download: " + e);
          }
          if (c.status !== i.STATUS_OK)
            throw new Error(
              `DFU DOWNLOAD failed state=${c.state}, status=${c.status}`
            );
          this.logDebug("Wrote " + l + " bytes"),
            (n += l),
            this.logProgress(n, a);
        }
        this.logDebug("Sending empty block");
        try {
          await this.download(new ArrayBuffer([]), s++);
        } catch (e) {
          throw new Error("Error during final DFU download: " + e);
        }
        if (
          (this.logInfo("Wrote " + n + " bytes"),
          this.logInfo("Manifesting new firmware"),
          r)
        ) {
          let e;
          try {
            if (
              ((e = await this.poll_until(
                (e) => e === i.dfuIDLE || e === i.dfuMANIFEST_WAIT_RESET
              )),
              e.state === i.dfuMANIFEST_WAIT_RESET &&
                this.logDebug(
                  "Device transitioned to MANIFEST_WAIT_RESET even though it is manifestation tolerant"
                ),
              e.status !== i.STATUS_OK)
            )
              throw new Error(
                `DFU MANIFEST failed state=${e.state}, status=${e.status}`
              );
          } catch (e) {
            if (
              !e.endsWith(
                "ControlTransferIn failed: NotFoundError: Device unavailable."
              ) &&
              !e.endsWith(
                "ControlTransferIn failed: NotFoundError: The device was disconnected."
              )
            )
              throw new Error("Error during DFU manifest: " + e);
            this.logWarning("Unable to poll final manifestation status");
          }
        } else
          try {
            let e = await this.getStatus();
            this.logDebug(
              `Final DFU status: state=${e.state}, status=${e.status}`
            );
          } catch (e) {
            this.logDebug("Manifest GET_STATUS poll error: " + e);
          }
        try {
          await this.device_.reset();
        } catch (e) {
          if (
            "NetworkError: Unable to reset the device." !== e &&
            "NotFoundError: Device unavailable." !== e &&
            "NotFoundError: The device was disconnected." !== e
          )
            throw new Error("Error during reset for manifestation: " + e);
          this.logDebug("Ignored reset error");
        }
      }
    }),
      (e.exports = i);
  },
  function (e, t) {
    function r(e, t) {
      if (!e && !t)
        throw new Error(
          "Please specify valid arguments for parameters a and b."
        );
      if (!t || 0 === t.length) return e;
      if (!e || 0 === e.length) return t;
      if (
        Object.prototype.toString.call(e) !== Object.prototype.toString.call(t)
      )
        throw new Error(
          "The types of the two arguments passed for parameters a and b do not match."
        );
      var r = new e.constructor(e.length + t.length);
      return r.set(e), r.set(t, e.length), r;
    }
    e.exports =
      /**
       * Class to parse and reconstruct the numworks' internal storage.
       * Only parses python scripts for now, ditches the rest.
       * @TODO parse other things.
       *
       * @author Maxime "M4x1m3" FRIESS
       * @license MIT
       */
      class {
        constructor() {
          (this.magik = null), (this.records = null);
        }
        async __encodePyRecord(e) {
          var t = new TextEncoder("utf-8").encode(e.code);
          return (
            (e.data = new Blob([
              r(
                new Uint8Array([e.autoImport ? 1 : 0]),
                r(t, new Uint8Array([0]))
              ),
            ])),
            delete e.autoImport,
            delete e.code,
            e
          );
        }
        __getRecordEncoders() {
          return { py: this.__encodePyRecord.bind(this) };
        }
        async __assembleStorage(e, t) {
          const i = new TextEncoder();
          var n = new Uint8Array([186, 221, 11, 238]);
          for (var a in e) {
            var s = e[a],
              o = s.name + "." + s.type,
              c = r(i.encode(o), new Uint8Array([0])),
              l = r(c, new Uint8Array(await s.data.arrayBuffer()));
            if (
              ((l = r(new Uint8Array([255, 255]), l)),
              new DataView(l.buffer).setUint16(0, l.length, !0),
              n.length + l.length + 2 > t)
            )
              throw (
                (console.error("Too much data!"), new Error("Too much data!"))
              );
            n = r(n, l);
          }
          return (n = r(n, new Uint8Array([0, 0]))), new Blob([n]);
        }
        async __encodeRecord(e) {
          var t = this.__getRecordEncoders();
          return e.type in t && (e = t[e.type](e)), e;
        }
        async encodeStorage(e) {
          var t = Object.assign({}, this.records);
          for (var r in this.records) t[r] = await this.__encodeRecord(t[r]);
          return await this.__assembleStorage(t, e);
        }
        async __sliceStorage(e) {
          var t = new DataView(await e.arrayBuffer());
          if (3135048686 === t.getUint32(0, !1)) {
            var r = 4,
              i = [];
            do {
              var n = t.getUint16(r, !0);
              if (0 === n) break;
              var a = this.__readString(t, r + 2, n - 2),
                s = e.slice(r + 2 + a.size, r + n),
                o = {
                  name: a.content.split(/\.(?=[^\.]+$)/)[0],
                  type: a.content.split(/\.(?=[^\.]+$)/)[1],
                  data: s,
                };
              i.push(o), (r += n);
            } while (0 !== n && r < e.size);
            return i;
          }
          return {};
        }
        __readString(e, t, r) {
          var i = "",
            n = 0;
          for (n = 0; n < r || 0 === r; n++) {
            var a = e.getUint8(t + n);
            if (0 === a) break;
            i += String.fromCharCode(a);
          }
          return { size: n + 1, content: i };
        }
        async __parsePyRecord(e) {
          var t = new DataView(await e.data.arrayBuffer());
          return (
            (e.autoImport = 0 !== t.getUint8(0)),
            (e.code = this.__readString(t, 1, e.data.size - 1).content),
            delete e.data,
            e
          );
        }
        __getRecordParsers() {
          return { py: this.__parsePyRecord.bind(this) };
        }
        async __parseRecord(e) {
          var t = this.__getRecordParsers();
          return e.type in t && (e = t[e.type](e)), e;
        }
        async parseStorage(e) {
          var t = new DataView(await e.arrayBuffer());
          if (
            ((this.magik = 3135048686 === t.getUint32(0, !1)),
            (this.records = {}),
            this.magik)
          )
            for (var r in ((this.records = await this.__sliceStorage(e)),
            this.records))
              this.records[r] = await this.__parseRecord(this.records[r]);
        }
      };
  },
  function (e, t, r) {
    const i = r(4);
    e.exports = i;
  },
  function (e, t, r) {
    var i = r(0),
      n = i.DFU,
      a = i.DFUse,
      s = r(2),
      o = r(6);
    /**
     * Class handling communication with a Numworks
     * calculator using WebUSB and the WebDFU lib.
     *
     * @author Maxime "M4x1m3" FRIESS
     * @license MIT
     */
    class c {
      constructor() {
        (this.device = null),
          (this.transferSize = 2048),
          (this.manifestationTolerant = !1),
          (this.autoconnectId = null);
      }
      getModel(e = !0) {
        var t = 0,
          r = 0;
        for (let e = 0; e < this.device.memoryInfo.segments.length; e++)
          this.device.memoryInfo.segments[e].start >= 134217728 &&
            this.device.memoryInfo.segments[e].start <= 135266303 &&
            (t +=
              this.device.memoryInfo.segments[e].end -
              this.device.memoryInfo.segments[e].start),
            this.device.memoryInfo.segments[e].start >= 2415919104 &&
              this.device.memoryInfo.segments[e].start <= 2684354559 &&
              (r +=
                this.device.memoryInfo.segments[e].end -
                this.device.memoryInfo.segments[e].start);
        return "Upsilon Bootloader" == this.device.device_.productName
          ? "0110"
          : "Upsilon Calculator" == this.device.device_.productName
          ? r
            ? "0110"
            : "0100"
          : 65536 === t || 0 === t
          ? 0 === r
            ? e
              ? "????"
              : "0110-0M"
            : 8388608 === r
            ? "0110"
            : 16777216 === r
            ? e
              ? "0110"
              : "0110-16M"
            : "????"
          : 1048576 === t
          ? 0 === r
            ? "0100"
            : 8388608 === r
            ? e
              ? "0100"
              : "0100-8M"
            : 16777216 === r
            ? e
              ? "0100"
              : "0100-16M"
            : "????"
          : "????";
      }
      async flashInternal(e) {
        (this.device.startAddress = 134217728),
          await this.device.do_download(this.transferSize, e, !0);
      }
      async flashExternal(e) {
        (this.device.startAddress = 2415919104),
          await this.device.do_download(this.transferSize, e, !1);
      }
      async __getDFUDescriptorProperties(e) {
        return e.readConfigurationDescriptor(0).then(
          (t) => {
            let r = n.parseConfigurationDescriptor(t),
              i = null,
              a = e.settings.configuration.configurationValue;
            if (r.bConfigurationValue === a)
              for (let e of r.descriptors)
                if (
                  33 === e.bDescriptorType &&
                  e.hasOwnProperty("bcdDFUVersion")
                ) {
                  i = e;
                  break;
                }
            return i
              ? {
                  WillDetach: 0 != (8 & i.bmAttributes),
                  ManifestationTolerant: 0 != (4 & i.bmAttributes),
                  CanUpload: 0 != (2 & i.bmAttributes),
                  CanDnload: 0 != (1 & i.bmAttributes),
                  TransferSize: i.wTransferSize,
                  DetachTimeOut: i.wDetachTimeOut,
                  DFUVersion: i.bcdDFUVersion,
                }
              : {};
          },
          (e) => {}
        );
      }
      async detect(e, t) {
        var r = this;
        await navigator.usb
          .requestDevice({ filters: [{ vendorId: 1155, productId: 41617 }] })
          .then(async (t) => {
            let i = n.findDeviceDfuInterfaces(t);
            await r.__fixInterfaceNames(t, i),
              (r.device = await r.__connect(new n.Device(t, i[0]))),
              e();
          })
          .catch((e) => {
            t(e);
          });
      }
      async __connect(e) {
        try {
          await e.open();
        } catch (e) {
          throw e;
        }
        let t = {};
        try {
          t = await this.__getDFUDescriptorProperties(e);
        } catch (e) {
          throw e;
        }
        return (
          t &&
            Object.keys(t).length > 0 &&
            ((e.properties = t),
            (this.transferSize = t.TransferSize),
            t.CanDnload &&
              (this.manifestationTolerant = t.ManifestationTolerant),
            (256 !== t.DFUVersion && 282 !== t.DFUVersion) ||
              2 !== e.settings.alternate.interfaceProtocol ||
              ((e = new a.Device(e.device_, e.settings)).memoryInfo &&
                e.memoryInfo.segments.unshift({
                  start: 536870912,
                  sectorSize: 1024,
                  end: 537133056,
                  readable: !0,
                  erasable: !1,
                  writable: !0,
                }))),
          (e.logDebug = console.log),
          (e.logInfo = console.info),
          (e.logWarning = console.warn),
          (e.logError = console.error),
          (e.logProgress = console.log),
          e
        );
      }
      __readFString(e, t, r) {
        for (var i = "", n = 0; n < r; n++) {
          var a = e.getUint8(t + n);
          if (0 === a) break;
          i += String.fromCharCode(a);
        }
        return i;
      }
      __parsePlatformInfo(e, t, r) {
        var i = new DataView(e),
          n = {};
        const a = [4027433182, 4276994270];
        n.magik = i.getUint32(0, !1);
        let s = !1;
        for (var o = 0; o < a.length; o++)
          if (n.magik === a[o]) {
            s = !0;
            break;
          }
        if ((s || (n.magik = !1), n.magik))
          if (
            ((n.oldplatform = !1),
            r || (n.oldplatform = !(i.getUint32(28, !1) === n.magik)),
            (n.omega = {}),
            n.oldplatform)
          ) {
            (n.omega.installed =
              i.getUint32(36, !1) === n.magik ||
              3735928559 === i.getUint32(44, !1) ||
              3735928559 === i.getUint32(60, !1)),
              n.omega.installed &&
                ((n.omega.version = this.__readFString(i, 12, 16)),
                (n.omega.user = "")),
              (n.version = this.__readFString(i, 4, 8));
            var c = 0;
            i.getUint32(36, !1) === n.magik
              ? (c = 8)
              : i.getUint32(44, !1) === n.magik
              ? (c = 16)
              : i.getUint32(60, !1) === n.magik && (c = 32),
              (n.commit = this.__readFString(i, 12 + c, 8)),
              (n.storage = {}),
              (n.storage.address = i.getUint32(20 + c, !0)),
              (n.storage.size = i.getUint32(24 + c, !0));
          } else {
            let e = 40;
            (n.omega.installed =
              3735928559 === i.getUint32(e, !1) &&
              3735928559 === i.getUint32(e + 36, !1)),
              n.omega.installed ||
                ((e = 32),
                (n.omega.installed =
                  3735928559 === i.getUint32(e, !1) &&
                  3735928559 === i.getUint32(e + 36, !1))),
              n.omega.installed &&
                ((n.omega.version = this.__readFString(i, e + 4, 16)),
                (n.omega.user = this.__readFString(i, e + 20, 16)));
            let a = e + 40;
            (n.upsilon = {}),
              (n.upsilon.installed =
                1769173077 === i.getUint32(a, !1) &&
                1769173077 === i.getUint32(a + 24, !1)),
              n.upsilon.installed &&
                ((n.upsilon.version = this.__readFString(i, a + 4, 16)),
                (n.upsilon.osType = i.getUint32(a + 20, !1)),
                2020704889 == n.upsilon.osType
                  ? (n.upsilon.official = !0)
                  : (n.upsilon.official = !1)),
              (n.version = this.__readFString(i, 4, 8)),
              (n.storage = {}),
              r
                ? t
                  ? ((n.commit = this.__readFString(i, 12, 8)),
                    i.getUint32(20, !1) !== n.magik &&
                      console.warn(
                        "PlatformInfo is not valid, end magic is not present at the end of the Kernel header"
                      ))
                  : ((n.storage.address = i.getUint32(12, !0)),
                    (n.storage.size = i.getUint32(16, !0)),
                    (n.external = {}),
                    (n.external.flashStart = i.getUint32(20, !0)),
                    (n.external.flashEnd = i.getUint32(24, !0)),
                    (n.external.flashSize =
                      n.external.flashEnd - n.external.flashStart),
                    (n.external.ramStart = i.getUint32(28, !0)),
                    (n.external.ramEnd = i.getUint32(32, !0)),
                    (n.external.ramSize =
                      n.external.ramEnd - n.external.ramStart),
                    i.getUint32(36, !1) !== n.magik &&
                      console.warn(
                        "PlatformInfo is not valid, end magic is not present at the end of the Userland info"
                      ))
                : ((n.commit = this.__readFString(i, 12, 8)),
                  (n.storage.address = i.getUint32(20, !0)),
                  (n.storage.size = i.getUint32(24, !0)));
          }
        else n.omega = !1;
        return n;
      }
      __parseSlotInfo(e) {
        var t = new DataView(e);
        let r = { slot: {} };
        if (((r.slot.magik = 3134975727 == t.getUint32(0, !1)), r.slot.magik)) {
          3134975727 !== t.getUint32(12, !1) &&
            console.warn(
              "SlotInfo is not valid, end magic is not present at the end of the slot info"
            ),
            (r.slot.kernelHeader = t.getUint32(4, !0)),
            (r.slot.userlandHeader = t.getUint32(8, !0));
          const e = { 2415919104: "A", 2420113408: "B", 2417491968: "Khi" };
          let i = r.slot.kernelHeader - 8;
          (r.slot.name = e[i]),
            null == r.slot.name &&
              console.warn(
                "Slot name is not valid, the kernel header is not in the list"
              );
        }
        return r;
      }
      async getPlatformInfo() {
        let e = {};
        this.device.startAddress = 536870912;
        let t = await this.device.do_upload(this.transferSize, 100),
          r = this.__parseSlotInfo(await t.arrayBuffer());
        if (r.slot.magik) {
          (this.device.startAddress = r.slot.userlandHeader),
            (t = await this.device.do_upload(this.transferSize, 296)),
            (e = this.__parsePlatformInfo(await t.arrayBuffer(), !1, !0)),
            (e.mode = "bootloader"),
            (this.device.startAddress = r.slot.kernelHeader),
            (t = await this.device.do_upload(this.transferSize, 100));
          let i = this.__parsePlatformInfo(await t.arrayBuffer(), !0, !0);
          e.commit = i.commit;
        } else if (!e.magik) {
          this.device.startAddress = 134218180;
          const t = await this.device.do_upload(this.transferSize, 296);
          return (
            (e = this.__parsePlatformInfo(await t.arrayBuffer(), !0, !1)),
            (e.mode = "legacy"),
            e
          );
        }
        return (e.slot = r.slot), e;
      }
      async __autoConnectDevice(e) {
        let t = n.findDeviceDfuInterfaces(e.device_);
        return (
          await this.__fixInterfaceNames(e.device_, t),
          (e = await this.__connect(new n.Device(e.device_, t[0])))
        );
      }
      autoConnect(e, t) {
        var r = this;
        n.findAllDfuInterfaces().then(async (i) => {
          let n = r.__findMatchingDevices(1155, 41617, t, i);
          0 !== n.length &&
            (this.stopAutoConnect(),
            (this.device = await this.__autoConnectDevice(n[0])),
            await e());
        }),
          (this.autoconnectId = setTimeout(
            this.autoConnect.bind(this, e, t),
            1e3
          ));
      }
      stopAutoConnect() {
        null !== this.autoconnectId &&
          (clearTimeout(this.autoconnectId), (this.autoconnectId = null));
      }
      async __fixInterfaceNames(e, t) {
        if (t.some((e) => null === e.name)) {
          let r = new n.Device(e, t[0]);
          await r.device_.open();
          let i = await r.readInterfaceNames();
          await r.close();
          for (let e of t)
            if (null === e.name) {
              let t = e.configuration.configurationValue,
                r = e.interface.interfaceNumber,
                n = e.alternate.alternateSetting;
              e.name = i[t][r][n];
            }
        }
      }
      __findMatchingDevices(e, t, r, i) {
        let n = [];
        for (let a of i)
          r
            ? a.device_.serialNumber === r && n.push(a)
            : ((!t && e > 0 && a.device_.vendorId === e) ||
                (!e && t > 0 && a.device_.productId === t) ||
                (e > 0 &&
                  t > 0 &&
                  a.device_.vendorId === e &&
                  a.device_.productId === t)) &&
              n.push(a);
        return n;
      }
      async __retrieveStorage(e, t) {
        return (
          (this.device.startAddress = e),
          await this.device.do_upload(this.transferSize, t + 8)
        );
      }
      async __flashStorage(e, t) {
        (this.device.startAddress = e),
          await this.device.do_download(this.transferSize, t, !1);
      }
      async installStorage(e, t) {
        let r = await this.getPlatformInfo(),
          i = await e.encodeStorage(r.storage.size);
        await this.__flashStorage(r.storage.address, await i.arrayBuffer()),
          t();
      }
      async backupStorage() {
        let e = await this.getPlatformInfo(),
          t = await this.__retrieveStorage(e.storage.address, e.storage.size),
          r = new c.Storage();
        return await r.parseStorage(t), r;
      }
      onUnexpectedDisconnect(e, t) {
        null !== this.device &&
          null !== this.device.device_ &&
          this.device.device_ === e.device &&
          ((this.device.disconnected = !0), t(e), (this.device = null));
      }
    }
    (c.Recovery = o), (c.Storage = s), (e.exports = c);
  },
  function (e, t, r) {
    "use strict";
    const i = r(1);
    class n extends i {
      static get GET_COMMANDS() {
        return 0;
      }
      static get SET_ADDRESS() {
        return 33;
      }
      static get ERASE_SECTOR() {
        return 65;
      }
      static parseMemoryDescriptor(e) {
        const t = e.indexOf("/");
        if (!e.startsWith("@") || -1 === t)
          throw new Error(`Not a DfuSe memory descriptor: "${e}"`);
        const r = e.substring(1, t).trim(),
          i = e.substring(t);
        let n = [];
        const a = { " ": 1, B: 1, K: 1024, M: 1048576 };
        let s,
          o =
            /\/\s*(0x[0-9a-fA-F]{1,8})\s*\/(\s*[0-9]+\s*\*\s*[0-9]+\s?[ BKM]\s*[abcdefg]\s*,?\s*)+/g;
        for (; (s = o.exec(i)); ) {
          let e,
            t = /([0-9]+)\s*\*\s*([0-9]+)\s?([ BKM])\s*([abcdefg])\s*,?\s*/g,
            r = parseInt(s[1], 16);
          for (; (e = t.exec(s[0])); ) {
            let t = {},
              i = parseInt(e[1], 10),
              s = parseInt(e[2]) * a[e[3]],
              o = e[4].charCodeAt(0) - "a".charCodeAt(0) + 1;
            (t.start = r),
              (t.sectorSize = s),
              (t.end = r + s * i),
              (t.readable = 0 != (1 & o)),
              (t.erasable = 0 != (2 & o)),
              (t.writable = 0 != (4 & o)),
              n.push(t),
              (r += s * i);
          }
        }
        return { name: r, segments: n };
      }
    }
    (n.Device = class extends i.Device {
      constructor(e, t) {
        super(e, t),
          (this.memoryInfo = null),
          (this.startAddress = NaN),
          t.name && (this.memoryInfo = n.parseMemoryDescriptor(t.name));
      }
      async dfuseCommand(e, t, r) {
        void 0 === t && void 0 === r && ((t = 0), (r = 1));
        const n = { 0: "GET_COMMANDS", 33: "SET_ADDRESS", 65: "ERASE_SECTOR" };
        let a = new ArrayBuffer(r + 1),
          s = new DataView(a);
        if ((s.setUint8(0, e), 1 === r)) s.setUint8(1, t);
        else {
          if (4 !== r)
            throw new Error("Don't know how to handle data of len " + r);
          s.setUint32(1, t, !0);
        }
        try {
          await this.download(a, 0);
        } catch (t) {
          throw new Error(
            "Error during special DfuSe command " + n[e] + ":" + t
          );
        }
        if (
          (await this.poll_until((e) => e !== i.dfuDNBUSY)).status !==
          i.STATUS_OK
        )
          throw new Error("Special DfuSe command " + n[e] + " failed");
      }
      getSegment(e) {
        if (!this.memoryInfo || !this.memoryInfo.segments)
          throw new Error("No memory map information available");
        for (let t of this.memoryInfo.segments)
          if (t.start <= e && e < t.end) return t;
        return null;
      }
      getSectorStart(e, t) {
        if ((void 0 === t && (t = this.getSegment(e)), !t))
          throw new Error(`Address ${e.toString(16)} outside of memory map`);
        const r = Math.floor((e - t.start) / t.sectorSize);
        return t.start + r * t.sectorSize;
      }
      getSectorEnd(e, t) {
        if ((void 0 === t && (t = this.getSegment(e)), !t))
          throw new Error(`Address ${e.toString(16)} outside of memory map`);
        const r = Math.floor((e - t.start) / t.sectorSize);
        return t.start + (r + 1) * t.sectorSize;
      }
      getFirstWritableSegment() {
        if (!this.memoryInfo || !this.memoryInfo.segments)
          throw new Error("No memory map information available");
        for (let e of this.memoryInfo.segments) if (e.writable) return e;
        return null;
      }
      getMaxReadSize(e) {
        if (!this.memoryInfo || !this.memoryInfo.segments)
          throw new Error("No memory map information available");
        let t = 0;
        for (let r of this.memoryInfo.segments)
          if (r.start <= e && e < r.end) {
            if (!r.readable) return 0;
            t += r.end - e;
          } else if (r.start === e + t) {
            if (!r.readable) break;
            t += r.end - r.start;
          }
        return t;
      }
      async erase(e, t) {
        let r = this.getSegment(e),
          i = this.getSectorStart(e, r);
        const a = this.getSectorEnd(e + t - 1);
        let s = 0;
        const o = a - i;
        for (o > 0 && this.logProgress(s, o); i < a; ) {
          if ((r.end <= i && (r = this.getSegment(i)), !r.erasable)) {
            (s = Math.min(s + r.end - i, o)),
              (i = r.end),
              this.logProgress(s, o);
            continue;
          }
          const e = Math.floor((i - r.start) / r.sectorSize),
            t = r.start + e * r.sectorSize;
          this.logDebug(`Erasing ${r.sectorSize}B at 0x${t.toString(16)}`),
            await this.dfuseCommand(n.ERASE_SECTOR, t, 4),
            (i = t + r.sectorSize),
            (s += r.sectorSize),
            this.logProgress(s, o);
        }
      }
      async do_download(e, t, r) {
        if (!this.memoryInfo || !this.memoryInfo.segments)
          throw new Error("No memory map available");
        this.logInfo("Erasing DFU device memory");
        let a = 0,
          s = t.byteLength,
          o = this.startAddress;
        isNaN(o)
          ? ((o = this.memoryInfo.segments[0].start),
            this.logWarning("Using inferred start address 0x" + o.toString(16)))
          : null === this.getSegment(o) &&
            this.logError(
              `Start address 0x${o.toString(16)} outside of memory map bounds`
            ),
          await this.erase(o, s),
          this.logInfo("Copying data from browser to DFU device");
        let c = o;
        for (; a < s; ) {
          const r = s - a,
            o = Math.min(r, e);
          let l,
            d = 0;
          try {
            await this.dfuseCommand(n.SET_ADDRESS, c, 4),
              this.logDebug("Set address to 0x" + c.toString(16)),
              (d = await this.download(t.slice(a, a + o), 2)),
              this.logDebug("Sent " + d + " bytes"),
              (l = await this.poll_until_idle(i.dfuDNLOAD_IDLE)),
              (c += o);
          } catch (e) {
            throw new Error("Error during DfuSe download: " + e);
          }
          if (l.status !== i.STATUS_OK)
            throw new Error(
              `DFU DOWNLOAD failed state=${l.state}, status=${l.status}`
            );
          this.logDebug("Wrote " + d + " bytes"),
            (a += d),
            this.logProgress(a, s);
        }
        if ((this.logInfo(`Wrote ${a} bytes`), r)) {
          this.logInfo("Manifesting new firmware");
          try {
            await this.dfuseCommand(n.SET_ADDRESS, o, 4),
              await this.download(new ArrayBuffer(), 2);
          } catch (e) {
            throw new Error("Error during DfuSe manifestation: " + e);
          }
          try {
            await this.poll_until((e) => e === i.dfuMANIFEST);
          } catch (e) {
            this.logError(e);
          }
        }
      }
      async do_upload(e, t) {
        let r = this.startAddress;
        return (
          isNaN(r)
            ? ((r = this.memoryInfo.segments[0].start),
              this.logWarning(
                "Using inferred start address 0x" + r.toString(16)
              ))
            : null === this.getSegment(r) &&
              this.logWarning(
                `Start address 0x${r.toString(16)} outside of memory map bounds`
              ),
          this.logInfo(
            `Reading up to 0x${t.toString(16)} bytes starting at 0x${r.toString(
              16
            )}`
          ),
          (await this.getState()) !== i.dfuIDLE && (await this.abortToIdle()),
          await this.dfuseCommand(n.SET_ADDRESS, r, 4),
          await this.abortToIdle(),
          await super.do_upload(e, t, 2)
        );
      }
    }),
      (e.exports = n);
  },
  function (e, t, r) {
    var i = r(0),
      n = i.DFU,
      a = i.DFUse;
    r(2);
    e.exports =
      /**
       * Class handling communication with a Numworks
       * calculator in Recovery Mode using WebUSB and the WebDFU lib.
       *
       * @author Maxime "M4x1m3" FRIESS
       * @license MIT
       */
      class {
        constructor() {
          (this.device = null),
            (this.transferSize = 2048),
            (this.manifestationTolerant = !1),
            (this.autoconnectId = null);
        }
        getModel(e = !0) {
          var t = 0;
          for (let e = 0; e < this.device.memoryInfo.segments.length; e++)
            this.device.memoryInfo.segments[e].start >= 134217728 &&
              this.device.memoryInfo.segments[e].start <= 135266303 &&
              (t +=
                this.device.memoryInfo.segments[e].end -
                this.device.memoryInfo.segments[e].start);
          return 524288 === t ? "0110" : 1048576 === t ? "0100" : "????";
        }
        async flashRecovery(e) {
          (this.device.startAddress = 537067520),
            await this.device.clearStatus(),
            await this.device.do_download(this.transferSize, e, !0);
        }
        async __getDFUDescriptorProperties(e) {
          return e.readConfigurationDescriptor(0).then(
            (t) => {
              let r = n.parseConfigurationDescriptor(t),
                i = null,
                a = e.settings.configuration.configurationValue;
              if (r.bConfigurationValue === a)
                for (let e of r.descriptors)
                  if (
                    33 === e.bDescriptorType &&
                    e.hasOwnProperty("bcdDFUVersion")
                  ) {
                    i = e;
                    break;
                  }
              return i
                ? {
                    WillDetach: 0 != (8 & i.bmAttributes),
                    ManifestationTolerant: 0 != (4 & i.bmAttributes),
                    CanUpload: 0 != (2 & i.bmAttributes),
                    CanDnload: 0 != (1 & i.bmAttributes),
                    TransferSize: i.wTransferSize,
                    DetachTimeOut: i.wDetachTimeOut,
                    DFUVersion: i.bcdDFUVersion,
                  }
                : {};
            },
            (e) => {}
          );
        }
        async detect(e, t) {
          var r = this;
          navigator.usb
            .requestDevice({ filters: [{ vendorId: 1155, productId: 57105 }] })
            .then(async (t) => {
              let i = n.findDeviceDfuInterfaces(t);
              await r.__fixInterfaceNames(t, i),
                (r.device = await r.__connect(new n.Device(t, i[0]))),
                e();
            })
            .catch((e) => {
              t(e);
            });
        }
        async __connect(e) {
          try {
            await e.open();
          } catch (e) {
            throw e;
          }
          let t = {};
          try {
            t = await this.__getDFUDescriptorProperties(e);
          } catch (e) {
            throw e;
          }
          return (
            t &&
              Object.keys(t).length > 0 &&
              ((e.properties = t),
              (this.transferSize = t.TransferSize),
              t.CanDnload &&
                (this.manifestationTolerant = t.ManifestationTolerant),
              (256 !== t.DFUVersion && 282 !== t.DFUVersion) ||
                2 !== e.settings.alternate.interfaceProtocol ||
                ((e = new a.Device(e.device_, e.settings)).memoryInfo &&
                  e.memoryInfo.segments.unshift({
                    start: 536870912,
                    sectorSize: 1024,
                    end: 537133056,
                    readable: !0,
                    erasable: !1,
                    writable: !0,
                  }))),
            (e.logDebug = console.log),
            (e.logInfo = console.info),
            (e.logWarning = console.warn),
            (e.logError = console.error),
            (e.logProgress = console.log),
            e
          );
        }
        async __autoConnectDevice(e) {
          let t = n.findDeviceDfuInterfaces(e.device_);
          return (
            await this.__fixInterfaceNames(e.device_, t),
            (e = await this.__connect(new n.Device(e.device_, t[0])))
          );
        }
        autoConnect(e, t) {
          var r = this;
          n.findAllDfuInterfaces().then(async (i) => {
            let n = r.__findMatchingDevices(1155, 57105, t, i);
            0 !== n.length &&
              (this.stopAutoConnect(),
              (this.device = await this.__autoConnectDevice(n[0])),
              await e());
          }),
            (this.autoconnectId = setTimeout(
              this.autoConnect.bind(this, e, t),
              1e3
            ));
        }
        stopAutoConnect() {
          null !== this.autoconnectId &&
            (clearTimeout(this.autoconnectId), (this.autoconnectId = null));
        }
        async __fixInterfaceNames(e, t) {
          if (t.some((e) => null === e.name)) {
            let r = new n.Device(e, t[0]);
            await r.device_.open();
            let i = await r.readInterfaceNames();
            await r.close();
            for (let e of t)
              if (null === e.name) {
                let t = e.configuration.configurationValue,
                  r = e.interface.interfaceNumber,
                  n = e.alternate.alternateSetting;
                e.name = i[t][r][n];
              }
          }
        }
        __findMatchingDevices(e, t, r, i) {
          let n = [];
          for (let a of i)
            r
              ? a.device_.serialNumber === r && n.push(a)
              : ((!t && e > 0 && a.device_.vendorId === e) ||
                  (!e && t > 0 && a.device_.productId === t) ||
                  (e > 0 &&
                    t > 0 &&
                    a.device_.vendorId === e &&
                    a.device_.productId === t)) &&
                n.push(a);
          return n;
        }
        async __retreiveStorage(e, t) {
          return (
            (this.device.startAddress = e),
            await this.device.do_upload(this.transferSize, t + 8)
          );
        }
        async __flashStorage(e, t) {
          (this.device.startAddress = e),
            await this.device.do_download(this.transferSize, t, !1);
        }
        onUnexpectedDisconnect(e, t) {
          null !== this.device &&
            null !== this.device.device_ &&
            this.device.device_ === e.device &&
            ((this.device.disconnected = !0), t(e), (this.device = null));
        }
      };
  },
]);

module.exports = { Numworks };
