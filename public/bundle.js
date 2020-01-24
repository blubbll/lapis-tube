//💜//i love you monad
var $ = window.$
, autocomplete = window.autocomplete
, alert = window.alert
, debounce = window.debounce
, done = window.done
, fetch = window.fetch
, getL = window.getL
, HOST = window.HOST
, REGION = window.REGION
, load = window.load
, T = window.T

;

//do actual search
var SEARCH = function(str ) {
  //show resultlist
  $("view").html(T.RESULTS);

  //show "loading"-spinner on dynamic fields
  $("param").html('<i class="fas fa-sync fa-spin"></i>');

  fetch((("" + HOST) + ("/api/" + REGION) + ("/search/" + str) + ""))
    .then(function(res ) {return res.text()})
    .then(function(raw ) {var S_ITER$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol.iterator||'@@iterator';var S_MARK$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol["__setObjectSetter__"];function GET_ITER$0(v){if(v){if(Array.isArray(v))return 0;var f;if(S_MARK$0)S_MARK$0(v);if(typeof v==='object'&&typeof (f=v[S_ITER$0])==='function'){if(S_MARK$0)S_MARK$0(void 0);return f.call(v);}if(S_MARK$0)S_MARK$0(void 0);if((v+'')==='[object Generator]')return v;}throw new Error(v+' is not iterable')};var $D$0;var $D$1;var $D$2;var $D$3;var $D$4;var $D$5;var $D$6;
      var results = JSON.parse(raw);
      var HTML = "";

    
      $D$0 = GET_ITER$0(results);$D$2 = $D$0 === 0;$D$1 = ($D$2 ? results.length : void 0);for (var result ;$D$2 ? ($D$0 < $D$1) : !($D$1 = $D$0["next"]())["done"];){result = ($D$2 ? results[$D$0++] : $D$1["value"]);
        
        //HTML += T.RESULT.replace("{{preview}}");
        var HTML$0 = T.RESULT.replace(
          "{{title}}",
          result.title
        );

        var srcSet = "";
        $D$6 = (result.videoThumbnails);$D$3 = GET_ITER$0($D$6);$D$5 = $D$3 === 0;$D$4 = ($D$5 ? $D$6.length : void 0);for (var thumb ;$D$5 ? ($D$3 < $D$4) : !($D$4 = $D$3["next"]())["done"];){thumb = ($D$5 ? $D$6[$D$3++] : $D$4["value"]);
          srcSet += (("" + (thumb.url)) + ("\t" + (thumb.width)) + "w,\n");
        };$D$3 = $D$4 = $D$5 = $D$6 = void 0;

        //fill previewset placeholder
        HTML$0 = HTML$0.replace(
          "{{preview}}",
          (("<img data=\"preview\" alt=\"preview\" srcset=\"" + (srcSet.slice(0, -1))) + "\" />")
        );

        console.log(HTML$0)
        
        //store querystring for re-querying more data when scrolling
        $("#results").attr("q", str);
        //update paging no for ^
        $("#result").attr(
          "page",
          $("#result").attr("page") ? $("#result").attr("page") + 1 : 1
        );

        //render results
        $("#results-inner").append(HTML$0);
        //console.log(result);
      };$D$0 = $D$1 = $D$2 = void 0;

      //$("#results").html(HTML);
    });
};

$("#results").on("scroll", function()  {
  var that = $("#results")[0];
  if (that.scrollTop + that.clientHeight >= that.scrollHeigh) {
    //SEARCH($("#results").attr("q"));
  }
});
//💜//i love you monad
var this$0 = this;var $ = window.$, NProgress = window.NProgress;
var debounce = window.debounce, fetch = window.fetch, getL = window.getL, loadImage = window.loadImage;

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

loadImage = function(url ) {
  return new Promise(function(r ) {
    var i = new Image();
    i.onload = function()  {return r(i)};
    i.src = url;
  });
};

