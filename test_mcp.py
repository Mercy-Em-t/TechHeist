import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

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
            
            # Step 1: Call route_external_data
            print("--- Running Step 1: route_external_data ---")
            try:
                result1 = await session.call_tool("route_external_data", arguments={
                    "sourceSystem": "Supabase",
                    "dataType": "OrderHook",
                    "rawPayload": { "id": "9982", "title": "Real-time Edge State Trigger", "amount": 420.00, "status": "processing", "tags": ["live-stream", "test-run"] }
                })
                print(result1)
            except Exception as e:
                print("Error in Step 1:", e)
                
            # Step 2: Call execute_runtime_command
            print("\n--- Running Step 2: execute_runtime_command ---")
            try:
                result2 = await session.call_tool("execute_runtime_command", arguments={
                    "command": "node -e \"console.log('Active Engine Subsystem Verification:', process.env.AGENT_RUNTIME)\""
                })
                print(result2)
            except Exception as e:
                print("Error in Step 2:", e)

if __name__ == "__main__":
    asyncio.run(run_test())
