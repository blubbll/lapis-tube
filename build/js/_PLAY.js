const {
  autocomplete,
  alert,
  createThumbs,
  debounce,
  done,
  fetch,
  getL,
  getSize,
  HOST,
  REGION,
  load,
  moment,
  T,
  waitForElement
} = window;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//afterglow player
const { afterglow, vjs, poster } = window;

let { Player } = window;

Player = {
  open: () => {
    $("#view-inner").insertAdjacentHTML("beforeend", T.PLAYER);
    $("#view-inner").classList.remove("wait");
    $("#filters").style.setProperty("display", "none", "important");
    $("#results").style.setProperty("display", "none", "important");
  },
  close: () => {
    $("#player").remove();
    $("#filters").style.setProperty("display", "");
    $("#results").style.setProperty("display", "");
  },
  play: vid => {
    Player.open();
    afterglow.initVideoElements();
    fetch(`${HOST}/api/${REGION}/video/${vid}`)
      .then(res => res.text())
      .then(raw => {
        let vid = JSON.parse(raw);
        let HTML = "";

        waitForElement(".vjs-poster").then(el => {
          el.outerHTML = $("#fake-poster").innerHTML.replace(
            "{{preview-set}}",
            createThumbs(vid.videoThumbnails)
          );
        });

        console.log(vid);
      });
  }
};

document.addEventListener("click", e => {
  const that = $(".card[video-id]");
  if (!that || (that && !that.contains(e.target))) {
    e.preventDefault();
    return false;
  }
  /////////////////////////////

  $("#view-inner").classList.add("wait");

  $("#results").classList.add("grow");
  that.classList.add("growing");

  setTimeout(() => {
    Player.play(that.getAttribute("video-id"));

    $("#results").classList.remove("grow");
    that.classList.remove("growing");
  }, 799);
});
