import { fork, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

export type CellularRole = "ROOT_DEVSECOPS" | "STEM_SAAS" | "LEAF_INTEL";

interface DaughterCellInstance {
  cellId: string;
  role: CellularRole;
  process: ChildProcess;
  memoryPath: string;
}

export class CellularFactory {
  private static activeDaughterCells: Record<string, DaughterCellInstance> = {};

  /**
   * Executes a mitotic split, spinning up an independent, specialized daughter node
   * that shares the core protocol blueprint but focuses on a distinct systemic role.
   */
  public static triggerMitosis(parentDir: string, cellId: string, role: CellularRole): string {
    if (this.activeDaughterCells[cellId]) {
      return `[Cellular Factory]: Mitosis aborted. Cell ID '${cellId}' already occupies a running slot.`;
    }

    const daughterMemoryPath = path.join(parentDir, `network-state-${cellId}.json`);

    // Genetic Replication: If no unique memory exists for this cell yet, copy the foundation layout
    if (!fs.existsSync(daughterMemoryPath)) {
      const initialTemplate = {
        nodes: {
          [cellId]: {
            id: cellId,
            title: `Specialized Daughter Cell: ${role}`,
            content: `Daughter cell split completed successfully. Role allocated: ${role}. Specialized neural network pathways active.`,
            tags: ["mitosis-clone", role.toLowerCase()]
          }
        },
        edges: []
      };
      fs.writeFileSync(daughterMemoryPath, JSON.stringify(initialTemplate, null, 2), "utf-8");
    }

    console.error(`[Mitosis Commenced]: Splitting stem cell -> Spawning ${role} (${cellId})...`);

    // Forking the main process execution path to launch an independent worker node
    // Pass execution flags so the child script configures itself into the assigned role
    const daughterProcess = fork(path.join(parentDir, "dist/index.js"), [], {
      env: {
        ...process.env,
        CELL_ID: cellId,
        CELL_ROLE: role,
        CELL_MEMORY_FILE: `network-state-${cellId}.json`,
        UI_PORT: String(8080 + Object.keys(this.activeDaughterCells).length + 1) // Dynamic visual port allocation
      }
    });

    this.activeDaughterCells[cellId] = {
      cellId,
      role,
      process: daughterProcess,
      memoryPath: daughterMemoryPath
    };

    // Listen to biochemical signals sent from the daughter node up the nervous pipeline
    daughterProcess.on("message", (message: any) => {
      if (message && message.vector === "BLOODSTREAM_SECRETION") {
        const hormone = message.hormone;
        console.error(`📡 [Nervous Hub]: Cell [${cellId}] secreted hormone: ${hormone.type}`);

        // Act as the central heart: Forward this hormone to every other active daughter node
        Object.entries(CellularFactory.activeDaughterCells).forEach(([id, targetCell]) => {
          // Don't echo the message back to the cell that sent it
          if (id !== cellId) {
            // Send across the IPC channel down to the daughter process loop
            targetCell.process.send({ vector: "BLOODSTREAM_BROADCAST", hormone });
          }
        });
      }
    });

    return `[Mitosis Complete]: Daughter cell '${cellId}' successfully differentiated into ${role}.`;
  }
}
