# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI tool that generates demo HTML pages from JavaScript/TypeScript source files. It's designed to help developers create showcases for their code by automatically building demo pages with webpack bundling, EJS templating, and file copying capabilities.

## Development Commands

### Build and Test

- `npm run build` - Build TypeScript to JavaScript (uses `tsc`)
- `npm run watch` - Watch TypeScript files and build continuously (`tsc -W`)
- `npm test` - Run full test suite (vitest + build + testRun)
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate test coverage report

### CLI Testing

- `npm run testRun` - Test the built CLI tool with default options
- `npm run watch:testRun` - Test CLI in watch mode
- `npm run exampleCLI` - Run comprehensive CLI example with multiple options
- `npm run watch:exampleCLI` - Run example CLI in watch mode

### Code Quality

- Uses Prettier for formatting via lint-staged
- Husky for git hooks
- Files are formatted on commit: `*.{js,ts,css,md}`

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
