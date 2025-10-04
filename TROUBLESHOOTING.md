# Troubleshooting Guide

Comprehensive solutions for technical issues with DeepFRI Desktop.

---

## 🚨 Quick Diagnostics

Run these checks first:

```bash
# Check Node.js
node --version   # Should be v18.x.x or higher

# Check npm
npm --version    # Should be 9.x.x or higher

# Check if application is running
ps aux | grep electron  # Linux/macOS
tasklist | findstr electron  # Windows

# Check logs
# Windows: C:\Users\[YourName]\AppData\Roaming\DeepFRI Desktop\logs
# macOS: ~/Library/Logs/DeepFRI Desktop
# Linux: ~/.config/DeepFRI Desktop/logs
```

---

## 🔧 Build & Installation Issues

### Issue: "npm install" fails

**Error:** `EACCES: permission denied`

**Solution (Linux/macOS):**

```bash
# Don't use sudo with npm!
# Fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then retry:
npm install
```

**Solution (Windows):**

```batch
# Run Command Prompt as Administrator
npm install
```

---

### Issue: "node-gyp" build fails

**Error:** `node-gyp rebuild failed`

**Solution (Windows):**

```batch
# Install Windows Build Tools
npm install --global windows-build-tools

# Or install Visual Studio Build Tools manually
# Download from: https://visualstudio.microsoft.com/downloads/
```

**Solution (macOS):**

```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Solution (Linux):**

```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# Fedora
sudo dnf install gcc-c++ make
```

---

### Issue: Puppeteer download fails

**Error:** `Failed to download Chromium`

**Solution:**

```bash
# Set Puppeteer to skip download
export PUPPETEER_SKIP_DOWNLOAD=true
npm install puppeteer

# Then manually download
npx puppeteer browsers install chrome
```

**Alternative:**

```bash
# Use system Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Windows path:
# C:\Program Files\Google\Chrome\Application\chrome.exe

# macOS path:
# /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

---

### Issue: "electron-builder" fails

**Error:** `Cannot find module 'electron-builder'`

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Error:** `ENOENT: no such file or directory, open 'icon.png'`

**Solution:**

```bash
# Create placeholder icon
mkdir -p assets
convert -size 512x512 xc:purple assets/icon.png

# Or download a sample icon
curl -o assets/icon.png https://via.placeholder.com/512/667eea/ffffff?text=DeepFRI
```

---

### Issue: TypeScript compilation errors

**Error:** `Cannot find module 'puppeteer'`

**Solution:**

```bash
# Install type definitions
npm install --save-dev @types/node

# Update tsconfig.json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

**Error:** `Property 'electronAPI' does not exist`

**Solution:**
Add type declarations in `src/types/global.d.ts`:

```typescript
interface Window {
  electronAPI: {
    selectPDBFolder: () => Promise<any>;
    selectOutputFolder: () => Promise<any>;
    startProcessing: (config: any) => Promise<any>;
    onProgress: (callback: (data: any) => void) => void;
    onError: (callback: (data: any) => void) => void;
  };
}
```

---

## 🖥️ Runtime Issues

### Issue: Application won't start

**Symptom:** Double-click does nothing

**Solution 1 - Check Logs:**

```bash
# Windows
type "%APPDATA%\DeepFRI Desktop\logs\main.log"

# macOS
cat ~/Library/Logs/DeepFRI\ Desktop/main.log

# Linux
cat ~/.config/DeepFRI\ Desktop/logs/main.log
```

**Solution 2 - Run from Terminal:**

```bash
# Windows
"C:\Program Files\DeepFRI Desktop\DeepFRI Desktop.exe"

# macOS
/Applications/DeepFRI\ Desktop.app/Contents/MacOS/DeepFRI\ Desktop

# Linux
/usr/bin/deepfri-desktop
```

**Solution 3 - Reinstall:**

```bash
# Uninstall first
# Windows: Control Panel → Uninstall Program
# macOS: Drag app to Trash
# Linux: sudo dpkg -r deepfri-desktop

# Then install fresh copy
```

---

### Issue: Browser (Puppeteer) doesn't open

**Symptom:** Progress stuck at "Initializing browser..."

**Solution 1 - Check Chromium:**

```bash
# Find Puppeteer's Chromium
find ~/.cache/puppeteer -name chrome  # Linux/macOS
dir %LOCALAPPDATA%\puppeteer  # Windows

