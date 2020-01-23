const { $, autocomplete, alert, debounce, done, fetch, getL, HOST, REGION, load, T } = window;

//do actual search
const SEARCH = (str, ln) => {
  //show resultlist
  $("view").html(T.RESULTS);

  //show "loading"-spinner on dynamic fields
  $("param").html('<i class="fas fa-sync fa-spin"></i>');

  fetch(`${HOST}/api/${REGION}/search/${str}`)
    .then(res => res.text())
    .then(raw => {
      let results = JSON.parse(raw);
      let HTML = "";

      $("param[results]")[0].outerHTML = results.length;

    let i=0;
      for (const result of results) {
        HTML += T.RESULT.replace("{{preview}}");
        i++
        console.log(i, result);
      }

      $("#results").html(HTML);
    });
};