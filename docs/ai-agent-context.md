# AI Agent Context

## Service Purpose

GLTF Validator (TypeScript) is a pure TypeScript implementation of the official Khronos glTF 2.0 Validator. It provides comprehensive validation of GLTF/GLB files, ensuring they conform to the GLTF 2.0 specification and detecting structural, semantic, and format errors. The validator is 100% compatible with the original Dart-based Khronos validator, passing all 609+ official test cases.

## Key Capabilities

- **Complete GLTF 2.0 Validation**: Validates all core GLTF 2.0 specification requirements including assets, scenes, nodes, meshes, materials, textures, animations, and skins
- **GLB Binary Format Support**: Full support for binary GLTF (.glb) files with embedded resources
- **Extension Validation**: Validates 18+ official GLTF extensions including KHR_materials_* variants, KHR_lights_punctual, KHR_texture_*, and EXT_texture_webp
- **Detailed Error Reporting**: Provides comprehensive validation messages with JSON pointer locations, severity levels (Error/Warning/Info), and issue codes
- **Configurable Validation**: Customizable options for filtering issues, overriding severity levels, and limiting reported issues
- **External Resource Handling**: Supports validation of GLTF files with external resources through custom loading functions
- **Browser and Node.js Support**: Works in modern browsers (via web bundle) and Node.js 18+
- **TypeScript-First**: Full TypeScript definitions with strict typing
- **Zero Runtime Dependencies**: No external runtime dependencies for maximum security and minimal bundle size

## Communication Pattern

### Library API (Direct Integration)
- **Protocol**: JavaScript/TypeScript function calls
- **Pattern**: Synchronous constructor, asynchronous validation
- **Input**: GLTF objects (parsed JSON), GLB binary data (Uint8Array), or file buffers
- **Output**: Promise resolving to ValidationResult containing issues array

### Web Bundle (Browser)
- **Protocol**: Browser JavaScript (IIFE)
- **Pattern**: Global `GLTFValidator` namespace
- **Loading**: Script tag or module bundler
- **Usage**: Same API as Node.js version

### Example Integration Patterns:
```typescript
// Node.js
import { GLTFValidator, parseGLB, validateBytes } from '@dcl/gltf-validator-ts';

// Browser (script tag)
const validator = new GLTFValidator.GLTFValidator(options);

// Direct validation
const result = await validator.validate(gltfObject);

// GLB validation
const { gltf, resources } = parseGLB(glbBuffer);
const result = await validator.validate(gltf, true, resources);

// Helper function
const result = await validateBytes(fileBuffer, { maxIssues: 100 });
```

## Technology Stack

### Runtime & Language
- **Runtime**: Node.js 18.0.0+ (18.x, 20.x, 22.x tested)
- **Language**: TypeScript 5.9.3 (strict mode enabled)
- **Module Formats**: ESM (primary), CommonJS (compatibility)
- **Browser**: ES2020+ compatible browsers

### Build & Development Tools
- **Build Tool**: TypeScript Compiler (tsc)
- **Bundle Tool**: esbuild 0.21.5 (for web bundle)
- **Testing**: Vitest 2.1.9 with coverage (609+ test cases)
- **Linting**: ESLint 9.0.0 with TypeScript plugin
- **Formatting**: Prettier 3.0.0
- **Type Checking**: TypeScript strict mode with noEmit

### Package Structure
- **ESM Output**: `dist/esm/` (import statements)
- **CJS Output**: `dist/cjs/` (require statements)
- **Web Bundle**: `web/scripts/gltf-validator.js` (browser IIFE)
- **Type Definitions**: `dist/esm/*.d.ts`

### CI/CD
- **CI Platform**: GitHub Actions
- **Workflows**: Separate workflows for lint, typecheck, tests, publish
- **Versioning**: Semantic versioning via `paulhatch/semantic-version@v5.4.0`
- **Publishing**: npm registry (`@dcl/gltf-validator-ts`), GitHub Releases, GitHub Pages (demo)
- **Deployment**: Automated on main branch merges, manual pre-releases on PRs

## External Dependencies

### Runtime Dependencies
- **NONE**: Zero runtime dependencies for maximum security and minimal attack surface

