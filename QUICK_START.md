# Quick Start Guide - DeepFRI Desktop

Get up and running in 5 minutes!

## 🎯 For Scientists (Users)

### Windows Users

1. **Download the Application**

   - Download `DeepFRI Desktop Setup.exe` from the releases page
   - Double-click the installer
   - Follow the installation wizard
   - Launch from Start Menu

2. **Use the Application**
   - Click "Browse" next to PDB Files Folder
   - Select your folder with `.pdb` files
   - Click "Browse" next to Output Folder
   - Choose where to save results
   - Click "Start Processing"
   - Wait for completion (don't close the browser!)
   - Find results in your output folder

### macOS Users

1. **Download & Install**

   - Download `DeepFRI Desktop.dmg`
   - Open the DMG file
   - Drag app to Applications folder
   - Launch from Applications

2. **First Launch**
   - Right-click the app and select "Open"
   - Click "Open" in the security dialog
   - Follow the same steps as Windows users

### Linux Users

1. **AppImage (Recommended)**

   ```bash
   chmod +x DeepFRI-Desktop.AppImage
   ./DeepFRI-Desktop.AppImage
   ```

2. **Debian/Ubuntu**
   ```bash
   sudo dpkg -i deepfri-desktop_1.0.0_amd64.deb
   deepfri-desktop
   ```

---

## 💻 For Developers

### Option 1: Quick Setup (Automated)

**Windows:**

```batch
setup.bat
npm run dev
```

**macOS/Linux:**

```bash
chmod +x setup.sh
./setup.sh
npm run dev
```

### Option 2: Manual Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Build TypeScript**

   ```bash
   npm run build
   ```

3. **Run in Development**

   ```bash
   npm run dev
   ```

4. **Build for Production**

   ```bash
   # Windows
   npm run build:win

   # macOS
   npm run build:mac

   # Linux
   npm run build:linux
   ```

---

## 📂 Required Files

Ensure your project has these files:

```
deepfri-desktop/
├── src/
│   ├── core/
│   │   └── DeepFRIAutomator.ts
│   ├── electron/
│   │   ├── main.ts
│   │   └── preload.ts
│   ├── utils/
│   │   ├── excelUtils.ts
│   │   └── fileUtils.ts
│   ├── types/
│   │   └── index.ts
│   └── renderer/
│       └── index.html
├── assets/
│   └── icon.png (512x512)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Run in development mode

# Building
npm run build            # Compile TypeScript
npm run build:win        # Build Windows installer
npm run build:mac        # Build macOS app
npm run build:linux      # Build Linux packages

# Cleaning
rm -rf dist release      # Clean build folders
rm -rf node_modules      # Remove dependencies
npm install              # Reinstall dependencies
```

---

## 📊 Sample Data

Need test data? Create sample PDB files:

1. **Create a folder:** `test_pdbs/`
2. **Add PDB files:** Download from [RCSB PDB](https://www.rcsb.org/)
3. **Example proteins:**
   - 1ABC.pdb (sample protein)
   - 2XYZ.pdb (another sample)

---

## ❓ Troubleshooting

### "Node.js is not found"

```bash
# Download and install from:
https://nodejs.org/
```

### "npm command not found"

```bash
# Node.js includes npm. Reinstall Node.js
```

### "Permission denied" (Linux/macOS)

```bash
# Add execute permission
chmod +x setup.sh
chmod +x DeepFRI-Desktop.AppImage
```

### "Build fails on Windows"

```bash
# Install build tools
npm install --global windows-build-tools
```

### "Browser doesn't open"

- Check internet connection
- Ensure Puppeteer installed: `npm install puppeteer`
- Check firewall settings

---

## 🎓 Learning Resources

- **Electron:** https://www.electronjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Puppeteer:** https://pptr.dev/
- **DeepFRI:** https://beta.deepfri.flatironinstitute.org

---

## 📧 Get Help

- **GitHub Issues:** Report bugs or ask questions
- **Email:** support@yourlab.org
- **Documentation:** Full README.md and DEPLOYMENT_GUIDE.md

---

## ✅ Next Steps

### For Users:

1. ✓ Install the application
2. ✓ Prepare your PDB files
3. ✓ Run your first prediction
4. ✓ Explore the Excel results

### For Developers:

1. ✓ Set up development environment
2. ✓ Run in development mode
3. ✓ Make your first build
4. ✓ Read DEPLOYMENT_GUIDE.md for distribution

---

**Happy protein prediction! 🧬**
