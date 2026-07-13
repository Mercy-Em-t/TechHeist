import subprocess
import time
import json
import urllib.request
import sys

# Boot the updated system
server = subprocess.Popen(["node", "dist/index.js"], cwd="D:\\TechHeist v1\\hyper-context-mcp", stderr=subprocess.PIPE, stdout=subprocess.PIPE)

print("Waiting 5s for the server to fully initialize...")
time.sleep(5)

print("\nSimulating operator clicking 'FORCE SSH REBOOT' button on the dashboard...")
try:
    req = urllib.request.Request("http://localhost:8080/api/trigger-action", method="POST")
    req.add_header('Content-Type', 'application/json')
    payload = json.dumps({"action": "FORCE_SSH_REBOOT", "payload": {"nodeId": "telemetry-primary-api-cluster"}}).encode('utf-8')
    urllib.request.urlopen(req, data=payload)
    print("Action triggered successfully via API.")
except Exception as e:
    print(f"Failed to hit API: {e}")

print("\nWaiting up to 15s for the state machine to run the recovery sequence...")
for _ in range(8):
    time.sleep(2)
    try:
        with urllib.request.urlopen("http://localhost:8080/api/topology") as response:
            data = json.loads(response.read().decode())
            for node_id, node in data.get("nodes", {}).items():
                if "Manual SSH Recovery" in node.get("title", "") and "completed" in node.get("content", ""):
                    print(f"\n[SSH OVERRIDE COMPLETED!]")
                    print(f"Title: {node.get('title')}")
                    print(f"Content:\n{node.get('content')}")
                    server.terminate()
                    sys.exit(0)
    except Exception as e:
        pass

print("Timed out.")
server.terminate()
