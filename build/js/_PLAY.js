{
  const {
    API,
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
    waitForElement
  } = window;

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //afterglow player

  let { Player } = window;

  Player = {
    open: () => {
      if (!$("#player"))
        $("#view-inner").insertAdjacentHTML("beforeend", T.PLAYER);
      else {
        $("#player").style.setProperty("display", "block");
      }
      $("#view-inner").classList.remove("wait");
      $("#filters").style.setProperty("display", "none", "important");
      $("#results").style.setProperty("display", "none", "important");
    },
    close: () => {
      $("#player").style.setProperty("display", "none", "important");
      $("video") && $("video").pause();
      $("#filters").style.setProperty("display", "");
      $("#results").style.setProperty("display", "");
    },
    openFromResult: that => {
      $("#view-inner").classList.add("wait");

      $("#results").classList.add("grow");

      //set preload img from enlarged result
      /*$("#results").setAttribute(
        "last-poster",
        that.querySelector("img").currentSrc
      );*/

      that.classList.add("growing");

      $("#results").setAttribute("last-poster", $(".growing img").currentSrc);

      setTimeout(() => {
        Player.play(that.getAttribute("video-id"));

        $("#results").classList.remove("grow");
        that.classList.remove("growing");
      }, 299);
    },
    play: vid => {
      Player.open();

      let VIDEO = $("video");
      const AUDIO = $("audio");

      $("lapis-player>poster").style.width = `${
        $("lapis-player").clientWidth
      }px`;

      //reset
      $("lapis-player>poster").style.display = "block";

      const IMG_LOADER = $("poster>img.poster-loader");
      let IMG_BLEND = $("poster>img.poster-blend");

      //clear blendpic
      IMG_BLEND && IMG_BLEND.removeAttribute("src");
      //remove warning
      $("lapis-warning") && $("lapis-warning").remove();
      fetch(`${HOST}/api/${REGION}/video/${vid}`)
        .then(res => res.text())
        .then(raw => {
          let vid = JSON.parse(raw);
          let HTML = "";

          const TITLE = vid.title;

          $(".card-title").innerText = TITLE;

          const poster = IMG_LOADER.src;

          if ($("#results")) {
            const dynposter = $("#results").getAttribute("last-poster");

            if (!IMG_BLEND) {
              IMG_LOADER.insertAdjacentHTML(
                "afterend",
                `<img class="poster-blend" src="${dynposter}"/>`
              );
              IMG_BLEND = $("poster>img.poster-blend");
              //fit blend's left offset
              IMG_BLEND.style.left = `${IMG_LOADER.offsetLeft}px`;
              //fit blend's heigth
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
            low: vid.formatStreams[0],
            AUDIOS: [],
            VIDEOS: [],
            CURRENT: { AUDIO: "", VIDEO: "" }
          };

          //prepare streams
          {
            let i = 0;

            console.log(vid);

            fetch(`${API}/getformats/`, {
              method: "POST",
              body: JSON.stringify(vid.adaptiveFormats),
              headers: { "content-type": "application/json" }
            })
              .then(res => res.json())
              .then(formats => {
                STREAM.AUDIOS = formats.AUDIOS;
                STREAM.VIDEOS = formats.VIDEOS;
                applyStreams();
              });
            /*for (const format of vid.adaptiveFormats) {
              //fetch(format.url, { mode: "no-cors", method: "HEAD" }).then(
              fetch(`${API}/check/${encodeURIComponent(format.url)}`)
                .then(res => {
                  i++;
                  if (res.status === 200) {
                    if (format.type.startsWith("video"))
                      STREAM.VIDEOS.push(format);
                    if (format.type.startsWith("audio"))
                      STREAM.AUDIOS.push(format);
                  }
                  if (i === vid.adaptiveFormats.length) applyStreams();
                })
                .catch(e => console.warn(e));
            }*/
          }

          const applyStreams = () => {
            if (STREAM.VIDEOS.length === 0) {
              //$("#player .card-body").innerHTML = UI.warnings.nosource;
              ($(".afterglow__video") || $("lapis-player")).insertAdjacentHTML(
                "afterbegin",
                `<lapis-warning name="nosource"></lapis-warning>`
              );
              const WARNING_NOSOURCE = $("lapis-warning");
              WARNING_NOSOURCE.innerHTML = UI.warnings.nosource;
              WARNING_NOSOURCE.style.display = "flex";
              $("poster").style.display = "none";
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
                    const that = e.target;

                    console.debug("video metadata loaded");

                    $("lapis-player>poster").style.display = "none";

                    //reset enforced player heigth
                    $("lapis-player").style.height = "auto";

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

              //keep video time in sync with audio
              const syncer = setInterval(() => {
                AUDIO.currentTime / VIDEO.currentTime > 1.1 && [
                  (VIDEO.currentTime = AUDIO.currentTime)
                ];
              }, 2999);

              //MOBILE DEVICE
              if (Browser.isMobileChrome) {
                document.title = TITLE;

                //sync audio pause on android video pause
                document.addEventListener(
                  "fullscreenchange",
                  () => {
                    if (!document.fullscreen && VIDEO.paused && !AUDIO.paused)
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
          };
        })
        .catch(e => {
          console.warn(e);
        });
    }
  };
}
