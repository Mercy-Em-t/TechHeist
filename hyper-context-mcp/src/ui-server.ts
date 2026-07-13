import * as http from "http";
import * as fs from "fs";
import * as path from "path";

export class UIServer {
  private port: number;
  private stateFilePath: string;
  private dashboardHtmlPath: string;

  constructor(port: number = 3035) {
    this.port = port;
    this.stateFilePath = path.join(process.cwd(), "network-state.json");
    this.dashboardHtmlPath = path.join(process.cwd(), "src", "ui", "dashboard.html");
  }

  public start() {
    const server = http.createServer((req, res) => {
      if (req.url === "/") {
        // Serve the stunning HTML dashboard
        if (fs.existsSync(this.dashboardHtmlPath)) {
          const html = fs.readFileSync(this.dashboardHtmlPath, "utf-8");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        } else {
          res.writeHead(404);
          res.end("Dashboard HTML not found.");
        }
      } else if (req.url === "/api/state") {
        // Serve the current network state to the frontend
        if (fs.existsSync(this.stateFilePath)) {
          const data = fs.readFileSync(this.stateFilePath, "utf-8");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ nodes: {}, edges: [] }));
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(this.port, () => {
      console.error(`[UI Layer] High-Fidelity Dashboard online at http://localhost:${this.port}`);
    });
  }
}
