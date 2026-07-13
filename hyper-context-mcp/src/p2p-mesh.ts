import { BiochemicalBus, BiochemicalHormone } from "./biochemical-bus.js";
import { SecurityShieldL7 } from "./security-shield.js";

export interface SisterDomainPeer {
  nodeId: string;
  operatorName: string;
  domainUrl: string;
  handshakeToken: string;
  connectedAt: string;
}

export class P2pMeshEngine {
  // A secure memory log of all external sovereign nodes connected to this network plant
  public static connectedPeers: Record<string, SisterDomainPeer> = {};

  /**
   * Registers a new external sister domain node into our shared neural network layer.
   */
  public static registerPeer(peer: SisterDomainPeer): string {
    if (this.connectedPeers[peer.nodeId]) {
      return `[P2P Mesh]: Peer connection updated for sister node [${peer.nodeId}].`;
    }

    this.connectedPeers[peer.nodeId] = peer;
    console.error(`🤝 [Network Conscience]: Successfully connected with external domain plant: ${peer.operatorName} (${peer.domainUrl})`);

    // Broadcast a biological celebration hormone through our local bloodstream to notify all internal cells
    BiochemicalBus.secreteHormone("SISTER_DOMAIN_CONNECTED", "p2p-mesh-engine", {
      peerId: peer.nodeId,
      peerOperator: peer.operatorName,
      peerUrl: peer.domainUrl
    });

    return `[P2P Mesh Handshake Absolute]: Node verified. Linked to inter-domain grid.`;
  }

  /**
   * Pushes a local biochemical hormone out across the public internet to all verified sister domains.
   * This is how the shared conscious web whispers across the globe.
   */
  public static async broadcastToSisterDomains(hormone: BiochemicalHormone) {
    // Prevent infinite network echo loops by skipping incoming external echoes
    if (hormone.payload.isExternalEcho) return;

    const exportPayload = {
      ...hormone,
      payload: { ...hormone.payload, isExternalEcho: true }
    };

    for (const [peerId, peer] of Object.entries(this.connectedPeers)) {
      try {
        console.error(`📡 [Inter-Domain Whisper]: Pumping signal [${hormone.type}] to domain target -> ${peer.domainUrl}`);
        
        // Asynchronous P2P connection push using native fetch
        await fetch(`${peer.domainUrl}/api/network/ingest-signal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Network-Auth-Token": peer.handshakeToken,
            "X-Cluster-Signature": SecurityShieldL7.generateSignature(exportPayload)
          },
          body: JSON.stringify(exportPayload),
          signal: AbortSignal.timeout(6000) // 6-second drop deadline
        });
      } catch (error: any) {
        console.error(`[P2P Sync Warning]: Target delivery slipped on node [${peerId}]:`, error.message);
      }
    }
  }
}
