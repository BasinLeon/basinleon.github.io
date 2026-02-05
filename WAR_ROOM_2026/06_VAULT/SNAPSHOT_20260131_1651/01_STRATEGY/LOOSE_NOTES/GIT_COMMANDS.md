# Git Commands for Your Website

## Quick Reference

### **Navigate to Your Website Directory**
```bash
cd "/Users/basin/Desktop/untitled folder/Basin & Associates 🌍/untitled folder 2/Basin & Associates 🌍/basinleon.github.io"
```

### **Check Status** (See what changed)
```bash
git status
```

### **Add All Changes**
```bash
git add -A
```
Or add specific files:
```bash
git add index.html
git add blog/posts/new-article.html
```

### **Commit Changes** (Save with a message)
```bash
git commit -m "Your commit message here"
```

### **Push to GitHub** (Upload to live site)
```bash
git push origin main
```

---

## Complete Workflow (Most Common)

```bash
# 1. Go to your website folder
cd "/Users/basin/Desktop/untitled folder/Basin & Associates 🌍/untitled folder 2/Basin & Associates 🌍/basinleon.github.io"

# 2. Check what changed
git status

# 3. Add all changes
git add -A

# 4. Commit with a message
git commit -m "Update homepage styling"

# 5. Push to GitHub
git push origin main
```

---

## One-Liner (Quick Push)

```bash
cd "/Users/basin/Desktop/untitled folder/Basin & Associates 🌍/untitled folder 2/Basin & Associates 🌍/basinleon.github.io" && git add -A && git commit -m "Your message" && git push origin main
```

---

## Useful Commands

### **See Recent Commits**
```bash
git log --oneline -5
```

### **See What Changed in a File**
```bash
git diff index.html
```

### **Pull Latest Changes** (Get updates from GitHub)
```bash
git pull origin main
```

### **Undo Last Commit** (Keep changes, remove commit)
```bash
git reset --soft HEAD~1
```

### **Discard All Changes** (⚠️ Careful - loses work!)
```bash
git reset --hard HEAD
```

---

## Common Scenarios

### **Scenario 1: You Made Changes and Want to Push**
```bash
cd "/Users/basin/Desktop/untitled folder/Basin & Associates 🌍/untitled folder 2/Basin & Associates 🌍/basinleon.github.io"
git add -A
git commit -m "Fix dark mode styling"
git push origin main
```

### **Scenario 2: Someone Else Pushed Changes (Merge Conflict)**
```bash
git pull origin main
# If conflicts, resolve them, then:
git add -A
git commit -m "Merge conflicts resolved"
git push origin main
```

### **Scenario 3: You Want to See What's Different**
```bash
git status          # See which files changed
git diff            # See what changed in files
git log --oneline   # See commit history
```

---

## Your Repository Info

- **Repository:** `basinleon.github.io`
- **Branch:** `main`
- **Remote:** `origin`
- **URL:** `https://github.com/BasinLeon/basinleon.github.io.git`

---

## Tips

1. **Always check status first:** `git status` shows what changed
2. **Write clear commit messages:** "Fix dark mode" is better than "update"
3. **Push regularly:** Don't let changes pile up
4. **GitHub Pages auto-deploys:** Changes appear on your site in 1-2 minutes after push

---

## Troubleshooting

### **"Nothing to commit"**
- You haven't made any changes, or
- You already committed everything

### **"Permission denied"**
- You need to authenticate with GitHub
- Use: `gh auth login` (if you have GitHub CLI)
- Or set up SSH keys

### **"Updates were rejected"**
- Someone else pushed changes
- Run: `git pull origin main` first, then push again

### **"Branch is ahead"**
- You have local commits that aren't pushed
- Run: `git push origin main`
