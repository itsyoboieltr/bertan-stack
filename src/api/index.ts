import { Elysia } from 'elysia';
import { todoRoute } from './todo';
import path from 'path';
import { name } from '../../package.json';

export const app = new Elysia({ prefix: '/api' }).use(todoRoute).compile();

export type App = typeof app;

if (Bun.env.NODE_ENV === 'production') {
  const server = Bun.serve({
    async fetch(request) {
      const url = new URL(request.url);
      const pathname = url.pathname.slice(1);
      const isApiCall = pathname.slice(0, 3) === 'api';
      if (isApiCall) {
        const response = await app.handle(request);
        return response;
      }
      const hasExtension = path.extname(pathname) !== '';
      const filename = hasExtension ? pathname : 'index.html';
      const file = Bun.file(path.join(import.meta.dir, 'public', filename));
      const exists = await file.exists();
      if (!exists)
        return new Response(null, {
          status: 302,
          headers: { Location: url.origin },
        });
      return new Response(file);
    },
  });
  console.log(`${name} server listening on ${server.url}`);
}
