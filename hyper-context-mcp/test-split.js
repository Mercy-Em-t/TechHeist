import { CellularFactory } from './dist/cellular-factory.js';
import * as fs from 'fs';
import * as path from 'path';

const STATE_FILE_PATH = path.join(process.cwd(), "network-state.json");
const memoryNetwork = fs.existsSync(STATE_FILE_PATH) ? JSON.parse(fs.readFileSync(STATE_FILE_PATH, "utf-8")) : {nodes: {}, edges: []};

const res = CellularFactory.triggerMitosis(process.cwd(), 'saas-launchpad-branch', 'STEM_SAAS');
console.log(res);

memoryNetwork.edges.push({
  source: "core-stem-cell",
  target: 'saas-launchpad-branch',
  relationType: "bifurcated_daughter_cell"
});
fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(memoryNetwork, null, 2));
