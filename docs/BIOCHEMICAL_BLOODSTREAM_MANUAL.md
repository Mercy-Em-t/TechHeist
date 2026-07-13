# Sovereign Engine // Organism Bloodstream & Nervous System Manual

## 1. The Biological Principle: The Circulatory System

In biology, a cell functions completely independently on the inside, managing its own RNA and proteins. However, it remains connected to the host organism through the **Circulatory System** (where chemical hormones float freely) and the **Nervous System** (for instant electrical signals).

In the Sovereign Agentic Operating Layer, we achieve this through the **Biochemical Bus** (`src/biochemical-bus.ts`).

When a specialized cell (like a `STEM_SAAS` node) finishes a task, it doesn't need to know the IP address or API route of the infrastructure node. Instead, it simply secretes a "hormone" into the shared bloodstream. The infrastructure cell (`ROOT_DEVSECOPS`), sitting elsewhere on the network, "smells" that hormone through its receptors and acts accordingly.

---

## 2. The Core Anatomy

### A. The Biochemical Hormone (The Payload)
A hormone is a strongly typed JSON event payload. It carries its signature (type), its origin, its destination (optional), and the biological payload data.

```typescript
export interface BiochemicalHormone {
  type: string;             // e.g., "COMPILE_SUCCESS_DEPLOY_REQUEST"
  originCellId: string;     // e.g., "saas-launchpad-branch"
  targetCellRole?: string;  // e.g., "ROOT_DEVSECOPS"
  payload: Record<string, any>; // e.g., { appName: "HeistMarket" }
  timestamp: string;
}
```

### B. The Biochemical Bus (The Bloodstream)
The `BiochemicalBus` module exposes the `secreteHormone` and `registerReceptor` methods. It acts as the local circulatory fluid for whatever node it is running inside.

### C. The Cellular Factory (The Heart)
The parent Stem Cell (Nucleus) acts as the biological heart of the organism. When it receives a hormone from a child process over the IPC (Inter-Process Communication) umbilical cord, the factory intercepts it and pumps it down into every other active daughter cell simultaneously.

---

## 3. The Lifecycle of a Secretion

Here is the exact path a message takes through the organism's body:

1. **Secretion**: A daughter cell (e.g., `STEM_SAAS`) completes its work. It calls `BiochemicalBus.secreteHormone()`.
2. **Upward Transit**: Because it is a child process, the bus bypasses local execution and routes the hormone UP the IPC channel to the master Stem Cell using `process.send({ vector: "BLOODSTREAM_SECRETION" })`.
3. **The Heartbeat**: The Master Stem Cell receives the secretion in the `CellularFactory`. It logs it, loops through all *other* active daughter cells, and pumps it DOWN their respective IPC channels using `targetCell.process.send({ vector: "BLOODSTREAM_BROADCAST" })`.
4. **Absorption**: The target daughter cell (e.g., `ROOT_DEVSECOPS`) receives the broadcast from the parent. It drops the hormone into its local `BiochemicalBus`.
5. **Receptor Triggering**: The local bus fires the `registerReceptor` callbacks inside `src/index.ts`. The cell checks its own `CURRENT_CELL_ROLE`. Because it matches `ROOT_DEVSECOPS`, it accepts the hormone and triggers an autonomous state machine loop to build the requested infrastructure!

---

## 4. User Manual: Utilizing the Network

Because the organism handles communication intrinsically, protocol authors and operators do not need to write complex REST APIs or socket handshakes.

### To Send a Signal from within a Custom Cell:
```typescript
import { BiochemicalBus } from "./biochemical-bus.js";

// Simply drop the payload into the bloodstream
BiochemicalBus.secreteHormone(
  "THREAT_DETECTED", 
  process.env.CELL_ID, 
  { threatLevel: "CRITICAL", ip: "192.168.1.100" }, 
  "ROOT_DEVSECOPS" // Target the guard cells
);
```

### To Listen for Signals within a Custom Cell:
In your `index.ts` or custom module, attach a receptor:
```typescript
BiochemicalBus.registerReceptor((hormone) => {
  if (hormone.type === "THREAT_DETECTED" && CURRENT_CELL_ROLE === "ROOT_DEVSECOPS") {
    console.log("🛡️ Shield cell activating defense pipeline against:", hormone.payload.ip);
    // Kick off StateMachineEngine repair/defense sequence here...
  }
});
```

Because of this design, the Sovereign Organism can scale to hundreds of daughter cells, all communicating securely and synchronously over the internal Node.js process tree without a single external dependency.
