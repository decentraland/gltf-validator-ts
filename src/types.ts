// Severity levels
export enum Severity {
  ERROR = 0,
  WARNING = 1,
  INFO = 2,
  HINT = 3
}

// Validation message structure
export interface ValidationMessage {
  code: string;
  message: string;
  severity: Severity;
  pointer?: string;
  offset?: number;
}

// Issues summary
export interface Issues {
  numErrors: number;
  numWarnings: number;
  numInfos: number;
  numHints: number;
  messages: ValidationMessage[];
  truncated: boolean;
}

// Resource information
export interface Resource {
  pointer: string;
  mimeType: string;
  storage?: 'external' | 'data-uri' | 'glb';
  uri?: string;
  byteLength?: number;
}

// Validation info
export interface ValidationInfo {
  version: string;
  resources?: Resource[];
  animationCount: number;
  materialCount: number;
  hasMorphTargets: boolean;
  hasSkins: boolean;
  hasTextures: boolean;
  hasDefaultScene: boolean;
  drawCallCount: number;
  totalVertexCount: number;
  totalTriangleCount: number;
  maxUVs: number;
  maxInfluences: number;
  maxAttributes: number;
}

// Main validation result
export interface ValidationResult {
  uri: string;
  mimeType: string;
  validatorVersion: string;
  issues: Issues;
  info: ValidationInfo;
}

// Validation options
export interface ValidationOptions {
  uri?: string;
  format?: 'gltf' | 'glb';
  maxIssues?: number;
  ignoredIssues?: string[];
  onlyIssues?: string[];
  severityOverrides?: Record<string, Severity>;
  externalResourceFunction?: (uri: string) => Promise<Uint8Array>;
}

// GLTF JSON structure types
export interface GLTFAsset {
  version: string;
  minVersion?: string;
  generator?: string;
  copyright?: string;
  [key: string]: unknown;
}

export interface GLTFBuffer {
  uri?: string;
  byteLength: number;
  [key: string]: unknown;
}

export interface GLTFBufferView {
  buffer: number;
  byteOffset?: number;
  byteLength: number;
  byteStride?: number;
  target?: number;
  [key: string]: unknown;
}

export interface GLTFAccessor {
  bufferView?: number;
  byteOffset?: number;
  componentType: number;
  normalized?: boolean;
  count: number;
  type: string;
  max?: number[];
  min?: number[];
  sparse?: GLTFSparse;
  [key: string]: unknown;
}

export interface GLTFSparse {
  count: number;
  indices: GLTFSparseIndices;
  values: GLTFSparseValues;
}

export interface GLTFSparseIndices {
  bufferView: number;
  byteOffset?: number;
  componentType: number;
}

export interface GLTFSparseValues {
  bufferView: number;
  byteOffset?: number;
}

export interface GLTFAnimation {
  channels: GLTFAnimationChannel[];
  samplers: GLTFAnimationSampler[];
  [key: string]: unknown;
}

export interface GLTFAnimationChannel {
  sampler: number;
  target: GLTFAnimationTarget;
  [key: string]: unknown;
}

export interface GLTFAnimationTarget {
  node?: number;
  path: string;
  [key: string]: unknown;
}

export interface GLTFAnimationSampler {
  input: number;
  output: number;
  interpolation?: string;
  [key: string]: unknown;
}

export interface GLTFNode {
  camera?: number;
  children?: number[];
  skin?: number;
  matrix?: number[];
  mesh?: number;
  rotation?: number[];
  scale?: number[];
  translation?: number[];
  weights?: number[];
  [key: string]: unknown;
}

export interface GLTFMesh {
  primitives: GLTFMeshPrimitive[];
  weights?: number[];
  [key: string]: unknown;
}

export interface GLTFMeshPrimitive {
  attributes: Record<string, number>;
  indices?: number;
  material?: number;
  mode?: number;
  targets?: Record<string, number>[];
  [key: string]: unknown;
}

