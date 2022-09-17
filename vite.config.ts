import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#34d499',
          'body-background': '#1b1b22',
          'font-size-base': '14px',
          'btn-height-base': '40px',
          'btn-font-weight': 'bold',
        },
        javascriptEnabled: true,
      },
    },
  },
});
