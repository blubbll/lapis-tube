const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const { Player, waitForElement } = window;
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
            waitForElement("views").then(Player.play(id));
          }
          break;
      
      default:{
        if(to.startsWith("/watch?v=")){ //from yt vid
          console.debug("attempting to play requested video (direct call from yt)", id);
          const id = to.split("/watch?v=")[1];
          Player.play(id);
        }
      }
      }
    });
  }
};
