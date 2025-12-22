# Security Policy

## Table of Contents

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
  - [How to Report](#how-to-report)
  - [What to Include](#what-to-include)
  - [What We Do](#what-we-do)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Known Security Considerations](#known-security-considerations)
- [Dependency Security](#dependency-security)
- [Attribution](#attribution)
- [Contact](#contact)

## Supported Versions

We release security updates for the following versions:

| Version | Supported          | Notes                           |
| ------- | ------------------ | ------------------------------- |
| 1.0.x   | :white_check_mark: | Current stable release          |
| < 1.0   | :x:                | Please upgrade to 1.0.x or later|

**Update Policy**: We recommend always using the latest version to ensure you have the most recent security patches and bug fixes.

## Reporting a Vulnerability

If you discover a security vulnerability in GLTF Validator (TypeScript), please report it privately to help us address it before public disclosure.

### How to Report

- **Email**: Create an issue on GitHub with the title starting with `[SECURITY]`
- **Response Time**: We aim to respond to security reports within 48 hours
- **Disclosure Timeline**: We will work with you to address the issue and coordinate responsible disclosure

### What to Include

Please include the following information in your security report:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up questions

### What We Do

When we receive a security report, we will:

1. **Acknowledge** receipt within 48 hours
2. **Investigate** the reported vulnerability
3. **Develop** and test a fix
4. **Release** a patched version
5. **Publicly disclose** the vulnerability after the fix is available

### Security Considerations

This validator processes potentially untrusted GLTF/GLB files. While we strive for security, please be aware:

- **File Processing**: The validator parses binary and JSON data from uploaded files
- **Memory Usage**: Large files may consume significant memory during validation
- **External Resources**: GLB files may reference external resources (if external resource loading is enabled)

### Best Practices

When using this validator in production:

#### 1. Input Validation
- **Validate file sizes** before processing to prevent resource exhaustion
  ```typescript
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  ```

#### 2. Timeout Protection
- **Use timeouts** for validation operations to prevent DoS
  ```typescript
  const validateWithTimeout = (gltf, timeout = 5000) => {
    return Promise.race([
      validator.validate(gltf),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Validation timeout')), timeout)
      )
    ]);
  };
  ```

#### 3. Resource Limits
- **Limit concurrent validations** to prevent resource exhaustion
  ```typescript
  // Use a queue or semaphore to limit concurrent operations
  const maxConcurrent = 5;
  ```

#### 4. Path Sanitization
- **Sanitize file paths** when processing multiple files
  ```typescript
  const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
  ```

#### 5. External Resources
- **Be cautious** with external resource loading in production
  ```typescript
  const validator = new GLTFValidator({
    externalResourceFunction: async (uri) => {
      // Validate URI is from trusted domain
      if (!isTrustedDomain(uri)) {
        throw new Error('Untrusted resource');
      }
      // Implement size limits
      const response = await fetch(uri);
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > MAX_RESOURCE_SIZE) {
        throw new Error('Resource too large');
      }
      return new Uint8Array(await response.arrayBuffer());
    }
  });
  ```

#### 6. Error Handling
- **Handle errors gracefully** to prevent information leakage
  ```typescript
  try {
    const result = await validator.validate(gltf);
  } catch (error) {
    // Log detailed error internally
    logger.error('Validation failed', error);
    // Return generic error to user
    throw new Error('Validation failed');
  }
  ```

## Known Security Considerations

### Memory Consumption
- **Large Files**: Validation of files > 50MB can consume significant memory
- **Mitigation**: Implement file size limits and memory monitoring
- **Impact**: Potential DoS if many large files are validated concurrently

### External Resource Loading
- **Risk**: GLB files may reference external URIs
- **Mitigation**: Disable or strictly control external resource loading
- **Default Behavior**: External resources are NOT loaded by default

### Prototype Pollution
- **Status**: Not vulnerable
- **Protection**: All object creation uses `Object.create(null)` where applicable
- **Verification**: Tested against common prototype pollution vectors

### Regular Expression DoS (ReDoS)
- **Status**: Not vulnerable
- **Protection**: All regex patterns are tested for performance
- **Verification**: No complex regex patterns used in hot paths

### JSON Parsing
- **Risk**: Malformed JSON could cause parser issues
- **Mitigation**: Uses native JSON.parse with try-catch
- **Validation**: Additional validation after parsing

## Dependency Security

### Monitoring
We actively monitor dependencies for security vulnerabilities using:
- **GitHub Dependabot**: Automated security updates
- **npm audit**: Regular security audits
- **Snyk**: Continuous vulnerability scanning (when available)

### Update Policy
- **Critical vulnerabilities**: Patched within 24 hours
- **High severity**: Patched within 7 days
- **Medium/Low severity**: Patched in next minor release

### Zero Dependencies
This package has **ZERO runtime dependencies**, significantly reducing the attack surface.

**Dev Dependencies Only**: All dependencies are development-time only and not included in the published package.

## Responsible Disclosure Timeline

When a security issue is reported, we follow this timeline:

1. **T+0 hours**: Acknowledge receipt of security report
2. **T+48 hours**: Initial assessment and severity classification
3. **T+7 days**: Develop and test fix (for high/critical issues)
4. **T+14 days**: Release patched version
5. **T+30 days**: Public disclosure (coordinated with reporter)

We may adjust this timeline based on:
- Complexity of the fix
- Severity of the vulnerability
- Coordination with other affected parties

### Attribution

We appreciate security researchers who responsibly disclose vulnerabilities and will acknowledge their contributions in our security advisories (with permission).

## Contact

For non-security issues, please use the regular GitHub issue tracker.

Thank you for helping keep GLTF Validator (TypeScript) secure!