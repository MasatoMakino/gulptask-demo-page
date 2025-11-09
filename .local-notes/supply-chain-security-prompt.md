# サプライチェーン攻撃対策の実装プロンプト

このプロンプトは、Node.jsプロジェクトにサプライチェーン攻撃対策を実装するためのClaude Code用の自動実行可能な指示書です。

## 実装する対策

以下の3つの重要な対策を段階的に実装します：

1. **Dependabot更新頻度制限** - cooldown設定による依存関係更新の制御
2. **GitHub Actions第三者Action固定** - commit SHAによるAction固定
3. **設定の検証と確認** - 実装したセキュリティ対策の動作確認

---

## Claude Codeへの実行指示

以下の指示をClaude Codeにそのままコピー&ペーストして実行してください：

```
このリポジトリにサプライチェーン攻撃対策を実装してください。以下の対策を順番に実装し、各段階で確認を求めてください。

## 事前準備: 作業ブランチの作成

まず、セキュリティ対策用の作業ブランチを作成してください：

```bash
# デフォルトブランチ（main または master）から最新の状態を取得
git fetch origin
git checkout main  # または master
git pull origin main  # または master

# Dependabotセキュリティ対策用のブランチを作成・切り替え
git checkout -b security/dependabot-supply-chain-protection

# リモートリポジトリの情報を確認（後でワークフロー設定に使用）
git remote get-url origin
```

この作業ブランチ上で以下の対策を実装し、完了後にPull Requestを作成します。

## 事前チェック: 既存自動マージワークフローの削除

まず、既存の自動マージワークフローがある場合は削除してください：

```bash
# 既存のワークフローファイルを検索
find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs grep -l "dependabot/fetch-metadata"

# 上記で見つかったファイルの中から、以下の3つの条件をすべて満たすファイルを特定：
# 1. dependabot/fetch-metadata を使用している
# 2. gh コマンド（gh pr comment, gh pr merge等）を使用している
# 3. merge関連の文言（merge, auto-merge, @dependabot merge等）を含んでいる

# 該当ファイルの内容確認例
grep -A 10 -B 10 "dependabot/fetch-metadata" .github/workflows/suspected-file.yml
grep -A 5 -B 5 "gh.*merge\|@dependabot.*merge\|auto-merge" .github/workflows/suspected-file.yml

# 条件に合致するファイルが見つかった場合は削除
rm .github/workflows/dependabot-auto-merge.yml  # 例
```

削除対象となるワークフローの特徴：
- `uses: dependabot/fetch-metadata@...` アクションを使用
- `gh pr comment` や `gh pr merge` 等のGitHub CLIコマンドを実行
- `@dependabot squash and merge` 等のコメントや `auto-merge` の文言を含む

次に、paambaati/codeclimate-actionを使用しているワークフローを探してください。
このサービスは終了してしまったので、このActionを使用しているワークフローがあれば削除してください。

## 対策1: Dependabot cooldown設定の実装

`.github/dependabot.yml`ファイルを作成または更新して、以下の設定を追加してください：

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"  # 既存の設定がある場合はそれを優先してください
    cooldown:
      default-days: 5 # 全体的な更新頻度の制御 semver制御はできない

  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"  # 既存の設定がある場合はそれを優先してください
    cooldown:
      default-days: 5
      semver-major-days: 30
      semver-minor-days: 7
      semver-patch-days: 3
```

## 対策2: GitHub Actions第三者Actionの固定

既存のGitHub Actionsワークフローファイル（`.github/workflows/*.yml`）を確認し、第三者のActionを使用している箇所があれば、タグではなくcommit SHAで固定してください。

