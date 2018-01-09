module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author Benoît Zugmeyer, Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

var acornVFEL = __webpack_require__(7);
var Module = __webpack_require__(9);
var path = __webpack_require__(10);
var extract = __webpack_require__(3);
// If you pack the plugin using webpack, the node require function is not available directly
/* global __non_webpack_require__ */
var requireCache =  true ? require.cache : require.cache;

var visualForceExtensions = ['.page', '.component'];

function getPluginSettings(settings) {

  var reportBadIndent = void 0;
  switch (settings['visualforce/report-bad-indent']) {
    case undefined:case false:case 0:case 'off':
      reportBadIndent = 0;
      break;
    case true:case 1:case 'warn':
      reportBadIndent = 1;
      break;
    case 2:case 'error':
      reportBadIndent = 2;
      break;
    default:
      throw new Error('Invalid value for visualforce/report-bad-indent, ' + 'expected one of 0, 1, 2, "off", "warn" or "error"');
  }

  var parsedIndent = /^(\+)?(tab|\d+)$/.exec(settings['visualforce/indent']);
  var indent = parsedIndent && {
    relative: parsedIndent[1] === '+',
    spaces: parsedIndent[2] === 'tab' ? '\t' : ' '.repeat(parsedIndent[2])
  };

  return {
    indent,
    reportBadIndent
  };
}

// Monkey patching ESLint and espree
function patchESLint() {

  var eslintPath = Object.keys(requireCache).find(function (key) {
    return key.endsWith(path.join('lib', 'eslint.js'));
  });

  var eslint = requireCache[eslintPath].exports;
  var SourceCode = requireCache[path.join(eslintPath, '..', 'util', 'source-code.js')].exports;
  var SourceCodeFixer = requireCache[path.join(eslintPath, '..', 'util', 'source-code-fixer.js')].exports;


  if (typeof eslint.verify !== 'function' || !SourceCode || !SourceCodeFixer) throw new Error('eslint-plugin-visualforce error: Could not locate eslint in the require() cache. ' + 'If you think it is a bug, please file a report at ' + 'https://github.com/forcedotcom/eslint-plugin-visualforce/issues');

  // const estraversePath = Object.keys(requireCache).find(key => key.endsWith(path.join('estraverse', 'estraverse.js')))
  // if(!estraversePath) throw new Error('Could not find estraverse in require.cache')
  // const estraverse = requireCache[estraversePath].exports
  // estraverse.VisitorKeys = Object.assign({}, estraverse.VisitorKeys, VFELVisitorKeys)

  var sourceCodeForMessages = new WeakMap();

  var verify = eslint.verify;
  eslint.verify = function (textOrSourceCode, config, filenameOrOptions, saveState) {
    var _this = this;

    var localVerify = function localVerify(code) {
      return verify.call(_this, code, config, filenameOrOptions, saveState);
    };

    var messages = void 0;
    var filename = typeof filenameOrOptions === 'object' ? filenameOrOptions.filename : filenameOrOptions;
    var extension = path.extname(filename || '');

    var pluginSettings = getPluginSettings(config.settings || {});
    var isVisualForce = visualForceExtensions.indexOf(extension) >= 0;

    if (typeof textOrSourceCode === 'string' && isVisualForce) {
      var currentInfos = extract(textOrSourceCode, pluginSettings.indent);
      // parsing the source code with the patched espree
      var espreePath = Object.keys(requireCache).find(function (key) {
        return key.endsWith(path.join('espree', 'espree.js'));
      });
      espreePath = espreePath ? espreePath : 'espree';
      var acornJSXPath = Object.keys(requireCache).find(function (key) {
        return key.endsWith(path.join('acorn-jsx', 'inject.js'));
      });
      acornJSXPath = acornJSXPath ? acornJSXPath : 'acorn-jsx/inject';

      var acornJSX =  true ? require.call(null, acornJSXPath) : require(acornJSXPath);

      var originalLoad = Module._load;
      Module._load = function (request) {
        if (request === 'acorn-jsx/inject') return function (acorn) {
          return acornVFEL(acornJSX(acorn), true);
        };
        return originalLoad.apply(this, arguments);
      };
      var espree =  true ? require.call(null, espreePath) : require(espreePath);
      Module._load = originalLoad;

      var parserOptions = Object.assign({}, config.parserOptions, {
        loc: true,
        range: true,
        raw: true,
        tokens: true,
        comment: true,
        filePath: filename
      });
      //console.log('code: ', String(currentInfos.code));

      var ast = espree.parse(String(currentInfos.code), parserOptions);
      var sourceCode = new SourceCode(String(currentInfos.code), ast);

      messages = remapMessages(localVerify(sourceCode), currentInfos.code, pluginSettings.reportBadIndent, currentInfos.badIndentationLines, currentInfos.apexRepeatTags);
      sourceCodeForMessages.set(messages, textOrSourceCode);
    } else messages = localVerify(textOrSourceCode);

    return messages;
  };

  var applyFixes = SourceCodeFixer.applyFixes;
  SourceCodeFixer.applyFixes = function (sourceCode, messages) {
    var originalSourceCode = sourceCodeForMessages.get(messages);
    // The BOM is always included in the HTML, which is removed by the extract process
    return applyFixes.call(this, originalSourceCode === undefined ? sourceCode : {
      text: originalSourceCode,
      hasBOM: false
    }, messages);
  };
}

