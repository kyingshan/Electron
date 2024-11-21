import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;// APA TYPE INI????

export function setMainWindow(window: BrowserWindow) {
  mainWindow = window;
}

export function runPowerShellCommand(commands: any[]) {
    // Spawn PowerShell process
    const ps = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-Command', '-']);
  
    // Write commands to PowerShell
    commands.forEach((command) => {
      ps.stdin.write(`${command}\n`);
    });
  
    ps.stdin.end();
  
    ps.stdout.on('data', (data) => {
      console.log(`Output: ${data}`);
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('powershell-output', data.toString());
      }
    });
  
    ps.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('powershell-error', data.toString());
      }
    });
  
    ps.on('close', (code) => {
      console.log(`PowerShell exited with code ${code}`);
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('powershell-exit', `Exited with code ${code}`);
      }
    });
  }
  