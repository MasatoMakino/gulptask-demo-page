# NPM Trusted Publisher 移行手順書

NPMパッケージの公開をTokenベースからTrusted Publisherに移行するための手順書です。

> **重要**: この手順書は **フェーズ順に実行** してください。各フェーズの完了を確認してから次のフェーズに進むことで、安全かつ確実な移行が可能です。

## 移行フェーズ概要

1. **フェーズ1: 事前準備** - プロジェクト情報の調査と確認
2. **フェーズ2: npm側設定** - NPM Trusted Publisherの設定（**PRより先に実行**）
3. **フェーズ3: GitHub作業** - ワークフローの更新とコード変更
4. **フェーズ4: 統合とデプロイ** - PR作成、マージ、トークン削除
5. **フェーズ5: 動作確認** - テスト公開と検証（オプショナル）

---

# フェーズ1: 事前準備（プロジェクト固有設定の調査）

### 1. パッケージ情報の確認

`package.json`ファイルから以下の情報を取得します：

```bash
# パッケージ名を確認
cat package.json | grep '"name"'
# 結果例: "name": "@masatomakino/gulptask-demo-page"

# リポジトリ情報を確認
cat package.json | grep -A 3 '"repository"'
# 結果例:
# "repository": {
#   "type": "git",
#   "url": "git+https://MasatoMakino@github.com/MasatoMakino/gulptask-demo-page.git"
# }
```

または、jqコマンドを使用する場合：

```bash
# パッケージ名
jq -r '.name' package.json

# GitHubユーザー名とリポジトリ名を抽出
jq -r '.repository.url' package.json | sed 's/.*github\.com[\/:]//g' | sed 's/\.git$//g'
```

### 1.1. repositoryフィールドの確認と追加

NPM Trusted Publisherにはpackage.jsonにrepositoryフィールドが必要です：

```bash
# repositoryフィールドの存在確認
jq '.repository' package.json

# nullまたは存在しない場合は追加が必要
```

**repositoryフィールドが存在しない場合の追加手順:**

```bash
# 現在のpackage.jsonをバックアップ
cp package.json package.json.backup

# repositoryフィールドを追加（GitHubユーザー名とリポジトリ名を適切に設定）
jq '. + {
  "repository": {
    "type": "git",
    "url": "git+https://[GitHubユーザー名]@github.com/[GitHubユーザー名]/[リポジトリ名].git"
  }
}' package.json.backup > package.json

# 例：
# jq '. + {
#   "repository": {
#     "type": "git",
#     "url": "git+https://MasatoMakino@github.com/MasatoMakino/gulptask-demo-page.git"
#   }
# }' package.json.backup > package.json
```

**または手動でpackage.jsonに追加:**

```json
{
  "name": "@your-scope/your-package",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "git+https://YourGitHubUser@github.com/YourGitHubUser/your-repo.git"
  },
  // ... その他のフィールド
}
```

> **重要**: repositoryフィールドはNPM Trusted Publisherの動作に必要です。このフィールドがないとOIDC認証が正しく機能しない場合があります。

### フェーズ1完了チェックリスト

以下の項目をすべて確認してから**フェーズ2**に進んでください：

- [ ] パッケージ名を確認済み
- [ ] リポジトリ情報を確認済み
- [ ] `package.json`の`repository`フィールドが存在する（存在しない場合は追加済み）
- [ ] 現在のワークフローファイルを特定済み
- [ ] 使用中のNPMトークン名を確認済み

---

# フェーズ2: npm側設定（**PR作成より先に実行**）

> **注意**: このフェーズはnpm.js上での設定作業です。**GitHubでのPR作成やコード変更より先に実行**してください。この順序で実行することで、後でGitHub Actionsのテスト時にnpm側の設定がすでに完了しているため、スムーズな検証が可能です。

### 2. 現在のワークフローファイルの確認

```bash
# GitHub Actionsワークフローファイルを検索
find .github/workflows -name "*.yml" -o -name "*.yaml"

# NPM公開に関連するワークフローを特定
grep -l "npm.*publish\|NPM.*PUBLISH" .github/workflows/*.yml
```

### 3. 使用中のNPMトークンの確認

```bash
# ワークフローファイル内でNPMトークンを確認
grep -n "NODE_AUTH_TOKEN\|NPM.*TOKEN" .github/workflows/*.yml
```

