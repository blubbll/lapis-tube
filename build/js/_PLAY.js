const {
  $,
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
    $("#player").remove();
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
          el.outerHTML = $("#fake-poster")
            .html()
            .replace("{{preview-set}}", createThumbs(vid.videoThumbnails));
        });

        console.log(vid);
      });
  }
};

$(document).on("click", ".card[data-video]", e => {
  const that = $(e.currentTarget);

  $("#view-inner").addClass("wait");

  $("#results").addClass("growing");
  that.addClass("grow");

  setTimeout(() => {
    //enlarge-animation
    $("enlarger").html(that.html());

    //$("#video").html(T.PLAYER_INSIDE);

    Player.play(that.data("video"));

    $("#results").removeClass("growing");

    // afterglow.initVideoElements()
    // or
    // afterglow.init

    that.removeClass("grow");
  }, 799);
});
