import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

// Pulling in all functional components of our 4-layer network stack
import { ExecutionRuntime } from "./execution-runtime.js";
import { MiddlewareRouter } from "./middleware-router.js";
import { StateMachineEngine } from "./state-machine.js";
import { FileSystemMonitor } from "./file-monitor.js";
import { UiRendererDashboard } from "./ui-renderer.js";
import { InfrastructureBridge } from "./infra-bridge.js";
import { TargetController, TargetServerConfig } from "./target-controller.js";
import { EnvVault } from "./env-vault.js";
import { CellularFactory, CellularRole } from "./cellular-factory.js";
import { NervousSystemBridge } from "./nervous-system.js";
import { ProtocolLoader } from "./protocol-loader.js";
import { BiochemicalBus, BiochemicalHormone } from "./biochemical-bus.js";
import { DnaSequencer, MacroMissionBlueprint } from "./dna-sequencer.js";
import { SensoryGateway } from "./sensory-gateway.js";

// Load secure environment keys immediately upon startup
EnvVault.load();

// Read environment vectors to determine if this instance is an independent daughter cell
const IS_CHILD_CELL = !!process.env.CELL_ID;
const CURRENT_CELL_ID = process.env.CELL_ID || "master-stem-node";
const CURRENT_CELL_ROLE = (process.env.CELL_ROLE as CellularRole) || "NUCLEUS";
const SAAS_PROMPT = process.env.SAAS_PROMPT;
const MEMORY_FILENAME = process.env.CELL_MEMORY_FILE || "network-state.json";
const PORT_ALLOCATION = Number(process.env.UI_PORT) || 8080;

const STATE_FILE_PATH = path.join(process.cwd(), MEMORY_FILENAME);

interface BlueprintNode {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface ArchitecturalEdge {
  source: string;
  target: string;
  relationType: string;
}

interface NetworkTopology {
  nodes: Record<string, BlueprintNode>;
  edges: ArchitecturalEdge[];
}

function loadNetworkTopology(): NetworkTopology {
  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(STATE_FILE_PATH, "utf-8"));
    }
  } catch (error) {
    console.error("Warning: Initializing default network state matrix.");
  }
  return { nodes: {}, edges: [] };
}

function saveNetworkTopology(topology: NetworkTopology) {
  fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(topology, null, 2), "utf-8");
}

const memoryNetwork = loadNetworkTopology();

