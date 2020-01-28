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

  fetch(`${HOST}/api/${REGION}/video/${id}`)
    .then(res => res.text())
    .then(raw => {
      let vid = JSON.parse(raw);
      let HTML = "";

      console.log(vid);
    });
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

$(document).on("click", ".card[data-video]", () => {
  playVid($(this).data("video"));
});
