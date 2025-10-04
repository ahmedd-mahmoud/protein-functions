# Complete Build & Distribution Checklist

Follow this step-by-step checklist to build and distribute DeepFRI Desktop.

---

## ✅ Phase 1: Environment Setup

### 1.1 Install Prerequisites

- [ ] **Install Node.js v18+**

  ```bash
  # Download from: https://nodejs.org/
  node --version  # Verify: should show v18.x.x or higher
  ```

- [ ] **Install Git**

  ```bash
  # Download from: https://git-scm.com/
  git --version  # Verify installation
  ```

- [ ] **Windows Only: Install Build Tools**

  ```bash
  npm install --global windows-build-tools
  ```

- [ ] **macOS Only: Install Xcode Tools**
  ```bash
  xcode-select --install
  ```

### 1.2 Verify Installation

- [ ] Node.js works: `node --version`
- [ ] npm works: `npm --version`
- [ ] Git works: `git --version`

---

## ✅ Phase 2: Project Setup

### 2.1 Create Project Directory

```bash
mkdir deepfri-desktop
cd deepfri-desktop
```

- [ ] Directory created
- [ ] Navigated to directory

### 2.2 Copy Source Files

Copy these files to your project directory:

- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `DEPLOYMENT_GUIDE.md`
- [ ] `QUICK_START.md`
- [ ] `PROJECT_STRUCTURE.md`
- [ ] `setup.sh` (Linux/macOS)
- [ ] `setup.bat` (Windows)

### 2.3 Create Source Directories

```bash
mkdir -p src/core src/electron src/utils src/types src/renderer
mkdir -p assets
```

- [ ] `src/core/` created
- [ ] `src/electron/` created
- [ ] `src/utils/` created
- [ ] `src/types/` created
- [ ] `src/renderer/` created
- [ ] `assets/` created

### 2.4 Copy TypeScript Files

- [ ] `src/core/DeepFRIAutomator.ts`
- [ ] `src/electron/main.ts`
- [ ] `src/electron/preload.ts`
- [ ] `src/utils/excelUtils.ts`
- [ ] `src/utils/fileUtils.ts`
- [ ] `src/types/index.ts`
- [ ] `src/renderer/index.html`

### 2.5 Create Application Icons

- [ ] Create/add `assets/icon.png` (512x512 pixels)
- [ ] Create/add `assets/icon.ico` (for Windows)
- [ ] Create/add `assets/icon.icns` (for macOS)

**Quick Icon Creation:**

```bash
# Use an online converter or ImageMagick
# Example with placeholder:
convert -size 512x512 xc:#667eea assets/icon.png
```

---

## ✅ Phase 3: Dependency Installation

### 3.1 Run Setup Script

**Windows:**

```batch
setup.bat
```

**Linux/macOS:**

```bash
chmod +x setup.sh
./setup.sh
```

- [ ] Setup script executed successfully
- [ ] No errors reported

### 3.2 Manual Installation (if script fails)

```bash
npm install
```

- [ ] Dependencies installed
- [ ] `node_modules/` folder created
- [ ] No critical errors

### 3.3 Verify Dependencies

```bash
npm list --depth=0
```

Check for:

- [ ] `puppeteer` installed
- [ ] `xlsx` installed
- [ ] `archiver` installed
- [ ] `electron` installed
- [ ] `electron-builder` installed
- [ ] `typescript` installed

---

## ✅ Phase 4: Build & Test

### 4.1 Compile TypeScript

```bash
npm run build
```

- [ ] Compilation successful
- [ ] `dist/` folder created
- [ ] No errors (warnings OK)

**Expected Output:**

```
dist/
├── core/
│   └── DeepFRIAutomator.js
├── electron/
│   ├── main.js
│   └── preload.js
├── utils/
│   ├── excelUtils.js
│   └── fileUtils.js
└── types/
    └── index.js
```

### 4.2 Test in Development Mode

```bash
npm run dev
```

- [ ] Application window opens
- [ ] GUI displays correctly
- [ ] No console errors
- [ ] Buttons are clickable

### 4.3 Test Basic Functionality

- [ ] Click "Browse" for PDB folder
- [ ] File dialog opens
- [ ] Select a test folder
- [ ] Folder path displays
- [ ] Click "Browse" for output folder
- [ ] Select output location
- [ ] "Start Processing" button enables

**Note:** Full processing test requires actual PDB files and internet connection.

---

## ✅ Phase 5: Build for Windows

