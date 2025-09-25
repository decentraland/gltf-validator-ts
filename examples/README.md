# GLTF Validator (TypeScript) Examples

This directory contains practical examples showing how to use GLTF Validator (TypeScript) in different scenarios.

## Examples

### Basic Model Validation

**Location**: `examples/basic/`

This example demonstrates comprehensive validation of a GLB model file with different validation configurations.

**Features shown**:
- Loading GLB files from disk
- Basic validation with `validateBytes()`
- Advanced validation with custom `GLTFValidator` settings
- Filtering results by severity
- Displaying detailed model information
- Error handling and reporting

**Run the examples**:
```bash
# From the project root
npx tsx examples/basic/validate-model.ts

# Or compile and run with Node.js
npm run build
node -r ts-node/register examples/basic/validate-model.ts
```

**Expected output**:
```
🎯 GLTF Validator (TypeScript) Example
==================================================
📂 Loading model: model.glb
📏 File size: 45.2 KB

1️⃣  BASIC VALIDATION
------------------------------
📊 Validation Summary:
   • Errors: 0
   • Warnings: 1
   • Info: 2
   • Total issues: 3

📝 Issues:
   1. ⚠️  WARNING: UNUSED_OBJECT
      This object may be unused.
      Location: /materials/0

   2. ℹ️  INFO: BUFFER_GLB_CHUNK_TOO_BIG
      GLB chunk has extra padding.
      Offset: 1234

2️⃣  STRICT VALIDATION
------------------------------
[... more detailed results ...]

4️⃣  MODEL INFORMATION
------------------------------
📋 Model Details:
   • GLTF Version: 2.0
   • MIME Type: model/gltf-binary
   • Resources: 3
   • Materials: 2
   • Animations: 1
   • Draw Calls: 4
   • Total Vertices: 1,248
   • Total Triangles: 832
   • Features: Textures, Default Scene
```

## Creating Your Own Examples

### Structure

```
examples/
├── your-example/
│   ├── model.gltf or model.glb
│   ├── validate-example.ts
│   └── README.md (optional)
```

### Template

Here's a basic template for creating new validation examples:

```typescript
import fs from 'fs';
import path from 'path';
import { validateBytes, GLTFValidator } from '../../src/index';

async function validateExample() {
  const modelPath = path.join(__dirname, 'your-model.glb');
  const modelData = fs.readFileSync(modelPath);

  try {
    const result = await validateBytes(modelData, {
      uri: path.basename(modelPath),
      maxIssues: 50
    });

    console.log(`Validation complete:`);
    console.log(`- Errors: ${result.issues.numErrors}`);
    console.log(`- Warnings: ${result.issues.numWarnings}`);
    console.log(`- Info: ${result.issues.numInfos}`);

    // Display issues
    result.issues.messages.forEach(msg => {
      const severity = ['ERROR', 'WARNING', 'INFO', 'HINT'][msg.severity];
      console.log(`${severity}: ${msg.code} - ${msg.message}`);
      if (msg.pointer) console.log(`  Location: ${msg.pointer}`);
    });

  } catch (error) {
    console.error('Validation failed:', error);
  }
}

validateExample();
```

## Validation Scenarios

The examples cover these common validation scenarios:

### 1. **Quality Assurance**
- Validate models before deployment
- Ensure compatibility with different renderers
- Check for performance issues

### 2. **Asset Pipeline Integration**
- Batch validation of multiple files
- Integration with build tools
- Automated quality checks

### 3. **Development Workflow**
- Real-time validation during development
- Custom validation rules for specific projects
- Debugging GLTF loading issues

### 4. **Extension Validation**
- Validating models with specific extensions
- Checking extension compatibility
- Custom extension validation rules

## Validation Options

### Basic Options
```typescript
const result = await validateBytes(data, {
  uri: 'model.glb',           // File identifier
  format: 'glb',              // Force format detection
  maxIssues: 100              // Limit number of issues reported
});
```

### Advanced Validator
```typescript
const validator = new GLTFValidator({
  maxIssues: 50,
  ignoredIssues: ['UNUSED_OBJECT'],     // Ignore specific codes
  onlyIssues: ['TYPE_MISMATCH'],        // Only report specific codes
  severityOverrides: {                   // Override severity levels
    'UNEXPECTED_PROPERTY': 0             // Make warnings into errors
  },
  externalResourceFunction: async (uri) => {
    // Custom resource loading
    return fs.readFileSync(path.resolve(baseDir, uri));
  }
});
```

## Common Issue Codes

### Errors (Severity 0)
- `TYPE_MISMATCH`: Property has wrong data type
- `UNRESOLVED_REFERENCE`: Reference to non-existent object
- `INVALID_VALUE`: Property value is invalid
- `BUFFER_MISSING_GLB_DATA`: GLB buffer missing binary data

### Warnings (Severity 1)
- `UNEXPECTED_PROPERTY`: Property not expected in location
- `BUFFER_GLB_CHUNK_TOO_BIG`: GLB chunk has extra padding
- `NODE_SKINNED_MESH_NON_ROOT`: Skinned mesh not at root level

### Info (Severity 2)
- `UNUSED_OBJECT`: Object is defined but not used
- `UNSUPPORTED_EXTENSION`: Extension not supported by validator

## Tips for Effective Validation

1. **Start with basic validation** to get an overview
2. **Use strict validation** for production assets
3. **Filter by severity** to focus on critical issues
4. **Check model information** to understand asset complexity
5. **Handle external resources** appropriately for your use case
6. **Customize severity levels** based on your project requirements

## Support

If you need help with validation or have questions about the examples:

1. Check the main README.md for API documentation
2. Look at the validation codes reference
3. Create an issue on GitHub for bug reports or feature requests
