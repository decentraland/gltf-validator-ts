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
  pointer: string;
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
  [key: string]: any;
}

export interface GLTFBuffer {
  uri?: string;
  byteLength: number;
  [key: string]: any;
}

export interface GLTFBufferView {
  buffer: number;
  byteOffset?: number;
  byteLength: number;
  byteStride?: number;
  target?: number;
  [key: string]: any;
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
  [key: string]: any;
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
  [key: string]: any;
}

export interface GLTFAnimationChannel {
  sampler: number;
  target: GLTFAnimationTarget;
  [key: string]: any;
}

export interface GLTFAnimationTarget {
  node?: number;
  path: string;
  [key: string]: any;
}

export interface GLTFAnimationSampler {
  input: number;
  output: number;
  interpolation?: string;
  [key: string]: any;
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
  [key: string]: any;
}

export interface GLTFMesh {
  primitives: GLTFMeshPrimitive[];
  weights?: number[];
  [key: string]: any;
}

export interface GLTFMeshPrimitive {
  attributes: Record<string, number>;
  indices?: number;
  material?: number;
  mode?: number;
  targets?: Record<string, number>[];
  [key: string]: any;
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
  [key: string]: any;
}

export interface GLTFPBRMetallicRoughness {
  baseColorFactor?: number[];
  baseColorTexture?: GLTFTextureInfo;
  metallicFactor?: number;
  roughnessFactor?: number;
  metallicRoughnessTexture?: GLTFTextureInfo;
  [key: string]: any;
}

export interface GLTFTextureInfo {
  index: number;
  texCoord?: number;
  [key: string]: any;
}

export interface GLTFTexture {
  source?: number;
  sampler?: number;
  [key: string]: any;
}

export interface GLTFImage {
  uri?: string;
  mimeType?: string;
  bufferView?: number;
  [key: string]: any;
}

export interface GLTFSampler {
  magFilter?: number;
  minFilter?: number;
  wrapS?: number;
  wrapT?: number;
  [key: string]: any;
}

export interface GLTFCamera {
  orthographic?: GLTFOrthographic;
  perspective?: GLTFPerspective;
  type: string;
  [key: string]: any;
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
  [key: string]: any;
}

export interface GLTFSkin {
  inverseBindMatrices?: number;
  skeleton?: number;
  joints: number[];
  [key: string]: any;
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
  extensions?: Record<string, any>;
  extras?: any;
  [key: string]: any;
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
