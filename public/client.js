window.ln = navigator.language || navigator.userLanguage;

const { autoComplete } = window;

//DEBOUNHCE
function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

var countries = [
  { label: "United Kingdom", value: "UK" },
  { label: "United States", value: "US" }
];

//SEARCH
var input = document.getElementById("search");

autocomplete({
  input: input,
  showOnFocus: true, //focus = show suggestions
  emptyMsg: "No results",
  minLength: 1,
  className: "live-search", //class
  debounceWaitMs: 500, //wait
  fetch: function(text, update) {
    //input
    text = text.toLowerCase();

    text &&
      fetch("/api/complete/de:" + text)
        .then(res => res.text())
        .then(raw => {
          const result = JSON.parse(raw);
          let arr = result.data ? result.data.split(",") : [];
          console.log(result);
          if (result.code === 200) {
            const suggs = [];
            //loop and push
            arr.forEach(function(sugg) {
              const val = sugg.slice(1, -1);
              suggs.push({ label: val, value: val });
              update(suggs);
            });
          } else if (result.code === 404) {
            update({ label: arr[0] });
          }
        });
  },
  onSelect: function(item) {
    input.value = item.label;
  }
});
