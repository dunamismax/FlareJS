import { addToPushState, handleLinkClick, handlePopState, scrollTo } from './handlers.js';
import { mergeHead, formatNextDocument, replaceBody, runScripts } from './dom.js';

const defaultOpts = {
  log: false,
  pageTransitions: false,
};

export class Router {
  constructor(opts = {}) {
    this.enabled = true;
    this.prefetched = new Set();
    this.observer = null;
    this.opts = { ...defaultOpts, ...opts };

    if (window?.history) {
      document.addEventListener('click', (e) => this.onClick(e));
      window.addEventListener('popstate', (e) => this.onPop(e));
      this.prefetch();
    } else {
      console.warn('flare router not supported in this browser or environment');
      this.enabled = false;
    }
  }

  /**
   * @param  {string} path
   * Navigate to a url
   */
  go(path) {
    const prev = window.location.href;
    const next = new URL(path, location.origin).href;
    return this.reconstructDOM({ type: 'go', next, prev });
  }

  /**
   * Navigate back
   */
  back() {
    window.history.back();
  }

  /**
   * Navigate forward
   */
  forward() {
    window.history.forward();
  }

  /**
   * Find all links on page
   */
  get allLinks() {
    return Array.from(document.links).filter(
      (node) =>
        node.href.includes(document.location.origin) && // on origin url
        !node.href.includes('#') && // not an id anchor
        node.href !== (document.location.href || document.location.href + '/') && // not current page
        !this.prefetched.has(node.href), // not already prefetched
    );
  }

  log(...args) {
    this.opts.log && console.log(...args);
  }

  /**
   *  Check if the route is qualified for prefetching and prefetch it with chosen method
   */
  prefetch() {
    if (this.opts.prefetch === 'visible') {
      this.prefetchVisible();
    } else if (this.opts.prefetch === 'hover') {
      this.prefetchOnHover();
    } else {
      return;
    }
  }

  /**
   *  Finds links on page and prefetches them on hover
   */
  prefetchOnHover() {
    this.allLinks.forEach((node) => {
      const url = node.getAttribute('href');
      // Using `pointerenter` instead of `mouseenter` to support touch devices hover behavior, PS: `pointerenter` event fires only once
      node.addEventListener('pointerenter', () => this.createLink(url), { once: true });
    });
  }

  /**
   *  Prefetch all visible links
   */
  prefetchVisible() {
    const intersectionOpts = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    if ('IntersectionObserver' in window) {
      this.observer = this.observer || new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          const url = entry.target.getAttribute('href');

          if (this.prefetched.has(url)) {
            observer.unobserve(entry.target);
            return;
          }

          if (entry.isIntersecting) {
            this.createLink(url);
            observer.unobserve(entry.target);
          }
        });
      }, intersectionOpts);
      this.allLinks.forEach((node) => this.observer.observe(node));
    }
  }

  /**
   * @param  {string} url
   * Create a link to prefetch
   */
  createLink(url) {
    const linkEl = document.createElement('link');
    linkEl.rel = 'prefetch';
    linkEl.href = url;
    linkEl.as = 'document';

    linkEl.onload = () => this.log('🌩️ prefetched', url);
    linkEl.onerror = (err) => this.log('🤕 can\'t prefetch', url, err);

    document.head.appendChild(linkEl);

    // Keep track of prefetched links
    this.prefetched.add(url);
  }

  /**
   * @param  {MouseEvent} e
   * Handle clicks on links
   */
  onClick(e) {
    this.reconstructDOM(handleLinkClick(e));
  }

  /**
   * @param  {PopStateEvent} e
   * Handle popstate events like back/forward
   */
  onPop(e) {
    this.reconstructDOM(handlePopState(e));
  }
  /**
   * @param  {Object} routeChangeData
   * Main process for reconstructing the DOM
   */
  async reconstructDOM({ type, next, prev, scrollId }) {
    if (!this.enabled) {
      this.log('router disabled');
      return;
    }

    try {
      this.log('⚡', type);

      // Check type && window href destination
      // Disqualify if fetching same URL
      if (['popstate', 'link', 'go'].includes(type) && next !== prev) {
        this.opts.log && console.time('⏱️');

        window.dispatchEvent(new CustomEvent('flare:router:fetch'));

        // Update window history
        if (type != 'popstate') {
          addToPushState(next);
        }

        // Fetch next document
        const res = await fetch(next, { headers: { 'X-Flare': '1' } })
          .then((res) => {
            const reader = res.body.getReader();
            const length = parseInt(res.headers.get('Content-Length'));
            let bytesReceived = 0;

            // take each received chunk and emit an event, pass through to new stream which will be read as text
            return new ReadableStream({
              start(controller) {
                // The following function handles each data chunk
                function push() {
                  // "done" is a Boolean and value a "Uint8Array"
                  reader.read().then(({ done, value }) => {
                    // If there is no more data to read
                    if (done) {
                      controller.close();
                      return;
                    }

                    bytesReceived += value.length;
                    window.dispatchEvent(
                      new CustomEvent('flare:router:fetch-progress', {
                        detail: {
                          // length may be NaN if no Content-Length header was found
                          progress: Number.isNaN(length) ? 0 : (bytesReceived / length) * 100,
                          received: bytesReceived,
                          length: length || 0,
                        },
                      }),
                    );
                    // Get the data and send it to the browser via the controller
                    controller.enqueue(value);
                    // Check chunks by logging to the console
                    push();
                  });
                }

                push();
              },
            });
          })
          .then((stream) => new Response(stream, { headers: { 'Content-Type': 'text/html' } }));

        const html = await res.text();
        const nextDoc = formatNextDocument(html);

        // Merge HEAD
        mergeHead(nextDoc);

        // Merge BODY
        // with optional native browser page transitions
        if (this.opts.pageTransitions && document.createDocumentTransition) {
          const transition = document.createDocumentTransition();
          transition.start(() => {
            replaceBody(nextDoc);
            runScripts();
            scrollTo(type, scrollId);
          });
        } else {
          replaceBody(nextDoc);
          runScripts();
          scrollTo(type, scrollId);
        }


        window.dispatchEvent(new CustomEvent('flare:router:end'));

        // delay for any js rendered links
        setTimeout(() => {
          this.prefetch();
        }, 200);

        this.opts.log && console.timeEnd('⏱️');
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('flare:router:error', err));
      this.opts.log && console.timeEnd('⏱️');
      console.error('💥 router fetch failed', err);
      return false;
    }
  }
}