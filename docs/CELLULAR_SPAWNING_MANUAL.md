# Sovereign Engine // Cellular Spawning Manual

The Sovereign Agentic Operating Layer is a "Stem Cell". It does not run projects internally; it **spawns** them.

By utilizing the `workspace` property in your Pluggable Protocol Schemas, you can command the engine to automatically create a separate directory—a Child Cell—and execute its commands inside that isolated environment.

---

## 1. Prerequisites for Spawning

Before you can branch off and spin up complex child cells, your underlying system must meet the prerequisites defined by your protocol. While the engine handles orchestration, it relies on your local environment tools to execute the actual scaffolding commands.

Ensure you have the following configured before triggering a spawn:

* **Node.js & npm**: Required for the core engine, as well as running basic JS build tools (`npx`, `npm init`).
* **Git**: Required if your protocol uses `git init` or `git clone` to version control the new cell.
* **GitHub CLI (`gh`)**: *(Optional but recommended)* Required if your protocol contains commands like `gh repo create` to spin up remote-backed repositories automatically.
* **Env Vault (`.env`)**: Ensure your local `hyper-context-mcp/.env` file contains the exact security tokens listed in the `hard` requirements of the JSON protocol you are trying to execute. If a hard token is missing, the engine will abort the spawn.

---

## 2. How Spawning Works

The `ExecutionRuntime` is a pure executor. It will **not** magically create directories for you. If you define a `workspace` that does not exist on your hard drive, the execution will crash.

Instead, the responsibility of *creating* the cell belongs entirely to your Protocol execution graph. You must explicitly author a task that scaffolds your environment (e.g., using `mkdir`, `git clone`, or `gh repo create`).

1. **Instantiation:** The first task in your protocol explicitly creates the cell (e.g., `mkdir -p ../spawned-cells/my-app`) by running in the Nucleus root (workspace: `.`).
2. **Context Switching:** Subsequent tasks define their `workspace` as the newly created cell (`../spawned-cells/my-app`). The engine safely changes its target directory (CWD) to this location.
3. **Execution:** All shell commands (`npm install`, `docker build`, etc.) are executed within the boundaries of the Child Cell.
4. **Nervous System Link:** The persistent memory graph records the execution, meaning the Nucleus knows exactly where the new cell lives.

---

## 3. Declaring a Workspace

You can declare a workspace either at the **Root Level** (applying to all tasks in the protocol) or at the **Task Level** (allowing a single protocol to orchestrate multiple different directories).

### Root-Level Spawning (Single Child Cell)

If your protocol is entirely focused on building one specific application, define the `workspace` at the root of the JSON file, but ensure your **very first task** creates that workspace before depending on it:

```json
{
  "id": "protocol-saas-launchpad",
  "name": "SaaS Launchpad",
  "workspace": "../spawned-cells/saas-project-alpha",
  "capabilities": ["scaffold", "deploy"],
  "requirements": { "hard": [], "soft": [] },
  "executionGraph": [
    {
      "id": "create-cell-directory",
      "command": "mkdir -p ../spawned-cells/saas-project-alpha",
      "description": "Explicitly allocating the child cell directory",
      "workspace": "."
    },
    {
      "id": "init-repo",
      "command": "git init",
      "description": "Initialize a new Git repository in the spawned cell.",
      "dependsOn": ["create-cell-directory"]
    }
  ]
}
```
*Result: The engine runs `mkdir` in the root, and then safely executes `git init` inside the newly spawned cell.*

### Advanced Github Integration

Because spawning is explicitly defined via shell commands, you are not limited to local folders. You can use GitHub CLI to spin up a fully version-controlled, remote-backed repository as your cell:

```json
    {
      "id": "spin-up-github-repo",
      "command": "gh repo create saas-project-alpha --public --clone",
      "description": "Cloning a brand new remote-backed cell directly from GitHub",
      "workspace": "../spawned-cells"
    }
```

### Task-Level Spawning (Symbiosis / Multiple Cells)

If your protocol orchestrates a complex interaction between two separate environments (e.g., a backend API and a separate frontend UI, or an app and an auditor), you can override the workspace on specific tasks:

```json
{
  "id": "protocol-symbiotic-cluster",
  "name": "Multi-Cell Architecture",
  "capabilities": ["multi-dir"],
  "requirements": { "hard": [], "soft": [] },
  "executionGraph": [
    {
      "id": "build-backend",
      "workspace": "../spawned-cells/backend-api",
      "command": "node -e 'console.log(\"Building backend...\")'",
      "description": "Spawn and construct the server cell."
    },
    {
      "id": "build-frontend",
      "workspace": "../spawned-cells/frontend-client",
      "command": "node -e 'console.log(\"Building client...\")'",
      "description": "Spawn and construct the UI cell.",
      "dependsOn": ["build-backend"]
    }
  ]
}
```
*Result: The engine orchestrates two independent directories smoothly in the background.*