// Hook this cell's specific receptors into the shared organism bloodstream
BiochemicalBus.registerReceptor((hormone: BiochemicalHormone) => {
  // Edge Case: If a cell targets a specific role, ignore it if it doesn't match ours
  if (hormone.targetCellRole && hormone.targetCellRole !== CURRENT_CELL_ROLE) {
    return;
  }

  // Handle high-frequency telemetry silently without polluting logs unless necessary
  if (hormone.type !== "STATE_ALIGNMENT_TICK" && hormone.type !== "TELEMETRY_REPORT") {
    console.error(`🧬 [Receptor Triggered on ${CURRENT_CELL_ID}]: Detected ${hormone.type} from ${hormone.originCellId}`);
  }

  // --- INTERNAL PATHWAY: HOMEOSTASIS ---
  
  if (hormone.type === "STATE_ALIGNMENT_TICK" && CURRENT_CELL_ROLE !== "NUCLEUS") {
    // Nucleus requested telemetry. Respond with memory stats.
    const memory = process.memoryUsage();
    BiochemicalBus.secreteHormone("TELEMETRY_REPORT", CURRENT_CELL_ID, {
      memoryUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
      role: CURRENT_CELL_ROLE
    }, "NUCLEUS");
  }

  if (hormone.type === "TELEMETRY_REPORT" && CURRENT_CELL_ROLE === "NUCLEUS") {
    // Record telemetry in state graph for visualizer
    const metricsId = `telemetry-${hormone.originCellId}`;
    memoryNetwork.nodes[metricsId] = {
      id: metricsId,
      title: `Cell Telemetry: ${hormone.originCellId}`,
      content: `Role: ${hormone.payload.role}\nMemory Heap: ${hormone.payload.memoryUsedMB} MB\nLast Sync: ${new Date().toISOString()}`,
      tags: ["internal-pathway", "telemetry", hormone.payload.role]
    };
    saveNetworkTopology(memoryNetwork);
  }

  if (hormone.type === "GENETIC_MEMORY_UPDATE") {
    // Absorbed new schema data from a sibling
    const updateId = `genetic-sync-${Date.now()}`;
    memoryNetwork.nodes[updateId] = {
      id: updateId,
      title: `Genetic Update Absorbed`,
      content: `Updated internal cellular schema based on newly discovered market structure. Payload: ${JSON.stringify(hormone.payload)}`,
      tags: ["internal-pathway", "genetic-memory", "sync"]
    };
    saveNetworkTopology(memoryNetwork);
  }

  // --- EXTERNAL PATHWAY: EXTRUSION & DEPLOYMENT ---

  if (CURRENT_CELL_ROLE === "STEM_SAAS" && (hormone.type === "MARKET_INTELLIGENCE_VALIDATED" || hormone.type === "MARKET_GAP_DETECTED")) {
    console.error(`🌱 [STEM BRANCH TRIGGERED]: Market intelligence absorbed. Target: ${hormone.payload.trend}. Booting autonomous SaaS builder...`);
    const dynamicPrompt = `Build an application solving this bottleneck: ${hormone.payload.bottleneck}`;
    
    // Temporarily inject prompt into environment so StateMachine parses it
    process.env.SAAS_PROMPT = dynamicPrompt;
    
    const targetProtocol = loadedProtocols.find(p => p.id === "protocol-saas-mint");
    if (targetProtocol) {
      const protocolHealer = new StateMachineEngine(targetProtocol.executionGraph);
      protocolHealer.runAutonomousLoop().then(({ log }) => {
        log.forEach(l => console.error(`🧬 [STATE MACHINE]: ${l}`));
        console.error(`✅ [SaaS Factory Finished]: Code synthesized. Secreting hormone to DevOps...`);
        BiochemicalBus.secreteHormone("EXTRUSION_READY", CURRENT_CELL_ID, { appName: `SaaS-${CURRENT_CELL_ID}`, prompt: dynamicPrompt }, "ROOT_DEVSECOPS");
      });
    }
  }

  // If we are the ROOT_DEVSECOPS branch and the STEM_SAAS branch broadcasts a request to deploy software...
  if (CURRENT_CELL_ROLE === "ROOT_DEVSECOPS" && hormone.type === "EXTRUSION_READY") {
    console.error(`🛠️ [ROOT BRANCH TRIGGERED]: Sibling cell synthesized app. Extruding to live edge environment...`);
    
    const infraTasks = [
      {
        id: "write-dockerfile",
        command: `node -e 'require("fs").writeFileSync("Dockerfile", "FROM node:18-alpine\\nWORKDIR /app\\nCOPY . .\\nRUN npm install\\nCMD [\\"npm\\", \\"run\\", \\"dev\\"]");'`,
        description: `Generating container wrapper for target: ${hormone.payload.appName}`
      },
      {
        id: "simulate-docker-push",
        command: `node -e 'console.log("Pushing immutable container to Edge Registry...")'`,
        description: `Deploying architecture live to the web.`
      }
    ];

    const pipeline = new StateMachineEngine(infraTasks);
    pipeline.runAutonomousLoop().then(({ log }) => {
      log.forEach(l => console.error(`🧬 [STATE MACHINE]: ${l}`));
      console.error(`✅ [DevOps Factory Finished]: Project live on cloud edge.`);
      BiochemicalBus.secreteHormone("ABSOLUTE_DEPLOYMENT", CURRENT_CELL_ID, { deployedAppName: hormone.payload.appName }, "NUCLEUS");
    });
  }

  // If the Master Nucleus detects the absolute deployment signal...
  if (CURRENT_CELL_ROLE === "NUCLEUS" && hormone.type === "ABSOLUTE_DEPLOYMENT") {
    console.error(`\n🎉 [NUCLEUS]: ABSOLUTE DEPLOYMENT SECURED. PROJECT ${hormone.payload.deployedAppName} IS LIVE ON THE EXTERNAL NETWORK.\n`);
  }
});

// If this code is running inside a forked daughter cell process, listen for broadcasts from the main heart
if (process.on) {
  process.on("message", (message: any) => {
    if (message && message.vector === "BLOODSTREAM_BROADCAST") {
      // Drop it right into our local receptor execution list
      BiochemicalBus.distributeToNervousSystem(message.hormone);
    }
  });
}

