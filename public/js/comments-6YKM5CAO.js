import {
  A as Fn,
  B as se,
  C as q,
  D as h,
  E as m,
  F as me,
  G as b,
  H as G,
  I as be,
  J as _,
  K as Gt,
  L as V,
  M as L,
  N as Yt,
  O as Dn,
  P as zn,
  Q as jn,
  a as bt,
  b as re,
  c as M,
  d as In,
  e as _n,
  f as Be,
  g as Ht,
  h as Ve,
  i as kt,
  j as z,
  k as ye,
  l as $,
  m as oe,
  n as On,
  o as Mn,
  p as Me,
  q as tt,
  r as Wt,
  s as He,
  t as nt,
  u as he,
  v as Fe,
  w as we,
  x as Ce,
  y as qt,
  z as rt,
} from "./chunk-JPEDZVEN.js";
import { a as ie } from "./chunk-XX3HJDDB.js";
import { a as B } from "./chunk-RIT7SLNJ.js";
import { b as Vt, c as ll } from "./chunk-WIQECBEN.js";
var bn = Vt((Le) => {
  "use strict";
  B();
  var Vi =
      (Le && Le.__awaiter) ||
      function (e, t, n, r) {
        function a(l) {
          return l instanceof n
            ? l
            : new n(function (o) {
                o(l);
              });
        }
        return new (n || (n = Promise))(function (l, o) {
          function i(c) {
            try {
              s(r.next(c));
            } catch (d) {
              o(d);
            }
          }
          function u(c) {
            try {
              s(r.throw(c));
            } catch (d) {
              o(d);
            }
          }
          function s(c) {
            c.done ? l(c.value) : a(c.value).then(i, u);
          }
          s((r = r.apply(e, t || [])).next());
        });
      },
    Hi =
      (Le && Le.__generator) ||
      function (e, t) {
        var n = {
            label: 0,
            sent: function () {
              if (l[0] & 1) throw l[1];
              return l[1];
            },
            trys: [],
            ops: [],
          },
          r,
          a,
          l,
          o;
        return (
          (o = { next: i(0), throw: i(1), return: i(2) }),
          typeof Symbol == "function" &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function i(s) {
          return function (c) {
            return u([s, c]);
          };
        }
        function u(s) {
          if (r) throw new TypeError("Generator is already executing.");
          for (; o && ((o = 0), s[0] && (n = 0)), n; )
            try {
              if (
                ((r = 1),
                a &&
                  (l =
                    s[0] & 2
                      ? a.return
                      : s[0]
                        ? a.throw || ((l = a.return) && l.call(a), 0)
                        : a.next) &&
                  !(l = l.call(a, s[1])).done)
              )
                return l;
              switch (((a = 0), l && (s = [s[0] & 2, l.value]), s[0])) {
                case 0:
                case 1:
                  l = s;
                  break;
                case 4:
                  return (n.label++, { value: s[1], done: !1 });
                case 5:
                  (n.label++, (a = s[1]), (s = [0]));
                  continue;
                case 7:
                  ((s = n.ops.pop()), n.trys.pop());
                  continue;
                default:
                  if (
                    ((l = n.trys),
                    !(l = l.length > 0 && l[l.length - 1]) && (s[0] === 6 || s[0] === 2))
                  ) {
                    n = 0;
                    continue;
                  }
                  if (s[0] === 3 && (!l || (s[1] > l[0] && s[1] < l[3]))) {
                    n.label = s[1];
                    break;
                  }
                  if (s[0] === 6 && n.label < l[1]) {
                    ((n.label = l[1]), (l = s));
                    break;
                  }
                  if (l && n.label < l[2]) {
                    ((n.label = l[2]), n.ops.push(s));
                    break;
                  }
                  (l[2] && n.ops.pop(), n.trys.pop());
                  continue;
              }
              s = t.call(e, n);
            } catch (c) {
              ((s = [6, c]), (a = 0));
            } finally {
              r = l = 0;
            }
          if (s[0] & 5) throw s[1];
          return { value: s[0] ? s[1] : void 0, done: !0 };
        }
      };
  Object.defineProperty(Le, "__esModule", { value: !0 });
  Le.ReCaptchaInstance = void 0;
  var Wi = (function () {
    function e(t, n, r) {
      ((this.siteKey = t),
        (this.recaptchaID = n),
        (this.recaptcha = r),
        (this.styleContainer = null));
    }
    return (
      (e.prototype.execute = function (t) {
        return Vi(this, void 0, void 0, function () {
          var n;
          return Hi(this, function (r) {
            switch (r.label) {
              case 0:
                return this.recaptcha.enterprise
                  ? [4, this.recaptcha.enterprise.execute(this.recaptchaID, { action: t })]
                  : [3, 2];
              case 1:
                return ((n = r.sent()), [3, 4]);
              case 2:
                return [4, this.recaptcha.execute(this.recaptchaID, { action: t })];
              case 3:
                ((n = r.sent()), (r.label = 4));
              case 4:
                return [2, n];
            }
          });
        });
      }),
      (e.prototype.getSiteKey = function () {
        return this.siteKey;
      }),
      (e.prototype.hideBadge = function () {
        this.styleContainer === null &&
          ((this.styleContainer = document.createElement("style")),
          (this.styleContainer.innerHTML = ".grecaptcha-badge{visibility:hidden !important;}"),
          document.head.appendChild(this.styleContainer));
      }),
      (e.prototype.showBadge = function () {
        this.styleContainer !== null &&
          (document.head.removeChild(this.styleContainer), (this.styleContainer = null));
      }),
      e
    );
  })();
  Le.ReCaptchaInstance = Wi;
});
var da = Vt((Ie) => {
  "use strict";
  B();
  var kn =
    (Ie && Ie.__assign) ||
    function () {
      return (
        (kn =
          Object.assign ||
          function (e) {
            for (var t, n = 1, r = arguments.length; n < r; n++) {
              t = arguments[n];
              for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            }
            return e;
          }),
        kn.apply(this, arguments)
      );
    };
  Object.defineProperty(Ie, "__esModule", { value: !0 });
  Ie.getInstance = Ie.load = void 0;
  var qi = bn(),
    Pe;
  (function (e) {
    ((e[(e.NOT_LOADED = 0)] = "NOT_LOADED"),
      (e[(e.LOADING = 1)] = "LOADING"),
      (e[(e.LOADED = 2)] = "LOADED"));
  })(Pe || (Pe = {}));
  var ca = (function () {
    function e() {}
    return (
      (e.load = function (t, n) {
        if ((n === void 0 && (n = {}), typeof document > "u"))
          return Promise.reject(new Error("This is a library for the browser!"));
        if (e.getLoadingState() === Pe.LOADED)
          return e.instance.getSiteKey() === t
            ? Promise.resolve(e.instance)
            : Promise.reject(new Error("reCAPTCHA already loaded with different site key!"));
        if (e.getLoadingState() === Pe.LOADING)
          return t !== e.instanceSiteKey
            ? Promise.reject(new Error("reCAPTCHA already loaded with different site key!"))
            : new Promise(function (a, l) {
                (e.successfulLoadingConsumers.push(function (o) {
                  return a(o);
                }),
                  e.errorLoadingRunnable.push(function (o) {
                    return l(o);
                  }));
              });
        ((e.instanceSiteKey = t), e.setLoadingState(Pe.LOADING));
        var r = new e();
        return new Promise(function (a, l) {
          r.loadScript(
            t,
            n.useRecaptchaNet || !1,
            n.useEnterprise || !1,
            n.renderParameters ? n.renderParameters : {},
            n.customUrl,
          )
            .then(function () {
              e.setLoadingState(Pe.LOADED);
              var o = r.doExplicitRender(
                  grecaptcha,
                  t,
                  n.explicitRenderParameters ? n.explicitRenderParameters : {},
                  n.useEnterprise || !1,
                ),
                i = new qi.ReCaptchaInstance(t, o, grecaptcha);
              (e.successfulLoadingConsumers.forEach(function (u) {
                return u(i);
              }),
                (e.successfulLoadingConsumers = []),
                n.autoHideBadge && i.hideBadge(),
                (e.instance = i),
                a(i));
            })
            .catch(function (o) {
              (e.errorLoadingRunnable.forEach(function (i) {
                return i(o);
              }),
                (e.errorLoadingRunnable = []),
                l(o));
            });
        });
      }),
      (e.getInstance = function () {
        return e.instance;
      }),
      (e.setLoadingState = function (t) {
        e.loadingState = t;
      }),
      (e.getLoadingState = function () {
        return e.loadingState === null ? Pe.NOT_LOADED : e.loadingState;
      }),
      (e.prototype.loadScript = function (t, n, r, a, l) {
        var o = this;
        (n === void 0 && (n = !1),
          r === void 0 && (r = !1),
          a === void 0 && (a = {}),
          l === void 0 && (l = ""));
        var i = document.createElement("script");
        (i.setAttribute("recaptcha-v3-script", ""),
          i.setAttribute("async", ""),
          i.setAttribute("defer", ""));
        var u = "https://www.google.com/recaptcha/api.js";
        (n
          ? r
            ? (u = "https://recaptcha.net/recaptcha/enterprise.js")
            : (u = "https://recaptcha.net/recaptcha/api.js")
          : r && (u = "https://www.google.com/recaptcha/enterprise.js"),
          l && (u = l),
          a.render && (a.render = void 0));
        var s = this.buildQueryString(a);
        return (
          (i.src = u + "?render=explicit" + s),
          new Promise(function (c, d) {
            (i.addEventListener(
              "load",
              o.waitForScriptToLoad(function () {
                c(i);
              }, r),
              !1,
            ),
              (i.onerror = function (f) {
                (e.setLoadingState(Pe.NOT_LOADED), d(f));
              }),
              document.head.appendChild(i));
          })
        );
      }),
      (e.prototype.buildQueryString = function (t) {
        var n = Object.keys(t);
        return n.length < 1
          ? ""
          : "&" +
              Object.keys(t)
                .filter(function (r) {
                  return !!t[r];
                })
                .map(function (r) {
                  return r + "=" + t[r];
                })
                .join("&");
      }),
      (e.prototype.waitForScriptToLoad = function (t, n) {
        var r = this;
        return function () {
          window.grecaptcha === void 0
            ? setTimeout(function () {
                r.waitForScriptToLoad(t, n);
              }, e.SCRIPT_LOAD_DELAY)
            : n
              ? window.grecaptcha.enterprise.ready(function () {
                  t();
                })
              : window.grecaptcha.ready(function () {
                  t();
                });
        };
      }),
      (e.prototype.doExplicitRender = function (t, n, r, a) {
        var l = kn({ sitekey: n }, r);
        return r.container
          ? a
            ? t.enterprise.render(r.container, l)
            : t.render(r.container, l)
          : a
            ? t.enterprise.render(l)
            : t.render(l);
      }),
      (e.loadingState = null),
      (e.instance = null),
      (e.instanceSiteKey = null),
      (e.successfulLoadingConsumers = []),
      (e.errorLoadingRunnable = []),
      (e.SCRIPT_LOAD_DELAY = 25),
      e
    );
  })();
  Ie.load = ca.load;
  Ie.getInstance = ca.getInstance;
});
var va = Vt((_e) => {
  "use strict";
  B();
  Object.defineProperty(_e, "__esModule", { value: !0 });
  _e.ReCaptchaInstance = _e.getInstance = _e.load = void 0;
  var fa = da();
  Object.defineProperty(_e, "load", {
    enumerable: !0,
    get: function () {
      return fa.load;
    },
  });
  Object.defineProperty(_e, "getInstance", {
    enumerable: !0,
    get: function () {
      return fa.getInstance;
    },
  });
  var Gi = bn();
  Object.defineProperty(_e, "ReCaptchaInstance", {
    enumerable: !0,
    get: function () {
      return Gi.ReCaptchaInstance;
    },
  });
});
B();
B();
B();
var Nn = { "Content-Type": "application/json" },
  Te = (e) => `${e.replace(/\/?$/u, "/")}api/`,
  We = (e, t = "") => {
    if (typeof e == "object" && e.errno)
      throw TypeError(`${t} failed with ${e.errno}: ${e.errmsg}`);
    return e;
  },
  Zt = ({ serverURL: e, lang: t, paths: n, type: r, signal: a }) =>
    fetch(
      `${Te(e)}article?path=${encodeURIComponent(n.join(","))}&type=${encodeURIComponent(r.join(","))}&lang=${t}`,
      { signal: a },
    )
      .then((l) => l.json())
      .then((l) => We(l, "Get counter").data),
  xt = ({ serverURL: e, lang: t, path: n, type: r, action: a }) =>
    fetch(`${Te(e)}article?lang=${t}`, {
      method: "POST",
      headers: Nn,
      body: JSON.stringify({ path: n, type: r, action: a }),
    })
      .then((l) => l.json())
      .then((l) => We(l, "Update counter").data),
  Un = ({
    serverURL: e,
    lang: t,
    path: n,
    page: r,
    pageSize: a,
    sortBy: l,
    signal: o,
    token: i,
  }) => {
    let u = {};
    return (
      i && (u.Authorization = `Bearer ${i}`),
      fetch(
        `${Te(e)}comment?path=${encodeURIComponent(n)}&pageSize=${a}&page=${r}&lang=${t}&sortBy=${l}`,
        { signal: o, headers: u },
      )
        .then((s) => s.json())
        .then((s) => We(s, "Get comment data").data)
    );
  },
  Bn = ({ serverURL: e, lang: t, token: n, comment: r }) => {
    let a = { "Content-Type": "application/json" };
    return (
      n && (a.Authorization = `Bearer ${n}`),
      fetch(`${Te(e)}comment?lang=${t}`, {
        method: "POST",
        headers: a,
        body: JSON.stringify(r),
      }).then((l) => l.json())
    );
  },
  Vn = ({ serverURL: e, lang: t, token: n, objectId: r }) =>
    fetch(`${Te(e)}comment/${r}?lang=${t}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${n}` },
    })
      .then((a) => a.json())
      .then((a) => We(a, "Delete comment")),
  at = ({ serverURL: e, lang: t, token: n, objectId: r, comment: a }) =>
    fetch(`${Te(e)}comment/${r}?lang=${t}`, {
      method: "PUT",
      headers: { ...Nn, Authorization: `Bearer ${n}` },
      body: JSON.stringify(a),
    })
      .then((l) => l.json())
      .then((l) => We(l, "Update comment")),
  Hn = ({ serverURL: e, lang: t, paths: n, signal: r }) =>
    fetch(`${Te(e)}comment?type=count&url=${encodeURIComponent(n.join(","))}&lang=${t}`, {
      signal: r,
    })
      .then((a) => a.json())
      .then((a) => We(a, "Get comment count").data),
  il = () => {
    let e = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(e);
  },
  Wn = ({ lang: e, serverURL: t }) => {
    let n = 1024,
      r = (window.innerWidth - n) / 2,
      a = (window.innerHeight - 600) / 2;
    if (il())
      return (
        (location.href = `${t.replace(/\/$/u, "")}/ui/login?lng=${encodeURIComponent(e)}&redirect=${encodeURIComponent(location.href)}`),
        new Promise(() => {})
      );
    let l = window.open(
      `${t.replace(/\/$/u, "")}/ui/login?lng=${encodeURIComponent(e)}`,
      "_blank",
      `width=${n},height=600,left=${r},top=${a},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`,
    );
    return (
      l?.postMessage({ type: "TOKEN", data: null }, "*"),
      new Promise((o) => {
        let i = ({ data: u }) => {
          !u ||
            typeof u != "object" ||
            u.type !== "userInfo" ||
            (u.data.token && (l?.close(), window.removeEventListener("message", i), o(u.data)));
        };
        window.addEventListener("message", i);
      })
    );
  },
  qn = ({ serverURL: e, lang: t, paths: n, signal: r }) =>
    Zt({ serverURL: e, lang: t, paths: n, type: ["time"], signal: r }),
  Gn = (e) => xt({ ...e, type: "time", action: "inc" }),
  Yn = ({ serverURL: e, lang: t, count: n, signal: r, token: a }) => {
    let l = {};
    return (
      a && (l.Authorization = `Bearer ${a}`),
      fetch(`${Te(e)}comment?type=recent&count=${n}&lang=${t}`, { signal: r, headers: l }).then(
        (o) => o.json(),
      )
    );
  };
B();
var Zn = "transparent 47%,currentColor 47%,currentColor 53%,transparent 53%)",
  [ol, sl, ul] = [
    "border:1px solid;padding:2px 3px",
    "background:linear-gradient(to top right," + Zn,
    "background:linear-gradient(" + Zn,
  ].map((e) => ' style="display:inline-block;' + e + '"'),
  Xt = (e, t) => (e.charCodeAt(t) <= 32 ? Xt(e, t + 1) : t),
  Kn = /\d+(?:\.\d+)?|\.\d+/y,
  Xn = /\\(?:[a-zA-Z]+|.)/y,
  cl = (e) => {
    let t = [],
      n = e.length,
      r = 0;
    for (; r < n && ((r = Xt(e, r)), !(r >= n)); ) {
      Xn.lastIndex = r;
      let a = Xn.exec(e);
      if (a) {
        let i = a[0];
        r += i.length;
        let u = /^\\text(?:rm|bf|it|sf|tt)?$/.test(i);
        if ((u && (i = "\\text"), t.push(4, i), u)) {
          let s = Xt(e, r);
          if (e.charCodeAt(s) === 123) {
            let c = 1,
              d = s;
            for (; d < n && c; ) {
              let f = e.charCodeAt(++d);
              f === 123 ? ++c : f === 125 && --c;
            }
            c || (t.push(7, "", 2, e.slice(s + 1, d), 8, ""), (r = d + 1));
          }
        }
        continue;
      }
      if (((Kn.lastIndex = r), (a = Kn.exec(e)), a)) {
        let i = a[0];
        (t.push(1, i), (r += i.length));
        continue;
      }
      let l = e[r],
        o = "_^{}".indexOf(l);
      (t.push(((l.charCodeAt(0) | 32) - 97) >>> 0 < 26 ? 2 : o >= 0 ? o + 5 : 3, l), ++r);
    }
    return (t.push(0, ""), t);
  },
  Jt = (e) => ' lspace="' + e + 'px" rspace="' + e + 'px"',
  ke = (e) => ' mathvariant="' + e + '"',
  Ke = ke("normal"),
  Qn = ke("bold"),
  Jn = ke("double-struck"),
  er = ke("script"),
  tr = ke("fraktur"),
  nr = ke("sans-serif"),
  rr = ke("monospace"),
  ar = ke("italic"),
  lr = ke("bold-italic"),
  dl = ' stretchy="false"' + Jt(0),
  fl = Jt(4),
  vl = Jt(5),
  Tt = { __proto__: null },
  qe = (e, t, n) => {
    e.replace(/([a-zA-Z]+)([^a-zA-Z]+)/g, (r, a, l) => {
      Tt[a] = n ? [t, l, n] : [t, l];
    });
  };
(qe(
  "alpha\u03B1beta\u03B2gamma\u03B3theta\u03B8pi\u03C0delta\u03B4epsilon\u03F5zeta\u03B6eta\u03B7iota\u03B9kappa\u03BAlambda\u03BBmu\u03BCnu\u03BDxi\u03BErho\u03C1sigma\u03C3tau\u03C4upsilon\u03C5phi\u03D5chi\u03C7psi\u03C8omega\u03C9ell\u2113hbar\u210Fneg\xACvarphi\u03C6varpi\u03D6varrho\u03F1vartheta\u03D1varepsilon\u03B5varsigma\u03C2",
  1,
),
  qe(
    "Delta\u0394Gamma\u0393Theta\u0398Lambda\u039BXi\u039EPi\u03A0Sigma\u03A3Upsilon\u03A5Phi\u03A6Psi\u03A8Omega\u03A9infty\u221Enabla\u2207partial\u2202forall\u2200exists\u2203emptyset\u2205degree\xB0aleph\u2135wp\u2118top\u22A4bot\u22A5angle\u2220",
    1,
    Ke,
  ),
  qe(
    "prime\u2032cdot\u22C5times\xD7pm\xB1div\xF7sum\u2211prod\u220Fcoprod\u2210int\u222Biint\u222Ciiint\u222Doint\u222Eleftrightarrow\u2194Leftarrow\u21D0Rightarrow\u21D2Leftrightarrow\u21D4cdots\u22EFin\u2208notin\u2209subset\u2282supset\u2283subseteq\u2286supseteq\u2287cup\u222Acap\u2229to\u2192rightarrow\u2192leftarrow\u2190gets\u2190dots\u2026ldots\u2026le\u2264leq\u2264ge\u2265geq\u2265bigcap\u22C2bigcup\u22C3bigvee\u22C1bigwedge\u22C0bigoplus\u2A01bigotimes\u2A02bigodot\u2A00biguplus\u2A04bigsqcup\u2A06downarrow\u2193uparrow\u2191updownarrow\u2195Downarrow\u21D3Uparrow\u21D1Updownarrow\u21D5longrightarrow\u27F6longleftarrow\u27F5longleftrightarrow\u27F7Longrightarrow\u27F9Longleftarrow\u27F8Longleftrightarrow\u27FAmapsto\u21A6longmapsto\u27FCnearrow\u2197searrow\u2198nwarrow\u2196swarrow\u2199hookrightarrow\u21AAhookleftarrow\u21A9rightharpoonup\u21C0rightharpoondown\u21C1leftharpoonup\u21BCleftharpoondown\u21BD",
    3,
  ),
  qe("neq\u2260ne\u2260lt<gt>", 3, Ke),
  qe(
    "mp\u2213lor\u2228land\u2227oplus\u2295ominus\u2296otimes\u2297oslash\u2298odot\u2299circ\u2218bullet\u2219star\u22C6ast\u2217setminus\u2216wr\u2240diamond\u22C4sqcap\u2293sqcup\u2294triangleleft\u25C1triangleright\u25B7",
    3,
    fl,
  ),
  qe(
    "approx\u2248sim\u223Ccong\u2245propto\u221Dequiv\u2261ni\u220Bperp\u27C2parallel\u2225mid\u2223nmid\u2224ll\u226Agg\u226Bsimeq\u2243prec\u227Asucc\u227Bpreceq\u2AAFsucceq\u2AB0vdash\u22A2dashv\u22A3models\u22A8owns\u220Bsqsubset\u228Fsqsupset\u2290sqsubseteq\u2291sqsupseteq\u2292",
    3,
    vl,
  ),
  "sin cos tan cot sec csc log lg ln lim exp max min sup inf det gcd arcsin arccos arctan sinh cosh tanh coth deg arg".replace(
    /\w+/g,
    (e) => (Tt[e] = [9, e]),
  ),
  [
    [",", 3],
    [":", 4],
    [";", 5],
    ["!", -3],
    [" ", 4],
    ["quad", 16],
    ["qquad", 32],
    ["thinspace", 3],
    ["medspace", 4],
    ["thickspace", 5],
    ["enspace", 8],
    ["negthinspace", -3],
    ["negmedspace", -4],
    ["negthickspace", -5],
  ].map(([e, t]) => (Tt[e] = [17, t + "px"])));
var ir = { __proto__: null, boxed: 1, cancel: 2, sout: 3 },
  Ge = {
    "-": [3, "\u2212"],
    "*": [3, "\u2217"],
    "/": [3, "/", Ke],
    "|": [3, "|", dl],
    ".": [3, ".", Ke],
    "'": [3, "\u2032"],
  },
  Ee = (e, t, n, r) => e[t] === n && e[t + 1] === r,
  or = (e) => (t, n, r, a) => {
    throw [e, a];
  },
  sr = (e, t) => {
    let n = t[0];
    if (e[n] == null) return null;
    t[0] += 2;
    let r = e[n + 1];
    return r === "."
      ? [3, "", ' fence="true" stretchy="true" symmetric="true"']
      : [3, r === "<" ? "\u27E8" : r === ">" ? "\u27E9" : r[0] === "\\" ? r.slice(1) : r];
  },
  en = (e, t, n) => {
    let r = t[0];
    if (Ee(e, r, 3, "[") && (!n || e[r + 2] === 1)) {
      for (r += 2; e[r] > 0 && !Ee(e, r, 3, "]"); ) r += 2;
      (e[r] > 0 && (r += 2), (t[0] = r));
    }
  },
  Et = (e, t) => {
    let n = t[0],
      r = "";
    if (e[n] === 7) {
      for (n += 2; e[n] > 0 && e[n] !== 8; n += 2) r += e[n + 1];
      (e[n] > 0 && (n += 2), (t[0] = n));
    }
    return r;
  },
  pr = (e, t, n, r) => {
    let a = [],
      l = [],
      o = [];
    for (; e[t[0]] > 0; ) {
      let i = e[t[0]],
        u = e[t[0] + 1];
      if (!n && i === 8) break;
      if (n && i === 4 && u === "\\end") {
        let c = t[0];
        if (((t[0] += 2), Et(e, t) === r)) break;
        t[0] = c;
      }
      if (u === "&" || u === "\\\\") {
        ((t[0] += 2), l.push(o), (o = []), u === "\\\\" && (en(e, t, 1), a.push(l), (l = [])));
        continue;
      }
      let s = tn(e, t);
      s && o.push(s);
    }
    return (
      o.length && l.push(o),
      l.length && a.push(l),
      a.length && !a[a.length - 1][1] && !a[a.length - 1][0][0] && a.pop(),
      a
    );
  },
  pl = (e, t, n) => {
    if (e[t[0]] === 7) {
      t[0] += 2;
      let a = pr(e, t, 0, n);
      return (e[t[0]] > 0 && (t[0] += 2), [14, n, a]);
    }
    let r = Z(e, t, 1);
    return r ? [14, n, [[[r]]]] : null;
  },
  hl = (e, t) => {
    if (e[t[0]] === 7) {
      let r = Et(e, t);
      if (r === "") return [8, []];
      let a = r.split("\\\\");
      return a.length > 1
        ? [8, a.flatMap((l, o) => [...(o ? [[15]] : []), ...(l ? [[16, l]] : [])])]
        : [16, r];
    }
    let n = Z(e, t, 1);
    if (n) return [16, n[1]];
    throw [3, "text"];
  },
  ml = (e, t, n) => {
    if (e[t[0]] === 7) {
      let r = Et(e, t);
      return (
        r === "array" && (en(e, t), e[t[0]] === 7 ? Et(e, t) : Z(e, t)), [14, r, pr(e, t, 1, r)]
      );
    }
    return [1, n];
  },
  gl = (e, t) => {
    if (Ee(e, t[0], 3, "[")) {
      t[0] += 2;
      let n = [];
      for (; e[t[0]] > 0 && !Ee(e, t[0], 3, "]"); ) {
        let r = tn(e, t);
        r && n.push(r);
      }
      return (e[t[0]] === 3 && (t[0] += 2), [11, Z(e, t, 1), [8, n]]);
    }
    return [10, Z(e, t, 1)];
  },
  yl = (e, t) => {
    let n = sr(e, t),
      r = nn(e, t);
    if (Ee(e, t[0], 4, "\\right")) return ((t[0] += 2), [12, [n, ...r, sr(e, t)].filter(Boolean)]);
    throw [1, n];
  },
  Qt = (e, t) => {
    if (!e) return e;
    let [n, r] = e;
    if (n === 1 || n === 2) return [n, r, t];
    if (n === 8) return [n, r.map((a) => Qt(a, t))];
    if ((n >= 4 && n <= 6) || n === 13) {
      let a = [...e];
      return ((a[1] = Qt(a[1], t)), a);
    }
    return e;
  },
  X = (e) => (t, n) => Qt(Z(t, n, 1), e),
  fe = (e) => (t, n) => [13, Z(t, n, 1), e],
  ur = fe("\xAF"),
  hr = (e) => (t, n) => {
    let r = Z(t, n, 1);
    return [e, Z(t, n, 1), r, 1];
  },
  cr = hr(4),
  wl = hr(5),
  St = (e, t) => [7, Z(e, t, 1), Z(e, t, 1)],
  dr = {
    __proto__: null,
    "\\": (e, t) => (Ee(e, t[0], 3, "*") && (t[0] += 2), en(e, t, 1), [15]),
    text: hl,
    frac: St,
    dfrac: St,
    tfrac: St,
    cfrac: St,
    overline: ur,
    bar: ur,
    hat: fe("^"),
    tilde: fe("~"),
    vec: fe("\u2192"),
    dot: fe("\u02D9"),
    ddot: fe("\xA8"),
    check: fe("\u02C7"),
    acute: fe("\xB4"),
    grave: fe("`"),
    breve: fe("\u02D8"),
    mathring: fe("\u02DA"),
    stackrel: cr,
    overset: cr,
    underset: wl,
    mathbf: X(Qn),
    boldsymbol: X(lr),
    bm: X(lr),
    mathrm: X(Ke),
    mathbb: X(Jn),
    bb: X(Jn),
    mathcal: X(er),
    cal: X(er),
    mathfrak: X(tr),
    frak: X(tr),
    mathsf: X(nr),
    sf: X(nr),
    mathtt: X(rr),
    tt: X(rr),
    mathit: X(ar),
    it: X(ar),
    rm: X(Ke),
    bf: X(Qn),
    operatorname: (e, t) => {
      Ee(e, t[0], 3, "*") && (t[0] += 2);
      let n = Z(e, t, 1);
      return [9, n ? (n[0] === 8 ? n[1].map((r) => r[1]).join("") : n[1]) : ""];
    },
    tag: (e, t) => [8, [[17, "2em"], Ge["("], Z(e, t, 1), Ge[")"]]],
    sqrt: gl,
    left: yl,
    phantom: (e, t) => [19, Z(e, t, 1)],
    pmod: (e, t) => [8, [[17, "8px"], Ge["("], [16, "mod"], [17, "4px"], Z(e, t, 1), Ge[")"]]],
    begin: ml,
    end: or(0),
    right: or(2),
  },
  bl = [
    ,
    (e) => [2, e],
    (e) => [1, e],
    (e) => Ge[e] ?? [3, e],
    (e, t, n) => {
      let r = e.slice(1),
        a = dr[r] || dr[r.replace(/^wide/, "")];
      if (a) return a(t, n, e, r);
      if (/^(?:[pbvV]?matrix|cases|array)$/.test(r)) {
        let o = pl(t, n, r);
        if (o) return o;
      }
      if (ir[r]) return [18, ir[r], Z(t, n, 1)];
      let l = Tt[r];
      if (l) return l;
      throw [4, e];
    },
    ,
    ,
    (e, t, n) => {
      let r = [8, nn(t, n)];
      return (t[n[0]] > 0 && (n[0] += 2), r);
    },
  ],
  Z = (e, t, n) => {
    let r = t[0],
      a = e[r],
      l = t[1];
    if (!a) return null;
    let o = e[r + 1];
    return (
      l && (o = o.slice(l)),
      n && a === 1 && o[1] ? ((t[1] = l + 1), (o = o[0])) : ((t[0] += 2), (t[1] = 0)),
      bl[a](o, e, t)
    );
  },
  tn = (e, t) => {
    let n = Z(e, t),
      r = t[0];
    if (!n) return null;
    let a = e[r + 1] === "\\limits" ? 1 : e[r + 1] === "\\nolimits" ? 2 : 0,
      l,
      o,
      i;
    for (a && (t[0] += 2); (i = e[t[0]]) > 0; ) {
      let u = 0;
      for (; e[t[0] + 1] === "'"; t[0] += 2) ++u;
      if (u) {
        o = [3, "\u2032".repeat(u)];
        continue;
      }
      if (i !== 5 && i !== 6) break;
      ((t[0] += 2), i === 5 ? (l = Z(e, t, 1)) : (o = Z(e, t, 1)));
    }
    return l ? (o ? [6, n, l, o, a] : [5, n, l, a]) : o ? [4, n, o, a] : n;
  },
  nn = (e, t) => {
    let n = [],
      r;
    for (; (r = e[t[0]]) > 0 && !(r === 8 || Ee(e, t[0], 4, "\\right")); ) {
      let a = tn(e, t);
      a && n.push(a);
    }
    return n;
  };
