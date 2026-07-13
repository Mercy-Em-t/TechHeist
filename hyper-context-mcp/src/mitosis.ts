import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";

export class MitosisEngine {
  static async spawnCell(role: "Root" | "Leaf" | "Stem", targetPort: number, targetDir: string) {
    console.error(`🧬 [Mitosis Engine]: Initiating cellular division. Target Role: ${role}`);
    
    const sourceDir = process.cwd();
    const destDir = path.resolve(sourceDir, targetDir);

    if (fs.existsSync(destDir)) {
      console.error(`🧬 [Mitosis Engine]: Target cell directory already exists. Aborting division.`);
      return;
    }

    console.error(`🧬 [Mitosis Engine]: Duplicating DNA blueprint to ${destDir}...`);
    
    fs.cpSync(sourceDir, destDir, {
      recursive: true,
      filter: (src) => {
        const basename = path.basename(src);
        const excludeList = ["node_modules", "dist", ".git", ".agents", "network-state.json", ".env"];
        return !excludeList.includes(basename);
      }
    });

    console.error(`🧬 [Mitosis Engine]: Injecting differentiation traits (.env mutagen)...`);
    const envContent = `CELL_ROLE=${role}\nPORT=${targetPort}\n`;
    fs.writeFileSync(path.join(destDir, ".env"), envContent, "utf-8");

    console.error(`🧬 [Mitosis Engine]: Bootstrapping daughter cell...`);
    
    // Launching the compilation and boot sequence as a completely detached background process.
    // This allows the Stem Cell to continue orchestrating without waiting for the clone to finish compiling.
    const child = spawn("cmd", ["/c", "npm install && npm run build && node dist/index.js"], {
      cwd: destDir,
      detached: true,
      stdio: "ignore"
    });
    
    child.unref();
    console.error(`🧬 [Mitosis Engine]: Cell [${role}] is now compiling and will boot autonomously on Port ${targetPort}.`);
  }
}
