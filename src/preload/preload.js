const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Dialog methods
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Menu events
  onMenuNavigate: (callback) => {
    ipcRenderer.on('menu-navigate', (event, route) => callback(route));
  },
  onMenuNewOrder: (callback) => {
    ipcRenderer.on('menu-new-order', () => callback());
  },
  onMenuExportData: (callback) => {
    ipcRenderer.on('menu-export-data', (event, filePath) => callback(filePath));
  },
  
  // Clean up listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Platform information
  platform: process.platform,
  
  // Environment
  isDev: process.env.NODE_ENV === 'development'
});