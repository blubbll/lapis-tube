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
  T
} = window;

let { setupSearch, SEARCH } = window;

setupSearch = () => {
  //do actual search
  SEARCH = str => {
    const freshSearch =
      //show resultlist
      $("view").html(T.RESULTS);

    //show "loading"-spinner on dynamic fields
    $("param").html('<i class="fas fa-sync fa-spin"></i>');

    //fix flexbox height for bad browser (old chromes etc)

    fetch(`${HOST}/api/${REGION}/search/${str}`)
      .then(res => res.text())
      .then(raw => {
        let results = JSON.parse(raw);
        let HTML = "";

        for (const result of results) {
          //HTML += T.RESULT.replace("{{preview}}");
          let HTML = T.RESULT.replace("{{title}}", result.title);

          let srcSet = "";
          for (const thumb of result.videoThumbnails) {
            srcSet += `${thumb.url}\t${thumb.width}w,\n`;
          }

          //fill previewset placeholder
          HTML = HTML.replace(
            "{{preview}}",
            `<img data="preview" alt="preview" srcset="${srcSet.slice(
              0,
              -1
            )}" />`
          );

          //store querystring for re-querying more data when scrolling
          $("#results").attr("q", str);
          //update paging no for ^
          $("#result").attr(
            "page",
            $("#result").attr("page") ? $("#result").attr("page") + 1 : 1
          );

          //render results
          $("#results-inner").append(HTML);
        }

        //const wasnew = !!!$("#results").attr("q");
        if ($("#results").height() === 0) {
          console.warn("your browser doesn't like flexboxes too much :(");
          const loopo = setInterval(() => {
            if ($("#inner").height() !== 0) {
              console.log("fixed the results flexbox...");
              //absolute :/
              $("#results")[0].style.position = "absolute";
              //margin to filter
              $("#results")[0].style.marginTop = `${
                $("#filters")[0].clientHeight
              }px`;

              //set height >_< ouch
              $("#results")[0].style.height = `calc(100% - ${$("#filters")[0]
                .clientHeight +
                $("#top")[0].clientHeight +
                $("#footer")[0].clientHeight}px)`;
              clearInterval(loopo);
            }
          }, 99);
        }

        //$("#results").html(HTML);
      });
  };

  //LIVESEARCH
  {
    const input = document.getElementById("search-input");
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

  //Load more results
  $("#results").on("scroll", () => {
    const that = $("#results")[0];
    if (that.scrollTop + that.clientHeight >= that.scrollHeigh) {
      //SEARCH($("#results").attr("q"));
    }
  });

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
