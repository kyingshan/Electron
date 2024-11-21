import { app, BrowserWindow, ipcMain } from "electron"
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { detectLinkType, parseVmessLink, parseTrojanLink, parseVlessLink, parseSsLink } from './parseLink.js';
import { generateConfig, saveConfigToFile } from './generateJsonFile.js';
import { runPowerShellCommand } from "./accessProxy.js";
import { ChildProcessByStdio, exec, spawn } from 'child_process';
import { Writable } from "stream";


let mainWindow;
let xrayProcess: ChildProcessByStdio<Writable, null, null> | null = null; // To store the running Xray process

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    });
    if (isDev()) 
        mainWindow.loadURL('http://localhost:5123/')
    else
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
}

function startXrayWithConfig(configPath: any, xrayPath: any) {
    // If Xray is already running, do not start a new instance
    if (xrayProcess) {
      console.log("Xray is already running.");
      return;
    }
  
    xrayProcess = spawn(xrayPath, [], { stdio: ['pipe', 'inherit', 'inherit'] });
  
    const configStream = fs.createReadStream(configPath);
    configStream.pipe(xrayProcess.stdin);
  
    xrayProcess.on('close', (code) => {
      console.log(`xray.exe exited with code ${code}`);
      xrayProcess = null; // Reset the process when it finishes
    });
  
    xrayProcess.on('error', (err) => {
      console.error(`Failed to start xray.exe:`, err);
      xrayProcess = null; // Reset in case of error
    });
}

function stopXray() {
    if (xrayProcess) {
        console.log("Stopping Xray VPN...");
        xrayProcess.kill("SIGINT");
    }
    else {
        // return error??
    }
}

function turnOffProxy(){
    const commands = [
        `Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyEnable -Value 0`,
        `Remove-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyServer -ErrorAction SilentlyContinue`,
      ];
    runPowerShellCommand(commands);
}

function turnOnProxy(){
    const commands = [
        `Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyServer -Value "127.0.0.1:20809"`,
        `Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyEnable -Value 1`,
      ];
    runPowerShellCommand(commands);
}
  

app.on("ready", ()=>{

    createWindow()
    
    ipcMain.handle('generate-config', (event, link) => {

        console.log("Generate configuration")

        const protocol: string | null = detectLinkType(link);
        if (!protocol) throw new Error('Unsupported protocol');

        let configData;
        switch (protocol) {
            case 'vmess':
                configData = parseVmessLink(link);
                break;
            case 'trojan':
                configData = parseTrojanLink(link);
                break;
            case 'vless':
                configData = parseVlessLink(link);
                break;
            case 'shadowsocks':
                configData = parseSsLink(link);
                break;
            // default:
        }

        const config = generateConfig(protocol, configData);

        // Get the current directory of the file (equivalent to __dirname in CommonJS)
        const dir_path = dirname(fileURLToPath(import.meta.url));

        return saveConfigToFile(config, dir_path);
    });

    ipcMain.handle('read-config', async (event, filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      });

    ipcMain.handle('start-xray', () => {

        turnOnProxy();
        console.log("START XRAY HERE")

        const configPath = './dist-electron/output/config.json'
        const dir_path = dirname(fileURLToPath(import.meta.url));
        const xrayPath = path.join(dir_path, '../src/xray.exe');
        console.log(configPath, xrayPath)
        startXrayWithConfig(configPath, xrayPath);
    });
    
    ipcMain.handle('stop-xray', ()=>{
        console.log("Stop Xray")
        stopXray();

        turnOffProxy();
    });

});


app.on('window-all-closed', ()=>{
    if (process.platform !== 'darwin'){
        app.quit();

        turnOffProxy();
    }
});
