const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//get generic
const { addView, waitForElement } = window;
//set generic
let {} = window;
//-//
const L = window;
//get Elements of L
const { URL, Player, setActiveView, SEARCH, T } = L;
//set Elements of L
let { route } = L;

//get page querystring
{
  window.onpopstate = () => {
    !$.query && [($.query = {})];
    //fix title ¯\_(ツ)_/¯
    {
      const t = $("title").innerText;
      (document.title = ""), (document.title = t);
    }
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = s => {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1);
    while ((match = search.exec(query)))
      $.query[decode(match[1])] = decode(match[2]);
  };
}

route = to => {
  if (to) {
    console.debug(`Processing route ${to}...`);
    const args = to.split("/")[2];
    //process route when app's ready
    waitForElement("views").then(() => {
      switch (`/${to.split("/")[1]}`) {
        case "/v":
          {
            const id = args;
            console.debug("attempting to play requested video", id);
            //waitForElement("views").then(Player.play(id));
            Player.play(id);
          }
          break;

        case "/search":
          {
            const q = args;
            console.debug("attempting to search", q);
            //waitForElement("views").then(Player.play(id));
            SEARCH(q);
          }
          break;

        default: {
          //atomar routing based on array
          if (
            ["/search", "/watch"].some(
              (val, i, arr) => val === to || val.startsWith(to)
            )
          ) {
            if (to.startsWith("/watch?v=")) {
              const id = to.split("/watch?v=")[1];

              //from yt vid
              console.debug(
                "attempting to play requested video (direct call from yt)",
                id
              );
              setActiveView("start");
              history.pushState(null, null, URL.HOST);

              Player.play(id);
            }
          } else {
            !$($('view[id="404"]')) && addView(T[404]);
            setActiveView("404");
          }
        }
      }
    });
  }
};
