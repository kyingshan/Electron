
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {

    generateConfig: (link: any) => electron.ipcRenderer.invoke('generate-config', link),
    readConfig: (filePath: any) => electron.ipcRenderer.invoke('read-config', filePath),
    startXray: () => electron.ipcRenderer.invoke('start-xray'),
    stopXray: () => electron.ipcRenderer.invoke('stop-xray'),
    runPowerShellCommand: (commands: any) => electron.ipcRenderer.invoke('run-power-shell', commands),
});