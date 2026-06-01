import { describe, it, expect } from "vitest";
import {
  isPowerOfTwo,
  nextPowerOfTwo,
  validateTextures,
  fixGlbTextures,
} from "../../../src/texture-utils";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Create a minimal valid PNG with given dimensions (no actual pixel data). */
function createMinimalPNG(width: number, height: number): Uint8Array {
  // PNG signature (8 bytes) + IHDR chunk (25 bytes) + IEND chunk (12 bytes) = 45 bytes
  const png = new Uint8Array(45);

  // PNG signature
  png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);

  // IHDR chunk: length=13, type=IHDR, data, CRC
  const ihdrLength = 13;
  png[8] = 0;
  png[9] = 0;
  png[10] = 0;
  png[11] = ihdrLength;
  // "IHDR"
  png[12] = 0x49;
  png[13] = 0x48;
  png[14] = 0x44;
  png[15] = 0x52;
  // Width (4 bytes big-endian)
  png[16] = (width >> 24) & 0xff;
  png[17] = (width >> 16) & 0xff;
  png[18] = (width >> 8) & 0xff;
  png[19] = width & 0xff;
  // Height (4 bytes big-endian)
  png[20] = (height >> 24) & 0xff;
  png[21] = (height >> 16) & 0xff;
  png[22] = (height >> 8) & 0xff;
  png[23] = height & 0xff;
  // Bit depth, color type, compression, filter, interlace
  png[24] = 8; // bit depth
  png[25] = 2; // color type (RGB)
  png[26] = 0; // compression
  png[27] = 0; // filter
  png[28] = 0; // interlace
  // CRC (4 bytes, dummy)
  png[29] = 0;
  png[30] = 0;
  png[31] = 0;
  png[32] = 0;

  // IEND chunk: length=0, type=IEND, CRC
  png[33] = 0;
  png[34] = 0;
  png[35] = 0;
  png[36] = 0;
  // "IEND"
  png[37] = 0x49;
  png[38] = 0x45;
  png[39] = 0x4e;
  png[40] = 0x44;
  // CRC (dummy)
  png[41] = 0;
  png[42] = 0;
  png[43] = 0;
  png[44] = 0;

  return png;
}