function remapMessages(messages, code, reportBadIndent, badIndentationLines, apexRepeatTags) {
  var newMessages = [];

  messages.forEach(function (message) {
    var location = code.originalLocation(message);

    // Ignore messages if they were in transformed code
    if (location) {
      Object.assign(message, location);

      // Map fix range
      if (message.fix && message.fix.range) message.fix.range = [code.originalIndex(message.fix.range[0]), code.originalIndex(message.fix.range[1])];

      // Map end location
      if (message.endLine && message.endColumn) {
        var endLocation = code.originalLocation({
          line: message.endLine,
          column: message.endColumn
        });
        if (endLocation) {
          message.endLine = endLocation.line;
          message.endColumn = endLocation.column;
        }
      }

      newMessages.push(message);
    }
  });

  if (reportBadIndent) badIndentationLines.forEach(function (line) {
    newMessages.push({
      message: 'Bad line indentation',
      line,
      column: 1,
      ruleId: '(visualforce plugin)',
      severity: reportBadIndent === true ? 2 : reportBadIndent
    });
  });

  apexRepeatTags.forEach(function (location) {
    newMessages.push({
      message: '<apex:repeat> tags are not allowed in Javascript',
      line: location.line,
      column: location.column,
      ruleId: '(visualforce plugin)',
      severity: 2
    });
  });

  newMessages.sort(function (ma, mb) {
    return ma.line - mb.line || ma.column - mb.column;
  });

  return newMessages;
}

patchESLint();