if (detectIEEdge()) {
  var LLegacy =
    ((navigator.language || navigator.userLanguage).indexOf("-")
      ? (navigator.language || navigator.userLanguage).split("-")[0]
      : navigator.language || navigator.userLanguage
    ).toLowerCase() || "en";
  var host = void 0;
  if (location.host.indexOf("glitch.me") === -1) {
    host = location.protocol + "//" + LLegacy + "." + location.hostname;
  } else host = location.protocol + "//" + location.hostname;
  location.replace(host + "/outdated-browser.html");
}

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
  NProgress.configure({ showSpinner: false });
  //backup fetch
  var ofetch = window.fetch;
  //override fetch
  fetch = function(url, options)  {
    //start proc (if not silent)
    !(
      typeof options != "undefined" &&
      !options.silent &&
      !$("#nprogress")[0]
    ) && NProgress.start();
    return ofetch(url, options).then(function(response ) {
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
//💜//i love you monad
var Trianglify = window.Trianglify, debounce = window.debounce, fetch = window.fetch;

window.load = function() 
  {return setTimeout(function()  {
    document.querySelector("diamond").setAttribute("style", "");
    document.querySelector("#wrap") &&
      document.querySelector("#wrap").setAttribute("style", "display:none;");
  }, 999)};

window.done = function() 
  {return setTimeout(function()  {
    document.querySelector("diamond").setAttribute("style", "display:none;");
    document.querySelector("#wrap") &&
      document.querySelector("#wrap").setAttribute("style", "");
  }, 999)};

//BG START
var initBg = function()  {
  var rn = Math.floor(Math.random() * 150 + 60);
  var rs = Math.floor(Math.random() * 11 + 4);
  var prim = getComputedStyle(document.documentElement).getPropertyValue(
    "--color-accent-main"
  );

  var t = new Trianglify({
    x_gradient: [
      "#173b5e",
      "#3e87d0",
      "#1c4873",
      "#215487",
      "#26619c",
      "#2b6eb1",
      "#307bc5"
    ], //Trianglify.colorbrewer.Spectral[rs],
    noiseIntensity: 0,
    cellsize: rn
  });
  var pattern = t.generate(window.innerWidth, window.innerHeight);
  document.body.setAttribute("style", ("background-image: " + (pattern.dataUrl)));
};
window.onresize = debounce(initBg, 999);
//BG END
//💜//i love you monad
//RESET
location.hash = "";
console.log("%c Welcome to lapisTube 🙃", "background: blue;");
//
var $ = window.$, autocomplete = window.autocomplete, alert = window.alert, debounce = window.debounce, done = window.done, fetch = window.fetch, getL = window.getL, load = window.load, SEARCH = window.SEARCH, T = window.T;
var API = window.API, GEO = window.GEO, HOST = window.HOST, REGION = window.REGION, lscache = window.lscache;

//anti-hostname (allow inplace editing though)
!location.host !== "gtranslate.io" &&
  !location.host.endsWith("glitch.me") &&
  window.self === window.top &&
  location.hostname.split(".").length === 3 &&
  location.hostname.split(".")[0] !==
    getL()[
      location.replace(
        (("" + (location.protocol)) + ("//" + (location.hostname
          .split(".")
          .splice(1)
          .join("."))) + "")
      )
    ];

//host
HOST = (("" + (location.protocol)) + ("//" + (location.host.endsWith("glitch.me")
    ? //DEV ENV in ORIGINAL
      location.hostname
    : //GT EDITOR
    location.hostname === "gtranslate.io"
    ? location.href.split("/edit/")[1]
    : //TRANSLATED
      (("" + (getL())) + ("." + (location.hostname)) + ""))) + "");
//api
API = (("//" + (location.hostname)) + "/api");

//navi switch
{
  $(document).on("click", "#toggle-left", function()  {
    var el = $("#left");
    //slide
    el.attr("expanded", el.attr("expanded") === "false" ? "true" : "false");
    setTimeout(function()  {
      //hide
      el.attr("expanded") === "false"
        ? el.addClass("d-none")
        : el.removeClass("d-none");
    }, 199);
  });
}

//LOAD TEMPLATES
{
  //template remote path
  var tr = (("" + HOST) + "/html");
  if (lscache.get("cookie-accepted")) {
    //template var inmemory
    var T$0 = (window.T = {});

    Promise.all(
      [
        tr + "/app.html",
        API + "/geoip",
        tr + "/channel.html",
        tr + "/player.html",
        tr + "/result-item.html",
        tr + "/result-list.html"
      ].map(function(url ) {return fetch(url).then(function(resp ) {return resp.text()})})
    )
      .then(function(tx ) {
        T$0.HOME = tx[0];
        (GEO = JSON.parse(tx[1])), (REGION = GEO.country_code.toLowerCase());
        console.debug(("Your Geo Information by Maxmind: "), GEO);
        console.debug(("Your browser language: "), getL());
        T$0.CHANNEL = tx[2];
        T$0.PLAYER = tx[3];
        T$0.RESULT = tx[4];
        T$0.RESULTS = tx[5];
        setup();
        done();
        demo();
      })
      .catch(function(e ) {
        console.warn(e);
        alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!");
        setTimeout(function()  {
          location.reload(true), 4999;
        });
      });
  } else {
    fetch(tr + "/cookie.html")
      .then(function(res ) {return res.text()})
      .then(function(html ) {
        $("gtranslate")[0].outerHTML = html;
        done();
      });
  }
}

//////
var demo = function()  {
  var q = "Günther";
  $("#top")[0].value = q;
  SEARCH(q);
};

window.onhashchange = function()  {
  var tr = (("" + HOST) + "/html");
  switch (location.hash) {
    case "#cookie-what?":
    case "#what?":
      {
        fetch(tr + "/what.html")
          .then(function(res ) {return res.text()})
          .then(function(html ) {
            $("[pop]")[0].outerHTML = html;
            done();
          });
      }
      break;
    default: {
    }
  }
  switch (location.hash) {
    case "#cookie":
      {
        fetch(tr + "/cookie.html")
          .then(function(res ) {return res.text()})
          .then(function(html ) {
            $("[pop]")[0].outerHTML = html;
            done();
          });
      }
      break;
    default: {
    }
  }
};

//COOKIE OK
$(document).on("click", "#usage-accept", function()  {
  lscache.set("cookie-accepted", true, 60 * 24 * 31); //expires in 1 month
  location.reload(true);
});

//wreadyy
var setup = function()  {
  $("gtranslate")[0].outerHTML = T.HOME;

  //sync language
  $("#yt-lang").text(getL());
  //sync region (language background clip)
  //$(
  //  "#logo #flag"
  //)[0].src = `https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/${GEO.country_code.toLowerCase()}.png`;
  //https://stackoverflow.com/questions/41180735/can-html-and-css-only-create-an-overlay-which-ignores-transparent-area-on-an-ima

  $(
    "#logo .alpha-target"
  )[0].src = (("https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/" + (GEO.country_code.toLowerCase())) + ".png");
  $(".dynamic-logo")[0].setAttribute("title", ("Region: " + (GEO.country)));
  $("#yt-lang")[0].setAttribute("title", ("App language: " + (getL())));

  //LIVESEARCH
  {
    var input = document.getElementById("search");
    var emptyMsg = "❌" + "No results"; //make dynamic w gtranslate!
    var l = getL();
    var auto = autocomplete({
      input: input,
      showOnFocus: true, //focus = show suggestions
      minLength: 1,
      className: "live-search backdrop-blur", //class
      debounceWaitMs: 500, //wait
      fetch: function(input, update)  {
        //input
        var text = input.toLowerCase();

        text &&
          fetch((("" + HOST) + ("/api/" + REGION) + ("/complete/" + text) + ""))
            .then(function(res ) {return res.text()})
            .then(function(raw ) {
              var result = JSON.parse(raw);

              if (result.code === 200) {
                //construct output (with input at top for convenience)
                var suggOutput = [
                  input.toLowerCase !== result.data[0]
                    ? { label: input, value: input.toLowerCase() }
                    : ""
                ];

                //actual usable data
                var suggData = result.data.filter(function(v ) {return v.length}); //skip empty

                //loop and push
                suggData.forEach(function(sugg ) {
                  suggOutput.push({ label: sugg, value: sugg });
                });
                update(suggOutput);
              } else if (result.code === 404) {
                update([{ label: emptyMsg, value: emptyMsg }]);
              }
            });
      },
      onSelect: function(item ) {
        if (item.label !== emptyMsg) {
          //set input content
          input.value = item.label;
          //load results
          SEARCH(item.label);
        }
      }
    });
  }
};