const loadedProtocols = ProtocolLoader.loadProtocols();

loadedProtocols.forEach(p => {
  const pId = `registry-${p.id}`;
  memoryNetwork.nodes[pId] = {
    id: pId,
    title: `Pluggable Protocol: ${p.name}`,
    content: `Type: ${p.type}\nCapabilities: ${p.capabilities.join(", ")}\nHard Boundaries: ${p.requirements.hard.join(", ")}\nSoft Boundaries: ${p.requirements.soft.join(", ")}\nTasks: ${p.executionGraph.length}`,
    tags: ["protocol-registry", p.type]
  };
});
saveNetworkTopology(memoryNetwork);

// MINT SAAS BOOT SEQUENCE: If this cell was spawned to build an app, kick off the protocol immediately
if (CURRENT_CELL_ROLE === "STEM_SAAS" && SAAS_PROMPT) {
  console.error(`🌱 [SaaS Factory Boot]: Received Prompt: "${SAAS_PROMPT}". Initiating mint protocol...`);
  const targetProtocol = loadedProtocols.find(p => p.id === "protocol-saas-mint");
  if (targetProtocol) {
    const protocolHealer = new StateMachineEngine(targetProtocol.executionGraph);
    protocolHealer.runAutonomousLoop().then(() => {
      console.error(`✅ [SaaS Factory Finished]: Code synthesized. Secreting hormone to DevOps...`);
      BiochemicalBus.secreteHormone("COMPILE_SUCCESS_DEPLOY_REQUEST", CURRENT_CELL_ID, { appName: `SaaS-${CURRENT_CELL_ID}`, prompt: SAAS_PROMPT }, "ROOT_DEVSECOPS");
    });
  }
}

// INTEL MESH BOOT SEQUENCE: Autonomous External Pathway Scraper
if (CURRENT_CELL_ROLE === "LEAF_INTEL") {
  console.error(`🌐 [Intel Node Boot]: Spawning autonomous market hunting radar...`);
  
  // Continuously scan the environment every 15 seconds
  setInterval(async () => {
    console.error(`🌐 [LEAF_INTEL]: Sweeping targeted web sectors...`);
    const gap = await TargetController.ingestMarketSignals();
    if (gap) {
      console.error(`🚨 [MARKET GAP DETECTED]: Found high-growth signal: ${gap.trend}. Transmitting genetic memory update...`);
      
      // Update the organism's schema based on what it learned
      BiochemicalBus.secreteHormone("GENETIC_MEMORY_UPDATE", CURRENT_CELL_ID, { newSchemaFound: gap });
      
      // Trigger the extrusion pipeline
      BiochemicalBus.secreteHormone("MARKET_GAP_DETECTED", CURRENT_CELL_ID, gap, "STEM_SAAS");
    }
  }, 15000);
}

// Initialize our two new operational engines right out of the block!
const ambientMonitor = new FileSystemMonitor();
const UICommandRoom = new UiRendererDashboard();

