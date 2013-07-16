// toggle between unit and integration test by setting a ms delay 
// and run `python -m SimpleHTPServer` at the root directory
var intDelay = 20;

describe('Offline', function()
{
  describe('Priming the Cache', function()
  {
    describe('without Worker Threads', function()
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

    describe('with Worker Threads (if browser supprted)', function()
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
  
  describe('Replacing the DOM with Inline Cache', function()
  {
    var swizzleDOM, swizzleDOMSelect, doc, body, OFFLINE;
  
    beforeEach(function()
    {
      doc = new DocumentFragment();
      
      body = document.createElement('body');
      doc.appendChild(body);
      body.appendChild(document.createElement('div'));
      
      OFFLINE = new Offline({document:doc, useThreads:false})
    });
  
    afterEach(function()
    {
      doc = null;
      delete doc;
    
      OFFLINE = null;
      delete OFFLINE;
    });
    
    it('should apply the CSS Stylesheet in the DOM', function()
    {
      var src = '/test/integration_data/style.css',
      css = 'body { background-color: red; }',
      el = window.document.createElement('link');
      el.rel = 'stylesheet';
      el.href = src;
      doc.appendChild(el);
      
      localStorage.setItem(src, css);
      
      OFFLINE.activate()
      
      assert(doc.querySelectorAll('style').length === 1);
      assert(doc.querySelectorAll('style')[0].innerHTML === css);
  
      after(function()
      {
        delete window.localStorage[src];
      });
    });
  
    it('should apply the JavaScript script in the DOM', function()
    {
      var src = '/test/integration_data/script.js',
      script = 'console.log("hi")',
      el = window.document.createElement('script');
      el.src = src;
      doc.appendChild(window.document.createElement('head'))
      doc.querySelectorAll('head')[0].appendChild(el);
      
      localStorage.setItem(src, script);
      
      OFFLINE.activate()
      
      assert(doc.querySelectorAll('script').length === 1);
      assert(doc.querySelectorAll('script')[0].innerHTML === script);
  
      after(function()
      {
        delete window.localStorage[src];
      });
    });

    it('should apply the cached Image in the DOM', function()
    {
      var src = '/test/integration_data/spacer.gif',
      img = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
      el = window.document.createElement('img');
      el.src = src;
      doc.appendChild(el);
      
      localStorage.setItem(src, img);
      
      OFFLINE.activate()
      
      assert(doc.querySelectorAll('img').length === 1);
      assert(doc.querySelectorAll('img')[0].src === img);
  
      after(function()
      {
        delete window.localStorage[src];
      });
    });
    
    xit('stylesheets should affect the document', function()
    {
      
    });
    
    
    xit('javascript should execute in the document', function()
    {
      
    });
    
    
    xit('images should appear in the document', function()
    {
      
    });
  });

})
