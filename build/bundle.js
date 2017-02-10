/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var MiniObservable = (function () {
    function MiniObservable(name, logger, functionThatThrowsValues) {
        this._name = name;
        this.logger = logger;
        this.logger.log("Created " + this.name());
        this.functionThatThrowsValues = functionThatThrowsValues;
    }
    MiniObservable.prototype.name = function () {
        return "Observable" + this._name;
    };
    MiniObservable.prototype.subscribe = function (observer) {
        this.logger.log("Called " + this.name() + ".subscribe(" + observer.name() + ")");
        this.functionThatThrowsValues(observer, this.name());
    };
    MiniObservable.prototype.map = function (name, projectionFunction) {
        var _this = this;
        var logger = this.logger;
        return new MiniObservable(name, logger, function (observer, name) {
            logger.log("Called " + name + ".functionThatThrowsValues(" + observer.name() + ")");
            return _this.subscribe({
                name: function () { return "Observer(" + name + "&" + observer.name() + ")"; },
                next: function (val) {
                    logger.log("Called " + name + ": " + observer.name() + ".next()");
                    observer.next(function (val) { return projectionFunction(val); }(val));
                },
                error: function (e) { observer.error(e); },
                complete: function () { observer.complete(); }
            });
        });
    };
    MiniObservable.fromEvent = function (el, event, logger) {
        return new MiniObservable("EVENT", logger, function (observer, name) {
            logger.log("Called " + name + ".addEventListener(" + observer.name() + ")");
            el.addEventListener(event, function (e) {
                logger.log("Emitted element event <span class=\"event\">" + event + "</span> for " + observer.name() + ".");
                observer.next(e);
            });
        });
    };
    return MiniObservable;
}());
exports.MiniObservable = MiniObservable;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var log_1 = __webpack_require__(2);
var miniobserver_factory_1 = __webpack_require__(3);
var miniobserver_interval_factory_1 = __webpack_require__(4);
var miniobservable_1 = __webpack_require__(0);
var logA = new log_1.Logger("logA");
miniobserver_interval_factory_1.miniObservableIntervalFactory(logA)
    .subscribe(miniobserver_factory_1.miniObserverFactory("A", logA));
var logB = new log_1.Logger("logB");
miniobserver_interval_factory_1.miniObservableIntervalFactory(logB)
    .map("MAP1", function (val) { return "M1[" + val + "]"; })
    .map("MAP2", function (val) { return "M2[" + val + "]"; })
    .map("MAP3", function (val) { return "M3[" + val + "]"; })
    .subscribe(miniobserver_factory_1.miniObserverFactory("B", logB));
var logC = new log_1.Logger("logC");
var clickObservable = miniobservable_1.MiniObservable.fromEvent(document.getElementById('rxmini'), 'click', logC);
clickObservable
    .subscribe(miniobserver_factory_1.miniObserverFactory("C", logC));
clickObservable
    .subscribe(miniobserver_factory_1.miniObserverFactory("D", logC));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Logger = (function () {
    function Logger(elId) {
        this.el = document.getElementById(elId);
    }
    Logger.prototype.log = function (text) {
        var p = document.createElement("p");
        p.innerHTML = "&bull; " + text;
        this.el.appendChild(p);
    };
    return Logger;
}());
exports.Logger = Logger;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.miniObserverFactory = function (name, logger) {
    return {
        name: function () { return "Observer" + name; },
        next: function (val) { logger.log(this.name() + " got <span class=\"value\">\"" + val + "\"</span>."); },
        error: function (e) { logger.log("ERROR: " + e); },
        complete: function () { logger.log("<span class=\"completed\">Observer " + name + " completed.</span>"); }
    };
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var miniobservable_1 = __webpack_require__(0);
exports.miniObservableIntervalFactory = function (logger) {
    return new miniobservable_1.MiniObservable("INTERVAL", logger, function (observer, name) {
        logger.log("Called " + name + ".functionThatThrowsValues(" + observer.name() + ")");
        var i = 0;
        //async
        var interval = setInterval(function () {
            i++;
            logger.log("Called " + name + ": " + observer.name() + ".next()");
            observer.next(i);
            if (i >= 3) {
                clearInterval(interval);
                observer.complete();
            }
        }, 450);
    });
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);