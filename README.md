<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/Vanilla-JS-Logo.png" alt="flare-router" width="200" />
</p>

<p align="center">
  <a href="https://github.com/dunamismax/flare-router">
 <img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&size=24&pause=1000&color=FF6B35&center=true&vCenter=true&width=1000&lines=flare-router+Router+%2B+3.4kB+Bundle+Size;Lightning-Fast+SPA+Navigation;Zero+Configuration+Setup;Intelligent+Link+Prefetching;Static+Sites+Feel+Like+SPAs;IntersectionObserver+Prefetch;Long-Lived+JavaScript+State;Framework+Agnostic+Solution;Vanilla+JavaScript+Power;Turbo-Inspired+Architecture;Production+Ready+Router;Blazingly+Fast+Performance;Modern+Browser+APIs;Zero+Dependencies+Required;Drop-In+Solution" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/dunamismax/flare-router"><img src="https://img.shields.io/badge/Bundle_Size-3.4kB-FF6B35.svg" alt="Bundle Size"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/Vanilla_JS-ES2020+-F7DF1E.svg?logo=javascript" alt="Vanilla JS"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
  <a href="https://github.com/dunamismax/flare-router"><img src="https://img.shields.io/github/stars/dunamismax/flare-router?style=social" alt="GitHub stars"></a>
</p>

---

# flare-router 🔥

A **3.4kB zero-config router** and intelligent prefetcher that makes static sites feel like blazingly fast SPAs. Transform any multi-page website into a lightning-fast experience without framework overhead.

## Features

- **Ultra-Lightweight** - Only 3.4kB gzipped bundle size
- **Zero Configuration** - Works out of the box with any static site
- **Intelligent Prefetching** - Automatic link prefetching with IntersectionObserver
- **SPA-like Navigation** - Instant page transitions without full reloads
- **State Preservation** - Long-lived JavaScript behaviors between navigations
- **Framework Agnostic** - Drop-in solution for any website architecture
- **Modern Browser APIs** - Built with IntersectionObserver, Fetch API, and History API

## Project Structure

```sh
├── lib/
│   ├── main.js                # Main router entry point
│   ├── router.js              # Core router logic and navigation
│   ├── handlers.js            # Click and popstate event handlers
│   └── dom.js                 # DOM manipulation and head merging
├── example/                   # Example implementation
├── dist/                      # Built bundles
└── package.json               # Package configuration
```

---

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/JavaScript-logo.png" alt="JavaScript" width="100" />
</p>

## Quick Start

**Prerequisites:** Modern browser with ES modules support

### Get Running in 3 Steps

```bash
# 1. Install flare-router
npm install flare-router

# 2. Import and initialize
import flare from 'flare-router';
const router = flare();

# 3. That's it! Your site now feels blazingly fast
```

**Example Implementation:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Fast Site</title>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>

    <main>
      <!-- Your content -->
    </main>

    <script type="module">
      import flare from 'flare-router';
      const router = flare({ prefetch: 'visible', log: true });
    </script>
  </body>
</html>
```

## Tech Stack

**Core:** Vanilla JavaScript ES Modules, IntersectionObserver API, Fetch API, History API
**Build:** esbuild for bundling
**Deployment:** npm package with CDN support

## Architecture

**How flare-router Works:**

1. **Intelligent Prefetching** - Uses IntersectionObserver to detect visible links and prefetches them
2. **Event Interception** - Captures click and popstate events for seamless navigation
3. **Smart DOM Updates** - Fetches new pages, swaps `<body>` content, and merges `<head>` elements
4. **State Preservation** - Maintains JavaScript state and long-lived behaviors between navigations

## Development Scripts

```bash
# Build production bundles
npm run build
```

## Advanced Usage

**Router Configuration:**

```javascript
const router = flare({
  prefetch: 'visible', // 'visible', 'hover', or false
  log: true, // Enable debug logging
  pageTransitions: false, // Enable native browser transitions (experimental)
});
```

**Programmatic Navigation:**

```javascript
// Navigate to specific routes
router.go('/dashboard');
router.back();
router.forward();

// Disable/enable router
router.enabled = false;
```

**Event Handling:**

```javascript
// Listen to router events
window.addEventListener('flare:router:fetch', () => {
  showLoadingSpinner();
});

window.addEventListener('flare:router:fetch-progress', ({ detail }) => {
  updateProgressBar(detail.progress);
});

window.addEventListener('flare:router:end', () => {
  hideLoadingSpinner();
});
```

**Link Control:**

```html
<!-- Opt-out specific links for full page reload -->
<a href="/external-site" data-cold>External Link</a>

<!-- Force head scripts to reload -->
<script src="/analytics.js" data-reload></script>
```

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/js-evolution-wallpaper.jpg" alt="JavaScript Evolution" width="450" />
</p>

## Code Examples

**Basic Setup:**

```javascript
import flare from 'flare-router';

// Initialize with default settings
const router = flare();
```

**Advanced Configuration:**

```javascript
import flare from 'flare-router';

// Full configuration
const router = flare({
  prefetch: 'visible',
  log: true,
  pageTransitions: false,
});

// Manual navigation
router.go('/products');

// Event listeners
window.addEventListener('flare:router:fetch', showLoader);
window.addEventListener('flare:router:end', hideLoader);
```

**Progress Tracking:**

```javascript
window.addEventListener('flare:router:fetch-progress', ({ detail }) => {
  const progressBar = document.getElementById('progress-bar');
  const { progress, received, length } = detail;

  progressBar.style.width = `${progress}%`;
  console.log(`Downloaded ${received} of ${length} bytes`);
});
```

## Browser Support

**Supported:** All modern browsers with ES modules, IntersectionObserver, Fetch API, and History API support

**Fallback:** Gracefully degrades to standard navigation in unsupported browsers

**Framework Compatibility:**

- ✅ Static sites (HTML, Jekyll, Hugo, etc.)
- ✅ Server-rendered applications
- ✅ Astro (with considerations for hydration)
- ❌ Next.js/Nuxt.js (already have client-side routing)

## Contributing

1. Fork and create feature branch
2. Make changes following existing patterns
3. Run `npm run build`
4. Submit pull request

**Development Workflow:**

- Uses esbuild for fast development builds
- ESLint and Prettier for code quality

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <a href="https://www.buymeacoffee.com/dunamismax">
 <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"></a>
  <a href="https://bsky.app/profile/dunamismax.bsky.social" target="_blank"><img src="https://img.shields.io/badge/Bluesky-blue?style=for-the-badge&logo=bluesky&logoColor=white" alt="Bluesky"></a>
  <a href="https://reddit.com/user/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Reddit-%23FF4500.svg?&style=for-the-badge&logo=reddit&logoColor=white" alt="Reddit"></a>
  <a href="https://discord.com/users/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Discord-dunamismax-7289DA.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://signal.me/#p/+dunamismax.66" target="_blank"><img src="https://img.shields.io/badge/Signal-dunamismax.66-3A76F0.svg?style=for-the-badge&logo=signal&logoColor=white" alt="Signal"></a>
</p>

---

<p align="center">
  <strong>flare-router Router - Lightning-Fast Navigation for Static Sites</strong><br>
  <sub>3.4kB Bundle • Zero Config • Intelligent Prefetching • Framework Agnostic • Vanilla JavaScript</sub>
</p>

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/js-coffee-particles.jpg" alt="JavaScript Coffee" width="450" />
</p>
