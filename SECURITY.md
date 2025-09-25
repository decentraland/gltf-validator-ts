# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

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

When using this validator:

- **Validate file sizes** before processing to prevent resource exhaustion
- **Use timeouts** for validation operations
- **Sanitize file paths** when processing multiple files
- **Be cautious** with external resource loading in production environments

### Attribution

We appreciate security researchers who responsibly disclose vulnerabilities and will acknowledge their contributions in our security advisories (with permission).

## Contact

For non-security issues, please use the regular GitHub issue tracker.

Thank you for helping keep GLTF Validator (TypeScript) secure!