for (let e of "()[]") Ge[e] = [3, e, ' stretchy="false"'];
var Ze = "mrow",
  mr = "left",
  gr = "start",
  fr = [null, ol, sl, ul],
  kl = ["right", mr],
  yr = [";padding-right:0", ";padding-left:0"],
  wr = ' style="justify-items:',
  xl = yr.map((e, t) => wr + (t ? gr : "end") + e + '"'),
  Sl = yr.map((e) => wr + gr + e + '"'),
  Cl = [null, "mi", "mn", "mo"],
  br = (e) => e.replace(/[&<>"]/g, (t) => "&#" + t.charCodeAt(0) + ";"),
  Y = (e, t, n) => "<" + e + (n || "") + ">" + t + "</" + e + ">",
  lt = (e, t, n) => Y(e, br(t), n),
  vr = (e, t, n = ".2em", r = "") =>
    r + ' columnalign="' + e + '" rowspacing="' + n + '" columnspacing="' + t + '"',
  Ct = (e, ...t) => Y(e, t.map(Ye).join("")),
  kr = (e) => Y(Ze, e.map(it).join("")),
  Kt = (e, t, n, r, [, a] = e[1], l = e[t]) =>
    Ct(l === 1 || (!l && /^([∑∏∐⋂⋃⨁⨂⋁⋀]|lim|max|min|sup|inf)$/.test(a)) ? n : r, ...e.slice(1, t)),
  Ye = (e) => {
    if (!e) return Y(Ze, "");
    let [t, n] = e;
    return t === 8 && !n[1] ? Ye(n[0]) : t === 8 || t === 9 ? Y(Ze, it(e)) : it(e);
  },
  Tl = [
    ,
    ,
    ,
    ,
    (e) => Kt(e, 3, "mover", "msup"),
    (e) => Kt(e, 3, "munder", "msub"),
    (e) => Kt(e, 4, "munderover", "msubsup"),
    ([, e, t]) => Ct("mfrac", e, t),
    ([, e]) => e.map(it).join(""),
    ([, e]) => lt("mi", e) + Y("mo", "\u2061"),
    ([, e]) => Y("msqrt", Ye(e)),
    ([, e, t]) => Ct("mroot", e, t),
    ([, e]) => kr(e),
    ([, e, t]) => Ct("mover", e, [3, t]),
    (e) => {
      let [, t, n] = e,
        r = t === "cases",
        a = /^align|split/.test(t),
        l =
          r &&
          n.every((f) => {
            let [v, p] = f[1]?.[0] || [];
            return !v || (v === 3 && "=<\u2264\u2265\u2260\u2248\u2261\u221D>".includes(p));
          }),
        o = n[0] || [],
        i = o.map((f, v) =>
          r ? (l ? Sl[v % 2] : ' style="justify-items:start"') : a ? xl[v % 2] : "",
        ),
        u = n
          .map((f) =>
            Y(
              "mtr",
              f
                .map((v, p) => {
                  let y = v.map(it).join("");
                  return Y("mtd", v[1] ? Y(Ze, y) : y, i[p] || "");
                })
                .join(""),
            ),
          )
          .join(""),
        s = r
          ? vr(mr, l ? "0" : "1em")
          : a
            ? vr(
                o.map((f, v) => kl[v % 2]).join(" "),
                o
                  .slice(1)
                  .map((f, v) => (v % 2 ? "2em" : "0"))
                  .join(" "),
                ".6em",
                ' displaystyle="true"',
              )
            : "",
        c = Y("mtable", u, s),
        d = "pbvVc".indexOf(t[0]);
      return d >= 0
        ? Y(Ze, lt("mo", "([|\u2016{"[d]) + c + (d < 4 ? lt("mo", ")]\u2016\u2016"[d]) : ""))
        : c;
    },
    () => Y("mspace", "", ' linebreak="newline"'),
    ([, e]) => lt("mtext", e.replace(/ /g, "\xA0")),
    ([, e]) => Y("mspace", "", ' width="' + e + '"'),
    ([, e, t]) => (fr[e] ? Y(Ze, Ye(t), fr[e]) : Ye(t)),
    ([, e]) => Y("mphantom", Ye(e)),
  ],
  it = (e) => (e ? (e[0] <= 3 ? lt(Cl[e[0]], e[1], e[2]) : Tl[e[0]](e)) : ""),
  xr = (e, t) => {
    let n = e.replace(/[\r\n]+/g, " ");
    return Y(
      "math",
      Y(
        "semantics",
        kr(nn(cl(n), [0, 0])) + Y("annotation", br(n), ' encoding="application/x-tex"'),
      ),
      ' xmlns="http://www.w3.org/1998/Math/MathML"' + (t ? ' display="block"' : ""),
    );
  };
B();
B();
function rn(e, t) {
  return In() ? (_n(e, t), !0) : !1;
}
var ot = typeof window < "u" && typeof document < "u",
  $l = typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var Al = Object.prototype.toString,
  Sr = (e) => Al.call(e) === "[object Object]";
var xe = () => {};
function Cr(...e) {
  if (e.length !== 1) return Mn(...e);
  let t = e[0];
  return typeof t == "function" ? Ht(On(() => ({ get: t, set: xe }))) : z(t);
}
function an(e, t) {
  function n(...r) {
    return new Promise((a, l) => {
      Promise.resolve(e(() => t.apply(this, r), { fn: t, thisArg: this, args: r }))
        .then(a)
        .catch(l);
    });
  }
  return (
    "cancel" in e && Object.assign(n, { cancel: e.cancel, flush: e.flush, isPending: e.isPending }),
    n
  );
}
var ln = (e) => e();
function Tr(e, t = {}) {
  let n,
    r,
    a = xe,
    l = xe,
    o = ye(!1),
    i = (c) => {
      (clearTimeout(c), a(), (a = xe));
    },
    u;
  return Object.assign(
    (c) => {
      let d = oe(e),
        f = oe(t.maxWait);
      return (
        n && i(n),
        d <= 0 || (f !== void 0 && f <= 0)
          ? (r && (i(r), (r = void 0)), (o.value = !1), Promise.resolve(c()))
          : ((o.value = !0),
            new Promise((v, p) => {
              ((a = t.rejectOnCancel ? p : v),
                (l = v),
                (u = c),
                f &&
                  !r &&
                  (r = setTimeout(() => {
                    (n && i(n), (r = void 0), (o.value = !1), v(u()));
                  }, f)),
                (n = setTimeout(() => {
                  (r && i(r), (r = void 0), (o.value = !1), v(c()));
                }, d)));
            }))
      );
    },
    {
      cancel: () => {
        (n && (i(n), (n = void 0)), r && (i(r), (r = void 0)), (o.value = !1), (l = xe));
      },
      flush: () => {
        if (o.value) {
          (n && (clearTimeout(n), (n = void 0)),
            r && (clearTimeout(r), (r = void 0)),
            (o.value = !1));
          let c = l;
          ((a = xe), (l = xe), c(u()));
        }
      },
      isPending: Ve(o),
    },
  );
}
function Er(e = ln, t = {}) {
  let { initialState: n = "active" } = t,
    r = Cr(n === "active");
  function a() {
    r.value = !1;
  }
  function l() {
    r.value = !0;
  }
  let o = (...i) => {
    r.value && e(...i);
  };
  return { isActive: Ve(r), pause: a, resume: l, eventFilter: o };
}
function $t(e) {
  return Array.isArray(e) ? e : [e];
}
function $r(e) {
  let t = Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}
var Rl = /\B([A-Z])/g,
  nc = $r((e) => e.replace(Rl, "-$1").toLowerCase()),
  Ll = /-(\w)/g,
  Pl = $r((e) => e.replace(Ll, (t, n) => (n ? n.toUpperCase() : "")));
function Ar(e) {
  return e || Gt();
}
function on(e, t = 200, n = {}) {
  return an(Tr(t, n), e);
}
function Rr(e, t, n = {}) {
  let { eventFilter: r = ln, ...a } = n;
  return he(e, an(r, t), a);
}
function Lr(e, t, n = {}) {
  let { eventFilter: r, initialState: a = "active", ...l } = n,
    { eventFilter: o, pause: i, resume: u, isActive: s } = Er(r, { initialState: a });
  return { stop: Rr(e, t, { ...l, eventFilter: o }), pause: i, resume: u, isActive: s };
}
function At(e, t = !0, n) {
  Ar(n) ? Ce(e, n) : t ? e() : Me(e);
}
function Pr(e, t) {
  Ar(t) && rt(e, t);
}
function $e(e, t, n) {
  return he(e, t, { ...n, immediate: !0 });
}
var Xe = ot ? window : void 0,
  _r = ot ? window.document : void 0,
  Wc = ot ? window.navigator : void 0,
  qc = ot ? window.location : void 0;
function Il(e) {
  var t;
  let n = oe(e);
  return (t = n?.$el) !== null && t !== void 0 ? t : n;
}
function Ae(...e) {
  let t = (r, a, l, o) => (r.addEventListener(a, l, o), () => r.removeEventListener(a, l, o)),
    n = V(() => {
      let r = $t(oe(e[0])).filter((a) => a != null);
      return r.every((a) => typeof a != "string") ? r : void 0;
    });
  return $e(
    () => {
      var r, a;
      return [
        (r = (a = n.value) === null || a === void 0 ? void 0 : a.map((l) => Il(l))) !== null &&
        r !== void 0
          ? r
          : [Xe].filter((l) => l != null),
        $t(oe(n.value ? e[1] : e[0])),
        $t($(n.value ? e[2] : e[1])),
        oe(n.value ? e[3] : e[2]),
      ];
    },
    ([r, a, l, o], i, u) => {
      if (!r?.length || !a?.length || !l?.length) return;
      let s = Sr(o) ? { ...o } : o,
        c = r.flatMap((d) => a.flatMap((f) => l.map((v) => t(d, f, v, s))));
      u(() => {
        c.forEach((d) => d());
      });
    },
    { flush: "post" },
  );
}
function _l(e, t = {}) {
  let { immediate: n = !0, fpsLimit: r = null, window: a = Xe, once: l = !1 } = t,
    o = ye(!1),
    i = V(() => {
      let v = oe(r);
      return v ? 1e3 / v : null;
    }),
    u = 0,
    s = null;
  function c(v) {
    if (!o.value || !a) return;
    u || (u = v);
    let p = v - u;
    if (i.value && p < i.value) {
      s = a.requestAnimationFrame(c);
      return;
    }
    if (((u = v), e({ delta: p, timestamp: v }), l)) {
      ((o.value = !1), (s = null));
      return;
    }
    s = a.requestAnimationFrame(c);
  }
  function d() {
    !o.value && a && ((o.value = !0), (u = 0), (s = a.requestAnimationFrame(c)));
  }
  function f() {
    ((o.value = !1), s != null && a && (a.cancelAnimationFrame(s), (s = null)));
  }
  return (n && d(), rn(f), { isActive: Ve(o), pause: f, resume: d });
}
var Gc = Symbol("vueuse-ssr-width");
var Rt =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {},
  Lt = "__vueuse_ssr_handlers__",
  Ol = Ml();
function Ml() {
  return (Lt in Rt || (Rt[Lt] = Rt[Lt] || {}), Rt[Lt]);
}
function Fl(e, t) {
  return Ol[e] || t;
}
function Dl(e) {
  return e == null
    ? "any"
    : e instanceof Set
      ? "set"
      : e instanceof Map
        ? "map"
        : e instanceof Date
          ? "date"
          : typeof e == "boolean"
            ? "boolean"
            : typeof e == "string"
              ? "string"
              : typeof e == "object"
                ? "object"
                : Number.isNaN(e)
                  ? "any"
                  : "number";
}
var zl = {
    boolean: { read: (e) => e === "true", write: (e) => String(e) },
    object: { read: (e) => JSON.parse(e), write: (e) => JSON.stringify(e) },
    number: { read: (e) => Number.parseFloat(e), write: (e) => String(e) },
    any: { read: (e) => e, write: (e) => String(e) },
    string: { read: (e) => e, write: (e) => String(e) },
    map: {
      read: (e) => new Map(JSON.parse(e)),
      write: (e) => JSON.stringify(Array.from(e.entries())),
    },
    set: { read: (e) => new Set(JSON.parse(e)), write: (e) => JSON.stringify(Array.from(e)) },
    date: { read: (e) => new Date(e), write: (e) => e.toISOString() },
  },
  Ir = "vueuse-storage";
function De(e, t, n, r = {}) {
  var a;
  let {
      flush: l = "pre",
      deep: o = !0,
      listenToStorageChanges: i = !0,
      writeDefaults: u = !0,
      mergeDefaults: s = !1,
      shallow: c,
      window: d = Xe,
      eventFilter: f,
      onError: v = (k) => {
        console.error(k);
      },
      initOnMounted: p,
    } = r,
    y = (c ? ye : z)(typeof t == "function" ? t() : t),
    g = V(() => oe(e));
  if (!n)
    try {
      n = Fl("getDefaultStorage", () => Xe?.localStorage)();
    } catch (k) {
      v(k);
    }
  if (!n) return y;
  let C = oe(t),
    F = Dl(C),
    x = (a = r.serializer) !== null && a !== void 0 ? a : zl[F],
    { pause: I, resume: Q } = Lr(y, (k) => te(k), { flush: l, deep: o, eventFilter: f });
  he(g, () => A(), { flush: l });
  let J = !1,
    ee = (k) => {
      (p && !J) || A(k);
    },
    R = (k) => {
      (p && !J) || O(k);
    };
  (d && i && (n instanceof Storage ? Ae(d, "storage", ee, { passive: !0 }) : Ae(d, Ir, R)),
    p
      ? At(() => {
          ((J = !0), A());
        })
      : A());
  function le(k, j) {
    if (d) {
      let D = { key: g.value, oldValue: k, newValue: j, storageArea: n };
      d.dispatchEvent(
        n instanceof Storage ? new StorageEvent("storage", D) : new CustomEvent(Ir, { detail: D }),
      );
    }
  }
  function te(k) {
    try {
      let j = n.getItem(g.value);
      if (k == null) (le(j, null), n.removeItem(g.value));
      else {
        let D = x.write(k);
        j !== D && (n.setItem(g.value, D), le(j, D));
      }
    } catch (j) {
      v(j);
    }
  }
  function E(k) {
    let j = k ? k.newValue : n.getItem(g.value);
    if (j == null) return (u && C != null && n.setItem(g.value, x.write(C)), C);
    if (!k && s) {
      let D = x.read(j);
      return typeof s == "function"
        ? s(D, C)
        : F === "object" && !Array.isArray(D)
          ? { ...C, ...D }
          : D;
    } else return typeof j != "string" ? j : x.read(j);
  }
  function A(k) {
    if (!(k && k.storageArea !== n)) {
      if (k && k.key == null) {
        y.value = C;
        return;
      }
      if (!(k && k.key !== g.value)) {
        I();
        try {
          let j = x.write(y.value);
          (k === void 0 || k?.newValue !== j) && (y.value = E(k));
        } catch (j) {
          v(j);
        } finally {
          k ? Me(Q) : Q();
        }
      }
    }
  }
  function O(k) {
    A(k.detail);
  }
  return y;
}
function Or(e = {}) {
  let { controls: t = !1, scheduler: n = _l } = e,
    r = ye(new Date()),
    l = n(() => (r.value = new Date()));
  return t ? { now: r, ...l } : r;
}
function Mr(e, t = xe, n = {}) {
  let {
      immediate: r = !0,
      manual: a = !1,
      type: l = "text/javascript",
      async: o = !0,
      crossOrigin: i,
      referrerPolicy: u,
      noModule: s,
      defer: c,
      document: d = _r,
      attrs: f = {},
      nonce: v = void 0,
    } = n,
    p = ye(null),
    y = null,
    g = (x) =>
      new Promise((I, Q) => {
        let J = (te) => ((p.value = te), I(te), te);
        if (!d) {
          I(!1);
          return;
        }
        let ee = !1,
          R = d.querySelector(`script[src="${oe(e)}"]`);
        R
          ? R.hasAttribute("data-loaded") && J(R)
          : ((R = d.createElement("script")),
            (R.type = l),
            (R.async = o),
            (R.src = oe(e)),
            c && (R.defer = c),
            i && (R.crossOrigin = i),
            s && (R.noModule = s),
            u && (R.referrerPolicy = u),
            v && (R.nonce = v),
            Object.entries(f).forEach(([te, E]) => R?.setAttribute(te, E)),
            (ee = !0));
        let le = { passive: !0 };
        (Ae(R, "error", (te) => Q(te), le),
          Ae(R, "abort", (te) => Q(te), le),
          Ae(
            R,
            "load",
            () => {
              (R.setAttribute("data-loaded", "true"), t(R), J(R));
            },
            le,
          ),
          ee && (R = d.head.appendChild(R)),
          x || J(R));
      }),
    C = (x = !0) => (y || (y = g(x)), y),
    F = () => {
      if (!d) return;
      ((y = null), p.value && (p.value = null));
      let x = d.querySelector(`script[src="${oe(e)}"]`);
      x && d.head.removeChild(x);
    };
  return (r && !a && At(C), a || Pr(F), { scriptTag: p, load: C, unload: F });
}
var jl = 0,
  st = new WeakMap();
function Fr(e, t = {}) {
  let n = ye(!1),
    { document: r = _r, immediate: a = !0, manual: l = !1, id: o = `vueuse_styletag_${++jl}` } = t,
    i = ye(e),
    u = () => {},
    s = () => {
      var d;
      if (!r) return;
      let f = r.getElementById(o) || r.createElement("style");
      (f.isConnected ||
        ((f.id = o),
        t.nonce && (f.nonce = t.nonce),
        t.media && (f.media = t.media),
        r.head.appendChild(f)),
        !n.value &&
          (st.set(f, ((d = st.get(f)) !== null && d !== void 0 ? d : 0) + 1),
          (u = he(
            i,
            (v) => {
              f.textContent = v;
            },
            { immediate: !0 },
          )),
          (n.value = !0)));
    },
    c = () => {
      if (!r || !n.value) return;
      u();
      let d = r.getElementById(o);
      if (d) {
        var f;
        let v = ((f = st.get(d)) !== null && f !== void 0 ? f : 1) - 1;
        v <= 0 ? (st.delete(d), r.head.removeChild(d)) : st.set(d, v);
      }
      n.value = !1;
    };
  return (a && !l && At(s), l || rn(c), { id: o, css: i, unload: c, load: s, isLoaded: Ve(n) });
}
var Yc = [
  { max: 6e4, value: 1e3, name: "second" },
  { max: 276e4, value: 6e4, name: "minute" },
  { max: 72e6, value: 36e5, name: "hour" },
  { max: 5184e5, value: 864e5, name: "day" },
  { max: 24192e5, value: 6048e5, name: "week" },
  { max: 28512e6, value: 2592e6, name: "month" },
  { max: Number.POSITIVE_INFINITY, value: 31536e6, name: "year" },
];
B();
function dn() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null,
  };
}
var Ne = dn();
function Yr(e) {
  Ne = e;
}
var ze = { exec: () => null };
function Qe(e) {
  let t = [];
  return (n) => {
    let r = Math.max(0, Math.min(3, n - 1)),
      a = t[r];
    return (a || ((a = e(r)), (t[r] = a)), a);
  };
}
function P(e, t = "") {
  let n = typeof e == "string" ? e : e.source,
    r = {
      replace: (a, l) => {
        let o = typeof l == "string" ? l : l.source;
        return ((o = o.replace(ae.caret, "$1")), (n = n.replace(a, o)), r);
      },
      getRegex: () => new RegExp(n, t),
    };
  return r;
}
var Nl = ((e = "") => {
    try {
      return !!new RegExp("(?<=1)(?<!1)" + e);
    } catch {
      return !1;
    }
  })(),
  ae = {
    codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    endingSpaceTabChar: /[ \t]$/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    leadingSpaceTab: /^[ \t]+/,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] +\S/,
    listReplaceTask: /^\[[ xX]\] +/,
    listTaskCheckbox: /\[[ xX]\]/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: Qe(
      (e) => new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
    ),
    hrRegex: Qe(
      (e) => new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`),
    ),
    fencesBeginRegex: Qe((e) => new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
    headingBeginRegex: Qe((e) => new RegExp(`^ {0,${e}}#`)),
    htmlBeginRegex: Qe(
      (e) =>
        new RegExp(
          `^ {0,${e}}(?:</?(?:${ft})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,
          "i",
        ),
    ),
    blockquoteBeginRegex: Qe((e) => new RegExp(`^ {0,${e}}>`)),
  },
  Ul = /^(?:[ \t]*(?:\n|$))+/,
  Bl = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
  Vl =
    /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  dt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  Hl = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  fn = / {0,3}(?:[*+-]|\d{1,9}[.)])/,
  Zr =
    /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  Kr = P(Zr)
    .replace(/bull/g, fn)
    .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
    .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
    .replace(/blockquote/g, / {0,3}>/)
    .replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/)
    .replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/)
    .replace(/html/g, / {0,3}<[^\n>]+>\n/)
    .replace(/\|table/g, "")
    .getRegex(),
  Wl = P(Zr)
    .replace(/bull/g, fn)
    .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
    .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
    .replace(/blockquote/g, / {0,3}>/)
    .replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/)
    .replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/)
    .replace(/html/g, / {0,3}<[^\n>]+>\n/)
    .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
    .getRegex(),
  vn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,
  ql = /^[^\n]+/,
  pn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
  Gl = P(
    /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/,
  )
    .replace("label", pn)
    .replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/)
    .getRegex(),
  Yl = P(/^(bull)([ \t][^\n]*?)?(?:\n|$)/)
    .replace(/bull/g, fn)
    .getRegex(),
  ft =
    "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
  hn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
  Zl = P(
    "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
    "i",
  )
    .replace("comment", hn)
    .replace("tag", ft)
    .replace(
      "attribute",
      / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
    )
    .getRegex(),
  Xr = (e) =>
    P(vn)
      .replace("hr", dt)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("|lheading", "")
      .replace("|table", "")
      .replace("blockquote", " {0,3}>")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)")
      .replace("list", e)
      .replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)")
      .replace("tag", ft)
      .getRegex(),
  Kl = Xr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),
  Xl = Xr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),
  Ql = P(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
    .replace("paragraph", Xl)
    .getRegex(),
  mn = {
    blockquote: Ql,
    code: Bl,
    def: Gl,
    fences: Vl,
    heading: Hl,
    hr: dt,
    html: Zl,
    lheading: Kr,
    list: Yl,
    newline: Ul,
    paragraph: Kl,
    table: ze,
    text: ql,
  },
  Dr = P(
    "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
  )
    .replace("hr", dt)
    .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
    .replace("blockquote", " {0,3}>")
    .replace("code", "(?: {4}| {0,3}	)[^\\n]")
    .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)")
    .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
    .replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)")
    .replace("tag", ft)
    .getRegex(),
  Jl = {
    ...mn,
    lheading: Wl,
    table: Dr,
    paragraph: P(vn)
      .replace("hr", dt)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("|lheading", "")
      .replace("table", Dr)
      .replace("blockquote", " {0,3}>")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)")
      .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]")
      .replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)")
      .replace("tag", ft)
      .getRegex(),
  },
  ei = {
    ...mn,
    html: P(
      `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`,
    )
      .replace("comment", hn)
      .replace(
        /tag/g,
        "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b",
      )
      .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: ze,
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: P(vn)
      .replace("hr", dt)
      .replace(
        "heading",
        ` *#{1,6} *[^
]`,
      )
      .replace("lheading", Kr)
      .replace("|table", "")
      .replace("blockquote", " {0,3}>")
      .replace("|fences", "")
      .replace("|list", "")
      .replace("|html", "")
      .replace("|tag", "")
      .getRegex(),
  },
  ti = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  ni = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  Qr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/,
  ri = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  Se = /[\p{P}\p{S}]/u,
  Je = /[\s\p{P}\p{S}]/u,
  vt = /[^\s\p{P}\p{S}]/u,
  ai = P(/^((?![*_])punctSpace)/, "u")
    .replace(/punctSpace/g, Je)
    .getRegex(),
  li = /[\p{Pi}\p{Ps}"']/u,
  Jr = /(?!~)[\p{P}\p{S}]/u,
  ii = /(?!~)[\s\p{P}\p{S}]/u,
  oi = /(?:[^\s\p{P}\p{S}]|~)/u,
  si = P(/link|precode-code|html/, "g")
    .replace(
      "link",
      /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/,
    )
    .replace("precode-", Nl ? "(?<!`)()" : "(^^|[^`])")
    .replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/)
    .replace("html", /<(?! )[^<>]*?>/)
    .getRegex(),
  ea = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,
  ui = P(ea, "u").replace(/punct/g, Se).getRegex(),
  ci = P(ea, "u").replace(/punct/g, Jr).getRegex(),
  di =
    /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,
  fi = P(di, "u")
    .replace(/openQuote/g, li)
    .replace(/punct/g, Se)
    .getRegex(),
  ta =
    "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
  vi = P(ta, "gu")
    .replace(/notPunctSpace/g, vt)
    .replace(/punctSpace/g, Je)
    .replace(/punct/g, Se)
    .getRegex(),
  pi = P(ta, "gu")
    .replace(/notPunctSpace/g, oi)
    .replace(/punctSpace/g, ii)
    .replace(/punct/g, Jr)
    .getRegex(),
  hi =
    "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",
  mi = P(hi, "gu")
    .replace(/notPunctSpace/g, vt)
    .replace(/punctSpace/g, Je)
    .replace(/punct/g, Se)
    .getRegex(),
  gi = P(
    "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
    "gu",
  )
    .replace(/notPunctSpace/g, vt)
    .replace(/punctSpace/g, Je)
    .replace(/punct/g, Se)
    .getRegex(),
  yi =
    "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",
  wi = P(yi, "gu")
    .replace(/notPunctSpace/g, vt)
    .replace(/punctSpace/g, Je)
    .replace(/punct/g, Se)
    .getRegex(),
  bi = P(/^~~?(?:((?!~)punct)|[^\s~])/, "u")
    .replace(/punct/g, Se)
    .getRegex(),
  ki =
    "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",
  xi = P(ki, "gu")
    .replace(/notPunctSpace/g, vt)
    .replace(/punctSpace/g, Je)
    .replace(/punct/g, Se)
    .getRegex(),
  Si = P(/\\(punct)/, "gu")
    .replace(/punct/g, Se)
    .getRegex(),
  Ci = P(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
    .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
    .replace(
      "email",
      /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,
    )
    .getRegex(),
  Ti = P(hn).replace("(?:-->|$)", "-->").getRegex(),
  Ei = P(
    "^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  )
    .replace("comment", Ti)
    .replace(
      "attribute",
      /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,
    )
    .getRegex(),
  na = /\[(?:\\[\s\S]|[^\[\]\\])*\]/,
  It = P(
    /(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,
  )
    .replace("brackets", na)
    .getRegex(),
  $i = P(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/)
    .replace("label", It)
    .replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/)
    .replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/)
    .getRegex(),
  Ai = P(/^!?\[(label)\]\[(ref)\]/)
    .replace("label", It)
    .replace("ref", pn)
    .getRegex(),
  Ri = P(/^!?\[(ref)\](?:\[\])?/)
    .replace("ref", pn)
    .getRegex(),
  zr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,
  Li = P(
    /(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/,
  )
    .replace("brackets", na)
    .getRegex(),
  Pi = P("reflink|nolink(?!\\()", "g")
    .replace(
      "reflink",
      P(/^!?\[(label)\]\[(ref)\]/)
        .replace("label", Li)
        .replace("ref", zr)
        .getRegex(),
    )
    .replace(
      "nolink",
      P(/^!?\[(ref)\](?:\[\])?/)
        .replace("ref", zr)
        .getRegex(),
    )
    .getRegex(),
  jr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
  Ii = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,
  _i = P(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/)
    .replace(/email/g, Ii)
    .getRegex(),
  gn = {
    _backpedal: ze,
    anyPunctuation: Si,
    autolink: Ci,
    blockSkip: si,
    br: Qr,
    code: ni,
    del: ze,
    delLDelim: ze,
    delRDelim: ze,
    emStrongLDelim: ui,
    emStrongRDelimAst: vi,
    emStrongRDelimUnd: gi,
    escape: ti,
    link: $i,
    nolink: Ri,
    punctuation: ai,
    reflink: Ai,
    reflinkSearch: Pi,
    tag: Ei,
    text: ri,
    url: ze,
  },
  Oi = {
    ...gn,
    emStrongLDelim: fi,
    emStrongRDelimAst: mi,
    emStrongRDelimUnd: wi,
    link: P(/^!?\[(label)\]\((.*?)\)/)
      .replace("label", It)
      .getRegex(),
    reflink: P(/^!?\[(label)\]\s*\[([^\]]*)\]/)
      .replace("label", It)
      .getRegex(),
  },
  sn = {
    ...gn,
    emStrongRDelimAst: pi,
    emStrongLDelim: ci,
    delLDelim: bi,
    delRDelim: xi,
    url: P(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
      .replace("emailProtocol", _i)
      .replace("protocol", jr)
      .replace(
        "email",
        /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,
      )
      .getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
    text: P(
      /^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/,
    )
      .replace("protocol", jr)
      .replace(/emailProtocol/g, /(?:mailto|xmpp):/)
      .getRegex(),
  },
  Mi = {
    ...sn,
    br: P(Qr).replace("{2,}", "*").getRegex(),
    text: P(sn.text)
      .replace("\\b_", "\\b_| {2,}\\n")
      .replace(/\{2,\}/g, "*")
      .getRegex(),
  },
  Pt = { normal: mn, gfm: Jl, pedantic: ei },
  ut = { normal: gn, gfm: sn, breaks: Mi, pedantic: Oi },
  Fi = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
  Nr = (e) => Fi[e];
function ue(e, t) {
  if (t) {
    if (ae.escapeTest.test(e)) return e.replace(ae.escapeReplace, Nr);
  } else if (ae.escapeTestNoEncode.test(e)) return e.replace(ae.escapeReplaceNoEncode, Nr);
  return e;
}
function Di(e) {
  return e.replace(ae.numericCharacterReference, (t, n, r) => {
    let a = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
    return a === 0 || a > 1114111 || (a >= 55296 && a <= 57343)
      ? "\uFFFD"
      : String.fromCodePoint(a);
  });
}
function Ur(e) {
  try {
    e = encodeURI(e).replace(ae.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Br(e, t) {
  let n = e.replace(ae.findPipe, (l, o, i) => {
      let u = !1,
        s = o;
      for (; --s >= 0 && i[s] === "\\"; ) u = !u;
      return u ? "|" : " |";
    }),
    r = n.split(ae.splitPipe),
    a = 0;
  if ((r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), t))
    if (r.length > t) r.splice(t);
    else for (; r.length < t; ) r.push("");
  for (; a < r.length; a++) r[a] = r[a].trim().replace(ae.slashPipe, "|");
  return r;
}
function Re(e, t, n) {
  let r = e.length;
  if (r === 0) return "";
  let a = 0;
  for (; a < r; ) {
    let l = e.charAt(r - a - 1);
    if (l === t && !n) a++;
    else if (l !== t && n) a++;
    else break;
  }
  return e.slice(0, r - a);
}
function Vr(e) {
  let t = e.split(`
`),
    n = t.length - 1;
  for (; n >= 0 && ae.blankLine.test(t[n]); ) n--;
  return t.length - n <= 2
    ? e
    : t.slice(0, n + 1).join(`
`);
}
function _t(e) {
  return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Hr(e, t) {
  if (e.indexOf(t[0]) === -1 && e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    if (e[r] === "\\") r++;
    else if (e[r] === t[0]) n++;
    else if (e[r] === t[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Wr(e, t = 0) {
  let n = t,
    r = "";
  for (let a of e)
    if (a === "	") {
      let l = 4 - (n % 4);
      ((r += " ".repeat(l)), (n += l));
    } else ((r += a), n++);
  return r;
}
function qr(e, t, n, r, a) {
  let l = t.href,
    o = t.title || null,
    i = e[1].replace(a.other.outputLinkReplace, "$1"),
    u = e[0].charAt(0) === "!";
  r.state.inLink = !0;
  let s = r.state.linkEmitted,
    c = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let d = r.inlineTokens(i),
    f = r.state.linkEmitted;
  if (((r.state.linkEmitted = s), (r.state.inLink = !1), !u)) {
    if (f) {
      r.state.inRawBlock = c;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return { type: u ? "image" : "link", raw: n, href: l, title: o, text: i, tokens: d };
}
function zi(e, t, n) {
  let r = e.match(n.other.indentCodeCompensation);
  if (r === null) return t;
  let a = r[1];
  return t
    .split(`
`)
    .map((l) => {
      let o = l.match(n.other.beginningSpace);
      if (o === null) return l;
      let [i] = o;
      return l.slice(Math.min(i.length, a.length));
    }).join(`
`);
}
function Gr(e, t, n, r) {
  if (!t.includes("<")) return !1;
  for (let a = 0; a < t.length; a++) {
    if (t[a] === "\\") {
      a++;
      continue;
    }
    if (t[a] === "`") {
      let i = r.inline.code.exec(t.slice(a));
      if (i) {
        a += i[0].length - 1;
        continue;
      }
    }
    if (t[a] !== "<") continue;
    let l = e.slice(n + a),
      o = r.inline.tag.exec(l) || r.inline.autolink.exec(l);
    if (o) {
      if (o[0].length > t.length - a) return !0;
      a += o[0].length - 1;
    }
  }
  return !1;
}
var Ot = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || Ne;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = this.options.pedantic ? t[0] : Vr(t[0]),
          r = n.replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: n, codeBlockStyle: "indented", text: r };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0],
          r = zi(n, t[3] || "", this.rules);
        return {
          type: "code",
          raw: n,
          lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
          text: r,
        };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r = Re(n, "#");
          (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) &&
            (n = r.trim());
        }
        return {
          type: "heading",
          raw: Re(
            t[0],
            `
`,
          ),
          depth: t[1].length,
          text: n,
          tokens: this.lexer.inline(n),
        };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t)
        return {
          type: "hr",
          raw: Re(
            t[0],
            `
`,
          ),
        };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = Re(
            t[0],
            `
`,
          ).split(`
`),
          r = "",
          a = "",
          l = [];
        for (; n.length > 0; ) {
          let o = !1,
            i = [],
            u;
          for (u = 0; u < n.length; u++)
            if (this.rules.other.blockquoteStart.test(n[u])) (i.push(n[u]), (o = !0));
            else if (!o) i.push(n[u]);
            else break;
          n = n.slice(u);
          let s = i.join(`
`),
            c = s
              .replace(
                this.rules.other.blockquoteSetextReplace,
                `
    $1`,
              )
              .replace(this.rules.other.blockquoteSetextReplace2, "");
          ((r = r
            ? `${r}
${s}`
            : s),
            (a = a
              ? `${a}
${c}`
              : c));
          let d = this.lexer.state.top;
          if (
            ((this.lexer.state.top = !0),
            this.lexer.blockTokens(c, l, !0),
            (this.lexer.state.top = d),
            n.length === 0)
          )
            break;
          let f = l.at(-1);
          if (f?.type === "code") break;
          if (f?.type === "blockquote") {
            let v = f,
              p = n.join(`
`),
              y =
                v.raw +
                `
` +
                p.replace(this.rules.other.blockquoteSetextReplace2, ""),
              g = this.blockquote(y);
            l[l.length - 1] = g;
            let C = y.substring(g.raw.length).replace(/^\n/, ""),
              F = C
                ? C.split(`
`).length
                : 0,
              x = F ? n.slice(0, -F) : n;
            (x.length > 0 &&
              (r = `${r}
${x.join(`
`)}`),
              (a = a.substring(0, a.length - v.text.length) + g.text));
            break;
          } else if (f?.type === "list") {
            let v = f,
              p =
                v.raw +
                `
` +
                n.join(`
`),
              y = this.list(p);
            ((l[l.length - 1] = y),
              (r = r.substring(0, r.length - f.raw.length) + y.raw),
              (a = a.substring(0, a.length - v.raw.length) + y.raw),
              (n = p.substring(l.at(-1).raw.length).split(`
`)));
            continue;
          }
        }
        return { type: "blockquote", raw: r, tokens: l, text: a };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(),
          r = n.length > 1,
          a = {
            type: "list",
            raw: "",
            ordered: r,
            start: r ? +n.slice(0, -1) : "",
            loose: !1,
            items: [],
          };
        ((n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`),
          this.options.pedantic && (n = r ? n : "[*+-]"));
        let l = this.rules.other.listItemRegex(n),
          o = !1;
        for (; e; ) {
          let u = !1,
            s = "",
            c = "";
          if (!(t = l.exec(e)) || this.rules.block.hr.test(e)) break;
          ((s = t[0]), (e = e.substring(s.length)));
          let d = t[2].split(
              `
`,
              1,
            )[0],
            f = t[1].length,
            v = this.options.pedantic
              ? Wr(d, f)
              : d.replace(this.rules.other.leadingSpaceTab, (C) => Wr(C, f)),
            p = e.split(
              `
`,
              1,
            )[0],
            y = !v.trim(),
            g = 0;
          if (
            (this.options.pedantic
              ? ((g = 2), (c = v.trimStart()))
              : y
                ? (g = f + 1)
                : ((g = v.search(this.rules.other.nonSpaceChar)),
                  (g = g > 4 ? 1 : g),
                  (c = v.slice(g)),
                  (g += f)),
            y &&
              this.rules.other.blankLine.test(p) &&
              ((s +=
                p +
                `
`),
              (e = e.substring(p.length + 1)),
              (u = !0)),
            !u)
          ) {
            let C = this.rules.other.nextBulletRegex(g),
              F = this.rules.other.hrRegex(g),
              x = this.rules.other.fencesBeginRegex(g),
              I = this.rules.other.headingBeginRegex(g),
              Q = this.rules.other.htmlBeginRegex(g),
              J = this.rules.other.blockquoteBeginRegex(g);
            for (; e; ) {
              let ee = e.split(
                  `
`,
                  1,
                )[0],
                R;
              if (
                ((p = ee),
                this.options.pedantic
                  ? ((p = p.replace(this.rules.other.listReplaceNesting, "  ")), (R = p))
                  : (R = p.replace(this.rules.other.leadingSpaceTab, (le) =>
                      le.replace(this.rules.other.tabCharGlobal, "    "),
                    )),
                x.test(p) || I.test(p) || Q.test(p) || J.test(p) || C.test(p) || F.test(p))
              )
                break;
              if (R.search(this.rules.other.nonSpaceChar) >= g || !p.trim())
                c +=
                  `
` + R.slice(g);
              else {
                if (
                  y ||
                  v
                    .replace(this.rules.other.tabCharGlobal, "    ")
                    .search(this.rules.other.nonSpaceChar) >= 4 ||
                  x.test(v) ||
                  I.test(v) ||
                  F.test(v)
                )
                  break;
                c +=
                  `
` + p;
              }
              ((y = !p.trim()),
                (s +=
                  ee +
                  `
`),
                (e = e.substring(ee.length + 1)),
                (v = R.slice(g)));
            }
          }
          (a.loose || (o ? (a.loose = !0) : this.rules.other.doubleBlankLine.test(s) && (o = !0)),
            a.items.push({
              type: "list_item",
              raw: s,
              task: !!this.options.gfm && this.rules.other.listIsTask.test(c),
              loose: !1,
              text: c,
              tokens: [],
            }),
            (a.raw += s));
        }
        let i = a.items.at(-1);
        if (i) ((i.raw = i.raw.trimEnd()), (i.text = i.text.trimEnd()));
        else return;
        a.raw = a.raw.trimEnd();
        for (let u of a.items)
          if (
            ((this.lexer.state.top = !1), (u.tokens = this.lexer.blockTokens(u.text, [])), !a.loose)
          ) {
            let s = u.tokens.filter((d) => d.type === "space"),
              c = s.length > 0 && s.some((d) => this.rules.other.anyLine.test(d.raw));
            a.loose = c;
          }
        for (let u of a.items) {
          let s = u.tokens[0];
          if (u.task && (s?.type === "text" || s?.type === "paragraph")) {
            ((u.text = u.text.replace(this.rules.other.listReplaceTask, "")),
              (s.raw = s.raw.replace(this.rules.other.listReplaceTask, "")),
              (s.text = s.text.replace(this.rules.other.listReplaceTask, "")));
            for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--)
              if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
                this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(
                  this.rules.other.listReplaceTask,
                  "",
                );
                break;
              }
            let c = this.rules.other.listTaskCheckbox.exec(u.raw);
            if (c) {
              let d = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
              ((u.checked = d.checked),
                a.loose
                  ? u.tokens[0] &&
                    ["paragraph", "text"].includes(u.tokens[0].type) &&
                    "tokens" in u.tokens[0] &&
                    u.tokens[0].tokens
                    ? ((u.tokens[0].raw = d.raw + u.tokens[0].raw),
                      (u.tokens[0].text = d.raw + u.tokens[0].text),
                      u.tokens[0].tokens.unshift(d))
                    : u.tokens.unshift({ type: "paragraph", raw: d.raw, text: d.raw, tokens: [d] })
                  : u.tokens.unshift(d));
            }
          } else u.task && (u.task = !1);
        }
        if (a.loose)
          for (let u of a.items) {
            u.loose = !0;
            for (let s of u.tokens) s.type === "text" && (s.type = "paragraph");
          }
        return a;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) {
        let n = Vr(t[0]);
        return {
          type: "html",
          block: !0,
          raw: n,
          pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
          text: n,
        };
      }
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        if (!this.rules.other.startAngleBracket.test(t[2]) && Hr(t[2], "()") !== -1) return;
        let n = _t(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
          r = t[2]
            ? t[2]
                .replace(this.rules.other.hrefBrackets, "$1")
                .replace(this.rules.inline.anyPunctuation, "$1")
            : "",
          a = t[3]
            ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1")
            : t[3];
        return {
          type: "def",
          tag: n,
          raw: Re(
            t[0],
            `
`,
          ),
          href: r,
          title: a,
        };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = Br(t[1]),
        r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
        a = t[3]?.trim()
          ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`)
          : [],
        l = {
          type: "table",
          raw: Re(
            t[0],
            `
`,
          ),
          header: [],
          align: [],
          rows: [],
        };
      if (n.length === r.length) {
        for (let o of r)
          this.rules.other.tableAlignRight.test(o)
            ? l.align.push("right")
            : this.rules.other.tableAlignCenter.test(o)
              ? l.align.push("center")
              : this.rules.other.tableAlignLeft.test(o)
                ? l.align.push("left")
                : l.align.push(null);
        for (let o = 0; o < n.length; o++)
          l.header.push({
            text: n[o],
            tokens: this.lexer.inline(n[o]),
            header: !0,
            align: l.align[o],
          });
        for (let o of a)
          l.rows.push(
            Br(o, l.header.length).map((i, u) => ({
              text: i,
              tokens: this.lexer.inline(i),
              header: !1,
              align: l.align[u],
            })),
          );
        return l;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) {
        let n = t[1].trim();
        return {
          type: "heading",
          raw: Re(
            t[0],
            `
`,
          ),
          depth: t[2].charAt(0) === "=" ? 1 : 2,
          text: n,
          tokens: this.lexer.inline(n),
        };
      }
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n =
          t[1].charAt(t[1].length - 1) ===
          `
`
            ? t[1].slice(0, -1)
            : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t)
        return (
          !this.lexer.state.inLink && this.rules.other.startATag.test(t[0])
            ? (this.lexer.state.inLink = !0)
            : this.lexer.state.inLink &&
              this.rules.other.endATag.test(t[0]) &&
              (this.lexer.state.inLink = !1),
          !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0])
            ? (this.lexer.state.inRawBlock = !0)
            : this.lexer.state.inRawBlock &&
              this.rules.other.endPreScriptTag.test(t[0]) &&
              (this.lexer.state.inRawBlock = !1),
          {
            type: "html",
            raw: t[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            block: !1,
            text: t[0],
          }
        );
    }
    link(e) {
      if (this.lexer.state.linkParenPossible === !1) return;
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && Gr(e, t[1], n, this.rules)) return;
        let r = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
          if (!this.rules.other.endAngleBracket.test(r)) return;
          let o = Re(r.slice(0, -1), "\\");
          if ((r.length - o.length) % 2 === 0) return;
        } else {
          let o = Hr(t[2], "()");
          if (o === -2) return;
          if (o > -1) {
            let i = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + o;
            ((t[2] = t[2].substring(0, o)), (t[0] = t[0].substring(0, i).trim()), (t[3] = ""));
          }
        }
        let a = t[2],
          l = "";
        if (this.options.pedantic) {
          let o = this.rules.other.pedanticHrefTitle.exec(a);
          o && ((a = o[1]), (l = o[3]));
        } else l = t[3] ? t[3].slice(1, -1) : "";
        return (
          (a = a.trim()),
          this.rules.other.startAngleBracket.test(a) &&
            (this.options.pedantic && !this.rules.other.endAngleBracket.test(r)
              ? (a = a.slice(1))
              : (a = a.slice(1, -1))),
          qr(
            t,
            {
              href: a && a.replace(this.rules.inline.anyPunctuation, "$1"),
              title: l && l.replace(this.rules.inline.anyPunctuation, "$1"),
            },
            t[0],
            this.lexer,
            this.rules,
          )
        );
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r = n[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && Gr(e, n[1], r, this.rules)) return;
        let a = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
          l = t[_t(a)];
        if (!l) {
          let o = n[0].charAt(0);
          return { type: "text", raw: o, text: o };
        }
        return qr(n, l, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (
        !(
          !r ||
          (!r[1] && !r[2] && !r[3] && !r[4]) ||
          (r[4] && n.match(this.rules.other.unicodeAlphaNumeric))
        ) &&
        (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))
      ) {
        let a = [...r[0]].length - 1,
          l,
          o,
          i = a,
          u = 0,
          s = r[0][0],
          c = n === s,
          d = s === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (d.lastIndex = 0, t = t.slice(-1 * e.length + a); (r = d.exec(t)) !== null; ) {
          if (((l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !l)) continue;
          if (((o = [...l].length), r[3] || r[4])) {
            i += o;
            continue;
          } else if (r[5] || r[6]) {
            if (a % 3 && !((a + o) % 3)) {
              u += o;
              continue;
            }
            if (c) break;
          }
          if (((i -= o), i > 0)) continue;
          o = Math.min(o, o + i + u);
          let f = [...r[0]][0].length,
            v = e.slice(0, a + r.index + f + o);
          if (Math.min(a, o) % 2) {
            let y = v.slice(1, -1);
            return { type: "em", raw: v, text: y, tokens: this.lexer.inlineTokens(y) };
          }
          let p = v.slice(2, -2);
          return { type: "strong", raw: v, text: p, tokens: this.lexer.inlineTokens(p) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "),
          r = this.rules.other.nonSpaceChar.test(n),
          a =
            this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return (
          r && a && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n }
        );
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e, t, n = "") {
      let r = this.rules.inline.delLDelim.exec(e);
      if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
        let a = [...r[0]].length - 1,
          l,
          o,
          i = a,
          u = this.rules.inline.delRDelim;
        for (u.lastIndex = 0, t = t.slice(-1 * e.length + a); (r = u.exec(t)) !== null; ) {
          if (
            ((l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]),
            !l || ((o = [...l].length), o !== a))
          )
            continue;
          if (r[3] || r[4]) {
            i += o;
            continue;
          }
          if (((i -= o), i > 0)) continue;
          o = Math.min(o, o + i);
          let s = [...r[0]][0].length,
            c = e.slice(0, a + r.index + s + o),
            d = c.slice(a, -a);
          return { type: "del", raw: c, text: d, tokens: this.lexer.inlineTokens(d) };
        }
      }
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r;
        return (
          t[2] === "@" ? ((n = t[1]), (r = "mailto:" + n)) : ((n = t[1]), (r = n)),
          {
            type: "link",
            raw: t[0],
            text: n,
            href: r,
            autolink: !0,
            tokens: [{ type: "text", raw: n, text: n }],
          }
        );
      }
    }
    url(e) {
      let t;
      if ((t = this.rules.inline.url.exec(e))) {
        let n, r;
        if (t[2] === "@") ((n = t[0]), (r = "mailto:" + n));
        else {
          let a;
          do ((a = t[0]), (t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? ""));
          while (a !== t[0]);
          ((n = t[0]), t[1] === "www." ? (r = "http://" + t[0]) : (r = t[0]));
        }
        return {
          type: "link",
          raw: t[0],
          text: n,
          href: r,
          autolink: !0,
          tokens: [{ type: "text", raw: n, text: n }],
        };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: n ? t[0] : Di(t[0]), escaped: n };
      }
    }
  },
  ve = class un {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(t) {
      ((this.tokens = []),
        (this.tokens.links = Object.create(null)),
        (this.options = t || Ne),
        (this.options.tokenizer = this.options.tokenizer || new Ot()),
        (this.tokenizer = this.options.tokenizer),
        (this.tokenizer.options = this.options),
        (this.tokenizer.lexer = this),
        (this.inlineQueue = []),
        (this.state = {
          inLink: !1,
          inRawBlock: !1,
          linkEmitted: !1,
          linkParenPossible: !0,
          top: !0,
        }));
      let n = { other: ae, block: Pt.normal, inline: ut.normal };
      (this.options.pedantic
        ? ((n.block = Pt.pedantic), (n.inline = ut.pedantic))
        : this.options.gfm &&
          ((n.block = Pt.gfm), this.options.breaks ? (n.inline = ut.breaks) : (n.inline = ut.gfm)),
        (this.tokenizer.rules = n));
    }
    static get rules() {
      return { block: Pt, inline: ut };
    }
    static lex(t, n) {
      return new un(n).lex(t);
    }
    static lexInline(t, n) {
      return new un(n).inlineTokens(t);
    }
    lex(t) {
      ((t = t.replace(
        ae.carriageReturn,
        `
`,
      )),
        this.blockTokens(t, this.tokens));
      for (let n = 0; n < this.inlineQueue.length; n++) {
        let r = this.inlineQueue[n];
        this.inlineTokens(r.src, r.tokens);
      }
      return ((this.inlineQueue = []), this.tokens);
    }
    blockTokens(t, n = [], r = !1) {
      ((this.tokenizer.lexer = this),
        this.options.pedantic &&
          (t = t.replace(ae.tabCharGlobal, "    ").replace(ae.spaceLine, "")));
      let a = 1 / 0;
      for (; t; ) {
        if (t.length < a) a = t.length;
        else {
          this.infiniteLoopError(t.charCodeAt(0));
          break;
        }
        let l;
        if (
          this.options.extensions?.block?.some((i) =>
            (l = i.call({ lexer: this }, t, n))
              ? ((t = t.substring(l.raw.length)), n.push(l), !0)
              : !1,
          )
        )
          continue;
        if ((l = this.tokenizer.space(t))) {
          t = t.substring(l.raw.length);
          let i = n.at(-1);
          l.raw.length === 1 && i !== void 0
            ? (i.raw += `
`)
            : n.push(l);
          continue;
        }
        if ((l = this.tokenizer.code(t))) {
          t = t.substring(l.raw.length);
          let i = n.at(-1);
          i?.type === "paragraph" || i?.type === "text"
            ? ((i.raw +=
                (i.raw.endsWith(`
`)
                  ? ""
                  : `
`) + l.raw),
              (i.text +=
                `
` + l.text),
              (this.inlineQueue.at(-1).src = i.text))
            : n.push(l);
          continue;
        }
        if ((l = this.tokenizer.fences(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.heading(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.hr(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.blockquote(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.list(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.html(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.def(t))) {
          t = t.substring(l.raw.length);
          let i = n.at(-1);
          i?.type === "paragraph" || i?.type === "text"
            ? ((i.raw +=
                (i.raw.endsWith(`
`)
                  ? ""
                  : `
`) + l.raw),
              (i.text +=
                `
` + l.raw),
              (this.inlineQueue.at(-1).src = i.text))
            : this.tokens.links[l.tag] ||
              ((this.tokens.links[l.tag] = { href: l.href, title: l.title }), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.table(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        if ((l = this.tokenizer.lheading(t))) {
          ((t = t.substring(l.raw.length)), n.push(l));
          continue;
        }
        let o = t;
        if (this.options.extensions?.startBlock) {
          let i = 1 / 0,
            u = t.slice(1),
            s;
          (this.options.extensions.startBlock.forEach((c) => {
            ((s = c.call({ lexer: this }, u)),
              typeof s == "number" && s >= 0 && (i = Math.min(i, s)));
          }),
            i < 1 / 0 && i >= 0 && (o = t.substring(0, i + 1)));
        }
        if (this.state.top && (l = this.tokenizer.paragraph(o))) {
          let i = n.at(-1);
          (r && i?.type === "paragraph"
            ? ((i.raw +=
                (i.raw.endsWith(`
`)
                  ? ""
                  : `
`) + l.raw),
              (i.text +=
                `
` + l.text),
              this.inlineQueue.pop(),
              (this.inlineQueue.at(-1).src = i.text))
            : n.push(l),
            (r = o.length !== t.length),
            (t = t.substring(l.raw.length)));
          continue;
        }
        if ((l = this.tokenizer.text(t))) {
          t = t.substring(l.raw.length);
          let i = n.at(-1);
          i?.type === "text"
            ? ((i.raw +=
                (i.raw.endsWith(`
`)
                  ? ""
                  : `
`) + l.raw),
              (i.text +=
                `
` + l.text),
              this.inlineQueue.pop(),
              (this.inlineQueue.at(-1).src = i.text))
            : n.push(l);
          continue;
        }
        if (t) {
          this.infiniteLoopError(t.charCodeAt(0));
          break;
        }
      }
      return ((this.state.top = !0), n);
    }
    inline(t, n = []) {
      return (this.inlineQueue.push({ src: t, tokens: n }), n);
    }
    linkInText(t) {
      if (!t.includes("[")) return !1;
      let n = this.tokenizer.rules.inline.link;
      for (let r of t.matchAll(this.tokenizer.rules.inline.blockSkip))
        if (n.test(r[0]) && t.charAt(r.index - 1) !== "!") return !0;
      for (let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
        let a = r[0],
          l = a.lastIndexOf("[");
        if (
          !(a.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, _t(a.slice(l + 1, -1)))) &&
          !(l > 1 && this.linkInText(a.slice(1, l - 1)))
        )
          return !0;
      }
      return !1;
    }
    inlineTokens(t, n = []) {
      this.tokenizer.lexer = this;
      let r = this.state.linkParenPossible;
      this.state.linkParenPossible = r && t.includes(")");
      try {
        return this.#e(t, n);
      } finally {
        this.state.linkParenPossible = r;
      }
    }
    #e(t, n) {
      let r = t;
      if (this.tokens.links && t.includes("[")) {
        let i = this.tokenizer.rules.inline.reflinkSearch,
          u = (s) => {
            let c = s.lastIndexOf("[");
            if (!Object.hasOwn(this.tokens.links, _t(s.slice(c + 1, -1)))) return s;
            if (c > 1 && s.charAt(0) !== "!") {
              let d = s.slice(1, c - 1);
              if (this.linkInText(d))
                return "[" + d.replace(i, u) + "][" + "a".repeat(s.length - c - 2) + "]";
            }
            return "[" + "a".repeat(s.length - 2) + "]";
          };
        r = r.replace(i, u);
      }
      ((r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (i) => "+".repeat(i.length))),
        (r = r.replace(this.tokenizer.rules.inline.blockSkip, (i, u, s) => {
          let c = s ? s.length : 0;
          return i.slice(0, c) + "[" + "a".repeat(i.length - c - 2) + "]";
        })),
        (r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r));
      let a = !1,
        l = "",
        o = 1 / 0;
      for (; t; ) {
        if (t.length < o) o = t.length;
        else {
          this.infiniteLoopError(t.charCodeAt(0));
          break;
        }
        (a || (l = ""), (a = !1));
        let i;
        if (
          this.options.extensions?.inline?.some((s) =>
            (i = s.call({ lexer: this }, t, n))
              ? ((t = t.substring(i.raw.length)), n.push(i), !0)
              : !1,
          )
        )
          continue;
        if ((i = this.tokenizer.escape(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.tag(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.link(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.reflink(t, this.tokens.links))) {
          t = t.substring(i.raw.length);
          let s = n.at(-1);
          i.type === "text" && s?.type === "text"
            ? ((s.raw += i.raw), (s.text += i.text))
            : n.push(i);
          continue;
        }
        if ((i = this.tokenizer.emStrong(t, r, l))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.codespan(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.br(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.del(t, r, l))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if ((i = this.tokenizer.autolink(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        if (!this.state.inLink && (i = this.tokenizer.url(t))) {
          ((t = t.substring(i.raw.length)), n.push(i));
          continue;
        }
        let u = t;
        if (this.options.extensions?.startInline) {
          let s = 1 / 0,
            c = t.slice(1),
            d;
          (this.options.extensions.startInline.forEach((f) => {
            ((d = f.call({ lexer: this }, c)),
              typeof d == "number" && d >= 0 && (s = Math.min(s, d)));
          }),
            s < 1 / 0 && s >= 0 && (u = t.substring(0, s + 1)));
        }
        if ((i = this.tokenizer.inlineText(u))) {
          ((t = t.substring(i.raw.length)),
            i.raw.slice(-1) !== "_" && (l = i.raw.slice(-1)),
            (a = !0));
          let s = n.at(-1);
          s?.type === "text" ? ((s.raw += i.raw), (s.text += i.text)) : n.push(i);
          continue;
        }
        if (t) {
          this.infiniteLoopError(t.charCodeAt(0));
          break;
        }
      }
      return n;
    }
    infiniteLoopError(t) {
      let n = "Infinite loop on byte: " + t;
      if (this.options.silent) console.error(n);
      else throw new Error(n);
    }
  },
  Mt = class {
    options;
    parser;
    constructor(e) {
      this.options = e || Ne;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let r = (t || "").match(ae.notSpaceStart)?.[0],
        a = e
          ? e.replace(ae.endingNewline, "") +
            `
`
          : "";
      return r
        ? '<pre><code class="language-' +
            ue(r) +
            '">' +
            (n ? a : ue(a, !0)) +
            `</code></pre>
`
        : "<pre><code>" +
            (n ? a : ue(a, !0)) +
            `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered,
        n = e.start,
        r = "";
      for (let o = 0; o < e.items.length; o++) {
        let i = e.items[o];
        r += this.listitem(i);
      }
      let a = t ? "ol" : "ul",
        l = t && n !== 1 ? ' start="' + n + '"' : "";
      return (
        "<" +
        a +
        l +
        `>
` +
        r +
        "</" +
        a +
        `>
`
      );
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "",
        n = "";
      for (let a = 0; a < e.header.length; a++) n += this.tablecell(e.header[a]);
      t += this.tablerow({ text: n });
      let r = "";
      for (let a = 0; a < e.rows.length; a++) {
        let l = e.rows[a];
        n = "";
        for (let o = 0; o < l.length; o++) n += this.tablecell(l[o]);
        r += this.tablerow({ text: n });
      }
      return (
        r && (r = `<tbody>${r}</tbody>`),
        `<table>
<thead>
` +
          t +
          `</thead>
` +
          r +
          `</table>
`
      );
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens),
        n = e.header ? "th" : "td";
      return (
        (e.align ? `<${n} align="${e.align}">` : `<${n}>`) +
        t +
        `</${n}>
`
      );
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${ue(e, !0)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, text: n, tokens: r, autolink: a }) {
      let l = a ? ue(n, !0) : this.parser.parseInline(r),
        o = Ur(e);
      if (o === null) return l;
      e = ue(o, a);
      let i = '<a href="' + e + '"';
      return (t && (i += ' title="' + ue(t) + '"'), (i += ">" + l + "</a>"), i);
    }
    image({ href: e, title: t, text: n, tokens: r }) {
      r && (n = this.parser.parseInline(r, this.parser.textRenderer));
      let a = Ur(e);
      if (a === null) return ue(n);
      e = a;
      let l = `<img src="${ue(e)}" alt="${ue(n)}"`;
      return (t && (l += ` title="${ue(t)}"`), (l += ">"), l);
    }
    text(e) {
      return "tokens" in e && e.tokens
        ? this.parser.parseInline(e.tokens)
        : "escaped" in e && e.escaped
          ? e.text
          : ue(e.text);
    }
  },
  yn = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  },
  pe = class cn {
    options;
    renderer;
    textRenderer;
    constructor(t) {
      ((this.options = t || Ne),
        (this.options.renderer = this.options.renderer || new Mt()),
        (this.renderer = this.options.renderer),
        (this.renderer.options = this.options),
        (this.renderer.parser = this),
        (this.textRenderer = new yn()));
    }
    static parse(t, n) {
      return new cn(n).parse(t);
    }
    static parseInline(t, n) {
      return new cn(n).parseInline(t);
    }
    parse(t) {
      this.renderer.parser = this;
      let n = "";
      for (let r = 0; r < t.length; r++) {
        let a = t[r];
        if (this.options.extensions?.renderers?.[a.type]) {
          let o = a,
            i = this.options.extensions.renderers[o.type].call({ parser: this }, o);
          if (
            i !== !1 ||
            ![
              "space",
              "hr",
              "heading",
              "code",
              "table",
              "blockquote",
              "list",
              "checkbox",
              "html",
              "def",
              "paragraph",
              "text",
            ].includes(o.type)
          ) {
            n += i || "";
            continue;
          }
        }
        let l = a;
        switch (l.type) {
          case "space": {
            n += this.renderer.space(l);
            break;
          }
          case "hr": {
            n += this.renderer.hr(l);
            break;
          }
          case "heading": {
            n += this.renderer.heading(l);
            break;
          }
          case "code": {
            n += this.renderer.code(l);
            break;
          }
          case "table": {
            n += this.renderer.table(l);
            break;
          }
          case "blockquote": {
            n += this.renderer.blockquote(l);
            break;
          }
          case "list": {
            n += this.renderer.list(l);
            break;
          }
          case "checkbox": {
            n += this.renderer.checkbox(l);
            break;
          }
          case "html": {
            n += this.renderer.html(l);
            break;
          }
          case "def": {
            n += this.renderer.def(l);
            break;
          }
          case "paragraph": {
            n += this.renderer.paragraph(l);
            break;
          }
          case "text": {
            n += this.renderer.text(l);
            break;
          }
          default: {
            let o = 'Token with "' + l.type + '" type was not found.';
            if (this.options.silent) return (console.error(o), "");
            throw new Error(o);
          }
        }
      }
      return n;
    }
    parseInline(t, n = this.renderer) {
      this.renderer.parser = this;
      let r = "";
      for (let a = 0; a < t.length; a++) {
        let l = t[a];
        if (this.options.extensions?.renderers?.[l.type]) {
          let i = this.options.extensions.renderers[l.type].call({ parser: this }, l);
          if (
            i !== !1 ||
            ![
              "escape",
              "html",
              "link",
              "image",
              "checkbox",
              "strong",
              "em",
              "codespan",
              "br",
              "del",
              "text",
            ].includes(l.type)
          ) {
            r += i || "";
            continue;
          }
        }
        let o = l;
        switch (o.type) {
          case "escape": {
            r += n.text(o);
            break;
          }
          case "html": {
            r += n.html(o);
            break;
          }
          case "link": {
            r += n.link(o);
            break;
          }
          case "image": {
            r += n.image(o);
            break;
          }
          case "checkbox": {
            r += n.checkbox(o);
            break;
          }
          case "strong": {
            r += n.strong(o);
            break;
          }
          case "em": {
            r += n.em(o);
            break;
          }
          case "codespan": {
            r += n.codespan(o);
            break;
          }
          case "br": {
            r += n.br(o);
            break;
          }
          case "del": {
            r += n.del(o);
            break;
          }
          case "text": {
            r += n.text(o);
            break;
          }
          default: {
            let i = 'Token with "' + o.type + '" type was not found.';
            if (this.options.silent) return (console.error(i), "");
            throw new Error(i);
          }
        }
      }
      return r;
    }
  },
  ct = class {
    options;
    block;
    constructor(e) {
      this.options = e || Ne;
    }
    static passThroughHooks = new Set([
      "preprocess",
      "postprocess",
      "processAllTokens",
      "emStrongMask",
    ]);
    static passThroughHooksRespectAsync = new Set([
      "preprocess",
      "postprocess",
      "processAllTokens",
    ]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer(e = this.block) {
      return e ? ve.lex : ve.lexInline;
    }
    provideParser(e = this.block) {
      return e ? pe.parse : pe.parseInline;
    }
  },
  wn = class {
    defaults = dn();
    options = this.setOptions;
    parse = this.parseMarkdown(!0);
    parseInline = this.parseMarkdown(!1);
    Parser = pe;
    Renderer = Mt;
    TextRenderer = yn;
    Lexer = ve;
    Tokenizer = Ot;
    Hooks = ct;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let r of e)
        switch (((n = n.concat(t.call(this, r))), r.type)) {
          case "table": {
            let a = r;
            for (let l of a.header) n = n.concat(this.walkTokens(l.tokens, t));
            for (let l of a.rows) for (let o of l) n = n.concat(this.walkTokens(o.tokens, t));
            break;
          }
          case "list": {
            let a = r;
            n = n.concat(this.walkTokens(a.items, t));
            break;
          }
          default: {
            let a = r;
            this.defaults.extensions?.childTokens?.[a.type]
              ? this.defaults.extensions.childTokens[a.type].forEach((l) => {
                  let o = a[l].flat(1 / 0);
                  n = n.concat(this.walkTokens(o, t));
                })
              : a.tokens && (n = n.concat(this.walkTokens(a.tokens, t)));
          }
        }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return (
        e.forEach((n) => {
          let r = { ...n };
          if (
            ((r.async = this.defaults.async || r.async || !1),
            n.extensions &&
              (n.extensions.forEach((a) => {
                if (!a.name) throw new Error("extension name required");
                if ("renderer" in a) {
                  let l = t.renderers[a.name];
                  l
                    ? (t.renderers[a.name] = function (...o) {
                        let i = a.renderer.apply(this, o);
                        return (i === !1 && (i = l.apply(this, o)), i);
                      })
                    : (t.renderers[a.name] = a.renderer);
                }
                if ("tokenizer" in a) {
                  if (!a.level || (a.level !== "block" && a.level !== "inline"))
                    throw new Error("extension level must be 'block' or 'inline'");
                  let l = t[a.level];
                  (l ? l.unshift(a.tokenizer) : (t[a.level] = [a.tokenizer]),
                    a.start &&
                      (a.level === "block"
                        ? t.startBlock
                          ? t.startBlock.push(a.start)
                          : (t.startBlock = [a.start])
                        : a.level === "inline" &&
                          (t.startInline
                            ? t.startInline.push(a.start)
                            : (t.startInline = [a.start]))));
                }
                "childTokens" in a && a.childTokens && (t.childTokens[a.name] = a.childTokens);
              }),
              (r.extensions = t)),
            n.renderer)
          ) {
            let a = this.defaults.renderer || new Mt(this.defaults);
            for (let l in n.renderer) {
              if (!(l in a)) throw new Error(`renderer '${l}' does not exist`);
              if (["options", "parser"].includes(l)) continue;
              let o = l,
                i = n.renderer[o],
                u = a[o];
              a[o] = (...s) => {
                let c = i.apply(a, s);
                return (c === !1 && (c = u.apply(a, s)), c || "");
              };
            }
            r.renderer = a;
          }
          if (n.tokenizer) {
            let a = this.defaults.tokenizer || new Ot(this.defaults);
            for (let l in n.tokenizer) {
              if (!(l in a)) throw new Error(`tokenizer '${l}' does not exist`);
              if (["options", "rules", "lexer"].includes(l)) continue;
              let o = l,
                i = n.tokenizer[o],
                u = a[o];
              a[o] = (...s) => {
                let c = i.apply(a, s);
                return (c === !1 && (c = u.apply(a, s)), c);
              };
            }
            r.tokenizer = a;
          }
          if (n.hooks) {
            let a = this.defaults.hooks || new ct();
            for (let l in n.hooks) {
              if (!(l in a)) throw new Error(`hook '${l}' does not exist`);
              if (["options", "block"].includes(l)) continue;
              let o = l,
                i = n.hooks[o],
                u = a[o];
              ct.passThroughHooks.has(l)
                ? (a[o] = (s) => {
                    if (this.defaults.async && ct.passThroughHooksRespectAsync.has(l))
                      return (async () => {
                        let d = await i.call(a, s);
                        return u.call(a, d);
                      })();
                    let c = i.call(a, s);
                    return u.call(a, c);
                  })
                : (a[o] = (...s) => {
                    if (this.defaults.async)
                      return (async () => {
                        let d = await i.apply(a, s);
                        return (d === !1 && (d = await u.apply(a, s)), d);
                      })();
                    let c = i.apply(a, s);
                    return (c === !1 && (c = u.apply(a, s)), c);
                  });
            }
            r.hooks = a;
          }
          if (n.walkTokens) {
            let a = this.defaults.walkTokens,
              l = n.walkTokens;
            r.walkTokens = function (o) {
              let i = [];
              return (i.push(l.call(this, o)), a && (i = i.concat(a.call(this, o))), i);
            };
          }
          this.defaults = { ...this.defaults, ...r };
        }),
        this
      );
    }
    setOptions(e) {
      return ((this.defaults = { ...this.defaults, ...e }), this);
    }
    lexer(e, t) {
      return ve.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return pe.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (t, n) => {
        let r = { ...n },
          a = { ...this.defaults, ...r },
          l = this.onError(!!a.silent, !!a.async);
        if (this.defaults.async === !0 && r.async === !1)
          return l(
            new Error(
              "marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.",
            ),
          );
        if (typeof t > "u" || t === null)
          return l(new Error("marked(): input parameter is undefined or null"));
        if (typeof t != "string")
          return l(
            new Error(
              "marked(): input parameter is of type " +
                Object.prototype.toString.call(t) +
                ", string expected",
            ),
          );
        if ((a.hooks && ((a.hooks.options = a), (a.hooks.block = e)), a.async))
          return (async () => {
            let o = a.hooks ? await a.hooks.preprocess(t) : t,
              i = await (a.hooks ? await a.hooks.provideLexer(e) : e ? ve.lex : ve.lexInline)(o, a),
              u = a.hooks ? await a.hooks.processAllTokens(i) : i;
            a.walkTokens && (await Promise.all(this.walkTokens(u, a.walkTokens)));
            let s = await (
              a.hooks ? await a.hooks.provideParser(e) : e ? pe.parse : pe.parseInline
            )(u, a);
            return a.hooks ? await a.hooks.postprocess(s) : s;
          })().catch(l);
        try {
          a.hooks && (t = a.hooks.preprocess(t));
          let o = (a.hooks ? a.hooks.provideLexer(e) : e ? ve.lex : ve.lexInline)(t, a);
          (a.hooks && (o = a.hooks.processAllTokens(o)),
            a.walkTokens && this.walkTokens(o, a.walkTokens));
          let i = (a.hooks ? a.hooks.provideParser(e) : e ? pe.parse : pe.parseInline)(o, a);
          return (a.hooks && (i = a.hooks.postprocess(i)), i);
        } catch (o) {
          return l(o);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (
          ((n.message += `
Please report this to https://github.com/markedjs/marked.`),
          e)
        ) {
          let r = "<p>An error occurred:</p><pre>" + ue(n.message + "", !0) + "</pre>";
          return t ? Promise.resolve(r) : r;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  },
  je = new wn();
function U(e, t) {
  return je.parse(e, t);
}
U.options = U.setOptions = function (e) {
  return (je.setOptions(e), (U.defaults = je.defaults), Yr(U.defaults), U);
};
U.getDefaults = dn;
U.defaults = Ne;
function ji(...e) {
  return (je.use(...e), (U.defaults = je.defaults), Yr(U.defaults), U);
}
U.use = ji;
U.walkTokens = function (e, t) {
  return je.walkTokens(e, t);
};
U.parseInline = je.parseInline;
U.Parser = pe;
U.parser = pe.parse;
U.Renderer = Mt;
U.TextRenderer = yn;
U.Lexer = ve;
U.lexer = ve.lex;
U.Tokenizer = Ot;
U.Hooks = ct;
U.parse = U;
var Qc = U.options,
  Jc = U.setOptions,
  ed = U.walkTokens,
  td = U.parseInline;
var nd = pe.parse,
  rd = ve.lex;
B();
function oa(e) {
  if ((typeof e == "function" && (e = { highlight: e }), !e || typeof e.highlight != "function"))
    throw new Error("Must provide highlight function");
  return (
    typeof e.langPrefix != "string" && (e.langPrefix = "language-"),
    typeof e.emptyLangClass != "string" && (e.emptyLangClass = ""),
    {
      async: !!e.async,
      walkTokens(t) {
        if (t.type !== "code") return;
        let n = ra(t.lang);
        if (e.async) return Promise.resolve(e.highlight(t.text, n, t.lang || "")).then(aa(t));
        let r = e.highlight(t.text, n, t.lang || "");
        if (r instanceof Promise)
          throw new Error(
            "markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.",
          );
        aa(t)(r);
      },
      useNewRenderer: !0,
      renderer: {
        code(t, n, r) {
          typeof t == "object" && ((r = t.escaped), (n = t.lang), (t = t.text));
          let a = ra(n),
            l = a ? e.langPrefix + ia(a) : e.emptyLangClass,
            o = l ? ` class="${l}"` : "";
          return (
            (t = t.replace(/\n$/, "")),
            `<pre><code${o}>${r ? t : ia(t, !0)}
</code></pre>`
          );
        },
      },
    }
  );
}
function ra(e) {
  return (e || "").match(/\S*/)[0];
}
function aa(e) {
  return (t) => {
    typeof t == "string" && t !== e.text && ((e.escaped = !0), (e.text = t));
  };
}
var sa = /[&<>"']/,
  Ni = new RegExp(sa.source, "g"),
  ua = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  Ui = new RegExp(ua.source, "g"),
  Bi = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
  la = (e) => Bi[e];
function ia(e, t) {
  if (t) {
    if (sa.test(e)) return e.replace(Ni, la);
  } else if (ua.test(e)) return e.replace(Ui, la);
  return e;
}
var Oa = ll(va(), 1);
B();
var ht = new Map();
function Yi(e) {
  var t = ht.get(e);
  t && t.destroy();
}
function Zi(e) {
  var t = ht.get(e);
  t && t.update();
}
var pt = null;
typeof window > "u"
  ? (((pt = function (e) {
      return e;
    }).destroy = function (e) {
      return e;
    }),
    (pt.update = function (e) {
      return e;
    }))
  : (((pt = function (e, t) {
      return (
        e &&
          Array.prototype.forEach.call(e.length ? e : [e], function (n) {
            return (function (r) {
              if (r && r.nodeName && r.nodeName === "TEXTAREA" && !ht.has(r)) {
                var a,
                  l = null,
                  o = window.getComputedStyle(r),
                  i =
                    ((a = r.value),
                    function () {
                      (s({
                        testForHeightReduction: a === "" || !r.value.startsWith(a),
                        restoreTextAlign: null,
                      }),
                        (a = r.value));
                    }),
                  u = function (d) {
                    (r.removeEventListener("autosize:destroy", u),
                      r.removeEventListener("autosize:update", c),
                      r.removeEventListener("input", i),
                      window.removeEventListener("resize", c),
                      Object.keys(d).forEach(function (f) {
                        return (r.style[f] = d[f]);
                      }),
                      ht.delete(r));
                  }.bind(r, {
                    height: r.style.height,
                    resize: r.style.resize,
                    textAlign: r.style.textAlign,
                    overflowY: r.style.overflowY,
                    overflowX: r.style.overflowX,
                    wordWrap: r.style.wordWrap,
                  });
                (r.addEventListener("autosize:destroy", u),
                  r.addEventListener("autosize:update", c),
                  r.addEventListener("input", i),
                  window.addEventListener("resize", c),
                  (r.style.overflowX = "hidden"),
                  (r.style.wordWrap = "break-word"),
                  ht.set(r, { destroy: u, update: c }),
                  c());
              }
              function s(d) {
                var f,
                  v,
                  p = d.restoreTextAlign,
                  y = p === void 0 ? null : p,
                  g = d.testForHeightReduction,
                  C = g === void 0 || g,
                  F = o.overflowY;
                if (
                  r.scrollHeight !== 0 &&
                  (o.resize === "vertical"
                    ? (r.style.resize = "none")
                    : o.resize === "both" && (r.style.resize = "horizontal"),
                  C &&
                    ((f = (function (I) {
                      for (var Q = []; I && I.parentNode && I.parentNode instanceof Element; )
                        (I.parentNode.scrollTop && Q.push([I.parentNode, I.parentNode.scrollTop]),
                          (I = I.parentNode));
                      return function () {
                        return Q.forEach(function (J) {
                          var ee = J[0],
                            R = J[1];
                          ((ee.style.scrollBehavior = "auto"),
                            (ee.scrollTop = R),
                            (ee.style.scrollBehavior = null));
                        });
                      };
                    })(r)),
                    (r.style.height = "")),
                  (v =
                    o.boxSizing === "content-box"
                      ? r.scrollHeight - (parseFloat(o.paddingTop) + parseFloat(o.paddingBottom))
                      : r.scrollHeight +
                        parseFloat(o.borderTopWidth) +
                        parseFloat(o.borderBottomWidth)),
                  o.maxHeight !== "none" && v > parseFloat(o.maxHeight)
                    ? (o.overflowY === "hidden" && (r.style.overflow = "scroll"),
                      (v = parseFloat(o.maxHeight)))
                    : o.overflowY !== "hidden" && (r.style.overflow = "hidden"),
                  (r.style.height = v + "px"),
                  y && (r.style.textAlign = y),
                  f && f(),
                  l !== v &&
                    (r.dispatchEvent(new Event("autosize:resized", { bubbles: !0 })), (l = v)),
                  F !== o.overflow && !y)
                ) {
                  var x = o.textAlign;
                  (o.overflow === "hidden" && (r.style.textAlign = x === "start" ? "end" : "start"),
                    s({ restoreTextAlign: x, testForHeightReduction: !0 }));
                }
              }
              function c() {
                s({ testForHeightReduction: !0, restoreTextAlign: null });
              }
            })(n);
          }),
        e
      );
    }).destroy = function (e) {
      return (e && Array.prototype.forEach.call(e.length ? e : [e], Yi), e);
    }),
    (pt.update = function (e) {
      return (e && Array.prototype.forEach.call(e.length ? e : [e], Zi), e);
    }));
var Ki = pt,
  xn = Ki;
var Xi = new Set(["nick", "mail", "link"]),
  pa = (e) => e.filter((t) => Xi.has(t)),
  ha = ["//unpkg.com/@waline/emojis@1.1.0/weibo"],
  Qi = [
    "//unpkg.com/@waline/emojis/tieba/tieba_agree.png",
    "//unpkg.com/@waline/emojis/tieba/tieba_look_down.png",
    "//unpkg.com/@waline/emojis/tieba/tieba_sunglasses.png",
    "//unpkg.com/@waline/emojis/tieba/tieba_pick_nose.png",
    "//unpkg.com/@waline/emojis/tieba/tieba_awkward.png",
    "//unpkg.com/@waline/emojis/tieba/tieba_sleep.png",
  ],
  Ji = (e) =>
    new Promise((t, n) => {
      if (e.size > 128e3) {
        n(Error("File too large! File size limit 128KB"));
        return;
      }
      let r = new FileReader();
      (r.readAsDataURL(e),
        r.addEventListener("load", () => {
          t(r.result);
        }),
        r.addEventListener("error", n));
    }),
  eo = (e, t) => xr(t, e),
  to = (e) => {
    let t = (n, r = {}) =>
      fetch(
        `https://api.giphy.com/v1/gifs/${n}?${new URLSearchParams({ lang: e, limit: "20", rating: "g", api_key: "6CIMLkNMMOhRcXPoMCPkFy4Ybk2XUiMp", ...r }).toString()}`,
      )
        .then((a) => a.json())
        .then(({ data: a }) =>
          a.map((l) => ({ title: l.title, src: l.images.downsized_medium.url })),
        );
    return {
      search: (n) => t("search", { q: n, offset: "0" }),
      default: () => t("trending", {}),
      more: (n, r = 0) => t("search", { q: n, offset: r.toString() }),
    };
  },
  no = RegExp(
    "([\\u4E00-\\u9FFF\\u3400-\\u4DBF\\uF900-\\uFAFF\\u3040-\\u309F\\uAC00-\\uD7AF\\u0400-\\u04FF]+|\\w+|<)|((?:(?:^|\\s)\\/\\/(.+?)$)|(?:\\/\\*([\\S\\s]*?)\\*\\/))",
    "gmiu",
  ),
  ma = [
    "23AC69",
    "91C132",
    "F19726",
    "E8552D",
    "1AAB8E",
    "E1147F",
    "2980C1",
    "1BA1E6",
    "9FA0A0",
    "F19726",
    "E30B20",
    "E30B20",
    "A3338B",
  ],
  Sn = {},
  ro = (e) => {
    let t = 0;
    return e.replace(no, (n, r, a) => {
      if (a) return `<span style="color: slategray">${a}</span>`;
      if (r === "<") return "&lt;";
      let l;
      Sn[r] ? (l = Sn[r]) : ((l = ma[t]), (Sn[r] = l));
      let o = `<span style="color: #${l}">${r}</span>`;
      return ((t = ++t % ma.length), o);
    });
  },
  ao =
    "nick.nickError.mail.mailError.link.optional.placeholder.sofa.submit.like.cancelLike.reply.cancelReply.comment.refresh.more.preview.emoji.uploadImage.seconds.minutes.hours.days.now.uploading.login.logout.admin.sticky.word.wordHint.anonymous.level0.level1.level2.level3.level4.level5.gif.gifSearchPlaceholder.profile.approved.waiting.spam.unsticky.oldest.latest.hottest.reactionTitle.commentUnderReview.subPostComment.subSiteComment.subscribeToReplies".split(
      ".",
    ),
  ce = (e) => Object.fromEntries(e.map((t, n) => [ao[n], t])),
  lo = ce(
    "Benutzername,Der Benutzername darf nicht weniger als 3 Bytes umfassen.,E-Mail,Bitte best\xE4tigen Sie Ihre E-Mail-Adresse.,Webseite,Optional,Kommentieren Sie hier...,Noch keine Kommentare.,Senden,Gef\xE4llt mir,Gef\xE4llt mir nicht mehr,Antworten,Antwort abbrechen,Kommentare,Aktualisieren,Mehr laden...,Vorschau,Emoji,Ein Bild hochladen,Vor einigen Sekunden,Vor einigen Minuten,Vor einigen Stunden,Vor einigen Tagen,Gerade eben,Hochladen l\xE4uft,Anmelden,Abmelden,Admin,Angeheftet,W\xF6rter,Bitte geben Sie Kommentare zwischen $0 und $1 W\xF6rtern ein! Aktuelle Anzahl der W\xF6rter: $2,Anonym,Zwerge,Hobbits,Ents,Magier,Elfen,Ma\xEFar,GIF,Nach einem GIF suchen,Profil,Genehmigt,Ausstehend,Spam,L\xF6sen,\xC4lteste,Neueste,Am beliebtesten,Was denken Sie?,Ihr Kommentar wird \xFCberpr\xFCft und ist derzeit nur f\xFCr Sie sichtbar. Nach der Genehmigung wird er \xF6ffentlich angezeigt.,Abonnieren Sie die Kommentare zu diesem Beitrag,Abonnieren Sie die Kommentare auf dieser Seite,Abonnieren Sie die Antworten auf Ihre Kommentare".split(
      ",",
    ),
  ),
  ga = ce(
    `NickName,NickName cannot be less than 3 bytes.,E-Mail,Please confirm your email address.,Website,Optional,Comment here...,No comment yet.,Submit,Like,Cancel like,Reply,Cancel reply,Comments,Refresh,Load More...,Preview,Emoji,Upload Image,seconds ago,minutes ago,hours ago,days ago,just now,Uploading,Login,logout,Admin,Sticky,Words,Please input comments between $0 and $1 words!
 Current word number: $2,Anonymous,Dwarves,Hobbits,Ents,Wizards,Elves,Maiar,GIF,Search GIF,Profile,Approved,Waiting,Spam,Unsticky,Oldest,Latest,Hottest,What do you think?,Your comment is under review and is currently only visible to you. It will be publicly visible after approval.,Subscribe to comments of this post,Subscribe to comments of this site,Subscribe to replies of your comments`.split(
      ",",
    ),
  ),
  ya = ce(
    `Nombre de usuario,El nombre de usuario no puede tener menos de 3 bytes.,Correo electr\xF3nico,Por favor confirma tu direcci\xF3n de correo electr\xF3nico.,Sitio web,Opcional,Comenta aqu\xED...,Sin comentarios todav\xEDa.,Enviar,Like,Anular like,Responder,Anular respuesta,Comentarios,Recargar,Cargar M\xE1s...,Previsualizar,Emoji,Subir Imagen,segundos atr\xE1s,minutos atr\xE1s,horas atr\xE1s,d\xEDas atr\xE1s,justo ahora,Subiendo,Iniciar sesi\xF3n,cerrar sesi\xF3n,Admin,Fijado,Palabras,Por favor escriba entre $0 y $1 palabras!
 El n\xFAmero actual de palabras: $2,An\xF3nimo,Enanos,Hobbits,Ents,Magos,Elfos,Maiar,GIF,Buscar GIF,Perfil,Aprobado,Esperando,Spam,Desfijar,M\xE1s antiguos,M\xE1s recientes,M\xE1s vistos,\xBFQu\xE9 piensas?,Tu comentario est\xE1 en revisi\xF3n y actualmente solo es visible para ti. Ser\xE1 visible p\xFAblicamente despu\xE9s de la aprobaci\xF3n.,Suscribirse a los comentarios de esta publicaci\xF3n,Suscribirse a los comentarios de este sitio,Suscribirse a las respuestas de tus comentarios`.split(
      ",",
    ),
  ),
  wa = ce(
    `Pseudo,Le pseudo ne peut pas faire moins de 3 octets.,E-mail,Veuillez confirmer votre adresse e-mail.,Site Web,Optionnel,Commentez ici...,Aucun commentaire pour l'instant.,Envoyer,J'aime,Annuler le j'aime,R\xE9pondre,Annuler la r\xE9ponse,Commentaires,Actualiser,Charger plus...,Aper\xE7u,Emoji,T\xE9l\xE9charger une image,Il y a quelques secondes,Il y a quelques minutes,Il y a quelques heures,Il y a quelques jours,\xC0 l'instant,T\xE9l\xE9chargement en cours,Connexion,D\xE9connexion,Admin,\xC9pingl\xE9,Mots,Veuillez saisir des commentaires entre $0 et $1 mots !
 Nombre actuel de mots : $2,Anonyme,Nains,Hobbits,Ents,Mages,Elfes,Ma\xEFar,GIF,Rechercher un GIF,Profil,Approuv\xE9,En attente,Ind\xE9sirable,D\xE9tacher,Le plus ancien,Dernier,Le plus populaire,Qu'en pensez-vous ?,Votre commentaire est en cours de r\xE9vision et n'est actuellement visible que par vous. Il sera visible publiquement apr\xE8s approbation.,S\u2019abonner aux commentaires de ce post,S\u2019abonner aux commentaires de ce site,S\u2019abonner aux r\xE9ponses de vos commentaires`.split(
      ",",
    ),
  ),
  ba = ce(
    `Nama Panggilan,Nama Panggilan tidak boleh kurang dari 3 bita.,E-Mail,Silakan konfirmasi alamat email Anda.,Situs Web,Opsional,Tulis komentar di sini...,Belum ada komentar.,Kirim,Suka,Batal suka,Balas,Batal balas,Komentar,Segarkan,Muat Lebih Banyak...,Pratinjau,Emoji,Unggah Gambar,detik yang lalu,menit yang lalu,jam yang lalu,hari yang lalu,baru saja,Mengunggah,Masuk,Keluar,Admin,Sematkan,Kata,Silakan masukkan komentar antara $0 dan $1 kata!
 Jumlah kata saat ini: $2,Anonim,Kurcaci,Hobbit,Ent,Penyihir,Peri,Maiar,GIF,Cari GIF,Profil,Disetujui,Menunggu,Spam,Lepas Sematan,Terlama,Terbaru,Terpopuler,Apa yang Anda pikirkan?,Komentar Anda sedang ditinjau dan saat ini hanya terlihat oleh Anda. Komentar akan terlihat secara publik setelah disetujui.,Berlangganan komentar di postingan ini,Berlangganan komentar di situs ini,Berlangganan balasan komentar Anda`.split(
      ",",
    ),
  ),
  ka = ce(
    `Nickname,Il nickname non pu\xF2 avere meno di 3 caratteri.,E-mail,Per favore conferma il tuo indirizzo e-mail.,Sito web,Facoltativo,Scrivi un commento...,Ancora nessun commento.,Invia,Mi piace,Annulla mi piace,Rispondi,Annulla risposta,Commenti,Aggiorna,Carica altri...,Anteprima,Emoji,Carica immagine,secondi fa,minuti fa,ore fa,giorni fa,adesso,Caricamento in corso...,Accedi,Esci,Admin,In evidenza,Parole,Inserisci un commento tra $0 e $1 parole!
 Numero attuale di parole: $2,Anonimo,Nano,Hobbit,Ent,Mago,Elfo,Maiar,GIF,Cerca GIF,Profilo,Approvato,In attesa,Spam,Rimuovi evidenza,Pi\xF9 vecchi,Pi\xF9 recenti,Pi\xF9 popolari,Cosa ne pensi?,Il tuo commento \xE8 in fase di revisione ed \xE8 attualmente visibile solo a te. Sar\xE0 visibile pubblicamente dopo l'approvazione.,Iscriviti ai commenti di questo post,Iscriviti ai commenti di questo sito,Iscriviti alle risposte dei tuoi commenti`.split(
      ",",
    ),
  ),
  xa = ce(
    `\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0,3\u30D0\u30A4\u30C8\u4EE5\u4E0A\u306E\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044.,\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9,\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044.,\u30B5\u30A4\u30C8,\u30AA\u30D7\u30B7\u30E7\u30F3,\u3053\u3053\u306B\u30B3\u30E1\u30F3\u30C8,\u30B3\u30E1\u30F3\u30C8\u3057\u307E\u3057\u3087\u3046~,\u63D0\u51FA\u3059\u308B,Like,Cancel like,\u8FD4\u4FE1\u3059\u308B,\u30AD\u30E3\u30F3\u30BB\u30EB,\u30B3\u30E1\u30F3\u30C8,\u66F4\u65B0,\u3055\u3089\u306B\u8AAD\u307F\u8FBC\u3080,\u30D7\u30EC\u30D3\u30E5\u30FC,\u7D75\u6587\u5B57,\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9,\u79D2\u524D,\u5206\u524D,\u6642\u9593\u524D,\u65E5\u524D,\u305F\u3063\u3060\u4ECA,\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9,\u30ED\u30B0\u30A4\u30F3\u3059\u308B,\u30ED\u30B0\u30A2\u30A6\u30C8,\u7BA1\u7406\u8005,\u30C8\u30C3\u30D7\u306B\u7F6E\u304F,\u30EF\u30FC\u30C9,\u30B3\u30E1\u30F3\u30C8\u306F $0 \u304B\u3089 $1 \u30EF\u30FC\u30C9\u306E\u9593\u3067\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093!
 \u73FE\u5728\u306E\u5358\u8A9E\u756A\u53F7: $2,\u533F\u540D,\u3046\u3048\u306B\u3093,\u306A\u304B\u306B\u3093,\u3057\u3082\u304A\u3057,\u7279\u306B\u3057\u3082\u304A\u3057,\u304B\u3052,\u306A\u306C\u3057,GIF,\u63A2\u3059 GIF,\u500B\u4EBA\u60C5\u5831,\u627F\u8A8D\u6E08\u307F,\u5F85\u3063\u3066\u3044\u308B,\u30B9\u30D1\u30E0,\u3079\u305F\u3064\u304B\u306A\u3044,\u9006\u9806,\u6B63\u9806,\u4EBA\u6C17\u9806,\u3069\u3046\u601D\u3044\u307E\u3059\u304B\uFF1F,\u3042\u306A\u305F\u306E\u30B3\u30E1\u30F3\u30C8\u306F\u5BE9\u67FB\u4E2D\u3067\u3001\u73FE\u5728\u306F\u3042\u306A\u305F\u3060\u3051\u306B\u8868\u793A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u627F\u8A8D\u5F8C\u306B\u516C\u958B\u3055\u308C\u307E\u3059\u3002,\u3053\u306E\u6295\u7A3F\u306E\u30B3\u30E1\u30F3\u30C8\u3092\u8CFC\u8AAD\u3059\u308B,\u3053\u306E\u30B5\u30A4\u30C8\u306E\u30B3\u30E1\u30F3\u30C8\u3092\u8CFC\u8AAD\u3059\u308B,\u3042\u306A\u305F\u306E\u30B3\u30E1\u30F3\u30C8\u306E\u8FD4\u4FE1\u3092\u8CFC\u8AAD\u3059\u308B`.split(
      ",",
    ),
  ),
  Sa = ce(
    `\uB2C9\uB124\uC784,\uB2C9\uB124\uC784\uC740 3\uBC14\uC774\uD2B8 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.,\uC774\uBA54\uC77C,\uC774\uBA54\uC77C \uC8FC\uC18C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.,\uC6F9\uC0AC\uC774\uD2B8,\uC120\uD0DD\uC0AC\uD56D,\uC5EC\uAE30\uC5D0 \uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...,\uC544\uC9C1 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.,\uC81C\uCD9C,\uC88B\uC544\uC694,\uC88B\uC544\uC694 \uCDE8\uC18C,\uB2F5\uAE00,\uB2F5\uAE00 \uCDE8\uC18C,\uB313\uAE00,\uC0C8\uB85C\uACE0\uCE68,\uB354 \uBCF4\uAE30...,\uBBF8\uB9AC\uBCF4\uAE30,\uC774\uBAA8\uC9C0,\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC,\uCD08 \uC804,\uBD84 \uC804,\uC2DC\uAC04 \uC804,\uC77C \uC804,\uBC29\uAE08 \uC804,\uC5C5\uB85C\uB4DC \uC911,\uB85C\uADF8\uC778,\uB85C\uADF8\uC544\uC6C3,\uAD00\uB9AC\uC790,\uACE0\uC815,\uAE00\uC790 \uC218,\uB313\uAE00\uC740 $0\uC790\uC5D0\uC11C $1\uC790 \uC0AC\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4!
\uD604\uC7AC \uAE00\uC790 \uC218: $2,\uC775\uBA85,\uB09C\uC7C1\uC774,\uD638\uBE57,\uC5D4\uD2B8,\uB9C8\uBC95\uC0AC,\uC5D8\uD504,\uB9C8\uC774\uC544,GIF,GIF \uAC80\uC0C9,\uD504\uB85C\uD544,\uC2B9\uC778\uB428,\uB300\uAE30 \uC911,\uC2A4\uD338,\uACE0\uC815 \uD574\uC81C,\uC624\uB798\uB41C \uC21C,\uCD5C\uC2E0 \uC21C,\uC778\uAE30\uC21C,\uC5B4\uB5BB\uAC8C \uC0DD\uAC01\uD558\uC2DC\uB098\uC694?,\uB313\uAE00\uC774 \uAC80\uD1A0 \uC911\uC774\uBA70 \uD604\uC7AC \uBCF8\uC778\uB9CC \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC2B9\uC778 \uD6C4 \uACF5\uAC1C\uB429\uB2C8\uB2E4.,\uC774 \uAC8C\uC2DC\uBB3C\uC758 \uB313\uAE00 \uAD6C\uB3C5,\uC774 \uC0AC\uC774\uD2B8\uC758 \uB313\uAE00 \uAD6C\uB3C5,\uB313\uAE00\uC5D0 \uB300\uD55C \uB2F5\uAE00 \uAD6C\uB3C5`.split(
      ",",
    ),
  ),
  io = ce(
    `Apelido(Apelido n\xE3o pode ser menor que 3 bytes.(E-Mail(Por favor, confirme seu endere\xE7o de e-mail.(Website(Opcional(Comente aqui...(Nenhum coment\xE1rio, ainda.(Enviar(Like(Cancel like(Responder(Cancelar resposta(Coment\xE1rios(Refrescar(Carregar Mais...(Visualizar(Emoji(Enviar Imagem(segundos atr\xE1s(minutos atr\xE1s(horas atr\xE1s(dias atr\xE1s(agora mesmo(Enviando(Entrar(Sair(Admin(Sticky(Palavras(Favor enviar coment\xE1rio com $0 a $1 palavras!
 N\xFAmero de palavras atuais: $2(An\xF4nimo(Dwarves(Hobbits(Ents(Wizards(Elves(Maiar(GIF(Pesquisar GIF(informa\xE7\xE3o pessoal(Aprovado(Espera(Spam(Unsticky(Mais velho(Mais recentes(Mais quente(O que voc\xEA acha?(Seu coment\xE1rio est\xE1 em revis\xE3o e atualmente est\xE1 vis\xEDvel apenas para voc\xEA. Ele ser\xE1 vis\xEDvel publicamente ap\xF3s a aprova\xE7\xE3o.(Assinar os coment\xE1rios deste post(Assinar os coment\xE1rios deste site(Assinar as respostas dos seus coment\xE1rios`.split(
      "(",
    ),
  ),
  Ca = ce(
    `\u041F\u0441\u0435\u0432\u0434\u043E\u043D\u0438\u043C(\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435 3 \u0431\u0430\u0439\u0442.(\u042D\u043B. \u0430\u0434\u0440\u0435\u0441(\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0432\u0430\u0448\u0435\u0439 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B.(\u0412\u0435\u0431-\u0441\u0430\u0439\u0442(\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439(\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u0437\u0434\u0435\u0441\u044C...(\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432.(\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C(Like(Cancel like(\u041E\u0442\u0432\u0435\u0447\u0430\u0442\u044C(\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0442\u0432\u0435\u0442(\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438(\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C(\u0417\u0430\u0433\u0440\u0443\u0437\u0438 \u0431\u043E\u043B\u044C\u0448\u0435...(\u041F\u0440\u0435\u0432\u044C\u044E(\u044D\u043C\u043E\u0434\u0437\u0438(\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435(\u0441\u0435\u043A\u0443\u043D\u0434 \u043D\u0430\u0437\u0430\u0434(\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043C\u0438\u043D\u0443\u0442 \u043D\u0430\u0437\u0430\u0434(\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0447\u0430\u0441\u043E\u0432 \u043D\u0430\u0437\u0430\u0434(\u0434\u043D\u0435\u0439 \u043D\u0430\u0437\u0430\u0434(\u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441(\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430(\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F(\u0412\u044B\u0445\u043E\u0434 \u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043C\u044B(\u0410\u0434\u043C\u0438\u043D(\u041B\u0438\u043F\u043A\u0438\u0439(\u0421\u043B\u043E\u0432\u0430(\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043E\u0442 $0 \u0434\u043E $1 \u0441\u043B\u043E\u0432!
\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0441\u043B\u043E\u0432\u0430: $2(\u0410\u043D\u043E\u043D\u0438\u043C\u043D\u044B\u0439(Dwarves(Hobbits(Ents(Wizards(Elves(Maiar(GIF(\u041F\u043E\u0438\u0441\u043A GIF(\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435(\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439(\u041E\u0436\u0438\u0434\u0430\u044E\u0449\u0438\u0439(\u0421\u043F\u0430\u043C(\u041D\u0435\u043B\u0438\u043F\u043A\u0438\u0439(\u0441\u0430\u043C\u044B\u0439 \u0441\u0442\u0430\u0440\u044B\u0439(\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439(\u0441\u0430\u043C\u044B\u0439 \u0433\u043E\u0440\u044F\u0447\u0438\u0439(\u0427\u0442\u043E \u0432\u044B \u0434\u0443\u043C\u0430\u0435\u0442\u0435?(\u0412\u0430\u0448 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0438\u0438 \u0438 \u0432 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0432\u0438\u0434\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0430\u043C. \u041F\u043E\u0441\u043B\u0435 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u044F \u043E\u043D \u0441\u0442\u0430\u043D\u0435\u0442 \u043E\u0431\u0449\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u043C.(\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043A \u044D\u0442\u043E\u043C\u0443 \u043F\u043E\u0441\u0442\u0443(\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u044D\u0442\u043E\u0433\u043E \u0441\u0430\u0439\u0442\u0430(\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043E\u0442\u0432\u0435\u0442\u044B \u0432\u0430\u0448\u0438\u0445 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432`.split(
      "(",
    ),
  ),
  Ta = ce(
    `T\xEAn,T\xEAn kh\xF4ng \u0111\u01B0\u1EE3c nh\u1ECF h\u01A1n 3 k\xFD t\u1EF1.,E-Mail,Vui l\xF2ng x\xE1c nh\u1EADp \u0111\u1ECBa ch\u1EC9 email c\u1EE7a b\u1EA1n.,Website,T\xF9y ch\u1ECDn,H\xE3y b\xECnh lu\u1EADn c\xF3 v\u0103n ho\xE1!,Ch\u01B0a c\xF3 b\xECnh lu\u1EADn,G\u1EEDi,Th\xEDch,B\u1ECF th\xEDch,Tr\u1EA3 l\u1EDDi,H\u1EE7y b\u1ECF,b\xECnh lu\u1EADn,L\xE0m m\u1EDBi,T\u1EA3i th\xEAm...,Xem tr\u01B0\u1EDBc,Emoji,T\u1EA3i l\xEAn h\xECnh \u1EA3nh,gi\xE2y tr\u01B0\u1EDBc,ph\xFAt tr\u01B0\u1EDBc,gi\u1EDD tr\u01B0\u1EDBc,ng\xE0y tr\u01B0\u1EDBc,V\u1EEBa xong,\u0110ang t\u1EA3i l\xEAn,\u0110\u0103ng nh\u1EADp,\u0111\u0103ng xu\u1EA5t,Qu\u1EA3n tr\u1ECB vi\xEAn,D\xEDnh,t\u1EEB,B\xECnh lu\u1EADn ph\u1EA3i c\xF3 \u0111\u1ED9 d\xE0i gi\u1EEFa $0 v\xE0 $1 t\u1EEB!
 S\u1ED1 t\u1EEB hi\u1EC7n t\u1EA1i: $2,V\xF4 danh,Ng\u01B0\u1EDDi l\xF9n,Ng\u01B0\u1EDDi t\xED hon,Th\u1EA7n r\u1EEBng,Ph\xE1p s\u01B0,Ti\xEAn t\u1ED9c,Maiar,\u1EA2nh GIF,T\xECm ki\u1EBFm \u1EA3nh GIF,th\xF4ng tin c\xE1 nh\xE2n,\u0110\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t,\u0110ang ch\u1EDD \u0111\u1EE3i,Th\u01B0 r\xE1c,Kh\xF4ng d\xEDnh,l\xE2u \u0111\u1EDDi nh\u1EA5t,mu\u1ED9n nh\u1EA5t,n\xF3ng nh\u1EA5t,What do you think?,B\xECnh lu\u1EADn c\u1EE7a b\u1EA1n \u0111ang \u0111\u01B0\u1EE3c xem x\xE9t v\xE0 hi\u1EC7n ch\u1EC9 hi\u1EC3n th\u1ECB v\u1EDBi b\u1EA1n. N\xF3 s\u1EBD \u0111\u01B0\u1EE3c c\xF4ng khai sau khi \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t.,\u0110\u0103ng k\xFD nh\u1EADn x\xE9t c\u1EE7a b\xE0i vi\u1EBFt n\xE0y,\u0110\u0103ng k\xFD nh\u1EADn x\xE9t c\u1EE7a trang web n\xE0y,\u0110\u0103ng k\xFD nh\u1EADn x\xE9t c\u1EE7a b\u1EA1n`.split(
      ",",
    ),
  ),
  Ea = ce(
    `\u6635\u79F0,\u6635\u79F0\u4E0D\u80FD\u5C11\u4E8E3\u4E2A\u5B57\u7B26,\u90AE\u7BB1,\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u4EF6\u5730\u5740,\u7F51\u5740,\u53EF\u9009,\u6B22\u8FCE\u8BC4\u8BBA,\u6765\u53D1\u8BC4\u8BBA\u5427~,\u63D0\u4EA4,\u559C\u6B22,\u53D6\u6D88\u559C\u6B22,\u56DE\u590D,\u53D6\u6D88\u56DE\u590D,\u8BC4\u8BBA,\u5237\u65B0,\u52A0\u8F7D\u66F4\u591A...,\u9884\u89C8,\u8868\u60C5,\u4E0A\u4F20\u56FE\u7247,\u79D2\u524D,\u5206\u949F\u524D,\u5C0F\u65F6\u524D,\u5929\u524D,\u521A\u521A,\u6B63\u5728\u4E0A\u4F20,\u767B\u5F55,\u9000\u51FA,\u535A\u4E3B,\u7F6E\u9876,\u5B57,\u8BC4\u8BBA\u5B57\u6570\u5E94\u5728 $0 \u5230 $1 \u5B57\u4E4B\u95F4\uFF01
\u5F53\u524D\u5B57\u6570\uFF1A$2,\u533F\u540D,\u6F5C\u6C34,\u5192\u6CE1,\u5410\u69FD,\u6D3B\u8DC3,\u8BDD\u75E8,\u4F20\u8BF4,\u8868\u60C5\u5305,\u641C\u7D22\u8868\u60C5\u5305,\u4E2A\u4EBA\u8D44\u6599,\u901A\u8FC7,\u5F85\u5BA1\u6838,\u5783\u573E,\u53D6\u6D88\u7F6E\u9876,\u6309\u5012\u5E8F,\u6309\u6B63\u5E8F,\u6309\u70ED\u5EA6,\u4F60\u8BA4\u4E3A\u8FD9\u7BC7\u6587\u7AE0\u600E\u4E48\u6837\uFF1F,\u8BC4\u8BBA\u6B63\u5728\u5BA1\u6838\u4E2D\uFF0C\u5F53\u524D\u4EC5\u81EA\u5DF1\u53EF\u89C1\uFF0C\u5BA1\u6838\u901A\u8FC7\u540E\u516C\u5F00\u53EF\u89C1\u3002,\u8BA2\u9605\u672C\u6587\u8BC4\u8BBA,\u8BA2\u9605\u672C\u7AD9\u8BC4\u8BBA,\u8BA2\u9605\u4F60\u7684\u8BC4\u8BBA\u56DE\u590D`.split(
      ",",
    ),
  ),
  En = {
    zh: Ea,
    "zh-cn": Ea,
    "zh-tw": ce(
      `\u66B1\u7A31,\u66B1\u7A31\u4E0D\u80FD\u5C11\u65BC3\u500B\u5B57\u5143,\u90F5\u7BB1,\u8ACB\u586B\u5BEB\u6B63\u78BA\u7684\u90F5\u4EF6\u5730\u5740,\u7DB2\u5740,\u53EF\u9078,\u6B61\u8FCE\u7559\u8A00,\u4F86\u767C\u7559\u8A00\u5427~,\u9001\u51FA,\u559C\u6B61,\u53D6\u6D88\u559C\u6B61,\u56DE\u8986,\u53D6\u6D88\u56DE\u8986,\u7559\u8A00,\u91CD\u6574,\u8F09\u5165\u66F4\u591A...,\u9810\u89BD,\u8868\u60C5,\u4E0A\u50B3\u5716\u7247,\u79D2\u524D,\u5206\u9418\u524D,\u5C0F\u6642\u524D,\u5929\u524D,\u525B\u525B,\u6B63\u5728\u4E0A\u50B3,\u767B\u5165,\u767B\u51FA,\u7BA1\u7406\u8005,\u7F6E\u9802,\u5B57,\u7559\u8A00\u5B57\u6578\u61C9\u5728 $0 \u5230 $1 \u5B57\u4E4B\u9593\uFF01
\u76EE\u524D\u5B57\u6578\uFF1A$2,\u533F\u540D,\u6F5B\u6C34,\u5192\u6CE1,\u5410\u69FD,\u6D3B\u8E8D,\u591A\u8A71,\u50B3\u8AAA,\u8868\u60C5\u5305,\u641C\u5C0B\u8868\u60C5\u5305,\u500B\u4EBA\u8CC7\u6599,\u901A\u904E,\u5F85\u5BE9\u6838,\u5783\u573E,\u53D6\u6D88\u7F6E\u9802,\u6700\u65E9,\u6700\u65B0,\u71B1\u9580,\u4F60\u8A8D\u70BA\u9019\u7BC7\u6587\u7AE0\u600E\u9EBC\u6A23\uFF1F,\u60A8\u7684\u8A55\u8AD6\u6B63\u5728\u5BE9\u6838\u4E2D\uFF0C\u76EE\u524D\u50C5\u60A8\u53EF\u898B\u3002\u5BE9\u6838\u901A\u904E\u5F8C\u5C07\u516C\u958B\u986F\u793A\u3002,\u8A02\u95B1\u6B64\u6587\u7AE0\u7684\u8A55\u8AD6,\u8A02\u95B1\u672C\u7AD9\u7684\u8A55\u8AD6,\u8A02\u95B1\u60A8\u7684\u8A55\u8AD6\u56DE\u8986`.split(
        ",",
      ),
    ),
    en: ga,
    "en-us": ga,
    fr: wa,
    "fr-fr": wa,
    id: ba,
    "id-id": ba,
    it: ka,
    "it-it": ka,
    jp: xa,
    "jp-jp": xa,
    ko: Sa,
    "ko-kr": Sa,
    "pt-br": io,
    ru: Ca,
    "ru-ru": Ca,
    vi: Ta,
    "vi-vn": Ta,
    de: lo,
    es: ya,
    "es-mx": ya,
  },
  oo = (e) => En[e.toLowerCase()] ?? En["en-us"],
  $a = (e) => (Object.keys(En).includes(e.toLowerCase()) ? e : "en-US"),
  Ma = { latest: "insertedAt_desc", oldest: "insertedAt_asc", hottest: "like_desc" },
  so = Object.keys(Ma),
  Dt = Symbol("waline-config"),
  Fa = (e) => {
    try {
      return decodeURI(e);
    } catch {
      return e;
    }
  },
  Da = (e = "") => e.replace(/\/$/u, ""),
  za = (e) => /^(?:https?:)?\/\//u.test(e),
  Ft = (e) => {
    let t = Da(e);
    return za(t) ? t : `https://${t}`;
  },
  uo = (e) => (Array.isArray(e) ? e : typeof e == "number" && e > 0 && [0, e]),
  mt = (e, t) => (e == null || e === !0 ? t : e === !1 ? null : e),
  co = ({
    serverURL: e,
    path: t = location.pathname,
    lang: n = typeof navigator > "u" ? "en-US" : navigator.language,
    locale: r,
    meta: a = ["nick", "mail", "link"],
    requiredMeta: l = [],
    dark: o = !1,
    pageSize: i = 10,
    wordLimit: u,
    noCopyright: s = !1,
    noRss: c = !1,
    login: d = "enable",
    recaptchaV3Key: f = "",
    turnstileKey: v = "",
    commentSorting: p = "latest",
    emoji: y = ha,
    imageUploader: g,
    highlighter: C,
    texRenderer: F,
    search: x,
    reaction: I,
    ...Q
  }) => ({
    serverURL: Ft(e),
    path: Fa(t),
    lang: $a(n),
    locale: { ...oo($a(n)), ...(typeof r == "object" ? r : {}) },
    wordLimit: uo(u),
    meta: pa(a),
    requiredMeta: pa(l),
    dark: o,
    pageSize: i,
    commentSorting: p,
    login: d,
    noCopyright: s,
    noRss: c,
    recaptchaV3Key: f,
    turnstileKey: v,
    ...Q,
    reaction: I === !0 ? Qi : I || null,
    imageUploader: mt(g, Ji),
    highlighter: mt(C, ro),
    texRenderer: mt(F, eo),
    emoji: mt(y, ha),
    search: mt(x, to(n)),
  }),
  et = (e) => typeof e == "string",
  Cn =
    "{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bg-color:#1e1e1e;--waline-bg-color-light:#272727;--waline-bg-color-hover: #444;--waline-border-color:#333;--waline-disable-bg-color:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bg-color:#272727;--waline-info-color:#666}",
  fo = (e) =>
    et(e)
      ? e === "auto"
        ? `@media(prefers-color-scheme:dark){body${Cn}}`
        : `${e}${Cn}`
      : e === !0
        ? `:root${Cn}`
        : "",
  Tn = (e, t) => {
    let n = e.toString();
    for (; n.length < t; ) n = `0${n}`;
    return n;
  },
  vo = (e) => {
    let t = Tn(e.getDate(), 2),
      n = Tn(e.getMonth() + 1, 2);
    return `${Tn(e.getFullYear(), 2)}-${n}-${t}`;
  },
  po = (e, t, n) => {
    if (!e) return "";
    let r = et(e) ? new Date(e.includes(" ") ? e.replaceAll("-", "/") : e) : e,
      a = t.getTime() - r.getTime(),
      l = Math.floor(a / 864e5);
    if (l === 0) {
      let o = a % 864e5,
        i = Math.floor(o / 36e5);
      if (i === 0) {
        let u = o % 36e5,
          s = Math.floor(u / 6e4);
        if (s === 0) {
          let c = u % 6e4;
          return `${Math.round(c / 1e3)} ${n.seconds}`;
        }
        return `${s} ${n.minutes}`;
      }
      return `${i} ${n.hours}`;
    }
    return l < 0 ? n.now : l < 8 ? `${l} ${n.days}` : vo(r);
  },
  ho =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/u,
  mo = (e) => ho.test(e),
  Aa = De("WALINE_EMOJI", {}),
  go = (e) => /@[0-9]+\.[0-9]+\.[0-9]+/u.test(e),
  yo = (e) => {
    let t = go(e);
    if (t) {
      let n = Aa.value[e];
      if (n) return Promise.resolve(n);
    }
    return fetch(`${e}/info.json`)
      .then((n) => n.json())
      .then((n) => {
        let r = { folder: e, ...n };
        return (t && (Aa.value[e] = r), r);
      });
  },
  Ra = (e, t = "", n = "", r = "") => `${t ? `${t}/` : ""}${n}${e}${r ? `.${r}` : ""}`,
  wo = (e) =>
    Promise.all(e ? e.map((t) => (et(t) ? yo(Da(t)) : Promise.resolve(t))) : []).then((t) => {
      let n = { tabs: [], map: {} };
      return (
        t.forEach((r) => {
          let { name: a, folder: l, icon: o, prefix: i = "", type: u, items: s } = r;
          n.tabs.push({
            name: a,
            icon: Ra(o, l, i, u),
            items: s.map((c) => {
              let d = `${i}${c}`;
              return ((n.map[d] = Ra(c, l, i, u)), d);
            }),
          });
        }),
        n
      );
    }),
  ja = (e) => {
    e.name !== "AbortError" && console.error(e.message);
  },
  Na = (e) => (e instanceof HTMLElement ? e : et(e) ? document.querySelector(e) : null),
  La = (e) => {
    let t = [...e].find((n) => n.type.includes("image"));
    return t ? t.getAsFile() : null;
  },
  bo = /\$.*?\$/u,
  ko = /^\$(.*?)\$/u,
  xo = /^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/u,
  So = (e) => [
    {
      name: "blockMath",
      level: "block",
      tokenizer(t) {
        let n = xo.exec(t);
        if (n != null) return { type: "html", raw: n[0], text: e(!0, n[1]) };
      },
    },
    {
      name: "inlineMath",
      level: "inline",
      start(t) {
        let n = t.search(bo);
        return n === -1 ? t.length : n;
      },
      tokenizer(t) {
        let n = ko.exec(t);
        if (n != null) return { type: "html", raw: n[0], text: e(!1, n[1]) };
      },
    },
  ],
  Ua = (e = "", t = {}) =>
    e.replaceAll(/:(.+?):/gu, (n, r) =>
      t[r] ? `<img class="wl-emoji" src="${t[r]}" alt="${r}">` : n,
    ),
  Co = (e, { emojiMap: t, highlighter: n, texRenderer: r }) => {
    let a = new wn();
    if ((a.setOptions({ breaks: !0 }), n && a.use(oa({ highlight: n })), r)) {
      let l = So(r);
      a.use({ extensions: l });
    }
    return a.parse(Ua(e, t));
  },
  $n = (e) => {
    let { path: t } = e.dataset;
    return t?.length ? t : null;
  },
  To = (e) => e.match(/[\w\d\s,.\u00C0-\u024F\u0400-\u04FF]+/giu),
  Eo = (e) => e.match(/[\u4E00-\u9FD5]/gu),
  $o = (e) =>
    (To(e)?.reduce(
      (t, n) => t + (["", ",", "."].includes(n.trim()) ? 0 : n.trim().split(/\s+/u).length),
      0,
    ) ?? 0) + (Eo(e)?.length ?? 0),
  Ao = async () => {
    let { userAgentData: e } = navigator,
      t = navigator.userAgent;
    if (!e) return t;
    let { platformVersion: n } = await e.getHighEntropyValues(["platformVersion"]);
    if (!n) return t;
    if (
      (e?.platform === "Windows" &&
        Math.trunc(Number(n.split(".")[0])) >= 13 &&
        (t = t.replace("Windows NT 10.0", "Windows NT 11.0")),
      e?.platform === "macOS")
    ) {
      let r = n.split("."),
        a = Math.trunc(Number(r?.[0])),
        l = Math.trunc(Number(r?.[1]));
      (a > 10 || (a === 10 && l >= 15)) &&
        (t = t.replace("Mac OS X 10_15_7", `Mac OS X ${n.replace(/\./gu, "_")}`));
    }
    return t;
  },
  Ro = ({
    serverURL: e,
    path: t = window.location.pathname,
    selector: n = ".waline-comment-count",
    lang: r = navigator.language,
  }) => {
    let a = new AbortController(),
      l = document.querySelectorAll(n);
    return (
      l.length > 0 &&
        Hn({
          serverURL: Ft(e),
          paths: Array.from(l, (o) => Fa($n(o) ?? t)),
          lang: r,
          signal: a.signal,
        })
          .then((o) => {
            l.forEach((i, u) => {
              i.textContent = o[u].toString();
            });
          })
          .catch(ja),
      a.abort.bind(a)
    );
  },
  Lo = () => De("WALINE_USER_META", { nick: "", mail: "", link: "" }),
  Po = () => De("WALINE_COMMENT_BOX_EDITOR", ""),
  Io = De("WALINE_LIKE", []),
  Ba = () => Io,
  _o = De("WALINE_REACTION", {}),
  Oo = () => _o,
  Mo = {},
  Fo = (e) => {
    let t = (Mo[e] ??= (0, Oa.load)(e, { useRecaptchaNet: !0, autoHideBadge: !0 }));
    return { execute: (n) => t.then((r) => r.execute(n)) };
  },
  Do = (e) => ({
    execute: async (t) => {
      let { load: n } = Mr("https://challenges.cloudflare.com/turnstile/v0/api.js", void 0, {
        async: !1,
      });
      await n();
      let { turnstile: r } = window;
      return new Promise((a) => {
        r?.ready(() => {
          r.render(".wl-captcha-container", {
            sitekey: e,
            action: t,
            size: "compact",
            callback: a,
          });
        });
      });
    },
  }),
  zo = De("WALINE_USER", {}),
  zt = () => zo,
  jo = "3.16.1",
  Pa = ({ size: e }) =>
    L("svg", { class: "wl-close-icon", viewBox: "0 0 1024 1024", width: e, height: e }, [
      L("path", {
        d: "M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z",
        fill: "currentColor",
      }),
      L("path", {
        d: "m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z",
        fill: "#888",
      }),
    ]),
  No = () =>
    L(
      "svg",
      { viewBox: "0 0 1024 1024", width: "24", height: "24" },
      L("path", {
        d: "m341.013 394.667 27.755 393.45h271.83l27.733-393.45h64.106l-28.01 397.952a64 64 0 0 1-63.83 59.498H368.768a64 64 0 0 1-63.83-59.52l-28.053-397.93h64.128zm139.307 19.818v298.667h-64V414.485h64zm117.013 0v298.667h-64V414.485h64zM181.333 288h640v64h-640v-64zm453.483-106.667v64h-256v-64h256z",
        fill: "red",
      }),
    ),
  Uo = () =>
    L(
      "svg",
      { viewBox: "0 0 1024 1024", width: "24", height: "24" },
      L("path", {
        d: "M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z",
        fill: "currentColor",
      }),
    ),
  Bo = () =>
    L("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [
      L("path", {
        d: "M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z",
        fill: "currentColor",
      }),
      L("path", {
        d: "M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z",
        fill: "currentColor",
      }),
    ]),
  Vo = ({ active: e = !1 }) =>
    L("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [
      L("path", {
        d: `M850.654 323.804c-11.042-25.625-26.862-48.532-46.885-68.225-20.022-19.61-43.258-34.936-69.213-45.73-26.78-11.124-55.124-16.727-84.375-16.727-40.622 0-80.256 11.123-114.698 32.135A214.79 214.79 0 0 0 512 241.819a214.79 214.79 0 0 0-23.483-16.562c-34.442-21.012-74.076-32.135-114.698-32.135-29.25 0-57.595 5.603-84.375 16.727-25.872 10.711-49.19 26.12-69.213 45.73-20.105 19.693-35.843 42.6-46.885 68.225-11.453 26.615-17.303 54.877-17.303 83.963 0 27.439 5.603 56.03 16.727 85.117 9.31 24.307 22.659 49.52 39.715 74.981 27.027 40.293 64.188 82.316 110.33 124.915 76.465 70.615 152.189 119.394 155.402 121.371l19.528 12.525c8.652 5.52 19.776 5.52 28.427 0l19.529-12.525c3.213-2.06 78.854-50.756 155.401-121.371 46.143-42.6 83.304-84.622 110.33-124.915 17.057-25.46 30.487-50.674 39.716-74.981 11.124-29.087 16.727-57.678 16.727-85.117.082-29.086-5.768-57.348-17.221-83.963z${e ? "" : "M512 761.5S218.665 573.55 218.665 407.767c0-83.963 69.461-152.023 155.154-152.023 60.233 0 112.473 33.618 138.181 82.727 25.708-49.109 77.948-82.727 138.18-82.727 85.694 0 155.155 68.06 155.155 152.023C805.335 573.551 512 761.5 512 761.5z"}`,
        fill: e ? "red" : "currentColor",
      }),
    ]),
  Ho = () =>
    L("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [
      L("path", {
        d: "M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0",
        fill: "currentColor",
      }),
      L("path", {
        d: "M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0",
        fill: "currentColor",
      }),
    ]),
  Wo = () =>
    L(
      "svg",
      { width: "16", height: "16", ariaHidden: "true" },
      L("path", {
        d: "M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z",
        fill: "currentColor",
      }),
    ),
  qo = () =>
    L(
      "svg",
      { viewBox: "0 0 1024 1024", width: "24", height: "24" },
      L("path", {
        d: "M810.667 213.333a64 64 0 0 1 64 64V704a64 64 0 0 1-64 64H478.336l-146.645 96.107a21.333 21.333 0 0 1-33.024-17.856V768h-85.334a64 64 0 0 1-64-64V277.333a64 64 0 0 1 64-64h597.334zm0 64H213.333V704h149.334v63.296L459.243 704h351.424V277.333zm-271.36 213.334v64h-176.64v-64h176.64zm122.026-128v64H362.667v-64h298.666z",
        fill: "currentColor",
      }),
    ),
  Go = () =>
    L(
      "svg",
      { viewBox: "0 0 1024 1024", width: "24", height: "24" },
      L("path", {
        d: "M813.039 318.772L480.53 651.278H360.718V531.463L693.227 198.961C697.904 194.284 704.027 192 710.157 192C716.302 192 722.436 194.284 727.114 198.961L813.039 284.88C817.72 289.561 820 295.684 820 301.825C820 307.95 817.72 314.093 813.039 318.772ZM710.172 261.888L420.624 551.431V591.376H460.561L750.109 301.825L710.172 261.888ZM490.517 291.845H240.906V771.09H720.156V521.479C720.156 504.947 733.559 491.529 750.109 491.529C766.653 491.529 780.063 504.947 780.063 521.479V791.059C780.063 813.118 762.18 831 740.125 831H220.937C198.882 831 181 813.118 181 791.059V271.872C181 249.817 198.882 231.935 220.937 231.935H490.517C507.06 231.935 520.47 245.352 520.47 261.888C520.47 278.424 507.06 291.845 490.517 291.845Z",
        fill: "currentColor",
      }),
    ),
  Yo = () =>
    L(
      "svg",
      { class: "verified-icon", viewBox: "0 0 1024 1024", width: "14", height: "14" },
      L("path", {
        d: "m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z",
        fill: "#27ae60",
      }),
    ),
  Zo = () =>
    L("svg", { class: "administrator-icon", viewBox: "0 0 1024 1024", width: "14", height: "14" }, [
      L("path", {
        d: "M461.6 129.56C489.6 105.96 534.8 105.96 562.4 129.56L625.6 183.96C637.6 194.36 660.4 202.76 676 202.76H744C786.4 202.76 821.2 237.56 821.2 279.96V347.96C821.2 363.96 829.6 386.36 840 398.36L894.4 461.56C918 489.16 918 534.76 894.8 562.36L840.4 625.56C830 637.56 821.6 660.36 821.6 675.96V743.96C821.6 786.36 786.8 821.16 744.4 821.16H676.4C660.4 821.16 638 829.56 626 839.96L562.8 894.36C534.8 917.96 489.6 917.96 462 894.36L398.8 839.96C386.8 829.56 364 821.16 348.4 821.16H279.2C236.8 821.16 202 786.36 202 743.96V675.56C201.999 659.96 193.6 637.56 183.6 625.56L129.6 561.96C106.4 534.36 106.4 489.56 129.6 461.96L183.6 398.36C193.6 386.359 202 363.959 202 348.36V279.96C202 237.56 236.8 202.76 279.2 202.76H348.4C364 202.76 386.8 194.36 398.8 184.36L461.6 129.56ZM549.567 331.896C530.047 303.082 486.645 306.12 471.433 337.412L442.175 396.526C435.587 409.848 422.856 419.097 408.146 421.226L342.706 430.726C340.776 431 338.884 431.397 336.993 431.946C303.482 441.361 292.756 483.493 317.671 507.812L364.975 553.96C375.623 564.321 380.507 579.299 377.991 593.954L366.917 659.102C366.595 661.03 366.355 662.967 366.279 664.923C364.906 699.688 401.683 722.937 432.514 706.738L491.05 675.966C504.217 669.068 519.954 669.069 533.121 675.966L591.675 706.738C593.406 707.645 595.174 708.432 597.028 709.104C629.666 721.205 663.139 693.382 657.273 659.102L646.069 593.954C643.42 579.176 648.24 564.083 659.001 553.6L706.315 507.461C707.687 506.118 708.994 504.66 710.215 503.127C731.779 475.809 715.737 435.41 681.281 430.365L615.839 420.874C601.13 418.745 588.4 409.486 581.821 396.174L552.562 337.052C551.644 335.284 550.674 333.551 549.567 331.896Z",
        fill: "#f59831",
      }),
    ]),
  gt = ({ size: e = 100 }) =>
    L(
      "svg",
      { width: e, height: e, viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid" },
      L(
        "circle",
        {
          cx: 50,
          cy: 50,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "4",
          r: "40",
          "stroke-dasharray": "85 30",
        },
        L("animateTransform", {
          attributeName: "transform",
          type: "rotate",
          repeatCount: "indefinite",
          dur: "1s",
          values: "0 50 50;360 50 50",
          keyTimes: "0;1",
        }),
      ),
    ),
  Ko = () =>
    L("svg", { width: 24, height: 24, fill: "currentcolor", viewBox: "0 0 24 24" }, [
      L("path", {
        style: "transform: translateY(0.5px)",
        d: "M18.968 10.5H15.968V11.484H17.984V12.984H15.968V15H14.468V9H18.968V10.5V10.5ZM8.984 9C9.26533 9 9.49967 9.09367 9.687 9.281C9.87433 9.46833 9.968 9.70267 9.968 9.984V10.5H6.499V13.5H8.468V12H9.968V14.016C9.968 14.2973 9.87433 14.5317 9.687 14.719C9.49967 14.9063 9.26533 15 8.984 15H5.984C5.70267 15 5.46833 14.9063 5.281 14.719C5.09367 14.5317 5 14.2973 5 14.016V9.985C5 9.70367 5.09367 9.46933 5.281 9.282C5.46833 9.09467 5.70267 9.001 5.984 9.001H8.984V9ZM11.468 9H12.968V15H11.468V9V9Z",
      }),
      L("path", {
        d: "M18.5 3H5.75C3.6875 3 2 4.6875 2 6.75V18C2 20.0625 3.6875 21.75 5.75 21.75H18.5C20.5625 21.75 22.25 20.0625 22.25 18V6.75C22.25 4.6875 20.5625 3 18.5 3ZM20.75 18C20.75 19.2375 19.7375 20.25 18.5 20.25H5.75C4.5125 20.25 3.5 19.2375 3.5 18V6.75C3.5 5.5125 4.5125 4.5 5.75 4.5H18.5C19.7375 4.5 20.75 5.5125 20.75 6.75V18Z",
      }),
    ]),
  Ia = () =>
    L(
      "svg",
      { width: "16", height: "16", viewBox: "0 0 24 24" },
      L(
        "g",
        { transform: "translate(0 -1028.4)" },
        L("g", {}, [
          L("path", {
            d: "m4 1031.4c-1.1046 0-2 0.9-2 2v16c0 1.1 0.8954 2 2 2h16c1.105 0 2-0.9 2-2v-16c0-1.1-0.895-2-2-2h-16z",
            fill: "#d35400",
          }),
          L("path", {
            d: "m4 2c-1.1046 0-2 0.8954-2 2v16c0 1.105 0.8954 2 2 2h16c1.105 0 2-0.895 2-2v-16c0-1.1046-0.895-2-2-2h-16z",
            transform: "translate(0 1028.4)",
            fill: "#e67e22",
          }),
          L("path", {
            d: "m5 1034.4v2.3c6.443 0 11.667 5.2 11.667 11.7h2.333c0-7.8-6.268-14-14-14zm0 4.6v2.4c3.866 0 7 3.1 7 7h2.333c0-5.2-4.178-9.4-9.333-9.4zm2.0417 5.3c-1.1276 0-2.0417 0.9-2.0417 2s0.9141 2.1 2.0417 2.1c1.1275 0 2.0416-1 2.0416-2.1s-0.9141-2-2.0416-2z",
            fill: "#d35400",
          }),
          L("path", {
            d: "m5 1033.4v2.3c6.443 0 11.667 5.2 11.667 11.7h2.333c0-7.8-6.268-14-14-14zm0 4.6v2.4c3.866 0 7 3.1 7 7h2.333c0-5.2-4.178-9.4-9.333-9.4zm2.0417 5.3c-1.1276 0-2.0417 0.9-2.0417 2s0.9141 2.1 2.0417 2.1c1.1275 0 2.0416-1 2.0416-2.1s-0.9141-2-2.0416-2z",
            fill: "#ecf0f1",
          }),
        ]),
      ),
    ),
  Xo = () =>
    L(
      "svg",
      {
        fill: "currentColor",
        width: "24",
        height: "24",
        viewBox: "-3 0 19 19",
        class: "cf-icon-svg",
      },
      L("path", {
        d: "M.926 12.818a1.403 1.403 0 1 1 0 1.984 1.402 1.402 0 0 1 0-1.984zm10.531 2.357a1.03 1.03 0 0 1-1.029-1.03 8.775 8.775 0 0 0-.694-3.438A8.826 8.826 0 0 0 1.591 5.31a1.03 1.03 0 1 1 0-2.059 10.817 10.817 0 0 1 4.24.857 10.893 10.893 0 0 1 3.463 2.334 10.867 10.867 0 0 1 3.19 7.703 1.027 1.027 0 0 1-1.027 1.029zm-4.538 0a1.03 1.03 0 0 1-1.029-1.03 4.297 4.297 0 0 0-4.299-4.298 1.03 1.03 0 0 1 0-2.059 6.362 6.362 0 0 1 5.857 3.883 6.298 6.298 0 0 1 .5 2.475 1.03 1.03 0 0 1-1.029 1.029z",
      }),
    ),
  Qo = { key: 0, class: "wl-reaction" },
  Jo = ["textContent"],
  es = { class: "wl-reaction-list" },
  ts = ["onClick"],
  ns = { class: "wl-reaction-img" },
  rs = ["src", "alt"],
  as = ["textContent"],
  ls = ["textContent"],
  is = Fe({
    __name: "ArticleReaction",
    setup(e) {
      let t = Oo(),
        n = He(Dt),
        r = z(-1),
        a = z([]),
        l = V(() => n.value.locale),
        o = V(() => {
          let { reaction: d } = n.value;
          return d?.length ? d : null;
        }),
        i = V(() => {
          let { path: d } = n.value;
          return (
            o.value?.map((f, v) => ({
              icon: f,
              desc: l.value[`reaction${v}`],
              active: t.value[d] === v,
            })) ?? null
          );
        }),
        u,
        s = async () => {
          let { serverURL: d, lang: f, path: v } = n.value;
          if (!o.value) return;
          let p = new AbortController();
          u = p.abort.bind(p);
          let [y] = await Zt({
            serverURL: d,
            lang: f,
            paths: [v],
            type: o.value.map((g, C) => `reaction${C}`),
            signal: p.signal,
          });
          a.value = o.value.map((g, C) => y[`reaction${C}`]);
        },
        c = async (d) => {
          if (r.value !== -1) return;
          let { serverURL: f, lang: v, path: p } = n.value,
            y = t.value[p];
          ((r.value = d),
            y != null &&
              (await xt({ serverURL: f, lang: v, path: p, type: `reaction${y}`, action: "desc" }),
              (a.value[y] = Math.max(a.value[y] - 1, 0))),
            y !== d &&
              (await xt({ serverURL: f, lang: v, path: p, type: `reaction${d}` }),
              (a.value[d] = (a.value[d] || 0) + 1)),
            y === d ? delete t.value[p] : (t.value[p] = d),
            (r.value = -1));
        };
      return (
        Ce(() => {
          $e(
            () => [n.value.serverURL, n.value.path],
            () => s(),
          );
        }),
        rt(() => {
          u?.();
        }),
        (d, f) =>
          i.value
            ? (h(),
              m("div", Qo, [
                b(
                  "div",
                  { class: "wl-reaction-title", textContent: M(l.value.reactionTitle) },
                  null,
                  8,
                  Jo,
                ),
                b("ul", es, [
                  (h(!0),
                  m(
                    q,
                    null,
                    se(
                      i.value,
                      ({ active: v, icon: p, desc: y }, g) => (
                        h(),
                        m(
                          "li",
                          {
                            key: g,
                            class: re(["wl-reaction-item", { active: v }]),
                            onClick: (C) => c(g),
                          },
                          [
                            b("div", ns, [
                              b("img", { src: p, alt: y }, null, 8, rs),
                              r.value === g
                                ? (h(), me($(gt), { key: 0, class: "wl-reaction-loading" }))
                                : (h(),
                                  m(
                                    "div",
                                    {
                                      key: 1,
                                      class: "wl-reaction-votes",
                                      textContent: M(a.value[g] || 0),
                                    },
                                    null,
                                    8,
                                    as,
                                  )),
                            ]),
                            b("div", { class: "wl-reaction-text", textContent: M(y) }, null, 8, ls),
                          ],
                          10,
                          ts,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
              ]))
            : _("v-if", !0)
      );
    },
  }),
  os = ["data-index"],
  ss = ["src", "title", "onClick"],
  us = Fe({
    __name: "ImageWall",
    props: { items: { default: () => [] }, columnWidth: { default: 300 }, gap: { default: 0 } },
    emits: ["insert"],
    setup(e) {
      let t = null,
        n = we("wall"),
        r = z({}),
        a = z([]),
        l = () => {
          let c = Math.floor(
            (n.value.getBoundingClientRect().width + e.gap) / (e.columnWidth + e.gap),
          );
          return c > 0 ? c : 1;
        },
        o = (c) => Array.from({ length: c }, () => []),
        i = async (c) => {
          if (c >= e.items.length) return;
          await Me();
          let d = [...(n.value?.children ?? [])].reduce((f, v) =>
            v.getBoundingClientRect().height < f.getBoundingClientRect().height ? v : f,
          );
          (a.value[Number(d.dataset.index)].push(c), await i(c + 1));
        },
        u = async (c = !1) => {
          if (a.value.length === l() && !c) return;
          a.value = o(l());
          let { scrollY: d } = window;
          (await i(0), window.scrollTo({ top: d }));
        },
        s = (c) => {
          r.value[c.target.src] = !0;
        };
      return (
        Ce(() => {
          (u(!0),
            (t = new ResizeObserver(() => {
              u();
            })),
            t.observe(n.value),
            he(
              () => [e.items],
              () => {
                ((r.value = {}), u(!0));
              },
            ),
            he(
              () => [e.columnWidth, e.gap],
              () => {
                u();
              },
            ));
        }),
        qt(() => {
          t.unobserve(n.value);
        }),
        (c, d) => (
          h(),
          m(
            "div",
            { ref_key: "wall", ref: n, class: "wl-gallery", style: bt({ gap: `${e.gap}px` }) },
            [
              (h(!0),
              m(
                q,
                null,
                se(
                  a.value,
                  (f, v) => (
                    h(),
                    m(
                      "div",
                      {
                        key: v,
                        class: "wl-gallery-column",
                        "data-index": v,
                        style: bt({ gap: `${e.gap}px` }),
                      },
                      [
                        (h(!0),
                        m(
                          q,
                          null,
                          se(
                            f,
                            (p) => (
                              h(),
                              m(
                                q,
                                { key: p },
                                [
                                  r.value[e.items[p].src]
                                    ? _("v-if", !0)
                                    : (h(),
                                      me($(gt), {
                                        key: 0,
                                        size: 36,
                                        style: { margin: "20px auto" },
                                      })),
                                  b(
                                    "img",
                                    {
                                      class: "wl-gallery-item",
                                      src: e.items[p].src,
                                      title: e.items[p].title,
                                      loading: "lazy",
                                      onLoad: s,
                                      onClick: (y) => c.$emit("insert", `![](${e.items[p].src})`),
                                    },
                                    null,
                                    40,
                                    ss,
                                  ),
                                ],
                                64,
                              )
                            ),
                          ),
                          128,
                        )),
                      ],
                      12,
                      os,
                    )
                  ),
                ),
                128,
              )),
            ],
            4,
          )
        )
      );
    },
  }),
  cs = { key: 0, class: "wl-login-info" },
  ds = { class: "wl-avatar" },
  fs = ["title"],
  vs = ["title"],
  ps = ["src"],
  hs = ["title", "textContent"],
  ms = { class: "wl-panel" },
  gs = ["for", "textContent"],
  ys = ["id", "onUpdate:modelValue", "name", "type"],
  ws = ["placeholder"],
  bs = { class: "wl-preview" },
  ks = ["innerHTML"],
  xs = { class: "wl-footer" },
  Ss = { class: "wl-actions" },
  Cs = {
    href: "https://guides.github.com/features/mastering-markdown/",
    title: "Markdown Guide",
    "aria-label": "Markdown is supported",
    class: "wl-action",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  Ts = ["title"],
  Es = ["title"],
  $s = ["title", "aria-label"],
  As = ["title"],
  Rs = { class: "wl-info" },
  Ls = { class: "wl-text-number" },
  Ps = { key: 0 },
  Is = ["textContent"],
  _s = ["textContent"],
  Os = ["disabled"],
  Ms = ["placeholder"],
  Fs = { key: 1, class: "wl-loading" },
  Ds = ["title", "onClick", "onMouseenter"],
  zs = ["src", "alt"],
  js = ["src"],
  Ns = { key: 0, class: "wl-tabs" },
  Us = ["onClick"],
  Bs = ["src", "alt", "title"],
  Vs = ["title"],
  Va = Fe({
    __name: "CommentBox",
    props: { edit: {}, rootId: {}, replyId: {}, replyUser: {} },
    emits: ["log", "cancelEdit", "cancelReply", "submit"],
    setup(e, { emit: t }) {
      let n = e,
        r = t,
        a = He(Dt),
        l = Po(),
        o = Lo(),
        i = zt(),
        u = z({}),
        s = we("textarea"),
        c = we("image-uploader"),
        d = we("emoji-button"),
        f = we("emoji-popup"),
        v = we("gif-button"),
        p = we("gif-popup"),
        y = we("gif-search"),
        g = z({ tabs: [], map: {} }),
        C = z(0),
        F = z(!1),
        x = z(""),
        I = z({}),
        Q,
        J = (S, T) => {
          (clearTimeout(Q), (x.value = T));
          let w = S.currentTarget,
            N = f.value;
          if (w && N) {
            let W = w.getBoundingClientRect(),
              ne = N.getBoundingClientRect();
            I.value = {
              left: `${W.left - ne.left + W.width / 2}px`,
              top: `${W.top - ne.top}px`,
              transform: "translate(-50%, -100%)",
            };
          }
        },
        ee = () => {
          Q = setTimeout(() => {
            x.value = "";
          }, 50);
        },
        R = z(!1),
        le = z(!1),
        te = z(""),
        E = z(0),
        A = Be({ loading: !0, list: [] }),
        O = z(0),
        k = z(!1),
        j = z(""),
        D = z(!1),
        Oe = z(!1),
        H = V(() => a.value.locale),
        Ue = V(() => !!i.value.token),
        yt = V(() => a.value.imageUploader != null),
        jt = (S) => {
          let T = s.value,
            w = T.selectionStart,
            N = T.selectionEnd || 0,
            { scrollTop: W } = T;
          ((l.value = T.value.slice(0, w) + S + T.value.slice(N)),
            T.focus(),
            (T.selectionStart = w + S.length),
            (T.selectionEnd = w + S.length),
            (T.scrollTop = W));
        },
        Nt = async (S) => {
          let T = `![${a.value.locale.uploading} ${S.name}]()`;
          (jt(T), (D.value = !0));
          try {
            let w = await a.value.imageUploader(S);
            l.value = l.value.replace(
              T,
              `\r
![${S.name}](${w})`,
            );
          } catch (w) {
            (alert(w.message), (l.value = l.value.replace(T, "")));
          } finally {
            D.value = !1;
          }
        },
        Qa = (S) => {
          if (S.dataTransfer?.items) {
            let T = La(S.dataTransfer.items);
            T && yt.value && (Nt(T), S.preventDefault());
          }
        },
        Ja = (S) => {
          if (S.clipboardData) {
            let T = La(S.clipboardData.items);
            T && yt.value && Nt(T);
          }
        },
        el = () => {
          let S = c.value;
          S.files &&
            yt.value &&
            Nt(S.files[0]).then(() => {
              S.value = "";
            });
        },
        Ut = ({ link: S, mail: T, nick: w }) => {
          o.value = { nick: w ?? "", mail: T ?? "", link: S ?? "" };
        },
        An = async () => {
          let {
              serverURL: S,
              lang: T,
              login: w,
              wordLimit: N,
              requiredMeta: W,
              recaptchaV3Key: ne,
              turnstileKey: ge,
            } = a.value,
            K = {
              comment: j.value,
              nick: o.value.nick,
              mail: o.value.mail,
              link: o.value.link,
              url: a.value.path,
              ua: await Ao(),
            };
          if (!n.edit) {
            if (i.value.token)
              ((K.nick = i.value.display_name), (K.mail = i.value.email), (K.link = i.value.url));
            else {
              if (w === "force") return;
              if (W.includes("nick") && !K.nick) {
                (u.value.nick.focus(), alert(H.value.nickError));
                return;
              }
              if ((W.includes("mail") && !K.mail) || (K.mail && !mo(K.mail))) {
                (u.value.mail.focus(), alert(H.value.mailError));
                return;
              }
              K.nick ||= H.value.anonymous;
            }
            Ut(K);
          }
          if (!K.comment) {
            s.value.focus();
            return;
          }
          if (!k.value) {
            alert(
              H.value.wordHint
                .replace("$0", N[0].toString())
                .replace("$1", N[1].toString())
                .replace("$2", E.value.toString()),
            );
            return;
          }
          ((K.comment = Ua(K.comment, g.value.map)),
            n.replyId &&
              n.rootId &&
              ((K.pid = n.replyId), (K.rid = n.rootId), (K.at = n.replyUser)),
            (D.value = !0));
          try {
            (ne && (K.recaptchaV3 = await Fo(ne).execute("social")),
              ge && (K.turnstile = await Do(ge).execute("social")));
            let wt = { serverURL: S, lang: T, token: i.value.token, comment: K },
              Bt = await (n.edit ? at({ objectId: n.edit.objectId, ...wt }) : Bn(wt));
            if (((D.value = !1), Bt.errmsg)) {
              alert(Bt.errmsg);
              return;
            }
            (r("submit", Bt.data),
              (l.value = ""),
              (te.value = ""),
              await Me(),
              n.replyId && r("cancelReply"),
              n.edit?.objectId && r("cancelEdit"));
          } catch (wt) {
            ((D.value = !1), alert(wt.message));
          }
        },
        tl = ({ key: S, ctrlKey: T, metaKey: w }) => {
          D.value || ((T || w) && S === "Enter" && An());
        },
        nl = (S) => {
          S.preventDefault();
          let { lang: T, serverURL: w } = a.value;
          Wn({ serverURL: w, lang: T }).then((N) => {
            ((i.value = N), Ut({ nick: N.display_name, mail: N.email, link: N.url }), r("log"));
          });
        },
        rl = () => {
          ((i.value = {}), r("log"));
        },
        Rn = (S) => {
          S.preventDefault();
          let { lang: T, serverURL: w } = a.value,
            N = 1200,
            W = (window.innerWidth - N) / 2,
            ne = (window.innerHeight - 720) / 2,
            ge = new URLSearchParams({ lng: T, token: i.value.token });
          window
            .open(
              `${w}/ui/profile?${ge.toString()}`,
              "_blank",
              `width=${N},height=720,left=${W},top=${ne},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`,
            )
            ?.postMessage({ type: "TOKEN", data: i.value.token }, "*");
        },
        al = (S) => {
          (!d.value?.contains(S.target) && !f.value?.contains(S.target) && (F.value = !1),
            !v.value?.contains(S.target) && !p.value?.contains(S.target) && (R.value = !1));
        },
        Ln = async (S) => {
          let { scrollTop: T, clientHeight: w, scrollHeight: N } = S.target,
            W = (w + T) / N,
            ne = a.value.search,
            ge = y.value?.value ?? "";
          W < 0.9 ||
            A.loading ||
            Oe.value ||
            ((A.loading = !0),
            (ne.more && A.list.length > 0 ? await ne.more(ge, A.list.length) : await ne.search(ge))
              .length > 0
              ? (A.list = [
                  ...A.list,
                  ...(ne.more && A.list.length > 0
                    ? await ne.more(ge, A.list.length)
                    : await ne.search(ge)),
                ])
              : (Oe.value = !0),
            (A.loading = !1),
            setTimeout(() => {
              S.target.scrollTop = T;
            }, 50));
        },
        Pn = on((S) => {
          ((A.list = []), (Oe.value = !1), Ln(S));
        }, 300);
      return (
        Ae("click", al),
        Ae("message", ({ data: S }) => {
          S?.type === "profile" &&
            ((i.value = { ...i.value, ...S.data }),
            Ut({ nick: i.value.display_name, mail: i.value.email, link: i.value.url }));
        }),
        $e([a, E], ([S, T]) => {
          let { wordLimit: w } = S;
          w
            ? T < w[0] && w[0] !== 0
              ? (([O.value] = w), (k.value = !1))
              : (([, O.value] = w), (k.value = T <= w[1]))
            : ((O.value = 0), (k.value = !0));
        }),
        he(R, async (S) => {
          if (!S) return;
          let T = a.value.search;
          (y.value && (y.value.value = ""),
            (A.loading = !0),
            (A.list = await (T.default?.() ?? T.search(""))),
            (A.loading = !1));
        }),
        Ce(() => {
          (n.edit?.objectId && (l.value = n.edit.orig),
            $e(
              () => l.value,
              (S) => {
                let { highlighter: T, texRenderer: w } = a.value;
                ((j.value = S),
                  (te.value = Co(S, { emojiMap: g.value.map, highlighter: T, texRenderer: w })),
                  (E.value = $o(S)),
                  S ? xn(s.value) : xn.destroy(s.value));
              },
            ),
            $e(
              () => a.value.emoji,
              async (S) => {
                g.value = await wo(S);
              },
            ));
        }),
        (S, T) => (
          h(),
          m("div", { key: $(i).token, class: "wl-comment" }, [
            $(a).login !== "disable" && Ue.value && !e.edit?.objectId
              ? (h(),
                m("div", cs, [
                  b("div", ds, [
                    b(
                      "button",
                      {
                        type: "submit",
                        class: "wl-logout-btn",
                        title: H.value.logout,
                        onClick: rl,
                      },
                      [G($(Pa), { size: 14 })],
                      8,
                      fs,
                    ),
                    b(
                      "a",
                      {
                        href: "#",
                        class: "wl-login-nick",
                        "aria-label": "Profile",
                        title: H.value.profile,
                        onClick: Rn,
                      },
                      [b("img", { src: $(i).avatar, alt: "avatar" }, null, 8, ps)],
                      8,
                      vs,
                    ),
                  ]),
                  b(
                    "a",
                    {
                      href: "#",
                      class: "wl-login-nick",
                      "aria-label": "Profile",
                      title: H.value.profile,
                      onClick: Rn,
                      textContent: M($(i).display_name),
                    },
                    null,
                    8,
                    hs,
                  ),
                ]))
              : _("v-if", !0),
            b("div", ms, [
              $(a).login !== "force" && $(a).meta.length && !Ue.value
                ? (h(),
                  m(
                    "div",
                    { key: 0, class: re(["wl-header", `item${$(a).meta.length}`]) },
                    [
                      (h(!0),
                      m(
                        q,
                        null,
                        se(
                          $(a).meta,
                          (w) => (
                            h(),
                            m("div", { key: w, class: "wl-header-item" }, [
                              b(
                                "label",
                                {
                                  for: `wl-${w}`,
                                  textContent: M(
                                    H.value[w] +
                                      ($(a).requiredMeta.includes(w) || !$(a).requiredMeta.length
                                        ? ""
                                        : `(${H.value.optional})`),
                                  ),
                                },
                                null,
                                8,
                                gs,
                              ),
                              tt(
                                b(
                                  "input",
                                  {
                                    id: `wl-${w}`,
                                    ref_for: !0,
                                    ref: (N) => {
                                      N && (u.value[w] = N);
                                    },
                                    "onUpdate:modelValue": (N) => ($(o)[w] = N),
                                    class: re(["wl-input", `wl-${w}`]),
                                    name: w,
                                    type: w === "mail" ? "email" : "text",
                                  },
                                  null,
                                  10,
                                  ys,
                                ),
                                [[zn, $(o)[w]]],
                              ),
                            ])
                          ),
                        ),
                        128,
                      )),
                    ],
                    2,
                  ))
                : _("v-if", !0),
              tt(
                b(
                  "textarea",
                  {
                    id: "wl-edit",
                    ref: "textarea",
                    "onUpdate:modelValue": (T[0] ||= (w) => (kt(l) ? (l.value = w) : null)),
                    class: "wl-editor",
                    placeholder: e.replyUser ? `@${e.replyUser}` : H.value.placeholder,
                    onKeydown: tl,
                    onDrop: Qa,
                    onPaste: Ja,
                  },
                  null,
                  40,
                  ws,
                ),
                [[Dn, $(l)]],
              ),
              tt(
                b(
                  "div",
                  bs,
                  [
                    (T[7] ||= b("hr", null, null, -1)),
                    b("h4", null, M(H.value.preview) + ":", 1),
                    b("div", { class: "wl-content", innerHTML: te.value }, null, 8, ks),
                  ],
                  512,
                ),
                [[Yt, le.value]],
              ),
              b("div", xs, [
                b("div", Ss, [
                  b("a", Cs, [G($(Wo))]),
                  tt(
                    b(
                      "button",
                      {
                        ref: "emoji-button",
                        type: "button",
                        class: re(["wl-action", { active: F.value }]),
                        title: H.value.emoji,
                        onClick: (T[1] ||= (w) => (F.value = !F.value)),
                      },
                      [G($(Uo))],
                      10,
                      Ts,
                    ),
                    [[Yt, g.value.tabs.length]],
                  ),
                  $(a).search
                    ? (h(),
                      m(
                        "button",
                        {
                          key: 0,
                          ref: "gif-button",
                          type: "button",
                          class: re(["wl-action", { active: R.value }]),
                          title: H.value.gif,
                          onClick: (T[2] ||= (w) => (R.value = !R.value)),
                        },
                        [G($(Ko))],
                        10,
                        Es,
                      ))
                    : _("v-if", !0),
                  b(
                    "input",
                    {
                      id: "wl-image-upload",
                      ref: "image-uploader",
                      class: "upload",
                      "aria-hidden": "true",
                      type: "file",
                      accept: ".png,.jpg,.jpeg,.webp,.bmp,.gif",
                      onChange: el,
                    },
                    null,
                    544,
                  ),
                  yt.value
                    ? (h(),
                      m(
                        "label",
                        {
                          key: 1,
                          for: "wl-image-upload",
                          class: "wl-action",
                          title: H.value.uploadImage,
                          "aria-label": H.value.uploadImage,
                        },
                        [G($(Bo))],
                        8,
                        $s,
                      ))
                    : _("v-if", !0),
                  b(
                    "button",
                    {
                      type: "button",
                      class: re(["wl-action", { active: le.value }]),
                      title: H.value.preview,
                      onClick: (T[3] ||= (w) => (le.value = !le.value)),
                    },
                    [G($(Ho))],
                    10,
                    As,
                  ),
                ]),
                b("div", Rs, [
                  (T[9] ||= b("div", { class: "wl-captcha-container" }, null, -1)),
                  b("div", Ls, [
                    be(M(E.value) + " ", 1),
                    $(a).wordLimit
                      ? (h(),
                        m("span", Ps, [
                          (T[8] ||= be(" \xA0/\xA0 ", -1)),
                          b(
                            "span",
                            { class: re({ illegal: !k.value }), textContent: M(O.value) },
                            null,
                            10,
                            Is,
                          ),
                        ]))
                      : _("v-if", !0),
                    be(" \xA0" + M(H.value.word), 1),
                  ]),
                  $(a).login !== "disable" && !Ue.value
                    ? (h(),
                      m(
                        "button",
                        {
                          key: 0,
                          type: "button",
                          class: "wl-btn",
                          onClick: nl,
                          textContent: M(H.value.login),
                        },
                        null,
                        8,
                        _s,
                      ))
                    : _("v-if", !0),
                  $(a).login !== "force" || Ue.value
                    ? (h(),
                      m(
                        "button",
                        {
                          key: 1,
                          type: "submit",
                          class: "primary wl-btn",
                          title: "Cmd|Ctrl + Enter",
                          disabled: D.value,
                          onClick: An,
                        },
                        [
                          D.value
                            ? (h(), me($(gt), { key: 0, size: 16 }))
                            : (h(), m(q, { key: 1 }, [be(M(H.value.submit), 1)], 64)),
                        ],
                        8,
                        Os,
                      ))
                    : _("v-if", !0),
                ]),
                b(
                  "div",
                  { ref: "gif-popup", class: re(["wl-gif-popup", { display: R.value }]) },
                  [
                    b(
                      "input",
                      {
                        ref: "gif-search",
                        type: "text",
                        placeholder: H.value.gifSearchPlaceholder,
                        onInput: (T[4] ||= (...w) => $(Pn) && $(Pn)(...w)),
                      },
                      null,
                      40,
                      Ms,
                    ),
                    A.list.length
                      ? (h(),
                        me(
                          us,
                          {
                            key: 0,
                            items: A.list,
                            "column-width": 200,
                            gap: 6,
                            onInsert: (T[5] ||= (w) => jt(w)),
                            onScroll: Ln,
                          },
                          null,
                          8,
                          ["items"],
                        ))
                      : _("v-if", !0),
                    A.loading ? (h(), m("div", Fs, [G($(gt), { size: 30 })])) : _("v-if", !0),
                  ],
                  2,
                ),
                b(
                  "div",
                  { ref: "emoji-popup", class: re(["wl-emoji-popup", { display: F.value }]) },
                  [
                    (h(!0),
                    m(
                      q,
                      null,
                      se(
                        g.value.tabs,
                        (w, N) => (
                          h(),
                          m(
                            q,
                            { key: w.name },
                            [
                              N === C.value
                                ? (h(),
                                  m(
                                    "div",
                                    { key: 0, class: "wl-tab-wrapper", onScroll: ee },
                                    [
                                      (h(!0),
                                      m(
                                        q,
                                        null,
                                        se(
                                          w.items,
                                          (W) => (
                                            h(),
                                            m(
                                              "button",
                                              {
                                                key: W,
                                                type: "button",
                                                title: W,
                                                onClick: (ne) => jt(`:${W}:`),
                                                onMouseenter: (ne) => J(ne, W),
                                                onMouseleave: ee,
                                              },
                                              [
                                                F.value
                                                  ? (h(),
                                                    m(
                                                      "img",
                                                      {
                                                        key: 0,
                                                        class: "wl-emoji",
                                                        src: g.value.map[W],
                                                        alt: W,
                                                        loading: "lazy",
                                                        referrerPolicy: "no-referrer",
                                                      },
                                                      null,
                                                      8,
                                                      zs,
                                                    ))
                                                  : _("v-if", !0),
                                              ],
                                              40,
                                              Ds,
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                    ],
                                    32,
                                  ))
                                : _("v-if", !0),
                            ],
                            64,
                          )
                        ),
                      ),
                      128,
                    )),
                    b("div", null, [
                      x.value
                        ? (h(),
                          m(
                            "img",
                            {
                              key: 0,
                              class: "wl-emoji-preview",
                              src: g.value.map[x.value],
                              alt: "preview",
                              loading: "lazy",
                              referrerPolicy: "no-referrer",
                              style: bt(I.value),
                            },
                            null,
                            12,
                            js,
                          ))
                        : _("v-if", !0),
                    ]),
                    g.value.tabs.length > 1
                      ? (h(),
                        m("div", Ns, [
                          (h(!0),
                          m(
                            q,
                            null,
                            se(
                              g.value.tabs,
                              (w, N) => (
                                h(),
                                m(
                                  "button",
                                  {
                                    key: w.name,
                                    type: "button",
                                    class: re(["wl-tab", { active: C.value === N }]),
                                    onClick: (W) => (C.value = N),
                                  },
                                  [
                                    b(
                                      "img",
                                      {
                                        class: "wl-emoji",
                                        src: w.icon,
                                        alt: w.name,
                                        title: w.name,
                                        loading: "lazy",
                                        referrerPolicy: "no-referrer",
                                      },
                                      null,
                                      8,
                                      Bs,
                                    ),
                                  ],
                                  10,
                                  Us,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : _("v-if", !0),
                  ],
                  2,
                ),
              ]),
            ]),
            e.replyId || e.edit?.objectId
              ? (h(),
                m(
                  "button",
                  {
                    key: 1,
                    type: "button",
                    class: "wl-close",
                    title: H.value.cancelReply,
                    onClick: (T[6] ||= (w) => (e.replyId ? r("cancelReply") : r("cancelEdit"))),
                  },
                  [G($(Pa), { size: 24 })],
                  8,
                  Vs,
                ))
              : _("v-if", !0),
          ])
        )
      );
    },
  }),
  Hs = ["id"],
  Ws = { class: "wl-user", "aria-hidden": "true" },
  qs = ["src"],
  Gs = { class: "wl-card" },
  Ys = { class: "wl-head" },
  Zs = ["href"],
  Ks = { key: 1, class: "wl-nick" },
  Xs = ["textContent"],
  Qs = ["textContent"],
  Js = ["textContent"],
  eu = ["textContent"],
  tu = { class: "wl-comment-actions" },
  nu = ["title", "href"],
  ru = ["title"],
  au = ["title"],
  lu = { class: "wl-meta", "aria-hidden": "true" },
  iu = ["data-value", "textContent"],
  ou = { key: 0, class: "wl-warning", "aria-hidden": "true" },
  su = { key: 1, class: "wl-content" },
  uu = { key: 0, class: "wl-reply-to" },
  cu = ["href"],
  du = ["innerHTML"],
  fu = { key: 2, class: "wl-admin-actions" },
  vu = { class: "wl-comment-status" },
  pu = ["disabled", "onClick", "textContent"],
  hu = { key: 4, class: "wl-quote" },
  mu = Fe({
    __name: "CommentCard",
    props: { comment: {}, edit: { default: null }, rootId: {}, reply: { default: null } },
    emits: ["log", "submit", "delete", "like", "sticky", "edit", "reply", "status"],
    setup(e, { emit: t }) {
      let n = t,
        r = ["approved", "waiting", "spam"],
        a = He(Dt),
        l = Ba(),
        o = Or(),
        i = zt(),
        u = V(() => a.value.locale),
        s = V(() => {
          let { link: g } = e.comment;
          return g ? (za(g) ? g : `https://${g}`) : "";
        }),
        c = V(() => l.value.includes(e.comment.objectId)),
        d = V(() => po(new Date(e.comment.time), o.value, u.value)),
        f = V(() => i.value.type === "administrator"),
        v = V(() => e.comment.user_id && i.value.objectId === e.comment.user_id),
        p = V(() => e.comment.objectId === e.reply?.objectId),
        y = V(() => e.comment.objectId === e.edit?.objectId);
      return (g, C) => {
        let F = Fn("CommentCard", !0);
        return (
          h(),
          m(
            "div",
            { id: e.comment.objectId.toString(), class: "wl-card-item" },
            [
              b("div", Ws, [
                e.comment.avatar
                  ? (h(),
                    m(
                      "img",
                      { key: 0, class: "wl-user-avatar", src: e.comment.avatar, alt: "" },
                      null,
                      8,
                      qs,
                    ))
                  : _("v-if", !0),
                e.comment.type === "guest" ? (h(), me($(Yo), { key: 1 })) : _("v-if", !0),
                e.comment.type === "administrator" ? (h(), me($(Zo), { key: 2 })) : _("v-if", !0),
              ]),
              b("div", Gs, [
                b("div", Ys, [
                  s.value
                    ? (h(),
                      m(
                        "a",
                        {
                          key: 0,
                          class: "wl-nick",
                          href: s.value,
                          target: "_blank",
                          rel: "ugc nofollow noreferrer noopener",
                        },
                        M(e.comment.nick),
                        9,
                        Zs,
                      ))
                    : (h(), m("span", Ks, M(e.comment.nick), 1)),
                  e.comment.label
                    ? (h(),
                      m(
                        "span",
                        { key: 2, class: "wl-badge", textContent: M(e.comment.label) },
                        null,
                        8,
                        Xs,
                      ))
                    : _("v-if", !0),
                  e.comment.sticky
                    ? (h(),
                      m(
                        "span",
                        { key: 3, class: "wl-badge", textContent: M(u.value.sticky) },
                        null,
                        8,
                        Qs,
                      ))
                    : _("v-if", !0),
                  typeof e.comment.level == "number"
                    ? (h(),
                      m(
                        "span",
                        {
                          key: 4,
                          class: re(`wl-badge level${e.comment.level}`),
                          textContent: M(
                            u.value[`level${e.comment.level}`] || `Level ${e.comment.level}`,
                          ),
                        },
                        null,
                        10,
                        Js,
                      ))
                    : _("v-if", !0),
                  b("span", { class: "wl-time", textContent: M(d.value) }, null, 8, eu),
                  b("div", tu, [
                    f.value || v.value
                      ? (h(),
                        m(
                          q,
                          { key: 0 },
                          [
                            b(
                              "button",
                              {
                                type: "button",
                                class: "wl-edit",
                                onClick: (C[0] ||= (x) => n("edit", e.comment)),
                              },
                              [G($(Go))],
                            ),
                            b(
                              "button",
                              {
                                type: "button",
                                class: "wl-delete",
                                onClick: (C[1] ||= (x) => n("delete", e.comment)),
                              },
                              [G($(No))],
                            ),
                          ],
                          64,
                        ))
                      : _("v-if", !0),
                    v.value && !$(a).noRss
                      ? (h(),
                        m(
                          "a",
                          {
                            key: 1,
                            role: "button",
                            class: "wl-rss",
                            title: u.value.subscribeToReplies,
                            href: `${$(a).serverURL}/api/comment/rss?user_id=${e.comment.user_id}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          [G($(Xo))],
                          8,
                          nu,
                        ))
                      : _("v-if", !0),
                    b(
                      "button",
                      {
                        type: "button",
                        class: "wl-like",
                        title: c.value ? u.value.cancelLike : u.value.like,
                        onClick: (C[2] ||= (x) => n("like", e.comment)),
                      },
                      [
                        G($(Vo), { active: c.value }, null, 8, ["active"]),
                        be(" " + M("like" in e.comment ? e.comment.like : ""), 1),
                      ],
                      8,
                      ru,
                    ),
                    b(
                      "button",
                      {
                        type: "button",
                        class: re(["wl-reply", { active: p.value }]),
                        title: p.value ? u.value.cancelReply : u.value.reply,
                        onClick: (C[3] ||= (x) => n("reply", p.value ? null : e.comment)),
                      },
                      [G($(qo))],
                      10,
                      au,
                    ),
                  ]),
                ]),
                b("div", lu, [
                  (h(),
                  m(
                    q,
                    null,
                    se(
                      ["addr", "browser", "os"],
                      (x) => (
                        h(),
                        m(
                          q,
                          null,
                          [
                            e.comment[x]
                              ? (h(),
                                m(
                                  "span",
                                  {
                                    key: x,
                                    class: re(`wl-${x}`),
                                    "data-value": e.comment[x],
                                    textContent: M(e.comment[x]),
                                  },
                                  null,
                                  10,
                                  iu,
                                ))
                              : _("v-if", !0),
                          ],
                          64,
                        )
                      ),
                    ),
                    64,
                  )),
                ]),
                e.comment.status === "waiting" && !f.value
                  ? (h(), m("div", ou, M(u.value.commentUnderReview), 1))
                  : _("v-if", !0),
                y.value
                  ? _("v-if", !0)
                  : (h(),
                    m("div", su, [
                      "reply_user" in e.comment && e.comment.reply_user
                        ? (h(),
                          m("p", uu, [
                            b(
                              "a",
                              { href: "#" + e.comment.pid },
                              "@" + M(e.comment.reply_user.nick),
                              9,
                              cu,
                            ),
                            (C[17] ||= b("span", null, ": ", -1)),
                          ]))
                        : _("v-if", !0),
                      b("div", { innerHTML: e.comment.comment }, null, 8, du),
                    ])),
                f.value && !y.value
                  ? (h(),
                    m("div", fu, [
                      b("span", vu, [
                        (h(),
                        m(
                          q,
                          null,
                          se(r, (x) =>
                            b(
                              "button",
                              {
                                key: x,
                                type: "submit",
                                class: re(`wl-btn wl-${x}`),
                                disabled: e.comment.status === x,
                                onClick: (I) => n("status", { status: x, comment: e.comment }),
                                textContent: M(u.value[x]),
                              },
                              null,
                              10,
                              pu,
                            ),
                          ),
                          64,
                        )),
                      ]),
                      f.value && !("rid" in e.comment)
                        ? (h(),
                          m(
                            "button",
                            {
                              key: 0,
                              type: "submit",
                              class: "wl-btn wl-sticky",
                              onClick: (C[4] ||= (x) => n("sticky", e.comment)),
                            },
                            M(e.comment.sticky ? u.value.unsticky : u.value.sticky),
                            1,
                          ))
                        : _("v-if", !0),
                    ]))
                  : _("v-if", !0),
                p.value || y.value
                  ? (h(),
                    m(
                      "div",
                      {
                        key: 3,
                        class: re({ "wl-reply-wrapper": p.value, "wl-edit-wrapper": y.value }),
                      },
                      [
                        G(
                          Va,
                          {
                            edit: e.edit,
                            "reply-id": e.reply?.objectId,
                            "reply-user": e.comment.nick,
                            "root-id": e.rootId,
                            onLog: (C[5] ||= (x) => n("log")),
                            onCancelReply: (C[6] ||= (x) => n("reply", null)),
                            onCancelEdit: (C[7] ||= (x) => n("edit", null)),
                            onSubmit: (C[8] ||= (x) => n("submit", x)),
                          },
                          null,
                          8,
                          ["edit", "reply-id", "reply-user", "root-id"],
                        ),
                      ],
                      2,
                    ))
                  : _("v-if", !0),
                "children" in e.comment
                  ? (h(),
                    m("div", hu, [
                      (h(!0),
                      m(
                        q,
                        null,
                        se(
                          e.comment.children,
                          (x) => (
                            h(),
                            me(
                              F,
                              {
                                key: x.objectId,
                                comment: x,
                                reply: e.reply,
                                edit: e.edit,
                                "root-id": e.rootId,
                                onLog: (C[9] ||= (I) => n("log")),
                                onDelete: (C[10] ||= (I) => n("delete", I)),
                                onEdit: (C[11] ||= (I) => n("edit", I)),
                                onLike: (C[12] ||= (I) => n("like", I)),
                                onReply: (C[13] ||= (I) => n("reply", I)),
                                onStatus: (C[14] ||= (I) => n("status", I)),
                                onSticky: (C[15] ||= (I) => n("sticky", I)),
                                onSubmit: (C[16] ||= (I) => n("submit", I)),
                              },
                              null,
                              8,
                              ["comment", "reply", "edit", "root-id"],
                            )
                          ),
                        ),
                        128,
                      )),
                    ]))
                  : _("v-if", !0),
              ]),
            ],
            8,
            Hs,
          )
        );
      };
    },
  }),
  gu = { "data-waline": "" },
  yu = { class: "wl-meta-head" },
  wu = { class: "wl-count" },
  bu = ["textContent"],
  ku = { class: "wl-sort" },
  xu = ["onClick"],
  Su = { class: "wl-cards" },
  Cu = { key: 1, class: "wl-operation" },
  Tu = ["textContent"],
  Eu = { key: 2, class: "wl-loading" },
  $u = ["textContent"],
  Au = { key: 4, class: "wl-operation" },
  Ru = ["textContent"],
  Lu = { key: 5, class: "wl-meta-foot" },
  Pu = { key: 0, class: "wl-rss" },
  Iu = ["href", "alt"],
  _u = ["textContent"],
  Ou = ["href", "alt"],
  Mu = ["textContent"],
  Fu = { key: 1, class: "wl-power" },
  Du = Fe({
    __name: "WalineComment",
    props: {
      serverURL: {},
      path: {},
      meta: {},
      requiredMeta: {},
      wordLimit: {},
      pageSize: {},
      lang: {},
      locale: {},
      commentSorting: {},
      dark: { type: [String, Boolean] },
      login: {},
      noCopyright: { type: Boolean },
      noRss: { type: Boolean },
      recaptchaV3Key: {},
      turnstileKey: {},
      reaction: { type: [Array, Boolean] },
      emoji: {},
      search: { type: [Object, Boolean] },
      highlighter: { type: Function },
      imageUploader: { type: Function },
      texRenderer: { type: Function },
    },
    setup(e) {
      let t = e,
        n = zt(),
        r = Ba(),
        a = z("loading"),
        l = z(0),
        o = z(1),
        i = z(0),
        u = V(() => co(t)),
        s = z(u.value.commentSorting),
        c = z([]),
        d = z(null),
        f = z(null),
        v = V(() => fo(u.value.dark)),
        p = V(() => u.value.locale);
      Fr(v, { id: "waline-darkmode" });
      let y = null,
        g = (E) => {
          let { serverURL: A, path: O, pageSize: k } = u.value,
            j = new AbortController();
          ((a.value = "loading"),
            y?.(),
            Un({
              serverURL: A,
              lang: u.value.lang,
              path: O,
              pageSize: k,
              sortBy: Ma[s.value],
              page: E,
              signal: j.signal,
              token: n.value.token,
            })
              .then((D) => {
                ((a.value = "success"),
                  (l.value = D.count),
                  c.value.push(...D.data),
                  (o.value = E),
                  (i.value = D.totalPages));
              })
              .catch((D) => {
                D.name !== "AbortError" && (console.error(D.message), (a.value = "error"));
              }),
            (y = j.abort.bind(j)));
        },
        C = () => {
          g(o.value + 1);
        },
        F = () => {
          ((l.value = 0), (c.value = []), g(1));
        },
        x = (E) => {
          s.value !== E && ((s.value = E), F());
        },
        I = (E) => {
          d.value = E;
        },
        Q = (E) => {
          f.value = E;
        },
        J = (E) => {
          if (f.value) ((f.value.comment = E.comment), (f.value.orig = E.orig));
          else if ("rid" in E) {
            let A = c.value.find(({ objectId: O }) => O === E.rid);
            if (!A) return;
            (Array.isArray(A.children) || (A.children = []), A.children.push(E));
          } else (c.value.unshift(E), (l.value += 1));
        },
        ee = async ({ comment: E, status: A }) => {
          if (E.status === A) return;
          let { serverURL: O, lang: k } = u.value;
          (await at({
            serverURL: O,
            lang: k,
            token: n.value.token,
            objectId: E.objectId,
            comment: { status: A },
          }),
            (E.status = A));
        },
        R = async (E) => {
          if ("rid" in E) return;
          let { serverURL: A, lang: O } = u.value;
          (await at({
            serverURL: A,
            lang: O,
            token: n.value.token,
            objectId: E.objectId,
            comment: { sticky: +!E.sticky },
          }),
            (E.sticky = !E.sticky));
        },
        le = async ({ objectId: E }) => {
          if (!confirm("Are you sure you want to delete this comment?")) return;
          let { serverURL: A, lang: O } = u.value;
          (await Vn({ serverURL: A, lang: O, token: n.value.token, objectId: E }),
            c.value.some((k, j) =>
              k.objectId === E
                ? ((c.value = c.value.filter((D, Oe) => Oe !== j)), !0)
                : k.children.some(
                    (D, Oe) =>
                      D.objectId === E &&
                      ((c.value[j].children = k.children.filter((H, Ue) => Ue !== Oe)), !0),
                  ),
            ));
        },
        te = async (E) => {
          let { serverURL: A, lang: O } = u.value,
            { objectId: k } = E,
            j = r.value.includes(k);
          (await at({
            serverURL: A,
            lang: O,
            objectId: k,
            token: n.value.token,
            comment: { like: !j },
          }),
            j
              ? (r.value = r.value.filter((D) => D !== k))
              : ((r.value = [...r.value, k]),
                r.value.length > 50 && (r.value = r.value.slice(-50))),
            (E.like = Math.max(0, (E.like || 0) + (j ? -1 : 1))));
        };
      return (
        Wt(Dt, u),
        Ce(async () => {
          $e(
            () => [t.serverURL, t.path],
            () => {
              F();
            },
          );
          let E = new URLSearchParams(location.search).get("token");
          if (!E) return;
          let A = await fetch(`${u?.value.serverURL}/token`, {
            headers: { Authorization: `Bearer ${E}` },
          })
            .then((k) => k.json())
            .catch((k) => (console.error(k), {}));
          !A.errno && A?.data?.objectId && (n.value = { ...A.data, token: E });
          let O = new URL(window.location.href);
          (O.searchParams.delete("token"),
            history.replaceState(
              null,
              "",
              O.pathname +
                (O.searchParams.toString() ? `?${O.searchParams.toString()}` : "") +
                O.hash,
            ));
        }),
        rt(() => {
          y?.();
        }),
        (E, A) => (
          h(),
          m("div", gu, [
            G(is),
            !d.value && !f.value ? (h(), me(Va, { key: 0, onLog: F, onSubmit: J })) : _("v-if", !0),
            b("div", yu, [
              b("div", wu, [
                l.value
                  ? (h(),
                    m("span", { key: 0, class: "wl-num", textContent: M(l.value) }, null, 8, bu))
                  : _("v-if", !0),
                be(" " + M(p.value.comment), 1),
              ]),
              b("ul", ku, [
                (h(!0),
                m(
                  q,
                  null,
                  se(
                    $(so),
                    (O) => (
                      h(),
                      m(
                        "li",
                        {
                          key: O,
                          class: re([O === s.value ? "active" : ""]),
                          onClick: (k) => x(O),
                        },
                        M(p.value[O]),
                        11,
                        xu,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            b("div", Su, [
              (h(!0),
              m(
                q,
                null,
                se(
                  c.value,
                  (O) => (
                    h(),
                    me(
                      mu,
                      {
                        key: O.objectId,
                        "root-id": O.objectId,
                        comment: O,
                        reply: d.value,
                        edit: f.value,
                        onLog: F,
                        onReply: I,
                        onEdit: Q,
                        onSubmit: J,
                        onStatus: ee,
                        onDelete: le,
                        onSticky: R,
                        onLike: te,
                      },
                      null,
                      8,
                      ["root-id", "comment", "reply", "edit"],
                    )
                  ),
                ),
                128,
              )),
            ]),
            a.value === "error"
              ? (h(),
                m("div", Cu, [
                  b(
                    "button",
                    {
                      type: "button",
                      class: "wl-btn",
                      onClick: F,
                      textContent: M(p.value.refresh),
                    },
                    null,
                    8,
                    Tu,
                  ),
                ]))
              : a.value === "loading"
                ? (h(), m("div", Eu, [G($(gt), { size: 30 })]))
                : c.value.length
                  ? o.value < i.value
                    ? (h(),
                      m("div", Au, [
                        b(
                          "button",
                          {
                            type: "button",
                            class: "wl-btn",
                            onClick: C,
                            textContent: M(p.value.more),
                          },
                          null,
                          8,
                          Ru,
                        ),
                      ]))
                    : _("v-if", !0)
                  : (h(),
                    m(
                      "div",
                      { key: 3, class: "wl-empty", textContent: M(p.value.sofa) },
                      null,
                      8,
                      $u,
                    )),
            c.value.length || a.value !== "loading"
              ? (h(),
                m("div", Lu, [
                  u.value.noRss
                    ? _("v-if", !0)
                    : (h(),
                      m("div", Pu, [
                        b(
                          "a",
                          {
                            href: `${u.value.serverURL}/api/comment/rss?path=${encodeURIComponent(u.value.path)}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            alt: p.value.subPostComment,
                          },
                          [
                            G($(Ia)),
                            b("span", { textContent: M(p.value.subPostComment) }, null, 8, _u),
                          ],
                          8,
                          Iu,
                        ),
                        b(
                          "a",
                          {
                            href: `${u.value.serverURL}/api/comment/rss`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            alt: p.value.subSiteComment,
                          },
                          [
                            G($(Ia)),
                            b("span", { textContent: M(p.value.subSiteComment) }, null, 8, Mu),
                          ],
                          8,
                          Ou,
                        ),
                      ])),
                  u.value.noCopyright
                    ? _("v-if", !0)
                    : (h(),
                      m("div", Fu, [
                        (A[0] ||= be(" Powered by ", -1)),
                        (A[1] ||= b(
                          "a",
                          {
                            href: "https://github.com/walinejs/waline",
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          " Waline ",
                          -1,
                        )),
                        be(" v" + M($(jo)), 1),
                      ])),
                ]))
              : _("v-if", !0),
          ])
        )
      );
    },
  }),
  _a = (e, t) => {
    t.forEach((n, r) => {
      let a = e[r].time;
      typeof a == "number" && (n.textContent = a.toString());
    });
  },
  zu = ({
    serverURL: e,
    path: t = window.location.pathname,
    selector: n = ".waline-pageview-count",
    update: r = !0,
    lang: a = navigator.language,
  }) => {
    let l = new AbortController(),
      o = [...document.querySelectorAll(n)],
      i = (s) => {
        let c = $n(s);
        return c != null && t !== c;
      },
      u = async (s) => {
        try {
          let c = await qn({
            serverURL: Ft(e),
            paths: s.map((d) => $n(d) ?? t),
            lang: a,
            signal: l.signal,
          });
          _a(c, s);
        } catch (c) {
          ja(c);
        }
      };
    if (r) {
      let s = o.filter((d) => !i(d)),
        c = o.filter((d) => i(d));
      (Gn({ serverURL: Ft(e), path: t, lang: a }).then((d) => {
        _a(d, s);
      }),
        c.length > 0 && u(c));
    } else u(o);
    return l.abort.bind(l);
  },
  Ha = ({
    el: e = "#waline",
    path: t = window.location.pathname,
    comment: n = !1,
    pageview: r = !1,
    ...a
  }) => {
    let l = e ? Na(e) : null;
    if (e && !l) throw Error("Option 'el' do not match any domElement!");
    if (!a.serverURL) throw Error("Option 'serverURL' is missing!");
    let o = Be({ ...a }),
      i = Be({ comment: n, pageview: r, path: t }),
      u = () => {
        i.comment &&
          Ro({
            serverURL: o.serverURL,
            path: i.path,
            ...(et(i.comment) ? { selector: i.comment } : {}),
          });
      },
      s = () => {
        i.pageview &&
          zu({
            serverURL: o.serverURL,
            path: i.path,
            ...(et(i.pageview) ? { selector: i.pageview } : {}),
          });
      },
      c = null;
    l && ((c = jn(() => L(Du, { path: i.path, ...o }))), c.mount(l));
    let d = nt(u),
      f = nt(s);
    return {
      el: l,
      update: ({ comment: v, pageview: p, path: y = window.location.pathname, ...g } = {}) => {
        (Object.entries(g).forEach(([C, F]) => {
          o[C] = F;
        }),
          (i.path = y),
          v != null && (i.comment = v),
          p != null && (i.pageview = p));
      },
      destroy: () => {
        (c?.unmount(), d(), f());
      },
    };
  },
  Wa = ({ el: e, serverURL: t, count: n, lang: r = navigator.language }) => {
    let a = zt(),
      l = Na(e),
      o = new AbortController();
    return Yn({ serverURL: t, count: n, lang: r, signal: o.signal, token: a.value.token }).then(
      (i) =>
        l && i.length > 0
          ? ((l.innerHTML = `<ul class="wl-recent-list">${i.map((u) => `<li class="wl-recent-item"><a href="${u.url}">${u.nick}</a>\uFF1A${u.comment}</li>`).join("")}</ul>`),
            {
              comments: i,
              destroy: () => {
                (o.abort(), (l.innerHTML = ""));
              },
            })
          : {
              comments: i,
              destroy: () => {
                o.abort();
              },
            },
    );
  };
B();
var ju = { "Content-Type": "application/json" },
  Za = (e) => `${e.replace(/\/?$/u, "/")}api/`,
  Ka = (e, t = "") => {
    if (typeof e == "object" && e.errno)
      throw TypeError(`${t} failed with ${e.errno}: ${e.errmsg}`);
    return e;
  },
  Nu = ({ serverURL: e, lang: t, paths: n, type: r, signal: a }) =>
    fetch(
      `${Za(e)}article?path=${encodeURIComponent(n.join(","))}&type=${encodeURIComponent(r.join(","))}&lang=${t}`,
      { signal: a },
    )
      .then((l) => l.json())
      .then((l) => Ka(l, "Get counter").data),
  Uu = ({ serverURL: e, lang: t, path: n, type: r, action: a }) =>
    fetch(`${Za(e)}article?lang=${t}`, {
      method: "POST",
      headers: ju,
      body: JSON.stringify({ path: n, type: r, action: a }),
    })
      .then((l) => l.json())
      .then((l) => Ka(l, "Update counter").data),
  Bu = ({ serverURL: e, lang: t, paths: n, signal: r }) =>
    Nu({ serverURL: e, lang: t, paths: n, type: ["time"], signal: r }),
  Vu = (e) => Uu({ ...e, type: "time", action: "inc" }),
  Hu = (e = "") => e.replace(/\/$/u, ""),
  Wu = (e) => /^(?:https?:)?\/\//u.test(e),
  qa = (e) => {
    let t = Hu(e);
    return Wu(t) ? t : `https://${t}`;
  },
  qu = (e) => {
    e.name !== "AbortError" && console.error(e.message);
  },
  Ga = (e) => {
    let { path: t } = e.dataset;
    return t?.length ? t : null;
  },
  Ya = (e, t) => {
    t.forEach((n, r) => {
      let a = e[r].time;
      typeof a == "number" && (n.textContent = a.toString());
    });
  },
  Xa = ({
    serverURL: e,
    path: t = window.location.pathname,
    selector: n = ".waline-pageview-count",
    update: r = !0,
    lang: a = navigator.language,
  }) => {
    let l = new AbortController(),
      o = [...document.querySelectorAll(n)],
      i = (s) => {
        let c = Ga(s);
        return c != null && t !== c;
      },
      u = async (s) => {
        try {
          let c = await Bu({
            serverURL: qa(e),
            paths: s.map((d) => Ga(d) ?? t),
            lang: a,
            signal: l.signal,
          });
          Ya(c, s);
        } catch (c) {
          qu(c);
        }
      };
    if (r) {
      let s = o.filter((d) => !i(d)),
        c = o.filter((d) => i(d));
      (Vu({ serverURL: qa(e), path: t, lang: a }).then((d) => {
        Ya(d, s);
      }),
        c.length > 0 && u(c));
    } else u(o);
    return l.abort.bind(l);
  };
await import("./waline-4M7F25GH.js");
var Dd = function () {
    Ha({
      el: "#comments",
      serverURL: ie.waline.serverURL,
      lang: ie.waline.lang,
      locale: ie.waline.locale,
      emoji: ie.waline.emoji,
      meta: ie.waline.meta,
      requiredMeta: ie.waline.requiredMeta,
      wordLimit: ie.waline.wordLimit,
      pageSize: ie.waline.pageSize,
      pageview: ie.waline.pageview,
      path: window.location.pathname,
      recaptchaV3Key: ie.waline.recaptchaV3Key,
      turnstileKey: ie.waline.turnstileKey,
      dark: 'html[data-theme="dark"]',
    });
  },
  zd = function () {
    Xa({ serverURL: ie.waline.serverURL, path: window.location.pathname });
  },
  jd = async function () {
    let e = "https://www.sycamore.top".replace(/^(https?:\/\/)?[^/]*/, ""),
      t = [],
      { comments: n } = await Wa({ serverURL: ie.waline.serverURL.replace(/\/+$/, ""), count: 5 });
    n.data.forEach(function (a) {
      let l = a.orig.length > 50 ? a.orig.substring(0, 50) + "..." : a.orig;
      a.url = a.url.startsWith("/") ? a.url : "/" + a.url;
      let o = a.url + "#" + a.objectId,
        i = new Date(a.time),
        s = new Date().valueOf() - i.valueOf(),
        c;
      (s < 36e5
        ? (c = `${Math.floor(s / 6e4)} \u5206\u949F\u524D`)
        : s < 864e5
          ? (c = `${Math.floor(s / 36e5)} \u5C0F\u65F6\u524D`)
          : s < 2592e6
            ? (c = `${Math.floor(s / 864e5)} \u5929\u524D`)
            : (c = `${i.getFullYear()}-${i.getMonth() + 1}-${i.getDate()}`),
        t.push({ href: o, nick: a.nick, time: c, text: l }));
    });
    let r = new DocumentFragment();
    (t.forEach(function (a) {
      let l = document.createElement("li"),
        o = document.createElement("a"),
        i = document.createElement("span"),
        u = document.createElement("span");
      ((u.innerText = a.text),
        (i.className = "breadcrumb"),
        (i.innerText = `${a.nick} @ ${a.time}`),
        (o.href = e + a.href),
        (l.className = "item"),
        u.appendChild(document.createElement("br")),
        o.appendChild(i),
        o.appendChild(u),
        l.appendChild(o),
        r.appendChild(l));
    }),
      document.getElementById("new-comment").appendChild(r));
  };
export { Dd as walineComment, zd as walinePageview, jd as walineRecentComments };
/*! For license information please see comments-6YKM5CAO.js.LEGAL.txt */
