import subprocess
import time
import json
import urllib.request
import sys

# Start server
print("Starting MCP server...")
server = subprocess.Popen(
    ["node", "dist/index.js"], 
    cwd="D:\\TechHeist v1\\hyper-context-mcp",
    stderr=subprocess.PIPE
)
time.sleep(3)

# Touch file
print("Triggering ambient file modification...")
with open("D:\\TechHeist v1\\hyper-context-mcp\\test-delta.txt", "w") as f:
    f.write("trigger delta")
time.sleep(2)

# Check API endpoint
print("Checking UI Dashboard API endpoint...")
try:
    with urllib.request.urlopen("http://localhost:8080/api/topology") as response:
        data = json.loads(response.read().decode())
        print("TOPOLOGY API RESPONSE:")
        for node_id, node in data.get("nodes", {}).items():
            print(f"- {node_id}: {node.get('title')}")
except Exception as e:
    print("API Error:", e)

# Clean up
server.terminate()
