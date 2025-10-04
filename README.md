# DeepFRI Desktop - Protein Function Predictor

A professional Windows desktop application for automated protein function prediction using the DeepFRI web service. Built for biology researchers and scientists.

## 🌟 Features

- **User-Friendly GUI**: Simple, intuitive interface designed for researchers
- **Batch Processing**: Process multiple PDB files automatically
- **Real-time Progress**: Live updates during processing
- **Comprehensive Results**: Excel reports with GO terms and confidence scores
- **Smart Predictions**: Prioritizes structure-based over sequence-based predictions
- **JSON Tags Export**: Downloads detailed prediction tags for each protein
- **Visual Indicators**: Color-coded results for prediction type identification
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 📋 Prerequisites

Before building or running the application, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **Bun** package manager
- **Git** (optional, for cloning the repository)

## 🚀 Quick Start for Users

### Option 1: Download Pre-built Application

1. Download the latest release from the [Releases page](https://github.com/yourlab/deepfri-desktop/releases)
2. Install the application:
   - **Windows**: Run the `.exe` installer
   - **macOS**: Open the `.dmg` file and drag to Applications
   - **Linux**: Run the `.AppImage` file or install the `.deb` package
3. Launch "DeepFRI Desktop" from your applications menu

### Option 2: Run from Source

```bash
# Clone the repository
git clone https://github.com/yourlab/deepfri-desktop.git
cd deepfri-desktop

# Install dependencies
npm install

# Run the application
npm run dev
```

## 📖 How to Use

1. **Launch the Application**

   - Open DeepFRI Desktop from your applications menu

2. **Select PDB Files Folder**

   - Click "Browse" next to "PDB Files Folder"
   - Navigate to your folder containing `.pdb` files
   - The app will validate and show the number of PDB files found

3. **Select Output Folder**

   - Click "Browse" next to "Output Folder"
   - Choose where you want the results saved
   - A new folder will be created if it doesn't exist

4. **Start Processing**

   - Click "Start Processing"
   - Watch the real-time progress bar
   - The browser will open automatically (do not close it)

5. **View Results**
   - Results are saved in your output folder:
     - `deepfri_results.xlsx` - Main Excel report
     - `tags/` folder - JSON files with detailed predictions

## 📁 Project Structure

```
deepfri-desktop/
├── src/
│   ├── core/
│   │   └── DeepFRIAutomator.ts      # Core automation logic
│   ├── electron/
│   │   ├── main.ts                   # Electron main process
│   │   └── preload.ts                # IPC bridge
│   ├── utils/
│   │   ├── excelUtils.ts             # Excel generation
│   │   └── fileUtils.ts              # File operations
│   ├── types/
│   │   └── index.ts                  # TypeScript definitions
│   └── renderer/
│       └── index.html                # GUI interface
├── assets/
│   ├── icon.png                      # App icon
│   ├── icon.ico                      # Windows icon
│   └── icon.icns                     # macOS icon
├── dist/                             # Compiled TypeScript
├── release/                          # Built applications
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

## 🛠️ Development Setup

### Install Dependencies

```bash
npm install
```

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

### Build for Production

```bash
# Build TypeScript
npm run build

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

## 📦 Building for Distribution

### Windows Executable

```bash
# Install dependencies
npm install

# Build the application
npm run build:win

# Output: release/DeepFRI Desktop Setup 1.0.0.exe
```

The installer will be created in the `release/` folder with:

- Full installer (`.exe`)
- Portable version (`.exe`)

### macOS Application

```bash
npm run build:mac

# Output: release/DeepFRI Desktop-1.0.0.dmg
```

### Linux Application

```bash
npm run build:linux

# Output:
# - release/DeepFRI Desktop-1.0.0.AppImage
# - release/deepfri-desktop_1.0.0_amd64.deb
```

## 📊 Output Format

### Excel File Structure

The generated Excel file contains:

| Column             | Description                          |
| ------------------ | ------------------------------------ |
| File Name          | Original PDB filename                |
| Molecular Function | Name, GO term, Score (3 predictions) |
| Biological Process | Name, GO term, Score (3 predictions) |
| Enzyme Commission  | Name, GO term, Score (3 predictions) |

**Color Coding:**

- 🔴 Light red background = Sequence-based prediction
- ⚪ White background = Structure-based prediction

### Tags Folder

JSON files containing detailed prediction data for each protein:

- Full GO term hierarchies
- Confidence scores
- Prediction metadata

## 🔧 Configuration

### Customizing the Build

Edit `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.yourlab.deepfri",
    "productName": "DeepFRI Desktop",
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

### Changing the Icon

Replace icons in the `assets/` folder:

- `icon.png` - 512x512 PNG for Linux
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

## 🐛 Troubleshooting

### Browser doesn't open automatically

- Ensure Puppeteer is installed correctly
- Check your internet connection
- Try running with administrator privileges

### No PDB files found

- Ensure files have `.pdb` extension
- Check folder permissions
- Verify files are not corrupted

### Processing fails

- Check DeepFRI website is accessible
- Ensure sufficient disk space
- Review console logs for specific errors

### Build fails on Windows

- Install Windows Build Tools: `npm install --global windows-build-tools`
- Run as Administrator
- Ensure Visual Studio Build Tools are installed

## 📚 Technical Details

### Technologies Used

- **Electron**: Desktop application framework
- **Puppeteer**: Web automation for DeepFRI
- **TypeScript**: Type-safe development
- **XLSX**: Excel file generation
- **Archiver**: ZIP file creation

### System Requirements

- **OS**: Windows 10/11, macOS 10.13+, Ubuntu 18.04+
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 500MB for application + space for results
- **Internet**: Required for DeepFRI access

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DeepFRI team at Flatiron Institute
- The open-source community
- All contributors and testers

## 📧 Support

For issues, questions, or feature requests:

- Open an issue on [GitHub Issues](https://github.com/yourlab/deepfri-desktop/issues)
- Email: support@yourlab.org
- Documentation: [Wiki](https://github.com/yourlab/deepfri-desktop/wiki)

## 🔄 Version History

### v1.0.0 (Current)

- Initial release
- Batch PDB processing
- Excel report generation
- JSON tags export
- Real-time progress tracking

---

**Made with ❤️ for the scientific community**
