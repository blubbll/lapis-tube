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
  let { setupHistory, showHistory } = _L;

  showHistory = page => {
    setActiveView("history");

    var indexDB = new PouchDB("history");

    indexDB.allDocs().then(all => {
      for (const item of all.rows) {
        const vid = indexDB.get(item.id);
        console.log(vid);
      }
    });
  };
}
