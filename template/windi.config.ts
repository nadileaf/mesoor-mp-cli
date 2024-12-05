import { defineConfig } from 'vite-plugin-windicss';
import lineClampPlugin from 'windicss/plugin/line-clamp';

export default defineConfig({
  attributify: true,
  extract: {
    // accepts globs and file paths relative to project root
    include: ['index.html', 'src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules/**/*', '.git/**/*', 'dist']
  },
  plugins: [lineClampPlugin],
  corePlugins: {
    // 禁用掉在小程序环境中不可能用到的 plugins
    container: false
  },
  theme: {
    extend: {
      colors: {
        primary: '#356899',
        success: '#4b9148',
        warning: '#f0ad4e',
        danger: '#dd524d',
        'grey-95': '#F2F2F3',
        'grey-90': '#E4E5E7',
        'grey-60': '#95969D'
      }
    }
  },
  shortcuts: {
    'm-card': 'p-4 bg-white rounded-md',
    'm-card-title': 'text-xl font-bold',
    'm-card-subtitle': 'text-sm text-grey-60',
    'm-card-content': 'text-base text-grey-90',
    divider: 'h-1px my-3 bg-grey-90',
    'bg-gradient': 'bg-gradient-to-b from-white to-bg'
  }
});
