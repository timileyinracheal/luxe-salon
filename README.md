# Luxe Salon 💇‍♀️

Professional single-page website for Luxe Salon hairstyling business. A modern, responsive, and feature-rich website showcasing salon services, portfolio, and booking capabilities.

## ✨ Features

- **Responsive Design** - Mobile-first approach that works on all devices
- **Modern UI** - Clean, professional design with gold and dark color scheme
- **Navigation Menu** - Smooth navigation with hamburger menu for mobile
- **Service Showcase** - Display of all salon services with icons
- **Photo Gallery** - Showcase portfolio of salon work
- **About Section** - Tell your story and build trust with clients
- **Contact Form** - Easy way for clients to reach out
- **Social Media Links** - Connect with customers on social platforms
- **Smooth Animations** - Engaging fade-in effects and transitions
- **SEO Optimized** - Meta tags and semantic HTML structure

## 🎨 Design Features

### Color Scheme
- **Primary Gold**: `#d4af37` - Luxury and elegance
- **Secondary Dark**: `#2c2c2c` - Professional background
- **Accent Gold**: `#b8860b` - Hover states
- **Light Background**: `#f5f5f5` - Service cards
- **White**: `#ffffff` - Clean spaces

### Typography
- Modern sans-serif font family (Segoe UI, Tahoma, Geneva)
- Clear hierarchy from H1 to H3
- Readable line-height (1.6)

## 📁 Project Structure

```
luxe-salon/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete styling and responsive design
├── script.js           # Interactive features and animations
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VSCode, Sublime, etc.)
- Basic knowledge of HTML/CSS/JavaScript (for customization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/timileyinracheal/luxe-salon.git
   cd luxe-salon
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js http-server
     npx http-server
     ```
   - Visit `http://localhost:8000` in your browser

3. **Deploy to GitHub Pages** (optional)
   - Go to repository Settings
   - Navigate to Pages section
   - Select main branch as source
   - Site will be live at `https://timileyinracheal.github.io/luxe-salon/`

## 📋 Sections Overview

### 1. **Navigation Header**
- Sticky navbar that remains visible while scrolling
- Responsive hamburger menu for mobile devices
- Active link highlighting for current section
- Logo with scissors icon

### 2. **Hero Section**
- Full-screen background with gradient
- Headline and tagline
- Call-to-action button for booking

### 3. **Services Section**
- Grid layout showcasing 6 main services:
  - Hair Cutting
  - Hair Coloring
  - Styling & Blowout
  - Hair Treatment
  - Braiding
  - Special Occasions
- Each service has icon, title, and description
- Hover effects for interactivity

### 4. **Gallery Section**
- 6-item grid showcasing salon work
- Placeholder images with descriptive labels
- Responsive grid that adapts to screen size
- Hover zoom effect

### 5. **About Section**
- Company story and mission
- Feature checklist
- Statistics showing experience and client satisfaction
- Two-column layout on desktop, single on mobile

### 6. **Contact Section**
- Contact information (address, phone, email, hours)
- Contact form for inquiries
- Form validation
- Success notifications

### 7. **Footer**
- Social media links
- Quick navigation links
- Service links
- Copyright information

## 🎯 Customization Guide

### Change Business Information

**In `index.html`:**

```html
<!-- Update salon name -->
<span>Luxe Salon</span>

<!-- Update contact info -->
<p>(555) 123-4567</p>
<p>hello@luxesalon.com</p>
<p>123 Beauty Street<br>Fashion City, FC 12345</p>

<!-- Update hours -->
<p>Mon-Fri: 9AM - 6PM<br>Sat: 10AM - 4PM<br>Sun: Closed</p>
```

### Add Real Images

Replace gallery placeholders with actual images:

```html
<!-- Instead of placeholder div -->
<div class="gallery-item">
    <img src="path/to/your-image.jpg" alt="Your Hair Style">
</div>
```

Update `styles.css` for gallery images:

```css
.gallery-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
}
```

### Modify Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #d4af37;      /* Main accent color */
    --secondary-color: #2c2c2c;    /* Dark background */
    --dark-bg: #1a1a1a;            /* Very dark background */
    --light-bg: #f5f5f5;           /* Light background */
}
```

### Update Social Links

In `index.html` footer:

```html
<a href="https://facebook.com/yoursalon" title="Facebook">
    <i class="fab fa-facebook"></i>
</a>
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 769px to 1199px
- **Mobile**: 480px to 768px
- **Small Mobile**: Below 480px

## ✅ Features Checklist

- [x] Responsive mobile navigation
- [x] Smooth scrolling
- [x] Contact form with validation
- [x] Active navigation highlighting
- [x] Fade-in animations
- [x] Service cards with hover effects
- [x] Gallery with zoom effects
- [x] Social media links
- [x] Professional color scheme
- [x] Fast loading performance

## 🔧 JavaScript Functionality

### Mobile Menu Toggle
- Hamburger menu appears on screens below 768px
- Click to toggle menu visibility
- Auto-closes when clicking a link

### Smooth Scrolling
- All navigation links scroll smoothly to sections
- CSS `scroll-behavior: smooth` for native support

### Form Handling
- Contact form validation
- Success notification on submission
- Form resets after sending
- Email field validation

### Active Link Tracking
- Highlights current section in navigation
- Updates as user scrolls
- Based on viewport position

### Animations
- Fade-in effects on page load
- Slide-in notifications
- Scale transforms on hover
- Smooth transitions throughout

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [HTML5 Guide](https://html.spec.whatwg.org/)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

## 🐛 Troubleshooting

### Images not showing?
- Check file paths are correct
- Use relative paths (e.g., `images/photo.jpg`)
- Ensure images are in correct directory

### Styles not applying?
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS file is linked in HTML
- Verify no conflicting styles

### JavaScript not working?
- Check browser console for errors (F12)
- Ensure script.js is linked at end of HTML
- Verify Font Awesome CDN is accessible

### Menu not responding?
- Check JavaScript is enabled in browser
- Look for console errors
- Verify hamburger button ID matches script

## 📈 Performance Tips

- Compress images for faster loading
- Use lazy loading for gallery images
- Minimize CSS and JavaScript files
- Enable browser caching
- Use CDN for Font Awesome

## 🔐 Security Considerations

- Validate form submissions server-side
- Use HTTPS when deploying
- Sanitize user inputs
- Implement rate limiting for forms
- Keep dependencies updated

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💼 Author

**Timileyinracheal**
- GitHub: [@timileyinracheal](https://github.com/timileyinracheal)
- Email: timileyinracheal31@gmail.com

## 🌟 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🍴 Forking for your own use
- 📢 Sharing with others
- 💬 Providing feedback and suggestions

---

**Last Updated**: August 30, 2026

Happy styling! ✨💇‍♀️
