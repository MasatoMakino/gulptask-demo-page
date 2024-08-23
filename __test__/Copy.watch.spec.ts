import { test, expect } from "vitest";
import { getCopyTaskSet } from "../src/Copy.js";
import { InitializedOption } from "../src/Option.js";
import fs from "fs";
import path from "path";

test("watchCopy correctly copies a file when it is added or updated", async () => {
  const copyTestDir = "./test_for_copy";
  const sourceDir = path.join(copyTestDir, "fixtures");
  const targetDir = path.join(copyTestDir, "copied");
  const filename = "source.txt";
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);

  // テスト前にディレクトリを作成
  await Promise.all([
    fs.promises.mkdir(sourceDir, { recursive: true }),
    fs.promises.mkdir(targetDir, { recursive: true }),
  ]);

  const options: InitializedOption = {
    prefix: "",
    srcDir: sourceDir,
    distDir: targetDir,
    externalScripts: [],
    body: "",
    style: "",
    copyTargets: ["txt"],
    rules: [],
  };

  // getCopyTaskSetを呼び出してタスクセットを取得
  const taskSet = getCopyTaskSet(options);
  taskSet.watchCopy();

  // ソースファイルを追加
  fs.writeFileSync(sourcePath, "updated content");

  // watchCopyがファイルの更新を検出してコピーを実行するまで待つ
  await new Promise((resolve) => setTimeout(resolve, 300));

  // ソースファイルとターゲットファイルの内容を読み込む
  const [sourceContent, targetContent] = await Promise.all([
    fs.promises.readFile(sourcePath, "utf8"),
    fs.promises.readFile(targetPath, "utf8"),
  ]);

  // ソースファイルとターゲットファイルの内容が一致していることを確認
  expect(sourceContent).toBe(targetContent);

  // テスト後にディレクトリを削除
  // await fs.promises.rm(copyTestDir, { recursive: true, force: true });
}, 3_000);