export interface GLTFMaterial {
  name?: string;
  doubleSided?: boolean;
  alphaMode?: string;
  alphaCutoff?: number;
  pbrMetallicRoughness?: GLTFPBRMetallicRoughness;
  normalTexture?: GLTFTextureInfo;
  occlusionTexture?: GLTFTextureInfo;
  emissiveTexture?: GLTFTextureInfo;
  emissiveFactor?: number[];
  [key: string]: unknown;
}

export interface GLTFPBRMetallicRoughness {
  baseColorFactor?: number[];
  baseColorTexture?: GLTFTextureInfo;
  metallicFactor?: number;
  roughnessFactor?: number;
  metallicRoughnessTexture?: GLTFTextureInfo;
  [key: string]: unknown;
}

export interface GLTFTextureInfo {
  index: number;
  texCoord?: number;
  [key: string]: unknown;
}

export interface GLTFTexture {
  source?: number;
  sampler?: number;
  [key: string]: unknown;
}

export interface GLTFImage {
  uri?: string;
  mimeType?: string;
  bufferView?: number;
  [key: string]: unknown;
}

export interface GLTFSampler {
  magFilter?: number;
  minFilter?: number;
  wrapS?: number;
  wrapT?: number;
  [key: string]: unknown;
}

export interface GLTFCamera {
  orthographic?: GLTFOrthographic;
  perspective?: GLTFPerspective;
  type: string;
  [key: string]: unknown;
}

export interface GLTFOrthographic {
  xmag: number;
  ymag: number;
  zfar: number;
  znear: number;
}

export interface GLTFPerspective {
  aspectRatio?: number;
  yfov: number;
  zfar?: number;
  znear: number;
}

export interface GLTFScene {
  nodes?: number[];
  [key: string]: unknown;
}

export interface GLTFSkin {
  inverseBindMatrices?: number;
  skeleton?: number;
  joints: number[];
  [key: string]: unknown;
}

// Main GLTF structure
export interface GLTF {
  asset: GLTFAsset;
  scene?: number;
  scenes?: GLTFScene[];
  nodes?: GLTFNode[];
  materials?: GLTFMaterial[];
  accessors?: GLTFAccessor[];
  animations?: GLTFAnimation[];
  buffers?: GLTFBuffer[];
  bufferViews?: GLTFBufferView[];
  cameras?: GLTFCamera[];
  images?: GLTFImage[];
  meshes?: GLTFMesh[];
  samplers?: GLTFSampler[];
  skins?: GLTFSkin[];
  textures?: GLTFTexture[];
  extensions?: Record<string, unknown>;
  extras?: unknown;
  [key: string]: unknown;
}

// GLB header structure
export interface GLBHeader {
  magic: number;
  version: number;
  length: number;
}

export interface GLBChunk {
  length: number;
  type: number;
  data: Uint8Array;
}

// Component type constants
export const ComponentType = {
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  DOUBLE: 5130
} as const;

// Accessor type constants
export const AccessorType = {
  SCALAR: 'SCALAR',
  VEC2: 'VEC2',
  VEC3: 'VEC3',
  VEC4: 'VEC4',
  MAT2: 'MAT2',
  MAT3: 'MAT3',
  MAT4: 'MAT4'
} as const;

// Animation path constants
export const AnimationPath = {
  TRANSLATION: 'translation',
  ROTATION: 'rotation',
  SCALE: 'scale',
  WEIGHTS: 'weights'
} as const;

// Animation interpolation constants
export const AnimationInterpolation = {
  LINEAR: 'LINEAR',
  STEP: 'STEP',
  CUBICSPLINE: 'CUBICSPLINE'
} as const;

// Material alpha mode constants
export const AlphaMode = {
  OPAQUE: 'OPAQUE',
  MASK: 'MASK',
  BLEND: 'BLEND'
} as const;

