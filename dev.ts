import { name } from './package.json';
import { watch } from 'fs';
import path from 'path';
import { build } from './build';
import { app } from './src/api';

await build();

const wsPath = '__bun_live_reload_websocket__';
const reloadCommand = 'reload';

const server = Bun.serve({
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.slice(1);

    if (pathname === wsPath) {
      const upgraded = server.upgrade(request);
      if (!upgraded) {
        return new Response(
          'Failed to upgrade websocket connection for live reload',
          { status: 400 }
        );
      }
    }

    const isApiCall = pathname.slice(0, 3) === 'api';
    if (isApiCall) {
      const response = await app.handle(request);
      return response;
    }

    const hasExtension = path.extname(pathname) !== '';
    const filename = hasExtension ? pathname : 'index.html';
    const file = Bun.file(path.join('dist', 'public', filename));
    const exists = await file.exists();

    if (!exists)
      return new Response(null, {
        status: 302,
        headers: { Location: url.origin },
      });
    else if (file.type.includes('text/html')) {
      const content = await file.text();
      return new Response(
        content.replace('</head>', `${liveReloadScript()}</head>`),
        { headers: { 'Content-Type': file.type } }
      );
    }
    return new Response(file);
  },
  websocket: {
    open: async (ws) => {
      watch(
        path.join(import.meta.dir, 'src'),
        { recursive: true },
        async () => {
          await build();
          ws.send(reloadCommand);
        }
      );
    },
    message() {},
  },
});

const liveReloadScript = (): string => `
    <script type="text/javascript">
      (function() {
        const socket = new WebSocket("ws://${path.join(
          server.url.host,
          wsPath
        )}");
        socket.onmessage = function(msg) {
          if (msg.data === '${reloadCommand}')
            location.reload()
        };
      })();
    </script>`;

console.log(`${name} server listening on ${server.url}`);
