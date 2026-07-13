import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import json

async def run_test():
    server_params = StdioServerParameters(
        command="node",
        args=["--import", "tsx", "src/index.ts"],
        env={"NODE_ENV": "development"},
        cwd="D:\\TechHeist v1\\hyper-context-mcp"
    )
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            print("\n--- Running trigger_autonomous_sequence ---")
            try:
                result = await session.call_tool("trigger_autonomous_sequence", arguments={
                    "tasks": [
                        {
                        "id": "verify-node-env",
                        "command": "node -v",
                        "description": "Checking runtime binary deployment compatibility versions"
                        },
                        {
                        "id": "simulate-compilation-fault",
                        "command": "node -e \"process.exit(1)\"",
                        "description": "Intentionally simulating an engineering code crash to trigger the self-healing MUTATING state loop"
                        }
                    ]
                })
                text = result.content[0].text
                data = json.loads(text)
                print("\nFINAL STATE:", data.get("finalState"))
                print("EXECUTION BREAKDOWN LOGS:")
                for log in data.get("log", []):
                    print("  ->", log)
            except Exception as e:
                print("Error:", e)

if __name__ == "__main__":
    asyncio.run(run_test())