例：
- 変更前: `uses: biomejs/setup-biome@v2`
- 変更後: `uses: biomejs/setup-biome@454fa0d884737805f48d7dc236c1761a0ac3cc13 # v2.6.0`
- 変更前: `uses: dependabot/fetch-metadata@v2`
- 変更後: `uses: dependabot/fetch-metadata@08eff52bf64351f401fb50d4972fa95b9f2c2d1b # v2.4.0`
- 変更前: `uses: davelosert/vitest-coverage-report-action@v2`
- 変更後: `uses: davelosert/vitest-coverage-report-action@8ab049ff5a2c6e78f78af446329379b318544a1a # v2.8.3`
- 変更前: `uses: peaceiris/actions-gh-pages@v4`
- 変更後: `uses: peaceiris/actions-gh-pages@4f9cc6602d3f66b9c108549d475ec49e8ef4d45e # v4.0.0`
- actions/checkout@v4 → @08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
- actions/setup-node@v4 → @a0853c24544627f65ddf259abe73b1d18a591444 # v5.0.0
- dependabot/fetch-metadata@v2 → @08eff52bf64351f401fb50d4972fa95b9f2c2d1b # v2.4.0
- paambaati/codeclimate-action@v9.0.0 → @f429536ee076d758a24705203199548125a28ca7 # v9.0.0
- peaceiris/actions-gh-pages@v4 → @4f9cc6602d3f66b9c108549d475ec49e8ef4d45e # v4.0.0

上記の既知のアクションは、上記のコミットSHAを使用してください。

上記に記載のない、未知のActionだけは以下の手順でcommit SHAで固定してください。

### GitHub Actions SHA取得方法（WebFetch版）

#### 基本手順
  1. 最新バージョンの取得
  WebFetch: https://api.github.com/repos/{owner}/{repo}/releases/latest
  プロンプト: tag_nameフィールドから最新バージョンを抽出してください

  2. コミットSHAの取得
  WebFetch: https://api.github.com/repos/{owner}/{repo}/commits/{バージョン}
  プロンプト: shaフィールドからこのバージョンのコミットSHAを抽出してください

#### 実際の使用例
  actions/checkoutの場合:
  WebFetch: https://api.github.com/repos/actions/checkout/releases/latest
  プロンプト: tag_nameフィールドから最新バージョンを抽出してください
  結果: v5.0.0

  WebFetch: https://api.github.com/repos/actions/checkout/commits/v5.0.0
  プロンプト: shaフィールドからこのバージョンのコミットSHAを抽出してください
  結果: 08c6903cd8c0fde910a37f88322edcfb5dd907a8

#### ワークフローでの記述
  uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

#### 注意点
  - SHAは必ず40文字の英数字であることを確認
  - commits API（/commits/{tag}）を使用し、git refs API（/git/ref/tags/{tag}）は使わない
  - バージョンコメント（# v5.0.0）を併記して管理を容易にする

## 対策3: 設定の検証と確認

実装後、以下を確認してください：
1. `.github/dependabot.yml`のyaml構文が正しいか、インストール済みのactionlintで検証する
2. GitHub Actionsワークフローの構文が正しいか

注意点：外部ツールを新規にインストールしてはいけない。それ自体がサプライチェーン攻撃のリスクになるため。

## セキュリティ対策の説明

### Dependabot cooldown設定の効果
- **major版更新**: 30日間隔 - 破壊的変更のリスクを最小化
- **minor版更新**: 7日間隔 - 機能追加の慎重な検証
- **patch版更新**: 3日間隔 - セキュリティ修正の迅速な適用
- **default**: 5日間隔 - 全体的な更新頻度の制御


各対策を実装したら、次の対策に進む前に確認をお願いします。
```

---

## 実装チェックリスト

実装完了後、以下の項目を確認してください：

### Dependabot設定
- [ ] `.github/dependabot.yml`ファイルが作成されている
- [ ] cooldown設定が適切に設定されている
- [ ] npm と github-actions の両方が設定されている

### GitHub Actions設定
- [ ] 第三者Actionがcommit SHAで固定されている
- [ ] コメントでバージョン情報が併記されている

### 動作確認
- [ ] GitHub ActionsのSyntax checkが通る
- [ ] Dependabotが正常に動作する

---

## トラブルシューティング

### よくある問題と解決方法

**1. リポジトリ名の設定間違い**
```yaml
# 間違い例
github.repository == 'username/repo-name'
# 正しい例 - GitHubの実際のリポジトリ名を使用
github.repository == 'YourActualUsername/your-actual-repo-name'
```

**2. commit SHAの取得方法**
1. 対象のGitHub Actionのリポジトリにアクセス
2. Releasesページで最新バージョンを確認
3. そのバージョンのタグをクリック
4. commit SHAをコピー


---

## 参考情報

### セキュリティベストプラクティス
- 定期的なcommit SHAの更新
- 自動マージ条件の定期的な見直し
- Dependabot設定の調整

### 関連ドキュメント
- [GitHub Dependabot configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Dependabot auto-merge](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates)