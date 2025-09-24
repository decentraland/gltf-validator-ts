/**
 * Advanced TypeScript type guards for runtime type safety
 * These provide compile-time and runtime type checking for GLTF validation
 */

import {
  GLTFMaterial,
  GLTFMesh,
  GLTFAnimation,
  GLTFAccessor,
  GLTFBufferView,
  GLTFNode,
  MaterialWithExtensions,
  MeshWithExtensions,
  AnimationWithExtensions,
  ExtensionName,
  ExtensionTypeMap,
  ValidatableGLTFObject,
  JSONPointer,
  MimeType,
  Base64String,
  ImageMimeType,
  GLTFMimeType,
  GLTF_MIME_TYPES,
  IMAGE_MIME_TYPES,
  ComponentType,
  AccessorType
} from './types';

// Basic type guards
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyArray<T>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

export function isNonNegativeNumber(value: unknown): value is number {
  return isNumber(value) && value >= 0;
}

export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

export function isPositiveInteger(value: unknown): value is number {
  return isInteger(value) && value > 0;
}

export function isNonNegativeInteger(value: unknown): value is number {
  return isInteger(value) && value >= 0;
}

// Branded type constructors
export function createJSONPointer(pointer: string): JSONPointer {
  if (!pointer.startsWith('/')) {
    throw new Error(`Invalid JSON pointer: ${pointer}. Must start with '/'`);
  }
  return pointer as JSONPointer;
}

export function createMimeType(mimeType: string): MimeType {
  if (!mimeType.includes('/')) {
    throw new Error(`Invalid MIME type: ${mimeType}. Must contain '/'`);
  }
  return mimeType as MimeType;
}

export function createBase64String(base64: string): Base64String {
  try {
    atob(base64);
    return base64 as Base64String;
  } catch {
    throw new Error(`Invalid base64 string: ${base64}`);
  }
}

// GLTF component type guards
export function isGLTFMaterial(value: unknown): value is GLTFMaterial {
  if (!isObject(value)) return false;

  // Check for material-specific properties
  const material = value as Record<string, unknown>;
  return (
    // At least one material property should exist
    material['alphaMode'] !== undefined ||
    material['alphaCutoff'] !== undefined ||
    material['doubleSided'] !== undefined ||
    material['pbrMetallicRoughness'] !== undefined ||
    material['normalTexture'] !== undefined ||
    material['occlusionTexture'] !== undefined ||
    material['emissiveTexture'] !== undefined ||
    material['emissiveFactor'] !== undefined ||
    material['name'] !== undefined ||
    material['extensions'] !== undefined ||
    material['extras'] !== undefined
  );
}

export function isMaterialWithExtensions(value: unknown): value is MaterialWithExtensions {
  return isGLTFMaterial(value);
}

export function isGLTFMesh(value: unknown): value is GLTFMesh {
  if (!isObject(value)) return false;

  const mesh = value as Record<string, unknown>;
  return Array.isArray(mesh['primitives']);
}

export function isMeshWithExtensions(value: unknown): value is MeshWithExtensions {
  return isGLTFMesh(value);
}

export function isGLTFAnimation(value: unknown): value is GLTFAnimation {
  if (!isObject(value)) return false;

  const animation = value as Record<string, unknown>;
  return Array.isArray(animation['channels']) && Array.isArray(animation['samplers']);
}

export function isAnimationWithExtensions(value: unknown): value is AnimationWithExtensions {
  return isGLTFAnimation(value);
}

export function isGLTFAccessor(value: unknown): value is GLTFAccessor {
  if (!isObject(value)) return false;

  const accessor = value as Record<string, unknown>;
  return (
    isNumber(accessor['componentType']) &&
    isNumber(accessor['count']) &&
    isString(accessor['type'])
  );
}

export function isGLTFBufferView(value: unknown): value is GLTFBufferView {
  if (!isObject(value)) return false;

  const bufferView = value as Record<string, unknown>;
  return (
    isNonNegativeInteger(bufferView['buffer']) &&
    isPositiveInteger(bufferView['byteLength'])
  );
}

export function isGLTFNode(value: unknown): value is GLTFNode {
  if (!isObject(value)) return false;

  // Node can be empty or have various properties
  const node = value as Record<string, unknown>;

  // Check that if properties exist, they have correct types
  if (node['camera'] !== undefined && !isNonNegativeInteger(node['camera'])) return false;
  if (node['children'] !== undefined && !Array.isArray(node['children'])) return false;
  if (node['skin'] !== undefined && !isNonNegativeInteger(node['skin'])) return false;
  if (node['matrix'] !== undefined && (!Array.isArray(node['matrix']) || node['matrix'].length !== 16)) return false;
  if (node['mesh'] !== undefined && !isNonNegativeInteger(node['mesh'])) return false;
  if (node['rotation'] !== undefined && (!Array.isArray(node['rotation']) || node['rotation'].length !== 4)) return false;
  if (node['scale'] !== undefined && (!Array.isArray(node['scale']) || node['scale'].length !== 3)) return false;
  if (node['translation'] !== undefined && (!Array.isArray(node['translation']) || node['translation'].length !== 3)) return false;
  if (node['weights'] !== undefined && !Array.isArray(node['weights'])) return false;

  return true;
}