module.exports = {
  rules: {
    'no-atom-expr': __webpack_require__(6),
    'no-apex-tags': __webpack_require__(5),
    'jsencode': __webpack_require__(4)
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Benoît Zugmeyer, Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

function lineStarts(str) {
  var result = [0];
  var re = /\r\n|\r|\n/g;
  for (;;) {
    var match = re.exec(str);
    if (!match) break;
    result.push(re.lastIndex);
  }
  return result;
}

function locationToIndex(location, lineStarts) {
  if (!location.line || location.line < 0 || !location.column || location.column < 0) throw new Error('Invalid location');

  return lineStarts[location.line - 1] + location.column - 1;
}

function indexToLocation(index, lineStarts) {
  if (index < 0) throw new Error('Invalid index');

  var line = 0;
  while (line + 1 < lineStarts.length && lineStarts[line + 1] <= index) {
    line += 1;
  }return {
    line: line + 1,
    column: index - lineStarts[line] + 1
  };
}

module.exports = function () {
  function TransformableString(original) {
    _classCallCheck(this, TransformableString);

    this._original = original;
    this._blocks = [];
    this._lineStarts = lineStarts(original);
    this._cache = null;
  }

  _createClass(TransformableString, [{
    key: '_compute',
    value: function _compute() {
      if (!this._cache) {
        var result = '';
        var index = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var block = _step.value;

            result += this._original.slice(index, block.from) + block.str;
            index = block.to;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        result += this._original.slice(index);
        this._cache = {
          lineStarts: lineStarts(result),
          result
        };
      }
      return this._cache;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this._compute().result;
    }
  }, {
    key: 'replace',
    value: function replace(from, to, str) {
      this._cache = null;
      if (from > to || from < 0 || to > this._original.length) throw new Error('Invalid slice indexes');

      var newBlock = {
        from,
        to,
        str
      };
      if (!this._blocks.length || this._blocks[this._blocks.length - 1].to <= from) this._blocks.push(newBlock);else {
        var index = this._blocks.findIndex(function (other) {
          return other.to > from;
        });
        if (this._blocks[index].from < to) throw new Error("Can't replace slice");
        this._blocks.splice(index, 0, newBlock);
      }
    }
  }, {
    key: 'originalIndex',
    value: function originalIndex(index) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._blocks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var block = _step2.value;

          if (index < block.from) break;

          if (index < block.from + block.str.length) return;else index += block.to - block.from - block.str.length;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (index < 0 || index > this._original.length) throw new Error('Invalid index');
      return index;
    }
  }, {
    key: 'originalLocation',
    value: function originalLocation(location) {
      var index = locationToIndex(location, this._compute().lineStarts);
      var originalIndex = this.originalIndex(index);
      if (originalIndex !== undefined) {
        var originalLocation = indexToLocation(originalIndex, this._lineStarts);
        return originalLocation;
      }
    }
  }]);

  return TransformableString;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _marked = /*#__PURE__*/regeneratorRuntime.mark(dedent);

/**
 * @author Benoît Zugmeyer, Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

var htmlparser2 = __webpack_require__(8);
var TransformableString = __webpack_require__(2);

function iterateScripts(code, onChunk) {
  if (!code) return;

  var index = 0;
  var inScript = false;
  var nextType = null;
  var nextEnd = null;

  function emitChunk(type, end, lastChunk) {
    // Ignore empty chunkss
    if (index !== end) {
      // Keep concatenating same type chunks
      if (nextType !== null && nextType !== type) {
        onChunk({
          type: nextType,
          start: index,
          end: nextEnd
        });
        index = nextEnd;
      }

      nextType = type;
      nextEnd = end;

      if (lastChunk) onChunk({
        type: nextType,
        start: index,
        end: nextEnd
      });
    }
  }

  var parser = new htmlparser2.Parser({

    // TODO on* attributes
    // https://www.w3schools.com/jsref/dom_obj_event.asp
    // apex tags with escape="false": apex:outputtext, apex:pagemessage, apex:pagemessages, apex:selectoption
    // itemescaped="false"
    // https://github.com/pmd/pmd/blob/master/pmd-visualforce/src/main/java/net/sourceforge/pmd/lang/vf/rule/security/VfUnescapeElRule.java
    //
    // URLENCODE for <a, <apex:iframe, <iframe

    onopentag(name) {
      // Test if current tag is a valid <script> tag.
      if (name === 'apex:repeat' && inScript) {
        emitChunk('script', parser.startIndex);
        emitChunk('apex:repeat', parser.endIndex + 1);
        //console.log('open tag: ', code.slice(parser.startIndex, parser.endIndex+1));
      }
      if (name !== 'script') return;
      inScript = true;
      emitChunk('html', parser.endIndex + 1);
    },

    oncdatastart() {
      if (inScript) {
        emitChunk('cdata start', parser.startIndex + 9);
        emitChunk('script', parser.endIndex - 2);
        emitChunk('cdata end', parser.endIndex + 1);
      }
    },

    onclosetag(name) {
      if (name === 'apex:repeat' && inScript) {
        emitChunk('script', parser.startIndex);
        emitChunk('apex:repeat', parser.endIndex + 1);
        // console.log('close tag: ', code.slice(parser.startIndex, parser.endIndex+1));
      }

      if (name !== 'script' || !inScript) return;

      inScript = false;

      var endSpaces = code.slice(index, parser.startIndex).match(/[ \t]*$/)[0].length;
      emitChunk('script', parser.startIndex - endSpaces);
    },

    ontext() {
      if (!inScript) return;

      emitChunk('script', parser.endIndex + 1);
    }

  }, { xmlMode: true });

  parser.parseComplete(code);

  emitChunk('html', parser.endIndex + 1, true);
}

function computeIndent(descriptor, previousHTML, codeSlice) {
  if (!descriptor) {
    var indentMatch = /[\n\r]+([ \t]*)/.exec(codeSlice);
    return indentMatch ? indentMatch[1] : '';
  }

  if (descriptor.relative) return previousHTML.match(/([^\n\r]*)<[^<]*$/)[1] + descriptor.spaces;

  return descriptor.spaces;
}

function dedent(indent, codeSlice) {
  var hadNonEmptyLine, re, match, newLine, lineIndent, lineText, isEmptyLine, isFirstNonEmptyLine, badIndentation;
  return regeneratorRuntime.wrap(function dedent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          hadNonEmptyLine = false;
          re = /(\r\n|\n|\r)([ \t]*)(.*)/g;

        case 2:
          match = re.exec(codeSlice);

          if (match) {
            _context.next = 5;
            break;
          }

          return _context.abrupt('break', 26);

        case 5:
          newLine = match[1];
          lineIndent = match[2];
          lineText = match[3];
          isEmptyLine = !lineText;
          isFirstNonEmptyLine = !isEmptyLine && !hadNonEmptyLine;
          badIndentation
          // Be stricter on the first line
          = isFirstNonEmptyLine ? indent !== lineIndent : lineIndent.indexOf(indent) !== 0;

          if (badIndentation) {
            _context.next = 16;
            break;
          }

          _context.next = 14;
          return {
            type: 'dedent',
            from: match.index + newLine.length,
            to: match.index + newLine.length + indent.length
          };

        case 14:
          _context.next = 23;
          break;

        case 16:
          if (!isEmptyLine) {
            _context.next = 21;
            break;
          }

          _context.next = 19;
          return { type: 'empty' };

        case 19:
          _context.next = 23;
          break;

        case 21:
          _context.next = 23;
          return { type: 'bad-indent' };

        case 23:

          if (!isEmptyLine) hadNonEmptyLine = true;

        case 24:
          _context.next = 2;
          break;

        case 26:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function extract(code, indentDescriptor) {
  var badIndentationLines = [];
  var apexRepeatTags = [];
  var transformedCode = new TransformableString(code);
  var lineNumber = 1;
  var previousHTML = '';

  iterateScripts(code, function (chunk) {
    var codeSlice = code.slice(chunk.start, chunk.end);

    switch (chunk.type) {
      case 'html':
        previousHTML = codeSlice;
      // falls through
      case 'apex:repeat':
      case 'cdata start':
      case 'cdata end':
        {
          var newLinesRe = /(?:\r\n|\n|\r)([^\r\n])?/g;
          var lastEmptyLinesLength = 0;
          for (;;) {
            var match = newLinesRe.exec(codeSlice);
            if (!match) break;
            lineNumber += 1;
            lastEmptyLinesLength = !match[1] ? lastEmptyLinesLength + match[0].length : 0;
          }
          transformedCode.replace(chunk.start, chunk.end - lastEmptyLinesLength, '/* HTML */');
          break;
        }
      // case 'apex:repeat':
      //   transformedCode.replace(chunk.start, chunk.end, `/* ${codeSlice} */`)
      //   // TODO add message
      //   break
      case 'script':
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dedent(computeIndent(indentDescriptor, previousHTML, codeSlice), codeSlice)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var action = _step.value;

            lineNumber += 1;
            if (action.type === 'dedent') transformedCode.replace(chunk.start + action.from, chunk.start + action.to, '');else if (action.type === 'bad-indent') badIndentationLines.push(lineNumber);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        break;
    }
  }); // iterateScripts

  return {
    code: transformedCode,
    badIndentationLines,
    apexRepeatTags
  };
}

