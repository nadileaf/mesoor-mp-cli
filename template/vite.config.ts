import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import WindiCSS from 'vite-plugin-windicss';
import MiniProgramTailwind from '@dcasia/mini-program-tailwind-webpack-plugin/rollup';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path';
import setupBuild from './build';

function resolvePath(relativePath: string) {
  return resolve(__dirname, relativePath);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  console.log(env);
  setupBuild();

  return {
    define: {
      // __RUNTIME_ENV__: `"${env.VITE_USER_NODE_ENV}"`
    },
    resolve: {
      alias: {
        '@': resolvePath('src')
      }
    },
    plugins: [
      WindiCSS(),
      MiniProgramTailwind(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        imports: ['vue'],
        dts: resolvePath('src/types/auto-imports.d.ts'),
        eslintrc: {
          enabled: false, // Default `false`
          filepath: resolvePath('.eslintrc-auto-import.json'), // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        dirs: ['src/components/basic'],
        directoryAsNamespace: true,
        dts: resolvePath('src/types/components.d.ts'),
        directives: false
      }),
      uni()
    ],
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          target: env.VITE_API_URL
        }
      }
    }
  };
});
