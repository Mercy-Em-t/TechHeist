# TechHeist Phase 1: Core Primitive Initialization

This plan outlines the initial steps to translate the high-level vision of "TechHeist" into a tangible, foundational codebase. We will focus on building the "core primitive"—the foundational interfaces and protocol that will allow agents and data structures to interact.

## User Review Required

> [!IMPORTANT]
> **Language & Stack Decision:** I am proposing **Python** as the primary language for this initial construction. Python has the richest ecosystem for AI, graph data structures, and rapid prototyping of agentic workflows. Is Python acceptable, or would you prefer a different stack like TypeScript, Go, or Rust for the orchestration layer?

## Open Questions

> [!WARNING]
> **Git Repository Status:** The `project info` document mentions `https://github.com/Mercy-Em-t/TechHeist.git`. 
> 1. Does this repository already exist on GitHub? 
> 2. Is it currently empty, or does it already have a `README.md` or other files? (If it's empty, we can initialize it locally and push. If it has files, we should clone it first).

## Proposed Architecture & Changes

We will establish a modular, forward-looking directory structure designed to accommodate autonomous agents and a fluid graph-based memory system.

### Core Structure

We will create the following directories and initial placeholder files in `d:\TechHeist v1`:

#### [NEW] [techheist/core/__init__.py](file:///d:/TechHeist%20v1/techheist/core/__init__.py)
#### [NEW] [techheist/core/interfaces.py](file:///d:/TechHeist%20v1/techheist/core/interfaces.py)
This file will define the abstract base classes (the "protocol") for an `AutonomousAgent` and a `FluidDataNode`. This is the fundamental unit that ensures disparate parts can communicate.

#### [NEW] [techheist/memory/__init__.py](file:///d:/TechHeist%20v1/techheist/memory/__init__.py)
#### [NEW] [techheist/memory/graph_store.py](file:///d:/TechHeist%20v1/techheist/memory/graph_store.py)
The foundation for the "living blueprint" system, moving away from static databases to a self-linking graph structure.

#### [NEW] [techheist/orchestration/__init__.py](file:///d:/TechHeist%20v1/techheist/orchestration/__init__.py)
#### [NEW] [techheist/orchestration/local_node.py](file:///d:/TechHeist%20v1/techheist/orchestration/local_node.py)
The beginning of the decentralized, lightweight orchestration layer for edge device execution.

#### [NEW] [requirements.txt](file:///d:/TechHeist%20v1/requirements.txt)
To manage any initial minimal dependencies.

#### [NEW] [.gitignore](file:///d:/TechHeist%20v1/.gitignore)
Standard Python gitignore to keep the repository clean.

## Verification Plan

### Automated Tests
- N/A for this exact structural setup, but future phases will include unit tests in a `tests/` directory to ensure agents adhere to the core interfaces.

### Manual Verification
1. I will execute the script to generate the folder structure and initial empty/template files.
2. We will initialize the git repository and link it to your remote.
3. We will review the `core/interfaces.py` design together to ensure it aligns with your abstract vision for the core protocol.
