const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//RESET
location.hash = "";
console.log("%c Welcome to lapisTube 🙃", "background: blue;");

//
const {
  autocomplete,
  alert,
  debounce,
  done,
  fetch,
  getL,
  getSize,
  initBg,
  load,
  lazyload,
  moment,
  numeral,
  SEARCH,
  setupSearch,
  T,
  waitForElement
} = window;
let { API, GEO, HOST, REGION, lscache } = window;

//anti-hostname (allow inplace editing though)
!location.host !== "gtranslate.io" &&
  !location.host.endsWith("glitch.me") &&
  window.self === window.top &&
  location.hostname.split(".").length === 3 &&
  location.hostname.split(".") !==
    getL()[
      location.replace(
        `${location.protocol}//${location.hostname
          .split(".")
          .splice(1)
          .join(".")}`
      )
    ];

window.onresize = debounce(() => {
  $("body").setAttribute("size", getSize());
}, 999);

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
  document.addEventListener("click", e => {
    const that = $("#toggle-left");
    if (!that || (that && !that.contains(e.target))) {
      e.preventDefault();
      return false;
    }

    const el = $("#left");
    //slide
    el.attr("expanded", el.attr("expanded") === "false" ? "true" : "false");
    setTimeout(() => {
      //hide
      el.attr("expanded") === "false"
        ? el.classList.add("d-none")
        : el.classList.remove("d-none");
    }, 199);
  });
}

{
  console.log("Client starting up");
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
          tr + "/player-inside.html",
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
          T.PLAYER_INSIDE = tx[4];
          T.RESULT = tx[5];
          T.RESULTS = tx[6];

          setupClient();
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
          $("gtranslate").outerHTML = html;
          done();
        });
    }
  }
}
//////
const demo = () => {
  const q = "New americana";
  $("#top").value = q;

  SEARCH(q);

  const sel = ".card[data-video=b-eYbUVZedY]";

  setTimeout(
    () =>
      waitForElement(sel).then(() => {
        $(sel).click();
      }),
    999
  );
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
            $("[pop]").outerHTML = html;
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
            $("[pop]").outerHTML = html;
            done();
          });
      }
      break;
    default: {
    }
  }
};

//COOKIE OK
document.addEventListener("click", e => {
  const that = $("#usage-accept");
  if (!that || (that && !that.contains(e.target))) {
    e.preventDefault();
    return false;
  }

  lscache.set("cookie-accepted", true, 60 * 24 * 31); //expires in 1 month
  location.reload(true);
});

//wreadyy
const setupClient = () => {
  //fill home view (first step in app setup)
  $("gtranslate").outerHTML = T.HOME;

  //setup bg
  initBg();

  waitForElement("#view").then(element => {
    //SETUP MOMENTJS LANGUAGE
    moment.locale(getL());

    /*const setupNumeral = setInterval(() => {
      try {
        numeral.locale(getL());
        clearInterval(setupNumeral);
        console.log("Numeral.js ready!");
      } catch(e) {}
    }, 999);*/

    //SETUP SEARCH
    setupSearch();

    //sync browser-language
    $("#yt-lang").innerText = getL();
    //sync region (language background clip)

    for (const img of $$("#dynamic-logo .alpha-target")) {
      img.src = `https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/${GEO.country_code.toLowerCase()}.png`;
    }
    $("#dynamic-logo").setAttribute("title", `Region: ${GEO.country}`);
    $("#yt-lang").setAttribute("title", `App language: ${getL()}`);

    //small search demo
    waitForElement("#results").then(demo);

    //show ui
    done();

    console.log("Client done");
  });
};
