# Contributing to DeepFRI Desktop

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Feature Requests](#feature-requests)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education
- Nationality, personal appearance, race
- Religion, sexual identity and orientation

### Our Standards

**Positive behavior:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**

- Trolling, insulting/derogatory comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- Git
- Code editor (VS Code recommended)
- Basic knowledge of TypeScript and Electron

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/deepfri-desktop.git
cd deepfri-desktop

# Add upstream remote
git remote add upstream https://github.com/originalauthor/deepfri-desktop.git
```

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

---

## 💻 Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

```bash
# Edit files
# Test your changes
npm run dev

# Build to verify
npm run build
```

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add feature: description"
```

**Commit Message Format:**

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(ui): add dark mode toggle"
git commit -m "fix(core): resolve memory leak in automator"
git commit -m "docs(readme): update installation instructions"
```

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Select your feature branch
- Fill out PR template
- Submit for review

---

## 📏 Coding Standards

### TypeScript Style Guide

```typescript
// Use clear, descriptive names
const proteinCount = 10; // Good
const pc = 10; // Bad

// Use interfaces for object shapes
interface ProteinResult {
  id: string;
  predictions: Prediction[];
}

// Use async/await instead of promises
async function processProtein(): Promise<Result> {
  const data = await fetchData();
  return processData(data);
}

// Add type annotations
function calculateScore(value: number): number {
  return value * 0.95;
}

// Use const for immutable values
const MAX_PROTEINS = 100;

// Use descriptive function names
function validatePDBFolder() {
  /* ... */
} // Good
function check() {
  /* ... */
} // Bad
```

### Code Organization

```typescript
// Order: imports, interfaces, class, exports
import { readdir } from "fs/promises";

interface Config {
  path: string;
  timeout: number;
}

export class Processor {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async process(): Promise<void> {
    // Implementation
  }
}
```

### File Structure

```
src/
├── core/          # Business logic
├── electron/      # Electron-specific
├── utils/         # Utilities
├── types/         # Type definitions
└── renderer/      # UI components
```

### Naming Conventions

```typescript
// Classes: PascalCase
class DeepFRIAutomator {}

// Interfaces: PascalCase
interface ProcessingResult {}

// Functions/Variables: camelCase
const processProtein = () => {};
let proteinCount = 0;

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files: kebab-case or camelCase
deepfri - automator.ts;
excelUtils.ts;
```

### Comments

```typescript
/**
 * Process all proteins in the batch
 * @param pdbFolder - Path to folder containing PDB files
 * @param outputFolder - Path where results will be saved
 * @returns Array of processing results
 */
async processAllProteins(
  pdbFolder: string,
  outputFolder: string
): Promise<ProcessingResult[]> {
  // Implementation
}

// Use comments for complex logic
// Extract top 3 predictions based on confidence score
const topPredictions = predictions
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);
```

### Error Handling

```typescript
// Always handle errors appropriately
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  throw new Error(`Failed to complete: ${error.message}`);
}

// Use specific error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

---

## 🧪 Testing

### Manual Testing

Before submitting PR:

```bash
# Build project
npm run build

# Test in development
npm run dev

# Test production build
npm run build:win  # or :mac, :linux
```

### Test Checklist

- [ ] Code compiles without errors
- [ ] Application launches successfully
- [ ] UI displays correctly
- [ ] File selection works
- [ ] Processing completes
- [ ] Results are generated correctly
- [ ] No console errors
- [ ] Memory usage is reasonable

### Testing New Features

```typescript
// Add console logs for debugging
console.log('Feature X: Starting process');
console.log('Feature X: Data received:', data);

// Test edge cases
- Empty input
- Invalid data
- Network failures
- Large datasets
```

### Unit Testing (Future)

We plan to add automated testing. For now:

