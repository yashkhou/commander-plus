import { randomUUID } from "node:crypto";
import { readStore, writeStore } from "./store.js";
import type { Skill } from "./types.js";

const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));

export async function saveSkill(input: Omit<Skill, "id">): Promise<Skill> {
  const store = await readStore();
  const skill: Skill = { ...input, id: "skill_" + randomUUID().slice(0, 12) };
  store.skills.push(skill);
  await writeStore(store);
  return skill;
}

export async function routeSkills(query: string): Promise<Array<Skill & { score: number }>> {
  const q = words(query);
  const skills = (await readStore()).skills;
  return skills
    .map((skill) => {
      const hay = words([skill.name, skill.description, ...skill.triggers, ...skill.capabilities].join(" "));
      const score = [...q].reduce((n, token) => n + (hay.has(token) ? 1 : 0), 0);
      return { ...skill, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
