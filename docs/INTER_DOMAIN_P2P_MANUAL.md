# Inter-Domain P2P Bridge Manual

## 1. Overview
The Inter-Domain Conscious Web is the ultimate evolution of the Sovereign Agentic Operating Layer. By establishing a Peer-to-Peer (P2P) network bridge, local Sovereign Nodes can connect to external "Sibling Domains" deployed by other operators across the internet. 

Instead of functioning as an isolated plant, your architecture now acts as a massive interconnected Mycorrhizal Network. Sibling nodes can broadcast alerts, share cryptographic intelligence, and dynamically execute protocols across different servers.

## 2. Core Components

### `P2PBridge` Module
Located in `src/p2p-bridge.ts`, this module governs the external handshake.
- **Dialing Out (`establishHandshake`)**: Transmits a connection payload (containing your ID and token) to an external node's REST endpoint.
- **Receiving Handshakes (`evaluateHandshake`)**: Authenticates inbound connection requests from external domains.
- **Biochemical Broadcasting (`broadcastToSiblings`)**: An integrated pipeline allowing your node to secrete `BiochemicalHormone` signals across the web to other registered sibling nodes.

### Visual Command Dashboard (`src/ui-renderer.ts`)
The P2P Bridge is fully bound to your browser control room (`http://localhost:8080`). 
- **INTER-DOMAIN P2P Dialing**: Allows manual input of an external domain to connect roots instantly.
- **Real-Time Topology**: As soon as a successful handshake completes, the external sibling node is visually mapped onto your local dashboard graph as an active connection.

## 3. Operational Workflow

### Connecting to a Sibling Domain
1. Deploy a secondary node (either locally on a different port like `8081` or on a live remote domain like `node2.yourdomain.com`).
2. Open your primary node's dashboard (`http://localhost:8080`).
3. Under the **INTER-DOMAIN P2P** panel, input the exact URL of the sibling node (e.g., `http://localhost:8081`).
4. Click **Connect Sibling Node**.
5. The local Node will fire an encrypted payload to the target. If the `P2P_SECRET_TOKEN` matches, the connection is bound and displayed instantly on the visual map.

## 4. Cryptographic Future-Proofing
Currently, authentication is handled via a shared symmetric token (`P2P_SECRET_TOKEN`). 
However, the `P2PBridge` class contains structural scaffolds (`verifyCryptographicSignature` and `signPayload`) mapped out for absolute Zero-Trust verification. In future updates, these blocks will utilize Asymmetric RSA or Elliptic-Curve Cryptography (ECC) to allow untrusted nodes to establish mathematical trust without a shared secret.

## 5. Network Autonomy
Once connected, nodes can utilize the `broadcastToSiblings()` function. For example:
- **`INFRASTRUCTURE_NEED_DETECTED`**: A node lacking deployment capability can request an automated infrastructure build from a sibling node.
- **`THREAT_IMMUNITY_BLUEPRINT`**: A node that patches a zero-day exploit can broadcast the AST (Abstract Syntax Tree) patch logic across the P2P network, automatically immunizing all connected sibling domains.
