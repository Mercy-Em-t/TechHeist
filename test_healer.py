import subprocess
import time
import json
import urllib.request
import sys

server = subprocess.Popen(["node", "dist/index.js"], cwd="D:\\TechHeist v1\\hyper-context-mcp", stderr=subprocess.PIPE)

print("Waiting up to 45s for ContainerDeploymentFault to trigger the healer...")
for _ in range(25):
    time.sleep(2)
    try:
        with urllib.request.urlopen("http://localhost:8080/api/topology") as response:
            data = json.loads(response.read().decode())
            for node_id, node in data.get("nodes", {}).items():
                if "Active Healing Instance" in node.get("title", "") and "finalized with state:" in node.get("content", ""):
                    print(f"\n[HEALING COMPLETED!]")
                    print(f"Title: {node.get('title')}")
                    print(f"Content: {node.get('content')}")
                    server.terminate()
                    sys.exit(0)
    except Exception as e:
        pass

print("Timed out waiting for 50% chance loop.")
server.terminate()
