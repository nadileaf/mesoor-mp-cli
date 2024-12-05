const path = require("path");

async function replaceContent(files, from, to) {
  const { replaceInFile } = await import("replace-in-file");
  try {
    await replaceInFile({ files, from, to });
  } catch (err) {
    console.log("替换失败:", err);
    throw new Error(`替换失败: ${err.message}`);
  }
}

async function replaceAppId(targetDir, newAppId) {
  await replaceContent(
    [
      path.join(targetDir, "**/manifest.json"),
      path.join(targetDir, "**/project.config.json"),
    ],
    /wx[a-zA-Z0-9]{16}/g,
    newAppId
  );

  const packagePath = path.join(targetDir, "package.json");
  await replaceContent(
    packagePath,
    /"appId"\s*:\s*"[^"]*"/,
    `"appId": "${newAppId}"`
  );
}

async function replacePackageName(targetDir, newName) {
  const packagePath = path.join(targetDir, "package.json");
  await replaceContent(
    packagePath,
    /"name"\s*:\s*"[^"]*"/,
    `"name": "${newName}"`
  );
}

module.exports = { replaceAppId, replacePackageName };
