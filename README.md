# SRS Generator Platform

## Overview
**SRS Generator** is a collaborative platform designed to streamline the **first phase of the Software Development Life Cycle (SDLC)** — **Software Requirement Specification (SRS) generation**.  
It enables **clients, managers, and developers** to work together on a single platform to generate, validate, clarify, version, and track SRS documents efficiently using **LLMs and RAG-based intelligence**.

---

## Key Features

### 👤 Client Module
- Generate SRS documents using **Agent 1 (LLM-powered)**.
- Receive automated validation from **Agent 2**, ensuring all functional and non-functional requirements are covered.
- Get **suggestions, improvements, and clarification prompts** for incomplete or ambiguous requirements.
- View project progress updates shared by the manager.
- Track **SRS versions** and understand cost implications of feature changes.

---

### 🧠 Intelligent Agents
- **Agent 1:** Generates SRS based on client inputs using LLMs.
- **Agent 2:** Reviews SRS completeness, checks requirement coverage, and provides feedback and suggestions.

---

### 👨‍💻 Developer Module (RAG-based)
- Uses **Retrieval-Augmented Generation (RAG)** to query the SRS directly.
- Developers can ask natural language questions like:
  - *“What color theme is expected?”*
  - *“What contact details should be added in the footer?”*
- Ensures developers always work with the **latest and correct version of the SRS**, reducing miscommunication.

---

### 📊 Manager Module
- Update and track project progress.
- Monitor SRS versions and feature changes.
- Help optimize project cost by managing feature scope and versions.
- Ensure transparent communication between clients and developers.

---

### 🔁 SRS Version Management
- Maintains multiple versions of SRS documents.
- Tracks feature additions, removals, and changes.
- Supports **cost optimization** by mapping features to scope and impact.

---

## Tech Stack

### 🧩 Core Technologies
- **Frontend:** Next.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** NextAuth
- **LLM Provider:** Groq
- **Embeddings:** Hugging Face
- **Vector Database:** Quadrant (Dockerized)
- **RAG Pipeline:** Context-aware question answering over SRS
- **Containerization:** Docker

---

## Getting Started

First, run the development server:

```bash
npm install
docker compose up -d
npm run dev

```


