# index.ejs に読み込まれるJavaScript関数のテスト方法

## 概要

`template/indexScript.js` は、`template/index.ejs` の埋め込みスクリプトから抽出されたJavaScript関数を配置するファイルです。これらの関数は、ブラウザ環境での互換性を維持するためにグローバルスコープに定義されています。通常のVitestのモジュールインポートやin-sourceテスティングではこれらのグローバル関数を直接テストすることが難しいため、特別なアプローチを採用しています。（通常のVitestのモジュールインポートやin-sourceテスティングではこれらのグローバル関数を直接テストすることが難しいため、特別なアプローチを採用しています。）

## テスト方法

テストファイル（`__test__/indexScript.spec.js`）では、Node.jsの `fs` および `vm` モジュールを使用して `template/indexScript.js` の内容を読み込み、分離されたコンテキスト内で実行することで、グローバルに定義された関数にアクセスしてテストを実行します。

### 手順

1.  **スクリプト内容の読み込み:**
    テストファイル内でNode.jsの `fs.readFileSync` を使用して、`template/indexScript.js` ファイルの内容を文字列として読み込みます。
    ```javascript
    import fs from "fs";
    import path from "path";
    // ...
    const scriptPath = path.resolve(__dirname, "../template/indexScript.js");
    const scriptContent = fs.readFileSync(scriptPath, "utf-8");
    ```
2.  **コンテキストの作成とスクリプトの実行:**
    Node.jsの `vm.createContext` で新しい空のコンテキストオブジェクトを作成し、`vm.runInContext` を使用して読み込んだスクリプトの内容をそのコンテキスト内で実行します。これにより、スクリプト内でグローバルに定義された変数や関数がこのコンテキストオブジェクトのプロパティとして利用可能になります。
    ```javascript
    import vm from "vm";
    // ...
    const context = {}; // スクリプトが依存するグローバル変数があればここに追加
    vm.createContext(context);
    vm.runInContext(scriptContent, context);
    ```
3.  **関数へのアクセスとテストの実行:**
    コンテキストオブジェクトからテストしたい関数（例: `getDemoNameFromPath`）を取得し、通常通りVitestの `describe` や `it` ブロック内でテストを実行します。

    ```javascript
    // コンテキストから関数を取得
    const { getDemoNameFromPath } = context;

    describe("getDemoNameFromPath", () => {
      it("should extract the demo name from a valid path", () => {
        const path = "demo/demoTypeScript.html";
        expect(getDemoNameFromPath(path)).toBe("demoTypeScript");
      });
      // 他のテストケース...
    });
    ```

## 利点

- `template/indexScript.js` ファイル自体をテストのために変更する必要がないため、ブラウザ互換性を維持できます。
- Vitestの複雑な環境設定（`setupFiles` など）に依存せず、テストコード内で明示的にスクリプトの評価を制御できます。

## 注意点

- スクリプトがブラウザ固有のグローバル変数（例: `window`, `document`）に依存している場合、テストコンテキスト（`context` オブジェクト）にそれらを模擬したオブジェクトを追加する必要がある場合があります。現在の `indexScript.js` はこれらの依存がないため、シンプルなコンテキストでテスト可能です。
- この方法はNode.js環境に依存するため、ブラウザ環境でのテストが必要な場合は別のツール（例: Playwright, Puppeteer）の検討が必要です。