### Development Dependencies
- **@types/node** (^22.0.0): TypeScript definitions for Node.js APIs
- **vitest** (^2.1.9): Testing framework with 609+ test cases from Khronos validator
- **@vitest/coverage-v8** (^2.1.9): Code coverage reporting
- **eslint** (^9.0.0): Code linting and quality checks
- **typescript** (^5.9.3): TypeScript compilation and type checking
- **prettier** (^3.0.0): Code formatting
- **esbuild** (^0.21.5): Fast bundler for web distribution

### External Services
- **npm Registry**: Package distribution (`@dcl/gltf-validator-ts@latest`)
- **GitHub Releases**: Binary package distribution and version tracking
- **GitHub Pages**: Live web demo deployment (`https://decentraland.github.io/gltf-validator-ts/main`)
- **GitHub Actions**: CI/CD automation

### Test Suite Origin
- **Source**: Copied from [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator)
- **Format**: JSON test cases with expected validation results
- **Location**: `test/` directory (base, specs, ext subdirectories)
- **Count**: 609+ test cases covering all GLTF features and extensions

## Key Concepts

### GLTF Structure Validation
- **GLTF Object**: The root JSON object must have an `asset` property with `version: "2.0"` and may contain `scenes`, `nodes`, `meshes`, `materials`, `textures`, `images`, `buffers`, `bufferViews`, `accessors`, `animations`, `skins`, `cameras`
- **Index Resolution**: All references are indices into arrays; validator ensures indices are valid and creates dependency graphs to detect issues like unresolved references and circular dependencies
- **Buffer Data**: For GLB files, buffer 0 must reference the embedded binary chunk; for GLTF files, buffers reference external URIs or data URIs

### GLB Binary Format
- **Structure**: Magic number (0x46546C67), version (2), length, JSON chunk (type 0x4E4F534A), BIN chunk (type 0x004E4942)
- **Parsing**: `parseGLB()` function splits GLB into GLTF JSON and binary resources
- **Validation**: GLB-specific checks include magic number validation, chunk alignment, and buffer references

### Validation Severity Levels
- **Severity 0 (Error)**: Violations of GLTF spec that will cause rendering failures (e.g., `TYPE_MISMATCH`, `UNRESOLVED_REFERENCE`, `INVALID_VALUE`)
- **Severity 1 (Warning)**: Non-critical issues that may cause problems (e.g., `UNEXPECTED_PROPERTY`, `NODE_SKINNED_MESH_NON_ROOT`)
- **Severity 2 (Info)**: Informational messages about optimization opportunities (e.g., `UNUSED_OBJECT`, `UNSUPPORTED_EXTENSION`)
- **Severity 3 (Hint)**: Suggestions for improvements (rarely used)

### Issue Filtering and Configuration
- **maxIssues**: Limits number of reported issues (0 = unlimited); validator stops after reaching limit to prevent performance issues with badly malformed files
- **ignoredIssues**: Array of issue codes to skip; useful for suppressing known warnings in specific workflows
- **onlyIssues**: Whitelist of issue codes to report; empty array means report all
- **severityOverrides**: Map of issue code to severity level; allows promoting warnings to errors or demoting errors to warnings

### Extension Validation
- **Used Extensions**: Listed in `gltf.extensionsUsed[]` and must be supported by the validator
- **Required Extensions**: Listed in `gltf.extensionsRequired[]` and must be supported or file is invalid
- **Extension Validators**: Separate validator classes for each extension (e.g., `KHRMaterialsPBRSpecularGlossinessValidator`)
- **Validation Order**: Core validation first, then extension-specific validation

### External Resource Loading
- **Default Behavior**: External resources are NOT loaded by default for security
- **Custom Function**: Provide `externalResourceFunction(uri: string) => Promise<Uint8Array>` to enable loading
- **Use Cases**: Validating GLTF files (not GLB) with external .bin buffers or image files
- **Security**: Always validate URIs before loading to prevent SSRF or path traversal attacks

