import path from 'node:path';

import { pnpmWorkspaceRootSync as findWorkspaceDirSync } from '@node-kit/pnpm-workspace-root';
import findPackageDir from 'pkg-dir';

const WORKSPACE_DIR = findWorkspaceDirSync(process.cwd())!;
const PACKAGE_DIR = findPackageDir.sync()!;

export const DATABASE_PATH = path.resolve(PACKAGE_DIR, './dist/database.sqlite');

export const DATABASE_SEED_PATH = path.resolve(PACKAGE_DIR, './seeds/database.sqlite');

export const IMAGES_PATH = path.resolve(PACKAGE_DIR, './dist/images');

export const CLIENT_STATIC_PATH = path.resolve(WORKSPACE_DIR, './workspaces/client/dist');

export const INDEX_HTML_PATH = path.resolve(PACKAGE_DIR, './index.html');
