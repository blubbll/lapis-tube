const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const { HOST, Player, waitForElement, setActiveView } = window;
let { route } = window;

route = to => {
  if (to) {
    console.debug(`Processing route ${to}...`);
    const args = to.split("/")[2];
    //process route when app's ready
    waitForElement("views").then(() => {
      switch (to.split("/")[1]) {
        case "v":
          {
            const id = args;
            console.debug("attempting to play requested video", id);
            //waitForElement("views").then(Player.play(id));
            Player.play(id);
          }
          break;

        default: {
          if (to.startsWith("/watch?v=")) {
            const id = to.split("/watch?v=")[1];
        
            //from yt vid
            console.debug(
              "attempting to play requested video (direct call from yt)",
              id
            );
             setActiveView("start")
            history.pushState(null, null, HOST);
           
            Player.play(id);
          }
        }
      }
    });
  }
};
