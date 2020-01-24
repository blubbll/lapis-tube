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

    
      for (const result of results) {
        
        //HTML += T.RESULT.replace("{{preview}}");
        let HTML = T.RESULT.replace(
          "{{title}}",
          result.title
        );

        let srcSet = "";
        for (const thumb of result.videoThumbnails) {
          srcSet += `${thumb.url}\t${thumb.width}w,\n`;
        }

        //fill previewset placeholder
        HTML = HTML.replace(
          "{{preview}}",
          `<img data="preview" alt="preview" srcset="${srcSet.slice(0, -1)}" />`
        );

        console.log(HTML)
        
        //store querystring for re-querying more data when scrolling
        $("#results").attr("q", str);
        //update paging no for ^
        $("#result").attr(
          "page",
          $("#result").attr("page") ? $("#result").attr("page") + 1 : 1
        );

        //render results
        $("#results-inner").append(HTML);
        //console.log(result);
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
