const { Trianglify, debounce, fetch } = window;

window.load = () =>
  setTimeout(() => {
    document.querySelector("diamond").setAttribute("style", "");
    document.querySelector("#wrap") &&
      document.querySelector("#wrap").setAttribute("style", "display:none;");
  }, 999);

window.done = () =>
  setTimeout(() => {
    document.querySelector("diamond").setAttribute("style", "display:none;");
    document.querySelector("#wrap") &&
      document.querySelector("#wrap").setAttribute("style", "");
  }, 999);

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
window.onresize = debounce(initBg, 49);
//BG END
