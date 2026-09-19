import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { readStore, writeStore } from "./store.js";
import type { Workspace } from "./types.js";

export async function registerWorkspace(name: string, root: string, kind = "project"): Promise<Workspace> {
  const absolute = resolve(root);
  const info = await stat(absolute);
  if (!info.isDirectory()) throw new Error("Workspace root must be a directory");
  const store = await readStore();
  const existing = store.workspaces.find((w) => w.name === name || w.root === absolute);
  if (existing) return existing;
  const workspace: Workspace = {
    id: "ws_" + randomUUID().slice(0, 12),
    name,
    root: absolute,
    kind,
    createdAt: new Date().toISOString()
  };
  store.workspaces.push(workspace);
  await writeStore(store);
  return workspace;
}

export async function listWorkspaces(): Promise<Workspace[]> {
  return (await readStore()).workspaces;
}
