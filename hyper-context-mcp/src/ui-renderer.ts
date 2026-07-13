import * as http from "http";
import * as fs from "fs";
import { ExecutionRuntime } from "./execution-runtime.js";
import { SecurityShieldL7 } from "./security-shield.js";

async function getJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

export class UiRendererDashboard {
  private server: http.Server | null = null;

  public launchDashboard(stateFilePath: string, port: number = 8080) {
    this.server = http.createServer(async (req, res) => {
      
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Headers": "Content-Type, X-Hub-Signature-256"
      };

      if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
      }

      const { P2pMeshEngine } = await import("./p2p-mesh.js");
      const { BiochemicalBus } = await import("./biochemical-bus.js");
      const { SensoryGateway } = await import("./sensory-gateway.js");

      // Endpoint 1: Read Topology State Matrix
      if (req.url === "/api/topology" && req.method === "GET") {
        res.writeHead(200, { ...headers, "Content-Type": "application/json" });
        if (fs.existsSync(stateFilePath)) {
          res.end(fs.readFileSync(stateFilePath, "utf-8"));
        } else {
          res.end(JSON.stringify({ nodes: {}, edges: [] }));
        }
        return;
      }

      // Endpoint 2: Unified Conversational Input (Gemini-Style Interaction Terminal)
      if (req.url === "/api/sensory/directive" && req.method === "POST") {
        const body = await getJsonBody(req);
        
        // LAYER 7 SHIELD: Clean and neutralize the raw text input string instantly
        const sanitizedDirective = SecurityShieldL7.sanitizeInput(body.directive || "");
        
        if (!sanitizedDirective) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: "Empty or highly anomalous textual signature intercepted." }));
          return;
        }

        const report = await SensoryGateway.processDirectIntent(sanitizedDirective);
        res.writeHead(200, { ...headers, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: report }));
        return;
      }

      // Endpoint 3: Secure Ingestion for Inter-Domain Sister Cell Whispers
      if (req.url === "/api/network/ingest-signal" && req.method === "POST") {
        const incomingHormone = await getJsonBody(req);
        const incomingSignature = req.headers["x-hub-signature-256"] as string;

        // LAYER 7 SHIELD: Cryptographic authentication check using our master secret key
        const isAuthentic = SecurityShieldL7.verifyPacketAuthenticity(incomingHormone, incomingSignature);

        if (!isAuthentic) {
          console.error(`🚨 [SECURITY BREACH ALERT]: Untrusted or altered signal dropped at Layer 7 from IP: ${req.socket.remoteAddress}`);
          res.writeHead(401, headers);
          res.end(JSON.stringify({ error: "Access Denied. Cryptographic packet signature verification failed." }));
          return;
        }
        
        console.error(`🧬 [Secured Ingestion]: Verified signature. Absorbing external signal: ${incomingHormone.type}`);
        BiochemicalBus.distributeToNervousSystem(incomingHormone);

        res.writeHead(200, { ...headers, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Signal authenticated and processed safely." }));
        return;
      }

      // Endpoint 4: Handle P2P Network Handshake Requests
      if (req.url === "/api/network/handshake" && req.method === "POST") {
        const body = await getJsonBody(req);
        
        if (!body.nodeId || !body.domainUrl) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: "Invalid systemic connection profile configuration parameters." }));
          return;
        }

        const registrationReport = P2pMeshEngine.registerPeer({
          nodeId: body.nodeId,
          operatorName: body.operatorName || "Anonymous Operator",
          domainUrl: body.domainUrl,
          handshakeToken: body.securityToken || "default-mesh-pass-xxxx",
          connectedAt: new Date().toISOString()
        });

        res.writeHead(200, { ...headers, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: registrationReport }));
        return;
      }

      // Catch-all: Server Static Dashboard View Interface Document
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Sovereign Node Hyper-Context Command Room</title>
          <style>
            body { margin: 0; background-color: #06070a; color: #f1f5f9; font-family: system-ui, sans-serif; display: flex; height: 100vh; overflow: hidden; }
            #control-panel { width: 340px; background: #0b0d14; border-right: 1px solid #1e293b; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; justify-content: space-between; }
            h2 { font-size: 0.9rem; color: #38bdf8; letter-spacing: 0.1em; margin-top: 0; text-transform: uppercase; padding-bottom: 8px; border-bottom: 1px solid #1e293b; }
            #terminal-feed { flex-grow: 1; background: #020305; border: 1px solid #1e293b; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 0.75rem; color: #10b981; overflow-y: auto; margin-bottom: 15px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6); }
            .input-box { background: #111524; border: 1px solid #1e293b; color: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 0.85rem; width: 100%; box-sizing: border-box; outline: none; transition: border 0.2s; }
            .input-box:focus { border-color: #38bdf8; }
            #main-content { flex-grow: 1; display: flex; flex-direction: column; background-image: radial-gradient(#171e2e 1px, transparent 1px); background-size: 20px 20px; }
            header { padding: 20px 30px; background: #0b0d14; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
            h1 { margin: 0; font-size: 1.1rem; letter-spacing: 0.05em; font-weight: 600; color: #f8fafc; }
            #graph-view { flex-grow: 1; padding: 30px; overflow-y: auto; }
            .card { background: #0b0d14; border: 1px solid #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #38bdf8; }
            .node-title { font-weight: 600; color: #f8fafc; font-size: 0.95rem; margin-bottom: 6px; }
            .node-content { font-size: 0.85rem; color: #94a3b8; line-height: 1.6; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div id="control-panel">
            <div>
              <h2>Sensory Interface</h2>
              <div id="terminal-feed">> Secure Link Absolute.<br>> Standing by for voice note transcription or text directives...</div>
            </div>
            <div>
              <input type="text" id="directive-input" class="input-box" placeholder="Type command (e.g., 'commune christmas')..." onkeydown="if(event.key==='Enter') sendDirective()">
            </div>
          </div>
          <div id="main-content">
            <header>
              <h1>CORE.TMSAVANNAH.COM // SYSTEM SHIELD MATRIX</h1>
              <div style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; background: #111827; padding: 4px 10px; border-radius: 12px; border: 1px solid #1e293b;">🔒 OSI LAYER 7 ENFORCED</div>
            </header>
            <div id="graph-view"></div>
          </div>
          <script>
            const feed = document.getElementById('terminal-feed');
            async function sendDirective() {
              const el = document.getElementById('directive-input');
              const cmd = el.value.trim();
              if(!cmd) return;
              el.value = '';
              feed.innerHTML += \`<br><span style="color:#38bdf8">> \${cmd}</span>\`;
              try {
                const res = await fetch('/api/sensory/directive', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ directive: cmd })
                });
                const data = await res.json();
                feed.innerHTML += \`<br><span style="color:#f1f5f9">> \${data.message || data.error}</span>\`;
                feed.scrollTop = feed.scrollHeight;
              } catch(e) {
                feed.innerHTML += '<br><span style="color:#ef4444">> Signal Drop.</span>';
              }
            }
            async function pollTopology() {
              try {
                const res = await fetch('/api/topology');
                const data = await res.json();
                const view = document.getElementById('graph-view');
                view.innerHTML = '';
                Object.values(data.nodes).forEach(node => {
                  const card = document.createElement('div');
                  card.className = 'card';
                  if(node.tags && node.tags.includes('seasonal-commune')) card.style.borderLeftColor = '#ef4444';
                  card.innerHTML = \`<div class="node-title">⬡ \${node.title}</div><div class="node-content">\${node.content}</div>\`;
                  view.appendChild(card);
                });
              } catch(e) {}
            }
            setInterval(pollTopology, 3000);
            pollTopology();
          </script>
        </body>
        </html>
      `);
    });

    this.server.listen(port, () => {
      console.error(`[Hardened Server]: Interactive Dashboard running on port ${port}`);
    });
  }
}
