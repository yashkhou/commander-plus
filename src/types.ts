export type Workspace = {
  id: string;
  name: string;
  root: string;
  kind: string;
  createdAt: string;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  capabilities: string[];
};

export type GuardianResult = {
  name: string;
  ok: boolean;
  detail: string;
};

export type StoreShape = {
  workspaces: Workspace[];
  skills: Skill[];
};
