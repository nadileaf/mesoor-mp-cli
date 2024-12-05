#!/usr/bin/env node
require("dotenv").config();

const { program } = require("commander");
const create = require("../lib/create");
const { version } = require("../package.json");

program
  .name("mesoor-mp")
  .version(version)
  .argument("[name]", "项目名称")
  .option("-f, --force", "强制覆盖已存在目录")
  .action((name, options) => {
    create(name, options);
  });

program.parse();