# If missing, reinstall
npm uninstall puppeteer
npm install puppeteer
```

**Solution 2 - Use System Chrome:**
Edit `src/core/DeepFRIAutomator.ts`:

```typescript
this.browser = await puppeteer.launch({
  headless: false,
  executablePath: "/usr/bin/google-chrome", // Your Chrome path
  // ... rest of options
});
```

**Solution 3 - Disable Sandbox (Linux):**

```typescript
args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"];
```

---

### Issue: File dialog doesn't open

**Symptom:** Click "Browse" but nothing happens

**Solution (Windows):**

```bash
# Check if file dialogs are blocked
# Settings → Privacy → File System
# Ensure app has permissions
```

**Solution (macOS):**

```bash
# Grant Full Disk Access
# System Preferences → Security & Privacy → Privacy
# Add DeepFRI Desktop to "Full Disk Access"
```

**Solution (Linux):**

```bash
# Check if running in sandboxed environment
# Try with --no-sandbox flag
./DeepFRI-Desktop.AppImage --no-sandbox
```

---

### Issue: "Upload failed" error

**Symptom:** Processing stops during upload

**Solution 1 - Check File Size:**

```bash
# Check ZIP size
ls -lh pdb_files.zip

# If > 100MB, split into smaller batches
```

**Solution 2 - Network Timeout:**
Edit `src/core/DeepFRIAutomator.ts`:

```typescript
await this.page.waitForFunction(
  () => {
    /* condition */
  },
  { timeout: 300000 } // Increase to 5 minutes
);
```

**Solution 3 - Check Internet:**

```bash
# Test connection
ping beta.deepfri.flatironinstitute.org

# Check firewall
# Windows: Allow in Windows Firewall
# macOS: System Preferences → Security → Firewall
# Linux: sudo ufw allow from any to any
```

---

### Issue: Data extraction fails

**Symptom:** Excel file created but empty

**Solution 1 - Verify Selectors:**
The DeepFRI website may have changed. Update selectors in `src/core/DeepFRIAutomator.ts`:

```typescript
// Check if table selector still works
const table = await this.page.$("table");
if (!table) {
  console.error("Table selector outdated");
}
```

**Solution 2 - Increase Wait Times:**

```typescript
await this.page.waitForTimeout(10000); // Increase from 8000
```

**Solution 3 - Debug Mode:**

```typescript
// Enable screenshots for debugging
await this.page.screenshot({
  path: "debug-screenshot.png",
});
```

---

### Issue: Excel generation fails

**Symptom:** "Failed to create Excel file"

**Solution 1 - Check Permissions:**

```bash
# Test write permissions
touch output/test.txt
# If fails, change output folder or run as admin
```

**Solution 2 - Check Disk Space:**

```bash
# Windows
dir
# Shows available space

# Linux/macOS
df -h
# Need at least 100MB free
```

**Solution 3 - Manual Excel Generation:**

```bash
# Try creating file manually
cd output
node -e "const XLSX = require('xlsx'); const wb = XLSX.utils.book_new(); XLSX.writeFile(wb, 'test.xlsx');"
```

---

## 🌐 Network Issues

### Issue: Connection timeout

**Symptom:** "Network timeout" or "Failed to connect"

**Solution 1 - Check DeepFRI Status:**

```bash
# Test if website is accessible
curl -I https://beta.deepfri.flatironinstitute.org
```

**Solution 2 - Proxy Configuration:**
If behind corporate proxy:

```bash
# Set proxy
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# Or in code (src/core/DeepFRIAutomator.ts):
this.browser = await puppeteer.launch({
  args: ['--proxy-server=proxy.company.com:8080']
});
```

**Solution 3 - VPN Issues:**

```bash
# Disconnect VPN temporarily
# Or add DeepFRI to VPN exceptions
```

---

### Issue: SSL/TLS errors

**Error:** `SSL certificate problem`

**Solution (NOT RECOMMENDED FOR PRODUCTION):**

```typescript
// Only for debugging
this.browser = await puppeteer.launch({
  ignoreHTTPSErrors: true,
});
```

**Better Solution:**

```bash
# Update system certificates
# Windows: Update Windows
# macOS: Update macOS
# Linux: sudo update-ca-certificates
```

---

## 💾 Data Issues

### Issue: PDB files not recognized

**Symptom:** "No PDB files found"

**Solution 1 - Check File Extension:**

```bash
# List files with extensions
ls -la *.pdb

# Rename if needed
for f in *.txt; do mv "$f" "${f%.txt}.pdb"; done
```

**Solution 2 - Validate PDB Format:**

```bash
# Check first line
head -n 1 protein.pdb
# Should contain: HEADER, ATOM, MODEL, etc.

