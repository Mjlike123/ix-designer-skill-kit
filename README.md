# IX Designer Skill Kit

Portable Agent Skill for turning PRDs, documents, screenshots, design files, URLs, or conversations into traceable UX/UI specifications and functional prototypes that reuse the target project's own components, Tokens, and interaction patterns.

## Composition

```text
ix-designer-core + <business>-profile + <agent>-adapter
```

- `ix-designer-core` owns the reusable interaction-design method and schemas.
- A business Profile points to the target product's design system, existing pages, terminology, output policy, and validation commands.
- An Agent Adapter maps required capabilities to Cursor or another Agent platform.

Core alone can analyze requirements, but design-system-aware prototype generation requires all three layers.

## Install in a Cursor project

Copy:

```text
.agents/skills/ix-designer-core/
.agents/skills/cursor-adapter/
```

Then copy the business template:

```text
templates/business-profile/
  → <target-project>/.agents/skills/<business>-profile/
```

Edit `<business>-profile/profile.yaml` so every path or API points to the target project.

Create a small business entry Skill:

```markdown
---
name: example-ix-designer
description: Turns Example product requirements into UX/UI specifications and functional prototypes using the Example design system.
---

# Example IX Designer

Load and compose:

1. `ix-designer-core`
2. `example-profile`
3. `cursor-adapter`

Then execute the Core workflow for the user's request.
```

## Required business configuration

- product platforms, principles, and terminology;
- Token, component, interaction-pattern, page, and module sources;
- internal UX knowledge sources;
- draft and approved output locations;
- prototype versus production-code permissions;
- tests, builds, and design-system validation.

Sources may be repository paths, packages, APIs, MCP services, or documentation. Prefer structured contracts over screenshots.

## Other Agent platforms

Implement an Adapter against:

```text
.agents/skills/ix-designer-core/specs/agent-adapter.schema.yaml
```

At minimum, provide repository reading/search, design-system query, output writing, prototype rendering, and runtime inspection—or declare an explicit fallback.

## Validate

```bash
npm install
npm test
```

The validator checks Core portability, schemas, the Cursor Adapter, and the example business Profile.

## Repository contents

```text
.agents/skills/ix-designer-core/  # portable workflow
.agents/skills/cursor-adapter/    # Cursor capability mapping
templates/business-profile/       # project-specific configuration starter
manifest.json                     # package composition metadata
```

Private repository. Do not add credentials, private PRDs, personal absolute paths, or proprietary design assets to shared Profiles.