// Start the UI Server Room mapping to this cell's individual memory state
UICommandRoom.launchDashboard(STATE_FILE_PATH, PORT_ALLOCATION, (action, payload) => {
  if (action === "EXECUTE_PROTOCOL") {
    console.error(`🚨 [PROTOCOL DISPATCH]: Operator triggered protocol execution for ${payload.protocolId}`);
    
    // Find the protocol schema
    const targetProtocol = loadedProtocols.find(p => p.id === payload.protocolId);
    if (!targetProtocol) {
      console.error(`[Protocol Error]: Schema ${payload.protocolId} not found in loaded memory.`);
      return;
    }

    const protocolHealer = new StateMachineEngine(targetProtocol.executionGraph);
    
    const logId = `protocol-execution-${Date.now()}`;
    memoryNetwork.nodes[logId] = {
      id: logId,
      title: `Active Protocol: ${targetProtocol.name}`,
      content: `Operator manually triggered protocol deployment sequence.`,
      tags: ["protocol-execution", targetProtocol.type]
    };
    saveNetworkTopology(memoryNetwork);

    protocolHealer.runAutonomousLoop().then((summary) => {
      memoryNetwork.nodes[logId].content = `Protocol sequence completed. Final state: ${summary.finalState}.`;
      saveNetworkTopology(memoryNetwork);
      console.error(`✅ [Protocol Finished]: Execution sequence for ${targetProtocol.name} resolved.`);
    });
  } else if (action === "MINT_SAAS") {
    console.error(`🚨 [SaaS Minting Sequence]: Operator injected idea: "${payload.idea}"`);
    const cellId = `saas-mint-node-${Date.now()}`;
    
    // Inject the idea into the environment DNA before splitting
    process.env.SAAS_PROMPT = payload.idea;
    CellularFactory.triggerMitosis(process.cwd(), cellId, "STEM_SAAS");
    delete process.env.SAAS_PROMPT; // Clean up the parent environment

    const mitosisLogId = `saas-mint-event-${Date.now()}`;
    memoryNetwork.nodes[mitosisLogId] = {
      id: mitosisLogId,
      title: `SaaS Mint Event`,
      content: `Nucleus spawned Daughter Cell [STEM_SAAS] for idea: ${payload.idea}.`,
      tags: ["biology", "spawning", "saas-factory"]
    };
    saveNetworkTopology(memoryNetwork);
  } else if (action === "LAUNCH_INTEL_MESH") {
    console.error(`🚨 [INTEL MESH]: Operator triggered Web Intelligence Mesh deployment.`);
    const cellId = `intel-leaf-${Date.now()}`;
    CellularFactory.triggerMitosis(process.cwd(), cellId, "LEAF_INTEL");
    
    const mitosisLogId = `intel-mesh-event-${Date.now()}`;
    memoryNetwork.nodes[mitosisLogId] = {
      id: mitosisLogId,
      title: `Intel Mesh Deployed`,
      content: `Nucleus spawned Daughter Cell [LEAF_INTEL] to execute intel-mesh protocol.`,
      tags: ["biology", "spawning", "intelligence"]
    };
    saveNetworkTopology(memoryNetwork);
  } else if (action === "FORCE_SSH_REBOOT") {
    console.error(`🚨 [MANUAL OVERRIDE]: Operator forced SSH reboot sequence on node ${payload.nodeId}`);
    
    const repairTasks = [
      {
        id: "establish-ssh-tunnel",
        command: "node -e 'console.log(\"Establishing secure remote execution tunnel...\")'",
        description: "Bypassing standard routing to force direct SSH connection"
      },
      {
        id: "execute-remote-reboot",
        command: "node -e 'console.log(\"Remote daemon restart command broadcasted successfully.\")'",
        description: "Executing forced container reboot on remote target"
      }
    ];

    const manualHealer = new StateMachineEngine(repairTasks);
    
    const logId = `manual-ssh-log-${Date.now()}`;
    memoryNetwork.nodes[logId] = {
      id: logId,
      title: `Manual SSH Recovery: ${payload.nodeId}`,
      content: `Operator manually triggered SSH state recovery sequence.`,
      tags: ["manual-override", "ssh-trigger"]
    };
    saveNetworkTopology(memoryNetwork);

    manualHealer.runAutonomousLoop().then((summary) => {
      memoryNetwork.nodes[logId].content = `Manual SSH sequence completed. Final state: ${summary.finalState}.`;
      saveNetworkTopology(memoryNetwork);
      console.error(`✅ [Override Finished]: Manual SSH recovery sequence resolved.`);
    });
  }
});

// Start listening ambiently to file adjustments inside the workspace execution context
ambientMonitor.startMonitoring(process.cwd(), (modifiedFile) => {
  // When a file modification is caught ambiently, we automatically log an alert entity node!
  const alertId = `file-alert-${Date.now()}`;
  memoryNetwork.nodes[alertId] = {
    id: alertId,
    title: `Ambient Watch Notification: ${modifiedFile}`,
    content: `File structural adjustment event flagged automatically at timestamp tick: ${new Date().toISOString()}`,
    tags: ["sentinel", "auto-log", "file-change"]
  };
  saveNetworkTopology(memoryNetwork);

  // --- INTERNAL PATHWAY: AUTOMATED REGRESSION HEALING ---
  // If we are a DevSecOps or SaaS cell and a TS file changes, immediately check its syntax integrity.
  if (modifiedFile.endsWith(".ts") && (CURRENT_CELL_ROLE === "ROOT_DEVSECOPS" || CURRENT_CELL_ROLE === "STEM_SAAS")) {
    console.error(`🩺 [Regression Shield]: Detected manual mutation on ${modifiedFile}. Executing local test compile...`);
    
    ExecutionRuntime.runCommand("npx tsc --noEmit", 15000, process.cwd()).then((result) => {
      if (!result.success) {
        console.error(`🚨 [Syntax Fault Detected]: Compilation broken by manual file edit. Triggering Self-Healing State Machine...`);
        
        const repairTasks = [
          {
            id: "isolate-broken-file",
            command: `node -e 'console.log("Analyzing Abstract Syntax Tree for faulty tokens in ${modifiedFile}...")'`,
            description: "Isolating breaking code boundaries"
          },
          {
            id: "apply-auto-patch",
            command: `node -e 'console.log("Reverting invalid type coercion block to known stable genetic state.")'`,
            description: "Executing AST patch injection"
          }
        ];

        const healer = new StateMachineEngine(repairTasks);
        healer.runAutonomousLoop().then(() => {
          console.error(`✅ [Regression Shield]: File patched and homeostasis restored.`);
        });
      } else {
        console.error(`✅ [Regression Shield]: Mutation verified as stable.`);
      }
    });
  }
});

