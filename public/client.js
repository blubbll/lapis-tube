//💜//i love you monad
//RESET
location.hash = "";

//
var $ = window.$, autocomplete = window.autocomplete, alert = window.alert, debounce = window.debounce, done = window.done, fetch = window.fetch, getL = window.getL, load = window.load, T = window.T;
var API = window.API, GEO = window.GEO, HOST = window.HOST, REGION = window.REGION, lscache = window.lscache;

//host
HOST = (("https://" + (location.host.endsWith("glitch.me") ? "" : getL() + ".")) + ("" + (location.hostname)) + "");
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

var SEARCH = function(str, ln)  {
  //show resultlist
  $("view").html(T.RESULTS);

  fetch((("" + HOST) + ("/api/" + REGION) + ("/search/" + str) + ""))
    .then(function(res ) {return res.text()})
    .then(function(raw ) {var S_ITER$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol.iterator||'@@iterator';var S_MARK$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol["__setObjectSetter__"];function GET_ITER$0(v){if(v){if(Array.isArray(v))return 0;var f;if(S_MARK$0)S_MARK$0(v);if(typeof v==='object'&&typeof (f=v[S_ITER$0])==='function'){if(S_MARK$0)S_MARK$0(void 0);return f.call(v);}if(S_MARK$0)S_MARK$0(void 0);if((v+'')==='[object Generator]')return v;}throw new Error(v+' is not iterable')};var $D$0;var $D$1;var $D$2;
      var results = JSON.parse(raw);
      var HTML;

      $D$0 = GET_ITER$0(results);$D$2 = $D$0 === 0;$D$1 = ($D$2 ? results.length : void 0);for (var result ;$D$2 ? ($D$0 < $D$1) : !($D$1 = $D$0["next"]())["done"];){result = ($D$2 ? results[$D$0++] : $D$1["value"]);
        HTML += T.RESULT.replace("{{preview}}");
      };$D$0 = $D$1 = $D$2 = void 0;

      $("#results").html(HTML);
    });
};

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
    ).then(function(tx ) {
      T$0.HOME = tx[0];
      (GEO = JSON.parse(tx[1])), (REGION = GEO.country_code.toLowerCase());
      T$0.CHANNEL = tx[2];
      T$0.PLAYER = tx[3];
      T$0.RESULT = tx[4];
      T$0.RESULTS = tx[5];
      setup();
      done();
      demo();
    }).catch(function(e) {
      alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!");
      setTimeout(location.reload(true), 4999);
    })
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
  //$("view").html(T.RESULTS);
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

  //sync country
  $("#yt-region").text(getL());

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
                var suggs = [];
                //loop and push
                result.data.forEach(function(sugg ) {
                  suggs.push({ label: sugg, value: sugg });
                  update(suggs);
                });
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
