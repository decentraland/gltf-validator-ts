# GLTF Validator

A comprehensive GLTF/GLB validator implementation in TypeScript that validates GLTF and GLB files according to the GLTF 2.0 specification.

## Features

- **Full GLTF 2.0 Support**: Validates all GLTF 2.0 objects and properties
- **GLB Support**: Validates binary GLTF files
- **Comprehensive Validation**: Checks for errors, warnings, info, and hints
- **TypeScript**: Fully typed implementation
- **Configurable**: Support for custom validation options
- **External Resources**: Support for loading external buffer files

## Installation

```bash
npm install gltf-validator
```

## Usage

### Basic Usage

```typescript
import { validateBytes } from 'gltf-validator';
import fs from 'fs';

const data = fs.readFileSync('model.gltf');
const result = await validateBytes(new Uint8Array(data));

console.log(JSON.stringify(result, null, 2));
```

### Advanced Usage

```typescript
import { validateBytes, Severity } from 'gltf-validator';
import fs from 'fs';
import path from 'path';

const filename = 'Box.gltf';
const fullpath = path.join(__dirname, filename);
const asset = fs.readFileSync(fullpath);

const result = await validateBytes(new Uint8Array(asset), {
    uri: filename,
    format: 'gltf', // skip auto-detection and parse as glTF JSON
    maxIssues: 10, // limit max number of output issues to 10
    ignoredIssues: ['UNSUPPORTED_EXTENSION'], // mute UNSUPPORTED_EXTENSION issue
    onlyIssues: ['ACCESSOR_INVALID_FLOAT'], // only consider ACCESSOR_INVALID_FLOAT an issue
    severityOverrides: {
        'ACCESSOR_INDEX_TRIANGLE_DEGENERATE': Severity.ERROR
    }, // treat degenerate triangles as errors
    externalResourceFunction: (uri) =>
        new Promise((resolve, reject) => {
            uri = path.resolve(path.dirname(fullpath), decodeURIComponent(uri));
            console.info("Loading external file: " + uri);
            fs.readFile(uri, (err, data) => {
                if (err) {
                    console.error(err.toString());
                    reject(err.toString());
                    return;
                }
                resolve(data);
            });
        })
});

console.log(JSON.stringify(result, null, 2));
```

## API Reference

### `validateBytes(data: Uint8Array, options?: ValidationOptions): Promise<ValidationResult>`

Validates GLTF/GLB data and returns a validation report.

#### Parameters

- `data`: The GLTF/GLB file data as a Uint8Array
- `options`: Optional validation configuration

#### Options

- `uri`: The URI of the file (for reference in error messages)
- `format`: Force format detection ('gltf' or 'glb')
- `maxIssues`: Maximum number of issues to report
- `ignoredIssues`: Array of issue codes to ignore
- `onlyIssues`: Array of issue codes to only consider
- `severityOverrides`: Object mapping issue codes to severity levels
- `externalResourceFunction`: Function to load external resources

#### Returns

A `ValidationResult` object containing:

- `uri`: The URI of the validated file
- `mimeType`: The detected MIME type
- `validatorVersion`: The validator version
- `issues`: Validation issues summary and messages
- `info`: Information about the GLTF structure

### Types

#### `ValidationResult`

```typescript
interface ValidationResult {
  uri: string;
  mimeType: string;
  validatorVersion: string;
  issues: Issues;
  info: ValidationInfo;
}
```

#### `Issues`

```typescript
interface Issues {
  numErrors: number;
  numWarnings: number;
  numInfos: number;
  numHints: number;
  messages: ValidationMessage[];
  truncated: boolean;
}
```

#### `ValidationMessage`

```typescript
interface ValidationMessage {
  code: string;
  message: string;
  severity: Severity;
  pointer: string;
}
```

#### `Severity`

```typescript
enum Severity {
  ERROR = 0,
  WARNING = 1,
  INFO = 2,
  HINT = 3
}
```

## Validation Features

### Asset Validation
- Version format validation
- MinVersion validation
- Unexpected properties detection

### Buffer Validation
- URI format validation (data URIs, external URIs)
- Byte length validation
- MIME type validation for data URIs

### BufferView Validation
- Buffer reference validation
- Alignment requirements
- Stride validation
- Target validation

### Accessor Validation
- Component type validation
- Type validation (SCALAR, VEC2, VEC3, etc.)
- Alignment requirements
- Bounds checking
- Sparse accessor validation

### Animation Validation
- Channel validation
- Sampler validation
- Target validation
- Interpolation validation

### Node Validation
- Reference validation (camera, mesh, skin)
- Children validation
- Transform validation

### Mesh Validation
- Primitive validation
- Attribute validation
- Indices validation
- Material reference validation

### Material Validation
- Alpha mode validation
- Alpha cutoff validation
- PBR properties validation

### Texture Validation
- Source validation
- Sampler validation

### Image Validation
- BufferView reference validation
- URI validation

### Sampler Validation
- Filter validation
- Wrap mode validation

### Camera Validation
- Type validation
- Projection parameters validation

### Scene Validation
- Node reference validation

### Skin Validation
- Joint validation
- Inverse bind matrices validation
- Skeleton validation

## Error Codes

The validator reports various error codes including:

- `UNDEFINED_PROPERTY`: Required property is missing
- `TYPE_MISMATCH`: Property has wrong type
- `INVALID_VALUE`: Property has invalid value
- `UNRESOLVED_REFERENCE`: References non-existent object
- `ACCESSOR_OFFSET_ALIGNMENT`: Accessor offset alignment issue
- `ACCESSOR_TOO_LONG`: Accessor extends beyond buffer bounds
- `INVALID_URI`: Invalid URI format
- `UNUSED_OBJECT`: Object may be unused
- `UNEXPECTED_PROPERTY`: Unexpected property found
- And many more...

## Building

```bash
npm install
npm run build
```

## Testing

```bash
npm test
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
