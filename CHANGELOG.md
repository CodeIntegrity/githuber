# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2025-07-18

### 🚀 Added

- **Manifest V3 Support**: Fully migrated to Chrome Extension Manifest V3
- **Enhanced Security**: Updated Content Security Policy for better security
- **Host Permissions**: Explicit network request permissions for GitHub API and services
- **TopSites Permission**: Added support for importing most visited sites
- **Build Optimization**: Improved build process with copy-webpack-plugin

### 🔧 Changed

- **BREAKING**: Minimum Chrome version requirement updated to Chrome 88+
- **API Migration**: `browser_action` → `action` for Chrome Extension API
- **Permissions Structure**: Separated `permissions` and `host_permissions`
- **CSP Format**: Updated Content Security Policy to object format
- **Build Scripts**: Fixed Windows compatibility for build commands
- **Node.js Compatibility**: Added legacy OpenSSL provider support

### 🗑️ Removed

- **Deprecated APIs**: Removed Manifest V2 specific configurations
- **Unnecessary Permissions**: Removed `webRequest` permission (not needed)
- **Legacy Support**: Dropped support for Chrome versions below 88

### 🐛 Fixed

- **Chrome Compatibility**: Resolved "unsupported extension" warnings
- **Build Issues**: Fixed Node.js crypto module compatibility
- **Sass Compilation**: Resolved normalize.css import issues
- **ESLint Configuration**: Fixed YAML syntax errors in .eslintrc.yml
- **Dependency Conflicts**: Updated sass-loader to compatible version

### 🔒 Security

- **Enhanced CSP**: Stricter Content Security Policy implementation
- **Permission Minimization**: Reduced extension permissions to minimum required
- **Host Restrictions**: Limited network access to specific trusted domains

### 📚 Documentation

- **Migration Guide**: Added comprehensive Manifest V3 migration documentation
- **Installation Instructions**: Updated setup and development guidelines
- **API Compatibility**: Documented all Chrome API changes and compatibility

### ⚡ Performance

- **Build Optimization**: Faster build process with improved webpack configuration
- **Asset Management**: Better static file handling and copying
- **Dependency Updates**: Updated to more efficient package versions

---

## [1.7.0] - Previous Release

### Features

- GitHub Trending repositories display
- Multi-language search engine support
- Bookmark management system
- Theme customization (light/dark mode)
- Data backup and restore functionality
- Internationalization (English/Chinese)

---

## Migration Notes

### For Developers

- Update your development environment to use Node.js with `--openssl-legacy-provider` flag
- Ensure Chrome 88+ for testing
- Review new permission structure in manifest.json

### For Users

- **Action Required**: Update to Chrome 88 or later
- **Permission Changes**: You may need to re-authorize the extension
- **Functionality**: All existing features remain unchanged

### Breaking Changes

- Minimum Chrome version: 36 → 88
- Extension API: Manifest V2 → V3
- Permission model: Combined → Separated (permissions/host_permissions)

---

## Support

If you encounter any issues after updating:

1. Ensure you're using Chrome 88 or later
2. Try disabling and re-enabling the extension
3. Clear browser cache and restart Chrome
4. Report issues on [GitHub Issues](https://github.com/zhuowenli/githuber/issues)

---

**Full Changelog**: [v1.7.0...v1.8.0](https://github.com/zhuowenli/githuber/compare/v1.7.0...v1.8.0)
