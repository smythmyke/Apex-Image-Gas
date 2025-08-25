# Deployment Guide for Apex Image Gas Website

## Overview
This website uses **Firebase Hosting** for deployment and **GitHub** for version control. Changes must be deployed to Firebase to be visible on the live site.

## Live URLs
- **Firebase URL**: https://apex-gas-9920e.web.app
- **Custom Domain**: https://apeximagegas.net

## Prerequisites
- Firebase CLI installed (`firebase --version` to check)
- Git installed
- Access to the Firebase project (apex-gas-9920e)

## Deployment Process

### Step 1: Make Your Changes
Edit the files you need to change (index.html, blog.html, etc.)

### Step 2: Test Locally (Optional)
```bash
# Install dependencies if needed
npm install

# Build CSS if you've changed Tailwind classes
npm run build-css
```

### Step 3: Commit to GitHub
```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Your descriptive commit message"

# Push to GitHub
git push origin main
```

### Step 4: Deploy to Firebase Hosting
```bash
# Deploy only hosting (not functions)
firebase deploy --only hosting
```

Or if you need to deploy everything:
```bash
# Deploy hosting and functions
firebase deploy
```

## Quick Deploy Command
For convenience, you can run both steps together:
```bash
git add . && git commit -m "Update site" && git push origin main && firebase deploy --only hosting
```

## Important Notes

### What Gets Deployed
- All files in the root directory except those listed in firebase.json ignore patterns
- The `public` directory in firebase.json is set to "." (current directory)

### Files That Are Ignored
- Node modules
- Git files
- PowerShell scripts (*.ps1)
- Shell scripts (*.sh)
- Markdown files (*.md)
- Functions directory (deployed separately)

### Checking Deployment Status
```bash
# View recent deployments
firebase hosting:channel:list

# Check which project you're deploying to
firebase projects:list

# View the current project
firebase use
```

## Troubleshooting

### Website Not Updating?
1. **Check Firebase Deployment**: Run `firebase hosting:channel:list` to see last deployment time
2. **Clear Browser Cache**: Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check DNS**: Custom domain changes can take up to 48 hours to propagate

### Wrong Project?
```bash
# Switch to correct project
firebase use apex-gas-9920e
```

### Deployment Fails?
1. Check if you're logged in: `firebase login`
2. Verify project access: `firebase projects:list`
3. Check for syntax errors in HTML/JS files
4. Ensure firebase.json is properly configured

## Custom Domain Setup (GoDaddy)
The custom domain (apeximagegas.net) should have these DNS records:
- Type: A, Host: @, Points to: Firebase IP (check Firebase console)
- Type: A, Host: www, Points to: Firebase IP (check Firebase console)

## Emergency Rollback
If you need to rollback to a previous version:
1. Go to [Firebase Console](https://console.firebase.google.com/project/apex-gas-9920e/hosting)
2. Click on "Release History"
3. Find the previous good version
4. Click "Rollback" on that version

## Best Practices
1. **Always test locally** before deploying
2. **Write descriptive commit messages** for tracking changes
3. **Deploy immediately after pushing** to keep GitHub and live site in sync
4. **Check the live site** after deployment to verify changes
5. **Keep this guide updated** with any new deployment procedures

## Contact
For deployment issues or questions about the Firebase project, contact the project administrator.

---
*Last Updated: August 25, 2025*