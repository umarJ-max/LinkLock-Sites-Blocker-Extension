# LinkLock - Professional Website Blocker Extension

A sleek and professional Chrome extension for blocking distracting websites to boost productivity.

## 🚀 Features

- **Instant Block**: One-click blocking of your current website
- **Smart URL Detection**: Automatically extracts domains from full URLs
- **Professional UI**: Modern dark theme with smooth animations
- **Easy Management**: Add and remove blocked sites with simple interface
- **Real-time Blocking**: Immediate site blocking without page refresh
- **Site Counter**: Track how many sites you've blocked

## 📸 Screenshots

### Extension Popup
Clean, professional interface with your custom logo and branding.

### Blocked Page
Beautiful blocked page with gradient background and site information.

## 🛠️ Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/linklock-extension.git
   cd linklock-extension
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Start Blocking**
   - Click the LinkLock icon in your toolbar
   - Add sites manually or use "Block Current Site"

## 🎯 How to Use

### Quick Block
1. Visit any website you want to block
2. Click the LinkLock extension icon
3. Click "Block Current Site"
4. Site is instantly blocked and added to your list

### Manual Block
1. Click the LinkLock extension icon
2. Enter website URL or domain (e.g., `instagram.com` or `https://www.youtube.com`)
3. Click "Block Site"

### Remove Sites
- Click the "X" button next to any blocked site to unblock it

## 🔧 Technical Details

### Files Structure
```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Site blocking logic
├── background.js         # Background processes
└── [your-logo].png       # Custom logo
```

### Permissions
- `storage`: Save blocked sites list
- `activeTab`: Access current tab for instant blocking
- `tabs`: Reload tabs after blocking
- `<all_urls>`: Block any website

## 🎨 Customization

### Colors
The extension uses a professional color scheme:
- **Primary**: #4299e1 (Professional Blue)
- **Background**: #2c3e50 to #34495e (Dark Gradient)
- **Secondary**: #718096 (Neutral Gray)

### Logo
Replace the logo by updating the image file in the extension folder and updating the manifest.json references.

## 🔒 Privacy

LinkLock stores all data locally on your device. No data is sent to external servers.

## 📋 Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium browsers

## 🐛 Troubleshooting

### Extension Not Working
1. Reload the extension in `chrome://extensions/`
2. Make sure "Developer mode" is enabled
3. Check browser console for errors

### Sites Not Blocking
1. Ensure the site is in your blocked list
2. Try refreshing the page
3. Check if you entered the correct domain

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Umar J**
- Professional Website Blocker Extension
- Created for enhanced productivity and focus

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for productivity enthusiasts
- Professional UI/UX design

---

**LinkLock** - Block distractions, boost productivity! 🚀
