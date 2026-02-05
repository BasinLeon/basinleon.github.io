# 🧪 Comprehensive Test Checklist

**Date:** January 2026  
**Purpose:** Verify all features work before going live

---

## ✅ **CRITICAL TESTS (Must Pass)**

### **Navigation & Layout**
- [ ] Main navigation links work (Results, Projects, Blog, Case Studies, ROI Calculator)
- [ ] Mobile hamburger menu opens/closes
- [ ] Breadcrumb shows on pages (not on homepage)
- [ ] Breadcrumb doesn't cover KPI metrics
- [ ] Top bar height is correct (60px)
- [ ] All sections scroll smoothly

### **Interactive Features**
- [ ] Terminal auto-complete works (type partial command, see suggestions)
- [ ] Terminal Tab key auto-completes
- [ ] Terminal arrow keys navigate history
- [ ] Terminal suggestions are clickable
- [ ] ROI Calculator calculates correctly
- [ ] ROI Calculator opens agent after calculation
- [ ] Agent receives ROI data correctly
- [ ] Premium modal buttons all clickable
- [ ] All payment methods trigger email fallback

### **Content & Links**
- [ ] All blog post links work
- [ ] Related posts show on blog posts
- [ ] Case study links work
- [ ] Calendar link works (or shows email fallback)
- [ ] Newsletter form validates email
- [ ] Newsletter form shows success message
- [ ] Publications page loads
- [ ] Library page loads

### **Mobile Responsiveness**
- [ ] Mobile navigation doesn't block content
- [ ] Mobile CTA banner visible
- [ ] All buttons clickable on mobile
- [ ] Text readable on mobile
- [ ] Images scale correctly
- [ ] Forms work on mobile

---

## 🎨 **VISUAL TESTS**

### **Dark/Light Mode**
- [ ] Theme toggle works
- [ ] Dark mode applies correctly
- [ ] Light mode applies correctly
- [ ] Preference saves in localStorage
- [ ] No white background flash

### **Styling**
- [ ] All gold accents visible
- [ ] Metrics display correctly
- [ ] No overlapping elements
- [ ] Spacing looks good
- [ ] Fonts load correctly

---

## 🔧 **FUNCTIONAL TESTS**

### **Search**
- [ ] Site-wide search works
- [ ] Search finds blog posts
- [ ] Search finds case studies
- [ ] Search results are clickable
- [ ] Mobile search works

### **Forms**
- [ ] Newsletter form validates
- [ ] Contact form works (if exists)
- [ ] Email validation shows errors
- [ ] Success messages display

### **External Links**
- [ ] All external links open in new tab
- [ ] Links have `rel="noopener noreferrer"`
- [ ] GitHub links work
- [ ] LinkedIn links work

---

## 📱 **DEVICE TESTS**

### **Desktop (Chrome, Firefox, Safari)**
- [ ] All features work
- [ ] No console errors
- [ ] Performance is good

### **Mobile (iPhone, Android)**
- [ ] Navigation works
- [ ] Forms work
- [ ] Buttons clickable
- [ ] Text readable

### **Tablet (iPad)**
- [ ] Layout adapts
- [ ] Touch interactions work

---

## 🚨 **KNOWN ISSUES TO CHECK**

- [ ] Git repository corruption (needs manual fix)
- [ ] GA4 placeholder (needs Measurement ID)
- [ ] Calendar link error (may need account verification)

---

## ✅ **QUICK TEST SCRIPT**

Run these in browser console:

```javascript
// Test terminal
Terminal.executeCommand('help');

// Test agent
window.DigitalLeon?.openWindow();

// Test search
document.getElementById('site-search-input')?.focus();

// Test theme toggle
document.getElementById('theme-toggle')?.click();
```

---

## 📋 **TEST RESULTS**

**Date Tested:** _____________  
**Tester:** _____________  
**Browser:** _____________  
**Device:** _____________  

**Issues Found:**
1. 
2. 
3. 

**All Critical Tests Pass:** ☐ Yes ☐ No

---

**Once all tests pass, you're ready to deploy!** 🚀
