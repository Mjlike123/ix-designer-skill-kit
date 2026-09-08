#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coreRoot = join(root, ".agents/skills/ix-designer-core");
const adapterRoot = join(root, ".agents/skills/cursor-adapter");
const profileRoot = join(root, "templates/business-profile");

async function readYaml(path) {
  return YAML.parse(await readFile(path, "utf8"));
}

async function requireFiles(paths) {
  for (const path of paths) {
    await stat(path);
  }
}

async function validateYaml(schemaName, dataPath) {
  const schema = await readYaml(join(coreRoot, "specs", schemaName));
  const data = await readYaml(dataPath);
  const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
  if (!validate(data)) {
    throw new Error(
      `${dataPath} does not match ${schemaName}:\n${JSON.stringify(validate.errors, null, 2)}`,
    );
  }
}

async function collectTextFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await collectTextFiles(path)));
    } else if (/\.(?:md|json|ya?ml|mjs)$/.test(entry.name)) {
      result.push(path);
    }
  }
  return result;
}

async function main() {
  await requireFiles([
    join(coreRoot, "SKILL.md"),
    join(coreRoot, "references/composition-contract.md"),
    join(coreRoot, "references/profile-authoring.md"),
    join(coreRoot, "references/deliverables.md"),
    join(coreRoot, "specs/requirement-brief.schema.yaml"),
    join(coreRoot, "specs/interaction-spec.schema.yaml"),
    join(coreRoot, "specs/business-profile.schema.yaml"),
    join(coreRoot, "specs/agent-adapter.schema.yaml"),
    join(adapterRoot, "SKILL.md"),
    join(adapterRoot, "adapter.yaml"),
    join(profileRoot, "SKILL.md"),
    join(profileRoot, "profile.yaml"),
    join(root, "manifest.json"),
  ]);

  const coreSkill = await readFile(join(coreRoot, "SKILL.md"), "utf8");
  if (coreSkill.split("\n").length > 500) {
    throw new Error("ix-designer-core/SKILL.md must stay under 500 lines");
  }

  const forbiddenCoreCoupling = [
    ["business name", /\bTopTop\b/i],
    ["Agent vendor", /\bCursor\b/i],
    ["document vendor", /\b(?:Feishu|Lark)\b/i],
    ["private draft path", /\.monkren/],
    ["source project path", /apps\/design-system-portal/],
  ];
  for (const [label, pattern] of forbiddenCoreCoupling) {
    if (pattern.test(coreSkill)) {
      throw new Error(`ix-designer-core contains ${label} coupling`);
    }
  }

  await validateYaml(
    "business-profile.schema.yaml",
    join(profileRoot, "profile.yaml"),
  );
  await validateYaml(
    "agent-adapter.schema.yaml",
    join(adapterRoot, "adapter.yaml"),
  );

  JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));

  for (const path of await collectTextFiles(root)) {
    const content = await readFile(path, "utf8");
    if (/\/Users\/[^/\s]+/.test(content)) {
      throw new Error(`Personal absolute path found in ${path}`);
    }
    if (/(?:ghp|github_pat|gho)_[A-Za-z0-9_]{16,}/.test(content)) {
      throw new Error(`Possible GitHub token found in ${path}`);
    }
  }

  console.log("IX Designer Skill Kit valid.");
}

main().catch((error) => {
  console.error(`Validation failed: ${error.message}`);
  process.exit(1);
});
