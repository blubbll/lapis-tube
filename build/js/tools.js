const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const { AbortController, NProgress, LOADED } = window;
let {
  addView,
  abortFetches,
  CDN,
  createThumbs,
  debounce,
  LOCAL,
  fetch,
  Fullscreen,
  getBase64Image,
  getL,
  getSize,
  loadImage,
  setActiveView
} = window;

addView = HTML =>
  $("views") && $("views").insertAdjacentHTML("beforeend", HTML);

/* hide views but (id) */
setActiveView = id => {
  for (const view of $$("views>view"))
    view.id !== "id"
      ? [view.style.setProperty("display", "none", "important")]
      : [(view.style.display = "")];
};

const detectIEEdge = () => {
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
};

getBase64Image = img => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

//create  video thum srcset
createThumbs = thumbsData => {
  let srcSet = "";
  //build thumbnails
  for (const [i, thumb] of thumbsData.entries()) {
    if (i !== 0)
      //skip first
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
  for (const indicator of $$("size-indicators>size-indicator")) {
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

CDN = $("base").href;
LOCAL = location.origin;

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

const fetchControllers = [];

//abort, abort abort :D
abortFetches = () => {
  NProgress.done();
  for (const fetchId in fetchControllers) {
    const fetchItem = fetchControllers[fetchId];
    fetchItem.status === "active" && [(fetchItem.status = "aborted")];
  }
  console.debug("fetchcontrollers were aborted");
};

//FETCH WITH NPROGRESS- - - -
{
  NProgress.configure({ showSpinner: false });
  //backup fetch
  const ofetch = window.fetch;
  //override fetch
  fetch = (url, options) => {
    const fetchId = +new Date();
    fetchControllers[fetchId] = { status: "active", url, options };

    //start proc (if not silent)
    !(typeof options != "undefined" && !options.silent && !$("#nprogress")) &&
      LOADED &&
      NProgress.start();
    return ofetch(url, options).then(response => {
      //start proc (if not silent)
      !(typeof options != "undefined" && !options.silent && !$("#nprogress")) &&
        LOADED &&
        NProgress.done();
      if (fetchControllers[fetchId].status !== "aborted") {
        fetchControllers[fetchId].status = "done";
        return response;
      } else throw "aborted";
    });
  };
}

/*
tools
*/
Fullscreen = {
  enter: elem => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  },
  exit: () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }
};

HTMLElement.prototype.onEvent = (eventType, callBack, useCapture) => {
  this.addEventListener(eventType, callBack, useCapture);
  if (!this.myListeners) {
    this.myListeners = [];
  }
  this.myListeners.push({ eType: eventType, callBack: callBack });
  return this;
};

HTMLElement.prototype.removeListeners = () => {
  if (this.myListeners) {
    for (var i = 0; i < this.myListeners.length; i++) {
      this.removeEventListener(
        this.myListeners[i].eType,
        this.myListeners[i].callBack
      );
    }
    delete this.myListeners;
  }
};

{
  let that = {};
  // Opera 8.0+
  that.isOpera =
    (!!window.opr && !!window.opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  that.isFirefox = typeof window.InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  that.isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function(p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof window.safari !== "undefined" && window.safari.pushNotification)
    );

  // Internet Explorer 6-11
  that.isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  that.isEdge = !that.isIE && !!window.StyleMedia;

  // Chrome 1 - 71
  that.isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  //mobile Chrome
  that.isMobileChrome =
    !!window.chrome &&
    navigator.userAgent.includes("Mobi") &&
    typeof window.orientation !== "undefined";

  // Edge (based on chromium) detection
  that.isEdgeChromium =
    that.isChrome && navigator.userAgent.indexOf("Edg") != -1;

  // Blink engine detection
  that.isBlink = (that.isChrome || that.isOpera) && !!window.CSS;
  window.Browser = that;
}

const speed = {
  _i: 0,
  _arrTimes: [],
  doTest() {
    const that = this; //https://stackoverflow.com/a/19448729
    const r = String.fromCharCode(
      0x30a0 + Math.random() * (0x30ff - 0x30a0 + 1)
    ); //-
    let dummyImage = new Image();
    const tStart = new Date().getTime();
    if (this._i < that.config.times) {
      that._i++;
      console.debug(`Test ${this._i} of ${that.config.times}...`);
      dummyImage.src = `${that.config.image}?t=${tStart}`;
      dummyImage.onload = () => {
        const tEnd = new Date().getTime();
        const tTimeTook = tEnd - tStart;
        that._arrTimes[that._i] = tTimeTook;
        that.doTest();
        dummyImage = null;
      };
    } else {
      /** calculate average of array items then callback */
      const sum = this._arrTimes.reduce((a, b) => a + b);
      const avg = sum / this._arrTimes.length;
      this.setResult(avg);
    }
  },
  setResult(avg, speed) {
    const that = this;
    if (!speed) {
      if (avg >= 250) speed = "slow";
      if (avg >= 150 && avg <= 250) speed = "medium";
      if (avg <= 150) speed = "fast";
    }
    let txt;
    if (avg) txt = `Time: ${avg.toFixed(2)}ms - speed: ${speed}`;
    else txt = `speed: ${speed}`;
    this.speed = speed;
    console.debug("Test done:");
    console.debug({ avg, speed });
    console.debug("\n");
    that._i = 0;
    that._arrTimes = [];
    if (that._loop)
      setTimeout(() => {
        console.debug("Testing...");
        that.doTest();
      }, that.config.interval);
  },
  stopLoop() {
    this._loop = false;
    return "loop stopped";
  },
  startLoop() {
    console.debug("Testing...");
    this._loop = true;
    let speed;
    this._i = 0;
    /** output */
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (false && conn) {
      if (conn.saveData) speed = "slow";
      else if (navigator.connection.rtt)
        this.setResult(navigator.connection.rtt, speed);
      //fallback to image
    } else {
      this._i = 0;
      this.doTest(function(avg) {
        this.setResult(avg);
      });
    }
    return "loop started";
  }
};
speed.config = {
  image: "//blubbll.b-cdn.net/speed.jpg",
  times: 3, //times to check
  interval: 60000
};
speed.startLoop();
