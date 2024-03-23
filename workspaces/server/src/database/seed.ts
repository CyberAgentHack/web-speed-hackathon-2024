import fs, {copyFile, mkdir, readdir} from "node:fs/promises";
import path from "node:path";

import {
  DATABASE_PATH,
  DATABASE_SEED_PATH,
  MIGRATION_PATH,
  MIGRATION_SEED_PATH
} from '../constants/paths';

import { initializeDatabase } from './drizzle';

export const seeding = async () => {
  await fs.copyFile(DATABASE_SEED_PATH, DATABASE_PATH);
  await copyDir(MIGRATION_SEED_PATH, MIGRATION_PATH);
  await initializeDatabase();

  console.log('Finished seeding');
};

export const copyDir = async (src: string, dest: string) => {
  try {
    // コピー先ディレクトリが存在しない場合、作成する
    await mkdir(dest, { recursive: true });

    // コピー元のファイル・ディレクトリ一覧を取得する
    const files = await readdir(src, { withFileTypes: true });

    // 各エントリに対してコピー操作を実行する
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isDirectory()) {
        // ディレクトリの場合、再帰的にコピーする
        await copyDir(srcPath, destPath);
      } else {
        // ファイルの場合、単純にコピーする
        await copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error while copying directory: ${error}`);
  }
};
