{
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
    speed,
    T,
    afterglow,
    Browser,
    Fullscreen,
    waitForElement
  } = window;

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //afterglow player

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
    openFromResult: that => {
      $("#view-inner").classList.add("wait");

      $("#results").classList.add("grow");
      that.classList.add("growing");

      setTimeout(() => {
        Player.play(that.getAttribute("video-id"));

        $("#results").classList.remove("grow");
        that.classList.remove("growing");
      }, 799);
    },
    play: vid => {
      Player.open();
      afterglow.initVideoElements();
      let VIDEO = $("video");
      const AUDIO = $("audio");

      fetch(`${HOST}/api/${REGION}/video/${vid}`)
        .then(res => res.text())
        .then(raw => {
          let vid = JSON.parse(raw);
          let HTML = "";

          const TITLE = vid.title;

          $("poster>img").setAttribute(
            "srcset",
            createThumbs(vid.videoThumbnails)
          );

          const STREAM = {
            low: vid.formatStreams[0],
            AUDIOS: [],
            VIDEOS: [],
            CURRENT: { AUDIO: "", VIDEO: "" }
          };

          for (const format of vid.adaptiveFormats) {
            if (format.type.startsWith("video")) STREAM.VIDEOS.push(format);
            if (format.type.startsWith("audio")) STREAM.AUDIOS.push(format);
          }

          //sort by bitrate
          STREAM.AUDIOS = STREAM.AUDIOS.sort((a, b) => a.bitrate - b.bitrate);
          STREAM.VIDEOS = STREAM.VIDEOS.sort((a, b) => a.bitrate - b.bitrate);

          console.log(STREAM);
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
                STREAM.CURRENT.AUDIO = STREAM.AUDIOS[STREAM.AUDIOS.length - 1];
                STREAM.CURRENT.VIDEO = STREAM.VIDEOS[STREAM.VIDEOS.length - 1];
              }
              break;
          }

          if (Browser.isFirefox || Browser.isChrome) {
            console.log(vid);

            const poster = $("poster>img").currentSrc;

            $(
              "video"
            ).outerHTML = `<video autoplay preload="metadata" class="afterglow" height="0" width="0" poster="${poster}"></video>`;

            VIDEO = $("video");

            //SET MEDIA
            AUDIO.src = STREAM.CURRENT.AUDIO.url;
            VIDEO.src = STREAM.CURRENT.VIDEO.url;

            //init afterglow
            afterglow.initVideoElements();

            {
              //MIRROR VOLUME
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

              //MIRROR MUTED
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

              //SYNC PLAY
              VIDEO._play = VIDEO.play;
              Object.defineProperty(VIDEO, "play", {
                get: () => {
                  AUDIO.paused && AUDIO.play();

                  if (AUDIO.paused) {
                    console.debug("muted");
                    $("#mep_0").insertAdjacentHTML(
                      "afterbegin",
                      "<lapis-muted></lapis-muted>"
                    );

                    const MUTED_WARNING = $("lapis-muted");
                    MUTED_WARNING.innerHTML =
                      "THE VIDEO IS MUTED. CLICK ME TO UNMUTE";
                    MUTED_WARNING.style.display = "flex";
                    MUTED_WARNING.addEventListener("click", () => {
                      MUTED_WARNING.remove();
                      AUDIO.muted = false;
                      VIDEO.currentTime = 0;
                      AUDIO.play();
                      !AUDIO.muted &&
                        !AUDIO.paused &&
                        console.debug("unmuted.");
                    });
                  }

                  return VIDEO._play;
                }
              });
              //SYNC PAUSE
              VIDEO._pause = VIDEO.pause;
              Object.defineProperty(VIDEO, "pause", {
                get: () => {
                  AUDIO.pause();
                  return VIDEO._pause;
                }
              });
            }

            VIDEO.addEventListener(
              "loadedmetadata",
              e => {
                console.log("loaded");

                try {
                  VIDEO.play();
                } catch (e) {
                  console.warn(e);
                }

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
                  const that = e.target;

                  const ratio =
                    $("lapis-player").getAttribute("ratio") ||
                    that.videoHeight / that.videoWidth;
                  $("lapis-player").setAttribute("ratio", ratio);
                  $("#mep_0").style.height = `${$("#mep_0").clientWidth *
                    ratio}px`;
                };
                setTimeout(fitRatio, 0);
                window.addEventListener("resize", fitRatio);
              },
              false
            );

            //load vidn
            VIDEO.load();

            try {
              //$("video").play();
            } catch (e) {}
            {
            }

            //keep video time in sync with audio
            const syncer = setInterval(() => {
              AUDIO.currentTime / VIDEO.currentTime > 1.1 && [
                (VIDEO.currentTime = AUDIO.currentTime)
              ];
            }, 2999);

            //MOBILE DEVICE
            if (typeof window.orientation !== "undefined") {
              document.title = TITLE;

              //sync audio pause on android video pause
              document.addEventListener(
                "fullscreenchange",
                () => {
                  if (!document.fullscreen && VIDEO.pause && !AUDIO.paused)
                    AUDIO.pause();
                },
                false
              );

              //sync video war playNpause with audio
              VIDEO.addEventListener("play", () => {
                AUDIO.play();
              }),
                VIDEO.addEventListener("pause", () => {
                  !AUDIO.paused && AUDIO.pause();
                });
              //: @android: FIXME

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
                    $("#mep_0").classList.remove("afterglow__container");
                    Fullscreen.enter($("video"));
                  });
                }
              });
            }

            //IOS
          } /* if (
      !!navigator.platform &&
      /iPad|iPhone|iPod/.test(navigator.platform)
    ) */ else {
            {
              const VIDEO = $("video");
              const AUDIO = $("audio");

              document.title = TITLE;

              //sync audio playNpause with video
              AUDIO.addEventListener("play", () => {
                VIDEO.paused && VIDEO.play();
              }),
                AUDIO.addEventListener("pause", () => {
                  !VIDEO.paused && VIDEO.pause();
                });

              //sync video playNpause with audio
              VIDEO.addEventListener("play", () => {
                AUDIO.paused && AUDIO.play();
              }),
                VIDEO.addEventListener("pause", () => {
                  !AUDIO.paused && AUDIO.pause();
                });
            }

            $("video").outerHTML =
              "<video preload controls playsinline></video>";

            $("video").src = STREAM.LOW;
          }
        });
    }
  };
}