# Validate with online tool:
# https://www.rcsb.org/validation
```

**Solution 3 - Convert Format:**

```bash
# If in mmCIF format, convert to PDB
# Use RCSB tools or Biopython
```

---

### Issue: Results are incorrect

**Symptom:** Predictions don't match manual run

**Solution 1 - Verify Input:**

```bash
# Check PDB file integrity
md5sum your_protein.pdb

# Compare with original source
```

**Solution 2 - Clear Cache:**

```bash
# Clear browser cache
rm -rf ~/.cache/puppeteer

# Restart application
```

**Solution 3 - Re-run Analysis:**

```bash
# Sometimes server-side issues occur
# Try processing again
```

---

## 🐛 Development Issues

### Issue: Hot reload not working

**Symptom:** Changes don't appear in dev mode

**Solution:**

```bash
# Kill all electron processes
pkill electron  # Linux/macOS
taskkill /F /IM electron.exe  # Windows

# Clear build cache
rm -rf dist/
npm run build
npm run dev
```

---

### Issue: Debugging is difficult

**Solution - Enable DevTools:**

```typescript
// In src/electron/main.ts
mainWindow.webContents.openDevTools();
```

**Solution - Add Console Logs:**

```typescript
// Add strategic logging
console.log("DEBUG:", variable);
this.updateProgress("DEBUG: Processing step X");
```

**Solution - Remote Debugging:**

```bash
# Start with remote debugging
electron --inspect=5858 .
# Connect with Chrome: chrome://inspect
```

---

### Issue: Build size is too large

**Symptom:** Installer is 300MB+

**Solution:**

```json
// In package.json
{
  "build": {
    "asar": true,
    "compression": "maximum",
    "files": ["dist/**/*", "!node_modules/@types/**/*"]
  }
}
```

---

## 📊 Performance Issues

### Issue: Processing is very slow

**Symptom:** Taking > 2 minutes per protein

**Solution 1 - Network Speed:**

```bash
# Test internet speed
speedtest-cli

# Minimum recommended: 10 Mbps
```

**Solution 2 - Reduce Timeout:**

```typescript
// Balance between reliability and speed
await this.page.waitForTimeout(5000); // Reduce from 8000
```

**Solution 3 - Batch Optimization:**

```typescript
// Process in smaller batches
// 10-20 proteins per batch works best
```

---

### Issue: High memory usage

**Symptom:** Application uses > 4GB RAM

**Solution:**

```typescript
// Add memory limits in src/electron/main.ts
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=4096");
```

---

## 🔍 Advanced Debugging

### Enable Verbose Logging

```typescript
// Add to main.ts
process.env.DEBUG = "*";
process.env.ELECTRON_ENABLE_LOGGING = "1";
```

### Capture Network Traffic

```typescript
// In DeepFRIAutomator.ts
await this.page.setRequestInterception(true);
this.page.on("request", (request) => {
  console.log("Request:", request.url());
  request.continue();
});
```

### Monitor Page Events

```typescript
this.page.on("console", (msg) => console.log("PAGE:", msg.text()));
this.page.on("error", (err) => console.error("PAGE ERROR:", err));
```

---

## 📞 Getting Help

If issues persist:

1. **Check GitHub Issues:**
   https://github.com/yourlab/deepfri-desktop/issues

2. **Create New Issue:**
   Include:

   - OS and version
   - Application version
   - Complete error message
   - Steps to reproduce
   - Console/log output
   - Screenshots

3. **Email Support:**
   support@yourlab.org

4. **Community Forum:**
   [Your Forum Link]

---

## 🛠️ Emergency Fixes

### Complete Reset

```bash
# Backup your data first!

# Remove all application data
# Windows
rmdir /s "%APPDATA%\DeepFRI Desktop"

# macOS
rm -rf ~/Library/Application\ Support/DeepFRI\ Desktop

# Linux
rm -rf ~/.config/DeepFRI\ Desktop

# Reinstall application
```

### Force Update Dependencies

```bash
cd deepfri-desktop
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

### Rollback to Previous Version

```bash
# Download previous version from releases
# Uninstall current version
# Install previous version
```

---

## ✅ Checklist Before Reporting Bug

- [ ] Tried restarting application
- [ ] Checked internet connection
- [ ] Verified PDB files are valid
- [ ] Checked logs for errors
- [ ] Tried with different input data
- [ ] Updated to latest version
- [ ] Searched existing issues
- [ ] Collected error messages
- [ ] Can reproduce consistently

---

**Last Updated:** January 2024  
**Version:** 1.0.0
