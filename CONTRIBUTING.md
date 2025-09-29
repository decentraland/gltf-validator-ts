# Contributing to GLTF Validator (TypeScript)

Thank you for your interest in contributing to GLTF Validator (TypeScript)! This project welcomes contributions from the community.

## Important Note

This project is a TypeScript implementation based on the official [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator). The validation logic and test suite are derived from the original repository to ensure compatibility.

## How to Contribute

### Types of Contributions

1. **Bug Reports** - Report issues with validation accuracy or TypeScript compilation
2. **Feature Requests** - Suggest improvements to the TypeScript implementation
3. **Documentation** - Improve examples, README, or API documentation
4. **Code Contributions** - Fix bugs, improve performance, or enhance TypeScript support

### Before You Start

- Check existing issues to avoid duplicates
- For major changes, create an issue first to discuss the approach
- Ensure your contribution maintains compatibility with the original validator behavior

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/decentraland/gltf-validator-ts.git
   cd gltf-validator-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

4. **Try the example**
   ```bash
   npm run example
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript best practices
   - Add tests for new functionality
   - Update documentation as needed

3. **Run the quality checks**
   ```bash
   npm run build        # Ensure TypeScript compiles
   npm test             # Run all tests
   npm run lint         # Check code style
   npm run format       # Format code
   ```

4. **Test with examples**
   ```bash
   npm run example      # Test with the included model
   ```

### Code Standards

- **TypeScript**: Use strict TypeScript with full type definitions
- **Formatting**: Code is automatically formatted with Prettier
- **Linting**: Follow ESLint rules for consistency
- **Testing**: Maintain 100% test compatibility with original validator

### Validation Logic

When modifying validation logic:

1. **Preserve compatibility** - The validator must pass all existing tests
2. **Reference original behavior** - Check the Khronos validator for expected behavior
3. **Test thoroughly** - Ensure changes don't break existing validation accuracy
4. **Document changes** - Explain any deviations from the original implementation

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test files
npm test test/specs/unit/gltf-validator.test.ts
```

### Test Structure

- **Unit tests**: Test individual validators and components
- **Integration tests**: Test complete validation workflows
- **Compatibility tests**: Ensure behavior matches original validator

### Adding Tests

When adding new functionality:

1. Add unit tests for the specific component
2. Add integration tests for end-to-end workflows
3. Ensure tests match expected behavior from the original validator
4. Include both positive and negative test cases

## Submitting Changes

### Pull Request Process

1. **Update documentation** if your changes affect the public API
2. **Add tests** for any new functionality
3. **Ensure all checks pass**
   ```bash
   npm run prepublishOnly  # Runs build, test, and lint
   ```
4. **Create a clear pull request** with:
   - Description of changes
   - Motivation for the changes
   - Testing performed
   - Any breaking changes

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] All existing tests pass
- [ ] New tests added for functionality
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## Code Review

All contributions go through code review to ensure:

- **Quality**: Code meets project standards
- **Compatibility**: Changes maintain validator behavior
- **Documentation**: Changes are properly documented
- **Testing**: Adequate test coverage

## Getting Help

- **Questions**: Create an issue with the "question" label
- **Bugs**: Create an issue with detailed reproduction steps
- **Features**: Create an issue to discuss before implementing

## Recognition

Contributors are recognized in:
- Release notes for their contributions
- GitHub contributors list
- Project acknowledgments

Thank you for contributing to make GLTF validation better for everyone!
