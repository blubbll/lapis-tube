window.ln = navigator.language || navigator.userLanguage;

const { autoComplete } = window;

//BG START
const initBg = () => {
  var rn = Math.floor(Math.random() * 150 + 60);
  var rs = Math.floor(Math.random() * 11 + 4);
  const prim = getComputedStyle(document.documentElement).getPropertyValue(
    "--color-accent-main"
  );

  var t = new Trianglify({
    x_gradient: [
      "#173b5e",
      "#3e87d0",
      "#1c4873",
      "#215487",
      "#26619c",
      "#2b6eb1",
      "#307bc5"
    ], //Trianglify.colorbrewer.Spectral[rs],
    noiseIntensity: 0,
    cellsize: rn
  });
  var pattern = t.generate(window.innerWidth, window.innerHeight);
  document.body.setAttribute("style", `background-image: ${pattern.dataUrl}`);
};
window.onresize = initBg;
//BG END

new autoComplete({
  data: {
    // Data src [Array, Function, Async] | (REQUIRED)
    src: async () => {
      // API key token
      // User search query
      const query = document.querySelector("#autoComplete").value;
      // Fetch External Data Source
      const source = await fetch(
        `https://www.food2fork.com/api/search?key=${token}&q=${query}`
      );
      // Format data into JSON
      const data = await source.json();
      // Return Fetched data
      return data.recipes;
    },
    key: ["title"],
    cache: false
  },
  query: {
    // Query Interceptor               | (Optional)
    manipulate: query => {
      return query.replace("pizza", "burger");
    }
  },
  sort: (a, b) => {
    // Sort rendered results ascendingly | (Optional)
    if (a.match < b.match) return -1;
    if (a.match > b.match) return 1;
    return 0;
  },
  placeHolder: "Food & Drinks...", // Place Holder text                 | (Optional)
  selector: "#autoComplete", // Input field selector              | (Optional)
  threshold: 3, // Min. Chars length to start Engine | (Optional)
  debounce: 300, // Post duration for engine to start | (Optional)
  searchEngine: "strict", // Search Engine type/mode           | (Optional)
  resultsList: {
    // Rendered results list object      | (Optional)
    render: true,
    container: source => {
      source.setAttribute("id", "food_list");
    },
    destination: document.querySelector("#autoComplete"),
    position: "afterend",
    element: "ul"
  },
  maxResults: 5, // Max. number of rendered results | (Optional)
  highlight: true, // Highlight matching results      | (Optional)
  resultItem: {
    // Rendered result item            | (Optional)
    content: (data, source) => {
      source.innerHTML = data.match;
    },
    element: "li"
  },
  noResults: () => {
    // Action script on noResults      | (Optional)
    const result = document.createElement("li");
    result.setAttribute("class", "no_result");
    result.setAttribute("tabindex", "1");
    result.innerHTML = "No Results";
    document.querySelector("#autoComplete_list").appendChild(result);
  },
  onSelection: feedback => {
    // Action script onSelection event | (Optional)
    console.log(feedback.selection.value.image_url);
  }
});
