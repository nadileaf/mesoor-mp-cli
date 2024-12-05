import { pages, subPackages } from './../src/pages.json';
import fs from 'fs';
import { resolve } from 'path';
import { lintFixFile } from './lintFix';

const targetPath = resolve(__dirname, './../src/types/routePages.d.ts');

/** 自动生成page路由类型，方便useRouter调用 */
export async function generateRoutePagesType() {
  const pagesArr = pages.map((page) => JSON.stringify('/' + page.path));
  const subPagesArr = subPackages
    .map((subPackage) => subPackage.pages.map((page) => JSON.stringify('/' + subPackage.root + '/' + page.path)))
    .flat();
  const pathType = [...pagesArr, ...subPagesArr].join('|');
  fs.writeFileSync(
    targetPath,
    `
    declare namespace RoutePages {
      type Path = ${pathType};
    }
    `
  );
  await lintFixFile(targetPath);
}
