import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  selectPDBFolder: () => ipcRenderer.invoke("select-pdb-folder"),
  selectOutputFolder: () => ipcRenderer.invoke("select-output-folder"),
  startProcessing: (config: any) =>
    ipcRenderer.invoke("start-processing", config),
  onProgress: (callback: (data: any) => void) => {
    ipcRenderer.on("processing-progress", (_event, data) => callback(data));
  },
  onError: (callback: (data: any) => void) => {
    ipcRenderer.on("processing-error", (_event, data) => callback(data));
  },
});
