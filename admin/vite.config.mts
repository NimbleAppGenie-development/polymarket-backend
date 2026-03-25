import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load env variables for current mode
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [
      react(),
    ],
    server: {
      port: Number(env.VITE_API_PORT) || 5173,
      open: true,
    },
  });
};