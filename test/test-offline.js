// toggle between unit and integration test by setting a ms delay 
// and run `python -m SimpleHTPServer` at the root directory
var intDelay = false;

describe('Offline', function()
{
  describe('Without Worker Threads', function()
  {
    describe('priming the cache', function()
    {
      var swizzleXHR, swizzleDOM, swizzleDOMSelect, doc, OFFLINE;
    
      beforeEach(function()
      {
        if (!intDelay)
        {
          var spacerGIF = "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          var bytes = [];
          for (var i = 0; i < spacerGIF.length; ++i)
          {
              bytes.push(spacerGIF.charCodeAt(i));
          }
      
          swizzleXHR = window.XMLHttpRequest;
          window.XMLHttpRequest = function()
          {
            this.open = function(){};
            this.onload = null;
            this.status = 200;
            this.responseText = 'done';
            this.response = bytes;
            this.send = function(){
              this.onload.call(this, {})
            }
          }
        }
      
        doc = new DocumentFragment();
      
        OFFLINE = new Offline({document:doc, useThreads:false})
      });
    
      afterEach(function()
      {
        if (swizzleXHR) window.XMLHttpRequest = swizzleXHR;
      
        doc = null;
        delete doc;
      
        OFFLINE = null;
        delete OFFLINE;
      });
    
      it('should cache an HTML Import in the DOM', function()
      {
        var src = '/test/integration_data/template.html',
        el = window.document.createElement('link');
        el.rel = 'import';
        el.href = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
      it('should cache an CSS Stylesheet in the DOM', function()
      {
        var src = '/test/integration_data/style.css',
        el = window.document.createElement('link');
        el.rel = 'stylesheet';
        el.href = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
      it('should cache a JavaScript script in the DOM', function()
      {
        var src = '/test/integration_data/script.js',
        el = window.document.createElement('script');
        el.src = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
  
      it('should cache an Image in the DOM', function()
      {      
        var src = '/test/integration_data/img.png',
        el = window.document.createElement('img');
        el.src = src; // note: this makes a network request (but not used)
        doc.appendChild(el);
      
        OFFLINE.prime();
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
    });
  });
  
  describe('With Worker Threads (if browser supprted)', function()
  {
    describe('priming the cache', function()
    {
      var swizzleXHR, swizzleDOM, swizzleDOMSelect, doc, OFFLINE;
    
      beforeEach(function()
      {
        if (!intDelay)
        {
          var spacerGIF = "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          var bytes = [];
          for (var i = 0; i < spacerGIF.length; ++i)
          {
              bytes.push(spacerGIF.charCodeAt(i));
          }
      
          swizzleXHR = window.XMLHttpRequest;
          window.XMLHttpRequest = function()
          {
            this.open = function(){};
            this.onload = null;
            this.status = 200;
            this.responseText = 'done';
            this.response = bytes;
            this.send = function(){
              this.onload.call(this, {})
            }
          }
        }
      
        doc = new DocumentFragment();
      
        OFFLINE = new Offline({document:doc, useThreads:true})
      });
    
      afterEach(function()
      {
        if (swizzleXHR) window.XMLHttpRequest = swizzleXHR;
      
        doc = null;
        delete doc;
      
        OFFLINE = null;
        delete OFFLINE;
      });
    
      it('should cache an HTML Import in the DOM', function()
      {
        var src = '/test/integration_data/template.html',
        el = window.document.createElement('link');
        el.rel = 'import';
        el.href = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
      it('should cache an CSS Stylesheet in the DOM', function()
      {
        var src = '/test/integration_data/style.css',
        el = window.document.createElement('link');
        el.rel = 'stylesheet';
        el.href = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
      it('should cache a JavaScript script in the DOM', function()
      {
        var src = '/test/integration_data/script.js',
        el = window.document.createElement('script');
        el.src = src;
        doc.appendChild(el);
      
        OFFLINE.prime()
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
  
      it('should cache an Image in the DOM', function()
      {      
        var src = '/test/integration_data/img.png',
        el = window.document.createElement('img');
        el.src = src; // note: this makes a network request (but not used)
        doc.appendChild(el);
      
        OFFLINE.prime();
      
        setTimeout(function(){
          assert(localStorage.getItem(src) !== null);
      
          after(function()
          {
            delete window.localStorage[src];
          });
        },intDelay);
      });
    
    });
  });  
  
})
