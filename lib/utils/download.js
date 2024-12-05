const fs = require("fs-extra");
const path = require("path");

async function downloadTemplate(targetDir) {
  const templateDir = path.resolve(__dirname, "../../template");

  try {
    await fs.copy(templateDir, targetDir);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  downloadTemplate,
};
