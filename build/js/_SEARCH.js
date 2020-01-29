const {
  $,
  autocomplete,
  alert,
  debounce,
  done,
  fetch,
  getL,
  getSize,
  HOST,
  REGION,
  load,
  lazyload,
  moment,
  numeral,
  T,
  waitForElement
} = window;

let { setupSearch, SEARCH } = window;

setupSearch = () => {
  $("#view-inner").html(T.RESULTS);

  //do actual search
  SEARCH = str => {
    let results = document.getElementById("results");
    const page = results.getAttribute("page")
      ? +results.getAttribute("page")
      : 1;

    //reset resultlist if on page 1
    page === 1 && $("#view-inner").html(T.RESULTS);

    results = document.getElementById("results");

    //sync page
    results.setAttribute("page", page);

    //Load more results
    $(results).on("scroll", e => {
      const that = results;
      /*console.log(that.scrollTop + that.clientHeight);
      console.log(that.scrollHeight);
      console.log(that.clientHeight / 10);*/

      if (
        that.scrollTop + that.clientHeight >=
        that.scrollHeight + that.scrollTop / 10
      ) {
        const q = that.getAttribute("q");
        const newpage = page++;
        console.log(`Loading page ${newpage} for query ${q}...`);

        console.log(page);

        results.setAttribute("page", newpage);

        SEARCH(q);
      }
    });

    //show "loading"-spinner on dynamic fields
    $("param").html('<i class="fas fa-sync fa-spin"></i>');

    //store querystring for re-querying more data when scrolling
    results.setAttribute("q", str);

    console.log(results.getAttribute("q"));

    fetch(`${HOST}/api/${REGION}/search/${str}?page=${page}`)
      .then(res => res.text())
      .then(raw => {
        let results = JSON.parse(raw);
        let HTML = "";

        //build results
        for (const result of results) {
          let srcSet = "";
          //build thumbnails
          for (const thumb of result.videoThumbnails) {
            var i = Object.keys(result.videoThumbnails).indexOf(thumb);
            if (i !== 0)
              //skip first (invidio.us)
              srcSet += `${thumb.url}\t${thumb.width}w,\n`;
          }

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
            .replace("{{views}}", numeral(result.viewCount || 0).format(`0.a`));

          //render results
          $("#results-inner").append(HTML);

          //setup lazyloading
          lazyload(document.querySelectorAll("figure>img"));
        }
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
          fetch(`${HOST}/api/${REGION}/complete/${text}`)
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
            });
      },
      onSelect: item => {
        SEARCH(item.label);
      }
    });
  }

  //set Input on mobile to fullwidth
  {
    $("#search-input").on("focus", () => {
      if (getSize() === "xs") {
        //remove margin to logo (we dont need it here)
        $("#search")[0].style.setProperty("margin-left", 0, "important");
        //hide dynamic logo
        $("#dynamic-logo")[0].style.setProperty("display", "none", "important");
        //make search wider
        $("#search").addClass("col-11");
        //hide submit btn and then...
        $("#search-btn").addClass("d-none");
        //...fixaroo round (cuz missing submit btn)
        $("#search-input").addClass("rounded");
      }
    });

    $("#search-input").on("blur", () => {
      if (getSize() === "xs") {
        //reset margin left override
        $("#search")[0].style.setProperty("margin-left", "");
        //show dynamic logo again
        $("#dynamic-logo")[0].style.setProperty("display", "");
        //reset searchelement to "normal" sizes
        $("#search").removeClass("col-11");
        //show search btn again and...
        $("#search-btn").removeClass("d-none");
        //... make it round again :3
        $("#search-input").removeClass("rounded");
      }
    });
  }
};
