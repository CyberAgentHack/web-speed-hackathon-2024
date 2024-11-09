import fs from 'node:fs';
import path from 'node:path';

import { pnpmWorkspaceRoot as findWorkspaceDir } from '@node-kit/pnpm-workspace-root';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import findPackageDir from 'pkg-dir';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig(async (): Promise<Options[]> => {
  const PACKAGE_DIR = (await findPackageDir(process.cwd()))!;
  const WORKSPACE_DIR = (await findWorkspaceDir(process.cwd()))!;

  const OUTPUT_DIR = path.resolve(PACKAGE_DIR, './dist');

  const SEED_IMAGE_DIR = path.resolve(WORKSPACE_DIR, './workspaces/server/seeds/images');
  const IMAGE_PATH_LIST = fs.readdirSync(SEED_IMAGE_DIR).map((file) => `/images/${file}`);

  return [
    {
      bundle: true,
      clean: true,
      entry: {
        client: path.resolve(PACKAGE_DIR, './src/index.tsx'),
        serviceworker: path.resolve(PACKAGE_DIR, './src/serviceworker/index.ts'),
      },
      env: {
        API_URL: '',
        NODE_ENV: process.env['NODE_ENV'] || 'development',
        PATH_LIST: IMAGE_PATH_LIST.join(',') || '',
      },
      esbuildOptions(options) {
        options.define = {
          ...options.define,
          global: 'globalThis',
        };
        options.publicPath = '/';
      },
      esbuildPlugins: [
        polyfillNode({
          globals: {
            process: false,
          },
          polyfills: {
            events: true,
            fs: true,
            path: true,
          },
        }),
      ],
      format: 'iife',
      loader: {
        '.json?file': 'file',
        '.wasm': 'binary',
      },
      metafile: true,
      minify: false,
      outDir: OUTPUT_DIR,
      platform: 'browser',
      shims: true,
      sourcemap: 'inline',
      splitting: false,
      target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
      treeshake: false,
    },
  ];
});
