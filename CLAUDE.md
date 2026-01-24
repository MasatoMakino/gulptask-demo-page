# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI tool that generates demo HTML pages from JavaScript/TypeScript source files. It's designed to help developers create showcases for their code by automatically building demo pages with webpack bundling, EJS templating, and file copying capabilities.

## Development Environment

**IMPORTANT**: This project uses DevContainer to isolate npm execution from the host OS for security purposes. All npm commands must be executed inside the DevContainer.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [DevContainer CLI](https://github.com/devcontainers/cli): `npm install -g @devcontainers/cli`

### DevContainer Setup

```bash
# Build the DevContainer image
devcontainer build --workspace-folder .

# Start the DevContainer
devcontainer up --workspace-folder .

# Stop the DevContainer
devcontainer stop --workspace-folder .
```

### Architecture

- Base image: `node:22-bookworm-slim` (with Git installed)
- Security: `--cap-drop=ALL` (removes all Linux capabilities)
- Non-root user: `node` (UID:1000, GID:1000)
- Port forwarding: Not configured (no services exposed by default)

### Security Benefits

- Host OS npm is never executed (protection from malicious package scripts)
- Container runs with minimal Linux capabilities (`--cap-drop=ALL`)
- Non-root user (node) execution in container
- Automatic `npm audit` on container start

**Note on Security Trade-off:**
Volume-based node_modules isolation was removed to restore host IDE access to TypeScript type definitions. Security now relies on container user and capability restrictions rather than volume isolation. This trade-off prioritizes developer experience (IDE type support) while maintaining npm execution isolation.

### Image Size Optimization

The project uses a custom lightweight Docker image instead of the full Microsoft DevContainer image:

| Image | Size | Features |
|-------|------|----------|
| `mcr.microsoft.com/devcontainers/javascript-node:22` (previous) | ~1.12 GB | Full-featured (Git, GCC, Python, etc.) |
| `node:22-bookworm-slim` + Git (current) | ~319 MB | Minimal + Git for Biome support |

**Reduction**: 72% size decrease (1.12 GB → 319 MB)

## Development Commands

**All commands must be run inside the DevContainer** using the `devcontainer exec` wrapper:

### Build and Test

- `devcontainer exec --workspace-folder . npm run build` - Build TypeScript to JavaScript (uses `tsc`)
- `devcontainer exec --workspace-folder . npm run watch` - Watch TypeScript files and build continuously (`tsc -W`)
- `devcontainer exec --workspace-folder . npm test` - Run full test suite (vitest + build + testRun)
- `devcontainer exec --workspace-folder . npm run test:watch` - Run tests in watch mode
- `devcontainer exec --workspace-folder . npm run coverage` - Generate test coverage report

### CLI Testing

- `devcontainer exec --workspace-folder . npm run testRun` - Test the built CLI tool with default options

See README.md "Complete Example" section for full CLI usage examples.

### Code Quality

- Uses Biome for formatting and linting
- Manual Git hooks (see Git Hooks Setup section)
- Pre-commit: Format staged files with Biome
- Pre-push: Run Biome CI checks and all tests

## Git Hooks Setup (Optional)

Git hooks can automatically run code quality checks before commits and pushes.

See `.devcontainer/git-hooks/README.md` for setup instructions.

## Architecture

### Core Components

- **CLI Entry Point**: `src/CLI.ts` → `bin/CLI.js` - Main CLI executable (thin wrapper for testing)
- **Command Runner**: `src/runCommand.ts` - Handles CLI argument parsing with Commander.js (separated for unit testing)
- **Task Generator**: `src/index.ts` - Core function that orchestrates all build tasks
- **Bundler**: `src/Bundler.ts` - webpack bundling for demo files
- **EJS Templates**: `src/EJS.ts` - HTML generation from templates
- **File Operations**: `src/Copy.ts`, `src/Clean.ts`, `src/Style.ts` - Asset management

### Task Flow

1. Clean output directory
2. Bundle TypeScript/JavaScript files with webpack
3. Generate HTML pages from EJS templates
4. Copy static assets (images, etc.)
5. Apply custom styles

### File Structure Conventions

- Demo source files: `demoSrc/demo_*.ts` or `demoSrc/demo_*.js`
- Templates: `template/` directory with EJS files
- Output: `docs/demo/` directory (configurable)
- Built CLI: `bin/` directory
- Test output directories: `buildTest/` (orphaned), `cleanTest/`, `test_for_copy/`, etc. (created by test runs, gitignored except buildTest)

### Testing

- Uses Vitest for testing
- Test files in `__test__/` directory
- Coverage reports generated to `coverage/`
- Tests include CLI functionality, bundling, and file operations

#### Testing `template/indexScript.js`

The `template/indexScript.js` contains global functions for browser compatibility. Test using Node.js `vm` module:

```javascript
import fs from "fs";
import vm from "vm";
import path from "path";

const scriptPath = path.resolve(__dirname, "../template/indexScript.js");
const scriptContent = fs.readFileSync(scriptPath, "utf-8");
const context = {};
vm.createContext(context);
vm.runInContext(scriptContent, context);

// Access functions from context
const { getDemoNameFromPath } = context;
```

See `__test__/indexScript.spec.js` for implementation details.

## Key Configuration

- TypeScript configuration: `tsconfig.json` (main) and `tsconfig.page.json` (for generated pages)
- webpack config: `webpack.config.js` (default rules, customizable via `--rule` option)
- Package exports: ES modules only (`"type": "module"`)

## CLI Options Reference

`npx @masatomakino/gulptask-demo-page [options]` の主なオプション:

| Option | Description |
|--------|-------------|
| `-W`, `--watch` | Watch mode |
| `--prefix <string>` | File prefix for demo pages |
| `--srcDir <path>` | Demo source directory |
| `--distDir <path>` | Output directory |
| `--body <string>` | HTML body content |
| `--style <string>` | CSS styles |
| `--copyTargets [extensions...]` | File extensions to copy (e.g., `'png', 'jpg'`) |
| `--externalScripts [url...]` | External CDN script URLs |
| `--rule <path>` | webpack config file path |
| `--compileTarget <string>` | TypeScript target |
| `--compileModuleResolution <string>` | TypeScript moduleResolution |

Full options: `npx @masatomakino/gulptask-demo-page --help`

## Task Completion Verification

After code changes (features, bug fixes, refactoring):

1. Run `devcontainer exec --workspace-folder . npm test` - verify unit tests, build, and demo page build succeed
2. Open `docs/demo/index.html` in browser and verify:
   - Main scenarios are operational
   - Modified features work correctly

## Historical Note

This project originally functioned as Gulp tasks but has evolved into a standalone CLI tool with Gulp dependencies removed.