module.exports = extract;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Rule to make sure all Apex variables are JSENCODEd in strings
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

var safeFunctions = [
// Date & Time
'DATE', 'DATEVALUE', 'DATETIMEVALUE', 'DAY', 'MONTH', 'YEAR',
// Logical
'AND', 'ISBLANK', 'ISNULL', 'ISNUMBER', 'NOT', 'OR',
// Math
'ABS', 'CEILING', 'EXP', 'FLOOR', 'LN', 'LOG', 'MAX', 'MIN', 'MOD', 'ROUND', 'SQRT',
// Text
'CASESAFEID', 'CONTAINS', 'FIND', 'ISPICKVAL', 'JSENCODE', 'JSINHTMLENCODE', 'LEN', 'VALUE',
// Advanced
'ISCHANGED', 'REGEX' // TODO check LINKTO, REQUIRESCRIPT, and URLFOR
];

var safeBitwiseOperators = ['>', '>=', '<', '<=', '==', '=', '!=', '<>', '*', '/', '^', '-'];

var untaintingParents = {
  VFELCallExpression(parentNode, node) {

    // Identifier is just a function name
    if (parentNode.callee === node) return true;

    var funcName = parentNode.callee.name.toUpperCase();

    // checking against safe functions
    if (safeFunctions.indexOf(funcName) >= 0 && parentNode.arguments.indexOf(node) >= 0) return true;

    // Special cases
    // IF's first argument is condition, does not produce output, second and third are unsafe
    if (funcName === 'IF' && parentNode.arguments[0] === node) return true;

    // CASE's first argument is expression to compare and all odd arguments are values to compare to => safe
    if (funcName === 'CASE') {
      var index = parentNode.arguments.indexOf(node);
      return !index || index % 2;
    }

    return false;
  },
  VFELLogicalExpression() {
    return true;
  },
  VFELBinaryExpression(parentNode) {
    return safeBitwiseOperators.indexOf(parentNode.operator) >= 0;
  },
  UnaryExpression() {
    // Only NOT and !, both boolean
    return true;
  },
  MapEntry(parentNode, node) {
    // keys are safe, values are not
    return parentNode.key === node;
  },
  VFELMemberExpression() {
    // VFELMemberExpressions such as field[selector] are not untainting
    // However, JSENCODE should be applied to the expression itself,
    // and not the selectors, so we untaint the members of this expression
    return true;
  }
};

