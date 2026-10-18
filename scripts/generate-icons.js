const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 计算函数
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

// 纯 JS 生成 PNG Buffer
function createPng(width, height, pixelDrawer) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1; // 1 byte filter type 0
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelDrawer(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4);
  ihdrData.copy(ihdrChunk, 8);
  ihdrChunk.writeUInt32BE(crc32(ihdrChunk.subarray(4, 21)), 21);

  // IDAT
  const idatChunk = Buffer.alloc(4 + 4 + compressedData.length + 4);
  idatChunk.writeUInt32BE(compressedData.length, 0);
  idatChunk.write('IDAT', 4);
  compressedData.copy(idatChunk, 8);
  idatChunk.writeUInt32BE(crc32(idatChunk.subarray(4, 8 + compressedData.length)), 8 + compressedData.length);

  // IEND
  const iendChunk = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 封装成标准 ICO 格式（包含 1 张 PNG）
function pngToIco(pngBuffer, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size; // width
  entry[1] = size >= 256 ? 0 : size; // height
  entry[2] = 0; // color palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(6 + 16, 12); // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

// 绘制学士帽与视频徽标逻辑
function drawIconPixel(x, y, width, height) {
  const nx = (x / width) * 2 - 1; // -1 to 1
  const ny = (y / height) * 2 - 1; // -1 to 1

  // 背景圆角矩形
  const radius = 0.82;
  const cornerR = 0.22;
  const absX = Math.abs(nx);
  const absY = Math.abs(ny);
  let inBounds = false;

  if (absX <= radius && absY <= radius) {
    if (absX > radius - cornerR && absY > radius - cornerR) {
      const dx = absX - (radius - cornerR);
      const dy = absY - (radius - cornerR);
      inBounds = dx * dx + dy * dy <= cornerR * cornerR;
    } else {
      inBounds = true;
    }
  }

  if (!inBounds) {
    return [0, 0, 0, 0]; // 透明
  }

  // 背景色: 深邃暗黑灰 (#09090b 到 #18181b 渐变)
  const bgGrad = (ny + 1) * 0.5;
  let r = Math.round(10 + bgGrad * 14);
  let g = Math.round(10 + bgGrad * 14);
  let b = Math.round(14 + bgGrad * 16);
  let a = 255;

  // 金色学士帽图案几何参数 (Cap Diamond & Base)
  // 1. 帽顶菱形 (Diamond)
  // 中心在 (0, -0.15), 宽 1.1 (半宽 0.55), 高 0.44 (半高 0.22)
  const capCenterX = 0;
  const capCenterY = -0.12;
  const dX = Math.abs(nx - capCenterX) / 0.58;
  const dY = Math.abs(ny - capCenterY) / 0.24;
  const inDiamond = (dX + dY) <= 1.0;

  // 2. 帽下沿弧形 (Cap under-skull)
  const inSkull = (
    ny >= capCenterY + 0.08 &&
    ny <= capCenterY + 0.38 &&
    Math.abs(nx) <= 0.35 &&
    (ny - capCenterY - 0.08) <= (0.35 - Math.abs(nx)) * 0.9 + 0.1
  );

  // 3. 流苏挂绳 (Tassel on right side)
  const inTassel = (
    nx >= 0.48 && nx <= 0.54 && ny >= -0.12 && ny <= 0.32
  ) || (
    nx >= 0.46 && nx <= 0.56 && ny >= 0.28 && ny <= 0.42
  );

  // 4. 播放小三角或核心亮点 (Play Button in center / Amber Gold)
  // 三角形在 (0, 0.05) 处
  const pX = nx + 0.04; // 稍微向左偏移以居中
  const pY = ny - 0.02;
  const inPlayTriangle = (
    pX >= -0.14 && pX <= 0.18 &&
    pY >= -0.16 && pY <= 0.16 &&
    (pY - 0) <= (0.18 - pX) * 0.55 &&
    (0 - pY) <= (0.18 - pX) * 0.55
  );

  if (inDiamond || inSkull || inTassel) {
    // 璀璨金色/琥珀色渐变 (#fbbf24 到 #f59e0b)
    const goldGrad = (ny + 0.4) * 0.8;
    r = Math.round(251 - goldGrad * 20);
    g = Math.round(191 - goldGrad * 40);
    b = Math.round(36 + goldGrad * 10);

    // 如果在帽顶的高光边沿
    if (dY < 0.08 && dX < 0.8) {
      r = Math.min(255, r + 40);
      g = Math.min(255, g + 40);
      b = Math.min(255, b + 60);
    }

    // 在学士帽正中挖出或高亮一个极简纯净的深邃视窗或播放三角
    if (inPlayTriangle) {
      // 纯白高亮核心，代表激活视频
      r = 255;
      g = 255;
      b = 255;
    }
  }

  // 外边框精致金属描边 (1px border)
  const isBorder = (
    absX >= radius - 0.04 || absY >= radius - 0.04
  );
  if (isBorder && inBounds) {
    r = Math.max(r, 60);
    g = Math.max(g, 60);
    b = Math.max(b, 75);
  }

  return [r, g, b, a];
}

// 主函数生成
function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating 512x512 icon.png...');
  const png512 = createPng(512, 512, drawIconPixel);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);

  console.log('Generating 192x192 icon-192.png...');
  const png192 = createPng(192, 192, drawIconPixel);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);

  console.log('Generating 180x180 apple-touch-icon.png...');
  const png180 = createPng(180, 180, drawIconPixel);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

  console.log('Generating 32x32 favicon.ico...');
  const png32 = createPng(32, 32, drawIconPixel);
  const ico32 = pngToIco(png32, 32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32);

  console.log('All icons generated successfully!');
}

main();
