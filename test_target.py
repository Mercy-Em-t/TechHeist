import subprocess
import time
import json
import urllib.request
import sys

server = subprocess.Popen(["node", "dist/index.js"], cwd="D:\\TechHeist v1\\hyper-context-mcp", stderr=subprocess.PIPE)

print("Waiting up to 30s for the live external target scanner to log telemetry...")
for _ in range(15):
    time.sleep(2)
    try:
        with urllib.request.urlopen("http://localhost:8080/api/topology") as response:
            data = json.loads(response.read().decode())
            for node_id, node in data.get("nodes", {}).items():
                if "Live Telemetry" in node.get("title", ""):
                    print(f"\n[TARGET SCANNED!]")
                    print(f"Title: {node.get('title')}")
                    print(f"Content:\n{node.get('content')}")
                    server.terminate()
                    sys.exit(0)
    except Exception as e:
        pass

print("Timed out.")
server.terminate()
