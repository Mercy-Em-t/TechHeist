import { CellularFactory } from './dist/cellular-factory.js';
import { BiochemicalBus } from './dist/biochemical-bus.js';

console.error("1. Spawning the Guard Cell...");
CellularFactory.triggerMitosis(process.cwd(), "infrastructure-shield-node", "ROOT_DEVSECOPS");

setTimeout(() => {
  console.error("\n2. Simulating SaaS node secretion. Pumping hormone to all connected cells...");
  
  const hormone = {
    type: "COMPILE_SUCCESS_DEPLOY_REQUEST",
    originCellId: "saas-launchpad-branch",
    targetCellRole: "ROOT_DEVSECOPS",
    payload: { appName: "HeistMarketSaaS", version: "1.0.0" },
    timestamp: new Date().toISOString()
  };

  // The parent pushes it down to the child just as the IPC listener would
  Object.entries(CellularFactory.activeDaughterCells).forEach(([id, targetCell]) => {
    targetCell.process.send({ vector: "BLOODSTREAM_BROADCAST", hormone });
  });
}, 3000);
