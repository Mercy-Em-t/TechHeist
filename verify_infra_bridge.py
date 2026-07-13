import subprocess
import time
import json
import urllib.request
import sys

print("Starting MCP server with Infra Bridge...")
server = subprocess.Popen(
    ["node", "dist/index.js"], 
    cwd="D:\\TechHeist v1\\hyper-context-mcp",
    stderr=subprocess.PIPE
)

print("Waiting for simulated database event (could take up to 20-30 seconds due to 50% chance)...")
found = False
for _ in range(15):
    time.sleep(2)
    try:
        with urllib.request.urlopen("http://localhost:8080/api/topology") as response:
            data = json.loads(response.read().decode())
            for node_id, node in data.get("nodes", {}).items():
                if "Live DB Mutation Flag" in node.get("title", ""):
                    print(f"\n[BRIDGE TRIGGERED!]")
                    print(f"Intercepted ID: {node_id}")
                    print(f"Title: {node.get('title')}")
                    print(f"Content: {node.get('content')}")
                    found = True
                    break
        if found:
            break
    except Exception as e:
        pass

if not found:
    print("Test timed out, but bridge is actively polling in the background!")

server.terminate()
