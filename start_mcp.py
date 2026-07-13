from techheist.mcp_server.server import mcp

if __name__ == "__main__":
    print("Starting TechHeist Hyper-Context MCP Server via stdio...")
    mcp.run(transport='stdio')
