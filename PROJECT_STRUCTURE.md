# Project Structure Guide

Complete overview of the DeepFRI Desktop project organization.

## 📁 Directory Tree

```
deepfri-desktop/
│
├── 📂 src/                          # Source code
│   │
│   ├── 📂 core/                     # Core business logic
│   │   └── DeepFRIAutomator.ts     # Main automation class
│   │
│   ├── 📂 electron/                 # Electron-specific code
│   │   ├── main.ts                 # Main process (Node.js)
│   │   └── preload.ts              # Preload script (IPC bridge)
│   │
│   ├── 📂 utils/                    # Utility functions
│   │   ├── excelUtils.ts           # Excel file generation
│   │   └── fileUtils.ts            # File operations & validation
│   │
│   ├── 📂 types/                    # TypeScript type definitions
│   │   └── index.ts                # Shared interfaces & types
│   │
│   └── 📂 renderer/                 # Frontend (HTML/CSS/JS)
│       └── index.html              # Main GUI interface
│
├── 📂 assets/                       # Application resources
│   ├── icon.png                    # Linux icon (512x512)
│   ├── icon.ico                    # Windows icon
│   ├── icon.icns                   # macOS icon
│   └── screenshot.png              # For README
│
├── 📂 dist/                         # Compiled TypeScript output
│   ├── core/                       # (generated)
│   ├── electron/                   # (generated)
│   ├── utils/                      # (generated)
│   └── types/                      # (generated)
│
├── 📂 release/                      # Built installers/packages
│   ├── DeepFRI Desktop Setup.exe   # Windows installer
│   ├── DeepFRI Desktop.dmg         # macOS installer
│   └── DeepFRI Desktop.AppImage    # Linux package
│
├── 📂 node_modules/                 # Dependencies (generated)
│
├── 📂 output/                       # User output (at runtime)
│   ├── deepfri_results.xlsx        # Generated Excel file
│   └── tags/                       # JSON prediction files
│
├── 📄 package.json                  # Project dependencies & scripts
├── 📄 package-lock.json             # Locked dependency versions
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 .gitignore                    # Git ignore rules
│
├── 📄 README.md                     # Main documentation
├── 📄 DEPLOYMENT_GUIDE.md           # Build & distribution guide
├── 📄 QUICK_START.md                # Quick start instructions
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 📄 setup.sh                      # Linux/macOS setup script
├── 📄 setup.bat                     # Windows setup script
│
└── 📄 LICENSE                       # MIT License (recommended)
```

---

## 📝 File Descriptions

### Core Source Files

#### `src/core/DeepFRIAutomator.ts`

**Purpose:** Main automation engine  
**Responsibilities:**

- Browser initialization with Puppeteer
- DeepFRI website navigation
- File upload automation
- Data extraction from web tables
- Progress tracking and callbacks

**Key Methods:**

- `init()` - Initialize browser
- `uploadZipFile()` - Upload PDB files
- `extractProteinData()` - Scrape prediction results
- `processAllProteins()` - Batch processing orchestration
- `downloadTags()` - Download JSON prediction files

---

#### `src/electron/main.ts`

**Purpose:** Electron main process  
**Responsibilities:**

- Window creation and management
- IPC communication with renderer
- File dialog handling
- Processing orchestration
- System integration

**Key Functions:**

- `createWindow()` - Create app window
- IPC handlers for folder selection
- Processing workflow coordination

---

#### `src/electron/preload.ts`

**Purpose:** Security bridge between main and renderer  
**Responsibilities:**

- Expose safe APIs to renderer
- IPC communication setup
- Event listeners for progress updates

**Exposed APIs:**

- `selectPDBFolder()` - Open folder picker
- `selectOutputFolder()` - Open folder picker
- `startProcessing()` - Begin analysis
- `onProgress()` - Progress updates
- `onError()` - Error notifications

---

#### `src/utils/excelUtils.ts`

**Purpose:** Excel file generation  
**Responsibilities:**

- Format prediction data
- Create Excel workbook structure
- Apply color coding for sequence-based predictions
- Calculate processing statistics

**Key Methods:**

- `generateExcel()` - Create Excel file
- `formatSection()` - Format prediction sections
- `calculateStatistics()` - Compute stats

---

#### `src/utils/fileUtils.ts`

**Purpose:** File system operations  
**Responsibilities:**

- PDB folder validation
- ZIP file creation
- Directory management
- File counting and verification

**Key Methods:**

- `createZipFromPDBFolder()` - Bundle PDB files
- `validatePDBFolder()` - Check folder contents
- `ensureOutputFolder()` - Create directories

---

#### `src/types/index.ts`

**Purpose:** TypeScript type definitions  
**Contents:**

- `Prediction` - Single prediction result
- `ProcessingResult` - Complete protein result
- `ProgressCallback` - Progress update function
- `ProcessingConfig` - Configuration interface
- `Statistics` - Processing statistics

---

#### `src/renderer/index.html`

