/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + '.js', parentUri).href;
    return (
      (
      w Promise((r(esolve)) => {
         ('d'cument' 'n self) {
          nst script = document.createElement('s'ript')'
          ript.src = uri;
          ript.onload = resolve;
          cument.head.appendChild(script);
        else {
          xtDefineUri = uri;
          portScripts(uri);
          solve();
        
      .t  if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri =
      nextDefineUri || ('document' in self ? document.currentScript.src : '') || location.href;
    if (registr
y     [uri]) {''''
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = (depUri) => singleRequire(depUri, uri);
    const specialDep(s = {)
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(
      depsNames.map((depName) =>
       specialDeps[(dthen((d)eps) => {)
     facto(ry(..).deps);
      return exports;
    });
  };
}
define(['./workbox-785e9e58'], function (workbox) {
  'use strict';
 

  self.addEventListener('message', ((even)t) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute(
    
      
        ''
         {''
       
      
      
  url: '/index.html',
        revision: '0.unl6dh6290s'
      }
    ''
      ],
      {}
    );
    workbox.cleanupOutdatedCaches();
 workbox.registerRoute(
    new workbox.NavigationRoute(workbox.createHandlerBoundToURL('/index.html'), {
      allowlist: [/^\/$/],
      denylist: [/^\/api/, /^\/rainlogger-api/]
    })
  );
});
