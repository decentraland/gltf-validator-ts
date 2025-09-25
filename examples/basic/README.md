# Basic GLTF Validation Example

This example demonstrates how to validate a GLB model file using GLTF Validator (TypeScript).

## Your Model

**File**: `model.glb`
**Size**: ~8 MB
**Features**: Textured 3D model with ~9,242 vertices and ~9,992 triangles

## Running the Example

```bash
# Run TypeScript version directly
npx tsx validate-model.ts
```

## What the Example Shows

The example validates your model with three different approaches:

### 1. **Basic Validation**
- Uses the simple `validateBytes()` function
- Shows the most straightforward way to validate a GLB file
- Reports validation issues found in your model

### 2. **Custom Validation**
- Demonstrates using the `GLTFValidator` class
- Shows how to configure validation options
- Uses custom severity overrides

### 3. **Model Information**
- Displays detailed information about your model
- Shows vertex count, triangle count, features, etc.
- Lists resources and their sizes

## Your Model's Validation Results

Based on the output, your model has:

✅ **No Errors** - The model is structurally valid
⚠️ **1 Warning** - Missing tangent space data (common, not critical)
ℹ️ **1 Info** - Default transform matrix specified (optimization suggestion)

### Issues Found:

1. **MESH_PRIMITIVE_GENERATED_TANGENT_SPACE** (Warning)
   - Your material needs tangent space for normal mapping
   - The mesh doesn't provide tangent vectors
   - Runtime-generated tangents may vary between renderers
   - **Fix**: Include tangent vectors in your model export

2. **NODE_MATRIX_DEFAULT** (Info)
   - A node has an identity matrix specified explicitly
   - This is redundant since identity is the default
   - **Fix**: Remove the default matrix to reduce file size

## Model Statistics

Your model contains:
- **9,242 vertices** - Good polygon count for most use cases
- **9,992 triangles** - Well-optimized mesh density
- **1 material** - Simple material setup
- **1 texture** - Single texture map
- **1 UV set** - Standard UV mapping
- **Single mesh** with one primitive
- **Default scene** - Properly structured for rendering

## Understanding the Output

### Severity Levels
- ❌ **ERROR** (0): Must be fixed - will cause rendering issues
- ⚠️ **WARNING** (1): Should be fixed - may cause issues in some renderers
- ℹ️ **INFO** (2): Optimization suggestions - model works fine but could be improved
- 💡 **HINT** (3): Best practice suggestions

### Location Pointers
- `/meshes/0/primitives/0/material` - Points to the material reference in the first primitive
- `/nodes/0/matrix` - Points to the matrix property of the first node

## Customizing the Example

You can modify the validation parameters in `validate-model.ts`:

```typescript
// Change validation limits
const result = await validateBytes(modelData, {
  maxIssues: 100,  // Show more issues
  format: 'glb'    // Force GLB format
});

// Create custom validator
const validator = new GLTFValidator({
  maxIssues: 50,
  ignoredIssues: ['NODE_MATRIX_DEFAULT'], // Ignore default matrix info
  severityOverrides: {
    'MESH_PRIMITIVE_GENERATED_TANGENT_SPACE': 2 // Make warning into info
  }
});
```

## Next Steps

1. **Fix the tangent space warning** by including tangent vectors in your model export
2. **Remove the default matrix** to slightly reduce file size
3. **Try with your own models** by replacing `model.glb`
4. **Experiment with validation options** to suit your project needs

Your model is in excellent shape overall - the issues found are minor optimizations rather than critical problems!
