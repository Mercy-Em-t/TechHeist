# Automated Harvest Cascade: Operational Manual

## 📖 Concept Overview
The **Automated Harvest Cascade** represents the apex of the Sovereign Engine's biological architecture. Instead of operating independent tools sequentially, the engine utilizes the Inter-Process Communication (IPC) Biochemical Bus to daisy-chain autonomous agents (cells). 

A single "macro" command initiates a global sequence where data scraping automatically dictates code synthesis, which automatically triggers network deployment.

## 🧬 The Biological Sequence

The cascade functions flawlessly via the following sequence of events:

1. **MACRO_GENESIS_INIT (The Trigger)**
   The `DNA Sequencer` (invoked via the MCP `mint_complete_organism_ecosystem` tool) triggers mitosis. The Nucleus splits into three specialized daughter cells (`LEAF_INTEL`, `STEM_SAAS`, and `ROOT_DEVSECOPS`) and broadcasts the initial macro-blueprint.

2. **LEAF_INTEL (The Scout)**
   - Wakes up and immediately processes the `intel-mesh.json` protocol.
   - Executes the physical data scraper (`intel-scraper.ts`), which targets specific market environments (e.g., East African tech logistics) to find unserved bottlenecks.
   - Packages the trend data into a structured payload (`market-trends.json`).
   - Secretes the `MARKET_INTELLIGENCE_VALIDATED` hormone onto the IPC Bus.

3. **STEM_SAAS (The Builder)**
   - Remains dormant upon birth, passively listening to the Biochemical Bus.
   - Receptors trigger when `MARKET_INTELLIGENCE_VALIDATED` flows through the bloodstream.
   - The cell parses the intelligence payload and dynamically overrides its core objective (`process.env.SAAS_PROMPT = dynamicPrompt`).
   - Executes the `saas-mint.json` protocol, compiling a physical React/Vite codebase fully customized to solve the bottleneck discovered by the Intel scout.
   - Upon successful build, secretes the `COMPILE_SUCCESS_DEPLOY_REQUEST` hormone.

4. **ROOT_DEVSECOPS (The Shield)**
   - Catches the deployment request hormone.
   - Bootstraps the `protocol-devsecops-fortress` sandbox sequence.
   - Configures live networking pathways and proxies the compiled application to the cloud edge.
   - Fires a final `DEPLOYMENT_ABSOLUTE` hormone back up to the Master Nucleus to conclude the sequence.

## 🕹️ How to Execute the Cascade

To trigger the cascade, run the master genesis sequence from the terminal:

```bash
cd hyper-context-mcp
npm run build
node trigger-genesis.js
```

This will spawn the organism and simulate the real-time execution loop. You can monitor the progress by reading the terminal `console.error` trace output which prints the State Machine states and hormone transmissions.

## ⚙️ Technical Architecture

- **`src/intel-scraper.ts`**: The localized Node.js physical scraping script executed by the Intel State Machine.
- **`protocols/intel-mesh.json`**: The declarative instructions directing the Intel cell to allocate a workspace, run the scraper script, and synthesize the result.
- **`src/index.ts` (Receptor Handlers)**: Contains the localized listener blocks `if (CURRENT_CELL_ROLE === "STEM_SAAS" && hormone.type === "MARKET_INTELLIGENCE_VALIDATED")` which govern the behavioral response to IPC hormones.
