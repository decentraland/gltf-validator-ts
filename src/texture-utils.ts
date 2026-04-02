import type { GLTF, GLTFTextureInfo } from "./types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface TextureImageInfo {
  imageIndex: number;
  width: number;
  height: number;
  name: string;
}

export interface TextureIssue {
  type: "not-power-of-two" | "not-square" | "layer-size-mismatch";
  message: string;
  suggestedWidth?: number;
  suggestedHeight?: number;
  materialIndex?: number;
  imageIndices?: number[];
}

export interface TextureValidationResult {
  images: TextureImageInfo[];
  issues: TextureIssue[];
}

export interface TextureValidationOptions {
  /** Function to load external resources (images/buffers) referenced by URI. */
  externalResourceFunction?: (uri: string) => Promise<Uint8Array>;
  /** Force format detection: 'glb' or 'gltf'. If omitted, auto-detected from data. */
  format?: "glb" | "gltf";
}

export type ResizeImageFunction = (
  imageData: Uint8Array,
  mimeType: string,
  targetWidth: number,
  targetHeight: number,
) => Promise<Uint8Array>;

// ── Power-of-two helpers ───────────────────────────────────────────────────

export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

export function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;
  let v = n - 1;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  return v + 1;
}

// ── Internal GLB parsing ───────────────────────────────────────────────────

const GLB_MAGIC = 0x46546c67;
const GLB_CHUNK_TYPE_JSON = 0x4e4f534a;
const GLB_CHUNK_TYPE_BIN = 0x004e4942;

interface ParsedGlb {
  gltf: GLTF;
  binChunk?: Uint8Array;
}

function parseGlbInternal(data: Uint8Array): ParsedGlb {
  if (data.length < 12) {
    throw new Error("Not a valid GLB file: too short");
  }

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const magic = view.getUint32(0, true);
  if (magic !== GLB_MAGIC) {
    throw new Error("Not a valid GLB file");
  }

  let offset = 12;
  let gltf: GLTF | undefined;
  let binChunk: Uint8Array | undefined;

  while (offset < data.length) {
    if (offset + 8 > data.length) break;
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    offset += 8;

    if (chunkType === GLB_CHUNK_TYPE_JSON) {
      const decoder = new TextDecoder();
      gltf = JSON.parse(
        decoder.decode(data.subarray(offset, offset + chunkLength)),
      );
    } else if (chunkType === GLB_CHUNK_TYPE_BIN) {
      binChunk = data.subarray(offset, offset + chunkLength);
    }

    offset += chunkLength;
  }

  if (!gltf) {
    throw new Error("GLB file has no JSON chunk");
  }

  return { gltf, binChunk };
}

function parseGltfJson(data: Uint8Array): GLTF {
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(data));
}

function isGlbData(data: Uint8Array): boolean {
  if (data.length < 4) return false;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return view.getUint32(0, true) === GLB_MAGIC;
}

// ── Image dimension reading (from binary headers) ──────────────────────────

function detectImageFormat(data: Uint8Array): string | null {
  if (data.length < 8) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "image/jpeg";
  }

  return null;
}

function getPNGDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  // 8 signature + 4 length + 4 type + 13 IHDR data + 4 CRC = min 33
  if (data.length < 24) return null;

  // IHDR starts at offset 8 (after PNG signature)
  // 4 bytes length + 4 bytes "IHDR" + width(4) + height(4)
  const width =
    (data[16]! << 24) |
    (data[17]! << 16) |
    (data[18]! << 8) |
    data[19]!;
  const height =
    (data[20]! << 24) |
    (data[21]! << 16) |
    (data[22]! << 8) |
    data[23]!;

  return { width, height };
}

function getJPEGDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  if (data.length < 4) return null;

  let offset = 2; // Skip SOI marker (FF D8)

  while (offset < data.length - 1) {
    if (data[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = data[offset + 1]!;
    offset += 2;

    // SOF markers: C0-C3
    if (marker >= 0xc0 && marker <= 0xc3) {
      if (offset + 7 <= data.length) {
        const height = (data[offset + 3]! << 8) | data[offset + 4]!;
        const width = (data[offset + 5]! << 8) | data[offset + 6]!;
        return { width, height };
      }
      break;
    }

    // Markers without data
    if (
      marker === 0xd8 ||
      marker === 0xd9 ||
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      continue;
    }

    if (offset + 2 > data.length) break;
    const segmentLength = (data[offset]! << 8) | data[offset + 1]!;
    if (segmentLength < 2) break;
    offset += segmentLength;
  }

  return null;
}

function getImageDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  const format = detectImageFormat(data);
  if (!format) return null;
  if (format === "image/png") return getPNGDimensions(data);
  if (format === "image/jpeg") return getJPEGDimensions(data);
  return null;
}

