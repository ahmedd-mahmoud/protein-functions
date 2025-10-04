# DeepFRI Desktop - User Manual

Complete guide for scientists and researchers using DeepFRI Desktop.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Preparing Your Data](#preparing-your-data)
5. [Running Analysis](#running-analysis)
6. [Understanding Results](#understanding-results)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

### What is DeepFRI Desktop?

DeepFRI Desktop is a user-friendly application that automates protein function prediction using the DeepFRI (Deep Functional Residue Identification) web service. It processes PDB structure files and predicts:

- **Molecular Function** - What the protein does at the molecular level
- **Biological Process** - What biological processes the protein is involved in
- **Enzyme Commission** - Enzyme classification if applicable

### Who is this for?

- Structural biologists
- Computational biologists
- Protein researchers
- Bioinformatics scientists
- Anyone analyzing protein structures

### Key Benefits

✅ **No programming required** - Simple point-and-click interface  
✅ **Batch processing** - Analyze multiple proteins at once  
✅ **Automated workflow** - Handles uploads, processing, and result collection  
✅ **Professional reports** - Excel files with organized predictions  
✅ **Detailed data** - JSON files with complete prediction information

---

## Installation

### System Requirements

**Minimum:**

- Windows 10 (64-bit) / macOS 10.13+ / Ubuntu 18.04+
- 4 GB RAM
- 500 MB free disk space
- Internet connection

**Recommended:**

- Windows 11 / macOS 12+ / Ubuntu 22.04+
- 8 GB RAM
- 2 GB free disk space
- Stable broadband connection

### Windows Installation

1. **Download the Installer**

   - Download `DeepFRI Desktop Setup.exe`
   - Size: ~150 MB

2. **Run the Installer**

   - Double-click the `.exe` file
   - If Windows warns about "Unknown Publisher":
     - Click "More info"
     - Click "Run anyway"

3. **Choose Installation Options**

   - Select installation directory (default is fine)
   - Choose to create desktop shortcut ✓
   - Choose to create Start Menu entry ✓

4. **Complete Installation**

   - Click "Install"
   - Wait for installation (1-2 minutes)
   - Click "Finish"

5. **Launch Application**
   - From Desktop shortcut, or
   - From Start Menu: Search "DeepFRI Desktop"

### macOS Installation

1. **Download the DMG**

   - Download `DeepFRI Desktop.dmg`

2. **Mount the DMG**

   - Double-click the DMG file
   - Drag "DeepFRI Desktop" to Applications folder

3. **First Launch**
   - Open Finder → Applications
   - Right-click "DeepFRI Desktop"
   - Select "Open"
   - Click "Open" in security dialog
   - (This is required only for the first launch)

### Linux Installation

**AppImage (Universal):**

```bash
chmod +x DeepFRI-Desktop-1.0.0.AppImage
./DeepFRI-Desktop-1.0.0.AppImage
```

**Debian/Ubuntu:**

```bash
sudo dpkg -i deepfri-desktop_1.0.0_amd64.deb
deepfri-desktop
```

---

## Getting Started

### First Time Setup

1. **Launch the Application**

   - Application window opens
   - Modern purple gradient interface

2. **Understand the Interface**
   - **PDB Files Folder**: Where your input files are
   - **Output Folder**: Where results will be saved
   - **Start Processing**: Button to begin analysis
   - **Progress Section**: Shows real-time status
   - **Results Section**: Displays completion statistics

### Interface Overview

```
┌──────────────────────────────────────────┐
│     🧬 DeepFRI Protein Function          │
│         Predictor                        │
├──────────────────────────────────────────┤
│                                          │
│  📁 PDB Files Folder                     │
│  [  No folder selected  ] [ Browse ]     │
│                                          │
│  📂 Output Folder                        │
│  [  No folder selected  ] [ Browse ]     │
│                                          │
│  [    Start Processing    ]              │
│                                          │
│  ═══════ Progress ═══════                │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 50%               │
│  Processing protein 5/10...              │
│                                          │
│  ═══════ Results ═══════                 │
│  ✅ Processing Complete!                 │
│  Total Proteins: 10                      │
│  Structure-Based: 25                     │
│  Sequence-Based: 5                       │
└──────────────────────────────────────────┘
```

---

## Preparing Your Data

### PDB File Requirements

**File Format:**

- Extension: `.pdb`
- Standard PDB format from RCSB PDB or similar
- Can be experimental structures or predicted models

**File Naming:**

- Use descriptive names: `protein1.pdb`, `my_protein.pdb`
- Avoid special characters: `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`
- Names will appear in your results

**File Organization:**

```
my_proteins/
├── protein_A.pdb
├── protein_B.pdb
├── protein_C.pdb
└── protein_D.pdb
```

### Where to Get PDB Files

1. **RCSB Protein Data Bank**

   - URL: https://www.rcsb.org/
   - Download experimental structures

2. **AlphaFold Database**

   - URL: https://alphafold.ebi.ac.uk/
   - Download predicted structures

3. **Your Own Predictions**
   - From AlphaFold2, RoseTTAFold, etc.
   - Ensure proper PDB format

### Preparing Your Folder

1. **Create a folder** for your PDB files

   ```
   Example: C:\Users\YourName\Documents\PDB_Files\
   ```

2. **Copy all PDB files** into this folder

   - Only PDB files
   - Remove other file types

3. **Verify files**
   - Open a PDB file in text editor
   - Should start with "ATOM" or "HEADER" lines

---

## Running Analysis

### Step-by-Step Workflow

#### Step 1: Select PDB Files Folder

1. Click **"Browse"** next to "PDB Files Folder"
2. Navigate to your folder containing PDB files
3. Click **"Select Folder"**
4. Application validates folder:
   - ✅ **Green badge**: "✓ X PDB files found"
   - ❌ **Red badge**: "⚠ No PDB files found"

#### Step 2: Select Output Folder

1. Click **"Browse"** next to "Output Folder"
2. Navigate to where you want results saved
3. Create new folder if needed
4. Click **"Select Folder"**
5. Path displays in the field

#### Step 3: Start Processing

1. **"Start Processing"** button becomes enabled
2. Click **"Start Processing"**
3. Button shows: "🔄 Processing..."

#### Step 4: Monitor Progress

**Browser Opens:**

- Automated browser window opens (Puppeteer)
- **DO NOT CLOSE THIS BROWSER**
- You can minimize it, but don't close

**Progress Updates:**

- Progress bar advances (0-100%)
- Status messages update:
  - "Initializing browser..."
  - "Uploading ZIP file..."
  - "Processing protein 3/10..."
  - "Generating Excel report..."

**Time Estimates:**

- Setup: 1-2 minutes
- Per protein: 30-60 seconds
- 10 proteins: ~10-15 minutes
- 50 proteins: ~45-60 minutes

#### Step 5: Completion

**Success:**

- ✅ Green checkmark appears
- "Processing Complete!" message
- Statistics displayed:
  - Total Proteins
  - Structure-Based predictions
  - Sequence-Based predictions

**Browser Closes:**

- Automated browser closes automatically

---

## Understanding Results

### Output Files Structure

```
output_folder/
├── deepfri_results.xlsx      # Main Excel report
└── tags/                      # Detailed JSON files
    ├── protein_A.json
    ├── protein_B.json
    └── protein_C.json
```

### Excel Report (deepfri_results.xlsx)

#### Sheet Structure

| File Name | Molecular Function |            |       | Biological Process      |            |       | Enzyme Commission |             |       |
| --------- | ------------------ | ---------- | ----- | ----------------------- | ---------- | ----- | ----------------- | ----------- | ----- |
|           | Name               | GO         | Score | Name                    | GO         | Score | Name              | GO          | Score |
| protein_A | hydrolase activity | GO:0016787 | 0.73  | protein phosphorylation | GO:0006468 | 0.92  | kinase activity   | EC:2.7.11.1 | 0.88  |

#### Column Descriptions

**Molecular Function:**

- **Name**: Function description
- **GO**: Gene Ontology term (GO:XXXXXXX)
- **Score**: Confidence score (0.0-1.0)
- Up to 3 predictions per protein

**Biological Process:**

- Same structure as Molecular Function
- Describes biological pathways

**Enzyme Commission:**

- **Name**: Enzyme type
- **GO**: EC number (EC:X.X.X.X)
- **Score**: Confidence score

#### Color Coding

- **White Background**: Structure-based prediction (preferred)
- **Light Red Background**: Sequence-based prediction (fallback)

Structure-based predictions are more accurate and reliable.

### JSON Tags Files

Each protein gets a JSON file with detailed predictions:

```json
{
  "protein_id": "protein_A",
  "predictions": {
    "molecular_function": [...],
    "biological_process": [...],
    "enzyme_commission": [...]
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "method": "structure-based"
  }
}
```

**Use Cases:**

- Programmatic analysis
- Custom processing scripts
- Integration with other tools
- Complete prediction details

---

## Advanced Features

### Batch Processing Tips

**Optimal Batch Sizes:**

- Small: 1-10 proteins (15 minutes)
- Medium: 10-50 proteins (1 hour)
- Large: 50-100 proteins (2 hours)
- Very Large: 100+ proteins (3+ hours)

**For Large Batches:**

1. Ensure stable internet connection
2. Disable computer sleep mode
3. Close unnecessary applications
4. Process overnight if needed

### Interpreting Confidence Scores

| Score Range | Interpretation       |
| ----------- | -------------------- |
| 0.9 - 1.0   | Very high confidence |
| 0.7 - 0.9   | High confidence      |
| 0.5 - 0.7   | Moderate confidence  |
| 0.3 - 0.5   | Low confidence       |
| 0.0 - 0.3   | Very low confidence  |

**Recommendations:**

- Focus on predictions with score > 0.7
- Verify low-score predictions experimentally
- Use multiple prediction methods

### Using Results in Research

**In Publications:**

```
Protein function predictions were performed using DeepFRI
(Gligorijević et al., 2021) via DeepFRI Desktop v1.0.0.
```

**Citation:**

```
Gligorijević, V., Renfrew, P. D., Kosciolek, T., et al. (2021).
Structure-based protein function prediction using graph
convolutional networks. Nature Communications, 12(1), 1-14.
```

---

## Troubleshooting

### Common Issues

#### "No PDB files found"

**Problem:** Selected folder doesn't contain `.pdb` files

**Solutions:**

- Verify files have `.pdb` extension
- Check folder path is correct
- Ensure files aren't in subfolders
- Try selecting a different folder

#### Browser doesn't open

**Problem:** Puppeteer fails to launch browser

**Solutions:**

1. Check internet connection
2. Restart application
3. Run as Administrator (Windows)
4. Reinstall application
5. Check firewall settings

#### Processing fails midway

**Problem:** Error during protein processing

**Solutions:**

- Check internet stability
- Verify PDB file formats
- Ensure sufficient disk space
- Try processing smaller batches
- Check DeepFRI website is accessible

#### Excel file not created

**Problem:** No output file generated

**Solutions:**

- Check write permissions on output folder
- Ensure output folder exists
- Try a different output location
- Check disk space

#### Slow processing

**Problem:** Takes longer than expected

**Possible Causes:**

- Slow internet connection
- DeepFRI server load
- Large protein structures
- Many proteins in batch

**Solutions:**

- Process during off-peak hours
- Reduce batch size
- Upgrade internet connection

---

## FAQ

### General Questions

**Q: Do I need programming knowledge?**  
A: No, the application is designed for scientists without programming experience.

**Q: Is this free to use?**  
A: Yes, the application is free. DeepFRI service is also free for academic use.

**Q: Can I use predicted structures (AlphaFold)?**  
A: Yes, DeepFRI works with both experimental and predicted structures.

**Q: How accurate are the predictions?**  
A: Structure-based predictions are highly accurate (>80% for well-folded proteins). See DeepFRI paper for benchmarks.

### Technical Questions

**Q: What happens to my PDB files?**  
A: Files are uploaded to DeepFRI servers for processing. No files are stored by this application.

**Q: Can I process files offline?**  
A: No, internet connection is required to access DeepFRI web service.

**Q: What's the maximum number of proteins?**  
A: No hard limit, but batches over 100 proteins may take several hours.

**Q: Can I stop and resume processing?**  
A: No, processing must complete in one session. Plan accordingly.

**Q: Will my computer slow down during processing?**  
A: Minimal impact. The application uses modest resources.

### Results Questions

**Q: What does "sequence-based" mean?**  
A: When structure-based prediction isn't available, DeepFRI falls back to sequence-only methods (less accurate).

**Q: Why are some predictions missing?**  
A: If confidence is too low or category isn't applicable, no prediction is shown.

**Q: Can I export to other formats?**  
A: Currently Excel (.xlsx) and JSON. CSV export planned for future versions.

**Q: How do I interpret GO terms?**  
A: Visit https://geneontology.org/ to look up specific GO terms.

---

## Getting Help

### Support Channels

**GitHub Issues:**
https://github.com/yourlab/deepfri-desktop/issues

**Email Support:**
support@yourlab.org

**Documentation:**

- README.md - Quick overview
- DEPLOYMENT_GUIDE.md - For developers
- This manual - Complete user guide

### Reporting Bugs

When reporting issues, include:

1. Operating system and version
2. Application version
3. Steps to reproduce
4. Error messages (if any)
5. Screenshots (if relevant)

### Feature Requests

We welcome suggestions! Please:

1. Search existing issues first
2. Describe use case clearly
3. Explain expected behavior
4. Provide examples if possible

---

## Updates and Maintenance

### Checking for Updates

Currently manual:

1. Visit GitHub releases page
2. Check version number
3. Download new installer if available

**Auto-update** coming in v1.1.0!

### Staying Informed

- Watch GitHub repository for releases
- Subscribe to mailing list
- Follow on Twitter: @YourLab

---

## Appendix

### GO Term Categories

**Molecular Function (MF):**

- Catalytic activity
- Binding activity
- Transporter activity
- Structural molecule activity
- Regulatory activity

**Biological Process (BP):**

- Metabolic process
- Cellular process
- Biological regulation
- Developmental process
- Response to stimulus

**Enzyme Commission (EC):**

- Oxidoreductases (EC 1.x.x.x)
- Transferases (EC 2.x.x.x)
- Hydrolases (EC 3.x.x.x)
- Lyases (EC 4.x.x.x)
- Isomerases (EC 5.x.x.x)
- Ligases (EC 6.x.x.x)

### Keyboard Shortcuts

Currently no custom shortcuts. Use standard OS shortcuts:

- Alt+F4 / Cmd+Q: Quit application
- Alt+Tab / Cmd+Tab: Switch windows

### Privacy and Data

**What data is collected:**

- None by the application itself
- DeepFRI servers process uploaded structures

**Data retention:**

- Application doesn't store your data
- Check DeepFRI privacy policy for server-side storage

**Security:**

- Files transferred via HTTPS
- No sensitive data logged locally

---

## Glossary

**PDB**: Protein Data Bank format for 3D structures  
**GO Term**: Gene Ontology standardized annotation  
**EC Number**: Enzyme Commission classification  
**Confidence Score**: Prediction reliability (0-1)  
**Structure-based**: Prediction using 3D structure  
**Sequence-based**: Prediction using amino acid sequence only  
**Batch Processing**: Analyzing multiple proteins at once

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintained by:** Your Lab Name

---

Thank you for using DeepFRI Desktop! 🧬
