# Changelog

All notable changes to DeepFRI Desktop will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Auto-update functionality
- Dark mode theme option
- Batch processing queue management
- Export to CSV format
- Protein structure viewer integration

---

## [1.0.0] - 2024-01-XX

### Added

- **Core Features**
  - Automated DeepFRI web scraping with Puppeteer
  - Batch PDB file processing
  - Real-time progress tracking with visual feedback
  - Excel report generation with XLSX library
  - JSON tags download for each protein
  - Smart prediction prioritization (structure-based over sequence-based)
- **User Interface**
  - Modern gradient design with purple theme
  - Intuitive folder selection dialogs
  - Live progress bar with percentage
  - Statistics display after completion
  - Color-coded results (red for sequence-based predictions)
- **Developer Tools**
  - TypeScript for type-safe development
  - Modular architecture with clear separation of concerns
  - Comprehensive error handling
  - Detailed logging for debugging
- **Documentation**
  - README with installation and usage instructions
  - DEPLOYMENT_GUIDE for building and distribution
  - QUICK_START for rapid onboarding
  - PROJECT_STRUCTURE explaining codebase organization
  - BUILD_CHECKLIST for release management
- **Build System**
  - Electron-builder configuration for Windows, macOS, and Linux
  - Automated setup scripts (setup.sh, setup.bat)
  - NSIS installer for Windows
  - DMG package for macOS
  - AppImage and DEB packages for Linux

### Technical Details

- Electron v27.0.0
- Puppeteer v21.0.0
- XLSX v0.18.5
- TypeScript v5.2.2

### Known Issues

- Browser window must remain open during processing (Puppeteer requirement)
- Large batch processing (100+ proteins) may take several hours
- Requires active internet connection throughout processing

---

## [0.9.0-beta] - 2024-01-XX (Pre-release)

### Added

- Beta testing release
- Core automation functionality
- Basic GUI implementation

### Fixed

- File upload timing issues
- Data extraction accuracy
- Excel formatting bugs

### Changed

- Improved error messages
- Enhanced progress reporting
- Optimized scraping selectors

---

## Release Notes Template

### [X.Y.Z] - YYYY-MM-DD

#### Added

- New features

#### Changed

- Changes in existing functionality

#### Deprecated

- Soon-to-be removed features

#### Removed

- Removed features

#### Fixed

- Bug fixes

#### Security

- Vulnerability fixes

---

## Version History Summary

| Version | Release Date | Major Changes          |
| ------- | ------------ | ---------------------- |
| 1.0.0   | 2024-XX-XX   | Initial public release |
| 0.9.0   | 2024-XX-XX   | Beta testing           |

---

## Upgrade Guide

### From 0.9.0 to 1.0.0

**No breaking changes** - Simply download and install the new version.

**New features:**

- Enhanced UI with better feedback
- Improved error handling
- Faster processing

---

## Support

For questions about changes or upgrade assistance:

- GitHub Issues: [Report a bug](https://github.com/yourlab/deepfri-desktop/issues)
- Email: support@yourlab.org

---

[Unreleased]: https://github.com/yourlab/deepfri-desktop/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourlab/deepfri-desktop/releases/tag/v1.0.0
[0.9.0-beta]: https://github.com/yourlab/deepfri-desktop/releases/tag/v0.9.0-beta
