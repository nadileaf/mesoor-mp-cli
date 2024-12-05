import { ESLint } from 'eslint';

export async function lintFixFile(path) {
  const eslint = new ESLint({ fix: true });
  // 检查文件，这不会修改目标文件
  const results = await eslint.lintFiles([path]);
  // 用固定的代码修改文件
  await ESLint.outputFixes(results);
  // 格式化结果
  await eslint.loadFormatter('stylish');
}
