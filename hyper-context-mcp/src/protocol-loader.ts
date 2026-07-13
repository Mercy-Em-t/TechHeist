import * as fs from "fs";
import * as path from "path";

export interface PluggableProtocol {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  workspace?: string; // Root level workspace. Dictates where the cell spawns if tasks don't override.
  requirements: {
    hard: string[]; // Strict failures. Fails instantly if missing.
    soft: string[]; // Optimistic boundaries. Auto-heals at runtime if missing.
  };
  executionGraph: {
    id: string;
    command: string;
    description: string;
    workspace?: string; // Task-specific workspace override.
    dependsOn?: string[];
  }[];
}

export class ProtocolLoader {
  /**
   * Scans the protocols directory, parses schemas, and enforces hard security boundaries
   * to prevent wasted computational resources.
   */
  public static loadProtocols(protocolsDir: string = path.join(process.cwd(), "protocols")): PluggableProtocol[] {
    if (!fs.existsSync(protocolsDir)) {
      console.warn(`[Protocol Loader]: Directory not found at ${protocolsDir}. No schemas injected.`);
      return [];
    }

    const loadedProtocols: PluggableProtocol[] = [];
    const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const fullPath = path.join(protocolsDir, file);
      try {
        const rawContent = fs.readFileSync(fullPath, "utf-8");
        const protocol: PluggableProtocol = JSON.parse(rawContent);

        // HARD BOUNDARY CHECK:
        // Immediately enforce resource management. If a hard requirement (like an auth token)
        // is missing from the environment vault, we reject the protocol outright to save time.
        let validationFailed = false;
        if (protocol.requirements && protocol.requirements.hard) {
          for (const req of protocol.requirements.hard) {
            if (!process.env[req]) {
              console.error(`🚨 [Protocol Loader]: Protocol '${protocol.name}' REJECTED. Missing hard requirement: ${req}`);
              validationFailed = true;
              break;
            }
          }
        }

        if (validationFailed) continue; // Skip loading this protocol

        // Map root-level workspace down to tasks if they don't have one
        if (protocol.workspace) {
          protocol.executionGraph.forEach(task => {
            if (!task.workspace) {
              task.workspace = protocol.workspace;
            }
          });
        }

        // Soft boundaries are passed optimistically to the execution layer to auto-heal.
        loadedProtocols.push(protocol);
        console.error(`✅ [Protocol Loader]: Ingested Pluggable Schema: ${protocol.name} (${protocol.id})`);
        
      } catch (error) {
        console.error(`[Protocol Loader Error]: Corrupt schema at ${file}:`, error);
      }
    }

    return loadedProtocols;
  }
}
