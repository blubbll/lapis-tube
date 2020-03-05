//©Blu2020
{
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //RESET
  location.hash = "";
  //welcome to the console
  {
    const acc = getComputedStyle(document.documentElement).getPropertyValue(
        "--color-accent-main"
      ),
      args = [
        `\n%c  %c %c➤ %c𝑙𝑎𝑝𝑖𝑠Tube  %c %c  ${location.href}  %c  %c ♥ %c  \n`,
        `background: ${acc}; padding:5px 0;`,
        `background: black; padding:5px 0;`,
        `color: blue; background: black; padding:5px 0;`,
        `color: white; background: black; padding:5px 0;`,
        `background: ${acc}; padding:5px 0;`,
        `background: black; padding:5px 0;`,
        `background: ${acc}; padding:5px 0;`,
        "color: purple; background: #fff; padding:5px 0;",
        `background: ${acc}; padding:5px 0;`
      ];

    window.console.log(...args);
  }

  //get generic
  const {
    lscache,
    waitForElement,
    getSize,
    getL,
    fetch,
    debounce,
    alert,
    done,
    initBg,
    autocomplete,
    applyWords,
    moment,
    numeral,
    load,
    lazyload,
    setupSearch
  } = window;
  //set generic
  let { app_start, route } = window;
  //-//
  const _L = new Proxy(
    {},
    {
      get: (obj, prop, val) => {
        {
          const _app = "L";

          !window[_app] && [(window[_app] = {})];
          !window[_app][prop] && [(window[_app][prop] = {})];
          for (const key of Object.keys(window.L)) {
            window[_app][key] = window[key];
          }
        }
        return window[prop];
      },
      set: function(obj, prop, val) {
        const _app = "L";
        window[prop] = val;
        !window[_app] && [(window[_app] = {})],
          !window[_app][prop] && [(window[_app][prop] = {})];
        window[_app][prop] = val;
      }
    }
  );
  //get Elements of L
  const { URL, Player, setActiveView, SEARCH, T, UI } = _L;
  //set Elements of L
  let { GEO, REGION } = _L;

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
            .join(".")}` +
            `${
              location.hostname.split(".")[0]
                ? "?hl=" + location.hostname.split(".")[0]
                : ""
            }`
        )
      ];

  //update size attribute
  window.onresize = debounce(() => {
    $("body").setAttribute("size", getSize());
  }, 999);

  //navi switch
  {
    document.addEventListener("click", e => {
      const that = $("#toggle-left");

      //click anywhere to close
      if (!$("#left[expanded=true]"))
        if (!that || (that && !that.contains(e.target)))
          //////////////////////////////////////////////////////////////
          return false;
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

  //go to home
  {
    document.addEventListener("click", e => {
      const that = $("#dynamic-logo");
      //////////////////////////////////////////////////////////////
      if (!that || (that && !that.contains(e.target))) return false;
      //////////////////////////////////////////////////////////////

      setActiveView("start");
    });
  }

  {
    console.debug("Client starting up");
    //LOAD TEMPLATES
    {
      //template remote path
      const tr = `${URL.HOST}/html`;

      app_start = () => {
        //template var inmemory
        const T = (window.T = {});

        //received files by "tr" are translated!
        Promise.all(
          [
            tr + "/ui-words.html",
            URL.API + "/geoip",
            tr + "/templates.html"
          ].map(url => fetch(url).then(resp => resp.text()))
        )
          .then(tx => {
            applyWords(tx[0]);

            GEO = JSON.parse(tx[1]);
            REGION = GEO.country_code.toLowerCase();
            console.debug(`Your Geo Information by Maxmind: `, GEO);
            console.debug(`Your browser language: `, getL());

            //loop received html and fill template vars
            for (const template of new DOMParser()
              .parseFromString(tx[2], "text/html")
              .querySelectorAll("template")) {
              const _html = template.innerHTML;
              switch (template.getAttribute("name")) {
                case "app":
                  T.WRAPPER = _html.replace(/{{cdn}}/gi, URL.CDN);
                  break;
                case "404":
                  T[404] = _html;
                  break;
                case "error":
                  T.ERROR = _html;
                  break;
                case "channel":
                  T.CHANNEL = _html;
                  break;
                case "player":
                  T.PLAYER = _html;
                  break;
                case "history-list":
                  T.HISTORY = _html;
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
              //location.reload(true), 4999;
            });
          });
      };

      lscache.setBucket("tracking");
      if (lscache.get("cookie-accepted")) {
        app_start();
      } else {
        fetch(tr + "/cookie.html")
          .then(res => res.text())
          .then(html => {
            $("content").innerHTML = html.replace(/{{local}}/gi, URL.LOCAL);
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
    const tr = URL.HOST;
    switch (location.hash) {
      case "#cookie-what?":
      case "#what?":
        {
          fetch(tr + "/cookie-what.html")
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
              $("[pop]").outerHTML = html.replace(/{{local}}/gi, URL.LOCAL);
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

    lscache.setBucket("tracking");
    lscache.set("cookie-accepted", true, 60 * 24 * 31); //expires in 1 month
    history.pushState(null, null, URL.LOCAL);
    app_start();
    //location.reload(true);
  });

  //wreadyy
  const setupClient = () => {
    //fill content (first step in app setup)
    $("content").innerHTML = T.WRAPPER;

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
        `url(${URL.CDN}/logo.png)`
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

      console.debug("Client done");

      //routing
      setTimeout(route($("meta[name=from]").getAttribute("value")));
    });
  };
}
