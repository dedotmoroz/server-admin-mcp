import express from "express";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const shellExec = promisify(execCb);

function createMcpServer() {
  const server = new McpServer({ name: "vps-admin", version: "1.0.2" });

  server.tool("exec", "Execute a shell command on the VPS and return stdout/stderr",
    { command: z.string(), cwd: z.string().optional(), timeout: z.number().min(1000).max(120000).optional() },
    async ({ command, cwd, timeout }) => {
      try {
        const { stdout, stderr } = await shellExec(command, {
          cwd, timeout: timeout ?? 30000, maxBuffer: 10 * 1024 * 1024
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, stdout, stderr }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({
          success: false, stdout: error.stdout ?? "", stderr: error.stderr ?? error.message, exitCode: error.code
        }, null, 2) }] };
      }
    }
  );

  server.tool("read_file", "Read a text file from the VPS", { path: z.string() },
    async ({ path }) => {
      try {
        return { content: [{ type: "text", text: await fs.readFile(path, "utf8") }] };
      } catch (error) {
        return { isError: true, content: [{ type: "text", text: "ERROR: " + error.message }] };
      }
    }
  );
  return server;
}

const app = express();
app.use(express.json({ limit: "10mb" }));
app.post("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(3001, "127.0.0.1", () => console.log("VPS MCP listening on http://127.0.0.1:3001/mcp"));
