import fs from "fs";
import path from "path";

export function isExistFile(relativePath: string): void {
  const isExist = fs.existsSync(path.resolve(process.cwd(), relativePath));
  expect(isExist).toBeTruthy();
}
