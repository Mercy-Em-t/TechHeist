import { exec } from "child_process";
import * as util from "util";
import * as fs from "fs";
import * as path from "path";

const execPromise = util.promisify(exec);

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export class ExecutionRuntime {
  /**
   * Executes a command within a controlled shell environment.
   * Now natively supports Cross-Directory Spawning to execute commands in separate child cells.
   */
  static async runCommand(command: string, timeoutMs: number = 30000, targetCwd?: string): Promise<ExecutionResult> {
    try {
      // Basic security check to ensure commands don't recklessly escape the workspace root
      if (command.includes("rm -rf /") || command.includes(":(){ :|:& };:")) {
        throw new Error("Execution blocked: Destructive command pattern detected.");
      }

      // The targetCwd dictates where the command executes. If the directory doesn't exist,
      // Node's exec will throw an error, which the StateMachineEngine will catch.
      const executionDir = targetCwd ? path.resolve(process.cwd(), targetCwd) : process.cwd();

      const { stdout, stderr } = await execPromise(command, {
        timeout: timeoutMs,
        cwd: executionDir,
        env: { ...process.env, AGENT_RUNTIME: "hyper-context-fluid" }
      });

      return {
        success: true,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      };
    } catch (error: any) {
      return {
        success: false,
        stdout: error.stdout?.trim() || "",
        stderr: error.stderr?.trim() || "",
        error: error.message || String(error)
      };
    }
  }
}
