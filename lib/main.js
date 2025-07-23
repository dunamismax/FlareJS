import { Router } from './router.js';

/**
 * @param  {Object} opts?
 * starts flare router and returns instance
 * can be accessed globally with window.flare
 */
export default (opts = {}) => {
  const router = new Router(opts);
  // eslint-disable-next-line no-console
  opts.log && console.log('🔥 flare engaged');
  if (window) {
    window.flare = router;
  }
  return router;
};