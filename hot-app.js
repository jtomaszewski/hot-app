;(function(factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // Node/CommonJS
    module.exports = factory(this);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    var global=this;
    define('hot-app', function(){ return factory(global);});
  } else {
    // Browser globals
    this.HotApp = factory(this);
  }
}(function(global) {
  "use strict";

  // Options:
  // - oldApp: HotApp|null - remember to pass it, if it already exists
  // - getRootElement: HTMLElement - f.e. `document.body`
  // - startFn: Function(app: HotApp, onStart: Function)
  // - stopFn: Function(app: HotApp, onStop: Function)
  function HotApp(options) {
    this.getRootElement = options.getRootElement;
    this.startFn = options.startFn;
    this.stopFn = options.stopFn;
    if (options.oldApp) {
      this.rootElementHtml = options.oldApp.rootElementHtml;
    }

    this._isRunning = false;
  }

  HotApp.prototype.isRunning = function() {
    return this._isRunning;
  }

  HotApp.prototype.start = function(afterStart) {
    // If rootElementHtml is given, let's replace the rootElement's html then
    if (this.rootElementHtml) {
      this.getRootElement().outerHTML = this.rootElementHtml;
    // If not, let's bind it to this app, so it can be used for the "new" app
    } else {
      this.rootElementHtml = this.getRootElement().outerHTML;
    }

    var _this = this;
    this.startFn(this, function() {
      _this._isRunning = true;
      console.debug('app has been started.');
      afterStart && afterStart(_this);
    });
  }

  // don't start the app until the DOM is ready
  HotApp.prototype.startOnDOMReady = function(afterStart) {
    if (document.readyState === 'complete') {
      this.start(afterStart);
    } else {
      var _this = this;
      document.addEventListener('DOMContentLoaded', function() {
        _this.start(afterStart);
      });
    }
  };

  HotApp.prototype.stop = function(afterStop) {
    var _this = this;
    this.stopFn(this, function() {
      _this._isRunning = false;
      console.debug('app has been stopped.');
      afterStop && afterStop(_this);
    });
  }

  HotApp.prototype.restart = function(afterRestart) {
    console.debug('app restarting...');
    var _this = this;
    this.stop(function() {
      _this.start(function() {
        afterRestart && afterRestart(_this);
      });
    });
  }

  return { HotApp: HotApp };
}));