### 5.1 Pre-build Checks

- [ ] TypeScript compiled (`dist/` exists)
- [ ] Icons in place (`assets/icon.ico`)
- [ ] `package.json` has correct details
- [ ] Version number set

### 5.2 Build Windows Installer

```bash
npm run build:win
```

**Wait time:** 5-10 minutes

- [ ] Build completes successfully
- [ ] No critical errors

### 5.3 Verify Windows Build Output

```bash
ls -lh release/
```

Expected files:

- [ ] `DeepFRI Desktop Setup 1.0.0.exe` (~150 MB)
- [ ] `DeepFRI Desktop 1.0.0.exe` (portable, ~150 MB)
- [ ] `latest.yml` (update metadata)

### 5.4 Test Windows Installer

- [ ] Run installer on clean Windows machine
- [ ] Installation completes
- [ ] Desktop shortcut created
- [ ] Start menu entry created
- [ ] Application launches
- [ ] Test basic functionality

### 5.5 Test Portable Version

- [ ] Run portable `.exe` directly
- [ ] Application launches without installation
- [ ] Basic functionality works

---

## ✅ Phase 6: Build for macOS (Optional)

### 6.1 Pre-build Checks (macOS)

- [ ] Running on macOS or using build service
- [ ] Icon file exists (`assets/icon.icns`)
- [ ] Xcode Command Line Tools installed

### 6.2 Build macOS App

```bash
npm run build:mac
```

- [ ] Build completes
- [ ] No errors

### 6.3 Verify macOS Build

- [ ] `release/DeepFRI Desktop-1.0.0.dmg` created
- [ ] `release/DeepFRI Desktop-1.0.0-mac.zip` created

### 6.4 Test macOS Build

- [ ] Mount DMG file
- [ ] Drag to Applications
- [ ] Launch application
- [ ] Right-click → Open (first time)
- [ ] Test functionality

---

## ✅ Phase 7: Build for Linux (Optional)

### 7.1 Build Linux Packages

```bash
npm run build:linux
```

- [ ] Build completes
- [ ] No errors

### 7.2 Verify Linux Build

- [ ] `DeepFRI Desktop-1.0.0.AppImage` created
- [ ] `deepfri-desktop_1.0.0_amd64.deb` created

### 7.3 Test Linux Builds

**AppImage:**

```bash
chmod +x release/DeepFRI\ Desktop-1.0.0.AppImage
./release/DeepFRI\ Desktop-1.0.0.AppImage
```

- [ ] Application launches
- [ ] Functionality works

**Debian Package:**

```bash
sudo dpkg -i release/deepfri-desktop_1.0.0_amd64.deb
deepfri-desktop
```

- [ ] Installs without errors
- [ ] Launches successfully

---

## ✅ Phase 8: Quality Assurance

### 8.1 Functional Testing

Test on each platform:

- [ ] **Launch Test:** App opens without errors
- [ ] **UI Test:** All elements visible and styled correctly
- [ ] **Folder Selection:** Browse dialogs work
- [ ] **Validation:** PDB file detection works
- [ ] **Processing:** Complete workflow runs
- [ ] **Output:** Excel file generated correctly
- [ ] **Tags:** JSON files downloaded
- [ ] **Error Handling:** Graceful error messages

### 8.2 Performance Testing

- [ ] Test with 1 PDB file
- [ ] Test with 10 PDB files
- [ ] Test with 50 PDB files
- [ ] Monitor memory usage (should stay under 2GB)
- [ ] Check CPU usage (reasonable during processing)

### 8.3 Edge Cases

- [ ] Empty folder selected
- [ ] Folder with no PDB files
- [ ] Invalid PDB files
- [ ] No internet connection
- [ ] Network timeout
- [ ] Disk full scenario
- [ ] Special characters in filenames

---

## ✅ Phase 9: Documentation

### 9.1 Update Documentation

- [ ] Update `README.md` with:
  - [ ] Current version number
  - [ ] System requirements
  - [ ] Installation instructions
  - [ ] Usage guide
- [ ] Update `CHANGELOG.md` with:

  - [ ] New features
  - [ ] Bug fixes
  - [ ] Known issues

- [ ] Create release notes

### 9.2 Create User Guide

- [ ] Write step-by-step tutorial
- [ ] Take screenshots of each step
- [ ] Create troubleshooting section
- [ ] Add FAQ section

### 9.3 Record Demo Video (Optional)