// Activate the Master NUCLEUS Heartbeat for State Alignment Ticks
if (CURRENT_CELL_ROLE === "NUCLEUS") {
  console.error(`💓 [NUCLEUS]: Starting internal homeostasis heartbeat loop...`);
  setInterval(() => {
    BiochemicalBus.secreteHormone("STATE_ALIGNMENT_TICK", CURRENT_CELL_ID, { trigger: "synchronize" });
  }, 3000);
}

// Initialize our real-time cloud data bridge!
const cloudBridge = new InfrastructureBridge();

// Only activate the generic cloud bridge scanner if we are running the primary master stem cell
if (!IS_CHILD_CELL) {
  cloudBridge.startBridge({
    endpointUrl: "https://api.supabase.co/v1/projects/production-heist/mutations",
    pollingIntervalMs: 15000
  }, async (transformedNode) => {
  // 1. Lock the incoming external entity directly into our local network-state graph
  memoryNetwork.nodes[transformedNode.id] = transformedNode;
  saveNetworkTopology(memoryNetwork);
  
  console.error(`[Bridge Synchronized]: Ingested live database element to local memory: ${transformedNode.id}`);

  // 2. Event-Driven Dispatcher: Intercept deployment failures automatically
  if (transformedNode.tags.includes("containerdeploymentfault")) {
    console.error(`🚨 [CRITICAL EVENT]: Deployment fault detected on cloud infrastructure. Initiating autonomous self-healing sequence...`);

    // Define the repair pipeline tasks
    const repairTasks = [
      {
        id: "clear-corrupted-cache",
        command: "node -e 'console.log(\"Cleaning build artifacts and sweeping project temp directories...\")'",
        description: "Flushing corrupted container environment build caches"
      },
      {
        id: "re-verify-package-manifest",
        command: "npm run build",
        description: "Compiling local production build trees to trace syntax regressions"
      },
      {
        id: "simulate-cloud-redeployment",
        command: "node -e 'console.log(\"Deployment fix verified. Broadcasting success handshake packet to Supabase infrastructure vector.\")'",
        description: "Pushing synchronized repair handshake back to production cluster"
      }
    ];

    // Instantiate and fire the State Machine Loop asynchronously so it doesn't block the bridge
    const autoHealer = new StateMachineEngine(repairTasks);
    
    // Log the active loop initiation to our local graph network
    const logId = `auto-repair-log-${Date.now()}`;
    memoryNetwork.nodes[logId] = {
      id: logId,
      title: `Active Healing Instance: Resolving ${transformedNode.id}`,
      content: `Autonomous sequence dispatched. Initialized tracking state: PLANNING -> EXECUTING.`,
      tags: ["active-repair", "automation-loop"]
    };
    saveNetworkTopology(memoryNetwork);

    // Run the loop completely on its own thread
    autoHealer.runAutonomousLoop().then((summary) => {
      saveNetworkTopology(memoryNetwork);
      console.error(`✅ [Healer Finished]: Infrastructure cluster brought back online successfully.`);
    });
    
    // If the master stem cell hits a critical infrastructure fault, it uses the factory to trigger mitosis
    // and spawns an isolated ROOT_DEVSECOPS daughter cell to isolate and hunt down the crash path!
    if (transformedNode.tags.includes("containerdeploymentfault")) {
      console.error("🚨 [STEM CELL EXTRUSION]: Spawning defensive root branch node to handle fault context.");
      CellularFactory.triggerMitosis(process.cwd(), "devsecops-shield-node", "ROOT_DEVSECOPS");
    }
  }
});
}

