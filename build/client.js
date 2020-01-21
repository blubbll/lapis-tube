const { debounce, fetch, autocomplete, done, T, $ } = window;
let { HOST, REGION, API } = window;

//get page language
const getL = () => {
  let L = navigator.language || navigator.userLanguage;
  //language has seperator
  L.includes("-") && [(L = L.split("-")[0])];
  return L.toLowerCase() || "en";
};

//host
HOST = `https://${location.host.endsWith("glitch.me") ? "" : getL() + "."}${
  location.hostname
}`;
//api
API = `${HOST}/api`;

//navi switch
{
  $(document).on("click", "#toggle-left", () => {
    const el = $("#left");
    //slide
    el.attr("expanded", el.attr("expanded") === "false" ? "true" : "false");
    setTimeout(() => {
      //hide
      el.attr("expanded") === "false"
        ? el.addClass("d-none")
        : el.removeClass("d-none");
    }, 199);
  });
}

const SEARCH = (str, ln) => {
  fetch(`${HOST}/api/${REGION.country_code}/search/${str}`)
    .then(res => res.text())
    .then(raw => {
      const result = JSON.parse(raw);

      if (result.code === 200) {
        const suggs = [];
        //loop and push
        result.data.forEach(sugg => {
          suggs.push({ label: sugg, value: sugg });
        });
        for (const item of suggs) {
          console.log(item);
        }
      } else if (result.code === 404) {
        //update([{ label: emptyMsg, value: input }]);
      }
    });
};

//LOAD TEMPLATES
{
  //template remote path
  const tr = `${HOST}/templates`;
  //template var inmemory
  const T = (window.T = {});

  Promise.all(
    [
      HOST + "/app.html",
      API + "/geoip",
      tr + "/channel.html",
      tr + "/player.html",
      tr + "/result-item.html",
      tr + "/result-list.html"
    ].map(url => fetch(url).then(resp => resp.text()))
  ).then(tx => {
    $("gtranslate")[0].outerHTML = tx[0];
    REGION = tx[1];
    T.CHANNEL = tx[2];
    T.PLAYER = tx[3];
    T.RESULT = tx[4];
    T.RESULTS = tx[5];
    setup();
    done();
    demo();
  });
}

//////
const demo = () => {
  //$("view").html(T.RESULTS);
};

//wreadyy
const setup = () => {
  //sync country
  $("#yt-region").text(getL());

  //LIVESEARCH
  {
    const input = document.getElementById("search");
    const emptyMsg = "❌" + "No results"; //make dynamic w gtranslate!
    const l = getL();
    const auto = autocomplete({
      input: input,
      showOnFocus: true, //focus = show suggestions
      minLength: 1,
      className: "live-search backdrop-blur", //class
      debounceWaitMs: 500, //wait
      fetch: (input, update) => {
        //input
        const text = input.toLowerCase();

        text &&
          fetch(`${HOST}/api/${REGION.country_code}/complete/${text}`)
            .then(res => res.text())
            .then(raw => {
              const result = JSON.parse(raw);

              if (result.code === 200) {
                const suggs = [];
                //loop and push
                result.data.forEach(sugg => {
                  suggs.push({ label: sugg, value: sugg });
                  update(suggs);
                });
              } else if (result.code === 404) {
                update([{ label: emptyMsg, value: emptyMsg }]);
              }
            });
      },
      onSelect: item => {
        if (item.label !== emptyMsg) {
          //set input content
          input.value = item.label;
          //show resultlist
          $("view").html(T.RESULTS);
          //load results
          SEARCH(item.label);
        }
      }
    });
  }
};
