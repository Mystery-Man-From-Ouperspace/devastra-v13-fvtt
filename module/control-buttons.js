export function initControlButtons() {

  // CONFIG.Canvas.layers.devastra = { layerClass: ControlsLayer, group: "primary" };

  /*
  Hooks.on("getSceneControlButtons", (btns) => {
    let menu = [];

    if (game.user.isGM) {
      menu.push({
        name: "gm-manager",
        title: game.i18n.localize("DEVASTRA.GMManager.Title"),
        icon: "fa fa-crosshairs-simple",
        button: true,
        onClick: () => { game.devastra.macros.launchGMManager(); }
      });

      menu.push({
        name: "players-manager",
        title: game.i18n.localize("DEVASTRA.PlayersManager.Title"),
        icon: "fa-solid fa-users",
        button: true,
        onClick: () => { game.devastra.macros.launchPlayersManager(); }
      });


      btns.push({
        name: "devastra",
        title: "Devâstra",
        icon: "fas fa-trillium",
        layer: "devastra",
        tools: menu
      });
    }
  });
  */

  Hooks.on("getSceneControlButtons", (controls) => {

    const menu = {
      name: "devastra_button",
      title: "Devâstra",
      icon: "fas fa-trillium",
      tools: {
        gm_manager: {
          name: "gm_manager",
          title: game.i18n.localize("DEVASTRA.GMManager.Title"),
          icon: "fa fa-crosshairs-simple",
          visible: game.user.isGM,
          onChange: (_event, active)  => {
            console.log("Clic sur icône GM MANAGER");
            game.devastra.gmManager.render(true);
            // controls.devastra_button.tools.gm_manager.button = true;
            // controls.devastra_button.tools.players.button = false;
          },
          button: true,
        },
        players_manager: {
          name: "players_manager",
          title: game.i18n.localize("DEVASTRA.PlayersManager.Title"),
          icon: "fa-solid fa-users",
          visible: game.user.isGM,
          onChange: (_event, active) => { 
            console.log("Clic sur icône PLAYERS MANAGER");
            game.devastra.playersManager.render(true);
            // controls.devastra_button.tools.gm_manager.button = false;
            // controls.devastra_button.tools.players.button = true;
          },
          button: true,
        },
      },
    }

    controls.devastra_button = menu
  });
}