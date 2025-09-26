#!/usr/bin/env node

/**
 * Script to update only the validatorVersion field in .report.json files
 * This preserves the reference validation data from the official Khronos validator
 * while updating the version to match our current package.json version.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// Helper function to recursively find all .report.json files
function findReportFiles(dir) {
  const files = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findReportFiles(fullPath));
      } else if (item.endsWith('.report.json')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }

  return files;
}

function updateReportVersion(reportPath) {
  try {
    // Read the existing report
    const reportData = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(reportData);

    // Check if validatorVersion exists
    if (!report.hasOwnProperty('validatorVersion')) {
      console.log(`⚠️  Skipping ${reportPath} (no validatorVersion field)`);
      return false;
    }

    const oldVersion = report.validatorVersion;

    // Update only the validatorVersion field
    report.validatorVersion = packageJson.version;

    // Write back the report with updated version
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 4));

    console.log(`✅ Updated ${reportPath}: ${oldVersion} → ${packageJson.version}`);
    return true;

  } catch (error) {
    console.error(`❌ Failed to process ${reportPath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log(`🔧 Updating validatorVersion to ${packageJson.version} in test report files...\n`);

  const testDirs = ['test/base/data', 'test/ext'];
  let totalFiles = 0;
  let successCount = 0;

  for (const testDir of testDirs) {
    if (!fs.existsSync(testDir)) {
      console.log(`⚠️  Skipping ${testDir} (not found)`);
      continue;
    }

    console.log(`📁 Processing ${testDir}...`);
    const reportFiles = findReportFiles(testDir);
    totalFiles += reportFiles.length;

    for (const reportPath of reportFiles) {
      if (updateReportVersion(reportPath)) {
        successCount++;
      }
    }
  }

  console.log(`\n🎉 Completed! Updated ${successCount}/${totalFiles} report files.`);

  if (successCount < totalFiles) {
    console.log(`⚠️  ${totalFiles - successCount} files had errors or were skipped.`);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node scripts/update-test-reports.js

This script updates ONLY the validatorVersion field in .report.json files
to match the current package.json version. This preserves the reference
validation data from the official Khronos validator.

When to use:
1. After bumping the package version
2. When setting up the project for the first time
3. When you need all test reports to have consistent version numbers

What it does:
- Finds all .report.json files in test/base/data and test/ext
- Updates only the "validatorVersion" field to match package.json
- Preserves all other validation data (issues, messages, etc.)
- Maintains the exact JSON formatting

What it does NOT do:
- Does NOT regenerate validation results
- Does NOT modify issues, messages, or other test data
- Does NOT run the validator on any files
`);
  process.exit(0);
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});