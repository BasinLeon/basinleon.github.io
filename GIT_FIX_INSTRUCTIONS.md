# 🔧 Git Repository Fix Instructions

**Issue:** Repository corruption detected (`fatal: unable to read tree`)  
**Impact:** Cannot commit/push changes to GitHub Pages  
**Solution:** Fresh clone approach (safest)

---

## 🚨 **OPTION 1: Fresh Clone (Recommended)**

### **Step 1: Backup Current Files**
```bash
# Copy all your files to a safe location
cp -r "untitled folder 2/Basin & Associates 🌍/basinleon.github.io" ~/Desktop/basinleon-backup
```

### **Step 2: Clone Fresh Repository**
```bash
cd ~/Desktop
git clone https://github.com/BasinLeon/basinleon.github.io.git basinleon-fresh
```

### **Step 3: Copy Files Back**
```bash
# Copy all files from backup to fresh repo
cp -r ~/Desktop/basinleon-backup/* ~/Desktop/basinleon-fresh/
cd ~/Desktop/basinleon-fresh
```

### **Step 4: Commit and Push**
```bash
git add .
git commit -m "Complete website overhaul: interactive terminal, ROI calculator integration, breadcrumb navigation, visitor counter, premium buttons, publications, library enhancements, internal linking"
git push origin main
```

---

## 🔧 **OPTION 2: Try to Repair (If Option 1 Fails)**

### **Step 1: Check Repository Status**
```bash
cd "untitled folder 2/Basin & Associates 🌍/basinleon.github.io"
git fsck --full
```

### **Step 2: Try Garbage Collection**
```bash
git gc --aggressive
git prune
```

### **Step 3: If Still Failing, Remove Corrupted Object**
```bash
# Find the corrupted object
git fsck --full | grep "error: invalid object"

# Remove it (if safe)
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### **Step 4: Force Push (Last Resort)**
```bash
git push origin main --force
```

**⚠️ Warning:** Force push can overwrite remote history. Only use if you're sure.

---

## ✅ **OPTION 3: Manual Commit (If Git Completely Broken)**

If git is completely broken, you can:

1. **Download ZIP from GitHub:**
   - Go to https://github.com/BasinLeon/basinleon.github.io
   - Click "Code" → "Download ZIP"
   - Extract to a new folder

2. **Copy Your Files:**
   - Copy all modified files from your current directory
   - Overwrite files in the fresh download

3. **Upload via GitHub Web Interface:**
   - Go to https://github.com/BasinLeon/basinleon.github.io
   - Click "Upload files"
   - Drag and drop your files
   - Commit with message

---

## 🎯 **RECOMMENDED APPROACH**

**Use Option 1 (Fresh Clone)** - It's the safest and cleanest solution.

**Time Required:** 15-30 minutes  
**Risk:** Low (you have backups)

---

## 📋 **After Git is Fixed**

Once you can commit successfully:

1. ✅ All your changes will be live on GitHub Pages
2. ✅ Everything will be backed up
3. ✅ You can continue normal development

---

**Need help?** The fresh clone approach is the most reliable way to fix repository corruption.
