(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/tslib/tslib.es6.mjs
  var tslib_es6_exports = {};
  __export(tslib_es6_exports, {
    __addDisposableResource: () => __addDisposableResource,
    __assign: () => __assign,
    __asyncDelegator: () => __asyncDelegator,
    __asyncGenerator: () => __asyncGenerator,
    __asyncValues: () => __asyncValues,
    __await: () => __await,
    __awaiter: () => __awaiter,
    __classPrivateFieldGet: () => __classPrivateFieldGet,
    __classPrivateFieldIn: () => __classPrivateFieldIn,
    __classPrivateFieldSet: () => __classPrivateFieldSet,
    __createBinding: () => __createBinding,
    __decorate: () => __decorate,
    __disposeResources: () => __disposeResources,
    __esDecorate: () => __esDecorate,
    __exportStar: () => __exportStar,
    __extends: () => __extends,
    __generator: () => __generator,
    __importDefault: () => __importDefault,
    __importStar: () => __importStar,
    __makeTemplateObject: () => __makeTemplateObject,
    __metadata: () => __metadata,
    __param: () => __param,
    __propKey: () => __propKey,
    __read: () => __read,
    __rest: () => __rest,
    __rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
    __runInitializers: () => __runInitializers,
    __setFunctionName: () => __setFunctionName,
    __spread: () => __spread,
    __spreadArray: () => __spreadArray,
    __spreadArrays: () => __spreadArrays,
    __values: () => __values,
    default: () => tslib_es6_default
  });
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
      if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
      return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function(f) {
        if (done) throw new TypeError("Cannot add initializers after decoration has completed");
        extraInitializers.push(accept(f || null));
      };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
        if (result === void 0) continue;
        if (result === null || typeof result !== "object") throw new TypeError("Object expected");
        if (_ = accept(result.get)) descriptor.get = _;
        if (_ = accept(result.set)) descriptor.set = _;
        if (_ = accept(result.init)) initializers.unshift(_);
      } else if (_ = accept(result)) {
        if (kind === "field") initializers.unshift(_);
        else descriptor[key] = _;
      }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
  }
  function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
  }
  function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
  }
  function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  }
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function awaitReturn(f) {
      return function(v) {
        return Promise.resolve(v).then(f, reject);
      };
    }
    function verb(n, f) {
      if (g[n]) {
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
        if (f) i[n] = f(i[n]);
      }
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
      throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
      return this;
    }, i;
    function verb(n, f) {
      i[n] = o[n] ? function(v) {
        return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
      } : f;
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({ value: v2, done: d });
      }, reject);
    }
  }
  function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  }
  function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
  }
  function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }
  function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  }
  function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
  }
  function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
      if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async) inner = dispose;
      }
      if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
      if (inner) dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
      env.stack.push({ value, dispose, async });
    } else if (async) {
      env.stack.push({ async: true });
    }
    return value;
  }
  function __disposeResources(env) {
    function fail(e) {
      env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  }
  function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
        return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
      });
    }
    return path;
  }
  var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
  var init_tslib_es6 = __esm({
    "node_modules/tslib/tslib.es6.mjs"() {
      extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
        o["default"] = v;
      };
      ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      tslib_es6_default = {
        __extends,
        __assign,
        __rest,
        __decorate,
        __param,
        __esDecorate,
        __runInitializers,
        __propKey,
        __setFunctionName,
        __metadata,
        __awaiter,
        __generator,
        __createBinding,
        __exportStar,
        __values,
        __read,
        __spread,
        __spreadArrays,
        __spreadArray,
        __await,
        __asyncGenerator,
        __asyncDelegator,
        __asyncValues,
        __makeTemplateObject,
        __importStar,
        __importDefault,
        __classPrivateFieldGet,
        __classPrivateFieldSet,
        __classPrivateFieldIn,
        __addDisposableResource,
        __disposeResources,
        __rewriteRelativeImportExtension
      };
    }
  });

  // node_modules/@forge/bridge/out/router/targets.js
  var require_targets = __commonJS({
    "node_modules/@forge/bridge/out/router/targets.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NavigationTarget = void 0;
      exports.NavigationTarget = {
        ContentView: "contentView",
        ContentEdit: "contentEdit",
        ContentList: "contentList",
        SpaceView: "spaceView",
        Module: "module",
        UserProfile: "userProfile",
        Dashboard: "dashboard",
        Issue: "issue",
        ProjectSettingsDetails: "projectSettingsDetails"
      };
    }
  });

  // node_modules/@forge/bridge/out/errors.js
  var require_errors = __commonJS({
    "node_modules/@forge/bridge/out/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BridgeAPIError = void 0;
      var BridgeAPIError = class extends Error {
      };
      exports.BridgeAPIError = BridgeAPIError;
    }
  });

  // node_modules/@forge/bridge/out/bridge.js
  var require_bridge = __commonJS({
    "node_modules/@forge/bridge/out/bridge.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getCallBridge = void 0;
      var errors_1 = require_errors();
      function isBridgeAvailable(bridge) {
        return !!(bridge === null || bridge === void 0 ? void 0 : bridge.callBridge);
      }
      var getCallBridge = () => {
        if (!isBridgeAvailable(window.__bridge)) {
          throw new errors_1.BridgeAPIError(`
      Unable to establish a connection with the Custom UI bridge.
      If you are trying to run your app locally, Forge apps only work in the context of Atlassian products. Refer to https://go.atlassian.com/forge-tunneling-with-custom-ui for how to tunnel when using a local development server.
    `);
        }
        return window.__bridge.callBridge;
      };
      exports.getCallBridge = getCallBridge;
    }
  });

  // node_modules/@forge/bridge/out/utils/index.js
  var require_utils = __commonJS({
    "node_modules/@forge/bridge/out/utils/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.withRateLimiter = void 0;
      var errors_1 = require_errors();
      var withRateLimiter = (wrappedFn, maxOps, intervalInMs, exceededErrorMessage) => {
        let start = Date.now();
        let numOps = 0;
        return async (...args) => {
          const now = Date.now();
          const elapsed = now - start;
          if (elapsed > intervalInMs) {
            start = now;
            numOps = 0;
          }
          if (numOps >= maxOps) {
            throw new errors_1.BridgeAPIError(exceededErrorMessage || "Too many invocations.");
          }
          numOps = numOps + 1;
          return wrappedFn(...args);
        };
      };
      exports.withRateLimiter = withRateLimiter;
    }
  });

  // node_modules/@forge/bridge/out/invoke/invoke.js
  var require_invoke = __commonJS({
    "node_modules/@forge/bridge/out/invoke/invoke.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.makeInvoke = exports.invoke = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      var callBridge = (0, bridge_1.getCallBridge)();
      var validatePayload = (payload) => {
        if (!payload)
          return;
        if (Object.values(payload).some((val) => typeof val === "function")) {
          throw new errors_1.BridgeAPIError("Passing functions as part of the payload is not supported!");
        }
      };
      var _invoke = (functionKey, payload) => {
        if (typeof functionKey !== "string") {
          throw new errors_1.BridgeAPIError("functionKey must be a string!");
        }
        validatePayload(payload);
        return callBridge("invoke", { functionKey, payload });
      };
      exports.invoke = (0, utils_1.withRateLimiter)(_invoke, 500, 1e3 * 25, "Resolver calls are rate limited at 500req/25s");
      function makeInvoke() {
        return exports.invoke;
      }
      exports.makeInvoke = makeInvoke;
    }
  });

  // node_modules/@forge/bridge/out/invoke/index.js
  var require_invoke2 = __commonJS({
    "node_modules/@forge/bridge/out/invoke/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_invoke(), exports);
    }
  });

  // node_modules/@forge/bridge/out/invoke-endpoint/invoke-endpoint.js
  var require_invoke_endpoint = __commonJS({
    "node_modules/@forge/bridge/out/invoke-endpoint/invoke-endpoint.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._invokeEndpointFn = exports.InvokeType = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      var MAX_NUM_OPERATIONS = 500;
      var OPERATION_INTERVAL_SEC = 25;
      var OPERATION_INTERVAL_MS = 1e3 * OPERATION_INTERVAL_SEC;
      var InvokeType;
      (function(InvokeType2) {
        InvokeType2["REMOTE"] = "Remote";
        InvokeType2["SERVICE"] = "Container";
      })(InvokeType = exports.InvokeType || (exports.InvokeType = {}));
      var callBridge = (0, bridge_1.getCallBridge)();
      var validatePayload = (payload) => {
        if (!payload)
          return;
        if (Object.values(payload).some((val) => typeof val === "function")) {
          throw new errors_1.BridgeAPIError("Passing functions as part of the payload is not supported!");
        }
      };
      var _setupInvokeEndpointFn = (invokeType) => async (input) => {
        validatePayload(input);
        const callBridgePayload = {
          ...input,
          invokeType: `ui-${invokeType.toLowerCase()}-fetch`
        };
        const bridgeResponse = await callBridge("invoke", callBridgePayload);
        const { success, payload, error } = bridgeResponse !== null && bridgeResponse !== void 0 ? bridgeResponse : {};
        const response = { ...success ? payload : error };
        if (response && response.headers) {
          for (const header in response.headers) {
            if (Array.isArray(response.headers[header])) {
              response.headers[header] = response.headers[header].join(",");
            }
          }
        }
        return response;
      };
      var _invokeEndpointFn = (invokeType) => {
        const invokeEndpointFn = _setupInvokeEndpointFn(invokeType);
        return (0, utils_1.withRateLimiter)(invokeEndpointFn, MAX_NUM_OPERATIONS, OPERATION_INTERVAL_MS, `${invokeType} invocation calls are rate limited at ${MAX_NUM_OPERATIONS}/${OPERATION_INTERVAL_SEC}s`);
      };
      exports._invokeEndpointFn = _invokeEndpointFn;
    }
  });

  // node_modules/@forge/bridge/out/invoke-endpoint/invoke-remote.js
  var require_invoke_remote = __commonJS({
    "node_modules/@forge/bridge/out/invoke-endpoint/invoke-remote.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.invokeRemote = void 0;
      var invoke_endpoint_1 = require_invoke_endpoint();
      var invokeRemote = (input) => {
        const invokeEndpoint = (0, invoke_endpoint_1._invokeEndpointFn)(invoke_endpoint_1.InvokeType.REMOTE);
        return invokeEndpoint(input);
      };
      exports.invokeRemote = invokeRemote;
    }
  });

  // node_modules/@forge/bridge/out/invoke-endpoint/invoke-service.js
  var require_invoke_service = __commonJS({
    "node_modules/@forge/bridge/out/invoke-endpoint/invoke-service.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.invokeService = void 0;
      var invoke_endpoint_1 = require_invoke_endpoint();
      var invokeService = (input) => {
        const invokeEndpoint = (0, invoke_endpoint_1._invokeEndpointFn)(invoke_endpoint_1.InvokeType.SERVICE);
        return invokeEndpoint(input);
      };
      exports.invokeService = invokeService;
    }
  });

  // node_modules/@forge/bridge/out/invoke-endpoint/index.js
  var require_invoke_endpoint2 = __commonJS({
    "node_modules/@forge/bridge/out/invoke-endpoint/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_invoke_remote(), exports);
      tslib_1.__exportStar(require_invoke_service(), exports);
    }
  });

  // node_modules/@forge/bridge/out/view/submit.js
  var require_submit = __commonJS({
    "node_modules/@forge/bridge/out/view/submit.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.submit = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var submit = async (payload) => {
        const success = await callBridge("submit", payload);
        if (success === false) {
          throw new errors_1.BridgeAPIError("this resource's view is not submittable.");
        }
      };
      exports.submit = submit;
    }
  });

  // node_modules/@forge/bridge/out/view/close.js
  var require_close = __commonJS({
    "node_modules/@forge/bridge/out/view/close.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.close = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var close = async (payload) => {
        try {
          const success = await callBridge("close", payload);
          if (success === false) {
            throw new errors_1.BridgeAPIError("this resource's view is not closable.");
          }
        } catch (e) {
          throw new errors_1.BridgeAPIError("this resource's view is not closable.");
        }
      };
      exports.close = close;
    }
  });

  // node_modules/@forge/bridge/out/view/open.js
  var require_open = __commonJS({
    "node_modules/@forge/bridge/out/view/open.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.open = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var open = async () => {
        try {
          const success = await callBridge("open");
          if (success === false) {
            throw new errors_1.BridgeAPIError("this resource's view is not openable.");
          }
        } catch (e) {
          throw new errors_1.BridgeAPIError("this resource's view is not openable.");
        }
      };
      exports.open = open;
    }
  });

  // node_modules/@forge/bridge/out/view/refresh.js
  var require_refresh = __commonJS({
    "node_modules/@forge/bridge/out/view/refresh.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.refresh = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var refresh = async (payload) => {
        const success = await callBridge("refresh", payload);
        if (success === false) {
          throw new errors_1.BridgeAPIError("this resource's view is not refreshable.");
        }
      };
      exports.refresh = refresh;
    }
  });

  // node_modules/@forge/bridge/out/view/createHistory.js
  var require_createHistory = __commonJS({
    "node_modules/@forge/bridge/out/view/createHistory.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createHistory = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var createHistory = async () => {
        const history = await callBridge("createHistory");
        history.listen((location) => {
          history.location = location;
        });
        return history;
      };
      exports.createHistory = createHistory;
    }
  });

  // node_modules/@forge/i18n/out/constants.js
  var require_constants = __commonJS({
    "node_modules/@forge/i18n/out/constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FORGE_SUPPORTED_LOCALE_CODES = exports.I18N_BUNDLE_FOLDER_NAME = exports.I18N_INFO_FILE_NAME = void 0;
      exports.I18N_INFO_FILE_NAME = "i18n-info.json";
      exports.I18N_BUNDLE_FOLDER_NAME = "__LOCALES__";
      exports.FORGE_SUPPORTED_LOCALE_CODES = [
        "zh-CN",
        "zh-TW",
        "cs-CZ",
        "da-DK",
        "nl-NL",
        "en-US",
        "en-GB",
        "et-EE",
        "fi-FI",
        "fr-FR",
        "de-DE",
        "hu-HU",
        "is-IS",
        "it-IT",
        "ja-JP",
        "ko-KR",
        "no-NO",
        "pl-PL",
        "pt-BR",
        "pt-PT",
        "ro-RO",
        "ru-RU",
        "sk-SK",
        "tr-TR",
        "es-ES",
        "sv-SE"
      ];
    }
  });

  // node_modules/@forge/i18n/out/translationsGetter.js
  var require_translationsGetter = __commonJS({
    "node_modules/@forge/i18n/out/translationsGetter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TranslationsGetter = exports.TranslationGetterError = void 0;
      var pushIfNotExists = (array, item) => {
        if (!array.includes(item)) {
          array.push(item);
        }
      };
      var TranslationGetterError = class extends Error {
        constructor(message) {
          super(message);
          this.name = "TranslationGetterError";
        }
      };
      exports.TranslationGetterError = TranslationGetterError;
      var TranslationsGetter = class {
        resourcesAccessor;
        i18nInfoConfig = null;
        translationResources = /* @__PURE__ */ new Map();
        constructor(resourcesAccessor) {
          this.resourcesAccessor = resourcesAccessor;
        }
        async getTranslations(locale, options = { fallback: true }) {
          const i18nInfoConfig = await this.getI18nInfoConfig();
          const { fallback } = options;
          if (!fallback) {
            let translationResource;
            if (i18nInfoConfig.locales.includes(locale)) {
              translationResource = await this.getTranslationResource(locale);
            }
            return {
              translations: translationResource ?? null,
              locale
            };
          }
          for (const targetLocale of this.getLocaleLookupOrder(locale, i18nInfoConfig)) {
            const translationResource = await this.getTranslationResource(targetLocale);
            if (translationResource) {
              return {
                translations: translationResource,
                locale: targetLocale
              };
            }
          }
          return {
            translations: null,
            locale
          };
        }
        async getTranslationsByLocaleLookupOrder(locale) {
          const i18nInfoConfig = await this.getI18nInfoConfig();
          const lookupOrder = this.getLocaleLookupOrder(locale, i18nInfoConfig);
          return await Promise.all(lookupOrder.map(async (targetLocale) => {
            const translationResource = await this.getTranslationResource(targetLocale);
            return {
              locale: targetLocale,
              translations: translationResource
            };
          }));
        }
        reset() {
          this.i18nInfoConfig = null;
          this.translationResources.clear();
        }
        async getTranslationResource(locale) {
          let resource = this.translationResources.get(locale);
          if (!resource) {
            try {
              resource = await this.resourcesAccessor.getTranslationResource(locale);
              this.translationResources.set(locale, resource);
            } catch (error) {
              if (error instanceof TranslationGetterError) {
                throw error;
              }
              throw new TranslationGetterError(`Failed to get translation resource for locale: ${locale}`);
            }
          }
          return resource;
        }
        async getI18nInfoConfig() {
          if (!this.i18nInfoConfig) {
            try {
              this.i18nInfoConfig = await this.resourcesAccessor.getI18nInfoConfig();
            } catch (error) {
              if (error instanceof TranslationGetterError) {
                throw error;
              }
              throw new TranslationGetterError("Failed to get i18n info config");
            }
          }
          return this.i18nInfoConfig;
        }
        getLocaleLookupOrder(locale, config) {
          const { locales, fallback } = config;
          const lookupOrder = [locale];
          const fallbackLocales = fallback[locale];
          if (fallbackLocales && Array.isArray(fallbackLocales) && fallbackLocales.length > 0) {
            lookupOrder.push(...fallbackLocales);
          }
          pushIfNotExists(lookupOrder, config.fallback.default);
          return lookupOrder.filter((locale2) => locales.includes(locale2));
        }
      };
      exports.TranslationsGetter = TranslationsGetter;
    }
  });

  // node_modules/lodash/isArray.js
  var require_isArray = __commonJS({
    "node_modules/lodash/isArray.js"(exports, module) {
      var isArray = Array.isArray;
      module.exports = isArray;
    }
  });

  // node_modules/lodash/_freeGlobal.js
  var require_freeGlobal = __commonJS({
    "node_modules/lodash/_freeGlobal.js"(exports, module) {
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      module.exports = freeGlobal;
    }
  });

  // node_modules/lodash/_root.js
  var require_root = __commonJS({
    "node_modules/lodash/_root.js"(exports, module) {
      var freeGlobal = require_freeGlobal();
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      module.exports = root;
    }
  });

  // node_modules/lodash/_Symbol.js
  var require_Symbol = __commonJS({
    "node_modules/lodash/_Symbol.js"(exports, module) {
      var root = require_root();
      var Symbol2 = root.Symbol;
      module.exports = Symbol2;
    }
  });

  // node_modules/lodash/_getRawTag.js
  var require_getRawTag = __commonJS({
    "node_modules/lodash/_getRawTag.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var nativeObjectToString = objectProto.toString;
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }
      module.exports = getRawTag;
    }
  });

  // node_modules/lodash/_objectToString.js
  var require_objectToString = __commonJS({
    "node_modules/lodash/_objectToString.js"(exports, module) {
      var objectProto = Object.prototype;
      var nativeObjectToString = objectProto.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      module.exports = objectToString;
    }
  });

  // node_modules/lodash/_baseGetTag.js
  var require_baseGetTag = __commonJS({
    "node_modules/lodash/_baseGetTag.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var getRawTag = require_getRawTag();
      var objectToString = require_objectToString();
      var nullTag = "[object Null]";
      var undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      module.exports = baseGetTag;
    }
  });

  // node_modules/lodash/isObjectLike.js
  var require_isObjectLike = __commonJS({
    "node_modules/lodash/isObjectLike.js"(exports, module) {
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      module.exports = isObjectLike;
    }
  });

  // node_modules/lodash/isSymbol.js
  var require_isSymbol = __commonJS({
    "node_modules/lodash/isSymbol.js"(exports, module) {
      var baseGetTag = require_baseGetTag();
      var isObjectLike = require_isObjectLike();
      var symbolTag = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      module.exports = isSymbol;
    }
  });

  // node_modules/lodash/_isKey.js
  var require_isKey = __commonJS({
    "node_modules/lodash/_isKey.js"(exports, module) {
      var isArray = require_isArray();
      var isSymbol = require_isSymbol();
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      var reIsPlainProp = /^\w*$/;
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      module.exports = isKey;
    }
  });

  // node_modules/lodash/isObject.js
  var require_isObject = __commonJS({
    "node_modules/lodash/isObject.js"(exports, module) {
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      module.exports = isObject;
    }
  });

  // node_modules/lodash/isFunction.js
  var require_isFunction = __commonJS({
    "node_modules/lodash/isFunction.js"(exports, module) {
      var baseGetTag = require_baseGetTag();
      var isObject = require_isObject();
      var asyncTag = "[object AsyncFunction]";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      module.exports = isFunction;
    }
  });

  // node_modules/lodash/_coreJsData.js
  var require_coreJsData = __commonJS({
    "node_modules/lodash/_coreJsData.js"(exports, module) {
      var root = require_root();
      var coreJsData = root["__core-js_shared__"];
      module.exports = coreJsData;
    }
  });

  // node_modules/lodash/_isMasked.js
  var require_isMasked = __commonJS({
    "node_modules/lodash/_isMasked.js"(exports, module) {
      var coreJsData = require_coreJsData();
      var maskSrcKey = (function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      })();
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      module.exports = isMasked;
    }
  });

  // node_modules/lodash/_toSource.js
  var require_toSource = __commonJS({
    "node_modules/lodash/_toSource.js"(exports, module) {
      var funcProto = Function.prototype;
      var funcToString = funcProto.toString;
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      module.exports = toSource;
    }
  });

  // node_modules/lodash/_baseIsNative.js
  var require_baseIsNative = __commonJS({
    "node_modules/lodash/_baseIsNative.js"(exports, module) {
      var isFunction = require_isFunction();
      var isMasked = require_isMasked();
      var isObject = require_isObject();
      var toSource = require_toSource();
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      module.exports = baseIsNative;
    }
  });

  // node_modules/lodash/_getValue.js
  var require_getValue = __commonJS({
    "node_modules/lodash/_getValue.js"(exports, module) {
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      module.exports = getValue;
    }
  });

  // node_modules/lodash/_getNative.js
  var require_getNative = __commonJS({
    "node_modules/lodash/_getNative.js"(exports, module) {
      var baseIsNative = require_baseIsNative();
      var getValue = require_getValue();
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      module.exports = getNative;
    }
  });

  // node_modules/lodash/_nativeCreate.js
  var require_nativeCreate = __commonJS({
    "node_modules/lodash/_nativeCreate.js"(exports, module) {
      var getNative = require_getNative();
      var nativeCreate = getNative(Object, "create");
      module.exports = nativeCreate;
    }
  });

  // node_modules/lodash/_hashClear.js
  var require_hashClear = __commonJS({
    "node_modules/lodash/_hashClear.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      module.exports = hashClear;
    }
  });

  // node_modules/lodash/_hashDelete.js
  var require_hashDelete = __commonJS({
    "node_modules/lodash/_hashDelete.js"(exports, module) {
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      module.exports = hashDelete;
    }
  });

  // node_modules/lodash/_hashGet.js
  var require_hashGet = __commonJS({
    "node_modules/lodash/_hashGet.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      module.exports = hashGet;
    }
  });

  // node_modules/lodash/_hashHas.js
  var require_hashHas = __commonJS({
    "node_modules/lodash/_hashHas.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      module.exports = hashHas;
    }
  });

  // node_modules/lodash/_hashSet.js
  var require_hashSet = __commonJS({
    "node_modules/lodash/_hashSet.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      module.exports = hashSet;
    }
  });

  // node_modules/lodash/_Hash.js
  var require_Hash = __commonJS({
    "node_modules/lodash/_Hash.js"(exports, module) {
      var hashClear = require_hashClear();
      var hashDelete = require_hashDelete();
      var hashGet = require_hashGet();
      var hashHas = require_hashHas();
      var hashSet = require_hashSet();
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      module.exports = Hash;
    }
  });

  // node_modules/lodash/_listCacheClear.js
  var require_listCacheClear = __commonJS({
    "node_modules/lodash/_listCacheClear.js"(exports, module) {
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      module.exports = listCacheClear;
    }
  });

  // node_modules/lodash/eq.js
  var require_eq = __commonJS({
    "node_modules/lodash/eq.js"(exports, module) {
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      module.exports = eq;
    }
  });

  // node_modules/lodash/_assocIndexOf.js
  var require_assocIndexOf = __commonJS({
    "node_modules/lodash/_assocIndexOf.js"(exports, module) {
      var eq = require_eq();
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      module.exports = assocIndexOf;
    }
  });

  // node_modules/lodash/_listCacheDelete.js
  var require_listCacheDelete = __commonJS({
    "node_modules/lodash/_listCacheDelete.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      var arrayProto = Array.prototype;
      var splice = arrayProto.splice;
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      module.exports = listCacheDelete;
    }
  });

  // node_modules/lodash/_listCacheGet.js
  var require_listCacheGet = __commonJS({
    "node_modules/lodash/_listCacheGet.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      module.exports = listCacheGet;
    }
  });

  // node_modules/lodash/_listCacheHas.js
  var require_listCacheHas = __commonJS({
    "node_modules/lodash/_listCacheHas.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      module.exports = listCacheHas;
    }
  });

  // node_modules/lodash/_listCacheSet.js
  var require_listCacheSet = __commonJS({
    "node_modules/lodash/_listCacheSet.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      module.exports = listCacheSet;
    }
  });

  // node_modules/lodash/_ListCache.js
  var require_ListCache = __commonJS({
    "node_modules/lodash/_ListCache.js"(exports, module) {
      var listCacheClear = require_listCacheClear();
      var listCacheDelete = require_listCacheDelete();
      var listCacheGet = require_listCacheGet();
      var listCacheHas = require_listCacheHas();
      var listCacheSet = require_listCacheSet();
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      module.exports = ListCache;
    }
  });

  // node_modules/lodash/_Map.js
  var require_Map = __commonJS({
    "node_modules/lodash/_Map.js"(exports, module) {
      var getNative = require_getNative();
      var root = require_root();
      var Map2 = getNative(root, "Map");
      module.exports = Map2;
    }
  });

  // node_modules/lodash/_mapCacheClear.js
  var require_mapCacheClear = __commonJS({
    "node_modules/lodash/_mapCacheClear.js"(exports, module) {
      var Hash = require_Hash();
      var ListCache = require_ListCache();
      var Map2 = require_Map();
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map2 || ListCache)(),
          "string": new Hash()
        };
      }
      module.exports = mapCacheClear;
    }
  });

  // node_modules/lodash/_isKeyable.js
  var require_isKeyable = __commonJS({
    "node_modules/lodash/_isKeyable.js"(exports, module) {
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      module.exports = isKeyable;
    }
  });

  // node_modules/lodash/_getMapData.js
  var require_getMapData = __commonJS({
    "node_modules/lodash/_getMapData.js"(exports, module) {
      var isKeyable = require_isKeyable();
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      module.exports = getMapData;
    }
  });

  // node_modules/lodash/_mapCacheDelete.js
  var require_mapCacheDelete = __commonJS({
    "node_modules/lodash/_mapCacheDelete.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheDelete(key) {
        var result = getMapData(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      module.exports = mapCacheDelete;
    }
  });

  // node_modules/lodash/_mapCacheGet.js
  var require_mapCacheGet = __commonJS({
    "node_modules/lodash/_mapCacheGet.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      module.exports = mapCacheGet;
    }
  });

  // node_modules/lodash/_mapCacheHas.js
  var require_mapCacheHas = __commonJS({
    "node_modules/lodash/_mapCacheHas.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      module.exports = mapCacheHas;
    }
  });

  // node_modules/lodash/_mapCacheSet.js
  var require_mapCacheSet = __commonJS({
    "node_modules/lodash/_mapCacheSet.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      module.exports = mapCacheSet;
    }
  });

  // node_modules/lodash/_MapCache.js
  var require_MapCache = __commonJS({
    "node_modules/lodash/_MapCache.js"(exports, module) {
      var mapCacheClear = require_mapCacheClear();
      var mapCacheDelete = require_mapCacheDelete();
      var mapCacheGet = require_mapCacheGet();
      var mapCacheHas = require_mapCacheHas();
      var mapCacheSet = require_mapCacheSet();
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      module.exports = MapCache;
    }
  });

  // node_modules/lodash/memoize.js
  var require_memoize = __commonJS({
    "node_modules/lodash/memoize.js"(exports, module) {
      var MapCache = require_MapCache();
      var FUNC_ERROR_TEXT = "Expected a function";
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      module.exports = memoize;
    }
  });

  // node_modules/lodash/_memoizeCapped.js
  var require_memoizeCapped = __commonJS({
    "node_modules/lodash/_memoizeCapped.js"(exports, module) {
      var memoize = require_memoize();
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func) {
        var result = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result.cache;
        return result;
      }
      module.exports = memoizeCapped;
    }
  });

  // node_modules/lodash/_stringToPath.js
  var require_stringToPath = __commonJS({
    "node_modules/lodash/_stringToPath.js"(exports, module) {
      var memoizeCapped = require_memoizeCapped();
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string) {
        var result = [];
        if (string.charCodeAt(0) === 46) {
          result.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      module.exports = stringToPath;
    }
  });

  // node_modules/lodash/_arrayMap.js
  var require_arrayMap = __commonJS({
    "node_modules/lodash/_arrayMap.js"(exports, module) {
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      module.exports = arrayMap;
    }
  });

  // node_modules/lodash/_baseToString.js
  var require_baseToString = __commonJS({
    "node_modules/lodash/_baseToString.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var arrayMap = require_arrayMap();
      var isArray = require_isArray();
      var isSymbol = require_isSymbol();
      var INFINITY = 1 / 0;
      var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
      var symbolToString = symbolProto ? symbolProto.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      module.exports = baseToString;
    }
  });

  // node_modules/lodash/toString.js
  var require_toString = __commonJS({
    "node_modules/lodash/toString.js"(exports, module) {
      var baseToString = require_baseToString();
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      module.exports = toString;
    }
  });

  // node_modules/lodash/_castPath.js
  var require_castPath = __commonJS({
    "node_modules/lodash/_castPath.js"(exports, module) {
      var isArray = require_isArray();
      var isKey = require_isKey();
      var stringToPath = require_stringToPath();
      var toString = require_toString();
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      module.exports = castPath;
    }
  });

  // node_modules/lodash/_toKey.js
  var require_toKey = __commonJS({
    "node_modules/lodash/_toKey.js"(exports, module) {
      var isSymbol = require_isSymbol();
      var INFINITY = 1 / 0;
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      module.exports = toKey;
    }
  });

  // node_modules/lodash/_baseGet.js
  var require_baseGet = __commonJS({
    "node_modules/lodash/_baseGet.js"(exports, module) {
      var castPath = require_castPath();
      var toKey = require_toKey();
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      module.exports = baseGet;
    }
  });

  // node_modules/lodash/get.js
  var require_get = __commonJS({
    "node_modules/lodash/get.js"(exports, module) {
      var baseGet = require_baseGet();
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      module.exports = get;
    }
  });

  // node_modules/@forge/i18n/out/translationValueGetter.js
  var require_translationValueGetter = __commonJS({
    "node_modules/@forge/i18n/out/translationValueGetter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getTranslationValueFromContent = exports.getTranslationValue = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      var get_1 = tslib_1.__importDefault(require_get());
      var getTranslationValue = (translationLookup, i18nKey, locale) => {
        const translation = translationLookup[locale];
        if (!translation) {
          return null;
        }
        return (0, exports.getTranslationValueFromContent)(translation, i18nKey);
      };
      exports.getTranslationValue = getTranslationValue;
      var getTranslationValueFromContent = (translationContent, i18nKey) => {
        let translationValue = translationContent[i18nKey];
        if (!translationValue) {
          const keyTokens = i18nKey.split(".");
          if (keyTokens.length > 1) {
            translationValue = (0, get_1.default)(translationContent, keyTokens, null);
          }
        }
        return typeof translationValue === "string" ? translationValue : null;
      };
      exports.getTranslationValueFromContent = getTranslationValueFromContent;
    }
  });

  // node_modules/@forge/i18n/out/translator.js
  var require_translator = __commonJS({
    "node_modules/@forge/i18n/out/translator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Translator = void 0;
      var translationValueGetter_1 = require_translationValueGetter();
      var Translator = class {
        locale;
        translationsGetter;
        localeLookupOrderedTranslations = null;
        cache = /* @__PURE__ */ new Map();
        constructor(locale, translationsGetter) {
          this.locale = locale;
          this.translationsGetter = translationsGetter;
        }
        async init() {
          this.localeLookupOrderedTranslations = await this.translationsGetter.getTranslationsByLocaleLookupOrder(this.locale);
        }
        translate(i18nKey) {
          if (!this.localeLookupOrderedTranslations) {
            throw new Error("TranslationLookup not initialized");
          }
          let result = this.cache.get(i18nKey);
          if (result === void 0) {
            for (const { translations } of this.localeLookupOrderedTranslations) {
              const translationValue = (0, translationValueGetter_1.getTranslationValueFromContent)(translations, i18nKey);
              if (translationValue !== null) {
                result = translationValue;
                break;
              }
            }
            result = result ?? null;
            this.cache.set(i18nKey, result);
          }
          return result;
        }
      };
      exports.Translator = Translator;
    }
  });

  // node_modules/@forge/i18n/out/ensureLocale.js
  var require_ensureLocale = __commonJS({
    "node_modules/@forge/i18n/out/ensureLocale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ensureLocale = void 0;
      var constants_1 = require_constants();
      var forgeSupportedLocaleCodesSet = new Set(constants_1.FORGE_SUPPORTED_LOCALE_CODES);
      var localeFallbacks = {
        "en-UK": "en-GB",
        "nb-NO": "no-NO"
      };
      var languageToLocaleCodeMap = constants_1.FORGE_SUPPORTED_LOCALE_CODES.reduce((agg, code) => {
        const [lng] = code.split("-");
        if (!agg[lng]) {
          agg[lng] = code;
        }
        return agg;
      }, {
        nb: "no-NO",
        pt: "pt-PT"
      });
      var ensureLocale = (rawLocale) => {
        const locale = rawLocale.replace("_", "-");
        if (forgeSupportedLocaleCodesSet.has(locale)) {
          return locale;
        }
        return languageToLocaleCodeMap[locale] ?? localeFallbacks[locale] ?? null;
      };
      exports.ensureLocale = ensureLocale;
    }
  });

  // node_modules/@forge/i18n/out/moduleI18nHelper.js
  var require_moduleI18nHelper = __commonJS({
    "node_modules/@forge/i18n/out/moduleI18nHelper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getI18nSupportedModuleEntries = void 0;
      var isObject = (value) => {
        return typeof value === "object" && value !== null && !Array.isArray(value);
      };
      var isI18nValue = (value) => {
        return typeof value?.i18n === "string";
      };
      var isConnectModuleKey = (moduleKey) => moduleKey.startsWith("connect-");
      var isCoreModuleKey = (moduleKey) => moduleKey.startsWith("core:");
      var getI18nKeysFromObject = (obj) => {
        const visited = /* @__PURE__ */ new Set();
        const visit = (value, i18nPath) => {
          if (!isObject(value) || visited.has(value)) {
            return [];
          }
          visited.add(value);
          return Object.entries(value).flatMap(([propKey, propValue]) => {
            const currentPath = [...i18nPath, propKey];
            if (isI18nValue(propValue)) {
              return [{ propertyPath: currentPath, key: propValue.i18n }];
            } else if (Array.isArray(propValue)) {
              return propValue.flatMap((item) => visit(item, currentPath));
            }
            return visit(propValue, currentPath);
          });
        };
        return visit(obj, []);
      };
      var getI18nSupportedModuleEntries = (modules) => {
        return Object.entries(modules).flatMap(([moduleKey, moduleEntries]) => {
          if (!isConnectModuleKey(moduleKey) && !isCoreModuleKey(moduleKey) && moduleEntries && Array.isArray(moduleEntries) && moduleEntries.length > 0) {
            return moduleEntries.map((moduleEntry) => [moduleEntry, moduleKey]);
          }
          return [];
        });
      };
      exports.getI18nSupportedModuleEntries = getI18nSupportedModuleEntries;
      var extractI18nKeysFromModules = (modules) => {
        const i18nKeys = /* @__PURE__ */ new Set();
        for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
          const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
          for (const { key } of i18nKeysForEntryValue) {
            i18nKeys.add(key);
          }
        }
        return i18nKeys.size > 0 ? Array.from(i18nKeys) : [];
      };
      exports.extractI18nKeysFromModules = extractI18nKeysFromModules;
      var extractI18nPropertiesFromModules = (modules) => {
        const moduleI18nProperties = [];
        for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
          const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
          for (const i18nObj of i18nKeysForEntryValue) {
            moduleI18nProperties.push({ moduleName: moduleEntry[1], ...i18nObj });
          }
        }
        return moduleI18nProperties;
      };
      exports.extractI18nPropertiesFromModules = extractI18nPropertiesFromModules;
    }
  });

  // node_modules/@forge/i18n/out/types.js
  var require_types = __commonJS({
    "node_modules/@forge/i18n/out/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@forge/i18n/out/index.js
  var require_out = __commonJS({
    "node_modules/@forge/i18n/out/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getI18nSupportedModuleEntries = exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getTranslationValue = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_constants(), exports);
      tslib_1.__exportStar(require_translationsGetter(), exports);
      tslib_1.__exportStar(require_translator(), exports);
      tslib_1.__exportStar(require_ensureLocale(), exports);
      var translationValueGetter_1 = require_translationValueGetter();
      Object.defineProperty(exports, "getTranslationValue", { enumerable: true, get: function() {
        return translationValueGetter_1.getTranslationValue;
      } });
      var moduleI18nHelper_1 = require_moduleI18nHelper();
      Object.defineProperty(exports, "extractI18nKeysFromModules", { enumerable: true, get: function() {
        return moduleI18nHelper_1.extractI18nKeysFromModules;
      } });
      Object.defineProperty(exports, "extractI18nPropertiesFromModules", { enumerable: true, get: function() {
        return moduleI18nHelper_1.extractI18nPropertiesFromModules;
      } });
      Object.defineProperty(exports, "getI18nSupportedModuleEntries", { enumerable: true, get: function() {
        return moduleI18nHelper_1.getI18nSupportedModuleEntries;
      } });
      tslib_1.__exportStar(require_types(), exports);
    }
  });

  // node_modules/@forge/bridge/out/view/getContext.js
  var require_getContext = __commonJS({
    "node_modules/@forge/bridge/out/view/getContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getContext = void 0;
      var bridge_1 = require_bridge();
      var i18n_1 = require_out();
      var callBridge = (0, bridge_1.getCallBridge)();
      var getContext = async () => {
        var _a;
        const context = await callBridge("getContext");
        const locale = context === null || context === void 0 ? void 0 : context.locale;
        if (locale) {
          context.locale = (_a = (0, i18n_1.ensureLocale)(locale)) !== null && _a !== void 0 ? _a : locale;
        }
        return context;
      };
      exports.getContext = getContext;
    }
  });

  // node_modules/@forge/bridge/out/view/changeWindowTitle.js
  var require_changeWindowTitle = __commonJS({
    "node_modules/@forge/bridge/out/view/changeWindowTitle.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.changeWindowTitle = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var changeWindowTitle = async (title) => {
        try {
          await callBridge("changeWindowTitle", title);
        } catch (e) {
          throw new errors_1.BridgeAPIError("the window title wasn't changed due to error.");
        }
      };
      exports.changeWindowTitle = changeWindowTitle;
    }
  });

  // node_modules/@forge/bridge/out/view/theme.js
  var require_theme = __commonJS({
    "node_modules/@forge/bridge/out/view/theme.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.theme = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      exports.theme = {
        enable: () => callBridge("enableTheming")
      };
    }
  });

  // node_modules/@forge/bridge/out/utils/blobParser.js
  var require_blobParser = __commonJS({
    "node_modules/@forge/bridge/out/utils/blobParser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.blobToBase64 = exports.base64ToBlob = void 0;
      var base64ToBlob = (b64string, mimeType) => {
        if (!b64string) {
          return null;
        }
        const base64Data = b64string.includes(";base64") ? b64string.split(",")[1] : b64string;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
      };
      exports.base64ToBlob = base64ToBlob;
      var blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      exports.blobToBase64 = blobToBase64;
    }
  });

  // node_modules/@forge/bridge/out/events/serialiseBlob.js
  var require_serialiseBlob = __commonJS({
    "node_modules/@forge/bridge/out/events/serialiseBlob.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.containsSerialisedBlobs = exports.containsBlobs = exports.deserialiseBlobsInPayload = exports.serialiseBlobsInPayload = void 0;
      var blobParser_1 = require_blobParser();
      var isPlainObject = (value) => {
        if (typeof value !== "object" || value === null)
          return false;
        if (Object.prototype.toString.call(value) !== "[object Object]")
          return false;
        const proto = Object.getPrototypeOf(value);
        if (proto === null)
          return true;
        const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
      };
      var blobToBase64WithMetadata = async (blob) => {
        const base64Data = await (0, blobParser_1.blobToBase64)(blob);
        return {
          data: base64Data,
          type: blob.type
        };
      };
      var base64WithMetadataToBlob = (metadata) => {
        return (0, blobParser_1.base64ToBlob)(metadata.data, metadata.type);
      };
      var serialiseBlobsInPayload = async (payload) => {
        if (payload instanceof Blob) {
          const blobData = await blobToBase64WithMetadata(payload);
          return {
            ...blobData,
            __isBlobData: true
          };
        }
        if (Array.isArray(payload)) {
          return Promise.all(payload.map((item) => (0, exports.serialiseBlobsInPayload)(item)));
        }
        if (payload && isPlainObject(payload)) {
          const entries = await Promise.all(Object.entries(payload).map(async ([key, value]) => [key, await (0, exports.serialiseBlobsInPayload)(value)]));
          return Object.fromEntries(entries);
        }
        return payload;
      };
      exports.serialiseBlobsInPayload = serialiseBlobsInPayload;
      var deserialiseBlobsInPayload = (payload) => {
        if (payload && isPlainObject(payload) && "__isBlobData" in payload) {
          const typedData = payload;
          return base64WithMetadataToBlob({
            data: typedData.data,
            type: typedData.type
          });
        }
        if (Array.isArray(payload)) {
          return payload.map((item) => (0, exports.deserialiseBlobsInPayload)(item));
        }
        if (payload && isPlainObject(payload)) {
          const result = {};
          for (const [key, value] of Object.entries(payload)) {
            result[key] = (0, exports.deserialiseBlobsInPayload)(value);
          }
          return result;
        }
        return payload;
      };
      exports.deserialiseBlobsInPayload = deserialiseBlobsInPayload;
      var containsBlobs = (payload) => {
        if (payload instanceof Blob) {
          return true;
        }
        if (Array.isArray(payload)) {
          return payload.some((item) => (0, exports.containsBlobs)(item));
        }
        if (payload && isPlainObject(payload)) {
          return Object.values(payload).some((value) => (0, exports.containsBlobs)(value));
        }
        return false;
      };
      exports.containsBlobs = containsBlobs;
      var containsSerialisedBlobs = (payload) => {
        if (payload && isPlainObject(payload) && "__isBlobData" in payload) {
          return true;
        }
        if (Array.isArray(payload)) {
          return payload.some((item) => (0, exports.containsSerialisedBlobs)(item));
        }
        if (payload && isPlainObject(payload)) {
          return Object.values(payload).some((value) => (0, exports.containsSerialisedBlobs)(value));
        }
        return false;
      };
      exports.containsSerialisedBlobs = containsSerialisedBlobs;
    }
  });

  // node_modules/@forge/bridge/out/events/events.js
  var require_events = __commonJS({
    "node_modules/@forge/bridge/out/events/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.events = void 0;
      var bridge_1 = require_bridge();
      var serialiseBlob_1 = require_serialiseBlob();
      var callBridge = (0, bridge_1.getCallBridge)();
      var emit = async (event, payload) => {
        let newPayload = payload;
        if ((0, serialiseBlob_1.containsBlobs)(payload)) {
          newPayload = await (0, serialiseBlob_1.serialiseBlobsInPayload)(payload);
        }
        return callBridge("emit", { event, payload: newPayload });
      };
      var on = (event, callback) => {
        const wrappedCallback = (payload) => {
          let newPayload = payload;
          if ((0, serialiseBlob_1.containsSerialisedBlobs)(payload)) {
            newPayload = (0, serialiseBlob_1.deserialiseBlobsInPayload)(payload);
          }
          return callback(newPayload);
        };
        return callBridge("on", { event, callback: wrappedCallback });
      };
      exports.events = {
        emit,
        on
      };
    }
  });

  // node_modules/@forge/bridge/out/view/emitReadyEvent.js
  var require_emitReadyEvent = __commonJS({
    "node_modules/@forge/bridge/out/view/emitReadyEvent.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.emitReadyEvent = void 0;
      var events_1 = require_events();
      var view_1 = require_view();
      var EXTENSION_READY = "EXTENSION_READY";
      var emitReadyEvent = async () => {
        const context = await view_1.view.getContext();
        await events_1.events.emit(EXTENSION_READY, {
          localId: context.localId
        });
      };
      exports.emitReadyEvent = emitReadyEvent;
    }
  });

  // node_modules/@forge/bridge/out/view/view.js
  var require_view = __commonJS({
    "node_modules/@forge/bridge/out/view/view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.view = void 0;
      var submit_1 = require_submit();
      var close_1 = require_close();
      var open_1 = require_open();
      var refresh_1 = require_refresh();
      var createHistory_1 = require_createHistory();
      var getContext_1 = require_getContext();
      var changeWindowTitle_1 = require_changeWindowTitle();
      var theme_1 = require_theme();
      var emitReadyEvent_1 = require_emitReadyEvent();
      exports.view = {
        submit: submit_1.submit,
        close: close_1.close,
        open: open_1.open,
        refresh: refresh_1.refresh,
        createHistory: createHistory_1.createHistory,
        getContext: getContext_1.getContext,
        theme: theme_1.theme,
        changeWindowTitle: changeWindowTitle_1.changeWindowTitle,
        emitReadyEvent: emitReadyEvent_1.emitReadyEvent
      };
    }
  });

  // node_modules/@forge/bridge/out/view/index.js
  var require_view2 = __commonJS({
    "node_modules/@forge/bridge/out/view/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_view(), exports);
    }
  });

  // node_modules/@forge/bridge/out/router/router.js
  var require_router = __commonJS({
    "node_modules/@forge/bridge/out/router/router.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.router = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var getUrl = async (location) => {
        if (!(location === null || location === void 0 ? void 0 : location.target)) {
          throw new Error("target is required for getUrl");
        }
        const url = await callBridge("getUrl", location);
        if (!url) {
          throw new Error("Failed to get URL");
        }
        try {
          return new URL(url);
        } catch (error) {
          throw new Error(`Failed to parse URL: ${url} (${error})`);
        }
      };
      var navigate = (location) => {
        if (typeof location === "string") {
          return callBridge("navigate", { url: location, type: "same-tab" });
        } else {
          if (!(location === null || location === void 0 ? void 0 : location.target)) {
            throw new Error("target is required for navigation");
          }
          return callBridge("navigate", { ...location, type: "same-tab" });
        }
      };
      var open = (location) => {
        if (typeof location === "string") {
          return callBridge("navigate", { url: location, type: "new-tab" });
        } else {
          if (!(location === null || location === void 0 ? void 0 : location.target)) {
            throw new Error("target is required for navigation");
          }
          return callBridge("navigate", { ...location, type: "new-tab" });
        }
      };
      var reload = async () => callBridge("reload");
      exports.router = {
        getUrl,
        navigate,
        open,
        reload
      };
    }
  });

  // node_modules/@forge/bridge/out/router/index.js
  var require_router2 = __commonJS({
    "node_modules/@forge/bridge/out/router/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_router(), exports);
    }
  });

  // node_modules/@forge/bridge/out/modal/modal.js
  var require_modal = __commonJS({
    "node_modules/@forge/bridge/out/modal/modal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Modal = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var noop = () => {
      };
      var Modal = class {
        constructor(opts) {
          var _a, _b;
          this.resource = (opts === null || opts === void 0 ? void 0 : opts.resource) || null;
          this.onClose = (opts === null || opts === void 0 ? void 0 : opts.onClose) || noop;
          this.size = (opts === null || opts === void 0 ? void 0 : opts.size) || "medium";
          this.context = (opts === null || opts === void 0 ? void 0 : opts.context) || {};
          this.closeOnEscape = (_a = opts === null || opts === void 0 ? void 0 : opts.closeOnEscape) !== null && _a !== void 0 ? _a : true;
          this.closeOnOverlayClick = (_b = opts === null || opts === void 0 ? void 0 : opts.closeOnOverlayClick) !== null && _b !== void 0 ? _b : true;
        }
        async open() {
          try {
            const success = await callBridge("openModal", {
              resource: this.resource,
              onClose: this.onClose,
              size: this.size,
              context: this.context,
              closeOnEscape: this.closeOnEscape,
              closeOnOverlayClick: this.closeOnOverlayClick
            });
            if (success === false) {
              throw new errors_1.BridgeAPIError("Unable to open modal.");
            }
          } catch (err) {
            throw new errors_1.BridgeAPIError("Unable to open modal.");
          }
        }
      };
      exports.Modal = Modal;
    }
  });

  // node_modules/@forge/bridge/out/modal/index.js
  var require_modal2 = __commonJS({
    "node_modules/@forge/bridge/out/modal/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_modal(), exports);
    }
  });

  // node_modules/@forge/bridge/out/fetch/fetch.js
  var require_fetch = __commonJS({
    "node_modules/@forge/bridge/out/fetch/fetch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.productFetchApi = void 0;
      var blobParser_1 = require_blobParser();
      var parseFormData = async (form) => {
        const parsed = {};
        for (const [key, value] of form.entries()) {
          if (key === "file") {
            const fileName = value.name;
            const fileType = value.type;
            parsed["file"] = await (0, blobParser_1.blobToBase64)(value);
            parsed["__fileName"] = fileName;
            parsed["__fileType"] = fileType;
          } else {
            parsed[key] = value;
          }
        }
        return JSON.stringify(parsed);
      };
      var validateFetchOptions = (init) => {
        if (!init) {
          return init;
        }
        if ("signal" in init) {
          const { signal: _signal, ...rest } = init;
          console.error("Signal is not supported in @forge/bridge and was removed from fetch options. Please use the fetch method from @forge/api for signal support.");
          return rest;
        }
        return init;
      };
      var parseRequest = async (init) => {
        const isFormData = (init === null || init === void 0 ? void 0 : init.body) instanceof FormData ? true : false;
        const requestBody = isFormData ? await parseFormData(init === null || init === void 0 ? void 0 : init.body) : init === null || init === void 0 ? void 0 : init.body;
        const req = new Request("", { body: requestBody, method: init === null || init === void 0 ? void 0 : init.method, headers: init === null || init === void 0 ? void 0 : init.headers });
        const headers = Object.fromEntries(req.headers.entries());
        const body = req.method !== "GET" ? await req.text() : null;
        return {
          body,
          headers: new Headers(headers),
          isMultipartFormData: isFormData
        };
      };
      var productFetchApi = (callBridge) => {
        const fetch2 = async (product, restPath, init) => {
          const validatedInit = validateFetchOptions(init);
          const { body: requestBody, headers: requestHeaders, isMultipartFormData } = await parseRequest(validatedInit);
          if (!requestHeaders.has("X-Atlassian-Token")) {
            requestHeaders.set("X-Atlassian-Token", "no-check");
          }
          const fetchPayload = {
            product,
            restPath,
            fetchRequestInit: {
              ...validatedInit,
              body: requestBody,
              headers: [...requestHeaders.entries()]
            },
            isMultipartFormData
          };
          const { body, headers, statusText, status, isAttachment } = await callBridge("fetchProduct", fetchPayload);
          const responseBody = isAttachment ? (0, blobParser_1.base64ToBlob)(body, headers["content-type"]) : body;
          return new Response(responseBody || null, { headers, status, statusText });
        };
        return {
          requestConfluence: (restPath, fetchOptions) => fetch2("confluence", restPath, fetchOptions),
          requestJira: (restPath, fetchOptions) => fetch2("jira", restPath, fetchOptions),
          requestBitbucket: (restPath, fetchOptions) => fetch2("bitbucket", restPath, fetchOptions)
        };
      };
      exports.productFetchApi = productFetchApi;
    }
  });

  // node_modules/@forge/bridge/out/fetch/index.js
  var require_fetch2 = __commonJS({
    "node_modules/@forge/bridge/out/fetch/index.js"(exports) {
      "use strict";
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.requestBitbucket = exports.requestJira = exports.requestConfluence = void 0;
      var bridge_1 = require_bridge();
      var fetch_1 = require_fetch();
      _a = (0, fetch_1.productFetchApi)((0, bridge_1.getCallBridge)()), exports.requestConfluence = _a.requestConfluence, exports.requestJira = _a.requestJira, exports.requestBitbucket = _a.requestBitbucket;
    }
  });

  // node_modules/@forge/bridge/out/flag/flag.js
  var require_flag = __commonJS({
    "node_modules/@forge/bridge/out/flag/flag.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.showFlag = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var showFlag = (options) => {
        var _a;
        if (!options.id) {
          throw new errors_1.BridgeAPIError('"id" must be defined in flag options');
        }
        const result = callBridge("showFlag", {
          ...options,
          type: (_a = options.type) !== null && _a !== void 0 ? _a : "info"
        });
        return {
          close: async () => {
            await result;
            return callBridge("closeFlag", { id: options.id });
          }
        };
      };
      exports.showFlag = showFlag;
    }
  });

  // node_modules/@forge/bridge/out/flag/index.js
  var require_flag2 = __commonJS({
    "node_modules/@forge/bridge/out/flag/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.showFlag = void 0;
      var flag_1 = require_flag();
      Object.defineProperty(exports, "showFlag", { enumerable: true, get: function() {
        return flag_1.showFlag;
      } });
    }
  });

  // node_modules/@forge/bridge/out/events/index.js
  var require_events2 = __commonJS({
    "node_modules/@forge/bridge/out/events/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_events(), exports);
    }
  });

  // node_modules/@forge/bridge/out/realtime/realtime.js
  var require_realtime = __commonJS({
    "node_modules/@forge/bridge/out/realtime/realtime.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.realtime = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var publish = (channel, payload, options) => {
        return callBridge("publishRealtimeChannel", { channelName: channel, eventPayload: payload, options });
      };
      var subscribe = (channel, callback, options) => {
        return callBridge("subscribeRealtimeChannel", { channelName: channel, onEvent: callback, options });
      };
      var publishGlobal = (channel, payload, options) => {
        return callBridge("publishRealtimeChannel", { channelName: channel, eventPayload: payload, options, isGlobal: true });
      };
      var subscribeGlobal = (channel, callback, options) => {
        return callBridge("subscribeRealtimeChannel", {
          channelName: channel,
          onEvent: callback,
          options,
          isGlobal: true
        });
      };
      exports.realtime = {
        publish,
        subscribe,
        publishGlobal,
        subscribeGlobal
      };
    }
  });

  // node_modules/@forge/bridge/out/realtime/productContext.js
  var require_productContext = __commonJS({
    "node_modules/@forge/bridge/out/realtime/productContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Jira = void 0;
      var Jira;
      (function(Jira2) {
        Jira2["Board"] = "board";
        Jira2["Issue"] = "issue";
        Jira2["Project"] = "project";
      })(Jira = exports.Jira || (exports.Jira = {}));
    }
  });

  // node_modules/@forge/bridge/out/realtime/index.js
  var require_realtime2 = __commonJS({
    "node_modules/@forge/bridge/out/realtime/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Jira = exports.realtime = void 0;
      var realtime_1 = require_realtime();
      Object.defineProperty(exports, "realtime", { enumerable: true, get: function() {
        return realtime_1.realtime;
      } });
      var productContext_1 = require_productContext();
      Object.defineProperty(exports, "Jira", { enumerable: true, get: function() {
        return productContext_1.Jira;
      } });
    }
  });

  // node_modules/@forge/bridge/out/i18n/index.js
  var require_i18n = __commonJS({
    "node_modules/@forge/bridge/out/i18n/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createTranslationFunction = exports.getTranslations = exports.resetTranslationsCache = void 0;
      var i18n_1 = require_out();
      var view_1 = require_view2();
      var frontendResourcesAccessor = {
        getI18nInfoConfig: async () => {
          const resp = await fetch(`./${i18n_1.I18N_BUNDLE_FOLDER_NAME}/${i18n_1.I18N_INFO_FILE_NAME}`);
          if (!resp.ok) {
            throw new Error("Failed to get i18n info config: " + resp.statusText);
          }
          const info = await resp.json();
          return info.config;
        },
        getTranslationResource: async (locale) => {
          const resp = await fetch(`./${i18n_1.I18N_BUNDLE_FOLDER_NAME}/${locale}.json`);
          if (!resp.ok) {
            throw new Error(`Failed to get translation resource for locale: ${locale}`);
          }
          return resp.json();
        }
      };
      var translationsGetter = new i18n_1.TranslationsGetter(frontendResourcesAccessor);
      var resetTranslationsCache = () => {
        translationsGetter.reset();
      };
      exports.resetTranslationsCache = resetTranslationsCache;
      var getTranslations = async (locale = null, options = {
        fallback: true
      }) => {
        let targetLocale = locale;
        if (!targetLocale) {
          const context = await view_1.view.getContext();
          targetLocale = context.locale;
        }
        return await translationsGetter.getTranslations(targetLocale, options);
      };
      exports.getTranslations = getTranslations;
      var createTranslationFunction = async (locale = null) => {
        let targetLocale = locale;
        if (!targetLocale) {
          const context = await view_1.view.getContext();
          targetLocale = context.locale;
        }
        const translator = new i18n_1.Translator(targetLocale, translationsGetter);
        await translator.init();
        return (i18nKey, defaultValue) => {
          var _a, _b;
          return (_b = (_a = translator.translate(i18nKey)) !== null && _a !== void 0 ? _a : defaultValue) !== null && _b !== void 0 ? _b : i18nKey;
        };
      };
      exports.createTranslationFunction = createTranslationFunction;
    }
  });

  // node_modules/@forge/bridge/out/featureFlags/initFeatureFlags.js
  var require_initFeatureFlags = __commonJS({
    "node_modules/@forge/bridge/out/featureFlags/initFeatureFlags.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.initFeatureFlags = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      var maxOps = 500;
      var intervalInMs = 1e3 * 25;
      var callBridge = (0, bridge_1.getCallBridge)();
      var validatePayload = (payload) => {
        if (!payload || !payload.user) {
          throw new errors_1.BridgeAPIError("Missing required parameters. Parameter user is required in the payload.");
        }
        if (Object.values(payload).some((val) => typeof val === "function")) {
          throw new errors_1.BridgeAPIError("Passing functions as part of the payload is not supported!");
        }
      };
      var _initFeatureFlags = (payload) => {
        validatePayload(payload);
        return callBridge("initFeatureFlags", { user: payload.user });
      };
      exports.initFeatureFlags = (0, utils_1.withRateLimiter)(_initFeatureFlags, maxOps, intervalInMs, "Feature flags initialisation calls are rate limited at 500req/25s");
    }
  });

  // node_modules/@statsig/client-core/src/Log.js
  var require_Log = __commonJS({
    "node_modules/@statsig/client-core/src/Log.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Log = exports.LogLevel = void 0;
      var DEBUG = " DEBUG ";
      var _INFO = "  INFO ";
      var _WARN = "  WARN ";
      var ERROR = " ERROR ";
      function addTag(args) {
        args.unshift("[Statsig]");
        return args;
      }
      exports.LogLevel = {
        None: 0,
        Error: 1,
        Warn: 2,
        Info: 3,
        Debug: 4
      };
      var Log = class _Log {
        static info(...args) {
          if (_Log.level >= exports.LogLevel.Info) {
            console.info(_INFO, ...addTag(args));
          }
        }
        static debug(...args) {
          if (_Log.level >= exports.LogLevel.Debug) {
            console.debug(DEBUG, ...addTag(args));
          }
        }
        static warn(...args) {
          if (_Log.level >= exports.LogLevel.Warn) {
            console.warn(_WARN, ...addTag(args));
          }
        }
        static error(...args) {
          if (_Log.level >= exports.LogLevel.Error) {
            console.error(ERROR, ...addTag(args));
          }
        }
      };
      exports.Log = Log;
      Log.level = exports.LogLevel.Warn;
    }
  });

  // node_modules/@statsig/client-core/src/$_StatsigGlobal.js
  var require_StatsigGlobal = __commonJS({
    "node_modules/@statsig/client-core/src/$_StatsigGlobal.js"(exports) {
      "use strict";
      var _a;
      var _b;
      var _c;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._getInstance = exports._getStatsigGlobalFlag = exports._getStatsigGlobal = void 0;
      var Log_1 = require_Log();
      var _getStatsigGlobal = () => {
        try {
          return typeof __STATSIG__ !== "undefined" ? __STATSIG__ : statsigGlobal;
        } catch (e) {
          return statsigGlobal;
        }
      };
      exports._getStatsigGlobal = _getStatsigGlobal;
      var _getStatsigGlobalFlag = (flag) => {
        return (0, exports._getStatsigGlobal)()[flag];
      };
      exports._getStatsigGlobalFlag = _getStatsigGlobalFlag;
      var _getInstance = (sdkKey) => {
        const gbl = (0, exports._getStatsigGlobal)();
        if (!sdkKey) {
          if (gbl.instances && Object.keys(gbl.instances).length > 1) {
            Log_1.Log.warn("Call made to Statsig global instance without an SDK key but there is more than one client instance. If you are using mulitple clients, please specify the SDK key.");
          }
          return gbl.firstInstance;
        }
        return gbl.instances && gbl.instances[sdkKey];
      };
      exports._getInstance = _getInstance;
      var GLOBAL_KEY = "__STATSIG__";
      var _window = typeof window !== "undefined" ? window : {};
      var _global = typeof global !== "undefined" ? global : {};
      var _globalThis = typeof globalThis !== "undefined" ? globalThis : {};
      var statsigGlobal = (_c = (_b = (_a = _window[GLOBAL_KEY]) !== null && _a !== void 0 ? _a : _global[GLOBAL_KEY]) !== null && _b !== void 0 ? _b : _globalThis[GLOBAL_KEY]) !== null && _c !== void 0 ? _c : {
        instance: exports._getInstance
      };
      _window[GLOBAL_KEY] = statsigGlobal;
      _global[GLOBAL_KEY] = statsigGlobal;
      _globalThis[GLOBAL_KEY] = statsigGlobal;
    }
  });

  // node_modules/@statsig/client-core/src/Diagnostics.js
  var require_Diagnostics = __commonJS({
    "node_modules/@statsig/client-core/src/Diagnostics.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Diagnostics = void 0;
      var MARKER_MAP = /* @__PURE__ */ new Map();
      var ACT_START = "start";
      var ACT_END = "end";
      var DIAGNOSTICS_EVENT = "statsig::diagnostics";
      exports.Diagnostics = {
        _getMarkers: (sdkKey) => {
          return MARKER_MAP.get(sdkKey);
        },
        _markInitOverallStart: (sdkKey) => {
          _addMarker(sdkKey, _createMarker({}, ACT_START, "overall"));
        },
        _markInitOverallEnd: (sdkKey, success, evaluationDetails) => {
          _addMarker(sdkKey, _createMarker({
            success,
            error: success ? void 0 : { name: "InitializeError", message: "Failed to initialize" },
            evaluationDetails
          }, ACT_END, "overall"));
        },
        _markInitNetworkReqStart: (sdkKey, data) => {
          _addMarker(sdkKey, _createMarker(data, ACT_START, "initialize", "network_request"));
        },
        _markInitNetworkReqEnd: (sdkKey, data) => {
          _addMarker(sdkKey, _createMarker(data, ACT_END, "initialize", "network_request"));
        },
        _markInitProcessStart: (sdkKey) => {
          _addMarker(sdkKey, _createMarker({}, ACT_START, "initialize", "process"));
        },
        _markInitProcessEnd: (sdkKey, data) => {
          _addMarker(sdkKey, _createMarker(data, ACT_END, "initialize", "process"));
        },
        _clearMarkers: (sdkKey) => {
          MARKER_MAP.delete(sdkKey);
        },
        _formatError(e) {
          if (!(e && typeof e === "object")) {
            return;
          }
          return {
            code: _safeGetField(e, "code"),
            name: _safeGetField(e, "name"),
            message: _safeGetField(e, "message")
          };
        },
        _getDiagnosticsData(res, attempt, body, e) {
          var _a;
          return {
            success: (res === null || res === void 0 ? void 0 : res.ok) === true,
            statusCode: res === null || res === void 0 ? void 0 : res.status,
            sdkRegion: (_a = res === null || res === void 0 ? void 0 : res.headers) === null || _a === void 0 ? void 0 : _a.get("x-statsig-region"),
            isDelta: body.includes('"is_delta":true') === true ? true : void 0,
            attempt,
            error: exports.Diagnostics._formatError(e)
          };
        },
        _enqueueDiagnosticsEvent(user, logger, sdk, options) {
          const markers = exports.Diagnostics._getMarkers(sdk);
          if (markers == null || markers.length <= 0) {
            return -1;
          }
          const overallInitDuration = markers[markers.length - 1].timestamp - markers[0].timestamp;
          exports.Diagnostics._clearMarkers(sdk);
          const event = _makeDiagnosticsEvent(user, {
            context: "initialize",
            markers: markers.slice(),
            statsigOptions: options
          });
          logger.enqueue(event);
          return overallInitDuration;
        }
      };
      function _createMarker(data, action, key, step) {
        return Object.assign({ key, action, step, timestamp: Date.now() }, data);
      }
      function _makeDiagnosticsEvent(user, data) {
        const latencyEvent = {
          eventName: DIAGNOSTICS_EVENT,
          user,
          value: null,
          metadata: data,
          time: Date.now()
        };
        return latencyEvent;
      }
      function _addMarker(sdkKey, marker) {
        var _a;
        const markers = (_a = MARKER_MAP.get(sdkKey)) !== null && _a !== void 0 ? _a : [];
        markers.push(marker);
        MARKER_MAP.set(sdkKey, markers);
      }
      function _safeGetField(data, field) {
        if (field in data) {
          return data[field];
        }
        return void 0;
      }
    }
  });

  // node_modules/@statsig/client-core/src/TypingUtils.js
  var require_TypingUtils = __commonJS({
    "node_modules/@statsig/client-core/src/TypingUtils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._isTypeMatch = exports._typeOf = void 0;
      function _typeOf(input) {
        return Array.isArray(input) ? "array" : typeof input;
      }
      exports._typeOf = _typeOf;
      function _isTypeMatch(a, b) {
        const typeOf = (x) => Array.isArray(x) ? "array" : typeof x;
        return typeOf(a) === typeOf(b);
      }
      exports._isTypeMatch = _isTypeMatch;
    }
  });

  // node_modules/@statsig/client-core/src/Hashing.js
  var require_Hashing = __commonJS({
    "node_modules/@statsig/client-core/src/Hashing.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._getSortedObject = exports._DJB2Object = exports._DJB2 = void 0;
      var TypingUtils_1 = require_TypingUtils();
      var _DJB2 = (value) => {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
          const character = value.charCodeAt(i);
          hash = (hash << 5) - hash + character;
          hash = hash & hash;
        }
        return String(hash >>> 0);
      };
      exports._DJB2 = _DJB2;
      var _DJB2Object = (value, maxLevels) => {
        return (0, exports._DJB2)(JSON.stringify((0, exports._getSortedObject)(value, maxLevels)));
      };
      exports._DJB2Object = _DJB2Object;
      var _getSortedObject = (object, maxDepth) => {
        if (object == null) {
          return null;
        }
        const keys = Object.keys(object).sort();
        const sortedObject = {};
        keys.forEach((key) => {
          const value = object[key];
          if (maxDepth === 0 || (0, TypingUtils_1._typeOf)(value) !== "object") {
            sortedObject[key] = value;
            return;
          }
          sortedObject[key] = (0, exports._getSortedObject)(value, maxDepth != null ? maxDepth - 1 : maxDepth);
        });
        return sortedObject;
      };
      exports._getSortedObject = _getSortedObject;
    }
  });

  // node_modules/@statsig/client-core/src/CacheKey.js
  var require_CacheKey = __commonJS({
    "node_modules/@statsig/client-core/src/CacheKey.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._getStorageKey = exports._getUserStorageKey = void 0;
      var Hashing_1 = require_Hashing();
      function _getUserStorageKey(sdkKey, user, customKeyGenerator) {
        var _a;
        if (customKeyGenerator) {
          return customKeyGenerator(sdkKey, user);
        }
        const cids = user && user.customIDs ? user.customIDs : {};
        const parts = [
          `uid:${(_a = user === null || user === void 0 ? void 0 : user.userID) !== null && _a !== void 0 ? _a : ""}`,
          `cids:${Object.keys(cids).sort((leftKey, rightKey) => leftKey.localeCompare(rightKey)).map((key) => `${key}-${cids[key]}`).join(",")}`,
          `k:${sdkKey}`
        ];
        return (0, Hashing_1._DJB2)(parts.join("|"));
      }
      exports._getUserStorageKey = _getUserStorageKey;
      function _getStorageKey(sdkKey, user, customKeyGenerator) {
        if (user) {
          return _getUserStorageKey(sdkKey, user, customKeyGenerator);
        }
        return (0, Hashing_1._DJB2)(`k:${sdkKey}`);
      }
      exports._getStorageKey = _getStorageKey;
    }
  });

  // node_modules/@statsig/client-core/src/NetworkConfig.js
  var require_NetworkConfig = __commonJS({
    "node_modules/@statsig/client-core/src/NetworkConfig.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NetworkParam = exports.NetworkDefault = exports.Endpoint = void 0;
      exports.Endpoint = {
        _initialize: "initialize",
        _rgstr: "rgstr",
        _download_config_specs: "download_config_specs"
      };
      exports.NetworkDefault = {
        [exports.Endpoint._rgstr]: "https://prodregistryv2.org/v1",
        [exports.Endpoint._initialize]: "https://featureassets.org/v1",
        [exports.Endpoint._download_config_specs]: "https://api.statsigcdn.com/v1"
      };
      exports.NetworkParam = {
        EventCount: "ec",
        SdkKey: "k",
        SdkType: "st",
        SdkVersion: "sv",
        Time: "t",
        SessionID: "sid",
        StatsigEncoded: "se",
        IsGzipped: "gz"
      };
    }
  });

  // node_modules/@statsig/client-core/src/SafeJs.js
  var require_SafeJs = __commonJS({
    "node_modules/@statsig/client-core/src/SafeJs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._getUnloadEvent = exports._getCurrentPageUrlSafe = exports._addDocumentEventListenerSafe = exports._addWindowEventListenerSafe = exports._isServerEnv = exports._getDocumentSafe = exports._getWindowSafe = void 0;
      var _getWindowSafe = () => {
        return typeof window !== "undefined" ? window : null;
      };
      exports._getWindowSafe = _getWindowSafe;
      var _getDocumentSafe = () => {
        var _a;
        const win = (0, exports._getWindowSafe)();
        return (_a = win === null || win === void 0 ? void 0 : win.document) !== null && _a !== void 0 ? _a : null;
      };
      exports._getDocumentSafe = _getDocumentSafe;
      var _isServerEnv = () => {
        if ((0, exports._getDocumentSafe)() !== null) {
          return false;
        }
        const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
        const isVercel = typeof EdgeRuntime === "string";
        return isVercel || isNode;
      };
      exports._isServerEnv = _isServerEnv;
      var _addWindowEventListenerSafe = (key, listener) => {
        const win = (0, exports._getWindowSafe)();
        if (typeof (win === null || win === void 0 ? void 0 : win.addEventListener) === "function") {
          win.addEventListener(key, listener);
        }
      };
      exports._addWindowEventListenerSafe = _addWindowEventListenerSafe;
      var _addDocumentEventListenerSafe = (key, listener) => {
        const doc = (0, exports._getDocumentSafe)();
        if (typeof (doc === null || doc === void 0 ? void 0 : doc.addEventListener) === "function") {
          doc.addEventListener(key, listener);
        }
      };
      exports._addDocumentEventListenerSafe = _addDocumentEventListenerSafe;
      var _getCurrentPageUrlSafe = () => {
        var _a;
        try {
          return (_a = (0, exports._getWindowSafe)()) === null || _a === void 0 ? void 0 : _a.location.href.split(/[?#]/)[0];
        } catch (_b) {
          return;
        }
      };
      exports._getCurrentPageUrlSafe = _getCurrentPageUrlSafe;
      var _getUnloadEvent = () => {
        const win = (0, exports._getWindowSafe)();
        if (!win) {
          return "beforeunload";
        }
        const eventType = "onpagehide" in win ? "pagehide" : "beforeunload";
        return eventType;
      };
      exports._getUnloadEvent = _getUnloadEvent;
    }
  });

  // node_modules/@statsig/client-core/src/StatsigEvent.js
  var require_StatsigEvent = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigEvent.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._createLayerParameterExposure = exports._createConfigExposure = exports._mapExposures = exports._createGateExposure = exports._isExposureEvent = void 0;
      var CONFIG_EXPOSURE_NAME = "statsig::config_exposure";
      var GATE_EXPOSURE_NAME = "statsig::gate_exposure";
      var LAYER_EXPOSURE_NAME = "statsig::layer_exposure";
      var _createExposure = (eventName, user, details, metadata, secondaryExposures) => {
        if (details.bootstrapMetadata) {
          metadata["bootstrapMetadata"] = details.bootstrapMetadata;
        }
        return {
          eventName,
          user,
          value: null,
          metadata: _addEvaluationDetailsToMetadata(details, metadata),
          secondaryExposures,
          time: Date.now()
        };
      };
      var _isExposureEvent = ({ eventName }) => {
        return eventName === GATE_EXPOSURE_NAME || eventName === CONFIG_EXPOSURE_NAME || eventName === LAYER_EXPOSURE_NAME;
      };
      exports._isExposureEvent = _isExposureEvent;
      var _createGateExposure = (user, gate, exposureMapping) => {
        var _a, _b, _c;
        const metadata = {
          gate: gate.name,
          gateValue: String(gate.value),
          ruleID: gate.ruleID
        };
        if (((_a = gate.__evaluation) === null || _a === void 0 ? void 0 : _a.version) != null) {
          metadata["configVersion"] = gate.__evaluation.version;
        }
        return _createExposure(GATE_EXPOSURE_NAME, user, gate.details, metadata, _mapExposures((_c = (_b = gate.__evaluation) === null || _b === void 0 ? void 0 : _b.secondary_exposures) !== null && _c !== void 0 ? _c : [], exposureMapping));
      };
      exports._createGateExposure = _createGateExposure;
      function _mapExposures(exposures, exposureMapping) {
        return exposures.map((exposure) => {
          if (typeof exposure === "string") {
            return (exposureMapping !== null && exposureMapping !== void 0 ? exposureMapping : {})[exposure];
          }
          return exposure;
        }).filter((exposure) => exposure != null);
      }
      exports._mapExposures = _mapExposures;
      var _createConfigExposure = (user, config, exposureMapping) => {
        var _a, _b, _c, _d;
        const metadata = {
          config: config.name,
          ruleID: config.ruleID
        };
        if (((_a = config.__evaluation) === null || _a === void 0 ? void 0 : _a.version) != null) {
          metadata["configVersion"] = config.__evaluation.version;
        }
        if (((_b = config.__evaluation) === null || _b === void 0 ? void 0 : _b.passed) != null) {
          metadata["rulePassed"] = String(config.__evaluation.passed);
        }
        return _createExposure(CONFIG_EXPOSURE_NAME, user, config.details, metadata, _mapExposures((_d = (_c = config.__evaluation) === null || _c === void 0 ? void 0 : _c.secondary_exposures) !== null && _d !== void 0 ? _d : [], exposureMapping));
      };
      exports._createConfigExposure = _createConfigExposure;
      var _createLayerParameterExposure = (user, layer, parameterName, exposureMapping) => {
        var _a, _b, _c, _d, _e, _f;
        const evaluation = layer.__evaluation;
        const isExplicit = ((_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.explicit_parameters) === null || _a === void 0 ? void 0 : _a.includes(parameterName)) === true;
        let allocatedExperiment = "";
        let secondaryExposures = (_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.undelegated_secondary_exposures) !== null && _b !== void 0 ? _b : [];
        if (isExplicit) {
          allocatedExperiment = (_c = evaluation.allocated_experiment_name) !== null && _c !== void 0 ? _c : "";
          secondaryExposures = evaluation.secondary_exposures;
        }
        const parameterRuleIDs = (_d = layer.__evaluation) === null || _d === void 0 ? void 0 : _d.parameter_rule_ids;
        const metadata = {
          config: layer.name,
          parameterName,
          ruleID: (_e = parameterRuleIDs === null || parameterRuleIDs === void 0 ? void 0 : parameterRuleIDs[parameterName]) !== null && _e !== void 0 ? _e : layer.ruleID,
          allocatedExperiment,
          isExplicitParameter: String(isExplicit)
        };
        if (((_f = layer.__evaluation) === null || _f === void 0 ? void 0 : _f.version) != null) {
          metadata["configVersion"] = layer.__evaluation.version;
        }
        return _createExposure(LAYER_EXPOSURE_NAME, user, layer.details, metadata, _mapExposures(secondaryExposures, exposureMapping));
      };
      exports._createLayerParameterExposure = _createLayerParameterExposure;
      var _addEvaluationDetailsToMetadata = (details, metadata) => {
        metadata["reason"] = details.reason;
        if (details.lcut) {
          metadata["lcut"] = String(details.lcut);
        }
        if (details.receivedAt) {
          metadata["receivedAt"] = String(details.receivedAt);
        }
        return metadata;
      };
    }
  });

  // node_modules/@statsig/client-core/src/StatsigOptionsCommon.js
  var require_StatsigOptionsCommon = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigOptionsCommon.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LoggingEnabledOption = exports.LogEventCompressionMode = void 0;
      exports.LogEventCompressionMode = {
        /** Do not compress request bodies */
        Disabled: "d",
        /** Compress request bodies unless a network proxy is configured */
        Enabled: "e",
        /** Always compress request bodies, even when a proxy is configured */
        Forced: "f"
      };
      exports.LoggingEnabledOption = {
        disabled: "disabled",
        browserOnly: "browser-only",
        always: "always"
      };
    }
  });

  // node_modules/@statsig/client-core/src/StorageProvider.js
  var require_StorageProvider = __commonJS({
    "node_modules/@statsig/client-core/src/StorageProvider.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._setObjectInStorage = exports._getObjectFromStorage = exports.Storage = void 0;
      var Log_1 = require_Log();
      var SafeJs_1 = require_SafeJs();
      var inMemoryStore = {};
      var _inMemoryProvider = {
        isReady: () => true,
        isReadyResolver: () => null,
        getProviderName: () => "InMemory",
        getItem: (key) => inMemoryStore[key] ? inMemoryStore[key] : null,
        setItem: (key, value) => {
          inMemoryStore[key] = value;
        },
        removeItem: (key) => {
          delete inMemoryStore[key];
        },
        getAllKeys: () => Object.keys(inMemoryStore)
      };
      var _localStorageProvider = null;
      try {
        const win = (0, SafeJs_1._getWindowSafe)();
        if (win && win.localStorage && typeof win.localStorage.getItem === "function") {
          _localStorageProvider = {
            isReady: () => true,
            isReadyResolver: () => null,
            getProviderName: () => "LocalStorage",
            getItem: (key) => win.localStorage.getItem(key),
            setItem: (key, value) => win.localStorage.setItem(key, value),
            removeItem: (key) => win.localStorage.removeItem(key),
            getAllKeys: () => Object.keys(win.localStorage)
          };
        }
      } catch (error) {
        Log_1.Log.warn("Failed to setup localStorageProvider.");
      }
      var _main = _localStorageProvider !== null && _localStorageProvider !== void 0 ? _localStorageProvider : _inMemoryProvider;
      var _current = _main;
      function _inMemoryBreaker(action) {
        try {
          return action();
        } catch (error) {
          if (error instanceof Error && error.name === "SecurityError") {
            exports.Storage._setProvider(_inMemoryProvider);
            return null;
          }
          if (error instanceof Error && error.name === "QuotaExceededError") {
            const allKeys = exports.Storage.getAllKeys();
            const statsigKeys = allKeys.filter((key) => key.startsWith("statsig."));
            error.message = `${error.message}. Statsig Keys: ${statsigKeys.length}`;
          }
          throw error;
        }
      }
      exports.Storage = {
        isReady: () => _current.isReady(),
        isReadyResolver: () => _current.isReadyResolver(),
        getProviderName: () => _current.getProviderName(),
        getItem: (key) => _inMemoryBreaker(() => _current.getItem(key)),
        setItem: (key, value) => _inMemoryBreaker(() => _current.setItem(key, value)),
        removeItem: (key) => _current.removeItem(key),
        getAllKeys: () => _current.getAllKeys(),
        // StorageProviderManagment
        _setProvider: (newProvider) => {
          _main = newProvider;
          _current = newProvider;
        },
        _setDisabled: (isDisabled) => {
          if (isDisabled) {
            _current = _inMemoryProvider;
          } else {
            _current = _main;
          }
        }
      };
      function _getObjectFromStorage(key) {
        const value = exports.Storage.getItem(key);
        return JSON.parse(value !== null && value !== void 0 ? value : "null");
      }
      exports._getObjectFromStorage = _getObjectFromStorage;
      function _setObjectInStorage(key, obj) {
        exports.Storage.setItem(key, JSON.stringify(obj));
      }
      exports._setObjectInStorage = _setObjectInStorage;
    }
  });

  // node_modules/@statsig/client-core/src/UrlConfiguration.js
  var require_UrlConfiguration = __commonJS({
    "node_modules/@statsig/client-core/src/UrlConfiguration.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UrlConfiguration = void 0;
      var Hashing_1 = require_Hashing();
      var NetworkConfig_1 = require_NetworkConfig();
      var ENDPOINT_DNS_KEY_MAP = {
        [NetworkConfig_1.Endpoint._initialize]: "i",
        [NetworkConfig_1.Endpoint._rgstr]: "e",
        [NetworkConfig_1.Endpoint._download_config_specs]: "d"
      };
      var UrlConfiguration = class {
        constructor(endpoint, customUrl, customApi, fallbackUrls) {
          this.customUrl = null;
          this.fallbackUrls = null;
          this.endpoint = endpoint;
          this.endpointDnsKey = ENDPOINT_DNS_KEY_MAP[endpoint];
          if (customUrl) {
            this.customUrl = customUrl;
          }
          if (!customUrl && customApi) {
            this.customUrl = customApi.endsWith("/") ? `${customApi}${endpoint}` : `${customApi}/${endpoint}`;
          }
          if (fallbackUrls) {
            this.fallbackUrls = fallbackUrls;
          }
          const defaultApi = NetworkConfig_1.NetworkDefault[endpoint];
          this.defaultUrl = `${defaultApi}/${endpoint}`;
        }
        getUrl() {
          var _a;
          return (_a = this.customUrl) !== null && _a !== void 0 ? _a : this.defaultUrl;
        }
        getChecksum() {
          var _a;
          const fallbacks = ((_a = this.fallbackUrls) !== null && _a !== void 0 ? _a : []).sort().join(",");
          return (0, Hashing_1._DJB2)(this.customUrl + fallbacks);
        }
      };
      exports.UrlConfiguration = UrlConfiguration;
    }
  });

  // node_modules/@statsig/client-core/src/VisibilityObserving.js
  var require_VisibilityObserving = __commonJS({
    "node_modules/@statsig/client-core/src/VisibilityObserving.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._notifyVisibilityChanged = exports._subscribeToVisiblityChanged = exports._isUnloading = exports._isCurrentlyVisible = void 0;
      var SafeJs_1 = require_SafeJs();
      var FOREGROUND = "foreground";
      var BACKGROUND = "background";
      var LISTENERS = [];
      var current = FOREGROUND;
      var isUnloading = false;
      var _isCurrentlyVisible = () => {
        return current === FOREGROUND;
      };
      exports._isCurrentlyVisible = _isCurrentlyVisible;
      var _isUnloading = () => isUnloading;
      exports._isUnloading = _isUnloading;
      var _subscribeToVisiblityChanged = (listener) => {
        LISTENERS.unshift(listener);
      };
      exports._subscribeToVisiblityChanged = _subscribeToVisiblityChanged;
      var _notifyVisibilityChanged = (visibility) => {
        if (visibility === current) {
          return;
        }
        current = visibility;
        LISTENERS.forEach((l) => l(visibility));
      };
      exports._notifyVisibilityChanged = _notifyVisibilityChanged;
      (0, SafeJs_1._addWindowEventListenerSafe)("focus", () => {
        isUnloading = false;
        (0, exports._notifyVisibilityChanged)(FOREGROUND);
      });
      (0, SafeJs_1._addWindowEventListenerSafe)("blur", () => (0, exports._notifyVisibilityChanged)(BACKGROUND));
      (0, SafeJs_1._addDocumentEventListenerSafe)("visibilitychange", () => {
        (0, exports._notifyVisibilityChanged)(document.visibilityState === "visible" ? FOREGROUND : BACKGROUND);
      });
      (0, SafeJs_1._addWindowEventListenerSafe)((0, SafeJs_1._getUnloadEvent)(), () => {
        isUnloading = true;
        (0, exports._notifyVisibilityChanged)(BACKGROUND);
      });
    }
  });

  // node_modules/@statsig/client-core/src/EventLogger.js
  var require_EventLogger = __commonJS({
    "node_modules/@statsig/client-core/src/EventLogger.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.EventLogger = void 0;
      var CacheKey_1 = require_CacheKey();
      var Hashing_1 = require_Hashing();
      var Log_1 = require_Log();
      var NetworkConfig_1 = require_NetworkConfig();
      var SafeJs_1 = require_SafeJs();
      var StatsigEvent_1 = require_StatsigEvent();
      var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
      var StorageProvider_1 = require_StorageProvider();
      var UrlConfiguration_1 = require_UrlConfiguration();
      var VisibilityObserving_1 = require_VisibilityObserving();
      var DEFAULT_QUEUE_SIZE = 100;
      var DEFAULT_FLUSH_INTERVAL_MS = 1e4;
      var MAX_DEDUPER_KEYS = 1e3;
      var DEDUPER_WINDOW_DURATION_MS = 6e5;
      var MAX_FAILED_LOGS = 500;
      var QUICK_FLUSH_WINDOW_MS = 200;
      var EVENT_LOGGER_MAP = {};
      var RetryFailedLogsTrigger = {
        Startup: "startup",
        GainedFocus: "gained_focus"
      };
      var EventLogger = class _EventLogger {
        static _safeFlushAndForget(sdkKey) {
          var _a;
          (_a = EVENT_LOGGER_MAP[sdkKey]) === null || _a === void 0 ? void 0 : _a.flush().catch(() => {
          });
        }
        static _safeRetryFailedLogs(sdkKey) {
          var _a;
          (_a = EVENT_LOGGER_MAP[sdkKey]) === null || _a === void 0 ? void 0 : _a._retryFailedLogs(RetryFailedLogsTrigger.GainedFocus);
        }
        constructor(_sdkKey, _emitter, _network, _options) {
          var _a, _b;
          this._sdkKey = _sdkKey;
          this._emitter = _emitter;
          this._network = _network;
          this._options = _options;
          this._queue = [];
          this._lastExposureTimeMap = {};
          this._nonExposedChecks = {};
          this._hasRunQuickFlush = false;
          this._creationTime = Date.now();
          this._loggingEnabled = (_a = _options === null || _options === void 0 ? void 0 : _options.loggingEnabled) !== null && _a !== void 0 ? _a : (_options === null || _options === void 0 ? void 0 : _options.disableLogging) === true ? StatsigOptionsCommon_1.LoggingEnabledOption.disabled : StatsigOptionsCommon_1.LoggingEnabledOption.browserOnly;
          if ((_options === null || _options === void 0 ? void 0 : _options.loggingEnabled) && _options.disableLogging !== void 0) {
            Log_1.Log.warn("Detected both loggingEnabled and disableLogging options. loggingEnabled takes precedence - please remove disableLogging.");
          }
          this._maxQueueSize = (_b = _options === null || _options === void 0 ? void 0 : _options.loggingBufferMaxSize) !== null && _b !== void 0 ? _b : DEFAULT_QUEUE_SIZE;
          const config = _options === null || _options === void 0 ? void 0 : _options.networkConfig;
          this._logEventUrlConfig = new UrlConfiguration_1.UrlConfiguration(NetworkConfig_1.Endpoint._rgstr, config === null || config === void 0 ? void 0 : config.logEventUrl, config === null || config === void 0 ? void 0 : config.api, config === null || config === void 0 ? void 0 : config.logEventFallbackUrls);
        }
        setLogEventCompressionMode(mode) {
          this._network.setLogEventCompressionMode(mode);
        }
        setLoggingEnabled(loggingEnabled) {
          this._loggingEnabled = loggingEnabled;
        }
        enqueue(event) {
          if (!this._shouldLogEvent(event)) {
            return;
          }
          this._normalizeAndAppendEvent(event);
          this._quickFlushIfNeeded();
          if (this._queue.length > this._maxQueueSize) {
            _EventLogger._safeFlushAndForget(this._sdkKey);
          }
        }
        incrementNonExposureCount(name) {
          var _a;
          const current = (_a = this._nonExposedChecks[name]) !== null && _a !== void 0 ? _a : 0;
          this._nonExposedChecks[name] = current + 1;
        }
        reset() {
          this.flush().catch(() => {
          });
          this._lastExposureTimeMap = {};
        }
        start() {
          var _a;
          const isServerEnv = (0, SafeJs_1._isServerEnv)();
          if (isServerEnv && ((_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingEnabled) !== "always") {
            return;
          }
          EVENT_LOGGER_MAP[this._sdkKey] = this;
          if (!isServerEnv) {
            (0, VisibilityObserving_1._subscribeToVisiblityChanged)((visibility) => {
              if (visibility === "background") {
                _EventLogger._safeFlushAndForget(this._sdkKey);
              } else if (visibility === "foreground") {
                _EventLogger._safeRetryFailedLogs(this._sdkKey);
              }
            });
          }
          this._retryFailedLogs(RetryFailedLogsTrigger.Startup);
          this._startBackgroundFlushInterval();
        }
        stop() {
          return __awaiter2(this, void 0, void 0, function* () {
            if (this._flushIntervalId) {
              clearInterval(this._flushIntervalId);
              this._flushIntervalId = null;
            }
            delete EVENT_LOGGER_MAP[this._sdkKey];
            yield this.flush();
          });
        }
        flush() {
          return __awaiter2(this, void 0, void 0, function* () {
            this._appendAndResetNonExposedChecks();
            if (this._queue.length === 0) {
              return;
            }
            const events = this._queue;
            this._queue = [];
            yield this._sendEvents(events);
          });
        }
        /**
         * We 'Quick Flush' following the very first event enqueued
         * within the quick flush window
         */
        _quickFlushIfNeeded() {
          if (this._hasRunQuickFlush) {
            return;
          }
          this._hasRunQuickFlush = true;
          if (Date.now() - this._creationTime > QUICK_FLUSH_WINDOW_MS) {
            return;
          }
          setTimeout(() => _EventLogger._safeFlushAndForget(this._sdkKey), QUICK_FLUSH_WINDOW_MS);
        }
        _shouldLogEvent(event) {
          var _a;
          if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingEnabled) !== "always" && (0, SafeJs_1._isServerEnv)()) {
            return false;
          }
          if (!(0, StatsigEvent_1._isExposureEvent)(event)) {
            return true;
          }
          const user = event.user ? event.user : { statsigEnvironment: void 0 };
          const userKey = (0, CacheKey_1._getUserStorageKey)(this._sdkKey, user);
          const metadata = event.metadata ? event.metadata : {};
          const key = [
            event.eventName,
            userKey,
            metadata["gate"],
            metadata["config"],
            metadata["ruleID"],
            metadata["allocatedExperiment"],
            metadata["parameterName"],
            String(metadata["isExplicitParameter"]),
            metadata["reason"]
          ].join("|");
          const previous = this._lastExposureTimeMap[key];
          const now = Date.now();
          if (previous && now - previous < DEDUPER_WINDOW_DURATION_MS) {
            return false;
          }
          if (Object.keys(this._lastExposureTimeMap).length > MAX_DEDUPER_KEYS) {
            this._lastExposureTimeMap = {};
          }
          this._lastExposureTimeMap[key] = now;
          return true;
        }
        _sendEvents(events) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a, _b;
            if (this._loggingEnabled === "disabled") {
              this._saveFailedLogsToStorage(events);
              return false;
            }
            try {
              const isClosing = (0, VisibilityObserving_1._isUnloading)();
              const shouldUseBeacon = isClosing && this._network.isBeaconSupported() && ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.networkOverrideFunc) == null;
              this._emitter({
                name: "pre_logs_flushed",
                events
              });
              const response = shouldUseBeacon ? this._sendEventsViaBeacon(events) : yield this._sendEventsViaPost(events);
              if (response.success) {
                this._emitter({
                  name: "logs_flushed",
                  events
                });
                return true;
              } else {
                Log_1.Log.warn("Failed to flush events.");
                this._saveFailedLogsToStorage(events);
                return false;
              }
            } catch (_c) {
              Log_1.Log.warn("Failed to flush events.");
              return false;
            }
          });
        }
        _sendEventsViaPost(events) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a;
            const result = yield this._network.post(this._getRequestData(events));
            const code = (_a = result === null || result === void 0 ? void 0 : result.code) !== null && _a !== void 0 ? _a : -1;
            return { success: code >= 200 && code < 300 };
          });
        }
        _sendEventsViaBeacon(events) {
          return {
            success: this._network.beacon(this._getRequestData(events))
          };
        }
        _getRequestData(events) {
          return {
            sdkKey: this._sdkKey,
            data: {
              events
            },
            urlConfig: this._logEventUrlConfig,
            retries: 3,
            isCompressable: true,
            params: {
              [NetworkConfig_1.NetworkParam.EventCount]: String(events.length)
            },
            credentials: "same-origin"
          };
        }
        _saveFailedLogsToStorage(events) {
          while (events.length > MAX_FAILED_LOGS) {
            events.shift();
          }
          const storageKey = this._getStorageKey();
          try {
            (0, StorageProvider_1._setObjectInStorage)(storageKey, events);
          } catch (_a) {
            Log_1.Log.warn("Unable to save failed logs to storage");
          }
        }
        _retryFailedLogs(trigger) {
          const storageKey = this._getStorageKey();
          (() => __awaiter2(this, void 0, void 0, function* () {
            if (!StorageProvider_1.Storage.isReady()) {
              yield StorageProvider_1.Storage.isReadyResolver();
            }
            const events = (0, StorageProvider_1._getObjectFromStorage)(storageKey);
            if (!events) {
              return;
            }
            if (trigger === RetryFailedLogsTrigger.Startup) {
              StorageProvider_1.Storage.removeItem(storageKey);
            }
            const isSuccess = yield this._sendEvents(events);
            if (isSuccess && trigger === RetryFailedLogsTrigger.GainedFocus) {
              StorageProvider_1.Storage.removeItem(storageKey);
            }
          }))().catch(() => {
            Log_1.Log.warn("Failed to flush stored logs");
          });
        }
        _getStorageKey() {
          return `statsig.failed_logs.${(0, Hashing_1._DJB2)(this._sdkKey)}`;
        }
        _normalizeAndAppendEvent(event) {
          if (event.user) {
            event.user = Object.assign({}, event.user);
            delete event.user.privateAttributes;
          }
          const extras = {};
          const currentPage = this._getCurrentPageUrl();
          if (currentPage) {
            extras.statsigMetadata = { currentPage };
          }
          const final = Object.assign(Object.assign({}, event), extras);
          Log_1.Log.debug("Enqueued Event:", final);
          this._queue.push(final);
        }
        _appendAndResetNonExposedChecks() {
          if (Object.keys(this._nonExposedChecks).length === 0) {
            return;
          }
          this._normalizeAndAppendEvent({
            eventName: "statsig::non_exposed_checks",
            user: null,
            time: Date.now(),
            metadata: {
              checks: Object.assign({}, this._nonExposedChecks)
            }
          });
          this._nonExposedChecks = {};
        }
        _getCurrentPageUrl() {
          var _a;
          if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.includeCurrentPageUrlWithEvents) === false) {
            return;
          }
          return (0, SafeJs_1._getCurrentPageUrlSafe)();
        }
        _startBackgroundFlushInterval() {
          var _a, _b;
          const flushInterval = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingIntervalMs) !== null && _b !== void 0 ? _b : DEFAULT_FLUSH_INTERVAL_MS;
          const intervalId = setInterval(() => {
            const logger = EVENT_LOGGER_MAP[this._sdkKey];
            if (!logger || logger._flushIntervalId !== intervalId) {
              clearInterval(intervalId);
            } else {
              _EventLogger._safeFlushAndForget(this._sdkKey);
            }
          }, flushInterval);
          this._flushIntervalId = intervalId;
        }
      };
      exports.EventLogger = EventLogger;
    }
  });

  // node_modules/@statsig/client-core/src/StatsigMetadata.js
  var require_StatsigMetadata = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigMetadata.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatsigMetadataProvider = exports.SDK_VERSION = void 0;
      exports.SDK_VERSION = "3.18.2";
      var metadata = {
        sdkVersion: exports.SDK_VERSION,
        sdkType: "js-mono"
        // js-mono is overwritten by Precomp and OnDevice clients
      };
      exports.StatsigMetadataProvider = {
        get: () => metadata,
        add: (additions) => {
          metadata = Object.assign(Object.assign({}, metadata), additions);
        }
      };
    }
  });

  // node_modules/@statsig/client-core/src/ClientInterfaces.js
  var require_ClientInterfaces = __commonJS({
    "node_modules/@statsig/client-core/src/ClientInterfaces.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/UUID.js
  var require_UUID = __commonJS({
    "node_modules/@statsig/client-core/src/UUID.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getUUID = void 0;
      function getUUID() {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        let d = (/* @__PURE__ */ new Date()).getTime();
        let d2 = typeof performance !== "undefined" && performance.now && performance.now() * 1e3 || 0;
        const y = "89ab"[Math.floor(Math.random() * 4)];
        return `xxxxxxxx-xxxx-4xxx-${y}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
          let r = Math.random() * 16;
          if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
          } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
          }
          return (c === "x" ? r : r & 7 | 8).toString(16);
        });
      }
      exports.getUUID = getUUID;
    }
  });

  // node_modules/@statsig/client-core/src/StableID.js
  var require_StableID = __commonJS({
    "node_modules/@statsig/client-core/src/StableID.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StableID = void 0;
      var CacheKey_1 = require_CacheKey();
      var Log_1 = require_Log();
      var SafeJs_1 = require_SafeJs();
      var StorageProvider_1 = require_StorageProvider();
      var UUID_1 = require_UUID();
      var PROMISE_MAP = {};
      var COOKIE_ENABLED_MAP = {};
      var DISABLED_MAP = {};
      exports.StableID = {
        cookiesEnabled: false,
        randomID: Math.random().toString(36),
        get: (sdkKey) => {
          if (DISABLED_MAP[sdkKey]) {
            return null;
          }
          if (PROMISE_MAP[sdkKey] != null) {
            return PROMISE_MAP[sdkKey];
          }
          let stableID = null;
          stableID = _loadFromCookie(sdkKey);
          if (stableID != null) {
            PROMISE_MAP[sdkKey] = stableID;
            _persistToStorage(stableID, sdkKey);
            return stableID;
          }
          stableID = _loadFromStorage(sdkKey);
          if (stableID == null) {
            stableID = (0, UUID_1.getUUID)();
          }
          _persistToStorage(stableID, sdkKey);
          _persistToCookie(stableID, sdkKey);
          PROMISE_MAP[sdkKey] = stableID;
          return stableID;
        },
        setOverride: (override, sdkKey) => {
          PROMISE_MAP[sdkKey] = override;
          _persistToStorage(override, sdkKey);
          _persistToCookie(override, sdkKey);
        },
        _setCookiesEnabled: (sdkKey, cookiesEnabled) => {
          COOKIE_ENABLED_MAP[sdkKey] = cookiesEnabled;
        },
        _setDisabled: (sdkKey, disabled) => {
          DISABLED_MAP[sdkKey] = disabled;
        }
      };
      function _getStableIDStorageKey(sdkKey) {
        return `statsig.stable_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
      }
      function _persistToStorage(stableID, sdkKey) {
        const storageKey = _getStableIDStorageKey(sdkKey);
        try {
          (0, StorageProvider_1._setObjectInStorage)(storageKey, stableID);
        } catch (e) {
          Log_1.Log.warn("Failed to save StableID to storage");
        }
      }
      function _loadFromStorage(sdkKey) {
        const storageKey = _getStableIDStorageKey(sdkKey);
        return (0, StorageProvider_1._getObjectFromStorage)(storageKey);
      }
      function _loadFromCookie(sdkKey) {
        if (!COOKIE_ENABLED_MAP[sdkKey] || (0, SafeJs_1._getDocumentSafe)() == null) {
          return null;
        }
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [key, value] = cookie.trim().split("=");
          if (key === _getCookieName(sdkKey)) {
            return decodeURIComponent(value);
          }
        }
        return null;
      }
      function _persistToCookie(stableID, sdkKey) {
        if (!COOKIE_ENABLED_MAP[sdkKey] || !document) {
          return;
        }
        const expiryDate = /* @__PURE__ */ new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${_getCookieName(sdkKey)}=${encodeURIComponent(stableID)}; expires=${expiryDate.toUTCString()}; path=/`;
      }
      function _getCookieName(sdkKey) {
        return `statsig.stable_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
      }
    }
  });

  // node_modules/@statsig/client-core/src/StatsigUser.js
  var require_StatsigUser = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigUser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._getFullUserHash = exports._normalizeUser = void 0;
      var Hashing_1 = require_Hashing();
      var Log_1 = require_Log();
      function _normalizeUser(original, options, fallbackEnvironment) {
        try {
          const copy = JSON.parse(JSON.stringify(original));
          if (options != null && options.environment != null) {
            copy.statsigEnvironment = options.environment;
          } else if (fallbackEnvironment != null) {
            copy.statsigEnvironment = { tier: fallbackEnvironment };
          }
          return copy;
        } catch (error) {
          Log_1.Log.error("Failed to JSON.stringify user");
          return { statsigEnvironment: void 0 };
        }
      }
      exports._normalizeUser = _normalizeUser;
      function _getFullUserHash(user) {
        return user ? (0, Hashing_1._DJB2Object)(user) : null;
      }
      exports._getFullUserHash = _getFullUserHash;
    }
  });

  // node_modules/@statsig/client-core/src/TypedJsonParse.js
  var require_TypedJsonParse = __commonJS({
    "node_modules/@statsig/client-core/src/TypedJsonParse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._typedJsonParse = void 0;
      var Log_1 = require_Log();
      function _typedJsonParse(data, guard, typeName) {
        try {
          const result = JSON.parse(data);
          if (result && typeof result === "object" && guard in result) {
            return result;
          }
        } catch (_a) {
        }
        Log_1.Log.error(`Failed to parse ${typeName}`);
        return null;
      }
      exports._typedJsonParse = _typedJsonParse;
    }
  });

  // node_modules/@statsig/client-core/src/DataAdapterCore.js
  var require_DataAdapterCore = __commonJS({
    "node_modules/@statsig/client-core/src/DataAdapterCore.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._makeDataAdapterResult = exports.DataAdapterCore = void 0;
      var Log_1 = require_Log();
      var StableID_1 = require_StableID();
      var StatsigUser_1 = require_StatsigUser();
      var StorageProvider_1 = require_StorageProvider();
      var TypedJsonParse_1 = require_TypedJsonParse();
      var CACHE_LIMIT = 10;
      var DataAdapterCore = class {
        constructor(_adapterName, _cacheSuffix) {
          this._adapterName = _adapterName;
          this._cacheSuffix = _cacheSuffix;
          this._options = null;
          this._sdkKey = null;
          this._lastModifiedStoreKey = `statsig.last_modified_time.${_cacheSuffix}`;
          this._inMemoryCache = new InMemoryCache();
        }
        attach(sdkKey, options, _network) {
          this._sdkKey = sdkKey;
          this._options = options;
        }
        getDataSync(user) {
          const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
          const cacheKey = this._getCacheKey(normalized);
          const inMem = this._inMemoryCache.get(cacheKey, normalized);
          if (inMem && this._getIsCacheValueValid(inMem)) {
            return inMem;
          }
          const cache = this._loadFromCache(cacheKey);
          if (cache && this._getIsCacheValueValid(cache)) {
            this._inMemoryCache.add(cacheKey, cache);
            return this._inMemoryCache.get(cacheKey, normalized);
          }
          return null;
        }
        setData(data, user) {
          const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
          const cacheKey = this._getCacheKey(normalized);
          this._inMemoryCache.add(cacheKey, _makeDataAdapterResult("Bootstrap", data, null, normalized));
        }
        _getIsCacheValueValid(current) {
          return current.stableID == null || current.stableID === StableID_1.StableID.get(this._getSdkKey());
        }
        _getDataAsyncImpl(current, user, options) {
          return __awaiter2(this, void 0, void 0, function* () {
            if (!StorageProvider_1.Storage.isReady()) {
              yield StorageProvider_1.Storage.isReadyResolver();
            }
            const cache = current !== null && current !== void 0 ? current : this.getDataSync(user);
            const ops = [this._fetchAndPrepFromNetwork(cache, user, options)];
            if (options === null || options === void 0 ? void 0 : options.timeoutMs) {
              ops.push(new Promise((r) => setTimeout(r, options.timeoutMs)).then(() => {
                Log_1.Log.debug("Fetching latest value timed out");
                return null;
              }));
            }
            return yield Promise.race(ops);
          });
        }
        _prefetchDataImpl(user, options) {
          return __awaiter2(this, void 0, void 0, function* () {
            const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
            const cacheKey = this._getCacheKey(normalized);
            const result = yield this._getDataAsyncImpl(null, normalized, options);
            if (result) {
              this._inMemoryCache.add(cacheKey, Object.assign(Object.assign({}, result), { source: "Prefetch" }));
            }
          });
        }
        _fetchAndPrepFromNetwork(cachedResult, user, options) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a;
            const cachedData = (_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _a !== void 0 ? _a : null;
            const isCacheValidFor204 = cachedResult != null && this._isCachedResultValidFor204(cachedResult, user);
            const latest = yield this._fetchFromNetwork(cachedData, user, options, isCacheValidFor204);
            if (!latest) {
              Log_1.Log.debug("No response returned for latest value");
              return null;
            }
            const response = (0, TypedJsonParse_1._typedJsonParse)(latest, "has_updates", "Response");
            const sdkKey = this._getSdkKey();
            const stableID = StableID_1.StableID.get(sdkKey);
            let result = null;
            if ((response === null || response === void 0 ? void 0 : response.has_updates) === true) {
              result = _makeDataAdapterResult("Network", latest, stableID, user);
            } else if (cachedData && (response === null || response === void 0 ? void 0 : response.has_updates) === false) {
              result = _makeDataAdapterResult("NetworkNotModified", cachedData, stableID, user);
            } else {
              return null;
            }
            const cacheKey = this._getCacheKey(user);
            this._inMemoryCache.add(cacheKey, result);
            this._writeToCache(cacheKey, result);
            return result;
          });
        }
        _getSdkKey() {
          if (this._sdkKey != null) {
            return this._sdkKey;
          }
          Log_1.Log.error(`${this._adapterName} is not attached to a Client`);
          return "";
        }
        _loadFromCache(cacheKey) {
          var _a;
          const cache = (_a = StorageProvider_1.Storage.getItem) === null || _a === void 0 ? void 0 : _a.call(StorageProvider_1.Storage, cacheKey);
          if (cache == null) {
            return null;
          }
          const result = (0, TypedJsonParse_1._typedJsonParse)(cache, "source", "Cached Result");
          return result ? Object.assign(Object.assign({}, result), { source: "Cache" }) : null;
        }
        _writeToCache(cacheKey, result) {
          StorageProvider_1.Storage.setItem(cacheKey, JSON.stringify(result));
          this._runLocalStorageCacheEviction(cacheKey);
        }
        _runLocalStorageCacheEviction(cacheKey) {
          var _a;
          const lastModifiedTimeMap = (_a = (0, StorageProvider_1._getObjectFromStorage)(this._lastModifiedStoreKey)) !== null && _a !== void 0 ? _a : {};
          lastModifiedTimeMap[cacheKey] = Date.now();
          const evictable = _getEvictableKey(lastModifiedTimeMap, CACHE_LIMIT);
          if (evictable) {
            delete lastModifiedTimeMap[evictable];
            StorageProvider_1.Storage.removeItem(evictable);
          }
          (0, StorageProvider_1._setObjectInStorage)(this._lastModifiedStoreKey, lastModifiedTimeMap);
        }
      };
      exports.DataAdapterCore = DataAdapterCore;
      function _makeDataAdapterResult(source, data, stableID, user) {
        return {
          source,
          data,
          receivedAt: Date.now(),
          stableID,
          fullUserHash: (0, StatsigUser_1._getFullUserHash)(user)
        };
      }
      exports._makeDataAdapterResult = _makeDataAdapterResult;
      var InMemoryCache = class {
        constructor() {
          this._data = {};
        }
        get(cacheKey, user) {
          var _a;
          const result = this._data[cacheKey];
          const cached = result === null || result === void 0 ? void 0 : result.stableID;
          const provided = (_a = user === null || user === void 0 ? void 0 : user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID;
          if (provided && cached && provided !== cached) {
            Log_1.Log.warn("'StatsigUser.customIDs.stableID' mismatch");
            return null;
          }
          return result;
        }
        add(cacheKey, value) {
          const oldest = _getEvictableKey(this._data, CACHE_LIMIT - 1);
          if (oldest) {
            delete this._data[oldest];
          }
          this._data[cacheKey] = value;
        }
        merge(values) {
          this._data = Object.assign(Object.assign({}, this._data), values);
        }
      };
      function _getEvictableKey(data, limit) {
        const keys = Object.keys(data);
        if (keys.length <= limit) {
          return null;
        }
        return keys.reduce((prevKey, currKey) => {
          const prev = data[prevKey];
          const current = data[currKey];
          if (typeof prev === "object" && typeof current === "object") {
            return current.receivedAt < prev.receivedAt ? currKey : prevKey;
          }
          return current < prev ? currKey : prevKey;
        });
      }
    }
  });

  // node_modules/@statsig/client-core/src/DownloadConfigSpecsResponse.js
  var require_DownloadConfigSpecsResponse = __commonJS({
    "node_modules/@statsig/client-core/src/DownloadConfigSpecsResponse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/SDKType.js
  var require_SDKType = __commonJS({
    "node_modules/@statsig/client-core/src/SDKType.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SDKType = void 0;
      var SDK_CLIENT = {};
      var suffix;
      exports.SDKType = {
        _get: (sdkKey) => {
          var _a;
          return ((_a = SDK_CLIENT[sdkKey]) !== null && _a !== void 0 ? _a : "js-mono") + (suffix !== null && suffix !== void 0 ? suffix : "");
        },
        _setClientType(sdkKey, client) {
          SDK_CLIENT[sdkKey] = client;
        },
        _setBindingType(binding) {
          if (!suffix || suffix === "-react") {
            suffix = "-" + binding;
          }
        }
      };
    }
  });

  // node_modules/@statsig/client-core/src/ErrorBoundary.js
  var require_ErrorBoundary = __commonJS({
    "node_modules/@statsig/client-core/src/ErrorBoundary.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ErrorBoundary = exports.EXCEPTION_ENDPOINT = void 0;
      var Log_1 = require_Log();
      var SDKType_1 = require_SDKType();
      var StatsigMetadata_1 = require_StatsigMetadata();
      exports.EXCEPTION_ENDPOINT = "https://statsigapi.net/v1/sdk_exception";
      var UNKNOWN_ERROR = "[Statsig] UnknownError";
      var ErrorBoundary = class {
        constructor(_sdkKey, _options, _emitter, _lastSeenError) {
          this._sdkKey = _sdkKey;
          this._options = _options;
          this._emitter = _emitter;
          this._lastSeenError = _lastSeenError;
          this._seen = /* @__PURE__ */ new Set();
        }
        wrap(instance) {
          try {
            const obj = instance;
            _getAllInstanceMethodNames(obj).forEach((name) => {
              const original = obj[name];
              if ("$EB" in original) {
                return;
              }
              obj[name] = (...args) => {
                return this._capture(name, () => original.apply(instance, args));
              };
              obj[name].$EB = true;
            });
          } catch (err) {
            this._onError("eb:wrap", err);
          }
        }
        logError(tag, error) {
          this._onError(tag, error);
        }
        getLastSeenErrorAndReset() {
          const tempError = this._lastSeenError;
          this._lastSeenError = void 0;
          return tempError !== null && tempError !== void 0 ? tempError : null;
        }
        attachErrorIfNoneExists(error) {
          if (this._lastSeenError) {
            return;
          }
          this._lastSeenError = _resolveError(error);
        }
        _capture(tag, task) {
          try {
            const res = task();
            if (res && res instanceof Promise) {
              return res.catch((err) => this._onError(tag, err));
            }
            return res;
          } catch (error) {
            this._onError(tag, error);
            return null;
          }
        }
        _onError(tag, error) {
          try {
            Log_1.Log.warn(`Caught error in ${tag}`, { error });
            const impl = () => __awaiter2(this, void 0, void 0, function* () {
              var _a, _b, _c, _d, _e, _f, _g;
              const unwrapped = error ? error : Error(UNKNOWN_ERROR);
              const isError = unwrapped instanceof Error;
              const name = isError ? unwrapped.name : "No Name";
              const resolvedError = _resolveError(unwrapped);
              this._lastSeenError = resolvedError;
              if (this._seen.has(name)) {
                return;
              }
              this._seen.add(name);
              if ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.preventAllNetworkTraffic) {
                (_c = this._emitter) === null || _c === void 0 ? void 0 : _c.call(this, {
                  name: "error",
                  error,
                  tag
                });
                return;
              }
              const sdkType = SDKType_1.SDKType._get(this._sdkKey);
              const statsigMetadata = StatsigMetadata_1.StatsigMetadataProvider.get();
              const info = isError ? unwrapped.stack : _getDescription(unwrapped);
              const body = Object.assign({ tag, exception: name, info, statsigOptions: _getStatsigOptionLoggingCopy(this._options) }, Object.assign(Object.assign({}, statsigMetadata), { sdkType }));
              const func = (_f = (_e = (_d = this._options) === null || _d === void 0 ? void 0 : _d.networkConfig) === null || _e === void 0 ? void 0 : _e.networkOverrideFunc) !== null && _f !== void 0 ? _f : fetch;
              yield func(exports.EXCEPTION_ENDPOINT, {
                method: "POST",
                headers: {
                  "STATSIG-API-KEY": this._sdkKey,
                  "STATSIG-SDK-TYPE": String(sdkType),
                  "STATSIG-SDK-VERSION": String(statsigMetadata.sdkVersion),
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              });
              (_g = this._emitter) === null || _g === void 0 ? void 0 : _g.call(this, {
                name: "error",
                error,
                tag
              });
            });
            impl().then(() => {
            }).catch(() => {
            });
          } catch (_error) {
          }
        }
      };
      exports.ErrorBoundary = ErrorBoundary;
      function _resolveError(error) {
        if (error instanceof Error) {
          return error;
        } else if (typeof error === "string") {
          return new Error(error);
        } else {
          return new Error("An unknown error occurred.");
        }
      }
      function _getDescription(obj) {
        try {
          return JSON.stringify(obj);
        } catch (_a) {
          return UNKNOWN_ERROR;
        }
      }
      function _getAllInstanceMethodNames(instance) {
        const names = /* @__PURE__ */ new Set();
        let proto = Object.getPrototypeOf(instance);
        while (proto && proto !== Object.prototype) {
          Object.getOwnPropertyNames(proto).filter((prop) => typeof (proto === null || proto === void 0 ? void 0 : proto[prop]) === "function").forEach((name) => names.add(name));
          proto = Object.getPrototypeOf(proto);
        }
        return Array.from(names);
      }
      function _getStatsigOptionLoggingCopy(options) {
        if (!options) {
          return {};
        }
        const loggingCopy = {};
        Object.entries(options).forEach(([option, value]) => {
          const valueType = typeof value;
          switch (valueType) {
            case "number":
            case "bigint":
            case "boolean":
              loggingCopy[String(option)] = value;
              break;
            case "string":
              if (value.length < 50) {
                loggingCopy[String(option)] = value;
              } else {
                loggingCopy[String(option)] = "set";
              }
              break;
            case "object":
              if (option === "environment") {
                loggingCopy["environment"] = value;
              } else if (option === "networkConfig") {
                loggingCopy["networkConfig"] = value;
              } else {
                loggingCopy[String(option)] = value != null ? "set" : "unset";
              }
              break;
            default:
          }
        });
        return loggingCopy;
      }
    }
  });

  // node_modules/@statsig/client-core/src/EvaluationOptions.js
  var require_EvaluationOptions = __commonJS({
    "node_modules/@statsig/client-core/src/EvaluationOptions.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/EvaluationTypes.js
  var require_EvaluationTypes = __commonJS({
    "node_modules/@statsig/client-core/src/EvaluationTypes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/InitializeResponse.js
  var require_InitializeResponse = __commonJS({
    "node_modules/@statsig/client-core/src/InitializeResponse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/MemoKey.js
  var require_MemoKey = __commonJS({
    "node_modules/@statsig/client-core/src/MemoKey.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createMemoKey = exports.MemoPrefix = void 0;
      exports.MemoPrefix = {
        _gate: "g",
        _dynamicConfig: "c",
        _experiment: "e",
        _layer: "l",
        _paramStore: "p"
      };
      var EXIST_KEYS = /* @__PURE__ */ new Set([
        // Add keys that should be memoized based only on their existence, not their value
      ]);
      var DO_NOT_MEMO_KEYS = /* @__PURE__ */ new Set([
        // Add keys that if exist, should not be memoized
        "userPersistedValues"
      ]);
      function createMemoKey(prefix, name, options) {
        let cacheKey = `${prefix}|${name}`;
        if (!options) {
          return cacheKey;
        }
        for (const key of Object.keys(options)) {
          if (DO_NOT_MEMO_KEYS.has(key)) {
            return void 0;
          }
          if (EXIST_KEYS.has(key)) {
            cacheKey += `|${key}=true`;
          } else {
            cacheKey += `|${key}=${options[key]}`;
          }
        }
        return cacheKey;
      }
      exports.createMemoKey = createMemoKey;
    }
  });

  // node_modules/@statsig/client-core/src/DnsTxtQuery.js
  var require_DnsTxtQuery = __commonJS({
    "node_modules/@statsig/client-core/src/DnsTxtQuery.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._fetchTxtRecords = void 0;
      var FEATURE_ASSETS_DNS_QUERY = new Uint8Array([
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        13,
        102,
        101,
        97,
        116,
        117,
        114,
        101,
        97,
        115,
        115,
        101,
        116,
        115,
        3,
        111,
        114,
        103,
        0,
        0,
        16,
        0,
        1
      ]);
      var DNS_QUERY_ENDPOINT = "https://cloudflare-dns.com/dns-query";
      var DOMAIN_CHARS = [
        "i",
        // initialize
        "e",
        // events
        "d"
        // dcs
      ];
      var MAX_START_LOOKUP = 200;
      function _fetchTxtRecords(networkFunc) {
        return __awaiter2(this, void 0, void 0, function* () {
          const response = yield networkFunc(DNS_QUERY_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/dns-message",
              Accept: "application/dns-message"
            },
            body: FEATURE_ASSETS_DNS_QUERY
          });
          if (!response.ok) {
            const err = new Error("Failed to fetch TXT records from DNS");
            err.name = "DnsTxtFetchError";
            throw err;
          }
          const data = yield response.arrayBuffer();
          const bytes = new Uint8Array(data);
          return _parseDnsResponse(bytes);
        });
      }
      exports._fetchTxtRecords = _fetchTxtRecords;
      function _parseDnsResponse(input) {
        const start = input.findIndex((byte, index) => index < MAX_START_LOOKUP && String.fromCharCode(byte) === "=" && DOMAIN_CHARS.includes(String.fromCharCode(input[index - 1])));
        if (start === -1) {
          const err = new Error("Failed to parse TXT records from DNS");
          err.name = "DnsTxtParseError";
          throw err;
        }
        let result = "";
        for (let i = start - 1; i < input.length; i++) {
          result += String.fromCharCode(input[i]);
        }
        return result.split(",");
      }
    }
  });

  // node_modules/@statsig/client-core/src/NetworkFallbackResolver.js
  var require_NetworkFallbackResolver = __commonJS({
    "node_modules/@statsig/client-core/src/NetworkFallbackResolver.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._isDomainFailure = exports.NetworkFallbackResolver = void 0;
      var DnsTxtQuery_1 = require_DnsTxtQuery();
      var Hashing_1 = require_Hashing();
      var Log_1 = require_Log();
      var StorageProvider_1 = require_StorageProvider();
      var DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
      var COOLDOWN_TIME_MS = 4 * 60 * 60 * 1e3;
      var NetworkFallbackResolver = class {
        constructor(options) {
          var _a;
          this._fallbackInfo = null;
          this._errorBoundary = null;
          this._dnsQueryCooldowns = {};
          this._networkOverrideFunc = (_a = options.networkConfig) === null || _a === void 0 ? void 0 : _a.networkOverrideFunc;
        }
        setErrorBoundary(errorBoundary) {
          this._errorBoundary = errorBoundary;
        }
        tryBumpExpiryTime(sdkKey, urlConfig) {
          var _a;
          const info = (_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[urlConfig.endpoint];
          if (!info) {
            return;
          }
          info.expiryTime = Date.now() + DEFAULT_TTL_MS;
          _tryWriteFallbackInfoToCache(sdkKey, Object.assign(Object.assign({}, this._fallbackInfo), { [urlConfig.endpoint]: info }));
        }
        getActiveFallbackUrl(sdkKey, urlConfig) {
          var _a, _b;
          if (urlConfig.customUrl != null && urlConfig.fallbackUrls != null) {
            return null;
          }
          let info = this._fallbackInfo;
          if (info == null) {
            info = (_a = _readFallbackInfoFromCache(sdkKey)) !== null && _a !== void 0 ? _a : {};
            this._fallbackInfo = info;
          }
          const entry = info[urlConfig.endpoint];
          if (!entry || Date.now() > ((_b = entry.expiryTime) !== null && _b !== void 0 ? _b : 0) || urlConfig.getChecksum() !== entry.urlConfigChecksum) {
            delete info[urlConfig.endpoint];
            this._fallbackInfo = info;
            _tryWriteFallbackInfoToCache(sdkKey, this._fallbackInfo);
            return null;
          }
          if (entry.url) {
            return entry.url;
          }
          return null;
        }
        tryFetchUpdatedFallbackInfo(sdkKey, urlConfig, errorMessage, timedOut) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a, _b;
            try {
              if (!_isDomainFailure(errorMessage, timedOut)) {
                return false;
              }
              const canUseNetworkFallbacks = urlConfig.customUrl == null && urlConfig.fallbackUrls == null;
              const urls = canUseNetworkFallbacks ? yield this._tryFetchFallbackUrlsFromNetwork(urlConfig) : urlConfig.fallbackUrls;
              const newUrl = this._pickNewFallbackUrl((_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[urlConfig.endpoint], urls);
              if (!newUrl) {
                return false;
              }
              this._updateFallbackInfoWithNewUrl(sdkKey, urlConfig, newUrl);
              return true;
            } catch (error) {
              (_b = this._errorBoundary) === null || _b === void 0 ? void 0 : _b.logError("tryFetchUpdatedFallbackInfo", error);
              return false;
            }
          });
        }
        _updateFallbackInfoWithNewUrl(sdkKey, urlConfig, newUrl) {
          var _a, _b, _c;
          const newFallbackInfo = {
            urlConfigChecksum: urlConfig.getChecksum(),
            url: newUrl,
            expiryTime: Date.now() + DEFAULT_TTL_MS,
            previous: []
          };
          const endpoint = urlConfig.endpoint;
          const previousInfo = (_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[endpoint];
          if (previousInfo) {
            newFallbackInfo.previous.push(...previousInfo.previous);
          }
          if (newFallbackInfo.previous.length > 10) {
            newFallbackInfo.previous = [];
          }
          const previousUrl = (_c = (_b = this._fallbackInfo) === null || _b === void 0 ? void 0 : _b[endpoint]) === null || _c === void 0 ? void 0 : _c.url;
          if (previousUrl != null) {
            newFallbackInfo.previous.push(previousUrl);
          }
          this._fallbackInfo = Object.assign(Object.assign({}, this._fallbackInfo), { [endpoint]: newFallbackInfo });
          _tryWriteFallbackInfoToCache(sdkKey, this._fallbackInfo);
        }
        _tryFetchFallbackUrlsFromNetwork(urlConfig) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a;
            const cooldown = this._dnsQueryCooldowns[urlConfig.endpoint];
            if (cooldown && Date.now() < cooldown) {
              return null;
            }
            this._dnsQueryCooldowns[urlConfig.endpoint] = Date.now() + COOLDOWN_TIME_MS;
            const result = [];
            const records = yield (0, DnsTxtQuery_1._fetchTxtRecords)((_a = this._networkOverrideFunc) !== null && _a !== void 0 ? _a : fetch);
            const path = _extractPathFromUrl(urlConfig.defaultUrl);
            for (const record of records) {
              if (!record.startsWith(urlConfig.endpointDnsKey + "=")) {
                continue;
              }
              const parts = record.split("=");
              if (parts.length > 1) {
                let baseUrl = parts[1];
                if (baseUrl.endsWith("/")) {
                  baseUrl = baseUrl.slice(0, -1);
                }
                result.push(`https://${baseUrl}${path}`);
              }
            }
            return result;
          });
        }
        _pickNewFallbackUrl(currentFallbackInfo, urls) {
          var _a;
          if (urls == null) {
            return null;
          }
          const previouslyUsed = new Set((_a = currentFallbackInfo === null || currentFallbackInfo === void 0 ? void 0 : currentFallbackInfo.previous) !== null && _a !== void 0 ? _a : []);
          const currentFallbackUrl = currentFallbackInfo === null || currentFallbackInfo === void 0 ? void 0 : currentFallbackInfo.url;
          let found = null;
          for (const loopUrl of urls) {
            const url = loopUrl.endsWith("/") ? loopUrl.slice(0, -1) : loopUrl;
            if (!previouslyUsed.has(loopUrl) && url !== currentFallbackUrl) {
              found = url;
              break;
            }
          }
          return found;
        }
      };
      exports.NetworkFallbackResolver = NetworkFallbackResolver;
      function _isDomainFailure(errorMsg, timedOut) {
        var _a;
        const lowerErrorMsg = (_a = errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.toLowerCase()) !== null && _a !== void 0 ? _a : "";
        return timedOut || lowerErrorMsg.includes("uncaught exception") || lowerErrorMsg.includes("failed to fetch") || lowerErrorMsg.includes("networkerror when attempting to fetch resource");
      }
      exports._isDomainFailure = _isDomainFailure;
      function _getFallbackInfoStorageKey(sdkKey) {
        return `statsig.network_fallback.${(0, Hashing_1._DJB2)(sdkKey)}`;
      }
      function _tryWriteFallbackInfoToCache(sdkKey, info) {
        const hashKey = _getFallbackInfoStorageKey(sdkKey);
        if (!info || Object.keys(info).length === 0) {
          StorageProvider_1.Storage.removeItem(hashKey);
          return;
        }
        StorageProvider_1.Storage.setItem(hashKey, JSON.stringify(info));
      }
      function _readFallbackInfoFromCache(sdkKey) {
        const hashKey = _getFallbackInfoStorageKey(sdkKey);
        const data = StorageProvider_1.Storage.getItem(hashKey);
        if (!data) {
          return null;
        }
        try {
          return JSON.parse(data);
        } catch (_a) {
          Log_1.Log.error("Failed to parse FallbackInfo");
          return null;
        }
      }
      function _extractPathFromUrl(urlString) {
        try {
          const url = new URL(urlString);
          return url.pathname;
        } catch (error) {
          return null;
        }
      }
    }
  });

  // node_modules/@statsig/client-core/src/SDKFlags.js
  var require_SDKFlags = __commonJS({
    "node_modules/@statsig/client-core/src/SDKFlags.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SDKFlags = void 0;
      var FLAGMAP = {};
      exports.SDKFlags = {
        setFlags: (sdkKey, flags) => {
          FLAGMAP[sdkKey] = flags;
        },
        get: (sdkKey, flagKey) => {
          var _a, _b;
          return (_b = (_a = FLAGMAP[sdkKey]) === null || _a === void 0 ? void 0 : _a[flagKey]) !== null && _b !== void 0 ? _b : false;
        }
      };
    }
  });

  // node_modules/@statsig/client-core/src/SessionID.js
  var require_SessionID = __commonJS({
    "node_modules/@statsig/client-core/src/SessionID.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatsigSession = exports.SessionID = void 0;
      var __StatsigGlobal_1 = require_StatsigGlobal();
      var CacheKey_1 = require_CacheKey();
      var Log_1 = require_Log();
      var StorageProvider_1 = require_StorageProvider();
      var UUID_1 = require_UUID();
      var MAX_SESSION_IDLE_TIME = 30 * 60 * 1e3;
      var MAX_SESSION_AGE = 4 * 60 * 60 * 1e3;
      var PROMISE_MAP = {};
      exports.SessionID = {
        get: (sdkKey) => {
          return exports.StatsigSession.get(sdkKey).data.sessionID;
        }
      };
      exports.StatsigSession = {
        get: (sdkKey) => {
          if (PROMISE_MAP[sdkKey] == null) {
            PROMISE_MAP[sdkKey] = _loadSession(sdkKey);
          }
          const session = PROMISE_MAP[sdkKey];
          return _bumpSession(session);
        },
        overrideInitialSessionID: (override, sdkKey) => {
          PROMISE_MAP[sdkKey] = _overrideSessionId(override, sdkKey);
        }
      };
      function _loadSession(sdkKey) {
        let data = _loadFromStorage(sdkKey);
        const now = Date.now();
        if (!data) {
          data = {
            sessionID: (0, UUID_1.getUUID)(),
            startTime: now,
            lastUpdate: now
          };
        }
        return {
          data,
          sdkKey
        };
      }
      function _overrideSessionId(override, sdkKey) {
        const now = Date.now();
        return {
          data: {
            sessionID: override,
            startTime: now,
            lastUpdate: now
          },
          sdkKey
        };
      }
      function _bumpSession(session) {
        const now = Date.now();
        const data = session.data;
        const sdkKey = session.sdkKey;
        if (_isIdle(data) || _hasRunTooLong(data)) {
          data.sessionID = (0, UUID_1.getUUID)();
          data.startTime = now;
          const client = __STATSIG__ === null || __STATSIG__ === void 0 ? void 0 : __STATSIG__.instance(sdkKey);
          if (client) {
            client.$emt({ name: "session_expired" });
          }
        }
        data.lastUpdate = now;
        _persistToStorage(data, session.sdkKey);
        clearTimeout(session.idleTimeoutID);
        clearTimeout(session.ageTimeoutID);
        const lifetime = now - data.startTime;
        session.idleTimeoutID = _createSessionTimeout(sdkKey, MAX_SESSION_IDLE_TIME);
        session.ageTimeoutID = _createSessionTimeout(sdkKey, MAX_SESSION_AGE - lifetime);
        return session;
      }
      function _createSessionTimeout(sdkKey, duration) {
        return setTimeout(() => {
          var _a;
          const client = (_a = (0, __StatsigGlobal_1._getStatsigGlobal)()) === null || _a === void 0 ? void 0 : _a.instance(sdkKey);
          if (client) {
            client.$emt({ name: "session_expired" });
          }
        }, duration);
      }
      function _isIdle({ lastUpdate }) {
        return Date.now() - lastUpdate > MAX_SESSION_IDLE_TIME;
      }
      function _hasRunTooLong({ startTime }) {
        return Date.now() - startTime > MAX_SESSION_AGE;
      }
      function _getSessionIDStorageKey(sdkKey) {
        return `statsig.session_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
      }
      function _persistToStorage(session, sdkKey) {
        const storageKey = _getSessionIDStorageKey(sdkKey);
        try {
          (0, StorageProvider_1._setObjectInStorage)(storageKey, session);
        } catch (e) {
          Log_1.Log.warn("Failed to save SessionID");
        }
      }
      function _loadFromStorage(sdkKey) {
        const storageKey = _getSessionIDStorageKey(sdkKey);
        return (0, StorageProvider_1._getObjectFromStorage)(storageKey);
      }
    }
  });

  // node_modules/@statsig/client-core/src/StatsigClientEventEmitter.js
  var require_StatsigClientEventEmitter = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigClientEventEmitter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ErrorTag = void 0;
      exports.ErrorTag = {
        NetworkError: "NetworkError"
      };
    }
  });

  // node_modules/@statsig/client-core/src/NetworkCore.js
  var require_NetworkCore = __commonJS({
    "node_modules/@statsig/client-core/src/NetworkCore.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NetworkCore = void 0;
      require_StatsigGlobal();
      var __StatsigGlobal_1 = require_StatsigGlobal();
      var Diagnostics_1 = require_Diagnostics();
      var Log_1 = require_Log();
      var NetworkConfig_1 = require_NetworkConfig();
      var NetworkFallbackResolver_1 = require_NetworkFallbackResolver();
      var SDKFlags_1 = require_SDKFlags();
      var SDKType_1 = require_SDKType();
      var SafeJs_1 = require_SafeJs();
      var SessionID_1 = require_SessionID();
      var StableID_1 = require_StableID();
      var StatsigClientEventEmitter_1 = require_StatsigClientEventEmitter();
      var StatsigMetadata_1 = require_StatsigMetadata();
      var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
      var VisibilityObserving_1 = require_VisibilityObserving();
      var DEFAULT_TIMEOUT_MS = 1e4;
      var BACKOFF_BASE_MS = 500;
      var BACKOFF_MAX_MS = 3e4;
      var RATE_LIMIT_WINDOW_MS = 1e3;
      var RATE_LIMIT_MAX_REQ_COUNT = 50;
      var LEAK_RATE = RATE_LIMIT_MAX_REQ_COUNT / RATE_LIMIT_WINDOW_MS;
      var RETRYABLE_CODES = /* @__PURE__ */ new Set([408, 500, 502, 503, 504, 522, 524, 599]);
      var NetworkCore = class {
        constructor(options, _emitter) {
          this._emitter = _emitter;
          this._errorBoundary = null;
          this._timeout = DEFAULT_TIMEOUT_MS;
          this._netConfig = {};
          this._options = {};
          this._leakyBucket = {};
          this._lastUsedInitUrl = null;
          if (options) {
            this._options = options;
          }
          if (this._options.networkConfig) {
            this._netConfig = this._options.networkConfig;
          }
          if (this._netConfig.networkTimeoutMs) {
            this._timeout = this._netConfig.networkTimeoutMs;
          }
          this._fallbackResolver = new NetworkFallbackResolver_1.NetworkFallbackResolver(this._options);
          this.setLogEventCompressionMode(this._getLogEventCompressionMode(options));
        }
        setLogEventCompressionMode(mode) {
          this._options.logEventCompressionMode = mode;
        }
        setErrorBoundary(errorBoundary) {
          this._errorBoundary = errorBoundary;
          this._errorBoundary.wrap(this);
          this._errorBoundary.wrap(this._fallbackResolver);
          this._fallbackResolver.setErrorBoundary(errorBoundary);
        }
        isBeaconSupported() {
          return typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function";
        }
        getLastUsedInitUrlAndReset() {
          const tempUrl = this._lastUsedInitUrl;
          this._lastUsedInitUrl = null;
          return tempUrl;
        }
        beacon(args) {
          if (!_ensureValidSdkKey(args)) {
            return false;
          }
          const argsInternal = this._getInternalRequestArgs("POST", args);
          const url = this._getPopulatedURL(argsInternal);
          const nav = navigator;
          return nav.sendBeacon.bind(nav)(url, argsInternal.body);
        }
        post(args) {
          return __awaiter2(this, void 0, void 0, function* () {
            const argsInternal = this._getInternalRequestArgs("POST", args);
            this._tryEncodeBody(argsInternal);
            yield this._tryToCompressBody(argsInternal);
            return this._sendRequest(argsInternal);
          });
        }
        get(args) {
          const argsInternal = this._getInternalRequestArgs("GET", args);
          return this._sendRequest(argsInternal);
        }
        _sendRequest(args) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!_ensureValidSdkKey(args)) {
              return null;
            }
            if (this._netConfig.preventAllNetworkTraffic) {
              return null;
            }
            const { method, body, retries, attempt } = args;
            const endpoint = args.urlConfig.endpoint;
            if (this._isRateLimited(endpoint)) {
              Log_1.Log.warn(`Request to ${endpoint} was blocked because you are making requests too frequently.`);
              return null;
            }
            const currentAttempt = attempt !== null && attempt !== void 0 ? attempt : 1;
            const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
            const timeoutHandle = setTimeout(() => {
              abortController === null || abortController === void 0 ? void 0 : abortController.abort(`Timeout of ${this._timeout}ms expired.`);
            }, this._timeout);
            const populatedUrl = this._getPopulatedURL(args);
            let response = null;
            const keepalive = (0, VisibilityObserving_1._isUnloading)();
            try {
              const config = {
                method,
                body,
                headers: Object.assign({}, args.headers),
                signal: abortController === null || abortController === void 0 ? void 0 : abortController.signal,
                priority: args.priority,
                keepalive
              };
              _tryMarkInitStart(args, currentAttempt);
              const bucket = this._leakyBucket[endpoint];
              if (bucket) {
                bucket.lastRequestTime = Date.now();
                this._leakyBucket[endpoint] = bucket;
              }
              const func = (_a = this._netConfig.networkOverrideFunc) !== null && _a !== void 0 ? _a : fetch;
              response = yield func(populatedUrl, config);
              clearTimeout(timeoutHandle);
              if (!response.ok) {
                const text2 = yield response.text().catch(() => "No Text");
                const err = new Error(`NetworkError: ${populatedUrl} ${text2}`);
                err.name = "NetworkError";
                throw err;
              }
              const text = yield response.text();
              _tryMarkInitEnd(args, response, currentAttempt, text);
              this._fallbackResolver.tryBumpExpiryTime(args.sdkKey, args.urlConfig);
              return {
                body: text,
                code: response.status
              };
            } catch (error) {
              const errorMessage = _getErrorMessage(abortController, error);
              const timedOut = _didTimeout(abortController);
              _tryMarkInitEnd(args, response, currentAttempt, "", error);
              const fallbackUpdated = yield this._fallbackResolver.tryFetchUpdatedFallbackInfo(args.sdkKey, args.urlConfig, errorMessage, timedOut);
              if (fallbackUpdated) {
                args.fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(args.sdkKey, args.urlConfig);
              }
              if (!retries || currentAttempt > retries || !RETRYABLE_CODES.has((_b = response === null || response === void 0 ? void 0 : response.status) !== null && _b !== void 0 ? _b : 500)) {
                (_c = this._emitter) === null || _c === void 0 ? void 0 : _c.call(this, {
                  name: "error",
                  error,
                  tag: StatsigClientEventEmitter_1.ErrorTag.NetworkError,
                  requestArgs: args
                });
                const formattedErrorMsg = `A networking error occurred during ${method} request to ${populatedUrl}.`;
                Log_1.Log.error(formattedErrorMsg, errorMessage, error);
                (_d = this._errorBoundary) === null || _d === void 0 ? void 0 : _d.attachErrorIfNoneExists(formattedErrorMsg);
                return null;
              }
              yield _exponentialBackoff(currentAttempt);
              return this._sendRequest(Object.assign(Object.assign({}, args), { retries, attempt: currentAttempt + 1 }));
            }
          });
        }
        _getLogEventCompressionMode(options) {
          let compressionMode = options === null || options === void 0 ? void 0 : options.logEventCompressionMode;
          if (!compressionMode && (options === null || options === void 0 ? void 0 : options.disableCompression) === true) {
            compressionMode = StatsigOptionsCommon_1.LogEventCompressionMode.Disabled;
          }
          if (!compressionMode) {
            compressionMode = StatsigOptionsCommon_1.LogEventCompressionMode.Enabled;
          }
          return compressionMode;
        }
        _isRateLimited(endpoint) {
          var _a;
          const now = Date.now();
          const bucket = (_a = this._leakyBucket[endpoint]) !== null && _a !== void 0 ? _a : {
            count: 0,
            lastRequestTime: now
          };
          const elapsed = now - bucket.lastRequestTime;
          const leakedRequests = Math.floor(elapsed * LEAK_RATE);
          bucket.count = Math.max(0, bucket.count - leakedRequests);
          if (bucket.count >= RATE_LIMIT_MAX_REQ_COUNT) {
            return true;
          }
          bucket.count += 1;
          bucket.lastRequestTime = now;
          this._leakyBucket[endpoint] = bucket;
          return false;
        }
        _getPopulatedURL(args) {
          var _a;
          const url = (_a = args.fallbackUrl) !== null && _a !== void 0 ? _a : args.urlConfig.getUrl();
          if (args.urlConfig.endpoint === NetworkConfig_1.Endpoint._initialize || args.urlConfig.endpoint === NetworkConfig_1.Endpoint._download_config_specs) {
            this._lastUsedInitUrl = url;
          }
          const params = Object.assign({ [NetworkConfig_1.NetworkParam.SdkKey]: args.sdkKey, [NetworkConfig_1.NetworkParam.SdkType]: SDKType_1.SDKType._get(args.sdkKey), [NetworkConfig_1.NetworkParam.SdkVersion]: StatsigMetadata_1.SDK_VERSION, [NetworkConfig_1.NetworkParam.Time]: String(Date.now()), [NetworkConfig_1.NetworkParam.SessionID]: SessionID_1.SessionID.get(args.sdkKey) }, args.params);
          const query = Object.keys(params).map((key) => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
          }).join("&");
          return `${url}${query ? `?${query}` : ""}`;
        }
        _tryEncodeBody(args) {
          var _a;
          const win = (0, SafeJs_1._getWindowSafe)();
          const body = args.body;
          if (!args.isStatsigEncodable || this._options.disableStatsigEncoding || typeof body !== "string" || (0, __StatsigGlobal_1._getStatsigGlobalFlag)("no-encode") != null || !(win === null || win === void 0 ? void 0 : win.btoa)) {
            return;
          }
          try {
            args.body = win.btoa(body).split("").reverse().join("");
            args.params = Object.assign(Object.assign({}, (_a = args.params) !== null && _a !== void 0 ? _a : {}), { [NetworkConfig_1.NetworkParam.StatsigEncoded]: "1" });
          } catch (e) {
            Log_1.Log.warn(`Request encoding failed for ${args.urlConfig.getUrl()}`, e);
          }
        }
        _tryToCompressBody(args) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a;
            const body = args.body;
            if (typeof body !== "string" || !_allowCompression(args, this._options)) {
              return;
            }
            try {
              const bytes = new TextEncoder().encode(body);
              const stream = new CompressionStream("gzip");
              const writer = stream.writable.getWriter();
              writer.write(bytes).catch(Log_1.Log.error);
              writer.close().catch(Log_1.Log.error);
              const reader = stream.readable.getReader();
              const chunks = [];
              let result;
              while (!(result = yield reader.read()).done) {
                chunks.push(result.value);
              }
              const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
              const combined = new Uint8Array(totalLength);
              let offset = 0;
              for (const chunk of chunks) {
                combined.set(chunk, offset);
                offset += chunk.length;
              }
              args.body = combined;
              args.params = Object.assign(Object.assign({}, (_a = args.params) !== null && _a !== void 0 ? _a : {}), { [NetworkConfig_1.NetworkParam.IsGzipped]: "1" });
            } catch (e) {
              Log_1.Log.warn(`Request compression failed for ${args.urlConfig.getUrl()}`, e);
            }
          });
        }
        _getInternalRequestArgs(method, args) {
          const fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(args.sdkKey, args.urlConfig);
          const result = Object.assign(Object.assign({}, args), {
            method,
            fallbackUrl
          });
          if ("data" in args) {
            _populateRequestBody(result, args.data);
          }
          return result;
        }
      };
      exports.NetworkCore = NetworkCore;
      var _ensureValidSdkKey = (args) => {
        if (!args.sdkKey) {
          Log_1.Log.warn("Unable to make request without an SDK key");
          return false;
        }
        return true;
      };
      var _populateRequestBody = (args, data) => {
        const { sdkKey, fallbackUrl } = args;
        const stableID = StableID_1.StableID.get(sdkKey);
        const sessionID = SessionID_1.SessionID.get(sdkKey);
        const sdkType = SDKType_1.SDKType._get(sdkKey);
        args.body = JSON.stringify(Object.assign(Object.assign({}, data), { statsigMetadata: Object.assign(Object.assign({}, StatsigMetadata_1.StatsigMetadataProvider.get()), {
          stableID,
          sessionID,
          sdkType,
          fallbackUrl
        }) }));
      };
      function _allowCompression(args, options) {
        if (!args.isCompressable) {
          return false;
        }
        if ((0, __StatsigGlobal_1._getStatsigGlobalFlag)("no-compress") != null || typeof CompressionStream === "undefined" || typeof TextEncoder === "undefined") {
          return false;
        }
        const isProxy = args.urlConfig.customUrl != null || args.urlConfig.fallbackUrls != null;
        const flagEnabled = SDKFlags_1.SDKFlags.get(args.sdkKey, "enable_log_event_compression") === true;
        switch (options.logEventCompressionMode) {
          case StatsigOptionsCommon_1.LogEventCompressionMode.Disabled:
            return false;
          case StatsigOptionsCommon_1.LogEventCompressionMode.Enabled:
            if (isProxy && !flagEnabled) {
              return false;
            }
            return true;
          case StatsigOptionsCommon_1.LogEventCompressionMode.Forced:
            return true;
          default:
            return false;
        }
      }
      function _getErrorMessage(controller, error) {
        if ((controller === null || controller === void 0 ? void 0 : controller.signal.aborted) && typeof controller.signal.reason === "string") {
          return controller.signal.reason;
        }
        if (typeof error === "string") {
          return error;
        }
        if (error instanceof Error) {
          return `${error.name}: ${error.message}`;
        }
        return "Unknown Error";
      }
      function _didTimeout(controller) {
        const timeout = (controller === null || controller === void 0 ? void 0 : controller.signal.aborted) && typeof controller.signal.reason === "string" && controller.signal.reason.includes("Timeout");
        return timeout || false;
      }
      function _tryMarkInitStart(args, attempt) {
        if (args.urlConfig.endpoint !== NetworkConfig_1.Endpoint._initialize) {
          return;
        }
        Diagnostics_1.Diagnostics._markInitNetworkReqStart(args.sdkKey, {
          attempt
        });
      }
      function _tryMarkInitEnd(args, response, attempt, body, err) {
        if (args.urlConfig.endpoint !== NetworkConfig_1.Endpoint._initialize) {
          return;
        }
        Diagnostics_1.Diagnostics._markInitNetworkReqEnd(args.sdkKey, Diagnostics_1.Diagnostics._getDiagnosticsData(response, attempt, body, err));
      }
      function _exponentialBackoff(attempt) {
        return __awaiter2(this, void 0, void 0, function* () {
          yield new Promise((r) => setTimeout(r, Math.min(BACKOFF_BASE_MS * (attempt * attempt), BACKOFF_MAX_MS)));
        });
      }
    }
  });

  // node_modules/@statsig/client-core/src/OverrideAdapter.js
  var require_OverrideAdapter = __commonJS({
    "node_modules/@statsig/client-core/src/OverrideAdapter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/ParamStoreTypes.js
  var require_ParamStoreTypes = __commonJS({
    "node_modules/@statsig/client-core/src/ParamStoreTypes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/StatsigClientBase.js
  var require_StatsigClientBase = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigClientBase.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatsigClientBase = void 0;
      require_StatsigGlobal();
      var __StatsigGlobal_1 = require_StatsigGlobal();
      var ErrorBoundary_1 = require_ErrorBoundary();
      var EventLogger_1 = require_EventLogger();
      var Log_1 = require_Log();
      var MemoKey_1 = require_MemoKey();
      var SafeJs_1 = require_SafeJs();
      var SessionID_1 = require_SessionID();
      var StableID_1 = require_StableID();
      var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
      var StorageProvider_1 = require_StorageProvider();
      var MAX_MEMO_CACHE_SIZE = 3e3;
      var StatsigClientBase = class {
        constructor(sdkKey, adapter, network, options) {
          var _a, _b, _c, _d;
          this.loadingStatus = "Uninitialized";
          this._initializePromise = null;
          this._listeners = {};
          const emitter = this.$emt.bind(this);
          (options === null || options === void 0 ? void 0 : options.logLevel) != null && (Log_1.Log.level = options.logLevel);
          (options === null || options === void 0 ? void 0 : options.disableStorage) && StorageProvider_1.Storage._setDisabled(true);
          (options === null || options === void 0 ? void 0 : options.initialSessionID) && SessionID_1.StatsigSession.overrideInitialSessionID(options.initialSessionID, sdkKey);
          (options === null || options === void 0 ? void 0 : options.storageProvider) && StorageProvider_1.Storage._setProvider(options.storageProvider);
          (options === null || options === void 0 ? void 0 : options.enableCookies) && StableID_1.StableID._setCookiesEnabled(sdkKey, options.enableCookies);
          (options === null || options === void 0 ? void 0 : options.disableStableID) && StableID_1.StableID._setDisabled(sdkKey, true);
          this._sdkKey = sdkKey;
          this._options = options !== null && options !== void 0 ? options : {};
          this._memoCache = {};
          this.overrideAdapter = (_a = options === null || options === void 0 ? void 0 : options.overrideAdapter) !== null && _a !== void 0 ? _a : null;
          this._logger = new EventLogger_1.EventLogger(sdkKey, emitter, network, options);
          this._errorBoundary = new ErrorBoundary_1.ErrorBoundary(sdkKey, options, emitter);
          this._errorBoundary.wrap(this);
          this._errorBoundary.wrap(adapter);
          this._errorBoundary.wrap(this._logger);
          network.setErrorBoundary(this._errorBoundary);
          this.dataAdapter = adapter;
          this.dataAdapter.attach(sdkKey, options, network);
          this.storageProvider = StorageProvider_1.Storage;
          (_d = (_c = (_b = this.overrideAdapter) === null || _b === void 0 ? void 0 : _b.loadFromStorage) === null || _c === void 0 ? void 0 : _c.call(_b)) === null || _d === void 0 ? void 0 : _d.catch((e) => this._errorBoundary.logError("OA::loadFromStorage", e));
          this._primeReadyRipcord();
          _assignGlobalInstance(sdkKey, this);
        }
        /**
         * Updates runtime configuration options for the SDK, allowing toggling of certain behaviors such as logging and storage to comply with user preferences or regulations such as GDPR.
         *
         * @param {StatsigRuntimeMutableOptions} options - The configuration options that dictate the runtime behavior of the SDK.
         */
        updateRuntimeOptions(options) {
          if (options.loggingEnabled) {
            this._options.loggingEnabled = options.loggingEnabled;
            this._logger.setLoggingEnabled(options.loggingEnabled);
          } else if (options.disableLogging != null) {
            this._options.disableLogging = options.disableLogging;
            this._logger.setLoggingEnabled(options.disableLogging ? "disabled" : "browser-only");
          }
          if (options.disableStorage != null) {
            this._options.disableStorage = options.disableStorage;
            StorageProvider_1.Storage._setDisabled(options.disableStorage);
          }
          if (options.enableCookies != null) {
            this._options.enableCookies = options.enableCookies;
            StableID_1.StableID._setCookiesEnabled(this._sdkKey, options.enableCookies);
          }
          if (options.logEventCompressionMode) {
            this._logger.setLogEventCompressionMode(options.logEventCompressionMode);
          } else if (options.disableCompression) {
            this._logger.setLogEventCompressionMode(StatsigOptionsCommon_1.LogEventCompressionMode.Disabled);
          }
        }
        /**
         * Flushes any currently queued events.
         */
        flush() {
          return this._logger.flush();
        }
        /**
         * Gracefully shuts down the SDK, ensuring that all pending events are send before the SDK stops.
         * This function emits a 'pre_shutdown' event and then waits for the logger to complete its shutdown process.
         *
         * @returns {Promise<void>} A promise that resolves when all shutdown procedures, including logging shutdown, have been completed.
         */
        shutdown() {
          return __awaiter2(this, void 0, void 0, function* () {
            this.$emt({ name: "pre_shutdown" });
            this._setStatus("Uninitialized", null);
            this._initializePromise = null;
            yield this._logger.stop();
          });
        }
        /**
         * Subscribes a callback function to a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
         * Once subscribed, the listener callback will be invoked whenever the specified event is emitted.
         *
         * @param {StatsigClientEventName} event - The name of the event to subscribe to, or '*' to subscribe to all events.
         * @param {StatsigClientEventCallback<T>} listener - The callback function to execute when the event occurs. The function receives event-specific data as its parameter.
         * @see {@link off} for unsubscribing from events.
         */
        on(event, listener) {
          if (!this._listeners[event]) {
            this._listeners[event] = [];
          }
          this._listeners[event].push(listener);
        }
        /**
         * Unsubscribes a previously registered callback function from a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
         *
         * @param {StatsigClientEventName} event - The name of the event from which to unsubscribe, or '*' to unsubscribe from all events.
         * @param {StatsigClientEventCallback<T>} listener - The callback function to remove from the event's notification list.
         * @see {@link on} for subscribing to events.
         */
        off(event, listener) {
          if (this._listeners[event]) {
            const index = this._listeners[event].indexOf(listener);
            if (index !== -1) {
              this._listeners[event].splice(index, 1);
            }
          }
        }
        $on(event, listener) {
          listener.__isInternal = true;
          this.on(event, listener);
        }
        $emt(event) {
          var _a;
          const barrier = (listener) => {
            try {
              listener(event);
            } catch (error) {
              if (listener.__isInternal === true) {
                this._errorBoundary.logError(`__emit:${event.name}`, error);
                return;
              }
              Log_1.Log.error(`An error occurred in a StatsigClientEvent listener. This is not an issue with Statsig.`, event);
            }
          };
          if (this._listeners[event.name]) {
            this._listeners[event.name].forEach((l) => barrier(l));
          }
          (_a = this._listeners["*"]) === null || _a === void 0 ? void 0 : _a.forEach(barrier);
        }
        _setStatus(newStatus, values) {
          this.loadingStatus = newStatus;
          this._memoCache = {};
          this.$emt({ name: "values_updated", status: newStatus, values });
        }
        _enqueueExposure(name, exposure, options) {
          if ((options === null || options === void 0 ? void 0 : options.disableExposureLog) === true) {
            this._logger.incrementNonExposureCount(name);
            return;
          }
          this._logger.enqueue(exposure);
        }
        _memoize(prefix, fn) {
          return (name, options) => {
            if (this._options.disableEvaluationMemoization) {
              return fn(name, options);
            }
            const memoKey = (0, MemoKey_1.createMemoKey)(prefix, name, options);
            if (!memoKey) {
              return fn(name, options);
            }
            if (!(memoKey in this._memoCache)) {
              if (Object.keys(this._memoCache).length >= MAX_MEMO_CACHE_SIZE) {
                this._memoCache = {};
              }
              this._memoCache[memoKey] = fn(name, options);
            }
            return this._memoCache[memoKey];
          };
        }
      };
      exports.StatsigClientBase = StatsigClientBase;
      function _assignGlobalInstance(sdkKey, client) {
        var _a;
        if ((0, SafeJs_1._isServerEnv)()) {
          return;
        }
        const statsigGlobal = (0, __StatsigGlobal_1._getStatsigGlobal)();
        const instances = (_a = statsigGlobal.instances) !== null && _a !== void 0 ? _a : {};
        const inst = client;
        if (instances[sdkKey] != null) {
          Log_1.Log.warn("Creating multiple Statsig clients with the same SDK key can lead to unexpected behavior. Multi-instance support requires different SDK keys.");
        }
        instances[sdkKey] = inst;
        if (!statsigGlobal.firstInstance) {
          statsigGlobal.firstInstance = inst;
        }
        statsigGlobal.instances = instances;
        __STATSIG__ = statsigGlobal;
      }
    }
  });

  // node_modules/@statsig/client-core/src/StatsigDataAdapter.js
  var require_StatsigDataAdapter = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigDataAdapter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DataAdapterCachePrefix = void 0;
      exports.DataAdapterCachePrefix = "statsig.cached";
    }
  });

  // node_modules/@statsig/client-core/src/StatsigPlugin.js
  var require_StatsigPlugin = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigPlugin.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/StatsigTypeFactories.js
  var require_StatsigTypeFactories = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigTypeFactories.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._makeTypedGet = exports._mergeOverride = exports._makeLayer = exports._makeExperiment = exports._makeDynamicConfig = exports._makeFeatureGate = void 0;
      var Log_1 = require_Log();
      var TypingUtils_1 = require_TypingUtils();
      function _makeEvaluation(name, details, evaluation, value) {
        var _a;
        return {
          name,
          details,
          ruleID: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.rule_id) !== null && _a !== void 0 ? _a : "",
          __evaluation: evaluation,
          value
        };
      }
      function _makeFeatureGate(name, details, evaluation) {
        var _a;
        return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, (evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) === true)), { idType: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type) !== null && _a !== void 0 ? _a : null });
      }
      exports._makeFeatureGate = _makeFeatureGate;
      function _makeDynamicConfig(name, details, evaluation) {
        var _a;
        const value = (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) !== null && _a !== void 0 ? _a : {};
        return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, value)), { get: _makeTypedGet(name, evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) });
      }
      exports._makeDynamicConfig = _makeDynamicConfig;
      function _makeExperiment(name, details, evaluation) {
        var _a;
        const result = _makeDynamicConfig(name, details, evaluation);
        return Object.assign(Object.assign({}, result), { groupName: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.group_name) !== null && _a !== void 0 ? _a : null });
      }
      exports._makeExperiment = _makeExperiment;
      function _makeLayer(name, details, evaluation, exposeFunc) {
        var _a, _b;
        return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, void 0)), { get: _makeTypedGet(name, evaluation === null || evaluation === void 0 ? void 0 : evaluation.value, exposeFunc), groupName: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.group_name) !== null && _a !== void 0 ? _a : null, __value: (_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) !== null && _b !== void 0 ? _b : {} });
      }
      exports._makeLayer = _makeLayer;
      function _mergeOverride(original, overridden, value, exposeFunc) {
        return Object.assign(Object.assign(Object.assign({}, original), overridden), { get: _makeTypedGet(original.name, value, exposeFunc) });
      }
      exports._mergeOverride = _mergeOverride;
      function _makeTypedGet(name, value, exposeFunc) {
        return (param, fallback) => {
          var _a;
          const found = (_a = value === null || value === void 0 ? void 0 : value[param]) !== null && _a !== void 0 ? _a : null;
          if (found == null) {
            return fallback !== null && fallback !== void 0 ? fallback : null;
          }
          if (fallback != null && !(0, TypingUtils_1._isTypeMatch)(found, fallback)) {
            Log_1.Log.warn(`Parameter type mismatch. '${name}.${param}' was found to be type '${typeof found}' but fallback/return type is '${typeof fallback}'. See https://docs.statsig.com/client/javascript-sdk/#typed-getters`);
            return fallback !== null && fallback !== void 0 ? fallback : null;
          }
          exposeFunc === null || exposeFunc === void 0 ? void 0 : exposeFunc(param);
          return found;
        };
      }
      exports._makeTypedGet = _makeTypedGet;
    }
  });

  // node_modules/@statsig/client-core/src/StatsigTypes.js
  var require_StatsigTypes = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigTypes.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@statsig/client-core/src/StatsigUpdateDetails.js
  var require_StatsigUpdateDetails = __commonJS({
    "node_modules/@statsig/client-core/src/StatsigUpdateDetails.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UPDATE_DETAIL_ERROR_MESSAGES = exports.createUpdateDetails = void 0;
      var createUpdateDetails = (success, source, initDuration, error, sourceUrl, warnings) => {
        return {
          duration: initDuration,
          source,
          success,
          error,
          sourceUrl,
          warnings
        };
      };
      exports.createUpdateDetails = createUpdateDetails;
      exports.UPDATE_DETAIL_ERROR_MESSAGES = {
        NO_NETWORK_DATA: "No data was returned from the network. This may be due to a network timeout if a timeout value was specified in the options or ad blocker error."
      };
    }
  });

  // node_modules/@statsig/client-core/src/index.js
  var require_src = __commonJS({
    "node_modules/@statsig/client-core/src/index.js"(exports) {
      "use strict";
      var __createBinding2 = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding2(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Storage = exports.Log = exports.EventLogger = exports.Diagnostics = void 0;
      require_StatsigGlobal();
      var __StatsigGlobal_1 = require_StatsigGlobal();
      var Diagnostics_1 = require_Diagnostics();
      Object.defineProperty(exports, "Diagnostics", { enumerable: true, get: function() {
        return Diagnostics_1.Diagnostics;
      } });
      var EventLogger_1 = require_EventLogger();
      Object.defineProperty(exports, "EventLogger", { enumerable: true, get: function() {
        return EventLogger_1.EventLogger;
      } });
      var Log_1 = require_Log();
      Object.defineProperty(exports, "Log", { enumerable: true, get: function() {
        return Log_1.Log;
      } });
      var StatsigMetadata_1 = require_StatsigMetadata();
      var StorageProvider_1 = require_StorageProvider();
      Object.defineProperty(exports, "Storage", { enumerable: true, get: function() {
        return StorageProvider_1.Storage;
      } });
      __exportStar2(require_StatsigGlobal(), exports);
      __exportStar2(require_CacheKey(), exports);
      __exportStar2(require_ClientInterfaces(), exports);
      __exportStar2(require_DataAdapterCore(), exports);
      __exportStar2(require_Diagnostics(), exports);
      __exportStar2(require_DownloadConfigSpecsResponse(), exports);
      __exportStar2(require_ErrorBoundary(), exports);
      __exportStar2(require_EvaluationOptions(), exports);
      __exportStar2(require_EvaluationTypes(), exports);
      __exportStar2(require_Hashing(), exports);
      __exportStar2(require_InitializeResponse(), exports);
      __exportStar2(require_Log(), exports);
      __exportStar2(require_MemoKey(), exports);
      __exportStar2(require_NetworkConfig(), exports);
      __exportStar2(require_NetworkCore(), exports);
      __exportStar2(require_OverrideAdapter(), exports);
      __exportStar2(require_ParamStoreTypes(), exports);
      __exportStar2(require_SafeJs(), exports);
      __exportStar2(require_SDKType(), exports);
      __exportStar2(require_SessionID(), exports);
      __exportStar2(require_StableID(), exports);
      __exportStar2(require_StatsigClientBase(), exports);
      __exportStar2(require_StatsigClientEventEmitter(), exports);
      __exportStar2(require_StatsigDataAdapter(), exports);
      __exportStar2(require_StatsigEvent(), exports);
      __exportStar2(require_StatsigMetadata(), exports);
      __exportStar2(require_StatsigOptionsCommon(), exports);
      __exportStar2(require_StatsigPlugin(), exports);
      __exportStar2(require_StatsigTypeFactories(), exports);
      __exportStar2(require_StatsigTypes(), exports);
      __exportStar2(require_StatsigUser(), exports);
      __exportStar2(require_StorageProvider(), exports);
      __exportStar2(require_TypedJsonParse(), exports);
      __exportStar2(require_TypingUtils(), exports);
      __exportStar2(require_UrlConfiguration(), exports);
      __exportStar2(require_UUID(), exports);
      __exportStar2(require_VisibilityObserving(), exports);
      __exportStar2(require_StatsigUpdateDetails(), exports);
      __exportStar2(require_SDKFlags(), exports);
      Object.assign((0, __StatsigGlobal_1._getStatsigGlobal)(), { Log: Log_1.Log, SDK_VERSION: StatsigMetadata_1.SDK_VERSION });
    }
  });

  // node_modules/@statsig/js-client/src/EvaluationStore.js
  var require_EvaluationStore = __commonJS({
    "node_modules/@statsig/js-client/src/EvaluationStore.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var client_core_1 = require_src();
      var EvaluationStore = class {
        constructor(_sdkKey) {
          this._sdkKey = _sdkKey;
          this._rawValues = null;
          this._values = null;
          this._source = "Uninitialized";
          this._lcut = 0;
          this._receivedAt = 0;
          this._bootstrapMetadata = null;
          this._warnings = /* @__PURE__ */ new Set();
        }
        reset() {
          this._values = null;
          this._rawValues = null;
          this._source = "Loading";
          this._lcut = 0;
          this._receivedAt = 0;
          this._bootstrapMetadata = null;
        }
        finalize() {
          if (this._values) {
            return;
          }
          this._source = "NoValues";
        }
        getValues() {
          return this._rawValues ? (0, client_core_1._typedJsonParse)(this._rawValues, "has_updates", "EvaluationStoreValues") : null;
        }
        setValues(result, user) {
          var _a;
          if (!result) {
            return false;
          }
          const values = (0, client_core_1._typedJsonParse)(result.data, "has_updates", "EvaluationResponse");
          if (values == null) {
            return false;
          }
          this._source = result.source;
          if ((values === null || values === void 0 ? void 0 : values.has_updates) !== true) {
            return true;
          }
          this._rawValues = result.data;
          this._lcut = values.time;
          this._receivedAt = result.receivedAt;
          this._values = values;
          this._bootstrapMetadata = this._extractBootstrapMetadata(result.source, values);
          if (result.source && values.user) {
            this._setWarningState(user, values);
          }
          client_core_1.SDKFlags.setFlags(this._sdkKey, (_a = values.sdk_flags) !== null && _a !== void 0 ? _a : {});
          return true;
        }
        getWarnings() {
          if (this._warnings.size === 0) {
            return void 0;
          }
          return Array.from(this._warnings);
        }
        getGate(name) {
          var _a;
          return this._getDetailedStoreResult((_a = this._values) === null || _a === void 0 ? void 0 : _a.feature_gates, name);
        }
        getConfig(name) {
          var _a;
          return this._getDetailedStoreResult((_a = this._values) === null || _a === void 0 ? void 0 : _a.dynamic_configs, name);
        }
        getLayer(name) {
          var _a;
          return this._getDetailedStoreResult((_a = this._values) === null || _a === void 0 ? void 0 : _a.layer_configs, name);
        }
        getParamStore(name) {
          var _a;
          return this._getDetailedStoreResult((_a = this._values) === null || _a === void 0 ? void 0 : _a.param_stores, name);
        }
        getSource() {
          return this._source;
        }
        getExposureMapping() {
          var _a;
          return (_a = this._values) === null || _a === void 0 ? void 0 : _a.exposures;
        }
        _extractBootstrapMetadata(source, values) {
          if (source !== "Bootstrap") {
            return null;
          }
          const bootstrapMetadata = {};
          if (values.user) {
            bootstrapMetadata.user = values.user;
          }
          if (values.sdkInfo) {
            bootstrapMetadata.generatorSDKInfo = values.sdkInfo;
          }
          bootstrapMetadata.lcut = values.time;
          return bootstrapMetadata;
        }
        _getDetailedStoreResult(lookup, name) {
          let result = null;
          if (lookup) {
            result = lookup[name] ? lookup[name] : lookup[(0, client_core_1._DJB2)(name)];
          }
          return {
            result,
            details: this._getDetails(result == null)
          };
        }
        _setWarningState(user, values) {
          var _a, _b;
          const stableID = client_core_1.StableID.get(this._sdkKey);
          if (((_a = user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID) !== stableID && // don't throw if they're both undefined
          (((_b = user.customIDs) === null || _b === void 0 ? void 0 : _b.stableID) || stableID)) {
            this._warnings.add("StableIDMismatch");
            return;
          }
          if ("user" in values) {
            const bootstrapUser = values["user"];
            if ((0, client_core_1._getFullUserHash)(user) !== (0, client_core_1._getFullUserHash)(bootstrapUser)) {
              this._warnings.add("PartialUserMatch");
            }
          }
        }
        getCurrentSourceDetails() {
          if (this._source === "Uninitialized" || this._source === "NoValues") {
            return { reason: this._source };
          }
          const sourceDetails = {
            reason: this._source,
            lcut: this._lcut,
            receivedAt: this._receivedAt
          };
          if (this._warnings.size > 0) {
            sourceDetails.warnings = Array.from(this._warnings);
          }
          return sourceDetails;
        }
        _getDetails(isUnrecognized) {
          var _a, _b;
          const sourceDetails = this.getCurrentSourceDetails();
          let reason = sourceDetails.reason;
          const warnings = (_a = sourceDetails.warnings) !== null && _a !== void 0 ? _a : [];
          if (this._source === "Bootstrap" && warnings.length > 0) {
            reason = reason + warnings[0];
          }
          if (reason !== "Uninitialized" && reason !== "NoValues") {
            const subreason = isUnrecognized ? "Unrecognized" : "Recognized";
            reason = `${reason}:${subreason}`;
          }
          const bootstrapMetadata = this._source === "Bootstrap" ? (_b = this._bootstrapMetadata) !== null && _b !== void 0 ? _b : void 0 : void 0;
          if (bootstrapMetadata) {
            sourceDetails.bootstrapMetadata = bootstrapMetadata;
          }
          return Object.assign(Object.assign({}, sourceDetails), { reason });
        }
      };
      exports.default = EvaluationStore;
    }
  });

  // node_modules/@statsig/js-client/src/EvaluationResponseDeltas.js
  var require_EvaluationResponseDeltas = __commonJS({
    "node_modules/@statsig/js-client/src/EvaluationResponseDeltas.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._resolveDeltasResponse = void 0;
      var client_core_1 = require_src();
      var MAX_DELTAS_SORT_DEPTH = 2;
      function _resolveDeltasResponse(cache, deltasString) {
        const deltas = (0, client_core_1._typedJsonParse)(deltasString, "checksum", "DeltasEvaluationResponse");
        if (!deltas) {
          return {
            hadBadDeltaChecksum: true
          };
        }
        const merged = _mergeDeltasIntoCache(cache, deltas);
        const resolved = _handleDeletedEntries(merged);
        const actualChecksum = (0, client_core_1._DJB2Object)({
          feature_gates: resolved.feature_gates,
          dynamic_configs: resolved.dynamic_configs,
          layer_configs: resolved.layer_configs
        }, MAX_DELTAS_SORT_DEPTH);
        const isMatch = actualChecksum === deltas.checksumV2;
        if (!isMatch) {
          return {
            hadBadDeltaChecksum: true,
            badChecksum: actualChecksum,
            badMergedConfigs: resolved,
            badFullResponse: deltas.deltas_full_response
          };
        }
        return JSON.stringify(resolved);
      }
      exports._resolveDeltasResponse = _resolveDeltasResponse;
      function _mergeDeltasIntoCache(cache, deltas) {
        return Object.assign(Object.assign(Object.assign({}, cache), deltas), { feature_gates: Object.assign(Object.assign({}, cache.feature_gates), deltas.feature_gates), layer_configs: Object.assign(Object.assign({}, cache.layer_configs), deltas.layer_configs), dynamic_configs: Object.assign(Object.assign({}, cache.dynamic_configs), deltas.dynamic_configs) });
      }
      function _handleDeletedEntries(deltas) {
        const result = deltas;
        _deleteEntriesInRecord(deltas.deleted_gates, result.feature_gates);
        delete result.deleted_gates;
        _deleteEntriesInRecord(deltas.deleted_configs, result.dynamic_configs);
        delete result.deleted_configs;
        _deleteEntriesInRecord(deltas.deleted_layers, result.layer_configs);
        delete result.deleted_layers;
        return result;
      }
      function _deleteEntriesInRecord(keys, values) {
        keys === null || keys === void 0 ? void 0 : keys.forEach((key) => {
          delete values[key];
        });
      }
    }
  });

  // node_modules/@statsig/js-client/src/Network.js
  var require_Network = __commonJS({
    "node_modules/@statsig/js-client/src/Network.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var client_core_1 = require_src();
      var EvaluationResponseDeltas_1 = require_EvaluationResponseDeltas();
      var StatsigNetwork = class extends client_core_1.NetworkCore {
        constructor(options, emitter) {
          super(options, emitter);
          const config = options === null || options === void 0 ? void 0 : options.networkConfig;
          this._option = options;
          this._initializeUrlConfig = new client_core_1.UrlConfiguration(client_core_1.Endpoint._initialize, config === null || config === void 0 ? void 0 : config.initializeUrl, config === null || config === void 0 ? void 0 : config.api, config === null || config === void 0 ? void 0 : config.initializeFallbackUrls);
        }
        fetchEvaluations(sdkKey, current, priority, user, isCacheValidFor204) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const cache = current ? (0, client_core_1._typedJsonParse)(current, "has_updates", "InitializeResponse") : null;
            let data = {
              user,
              hash: (_c = (_b = (_a = this._option) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.initializeHashAlgorithm) !== null && _c !== void 0 ? _c : "djb2",
              deltasResponseRequested: false,
              full_checksum: null
            };
            if (cache === null || cache === void 0 ? void 0 : cache.has_updates) {
              const hasHashChanged = (cache === null || cache === void 0 ? void 0 : cache.hash_used) !== ((_f = (_e = (_d = this._option) === null || _d === void 0 ? void 0 : _d.networkConfig) === null || _e === void 0 ? void 0 : _e.initializeHashAlgorithm) !== null && _f !== void 0 ? _f : "djb2");
              data = Object.assign(Object.assign({}, data), { sinceTime: isCacheValidFor204 && !hasHashChanged ? cache.time : 0, previousDerivedFields: "derived_fields" in cache && isCacheValidFor204 ? cache.derived_fields : {}, deltasResponseRequested: true, full_checksum: cache.full_checksum, partialUserMatchSinceTime: !hasHashChanged ? cache.time : 0 });
            }
            return this._fetchEvaluations(sdkKey, cache, data, priority);
          });
        }
        _fetchEvaluations(sdkKey, cache, data, priority) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield this.post({
              sdkKey,
              urlConfig: this._initializeUrlConfig,
              data,
              retries: 2,
              isStatsigEncodable: true,
              priority
            });
            if ((response === null || response === void 0 ? void 0 : response.code) === 204) {
              return '{"has_updates": false}';
            }
            if ((response === null || response === void 0 ? void 0 : response.code) !== 200) {
              return (_a = response === null || response === void 0 ? void 0 : response.body) !== null && _a !== void 0 ? _a : null;
            }
            if ((cache === null || cache === void 0 ? void 0 : cache.has_updates) !== true || ((_b = response.body) === null || _b === void 0 ? void 0 : _b.includes('"is_delta":true')) !== true || data.deltasResponseRequested !== true) {
              return response.body;
            }
            const result = (0, EvaluationResponseDeltas_1._resolveDeltasResponse)(cache, response.body);
            if (typeof result === "string") {
              return result;
            }
            return this._fetchEvaluations(sdkKey, cache, Object.assign(Object.assign(Object.assign({}, data), result), { deltasResponseRequested: false }), priority);
          });
        }
      };
      exports.default = StatsigNetwork;
    }
  });

  // node_modules/@statsig/js-client/src/ParamStoreGetterFactory.js
  var require_ParamStoreGetterFactory = __commonJS({
    "node_modules/@statsig/js-client/src/ParamStoreGetterFactory.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports._makeParamStoreGetter = void 0;
      var client_core_1 = require_src();
      var NO_EXPOSURE_OPT = {
        disableExposureLog: true
      };
      function _shouldLogExposure(options) {
        return options == null || options.disableExposureLog === false;
      }
      function _shouldReturnFallback(value, fallback) {
        return fallback != null && !(0, client_core_1._isTypeMatch)(value, fallback);
      }
      function _getMappedStaticValue(param, _options) {
        return param.value;
      }
      function _getMappedGateValue(client, param, options) {
        const gate = client.getFeatureGate(param.gate_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
        if (gate.value) {
          return param.pass_value;
        }
        return param.fail_value;
      }
      function _getMappedDynamicConfigValue(client, param, fallback, options) {
        const config = client.getDynamicConfig(param.config_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
        const value = config.get(param.param_name);
        if (_shouldReturnFallback(value, fallback)) {
          return fallback;
        }
        return value;
      }
      function _getMappedExperimentValue(client, param, fallback, options) {
        const experiment = client.getExperiment(param.experiment_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
        const value = experiment.get(param.param_name);
        if (_shouldReturnFallback(value, fallback)) {
          return fallback;
        }
        return value;
      }
      function _getMappedLayerValue(client, param, fallback, options) {
        const layer = client.getLayer(param.layer_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
        const value = layer.get(param.param_name);
        if (_shouldReturnFallback(value, fallback)) {
          return fallback;
        }
        return value;
      }
      function _makeParamStoreGetter(client, config, options) {
        return (paramName, fallback) => {
          if (config == null) {
            return fallback;
          }
          const param = config[paramName];
          if (param == null || fallback != null && (0, client_core_1._typeOf)(fallback) !== param.param_type) {
            return fallback;
          }
          switch (param.ref_type) {
            case "static":
              return _getMappedStaticValue(param, options);
            case "gate":
              return _getMappedGateValue(client, param, options);
            case "dynamic_config":
              return _getMappedDynamicConfigValue(client, param, fallback, options);
            case "experiment":
              return _getMappedExperimentValue(client, param, fallback, options);
            case "layer":
              return _getMappedLayerValue(client, param, fallback, options);
            default:
              return fallback;
          }
        };
      }
      exports._makeParamStoreGetter = _makeParamStoreGetter;
    }
  });

  // node_modules/@statsig/js-client/src/StatsigEvaluationsDataAdapter.js
  var require_StatsigEvaluationsDataAdapter = __commonJS({
    "node_modules/@statsig/js-client/src/StatsigEvaluationsDataAdapter.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatsigEvaluationsDataAdapter = void 0;
      var client_core_1 = require_src();
      var Network_1 = require_Network();
      var StatsigEvaluationsDataAdapter = class extends client_core_1.DataAdapterCore {
        constructor() {
          super("EvaluationsDataAdapter", "evaluations");
          this._network = null;
          this._options = null;
        }
        attach(sdkKey, options, network) {
          super.attach(sdkKey, options, network);
          if (network !== null && network instanceof Network_1.default) {
            this._network = network;
          } else {
            this._network = new Network_1.default(options !== null && options !== void 0 ? options : {});
          }
        }
        getDataAsync(current, user, options) {
          return this._getDataAsyncImpl(current, (0, client_core_1._normalizeUser)(user, this._options), options);
        }
        prefetchData(user, options) {
          return this._prefetchDataImpl(user, options);
        }
        setData(data) {
          const values = (0, client_core_1._typedJsonParse)(data, "has_updates", "data");
          if (values && "user" in values) {
            super.setData(data, values.user);
          } else {
            client_core_1.Log.error("StatsigUser not found. You may be using an older server SDK version. Please upgrade your SDK or use setDataLegacy.");
          }
        }
        setDataLegacy(data, user) {
          super.setData(data, user);
        }
        _fetchFromNetwork(current, user, options, isCacheValidFor204) {
          return __awaiter2(this, void 0, void 0, function* () {
            var _a;
            const result = yield (_a = this._network) === null || _a === void 0 ? void 0 : _a.fetchEvaluations(this._getSdkKey(), current, options === null || options === void 0 ? void 0 : options.priority, user, isCacheValidFor204);
            return result !== null && result !== void 0 ? result : null;
          });
        }
        _getCacheKey(user) {
          var _a;
          const key = (0, client_core_1._getStorageKey)(this._getSdkKey(), user, (_a = this._options) === null || _a === void 0 ? void 0 : _a.customUserCacheKeyFunc);
          return `${client_core_1.DataAdapterCachePrefix}.${this._cacheSuffix}.${key}`;
        }
        _isCachedResultValidFor204(result, user) {
          return result.fullUserHash != null && result.fullUserHash === (0, client_core_1._getFullUserHash)(user);
        }
      };
      exports.StatsigEvaluationsDataAdapter = StatsigEvaluationsDataAdapter;
    }
  });

  // node_modules/@statsig/js-client/src/StatsigClient.js
  var require_StatsigClient = __commonJS({
    "node_modules/@statsig/js-client/src/StatsigClient.js"(exports) {
      "use strict";
      var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var client_core_1 = require_src();
      var EvaluationStore_1 = require_EvaluationStore();
      var Network_1 = require_Network();
      var ParamStoreGetterFactory_1 = require_ParamStoreGetterFactory();
      var StatsigEvaluationsDataAdapter_1 = require_StatsigEvaluationsDataAdapter();
      var StatsigClient = class _StatsigClient extends client_core_1.StatsigClientBase {
        /**
         * Retrieves an instance of the StatsigClient based on the provided SDK key.
         *  If no SDK key is provided, the method returns the most recently created instance of the StatsigClient.
         *  The method ensures that each unique SDK key corresponds to a single instance of StatsigClient, effectively implementing a singleton pattern for each key.
         *  If no instance exists for the given SDK key, a new StatsigClient instance will be created and returned.
         *
         * @param {string} [sdkKey] - Optional. The SDK key used to identify a specific instance of the StatsigClient. If omitted, the method returns the last created instance.
         * @returns {StatsigClient} Returns the StatsigClient instance associated with the given SDK key, creating a new one if needed.
         */
        static instance(sdkKey) {
          const instance = (0, client_core_1._getStatsigGlobal)().instance(sdkKey);
          if (instance instanceof _StatsigClient) {
            return instance;
          }
          client_core_1.Log.warn((0, client_core_1._isServerEnv)() ? "StatsigClient.instance is not supported in server environments" : "Unable to find StatsigClient instance");
          return new _StatsigClient(sdkKey !== null && sdkKey !== void 0 ? sdkKey : "", {});
        }
        /**
         * StatsigClient constructor
         *
         * @param {string} sdkKey A Statsig client SDK key. eg "client-xyz123..."
         * @param {StatsigUser} user StatsigUser object containing various attributes related to a user.
         * @param {StatsigOptions | null} options StatsigOptions, used to customize the behavior of the SDK.
         */
        constructor(sdkKey, user, options = null) {
          var _a, _b;
          client_core_1.SDKType._setClientType(sdkKey, "javascript-client");
          const network = new Network_1.default(options, (e) => {
            this.$emt(e);
          });
          super(sdkKey, (_a = options === null || options === void 0 ? void 0 : options.dataAdapter) !== null && _a !== void 0 ? _a : new StatsigEvaluationsDataAdapter_1.StatsigEvaluationsDataAdapter(), network, options);
          this.getFeatureGate = this._memoize(client_core_1.MemoPrefix._gate, this._getFeatureGateImpl.bind(this));
          this.getDynamicConfig = this._memoize(client_core_1.MemoPrefix._dynamicConfig, this._getDynamicConfigImpl.bind(this));
          this.getExperiment = this._memoize(client_core_1.MemoPrefix._experiment, this._getExperimentImpl.bind(this));
          this.getLayer = this._memoize(client_core_1.MemoPrefix._layer, this._getLayerImpl.bind(this));
          this.getParameterStore = this._memoize(client_core_1.MemoPrefix._paramStore, this._getParameterStoreImpl.bind(this));
          this._store = new EvaluationStore_1.default(sdkKey);
          this._network = network;
          this._user = this._configureUser(user, options);
          this._sdkInstanceID = (0, client_core_1.getUUID)();
          const plugins = (_b = options === null || options === void 0 ? void 0 : options.plugins) !== null && _b !== void 0 ? _b : [];
          for (const plugin of plugins) {
            plugin.bind(this);
          }
        }
        /**
         * Initializes the StatsigClient using cached values. This method sets up the client synchronously by utilizing previously cached values.
         * After initialization, cache values are updated in the background for future use, either in subsequent sessions or when `updateUser` is called.
         * This is useful for quickly starting with the last-known-good configurations while refreshing data to keep settings up-to-date.
         *
         * @see {@link initializeAsync} for the asynchronous version of this method.
         */
        initializeSync(options) {
          var _a;
          if (this.loadingStatus !== "Uninitialized") {
            return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), -1, null, null, ["MultipleInitializations", ...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []]);
          }
          this._logger.start();
          return this.updateUserSync(this._user, options);
        }
        /**
         * Initializes the StatsigClient asynchronously by first using cached values and then updating to the latest values from the network.
         * Once the network values are fetched, they replace the existing cached values. If this method's promise is not awaited,
         * there might be a transition from cached to network values during the session, which can affect consistency.
         * This method is useful when it's acceptable to begin with potentially stale data and switch to the latest configuration as it becomes available.
         *
         * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
         * @returns {Promise<void>} A promise that resolves once the client is fully initialized with the latest values from the network or a timeout (if set) is hit.
         * @see {@link initializeSync} for the synchronous version of this method.
         */
        initializeAsync(options) {
          return __awaiter2(this, void 0, void 0, function* () {
            if (this._initializePromise) {
              return this._initializePromise;
            }
            this._initializePromise = this._initializeAsyncImpl(options);
            return this._initializePromise;
          });
        }
        /**
         * Synchronously updates the user in the Statsig client and switches the internal state to use cached values for the newly specified user.
         * After the initial switch to cached values, this method updates these values in the background, preparing them for future sessions or subsequent calls to updateUser.
         * This method ensures the client is quickly ready with available data.
         *
         * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
         * @see {@link updateUserAsync} for the asynchronous version of this method.
         */
        updateUserSync(user, options) {
          const startTime = performance.now();
          try {
            return this._updateUserSyncImpl(user, options, startTime);
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            return this._createErrorUpdateDetails(err, startTime);
          }
        }
        _updateUserSyncImpl(user, options, startTime) {
          var _a;
          const warnings = [...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []];
          this._resetForUser(user);
          const result = this.dataAdapter.getDataSync(this._user);
          if (result == null) {
            warnings.push("NoCachedValues");
          }
          this._store.setValues(result, this._user);
          this._finalizeUpdate(result);
          const disable = options === null || options === void 0 ? void 0 : options.disableBackgroundCacheRefresh;
          if (disable === true || disable == null && (result === null || result === void 0 ? void 0 : result.source) === "Bootstrap") {
            return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), performance.now() - startTime, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), warnings);
          }
          this._runPostUpdate(result !== null && result !== void 0 ? result : null, this._user);
          return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), performance.now() - startTime, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), warnings);
        }
        /**
         * Asynchronously updates the user in the Statsig client by initially using cached values and then fetching the latest values from the network.
         * When the latest values are fetched, they replace the cached values. If the promise returned by this method is not awaited,
         * the client's state may shift from cached to updated network values during the session, potentially affecting consistency.
         * This method is best used in scenarios where up-to-date configuration is critical and initial delays are acceptable.
         *
         * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
         * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
         * @returns {Promise<void>} A promise that resolves once the client is fully updated with the latest values from the network or a timeout (if set) is hit.
         * @see {@link updateUserSync} for the synchronous version of this method.
         */
        updateUserAsync(user, options) {
          return __awaiter2(this, void 0, void 0, function* () {
            const startTime = performance.now();
            try {
              return yield this._updateUserAsyncImpl(user, options);
            } catch (e) {
              const err = e instanceof Error ? e : new Error(String(e));
              return this._createErrorUpdateDetails(err, startTime);
            }
          });
        }
        _updateUserAsyncImpl(user, options) {
          return __awaiter2(this, void 0, void 0, function* () {
            this._resetForUser(user);
            const initiator = this._user;
            client_core_1.Diagnostics._markInitOverallStart(this._sdkKey);
            let result = this.dataAdapter.getDataSync(initiator);
            this._store.setValues(result, this._user);
            this._setStatus("Loading", result);
            result = yield this.dataAdapter.getDataAsync(result, initiator, options);
            if (initiator !== this._user) {
              return (0, client_core_1.createUpdateDetails)(false, this._store.getSource(), -1, new Error("User changed during update"), this._network.getLastUsedInitUrlAndReset());
            }
            let isUsingNetworkValues = false;
            if (result != null) {
              client_core_1.Diagnostics._markInitProcessStart(this._sdkKey);
              isUsingNetworkValues = this._store.setValues(result, this._user);
              client_core_1.Diagnostics._markInitProcessEnd(this._sdkKey, {
                success: isUsingNetworkValues
              });
            }
            this._finalizeUpdate(result);
            if (!isUsingNetworkValues) {
              this._errorBoundary.attachErrorIfNoneExists(client_core_1.UPDATE_DETAIL_ERROR_MESSAGES.NO_NETWORK_DATA);
              this.$emt({ name: "initialization_failure" });
            }
            client_core_1.Diagnostics._markInitOverallEnd(this._sdkKey, isUsingNetworkValues, this._store.getCurrentSourceDetails());
            const initDuration = client_core_1.Diagnostics._enqueueDiagnosticsEvent(this._user, this._logger, this._sdkKey, this._options);
            return (0, client_core_1.createUpdateDetails)(isUsingNetworkValues, this._store.getSource(), initDuration, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), this._store.getWarnings());
          });
        }
        /**
         * Retrieves a synchronous context containing data currently being used by the SDK. Represented as a {@link PrecomputedEvaluationsContext} object.
         *
         * @returns {PrecomputedEvaluationsContext} The current synchronous context for the this StatsigClient instance.
         */
        getContext() {
          return {
            sdkKey: this._sdkKey,
            options: this._options,
            values: this._store.getValues(),
            user: JSON.parse(JSON.stringify(this._user)),
            errorBoundary: this._errorBoundary,
            session: client_core_1.StatsigSession.get(this._sdkKey),
            stableID: client_core_1.StableID.get(this._sdkKey),
            sdkInstanceID: this._sdkInstanceID
          };
        }
        /**
         * Retrieves the value of a feature gate for the current user, represented as a simple boolean.
         *
         * @param {string} name - The name of the feature gate to retrieve.
         * @param {FeatureGateEvaluationOptions} [options] - Optional. Additional options to customize the method call.
         * @returns {boolean} - The boolean value representing the gate's current evaluation results for the user.
         */
        checkGate(name, options) {
          return this.getFeatureGate(name, options).value;
        }
        /**
         * Logs an event to the internal logging system. This function allows logging by either passing a fully formed event object or by specifying the event name with optional value and metadata.
         *
         * @param {StatsigEvent|string} eventOrName - The event object conforming to the StatsigEvent interface, or the name of the event as a string.
         * @param {string|number} value - Optional. The value associated with the event, which can be a string or a number. This parameter is ignored if the first parameter is a StatsigEvent object.
         * @param {Record<string, string>} metadata - Optional. A key-value record containing metadata about the event. This is also ignored if the first parameter is an event object.
         */
        logEvent(eventOrName, value, metadata) {
          const event = typeof eventOrName === "string" ? {
            eventName: eventOrName,
            value,
            metadata
          } : eventOrName;
          this.$emt({
            name: "log_event_called",
            event
          });
          this._logger.enqueue(Object.assign(Object.assign({}, event), { user: this._user, time: Date.now() }));
        }
        _primeReadyRipcord() {
          this.$on("error", () => {
            this.loadingStatus === "Loading" && this._finalizeUpdate(null);
          });
        }
        _initializeAsyncImpl(options) {
          return __awaiter2(this, void 0, void 0, function* () {
            if (!client_core_1.Storage.isReady()) {
              yield client_core_1.Storage.isReadyResolver();
            }
            this._logger.start();
            return this.updateUserAsync(this._user, options);
          });
        }
        _createErrorUpdateDetails(error, startTime) {
          var _a;
          return (0, client_core_1.createUpdateDetails)(false, this._store.getSource(), performance.now() - startTime, error, null, [...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []]);
        }
        _finalizeUpdate(values) {
          this._store.finalize();
          this._setStatus("Ready", values);
        }
        _runPostUpdate(current, user) {
          this.dataAdapter.getDataAsync(current, user, { priority: "low" }).catch((err) => {
            client_core_1.Log.error("An error occurred after update.", err);
          });
        }
        _resetForUser(user) {
          this._logger.reset();
          this._store.reset();
          this._user = this._configureUser(user, this._options);
        }
        _configureUser(originalUser, options) {
          var _a;
          const user = (0, client_core_1._normalizeUser)(originalUser, options);
          const stableIdOverride = (_a = user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID;
          if (stableIdOverride) {
            client_core_1.StableID.setOverride(stableIdOverride, this._sdkKey);
          }
          return user;
        }
        _getFeatureGateImpl(name, options) {
          var _a, _b;
          const { result: evaluation, details } = this._store.getGate(name);
          const gate = (0, client_core_1._makeFeatureGate)(name, details, evaluation);
          const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getGateOverride) === null || _b === void 0 ? void 0 : _b.call(_a, gate, this._user, options);
          const result = overridden !== null && overridden !== void 0 ? overridden : gate;
          this._enqueueExposure(name, (0, client_core_1._createGateExposure)(this._user, result, this._store.getExposureMapping()), options);
          this.$emt({ name: "gate_evaluation", gate: result });
          return result;
        }
        _getDynamicConfigImpl(name, options) {
          var _a, _b;
          const { result: evaluation, details } = this._store.getConfig(name);
          const config = (0, client_core_1._makeDynamicConfig)(name, details, evaluation);
          const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getDynamicConfigOverride) === null || _b === void 0 ? void 0 : _b.call(_a, config, this._user, options);
          const result = overridden !== null && overridden !== void 0 ? overridden : config;
          this._enqueueExposure(name, (0, client_core_1._createConfigExposure)(this._user, result, this._store.getExposureMapping()), options);
          this.$emt({ name: "dynamic_config_evaluation", dynamicConfig: result });
          return result;
        }
        _getExperimentImpl(name, options) {
          var _a, _b, _c, _d;
          const { result: evaluation, details } = this._store.getConfig(name);
          const experiment = (0, client_core_1._makeExperiment)(name, details, evaluation);
          if (experiment.__evaluation != null) {
            experiment.__evaluation.secondary_exposures = (0, client_core_1._mapExposures)((_b = (_a = experiment.__evaluation) === null || _a === void 0 ? void 0 : _a.secondary_exposures) !== null && _b !== void 0 ? _b : [], this._store.getExposureMapping());
          }
          const overridden = (_d = (_c = this.overrideAdapter) === null || _c === void 0 ? void 0 : _c.getExperimentOverride) === null || _d === void 0 ? void 0 : _d.call(_c, experiment, this._user, options);
          const result = overridden !== null && overridden !== void 0 ? overridden : experiment;
          this._enqueueExposure(name, (0, client_core_1._createConfigExposure)(this._user, result, this._store.getExposureMapping()), options);
          this.$emt({ name: "experiment_evaluation", experiment: result });
          return result;
        }
        _getLayerImpl(name, options) {
          var _a, _b, _c;
          const { result: evaluation, details } = this._store.getLayer(name);
          const layer = (0, client_core_1._makeLayer)(name, details, evaluation);
          const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getLayerOverride) === null || _b === void 0 ? void 0 : _b.call(_a, layer, this._user, options);
          if (options === null || options === void 0 ? void 0 : options.disableExposureLog) {
            this._logger.incrementNonExposureCount(name);
          }
          const result = (0, client_core_1._mergeOverride)(layer, overridden, (_c = overridden === null || overridden === void 0 ? void 0 : overridden.__value) !== null && _c !== void 0 ? _c : layer.__value, (param) => {
            if (options === null || options === void 0 ? void 0 : options.disableExposureLog) {
              return;
            }
            this._enqueueExposure(name, (0, client_core_1._createLayerParameterExposure)(this._user, result, param, this._store.getExposureMapping()), options);
          });
          this.$emt({ name: "layer_evaluation", layer: result });
          return result;
        }
        _getParameterStoreImpl(name, options) {
          var _a, _b;
          const { result: configuration, details } = this._store.getParamStore(name);
          this._logger.incrementNonExposureCount(name);
          const paramStore = {
            name,
            details,
            __configuration: configuration,
            get: (0, ParamStoreGetterFactory_1._makeParamStoreGetter)(this, configuration, options)
          };
          const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getParamStoreOverride) === null || _b === void 0 ? void 0 : _b.call(_a, paramStore, options);
          if (overridden != null) {
            paramStore.__configuration = overridden.config;
            paramStore.details = overridden.details;
            paramStore.get = (0, ParamStoreGetterFactory_1._makeParamStoreGetter)(this, overridden.config, options);
          }
          return paramStore;
        }
      };
      exports.default = StatsigClient;
    }
  });

  // node_modules/@statsig/js-client/src/index.js
  var require_src2 = __commonJS({
    "node_modules/@statsig/js-client/src/index.js"(exports) {
      "use strict";
      var __createBinding2 = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding2(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StatsigClient = void 0;
      var client_core_1 = require_src();
      var StatsigClient_1 = require_StatsigClient();
      exports.StatsigClient = StatsigClient_1.default;
      __exportStar2(require_src(), exports);
      var __STATSIG__2 = Object.assign((0, client_core_1._getStatsigGlobal)(), {
        StatsigClient: StatsigClient_1.default
      });
      exports.default = __STATSIG__2;
    }
  });

  // node_modules/@forge/bridge/out/featureFlags/dataAdapter.js
  var require_dataAdapter = __commonJS({
    "node_modules/@forge/bridge/out/featureFlags/dataAdapter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ForgeDataAdapter = void 0;
      var initFeatureFlags_1 = require_initFeatureFlags();
      var ForgeDataAdapter = class {
        constructor() {
          this.options = null;
          this.environment = void 0;
          this.cache = null;
        }
        async getDataAsync(current, user, options) {
          var _a;
          if (current) {
            return current;
          }
          this.environment = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.environment) || { tier: "development" };
          const initUser = {
            ...user,
            statsigEnvironment: this.environment
          };
          const result = await (0, initFeatureFlags_1.initFeatureFlags)({ user: initUser });
          const data = {
            source: "Network",
            data: JSON.stringify(result),
            receivedAt: Date.now(),
            stableID: null,
            fullUserHash: null
          };
          this.cache = data;
          return data;
        }
        getDataSync(_user) {
          return this.cache;
        }
        async attach(_sdkKey, options, _network) {
          this.options = options;
        }
        async prefetchData() {
        }
        async setData(_data) {
        }
        async setDataLegacy(_data) {
        }
        async shutdown() {
          this.options = null;
          this.cache = null;
          this.environment = void 0;
        }
      };
      exports.ForgeDataAdapter = ForgeDataAdapter;
    }
  });

  // node_modules/@forge/bridge/out/featureFlags/featureFlags.js
  var require_featureFlags = __commonJS({
    "node_modules/@forge/bridge/out/featureFlags/featureFlags.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ForgeFeatureFlags = void 0;
      var js_client_1 = require_src2();
      var dataAdapter_1 = require_dataAdapter();
      var ForgeFeatureFlags = class {
        constructor() {
          this.initialized = false;
          this.client = null;
          this.dataAdapter = null;
          this.CLIENT_KEY = "client-forge-internal-key";
        }
        async initialize(user, config = {}) {
          if (this.isInitialized()) {
            return;
          }
          this.dataAdapter = new dataAdapter_1.ForgeDataAdapter();
          const options = {
            environment: { tier: config.environment || "development" },
            disableEvaluationMemoization: false,
            loggingEnabled: js_client_1.LoggingEnabledOption.disabled,
            logLevel: js_client_1.LogLevel.None,
            dataAdapter: this.dataAdapter
          };
          this.client = new js_client_1.StatsigClient(this.CLIENT_KEY, this.convertUser(user), options);
          await this.client.initializeAsync();
          this.initialized = true;
        }
        checkFlag(flagName) {
          if (!this.isInitialized() || !this.client) {
            throw new Error("ForgeFeatureFlags not initialized. Call initialize() first.");
          }
          return this.client.checkGate(flagName, { disableExposureLog: true });
        }
        async shutdown() {
          if (!this.isInitialized() || !this.client) {
            return;
          }
          await this.client.shutdown();
          if (this.dataAdapter) {
            await this.dataAdapter.shutdown();
          }
          this.initialized = false;
        }
        isInitialized() {
          return this.initialized;
        }
        convertUser(user) {
          return {
            userID: user.userId,
            custom: { ...user.custom || {}, ...user.attributes || {} },
            customIDs: user.identifiers || {}
          };
        }
      };
      exports.ForgeFeatureFlags = ForgeFeatureFlags;
    }
  });

  // node_modules/@forge/bridge/out/featureFlags/index.js
  var require_featureFlags2 = __commonJS({
    "node_modules/@forge/bridge/out/featureFlags/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ForgeFeatureFlags = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_initFeatureFlags(), exports);
      var featureFlags_1 = require_featureFlags();
      Object.defineProperty(exports, "ForgeFeatureFlags", { enumerable: true, get: function() {
        return featureFlags_1.ForgeFeatureFlags;
      } });
    }
  });

  // node_modules/@forge/bridge/out/index.js
  var require_out2 = __commonJS({
    "node_modules/@forge/bridge/out/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.i18n = exports.NavigationTarget = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      var targets_1 = require_targets();
      Object.defineProperty(exports, "NavigationTarget", { enumerable: true, get: function() {
        return targets_1.NavigationTarget;
      } });
      tslib_1.__exportStar(require_invoke2(), exports);
      tslib_1.__exportStar(require_invoke_endpoint2(), exports);
      tslib_1.__exportStar(require_view2(), exports);
      tslib_1.__exportStar(require_router2(), exports);
      tslib_1.__exportStar(require_modal2(), exports);
      tslib_1.__exportStar(require_fetch2(), exports);
      tslib_1.__exportStar(require_flag2(), exports);
      tslib_1.__exportStar(require_events2(), exports);
      tslib_1.__exportStar(require_realtime2(), exports);
      exports.i18n = tslib_1.__importStar(require_i18n());
      tslib_1.__exportStar(require_featureFlags2(), exports);
    }
  });

  // src/ui/forge-bridge-shim.js
  var import_bridge = __toESM(require_out2(), 1);
  window.Forge = {
    invoke: import_bridge.invoke,
    requestJira: import_bridge.requestJira,
    view: import_bridge.view,
    getContext: () => import_bridge.view.getContext()
    // convenience alias
  };
  console.log("Forge Bridge shim loaded successfully");
})();
