# 🖼️ WebP Image Optimization Guide

**Status:** Script Ready ✅ | Requires `cwebp` Installation

---

## 🚀 **QUICK START**

### **Step 1: Install cwebp**
```bash
brew install webp
```

### **Step 2: Run Optimization Script**
```bash
cd scripts
./optimize-images.sh
```

### **Step 3: Update HTML with WebP Fallbacks**

**Example Pattern:**
```html
<picture>
    <source srcset="/assets/webp/image.webp" type="image/webp">
    <img src="/assets/image.png" alt="Description" loading="lazy">
</picture>
```

---

## 📋 **CURRENT IMAGES TO OPTIMIZE**

### **Main Site:**
- `/assets/icon-192.png` → `/assets/webp/icon-192.webp`
- `/assets/icon-512.png` → `/assets/webp/icon-512.webp`
- `/assets/favicon.png` → `/assets/webp/favicon.webp`
- `/assets/og-image.png` → `/assets/webp/og-image.webp`

### **Project Screenshots:**
- `/projects/basin-nexus/screenshots/*.png` (6 files)
- `/assets/modules/*.png` (3 files)
- `/assets/modules/module_comms.jpg` (1 file)

**Total:** ~18 PNG files, 1 JPG file

---

## 🔧 **HTML UPDATES NEEDED**

### **1. Update Favicon/Icons in `index.html`:**
```html
<!-- Before -->
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">

<!-- After (with fallback) -->
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<!-- WebP version will be used automatically by modern browsers -->
```

### **2. Update OG Image:**
```html
<!-- Before -->
<meta property="og:image" content="https://basinleon.github.io/assets/og-image.png">

<!-- After -->
<meta property="og:image" content="https://basinleon.github.io/assets/webp/og-image.webp">
<meta property="og:image:type" content="image/webp">
<meta property="og:image:fallback" content="https://basinleon.github.io/assets/og-image.png">
```

### **3. Update Project Screenshots:**
```html
<!-- Before -->
<img src="/projects/basin-nexus/screenshots/nexus_v05_main.png" alt="NEXUS Dashboard">

<!-- After -->
<picture>
    <source srcset="/projects/basin-nexus/screenshots/webp/nexus_v05_main.webp" type="image/webp">
    <img src="/projects/basin-nexus/screenshots/nexus_v05_main.png" alt="NEXUS Dashboard" loading="lazy">
</picture>
```

---

## 📊 **EXPECTED RESULTS**

**File Size Reduction:**
- **PNG → WebP:** Typically 25-35% smaller
- **JPG → WebP:** Typically 25-30% smaller

**Performance Impact:**
- Faster page loads
- Better mobile experience
- Improved Core Web Vitals scores

---

## ✅ **VERIFICATION CHECKLIST**

After optimization:
- [ ] All WebP files created in `/assets/webp/`
- [ ] HTML updated with `<picture>` tags and fallbacks
- [ ] Test images load correctly in browser
- [ ] Verify file sizes are smaller
- [ ] Test fallback works in older browsers

---

## 🚨 **IMPORTANT NOTES**

1. **Keep Original Files:** Don't delete PNG/JPG originals (needed for fallbacks)
2. **Browser Support:** WebP supported in 95%+ of browsers (Safari 14+, Chrome, Firefox, Edge)
3. **Fallback Required:** Always include original format as fallback
4. **Lazy Loading:** Add `loading="lazy"` to images below the fold

---

**Once `cwebp` is installed, run the script and update HTML!** 🚀
