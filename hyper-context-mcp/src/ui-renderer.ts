import * as http from "http";
import * as fs from "fs";
import * as path from "path";

export class UiRendererDashboard {
  private server: http.Server | null = null;

  /**
   * Launches a local, zero-dependency visual command room server to display the network topology graph.
   * Now securely accepts manual execution triggers pushed from the UI.
   */
  public launchDashboard(stateFilePath: string, port: number = 8080, onActionTrigger?: (action: string, payload: any) => void) {
    this.server = http.createServer((req, res) => {
      // Endpoint 1: Send the raw network layout state to the UI view layer
      if (req.url === "/api/topology" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        if (fs.existsSync(stateFilePath)) {
          const data = fs.readFileSync(stateFilePath, "utf-8");
          res.end(data);
        } else {
          res.end(JSON.stringify({ nodes: {}, edges: [] }));
        }
        return;
      }

      // Endpoint 1.5: Secure API Endpoint for Manual Dashboard Actions
      if (req.url === "/api/trigger-action" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (onActionTrigger) onActionTrigger(parsed.action, parsed.payload);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "success" }));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: "Invalid payload format" }));
          }
        });
        return;
      }

      // Endpoint 2: The Visual Interactive UI Dashboard View Document
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Hyper-Context Control Topology Room</title>
          <style>
            body { margin: 0; background-color: #0d0e12; color: #e2e8f0; font-family: system-ui, sans-serif; overflow: hidden; }
            header { padding: 15px 25px; background: #151922; border-bottom: 1px solid #222938; display: flex; justify-content: space-between; align-items: center; }
            h1 { margin: 0; font-size: 1.2rem; letter-spacing: 0.05em; color: #38bdf8; }
            #canvas-container { position: relative; width: 100vw; height: calc(100vh - 60px); display: flex; justify-content: center; align-items: center; }
            .grid-overlay { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(#1e293b 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
            #graph-view { width: 90%; height: 85%; border: 1px solid #1e293b; background: #090a0f; border-radius: 12px; padding: 20px; overflow-y: auto; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
            .card { background: #151922; border: 1px solid #222938; padding: 15px; border-radius: 8px; margin-bottom: 15px; transition: border-color 0.3s; position: relative; }
            .card:hover { border-color: #38bdf8; }
            .node-title { color: #f8fafc; font-weight: 600; margin-bottom: 6px; font-size: 1.05rem; }
            .node-content { font-size: 0.9rem; color: #94a3b8; line-height: 1.4; }
            .tag { display: inline-block; background: #1e293b; color: #38bdf8; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; margin-right: 5px; margin-top: 8px; }
            
            /* Interactive Action Button Styles */
            .action-btn { background: rgba(220, 38, 38, 0.1); color: #ef4444; border: 1px solid #ef4444; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; margin-top: 12px; text-transform: uppercase; font-weight: bold; display: block; width: fit-content; }
            .action-btn:hover { background: #ef4444; color: white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
            
            #webgl-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; display: none; }
            #matrix-config-panel { position: absolute; top: 20px; right: 20px; background: rgba(13, 14, 18, 0.85); border: 1px solid #38bdf8; padding: 15px; border-radius: 8px; z-index: 10; display: none; color: #38bdf8; backdrop-filter: blur(4px); }
            .config-select { background: #1e293b; color: #f8fafc; border: 1px solid #38bdf8; padding: 5px; border-radius: 4px; margin-top: 8px; width: 100%; outline: none; }
          </style>
          
          <!-- Inject Three.js and OrbitControls -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        </head>
        <body>
          <header>
            <div>
              <h1>HYPER-CONTEXT CONTROL NET // OPERATIONAL OVERVIEW</h1>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 5px;">STATUS: ACTIVE LIVE LINK</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <input type="text" id="saas-idea-input" placeholder="Drop SaaS Idea..." style="padding: 8px; border-radius: 4px; border: 1px solid #222938; background: #090a0f; color: #e2e8f0; width: 250px;">
              <button id="mint-saas-btn" class="action-btn" style="margin: 0; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border-color: #38bdf8; font-size: 0.85rem; padding: 8px 16px;">🌱 MINT SAAS</button>
              <button id="intel-mesh-btn" class="action-btn" style="margin: 0; background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: #22c55e; font-size: 0.85rem; padding: 8px 16px;">🌐 LAUNCH INTEL MESH</button>
              <button id="matrix-btn" class="action-btn" style="margin: 0; background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: #f59e0b; font-size: 0.85rem; padding: 8px 16px;">🌌 ENTER 3D MATRIX</button>
              <button id="mitosis-btn" class="action-btn" style="margin: 0; background: rgba(168, 85, 247, 0.1); color: #a855f7; border-color: #a855f7; font-size: 0.85rem; padding: 8px 16px;">🧬 TRIGGER CELLULAR MITOSIS (ROOT NODE)</button>
            </div>
          </header>
          <div id="canvas-container">
            <div class="grid-overlay"></div>
            <div id="graph-view">
              <div style="text-align: center; color: #64748b; margin-top: 20px;">Polled Engine State Processing Elements...</div>
            </div>
            <div id="webgl-canvas"></div>
            <div id="matrix-config-panel">
              <div style="font-size: 0.9rem; font-weight: bold; border-bottom: 1px solid #38bdf8; padding-bottom: 5px; margin-bottom: 10px;">MATRIX CONFIGURATION</div>
              <label style="font-size: 0.75rem;">LAYOUT ALGORITHM</label>
              <select id="layout-select" class="config-select">
                <option value="ORBITAL" selected>Orbital (Default)</option>
                <option value="FORCE_DIRECTED">Force-Directed Graph</option>
                <option value="HIERARCHICAL">Hierarchical Tree</option>
                <option value="GRID">Grid Matrix</option>
              </select>
            </div>
          </div>
          <script>
            // 3D Matrix Global State
            let matrixActive = false;
            let threeScene, threeCamera, threeRenderer, threeControls;
            let meshNodes = {};
            let currentTopologyData = null;
            
            const MATRIX_CONFIG = {
              layout: 'ORBITAL' // Default
            };
            
            document.getElementById('layout-select').addEventListener('change', (e) => {
              MATRIX_CONFIG.layout = e.target.value;
              if (matrixActive && currentTopologyData) {
                render3DMatrix(currentTopologyData);
              }
            });
            document.getElementById('mint-saas-btn').onclick = async () => {
              const input = document.getElementById('saas-idea-input');
              const idea = input.value.trim();
              if(!idea) return;
              
              const btn = document.getElementById('mint-saas-btn');
              btn.innerText = 'MINTING...';
              btn.style.pointerEvents = 'none';
              try {
                await fetch('/api/trigger-action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'MINT_SAAS', payload: { idea: idea } })
                });
                btn.innerText = 'CELL SPAWNED';
                btn.style.background = '#22c55e';
                btn.style.color = '#fff';
                btn.style.borderColor = '#22c55e';
                input.value = '';
              } catch (e) {
                btn.innerText = 'MINT FAILED';
              }
            };

            document.getElementById('mitosis-btn').onclick = async () => {
              const btn = document.getElementById('mitosis-btn');
              btn.innerText = 'DIVIDING DNA...';
              btn.style.pointerEvents = 'none';
              try {
                await fetch('/api/trigger-action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'TRIGGER_MITOSIS', payload: {} })
                });
                btn.innerText = 'CELL SPAWNED';
                btn.style.background = '#22c55e';
                btn.style.color = '#fff';
                btn.style.borderColor = '#22c55e';
              } catch (e) {
                btn.innerText = 'MITOSIS FAILED';
              }
            };

            document.getElementById('intel-mesh-btn').onclick = async () => {
              const btn = document.getElementById('intel-mesh-btn');
              btn.innerText = 'DEPLOYING...';
              btn.style.pointerEvents = 'none';
              try {
                await fetch('/api/trigger-action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'LAUNCH_INTEL_MESH', payload: {} })
                });
                btn.innerText = 'MESH DEPLOYED';
              } catch (e) {
                btn.innerText = 'DEPLOY FAILED';
              }
            };

            document.getElementById('matrix-btn').onclick = () => {
              const view = document.getElementById('graph-view');
              const webgl = document.getElementById('webgl-canvas');
              const configPanel = document.getElementById('matrix-config-panel');
              const btn = document.getElementById('matrix-btn');
              
              if (!matrixActive) {
                matrixActive = true;
                view.style.display = 'none';
                webgl.style.display = 'block';
                configPanel.style.display = 'block';
                btn.innerText = '🔙 EXIT 3D MATRIX';
                btn.style.background = '#f59e0b';
                btn.style.color = '#fff';
                
                initThreeJS();
                if(currentTopologyData) render3DMatrix(currentTopologyData);
              } else {
                matrixActive = false;
                view.style.display = 'block';
                webgl.style.display = 'none';
                configPanel.style.display = 'none';
                btn.innerText = '🌌 ENTER 3D MATRIX';
                btn.style.background = 'rgba(245, 158, 11, 0.1)';
                btn.style.color = '#f59e0b';
                
                if (threeRenderer) {
                  threeRenderer.dispose();
                  webgl.innerHTML = '';
                  threeRenderer = null;
                }
              }
            };
            
            function initThreeJS() {
              const container = document.getElementById('webgl-canvas');
              container.innerHTML = '';
              
              threeScene = new THREE.Scene();
              // Add a subtle ambient light and a point light
              threeScene.add(new THREE.AmbientLight(0x222222));
              const light = new THREE.PointLight(0xffffff, 1, 1000);
              light.position.set(50, 50, 50);
              threeScene.add(light);

              threeCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
              threeCamera.position.set(0, 100, 250);

              threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
              threeRenderer.setSize(container.clientWidth, container.clientHeight);
              threeRenderer.setPixelRatio(window.devicePixelRatio);
              container.appendChild(threeRenderer.domElement);

              threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
              threeControls.enableDamping = true;
              threeControls.dampingFactor = 0.05;

              const animate = function () {
                if (!matrixActive) return;
                requestAnimationFrame(animate);
                
                // Add idle rotation to nodes
                Object.values(meshNodes).forEach(mesh => {
                  mesh.rotation.y += 0.01;
                  mesh.rotation.x += 0.005;
                });
                
                threeControls.update();
                threeRenderer.render(threeScene, threeCamera);
              };
              animate();
            }

            function render3DMatrix(data) {
              if (!threeScene) return;
              
              // Clear previous meshes
              while(threeScene.children.length > 0){ 
                  threeScene.remove(threeScene.children[0]); 
              }
              // Re-add lights
              threeScene.add(new THREE.AmbientLight(0x222222));
              const light = new THREE.PointLight(0xffffff, 1, 1000);
              light.position.set(50, 50, 50);
              threeScene.add(light);
              
              meshNodes = {};
              const nodes = Object.values(data.nodes);
              const nodeCount = nodes.length;
              
              const geometry = new THREE.IcosahedronGeometry(10, 1);
              
              // Calculate Layout
              nodes.forEach((node, index) => {
                let color = 0x38bdf8; // Blue default
                if (node.tags && node.tags.includes('root')) color = 0xa855f7; // Purple Nucleus
                if (node.tags && node.tags.includes('live-network')) color = 0x22c55e; // Green Live
                
                const material = new THREE.MeshPhongMaterial({ 
                  color: color, 
                  emissive: color,
                  emissiveIntensity: 0.4,
                  wireframe: true 
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Apply Layout positioning
                if (MATRIX_CONFIG.layout === 'ORBITAL') {
                  if (index === 0) {
                    mesh.position.set(0, 0, 0); // Nucleus Center
                  } else {
                    const angle = (index / (nodeCount - 1)) * Math.PI * 2;
                    const radius = 80;
                    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 20, Math.sin(angle) * radius);
                  }
                } else if (MATRIX_CONFIG.layout === 'GRID') {
                  const cols = Math.ceil(Math.sqrt(nodeCount));
                  const x = (index % cols) * 40 - ((cols * 40) / 2);
                  const z = Math.floor(index / cols) * 40 - ((cols * 40) / 2);
                  mesh.position.set(x, 0, z);
                } else if (MATRIX_CONFIG.layout === 'HIERARCHICAL') {
                  const depth = index === 0 ? 0 : 1; // Simplistic
                  mesh.position.set((index - nodeCount/2) * 30, -depth * 50, 0);
                } else {
                  // FORCE_DIRECTED (Random placeholder for now)
                  mesh.position.set((Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150);
                }
                
                meshNodes[node.id] = mesh;
                threeScene.add(mesh);
              });
              
              // Draw Edges
              const materialLine = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
              data.edges.forEach(edge => {
                const sourceNode = meshNodes[edge.source];
                const targetNode = meshNodes[edge.target];
                if (sourceNode && targetNode) {
                  const points = [sourceNode.position, targetNode.position];
                  const geomLine = new THREE.BufferGeometry().setFromPoints(points);
                  const line = new THREE.Line(geomLine, materialLine);
                  threeScene.add(line);
                }
              });
            }

            async function fetchTopology() {
              try {
                const res = await fetch('/api/topology');
                const data = await res.json();
                currentTopologyData = data;
                
                if (matrixActive) {
                  render3DMatrix(data);
                  return; // Don't render 2D cards if in Matrix mode
                }

                const view = document.getElementById('graph-view');
                view.innerHTML = '';
                
                const nodes = Object.values(data.nodes);
                if(nodes.length === 0) {
                  view.innerHTML = '<p style="color:#64748b; text-align:center;">No topology configurations mapped to data layer disk patterns yet.</p>';
                  return;
                }
                
                nodes.forEach(node => {
                  const card = document.createElement('div');
                  card.className = 'card';
                  
                  const title = document.createElement('div');
                  title.className = 'node-title';
                  title.innerText = "⬡ " + node.title + " (" + node.id + ")";
                  
                  const content = document.createElement('div');
                  content.className = 'node-content';
                  content.innerText = node.content;
                  
                  card.appendChild(title);
                  card.appendChild(content);
                  
                  if(node.tags) {
                    node.tags.forEach(t => {
                      const tagSpan = document.createElement('span');
                      tagSpan.className = 'tag';
                      tagSpan.innerText = t;
                      card.appendChild(tagSpan);
                    });

                    // Inject the interactive FORCE SSH REBOOT button for live network nodes
                    if(node.tags.includes("live-network") || node.tags.includes("telemetry")) {
                      const actionBtn = document.createElement('button');
                      actionBtn.className = 'action-btn';
                      actionBtn.innerText = '⚡ Force SSH Reboot';
                      actionBtn.onclick = async () => {
                        actionBtn.innerText = 'INITIATING...';
                        actionBtn.style.pointerEvents = 'none';
                        try {
                          await fetch('/api/trigger-action', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'FORCE_SSH_REBOOT', payload: { nodeId: node.id } })
                          });
                          actionBtn.innerText = 'DISPATCHED';
                          actionBtn.style.background = '#22c55e';
                          actionBtn.style.color = '#fff';
                          actionBtn.style.borderColor = '#22c55e';
                        } catch (e) {
                          actionBtn.innerText = 'FAILED';
                        }
                      };
                      card.appendChild(actionBtn);
                    }

                    // Inject the interactive EXECUTE PROTOCOL button for loaded schemas
                    if(node.tags.includes("protocol-registry")) {
                      // Extract the raw protocol ID from the node ID (e.g. registry-protocol-saas-launchpad -> protocol-saas-launchpad)
                      const protocolId = node.id.replace('registry-', '');
                      const protoBtn = document.createElement('button');
                      protoBtn.className = 'action-btn';
                      protoBtn.style.color = '#f59e0b';
                      protoBtn.style.borderColor = '#f59e0b';
                      protoBtn.style.background = 'rgba(245, 158, 11, 0.1)';
                      protoBtn.innerText = '🚀 EXECUTE PROTOCOL';
                      protoBtn.onclick = async () => {
                        protoBtn.innerText = 'LAUNCHING...';
                        protoBtn.style.pointerEvents = 'none';
                        try {
                          await fetch('/api/trigger-action', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'EXECUTE_PROTOCOL', payload: { protocolId: protocolId } })
                          });
                          protoBtn.innerText = 'DISPATCHED';
                          protoBtn.style.background = '#22c55e';
                          protoBtn.style.color = '#fff';
                          protoBtn.style.borderColor = '#22c55e';
                        } catch (e) {
                          protoBtn.innerText = 'FAILED';
                        }
                      };
                      card.appendChild(protoBtn);
                    }
                  }
                  
                  view.appendChild(card);
                });
              } catch (e) {
                console.error("Topology UI extraction link exception:", e);
              }
            }
            fetchTopology();
            setInterval(fetchTopology, 3000); // Polling update routine ticks every 3 seconds
          </script>
        </body>
        </html>
      `);
    });

    this.server.listen(port, () => {
      console.error(`[UI Dashboard Server]: Operational Room live at http://localhost:${port}`);
    });
  }
}
