# Offline

## Run Angular, Backbone and Polymer apps offline!

* Drop-in replacement for the horribly broken App Cache.
* Designed to work with Angular, Backbone and Polymer without monkey patching the them.
* Multi-threading (Web Workers) supported to keep the downloading and parsing off the main UI thread keep your FPS stable.
* Users don't need to reload page when there is new resource version available.
* Super simple development process. No need for build scripts, no manually deleting app cache, no need to use phonegap just to work offline.
* Speed up online apps by caching your XHR requests and freeing JS, CSS, image from memory when not being used.
* Offline use the local storage to cache all the JS, CSS and images.
* When the app is offline the library will replace all dom elements to inlined elements.
* Supports inlining: scripts, css files and images.
* It just works.

## Base API
* `Offline.prime()`. Once the DOM has all the resource nodes appended, call Offline.prime(). Prime will scrap the document for all resources, download all items in a background Worker thread (if available) and save in the local storage.
* `Offline.activate()`. After all the resources have been cached via prime, calling activate will replace elements with inline data from the local storage.
* __Coming soon.__ Automatically cache all JSON requests with a blacklist to exclude sensitive or real-time only data.

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
* Add the manifest to your html tag `<html manifest="appcache.manifest">`.
* Add `offline.js`.
* Call `offline.prime()` to download everything in the DOM.
* Call `offline.activate()` to replace DOM nodes with local storage cache.

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

## Workbench

* Working sample is in the workbench. 
* Navigate to the root and run `python -m SimpleHTTPServer && open http://localhost:8000/workbench/offline.html`.
* Make sure the server is sending the manifest file with the `text/cache-manifest` type.
* The first load will run offline.prime() to store the assets in local storage.
* Turn off the python server AND disconnect from any wired/wireless internet (for navigator.onLine to report false).
* Reload the page and the assets will be using the local storage cache.

## License

MIT  


`* caveat: The app cache is still needed for the main index.html but Offline will handle the rest`


