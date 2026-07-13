import { SensoryGateway } from './dist/sensory-gateway.js';
import './dist/index.js'; // Boots the UI and Biochemical bus

console.error("Booting core matrix logic to test Christmas commune...");

// Wait 2 seconds to allow the UI Command Room to spin up fully
setTimeout(() => {
  SensoryGateway.processDirectIntent("Initialize an inter-domain calendar commune so all plants can decide on how to present during the christmas season and share findings.")
    .then(console.log)
    .catch(console.error);
}, 2000);
