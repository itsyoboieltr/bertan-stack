import { generator, getConfig } from '@tanstack/router-generator';
import { scanDir } from '@tailwindcss/oxide';
import { Features, transform } from 'lightningcss';
import path from 'path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import { compile } from 'tailwindcss';
import { clientEnv } from '../src/utils/env/client';

export async function buildStyles(
  input = 'src/styles.css',
  output = 'dist/public/styles.css'
) {
  const inputCSS = await postcss()
    .use(atImport())
    .process(await Bun.file(input).text(), { from: input })
    .then((result) => result.css);

  const { build } = compile(inputCSS);

  const { candidates } = scanDir({ base: process.cwd() });
  const outputCSS = build(candidates);

  const optimizedCSS = transform({
    filename: path.basename(input),
    code: Buffer.from(outputCSS),
    minify: true,
    sourceMap: false,
    drafts: { customMedia: true },
    nonStandard: { deepSelectorCombinator: true },
    include: Features.Nesting,
    exclude: Features.LogicalProperties,
    targets: { safari: (16 << 16) | (4 << 8) },
    errorRecovery: true,
  }).code.toString();

  await Bun.write(output, optimizedCSS);
}

export async function buildRoutes() {
  await generator(await getConfig({ disableLogging: true }));
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
