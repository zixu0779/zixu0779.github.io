import { a as i, b as s } from "./chunk-LBRT6KNY.js";
i();
var r = (t, e = document) => (t[0] === "#" ? e.getElementById(t.substring(1)) : e.querySelector(t));
r.all = (t, e = document) => e.querySelectorAll(t);
r.each = (t, e, n) => {
  r.all(t, n).forEach(e);
};
i();
var m = function (t, e) {
    let n = t.parentNode;
    n.lastChild === t ? n.appendChild(e) : n.insertBefore(e, t.nextSibling);
  },
  N = function (t, e, n, d) {
    let o = document.createElement(e);
    switch ((Object.assign(o, n), d)) {
      case "after":
        m(t, o);
        break;
      case "replace":
        ((t.innerHTML = ""), t.appendChild(o));
        break;
      default:
        t.appendChild(o);
    }
    return o;
  },
  S = function (t, e) {
    let n = document.createElement("div");
    (Object.assign(n, e),
      t.parentNode.insertBefore(n, t),
      t.parentNode.removeChild(t),
      n.appendChild(t));
  },
  j = function (t) {
    return t.getBoundingClientRect().height;
  },
  w = function (t, e) {
    t.style.width = typeof e == "number" ? e + "rem" : e;
  },
  W = function (t) {
    return t.getBoundingClientRect().width;
  },
  k = function (t) {
    return t.getBoundingClientRect().top;
  },
  P = function (t) {
    return t.getBoundingClientRect().left;
  },
  D = function (t) {
    return t.style.display;
  },
  _ = function (t, e) {
    return ((t.style.display = e), t);
  };
function l() {
  Object.assign(HTMLElement.prototype, {
    find(t) {
      return r.all(t, this);
    },
    _class(t, e, n) {
      (e.indexOf(" ") ? e.split(" ") : [e]).forEach((o) => {
        t === "toggle" ? this.classList.toggle(o, n) : this.classList[t](o);
      });
    },
    addClass(t) {
      return (this._class("add", t), this);
    },
    removeClass(t) {
      return (this._class("remove", t), this);
    },
    toggleClass(t, e) {
      return (this._class("toggle", t, e), this);
    },
    hasClass(t) {
      return this.classList.contains(t);
    },
  });
}
i();
var c = s;
l();
var G = c.statics.indexOf("//") > 0 ? c.statics : c.root,
  Y = { x: 0, y: 0 },
  u = 0,
  a;
var $ = document.getElementsByTagName("body")[0],
  F = document.documentElement,
  J = document.getElementById("container"),
  U = document.getElementById("loading"),
  p = document.getElementById("nav"),
  z = document.getElementById("header"),
  K = p.querySelector(".toggle"),
  Q = document.getElementById("quick"),
  V = document.getElementById("sidebar"),
  X = document.getElementById("brand"),
  g = document.getElementById("tool"),
  x,
  f,
  h,
  T,
  Z = document.getElementById("search"),
  E,
  H,
  L,
  b = window.innerHeight,
  v = window.innerWidth,
  y = 0,
  C = window.location.href,
  B;
function tt(t) {
  E = t;
}
function et(t) {
  H = t;
}
function nt(t) {
  L = t;
}
function ot(t) {
  b = t;
}
function it(t) {
  v = t;
}
function rt(t) {
  u = t;
}
function st(t) {
  y = t;
}
function lt(t) {
  C = t;
}
function ct(t) {
  B = t;
}
function dt(t) {
  a = t;
}
function mt(t) {
  x = t;
}
function ut(t) {
  f = t;
}
function at(t) {
  h = t;
}
function pt(t) {
  T = t;
}
function gt(t) {
  g = t;
}
export {
  r as a,
  m as b,
  N as c,
  S as d,
  j as e,
  w as f,
  W as g,
  k as h,
  P as i,
  D as j,
  _ as k,
  l,
  c as m,
  Y as n,
  u as o,
  a as p,
  $ as q,
  F as r,
  J as s,
  U as t,
  p as u,
  z as v,
  K as w,
  Q as x,
  V as y,
  X as z,
  g as A,
  x as B,
  f as C,
  h as D,
  T as E,
  E as F,
  H as G,
  L as H,
  v as I,
  y as J,
  C as K,
  tt as L,
  et as M,
  nt as N,
  ot as O,
  it as P,
  rt as Q,
  st as R,
  lt as S,
  ct as T,
  dt as U,
  mt as V,
  ut as W,
  at as X,
  pt as Y,
  gt as Z,
};
/*! For license information please see chunk-GVF3ZA6L.js.LEGAL.txt */
