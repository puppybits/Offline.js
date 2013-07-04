/* 
# Version 0
 * JS <script src="something.js">
 * CSS <link rel="stylesheet" type="text/css" href="mystyles.css"/>
 * HTML <link rel="import" href="template.html">
 * IMG <img src="something.png">
# Version 0.5
 * background thread support
# Version 1
 * JSON - need to cache JSON, let expire and/or no use when stale
*/

var Offline = function(opts)
{
  var doc = opts.document || window.document,
  shouldAutoCache = opts.shouldAutoCache || true,
  rel = function(s){ return s.replace(/^.*\/\/[^\/]+/,'') },
  
  createThread = function(fnc, args, callback)
  {
    // TODO: add hook to stop processing when heavy load
    // TODO: fall back to main thread if workers not supported
    var capturedArguments = args,
    synchronousAction = 'onmessage = function(event)' +
      '{\n'+
      'var data = event.data;\n'+
      'var fn = '+
      fnc.toString() + 
      ';\n'+
      'returnValue = fn.apply(fn, data);\n'+
      'self.postMessage( returnValue );\n'+
      '};';
    
    var compile = new Blob([synchronousAction]),
    serizedAction = window.URL.createObjectURL(compile),
    thread = new Worker(serizedAction);
    thread.addEventListener('message', function(e)
    {
      callback(e.data);
    });
    
    return thread;
  },
  
  noThread = function(fnc, args, callback)
  {
    var result = fnc.apply(fnc, args);
    callback(result);
  },
  
  schedule = /*window.Worker ? createThread :*/ noThread,
  
  load = function( resource ) 
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', resource, false);
    xhr.onload = function(e) 
    { 
      if (this.status !== 200) return;
      
      var isImage = /\.png|\.jpg|\.jpeg|\.gif|\.svg/.exec(resource);
      
      // TODO: Workers have NO access localStorage, blob or fileReader
      if (isImage)
      {
        // @see: http://www.html5rocks.com/en/tutorials/file/xhr2
        var blob = window.URL.createObjectURL(this.response);
        
        var reader = new FileReader ();
        reader.onload = function (e) {
          var imgDataUri = e.target.result;
          localStorage.setItem(rel(resource), imgDataUri)
        };
        reader.readAsDataURL (blob);
        return;
      }
      
      localStorage.setItem(rel(resource), this.responseText)
    };
    
    xhr.send();
  },
  
  scrapHTML = function(action)
  {
    var resources = doc.querySelectorAll('script, img, link'),
    element, r, isUsingCached;
    for (r=0; r < resources.length; r++)
    {
      element = resources[r];
      isUsingCached = element.getAttribute('data-original-src');
      if (isUsingCached) continue;
      
      action(element);
    }
  },
  
  replaceResourcesInline = function( element )
  {
    // 3 states of element: inline/cached, external/not-cached, external/cached
    var replaceElement = function(at, content, prop)
    {
      element.setAttribute('data-original-src', at.src || at.href);
      at.src = at.href = null;
      at[prop] = content;
    },
    type = element.nodeName,
    prop = type !== 'IMG' ? 'innerHTML' : 'src',
    src = element.src || element.href,
    result = localStorage.getItem( rel(src) );
    
    if (!result && src) 
    {
      this.schedule(this.load, src, function(result){
        replaceElement(element, result, prop);
      });
    }
    else
    {
      replaceElement(element, result, prop);
    }
  };
  // 
  // auto = function()
  // {
  //   window.addEventListener('load', function()
  //   {
  //     if (navigator.onLine) 
  //     {
  //       scrapHTML(function(element)
  //       {
  //         schedule(load, element.src || element.href);
  //       });
  //     }
  //     else
  //     {
  //       scrapHTML(function(element)
  //       {
  //         replaceResourcesInline( element );
  //       });
  //     }
  //     
  //     window.removeEventListener('load');
  //   });
  // };
  // 
  // auto();
  
  Object.freeze = Object.freeze || function(p){return p;};
  
  return {
    prime: function(){ scrapHTML(function(el){load(el.src || el.href)}) },
    activate: replaceResourcesInline,
    cache: function(src){ this.schedule(this.load, src, null); },
    wipe: function(src){ localstorage.setItem(rel(src), null); }
  };
  
}

// 
// // Hacky inline testing
// 
// var arr = [2,3,4], i = 1;
// Offline.prime(function(arr, i)
// {
//   console.log(arr[i]);
// }, [arr, i], function(e){console.log('finished')})
// 
