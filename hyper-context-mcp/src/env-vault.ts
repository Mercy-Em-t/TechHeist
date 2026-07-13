import * as fs from "fs";
import * as path from "path";

export class EnvVault {
  /**
   * Synchronously reads a local .env file and parses key-value pairs into process.env.
   * Maintains zero-dependency architecture while locking down credentials.
   */
  public static load(envPath: string = path.join(process.cwd(), ".env")) {
    if (!fs.existsSync(envPath)) {
      console.warn(`[Env Vault]: No local environment configuration found at ${envPath}. Running with existing process.env.`);
      return;
    }

    try {
      const rawContent = fs.readFileSync(envPath, "utf-8");
      const lines = rawContent.split("\n");

      let loadedKeys = 0;
      lines.forEach((line) => {
        const trimmed = line.trim();
        // Ignore empty lines and comments
        if (trimmed.length === 0 || trimmed.startsWith("#")) return;

        // Extract key and value safely without regex complexity
        const splitIndex = trimmed.indexOf("=");
        if (splitIndex === -1) return;

        const key = trimmed.slice(0, splitIndex).trim();
        let value = trimmed.slice(splitIndex + 1).trim();

        // Strip surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        process.env[key] = value;
        loadedKeys++;
      });

      console.error(`[Env Vault]: Successfully locked ${loadedKeys} secure variables into process execution scope.`);
    } catch (error) {
      console.error("[Env Vault Error]: Catastrophic failure during environment parsing:", error);
    }
  }
}
