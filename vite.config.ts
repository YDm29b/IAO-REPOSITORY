import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          const { app } = await import('./server/app.js');
          return app(req, res, next);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          const { app } = await import('./server/app.js');
          return app(req, res, next);
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), expressApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
