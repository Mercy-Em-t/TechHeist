import { BiochemicalBus } from "./biochemical-bus.js";
import { DnaSequencer } from "./dna-sequencer.js";
import { StateMachineEngine } from "./state-machine.js";

export class SensoryGateway {
  /**
   * Processes an absolute conversational command, acting exactly like an LLM interface
   * that translates raw human speech or text into deep systemic execution.
   */
  public static async processDirectIntent(rawInput: string): Promise<string> {
    const input = rawInput.toLowerCase().trim();
    console.error(`🎙️ [Sensory Ingestion]: Processing voice/text intent: "${rawInput}"`);

    // Intent 1: Command to mint a completely new ecosystem branch
    if (input.includes("mint") || input.includes("build a project") || input.includes("launch")) {
      // Extract a codename or fallback dynamically
      const codename = input.includes("savannah") ? "savannah-custom" : "delta-project-" + Math.floor(Math.random() * 100);
      
      DnaSequencer.sequenceOrganism({
        codename,
        targetSaaSGoal: rawInput, // Pass the full rich text explanation straight to the generator
        intelTargetKeywords: ["market-trends", "runtime-telemetry"],
        uiThemeColor: "#0ea5e9"
      });

      return `✨ Intent parsed: Ecosystem Generation. Spawning mitotic branch cluster [${codename}] to build: "${rawInput}"`;
    }

    // Intent 2: Command to run immediate system diagnostics or self-healing
    if (input.includes("check") || input.includes("fix") || input.includes("repair") || input.includes("status")) {
      const diagnosticTasks = [
        {
          id: "user-forced-diagnostic",
          command: "npm run build",
          description: "User-requested environment sanity compilation check"
        }
      ];

      const engine = new StateMachineEngine(diagnosticTasks);
      // Run the loop asynchronously so the user gets an instant acknowledgment
      engine.runAutonomousLoop();

      return `🛠️ Intent parsed: System Maintenance. Dispatched an autonomous self-healing loop to run background environment verification.`;
    }

    // Intent 3: Generic conversational injection straight into the organism's bloodstream
    BiochemicalBus.secreteHormone("HUMAN_CONVERSATIONAL_INJECTION", "sensory-gateway-ui", {
      rawMessage: rawInput
    });

    return `🧬 Intent parsed: Global Broadcast. Sent your raw directive straight into the cell bloodstream. Sibling nodes are adapting.`;
  }
}
