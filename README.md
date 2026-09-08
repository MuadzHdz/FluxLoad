# FluxLoad (Python Engine)

High-performance, minimalist file sharing server engineered with strict security boundaries, clean aesthetics, and dual-engine architecture (Python & Java).

[![PyPI Version](https://img.shields.io/pypi/v/fluxload.svg?color=blue&logo=pypi&logoColor=white)](https://pypi.org/project/fluxload/)
[![Python CI](https://github.com/muadzhdz/fluxload/actions/workflows/ci.yml/badge.svg?branch=python)](https://github.com/muadzhdz/fluxload/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![Policy](https://img.shields.io/badge/Policy-Zero--Emoji-success)](#zero-emoji--clean-design-policy)

---

## Architectural Overview

FluxLoad operates across two specialized branches designed for distinct deployment needs:

| Specification | Python Engine (`python`) | Java Engine (`java`) |
| :--- | :--- | :--- |
| **Primary Framework** | Flask 3.0 + Werkzeug | Spring Boot 3.3 (Java 17+) |
| **Best Used For** | Rapid local deployment, scriptability, full-text search | High-throughput enterprise workloads, strict typing |
| **Security Layer** | Werkzeug secure hashing + Session auth | Spring Security + BCryptPasswordEncoder |
| **Advanced Features** | Whoosh indexing, SQLite/SQLAlchemy, WebSockets | Multi-threaded async service, Enterprise JPA ready |
| **Default Port** | `8000` (standalone) / `5000` (Docker) | `8080` (standalone & Docker) |
| **Docker Base** | `python:3.12-slim` | `eclipse-temurin:17-jre-alpine` |
| **UI & Theme Engine** | Unified File Explorer (15 Developer Themes) | Unified File Explorer (15 Developer Themes) |
| **REST API Contract** | Parity (`/api/files`, `/health`) | Parity (`/api/files`, `/health`) |

### Branch Navigation

```bash
# Clone the repository
git clone https://github.com/muadzhdz/fluxload.git
cd fluxload

# Switch to the Python engine (current branch)
git checkout python

# Switch to the Java engine
git checkout java
```

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

#### Option A: Install via PyPI (Recommended)

FluxLoad is officially distributed on [PyPI (Python Package Index)](https://pypi.org/project/fluxload/):

```bash
# Install latest release
pip install fluxload

# Or upgrade to the latest version
pip install --upgrade fluxload
```

#### Option B: Install from Source

```bash
# Clone the repository
git clone https://github.com/muadzhdz/fluxload.git
cd fluxload
git checkout python

# Install in editable mode
pip install -e .
```

### Running the Server

```bash
# 1. Simple file server
fluxload-simple -d /path/to/share -p 8000

# Or via Python module directly:
python -m fluxload -d /path/to/share -p 8000

# Run with password protection
python -m fluxload -d /path/to/share --password mysecret

# 2. Enterprise server (Database, Whoosh search, WebSocket)
python -m fluxload.advanced_main -d /path/to/share
```

### CLI Arguments

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-d`, `--directory` | Root directory path to serve and receive uploads | Current working directory |
| `-p`, `--port` | HTTP server port | `8000` |
| `-b`, `--bind` | Network interface address to bind to | `0.0.0.0` (all interfaces) |
| `--password` | Enable authentication with specified password | Disabled |
| `-o`, `--open` | Open default web browser upon launch | Disabled |
| `--version` | Show program version and exit | - |
| `-h`, `--help` | Display command-line options | - |

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

## Contributing

1. Review the engineering standards outlined in the [Pull Request Template](.github/pull_request_template.md).
2. Ensure all unit tests pass (`make test`).
3. Ensure zero emoji characters exist anywhere in code, markdown, or commits.
4. Submit PR targeting either `python` or `java` branch.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
