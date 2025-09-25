# GLTF Validator (TypeScript)

A TypeScript implementation of GLTF/GLB validation compatible with the official Khronos validator.

[![npm version](https://img.shields.io/npm/v/gltf-validator-ts.svg)](https://www.npmjs.com/package/gltf-validator-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- ✅ **Complete GLTF 2.0 Validation** - Validates all core GLTF specifications
- ✅ **GLB Support** - Full binary GLTF (.glb) file validation
- ✅ **Extension Support** - Validates popular GLTF extensions:
  - KHR_materials_pbrSpecularGlossiness
  - KHR_materials_unlit
  - KHR_materials_clearcoat
  - KHR_materials_transmission
  - KHR_materials_volume
  - KHR_materials_ior
  - KHR_materials_specular
  - KHR_materials_sheen
  - KHR_materials_emissive_strength
  - KHR_materials_iridescence
  - KHR_materials_anisotropy
  - KHR_materials_dispersion
  - KHR_materials_variants
  - KHR_lights_punctual
  - KHR_animation_pointer
  - KHR_texture_transform
  - KHR_texture_basisu
  - KHR_mesh_quantization
  - EXT_texture_webp
- ✅ **Detailed Error Reporting** - Comprehensive validation messages with JSON pointer locations
- ✅ **TypeScript Support** - Full TypeScript definitions included
- ✅ **High Performance** - Optimized validation algorithms
- ✅ **Configurable** - Customizable validation options and severity levels

## Installation

```bash
npm install gltf-validator-ts
```

## Quick Start

### Basic Usage

```typescript
import { GLTFValidator } from 'gltf-validator-ts';

// Create validator with default options
const validator = new GLTFValidator({
  maxIssues: 100,
  ignoredIssues: [],
  onlyIssues: [],
  severityOverrides: {}
});

// Validate a GLTF file
const gltfData = {
  "asset": {
    "version": "2.0"
  },
  // ... your GLTF data
};

const result = await validator.validate(gltfData);

console.log(`Errors: ${result.issues.numErrors}`);
console.log(`Warnings: ${result.issues.numWarnings}`);

// Print all validation messages
result.issues.messages.forEach(message => {
  console.log(`${message.code}: ${message.message} at ${message.pointer}`);
});
```

### Validating GLB Files

```typescript
import { parseGLB } from 'gltf-validator-ts';

// Parse GLB binary data
const glbBuffer = new Uint8Array(/* your GLB file data */);
const parseResult = parseGLB(glbBuffer);

if (parseResult.gltf) {
  const result = await validator.validate(parseResult.gltf, true, parseResult.resources);
  console.log('GLB validation complete:', result);
}
```

### Advanced Configuration

```typescript
const validator = new GLTFValidator({
  maxIssues: 50,                    // Limit number of issues reported
  ignoredIssues: ['UNUSED_OBJECT'], // Ignore specific issue codes
  onlyIssues: [],                   // Only report specific issue codes (empty = all)
  severityOverrides: {              // Override severity levels
    'UNUSED_OBJECT': 0              // Make unused objects errors instead of info
  },
  externalResourceFunction: async (uri: string) => {
    // Custom function to load external resources
    const response = await fetch(uri);
    return new Uint8Array(await response.arrayBuffer());
  }
});
```

## Quick Example

Try the included example with a real GLB model:

```bash
# Run the built-in example
npm run example

# Or run the TypeScript version
npm run example:ts
```

This validates a sample model and shows different validation approaches, issue reporting, and model analysis.

### Working with Validation Results

```typescript
const result = await validator.validate(gltfData);

// Access different types of issues
console.log(`Found ${result.issues.numErrors} errors`);
console.log(`Found ${result.issues.numWarnings} warnings`);
console.log(`Found ${result.issues.numInfos} info messages`);

// Filter messages by severity
const errors = result.issues.messages.filter(msg => msg.severity === 0);
const warnings = result.issues.messages.filter(msg => msg.severity === 1);

// Group messages by code
const messagesByCode = result.issues.messages.reduce((acc, msg) => {
  acc[msg.code] = acc[msg.code] || [];
  acc[msg.code].push(msg);
  return acc;
}, {} as Record<string, typeof result.issues.messages>);
```

## API Reference

### GLTFValidator

Main validator class for GLTF/GLB validation.

#### Constructor

```typescript
new GLTFValidator(options: ValidatorOptions)
```

**ValidatorOptions:**
- `maxIssues: number` - Maximum number of issues to report (0 = unlimited)
- `ignoredIssues: string[]` - Array of issue codes to ignore
- `onlyIssues: string[]` - Only report these issue codes (empty = all)
- `severityOverrides: Record<string, Severity>` - Override severity levels for specific codes
- `externalResourceFunction?: (uri: string) => Promise<Uint8Array>` - Function to load external resources

#### Methods

##### validate(gltf, isGLB?, resources?)

Validates a GLTF object.

**Parameters:**
- `gltf: GLTF` - The GLTF object to validate
- `isGLB?: boolean` - Whether this is a GLB file (default: false)
- `resources?: ResourceReference[]` - External resources for GLB validation

**Returns:** `Promise<{ issues: Issues }>`

### Utility Functions

#### parseGLB(data)

Parses GLB binary data into GLTF object and resources.

**Parameters:**
- `data: Uint8Array` - GLB binary data

**Returns:** `{ gltf?: GLTF, resources: ResourceReference[], errors?: string[] }`

## Validation Codes

The validator reports various types of issues with specific codes:

### Error Codes (Severity 0)
- `TYPE_MISMATCH` - Property has wrong data type
- `UNRESOLVED_REFERENCE` - Reference to non-existent object
- `INVALID_VALUE` - Property value is invalid
- `UNDEFINED_PROPERTY` - Required property is missing
- `BUFFER_MISSING_GLB_DATA` - GLB buffer missing binary data
- And many more...

### Warning Codes (Severity 1)
- `UNEXPECTED_PROPERTY` - Property not expected in this location
- `BUFFER_GLB_CHUNK_TOO_BIG` - GLB chunk has extra padding
- `NODE_SKINNED_MESH_NON_ROOT` - Skinned mesh not at root level
- And many more...

### Info Codes (Severity 2)
- `UNUSED_OBJECT` - Object is defined but not used
- `UNSUPPORTED_EXTENSION` - Extension not supported by validator
- And many more...

## Supported Extensions

This validator supports validation for the following GLTF extensions:

- **KHR_materials_pbrSpecularGlossiness** - Alternative material workflow
- **KHR_materials_unlit** - Unlit materials
- **KHR_materials_clearcoat** - Clearcoat materials
- **KHR_materials_transmission** - Transmission materials
- **KHR_materials_volume** - Volume materials
- **KHR_materials_ior** - Index of refraction
- **KHR_materials_specular** - Specular workflow
- **KHR_materials_sheen** - Sheen materials
- **KHR_materials_emissive_strength** - Emissive strength
- **KHR_materials_iridescence** - Iridescent materials
- **KHR_materials_anisotropy** - Anisotropic materials
- **KHR_materials_dispersion** - Material dispersion
- **KHR_materials_variants** - Material variants
- **KHR_lights_punctual** - Punctual lights
- **KHR_animation_pointer** - Animation pointers
- **KHR_texture_transform** - Texture transforms
- **KHR_texture_basisu** - Basis Universal textures
- **KHR_mesh_quantization** - Mesh quantization
- **EXT_texture_webp** - WebP textures

## Development

### Setup

```bash
git clone https://github.com/yourusername/gltf-validator-ts.git
cd gltf-validator-ts
npm install
```

### Scripts

```bash
npm run build          # Build the project
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run lint           # Lint the code
npm run lint:fix       # Lint and auto-fix issues
npm run format         # Format code with Prettier
npm run typecheck      # Type check without emitting
```

## Examples

The `examples/` directory contains practical examples showing how to use the validator:

### Basic Model Validation

```bash
# Run the basic example with included GLB model
npm run example

# View example source code
cat examples/basic/validate-model.ts
```

The basic example demonstrates:
- Loading GLB files from disk
- Different validation approaches (basic, custom, strict)
- Error handling and result interpretation
- Model information extraction
- Issue filtering and reporting

### Creating Custom Examples

See `examples/README.md` for details on creating your own validation examples and integrating the validator into your workflow.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -am 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Origin

This project is **100% based on the official [Khronos GLTF Validator](https://github.com/KhronosGroup/glTF-Validator)** and was created through an AI-assisted development process.

### Development Process

The validator was "vibe-coded" by:
1. **Copying the comprehensive test suite** from the original Khronos GLTF Validator repository
2. **Using AI assistance** to analyze the test expectations and create a complete TypeScript implementation
3. **Iteratively building the validator** to pass all 609+ tests from the original repository
4. **Maintaining full compatibility** with the original validator's behavior and error reporting

### Credit and Attribution

- **Original Work**: [Khronos Group GLTF Validator](https://github.com/KhronosGroup/glTF-Validator)
- **Test Suite**: Copied directly from the official repository to ensure compatibility
- **Implementation**: AI-assisted TypeScript rewrite that passes all original tests
- **Validation Logic**: Reverse-engineered from test expectations to match original behavior

This project demonstrates how AI can be used to create compatible implementations by learning from comprehensive test suites, rather than reimplementing from scratch.

## Acknowledgments

- Built according to the [GLTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- Supports extensions from the [GLTF Extension Registry](https://github.com/KhronosGroup/glTF/tree/main/extensions)
- **Test suite and validation behavior**: Based entirely on the official [Khronos GLTF Validator](https://github.com/KhronosGroup/glTF-Validator)
- **TypeScript implementation**: AI-assisted development using Claude
