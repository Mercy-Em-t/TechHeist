# Sovereign Engine // Cellular Mitosis Manual

## 1. The Biological Principle: Mitosis

Traditional software development creates monoliths or fragmented microservices that struggle to communicate. The Sovereign Agentic Operating Layer abandons this in favor of **Bio-Mimetic Architecture**. 

In biology, every cell in an organism contains the *exact same DNA blueprint*, but through differentiation, one cell becomes a root, another becomes a leaf, and another becomes fruit. We mirror this exactly.

Our `hyper-context-mcp` layer is the **Stem Cell** (The Nucleus). Because it contains the universal protocol code, it can undergo **Mitosis**—dynamically cloning its own source code, spawning a specialized daughter node (Root, Stem, or Leaf), and remaining part of the exact same unified nervous system.

---

## 2. How It Operates (The Mitosis Engine)

When a Mitosis event is triggered, the `MitosisEngine` (`src/mitosis.ts`) executes a precise 4-step biological division:

1. **DNA Duplication**: The engine physically copies the `hyper-context-mcp` blueprint directory into a new target path (e.g., `../spawned-cells/root-node`). It intelligently ignores ephemeral memory files (like `network-state.json`) and heavy caches (`node_modules`) to keep the clone pure.
2. **The Mutagen (Differentiation)**: The engine synthesizes a brand new `.env` file within the cloned directory. It injects a specialized `CELL_ROLE` (e.g., `Root`) and assigns an independent `PORT` (e.g., `8081`) so the new cell doesn't collide with the Nucleus.
3. **Bootstrapping**: The engine spawns a completely detached OS background process that runs `npm install` and `npm run build` inside the clone, booting it up autonomously.
4. **Nervous System IPC**: When the clone boots, it reads its own `.env` file. Recognizing it is a specialized `Root` cell (and not the `Stem`), it disables heavy UI dashboards and enters a lightweight sentinel mode. It then uses the `NervousSystemBridge` to ping the Nucleus, confirming it is alive and ready to receive biochemical signals.

---

## 3. User Manual: Triggering Mitosis

As an operator, you can manually force the Stem Cell to undergo Mitosis and spawn a specialized node.

### Option A: The Visual Dashboard (Recommended)
1. Launch the Sovereign Engine (`npm run start` inside the Nucleus).
2. Navigate to the UI Command Room (`http://localhost:8080`).
3. Click the purple **"🧬 TRIGGER CELLULAR MITOSIS (ROOT NODE)"** button located at the top of the header.
4. The dashboard will display the division progress. Within seconds, a new `root-node` folder will appear adjacent to your Nucleus, fully booted on port `8081`.

### Option B: The API Trigger
If you are orchestrating the Nucleus via external scripts or protocols, you can trigger Mitosis by sending a simple JSON payload to the internal API:

```bash
curl -X POST http://localhost:8080/api/trigger-action \
  -H "Content-Type: application/json" \
  -d '{"action": "TRIGGER_MITOSIS", "payload": {}}'
```

---

## 4. The Anatomy of a Multi-Cellular Organism

Once Mitosis occurs, your system structure looks like this:

```
TechHeist v1/
├── hyper-context-mcp/          <-- The Stem Cell (Nucleus, Port 8080)
│   ├── network-state.json      <-- The global memory graph
│   └── src/                    <-- Universal DNA Blueprint
│
└── spawned-cells/
    ├── root-node/              <-- Differentiated Daughter Cell (DevSecOps, Port 8081)
    │   ├── .env                <-- CELL_ROLE=Root
    │   └── src/                <-- Identical DNA Blueprint
    │
    └── saas-app/               <-- Differentiated Daughter Cell (SaaS, Port 8082)
        ├── .env                <-- CELL_ROLE=Leaf
        └── src/                <-- Identical DNA Blueprint
```

Because every single node shares the exact same MCP communication standard and `NervousSystemBridge` definitions, they act as a single, highly resilient, conscious entity.
