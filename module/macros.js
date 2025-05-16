export class Macros {
    static launchGMManager = function() {
        console.log("Clic sur icône GM MANAGER");

        if (!foundry.applications.instances.has("gm-manager")) {
            game.devastra.gmManager.render(true)
        } else {
            game.devastra.gmManager.close()
        }
    }

    static launchPlayersManager = function() {
        console.log("Clic sur icône PLAYERS MANAGER");

        if (!foundry.applications.instances.has("players-manager")) {
            game.devastra.playersManager.render(true)
        } else {
            game.devastra.playersManager.close()
        }
    }
}