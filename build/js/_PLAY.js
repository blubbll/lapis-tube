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
  moment,
  T
} = window;

let { playVid, openPlayer, closePlayer } = window;

playVid = id => {
  openPlayer();
};

closePlayer = () => {
  $("#player").remove();
  $("#filters")[0].style.setProperty("display", "");
  $("#results")[0].style.setProperty("display", "");
};

openPlayer = () => {
  $("#view-inner").append(T.PLAYER);

  $("#filters")[0].style.setProperty("display", "none", "important");
  $("#results")[0].style.setProperty("display", "none", "important");
};
