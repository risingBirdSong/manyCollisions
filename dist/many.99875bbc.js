// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"many.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var clrsA = ["#CD88AF", "#AA5585", "#882D61", "#661141", "#440027"];
var clrsB = ["#F8A6AC", "#CF676F", "#A6373F", "#7C151C", "#530006"];
var clrsC = ["#FFD1AA", "#D49A6A", "#AA6C39", "#804515", "#552600"];
var clrsD = ["#7BB992", "#4D9A6A", "#297B48", "#0F5D2C", "#003E17"];
var clrsE = ["#7F81B1", "#545894", "#333676", "#191C59", "#080B3B"];
var clrs = clrsB;
var canvas = document.querySelector("canvas");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gravity = 1;
var friction = .80;
exports.mouse = {
  x: 0,
  y: 0
};
window.addEventListener("mousemove", function (event) {
  exports.mouse.x = event.x;
  exports.mouse.y = event.y;
});
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
window.addEventListener("mousemove", function () {}); // canvas.onmousedown = function(e) {
//     circle2.x = mouse.x;
//     circle2.y = mouse.y;
// };

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getDistancePythag(x1, y1, x2, y2) {
  var xDistance = x2 - x1;
  var yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function getRandomColor(colorArray) {
  return colorArray[Math.floor(Math.random() * colorArray.length)];
}

function rotate(velocity, angle) {
  var rotatedVelocities = {
    x: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
    y: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle)
  };
  return rotatedVelocities;
}
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 */


function resolveCollision(particle, otherParticle) {
  var xVelocityDiff = particle.velocity.dx - otherParticle.velocity.dx;
  var yVelocityDiff = particle.velocity.dy - otherParticle.velocity.dy;
  var xDist = otherParticle.x - particle.x;
  var yDist = otherParticle.y - particle.y; // Prevent accidental overlap of particles

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x); // Store mass in var for better readability in collision equation

    var m1 = particle.mass;
    var m2 = otherParticle.mass; // Velocity before equation

    var u1 = rotate(particle.velocity, angle);
    var u2 = rotate(otherParticle.velocity, angle); // Velocity after 1d collision equation

    var v1 = {
      dx: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
      dy: u1.y
    };
    var v2 = {
      dx: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
      dy: u2.y
    }; // Final velocity after rotating axis back to original location

    var vFinal1 = rotate(v1, -angle);
    var vFinal2 = rotate(v2, -angle); // Swap particle velocities for realistic bounce effect

    particle.velocity.dx = vFinal1.x;
    particle.velocity.dy = vFinal1.y;
    otherParticle.velocity.dx = vFinal2.x;
    otherParticle.velocity.dy = vFinal2.y;
  }
}

var Circle =
/** @class */
function () {
  function Circle(x, y, radius, dx, dy, color) {
    var _this = this;

    if (radius === void 0) {
      radius = 50;
    }

    if (dx === void 0) {
      dx = 0;
    }

    if (dy === void 0) {
      dy = 0;
    }

    this.color = color;
    this.velocity = {
      dx: getRandomInRange(-2.5, 2.5),
      dy: getRandomInRange(-2.5, 2.5)
    };
    this.clamp = 2;
    this.originalRadius = this.radius;
    this.begin = 0;
    this.end = Math.PI * 2;
    this.mouseRangeInteract = 100;
    this.growthRate = 4;
    this.maxGrowth = Math.random() * 100 + 10;
    this.mass = this.radius;

    this.draw = function () {
      _this.context.beginPath();

      _this.context.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2);

      _this.context.fillStyle = _this.color;

      _this.context.fill();

      _this.context.stroke();

      _this.context.closePath();
    };

    this.update = function (particles) {
      for (var i = 0; i < particles.length; i++) {
        if (_this === particles[i]) {
          continue;
        }

        ;
        var hypotonuse = getDistancePythag(_this.x, _this.y, particles[i].x, particles[i].y);
        var bothCombinedRadius = _this.radius + particles[i].radius;
        var spaceBetween = hypotonuse - bothCombinedRadius;

        if (spaceBetween <= 0) {
          resolveCollision(_this, particles[i]);
        }
      }

      if (_this.x + _this.radius > window.innerWidth || _this.x - _this.radius < 0) {
        _this.velocity.dx = -_this.velocity.dx;
      }

      if (_this.y + _this.radius > window.innerHeight || _this.y - _this.radius < 0) {
        _this.velocity.dy = -_this.velocity.dy;
      }

      if (_this.velocity.dx || _this.velocity.dy < _this.clamp) {
        _this.x += _this.velocity.dx;
        _this.y += _this.velocity.dy;
      } else {
        _this.x += _this.velocity.dx * .1;
        _this.y += _this.velocity.dy * .1;
      }

      _this.draw();
    };

    this.canvas = canvas;
    this.context = context;
    this.radius = radius;
    this.originalRadius = this.radius;
    this.x = x;
    this.y = y;
    this.velocity.dx = dx;
    this.velocity.dy = dy;
    this.mass = this.radius;
  }

  return Circle;
}();

var allCircles = [];

function init() {
  var cushion = 10;

  for (var i = 0; i < 80; i++) {
    var radius = getRandomInRange(10, 40);
    var circle = new Circle(getRandomInRange(radius, window.innerWidth - radius), getRandomInRange(radius, window.innerHeight - radius), radius, getRandomInRange(2, 4), getRandomInRange(2, 4), getRandomColor(clrsC));

    if (i != 0) {
      for (var j = 0; j < allCircles.length; j++) {
        var hypotonuse = getDistancePythag(circle.x, circle.y, allCircles[j].x, allCircles[j].y);
        var bothCombinedRadius = circle.radius + allCircles[j].radius;
        var spaceBetween = hypotonuse - bothCombinedRadius - cushion;

        if (spaceBetween <= 0) {
          var stop = true;
          circle = new Circle(getRandomInRange(radius, window.innerWidth - radius), getRandomInRange(radius, window.innerHeight - radius), radius, getRandomInRange(2, 4), getRandomInRange(2, 4), getRandomColor(clrsC));
          j = 0;
        } // if (getDistancePythag(circle.x, circle.y, allCircles[j].x, allCircles[j].y)
        //  - (allCircles[j].radius + circle.radius) <= 0) {
        //     console.log("they overlapped!");
        //     circle = new Circle(Math.random() * window.innerWidth,
        //         Math.random() * window.innerHeight,
        //         Math.random() * 200, null, null, getRandomColor(clrsC));
        //     j = 0;
        // }

      }
    }

    allCircles.push(circle);
  }
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (var _i = 0, allCircles_1 = allCircles; _i < allCircles_1.length; _i++) {
    var c = allCircles_1[_i];
    c.update(allCircles);
  }
}

init();
animate();
},{}],"../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50328" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","many.ts"], null)
//# sourceMappingURL=/many.99875bbc.js.map