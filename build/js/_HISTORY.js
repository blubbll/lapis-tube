//©Blu2020
{
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  //get generic
  const {
    lscache,
    waitForElement,
    getSize,
    getL,
    fetch,
    debounce,
    alert,
    done,
    initBg,
    createThumbs,
    autocomplete,
    applyWords,
    moment,
    numeral,
    load,
    lazyload
  } = window;
  //set generic
  let { app_start, route, PouchDB } = window;
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
  const { GEO, URL, REGION, Player, setActiveView, T, UI } = _L;
  //set Elements of L
  let { setupHistory, showHistory, clearHistory } = _L;

  clearHistory = () => {
    lscache.setBucket("history");
    lscache.flush();
  };

  showHistory = () => {
    setActiveView("history");

    document.title = UI.titles.history;

    history.pushState(null, null, `${URL.LOCAL}/history`);

    //clear old results
    $("#history-inner").innerHTML = "";

    let page = $("#history-inner").getAttribute("page") || 0;

    //get total history
    const keys = Object.keys(localStorage).filter(
      key =>
        key.startsWith("lscache-history") && !key.endsWith("-cacheexpiration")
    );

    if (keys.length) {
      for (const key of keys.reverse()) {
        const vid = JSON.parse(localStorage.getItem(key));

        //build results
        let srcSet = createThumbs(vid.videoThumbnails);

        const getDurationDetailed = () => {
          let detailed = moment
            .utc(moment.duration(vid.lengthSeconds, "seconds").asMilliseconds())
            .format("HH:mm:ss");
          //slice empty hours
          detailed.startsWith("00:") && [(detailed = detailed.slice(3))];
          //slice empty minutes
          detailed.startsWith("0") && [(detailed = detailed.slice(1))];

          return detailed;
        };
        //CONSTRUCT HTML
        let HTML = T.RESULT
          //FILL title
          .replace("{{title}}", vid.title)
          //fill previewset placeholder
          .replace("{{preview-set}}", srcSet.slice(0, -1))
          //FILL DESCRIPTION
          .replace("{{preview-desc}}", vid.description)
          //FILL DURATION
          .replace(
            "{{duration}}",
            moment.duration(vid.lengthSeconds * 1000).humanize()
          ) //DURATION DETAILED
          .replace("{{duration-detailed}}", getDurationDetailed())
          //FILL video id
          .replace("{{video}}", vid.videoId)
          //FILL AUTHOR
          .replace("{{author}}", vid.author)
          //FILL AUTHOR id
          .replace("{{authorid}}", vid.authorId)
          //FILL VIEWS (formatted)
          .replace("{{views}}", numeral(vid.viewCount || 0).format(`0.a`));

        //render result
        $("#history-inner").insertAdjacentHTML("beforeend", HTML);

        //setup lazyloading
        lazyload($$("figure>img"));
      }
    } else {
      console.debug("Nothing found :(");
      $(
        "#history-inner"
      ).innerHTML = `<span class="alert-warning border p-5">${UI.warnings.nothings}</span>`;
    }
  };
}
