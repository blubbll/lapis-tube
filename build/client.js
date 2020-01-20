const { debounce, fetch, autocomplete, done, T, $ } = window;

//get page language
const getL = () => {
  let L = navigator.language || navigator.userLanguage;
  L.includes("-") && [(L = L.split("-")[1])];
  return L.toLowerCase() || "en";
};

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
        fetch(`/api/complete/${l}:${text}`)
          .then(res => res.text())
          .then(raw => {
            const result = JSON.parse(raw);

            if (result.code === 200) {
              const suggs = [];
              //loop and push
              result.data.forEach(sugg => {
                suggs.push({ label: sugg, value: sugg });
                update(suggs);
              });
            } else if (result.code === 404) {
              update([{ label: emptyMsg, value: emptyMsg }]);
            }
          });
    },
    onSelect: item => {
      if (item.label !== emptyMsg) {
        input.value = item.label;
        SEARCH(item.label);

        $("view").html(T.RESULTS);
      }
    }
  });
}

const SEARCH = (str, ln) => {
  fetch(`/api/complete/${str}`)
    .then(res => res.text())
    .then(raw => {
      const result = JSON.parse(raw);

      if (result.code === 200) {
        const suggs = [];
        //loop and push
        result.data.forEach(sugg => {
          suggs.push({ label: sugg, value: sugg });
        });
        for (const item of suggs) {
          console.log(item);
        }
      } else if (result.code === 404) {
        //update([{ label: emptyMsg, value: input }]);
      }
    });
};

//LOAD TEMPLATES
{
  //template remote path
  const tr = "/templates";
  //template var inmemory
  const T = (window.T = {});

  Promise.all(
    [
      tr + "/channel.html",
      tr + "/player.html",
      tr + "/result-item.html",
      tr + "/result-list.html"
    ].map(url => fetch(url).then(resp => resp.text()))
  ).then(tx => {
    T.CHANNEL = tx[0];
    T.PLAYER = tx[1];
    T.RESULT = tx[2];
    T.RESULTS = tx[3];
    done();

    demo();
  });
}

//////
const demo = () => {
  $("view").html(T.RESULTS);
};