// ── Image extraction ───────────────────────────────────────────────────────

function extractImageInfos(
  gltf: GLTF,
  binChunk: Uint8Array | undefined,
  externalResourceFunction?: (uri: string) => Promise<Uint8Array>,
): Promise<TextureImageInfo[]> {
  if (!gltf.images || gltf.images.length === 0) {
    return Promise.resolve([]);
  }

  return extractImageInfosAsync(gltf, binChunk, externalResourceFunction);
}

async function extractImageInfosAsync(
  gltf: GLTF,
  binChunk: Uint8Array | undefined,
  externalResourceFunction?: (uri: string) => Promise<Uint8Array>,
): Promise<TextureImageInfo[]> {
  const images: TextureImageInfo[] = [];

  for (let i = 0; i < gltf.images!.length; i++) {
    const image = gltf.images![i]!;
    let imageData: Uint8Array | null = null;
    let name = `image ${i}`;

    if (image.uri) {
      name = image.uri;
      if (externalResourceFunction) {
        try {
          imageData = await externalResourceFunction(image.uri);
        } catch {
          continue;
        }
      } else {
        continue;
      }
    } else if (
      image.bufferView != null &&
      binChunk &&
      gltf.bufferViews
    ) {
      const bv = gltf.bufferViews[image.bufferView];
      if (bv) {
        const byteOffset = bv.byteOffset ?? 0;
        imageData = binChunk.subarray(byteOffset, byteOffset + bv.byteLength);
      }
    }

    if (!imageData) continue;

    const dims = getImageDimensions(imageData);
    if (!dims) continue;

    images.push({
      imageIndex: i,
      width: dims.width,
      height: dims.height,
      name,
    });
  }

  return images;
}

// ── Constraint validation ──────────────────────────────────────────────────

function getImageIndexForTexture(
  gltf: GLTF,
  texInfo: GLTFTextureInfo | undefined,
): number | null {
  if (!texInfo || !gltf.textures) return null;
  const tex = gltf.textures[texInfo.index];
  return tex?.source ?? null;
}

