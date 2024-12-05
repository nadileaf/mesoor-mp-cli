const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora = require("ora");
const { downloadTemplate } = require("./utils/download");
const { replaceAppId, replacePackageName } = require("./utils/replace");
const { type } = require("os");

async function create(options) {
  const { projectName } = await inquirer.prompt({
    type: "input",
    name: "projectName",
    message: "请输入项目名称:",
  });

  const { appId } = await inquirer.prompt({
    type: "input",
    name: "appId",
    message: "请输入小程序AppID:",
  });

  const targetDir = path.join(process.cwd(), projectName);
  const spinner = ora("正在下载模板...").start();

  try {
    await fs.ensureDir(targetDir);

    await downloadTemplate(targetDir);
    spinner.succeed("模板下载完成");

    await Promise.all([
      replaceAppId(targetDir, appId),
      replacePackageName(targetDir, projectName),
    ]);

    console.log(chalk.green("\n✨ 项目创建成功!\n"));
  } catch (err) {
    spinner.fail("创建失败");
    console.error("错误详情:", err);
  }
}

module.exports = create;
