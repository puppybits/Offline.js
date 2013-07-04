# Offline

## Replace the app cache with local storage*
* this library is focused for single page web apps.

## Base API
* `window.onload`. Finds all CSS, JS, HTML Imports and IMGs on the document, downloads and save to local storage
* `Offline.prime()`. Needs to be called when the app has finished loading a new route. It will find all the resources for the new dom elements and cache them.
* `Offline.activate()`. Manually replace all items in the document with cached version inline.
* `Offline.cache( resourceURI )`. Manually download a uri and add it to the cache.
* `Offline.wipe( resourceURI )`. Manually remove an item from the cache

## Advanced API (version 2)

* `Offline.json(endpoint, overrideTTL)`. Load JSON data, use the returned headers to store the TTL in cache, can be overridden in the method call. If in the json function is called with 0 it will remove it from the local storage.
* `Offline.patchXHR()`. swap the XHR with a proxy so every library (jQuery, Angular, …) that uses XHR will be store every call in cache.
* `Offline.blacklist( regex_of_routes )`. Array of routes to ignore the caching on.




`* caveat: The app cache is still needed for the main index.html but Offline will handle the rest`
