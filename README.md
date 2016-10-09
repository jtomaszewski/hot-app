# HotApp.js

Simple wrapper to make your js app start, stop and restart easily through the browser console or f.e. webpack hot reload system.

# Usage example: Webpack, hot reload, angular1 with angular2 upgrade

```ts
// -- helpers
function requireAll(r) { r.keys().forEach(r); }

// define the ng1 app module, only if not defined yet
if (!window.__ng1AppDefined) {
  angular.module("app", []);
}
window.__ng1AppDefined = true;

// Require the ng1 app code: its' directives, components, services code and so on
//
// NOTE Your ng1 code should use angular-hot library
//      (https://github.com/jtomaszewski/angular-hot)
//      If not, propably it will raise error while redefining the ng1 directives/components.
requireAll(require.context('./ng1/', true, /\.js$/));

// Require the ng2 app code: the ngmodule and all its requires should be in upgrade_adapter.ts code
import { adapter } from './upgrade_adapter';

// Now, let's use the HotApp to run the app and eventually restart it, if needed

import { HotApp } from 'hot-app';

let app = (<any>window).app = new HotApp({
  oldApp: (<any>window).app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    (<any>app).ng2 = adapter.bootstrap(app.getRootElement(), ['app'], {strictDi: false});
    (<any>app).ng2.ready(() => {
      onStart();
    });
  },
  stopFn: (app, onStop) => {
    (<any>app).ng2.dispose();
    onStop();
  }
});

app.startOnDOMReady();

// Webpack hot reload support
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    app.stop();
  });
}
```

# Usage example: Webpack, hot reload, angular2

```ts

// Require the ng2 app code: the ngmodule and all its requires should be in upgrade_adapter.ts code
import { adapter } from './upgrade_adapter';

// Now, let's use the HotApp to run the app and eventually restart it, if needed

import { HotApp } from 'hot-app';

let app = (<any>window).app = new HotApp({
  oldApp: (<any>window).app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    (<any>app).ng2 = adapter.bootstrap(app.getRootElement(), ['app'], {strictDi: false});
    (<any>app).ng2.ready(() => {
      onStart();
    });
  },
  stopFn: (app, onStop) => {
    (<any>app).ng2.dispose();
    onStop();
  }
});

app.startOnDOMReady();

// Webpack hot reload support
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    app.stop();
  });
}
```

# Usage example: Webpack, hot reload, angular1

```js
// -- helpers
function requireAll(r) { r.keys().forEach(r); }

// define the ng1 app module, only if not defined yet
if (!window.__ng1AppDefined) {
  angular.module("app", []);
}
window.__ng1AppDefined = true;

// Require the ng1 app code: its' directives, components, services code and so on
//
// NOTE Your ng1 code should use angular-hot library
//      (https://github.com/jtomaszewski/angular-hot)
//      If not, propably it will raise error while redefining the ng1 directives/components.
requireAll(require.context('./ng1/', true, /\.js$/));

let app = window.app = new HotApp({
  oldApp: window.app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    angular.bootstrap(app.getRootElement(), ['app'], {strictDi: false});
    onStart();
  },
  stopFn: (app, onStop) => {
    angular.element(app.getRootElement()).injector().get('$rootScope').$destroy();
    onStop();
  }
});

app.startOnDOMReady();

// Webpack hot reload support
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    app.stop();
  });
}
```

# License

MIT

# Contribution, Bug reports, Questions

Just use github issues or pull requests! ;)
