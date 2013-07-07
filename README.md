# Offline

## Replace the app cache with local storage*
* Drop-in replacement for App Cache.
* Uses local storage to cache items.
* When the app is offline the library will replace all dom elements to inlined elements.
* Supports inlining: scripts, css files and images(via datauris)
* This library is focused for single page web apps.

## Base API
* `Offline.prime()`. Once the DOM has all the resource nodes appended, call Offline.prime(). Prime will scrap the document for all resources, download all items in a background Worker thread (if available) and save in the local storage.
* `Offline.activate()`. After all the resources have been cached via prime, calling activate will replace elements with inline data from the local storage.

## Roadmap

* check out the feature branches


## Quick Start

* Create a file called `appcache.manifest`. 

```
CACHE MANIFEST

CACHE:
index.html   # replace with your main html file
offline.js

NETWORK:
*
```

* Make sure your server supports manifest mime types.
  * For Apache open the `mime.types` and add `text/cache-manifest manifest`.
* Add the manifest to your html tag `<html manifest="appcache.manifest">`
* Add `offline.js`.
* call `offline.prime()` to download everything in the DOM
* call `offline.activate()` to replace DOM nodes with local storage cache

```html
<html manifest="appcache.manifest">
  <body>
    ...
  </body>
  <script type="application/javascript" src="offline.js">
  <script>
  var offline = new Offline(); // options: {document: myDocFragment, useThreads: false}
  if (navigator.onLine)
  {
    offline.prime()
  }
  else
  {
    offline.activate()
  }
  </script>
</html>
```

* In order to update the main html after the inital load, delete the app cache browser storage. In chrome use: `chrome://appcache-internals`.

`* caveat: The app cache is still needed for the main index.html but Offline will handle the rest`