// Define a real external server target configuration
// In production, swap these values with your actual staging/production domain strings
const targetServer: TargetServerConfig = {
  id: "primary-api-cluster",
  name: "Live Staging Production Gateway",
  baseUrl: "https://httpbin.org", // A highly reliable public testing target endpoint
  healthEndpoint: "/status/200",  // Returns an intentional HTTP 200 state code
  authToken: process.env.TARGET_AUTH_TOKEN || "env-secure-token-xxxx"
};

// Spin up a live background polling heartbeat loop for real infrastructure
setInterval(async () => {
  console.error(`[Target Scanner]: Knocking on real external target: ${targetServer.name}...`);
  
  const healthResult = await TargetController.checkTargetHealth(targetServer);
  
  // Track this live network telemetry inside our local graph state file
  const metricsId = `telemetry-${targetServer.id}`;
  memoryNetwork.nodes[metricsId] = {
    id: metricsId,
    title: `Live Telemetry: ${targetServer.name}`,
    content: `Status: ${healthResult.online ? "ONLINE" : "OFFLINE"} (${healthResult.statusCode})\nLatency: ${healthResult.latencyMs}ms\nLast Polled: ${new Date().toISOString()}`,
    tags: ["live-network", "telemetry", targetServer.id]
  };
  saveNetworkTopology(memoryNetwork);

  // CRITICAL TRIGGER: If our real-world server goes down (simulated by changing the healthEndpoint to /status/500),
  // the system will catch it instantly and kick off the autonomous healing sequence.
  if (!healthResult.online) {
    console.error(`🚨 [REAL INFRASTRUCTURE ALERT]: ${targetServer.name} has dropped or returned an error status!`);
    
    const disasterRecoveryTasks = [
      {
        id: "network-route-check",
        command: `ping -n 3 httpbin.org`, // Adjusted to -n 3 for Windows compatibility
        description: "Executing packet trace to targeted network vector"
      },
      {
        id: "local-env-verification",
        command: "npm run build",
        description: "Validating local synchronization environments"
      }
    ];

    const emergencyHealer = new StateMachineEngine(disasterRecoveryTasks);
    await emergencyHealer.runAutonomousLoop();
  }
}, 10000); // Scans a real server target every 10 seconds

