🔧 MK SHOPZONE - COMMANDS & TROUBLESHOOTING GUIDE
════════════════════════════════════════════════

📋 ESSENTIAL COMMANDS
════════════════════════════════════════════════

Start Development Server:
  npm run dev
  → Opens http://localhost:5173

Build for Production:
  npm run build
  → Creates optimized dist/ folder

Preview Production Build:
  npm run preview
  → Tests production build locally

Install Dependencies:
  npm install
  → Install all required packages

────────────────────────────────────────────────

🌐 VIEW YOUR WEBSITE
════════════════════════════════════════════════

After running "npm run dev":

Homepage:           http://localhost:5173
SEO Page:           http://localhost:5173/seo.html
Paid Ads:           http://localhost:5173/paid-ads.html
Web Design:         http://localhost:5173/website-design.html
Social Media:       http://localhost:5173/social-media.html
Email Marketing:    http://localhost:5173/email-marketing.html
Video Marketing:    http://localhost:5173/video-marketing.html

────────────────────────────────────────────────

🐛 TROUBLESHOOTING
════════════════════════════════════════════════

PROBLEM: npm install fails
SOLUTION:
  1. Clear npm cache: npm cache clean --force
  2. Delete node_modules: rm -r node_modules
  3. Delete package-lock.json: rm package-lock.json
  4. Run again: npm install

────────────────────────────────────────────────

PROBLEM: Port 5173 already in use
SOLUTION:
  npm run dev -- --port 3000
  (Use a different port)

  Or find and kill the process:
  Windows: netstat -ano | findstr :5173
  Mac/Linux: lsof -i :5173

────────────────────────────────────────────────

PROBLEM: CSS not loading
SOLUTION:
  1. Hard refresh browser: Ctrl+Shift+R (Windows/Linux)
                          Cmd+Shift+R (Mac)
  2. Clear browser cache
  3. Close and restart server: npm run dev

────────────────────────────────────────────────

PROBLEM: Videos not playing
SOLUTION:
  1. Check file paths are correct
  2. Ensure video files exist in /public
  3. Try different browser
  4. Check browser console (F12) for errors
  5. Video format compatibility check

────────────────────────────────────────────────

PROBLEM: Images not showing
SOLUTION:
  1. Check image paths in HTML
  2. Verify images exist in /public folder
  3. Clear browser cache
  4. Check file names (case-sensitive)
  5. Use browser DevTools (F12) to check

────────────────────────────────────────────────

PROBLEM: Contact form not working
SOLUTION:
  1. Check browser console (F12) for errors
  2. Verify form field IDs match
  3. Test with valid email address
  4. Ensure JavaScript is enabled
  5. Check Network tab for failed requests

────────────────────────────────────────────────

PROBLEM: Animations not smooth
SOLUTION:
  1. Update browser (use latest)
  2. Disable browser extensions
  3. Close other applications
  4. Check GPU acceleration enabled
  5. Reduce animation load

────────────────────────────────────────────────

PROBLEM: Website loads slowly
SOLUTION:
  1. Clear browser cache
  2. Check network speed (F12 Network tab)
  3. Optimize images (use webp)
  4. Minify assets
  5. Use CDN for delivery

────────────────────────────────────────────────

PROBLEM: Mobile menu not working
SOLUTION:
  1. Check hamburger icon is visible
  2. Verify JavaScript is loaded
  3. Check console for errors (F12)
  4. Test on actual mobile device
  5. Clear browser cache

════════════════════════════════════════════════

🔍 BROWSER DEVELOPER TOOLS
════════════════════════════════════════════════

Open DevTools:
  Windows: F12 or Ctrl+Shift+I
  Mac: Cmd+Option+I
  Linux: F12 or Ctrl+Shift+I

Useful Tabs:
  Console   - See errors & logs
  Elements  - Inspect HTML/CSS
  Network   - Check file loading
  Sources   - Debug JavaScript
  Performance - Check speed

────────────────────────────────────────────────

⚡ PERFORMANCE TIPS
════════════════════════════════════════════════

1. Compress Images
   - Use online tools or ImageOptim
   - Convert to WebP format
   - Reduce file sizes

2. Optimize Videos
   - Use H.264 codec
   - Keep bitrate low
   - Compress before uploading

3. Minify CSS/JS
   - Already done in build
   - Use npm run build for production

4. Enable Caching
   - Add cache headers
   - Use service workers
   - Configure CDN

5. Monitor Performance
   - Use Google PageSpeed Insights
   - Check GTmetrix
   - Monitor with Lighthouse

════════════════════════════════════════════════

📱 DEVICE TESTING
════════════════════════════════════════════════

Test Devices:
  ✅ iPhone (use Safari)
  ✅ Android (use Chrome)
  ✅ iPad (use Safari)
  ✅ Windows (use Chrome/Edge)
  ✅ Mac (use Safari/Chrome)

