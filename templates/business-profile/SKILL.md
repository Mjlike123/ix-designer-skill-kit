---
name: example-business-profile
description: Supplies one product's terminology, design-system sources, existing UI knowledge, output policy, prototype permissions, and validation commands to ix-designer-core. Copy and customize for the target business.
disable-model-invocation: true
---

# Example business profile

Before using this template:

1. Rename this directory and the frontmatter `name`.
2. Replace every example source in `profile.yaml`.
3. Verify that component, Token, interaction, page, and module sources are real.
4. Define whether the Agent may create prototypes or production code.
5. Add the target project's actual validation commands.

Load `profile.yaml`, then compose this Profile with `ix-designer-core` and the active Agent Adapter.

Structured design-system contracts have authority over screenshots and prose guidance. Missing design-system coverage must be reported as a gap rather than replaced with a fabricated component or Token.