// Validation context type guards
export function hasExtensions(value: unknown): value is ValidatableGLTFObject & { extensions: Record<string, unknown> } {
  return isObject(value) && isObject((value as Record<string, unknown>)['extensions']);
}

// Extension type guards
export function isExtensionName(value: string): value is ExtensionName {
  const validExtensions = [
    'KHR_materials_anisotropy',
    'KHR_materials_clearcoat',
    'KHR_materials_dispersion',
    'KHR_materials_emissive_strength',
    'KHR_materials_ior',
    'KHR_materials_iridescence',
    'KHR_materials_pbrSpecularGlossiness',
    'KHR_materials_sheen',
    'KHR_materials_specular',
    'KHR_materials_transmission',
    'KHR_materials_volume',
    'KHR_texture_transform',
    'KHR_lights_punctual',
    'KHR_materials_variants'
  ] as const;

  return validExtensions.includes(value as ExtensionName);
}

export function isExtensionOfType<T extends ExtensionName>(
  extension: unknown,
  extensionName: T
): extension is ExtensionTypeMap[T] {
  if (!isObject(extension)) return false;

  // Type-specific validation based on extension name
  switch (extensionName) {
    case 'KHR_materials_anisotropy':
      return isKHRMaterialsAnisotropyExtension(extension);
    case 'KHR_materials_clearcoat':
      return isKHRMaterialsClearcoatExtension(extension);
    // Add more cases as needed
    default:
      return true; // Fallback for unknown extensions
  }
}

// Specific extension type guards
function isKHRMaterialsAnisotropyExtension(value: unknown): boolean {
  if (!isObject(value)) return false;
  const ext = value as Record<string, unknown>;

  return (
    (ext['anisotropyStrength'] === undefined || isNonNegativeNumber(ext['anisotropyStrength'])) &&
    (ext['anisotropyRotation'] === undefined || isNumber(ext['anisotropyRotation'])) &&
    (ext['anisotropyTexture'] === undefined || isObject(ext['anisotropyTexture']))
  );
}

function isKHRMaterialsClearcoatExtension(value: unknown): boolean {
  if (!isObject(value)) return false;
  const ext = value as Record<string, unknown>;

  return (
    (ext['clearcoatFactor'] === undefined || isNonNegativeNumber(ext['clearcoatFactor'])) &&
    (ext['clearcoatRoughnessFactor'] === undefined || isNonNegativeNumber(ext['clearcoatRoughnessFactor'])) &&
    (ext['clearcoatTexture'] === undefined || isObject(ext['clearcoatTexture'])) &&
    (ext['clearcoatRoughnessTexture'] === undefined || isObject(ext['clearcoatRoughnessTexture'])) &&
    (ext['clearcoatNormalTexture'] === undefined || isObject(ext['clearcoatNormalTexture']))
  );
}

// MIME type guards
export function isImageMimeType(value: string): value is ImageMimeType {
  return IMAGE_MIME_TYPES.includes(value as ImageMimeType);
}

export function isGLTFMimeType(value: string): value is GLTFMimeType {
  return GLTF_MIME_TYPES.includes(value as GLTFMimeType);
}

// Component type guards
export function isValidComponentType(value: number): value is typeof ComponentType[keyof typeof ComponentType] {
  const validTypes = [
    ComponentType.BYTE,
    ComponentType.UNSIGNED_BYTE,
    ComponentType.SHORT,
    ComponentType.UNSIGNED_SHORT,
    ComponentType.UNSIGNED_INT,
    ComponentType.FLOAT,
    ComponentType.DOUBLE
  ];
  return validTypes.includes(value as typeof ComponentType[keyof typeof ComponentType]);
}

export function isValidAccessorType(value: string): value is typeof AccessorType[keyof typeof AccessorType] {
  const validTypes = [
    AccessorType.SCALAR,
    AccessorType.VEC2,
    AccessorType.VEC3,
    AccessorType.VEC4,
    AccessorType.MAT2,
    AccessorType.MAT3,
    AccessorType.MAT4
  ];
  return validTypes.includes(value as typeof AccessorType[keyof typeof AccessorType]);
}

// Array validation helpers
export function isArrayOfType<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}

export function isNonEmptyArrayOfType<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is [T, ...T[]] {
  return isArrayOfType(value, itemGuard) && value.length > 0;
}

// Utility assertion functions
export function assertIsObject(value: unknown, context: string): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`Expected object in ${context}, got ${typeof value}`);
  }
}

export function assertIsNumber(value: unknown, context: string): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(`Expected number in ${context}, got ${typeof value}`);
  }
}

export function assertIsString(value: unknown, context: string): asserts value is string {
  if (!isString(value)) {
    throw new Error(`Expected string in ${context}, got ${typeof value}`);
  }
}