function validateConstraints(
  gltf: GLTF,
  images: TextureImageInfo[],
): TextureIssue[] {
  const issues: TextureIssue[] = [];
  const imageMap = new Map(images.map((img) => [img.imageIndex, img]));

  // Per-image checks
  for (const img of images) {
    const notPow2 = !isPowerOfTwo(img.width) || !isPowerOfTwo(img.height);
    const notSquare = img.width !== img.height;

    if (notPow2) {
      issues.push({
        type: "not-power-of-two",
        message: `"${img.name}" is ${img.width}\u00d7${img.height} (not power of two)`,
        suggestedWidth: nextPowerOfTwo(img.width),
        suggestedHeight: nextPowerOfTwo(img.height),
        imageIndices: [img.imageIndex],
      });
    }

    if (notSquare) {
      const target = Math.max(
        isPowerOfTwo(img.width) ? img.width : nextPowerOfTwo(img.width),
        isPowerOfTwo(img.height) ? img.height : nextPowerOfTwo(img.height),
      );
      issues.push({
        type: "not-square",
        message: `"${img.name}" is ${img.width}\u00d7${img.height} (not square)`,
        suggestedWidth: target,
        suggestedHeight: target,
        imageIndices: [img.imageIndex],
      });
    }
  }

  // Layer-size-mismatch checks
  if (gltf.materials && gltf.textures) {
    for (let mi = 0; mi < gltf.materials.length; mi++) {
      const material = gltf.materials[mi]!;
      const layers: { layer: string; imageIndex: number }[] = [];

      const addLayer = (
        layer: string,
        texInfo: GLTFTextureInfo | undefined,
      ) => {
        const imgIdx = getImageIndexForTexture(gltf, texInfo);
        if (imgIdx != null) layers.push({ layer, imageIndex: imgIdx });
      };

      addLayer("baseColor", material.pbrMetallicRoughness?.baseColorTexture);
      addLayer(
        "metallicRoughness",
        material.pbrMetallicRoughness?.metallicRoughnessTexture,
      );
      addLayer("normal", material.normalTexture);
      addLayer("occlusion", material.occlusionTexture);
      addLayer("emissive", material.emissiveTexture);

      if (layers.length <= 1) continue;

      const layerDims = layers
        .map((lt) => ({ ...lt, img: imageMap.get(lt.imageIndex) }))
        .filter(
          (lt): lt is typeof lt & { img: TextureImageInfo } => !!lt.img,
        );

      if (layerDims.length <= 1) continue;

      const first = layerDims[0]!.img;
      const mismatch = layerDims.some(
        (d) => d.img.width !== first.width || d.img.height !== first.height,
      );

      if (mismatch) {
        const materialName = material.name ?? `material ${mi}`;
        const sizes = layerDims
          .map(
            (d) => `${d.layer}: ${d.img.width}\u00d7${d.img.height}`,
          )
          .join(", ");
        issues.push({
          type: "layer-size-mismatch",
          message: `"${materialName}" has layers with different sizes (${sizes})`,
          materialIndex: mi,
          imageIndices: layerDims.map((d) => d.imageIndex),
        });
      }
    }
  }

  return issues;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Validate textures in a GLB or glTF model.
 *
 * Parses the file, extracts image dimensions from binary headers (PNG/JPEG),
 * and checks for: non-power-of-two dimensions, non-square textures, and
 * layer-size mismatches within materials.
 */
export async function validateTextures(
  data: Uint8Array,
  options?: TextureValidationOptions,
): Promise<TextureValidationResult> {
  let gltf: GLTF;
  let binChunk: Uint8Array | undefined;

  const format = options?.format ?? (isGlbData(data) ? "glb" : "gltf");

  if (format === "glb") {
    const parsed = parseGlbInternal(data);
    gltf = parsed.gltf;
    binChunk = parsed.binChunk;
  } else {
    gltf = parseGltfJson(data);
  }

  if (!gltf.images || gltf.images.length === 0) {
    return { images: [], issues: [] };
  }

  const images = await extractImageInfos(
    gltf,
    binChunk,
    options?.externalResourceFunction,
  );
  const issues = validateConstraints(gltf, images);

  return { images, issues };
}

/**
 * Fix textures in a GLB file by resizing embedded images.
 *
 * The actual image resizing is delegated to the caller-provided `resizeImage`
 * function, keeping this library platform-agnostic (browser, Node, etc.).
 *
 * Returns a new ArrayBuffer with the rebuilt GLB.
 */
export async function fixGlbTextures(
  data: Uint8Array,
  images: TextureImageInfo[],
  issues: TextureIssue[],
  resizeImage: ResizeImageFunction,
): Promise<ArrayBuffer> {
  const { gltf, binChunk } = parseGlbInternal(data);
  if (!binChunk || !gltf.images || !gltf.bufferViews) {
    return data.buffer as ArrayBuffer;
  }

  // Pre-compute target size per image
  const targetSizeByImage = new Map<number, number>();

  for (const issue of issues) {
    if (issue.type === "not-power-of-two" || issue.type === "not-square") {
      for (const idx of issue.imageIndices ?? []) {
        const img = images.find((i) => i.imageIndex === idx);
        if (!img) continue;
        const target = Math.max(
          nextPowerOfTwo(img.width),
          nextPowerOfTwo(img.height),
        );
        const existing = targetSizeByImage.get(idx) ?? 0;
        if (target > existing) targetSizeByImage.set(idx, target);
      }
    }
    if (issue.type === "layer-size-mismatch") {
      let groupTarget = 0;
      for (const idx of issue.imageIndices ?? []) {
        const img = images.find((i) => i.imageIndex === idx);
        if (img) {
          const target = Math.max(
            nextPowerOfTwo(img.width),
            nextPowerOfTwo(img.height),
          );
          if (target > groupTarget) groupTarget = target;
        }
      }
      for (const idx of issue.imageIndices ?? []) {
        const existing = targetSizeByImage.get(idx) ?? 0;
        if (groupTarget > existing) targetSizeByImage.set(idx, groupTarget);
      }
    }
  }

  if (targetSizeByImage.size === 0) return data.buffer as ArrayBuffer;

  // Resize affected images
  const imageReplacements = new Map<number, Uint8Array>();

  for (const [idx, targetSize] of targetSizeByImage) {
    const image = gltf.images[idx]!;
    if (image.bufferView == null) continue;

    const bv = gltf.bufferViews[image.bufferView];
    if (!bv) continue;

    const byteOffset = bv.byteOffset ?? 0;
    const originalData = binChunk.subarray(
      byteOffset,
      byteOffset + bv.byteLength,
    );
    const img = images.find((i) => i.imageIndex === idx);
    if (!img) continue;
    if (targetSize === img.width && targetSize === img.height) continue;

    const resized = await resizeImage(
      originalData,
      image.mimeType || "image/png",
      targetSize,
      targetSize,
    );
    imageReplacements.set(idx, resized);
  }

  if (imageReplacements.size === 0) return data.buffer as ArrayBuffer;

  return rebuildGlb(gltf, binChunk, imageReplacements);
}

// ── GLB rebuild ────────────────────────────────────────────────────────────

function rebuildGlb(
  gltfOriginal: GLTF,
  originalBin: Uint8Array,
  imageReplacements: Map<number, Uint8Array>,
): ArrayBuffer {
  const gltf = structuredClone(gltfOriginal);
  if (!gltf.images || !gltf.bufferViews) {
    throw new Error("Cannot rebuild GLB without images and bufferViews");
  }

  const segments: Uint8Array[] = [];

  // Sort bufferViews by byteOffset to reconstruct BIN in order
  const bvEntries = gltf
    .bufferViews!.map((bv, i) => ({ bv, index: i }))
    .sort((a, b) => (a.bv.byteOffset ?? 0) - (b.bv.byteOffset ?? 0));

  // image index → bufferView index
  const imageBvMap = new Map<number, number>();
  for (let i = 0; i < gltf.images.length; i++) {
    const img = gltf.images[i]!;
    if (img.bufferView != null) {
      imageBvMap.set(i, img.bufferView);
    }
  }

  // Reverse: bufferView index → image index
  const bvToImage = new Map<number, number>();
  for (const [imgIdx, bvIdx] of imageBvMap) {
    bvToImage.set(bvIdx, imgIdx);
  }

  let currentOffset = 0;
  for (const { bv, index } of bvEntries) {
    const origOffset = bv.byteOffset ?? 0;
    const imgIdx = bvToImage.get(index);

    let segData: Uint8Array;
    if (imgIdx != null && imageReplacements.has(imgIdx)) {
      segData = imageReplacements.get(imgIdx)!;
    } else {
      segData = originalBin.subarray(origOffset, origOffset + bv.byteLength);
    }

    bv.byteOffset = currentOffset;
    bv.byteLength = segData.length;

    segments.push(segData);
    currentOffset += segData.length;

    // Align to 4 bytes
    const padding = (4 - (currentOffset % 4)) % 4;
    if (padding > 0) {
      segments.push(new Uint8Array(padding));
      currentOffset += padding;
    }
  }

  // Update buffer length
  if (gltf.buffers && gltf.buffers.length > 0) {
    gltf.buffers[0]!.byteLength = currentOffset;
  }

  // Encode JSON chunk (padded to 4-byte alignment with spaces)
  const encoder = new TextEncoder();
  let jsonStr = JSON.stringify(gltf);
  const jsonPadding = (4 - (jsonStr.length % 4)) % 4;
  jsonStr += " ".repeat(jsonPadding);
  const jsonData = encoder.encode(jsonStr);

  // Build BIN chunk
  const binData = new Uint8Array(currentOffset);
  let writeOffset = 0;
  for (const seg of segments) {
    binData.set(seg, writeOffset);
    writeOffset += seg.length;
  }

  // Assemble GLB
  const totalLength = 12 + 8 + jsonData.length + 8 + binData.length;
  const glb = new ArrayBuffer(totalLength);
  const view = new DataView(glb);
  const output = new Uint8Array(glb);

  // Header
  view.setUint32(0, GLB_MAGIC, true);
  view.setUint32(4, 2, true); // version
  view.setUint32(8, totalLength, true);

  // JSON chunk
  let offset = 12;
  view.setUint32(offset, jsonData.length, true);
  view.setUint32(offset + 4, GLB_CHUNK_TYPE_JSON, true);
  output.set(jsonData, offset + 8);
  offset += 8 + jsonData.length;

  // BIN chunk
  view.setUint32(offset, binData.length, true);
  view.setUint32(offset + 4, GLB_CHUNK_TYPE_BIN, true);
  output.set(binData, offset + 8);

  return glb;
}
