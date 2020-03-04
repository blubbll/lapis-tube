//©Blu2020

{
  //get generic
  const {
    lscache,
    Browser,
    afterglow,
    waitForElement,
    getSize,
    getL,
    fetch,
    debounce,
    alert,
    done,
    initBg,
    createThumbs,
    Fullscreen,
    clickSound,
    autocomplete,
    applyWords,
    moment,
    numeral,
    load,
    lazyload,
    speed,
    abortFetches
  } = window;
  //set generic
  let { app_start, route } = window;
  //-//
  const _L = new Proxy(
    {},
    {
      get: (obj, prop, val) => {
        {
          const _app = "L";

          !window[_app] && [(window[_app] = {})];
          !window[_app][prop] && [(window[_app][prop] = {})];
          for (const key of Object.keys(window.L)) {
            window[_app][key] = window[key];
          }
        }
        return window[prop];
      },
      set: function(obj, prop, val) {
        const _app = "L";
        window[prop] = val;
        !window[_app] && [(window[_app] = {})],
          !window[_app][prop] && [(window[_app][prop] = {})];
        window[_app][prop] = val;
      }
    }
  );
  //get Elements of L
  const { GEO, URL, REGION, addView, setActiveView, T, UI } = _L;
  //set Elements of L
  let { Player } = _L;

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //afterglow player

  Player = {
    open: () => {
      if (!$("#player")) {
        addView(T.PLAYER);
      }
      setActiveView("player");

      $("views") && $("views").classList.remove("wait");
    },
    close: () => {
      abortFetches();

      //came from results
      if ($("#results"))
        //lead back if location was pushed
        location.href.split("/").length === 5 && history.back();
      //show app home
      else {
        history.pushState(null, null, URL.HOST);
        setActiveView("start");
      }

      $("#player-inner").setAttribute("closing", "");
      //reset to results view if searched
      if ($("#results")) {
        $("views").classList.add("wait");

        document.title = `${UI.titles.results} "${$("#results").getAttribute(
          "q"
        )}"`;

        setTimeout(
          () => [
            $("#player-inner").removeAttribute("closing"),
            setActiveView("results")
          ],
          399
        );
        setTimeout(() => $("views").classList.remove("wait"), 249);
      }
      //remove sources
      $("audio") && [($("audio").src = "")],
        $("video") && [($("video").src = "")];
    },
    openFromResult: that => {
      $("views").classList.add("wait");

      $("#results").classList.add("grow");

      //mark the clicked card as growing
      that.classList.add("growing");

      setTimeout(() => {
        Player.play(that.getAttribute("video-id"));

        $("#results").classList.remove("grow");
        that.classList.remove("growing");

        setTimeout(() => navigator.vibrate(50), 99);
        clickSound();
      }, 499);
    },
    play: id => {
      Player.open();

      let VIDEO = $("video");
      const AUDIO = $("audio");

      //reset
      {
        const IMG_BLEND = $("poster>canvas");
        $("lapis-player>poster").style.display = "block";
        //remove warning
        $("lapis-warning") && $("lapis-warning").remove();
        IMG_BLEND && //clear blendpic
          IMG_BLEND.getContext("2d").clearRect(
            0,
            0,
            IMG_BLEND.width,
            IMG_BLEND.height
          );
        $(".afterglow__video") && [
          ($(".afterglow__video").style.display = "none")
        ];
      }

      $("lapis-player>poster").style.width = `${
        $("lapis-player").clientWidth
      }px`;

      //fake title
      document.title = UI.labels.loading;
      $("#player .card-title").innerText = UI.labels.loading;

      //use result img for preloading img
      const IMG_LOADER = $("poster>img");
      let IMG_BLEND = $("poster>canvas");
      {
        const poster = IMG_LOADER.src;

        //apply carbon copy of preview img to loading-poster (only when exists in results)
        if ($("#results") && $(`#results card[video-id="${id}"]`)) {
          if (!IMG_BLEND) {
            IMG_LOADER.insertAdjacentHTML("afterend", `<canvas/>`);
            IMG_BLEND = $("poster>canvas");
          }

          var ctx = IMG_BLEND.getContext("2d");
          var img = $(`#results card[video-id="${id}"] img`);
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height, // source rectangle
            0,
            0,
            IMG_BLEND.width,
            IMG_BLEND.height
          );
          //fit blend loader's sizes
          IMG_BLEND.style.left = `${IMG_LOADER.offsetLeft}px`;
          IMG_BLEND.style.top = `${IMG_LOADER.offsetTop}px`;
        }
      }

      //create dynamic template if not existing of player footer
      !T.PLAYER_FOOTER && [(T.PLAYER_FOOTER = $("#player-info").innerHTML)];

      //set info bg to loading
      $("#player .card").setAttribute("loading", "");

      //clear footer content
      $("#player #player-info").innerHTML = "";

      fetch(`${URL.API}/${REGION}/video/${id}`)
        .then(res => res.text())
        .then(raw => {
          //abort, abort!
          if (!$("views[active=player]")) return false;

          const vid = JSON.parse(raw);

          history.pushState(null, null, `${location.origin}/v/${id}`);

          //work-around :/
          window.__video = vid;

          let HTML = "";
          let error = false;

          if (raw.includes("unavailable")) {
            error = true;
            document.title(UI.title.problem);
            //make loader red
            IMG_LOADER.style.filter = "hue-rotate(130deg)";
            $("#player .card-title").innerText = UI.labels.tryagain;
          } else {
            IMG_LOADER.style.filter = "";
          }
          //repeat when instance is blocked
          vid.error && [(error = true), Player.play(id)];

          if (error) return;

          const TITLE = vid.title;

          $(
            "#player .card-title"
          ).innerText = `${TITLE} (${UI.labels.preparing})`;

          //fit blend loader's sizes
          if (IMG_BLEND) {
            IMG_BLEND.style.left = `${IMG_LOADER.offsetLeft}px`;
            IMG_BLEND.style.top = `${IMG_LOADER.offsetTop}px`;
          }

          const STREAM = {
            LOW: vid.formatStreams[0],
            AUDIOS: [],
            VIDEOS: [],
            CURRENT: { AUDIO: "", VIDEO: "" }
          };

          //prepare streams
          {
            let i = 0;

            const canPlay = () => i === vid.adaptiveFormats.length;

            for (const _format of vid.adaptiveFormats) {
              const format = _format; //clone bz of async :/
              const TYPE = format.type.split("/")[0].toUpperCase();

              //check audios
              if (TYPE === "AUDIO") {
                let audio = document.createElement("audio");

                audio.src = format.url;

                const checkInterval = setInterval(() => {
                  //abort, abort!
                  if (!$("views[active=player]")) {
                    clearInterval(checkInterval);
                    return false;
                  }
                  if (audio.error || !isNaN(audio.duration)) {
                    i++;
                    if (audio.duration) {
                      console.debug("AUDIO OK", format.url);
                      STREAM.AUDIOS.push(format);
                    } else {
                      console.warn("AUDIO NOT OK", format.url);
                    }
                    clearInterval(checkInterval);
                    audio = void 0;
                    canPlay() && applyStreams(vid);
                  }
                }, 999);
              }
              //check videos
              if (TYPE === "VIDEO") {
                let video = document.createElement("video");

                video.src = format.url;

                const checkInterval = setInterval(() => {
                  if (video.error || !isNaN(video.duration)) {
                    i++;
                    if (video.duration) {
                      console.debug("VIDEO OK", format.url);
                      STREAM.VIDEOS.push(format);
                    } else {
                      console.warn("VIDEO NOT OK", format.url);
                    }

                    clearInterval(checkInterval);
                    video = void 0;
                    canPlay() && applyStreams(vid);
                  }
                }, 999);
              }
            }
          }

          //process streams and apply them (async, to be done after verifying streams locally)
          const applyStreams = vid => {
            if (STREAM.VIDEOS.length === 0) {
              if (!$("lapis-warning[name=nosource]")) {
                (
                  $(".afterglow__video") || $("lapis-player")
                ).insertAdjacentHTML(
                  "afterbegin",
                  `<lapis-warning name="nosource"></lapis-warning>`
                );

                $(".afterglow__video") && [
                  ($(".afterglow__video").style.display = "")
                ];
                const WARNING_NOSOURCE = $("lapis-warning");
                WARNING_NOSOURCE.innerHTML = UI.warnings.nosource;
                WARNING_NOSOURCE.style.display = "flex";
              }
              return false;
            }

            //sort by bitrate
            STREAM.AUDIOS = STREAM.AUDIOS.sort((a, b) => a.bitrate - b.bitrate);
            STREAM.VIDEOS = STREAM.VIDEOS.sort((a, b) => a.bitrate - b.bitrate);

            switch (speed.speed) {
              case "slow":
                {
                  STREAM.CURRENT.AUDIO = STREAM.AUDIOS[0];
                  STREAM.CURRENT.VIDEO = STREAM.VIDEOS[0];
                }
                break;
              case "medium":
                {
                  STREAM.CURRENT.AUDIO =
                    STREAM.AUDIOS[Math.floor(STREAM.AUDIOS.length - 1 / 2)];
                  STREAM.CURRENT.VIDEO =
                    STREAM.VIDEOS[Math.floor(STREAM.VIDEOS.length - 1 / 2)];
                }
                break;
              case "fast":
                {
                  STREAM.CURRENT.AUDIO =
                    STREAM.AUDIOS[STREAM.AUDIOS.length - 1];
                  STREAM.CURRENT.VIDEO =
                    STREAM.VIDEOS[STREAM.VIDEOS.length - 1];
                }
                break;
            }

            if (
              Browser.isFirefox ||
              Browser.isMobileChrome ||
              Browser.isChrome
            ) {
              if (afterglow.controller.players.length === 0) {
                /*IMG_LOADER.setAttribute(
              "srcset",
              createThumbs(vid.videoThumbnails)
            );
            lazyload(IMG_BLEND);*/

                $(
                  "video"
                ).outerHTML = `<video autoplay preload="metadata" class="afterglow" height="0" width="0" poster="loading.gif"></video>`;

                VIDEO = $("video");

                {
                  //MIRROR VOLUME vid>audio (set by afterglow)
                  Object.defineProperty(VIDEO, "volume", {
                    set: val => {
                      VIDEO._volume = val;
                      //!
                      AUDIO.volume = val;
                    },
                    get: () => {
                      return VIDEO._volume;
                    }
                  });

                  //MIRROR MUTED vid>audio (set by afterglow)
                  Object.defineProperty(VIDEO, "muted", {
                    set: val => {
                      VIDEO._muted = val;
                      //!
                      AUDIO.muted = val;
                    },
                    get: () => {
                      return VIDEO._muted;
                    }
                  });

                  //SYNC PLAY vid>audio (set by afterglow)
                  VIDEO._play = VIDEO.play;
                  Object.defineProperty(VIDEO, "play", {
                    get: () => {
                      AUDIO.paused && AUDIO.play();

                      if (AUDIO.paused) {
                        console.debug("muted");

                        $(".afterglow__video").insertAdjacentHTML(
                          "afterbegin",
                          `<lapis-warning name="muted"></lapis-warning>`
                        );

                        const WARNING_MUTED = $("lapis-warning[name=muted]");

                        WARNING_MUTED.innerHTML = UI.warnings.muted;
                        WARNING_MUTED.style.display = "flex";
                        WARNING_MUTED.addEventListener("click", () => {
                          WARNING_MUTED.remove();
                          AUDIO.muted = false;
                          VIDEO.currentTime = 0;
                          AUDIO.play();
                          !AUDIO.muted &&
                            !AUDIO.paused &&
                            VIDEO.play() &&
                            console.debug("unmuted.");
                        });
                      }

                      return VIDEO._play;
                    }
                  });
                  //SYNC PAUSE audio>vid (set by others)
                  AUDIO._pause = AUDIO.pause;
                  Object.defineProperty(AUDIO, "pause", {
                    get: () => {
                      VIDEO._pause();
                      return AUDIO._pause;
                    }
                  });
                  //SYNC PAUSE vid>audio (set by afterglow)
                  VIDEO._pause = VIDEO.pause;
                  Object.defineProperty(VIDEO, "pause", {
                    get: () => {
                      AUDIO._pause();
                      return VIDEO._pause;
                    }
                  });

                  //update vid progress in bg play
                  AUDIO.addEventListener("timeupdate", e => {
                    VIDEO.paused &&
                      AUDIO.currentTime - VIDEO.currentTime > 1.1 && [
                        (VIDEO.currentTime = AUDIO.currentTime) &&
                          console.debug(
                            "Updated VIDEO TIME TO",
                            VIDEO.currentTime
                          )
                      ];
                  }), //MIRROR/keep in sync currentTime vid>audio (set by afterglow)
                    VIDEO.addEventListener("timeupdate", e => {
                      (VIDEO.currentTime - AUDIO.currentTime > 1.1 ||
                        VIDEO.currentTime - AUDIO.currentTime < -1.1) &&
                        (AUDIO.currentTime = VIDEO.currentTime) &&
                        console.debug(
                          "Updated AUDIO TIME TO",
                          AUDIO.currentTime
                        );
                    });
                }

                VIDEO.onloadedmetadata = e => {
                  vid = window.__video;
                  const that = e.target;

                  console.debug("video metadata loaded");

                  $("lapis-player>poster").style.display = "none";

                  //reset enforced player heigth
                  $("lapis-player").style.height = "auto";

                  //replace afterglow labels with translated labels
                  {
                    //mute btn
                    waitForElement(
                      ".afterglow__volume-button.afterglow__mute > button"
                    ).then(el => el.setAttribute("title", UI.player.mute));

                    //play btn and...
                    waitForElement(".afterglow__play>button").then(el =>
                      el.setAttribute("title", UI.player.play)
                    ),
                      //...pause btn
                      waitForElement(".afterglow__pause>button").then(el =>
                        el.setAttribute("title", UI.player.pause)
                      );

                    //fullscreen btn
                    waitForElement(".afterglow__fullscreen-toggle").then(el =>
                      el.setAttribute("title", UI.player.fullscreen)
                    );
                  }

                  //fancy title
                  $(".afterglow__controls");

                  {
                    // FILL PLAYER FOOTER CONTENT
                    $("#player-info").innerHTML = T.PLAYER_FOOTER.replace(
                      //FILL DESCRIPTION
                      "{{desc}}",
                      vid.descriptionHtml || "😶"
                    )
                      //FILL AUTHOR
                      .replace("{{author}}", vid.author)
                      //FILL AUTHOR id
                      .replace("{{authorid}}", vid.authorId)
                      //FILL VIEWS (formatted)
                      .replace(
                        "{{views}}",
                        numeral(vid.viewCount || 0).format(`0.a`)
                      );

                    //fix links in description
                    for (const link of $$("#player-info a")) {
                      if (
                        link.href.split("/")[3] &&
                        link.href.split("/")[3].startsWith("redirect?")
                      ) {
                        link.href = link.innerText;
                      }
                    }

                    $("#player .card").removeAttribute("loading");
                  }

                  //show video pane
                  $(".afterglow__video").style.display = "flex";

                  try {
                    VIDEO.play();
                  } catch (e) {
                    console.warn(e);
                  }

                  //show video pane
                  $(".afterglow__video").style.display = "flex";

                  try {
                    VIDEO.play();
                  } catch (e) {
                    console.warn(e);
                  }

                  const fitRatio = () => {
                    const ratio =
                      $("lapis-player").getAttribute("ratio") ||
                      that.videoHeight / that.videoWidth;
                    $("lapis-player").setAttribute("ratio", ratio);
                    $(".afterglow__video").style.height = `${$(
                      ".afterglow__video"
                    ).clientWidth * ratio}px`;
                  };
                  setTimeout(fitRatio, 0);
                  window.addEventListener("resize", fitRatio);
                };

                //customize afterglow's html
                waitForElement(".afterglow__top-control-bar").then(el => [
                  //fancy control area
                  $(".afterglow__controls").insertAdjacentHTML(
                    "beforeend",
                    `<div class="afterglow__control-bar"></div>`
                  ),
                  //fancy title in fullscreen
                  $(".afterglow__controls").insertAdjacentHTML(
                    "afterbegin",
                    `<div class="afterglow__title-bar"></div>`
                  )
                ]);

                //fit card body to vid-player dimensions inside player card
                waitForElement("#mep_0").then(el =>
                  new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                      if (
                        mutation.type == "attributes" &&
                        mutation.attributeName !== "class"
                      ) {
                        const target = mutation.target;
                        if ($("#player #player-desc")) {
                          const newH =
                            $("#player .card").clientHeight - //card itself
                            $("#player .card-header").clientHeight - //card title
                            $("#player .card-body").clientHeight - //player
                            ($("#player .card-footer").clientHeight -
                              $("#player #player-desc").clientHeight); // not quickinfo/desc itself
                          //set
                          $("#player #player-desc").style.height = `${newH}px`;
                        }
                      }
                    });
                  }).observe(el, {
                    attributes: true,
                    characterDataOldValue: true // pass old data to callback
                  })
                );
              }

              //SET MEDIA & init afterglow
              AUDIO.src = STREAM.CURRENT.AUDIO.url;
              VIDEO.src = STREAM.CURRENT.VIDEO.url;

              afterglow.initVideoElements();

              //load vid
              VIDEO.load();

              try {
                //$("video").play();
              } catch (e) {}
              {
              }

              //MOBILE DEVICE
              if (Browser.isMobileChrome) {
                //reset psedo-fullscreen
                VIDEO.FULLSCREEN = false;

                document.title = TITLE;

                //sync audio pause on android video pause
                VIDEO.onfullscreenchange = () => {
                  VIDEO.paused && !AUDIO.paused && AUDIO.pause();

                  //re-fix player (re-add controls)
                  if (VIDEO.FULLSCREEN) {
                    $(".afterglow__video").classList.add(
                      "afterglow__container"
                    );
                    VIDEO.FULLSCREEN = false;
                  }
                };

                //sync video war playNpause with audio
                (VIDEO.onplay = AUDIO.play),
                  (VIDEO.onpause = () => {
                    !AUDIO.paused && AUDIO.pause();
                  });

                //RESET EVENT
                $(".afterglow__top-control-bar").innerHTML = $(
                  ".afterglow__top-control-bar"
                ).innerHTML;
                //ADD NEW EVENT
                $(
                  ".afterglow__button.afterglow__fullscreen-toggle"
                ).onclick = e => {
                  const that = e.target;

                  if (!VIDEO.FULLSCREEN) {
                    $(".afterglow__video").classList.remove(
                      "afterglow__container"
                    );
                    Fullscreen.enter($("video"));
                    VIDEO.FULLSCREEN = true;
                  }
                };
              } else {
                //desktop
                document.title = `${UI.titles.playing} "${TITLE}"`;

                //console.debug(TITLE, vid)
              }

              //normal title
              waitForElement("#player .afterglow__title-bar").then(
                el => (el.innerText = TITLE)
              );
              //normal title
              $("#player .card-title").innerText = TITLE;

              //IOS
            } /* if (
      !!navigator.platform &&
      /iPad|iPhone|iPod/.test(navigator.platform)
    ) */ else {
              $("video").outerHTML =
                "<video autoplay preload controls playsinline></video>";

              {
                const VIDEO = $("video");
                const AUDIO = $("audio");

                document.title = TITLE;

                //sync audio playNpause with video
                AUDIO.onplay = () => VIDEO.paused && VIDEO.play();

                AUDIO.onpause = () => !VIDEO.paused && VIDEO.pause();
              }

              //sync video playNpause with audio
              (VIDEO.onplay = () => AUDIO.paused && AUDIO.play()),
                (VIDEO.onpause = () => {
                  !AUDIO.paused && AUDIO.pause();
                });

              $("video").src = STREAM.LOW.url;

              VIDEO.style.position = "relative";
              $("poster").style.position = "relative";
              $("poster").style.display = "none";
            }
          };
        })
        .catch(e => {
          console.warn(e);
        });
    }
  };
}
