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
  className: "live-search", //class
  debounceWaitMs: 500, //wait
  fetch: function(text, update) {
    //input
    text = text.toLowerCase();

    text &&
      fetch("/api/complete/de:" + text)
        .then(res => res.text())
        .then(arrText => {
          const suggs = [];
          const arr = arrText.split(",");
  
          arr.length > 0 && arr[0] !== ""
            ? arr.forEach(function(sugg) {
                const val = sugg.slice(2, -2);
                suggs.push({ label: val, value: val });
                update(suggs);
              })
            : update();
        });
  },
  onSelect: function(item) {
    input.value = item.label;
  }
});