## NPM Trusted Publisher登録手順

### 1. NPMアクセスページへの遷移

調査した情報を使ってアクセスURLを生成します：

```
https://www.npmjs.com/package/[パッケージ名]/access
```

例：
```
https://www.npmjs.com/package/@masatomakino/gulptask-demo-page/access
```

### 2. Trusted Publisher設定

1. 上記URLにアクセス
2. **Trusted Publishers** セクションの **GitHub Actions** ボタンをクリック
3. 以下の情報を入力：
   - **GitHub Owner (User/Organization)**: GitHubユーザー名（例：MasatoMakino）
   - **Repository name**: リポジトリ名（例：gulptask-demo-page）
   - **Workflow filename**: ワークフローファイル名（拡張子付き、例：npm_publish.yml）
4. **Add Trusted Publisher** をクリック

### 3. Publishing Access権限の更新

Trusted Publisher設定後、パッケージのセキュリティレベルを最高に設定します：

1. 同じアクセスページの **Publishing access** セクションを確認
2. 以下の3つのオプションが表示されます：
   - Don't require two-factor authentication
   - Require two-factor authentication or an automation or granular access token
   - **Require two-factor authentication and disallow tokens (recommended)** ← これを選択
3. **Require two-factor authentication and disallow tokens (recommended)** を選択
4. **Update Package Settings** をクリック

> **注意**: この設定により、従来のNPMトークンによる公開は完全に無効化され、Trusted Publisherまたは2FA認証のみでの公開となります。これにより最高レベルのセキュリティが確保されます。

### フェーズ2完了チェックリスト

以下の項目をすべて確認してから**フェーズ3**に進んでください：

- [ ] NPMアクセスページでTrusted Publisher設定を完了
- [ ] GitHubユーザー名、リポジトリ名、ワークフローファイル名を正しく入力済み
- [ ] Publishing Accessを「Require two-factor authentication and disallow tokens」に設定済み
- [ ] **重要**: この時点ではNPMトークンはまだ削除しないでください（フェーズ4で実行）

> **注意**: この時点でnpm側の設定は完了です。GitHubでのコード変更作業に進んでください。

---

# フェーズ3: GitHub作業（コード変更とワークフロー更新）

## 1. 作業ブランチの作成

コード変更を開始する前に、作業用ブランチを作成します：

```bash
# 最新のmainブランチに切り替え
git checkout main
git pull origin main

# Trusted Publisher移行用の作業ブランチを作成
git checkout -b feature/migrate-to-trusted-publisher

```

## 2. GitHub Actionsワークフローの更新

> **注意**: フェーズ2でnpm側の設定が完了していることを確認してから進めてください。この順序で作業することで、後でGitHub Actionsのテスト実行時にnpm側の認証が正しく機能します。

### 1. 権限の追加

ワークフローファイルのjobセクションに以下の権限を追加：

```yaml
jobs:
  npm-publish:
    runs-on: ubuntu-22.04
    permissions:
      id-token: write  # Required for OIDC authentication
      contents: read   # Required for repository access
    steps:
      # ... 既存のsteps
```

### 2. npmのバージョン更新

Node.jsセットアップの後に、npmをv11.6.0に更新するステップを追加：

```yaml
- name: Use Node.js
  uses: actions/setup-node@v4  # 既存のバージョンを維持（無理に更新する必要なし）
  with:
    node-version: "20"
    cache: "npm"
    registry-url: "https://registry.npmjs.org"
- name: Upgrade npm to v11.6.0
  run: npm install -g npm@11.6.0
```

> **重要**: 既存のactionのバージョン（例：`actions/setup-node@a0853c24...`）は無理に更新する必要はありません。OIDC認証に必要なのはnpmの最新化と権限設定です。

### 3. NPM公開ステップの更新

環境変数から`NODE_AUTH_TOKEN`を削除：

**変更前：**
```yaml
- name: Publish package on NPM 📦
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}
```

**変更後：**
```yaml
- name: Publish package on NPM 📦
  run: npm publish --access public
  # env: セクションを削除
```

### 4. 完全な更新例

**既存のactionバージョンを維持した例**：