- [ ] Record installation process
- [ ] Record usage walkthrough
- [ ] Upload to YouTube/Vimeo
- [ ] Add link to README

---

## ✅ Phase 10: Distribution Preparation

### 10.1 Generate Checksums

```bash
cd release

# Windows/Linux/macOS
sha256sum *.exe *.dmg *.AppImage *.deb > checksums.txt
```

- [ ] Checksums generated
- [ ] File saved

### 10.2 Prepare Release Package

Create a release folder with:

- [ ] Windows installer
- [ ] Windows portable
- [ ] macOS DMG (if applicable)
- [ ] Linux AppImage (if applicable)
- [ ] Linux DEB (if applicable)
- [ ] `checksums.txt`
- [ ] `README.txt` (quick instructions)
- [ ] `LICENSE.txt`

### 10.3 Test Download & Install

- [ ] Copy release to external drive
- [ ] Test on fresh machine
- [ ] Verify checksums match
- [ ] Install and run

---

## ✅ Phase 11: GitHub Release

### 11.1 Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial release v1.0.0"
git remote add origin https://github.com/yourusername/deepfri-desktop.git
git push -u origin main
```

- [ ] Repository created
- [ ] Code pushed

### 11.2 Create Release Tag

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

- [ ] Tag created
- [ ] Tag pushed

### 11.3 Create GitHub Release

- [ ] Go to: Repository → Releases → New Release
- [ ] Select tag: `v1.0.0`
- [ ] Set title: "DeepFRI Desktop v1.0.0"
- [ ] Write release description
- [ ] Upload all build files
- [ ] Upload checksums.txt
- [ ] Check "pre-release" if applicable
- [ ] Publish release

---

## ✅ Phase 12: Distribution

### 12.1 Announce Release

- [ ] Send email to lab members
- [ ] Post on research group website
- [ ] Share on scientific forums
- [ ] Tweet/share on social media
- [ ] Submit to relevant directories

### 12.2 Set Up Support Channels

- [ ] Create support email address
- [ ] Set up GitHub Issues
- [ ] Create documentation wiki
- [ ] Prepare response templates

### 12.3 Monitor Initial Adoption

- [ ] Track download numbers
- [ ] Monitor GitHub issues
- [ ] Collect user feedback
- [ ] Note common problems

---

## ✅ Phase 13: Post-Release

### 13.1 User Feedback

- [ ] Respond to issues within 24-48 hours
- [ ] Create FAQ from common questions
- [ ] Update documentation based on feedback

### 13.2 Bug Fixes

- [ ] Track reported bugs
- [ ] Prioritize critical issues
- [ ] Plan patch releases

### 13.3 Future Planning

- [ ] Collect feature requests
- [ ] Plan version 1.1.0
- [ ] Update roadmap

---

## 🎉 Success Criteria

Your release is successful when:

- ✅ All builds work on target platforms
- ✅ Users can install without issues
- ✅ Core functionality works reliably
- ✅ Documentation is clear and complete
- ✅ Support channels are active
- ✅ Positive user feedback received

---

## 📊 Build Status Template

Use this to track your build status:

```
Build Date: _______________
Version: 1.0.0

Platform Builds:
[ ] Windows Installer (tested)
[ ] Windows Portable (tested)
[ ] macOS DMG (tested)
[ ] Linux AppImage (tested)
[ ] Linux DEB (tested)

Quality Checks:
[ ] All functional tests passed
[ ] Performance acceptable
[ ] Documentation complete
[ ] Checksums generated

Distribution:
[ ] GitHub release published
[ ] Download links verified
[ ] Announcement sent

Status: 🟢 Ready | 🟡 In Progress | 🔴 Issues

Notes:
___________________________________
___________________________________
```

---

## 🆘 Emergency Rollback

If critical issues are found:

1. **Mark release as broken:**

   - Add warning to GitHub release
   - Update README with known issues

2. **Quick fix:**

   ```bash
   # Fix the issue
   git commit -m "Fix critical bug"
   git tag -a v1.0.1 -m "Hotfix release"
   npm run build:win
   # Create new release
   ```

3. **Notify users:**
   - Email announcement
   - Update all download links

---

**You're now ready to distribute DeepFRI Desktop! 🚀**

**Estimated Total Time:**

- Setup & Build: 2-3 hours
- Testing: 2-4 hours
- Documentation: 2-3 hours
- Distribution: 1-2 hours

**Total: 7-12 hours for first release**