**Purpose:** User interface  
**Features:**

- Modern, gradient design
- Folder selection buttons
- Progress bar with animations
- Results display with statistics
- Responsive layout

---

### Configuration Files

#### `package.json`

**Key Sections:**

- `dependencies` - Runtime requirements
- `devDependencies` - Build tools
- `scripts` - Build commands
- `build` - Electron-builder configuration

**Important Scripts:**

```json
{
  "dev": "Development mode",
  "build": "Compile TypeScript",
  "build:win": "Build Windows",
  "build:mac": "Build macOS",
  "build:linux": "Build Linux"
}
```

---

#### `tsconfig.json`

**Purpose:** TypeScript compiler configuration  
**Key Settings:**

- `target: ES2020` - JavaScript version
- `module: commonjs` - Module system
- `outDir: ./dist` - Output directory
- `strict: true` - Strict type checking

---

#### `.gitignore`

**Purpose:** Git ignore rules  
**Ignores:**

- `node_modules/` - Dependencies
- `dist/` - Compiled code
- `release/` - Built packages
- User data and temp files

---

## 🔄 Data Flow

```
┌─────────────────┐
│   User Input    │
│ (PDB Folder +   │
│ Output Folder)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Renderer (GUI) │
│  index.html     │
└────────┬────────┘
         │ IPC
         ▼
┌─────────────────┐
│  Main Process   │
│  main.ts        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File Utils     │
│  Create ZIP     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Automator      │
│  Upload & Run   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DeepFRI Web    │
│  Processing     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Automator      │
│  Extract Data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Excel Utils    │
│  Generate File  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Folder  │
│  (Results +     │
│   JSON Tags)    │
└─────────────────┘
```

---

## 🏗️ Build Process

```
Source Code (TypeScript)
         │
         ▼
    TypeScript Compiler
    (npm run build)
         │
         ▼
    Compiled JavaScript
    (dist/ folder)
         │
         ▼
    Electron Builder
    (npm run build:win/mac/linux)
         │
         ▼
    Platform-Specific Package
    (release/ folder)
         │
         ▼
    Installer/App Bundle
```

---

## 🎨 UI Component Hierarchy

```
Container (Main Window)
├── Header Section
│   ├── Title
│   └── Subtitle
│
├── Form Section
│   ├── PDB Folder Group
│   │   ├── Label
│   │   ├── Display Input
│   │   └── Browse Button
│   │
│   ├── Output Folder Group
│   │   ├── Label
│   │   ├── Display Input
│   │   └── Browse Button
│   │
│   └── Start Button
│
├── Progress Section (hidden by default)
│   ├── Progress Bar
│   └── Status Text
│
└── Results Section (hidden by default)
    ├── Success Icon
    ├── Completion Message
    └── Statistics Grid
        ├── Total Proteins
        ├── Structure-Based
        └── Sequence-Based
```

---

## 🔐 Security Model

### Context Isolation

- Renderer process has **no direct Node.js access**
- All file system operations through IPC
- Preload script acts as secure bridge

### File Access

- User explicitly selects folders (no blind file access)
- Read/write only to user-specified locations
- Downloads go to user-chosen output folder

### Web Access

- Puppeteer runs in isolated browser context
- Only interacts with DeepFRI website
- No arbitrary code execution

---

## 📦 Dependencies Overview

### Production Dependencies

```
puppeteer    → Browser automation
xlsx         → Excel file generation
archiver     → ZIP file creation
```

### Development Dependencies

```
electron           → Desktop app framework
electron-builder   → Package & distribute
typescript         → Type-safe development
vite              → Development server
```

---

## 🚀 Development Workflow

1. **Edit Source Files** (`src/`)
2. **Compile TypeScript** (`npm run build`)
3. **Test in Dev Mode** (`npm run dev`)
4. **Build for Platform** (`npm run build:win`)
5. **Test Installer** (`release/`)
6. **Distribute** (GitHub/Website)

---

## 📊 Size Estimates

```
Source Code:      ~50 KB
node_modules:     ~500 MB
Compiled (dist):  ~100 KB
Windows Build:    ~150 MB
macOS Build:      ~200 MB
Linux Build:      ~180 MB
```

---

## 🎯 Adding New Features

### Add New Data Field

1. Update `src/types/index.ts` - Add to interface
2. Update `src/core/DeepFRIAutomator.ts` - Extract data
3. Update `src/utils/excelUtils.ts` - Format for Excel
4. Update `src/renderer/index.html` - Display in UI

### Add New File Format

1. Install library (`npm install pdf-lib`)
2. Create `src/utils/pdfUtils.ts`
3. Update `src/electron/main.ts` - Add handler
4. Update UI to allow PDF export

---

## 📚 Further Reading

- **Electron Documentation**: https://www.electronjs.org/docs
- **Puppeteer Guide**: https://pptr.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **electron-builder**: https://www.electron.build/

---

**This structure ensures maintainability, security, and ease of deployment!**
