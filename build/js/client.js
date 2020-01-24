//RESET
location.hash = "";
console.log("%c Welcome to lapisTube 🙃", "background: blue;");
//
const { $, autocomplete, alert, debounce, done, fetch, getL, load, SEARCH, T } = window;
let { API, GEO, HOST, REGION, lscache } = window;

//anti-hostname (allow inplace editing though)
!location.host !== "gtranslate.io" &&
  !location.host.endsWith("glitch.me") &&
  window.self === window.top &&
  location.hostname.split(".").length === 3 &&
  location.hostname.split(".")[0] !==
    getL()[
      location.replace(
        `${location.protocol}//${location.hostname
          .split(".")
          .splice(1)
          .join(".")}`
      )
    ];

//host
HOST = `${location.protocol}//${
  location.host.endsWith("glitch.me")
    ? //DEV ENV in ORIGINAL
      location.hostname
    : //GT EDITOR
    location.hostname === "gtranslate.io"
    ? location.href.split("/edit/")[1]
    : //TRANSLATED
      `${getL()}.${location.hostname}`
}`;
//api
API = `//${location.hostname}/api`;

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

//LOAD TEMPLATES
{
  //template remote path
  const tr = `${HOST}/html`;
  if (lscache.get("cookie-accepted")) {
    //template var inmemory
    const T = (window.T = {});

    Promise.all(
      [
        tr + "/app.html",
        API + "/geoip",
        tr + "/channel.html",
        tr + "/player.html",
        tr + "/result-item.html",
        tr + "/result-list.html"
      ].map(url => fetch(url).then(resp => resp.text()))
    )
      .then(tx => {
        T.HOME = tx[0];
        (GEO = JSON.parse(tx[1])), (REGION = GEO.country_code.toLowerCase());
        console.debug(`Your Geo Information by Maxmind: `, GEO);
        console.debug(`Your browser language: `, getL());
        T.CHANNEL = tx[2];
        T.PLAYER = tx[3];
        T.RESULT = tx[4];
        T.RESULTS = tx[5];
        setup();
        done();
        demo();
      })
      .catch(e => {
        console.warn(e);
        alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!");
        setTimeout(() => {
          location.reload(true), 4999;
        });
      });
  } else {
    fetch(tr + "/cookie.html")
      .then(res => res.text())
      .then(html => {
        $("gtranslate")[0].outerHTML = html;
        done();
      });
  }
}

//////
const demo = () => {
  const q = "Günther";
  $("#top")[0].value = q;
  SEARCH(q);
};

window.onhashchange = () => {
  const tr = `${HOST}/html`;
  switch (location.hash) {
    case "#cookie-what?":
    case "#what?":
      {
        fetch(tr + "/what.html")
          .then(res => res.text())
          .then(html => {
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
          .then(res => res.text())
          .then(html => {
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
$(document).on("click", "#usage-accept", () => {
  lscache.set("cookie-accepted", true, 60 * 24 * 31); //expires in 1 month
  location.reload(true);
});

//wreadyy
const setup = () => {
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
  )[0].src = `https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/${GEO.country_code.toLowerCase()}.png`;
  $(".dynamic-logo")[0].setAttribute("title", `Region: ${GEO.country}`);
  $("#yt-lang")[0].setAttribute("title", `App language: ${getL()}`);

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
          fetch(`${HOST}/api/${REGION}/complete/${text}`)
            .then(res => res.text())
            .then(raw => {
              const result = JSON.parse(raw);

              if (result.code === 200) {
                //construct output (with input at top for convenience)
                let suggOutput = [
                  input.toLowerCase !== result.data[0]
                    ? { label: input, value: input.toLowerCase() }
                    : ""
                ];

                //actual usable data
                let suggData = result.data.filter(v => v.length); //skip empty

                //loop and push
                suggData.forEach(sugg => {
                  suggOutput.push({ label: sugg, value: sugg });
                });
                update(suggOutput);
              } else if (result.code === 404) {
                update([{ label: emptyMsg, value: emptyMsg }]);
              }
            });
      },
      onSelect: item => {
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