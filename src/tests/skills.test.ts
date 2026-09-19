import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("skill routing ranks matching capabilities", async () => {
  const home = await mkdtemp(join(tmpdir(), "commander-plus-test-"));
  process.env.COMMANDER_PLUS_HOME = home;
  const { saveSkill, routeSkills } = await import("../skills.js");
  await saveSkill({
    name: "Repository privacy",
    description: "Prepare repositories for safe public release",
    triggers: ["publish repository"],
    capabilities: ["privacy scan", "git hygiene"]
  });
  const [match] = await routeSkills("git privacy scan before publish");
  assert.equal(match.name, "Repository privacy");
  assert.ok(match.score >= 2);
  await rm(home, { recursive: true, force: true });
});
