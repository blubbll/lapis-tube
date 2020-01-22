//💜//i love you monad
var this$0 = this;var NProgress = window.NProgress;
var debounce = window.debounce, getL = window.getL, fetch = window.fetch;

function detectIEEdge() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }

  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }

  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    // Edge => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }

  // other browser
  return false;
}

detectIEEdge() && [(location.href = "/outdated-browser.html")];

//DEBOUNCE
debounce = function(func, wait, immediate)  {
  var timeout;

  return function()  {
    var context = this$0;
    var args = context.arguments;

    var later = function()  {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

//get page language
getL = function()  {
  var L = navigator.language || navigator.userLanguage;
  //language has seperator
  L.includes("-") && [(L = L.split("-")[0])];
  return L.toLowerCase() || "en";
};

//FETCH WITH NPROGRESS- - - -
{
  //backup fetch
  var ofetch = window.fetch;
  //override fetch
  fetch = function(url, options)  {
    //start proc (if not silent)
    !(typeof options != "undefined" && !options.silent) &&
      NProgress.start({ showSpinner: false });
    return ofetch(url, options).then(function(response ) {
      //start proc (if not silent)
      !(typeof options != "undefined" && !options.silent) && NProgress.done();
      return response;
    });
  };
}
