export class Macros {
    static launchGMManager = function() {
        game.devastra.gmManager.render(true);
        console.log("Clic sur icône GM MANAGER");
    }

    clickGMManagerButton = function(event, active) {
        console.log("Clic sur icône GM MANAGER");
        if (event = 'onClick') {
            if (active) {
                game.devastra.gmManager.render(true);
            } else {
                game.devastra.playersManager.render(true);
            }
        }
    }

    static launchPlayersManager = function() {
        game.devastra.playersManager.render(true);
        console.log("Clic sur icône PLAYERS MANAGER");
    }
    
    static clickPlayersManagerButton = function(event, active) {
        console.log("Clic sur icône PLAYERS MANAGER");
        if (event = 'onClick') {
            if (active) {
                game.devastra.playersManager.render(true);
            } else {
                game.devastra.gmManager.render(true);
            }
        }
    }

    static showPlayersGMManagerButtons(event, active) {
        console.log("Clic sur icône DEVÂSTRA");
        if (event = 'onClick' && active) {
            game.devastra.render(true);
        }
    }

}