/**
 * Аккуратная обработка фото каталога:
 * 1) rotate + alpha
 * 2) только очистка цветной полупрозрачной каймы (fringe Fliben)
 * 3) webp
 *
 * Не трогаем непрозрачные пиксели продукта — без flood-fill и без «дыр».
 */
import sharp from "sharp";

/**
 * Убирает цветной soft-matte fringe, не меняя opaque тело товара.
 * @param {Buffer} data RGBA
 * @param {number} width
 * @param {number} height
 */
function cleanColorFringe(data, width, height) {
  const out = Buffer.from(data);
  const n = width * height;

  for (let p = 0; p < n; p++) {
    const i = p * 4;
    const a = data[i + 3];
    if (a === 0 || a === 255) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const avg = (r + g + b) / 3;

    // Почти прозрачное — всегда убираем (антиалиас/кайма)
    if (a < 88) {
      out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
      continue;
    }

    // Цветная кайма (mint/cyan/green glow), не серая тень
    const isColorFringe =
      chroma >= 22 &&
      a < 230 &&
      (g >= r + 10 || (b >= r + 10 && g >= r + 6)) &&
      avg > 35 &&
      avg < 210;

    if (isColorFringe) {
      out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
    }
  }

  return out;
}

/**
 * @param {Buffer} input
 * @returns {Promise<Buffer>}
 */
export async function processCatalogProductImage(input) {
  const { data, info } = await sharp(input, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cleaned = cleanColorFringe(data, info.width, info.height);

  return sharp(cleaned, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 88, effort: 4 })
    .toBuffer();
}
