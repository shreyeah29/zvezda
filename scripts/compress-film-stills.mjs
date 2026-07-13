#!/usr/bin/env node
/**
 * Compress gitignored film originals into deployable web stills.
 * Source: public/assets/images/film/
 * Output: public/assets/images/film-web/
 */
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "public/assets/images/film");
const OUTPUT_DIR = path.join(ROOT, "public/assets/images/film-web");
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;

const IMAGE_RE = /\.(jpe?g)$/i;

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await readdir(SOURCE_DIR);
  const sources = entries.filter((name) => IMAGE_RE.test(name)).sort();

  let totalIn = 0;
  let totalOut = 0;

  const paths = [];

  for (const filename of sources) {
    const inputPath = path.join(SOURCE_DIR, filename);
    const base = filename.replace(IMAGE_RE, "");
    const outputPath = path.join(OUTPUT_DIR, `${base}.jpg`);

    const inputStat = await stat(inputPath);
    totalIn += inputStat.size;

    await sharp(inputPath)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outputPath);

    const outputStat = await stat(outputPath);
    totalOut += outputStat.size;
    paths.push(`/assets/images/film-web/${base}.jpg`);

    console.log(
      `${filename} → ${base}.jpg (${(inputStat.size / 1024 / 1024).toFixed(1)}MB → ${(outputStat.size / 1024).toFixed(0)}KB)`,
    );
  }

  const manifestPath = path.join(ROOT, "src/data/filmWebManifest.json");
  await writeFile(manifestPath, `${JSON.stringify(paths, null, 2)}\n`);

  console.log(
    `\nDone: ${sources.length} files, ${(totalIn / 1024 / 1024).toFixed(1)}MB → ${(totalOut / 1024 / 1024).toFixed(1)}MB`,
  );
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