Browser Compatibility:
  ✅ Chrome 90+
  ✅ Firefox 88+
  ✅ Safari 14+
  ✅ Edge 90+
  ✅ Mobile browsers

Testing Tools:
  - Chrome DevTools (Device Emulation)
  - Firefox Developer Edition
  - BrowserStack
  - LambdaTest

════════════════════════════════════════════════

🌍 DEPLOYMENT COMMANDS
════════════════════════════════════════════════

Build for Deployment:
  npm run build

Check Build Output:
  ls -la dist/
  (or: dir dist/ on Windows)

Upload to Netlify:
  1. npm run build
  2. Drag dist/ folder to Netlify

Upload to Vercel:
  1. Push to GitHub
  2. Select repo in Vercel
  3. Auto-deploys

Upload to FTP:
  1. npm run build
  2. Upload dist/ contents via FTP
  3. Set proper permissions (644)

════════════════════════════════════════════════

🔐 SECURITY CHECKLIST
════════════════════════════════════════════════

Before Going Live:
  ☐ Enable HTTPS
  ☐ Set security headers
  ☐ Configure CORS
  ☐ Validate form inputs (backend)
  ☐ Protect API endpoints
  ☐ Use environment variables
  ☐ Regular backups
  ☐ Monitor for attacks
  ☐ Keep software updated
  ☐ Use strong passwords

════════════════════════════════════════════════

📊 MONITORING & ANALYTICS
════════════════════════════════════════════════

Add Google Analytics:
  1. Get tracking ID from Google
  2. Add script before </body>
  3. Verify in GA dashboard

Add Google Search Console:
  1. Add property in GSC
  2. Verify ownership
  3. Submit sitemap

Monitor Performance:
  - Google Analytics
  - Google PageSpeed Insights
  - GTmetrix
  - Uptime Robot

Track Conversions:
  - Form submissions
  - Button clicks
  - Page views
  - User engagement

════════════════════════════════════════════════

✅ PRE-LAUNCH CHECKLIST
════════════════════════════════════════════════

Content:
  ☐ All text proofread
  ☐ Contact info correct
  ☐ Links working
  ☐ Images displayed
  ☐ Videos playing

Functionality:
  ☐ Forms submitting
  ☐ Mobile menu working
  ☐ Animations smooth
  ☐ No broken links
  ☐ No console errors

Performance:
  ☐ Pages load fast
  ☐ Images optimized
  ☐ Videos compressed
  ☐ Code minified
  ☐ Cache configured

SEO:
  ☐ Meta tags present
  ☐ Keywords included
  ☐ Sitemap created
  ☐ Robots.txt set
  ☐ Schema markup added

Security:
  ☐ HTTPS enabled
  ☐ Form validated
  ☐ No sensitive data exposed
  ☐ Backup created
  ☐ SSL certificate valid

Mobile:
  ☐ Responsive design
  ☐ Touch-friendly
  ☐ Fast on mobile
  ☐ Menu working
  ☐ Forms usable

════════════════════════════════════════════════

🎯 COMMON CUSTOMIZATIONS
════════════════════════════════════════════════

Change Brand Color:
  Edit: public/style.css
  Find: --primary: #ff8c00;
  Change: --primary: #YOUR_COLOR;

Update Logo:
  Edit: index.html (and all pages)
  Find: <a href="/" class="logo">MK<span>SHOPZONE</span></a>
  Change: logo text

Add New Page:
  1. Copy any service HTML
  2. Update content
  3. Add link to navigation

Change Font:
  Edit: public/style.css
  Find: --font-main: 'Inter'
  Change: your font name

Modify Spacing:
  Edit: public/style.css
  Find: --spacing-md: 16px;
  Adjust: spacing values

════════════════════════════════════════════════

🚀 NEXT IMMEDIATE STEPS
════════════════════════════════════════════════

Right Now:
  1. npm run dev
  2. Open http://localhost:5173
  3. View the website
  4. Test on mobile

This Week:
  1. Customize colors
  2. Update content
  3. Add your images
  4. Review all pages

This Month:
  1. Set up contact backend
  2. Add analytics
  3. Test thoroughly
  4. Deploy online

════════════════════════════════════════════════

📞 NEED MORE HELP?
════════════════════════════════════════════════

Resources:
  - COMPLETE_DOCUMENTATION.md
  - BUILD_COMPLETE.md
  - Code comments in files
  - Vite docs: vitejs.dev
  - MDN Web Docs: developer.mozilla.org

Browser Testing:
  - Open DevTools (F12)
  - Check Console tab
  - Look for red errors
  - Check Network tab

Performance Testing:
  - Google PageSpeed Insights
  - GTmetrix
  - Lighthouse (in DevTools)

════════════════════════════════════════════════

Version: 7.0
Date: March 29, 2026
Status: ✅ READY TO USE

════════════════════════════════════════════════