### Accessor Validation
- **Bounds Checking**: Accessors must reference valid bufferViews with correct byte offsets and lengths
- **Type Compatibility**: Accessor componentType and type must match usage (e.g., POSITION must be VEC3 with FLOAT)
- **Normalization**: Some accessor types require normalized values; validator checks constraints
- **Min/Max**: Optional min/max arrays must have correct length matching accessor type

### Mesh Primitive Validation
- **Attributes**: Must include POSITION, may include NORMAL, TANGENT, TEXCOORD_n, COLOR_n, JOINTS_n, WEIGHTS_n
- **Indices**: Optional accessor for indexed rendering; must reference valid elements
- **Mode**: Rendering mode (POINTS, LINES, TRIANGLES, etc.); affects validation of attributes
- **Material**: Optional material index; if present must be valid

### Material and Texture Validation
- **PBR Workflow**: Default metallic-roughness or specular-glossiness (via extension)
- **Texture References**: Material properties reference textures which reference images and samplers
- **Sampler Parameters**: Wrap modes (CLAMP_TO_EDGE, MIRRORED_REPEAT, REPEAT) and filter modes (NEAREST, LINEAR, MIPMAP variants)
- **Image Sources**: Can be external URI, data URI, or bufferView reference (for GLB)

### Animation Validation
- **Channels**: Target node and path (translation, rotation, scale, weights)
- **Samplers**: Input (time) and output (values) accessors with interpolation mode (LINEAR, STEP, CUBICSPLINE)
- **Time Values**: Input accessor must contain sorted, non-negative time values
- **Output Matching**: Output accessor count and type must match path requirements

## Development Workflow

### Initial Setup
1. Clone repository: `git clone https://github.com/decentraland/gltf-validator-ts.git`
2. Install dependencies: `npm install`
3. Run tests: `npm test` (should pass all 609+ tests)
4. Run example: `npm run example`

### Development Cycle
1. **Make Changes**: Edit TypeScript files in `src/` directory
2. **Type Check**: `npm run typecheck` (must have zero errors)
3. **Lint**: `npm run lint` (auto-fix with `npm run lint:fix`)
4. **Format**: `npm run format` (auto-format all code)
5. **Test**: `npm test` (must pass all tests) or `npm run test:watch` (watch mode)
6. **Build**: `npm run build` (generates ESM, CJS, and version file)
7. **Commit**: Follow semantic commit conventions (see CONTRIBUTING.md)

### Testing Strategy
- **Unit Tests**: Test individual validators and utility functions
- **Integration Tests**: Test complete validation workflows
- **Compatibility Tests**: Ensure behavior matches Khronos validator (609+ test cases)
- **Coverage**: Aim for high coverage (tracked via Vitest coverage)
- **Test Locations**: `test/base/` (core), `test/specs/` (features), `test/ext/` (extensions)

### Build Outputs
- **ESM**: `dist/esm/` - ES modules for modern bundlers and Node.js with `"type": "module"`
- **CJS**: `dist/cjs/` - CommonJS for older Node.js and require() syntax
- **Web**: `web/scripts/gltf-validator.js` - Browser bundle (IIFE format)
- **Types**: `dist/esm/*.d.ts` - TypeScript definition files

### Publishing Process
1. **Version Bump**: Automated via semantic-version action based on commit messages
   - `feat:` → minor version bump
   - `fix:` → patch version bump
   - `breaking:` → major version bump
2. **Build**: Run full build including web bundle
3. **Pack**: Create npm package tarball
4. **GitHub Release**: Upload package to GitHub Releases (pre-release by default)
5. **npm Publish**: Publish to npm registry (only on main branch)
6. **GitHub Pages**: Deploy web demo to `https://decentraland.github.io/gltf-validator-ts/<branch>`

### Common Development Tasks

| Task | Command | Notes |
|------|---------|-------|
| Install dependencies | `npm install` | Run after clone or package.json changes |
| Run tests | `npm test` | Runs all 609+ test cases |
| Watch tests | `npm run test:watch` | Auto-reruns tests on changes |
| Test coverage | `npm run test:coverage` | Generates coverage report |
| Type check | `npm run typecheck` | TypeScript type checking only |
| Lint | `npm run lint` | Check code style |
| Auto-fix lint | `npm run lint:fix` | Fix lint issues automatically |
| Format code | `npm run format` | Format with Prettier |
| Build library | `npm run build` | Build ESM + CJS outputs |
| Build web | `npm run build:web` | Build browser bundle |
| Clean build | `npm run build:clean` | Remove dist/ and rebuild |
| Run example | `npm run example` | Run basic validation example |
| Full pre-publish | `npm run prepublishOnly` | Build + test + lint (runs before publish) |

