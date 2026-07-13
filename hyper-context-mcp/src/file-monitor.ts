import * as fs from "fs";
import * as path from "path";

export class FileSystemMonitor {
  private watcher: fs.FSWatcher | null = null;

  /**
   * Spins up an active background process watching the local workspace directory.
   * Seamlessly logs file modifications to feed them back to the orchestration loop.
   */
  public startMonitoring(dirPath: string, onModifyCallback: (fileName: string) => void) {
    if (!fs.existsSync(dirPath)) {
      console.error(`[Monitor Error]: Targeted workspace directory does not exist: ${dirPath}`);
      return;
    }

    console.error(`[System Sentinel]: Ambient watch activated on directory: ${dirPath}`);
    
    // Watch the directory for modifications, renames, or new file generations
    this.watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      if (filename) {
        // Skip node_modules or system dotfiles to protect execution memory
        if (filename.includes("node_modules") || filename.includes(".git") || filename.includes("network-state.json")) {
          return;
        }
        
        if (eventType === "change") {
          console.error(`[File Delta Detected]: ${filename} modified.`);
          onModifyCallback(filename);
        }
      }
    });
  }

  public stop() {
    if (this.watcher) {
      this.watcher.close();
      console.error("[System Sentinel]: Ambient watch deactivated safely.");
    }
  }
}