```typescript
// Write testable code
// Pure functions are easier to test
function calculateScore(value: number): number {
  return value * 0.95;
}

// Avoid side effects in core logic
// Good: Return transformed data
function processData(data: string): ProcessedData {
  return { processed: data.toUpperCase() };
}

// Bad: Modify global state
function processData(data: string): void {
  globalData = data.toUpperCase();
}
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update Documentation**

   - Update README if needed
   - Add comments to complex code
   - Update CHANGELOG.md

2. **Test Thoroughly**

   - Test on your platform
   - Test with different inputs
   - Check for errors

3. **Clean Code**
   - Remove console.logs
   - Remove commented code
   - Format consistently

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Manual testing performed

## Screenshots (if applicable)

Add screenshots of UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex areas
- [ ] Documentation updated
- [ ] No console warnings/errors
```

### Review Process

1. **Automated Checks**

   - Code builds successfully
   - No TypeScript errors

2. **Maintainer Review**

   - Code quality
   - Functionality
   - Documentation

3. **Feedback**

   - Address review comments
   - Make requested changes
   - Update PR

4. **Merge**
   - Approved PRs will be merged
   - Your contribution will be credited

---

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Try latest version
- Collect detailed information

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of what's wrong

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment:**

- OS: [e.g., Windows 11]
- Version: [e.g., 1.0.0]
- Node.js: [e.g., v18.0.0]

**Additional Context**
Any other relevant information

**Logs**
Paste relevant log output
```

### Example Bug Report

```markdown
**Bug:** Application crashes when selecting folder

**To Reproduce:**

1. Launch DeepFRI Desktop
2. Click "Browse" for PDB folder
3. Select any folder
4. Application crashes

**Expected:** Folder should be selected

**Environment:**

- OS: Windows 11 Pro
- Version: 1.0.0
- Error: "Uncaught TypeError: Cannot read property 'path'"

**Logs:**
[Paste error stack trace]
```

---

## 💡 Feature Requests

### Before Requesting

- Check if already requested
- Consider if it fits project scope
- Think about implementation

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other ways to solve this

**Additional Context**
Screenshots, mockups, examples
```

### Example Feature Request

```markdown
**Feature:** Export results to CSV

**Problem:** Users want to import results into other tools
that don't support Excel

**Solution:** Add "Export CSV" button that generates
comma-separated value files

**Implementation Ideas:**

- Add export option to results screen
- Use existing data structure
- Generate one CSV per category

**Priority:** Medium
```

---

## 🎯 Development Priorities

### High Priority

- Bug fixes
- Performance improvements
- Security updates
- Critical features

### Medium Priority

- UI enhancements
- Additional export formats
- Better error messages

### Low Priority

- Code refactoring
- Documentation improvements
- Minor features

---

## 🌟 Good First Issues

Looking to contribute but don't know where to start? Look for issues labeled:

- `good first issue` - Easy for newcomers
- `help wanted` - We need assistance
- `documentation` - Improve docs

### Suggested First Contributions

1. **Documentation**

   - Fix typos
   - Improve clarity
   - Add examples

2. **UI Improvements**

   - Better error messages
   - Loading animations
   - Tooltips

3. **Bug Fixes**
   - Simple bugs
   - Edge case handling
   - Validation improvements

---

## 📚 Resources

### Learning Resources

**TypeScript:**

- https://www.typescriptlang.org/docs

**Electron:**

- https://www.electronjs.org/docs
- https://www.electronjs.org/docs/latest/tutorial/quick-start

**Puppeteer:**

- https://pptr.dev/
- https://github.com/puppeteer/puppeteer/tree/main/docs

**Node.js:**

- https://nodejs.org/en/docs

### Useful Tools

**Code Editors:**

- VS Code (recommended)
- WebStorm
- Sublime Text

**VS Code Extensions:**

- ESLint
- Prettier
- TypeScript Importer
- Electron Debug

**Git GUI:**

- GitHub Desktop
- GitKraken
- SourceTree

---

## 👥 Community

### Communication Channels

**GitHub Issues:**
For bugs, features, and technical discussion

**Email:**
support@yourlab.org

**Discussions:**
GitHub Discussions for general questions

### Getting Help

Stuck? Ask for help!

- Comment on your PR
- Create a discussion
- Email maintainers

We're here to help you succeed! 🎉

---

## 🏆 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits

Thank you for making DeepFRI Desktop better! 💙

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Open an issue or email support@yourlab.org

**Happy Contributing!** 🚀
