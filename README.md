# FluxLoad

High-performance, minimalist file sharing server engineered with strict security boundaries, clean aesthetics, and dual-engine architecture (Python & Java).

[![Python CI](https://github.com/muadzhdz/fluxload/actions/workflows/ci.yml/badge.svg?branch=python)](https://github.com/muadzhdz/fluxload/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![Policy](https://img.shields.io/badge/Policy-Zero--Emoji-success)](#zero-emoji--clean-design-policy)

---

## Architectural Overview

FluxLoad operates across two specialized branches:

- **Python Branch (`python`):** Powered by Flask and Werkzeug, providing both a lightweight standalone file server and an advanced enterprise edition with SQLite/SQLAlchemy, Whoosh full-text search indexing, and real-time WebSockets.
- **Java Branch (`java`):** Powered by Spring Boot 3 and Java 17+, delivering robust, type-safe enterprise file management with Spring Security and matching REST endpoints.

Both branches share identical UI design tokens, breadcrumb navigation, and REST API contracts (`/api/files`, `/health`).

---

## Key Features

- **Unified File Explorer:** Single-view table explorer with top navigation bar, dynamic breadcrumbs, and instant client-side file search.
- **Whole-Page Drag-and-Drop:** Drop files anywhere on the browser window to trigger instant uploads.
- **Floating Upload Toast:** Non-intrusive bottom-right progress monitor with real-time percentage, transfer stats, and cancel support.
- **Rigorous Path Traversal Protection:** Component-based path resolution (`os.path.commonpath`) eliminating directory traversal and sibling directory attacks.
- **Root Directory Protection:** Safeguards preventing accidental or malicious deletion of the root upload directory.
- **REST API Parity:** Unified `/api/files` endpoints enabling any frontend, script, or mobile client to interface interchangeably with Python or Java backends.
- **15 Built-in Developer Themes:** Tokyo Night, Catppuccin (Mocha, Macchiato, Frappe, Latte), Rose Pine, Nord, Dracula, Gruvbox, and more.

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/muadzhdz/fluxload.git
cd fluxload

# Install in editable mode
pip install -e .
```

### Running the Server

```bash
# 1. Simple file server
fluxload-simple -d /path/to/share -p 5000

# Or via Python module directly:
python -m fluxload -d /path/to/share

# 2. Enterprise server (Database, Whoosh search, WebSocket)
python -m fluxload.advanced_main -d /path/to/share
```

### Docker Deployment

```bash
# Build the container
make docker-build

# Run the container
make docker-run
```

Or using standard Docker CLI:

```bash
docker build -t fluxload:python .
docker run -d -p 5000:5000 -v /my/files:/data fluxload:python
```

---

## REST API Contract

| Method | Endpoint | Description | Response Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health and version status | JSON (`status`, `version`) |
| `GET` | `/api/files?path=` | List directory items, sizes, and timestamps | JSON (`current_path`, `items`) |
| `POST` | `/api/files/upload` | Multipart file upload | JSON (`success`, `filename`) |
| `POST` | `/api/files/mkdir` | Create subfolder | JSON (`success`, `dirName`) |
| `POST` | `/api/files/rename` | Rename file or folder | JSON (`success`, `newName`) |
| `DELETE` | `/api/files` | Delete file | JSON (`success`, `filename`) |

---

## Developer Workflow

```bash
# Display help and available tasks
make help

# Run test suite with coverage
make test

# Build and run Docker container
make docker-build
make docker-run

# Clean build artifacts
make clean
```

---

## Zero-Emoji & Clean Design Policy

FluxLoad enforces a strict **Zero-Emoji policy** across all branches. User interfaces utilize Google Material Icons exclusively, and terminal outputs rely on clean, deterministic ASCII tags (`[*]`, `[+]`, `[!]`, `[ERROR]`). Automated CI pipelines verify zero emoji violations on every commit and pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
