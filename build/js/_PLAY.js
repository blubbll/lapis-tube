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
    $("#view-inner")
      .append(T.PLAYER)
      .removeClass("wait");
    $("#filters")[0].style.setProperty("display", "none", "important");
    $("#results")[0].style.setProperty("display", "none", "important");
  },
  close: () => {
    //$("#player").remove();
    $(".growing").classList.remove("growing");
    $(".grow").classList.remove("grow");
    $("#filters")[0].style.setProperty("display", "");
    $("#results")[0].style.setProperty("display", "");
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
  if (e.target !== $(".card[data-video]")) return;

  const that = $(e.currentTarget);

  $("#view-inner").classList.add("wait");

  $("#results").classList.add("grow");
  that.classList.add("growing");

  setTimeout(() => {
    //enlarge-animation
    $("enlarger").innerHTML = that.innerHTML;

    Player.play(that.data("video"));

    $("#results").removeClass("grow");

    // afterglow.initVideoElements()
    // or
    // afterglow.init

    that.removeClass("grow");
  }, 799);
});
