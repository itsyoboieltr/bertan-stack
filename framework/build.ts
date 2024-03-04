import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../tailwind.config';
import path from 'path';
import { transform } from 'lightningcss';
import { generator, getConfig } from '@tanstack/router-generator';
import { clientEnv } from '../src/utils/env/client';

export async function buildStyles() {
  postcss([tailwindcss({ config: tailwindConfig })])
    .process(await Bun.file(path.join('src', 'styles.css')).text(), {
      from: undefined,
    })
    .then(async ({ css }) => {
      await Bun.write(
        'dist/public/styles.css',
        transform({
          filename: 'styles.css',
          code: Buffer.from(css),
          minify: true,
        }).code
      );
    });
}

export async function buildRoutes() {
  await generator(await getConfig());
}

export async function buildPublic() {
  await Promise.all(
    (await Array.fromAsync(new Bun.Glob('public/**').scan())).map(
      async (file) => {
        await Bun.write(
          file.replace('public/', 'dist/public/'),
          Bun.file(file)
        );
      }
    )
  );
}

export async function buildClient() {
  await Promise.all([
    Bun.write('dist/public/index.html', Bun.file('src/index.html')),
    Bun.build({
      entrypoints: ['src/app.tsx'],
      outdir: 'dist/public',
      naming: 'index.js',
      minify: true,
      target: 'browser',
      define: Object.fromEntries(
        Object.entries(clientEnv).map(([key, value]) => [
          `Bun.env.CLIENT_${key}`,
          value ?? '',
        ])
      ),
    }),
  ]);
}

export async function buildServer() {
  try {
    await Bun.build({
      entrypoints: ['src/api/index.ts'],
      outdir: 'dist',
      naming: 'index.js',
      minify: true,
      target: 'bun',
    });
  } catch (error) {
    // API folder does not exist
  }
}

export async function build() {
  await Promise.all([
    buildRoutes(),
    buildStyles(),
    buildPublic(),
    buildClient(),
    buildServer(),
  ]);
}

if (import.meta.main) await build();
