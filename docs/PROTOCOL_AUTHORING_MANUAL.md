# Sovereign Engine // Pluggable Protocol Authoring Manual

This manual dictates how to author, secure, and deploy custom **Pluggable Protocol Schemas** into the Sovereign Agentic Operating Layer. By dropping a valid JSON schema into the `protocols/` directory, you can command the autonomous engine to execute highly complex workflows—from SaaS deployments to DevSecOps audits—without writing a single line of backend TypeScript.

---

## 1. The Protocol Lifecycle

1. **Author**: Write a `.json` schema defining your custom protocol.
2. **Deploy**: Drop the file into `hyper-context-mcp/protocols/`.
3. **Ingest**: The engine's `ProtocolLoader` actively scans this folder at boot. It verifies your hard security requirements against the local `.env` vault.
4. **Execute**: Valid protocols are piped directly to the Visual Command Room (`http://localhost:8080`). Hitting the **🚀 EXECUTE PROTOCOL** button dispatches your execution graph into the autonomous `StateMachineEngine`.

---

## 2. The JSON Schema Anatomy

Every protocol must conform strictly to the `PluggableProtocol` interface. Here is the exact structural anatomy:

```json
{
  "id": "protocol-unique-identifier",
  "name": "Human Readable Protocol Name",
  "type": "custom-category-tag",
  "capabilities": ["a list", "of actions", "it performs"],
  "requirements": {
    "hard": ["ENV_VAR_REQUIRED_1", "ENV_VAR_REQUIRED_2"],
    "soft": ["git", "docker", "nmap"]
  },
  "executionGraph": [
    {
      "id": "task-1-id",
      "command": "bash ./deploy.sh",
      "description": "What this specific task does"
    },
    {
      "id": "task-2-id",
      "command": "npm run test",
      "description": "Another task",
      "dependsOn": ["task-1-id"]
    }
  ]
}
```

---

## 3. Requirements: Hard vs. Soft Boundaries

The system is designed with **Optimistic Protection Mechanisms**. It is crucial to understand how to label your requirements to avoid wasting engine compute resources.

### `hard` Requirements
> [!IMPORTANT]  
> Use `hard` requirements for non-negotiable security tokens (e.g., `AWS_ACCESS_KEY`, `STRIPE_SECRET`).

If a `hard` requirement is listed in the schema but is **missing** from the native `.env` vault, the `ProtocolLoader` will aggressively **ABORT** the ingestion of the schema entirely. The protocol will never reach the dashboard. This prevents the execution loop from attempting an action that is guaranteed to fail due to missing authorization.

### `soft` Requirements
> [!TIP]  
> Use `soft` requirements for environmental binaries or optimizable targets (e.g., `docker`, `curl`, `jq`).

If a `soft` requirement is missing, the engine allows the protocol to load anyway. It operates on optimism: if the execution graph fails because the target environment is missing `docker`, the `StateMachineEngine` intercepts the error footprint and attempts to **auto-heal** (for instance, by downloading and installing `docker` on the fly) before resuming the protocol sequence.

---

## 4. Building the Execution Graph

The `executionGraph` is an array of highly focused tasks. Rather than writing one massive script, you break your protocol down into sequential or parallel steps.

* **`id`**: A unique string identifying the step.
* **`command`**: The exact shell/bash command the `ExecutionRuntime` should deploy to the operating system.
* **`description`**: A semantic explanation of the command. If the command fails, the auto-healer uses this description to infer your *intent* when trying to mutate a fix.
* **`workspace`** *(Optional)*: The specific directory path this task should execute within (e.g., `../spawned-cells/my-app`). If the directory doesn't exist, the task will crash, meaning your protocol **must** explicitly create the environment (via `mkdir` or `git clone`) before targeting it.
* **`dependsOn`** *(Optional)*: An array of previous task `id`s that must complete successfully before this task can fire.

> [!WARNING]
> The engine is pure and does not use "magic". If your protocol requires a workspace, your first task should explicitly allocate that space (e.g., `mkdir -p ../child-cell`), and subsequent tasks should target that workspace using the `workspace` property.

----

## 5. Live Examples

### Example 1: SaaS Launchpad Core
This protocol explicitly creates a local directory cell, initializes a git repository, scaffolds a codebase, and tests it.
*(Found at `protocols/saas-launchpad.json`)*

```json
{
  "id": "protocol-saas-launchpad",
  "name": "SaaS Launchpad Core",
  "type": "saas-launchpad",
  "workspace": "../spawned-cells/saas-project-alpha",
  "capabilities": ["scaffold-repo", "install-deps", "run-unit-tests", "deploy-container"],
  "requirements": {
    "hard": ["TARGET_AUTH_TOKEN"],
    "soft": ["docker", "git"]
  },
  "executionGraph": [
    {
      "id": "initialize-workspace",
      "command": "node -e \"const fs = require('fs'); fs.mkdirSync('../spawned-cells/saas-project-alpha', {recursive: true});\"",
      "description": "Explicitly allocating the child cell directory",
      "workspace": "."
    },
    {
      "id": "init-repo",
      "command": "git init",
      "description": "Initialize a new Git repository in the spawned cell.",
      "dependsOn": ["initialize-workspace"]
    },
    {
      "id": "scaffold-codebase",
      "command": "node -e 'console.log(\"Scaffolding React + Express web application structure...\")'",
      "description": "Constructing foundational web components",
      "dependsOn": ["init-repo"]
    }
  ]
}
```

### Example 2: DevSecOps Network Fortress
This protocol audits exposed ports and validates edge node encryption.
*(Found at `protocols/devsecops-fortress.json`)*

```json
{
  "id": "protocol-devsecops-fortress",
  "name": "DevSecOps Network Fortress",
  "type": "devsecops-fortress",
  "capabilities": ["audit-ports", "verify-ssl", "patch-vulnerabilities"],
  "requirements": {
    "hard": ["TARGET_AUTH_TOKEN"],
    "soft": ["nmap", "openssl"]
  },
  "executionGraph": [
    {
      "id": "audit-external-ports",
      "command": "nmap -sV target.internal.net",
      "description": "Identifying exposed infrastructure ports"
    }
  ]
}
```
