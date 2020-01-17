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
  showOnFocus: 1,
  className: "live-search",
  debounceWaitMs: 500,
  fetch: function(text, update) {
    //input
    text = text.toLowerCase();

    fetch("/api/complete/de:" + text)
      .then(res => res.text())
      .then(arrText => {
        const suggs = [];
        console.log(JSON.parse(arrText))
        Array.from(arrText).forEach(function(sugg) {
          //suggs.push()
          console.log(sugg);
          //update(suggs)
        });
      });
  },
  onSelect: function(item) {
    input.value = item.label;
  }
});
