#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { validateBytes, GLTFValidator, GLBValidator } from '../../src/index';

/**
 * Example: Validating a GLB model file
 *
 * This example demonstrates how to:
 * 1. Load a GLB file from disk
 * 2. Validate it with different configurations
 * 3. Display detailed validation results
 */

const modelPath = path.join(__dirname, 'model.glb');

async function validateModel() {
  console.log('🎯 Enhanced GLTF Validator Example');
  console.log('='.repeat(50));

  // Check if model file exists
  if (!fs.existsSync(modelPath)) {
    console.error(`❌ Model file not found: ${modelPath}`);
    process.exit(1);
  }

  // Load the GLB file
  console.log(`📂 Loading model: ${path.basename(modelPath)}`);
  const modelData = fs.readFileSync(modelPath);
  const fileSize = (modelData.length / 1024).toFixed(2);
  console.log(`📏 File size: ${fileSize} KB`);
  console.log();

  try {
    // Example 1: Basic validation
    console.log('1️⃣  BASIC VALIDATION');
    console.log('-'.repeat(30));

    const basicResult = await validateBytes(modelData, {
      uri: path.basename(modelPath),
      format: 'glb',
      maxIssues: 50
    });

    displayResults(basicResult);
    console.log();

    // Example 2: Strict validation with custom settings
    console.log('2️⃣  STRICT VALIDATION');
    console.log('-'.repeat(30));

    const strictValidator = new GLTFValidator({
      maxIssues: 100,
      ignoredIssues: [], // Don't ignore any issues
      severityOverrides: {
        'UNUSED_OBJECT': 1, // Make unused objects warnings instead of info
        'UNEXPECTED_PROPERTY': 0 // Make unexpected properties errors
      }
    });

    const strictResult = await strictValidator.validate(
      await parseGLBFile(modelData)
    );

    displayValidatorResults(strictResult);
    console.log();

    // Example 3: Focused validation (only errors and warnings)
    console.log('3️⃣  FOCUSED VALIDATION (Errors & Warnings Only)');
    console.log('-'.repeat(50));

    const focusedValidator = new GLTFValidator({
      maxIssues: 20,
      onlyIssues: [] // Show all issues, but we'll filter in display
    });

    const focusedResult = await focusedValidator.validate(
      await parseGLBFile(modelData)
    );

    displayFilteredResults(focusedResult, [0, 1]); // Only errors and warnings
    console.log();

    // Example 4: Model information summary
    console.log('4️⃣  MODEL INFORMATION');
    console.log('-'.repeat(30));
    displayModelInfo(basicResult);

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Helper function to parse GLB file (for validator examples)
async function parseGLBFile(data: Uint8Array) {
  const result = await GLBValidator.parseGLB(data);
  return result.gltf;
}

// Display results from validateBytes function
function displayResults(result: any) {
  const { issues, info } = result;

  console.log(`📊 Validation Summary:`);
  console.log(`   • Errors: ${issues.numErrors}`);
  console.log(`   • Warnings: ${issues.numWarnings}`);
  console.log(`   • Info: ${issues.numInfos}`);
  console.log(`   • Total issues: ${issues.messages.length}`);

  if (issues.messages.length === 0) {
    console.log('✅ No validation issues found!');
    return;
  }

  console.log('\n📝 Issues:');
  issues.messages.forEach((msg: any, index: number) => {
    const severityIcon = ['❌', '⚠️', 'ℹ️', '💡'][msg.severity] || '❓';
    const severityName = ['ERROR', 'WARNING', 'INFO', 'HINT'][msg.severity] || 'UNKNOWN';

    console.log(`   ${index + 1}. ${severityIcon} ${severityName}: ${msg.code}`);
    console.log(`      ${msg.message}`);
    if (msg.pointer) {
      console.log(`      Location: ${msg.pointer}`);
    }
    if (msg.offset !== undefined) {
      console.log(`      Offset: ${msg.offset}`);
    }
  });
}

// Display results from GLTFValidator
function displayValidatorResults(result: any) {
  const { issues } = result;

  console.log(`📊 Validation Summary:`);
  console.log(`   • Errors: ${issues.numErrors}`);
  console.log(`   • Warnings: ${issues.numWarnings}`);
  console.log(`   • Info: ${issues.numInfos}`);
  console.log(`   • Total issues: ${issues.messages.length}`);

  if (issues.messages.length === 0) {
    console.log('✅ No validation issues found!');
    return;
  }

  console.log('\n📝 Issues:');
  issues.messages.forEach((msg: any, index: number) => {
    const severityIcon = ['❌', '⚠️', 'ℹ️', '💡'][msg.severity] || '❓';
    const severityName = ['ERROR', 'WARNING', 'INFO', 'HINT'][msg.severity] || 'UNKNOWN';

    console.log(`   ${index + 1}. ${severityIcon} ${severityName}: ${msg.code}`);
    console.log(`      ${msg.message}`);
    if (msg.pointer) {
      console.log(`      Location: ${msg.pointer}`);
    }
  });
}

// Display filtered results (only certain severity levels)
function displayFilteredResults(result: any, allowedSeverities: number[]) {
  const { issues } = result;
  const filteredMessages = issues.messages.filter((msg: any) =>
    allowedSeverities.includes(msg.severity)
  );

  const errorCount = filteredMessages.filter((msg: any) => msg.severity === 0).length;
  const warningCount = filteredMessages.filter((msg: any) => msg.severity === 1).length;

  console.log(`📊 Critical Issues Summary:`);
  console.log(`   • Errors: ${errorCount}`);
  console.log(`   • Warnings: ${warningCount}`);

  if (filteredMessages.length === 0) {
    console.log('✅ No critical issues found!');
    return;
  }

  console.log('\n🚨 Critical Issues:');
  filteredMessages.forEach((msg: any, index: number) => {
    const severityIcon = ['❌', '⚠️'][msg.severity] || '❓';
    const severityName = ['ERROR', 'WARNING'][msg.severity] || 'UNKNOWN';

    console.log(`   ${index + 1}. ${severityIcon} ${severityName}: ${msg.code}`);
    console.log(`      ${msg.message}`);
    if (msg.pointer) {
      console.log(`      Location: ${msg.pointer}`);
    }
  });
}

// Display model information
function displayModelInfo(result: any) {
  const { info } = result;

  console.log(`📋 Model Details:`);
  console.log(`   • GLTF Version: ${info.version}`);
  console.log(`   • MIME Type: ${result.mimeType}`);
  console.log(`   • Resources: ${info.resources.length}`);
  console.log(`   • Materials: ${info.materialCount}`);
  console.log(`   • Animations: ${info.animationCount}`);
  console.log(`   • Draw Calls: ${info.drawCallCount}`);
  console.log(`   • Total Vertices: ${info.totalVertexCount.toLocaleString()}`);
  console.log(`   • Total Triangles: ${info.totalTriangleCount.toLocaleString()}`);
  console.log(`   • Max UV Sets: ${info.maxUVs}`);
  console.log(`   • Max Influences: ${info.maxInfluences}`);
  console.log(`   • Max Attributes: ${info.maxAttributes}`);

  const features = [];
  if (info.hasMorphTargets) features.push('Morph Targets');
  if (info.hasSkins) features.push('Skinning');
  if (info.hasTextures) features.push('Textures');
  if (info.hasDefaultScene) features.push('Default Scene');

  if (features.length > 0) {
    console.log(`   • Features: ${features.join(', ')}`);
  }

  console.log('\n📦 Resources:');
  info.resources.forEach((resource: any, index: number) => {
    const sizeKB = resource.byteLength ? (resource.byteLength / 1024).toFixed(2) : 'unknown';
    console.log(`   ${index + 1}. ${resource.mimeType || 'unknown'} (${sizeKB} KB)`);
    if (resource.uri) {
      console.log(`      URI: ${resource.uri}`);
    }
  });
}

// Run the example
if (require.main === module) {
  validateModel().catch(console.error);
}

export { validateModel };
