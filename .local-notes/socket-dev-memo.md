# socket.dev CLI メモ

## 概要
socket.devのCLIツールを試用中。npmパッケージのセキュリティスキャンとワークスペース保護を提供。

## インストール
```bash
npm install -g socket
```

## 主要機能
- パッケージのセキュリティスキャン
- セキュリティスコアの取得
- ワークスペース保護
- リアルタイム脅威フィード
- CI/CDワークフロー自動化

## 基本コマンド

### セキュリティスキャン
```bash
# スキャン実行
socket scan create

# パッケージスコア確認
socket package score <package-name>
```

### ワークスペース保護
```bash
# 保護を有効化
socket wrapper on

# 保護状態確認
socket wrapper status
```

### CI/CD統合
```bash
# CIワークフロー実行
socket ci
```

### 脅威フィード
```bash
# 最新の脅威情報表示
socket threat-feed
```

### その他
```bash
# ログイン（APIトークン設定）
socket login

# ヘルプ表示
socket --help
```

## 出力形式
- デフォルト: 人間が読みやすい形式
- `--json`: JSON形式
- `--markdown`: Markdown形式

## 試用日
2025-09-19

## 参考リンク
- [Socket CLI Documentation](https://docs.socket.dev/docs/socket-cli)
- [GitHub Repository](https://github.com/SocketDev/socket-cli-js)

## package-lock.json修正方法

socket.devは`npm ci`コマンドをフックしてセキュリティスキャンを実行する。古い依存関係がpackage-lock.jsonに残っている場合、インストールが阻止されることがある。

### 修正手順
```bash
# 一時的にsocketを停止してlockファイルのみを更新
socket raw-npm audit fix --package-lock-only
```

このコマンドの効果:
- socketのセキュリティチェックを一時的にバイパス
- package-lock.jsonの脆弱性のある依存関係を修正
- パッケージの実際のインストールは行わない（`--package-lock-only`）

### 修正後の手順
```bash
# 修正が完了したら、通常のnpm ciを実行
npm ci
```

修正後のnpm ci実行時:
- インストール対象パッケージがsocketでスキャンされる
- セキュリティ問題がなくなればCIが正常に完了する
- 依存関係の脆弱性が解決された状態でインストールが実行される

## 試用メモ
（実際の使用結果をここに記録）