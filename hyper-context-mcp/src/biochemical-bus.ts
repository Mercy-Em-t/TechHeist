export interface BiochemicalHormone {
  type: string;          // The signature (e.g., "DEPLOYMENT_REQUESTED", "THREAT_DETECTED", "STATE_ALIGNMENT_TICK", "TELEMETRY_REPORT", "GENETIC_MEMORY_UPDATE", "MARKET_GAP_DETECTED", "EXTRUSION_READY", "ABSOLUTE_DEPLOYMENT")
  originCellId: string;  // Who secreted it
  targetCellRole?: string; // Optional targeted destination role
  payload: Record<string, any>;
  timestamp: string;
}

export class BiochemicalBus {
  private static listeners: Array<(hormone: BiochemicalHormone) => void> = [];

  /**
   * Secretes a biochemical hormone into the shared organism bloodstream.
   * If running inside a child process fork, it routes via the IPC channel up to the parent stem node.
   */
  public static secreteHormone(type: string, originId: string, payload: Record<string, any>, targetRole?: string) {
    const hormone: BiochemicalHormone = {
      type,
      originCellId: originId,
      targetCellRole: targetRole,
      payload,
      timestamp: new Date().toISOString()
    };

    // If this instance is a child process, pump it up the umbilical cord (IPC)
    if (process.send) {
      process.send({ vector: "BLOODSTREAM_SECRETION", hormone });
    } else {
      // If we are the parent stem node, distribute it to all local listeners immediately
      this.distributeToNervousSystem(hormone);
    }
  }

  /**
   * Connects a cell's internal receptors to listen to global bloodstream events.
   */
  public static registerReceptor(callback: (hormone: BiochemicalHormone) => void) {
    this.listeners.push(callback);
  }

  /**
   * Broadcasts the biochemical signal down to all listening cell blocks.
   */
  public static distributeToNervousSystem(hormone: BiochemicalHormone) {
    this.listeners.forEach(listener => {
      try {
        listener(hormone);
      } catch (e) {
        console.error("[Nervous System Fault]: Receptor failed to process hormone line:", e);
      }
    });
  }
}
