import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config';
import path from 'path';
import { transform } from 'lightningcss';
import { generator, getConfig } from '@tanstack/router-generator';

export async function buildStyles() {
  postcss([tailwindcss({ config: tailwindConfig })])
    .process(
      await Bun.file(path.join(import.meta.dir, 'src', 'styles.css')).text(),
      { from: undefined }
    )
    .then(async ({ css }) => {
      await Bun.write(
        'dist/styles.css',
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

export async function build() {
  await Promise.all([
    buildRoutes(),
    buildStyles(),
    Bun.build({
      entrypoints: ['src/app.tsx'],
      outdir: 'dist',
      naming: 'index.js',
      minify: true,
    }),
    Bun.write('dist/index.html', Bun.file('src/index.html')),
  ]);
}

if (import.meta.main) await build();