// Primitive mode constants
export const PrimitiveMode = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
} as const;

// Filter constants
export const Filter = {
  NEAREST: 9728,
  LINEAR: 9729,
  NEAREST_MIPMAP_NEAREST: 9984,
  LINEAR_MIPMAP_NEAREST: 9985,
  NEAREST_MIPMAP_LINEAR: 9986,
  LINEAR_MIPMAP_LINEAR: 9987
} as const;

// Wrap mode constants
export const WrapMode = {
  CLAMP_TO_EDGE: 33071,
  MIRRORED_REPEAT: 33648,
  REPEAT: 10497
} as const;

// Camera type constants
export const CameraType = {
  PERSPECTIVE: 'perspective',
  ORTHOGRAPHIC: 'orthographic'
} as const;

// Extension-related utility types
export interface ExtensionObject {
  [extensionName: string]: unknown;
}

export interface TextureInfo {
  index: number;
  texCoord?: number;
  extensions?: ExtensionObject;
  extras?: unknown;
  [key: string]: unknown;
}

export interface MaterialExtension {
  [key: string]: unknown;
}

export interface GLTFWithExtensions extends GLTF {
  extensions?: ExtensionObject;
}

// Parsing and validation helper types
export interface ParsedJSON {
  [key: string]: unknown;
}

export interface ValidationContext {
  gltf: GLTF;
  isGLB: boolean;
  resources: Resource[];
}

export interface ResourceReference {
  pointer: string;
  mimeType?: string;
  storage?: 'external' | 'data-uri' | 'glb';
  uri?: string;
  byteLength?: number;
}

// GLTF with explicit definition tracking for parsing
export interface GLTFWithExplicitDefinitions extends GLTF {
  _explicitlyDefined?: {
    scenes?: boolean;
    nodes?: boolean;
    materials?: boolean;
    accessors?: boolean;
    animations?: boolean;
    buffers?: boolean;
    bufferViews?: boolean;
    cameras?: boolean;
    images?: boolean;
    meshes?: boolean;
    samplers?: boolean;
    skins?: boolean;
    textures?: boolean;
  };
}

// Collection validation helper interface
export interface GLTFCollection {
  name: string;
  array: unknown[];
}

// Validation-specific interfaces for typed object handling
export interface ValidatableGLTFObject {
  [key: string]: unknown;
}

export interface GLTFWithExtensions extends ValidatableGLTFObject {
  extensions?: Record<string, unknown>;
  extras?: unknown;
}

export interface TextureInfoWithExtensions extends GLTFWithExtensions {
  index: number;
  texCoord?: number;
}

export interface MaterialWithExtensions extends GLTFMaterial, GLTFWithExtensions {
  pbrMetallicRoughness?: PBRMetallicRoughnessWithExtensions;
  normalTexture?: TextureInfoWithExtensions;
  occlusionTexture?: TextureInfoWithExtensions;
  emissiveTexture?: TextureInfoWithExtensions;
}

export interface PBRMetallicRoughnessWithExtensions extends GLTFPBRMetallicRoughness, GLTFWithExtensions {
  baseColorTexture?: TextureInfoWithExtensions;
  metallicRoughnessTexture?: TextureInfoWithExtensions;
}

export interface MeshPrimitiveWithExtensions extends GLTFMeshPrimitive, GLTFWithExtensions {
  attributes: Record<string, number>;
  targets?: Record<string, number>[];
}

export interface MeshWithExtensions extends GLTFMesh, GLTFWithExtensions {
  primitives: MeshPrimitiveWithExtensions[];
}

export interface AnimationChannelWithExtensions extends GLTFAnimationChannel, GLTFWithExtensions {
  sampler: number;
  target: GLTFAnimationTarget;
}

export interface AnimationSamplerWithExtensions extends GLTFAnimationSampler, GLTFWithExtensions {
  input: number;
  output: number;
  interpolation?: string;
}

