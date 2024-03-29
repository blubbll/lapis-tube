//©Blu2020
{
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //get generic
  const {
    Browser,
    lscache,
    waitForElement,
    getSize,
    getL,
    fetch,
    debounce,
    alert,
    done,
    initBg,
    createThumbs,
    autocomplete,
    applyWords,
    moment,
    numeral,
    load,
    lazyload
  } = window;
  //set generic
  let { app_start, route, showError } = window;
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
  const { GEO, URL, REGION, Player, setActiveView, T, UI } = _L;
  //set Elements of L
  let { SEARCH, setupSearch } = _L;

  setupSearch = () => {
    //$("#view-inner").innerHTML = T.RESULTS;
    if ($("#results")) {
      console.error("search has been setup already!");

      return false;
    }
    //do actual search
    SEARCH = str => {
      setActiveView("results");

      let results = $("#results");

      if (results && results.getAttribute("search-active") === "true") return;

      let page = results ? +results.getAttribute("page") : 0;

      $("views").classList.add("wait");

      //no search, no paging
      if (page === 0) {
        //construct result base
        setActiveView("results");
        results = $("#results");
        results.setAttribute("state", "search-fresh");
        //we're on page 1
        page = 1;
      } else {
        //same querystring, new page
        if (results.getAttribute("q") === str) {
          results.setAttribute("state", "search-continue");
          page = page + 1;

          //update page title
          document.title = `${UI.titles.moreresults} "${str}"`;
        } else {
          //new search
          results.setAttribute("state", "search-new");
          page = 1;

          history.pushState(null, null, `${URL.LOCAL}/search/${str}`);

          //update page title
          document.title = `${UI.titles.results} "${str}"`;

          //scroll to top (prevents loading of new pages)
          $("#results").scrollTop = 0;
          //clear search results
          $("#results-inner").innerHTML = "";
        }
      }

      //store querystring for later
      results.setAttribute("q", str);

      //search active
      results.setAttribute("search-active", true);

      //sync page
      results.setAttribute("page", page);

      //debug msgs
      switch (results.getAttribute("state")) {
        case "search-fresh":
          {
            console.debug(`Loading fresh results for query:`, {
              q: str,
              "": "..."
            });
          }
          break;
        case "search-new":
          {
            console.debug(`Loading results for new query:`, {
              q: str,
              "": "..."
            });
          }
          break;
        case "search-continue":
          {
            console.debug(`Loading continued results for query:`, {
              q: str,
              page: page,
              "": "..."
            });
          }
          break;
      }

      //Load more results (prevent rebind on infiniscroll)
      if (!results.scrollSetupDone) {
        results.addEventListener("scroll", e => {
          const that = results;

          if (
            results.getAttribute("search-active") !== "true" &&
            that.scrollTop + that.clientHeight >=
              that.scrollHeight - that.scrollHeight / 10
          ) {
            //search more
            SEARCH(that.getAttribute("q"));
          }
        });
        //fancy scrolling
        Browser.isChrome &&
          results.addEventListener("scroll", e => {
            const that = results;

            {
              clearTimeout(results.scrollTimer);
              $("#results-inner").classList.add("scrolling");
              results.scrollTimer = setTimeout(() => {
                $("#results-inner").classList.remove("scrolling");
              }, 0);
            }
          });
        results.scrollSetupDone = true;
      }

      fetch(`${URL.API}/${REGION}/search/${str}/${page}`)
        .then(res => res.text())
        .then(raw => {
          let _results = JSON.parse(raw);
          let HTML = "";

          //build results
          for (const result of _results) {
            let srcSet = createThumbs(result.videoThumbnails);

            const getDurationDetailed = () => {
              let detailed = moment
                .utc(
                  moment
                    .duration(result.lengthSeconds, "seconds")
                    .asMilliseconds()
                )
                .format("HH:mm:ss");
              //slice empty hours
              detailed.startsWith("00:") && [(detailed = detailed.slice(3))];
              //slice empty minutes
              detailed.startsWith("0") && [(detailed = detailed.slice(1))];

              return detailed;
            };
            //CONSTRUCT HTML
            let HTML = T.RESULT
              //FILL title
              .replace("{{title}}", result.title)
              //fill previewset placeholder
              .replace("{{preview-set}}", srcSet.slice(0, -1))
              //FILL DESCRIPTION
              .replace("{{preview-desc}}", result.description)
              //FILL DURATION
              .replace(
                "{{duration}}",
                moment.duration(result.lengthSeconds * 1000).humanize()
              ) //DURATION DETAILED
              .replace("{{duration-detailed}}", getDurationDetailed())
              //FILL video id
              .replace("{{video}}", result.videoId)
              //FILL AUTHOR
              .replace("{{author}}", result.author)
              //FILL AUTHOR id
              .replace("{{authorid}}", result.authorId)
              //FILL VIEWS (formatted)
              .replace(
                "{{views}}",
                numeral(result.viewCount || 0).format(`0.a`)
              );

            //render result
            $("#results-inner").insertAdjacentHTML("beforeend", HTML);

            //setup lazyloading
            lazyload($$("figure>img"));
          }
          document
            .getElementById("results")
            .setAttribute("search-active", false);

          setTimeout(() => $("views").classList.remove("wait"), 749);
        })
        .catch(e => {
          showError();
        });
    };

    //LIVESEARCH
    {
      const input = document.getElementById("search-input");
      const l = getL();
      const auto = autocomplete({
        input: input,
        showOnFocus: true, //focus = show suggestions
        minLength: 1,
        className: "live-search backdrop-blur", //class
        debounceWaitMs: 299, //wait
        fetch: (input, update) => {
          //input
          const text = input.toLowerCase();

          text &&
            fetch(`${URL.API}/${REGION}/complete/${text}`)
              .then(res => res.text())
              .then(raw => {
                const result = JSON.parse(raw);

                if (result.code === 200) {
                  //construct output (with input at top for convenience)
                  let suggData = [],
                    suggOutput = [];

                  //skip empty
                  suggData = [input, ...result.data.filter(v => v.length)];

                  //skip dupes
                  suggData = Object.values(
                    Object.fromEntries(suggData.map(s => [s.toLowerCase(), s]))
                  );

                  //loop and push
                  suggData.forEach(sugg => {
                    suggOutput.push({ label: sugg, value: sugg });
                  });

                  update(suggOutput);
                } else if (result.code === 404) {
                  update([{ label: input, value: input.toLowerCase() }]);
                }
              })
              .catch(e => {
                showError();
              });
        },
        onSelect: item => {
          $("#search-input").value = item.label;
          SEARCH(item.label);
        }
      });
    }

    //set Input on mobile focus to fullwidth
    {
      $("#search-input").addEventListener("focus", () => {
        if (getSize() === "xs") {
          //remove margin to logo (we dont need it here)
          $("#search").style.setProperty("margin-left", 0, "important");
          //hide dynamic logo
          $("#dynamic-logo").style.setProperty("display", "none", "important");
          //make search wider
          $("#search").classList.add("col-11");
          //hide submit btn and then...
          $("#search-btn").classList.add("d-none");
          //...fixaroo round (cuz missing submit btn)
          $("#search-input").classList.add("rounded");
        }
      });

      $("#search-input").addEventListener("blur", () => {
        if (getSize() === "xs") {
          //reset margin left override
          $("#search").style.setProperty("margin-left", "");
          //show dynamic logo again
          $("#dynamic-logo").style.setProperty("display", "");
          //reset searchelement to "normal" sizes
          $("#search").classList.remove("col-11");
          //show search btn again and...
          $("#search-btn").classList.remove("d-none");
          //... make it round again :3
          $("#search-input").classList.remove("rounded");
        }
      });
    }
  };
}
