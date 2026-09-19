import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { registerWorkspace, listWorkspaces } from "./workspaces.js";
import { saveSkill, routeSkills } from "./skills.js";
import { workspaceHealth } from "./guardians.js";

const server = new McpServer({ name: "commander-plus", version: "0.1.0" });

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }]
});

server.registerTool("workspace_register", {
  description: "Register a local project workspace.",
  inputSchema: {
    name: z.string().min(1),
    root: z.string().min(1),
    kind: z.string().default("project")
  }
}, async ({ name, root, kind }) => text(await registerWorkspace(name, root, kind)));

server.registerTool("workspace_list", {
  description: "List registered local workspaces.",
  inputSchema: {}
}, async () => text(await listWorkspaces()));

server.registerTool("skill_save", {
  description: "Save a reusable skill with routing metadata.",
  inputSchema: {
    name: z.string().min(1),
    description: z.string().min(1),
    triggers: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([])
  }
}, async (input) => text(await saveSkill(input)));

server.registerTool("skill_route", {
  description: "Rank locally saved skills against a task intent.",
  inputSchema: { query: z.string().min(1) }
}, async ({ query }) => text(await routeSkills(query)));

server.registerTool("guardian_workspace_health", {
  description: "Check whether registered workspace roots remain readable.",
  inputSchema: {}
}, async () => text(await workspaceHealth()));

await server.connect(new StdioServerTransport());
