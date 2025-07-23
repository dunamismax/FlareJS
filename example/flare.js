function m(o, e) {
  if (["link", "go"].includes(o))
    if (e) {
      const t = document.querySelector(e);
      t ? t.scrollIntoView({ behavior: "smooth", block: "start" }) : window.scrollTo({ top: 0 });
    } else
      window.scrollTo({ top: 0 });
}
function u(o) {
  const e = new URL(o || window.location.href).href;
  return e.endsWith("/") || e.includes(".") || e.includes("#") ? e : `${e}/`;
}
function k(o) {
  (!window.history.state || window.history.state.url !== o) && window.history.pushState({ url: o }, "internalLink", o);
}
function E(o) {
  document.querySelector(o).scrollIntoView({ behavior: "smooth", block: "start" });
}
function S(o) {
  const e = u();
  return { type: "popstate", next: e };
}
function N(o) {
  var t;
  let e;
  if (o.altKey || o.ctrlKey || o.metaKey || o.shiftKey)
    return { type: "disqualified" };
  for (let n = o.target; n.parentNode; n = n.parentNode)
    if (n.nodeName === "A") {
      e = n;
      break;
    }
  if (e && e.host !== location.host)
    return e.target = "_blank", { type: "external" };
  if (e && "cold" in (e == null ? void 0 : e.dataset))
    return { type: "disqualified" };
  if (e != null && e.hasAttribute("href")) {
    const n = e.getAttribute("href"), r = new URL(n, location.href);
    if (o.preventDefault(), n != null && n.startsWith("#"))
      return E(n), { type: "scrolled" };
    const s = (t = n.match(/#([\w'-]+)\b/g)) == null ? void 0 : t[0], i = u(r.href), c = u();
    return { type: "link", next: i, prev: c, scrollId: s };
  } else
    return { type: "noop" };
}
function L(o) {
  return new DOMParser().parseFromString(o, "text/html");
}
function g(o) {
  document.body.querySelectorAll("[flare-preserve]").forEach((t) => {
    let n = o.body.querySelector('[flare-preserve][id="' + t.id + '"]');
    if (n) {
      const r = t.cloneNode(!0);
      n.replaceWith(r);
    }
  }), document.body.replaceWith(o.body);
}
function x(o) {
  const e = (i) => Array.from(i.querySelectorAll('head>:not([rel="prefetch"]')), t = e(document), n = e(o), { staleNodes: r, freshNodes: s } = A(t, n);
  r.forEach((i) => i.remove()), document.head.append(...s);
}
function A(o, e) {
  const t = [], n = [];
  let r = 0, s = 0;
  for (; r < o.length || s < e.length; ) {
    const i = o[r], c = e[s];
    if (i != null && i.isEqualNode(c)) {
      r++, s++;
      continue;
    }
    const a = i ? n.findIndex((l) => l.isEqualNode(i)) : -1;
    if (a !== -1) {
      n.splice(a, 1), r++;
      continue;
    }
    const h = c ? t.findIndex((l) => l.isEqualNode(c)) : -1;
    if (h !== -1) {
      t.splice(h, 1), s++;
      continue;
    }
    i && t.push(i), c && n.push(c), r++, s++;
  }
  return { staleNodes: t, freshNodes: n };
}
function b() {
  document.head.querySelectorAll("[data-reload]").forEach(v), document.body.querySelectorAll("script").forEach(v);
}
function v(o) {
  const e = document.createElement("script"), t = Array.from(o.attributes);
  for (const { name: n, value: r } of t)
    e[n] = r;
  e.append(o.textContent), o.replaceWith(e);
}
const q = {
  log: !1,
  pageTransitions: !1
};
class T {
  constructor(e = {}) {
    this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.observer = null, this.opts = { ...q, ...e }, window != null && window.history ? (document.addEventListener("click", (t) => this.onClick(t)), window.addEventListener("popstate", (t) => this.onPop(t)), this.prefetch()) : (console.warn("flare router not supported in this browser or environment"), this.enabled = !1);
  }
  go(e) {
    const t = window.location.href, n = new URL(e, location.origin).href;
    return this.reconstructDOM({ type: "go", next: n, prev: t });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  get allLinks() {
    return Array.from(document.links).filter(
      (e) => e.href.includes(document.location.origin) && !e.href.includes("#") && e.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(e.href)
    );
  }
  log(...e) {
    this.opts.log && console.log(...e);
  }
  prefetch() {
    if (this.opts.prefetch === "visible")
      this.prefetchVisible();
    else if (this.opts.prefetch === "hover")
      this.prefetchOnHover();
    else
      return;
  }
  prefetchOnHover() {
    this.allLinks.forEach((e) => {
      const t = e.getAttribute("href");
      e.addEventListener("pointerenter", () => this.createLink(t), { once: !0 });
    });
  }
  prefetchVisible() {
    const e = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    };
    "IntersectionObserver" in window && (this.observer = this.observer || new IntersectionObserver((t, n) => {
      t.forEach((r) => {
        const s = r.target.getAttribute("href");
        if (this.prefetched.has(s)) {
          n.unobserve(r.target);
          return;
        }
        r.isIntersecting && (this.createLink(s), n.unobserve(r.target));
      });
    }, e), this.allLinks.forEach((t) => this.observer.observe(t)));
  }
  createLink(e) {
    const t = document.createElement("link");
    t.rel = "prefetch", t.href = e, t.as = "document", t.onload = () => this.log("\u{1F329}\uFE0F prefetched", e), t.onerror = (n) => this.log("\u{1F915} can't prefetch", e, n), document.head.appendChild(t), this.prefetched.add(e);
  }
  onClick(e) {
    this.reconstructDOM(N(e));
  }
  onPop(e) {
    this.reconstructDOM(S());
  }
  async reconstructDOM({ type: e, next: t, prev: n, scrollId: r }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("\u26A1", e), ["popstate", "link", "go"].includes(e) && t !== n) {
        this.opts.log && console.time("\u23F1\uFE0F"), window.dispatchEvent(new CustomEvent("flare:router:fetch")), e != "popstate" && k(t);
        const i = await (await fetch(t, { headers: { "X-Flare": "1" } }).then((a) => {
          const h = a.body.getReader(), l = parseInt(a.headers.get("Content-Length"));
          let d = 0;
          return new ReadableStream({
            start(f) {
              function p() {
                h.read().then(({ done: y, value: w }) => {
                  if (y) {
                    f.close();
                    return;
                  }
                  d += w.length, window.dispatchEvent(
                    new CustomEvent("flare:router:fetch-progress", {
                      detail: {
                        progress: Number.isNaN(l) ? 0 : d / l * 100,
                        received: d,
                        length: l || 0
                      }
                    })
                  ), f.enqueue(w), p();
                });
              }
              p();
            }
          });
        }).then((a) => new Response(a, { headers: { "Content-Type": "text/html" } }))).text(), c = L(i);
        x(c), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          g(c), b(), m(e, r);
        }) : (g(c), b(), m(e, r)), window.dispatchEvent(new CustomEvent("flare:router:end")), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("\u23F1\uFE0F");
      }
    } catch (s) {
      return window.dispatchEvent(new CustomEvent("flare:router:error", s)), this.opts.log && console.timeEnd("\u23F1\uFE0F"), console.error("\u{1F4A5} router fetch failed", s), !1;
    }
  }
}
const C = (o = {}) => {
  const e = new T(o);
  return o.log && console.log("\u{1F525} flare engaged"), window && (window.flare = e), e;
};
export {
  C as default
};
