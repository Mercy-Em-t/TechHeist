# Sovereign Engine // Path A: The Autonomous SaaS Mint (Operational Manual)

## Architecture Overview

We have successfully brought **Path A: The Autonomous SaaS Mint** online. The system acts as a fully functional pipeline bridging human ideation with real-world biological execution, software compilation, and deployment triggers.

Here is the anatomy of the SaaS Mint sequence:

1. **The Brain Injection (`ui-renderer.ts`)**: 
   The visual dashboard accepts a single-sentence idea (e.g., "A real-time financial tracking interface"). It packages this idea and injects it into the master Nucleus via the `/api/trigger-action` endpoint using the `MINT_SAAS` payload.

2. **Mitotic Cloning (`index.ts` & `cellular-factory.ts`)**:
   The Nucleus catches the `MINT_SAAS` payload, temporarily injects the idea into its local environment DNA (`process.env.SAAS_PROMPT`), and commands the Mitosis engine to spawn a dedicated `STEM_SAAS` cell.

3. **Protocol Initiation (`protocols/saas-mint.json`)**:
   The new `STEM_SAAS` cell boots up, detects its role and the embedded prompt, and loads the `saas-mint` execution graph. The State Machine begins running through the sequence:
   - Creating a dedicated physical matrix folder.
   - Using standard CLI commands to scaffold a `react-ts` Vite application.
   - Installing dependencies autonomously.

4. **The LLM Bridge (`src/llm-bridge.ts`)**:
   During execution, the State Machine intercepts the `llmPrompt` command inside the protocol. It passes the prompt to the `LLMBridge`, which acts as the connection point to the AI. The AI physically writes premium front-end components and injects them into the Vite template.

5. **Compilation & Circulation**:
   The state machine runs `npm run build`. Upon successful compilation, the `STEM_SAAS` cell uses the `BiochemicalBus` to secrete the `COMPILE_SUCCESS_DEPLOY_REQUEST` hormone. 

6. **DevSecOps Takeover**:
   The circulatory system pumps this hormone to the `ROOT_DEVSECOPS` node (if active), which catches it via its receptors and begins autonomously provisioning cloud infrastructure to host the built asset.
