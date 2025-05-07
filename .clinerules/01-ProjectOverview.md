# プロジェクト概要: gulptask-demo-page

## 目的

このプロジェクトは、コマンドラインインターフェイス (CLI) ツールとして機能するデモHTMLジェネレーターです。主に、指定されたJavaScript/TypeScriptソースファイルからデモ用のHTMLページを生成することを目的としています。

## 使い方

このパッケージの基本的な使い方は、スクリプトファイルからデモページを生成することです。

### デモソースファイルの準備

デモソースファイルは、`demoSrc`ディレクトリに配置します。
ファイル名には`demoSrc/demo_sample.ts`のように`demo_`プレフィックをつけます。

### デモページの生成

デモページを生成するには、以下のコマンドを実行します。

```bash
npx @masatomakino/gulptask-demo-page
```

このコマンドにより、`docs/demo`ディレクトリに、デモスクリプトを読み込むHTMLファイル群と、そのindexページが生成されます。

## 主な機能

- **デモHTML生成**: 指定されたソースディレクトリからJavaScript/TypeScriptスクリプトファイルを読み込み、設定に基づいてデモHTMLページを生成します。
- **CLIツール**: コマンドラインから直接デモページ生成を実行できます。
- **カスタマイズ**: HTMLボディの内容、CSSスタイル、外部スクリプトなどをオプションで指定し、生成されるHTMLをカスタマイズできます。
- **アセットファイルコピー**: 指定した拡張子のファイルをデモ出力ディレクトリにコピーします。
- **ウォッチモード**: ソースファイルの変更を監視し、変更があった場合に自動的にデモページを再生成します。
- **webpack連携**: JavaScript/TypeScriptファイルのバンドルにwebpackを使用します。

## 技術スタック

- TypeScript
- Node.js
- webpack
- Babel
- EJS
- Commander（CLIオプション解析）
- Vitest（テスト）
- Husky, lint-staged, Prettier（開発ツール）

## ディレクトリ構造の概要

- `src/`: プロジェクトのソースコード（TypeScript）が含まれます。
- `bin/`: ビルドされたJavaScriptファイルおよびCLIエントリーポイントが含まれます。
- `__test__/`: プロジェクトのテストコードが含まれます。
- `demoSrc/`: デモページ生成のためのサンプルソースファイルが含まれます。
- `template/`: デモHTML生成に使用されるEJSテンプレートファイルが含まれます。
- `docs/`: 生成されたデモページが出力されるディレクトリ（デフォルト）。
- `.github/workflows/`: GitHub Actionsのワークフローファイルが含まれます。

## CLIの使用方法

`npx @masatomakino/gulptask-demo-page [options]` の形式で実行します。主なオプションは以下の通りです。

- `-W`, `--watch`: ウォッチモードを有効にします。
- `--prefix <string>`: デモページを生成するファイル名のプレフィックスを指定します。
- `--srcDir <path>`: デモソースファイルが存在するディレクトリを指定します。
- `--distDir <path>`: 生成されたデモページを出力するディレクトリを指定します。
- `--body <string>`: HTMLボディに挿入するHTMLタグを指定します。指定された内容は、生成されるHTMLの`<body>`タグ内に挿入されます。
- `--style <string>`: デモページに適用するCSSスタイルを指定します。指定されたスタイルは、生成されるHTMLの`<style>`タグ内に挿入されます。
- `--copyTargets [extensions...]`: コピー対象のファイル拡張子を指定します。`'png', 'jpg', 'jpeg', 'obj'`のように、文字列をカンマ`,`で区切って指定します。
- `--externalScripts [url...]`: 外部CDNから読み込むスクリプトファイルのURL配列を指定します。npm経由でバンドルできない外部モジュールを読み込む際に利用します。
- `--rule <path>`: webpackのルール設定ファイル（`webpack.config.js`など）へのパスを指定します。このオプションを指定すると、指定された設定ファイルが読み込まれます。オプションを指定しない場合は、パッケージに内蔵されているデフォルトの設定ファイルが使用されます。
- `--compileTarget <string>`: TypeScriptの`tsconfig.compilerOptions.target`に対応します。詳細は[公式ドキュメント](https://www.typescriptlang.org/tsconfig/#target)を参照してください。
- `--compileModuleResolution <string>`: TypeScriptの`tsconfig.compilerOptions.moduleResolution`に対応します。詳細は[公式ドキュメント](https://www.typescriptlang.org/tsconfig/#moduleResolution)を参照してください。

詳細なオプションについては、`npx @masatomakino/gulptask-demo-page --help` を参照してください。

## 技術的な補足

- HTML生成には内部的にEJSテンプレートを使用しています。ツールユーザーが直接テンプレートをカスタマイズすることは想定されていません。

## ライセンス

MIT License

---

**注釈:** このプロジェクトは、計画当初Gulpタスクとしてそのまま利用できるものでしたが、現在はGulpへの依存を削除し、単体のCLIツールとして利用するためのツールに変化しています。
