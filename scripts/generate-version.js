const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

// Generate version.ts file
const versionContent = `// This file is auto-generated during build. Do not edit manually.
export const VALIDATOR_VERSION = '${packageJson.version}';
`;

// Write to src/version.ts
fs.writeFileSync(
  path.join(__dirname, '../src/version.ts'),
  versionContent,
  'utf8'
);

console.log(`Generated version.ts with version ${packageJson.version}`);
