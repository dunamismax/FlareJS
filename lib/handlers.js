/**
 * @param  {string} type
 * @param  {string} id
 * scroll to position on next page
 */
export function scrollTo(type, id) {
  if (['link', 'go'].includes(type)) {
    if (id) {
      const el = document.querySelector(id);
      el ? el.scrollIntoView({ behavior: 'smooth', block: 'start' }) : window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0 });
    }
  }
}
/**
 * @param  {string} url?
 * standard formatting for urls
 * url == https://example.com/foo/bar
 */
export function fullURL(url) {
  const href = new URL(url || window.location.href).href;
  return href.endsWith('/') || href.includes('.') || href.includes('#') ? href : `${href}/`;
}

/**
 * @param  {string} url
 * Writes URL to browser history
 */
export function addToPushState(url) {
  if (!window.history.state || window.history.state.url !== url) {
    window.history.pushState({ url }, 'internalLink', url);
  }
}

// Smooth scroll to anchor link
export function scrollToAnchor(anchor) {
  document
    .querySelector(anchor)
    .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * @param  {PopStateEvent} e
 * @returns Object
 * Handles back button/forward
 */
export function handlePopState(_) {
  const next = fullURL();
  // addToPushState(next);
  return { type: 'popstate', next };
}

/**
 * @param  {MouseEvent} e
 * @returns Object
 * Organizes link clicks into types
 */
export function handleLinkClick(e) {
  let anchor;

  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    return { type: 'disqualified' };
  }

  // Find element containing href
  for (let n = e.target; n.parentNode; n = n.parentNode) {
    if (n.nodeName === 'A') {
      anchor = n;
      break;
    }
  }

  // External links
  if (anchor && anchor.host !== location.host) {
    anchor.target = '_blank';
    return { type: 'external' };
  }

  // User opt-out
  if (anchor && 'cold' in anchor?.dataset) {
    return { type: 'disqualified' };
  }

  // Link qualified
  if (anchor?.hasAttribute('href')) {
    const ahref = anchor.getAttribute('href');
    const url = new URL(ahref, location.href);

    // Start router takeover
    e.preventDefault();

    // If anchor, scroll,
    if (ahref?.startsWith('#')) {
      scrollToAnchor(ahref);
      return { type: 'scrolled' };
    }

    // ID to scroll to after navigation, like /route/#some-id
    const scrollId = ahref.match(/#([\w'-]+)\b/g)?.[0];
    const next = fullURL(url.href);
    const prev = fullURL();

    // addToPushState(next);
    return { type: 'link', next, prev, scrollId };
  } else {
    return { type: 'noop' };
  }
}