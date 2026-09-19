import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { StoreShape } from "./types.js";

const emptyStore: StoreShape = { workspaces: [], skills: [] };

export function dataPath(): string {
  const base = process.env.COMMANDER_PLUS_HOME || join(homedir(), ".commander-plus");
  return join(base, "public-core.json");
}

export async function readStore(): Promise<StoreShape> {
  try {
    return JSON.parse(await readFile(dataPath(), "utf8")) as StoreShape;
  } catch {
    return structuredClone(emptyStore);
  }
}

export async function writeStore(store: StoreShape): Promise<void> {
  const path = dataPath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2) + "\n", "utf8");
}
