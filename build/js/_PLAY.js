const {
  $,
  afterglow,
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
    fetch(`${HOST}/api/${REGION}/video/${vid}`)
      .then(res => res.text())
      .then(raw => {
        let vid = JSON.parse(raw);
        let HTML = "";

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
    
    afterglow.initVideoElements();
    
    
    that.removeClass("grow");
  }, 799);
});
