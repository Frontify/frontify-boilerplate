(function () {
var i18n = window.i18n = window.i18n || {},
    MessageFormat = {locale: {}};

MessageFormat.locale.de = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

i18n["\x0a\x09\x3ch1\x3e{title}\x3c/h1\x3e\x0a\x09\x3cp\x3eWith whitespace.\x3c/p\x3e\x0a"] = function(d){
var r = "";
r += "<h1>";
d = d || {};
r += d["title"];
r += "</h1><p>With whitespace.</p>";
return r;
};

i18n["Hello {name}!"] = function(d){
var r = "";
r += "Hello ";
d = d || {};
r += d["name"];
r += "!";
return r;
};

}());
