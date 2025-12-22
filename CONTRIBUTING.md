# Contributing to GLTF Validator (TypeScript)

Thank you for your interest in contributing to GLTF Validator (TypeScript)! This project welcomes contributions from the community.

## Table of Contents

- [Important Note](#important-note)
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Types of Contributions](#types-of-contributions)
  - [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
  - [Making Changes](#making-changes)
  - [Code Standards](#code-standards)
  - [Validation Logic](#validation-logic)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Format](#format)
  - [Types](#types)
  - [Examples](#examples)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Test Structure](#test-structure)
  - [Adding Tests](#adding-tests)
- [Submitting Changes](#submitting-changes)
  - [Pull Request Process](#pull-request-process)
  - [Pull Request Template](#pull-request-template)
- [Code Review](#code-review)
- [Getting Help](#getting-help)
- [Recognition](#recognition)

## Important Note

This project is a TypeScript implementation based on the official [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator). The validation logic and test suite are derived from the original repository to ensure compatibility.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, issues, and other contributions that do not align with this Code of Conduct. Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by creating an issue.

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
- **Naming Conventions**:
  - Classes and interfaces: `PascalCase`
  - Functions and variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private members: Prefix with underscore `_privateMember`

### Validation Logic

When modifying validation logic:

1. **Preserve compatibility** - The validator must pass all existing tests
2. **Reference original behavior** - Check the Khronos validator for expected behavior
3. **Test thoroughly** - Ensure changes don't break existing validation accuracy
4. **Document changes** - Explain any deviations from the original implementation

## Commit Message Guidelines

We follow **semantic commit messages** to maintain a clear project history and enable automated changelog generation.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Components:**
- **type**: The type of change (see below)
- **scope**: Optional area of change (e.g., `validator`, `parser`, `docs`)
- **subject**: Brief description (imperative mood, lowercase, no period)
- **body**: Optional detailed description
- **footer**: Optional metadata (Breaking changes, issue references)

### Types

- **feat**: New feature or enhancement
  - Example: `feat(validator): add support for KHR_materials_variants`
- **fix**: Bug fix
  - Example: `fix(parser): resolve GLB chunk parsing issue`
- **docs**: Documentation changes
  - Example: `docs(readme): add troubleshooting section`
- **style**: Code style changes (formatting, semicolons, etc.)
  - Example: `style: apply prettier formatting`
- **refactor**: Code refactoring without feature changes
  - Example: `refactor(validator): simplify extension validation logic`
- **perf**: Performance improvements
  - Example: `perf(parser): optimize buffer reading`
- **test**: Adding or updating tests
  - Example: `test: add tests for texture validation`
- **chore**: Build process, tooling, dependencies
  - Example: `chore: update vitest to v2.1.9`
- **breaking**: Breaking changes (can be combined with other types)
  - Example: `breaking(api): change GLTFValidator constructor signature`

### Examples

**Simple commit:**
```
feat: add GLB binary chunk validation
```

**With scope:**
```
fix(validator): correct accessor bounds checking
```

**Multi-line with body:**
```
feat(extensions): add KHR_materials_specular support

- Implement specular workflow validation
- Add tests from official test suite
- Update documentation

Closes #42
```

**Breaking change:**
```
breaking(api): change validate() return type

BREAKING CHANGE: validate() now returns Promise<ValidationResult>
instead of ValidationResult. Update all async calls accordingly.

Migration:
- Before: const result = validator.validate(gltf)
- After: const result = await validator.validate(gltf)
```

**Multiple issues:**
```
fix(parser): resolve multiple GLB parsing issues

- Fix magic number validation
- Correct chunk length calculation
- Handle padding bytes properly

Fixes #23, #24, #25
```

### Commit Message Best Practices

1. **Use imperative mood**: "add feature" not "added feature"
2. **Keep subject < 50 characters**: Be concise
3. **Capitalize subject**: Start with capital letter
4. **No period at end of subject**: `feat: add test` not `feat: add test.`
5. **Separate subject from body**: Use blank line
6. **Wrap body at 72 characters**: For readability
7. **Explain what and why, not how**: Code shows how, commit shows why

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
