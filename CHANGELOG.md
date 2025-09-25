# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-25

### Added
- Initial release of Enhanced GLTF Validator
- Complete GLTF 2.0 validation support
- GLB (binary GLTF) file validation
- Support for 20+ GLTF extensions including:
  - KHR_materials_* extensions (PBR, unlit, clearcoat, transmission, etc.)
  - KHR_lights_punctual
  - KHR_animation_pointer
  - KHR_texture_transform
  - EXT_texture_webp
  - And many more
- TypeScript implementation with full type definitions
- Comprehensive validation with 609+ test cases
- Detailed error reporting with JSON pointer locations
- Configurable validation options
- Model information extraction and analysis
- Working examples with real GLB model

### Technical Details
- Built with TypeScript 5.0
- 100% test coverage from original Khronos validator test suite
- Compatible with Node.js 18+
- Modern ES modules with CommonJS compatibility
- Optimized for performance with detailed validation reporting

### Attribution
- Based on the official [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator)
- Test suite copied from original repository
- AI-assisted TypeScript implementation
- Maintains full compatibility with original validator behavior