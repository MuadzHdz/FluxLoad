# FluxLoad (Java Engine)

High-performance, type-safe file sharing server powered by Spring Boot 3 and Java 17+, engineered with strict security boundaries, clean aesthetics, and REST API parity with the Python edition.

[![Java CI](https://github.com/muadzhdz/fluxload/actions/workflows/ci.yml/badge.svg?branch=java)](https://github.com/muadzhdz/fluxload/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Java Version](https://img.shields.io/badge/Java-17%20%7C%2021-orange?logo=openjdk&logoColor=white)](https://adoptium.net)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![Policy](https://img.shields.io/badge/Policy-Zero--Emoji-success)](#zero-emoji--clean-design-policy)

---

## Architectural Overview

FluxLoad is designed with a dual-engine philosophy:

- **Java Branch (`java`):** Built on Spring Boot 3, Spring Security, and Thymeleaf, providing enterprise-grade reliability, memory efficiency, and strong type safety.
- **Python Branch (`python`):** Built on Flask and Werkzeug, providing rapid scripting, standalone portability, and full-text search.

Both branches feature the exact same modern minimalist UI design tokens, breadcrumb navigation, and unified REST API contract (`/api/files`, `/health`).

---

## Key Features

- **Unified File Explorer:** Single-view table explorer with top navigation bar, dynamic breadcrumbs, and instant client-side file search.
- **Whole-Page Drag-and-Drop:** Drop files anywhere on the browser window to trigger instant uploads.
- **Floating Upload Toast:** Non-intrusive bottom-right progress monitor with real-time percentage, transfer stats, and cancel support.
- **Comprehensive Authentication:** Password protection via Spring Security with BCrypt hashing and secure session management.
- **Root Directory Protection:** Explicit boundary safeguards in `FileService` preventing accidental or malicious deletion of the root directory.
- **REST API Parity:** Unified `/api/files` endpoints enabling any frontend, script, or mobile client to interface interchangeably with Python or Java backends.
- **15 Built-in Developer Themes:** Tokyo Night, Catppuccin (Mocha, Macchiato, Frappe, Latte), Rose Pine, Nord, Dracula, Gruvbox, and more.

---

## Quick Start

### Build from Source

```bash
# Clone the repository
git clone https://github.com/muadzhdz/fluxload.git
cd fluxload
git checkout java

# Build executable JAR with Maven
mvn clean package -DskipTests
```

### Running the Application

```bash
# Run executable JAR
java -jar target/fluxload-1.1.0.jar -d /path/to/share -p 8080

# Run with password protection
java -jar target/fluxload-1.1.0.jar -d /path/to/share -p 8080 --password mysecret
```

### CLI Arguments

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-d`, `--directory` | Root directory path to serve | Current directory |
| `-p`, `--port` | HTTP server port | `8080` |
| `-b`, `--bind` | Network interface IP address | `0.0.0.0` |
| `--password` | Enable authentication with specified password | Disabled |
| `-o`, `--open` | Open default web browser upon launch | Disabled |
| `-h`, `--help` | Display command-line options | - |

---

## Docker Deployment

```bash
# Build multi-stage Alpine container
make docker-build

# Run container with volume mount
make docker-run
```

Or using standard Docker CLI:

```bash
docker build -t fluxload:java .
docker run -d -p 8080:8080 -v /my/files:/data fluxload:java
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

# Run JUnit test suite
make test

# Build production JAR
make build

# Run locally via Spring Boot plugin
make run

# Clean build artifacts
make clean
```

---

## Zero-Emoji & Clean Design Policy

FluxLoad enforces a strict **Zero-Emoji policy** across all branches. User interfaces utilize Google Material Icons exclusively, and terminal outputs rely on clean, deterministic ASCII tags (`[*]`, `[+]`, `[!]`, `[ERROR]`). Automated CI pipelines verify zero emoji violations on every commit and pull request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
