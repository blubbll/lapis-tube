const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const { NProgress } = window;
let { createThumbs, debounce, fetch, getL, getSize, loadImage } = window;

function detectIEEdge() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }

  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }

  const edge = ua.indexOf("Edge/");
  if (edge > 0) {
    // Edge => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }

  // other browser
  return false;
}

//create  video thum srcset
createThumbs = thumbsData => {
  let srcSet = "";
  //build thumbnails
  for (const thumb of thumbsData) {
    var i = Object.keys(thumbsData).indexOf(thumb);
    if (i !== 0)
      //skip first (invidio.us)
      srcSet += `${thumb.url}\t${thumb.width}w${i !== thumbsData ? ",\n" : ""}`;
  }
  return srcSet;
};

//(promise) wait until element appears on dom
const waitForElement = selector => {
  return new Promise((resolve, reject) => {
    var element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        var nodes = Array.from(mutation.addedNodes);
        for (var node of nodes) {
          if (node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
};

getSize = () => {
  for (const indicator of $("size-indicators").find("size-indicator")) {
    //get current "visible" indicator based on bootstrap's css rules
    if (getComputedStyle(indicator).display === "flex") {
      return indicator.classList[0].split("-")[1].replace("flex", "xs");
    }
  }
};

loadImage = url => {
  return new Promise(r => {
    let i = new Image();
    i.onload = () => r(i);
    i.src = url;
  });
};

if (detectIEEdge()) {
  const LLegacy =
    ((navigator.language || navigator.userLanguage).indexOf("-")
      ? (navigator.language || navigator.userLanguage).split("-")[0]
      : navigator.language || navigator.userLanguage
    ).toLowerCase() || "en";
  let host;
  if (location.host.indexOf("glitch.me") === -1) {
    host = location.protocol + "//" + LLegacy + "." + location.hostname;
  } else host = location.protocol + "//" + location.hostname;
  location.replace(host + "/outdated-browser.html");
}

//DEBOUNCE
debounce = (func, wait, immediate) => {
  let timeout;

  return () => {
    const context = this;
    const args = context.arguments;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

//get page language
getL = () => {
  let L = navigator.language || navigator.userLanguage;
  //language has seperator
  L.includes("-") && [(L = L.split("-")[0])];
  return L.toLowerCase() || "en";
};

//FETCH WITH NPROGRESS- - - -
{
  NProgress.configure({ showSpinner: false });
  //backup fetch
  const ofetch = window.fetch;
  //override fetch
  fetch = (url, options) => {
    //start proc (if not silent)
    !(
      typeof options != "undefined" &&
      !options.silent &&
      !$("#nprogress")[0]
    ) && NProgress.start();
    return ofetch(url, options).then(response => {
      //start proc (if not silent)
      !(
        typeof options != "undefined" &&
        !options.silent &&
        !$("#nprogress")[0]
      ) && NProgress.done();
      return response;
    });
  };
}
