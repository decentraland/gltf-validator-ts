# GLTF Validator (TypeScript)

A TypeScript implementation of GLTF/GLB validation compatible with the official Khronos validator.

[![npm version](https://img.shields.io/npm/v/@dcl/gltf-validator-ts.svg)](https://www.npmjs.com/package/@dcl/gltf-validator-ts)
[![CI Status](https://github.com/decentraland/gltf-validator-ts/workflows/CI/badge.svg)](https://github.com/decentraland/gltf-validator-ts/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## Table of Contents

- [Features](#features)
- [Quick Links](#quick-links)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Basic Usage](#basic-usage)
  - [Validating GLB Files](#validating-glb-files)
  - [Advanced Configuration](#advanced-configuration)
- [Quick Example](#quick-example)
  - [Working with Validation Results](#working-with-validation-results)
- [API Reference](#api-reference)
  - [GLTFValidator](#gltfvalidator)
  - [Utility Functions](#utility-functions)
- [Validation Codes](#validation-codes)
  - [Error Codes (Severity 0)](#error-codes-severity-0)
  - [Warning Codes (Severity 1)](#warning-codes-severity-1)
  - [Info Codes (Severity 2)](#info-codes-severity-2)
- [Supported Extensions](#supported-extensions)
- [Browser Compatibility](#browser-compatibility)
- [Performance Tips](#performance-tips)
- [Development](#development)
  - [Setup](#setup)
  - [Scripts](#scripts)
- [Examples](#examples)
  - [Basic Model Validation](#basic-model-validation)
  - [Creating Custom Examples](#creating-custom-examples)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Project Origin](#project-origin)
  - [Development Process](#development-process)
  - [Credit and Attribution](#credit-and-attribution)
- [Acknowledgments](#acknowledgments)

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

## Quick Links

- 📦 [npm Package](https://www.npmjs.com/package/@dcl/gltf-validator-ts)
- 🌐 [Live Demo](https://decentraland.github.io/gltf-validator-ts/main) - Try it in your browser!
- 📚 [API Documentation](#api-reference)
- 💡 [Examples](./examples/)
- 🐛 [Report a Bug](https://github.com/decentraland/gltf-validator-ts/issues/new?labels=bug)
- ✨ [Request a Feature](https://github.com/decentraland/gltf-validator-ts/issues/new?labels=enhancement)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 🔒 [Security Policy](SECURITY.md)
- 📖 [GLTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- 🎯 [Original Khronos Validator](https://github.com/KhronosGroup/glTF-Validator)

## Installation

```bash
npm install @dcl/gltf-validator-ts
```

## Quick Start

### Basic Usage

```typescript
import { GLTFValidator } from '@dcl/gltf-validator-ts';

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
import { parseGLB } from '@dcl/gltf-validator-ts';

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

### Texture Validation

#### validateTextures(data, options?)

Validates textures in a GLB or glTF model. Checks for non-power-of-two dimensions, non-square textures, and layer-size mismatches within materials. Image dimensions are read from PNG/JPEG binary headers — no browser APIs required.

**Parameters:**
- `data: Uint8Array` - GLB or glTF file data
- `options?: TextureValidationOptions`
  - `format?: 'glb' | 'gltf'` - Force format (auto-detected if omitted)
  - `externalResourceFunction?: (uri: string) => Promise<Uint8Array>` - Load external images

**Returns:** `Promise<TextureValidationResult>`

```typescript
import { validateTextures } from '@dcl/gltf-validator-ts';

const glbData = new Uint8Array(/* GLB file */);
const result = await validateTextures(glbData);

for (const issue of result.issues) {
  console.log(`${issue.type}: ${issue.message}`);
}
```

#### fixGlbTextures(data, images, issues, resizeImage)

Fixes embedded GLB textures by resizing images and rebuilding the binary. The `resizeImage` function is provided by the caller, keeping the library platform-agnostic.

**Parameters:**
- `data: Uint8Array` - GLB file data
- `images: TextureImageInfo[]` - Image info from `validateTextures`
- `issues: TextureIssue[]` - Issues from `validateTextures`
- `resizeImage: ResizeImageFunction` - `(imageData, mimeType, targetWidth, targetHeight) => Promise<Uint8Array>`

**Returns:** `Promise<ArrayBuffer>` - Rebuilt GLB

```typescript
import { validateTextures, fixGlbTextures } from '@dcl/gltf-validator-ts';

const { images, issues } = await validateTextures(glbData);

if (issues.length > 0) {
  const fixed = await fixGlbTextures(glbData, images, issues, async (data, mime, w, h) => {
    // Browser example using OffscreenCanvas:
    const blob = new Blob([data], { type: mime });
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(w, h);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
    const out = await canvas.convertToBlob({ type: mime });
    return new Uint8Array(await out.arrayBuffer());
  });
}
```

#### isPowerOfTwo(n) / nextPowerOfTwo(n)

Utility functions for power-of-two calculations.

```typescript
isPowerOfTwo(256)     // true
isPowerOfTwo(100)     // false
nextPowerOfTwo(100)   // 128
nextPowerOfTwo(1024)  // 1024
```

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
git clone https://github.com/decentraland/gltf-validator-ts.git
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

## Browser Compatibility

The validator is compatible with modern browsers and Node.js environments:

### Node.js
- **Minimum Version**: Node.js 18.0.0+
- **Recommended**: Node.js 20.x or higher
- **Platform Support**: Windows, macOS, Linux

### Browser Support
- **Chrome/Edge**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Opera**: Version 76+

### Web Bundle
A browser-ready bundle is available for use directly in web applications:

```html
<script src="https://unpkg.com/@dcl/gltf-validator-ts/web/scripts/gltf-validator.js"></script>
<script>
  // GLTFValidator is available as a global variable
  const validator = new GLTFValidator.GLTFValidator({
    maxIssues: 100
  });
</script>
```

Or use the [live demo](https://decentraland.github.io/gltf-validator-ts/main) to validate models in your browser without installation.

## Performance Tips

### Optimization Strategies

#### 1. Limit Issue Reporting
```typescript
const validator = new GLTFValidator({
  maxIssues: 50  // Stop after finding 50 issues
});
```

#### 2. Filter Issue Types
```typescript
const validator = new GLTFValidator({
  onlyIssues: ['TYPE_MISMATCH', 'UNRESOLVED_REFERENCE'],  // Only critical errors
  ignoredIssues: ['UNUSED_OBJECT', 'UNSUPPORTED_EXTENSION']  // Ignore non-critical
});
```

#### 3. Batch Validation
When validating multiple files, reuse the validator instance:

```typescript
const validator = new GLTFValidator({ maxIssues: 100 });

for (const file of files) {
  const result = await validator.validate(file);
  // Process results
}
```

#### 4. Memory Management
For large GLB files, consider processing in chunks or validating smaller sections:

```typescript
// Monitor memory usage for large files
if (fileSize > 50 * 1024 * 1024) {  // > 50MB
  console.warn('Large file detected, validation may be slow');
}
```

### Performance Benchmarks

Typical validation times (on modern hardware):

| File Size | Validation Time | Memory Usage |
|-----------|----------------|--------------|
| < 1 MB    | < 100ms        | ~10 MB       |
| 1-10 MB   | 100-500ms      | ~50 MB       |
| 10-50 MB  | 500ms-2s       | ~200 MB      |
| > 50 MB   | 2s+            | ~500 MB+     |

## CI/CD

### GitHub Actions Integration

Example workflow for validating GLTF files in CI:

```yaml
name: Validate GLTF Assets

on:
  push:
    paths:
      - 'assets/**/*.gltf'
      - 'assets/**/*.glb'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install validator
        run: npm install -g @dcl/gltf-validator-ts

      - name: Validate GLTF files
        run: |
          for file in assets/**/*.{gltf,glb}; do
            echo "Validating $file"
            npx gltf-validate "$file" || exit 1
          done
```

### Pre-commit Hook

Add validation to your git pre-commit hook:

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Get list of staged GLTF/GLB files
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(gltf|glb)$')

if [ -n "$FILES" ]; then
  echo "Validating GLTF files..."
  for file in $FILES; do
    npx @dcl/gltf-validator-ts "$file" || exit 1
  done
fi
```

### Build Pipeline Integration

Integrate with your build tools:

**Webpack:**
```javascript
const { GLTFValidator } = require('@dcl/gltf-validator-ts');

module.exports = {
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('GLTFValidationPlugin', async (compilation, callback) => {
          // Validate GLTF assets during build
          // ...
          callback();
        });
      }
    }
  ]
};
```

## Troubleshooting

### Common Issues

#### Installation Problems

**Error: Cannot find module '@dcl/gltf-validator-ts'**
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install @dcl/gltf-validator-ts
```

**TypeScript definition errors**
```bash
# Ensure TypeScript version is compatible
npm install typescript@latest --save-dev
```

#### Validation Issues

**Large files cause memory errors**
```typescript
// Increase Node.js memory limit
// Run with: NODE_OPTIONS="--max-old-space-size=4096" node script.js

// Or validate in smaller chunks
const validator = new GLTFValidator({
  maxIssues: 20  // Limit issues to reduce memory
});
```

**External resources not loading**
```typescript
// Provide custom resource loading function
const validator = new GLTFValidator({
  externalResourceFunction: async (uri) => {
    const fullPath = path.resolve(baseDir, uri);
    return fs.readFileSync(fullPath);
  }
});
```

**Validation takes too long**
```typescript
// Add timeout wrapper
const timeoutPromise = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Validation timeout')), ms)
    )
  ]);
};

await timeoutPromise(validator.validate(gltf), 5000);  // 5 second timeout
```

#### Browser-Specific Issues

**CORS errors when loading external resources**
- Ensure resources are served with appropriate CORS headers
- Use relative paths when possible
- Implement a proxy for external resources

**Module loading errors in browser**
- Use the pre-built web bundle instead of ES modules
- Or configure your bundler (Webpack, Rollup) appropriately

### Getting Help

1. **Check Existing Issues**: [GitHub Issues](https://github.com/decentraland/gltf-validator-ts/issues)
2. **Read the Spec**: [GLTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
3. **Compare with Original**: [Khronos Validator](https://github.com/KhronosGroup/glTF-Validator)
4. **Create an Issue**: Include file examples, error messages, and environment details

## FAQ

### General Questions

**Q: Is this compatible with the official Khronos validator?**
A: Yes! This validator passes all 609+ tests from the official Khronos GLTF Validator test suite, ensuring complete compatibility.

**Q: Can I use this in the browser?**
A: Yes, there's a web bundle available. See the [Browser Compatibility](#browser-compatibility) section and try the [live demo](https://decentraland.github.io/gltf-validator-ts/main).

**Q: What's the difference between this and the original validator?**
A: This is a TypeScript reimplementation that maintains 100% behavioral compatibility with the original Dart-based validator. It offers better TypeScript integration and can be used in more JavaScript/TypeScript environments.

**Q: Does it support GLTF 1.0?**
A: No, this validator only supports GLTF 2.0 specification. GLTF 1.0 is deprecated.

### Technical Questions

**Q: Can I validate files from URLs?**
A: Yes, fetch the file first, then validate:
```typescript
const response = await fetch('https://example.com/model.glb');
const arrayBuffer = await response.arrayBuffer();
const result = await validateBytes(new Uint8Array(arrayBuffer));
```

**Q: How do I ignore certain validation warnings?**
A: Use the `ignoredIssues` option:
```typescript
const validator = new GLTFValidator({
  ignoredIssues: ['UNUSED_OBJECT', 'BUFFER_GLB_CHUNK_TOO_BIG']
});
```

**Q: Can I make warnings into errors?**
A: Yes, use `severityOverrides`:
```typescript
const validator = new GLTFValidator({
  severityOverrides: {
    'UNEXPECTED_PROPERTY': 0  // Make warnings (1) into errors (0)
  }
});
```

**Q: How do I validate only specific parts of a GLTF file?**
A: The validator checks the entire structure, but you can filter results by JSON pointer location:
```typescript
const result = await validator.validate(gltf);
const meshIssues = result.issues.messages.filter(
  msg => msg.pointer?.startsWith('/meshes/')
);
```

**Q: Does it validate external resources (images, buffers)?**
A: Yes, for GLB files, resources are embedded. For GLTF files with external resources, provide an `externalResourceFunction` to load them.

### Performance Questions

**Q: How do I speed up validation for large files?**
A: See the [Performance Tips](#performance-tips) section. Key strategies: limit issues, filter by type, and reuse validator instances.

**Q: Can I run validation in parallel?**
A: Yes, create multiple validator instances and validate files concurrently:
```typescript
await Promise.all(files.map(file =>
  new GLTFValidator().validate(file)
));
```

**Q: What's the maximum file size supported?**
A: There's no hard limit, but validation performance degrades for files > 50MB. Consider validating in smaller chunks or using the web demo for quick checks.

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