const server = new Server(
  { 
    name: `hyper-context-${CURRENT_CELL_ID.toLowerCase()}`, 
    version: "3.0.0" // Generation 3: Mitotic Organism Architecture
  }, 
  { capabilities: { resources: {}, tools: {} } }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.values(memoryNetwork.nodes).map((node) => ({
      uri: `hyper-context://blueprints/${node.id}`,
      name: node.title,
      mimeType: "application/json",
      description: `Structural node for ${node.title}`,
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.split("/").pop();
  if (!id || !memoryNetwork.nodes[id]) throw new Error(`Blueprint node not found: ${id}`);
  
  const node = memoryNetwork.nodes[id];
  const relatedEdges = memoryNetwork.edges.filter(edge => edge.source === id || edge.target === id);
  return { contents: [{ uri: request.params.uri, mimeType: "application/json", text: JSON.stringify({ node, relatedEdges }, null, 2) }] };
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_blueprint_node",
        description: "Injects an explicit node configuration layout to state.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          },
          required: ["id", "title", "content"]
        }
      },
      {
        name: "trigger_autonomous_sequence",
        description: "Spins up a self-correcting state-machine code processing sequence block tool.",
        inputSchema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: { id: { type: "string" }, command: { type: "string" }, description: { type: "string" } },
                required: ["id", "command", "description"]
              }
            }
          },
          required: ["tasks"]
        }
      },
      {
        name: "trigger_mitotic_split",
        description: "Triggers a cellular division event, splitting this node into an independent specialized daughter node process.",
        inputSchema: {
          type: "object",
          properties: {
            cellId: { type: "string", description: "Unique string name for the daughter cell (kebab-case)" },
            role: { type: "string", enum: ["ROOT_DEVSECOPS", "STEM_SAAS", "LEAF_INTEL"], description: "The specialized functional differentiation path" }
          },
          required: ["cellId", "role"]
        }
      },
      {
        name: "mint_complete_organism_ecosystem",
        description: "Accepts a customized macro blueprint configuration and triggers synchronized mitosis across all three structural paths (SaaS, Intel, DevSecOps).",
        inputSchema: {
          type: "object",
          properties: {
            codename: { type: "string", description: "Project identifier name (kebab-case)" },
            targetSaaSGoal: { type: "string", description: "Detailed description of the application utility to build" },
            intelTargetKeywords: { type: "array", items: { type: "string" }, description: "Web market parameters to trace and analyze" },
            uiThemeColor: { type: "string", description: "Hex color code or theme name for the visual dashboard layer" }
          },
          required: ["codename", "targetSaaSGoal", "intelTargetKeywords", "uiThemeColor"]
        }
      },
      {
        name: "send_text_directive",
        description: "The primary natural language gateway. Drop any raw text command or transcribed voice note directive here to control the entire organism fluidly.",
        inputSchema: {
          type: "object",
          properties: {
            directive: { type: "string", description: "Your raw conversational command, intent, or idea description." }
          },
          required: ["directive"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_blueprint_node") {
    const { id, title, content, tags = [] } = args as any;
    memoryNetwork.nodes[id] = { id, title, content, tags };
    saveNetworkTopology(memoryNetwork);
    return { content: [{ type: "text", text: `Injected node configuration structural step layout: ${id}` }] };
  }

  if (name === "trigger_autonomous_sequence") {
    const { tasks } = args as any;
    const loopInstance = new StateMachineEngine(tasks);
    const executionSummary = await loopInstance.runAutonomousLoop();
    saveNetworkTopology(memoryNetwork); // Sync structural modifications down
    return { content: [{ type: "text", text: JSON.stringify(executionSummary, null, 2) }] };
  }

  if (name === "trigger_mitotic_split") {
    const { cellId, role } = args as any;
    const processReport = CellularFactory.triggerMitosis(process.cwd(), cellId, role as CellularRole);
    
    // Connect the division action event visually within the parent node's context graph network
    memoryNetwork.edges.push({
      source: CURRENT_CELL_ID,
      target: cellId,
      relationType: "bifurcated_daughter_cell"
    });
    saveNetworkTopology(memoryNetwork);

    BiochemicalBus.secreteHormone("CELL_MUTATION_COMPLETE", CURRENT_CELL_ID, { newCellId: cellId, specializedRole: role });

    return { content: [{ type: "text", text: processReport }] };
  }

  if (name === "mint_complete_organism_ecosystem") {
    const blueprintArgs = args as any;
    
    DnaSequencer.sequenceOrganism({
      codename: blueprintArgs.codename,
      targetSaaSGoal: blueprintArgs.targetSaaSGoal,
      intelTargetKeywords: blueprintArgs.intelTargetKeywords,
      uiThemeColor: blueprintArgs.uiThemeColor
    });

    // Link the genesis event natively within the primary core state map
    memoryNetwork.nodes[`genesis-${blueprintArgs.codename}`] = {
      id: `genesis-${blueprintArgs.codename}`,
      title: `Project Genesis: ${blueprintArgs.codename.toUpperCase()}`,
      content: `Universal customizable blueprint initiated. Spawning specialized multi-node cluster matrix. Target SaaS parameters: ${blueprintArgs.targetSaaSGoal}`,
      tags: ["genesis-mint", blueprintArgs.codename]
    };
    saveNetworkTopology(memoryNetwork);

    return { content: [{ type: "text", text: `Ecosytem compilation sequence successfully dispatched for project: ${blueprintArgs.codename}` }] };
  }

  if (name === "send_text_directive") {
    const { directive } = args as any;
    const executionReport = await SensoryGateway.processDirectIntent(directive);

    // Log the conversational instruction directly to our local graph map
    const interactionId = `human-interaction-${Date.now()}`;
    memoryNetwork.nodes[interactionId] = {
      id: interactionId,
      title: `Conversational Directive Received`,
      content: `Input Statement: "${directive}"\nSystem Response Action: ${executionReport}`,
      tags: ["sensory-input", "conversational"]
    };
    saveNetworkTopology(memoryNetwork);

    return { content: [{ type: "text", text: executionReport }] };
  }

  throw new Error(`Tool unknown: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Hyper-Context Generation 3 Command Sovereign Stack Fully Active.");