## Architecture Notes

### Core Validators
- **GLTFValidator**: Main validator class orchestrating all validation
- **AssetValidator**: Validates asset metadata (version, generator, etc.)
- **SceneValidator**: Validates scene hierarchy and node references
- **NodeValidator**: Validates transforms, children, mesh/camera/skin references
- **MeshValidator**: Validates primitives, attributes, materials
- **MaterialValidator**: Validates PBR properties and texture references
- **TextureValidator**: Validates texture/sampler/image chains
- **AnimationValidator**: Validates channels, samplers, and targets
- **SkinValidator**: Validates joint hierarchy and inverse bind matrices
- **AccessorValidator**: Validates buffer access patterns and bounds
- **BufferValidator**: Validates buffer references and GLB binary chunks

### Validation Flow
1. **Parse**: Parse GLTF JSON or GLB binary
2. **Structural Validation**: Check required properties and types
3. **Reference Resolution**: Build dependency graph and resolve indices
4. **Semantic Validation**: Check constraints and relationships
5. **Extension Validation**: Validate extension-specific requirements
6. **Issue Collection**: Aggregate all validation messages
7. **Filtering**: Apply maxIssues, ignoredIssues, onlyIssues filters
8. **Return**: Return ValidationResult with filtered issues

### Error Reporting
- **JSON Pointer**: Uses RFC 6901 JSON Pointer syntax for error locations (e.g., `/meshes/0/primitives/1/attributes/POSITION`)
- **Issue Code**: Unique string identifier for each validation rule (e.g., `TYPE_MISMATCH`, `UNRESOLVED_REFERENCE`)
- **Message**: Human-readable description of the issue
- **Severity**: 0 (error), 1 (warning), 2 (info), 3 (hint)
- **Additional Context**: May include offset, length, or other relevant data

### Performance Considerations
- **Early Exit**: Validation stops after maxIssues reached
- **Lazy Evaluation**: Some expensive checks only run when needed
- **Memory Management**: Large buffers are not fully loaded into memory when possible
- **Streaming**: GLB parsing streams binary data rather than loading entire file
- **Caching**: Repeated validation of same file can reuse validator instance

## Security Considerations

### Input Validation
- **File Size Limits**: Implement size limits before validation to prevent DoS
- **Timeout Protection**: Wrap validation in timeout to prevent hanging on malformed files
- **Resource Limits**: Limit concurrent validations to prevent resource exhaustion

### External Resources
- **Default Disabled**: External resource loading is disabled by default
- **URI Validation**: Always validate URIs before loading (check domains, protocols, paths)
- **Size Limits**: Implement size limits for external resources
- **Error Handling**: Handle network errors gracefully without leaking information

### Known Safe Patterns
- **Zero Dependencies**: No runtime dependencies reduces supply chain attack surface
- **Prototype Pollution**: Uses `Object.create(null)` where needed
- **ReDoS**: No complex regex patterns in hot paths
- **JSON Parsing**: Uses native JSON.parse with try-catch

## Testing Notes

### Test Suite Structure
- **`test/base/`**: Core GLTF validation tests (asset, buffers, accessors, etc.)
- **`test/specs/`**: Feature-specific tests (animations, materials, meshes, skins, etc.)
- **`test/ext/`**: Extension tests (KHR_materials_*, KHR_lights_punctual, etc.)

### Test Format
Each test case is a JSON file with:
- **`gltf`**: The GLTF object to validate
- **`expectedIssues`**: Array of expected validation messages with code, message, severity, pointer
- **`resources`**: Optional binary resources for GLB tests

### Running Specific Tests
```bash
# Run all tests
npm test

# Run tests matching pattern
npm test -- test/specs/unit/

# Run single test file
npm test -- test/base/asset.test.ts

# Watch mode
npm run test:watch
```