```yaml
name: Publish to NPM
on:
  release:
    types: [published]  # 重要：publishedのみ指定（created, editedは除外）
jobs:
  npm-publish:
    runs-on: ubuntu-22.04
    permissions:
      id-token: write  # Required for OIDC authentication
      contents: read   # Required for repository access
    steps:
      - name: Checkout
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
      - name: Use Node.js
        uses: actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5.0.0
        with:
          node-version: "20"
          cache: "npm"
          registry-url: "https://registry.npmjs.org"
      - name: Upgrade npm to v11.6.0
        run: npm install -g npm@11.6.0
      - run: npm ci
      - name: build binary
        run: npm run build
      - name: Publish package on NPM 📦
        run: npm publish --access public
```

> **注意**: 上記の例では既存のactionバージョン（ハッシュ形式）をそのまま維持しています。これにより、既存の動作環境を壊すリスクを最小限に抑えながらTrusted Publisher移行が可能です。

### フェーズ3完了チェックリスト

以下の項目をすべて確認してから**フェーズ4**に進んでください：

- [ ] 作業ブランチを作成済み
- [ ] GitHub Actionsワークフローに`permissions`セクションを追加済み（`id-token: write`, `contents: read`）
- [ ] npmアップグレードステップを追加済み（`npm install -g npm@11.6.0`）
- [ ] 環境変数`NODE_AUTH_TOKEN`をワークフローから削除済み
- [ ] リリーストリガーが適切に設定されている（`types: [published]`）
- [ ] ワークフローの文法チェックが完了している

> **注意**: この時点ではまだNPMトークンの削除は実行しないでください。フェーズ4でPRマージ後に安全に削除します。

---

# フェーズ4: 統合とデプロイ（PR作成、マージ、トークン削除）

## 1. PR作成とマージ

> **重要**: このフェーズでは、まずPRを作成してマージし、その後でNPMトークンを削除します。この順序で実行することで、問題が発生した場合のロールバックが容易になります。

### 1. 現在のシークレットを確認

```bash
# リポジトリのシークレット一覧を表示
gh secret list
```

### 2. NPMトークンの削除

```bash
# NPMトークンを削除（トークン名は事前調査で確認した名前を使用）
gh secret delete NPM_PUBLISH_TOKEN

# 削除確認
gh secret list | grep NPM
```

### 3. Organization シークレットの確認と削除（該当する場合）

```bash
# Organizationレベルのシークレット確認
gh secret list --org [organization-name]

# 必要に応じて削除
gh secret delete NPM_PUBLISH_TOKEN --org [organization-name]
```

### 1.1. 変更のコミットとPR作成

すべての設定変更が完了したら、変更をコミットしてPull Requestを作成します：

```bash
# 変更されたファイルを確認
git status

# ワークフローファイルの変更をステージング
git add .github/workflows/npm_publish.yml

# コミットメッセージで@記号を避けてコミット
git commit -m "$(cat <<'EOF'
feat: Migrate npm publishing to Trusted Publisher

- Add OIDC permissions for GitHub Actions workflow
- Add npm upgrade step for latest OIDC support
- Remove NPM token authentication
- Enable provenance statements for enhanced security

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# リモートブランチにプッシュ
git push origin feature/migrate-to-trusted-publisher

# Pull Requestを作成
gh pr create --title "Migrate npm publishing to Trusted Publisher" --body "$(cat <<'EOF'
## Summary

This PR migrates npm package publishing from token-based authentication to NPM Trusted Publisher with OIDC authentication.

## Changes

- ✅ NPM Trusted Publisher configured on npmjs.com
- ✅ Publishing access set to "Require two-factor authentication and disallow tokens"
- ✅ Added OIDC permissions to GitHub Actions workflow
- ✅ Added npm upgrade step for latest OIDC support
- ✅ Removed NPM token authentication from workflow
- ✅ Deleted `NPM_PUBLISH_TOKEN` from repository secrets

## Security Improvements

- Enhanced security through OIDC authentication
- Provenance statements for package integrity
- Elimination of long-lived tokens
- Two-factor authentication requirement

## Testing

The migration can be tested by creating a release after this PR is merged. The workflow should successfully publish to NPM using Trusted Publisher authentication.

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

> **重要**: コミットメッセージとPR本文では`@`記号をコードブロックで囲むことで、意図しないユーザーへの通知を防いでいます。

### 1.2. PRのマージと動作確認

1. PRをマージします
2. マージ後、テストリリースを作成してワークフローが正常に動作することを確認します
3. **重要**: 動作確認が完了してから次のステップに進んでください

### 1.3. NPMトークンの安全な削除

> **注意**: このステップはPRマージと動作確認が完了してから実行してください。トークン削除後は従来の方法での公開が不可能になります。

#### 現在のシークレットを確認

```bash
# リポジトリのシークレット一覧を表示
gh secret list
```

#### NPMトークンの削除

```bash
# NPMトークンを削除（トークン名は事前調査で確認した名前を使用）
gh secret delete NPM_PUBLISH_TOKEN