export interface AnimationWithExtensions extends GLTFAnimation, GLTFWithExtensions {
  channels: AnimationChannelWithExtensions[];
  samplers: AnimationSamplerWithExtensions[];
}

// Accessor validation interfaces
export interface AccessorForValidation extends GLTFAccessor {
  bufferView?: number;
  byteOffset?: number;
  componentType: number;
  count: number;
  type: string;
}

// Extension-specific types
export interface KHRLightsPunctualExtension {
  lights: LightDefinition[];
}

// Material extension interfaces
export interface KHRMaterialsAnisotropyExtension extends ValidatableGLTFObject {
  anisotropyStrength?: number;
  anisotropyRotation?: number;
  anisotropyTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsClearcoatExtension extends ValidatableGLTFObject {
  clearcoatFactor?: number;
  clearcoatTexture?: TextureInfoWithExtensions;
  clearcoatRoughnessFactor?: number;
  clearcoatRoughnessTexture?: TextureInfoWithExtensions;
  clearcoatNormalTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsDispersionExtension extends ValidatableGLTFObject {
  dispersion?: number;
}

export interface KHRMaterialsEmissiveStrengthExtension extends ValidatableGLTFObject {
  emissiveStrength?: number;
}

export interface KHRMaterialsIORExtension extends ValidatableGLTFObject {
  ior?: number;
}

export interface KHRMaterialsIridescenceExtension extends ValidatableGLTFObject {
  iridescenceFactor?: number;
  iridescenceTexture?: TextureInfoWithExtensions;
  iridescenceIor?: number;
  iridescenceThicknessMinimum?: number;
  iridescenceThicknessMaximum?: number;
  iridescenceThicknessTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsPbrSpecularGlossinessExtension extends ValidatableGLTFObject {
  diffuseFactor?: number[];
  diffuseTexture?: TextureInfoWithExtensions;
  specularFactor?: number[];
  glossinessFactor?: number;
  specularGlossinessTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsSheenExtension extends ValidatableGLTFObject {
  sheenColorFactor?: number[];
  sheenColorTexture?: TextureInfoWithExtensions;
  sheenRoughnessFactor?: number;
  sheenRoughnessTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsSpecularExtension extends ValidatableGLTFObject {
  specularFactor?: number;
  specularTexture?: TextureInfoWithExtensions;
  specularColorFactor?: number[];
  specularColorTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsTransmissionExtension extends ValidatableGLTFObject {
  transmissionFactor?: number;
  transmissionTexture?: TextureInfoWithExtensions;
}

export interface KHRMaterialsVolumeExtension extends ValidatableGLTFObject {
  thicknessFactor?: number;
  thicknessTexture?: TextureInfoWithExtensions;
  attenuationDistance?: number;
  attenuationColor?: number[];
}

export interface KHRTextureTransformExtension extends ValidatableGLTFObject {
  offset?: number[];
  rotation?: number;
  scale?: number[];
  texCoord?: number;
}

// Sparse accessor interfaces
export interface GLTFSparseForValidation extends GLTFSparse {
  count: number;
  indices: GLTFSparseIndices;
  values: GLTFSparseValues;
}

export type ValidatedGLTF = GLTF & { readonly __validated: true };
export type JSONPointer = string & { readonly __jsonPointer: true };
export type MimeType = string & { readonly __mimeType: true };
export type Base64String = string & { readonly __base64: true };

// Advanced utility types
export type NonEmptyArray<T> = [T, ...T[]];
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[] ? DeepReadonly<U>[] :
                           T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> :
                           T[P];
};

// Template literal types for JSON pointers
export type GLTFRootPointer = `/${GLTFTopLevelProperty}`;
export type GLTFArrayPointer<T extends string> = `/${T}/${number}`;
export type GLTFPropertyPointer<T extends string, P extends string> = `/${T}/${number}/${P}`;

export type GLTFTopLevelProperty =
  | 'accessors' | 'animations' | 'asset' | 'buffers' | 'bufferViews'
  | 'cameras' | 'images' | 'materials' | 'meshes' | 'nodes'
  | 'samplers' | 'scene' | 'scenes' | 'skins' | 'textures'
  | 'extensions' | 'extras';

// Conditional types for validation
export type ValidationTarget<T> = T extends GLTFMaterial ? MaterialValidationContext :
                                  T extends GLTFMesh ? MeshValidationContext :
                                  T extends GLTFAnimation ? AnimationValidationContext :
                                  T extends GLTFAccessor ? AccessorValidationContext :
                                  BaseValidationContext;

export interface BaseValidationContext {
  readonly gltf: GLTF;
  readonly index: number;
  readonly pointer: JSONPointer;
}

export interface MaterialValidationContext extends BaseValidationContext {
  readonly material: MaterialWithExtensions;
  readonly requiredExtensions: readonly string[];
}

export interface MeshValidationContext extends BaseValidationContext {
  readonly mesh: MeshWithExtensions;
  readonly primitiveCount: number;
}

export interface AnimationValidationContext extends BaseValidationContext {
  readonly animation: AnimationWithExtensions;
  readonly channelCount: number;
  readonly samplerCount: number;
}

export interface AccessorValidationContext extends BaseValidationContext {
  readonly accessor: AccessorForValidation;
  readonly bufferView?: GLTFBufferView;
}

// Strict extension validation types
export type ExtensionName = keyof ExtensionTypeMap;
export interface ExtensionTypeMap {
  'KHR_materials_anisotropy': KHRMaterialsAnisotropyExtension;
  'KHR_materials_clearcoat': KHRMaterialsClearcoatExtension;
  'KHR_materials_dispersion': KHRMaterialsDispersionExtension;
  'KHR_materials_emissive_strength': KHRMaterialsEmissiveStrengthExtension;
  'KHR_materials_ior': KHRMaterialsIORExtension;
  'KHR_materials_iridescence': KHRMaterialsIridescenceExtension;
  'KHR_materials_pbrSpecularGlossiness': KHRMaterialsPbrSpecularGlossinessExtension;
  'KHR_materials_sheen': KHRMaterialsSheenExtension;
  'KHR_materials_specular': KHRMaterialsSpecularExtension;
  'KHR_materials_transmission': KHRMaterialsTransmissionExtension;
  'KHR_materials_volume': KHRMaterialsVolumeExtension;
  'KHR_texture_transform': KHRTextureTransformExtension;
  'KHR_lights_punctual': KHRLightsPunctualExtension;
  'KHR_materials_variants': KHRMaterialsVariantsExtension;
}

// Type-safe extension access
export type ExtensionFor<T extends ExtensionName> = ExtensionTypeMap[T];

// Advanced validation result types
export type ValidationResultFor<T> = {
  readonly target: T;
  readonly context: ValidationTarget<T>;
  readonly messages: readonly ValidationMessage[];
  readonly isValid: boolean;
};

// Const assertion helpers
export const GLTF_MIME_TYPES = ['model/gltf+json', 'model/gltf-binary'] as const;
export type GLTFMimeType = typeof GLTF_MIME_TYPES[number];

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/ktx2'] as const;
export type ImageMimeType = typeof IMAGE_MIME_TYPES[number];

export const SEVERITY_LEVELS = ['ERROR', 'WARNING', 'INFO', 'HINT'] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

// Validation code constants with const assertions
export const VALIDATION_CODES = {
  // Type validation codes
  TYPE_MISMATCH: 'TYPE_MISMATCH',
  UNDEFINED_PROPERTY: 'UNDEFINED_PROPERTY',
  UNEXPECTED_PROPERTY: 'UNEXPECTED_PROPERTY',
  INVALID_VALUE: 'INVALID_VALUE',
  VALUE_NOT_IN_RANGE: 'VALUE_NOT_IN_RANGE',
  VALUE_NOT_IN_LIST: 'VALUE_NOT_IN_LIST',
  UNRESOLVED_REFERENCE: 'UNRESOLVED_REFERENCE',

  // GLTF specific codes
  EMPTY_ENTITY: 'EMPTY_ENTITY',
  UNUSED_OBJECT: 'UNUSED_OBJECT',
  ACCESSOR_NORMALIZED_INVALID: 'ACCESSOR_NORMALIZED_INVALID',
  BUFFER_DATA_URI_MIME_TYPE_INVALID: 'BUFFER_DATA_URI_MIME_TYPE_INVALID',
  IMAGE_NON_ENABLED_MIME_TYPE: 'IMAGE_NON_ENABLED_MIME_TYPE',
  MATERIAL_ALPHA_CUTOFF_INVALID_MODE: 'MATERIAL_ALPHA_CUTOFF_INVALID_MODE',
  NODE_MATRIX_TRS: 'NODE_MATRIX_TRS',
  CAMERA_YFOV_GEQUAL_PI: 'CAMERA_YFOV_GEQUAL_PI',

  // Extension codes
  UNDECLARED_EXTENSION: 'UNDECLARED_EXTENSION',
  UNEXPECTED_EXTENSION_OBJECT: 'UNEXPECTED_EXTENSION_OBJECT',
  INCOMPLETE_EXTENSION_SUPPORT: 'INCOMPLETE_EXTENSION_SUPPORT'
} as const;

export type ValidationCode = typeof VALIDATION_CODES[keyof typeof VALIDATION_CODES];

export interface StrictValidationMessage extends Omit<ValidationMessage, 'code' | 'severity'> {
  readonly code: ValidationCode;
  readonly severity: Severity;
  readonly pointer: JSONPointer;
  readonly timestamp?: Date;
  readonly context?: Record<string, unknown>;
}

// Component type constants with const assertions
export const COMPONENT_TYPE_SIZES = {
  [ComponentType.BYTE]: 1,
  [ComponentType.UNSIGNED_BYTE]: 1,
  [ComponentType.SHORT]: 2,
  [ComponentType.UNSIGNED_SHORT]: 2,
  [ComponentType.UNSIGNED_INT]: 4,
  [ComponentType.FLOAT]: 4,
  [ComponentType.DOUBLE]: 8
} as const;

export const ACCESSOR_TYPE_COMPONENT_COUNTS = {
  [AccessorType.SCALAR]: 1,
  [AccessorType.VEC2]: 2,
  [AccessorType.VEC3]: 3,
  [AccessorType.VEC4]: 4,
  [AccessorType.MAT2]: 4,
  [AccessorType.MAT3]: 9,
  [AccessorType.MAT4]: 16
} as const;

// Readonly GLTF types
export type ReadonlyGLTF = DeepReadonly<GLTF>;
export type ReadonlyValidationResult = DeepReadonly<ValidationResult>;

// Advanced mapped types
export type PartialByKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredByKey<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Type-safe object keys
export function getTypedKeys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

// Type-safe object entries
export function getTypedEntries<T extends Record<string, unknown>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export interface LightDefinition {
  color?: number[];
  intensity?: number;
  type: 'directional' | 'point' | 'spot';
  range?: number;
  spot?: SpotLight;
  name?: string;
  [key: string]: unknown;
}

export interface SpotLight {
  innerConeAngle?: number;
  outerConeAngle?: number;
  [key: string]: unknown;
}

export interface KHRMaterialsVariantsExtension {
  variants: VariantDefinition[];
}

export interface VariantDefinition {
  name?: string;
  [key: string]: unknown;
}

export interface MeshPrimitiveVariantMapping {
  mappings?: VariantMapping[];
  [key: string]: unknown;
}

export interface VariantMapping {
  variants: number[];
  material: number;
  [key: string]: unknown;
}
