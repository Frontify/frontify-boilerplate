(function () {
var i18n = window.i18n = window.i18n || {},
    MessageFormat = {locale: {}};

MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

}());
