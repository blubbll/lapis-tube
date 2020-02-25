const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//RESET
location.hash = "";
console.log("%c Welcome to lapisTube 🙃", "background: blue;");

//
const {
  applyWords,
  addView,
  autocomplete,
  alert,
  debounce,
  CDN,
  done,
  fetch,
  getL,
  getSize,
  initBg,
  load,
  LOCAL,
  lazyload,
  moment,
  numeral,
  SEARCH,
  setActiveView,
  setupSearch,
  T,
  UI,
  waitForElement
} = window;
let { app_start, API, GEO, HOST, REGION, lscache } = window;

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
    //////////////////////////////////////////////////////////////
    if (!that || (that && !that.contains(e.target))) return false;
    //////////////////////////////////////////////////////////////

    const el = $("#left");
    //slide
    el.setAttribute(
      "expanded",
      el.getAttribute("expanded") === "false" ? "true" : "false"
    );
    setTimeout(() => {
      //hide
      el.getAttribute("expanded") === "false"
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

    app_start = () => {
      //template var inmemory
      const T = (window.T = {});

      Promise.all(
        [tr + "/ui-words.html", API + "/geoip", tr + "/templates.html"].map(
          url => fetch(url).then(resp => resp.text())
        )
      )
        .then(tx => {
          applyWords(tx[0]);

          (GEO = JSON.parse(tx[1])), (REGION = GEO.country_code.toLowerCase());
          console.debug(`Your Geo Information by Maxmind: `, GEO);
          console.debug(`Your browser language: `, getL());

          for (const template of new DOMParser()
            .parseFromString(tx[2], "text/html")
            .querySelectorAll("template")) {
            const _html = template.innerHTML;
            switch (template.getAttribute("name")) {
              case "app":
                T.WRAPPER = _html.replace(/{{cdn}}/gi, CDN);
                break;
              case "channel":
                T.CHANNEL = _html;
                break;
              case "player":
                T.PLAYER = _html;
                break;
              case "result-list":
                T.RESULTS = _html;
                break;
              case "result-item":
                T.RESULT = _html;
                break;
              case "start":
                T.START = _html;
                break;
            }
          }

          setupClient();
        })
        .catch(e => {
          console.warn(e);
          alert("WEBSITE FAILED LOADING. PRESS OK TO TRY AGAIN!");
          setTimeout(() => {
            location.reload(true), 4999;
          });
        });
    };

    if (lscache.get("cookie-accepted")) {
      app_start();
    } else {
      fetch(tr + "/cookie.html")
        .then(res => res.text())
        .then(html => {
          $("content").innerHTML = html.replace(/{{local}}/gi, LOCAL);
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
  const tr = HOST;
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
            $("[pop]").outerHTML = html.replace(/{{local}}/gi, LOCAL);
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
  //////////////////////////////////////////////////////////////
  if (!that || (that && !that.contains(e.target))) return false;
  //////////////////////////////////////////////////////////////

  lscache.set("cookie-accepted", true, 60 * 24 * 31); //expires in 1 month
  app_start();
  //location.reload(true);
});

//wreadyy
const setupClient = () => {
  //fill content (first step in app setup)
  $("content").innerHTML = T.WRAPPER;

  addView(T.START);

  setActiveView("start");

  //show content
  $("wrapper").style.display = "block";

  //setup bg
  initBg();

  waitForElement("views").then(element => {
    const _L = getL() || "en";
    //SETUP MOMENTJS LANGUAGE
    moment.locale(_L);

    //SETUP SEARCH
    setupSearch();

    //sync browser-language
    $("#yt-lang").innerText = _L;
    //sync region (language background clip)

    document.documentElement.style.setProperty(
      "--alpha-logo",
      `url(${CDN}/logo.png)`
    );

    for (const img of $$("#dynamic-logo .alpha-target")) {
      img.src = `https://raw.githubusercontent.com/legacy-icons/famfamfam-flags/master/dist/png/${GEO.country_code.toLowerCase()}.png`;
    }
    $("#dynamic-logo").setAttribute(
      "title",
      `${UI.labels.region}: ${GEO.country}`
    );
    $("#yt-lang").setAttribute("title", `App ${UI.labels.language}: ${_L}`);

    //show ui
    done();

    //small search demo
    demo();

    console.log("Client done");
  });
};
