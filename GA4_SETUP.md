# Google Analytics 4 Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Create a new property (or use existing)
4. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Update Your Website

Replace `G-XXXXXXXXXX` in these files:
- `/index.html` (line 35, 40)
- `/blog/index.html` (if it has GA4)
- `/consulting/index.html` (if it has GA4)

**Find and replace:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    gtag('config', 'G-XXXXXXXXXX', {
```

**With your actual ID:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
<script>
    gtag('config', 'G-YOUR-ACTUAL-ID', {
```

### Step 3: Verify It's Working

1. Visit your website
2. Open browser DevTools (F12)
3. Go to Network tab
4. Filter by "gtag"
5. You should see requests to `google-analytics.com`

Or use [Google Tag Assistant](https://tagassistant.google.com/) to verify.

---

## Events Already Tracked

Your website tracks these custom events:

### **Page Views**
- Automatic on every page load
- Includes page title, URL, path

### **Social Shares**
- `share` event with method (twitter, linkedin, facebook, copy)
- Tracks which articles are shared

### **Calendar Clicks**
- `calendar_click` event
- Tracks calendar type and fallback usage

### **Newsletter Signups**
- `newsletter_signup` event (when implemented)
- Tracks email captures

### **Agent Interactions**
- `agent_open` - When agent widget opens
- `agent_message` - When user sends message
- `premium_upgrade_click` - When premium button clicked

---

## Custom Events You Can Add

### Example: Track ROI Calculator Usage

```javascript
// In roi-calculator.html
gtag('event', 'roi_calculated', {
    'sdr_count': sdrCount,
    'annual_savings': annualSavings,
    'roi_percentage': roiPercentage
});
```

### Example: Track Blog Article Reads

```javascript
// In blog posts
gtag('event', 'article_read', {
    'article_title': document.title,
    'article_category': 'Case Study',
    'read_time_seconds': timeSpent
});
```

---

## View Your Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Realtime** (see live traffic)
4. Go to **Reports** → **Engagement** → **Events** (see custom events)

---

## Troubleshooting

### **No data showing?**
- Wait 24-48 hours for initial data
- Check that Measurement ID is correct
- Verify no ad blockers are blocking GA4
- Check browser console for errors

### **Events not tracking?**
- Verify `gtag` function is defined
- Check browser console for errors
- Use [Google Tag Assistant](https://tagassistant.google.com/)

### **Need help?**
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Events Guide](https://support.google.com/analytics/answer/9267735)

---

## Next Steps

1. ✅ Replace `G-XXXXXXXXXX` with your actual ID
2. ✅ Test on your website
3. ✅ Wait 24 hours for data
4. ✅ Set up custom reports in GA4
5. ✅ Create goals/conversions for key actions
