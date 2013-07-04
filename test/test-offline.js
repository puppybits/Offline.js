
describe('Offline', function()
{
  describe('priming the cache', function()
  {
    var swizzleXHR, swizzleDOM, swizzleDOMSelect, doc, OFFLINE;
    
    beforeEach(function()
    {
      swizzleXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function()
      {
        this.open = function(){};
        this.onload = null;
        this.status = 200;
        this.responseText = 'done';
        this.response = "GIF89a����!�,D;";
        this.send = function(){
          this.onload.call(this, {})
        }
      }
      
      doc = new DocumentFragment();
      
      OFFLINE = new Offline({document:doc})
    });
    
    afterEach(function()
    {
      window.XMLHttpRequest = swizzleXHR;
      doc = null;
      delete doc;
      
      OFFLINE = null;
      delete OFFLINE;
    });
    
    it('should cache an HTML Import in the DOM', function()
    {
      var src = '/template.html',
      el = window.document.createElement('link');
      el.rel = 'import';
      el.href = src;
      doc.appendChild(el);
      
      OFFLINE.prime()
      
      assert(localStorage.getItem(src) === 'done');
    });
    
    it('should cache an CSS Stylesheet in the DOM', function()
    {
      var src = '/css/mystyles.css',
      el = window.document.createElement('link');
      el.rel = 'stylesheet';
      el.href = src;
      doc.appendChild(el);
      
      OFFLINE.prime()
      
      assert(localStorage.getItem(src) === 'done');
    });
    
    it('should cache a JavaScript script in the DOM', function()
    {
      var src = '/js/file.js',
      el = window.document.createElement('script');
      el.src = src;
      doc.appendChild(el);
      
      OFFLINE.prime()
      
      assert(localStorage.getItem(src) === 'done');
    });
  
    it('should cache an Image in the DOM', function()
    {
      var src = '/img/img.png',
      el = window.document.createElement('img');
      el.src = src;
      doc.appendChild(el);
      
      OFFLINE.prime()
      
      assert(localStorage.getItem(src) === 'done');
      
    });
    
  })
})
