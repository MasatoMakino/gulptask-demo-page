import fs from "fs";
import path from "path";
import { expect } from "vitest";

function isExist(relativePath: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), relativePath));
}
export function isExistFile(relativePath: string): void {
  expect(isExist(relativePath)).toBeTruthy();
}
export function isNotExistFile(relativePath: string): void {
  expect(isExist(relativePath)).toBeFalsy();
}