### Adding New Tests
1. Create test file in appropriate directory (`test/base/`, `test/specs/`, `test/ext/`)
2. Follow naming convention: `<feature>.test.ts`
3. Use Vitest `describe` and `it` blocks
4. Include both positive (valid) and negative (invalid) test cases
5. Match expected issues format from Khronos validator

## Common Validation Scenarios

### Scenario 1: Basic Model Validation
```typescript
import { validateBytes } from '@dcl/gltf-validator-ts';
import fs from 'fs';

const buffer = fs.readFileSync('model.glb');
const result = await validateBytes(buffer, {
  uri: 'model.glb',
  maxIssues: 100
});

console.log(`Errors: ${result.issues.numErrors}`);
console.log(`Warnings: ${result.issues.numWarnings}`);
```

### Scenario 2: Strict Validation (Warnings as Errors)
```typescript
const validator = new GLTFValidator({
  severityOverrides: {
    // Make all warnings into errors
    'UNEXPECTED_PROPERTY': 0,
    'NODE_SKINNED_MESH_NON_ROOT': 0
  }
});
```

### Scenario 3: Custom Issue Filtering
```typescript
const validator = new GLTFValidator({
  ignoredIssues: ['UNUSED_OBJECT'], // Ignore unused objects
  onlyIssues: ['TYPE_MISMATCH', 'UNRESOLVED_REFERENCE'] // Only critical errors
});
```

### Scenario 4: External Resource Loading
```typescript
const validator = new GLTFValidator({
  externalResourceFunction: async (uri) => {
    // Load from file system or network
    const fullPath = path.resolve(baseDir, uri);
    return fs.readFileSync(fullPath);
  }
});
```

### Scenario 5: Batch Validation
```typescript
const validator = new GLTFValidator({ maxIssues: 50 });
const files = ['model1.glb', 'model2.glb', 'model3.glb'];

for (const file of files) {
  const buffer = fs.readFileSync(file);
  const result = await validateBytes(buffer);
  console.log(`${file}: ${result.issues.numErrors} errors`);
}
```

## Project Origin and Compatibility

### AI-Assisted Development
This validator was created through an AI-assisted development process:
1. **Test Suite Copy**: Copied 609+ test cases from Khronos glTF Validator
2. **Reverse Engineering**: Used AI to analyze test expectations and generate TypeScript implementation
3. **Iterative Development**: Built validator iteratively to pass all tests
4. **100% Compatibility**: Ensures identical behavior to original Dart validator

### Compatibility Guarantee
- **Test Coverage**: Passes all 609+ official Khronos validator tests
- **Behavioral Equivalence**: Produces identical validation results for all test cases
- **Issue Code Compatibility**: Uses same issue codes as original validator
- **Message Compatibility**: Validation messages match original format

### Differences from Original
- **Language**: TypeScript vs. Dart
- **Runtime**: Node.js/Browser vs. Dart VM
- **Performance**: Generally faster for small files, similar for large files
- **Dependencies**: Zero runtime dependencies vs. multiple Dart packages
- **Distribution**: npm package vs. standalone executable

## Useful Commands for AI Agents

```bash
# Validate a GLTF/GLB file
npx @dcl/gltf-validator-ts path/to/model.glb

# Install package
npm install @dcl/gltf-validator-ts

# Run example
npm run example

# Test validation logic
npm test

# Build all outputs
npm run build

# Type check
npm run typecheck

# Lint and format
npm run lint:fix && npm run format

# Generate test coverage
npm run test:coverage

# Update test report snapshots
npm run update-test-reports
```

## Related Resources

- **GLTF 2.0 Specification**: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- **GLTF Extension Registry**: https://github.com/KhronosGroup/glTF/tree/main/extensions
- **Original Khronos Validator**: https://github.com/KhronosGroup/glTF-Validator
- **npm Package**: https://www.npmjs.com/package/@dcl/gltf-validator-ts
- **Live Demo**: https://decentraland.github.io/gltf-validator-ts/main
- **GitHub Repository**: https://github.com/decentraland/gltf-validator-ts
