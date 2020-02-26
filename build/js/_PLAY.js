{
  const {
    addView,
    API,
    abortFetches,
    autocomplete,
    alert,
    createThumbs,
    CDN,
    debounce,
    done,
    fetch,
    getL,
    getSize,
    HOST,
    REGION,
    load,
    lazyload,
    moment,
    speed,
    UI,
    T,
    afterglow,
    Browser,
    Fullscreen,
    setActiveView,
    waitForElement
  } = window;

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //afterglow player

  let { Player } = window;

  Player = {
    open: () => {
      if (!$("#player")) {
        addView(T.PLAYER);
      }
      setActiveView("player");
      $("views").classList.remove("wait");
    },
    close: () => {
      abortFetches();
      //reset to results view if searched
      if ($("#results")) {
        $("views").classList.add("wait");
        document.title = `${UI.titles.results} "${$("#results").getAttribute(
          "q"
        )}"`;
        setActiveView("results");
        setTimeout(() => $("views").classList.remove("wait"), 399);
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

      $("#results").setAttribute("last-poster", $(".growing img").currentSrc);

      setTimeout(() => {
        Player.play(that.getAttribute("video-id"));

        $("#results").classList.remove("grow");
        that.classList.remove("growing");
      }, 499);
    },
    play: id => {
      Player.open();

      let VIDEO = $("video");
      const AUDIO = $("audio");

      $("lapis-player>poster").style.width = `${
        $("lapis-player").clientWidth
      }px`;

      //reset
      {
        const IMG_BLEND = $("poster>img.poster-blend");
        $("lapis-player>poster").style.display = "block";
        //remove warning
        $("lapis-warning") && $("lapis-warning").remove();
        IMG_BLEND && //clear blendpic
          IMG_BLEND.setAttribute(
            "src",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
          );
        $(".afterglow__video") && [
          ($(".afterglow__video").style.display = "none")
        ];
      }

      //fake title
      document.title = UI.labels.loading;
      $("#player .card-title").innerText = UI.labels.loading;

      fetch(`${HOST}/api/${REGION}/video/${id}`)
        .then(res => res.text())
        .then(raw => {
          let vid = JSON.parse(raw);
          let HTML = "";
          let error = false;

          if (raw.includes("unavailable")) {
            error = true;
            document.title(UI.title.problem);
            //make loader red
            $("poster>img.poster-loader").style.filter = "hue-rotate(130deg)";
            $("#player .card-title").innerText = UI.labels.tryagain;
          } else {
            $("poster>img.poster-loader").style.filter = "";
          }
          //repeat when instance is blocked
          vid.error && [(error = true), Player.play(id)];

          if (error) return;

          let TITLE = vid.title;

          $(
            "#player .card-title"
          ).innerText = `${TITLE} (${UI.labels.buffering})`;

          const IMG_LOADER = $("poster>img.poster-loader");
          let IMG_BLEND = $("poster>img.poster-blend");

          const poster = IMG_LOADER.src;

          if ($("#results")) {
            const dynposter = $("#results").getAttribute("last-poster");

            if (!IMG_BLEND) {
              IMG_LOADER.insertAdjacentHTML(
                "afterend",
                `<img class="poster-blend" src="${dynposter}"/>`
              );
              IMG_BLEND = $("poster>img.poster-blend");
              //fit blend loader's sizes
              IMG_BLEND.style.left = `${IMG_LOADER.offsetLeft}px`;
              IMG_BLEND.style.width = `${IMG_LOADER.clientWidth}px`;
              IMG_BLEND.style.height = `${IMG_LOADER.clientHeight}px`;
            } else {
              IMG_BLEND.setAttribute("src", dynposter);
            }
          } else {
            IMG_LOADER.setAttribute(
              "srcset",
              createThumbs(vid.videoThumbnails)
            );
            lazyload(IMG_BLEND);
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
                    canPlay() && applyStreams();
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
                    canPlay() && applyStreams();
                  }
                }, 999);
              }
            }
          }
          //process streams and apply them (async, to be done after verifying streams locally)
          const applyStreams = () => {
            if (STREAM.VIDEOS.length === 0) {
              //$("#player .card-body").innerHTML = UI.warnings.nosource;
              ($(".afterglow__video") || $("lapis-player")).insertAdjacentHTML(
                "afterbegin",
                `<lapis-warning name="nosource"></lapis-warning>`
              );
              $(".afterglow__video") && [
                ($(".afterglow__video").style.display = "")
              ];
              const WARNING_NOSOURCE = $("lapis-warning");
              WARNING_NOSOURCE.innerHTML = UI.warnings.nosource;
              WARNING_NOSOURCE.style.display = "flex";
              //$("poster").style.display = "none";
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

            if (Browser.isFirefox || Browser.isChrome) {
              if (afterglow.controller.players.length === 0) {
                $(
                  "video"
                ).outerHTML = `<video autoplay preload="metadata" class="afterglow" height="0" width="0" poster="${poster}"></video>`;

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
                }

                VIDEO.addEventListener(
                  "loadedmetadata",
                  e => {
                    const that = e.target;

                    console.debug("video metadata loaded");

                    $("lapis-player>poster").style.display = "none";

                    //reset enforced player heigth
                    $("lapis-player").style.height = "auto";

                    $(".afterglow__video").style.display = "block";

                    try {
                      VIDEO.play();
                    } catch (e) {
                      console.warn(e);
                    }

                    //normal title
                    $("#player .card-title").innerText = TITLE;

                    //fancy title
                    $(".afterglow__controls").insertAdjacentHTML(
                      "afterbegin",
                      `<div class="afterglow__title-bar">${TITLE}</div>`
                    );

                    //fancy control area
                    $(".afterglow__controls").insertAdjacentHTML(
                      "beforeend",
                      `<div class="afterglow__control-bar"></div>`
                    );

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
                  },
                  false
                );
                //keep video time in sync with audio
                setInterval(() => {
                  AUDIO.currentTime / VIDEO.currentTime > 1.1 && [
                    (VIDEO.currentTime = AUDIO.currentTime)
                  ];
                }, 2999);
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
                document.title = TITLE;

                //sync audio pause on android video pause
                document.onfullscreenchange = () => {
                  if (!document.fullscreen && VIDEO.paused && !AUDIO.paused)
                    AUDIO.pause();

                  //re-fix player (re-add controls)
                  !document.fullscreen &&
                    $(".afterglow__video").classList.add(
                      "afterglow__container"
                    );
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
                ).addEventListener("click", e => {
                  const that = e.target;

                  if (document.fullscreen) {
                    Fullscreen.exit();
                  } else {
                    setTimeout(() => {
                      $(".afterglow__video").classList.remove(
                        "afterglow__container"
                      );
                      Fullscreen.enter($("video"));
                    });
                  }
                });
              } else {
                //desktop
                document.title = `${UI.titles.playing} "${TITLE}"`;
              }

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
