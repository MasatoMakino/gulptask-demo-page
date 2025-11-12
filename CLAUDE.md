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
- `devcontainer exec --workspace-folder . npm run watch:testRun` - Test CLI in watch mode
- `devcontainer exec --workspace-folder . npm run exampleCLI` - Run comprehensive CLI example with multiple options
- `devcontainer exec --workspace-folder . npm run watch:exampleCLI` - Run example CLI in watch mode

### Code Quality

- Uses Biome for formatting and linting
- Manual Git hooks (see Git Hooks Setup section)
- Pre-commit: Format staged files with Biome
- Pre-push: Run Biome CI checks and all tests

## Git Hooks Setup

Since npm runs in an isolated DevContainer, Git hooks must be set up manually on each development machine.

### Initial Setup (Required Once Per Clone)

Run these commands in your terminal to create the Git hooks:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
exec 1>&2
echo "[pre-commit] Running code quality checks in DevContainer..."
if ! docker ps --format '{{.Names}}' | grep -q 'gulptask-demo-page-npm-runner'; then
  echo "[pre-commit] DevContainer not running. Starting..."
  devcontainer up --workspace-folder . || exit 1
fi
if ! devcontainer exec --workspace-folder . npm run pre-commit; then
  echo "[pre-commit] ERROR: Code quality checks failed"
  exit 1
fi
echo "[pre-commit] ✓ All checks passed"
exit 0
EOF

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh
exec 1>&2
echo "[pre-push] Running tests and CI checks in DevContainer..."
if ! docker ps --format '{{.Names}}' | grep -q 'gulptask-demo-page-npm-runner'; then
  echo "[pre-push] DevContainer not running. Starting..."
  devcontainer up --workspace-folder . || exit 1
fi
if ! devcontainer exec --workspace-folder . npm run pre-push; then
  echo "[pre-push] ERROR: Tests or CI checks failed"
  exit 1
fi
echo "[pre-push] ✓ All checks passed"
exit 0
EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit .git/hooks/pre-push
```

### Manual Alternative

If you prefer not to use Git hooks, run these commands manually:

```bash
# Before committing
devcontainer exec --workspace-folder . npm run pre-commit

# Before pushing
devcontainer exec --workspace-folder . npm run pre-push
```

### What the Hooks Do

- **pre-commit**: Runs `biome format --write --staged --no-errors-on-unmatched` on staged files
- **pre-push**: Runs `biome ci .` (lint check) and `vitest --run` (all tests)

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

## Key Configuration

- TypeScript configuration: `tsconfig.json` (main) and `tsconfig.page.json` (for generated pages)
- webpack config: `webpack.config.js` (default rules, customizable via `--rule` option)
- Package exports: ES modules only (`"type": "module"`)
