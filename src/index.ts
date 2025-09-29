// Main validation function
export { validateBytes } from './validator';

// Core classes
export { GLTFValidator } from './validators/gltf-validator';
export { GLBValidator } from './validators/glb-validator';

// Type definitions
export * from './types';

// For backwards compatibility and convenience
export { validateBytes as validate } from './validator';

// Utility functions
import { GLBValidator } from './validators/glb-validator';
export const parseGLB = GLBValidator.parseGLB;

console.log('@dcl/gltf-validator-ts');
