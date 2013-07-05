/* 

*/

var Offline = function(opts)
{
  var doc = opts.document || window.document,
  useThreads = (Blob && Worker && URL.createObjectURL && (opts.useThreads !== false)),
  shouldAutoCache = opts.shouldAutoCache || true,
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
          createThread(load, resource, function(data){
            localStorage.setItem(rel(resource), data);
          });
        } :
    function( resource ){
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
      base64 = btoa(unescape(encodeURIComponent(data)));
      
      callback(uri+base64);
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
  
  return Object.freeze({
    prime: function(){ scrapHTML(function(el){schedule(el.src || el.href)}) },
    activate: replaceResourcesInline,
    cache: function(src){ this.schedule(src); },
    wipe: function(src){ localstorage.setItem(rel(src), null); }
  });
  
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
