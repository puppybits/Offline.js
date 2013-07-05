# Offline

## Replace the app cache with local storage*
* Drop-in replacement for App Cache.
* Uses local storage to cache items.
* When the app is offline the library will replace all dom elements to inlined elements.
* Supports inlining: scripts, css files, html templates and images(via datauris)
* This library is focused for single page web apps.

## Base API
* `Offline.prime()`. Once the DOM has all the resource nodes appended, call Offline.prime(). Prime will scrap the document for all resources, download all items in a background Worker thread (if available) and save in the local storage.
* Coming soon! A method to replace all resources in the DOM with inline versions saved in the local storage.

## Roadmap

* check out the feature branches


## Quick Start

1. Create a file called `appcache.manifest`.
2. In the file app only your main HTML file.
3. Make sure your server supports manifest mime types.
  1. For Apache open the `mime.types` and add `text/cache-manifest manifest`.
4. Add `Offline.js` to your main HTML file.
5. Call `Offline.prime()` on your page.

`* caveat: The app cache is still needed for the main index.html but Offline will handle the rest`
