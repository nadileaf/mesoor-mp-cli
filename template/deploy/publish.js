const { version, appId } = require('./../package.json');

const CI = require('miniprogram-ci');

const RUNTIME_ENV = process.env.RUNTIME_ENV;

(async () => {
  const project = new CI.Project({
    appid: appId,
    type: 'miniProgram',
    projectPath: `./dist/build/mp-weixin/`,
    privateKeyPath: `./deploy/private.key`,
    ignores: ['./node_modules/**/*']
  });

  await CI.upload({
    project,
    version,
    desc: `构建环境：${RUNTIME_ENV}， 构建版本${version}`,
    robot: RUNTIME_ENV === 'production' ? 1 : 2,
    setting: {
      es6: true,
      es7: true,
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      minify: true
    },
    onProgressUpdate: console.log
  });
  console.log(`env:${RUNTIME_ENV}  version:${version}`);
  console.log('================= publish finish =================');
})();
