export function initControlButtons() {
  Hooks.on("getSceneControlButtons", (controls) => {
    controls.devastra = {
      activeTool: "gm_manager",
      name: "devastra",
      title: "Devâstra",
      icon: "fas fa-trillium",
      layer: "devastra",
      tools: {
        gm_manager: {
          name: "gm_manager",
          title: game.i18n.localize("DEVASTRA.GMManager.Title"),
          icon: "fa fa-crosshairs-simple",
          visible: game.user.isGM,
          button: true,
          onChange: (event, active) => {
            console.log("Clic sur icône GM MANAGER")
            game.devastra.gmManager.render(true)
            // controls.devastra_button.tools.gm_manager.button = true;
            // controls.devastra_button.tools.players.button = false;
          },
        },
        players_manager: {
          name: "players_manager",
          title: game.i18n.localize("DEVASTRA.PlayersManager.Title"),
          icon: "fa-solid fa-users",
          visible: game.user.isGM,
          button: true,
          onChange: (event, active) => {
            console.log("Clic sur icône PLAYERS MANAGER")
            game.devastra.playersManager.render(true)
            // controls.devastra_button.tools.gm_manager.button = false;
            // controls.devastra_button.tools.players.button = true;
          },
        },
      },
    }
  })
}