/** Build a GLB with embedded PNG images. */
function buildGlb(gltfJson: object, binData?: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  let jsonStr = JSON.stringify(gltfJson);
  const jsonPadding = (4 - (jsonStr.length % 4)) % 4;
  jsonStr += " ".repeat(jsonPadding);
  const jsonBytes = encoder.encode(jsonStr);

  const hasBin = binData && binData.length > 0;
  const binPadding = hasBin ? (4 - (binData.length % 4)) % 4 : 0;
  const binChunkSize = hasBin ? binData.length + binPadding : 0;

  const totalLength =
    12 + 8 + jsonBytes.length + (hasBin ? 8 + binChunkSize : 0);
  const glb = new Uint8Array(totalLength);
  const view = new DataView(glb.buffer);

  // Header
  view.setUint32(0, 0x46546c67, true); // magic
  view.setUint32(4, 2, true); // version
  view.setUint32(8, totalLength, true);

  // JSON chunk
  let offset = 12;
  view.setUint32(offset, jsonBytes.length, true);
  view.setUint32(offset + 4, 0x4e4f534a, true); // JSON
  glb.set(jsonBytes, offset + 8);
  offset += 8 + jsonBytes.length;

  // BIN chunk
  if (hasBin) {
    view.setUint32(offset, binChunkSize, true);
    view.setUint32(offset + 4, 0x004e4942, true); // BIN
    glb.set(binData, offset + 8);
  }

  return glb;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("isPowerOfTwo", () => {
  it("should return true for powers of two", () => {
    expect(isPowerOfTwo(1)).toBe(true);
    expect(isPowerOfTwo(2)).toBe(true);
    expect(isPowerOfTwo(4)).toBe(true);
    expect(isPowerOfTwo(256)).toBe(true);
    expect(isPowerOfTwo(512)).toBe(true);
    expect(isPowerOfTwo(1024)).toBe(true);
    expect(isPowerOfTwo(2048)).toBe(true);
    expect(isPowerOfTwo(4096)).toBe(true);
  });

  it("should return false for non-powers of two", () => {
    expect(isPowerOfTwo(0)).toBe(false);
    expect(isPowerOfTwo(3)).toBe(false);
    expect(isPowerOfTwo(5)).toBe(false);
    expect(isPowerOfTwo(100)).toBe(false);
    expect(isPowerOfTwo(1023)).toBe(false);
  });

  it("should return false for negative numbers", () => {
    expect(isPowerOfTwo(-1)).toBe(false);
    expect(isPowerOfTwo(-256)).toBe(false);
  });
});

describe("nextPowerOfTwo", () => {
  it("should return same value for powers of two", () => {
    expect(nextPowerOfTwo(1)).toBe(1);
    expect(nextPowerOfTwo(2)).toBe(2);
    expect(nextPowerOfTwo(256)).toBe(256);
    expect(nextPowerOfTwo(1024)).toBe(1024);
  });

  it("should return next power of two", () => {
    expect(nextPowerOfTwo(3)).toBe(4);
    expect(nextPowerOfTwo(5)).toBe(8);
    expect(nextPowerOfTwo(100)).toBe(128);
    expect(nextPowerOfTwo(500)).toBe(512);
    expect(nextPowerOfTwo(1023)).toBe(1024);
    expect(nextPowerOfTwo(1025)).toBe(2048);
  });

  it("should handle edge cases", () => {
    expect(nextPowerOfTwo(0)).toBe(1);
    expect(nextPowerOfTwo(-5)).toBe(1);
  });
});

describe("validateTextures", () => {
  it("should return empty result for GLB without images", async () => {
    const glb = buildGlb({ asset: { version: "2.0" } });
    const result = await validateTextures(glb);
    expect(result.images).toHaveLength(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should detect non-power-of-two dimensions", async () => {
    const png = createMinimalPNG(100, 100);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    const result = await validateTextures(glb);

    expect(result.images).toHaveLength(1);
    expect(result.images[0]!.width).toBe(100);
    expect(result.images[0]!.height).toBe(100);

    const npotIssue = result.issues.find(
      (i) => i.type === "not-power-of-two",
    );
    expect(npotIssue).toBeDefined();
    expect(npotIssue!.suggestedWidth).toBe(128);
    expect(npotIssue!.suggestedHeight).toBe(128);
  });

  it("should detect non-square textures", async () => {
    const png = createMinimalPNG(256, 512);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    const result = await validateTextures(glb);

    const squareIssue = result.issues.find((i) => i.type === "not-square");
    expect(squareIssue).toBeDefined();
    expect(squareIssue!.suggestedWidth).toBe(512);
    expect(squareIssue!.suggestedHeight).toBe(512);
  });

  it("should not report issues for valid square PoT textures", async () => {
    const png = createMinimalPNG(256, 256);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    const result = await validateTextures(glb);

    expect(result.images).toHaveLength(1);
    expect(result.issues).toHaveLength(0);
  });

  it("should detect layer-size-mismatch", async () => {
    const png256 = createMinimalPNG(256, 256);
    const png512 = createMinimalPNG(512, 512);

    // Pad png256 to 4-byte alignment
    const png256Padded = png256.length + ((4 - (png256.length % 4)) % 4);

    const binData = new Uint8Array(png256Padded + png512.length);
    binData.set(png256, 0);
    binData.set(png512, png256Padded);

    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [
          { bufferView: 0, mimeType: "image/png" },
          { bufferView: 1, mimeType: "image/png" },
        ],
        textures: [{ source: 0 }, { source: 1 }],
        materials: [
          {
            name: "TestMat",
            pbrMetallicRoughness: {
              baseColorTexture: { index: 0 },
              metallicRoughnessTexture: { index: 1 },
            },
          },
        ],
        bufferViews: [
          { buffer: 0, byteOffset: 0, byteLength: png256.length },
          { buffer: 0, byteOffset: png256Padded, byteLength: png512.length },
        ],
        buffers: [{ byteLength: binData.length }],
      },
      binData,
    );

    const result = await validateTextures(glb);

    const mismatch = result.issues.find(
      (i) => i.type === "layer-size-mismatch",
    );
    expect(mismatch).toBeDefined();
    expect(mismatch!.materialIndex).toBe(0);
    expect(mismatch!.imageIndices).toContain(0);
    expect(mismatch!.imageIndices).toContain(1);
  });

  it("should auto-detect GLB format from magic bytes", async () => {
    const png = createMinimalPNG(256, 256);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    // No format option — should auto-detect
    const result = await validateTextures(glb);
    expect(result.images).toHaveLength(1);
  });

  it("should support external images via externalResourceFunction", async () => {
    const png = createMinimalPNG(100, 200);
    const gltfJson = JSON.stringify({
      asset: { version: "2.0" },
      images: [{ uri: "texture.png" }],
    });
    const data = new TextEncoder().encode(gltfJson);

    const result = await validateTextures(data, {
      format: "gltf",
      externalResourceFunction: async () => png,
    });

    expect(result.images).toHaveLength(1);
    expect(result.images[0]!.width).toBe(100);
    expect(result.images[0]!.height).toBe(200);
    expect(result.images[0]!.name).toBe("texture.png");

    const npot = result.issues.find((i) => i.type === "not-power-of-two");
    expect(npot).toBeDefined();
  });
});

describe("fixGlbTextures", () => {
  it("should return original buffer when no issues to fix", async () => {
    const png = createMinimalPNG(256, 256);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    const result = await fixGlbTextures(glb, [], [], async () => {
      throw new Error("should not be called");
    });

    expect(result).toBeDefined();
  });

  it("should call resizeImage with correct parameters", async () => {
    const png = createMinimalPNG(100, 100);
    const glb = buildGlb(
      {
        asset: { version: "2.0" },
        images: [{ bufferView: 0, mimeType: "image/png" }],
        bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: png.length }],
        buffers: [{ byteLength: png.length }],
      },
      png,
    );

    const images = [{ imageIndex: 0, width: 100, height: 100, name: "image 0" }];
    const issues = [
      {
        type: "not-power-of-two" as const,
        message: "test",
        suggestedWidth: 128,
        suggestedHeight: 128,
        imageIndices: [0],
      },
    ];

    let calledWith: {
      mimeType: string;
      targetWidth: number;
      targetHeight: number;
    } | null = null;

    const resizedPng = createMinimalPNG(128, 128);

    const result = await fixGlbTextures(
      glb,
      images,
      issues,
      async (_data, mimeType, targetWidth, targetHeight) => {
        calledWith = { mimeType, targetWidth, targetHeight };
        return resizedPng;
      },
    );

    expect(calledWith).not.toBeNull();
    expect(calledWith!.mimeType).toBe("image/png");
    expect(calledWith!.targetWidth).toBe(128);
    expect(calledWith!.targetHeight).toBe(128);

    // Result should be a valid GLB
    const rebuilt = new Uint8Array(result);
    const view = new DataView(rebuilt.buffer);
    expect(view.getUint32(0, true)).toBe(0x46546c67); // GLB magic
  });
});