function isSafeSystemIdentifier(identifier) {
  var systemVariable = identifier.match(/^(\$[^.]+)\./);
  if (!systemVariable) return false;

  switch (systemVariable[1]) {
    case '$ACTION':
    case '$API':
    case '$ASSET':
    case '$COMPONENT':
    case '$PAGE':
    case '$PERMISSION':
    case '$RESOURCE':
    case '$SCONTROL':
    case '$SITE':
    case '$SYSTEM':
      return true;
    default:
      return false;
  }
}

function isTainting(node) {
  var parent = node.parent;

  // The end of recursion
  if (parent.type === 'VFELExpression') {
    return true;
  }

  var untainter = parent && untaintingParents[parent.type];

  // The parent expression untaints the whole subtree
  if (untainter && untainter(parent, node)) return false;else return isTainting(parent);
}

function checkNode(node, context) {
  //console.log(`identifier's `, node.name ,` parent is ${node.parent.type}`)

  // Not checking taint for system variables except the only user-controlled one
  if (node.name && isSafeSystemIdentifier(node.name.toUpperCase())) return;

  if (isTainting(node)) context.report({
    message: 'JSENCODE() must be applied to all rendered Apex variables',
    node,
    fix(fixer) {
      var vfelText = context.getSourceCode().getText(node);
      return fixer.replaceText(node, `JSENCODE(${vfelText})`);
    }
  });
}

module.exports = {
  meta: {
    docs: {
      description: 'Require all unsafe Apex variables to be JSENCODEd',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/forcedotcom/eslint-plugin-visualforce/blob/master/docs/rules/jsencode.md'
    },
    fixable: 'code',
    schema: [] // no options
  },
  create(context) {
    return {
      VFELIdentifier: function VFELIdentifier(node) {
        return checkNode(node, context);
      },
      VFELMemberExpression: function VFELMemberExpression(node) {
        return checkNode(node, context);
      }
    };
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Rule to disallow VFEL merge fields as atomic expressions
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

module.exports = {
  meta: {
    docs: {
      description: 'Disallow <apex:*> tags inside <script> tags',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/forcedotcom/eslint-plugin-visualforce/blob/master/docs/rules/no-apex-tags.md'
    },
    schema: [] // no options
  },
  create(context) {
    return {
      JSXElement: function JSXElement(node) {
        return context.report({
          message: 'VisualForce standard components (<apex:*> tags) are not allowed in Javascript',
          node
        });
      }
    };
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Rule to disallow VFEL merge fields as atomic expressions
 * @author Marat Vyshegorodtsev
 * @license ISC
 * For full license text, see LICENSE file in the repo root
 * or https://opensource.org/licenses/ISC
 */

module.exports = {
  meta: {
    docs: {
      description: 'Disallow VFEL merge fields as atomic expressions',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/forcedotcom/eslint-plugin-visualforce/blob/master/docs/rules/no-atom-expr.md'
    },
    fixable: 'code',
    schema: [] // no options
  },
  create(context) {
    return {
      VFELExpression: function VFELExpression(node) {
        if (node.parent && node.parent.type !== 'MetaString') context.report({
          message: 'VisualForce merge fields should only be allowed in strings',
          node,
          fix(fixer) {
            var vfelText = context.getSourceCode().getText(node);
            return fixer.replaceText(node, `JSON.parse('${vfelText}')`);
          }
        });
      }
    };
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@salesforce/acorn-visualforce/dist/inject");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("htmlparser2");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(1);


/***/ })
/******/ ]);