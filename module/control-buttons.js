import { Macros } from "./macros.js";

export function initControlButtons() {

  CONFIG.Canvas.layers.devastra = { layerClass: ControlsLayer, group: "primary" };

  Hooks.on("getSceneControlButtons", (btns) => {

    console.log("canvas.tokens = ", canvas.tokens);
    console.log("btns = ", btns);
    console.log("btns.tokens = ", btns.tokens);
    if (game.user.isGM) {
      btns.tokens = {
        name: "devastra",
        activeTool: "gm-manager",
        order: 999,
        title: "Devâstra",
        icon: "fas fa-trillium",
        visible: true,
        onChange: (event, active) => { Macros.showPlayersGMManagerButtons(event, active); },
        tools: {}
      };
      btns.tokens.tools.gm_manager = {
        name: "gm-manager",
        order: 0,
        title: game.i18n.localize("DEVASTRA.GMManager.Title"),
        icon: "fa fa-crosshairs-simple",
        button: true,
        visible: true,
        toggle: true,
        onChange: (event, active) => { Macros.clickGMManagerButton(event, active); }
      };
      btns.tokens.tools.players_manager = {
        name: "players-manager",
        order: 0,
        title: game.i18n.localize("DEVASTRA.PlayersManager.Title"),
        icon: "fa-solid fa-users",
        button: true,
        visible: true,
        toggle: true,
        onChange: (event, active) => { Macros.clickPlayersManagerButton(event, active); }
      };
      console.log("btns.tokens = ", btns.tokens);
      console.log("game.canvas = ", game.canvas);


      
    }
  })
};