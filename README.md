# HotApp.js

Simple wrapper to make your js app start, stop and restart easily through the browser console or f.e. webpack hot reload system.

Console screen: https://www.dropbox.com/s/epb4dntthllphhi/Screenshot%202016-10-09%2021.18.48.png?dl=0

Video: https://drive.google.com/file/d/0B5-IASgGnqwdT2JUcWpVTUpmZnM/view

# Usage examples

### [preboot/angular-webpack](https://github.com/preboot/angular-webpack) seed with hot-app

https://github.com/jtomaszewski/angular-webpack/tree/hot-app

### [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) with hot-app

https://github.com/jtomaszewski/angular2-webpack-starter/tree/hot-app

### Webpack, hot reload, angular1 with angular2 upgrade

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

const app = (<any>window).app = new HotApp({
  oldApp: (<any>window).app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    app.data.ng2 = adapter.bootstrap(app.getRootElement(), ['app'], {strictDi: false});
    app.data.ng2.ready(() => {
      onStart();
    });
  },
  stopFn: (app, onStop) => {
    app.data.ng2.dispose();
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

### Webpack, hot reload, angular2

```ts

// Require the ng2 app code: the ngmodule and all its requires should be in upgrade_adapter.ts code
import { adapter } from './upgrade_adapter';

// Now, let's use the HotApp to run the app and eventually restart it, if needed

import { HotApp } from 'hot-app';

export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

const app = (<any>window).app = new HotApp({
  oldApp: (<any>window).app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    main().then(moduleRef => {
      app.data.moduleRef = moduleRef;
      onStart();
    });
  },
  stopFn: (app, onStop) => {
    app.data.moduleRef.destroy();
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

### Webpack, hot reload, angular1

```js
// -- helpers
function requireAll(r) { r.keys().forEach(r); }

// define the ng1 app module, only if not defined yet
if (!window.__ng1AppDefined) {
  angular.module("app", []);
  window.__ng1AppDefined = true;
}

// Require the ng1 app code: its' directives, components, services code and so on
//
// NOTE Your ng1 code should use angular-hot library
//      (https://github.com/jtomaszewski/angular-hot)
//      If not, propably it will raise error while redefining the ng1 directives/components.
requireAll(require.context('./ng1/', true, /\.js$/));

const app = window.app = new HotApp({
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
