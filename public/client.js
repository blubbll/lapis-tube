//💜//i love you monad
var debounce = window.debounce, fetch = window.fetch, autocomplete = window.autocomplete, done = window.done, T = window.T, $ = window.$;

//get page language
var getL = function()  {
  var L = navigator.language || navigator.userLanguage;
  L.includes("-") && [(L = L.split("-")[1])];
  return L.toLowerCase() || "en";
};

//navi switch
{
  $("#toggle-left").on("click", function()  {
    var el = $("#left");
    //slide
    el.attr(
      "expanded",
      el.attr("expanded") === "false" ? "true" : "false"
    );
    setTimeout(function() {
      //hide
      el.attr("expanded") === "false"
        ? el.addClass("d-none")
        : el.removeClass("d-none");
    }, 199);
  });
}

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
        fetch((("/api/complete/" + l) + (":" + text) + ""))
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
        input.value = item.label;
        SEARCH(item.label);

        $("view").html(T.RESULTS);
      }
    }
  });
}

var SEARCH = function(str, ln)  {
  fetch(("/api/search/" + str))
    .then(function(res ) {return res.text()})
    .then(function(raw ) {var S_ITER$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol.iterator||'@@iterator';var S_MARK$0 = typeof Symbol!=='undefined'&&Symbol&&Symbol["__setObjectSetter__"];function GET_ITER$0(v){if(v){if(Array.isArray(v))return 0;var f;if(S_MARK$0)S_MARK$0(v);if(typeof v==='object'&&typeof (f=v[S_ITER$0])==='function'){if(S_MARK$0)S_MARK$0(void 0);return f.call(v);}if(S_MARK$0)S_MARK$0(void 0);if((v+'')==='[object Generator]')return v;}throw new Error(v+' is not iterable')};var $D$0;var $D$1;var $D$2;
      var result = JSON.parse(raw);

      if (result.code === 200) {
        var suggs = [];
        //loop and push
        result.data.forEach(function(sugg ) {
          suggs.push({ label: sugg, value: sugg });
        });
        $D$0 = GET_ITER$0(suggs);$D$2 = $D$0 === 0;$D$1 = ($D$2 ? suggs.length : void 0);for (var item ;$D$2 ? ($D$0 < $D$1) : !($D$1 = $D$0["next"]())["done"];){item = ($D$2 ? suggs[$D$0++] : $D$1["value"]);
          console.log(item);
        };$D$0 = $D$1 = $D$2 = void 0;
      } else if (result.code === 404) {
        //update([{ label: emptyMsg, value: input }]);
      }
    });
};

//LOAD TEMPLATES
{
  //template remote path
  var tr = "/templates";
  //template var inmemory
  var T$0 = (window.T = {});

  Promise.all(
    [
      tr + "/channel.html",
      tr + "/player.html",
      tr + "/result-item.html",
      tr + "/result-list.html"
    ].map(function(url ) {return fetch(url).then(function(resp ) {return resp.text()})})
  ).then(function(tx ) {
    T$0.CHANNEL = tx[0];
    T$0.PLAYER = tx[1];
    T$0.RESULT = tx[2];
    T$0.RESULTS = tx[3];
    done();

    demo();
  });
}

//////
var demo = function()  {
  //$("view").html(T.RESULTS);
};
