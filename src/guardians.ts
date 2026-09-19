import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { listWorkspaces } from "./workspaces.js";
import type { GuardianResult } from "./types.js";

export async function workspaceHealth(): Promise<GuardianResult[]> {
  const results: GuardianResult[] = [];
  for (const workspace of await listWorkspaces()) {
    try {
      await access(workspace.root, constants.R_OK);
      results.push({ name: workspace.name, ok: true, detail: "root readable" });
    } catch {
      results.push({ name: workspace.name, ok: false, detail: "root unavailable" });
    }
  }
  return results;
}
