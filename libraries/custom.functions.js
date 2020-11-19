function insensitiveReplaceAll(original, find, replace) {
    var str = "",
      remainder = original,
      lowFind = find.toLowerCase(),
      idx;
  
    while ((idx = remainder.toLowerCase().indexOf(lowFind)) !== -1) {
      str += remainder.substr(0, idx) + replace;
  
      remainder = remainder.substr(idx + find.length);
    }
  
    return str + remainder;
  }
  
  function jsUcfirst(string) 
  {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }


  var waitUntilElementExists = (selector, callback) => 
{
        var el = document.querySelector(selector);
        console.log("Checking");
        if (el){
            console.log("Found");
            return callback(el);
        }
        
        setTimeout(() => waitUntilElementExists(selector, callback), 500);
}
        

var waitUntilElementExistsViaQuerySelectorAll = (selector, callback) => 
{
        var el = document.querySelectorAll(selector)[0];
        console.log("Checking");
        if (el){
            console.log("Found");
            return callback(el);
        }
        
        setTimeout(() => waitUntilElementExistsViaQuerySelectorAll(selector, callback), 500);
}
    