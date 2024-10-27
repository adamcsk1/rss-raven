const {
  app,
  BrowserWindow,
  globalShortcut,
  protocol,
  net,
} = require("electron");
const path = require("path");
const url = require("url");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "electron",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      //devTools: false,
    },
    //   autoHideMenuBar: true,
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "./assets/client/index.html"),
      protocol: "file:",
      slashes: true,
    }),
  );
};

app.whenReady().then(() => {
  globalShortcut.unregister("Command+R");
  globalShortcut.unregister("Ctrl+R");
  globalShortcut.unregister("Ctrl+Shift+R");
  globalShortcut.unregister("F5");

  protocol.handle("electron", (req) => {
    if (
      req.url.includes(
        "electron://rssr-raven.electron.localhost/api/v1/fetch-feed?url=",
      )
    ) {
      const url = decodeURIComponent(
        req.url.split(
          "electron://rssr-raven.electron.localhost/api/v1/fetch-feed?url=",
        )[1],
      );

      req.headers.delete("Authorization");
      req.headers.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36",
      );

      return net.fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
    }
  });

  createWindow();
});
