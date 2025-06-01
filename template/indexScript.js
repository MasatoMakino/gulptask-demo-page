/**
 * デモパスからデモ名を抽出 (例: "demo/demoTypeScript.html" -> "demoTypeScript")
 */
function getDemoNameFromPath(path) {
  if (!path) return null;

  var parts = path.split("/");
  var fileName = parts[parts.length - 1];

  if (fileName.endsWith(".html")) {
    return fileName.substring(0, fileName.length - ".html".length);
  }
  return null;
}