# 削除確認
gh secret list | grep NPM
```

#### Organizationシークレットの確認と削除（該当する場合）

```bash
# Organizationレベルのシークレット確認
gh secret list --org [organization-name]

# 必要に応じて削除
gh secret delete NPM_PUBLISH_TOKEN --org [organization-name]
```

### フェーズ4完了チェックリスト

以下の項目をすべて確認して基本的な移行作業を完了してください：

- [ ] PRが正常に作成され、マージされた
- [ ] マージ後のテストリリースでワークフローが正常動作した
- [ ] NPMトークンをリポジトリシークレットから削除済み
- [ ] OrganizationシークレットからもNPMトークンを削除済み（該当する場合）
- [ ] 削除後のシークレット一覧でNPMトークンが存在しないことを確認済み

> **お疲れさま**: ここまででNPM Trusted Publisher移行の**基本作業は完了**です。フェーズ5は追加の検証が必要な場合のみ実行してください。通常の移行作業では、この時点で安全に作業を終了できます。

---

# フェーズ5: 動作確認と検証（オプショナル）

> **注意**: このフェーズは**オプショナル**です。基本的な移行作業はフェーズ4で完了しており、トークン削除も含めて必要な作業は終了しています。このフェーズは追加の安心感を得たい場合や、詳細な検証が必要な場合にのみ実行してください。

## 1. テスト公開の実行

### 1.1. リリース作成とワークフロー確認

1. GitHub上でテスト用のリリースを作成
2. ワークフローが正常に実行されることを確認
3. NPMパッケージが正しく公開されることを確認

### 1.2. ログの確認ポイント

以下の項目をGitHub Actionsのログで確認してください：

- [ ] OIDC認証が成功していること
- [ ] NPM公開が環境変数なしで実行されていること
- [ ] エラーが発生していないこと
- [ ] Provenance statementsが正しく生成されていること（該当する場合）

## 2. トラブルシューティング

### よくある問題と解決方法

**1. OIDC認証エラー**
- `permissions: id-token: write`が設定されているか確認
- NPM Trusted Publisherの設定が正しいか確認

**2. ワークフローファイル名の不一致**
- NPM側に登録したファイル名と実際のファイル名が一致しているか確認
- 拡張子（.yml）も含めて正確に入力する

**3. リポジトリ名の不一致**
- GitHubリポジトリ名とNPM側の登録が一致しているか確認
- ユーザー名/Organization名が正しいか確認

**4. 権限不足エラー**
- `contents: read`権限が設定されているか確認
- リポジトリのSettings > Actions > Generalで適切な権限が設定されているか確認

**5. 意図しないタイミングでワークフローが実行される**
- リリーストリガーで`types: [published]`が明示的に指定されているか確認
- `types`を省略すると`created`, `edited`, `published`すべてで実行される
- パッケージ公開は`published`状態でのみ実行するべき

### フェーズ5完了チェックリスト（オプショナル）

このフェーズを実行する場合は、以下の項目を確認してください：

- [ ] テストリリースでワークフローが正常動作した
- [ ] NPMパッケージが正しく公開された
- [ ] OIDC認証ログにエラーがない
- [ ] 従来のNPMトークンがすべて削除されている
- [ ] Trusted Publisher設定が正しく機能している

> **注意**: これらの確認は追加の安心感のためのものであり、移行作業自体はフェーズ4で完了しています。

---

# 重要な注意事項と安全性ガイドライン

## 移行時の安全性ベストプラクティス

### 1. 段階的な移行アプローチ

- **フェーズ順の守**：各フェーズを着実に完了してから次に進む
- **トークン削除のタイミング**：動作確認後に実行し、ロールバックの可能性を保つ
- **バックアップの作成**：重要な設定変更前にはバックアップを作成

### 2. ロールバック手順

問題が発生した場合の対応手順：

**フェーズ2完了前のロールバック**：
- NPM側設定を元に戻す（Publishing Accessを元の設定に戻す）

**フェーズ4完了前のロールバック**：
- ワークフローを元の状態に戻す
- NPMトークンを再設定する

**フェーズ4完了後のロールバック**：
- 新しいNPMトークンを作成して緊急設定
- NPM側のPublishing Accessを一時的に緩和

### 3. セキュリティチェックリスト

移行完了後の定期確認項目：

- [ ] 不用なNPMトークンが残っていないか定期確認
- [ ] ワークフローの権限設定が適切か確認
- [ ] リリースプロセスが意図通り動作しているか確認
- [ ] パッケージのProvenance情報が正しく表示されているか確認

## 参考リンクとリソース

- [NPM Trusted Publishers 公式ドキュメント](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC 認証ドキュメント](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [NPM セキュリティベストプラクティス](https://docs.npmjs.com/security)

## 最終確認

この手順書に従って移行を完了した後、以下の状態になっていることを確認してください：

✅ **セキュリティ向上**
- OIDC認証による強化されたセキュリティ
- 長期間有効なトークンの排除
- パッケージの整合性確認のためのProvenance情報

✅ **運用改善**
- トークン管理の負担軽減
- 自動化された認証フロー
- フェールセーフな公開プロセス

✅ **コンプライアンス**
- 2FA認証の必須化
- 最新のセキュリティ標準への準拠
- 監査可能な公開プロセス

---

**移行作業お疑れさまでした。NPM Trusted Publisherによる安全なパッケージ公開をお楽しみください。**

## 動作確認

### 1. テスト公開の実行

1. GitHub上でテスト用のリリースを作成
2. ワークフローが正常に実行されることを確認
3. NPMパッケージが正しく公開されることを確認

### 2. ログの確認ポイント

- OIDC認証が成功していること
- NPM公開が環境変数なしで実行されていること
- エラーが発生していないこと

## トラブルシューティング

### よくある問題と解決方法

**1. OIDC認証エラー**
- `permissions: id-token: write` が設定されているか確認
- NPM Trusted Publisherの設定が正しいか確認

**2. ワークフローファイル名の不一致**
- NPM側に登録したファイル名と実際のファイル名が一致しているか確認
- 拡張子（.yml）も含めて正確に入力する

**3. リポジトリ名の不一致**
- GitHubリポジトリ名とNPM側の登録が一致しているか確認
- ユーザー名/Organization名が正しいか確認

**4. 権限不足エラー**
- `contents: read` 権限が設定されているか確認
- リポジトリの Settings > Actions > General で適切な権限が設定されているか確認

**5. 意図しないタイミングでワークフローが実行される**
- リリーストリガーで `types: [published]` が明示的に指定されているか確認
- `types` を省略すると `created`, `edited`, `published` すべてで実行される
- パッケージ公開は `published` 状態でのみ実行するべき

### 参考リンク

- [NPM Trusted Publishers 公式ドキュメント](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC 認証ドキュメント](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

## ベストプラクティス

### 移行時の推奨手順

1. **既存の設定を温存**: actionのバージョンやハッシュは無理に更新せず、動作している環境を維持
2. **段階的な移行**:
   - 権限設定の追加
   - npmアップグレードの追加
   - リリーストリガーの適切な設定確認
   - トークン削除は最後に実行
3. **確認の徹底**: 各ステップ後に`gh secret list`でトークンの存在確認

### 実装後の確認項目

- [ ] NPM側でTrusted Publisher設定が完了している
- [ ] Publishing Accessが「Require two-factor authentication and disallow tokens」に設定されている
- [ ] GitHub Actionsワークフローに`permissions`セクションが追加されている
- [ ] `npm install -g npm@latest`ステップが追加されている
- [ ] リリーストリガーが適切に設定されている（`types: [published]`）
- [ ] 環境変数`NODE_AUTH_TOKEN`が削除されている
- [ ] リポジトリシークレットからNPMトークンが削除されている

## 注意事項

- 移行作業は本番環境での作業となるため、事前にテスト環境で十分に検証してください
- Trusted Publisher設定後、従来のトークンベース認証は使用できなくなります
- 複数のリポジトリから同じパッケージを公開する場合は、それぞれのリポジトリをTrusted Publisherとして登録する必要があります
- **actionのバージョン更新は必須ではありません** - 既存の動作環境を維持することを優先してください