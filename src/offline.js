var Offline = function(opts) {
  'use strict';
  
  opts = opts || {};
  var doc = (opts.document ? opts.document : window.document),
  hasBrowserThreads = (Blob && Worker && URL.createObjectURL ? true : false),
  useThreads = (hasBrowserThreads && (opts.useThreads === false ? false : true)),
  rel = function(s){ return s.replace(/^.*\/\/[^\/]+/,'') },
  
  createThread = function(fnc, args, callback)
  {
    var capturedArguments = args,
    synchronousAction = 'onmessage = function(event)' +
      '{\n'+
      'var done = function(returnValue)\n'+
      '{\n'+
      '  self.postMessage(returnValue);\n'+
      '},\n'+
      'args = Array.isArray(event.data) ? event.data : [event.data];\n'+
      'args.push(done);\n'+
      'var fn = '+
      fnc.toString() + 
      ',\n'+
      'returnValue = fn.apply(fn, args);\n'+
      'if (returnValue) done(returnValue);\n'+
      '};';
    
    var compile = new Blob([synchronousAction]),
    serizedAction = window.URL.createObjectURL(compile),
    thread = new Worker(serizedAction);
    thread.addEventListener('message', function(e)
    {
      callback(e.data);
    });
    
    thread.postMessage(args);
  },
  
  noThread = function(fnc, args, callback)
  {
    var done = function() 
    {
      callback.apply(callback, arguments);
    },
    args = Array.isArray(args) ? args : [args];
    args.push(done);
    var result = fnc.apply(fnc, args);
    if (!result) return;
    callback(result);
  },
  
  schedule = 
    useThreads ? function( resource ){
      if (!resource) return;
      createThread(load, resource, function(data){
        localStorage.setItem(rel(resource), data);
      });
    } :
    function( resource ){
      if (!resource) return;
      noThread(load, resource, function(data){
        localStorage.setItem(rel(resource), data);
      });
    },
  
  load = function( resource, callback ) 
  {
    //https://github.com/davidchambers/Base64.js
    var btoa = function (input) {
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      for (
        var block, charCode, idx = 0, map = chars, output = '';
        input.charAt(idx | 0) || (map = '=', idx % 1);
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = input.charCodeAt(idx += 3/4);
        if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
        block = block << 8 | charCode;
      }
      return output;
    },
    isImage = /png$|jpg$|jpeg$|gif$|svg$/.exec(resource) || false,
    
    xhr = new XMLHttpRequest();
    xhr.open('GET', resource, true);
    xhr.responseType = isImage ? 'arraybuffer' : 'text';
    
    xhr.onload = function(e) 
    { 
      if (this.status !== 200) return;
      
      if (!isImage) return callback(this.responseText);
      
//http://stackoverflow.com/questions/8022425/getting-blob-data-from-xhr-request
      var uInt8Array = new Uint8Array(this.response),
      i = uInt8Array.length,
      binaryString = new Array(i);
      while (i--)
      {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      }
      var uri="data:image/"+(isImage[0]!=='svg'?isImage[0]:'svg+xml')+";base64,",
      data = binaryString.join(''),
      base64 = btoa(data);
      
      callback(uri+base64);
    };
    
    xhr.send();
  },
  
  scrapAll = function(action)
  {
    var resources = doc.querySelectorAll('script, img, link'),
    isUsingCached, element, r;
    for (r=0; r < resources.length; r++)
    {
      element = resources[r];
      action(element);
    }
  },
  
  replaceResourcesInline = function( element )
  {
    // 3 states of element: inline/cached, external/not-cached, external/cached
    var type = element.nodeName,
    src = element.src || element.href,
    result = src ? localStorage.getItem( rel(src) ) : false,
    el, parent;
    
    if (!result) return;
    
    element.setAttribute('data-original-src', src);
    if (!/html$/.exec(src))
      element.src = element.href = null;
    
    if (/css$/.exec(src))
    {
      el = document.createElement('style');
      el.innerHTML = result;
      element.parentElement ?
        element.parentElement.insertBefore(el, element) :
        doc.appendChild(el);
    }
    else if (/js$/.exec(src))
    {
      el = document.createElement('script');
      el.type = element.type;
      el.innerHTML = result;
      if (element.parentElement) 
      {
        element.parentElement.replaceChild(el, element);
      }
      else
      {
        doc.appendChild(el);
        doc.removeChild(element);
      }
    }
    else if (/html$/.exec(src))
    {
      
    }
    else if (type.toUpperCase() === 'IMG')
    {
      element.src = result;
    }
  };
  
  Object.freeze = Object.freeze || function(p){return p;};
  
  return Object.freeze(
    {
      prime: function()
      { 
        scrapAll( function(el)
        {
          var isCached = el.getAttribute('data-original-src');
          if (isCached) return;
          schedule(el.src || el.href) 
        }) 
      },
    activate: function()
    {
      scrapAll( function(el)
      {
        var isCached = el.getAttribute('data-original-src');
        if (isCached) return;
        replaceResourcesInline(el);
      })
    }
  });
  
}
