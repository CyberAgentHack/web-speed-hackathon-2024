import path from 'node:path';

import { SingleBar } from 'cli-progress';
import { Command } from 'commander';
import { globby } from 'globby';

import { decrypt } from '../src/decrypt';
import { encrypt } from '../src/encrypt';

import { createCanvasContext } from './createCavnasContext';
import { createImageFromImageData } from './createImageFromImageData';
import { readJpegXL } from './reader/readJpegXL';
import { readPng } from './reader/readPng';
import { writeJpegXL } from './writer/writeJpegXL';
import { writePng } from './writer/writePng';

const program = new Command();

program
  .command('encrypt')
  .argument('<input-directory>', 'the directory of the images to encrypt')
  .argument('<output-directory>', 'the directory to output the encrypted images')
  .action(async (inputDirectory: string, outputDirectory: string) => {
    const progress = new SingleBar({
      format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
    });

    const imagePathList = await globby('**/*.png', {
      absolute: true,
      cwd: path.resolve(process.cwd(), inputDirectory),
    });

    progress.start(imagePathList.length, 0);

    for (const sourceImagePath of imagePathList) {
      progress.update({
        filename: path.basename(sourceImagePath),
      });

      const sourceImageData = await readPng(sourceImagePath);

      const sourceImage = await createImageFromImageData(sourceImageData);
      const exportCanvasContext = await createCanvasContext({
        height: sourceImageData.height,
        width: sourceImageData.width,
      });

      await encrypt({
        exportCanvasContext,
        sourceImage,
        sourceImageInfo: {
          height: sourceImageData.height,
          width: sourceImageData.width,
        },
      });

      const exportImageData = exportCanvasContext.getImageData(0, 0, sourceImageData.width, sourceImageData.height);
      const exportImagePath = path.resolve(
        outputDirectory,
        path.dirname(path.relative(inputDirectory, sourceImagePath)),
        path.parse(sourceImagePath).name + '.jxl',
      );
      await writeJpegXL({ filepath: exportImagePath, imageData: exportImageData });

      progress.increment();
    }

    progress.stop();
  });

program
  .command('decrypt')
  .argument('<input-directory>', 'the directory of the images to decrypt')
  .argument('<output-directory>', 'the directory to output the decrypted images')
  .action(async (inputDirectory: string, outputDirectory: string) => {
    const progress = new SingleBar({
      format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
    });

    const imagePathList = await globby('**/*.jxl', {
      absolute: true,
      cwd: path.resolve(process.cwd(), inputDirectory),
    });

    progress.start(imagePathList.length, 0);

    for (const sourceImagePath of imagePathList) {
      progress.update({
        filename: path.basename(sourceImagePath),
      });

      const sourceImageData = await readJpegXL(sourceImagePath);

      const sourceImage = await createImageFromImageData(sourceImageData);
      const exportCanvasContext = await createCanvasContext({
        height: sourceImageData.height,
        width: sourceImageData.width,
      });

      await decrypt({
        exportCanvasContext,
        sourceImage,
        sourceImageInfo: {
          height: sourceImageData.height,
          width: sourceImageData.width,
        },
      });

      const exportImageData = exportCanvasContext.getImageData(0, 0, sourceImageData.width, sourceImageData.height);
      const exportImagePath = path.resolve(
        outputDirectory,
        path.dirname(path.relative(inputDirectory, sourceImagePath)),
        path.parse(sourceImagePath).name + '.png',
      );
      await writePng({ filepath: exportImagePath, imageData: exportImageData });

      progress.increment();
    }

    progress.stop();
  });

program.parse(process.argv);
