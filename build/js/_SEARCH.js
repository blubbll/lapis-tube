const {
  $,
  autocomplete,
  alert,
  debounce,
  done,
  fetch,
  getL,
  HOST,
  REGION,
  load,
  T
} = window;

//do actual search
const SEARCH = str => {
  //show resultlist
  $("view").html(T.RESULTS);

  //show "loading"-spinner on dynamic fields
  $("param").html('<i class="fas fa-sync fa-spin"></i>');

  fetch(`${HOST}/api/${REGION}/search/${str}`)
    .then(res => res.text())
    .then(raw => {
      let results = JSON.parse(raw);
      let HTML = "";

      //$("param[results]")[0].outerHTML = results.length; delete me

      // let i=0;
      for (const result of results) {
        //HTML += T.RESULT.replace("{{preview}}");
        let HTML = T.RESULT.replace("{{preview}}").replace("{{title}}", result.title);
        $("#results").attr("q", str);
        $("#result").attr(
          "page",
          $("#result").attr("page") ? $("#result").attr("page") + 1 : 1
        );
        $("#results-inner").append(HTML);
        // i++
        // console.log(i, result);
      }

      //$("#results").html(HTML);
    });
};

$("#results").on("scroll", () => {
  const that = $("#results")[0];
  if (that.scrollTop + that.clientHeight >= that.scrollHeigh) {
    //SEARCH($("#results").attr("q"));
  }
});
