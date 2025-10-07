import { DEVASTRAActor } from "./actor/actor.js";
import { DEVASTRAItem } from "./item/item.js";

import { DEVASTRACharacterSheet } from "./actor/character-sheet.js";
import { DEVASTRAPNJSheet } from "./actor/npc-sheet.js";
import { DEVASTRAMonsterSheet } from "./actor/monster-sheet.js";

import { DEVASTRAItemSheet } from "./item/item-sheet.js";
import { DEVASTRAEnseignementSheet } from "./item/enseignement-sheet.js";
import { DEVASTRADevastraSheet } from "./item/devastra-sheet.js";
import { DEVASTRAPouvoirSheet } from "./item/pouvoir-sheet.js";
import { DEVASTRAMagieSheet } from "./item/magie-sheet.js";
import { DEVASTRADharmaSheet } from "./item/dharma-sheet.js";
import { DEVASTRAKarmaSheet } from "./item/karma-sheet.js";
import { DEVASTRANoteSheet } from "./item/note-sheet.js";
import { DEVASTRABlessureOuStatutSheet } from "./item/blessureoustatut-sheet.js";
import { DEVASTRABenedictionOuMaledictionSheet } from "./item/benedictionoumalediction-sheet.js";

import { DEVASTRA } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { registerHandlebarsHelpers } from "./helpers.js";


import { GMManager } from "./applications/gm/gm-manager.js";
import { PlayersManager } from "./applications/gm/players-manager.js";
import { Macros } from "./macros.js";
import { initControlButtons } from "./control-buttons.js";

import { ModifiedDialog } from "./modified-dialog.js";

globalThis.SYSTEM = DEVASTRA;

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


Hooks.on("renderSettings", (app, html) => {

  console.log("Sidebar mise à jour");

  // On prend le premier <h4 class="divider">
  const gameSettingsHeader = html.querySelector("h4.divider");

  if (!gameSettingsHeader) {
    kultLogger("No header <h4.divider> found in parameters");
    return;
  }

  // Création de la section personnalisée
  const section = document.createElement("section");
  section.classList.add("settings", "flexcol");

  section.innerHTML = `
<section class="links flexcol">
<h4 class="divider">`+game.i18n.localize("DEVASTRA.LiensUtiles")+`</h4>
`
if (game.user.isGM) {
  // Définition troisième bouton
  const linkSection3 = document.createElement("section");
  linkSection3.classList.add("settings", "flexcol");
  const button3 = document.createElement("button");
  button3.type = "button";
  button3.innerHTML = `<sup><i class="fa-solid fa-crosshairs-simple"></i></sup>
`+game.i18n.localize("DEVASTRA.GMManager.Title");
  button3.addEventListener("click", ev => {
    ev.preventDefault();
    game.devastra.gmManager.render(true);
  });
  linkSection3.appendChild(button3);
  section.appendChild(linkSection3);

  // Définition second bouton
  const linkSection2 = document.createElement("section");
  linkSection2.classList.add("settings", "flexcol");
  const button2 = document.createElement("button");
  button2.type = "button";
  button2.innerHTML = `<sup><i class="fa-solid fa-users"></i></sup>
`+game.i18n.localize("DEVASTRA.PlayersManager.Title");
  button2.addEventListener("click", ev => {
    ev.preventDefault();
    game.devastra.playersManager.render(true);
  });
  linkSection2.appendChild(button2);
  section.appendChild(linkSection2);
}

  // Définition Speech
  const textSection = document.createElement("section");
  textSection.classList.add("settings", "flexcol");
  const details = document.createElement("details");
  details.innerHTML = `
<summary><small>`+game.i18n.localize("DEVASTRA.AntreMonde")+`</small></summary>
<small style="text-align: center;">
<p>
`+game.i18n.localize("DEVASTRA.AntreMondeSpeech")+`</p>
<p>
`+game.i18n.localize("DEVASTRA.AntreMondeSpeechSuite")+`
</p>
</small>
`
  textSection.appendChild(details);
  section.appendChild(textSection);

  // Définition premier bouton
  const linkSection = document.createElement("section");
  linkSection.classList.add("settings", "flexcol");
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = `<img style="border:none; height:1.3rem ;width:auto; top:0rem ; position:relative" src="https://antre-monde.com/wp-content/uploads/2023/02/332223005_752862759877702_5641801807816806966_n.png">
`+game.i18n.localize("DEVASTRA.Links.SiteWebEditeur")+`<sup><i class="fa-light fa-up-right-from-square"></i></sup>`;
  button.addEventListener("click", ev => {
    ev.preventDefault();
    window.open(game.i18n.localize("DEVASTRA.Links.SiteWebEditeurURL"), "_blank");
  });
  linkSection.appendChild(button);
  section.appendChild(linkSection);


  // Définition des liens
  const linkKeys = [
    { icon: "fa fa-basket-shopping", key: "AcheterCompendium" },
    { icon: "fa fa-globe-pointer", key: "SiteWebDevastra" },
  ];

  for (const link of linkKeys) {
    const localizedText = game.i18n.localize(`DEVASTRA.Links.${link.key}`);
    const localizedURL = game.i18n.localize(`DEVASTRA.Links.${link.key}URL`);
    const linkSection = document.createElement("section");
    linkSection.classList.add("settings", "flexcol");

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<i class="${link.icon}"></i> ${localizedText} <sup><i class="fa-light fa-up-right-from-square"></i></sup>`;
    button.addEventListener("click", ev => {
      ev.preventDefault();
      window.open(localizedURL, "_blank");
    });

    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }

  // Insère la section avant le premier header
  gameSettingsHeader.parentNode.insertBefore(section, gameSettingsHeader);

});


/**
 * Init hook.
 */
Hooks.once("init", async function () {
  // console.log(`DEVASTRA System | Initializing`);

  game.system.CONST = SYSTEM;
  
  game.devastra = {
    config: DEVASTRA,
    macros: Macros,
  };

  // Define socket
  /*
  game.socket.on("system.devastra", (data) => {
    DevastraUtils.performSocketMesssage(data);
  });
  */

  // CONFIG.DEVASTRA = DEVASTRA;

  /*
  // Define custom Entity classes
  CONFIG.Actor.documentClass = documents.CtHackActor;
  CONFIG.Actor.dataModels = {
    character: models.CtHackCharacter,
    opponent: models.CtHackOpponent
  }

  CONFIG.Item.documentClass = documents.CtHackItem;
  CONFIG.Item.dataModels = {
    ability: models.CtHackAbility,
    archetype: models.CtHackArchetype,
    attack: models.CtHackAttack,
    definition: models.CtHackDefinition,
    item: models.CtHackItem,
    magic: models.CtHackMagic,
    weapon: models.CtHackWeapon,
    opponentAbility: models.CtHackOpponentAbility
  };
  */

  // Game Settings
  function delayedReload() {window.setTimeout(() => location.reload(), 500)}
/*
  game.settings.register("devastra", "autoWoundsNPC", {
    name: game.i18n.localize("DEVASTRA.TenirAutomatiquementDecompteBlessures"),
    hint: game.i18n.localize("DEVASTRA.CocherOptionAutoWounds"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: delayedReload
  });

  */


  game.settings.register("devastra", "viseur0", {
    name: game.i18n.localize("DEVASTRA.Mandala 0 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 0"),
    scope: "world",
    config: false,
    default: true,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur1", {
    name: game.i18n.localize("DEVASTRA.Mandala 1 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 1"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur2", {
    name: game.i18n.localize("DEVASTRA.Mandala 2 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 2"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur3", {
    name: game.i18n.localize("DEVASTRA.Mandala 3 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 3"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur4", {
    name: game.i18n.localize("DEVASTRA.Mandala 4 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 4"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur5", {
    name: game.i18n.localize("DEVASTRA.Mandala 5 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 5"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur6", {
    name: game.i18n.localize("DEVASTRA.Mandala 6 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 6"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register("devastra", "viseur7", {
    name: game.i18n.localize("DEVASTRA.Mandala 7 sélectionné"),
    hint: game.i18n.localize("DEVASTRA.Cocher cette option activera le rang d'action 7"),
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register("devastra", "sonorizedMandalaInterface", {
    name: game.i18n.localize("DEVASTRA.SonoriserInterfaceMandala"),
    hint: game.i18n.localize("DEVASTRA.DecocherOptionRendraInterfaceSilencieuse"),
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
    onChange: delayedReload
  });
  

/*
  game.settings.register("devastra", "playersEditItems", {
    name: game.i18n.localize("DEVASTRA.AutoriserJoueusesModifItems"),
    hint: game.i18n.localize("DEVASTRA.CocherOptionAutoriseraJoueuses"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: delayedReload
  });
*/


  game.settings.register("devastra", "chakra", {
    name: game.i18n.localize("DEVASTRA.ChakraWheel"),
    hint: game.i18n.localize("DEVASTRA.CheckingOptionEnablesChakraWheelInsteadOfDevasFaceWheel"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: delayedReload
  });

  const chakra = game.settings.get("devastra", "chakra");
  document.body.classList.add(chakra ? "chakra" : "deva-face");  



   /**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
  /*
	CONFIG.Combat.initiative = {
        formula: "@initiative",
        decimals: 0
      };
*/
  
  // Define custom Document classes
  CONFIG.Actor.documentClass = DEVASTRAActor;
  CONFIG.Item.documentClass = DEVASTRAItem;
  // Register sheet application classes
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet("devastra", DEVASTRACharacterSheet, { types: ["character"], makeDefault: true }); // ligne modifiée selon directives de LeRatierBretonnien
  foundry.documents.collections.Actors.registerSheet("devastra", DEVASTRAPNJSheet, { types: ["npc"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("devastra", DEVASTRAMonsterSheet, { types: ["monster"], makeDefault: true });
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRAItemSheet, { types: ["item"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRAEnseignementSheet, { types: ["enseignement"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRADevastraSheet, { types: ["devastra"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRAPouvoirSheet, { types: ["pouvoir"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRAMagieSheet, { types: ["magie"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRADharmaSheet, { types: ["dharma"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("devastra", DEVASTRAKarmaSheet, { types: ["karma"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("note", DEVASTRANoteSheet, { types: ["note"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("blessureoustatut", DEVASTRABlessureOuStatutSheet, { types: ["blessureoustatut"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("benedictionoumalediction", DEVASTRABenedictionOuMaledictionSheet, { types: ["benedictionoumalediction"], makeDefault: true });


  // Init new buttons for the system
  // initControlButtons();
  

  // Preload template partials
  await preloadHandlebarsTemplates();

  // Register Handlebars Helpers
  registerHandlebarsHelpers();

  // Modify Runtime configuration settings / Added by MMFO  Items.registerSheet("devastra", DEVASTRAMagieSheet, { types: ["attribute"], makeDefault: true });

  await modifyConfigurationSettings();

  
  // Game Manager
  game.devastra.gmManager = new GMManager();

  game.devastra.playersManager = new PlayersManager();


  // console.log(`DEVASTRA System | Initialized`);
});


/* -------------------------------------------- */

async function modifyConfigurationSettings() {
  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   *
   **/

  /**
   * Configuration for the Actor document
   */
  CONFIG.Actor.compendiumBanner = "/systems/devastra/images/banners/actor-banner.webp";

  /**
   * Configuration for the Adventure document
   */
  CONFIG.Adventure.compendiumBanner = "/systems/devastra/images/banners/adventure-banner.webp";

  /**
   * Configuration for the Cards primary Document type
   */
  CONFIG.Cards.compendiumBanner = "ui/banners/cards-banner.webp";

  /**
   * Configuration for Item document
   */
  CONFIG.Item.compendiumBanner = "/systems/devastra/images/banners/item-banner.webp";

  /**
   * Configuration for the JournalEntry document
   */
  CONFIG.JournalEntry.compendiumBanner = "/systems/devastra/images/banners/journalentry-banner.webp";

  /**
   * Configuration for the Macro document
   */
  CONFIG.Macro.compendiumBanner = "ui/banners/macro-banner.webp";

  /**
   * Configuration for the Playlist document
   */
  CONFIG.Playlist.compendiumBanner = "ui/banners/playlist-banner.webp";

  /**
   * Configuration for RollTable random draws
   */
  CONFIG.RollTable.compendiumBanner = "ui/banners/rolltable-banner.webp";

  /**
   * Configuration for the Scene document
   */
  CONFIG.Scene.compendiumBanner = "/systems/devastra/images/banners/scene-banner.webp";
}

Hooks.once("i18nInit", function () {
  // Prélocalisation des objets de configuration
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
      }
    }
  };

  localizeConfigObject(DEVASTRA.ITEMSUBTYPES, ["label"]);
  localizeConfigObject(DEVASTRA.MAGIESUBTYPES, ["label"]);
}


/* -------------------------------------------- */
/*  Chat Message Hooks                          */
/* -------------------------------------------- */
// Hooks for Blue Buttons in Chat

Hooks.on("renderChatMessage", (app, html, data,) => {

  const defencecalculateButton = html[0].querySelector("[class='smart-blue-button defence-calculate-click']");
  const attackscalculateButton1 = html[0].querySelector("[class='smart-blue-button attacks-calculate-click']");
  const attackscalculateButton2 = html[0].querySelector("[class='smart-blue-button attacks-auto-calculate-click']");
  const attackscalculateButton3 = html[0].querySelector("[class='smart-blue-button attacks-off-auto-calculate-click']");
  const damageButton = html[0].querySelector("[class='smart-blue-button damage-calculate-click']");
  const damagedoneButton = html[0].querySelector("[class='smart-blue-button damage-done-calculate-click']");
  const shakticalculateButton = html[0].querySelector("[class='smart-blue-button shakti-defence-calculate-click']");

  const damageapplyButton = html[0].querySelector("[class='smart-blue-button damage-apply-click']");


  if (damageapplyButton != undefined && damageapplyButton != null) {
    damageapplyButton.addEventListener('click', () => {

      // console.log("On est bien dans damageapplyButton");

      // La joueuse ou le PNJ calcule depuis le Tchat les dommages de l'attaque infligée

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on calcule les dommages infligés
      */

      var myActorId = "";
      var theActiveActor = null;
      var opponentFlag = false;
      var tokenFlag = false;
      var myToken = null;
      var thatToken = null;
      var thisTokens = null;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        opponentFlag = true;
        theActiveActor = game.actors.get(myActorId);
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id == opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        if (tokenFlag) { theActiveActor = myToken.actor };
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) { theOpponentActor = myToken.actor };
    

      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      _showAppliedDamageInChat(
        theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
      );

    })
  };

  
  
  if (damagedoneButton != undefined && damagedoneButton != null) {
    damagedoneButton.addEventListener('click', () => {

      // console.log("On est bien dans damagedoneButton");

      // La joueuse ou le PNJ calcule depuis le Tchat les dommages de l'attaque infligée

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      /*
      Ici on calcule les dommages infligés
      */


      let myActorId = "";
      let theActiveActor = null;
      let tokenFlag = false;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        var myToken;
        let thatToken;
        let thisTokens;
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id === opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;     
          };
        }; 
        theActiveActor = myToken.actor;
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) theOpponentActor = myToken.actor;
    
      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      _showCalculateDamageInChat(
        theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
        );

    })

  }


  if (damageButton != undefined && damageButton != null) {
    damageButton.addEventListener('click', () => {

      // console.log("On est bien dans damageButton");

      // La joueuse ou le PNJ calcule depuis le Tchat les dommages de l'attaque encaissée

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on calcule les dommages encaissés
      */

      let myActorId = "";
      let theActiveActor = null;
      let tokenFlag = false;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        var myToken;
        let thatToken;
        let thisTokens;
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id === opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        theActiveActor = myToken.actor;
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) theOpponentActor = myToken.actor;
    
      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      _showCalculateDamageInChat(
        theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
        );

    })
  }


  if (shakticalculateButton != undefined && shakticalculateButton != null) {
    shakticalculateButton.addEventListener('click', () => {

      // console.log("On est bien dans shakticalculatebutton");

      // La joueuse ou le PNJ utilise de la shakti depuis le Tchat pour sa défense contre une attaque


      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      // Ici on fait remplir les paramètres de shakti par le défenseur


      let myActorId = "";
      let theActiveActor = null;
      let tokenFlag = false;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        var myToken;
        let thatToken;
        let thisTokens;
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id === opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        theActiveActor = myToken.actor;
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) theOpponentActor = myToken.actor;
    

      /*
      if (myActor == undefined) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error7"));
        return;
      };
      */

      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);


      if (game.user.isGM) {
        isOwner = true;
      }


      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      let myTitle = game.i18n.localize("DEVASTRA.ShaktiEnDefense");
      let myDialogOptions = {
        classes: ["devastra", "sheet"]
      };
      let template = "";


      _treatShaktiDialog (
        theActiveActor, template, myTitle, myDialogOptions, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
      );

  
    })
  };


  if (defencecalculateButton != undefined && defencecalculateButton != null) {
    defencecalculateButton.addEventListener('click', () => {

      // La joueuse ou le PNJ calcule depuis le Tchat sa défense contre une attaque


      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on fait remplir les paramètres de lancer de dés pour le défenseur
      */

      if (opposantficheId == "" || opposantficheId == "0") {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error7"));
        return;
      };

      
      var myActorId = "";
      var theActiveActor = null;
      var opponentFlag = false;
      var tokenFlag = false;
      var myToken = null;
      var thatToken = null;
      var thisTokens = null;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        opponentFlag = true;
        theActiveActor = game.actors.get(myActorId);
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id == opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        if (tokenFlag) { theActiveActor = myToken.actor };
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) { theOpponentActor = myToken.actor };
    

      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      let myTitle = game.i18n.localize("DEVASTRA.TitreJetDeDefense").replace("^0", theActiveActor.name);
      let myDialogOptions = {
        classes: ["devastra", "sheet"]
      };
      let template = "";

      let theShakti = "0";

      if (theActiveActor.type == 'npc' || theActiveActor.type == 'monster') {

        _treatSkillDiceRollDefenceNPCDialog(
          theActiveActor, template, myTitle, myDialogOptions, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
          consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
          selectedinventorypower, selectedinventorymagic, damage, damagetype, theShakti
        );

      } else {

        _treatSkillDiceRollDefenceDialog(
          theActiveActor, template, myTitle, myDialogOptions, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
          consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
          selectedinventorypower, selectedinventorymagic, damage, damagetype, theShakti
        );

      }

    })
  
  }

  
  if (attackscalculateButton3 != undefined && attackscalculateButton3 != null) {
    attackscalculateButton3.addEventListener('click', () => {
      // La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a évitées
      // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

      // console.log("La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a évitées");

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on calcule les blessures évitées
      */


      var myActorId = "";
      var theActiveActor = null;
      var opponentFlag = false;
      var tokenFlag = false;
      var myToken = null;
      var thatToken = null;
      var thisTokens = null;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        opponentFlag = true;
        theActiveActor = game.actors.get(myActorId);
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id == opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        if (tokenFlag) { theActiveActor = myToken.actor };
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) { theOpponentActor = myToken.actor }; 
      

      // let myOpponent = myToken.actor;

      // let myActor = game.actors.get(attaquantficheId);

      /*
      if (myActor == undefined) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error7"));
        return;
      };
      */

      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      let theShakti = "0";
      if (shakti != "") {theShakti = shakti;};

      _showCalculateShaktiInChat(
        theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, theShakti
      );

    });
  };


  if (attackscalculateButton2 != undefined && attackscalculateButton2 != null) {
    attackscalculateButton2.addEventListener('click', () => {
      // La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a reçues
      // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

      // console.log("La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a reçues");

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;

      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on calcule les blessures reçues
      */

      var myActorId = "";
      var theActiveActor = null;
      var opponentFlag = false;
      var tokenFlag = false;
      var myToken = null;
      var thatToken = null;
      var thisTokens = null;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        opponentFlag = true;
        theActiveActor = game.actors.get(myActorId);
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id == opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        if (tokenFlag) { theActiveActor = myToken.actor };
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) { theOpponentActor = myToken.actor };
    
      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      let theShakti = "0";

      _showCalculateShaktiInChat(
        theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
        consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
        selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, theShakti
        );
    });
  }

  if (attackscalculateButton1 != undefined && attackscalculateButton1 != null) {
    attackscalculateButton1.addEventListener('click', () => {

      // La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a infligées
      // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

      // console.log("La joueuse effectue depuis le Tchat le calcul des blessures qu'elle a infligées");

      // On récupère les datas de l'attaquant dans le Tchat
      const nd = html[0].querySelector("span[class='nd']").textContent;
      const total = html[0].querySelector("span[class='total']").textContent;
      const attaquantficheId = html[0].querySelector("span[class='attaquantficheId']").textContent;
      const opposantficheId = html[0].querySelector("span[class='opposantficheId']").textContent;
      const opposanttokenId = html[0].querySelector("span[class='opposanttokenId']").textContent;

      const consideropponentprotection = html[0].querySelector("span[class='consideropponentprotection']").textContent;
      const isinventory = html[0].querySelector("span[class='isinventory']").textContent;
      const weapon = html[0].querySelector("span[class='weapon']").textContent;
      const devastra = html[0].querySelector("span[class='devastra']").textContent;
      const power = html[0].querySelector("span[class='power']").textContent;
      const magic = html[0].querySelector("span[class='magic']").textContent;

      const selectedinventory = html[0].querySelector("span[class='selectedinventory']").textContent;
      const selectedinventorydevastra = html[0].querySelector("span[class='selectedinventorydevastra']").textContent;
      const selectedinventorypower = html[0].querySelector("span[class='selectedinventorypower']").textContent;
      const selectedinventorymagic = html[0].querySelector("span[class='selectedinventorymagic']").textContent;
      const damage = html[0].querySelector("span[class='damage']").textContent;
      const damagetype = html[0].querySelector("span[class='damagetype']").textContent;

      const defence = html[0].querySelector("span[class='defence']").textContent;

      const shakti = html[0].querySelector("span[class='shakti']").textContent;


      // console.log("opposanttokenId = ", opposanttokenId);

      /*
      Ici on calcule les blessures infligées
      */


      var myActorId = "";
      var theActiveActor = null;
      var opponentFlag = false;
      var tokenFlag = false;
      var myToken = null;
      var thatToken = null;
      var thisTokens = null;
    
      if (opposantficheId == "" || opposantficheId == "0") {
      myActorId = attaquantficheId;
      theActiveActor = game.actors.get(myActorId);
      } else {
        myActorId = opposantficheId;
        opponentFlag = true;
        theActiveActor = game.actors.get(myActorId);
        thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
        for (let theToken in thisTokens) {
          thatToken = thisTokens[theToken];
          if (thatToken.document.id == opposanttokenId) {
            myToken = thatToken;
            tokenFlag = true;
          };
        }; 
        if (tokenFlag) { theActiveActor = myToken.actor };
      }
      let theAttackantActor = game.actors.get(attaquantficheId);
      let theOpponentActor;
      if (tokenFlag) { theOpponentActor = myToken.actor };
    

      // On vérifie d'abord que c'est la bonne joueuse ou PNJ, sinon on ne fait rien
      let myUserId = game.user.id;
      let isOwner = (theActiveActor.ownership[myUserId] == CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

      if (game.user.isGM) {
        isOwner = true;
      }

      if (!(isOwner)) {
        ui.notifications.warn(game.i18n.localize("DEVASTRA.Error3"));
        return;
      };

      let theDefence = "0";
      if (defence != "") theDefence = defence;
      let theShakti = "0";
      if (shakti != "") theShakti = shakti;

      if (opponentFlag) {

        _showCalculateShaktiInChat(
          theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
          consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
          selectedinventorypower, selectedinventorymagic, damage, damagetype, theDefence, theShakti
        );

      } else {

        _showCalculateAttacksInChat(
          theActiveActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
          consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
          selectedinventorypower, selectedinventorymagic, damage, damagetype, theDefence, theShakti
        );

      }

    })

  }

})


/* -------------------------------------------- */

async function _showCalculateDamageInChat (
  myActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
  consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
  selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
  ) {

  // console.log("_showCalculateDamageInChat");
  // Ici on calcule les dégâts individuels reçus ou bien les dégâts collectifs infligés

  var myTotal = 0;
  if (total != "") { myTotal = parseInt(total); };
  var myDefence = 0;
  if (defence != "") { myDefence = parseInt(defence); };
  var myShakti = 0;
  if (shakti != "") { myShakti = parseInt(shakti); };
  const youwin = ((myTotal - (myDefence + myShakti)) <= 0);

  var myActorId = "";
  var theActiveActor = null;
  var opponentFlag = false;
  var tokenFlag = false;
  var myToken = null;
  var thatToken = null;
  var thisTokens = null;

  if (opposantficheId == "" || opposantficheId == "0") {
  myActorId = attaquantficheId;
  theActiveActor = game.actors.get(myActorId);
  } else {
    myActorId = opposantficheId;
    opponentFlag = true;
    theActiveActor = game.actors.get(myActorId);
    thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
    for (let theToken in thisTokens) {
      thatToken = thisTokens[theToken];
      if (thatToken.document.id == opposanttokenId) {
        myToken = thatToken;
        tokenFlag = true;
      };
    }; 
    if (tokenFlag) { theActiveActor = myToken.actor };
  }
  let theAttackantActor = game.actors.get(attaquantficheId);
  let theOpponentActor;
  if (tokenFlag) { theOpponentActor = myToken.actor };

  const optNone = game.i18n.localize("DEVASTRA.opt.none");
  const myDamage = parseInt(damage);

  var myDamageType = optNone;
  const theDamageType = damagetype.toString();
  switch (theDamageType) {
    case "1": myDamageType = "@domains.dph";
    break;
    case "2": myDamageType = "@domains.dma";
    break;
    case "3": myDamageType = "@domains.din";
    break;
    case "4": myDamageType = "@domains.dso";
    break;
    case "5": myDamageType = "@domains.dmy";
    break;
    default: myDamageType = optNone;
  }

  var sentence1 = "";
  var sentence2 = "";
  var sentence3 = "";
  var sentence4 = "";
  var sentence5 = "";
  var sentence6 = "";
  var sentence7 = "";

  // var pdc = 0; // J'avais oublié de calculer ça ! :
  var pdc = myTotal - (myDefence + myShakti);
  var pdcMinusArmor = 0;

  sentence6 = game.i18n.localize("DEVASTRA.TotalDamageArmorOff");
  // sentence6 = game.i18n.localize("DEVASTRA.TotalDamageArmorIn");
  if (consideropponentprotection === "true") {
    sentence7 = game.i18n.localize("DEVASTRA.ArmorIn");
  } else {
    sentence7 = game.i18n.localize("DEVASTRA.ArmorOff");
  }


  // Ici on calcul le total des dommages (hors résistance armure du défenseur) de l'attaquant    
  var item;
  var myItem;

  var myWeaponDamageBase = 0;
  var myWeaponDamage = "";

  var myDevastraDamageBase = 0;
  var myDevastraDamage = "";

  var myPowerDamageBase = 0;
  var myPowerDamage = "";

  var myMagicDamageBase = 0;
  var myMagicDamage = "";

  // console.log("isinventory = ", isinventory);
  if (isinventory === "true") {

    if (devastra === "false") {
      myItem = undefined;

      let myWeaponDamageTab;

      if (selectedinventory == "0" || selectedinventory == "-1") {
        myWeaponDamageBase = 0;
        myWeaponDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'item')) {
          if (item._id == selectedinventory) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myWeaponDamageBase = parseInt(myItem.system.damage_base);
          myWeaponDamage = myItem.system.damage;

          let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

          // console.log("myNewWeaponDamage = ", myNewWeaponDamage);
  
          myWeaponDamageTab = myNewWeaponDamage.split("+");
          // console.log("myWeaponDamageTab = ", myWeaponDamageTab);

          for (let theWeaponDamage in myWeaponDamageTab) {
            // console.log("theWeaponDamage = ", theWeaponDamage);
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
            // console.log("myWeaponDamageTab[theWeaponDamage] = ", myWeaponDamageTab[theWeaponDamage]);
          }
        }
      }
      pdc += parseInt(myWeaponDamageBase);
      // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
      // console.log("myWeaponDamage = ", myWeaponDamage);
      sentence2 = game.i18n.localize("DEVASTRA.SentenceIsInventory").replace("^0", myWeaponDamageBase).replace("^1", myWeaponDamage);
    } else {
      myItem = undefined;

      let myDevastraDamageTab;

      if (selectedinventorydevastra == "0") {
        myDevastraDamageBase = 0;
        myDevastraDamage = "";
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'devastra')) {
          if (item._id == selectedinventorydevastra) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myDevastraDamageBase = parseInt(myItem.system.damage_base);
          myDevastraDamage = myItem.system.damage;

          let myNewDevastraDamage = myDevastraDamage.replaceAll(" ", "");
  
          myDevastraDamageTab = myNewDevastraDamage.split("+");

          for (let theDevastraDamage in myDevastraDamageTab) {
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myDevastraDamageTab[theDevastraDamage]));
          }

        }
      }
      pdc += parseInt(myDevastraDamageBase);
      // console.log("myDevastraDamageBase = ", myDevastraDamageBase);
      // console.log("myDevastraDamage = ", myDevastraDamage);
      sentence2 = game.i18n.localize("DEVASTRA.SentenceIsDevastra").replace("^0", myDevastraDamageBase).replace("^1", myDevastraDamage);
    }

  }

  if (isinventory === "true" && power === "true") {
    myItem = undefined;

    let myPowerDamageTab;

    if (selectedinventorypower == "0") {
      myPowerDamageBase = 0;
      myPowerDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'pouvoir')) {
        if (item._id == selectedinventorypower) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myPowerDamageBase = parseInt(myItem.system.damage_base);
        myPowerDamage = myItem.system.damage;

        let myNewPowerDamage = myPowerDamage.replaceAll(" ", "");

        myPowerDamageTab = myNewPowerDamage.split("+");

        for (let thePowerDamage in myPowerDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myPowerDamageTab[thePowerDamage]));
        }
    
      }
    }
    pdc += parseInt(myPowerDamageBase);


    // console.log("myPowerDamageBase = ", myPowerDamageBase);
    // console.log("myPowerDamage = ", myPowerDamage);
    sentence3 = game.i18n.localize("DEVASTRA.SentenceIsPower").replace("^0", myPowerDamageBase).replace("^1", myPowerDamage);

  }

  // console.log("magic = ", magic);
  if (isinventory === "true" && magic === "true") {
    myItem = undefined;

    let myMagicDamageTab;

    if (selectedinventorymagic == "0") {
      myMagicDamageBase = 0;
      myMagicDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'magie')) {
        if (item._id == selectedinventorymagic) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myMagicDamageBase = parseInt(myItem.system.damage_base);
        myMagicDamage = myItem.system.damage;
        
        let myNewMagicDamage = myMagicDamage.replaceAll(" ", "");

        myMagicDamageTab = myNewMagicDamage.split("+");

        for (let theMagicDamage in myMagicDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myMagicDamageTab[theMagicDamage]));
        }

      }
    }
    pdc += parseInt(myMagicDamageBase);


    // console.log("myMagicDamageBase = ", myMagicDamageBase);
    // console.log("myMagicDamage = ", myMagicDamage);
    sentence4 = game.i18n.localize("DEVASTRA.SentenceIsMagic").replace("^0", myMagicDamageBase).replace("^1", myMagicDamage);

  }


  if (isinventory === "false") {
    myWeaponDamageBase = myDamage;
    myWeaponDamage = myDamageType;

    let myWeaponDamageTab;
        
    let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

    myWeaponDamageTab = myNewWeaponDamage.split("+");

    pdc += parseInt(myWeaponDamageBase);

    for (let theWeaponDamage in myWeaponDamageTab) {
      pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
    }

    // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
    // console.log("myWeaponDamage = ", myWeaponDamage);
    sentence2 = game.i18n.localize("DEVASTRA.SentenceIsNoInventory").replace("^0", myWeaponDamageBase).replace("^1", myWeaponDamage);

  }

  async function _computeDomain2Val (theActor, myDamage) {
    let domainValue = 0;
    const theDamage = myDamage;
    switch (theDamage) {
      case "@domains.dph":
        domainValue = parseInt(theActor.system.domains.dph.value);
      break;
      case "@domains.dma":
        domainValue = parseInt(theActor.system.domains.dma.value);
      break;
      case "@domains.din":
        domainValue = parseInt(theActor.system.domains.din.value);
      break;
      case "@domains.dso":
        domainValue = parseInt(theActor.system.domains.dso.value);
      break;
      case "@domains.dmy":
        domainValue = parseInt(theActor.system.domains.dmy.value);
      break;
      default: domainValue = 0;
    }
    return domainValue;
  };


  // Ici on calcul le total d'armure du défenseur
  let totalArmor = 0;

  if (opponentFlag) {

    // console.log("consideropponentprotection = ", consideropponentprotection);
    // console.log("opposantficheId = ", opposantficheId);
    if (consideropponentprotection = "true") {
      totalArmor = theOpponentActor.system.armure_total;
    };
    // console.log("totalArmor = ", totalArmor);
    if ((pdc - totalArmor) > 0) {
      pdcMinusArmor = pdc - parseInt(totalArmor);
    } else {
      pdcMinusArmor = 0;
    };

    // console.log("pdc = ", pdc);
    // console.log("pdcMinusArmor = ", pdcMinusArmor);
  };



  let totalresist = myDefence + myShakti;

  const smartTemplate = 'systems/devastra/templates/form/result-damage-apply.html';

  const smartData = {
    nd: nd,

    total: myTotal,

    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,

    consideropponentprotection: consideropponentprotection,

    isinventory: isinventory,
    weapon: weapon,
    devastra: devastra,
    power: power,
    magic: magic,

    selectedinventory: selectedinventory,
    selectedinventorydevastra: selectedinventorydevastra,
    selectedinventorypower: selectedinventorypower,
    selectedinventorymagic: selectedinventorymagic,

    damage: damage,
    damagetype: damagetype,
    
    defence: myDefence,

    shakti: myShakti,

    pdc: pdc,
    pdcminusarmor: pdcMinusArmor,

    sentence1: sentence1,
    sentence2: sentence2,
    sentence3: sentence3,
    sentence4: sentence4,
    sentence5: sentence5,
    sentence6: sentence6,
    sentence7: sentence7,

    totalresist: totalresist,

    youwin: youwin
  };
  // console.log("smartData avant retour func = ", smartData);
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer

 
  
  ChatMessage.create({
    user: game.user.id,
    // speaker: ChatMessage.getSpeaker({ token: this.actor }),
    speaker: ChatMessage.getSpeaker({ actor: theActiveActor }),
    content: smartHtml,
    rollMode: myTypeOfThrow
  });




};


/* -------------------------------------------- */

async function _showCalculateShaktiInChat (
  myActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
  consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
  selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
  ) {

  // console.log("opposanttokenId = ", opposanttokenId);

  var myTotal = 0;
  if (total != "") { myTotal = parseInt(total); };
  var myDefence = 0;
  if (defence != "") { myDefence = parseInt(defence); };
  var myShakti = 0;
  if (shakti != "") { myShakti = parseInt(shakti); };
  const youwin = ((myTotal - (myDefence + myShakti)) <= 0);

  var myActorId = "";
  var theActiveActor = null;
  var opponentFlag = false;
  var tokenFlag = false;
  var myToken = null;
  var thatToken = null;
  var thisTokens = null;

  if (opposantficheId == "" || opposantficheId == "0") {
  myActorId = attaquantficheId;
  theActiveActor = game.actors.get(myActorId);
  } else {
    myActorId = opposantficheId;
    opponentFlag = true;
    theActiveActor = game.actors.get(myActorId);
    thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
    for (let theToken in thisTokens) {
      thatToken = thisTokens[theToken];
      if (thatToken.document.id == opposanttokenId) {
        myToken = thatToken;
        tokenFlag = true;
      };
    }; 
    if (tokenFlag) { theActiveActor = myToken.actor };
  }
  let theAttackantActor = game.actors.get(attaquantficheId);
  let theOpponentActor;
  if (tokenFlag) { theOpponentActor = myToken.actor };


  const optNone = game.i18n.localize("DEVASTRA.opt.none");
  const myDamage = parseInt(damage);

  var myDamageType = optNone;
  const theDamageType = damagetype.toString();
  switch (theDamageType) {
    case "1": myDamageType = "@domains.dph";
    break;
    case "2": myDamageType = "@domains.dma";
    break;
    case "3": myDamageType = "@domains.din";
    break;
    case "4": myDamageType = "@domains.dso";
    break;
    case "5": myDamageType = "@domains.dmy";
    break;
    default: myDamageType = optNone;
  }

  var sentence1 = "";
  var sentence2 = "";
  var sentence3 = "";
  var sentence4 = "";
  var sentence5 = "";
  var sentence6 = "";
  var sentence7 = "";

  // var pdc = 0; // J'avais oublié de calculer ça ! :
  var pdc = myTotal - (myDefence + myShakti);
  var pdcMinusArmor = 0;

  // Ici on calcul le total des dommages (hors résistance armure du défenseur) de l'attaquant    
  var item;
  var myItem;

  var myWeaponDamageBase = 0;
  var myWeaponDamage = "";

  var myDevastraDamageBase = 0;
  var myDevastraDamage = "";

  var myPowerDamageBase = 0;
  var myPowerDamage = "";

  var myMagicDamageBase = 0;
  var myMagicDamage = "";

  // console.log("isinventory = ", isinventory);
  if (isinventory === "true") {

    // console.log("devastra = ", devastra);
    if (devastra === "false") {

      myItem = undefined;
      let myWeaponDamageTab;

      if (selectedinventory == "0" || selectedinventory == "-1") {
        myWeaponDamageBase = 0;
        myWeaponDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'item')) {
          if (item._id == selectedinventory) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myWeaponDamageBase = parseInt(myItem.system.damage_base);
          myWeaponDamage = myItem.system.damage;

          let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

          // console.log("myNewWeaponDamage = ", myNewWeaponDamage);

          myWeaponDamageTab = myNewWeaponDamage.split("+");
          // console.log("myWeaponDamageTab = ", myWeaponDamageTab);

          for (let theWeaponDamage in myWeaponDamageTab) {
            // console.log("theWeaponDamage = ", theWeaponDamage);
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
            // console.log("myWeaponDamageTab[theWeaponDamage] = ", myWeaponDamageTab[theWeaponDamage]);
          }
    
        }
      }
      pdc += parseInt(myWeaponDamageBase);


      // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
      // console.log("myWeaponDamage = ", myWeaponDamage);

    } else {

      myItem = undefined;
      let myDevastraDamageTab;

      if (selectedinventorydevastra == "0") {
        myDevastraDamageBase = 0;
        myDevastraDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'devastra')) {
          if (item._id == selectedinventorydevastra) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myDevastraDamageBase = parseInt(myItem.system.damage_base);
          myDevastraDamage = myItem.system.damage;

          let myNewDevastraDamage = myDevastraDamage.replaceAll(" ", "");

          myDevastraDamageTab = myNewDevastraDamage.split("+");

          for (let theDevastraDamage in myDevastraDamageTab) {
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myDevastraDamageTab[theDevastraDamage]));
          }
    
        }
      }
      pdc += parseInt(myDevastraDamageBase);


      // console.log("myDevastraDamageBase = ", myDevastraDamageBase);
      // console.log("myDevastraDamage = ", myDevastraDamage);
    }
    
  }

  // console.log("power = ", power);
  if (isinventory === "true" && power === "true") {
    myItem = undefined;

    let myPowerDamageTab;

    if (selectedinventorypower == "0") {
      myPowerDamageBase = 0;
      myPowerDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'pouvoir')) {
        if (item._id == selectedinventorypower) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myPowerDamageBase = parseInt(myItem.system.damage_base);
        myPowerDamage = myItem.system.damage;

        let myNewPowerDamage = myPowerDamage.replaceAll(" ", "");

        myPowerDamageTab = myNewPowerDamage.split("+");

        for (let thePowerDamage in myPowerDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myPowerDamageTab[thePowerDamage]));
        }
    
      }
    }
    pdc += parseInt(myPowerDamageBase);


  // console.log("myPowerDamageBase = ", myPowerDamageBase);
    // console.log("myPowerDamage = ", myPowerDamage);
  }

  // console.log("magic = ", magic);
  if (isinventory === "true" && magic === "true") {
    myItem = undefined;

    let myMagicDamageTab;

    if (selectedinventorymagic == "0") {
      myMagicDamageBase = 0;
      myMagicDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'magie')) {
        if (item._id == selectedinventorymagic) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myMagicDamageBase = parseInt(myItem.system.damage_base);
        myMagicDamage = parseInt(myItem.system.damage);
        
        let myNewMagicDamage = myMagicDamage.replaceAll(" ", "");

        myMagicDamageTab = myNewMagicDamage.split("+");

        for (let theMagicDamage in myMagicDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myMagicDamageTab[theMagicDamage]));
        }

      }
    }
    pdc += parseInt(myMagicDamageBase);


    // console.log("myMagicDamageBase = ", myMagicDamageBase);
    // console.log("myMagicDamage = ", myMagicDamage);
  }


  if (isinventory === "false") {
    myWeaponDamageBase = myDamage;
    myWeaponDamage = myDamageType;

    let myWeaponDamageTab;
        
    let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

    myWeaponDamageTab = myNewWeaponDamage.split("+");

    pdc += parseInt(myWeaponDamageBase);

    for (let theWeaponDamage in myWeaponDamageTab) {
      pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
    }

    // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
    // console.log("myWeaponDamage = ", myWeaponDamage);
  }

  async function _computeDomain2Val (theActor, myDamage) {
    let domainValue = 0;
    const theDamage = myDamage;
    switch (theDamage) {
      case "@domains.dph":
        domainValue = parseInt(theActor.system.domains.dph.value);
      break;
      case "@domains.dma":
        domainValue = parseInt(theActor.system.domains.dma.value);
      break;
      case "@domains.din":
        domainValue = parseInt(theActor.system.domains.din.value);
      break;
      case "@domains.dso":
        domainValue = parseInt(theActor.system.domains.dso.value);
      break;
      case "@domains.dmy":
        domainValue = parseInt(theActor.system.domains.dmy.value);
      break;
      default: domainValue = 0;
    }
    return domainValue;
  };

  // console.log("pdc = ", pdc);
  if (opponentFlag) {
    if (youwin) {
      sentence1 = game.i18n.localize("DEVASTRA.YouWin");
      sentence2 = game.i18n.localize("DEVASTRA.YouArentHit").replace("^0", game.actors.get(attaquantficheId).name);
      sentence3 = game.i18n.localize("DEVASTRA.YouArentWounded");
    } else {
      sentence1 = game.i18n.localize("DEVASTRA.YouLose");
      sentence2 = game.i18n.localize("DEVASTRA.YouReHit").replace("^0", game.actors.get(attaquantficheId).name);
      sentence3 = game.i18n.localize("DEVASTRA.YouReWounded").replace("^0", pdc);
    }
  } else {
    
  }

  pdcMinusArmor = pdc - 0;

  let totalresist = myDefence + myShakti;

  const smartTemplate = 'systems/devastra/templates/form/result-shakti.html';

  const smartData = {
    nd: nd,

    total: myTotal,

    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,
    
    consideropponentprotection: consideropponentprotection,

    isinventory: isinventory,
    weapon: weapon,
    devastra: devastra,
    power: power,
    magic: magic,

    selectedinventory: selectedinventory,
    selectedinventorydevastra: selectedinventorydevastra,
    selectedinventorypower: selectedinventorypower,
    selectedinventorymagic: selectedinventorymagic,

    damage: damage,
    damagetype: damagetype,
    
    defence: myDefence,

    shakti: myShakti,

    pdc: pdc,
    pdcminusarmor: pdcMinusArmor,

    sentence1: sentence1,
    sentence2: sentence2,
    sentence3: sentence3,

    totalresist: totalresist,

    youwin: youwin
  };
  // console.log("smartData avant retour func = ", smartData);
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer


  // console.log("opposantficheId = ", opposantficheId);
  // console.log("attaquantficheId = ", attaquantficheId);
  // console.log("theActorId = ", theActorId);

  let piledejetonsShakti = -999;
  // console.log("myActor.type = ", theActiveActor.type);
  if (theActiveActor.type === "character") {
    piledejetonsShakti = parseInt(await theActiveActor.system.shakti.piledejetons);
  } else {
    piledejetonsShakti = parseInt(await theActiveActor.system.shakti_initiale.value);
  };
  // console.log("myShakti = ", myShakti);
  // console.log("piledejetonsShakti = ", piledejetonsShakti);
  if (myShakti > piledejetonsShakti)
  {

    if (theActiveActor.type === "character") {
      //////////////////////////////////////////////////////////////////
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error4"));
      return;
      //////////////////////////////////////////////////////////////////
    } else {
      //////////////////////////////////////////////////////////////////
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error4-npc"));
      return;
      //////////////////////////////////////////////////////////////////
    };

  } else {

    if (theActiveActor.type === "character") {
      await theActiveActor.update({ "system.shakti.piledejetons": parseInt(theActiveActor.system.shakti.piledejetons) - myShakti });
    } else {
      await theActiveActor.update({ "system.shakti_initiale.value": parseInt(theActiveActor.system.shakti_initiale.value) - myShakti });
    };
    //////////////////////////////////////////////////////////////////
    if (myShakti > 0) {
      ui.notifications.info(game.i18n.localize("DEVASTRA.Info4"));
    }
    //////////////////////////////////////////////////////////////////
  
    ChatMessage.create({
      user: game.user.id,
      // speaker: ChatMessage.getSpeaker({ token: this.actor }),
      speaker: ChatMessage.getSpeaker({ actor: theActiveActor }),
      content: smartHtml,
      rollMode: myTypeOfThrow
    });

  }
}


/* -------------------------------------------- */

async function _showCalculateAttacksInChat (
  myActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
  consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
  selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
) {

  var myTotal = 0;
  if (total != "") { myTotal = parseInt(total); };
  var myDefence = 0;
  if (defence != "") { myDefence = parseInt(defence); };
  var myShakti = 0;
  if (shakti != "") { myShakti = parseInt(shakti); };
  const youwin = ((myTotal - (myDefence + myShakti)) <= 0);

  var myActorId = "";
  var theActiveActor = null;
  var opponentFlag = false;
  var tokenFlag = false;
  var myToken = null;
  var thatToken = null;
  var thisTokens = null;

  if (opposantficheId == "" || opposantficheId == "0") {
  myActorId = attaquantficheId;
  theActiveActor = game.actors.get(myActorId);
  } else {
    myActorId = opposantficheId;
    opponentFlag = true;
    theActiveActor = game.actors.get(myActorId);
    thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
    for (let theToken in thisTokens) {
      thatToken = thisTokens[theToken];
      if (thatToken.document.id == opposanttokenId) {
        myToken = thatToken;
        tokenFlag = true;
      };
    }; 
    if (tokenFlag) { theActiveActor = myToken.actor };
  }
  let theAttackantActor = game.actors.get(attaquantficheId);
  let theOpponentActor;
  if (tokenFlag) { theOpponentActor = myToken.actor };

  //// const myOpponent = game.actors.get(opposantficheId);

  const optNone = game.i18n.localize("DEVASTRA.opt.none");
  const myDamage = parseInt(damage);

  var myDamageType = optNone;
  const theDamageType = damagetype.toString();
  switch (theDamageType) {
    case "1": myDamageType = "@domains.dph";
    break;
    case "2": myDamageType = "@domains.dma";
    break;
    case "3": myDamageType = "@domains.din";
    break;
    case "4": myDamageType = "@domains.dso";
    break;
    case "5": myDamageType = "@domains.dmy";
    break;
    default: myDamageType = optNone;
  }

  var sentence1 = "";
  var sentence2 = "";
  var sentence3 = "";
  var sentence4 = "";
  var sentence5 = "";
  var sentence6 = "";
  var sentence7 = "";

  // var pdc = 0; // J'avais oublié de calculer ça ! :
  var pdc = myTotal - (myDefence + myShakti);
  var pdcMinusArmor = 0;

  
  // Ici on calcul le total des dommages (hors résistance armure du défenseur) de l'attaquant    
  var item;
  var myItem;

  var myWeaponDamageBase = 0;
  var myWeaponDamage = "";

  var myDevastraDamageBase = 0;
  var myDevastraDamage = "";

  var myPowerDamageBase = 0;
  var myPowerDamage = "";

  var myMagicDamageBase = 0;
  var myMagicDamage = "";

  // console.log("isinventory = ", isinventory);
  if (isinventory === "true") {

    if (devastra === "false") {
      myItem = undefined;

      let myWeaponDamageTab;

      if (selectedinventory == "0" || selectedinventory == "-1") {
        myWeaponDamageBase = 0;
        myWeaponDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'item')) {
          if (item._id == selectedinventory) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myWeaponDamageBase = parseInt(myItem.system.damage_base);
          myWeaponDamage = myItem.system.damage;

          let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

          // console.log("myNewWeaponDamage = ", myNewWeaponDamage);
  
          myWeaponDamageTab = myNewWeaponDamage.split("+");
          // console.log("myWeaponDamageTab = ", myWeaponDamageTab);

          for (let theWeaponDamage in myWeaponDamageTab) {
            // console.log("theWeaponDamage = ", theWeaponDamage);
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
            // console.log("myWeaponDamageTab[theWeaponDamage] = ", myWeaponDamageTab[theWeaponDamage]);
          }
  
        }
      }
      pdc += parseInt(myWeaponDamageBase);
      // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
      // console.log("myWeaponDamage = ", myWeaponDamage);
    } else {
      myItem = undefined;

      let myDevastraDamageTab;

      if (selectedinventorydevastra == "0") {
        myDevastraDamageBase = 0;
        myDevastraDamage = "";
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'devastra')) {
          if (item._id == selectedinventorydevastra) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myDevastraDamageBase = parseInt(myItem.system.damage_base);
          myDevastraDamage = myItem.system.damage;

          let myNewDevastraDamage = myDevastraDamage.replaceAll(" ", "");
  
          myDevastraDamageTab = myNewDevastraDamage.split("+");

          for (let theDevastraDamage in myDevastraDamageTab) {
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myDevastraDamageTab[theDevastraDamage]));
          }

        }
      }
      pdc += parseInt(myDevastraDamageBase);
      // console.log("myDevastraDamageBase = ", myDevastraDamageBase);
      // console.log("myDevastraDamage = ", myDevastraDamage);
    }

  }

  if (isinventory === "true" && power === "true") {
    myItem = undefined;

    let myPowerDamageTab;

    if (selectedinventorypower == "0") {
      myPowerDamageBase = 0;
      myPowerDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'pouvoir')) {
        if (item._id == selectedinventorypower) {
          myItem = item;
        }
        if (myItem != undefined) {
          myPowerDamageBase = parseInt(myItem.system.damage_base);
          myPowerDamage = myItem.system.damage;

          let myNewPowerDamage = myPowerDamage.replaceAll(" ", "");

          myPowerDamageTab = myNewPowerDamage.split("+");

          for (let thePowerDamage in myPowerDamageTab) {
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myPowerDamageTab[thePowerDamage]));
          }

        }
      }
      pdc += parseInt(myPowerDamageBase);
    }
  
  // console.log("myPowerDamageBase = ", myPowerDamageBase);
    // console.log("myPowerDamage = ", myPowerDamage);
  }

  // console.log("magic = ", magic);
  if (isinventory === "true" && magic === "true") {
    myItem = undefined;

    let myMagicDamageTab;

    if (selectedinventorymagic == "0") {
      myMagicDamageBase = 0;
      myMagicDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'magie')) {
        if (item._id == selectedinventorymagic) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myMagicDamageBase = parseInt(myItem.system.damage_base);
        myMagicDamage = parseInt(myItem.system.damage);
        
        let myNewMagicDamage = myMagicDamage.replaceAll(" ", "");

        myMagicDamageTab = myNewMagicDamage.split("+");

        for (let theMagicDamage in myMagicDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myMagicDamageTab[theMagicDamage]));
        }

      }
    }
    pdc += parseInt(myMagicDamageBase);


    // console.log("myMagicDamageBase = ", myMagicDamageBase);
    // console.log("myMagicDamage = ", myMagicDamage);
  }


  if (isinventory === "false") {
    myWeaponDamageBase = myDamage;
    myWeaponDamage = myDamageType;

    let myWeaponDamageTab;
        
    let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

    myWeaponDamageTab = myNewWeaponDamage.split("+");

    pdc += parseInt(myWeaponDamageBase);

    for (let theWeaponDamage in myWeaponDamageTab) {
      pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
    }

    // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
    // console.log("myWeaponDamage = ", myWeaponDamage);
  }

  async function _computeDomain2Val (theActor, myDamage) {
    let domainValue = 0;
    const theDamage = myDamage;
    switch (theDamage) {
      case "@domains.dph":
        domainValue = parseInt(theActor.system.domains.dph.value);
      break;
      case "@domains.dma":
        domainValue = parseInt(theActor.system.domains.dma.value);
      break;
      case "@domains.din":
        domainValue = parseInt(theActor.system.domains.din.value);
      break;
      case "@domains.dso":
        domainValue = parseInt(theActor.system.domains.dso.value);
      break;
      case "@domains.dmy":
        domainValue = parseInt(theActor.system.domains.dmy.value);
      break;
      default: domainValue = 0;
    }
    return domainValue;
  };

  // console.log("pdc = ", pdc);

  pdcMinusArmor = pdc - 0;

  if (opponentFlag) {
    if (youwin) {
      sentence1 = game.i18n.localize("DEVASTRA.YouWin");
      sentence2 = game.i18n.localize("DEVASTRA.YouArentHit").replace("^0", game.actors.get(attaquantficheId).name);
      sentence3 = game.i18n.localize("DEVASTRA.YouArentWounded");
    } else {
      sentence1 = game.i18n.localize("DEVASTRA.YouLose");
      sentence2 = game.i18n.localize("DEVASTRA.YouReHit").replace("^0", game.actors.get(attaquantficheId).name);
      sentence3 = game.i18n.localize("DEVASTRA.YouReWounded").replace("^0", pdc);
    }
  } else {

  }
  
  const smartTemplate = 'systems/devastra/templates/form/result-attacks.html';
  const smartData = {
    nd: nd,

    total: myTotal,

    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,

    consideropponentprotection: consideropponentprotection,

    isinventory: isinventory,
    weapon: weapon,
    devastra: devastra,
    power: power,
    magic: magic,

    selectedinventory: selectedinventory,
    selectedinventorydevastra: selectedinventorydevastra,
    selectedinventorypower: selectedinventorypower,
    selectedinventorymagic: selectedinventorymagic,
    damage: damage,
    damagetype: damagetype,
    
    defence: myDefence,
    shakti: myShakti,

    pdc: pdc,
    pdcminusarmor: pdcMinusArmor,

    sentence1: sentence1,
    sentence2: sentence2,
    sentence3: sentence3
  }
  // console.log("smartData avant retour func = ", smartData);
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer
  
  ChatMessage.create({
    user: game.user.id,
    // speaker: ChatMessage.getSpeaker({ token: this.actor }),
    speaker: ChatMessage.getSpeaker({ actor: theActiveActor }),
    content: smartHtml,
    rollMode: myTypeOfThrow
  });


}






/* -------------------------------------------- */

async function _showMessagesInChat (myActor, myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData) {

  let msg = "";

  const typeOfThrow = myTypeOfThrow;

  switch ( typeOfThrow ) {
    case 0: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'roll'                      // Public Roll
      });
    break;
    case 1: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'gmroll'                    // Private Roll
      });
    break;
    case 2: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'blindroll'                 // Blind GM Roll
    });
    break;
    case 3: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'selfroll'                      // Self Roll
    });
    break;
    default: // console.log("C'est bizarre !");


    if (game.modules.get("dice-so-nice")?.active) {
      await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
    };

  }

  // Smart Message
  const smartTemplate = mySmartTemplate;
  const smartData = mySmartData;
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  switch ( typeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'blindroll'                       // Blind GM Roll
      });

    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: // console.log("C'est bizarre !");
  };

  // SmartR Message  const smartRTemplate = mySmartRTemplate;
  const smartRData = mySmartRData;
  const smartRHtml = await foundry.applications.handlebars.renderTemplate(smartRTemplate, smartRData);
 
  switch ( typeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartRHtml,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartRHtml,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartRHtml,
        rollMode: 'blindroll'                       // Blind GM Roll
      })

    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartRHtml,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: // console.log("C'est bizarre !");
  };

}


/* -------------------------------------------- */

async function _updateActorSheetWoundsJauge (myActor, wounds) {

  const oldLevelBlessures = await myActor.system.blessures.lvl;

  // console.log("oldLevelBlessures = ", oldLevelBlessures);

  let newLevelBlessures = oldLevelBlessures + wounds;

  if (newLevelBlessures > 8) {
    newLevelBlessures = 8;
  };

  // console.log("newLevelBlessures = ", newLevelBlessures);

  if (oldLevelBlessures < 1 && newLevelBlessures >= 1) {
    myActor.update({ "system.blessures.blessure_1.check": true });
  };
  if (oldLevelBlessures < 2 && newLevelBlessures >= 2) {
    myActor.update({ "system.blessures.blessure_2.check": true });
  };
  if (oldLevelBlessures < 3 && newLevelBlessures >= 3) {
    myActor.update({ "system.blessures.blessure_3.check": true });
  };
  if (oldLevelBlessures < 4 && newLevelBlessures >= 4) {
    myActor.update({ "system.blessures.blessure_4.check": true });
  };
  if (oldLevelBlessures < 5 && newLevelBlessures >= 5) {
    myActor.update({ "system.blessures.blessure_5.check": true });
  };
  if (oldLevelBlessures < 6 && newLevelBlessures >= 6) {
    myActor.update({ "system.blessures.blessure_6.check": true });
  };
  if (oldLevelBlessures < 7 && newLevelBlessures >= 7) {
    myActor.update({ "system.blessures.blessure_7.check": true });
  };
  if (oldLevelBlessures < 8 && newLevelBlessures >= 8) {
    myActor.update({ "system.blessures.blessure_8.check": true });
  };


  myActor.update({ "system.blessures.lvl": newLevelBlessures });

}


/* -------------------------------------------- */

async function _treatShaktiDialog(
  myActor, template, myTitle, myDialogOptions, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
  consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
  selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
) {
  let myResultDialog = await _shaktiDialog(
    myActor, template, myTitle, myDialogOptions, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
    consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
    selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
  );





  //////////////////////////////////////////////////////////////////
  if (!(myResultDialog)) {
    ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
    return;
  };
  //////////////////////////////////////////////////////////////////

  var theShakti = myResultDialog.defenseshakti;

  const theDefence = defence.toString();

  _showCalculateShaktiInChat(
    myActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
    consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
    selectedinventorypower, selectedinventorymagic, damage, damagetype, theDefence, theShakti
  );


}


/* -------------------------------------------- */

async function _shaktiDialog(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
   mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  ) {

  // Render modal dialog
  

  template = template || 'systems/devastra/templates/form/shakti-prompt.html';
  const myActorID = myActor;
  const title = myTitle;
  const dialogOptions = myDialogOptions;

  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const opposanttokenId = myOpposanttokenId;
  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const defence = parseInt(myDefence);

  const shakti = parseInt(myShakti);


  var dialogData = {
    nd: nd,

    // total: rModif._total,

    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,

    consideropponentprotection: consideropponentprotection,
    isinventory: isinventory,
    weapon: weapon,
    devastra: devastra,
    power: power,
    magic: magic,

    selectedinventory: selectedinventory,
    selectedinventorydevastra: selectedinventorydevastra,
    selectedinventorypower: selectedinventorypower,
    selectedinventorymagic: selectedinventorymagic,
    damage: damage,
    damagetype: damagetype,

    defence: defence,

    defenseshakti: shakti

  }

  const html = await foundry.applications.handlebars.renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 450,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      defenseshakti: await myHtml.find("select[name='defenseshakti']").val(),
    };
    return editedData;
  }
  //////////////////////////////////////////////////////////////



}


/* -------------------------------------------- */
/*  Dialogue de lancer de défense               */
/* -------------------------------------------- */
async function _treatSkillDiceRollDefenceDialog(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
) {
  // console.log("Il s'agit d'un PJ")


  let myResultDialog = await _skillDiceRollDefenceDialog(
    myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId,
    myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
    mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  );

  //////////////////////////////////////////////////////////////////
  if (!(myResultDialog)) {
    ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
    return;
  };
  //////////////////////////////////////////////////////////////////

  let myVersionDebloqueeFlag = (myResultDialog.versiondebloquee == 1);
  if (myVersionDebloqueeFlag) {


    myResultDialog = await _skillDiceRollDefenceDialogDeblocked (
      myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
    );
 

    //////////////////////////////////////////////////////////////////
    if (!(myResultDialog)) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
      return;
      };
    //////////////////////////////////////////////////////////////////


    var nd = myResultDialog.nd;
    var total = myTotal;
    var attaquantficheId = myAttaquantficheId;
    var opposantficheId = myOpposantficheId;
    var opposanttokenId = myOpposanttokenId;

    var consideropponentprotection = myConsideropponentprotection;
    var isinventory = myIsinventory;
    var weapon = myWeapon;
    var devastra = myDevastra;
    var power = myPower;
    var magic = myMagic;

    var selectedinventory = mySelectedinventory;
    var selectedinventorydevastra = mySelectedinventorydevastra;
    var selectedinventorypower = mySelectedinventorypower;
    var selectedinventorymagic = mySelectedinventorymagic;
    var damage = myDamage;
    var damagetype = myDamagetype;
    var defence = 0;
    var shakti = myShakti;

    var domains = myResultDialog.domains;
    var jet = "defnc";
    var ouijet = myResultDialog.ouijet;
    var defencend = myResultDialog.defencend;
    var ouishaktidefense = myResultDialog.ouishaktidefense;
    var bonusdomaineflag = myResultDialog.bonusdomainecheck;
    var specialiteflag = myResultDialog.specialitecheck;
    var malusblessureflag = false;
    var malusstatutflag = false;
    var malusstatutval = "0D";
    var d8check = myResultDialog.d8check;
    var nbrdedomainedph = myResultDialog.nbrdedomainedph;
    var nbrdedomainedma = myResultDialog.nbrdedomainedma;
    var nbrdedomainedin = myResultDialog.nbrdedomainedin;
    var nbrdedomainedso = myResultDialog.nbrdedomainedso;
    var nbrdedomainedmy = myResultDialog.nbrdedomainedmy;
    var nbrdebonusdomainedph = myResultDialog.nbrdebonusdomainedph;
    var nbrdebonusdomainedma = myResultDialog.nbrdebonusdomainedma;
    var nbrdebonusdomainedin = myResultDialog.nbrdebonusdomainedin;
    var nbrdebonusdomainedso = myResultDialog.nbrdebonusdomainedso;
    var nbrdebonusdomainedmy = myResultDialog.nbrdebonusdomainedmy;

    /*
    var nbrdemalusstatutdph = myResultDialog.nbrdemalusstatutdph;
    var nbrdemalusstatutdma = myResultDialog.nbrdemalusstatutdma;
    var nbrdemalusstatutdin = myResultDialog.nbrdemalusstatutdin;
    var nbrdemalusstatutdso = myResultDialog.nbrdemalusstatutdso;
    var nbrdemalusstatutdmy = myResultDialog.nbrdemalusstatutdmy;
    */

    var nbrdebonusspecialite = myResultDialog.nbrdebonusspecialite;

    var bonusdomaineflag = myResultDialog.bonusdomainecheck;
    var bonusapplique = myResultDialog.bonusapplique;
    var plusdeuxdesdattaque = myResultDialog.plusdeuxdesdattaque; // en fait, uniquement nbre jetons Shakti à enlever
    var malususapplique = myResultDialog.malususapplique;
    var ignoremalus = 0;
    var malusaignorer = 0;
    var succesauto = myResultDialog.succesauto;
    var plusunsuccesauto = myResultDialog.plusunsuccesauto; // en fait, uniquement nbre jetons Conviction à enlever
    var desnonexplo = 0;
    var sixexploflag = myResultDialog.sixexplo;
    var cinqexploflag = myResultDialog.cinqexplo;

    var specialiteflag = myResultDialog.specialitecheck;

    // console.log("myPlusDeuxDesDAttaque", myPlusDeuxDesDAttaque);
    // console.log("myIgnoreMalus", myIgnoreMalus);
    // console.log("myPlusUnSuccesAuto", myPlusUnSuccesAuto);
    // console.log("myActor.system.conviction.piledejetons", myActor.system.conviction.piledejetons);

    var shaktisuffisanteflag = (plusdeuxdesdattaque <= myActor.system.shakti.piledejetons); // s'il reste assez de jetons de Shakticonst myShaktiRestanteFlag = (myActor.system.shakti.piledejetons); // s'il reste des jetons de Shakti
    var convictionsuffisanteflag = ((ignoremalus + plusunsuccesauto) <= myActor.system.conviction.piledejetons); // s'il reste assez de jetons de Conviction

  } else {

    var nd = myResultDialog.nd;
    var total = myTotal;
    var attaquantficheId = myAttaquantficheId;
    var opposantficheId = myOpposantficheId;
    var opposanttokenId = myOpposanttokenId;

    var ci108 = 0;

    var consideropponentprotection = myConsideropponentprotection;
    var isinventory = myIsinventory;
    var weapon = myWeapon;
    var devastra = myDevastra;
    var power = myPower;
    var magic = myMagic;

    var selectedinventory = mySelectedinventory;
    var selectedinventorydevastra = mySelectedinventorydevastra;
    var selectedinventorypower = mySelectedinventorypower;
    var selectedinventorymagic = mySelectedinventorymagic;
    var damage = myDamage;
    var damagetype = myDamagetype;
    var defence = 0;
    var shakti = myShakti;

    var domains = myResultDialog.domains;
    var jet = "defnc";
    var ouijet = myResultDialog.ouijet;
    var defencend = myResultDialog.defencend;
    var ouishaktidefense = myResultDialog.ouishaktidefense;
    var bonusdomaineflag = myResultDialog.bonusdomainecheck;
    var specialiteflag = myResultDialog.specialitecheck;
    var malusblessureflag = myResultDialog.malusblessurecheck;
    var malusstatutflag = myResultDialog.malusstatutcheck;
    var malusstatutval = myResultDialog.malusstatutval;
    var d8check = myResultDialog.d8check;
    var nbrdedomainedph = myResultDialog.nbrdedomainedph;
    var nbrdedomainedma = myResultDialog.nbrdedomainedma;
    var nbrdedomainedin = myResultDialog.nbrdedomainedin;
    var nbrdedomainedso = myResultDialog.nbrdedomainedso;
    var nbrdedomainedmy = myResultDialog.nbrdedomainedmy;
    var nbrdebonusdomainedph = myResultDialog.nbrdebonusdomainedph;
    var nbrdebonusdomainedma = myResultDialog.nbrdebonusdomainedma;
    var nbrdebonusdomainedin = myResultDialog.nbrdebonusdomainedin;
    var nbrdebonusdomainedso = myResultDialog.nbrdebonusdomainedso;
    var nbrdebonusdomainedmy = myResultDialog.nbrdebonusdomainedmy;

    /*
    var nbrdemalusstatutdph = myResultDialog.nbrdemalusstatutdph;
    var nbrdemalusstatutdma = myResultDialog.nbrdemalusstatutdma;
    var nbrdemalusstatutdin = myResultDialog.nbrdemalusstatutdin;
    var nbrdemalusstatutdso = myResultDialog.nbrdemalusstatutdso;
    var nbrdemalusstatutdmy = myResultDialog.nbrdemalusstatutdmy;
    */

    var nbrdebonusspecialite = myResultDialog.nbrdebonusspecialite;
    var bonusapplique = myResultDialog.bonusapplique;
    var plusdeuxdesdattaque = myResultDialog.plusdeuxdesdattaque;
    var malususapplique = myResultDialog.malususapplique;
    var ignoremalus = myResultDialog.ignoremalus;
    var malusaignorer = myResultDialog.malusaignorer;
    var succesauto = myResultDialog.succesauto;
    var plusunsuccesauto = myResultDialog.plusunsuccesauto;
    var desnonexplo = myResultDialog.desnonexplo;
    var sixexplo = myResultDialog.sixexplo;
    var cinqexplo = myResultDialog.cinqexplo;

    var specialiteflag = myResultDialog.specialitecheck;

    // console.log("myPlusDeuxDesDAttaque", myPlusDeuxDesDAttaque);
    // console.log("myIgnoreMalus", myIgnoreMalus);
    // console.log("myPlusUnSuccesAuto", myPlusUnSuccesAuto);
    // console.log("myActor.system.conviction.piledejetons", myActor.system.conviction.piledejetons);

    var shaktisuffisanteflag = (plusdeuxdesdattaque <= myActor.system.shakti.piledejetons); // s'il reste assez de jetons de Shakticonst myShaktiRestanteFlag = (myActor.system.shakti.piledejetons); // s'il reste des jetons de Shakti
    var convictionsuffisanteflag = ((ignoremalus + plusunsuccesauto) <= myActor.system.conviction.piledejetons); // s'il reste assez de jetons de Conviction
  
  }

  let myNbrDeDomaine = 0;
  let myNbrDeBonusDomaine = 0;
  switch (domains) {
    case "dph":
      myNbrDeDomaine = parseInt(nbrdedomainedph);
      myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedph);

    break;
    case "dma":
      myNbrDeDomaine = parseInt(nbrdedomainedma);
      myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedma);

    break;
    case "din":
      myNbrDeDomaine = parseInt(nbrdedomainedin);
      myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedin);

    break;
    case "dso":
      myNbrDeDomaine = parseInt(nbrdedomainedso);
      myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedso);

    break;
    case "dmy":
      myNbrDeDomaine = parseInt(nbrdedomainedmy);
      myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedmy);

    break;
    default: // console.log("C'est bizarre !");
  }
  if (!bonusdomaineflag) {
    myNbrDeBonusDomaine = 0;
  }
  let myNbrDeBonusSpecialite = 0;
  if (specialiteflag) {
    myNbrDeBonusSpecialite = parseInt(nbrdebonusspecialite);
  }

  let mySpecialiteFlag = specialiteflag;
  let myBonusApplique = parseInt(bonusapplique);
  let myMalusApplique = parseInt(malususapplique);
  let myIgnoreMalus = parseInt(ignoremalus);
  let myMalusAIgnorer = parseInt(malusaignorer);
  let mySuccesAuto = parseInt(succesauto);
  let myShaktiSuffisanteFlag = parseInt(shaktisuffisanteflag);
  let jetLibel = jet;
  let myPlusDeuxDesDAttaque = parseInt(plusdeuxdesdattaque);
  let myconvictionSuffisanteFlag = parseInt(convictionsuffisanteflag);
  let myPlusUnSuccesAuto = parseInt(plusunsuccesauto);
  let myCinqExploFlag = parseInt(cinqexplo);
  let mySixExploFlag = parseInt(sixexplo);
  let myMalusBlessureCheck = parseInt(malusblessureflag);
  let myMalusStatutCheck = malusstatutflag;
  let myMalusStatutVal = malusstatutval;
  let myDesNonExplo = parseInt(desnonexplo);

  var theDefence = defence;
  var theDamage = myDamage;
  var theDamagetype = myDamagetype;
  var theShakti = myShakti;

  if (ouijet) {

    /***********************************************************************************
    * 
    * {N} : nombre de dés lancés
    * {S} : seuil à atteindre (Niveau de Difficulté)
    * {A} : nombre de réussites automatiques
    * 
    * /r {N}d6cs>={S} : roll N d6, count successes (>=S), no dice results are explosive
    * /r {N}d6x=6cs>={S} : roll N d6, count successes (>=S), only 6 are explosive
    * /r {N}d6x>=5cs>={S} : roll N d6, count successes (>=S), 5 and 6 are explosive
    * 
    * nombre de 1 = ?
    * nombre de 2 = ?
    * nombre de 3 = ?
    * nombre de 4 = ?
    * nombre de 5 = ?
    * nombre de 6 = ?
    * nombre de réussites automatiques = {A}
    * defence nombre de réussites = roll.result+{A}
    * 
    ************************************************************************************/


    var d8_val = 0;
    let d6_1 = 0;
    let d6_2 = 0;
    let d6_3 = 0;
    let d6_4 = 0;
    let d6_5 = 0;
    let d6_6 = 0;
    let d6_A = 0;

    let suite = "[";

    defence = parseInt(myNbrDeDomaine);
    // console.log("2933: defence = ", defence);

    // console.log("myNbrDeBonusDomaine", myNbrDeBonusDomaine);
    if (bonusdomaineflag) {
      defence += parseInt(myNbrDeBonusDomaine);
      // console.log("2968: defence = ", defence);
      // console.log("myNbrDeBonusDomaine", "compabilisé");
    };

    // console.log("myNbrDeBonusSpecialite", myNbrDeBonusSpecialite);
    if (specialiteflag) {
      defence += parseInt(myNbrDeBonusSpecialite);
      // console.log("2975: defence = ", defence);
      // console.log("myNbrDeBonusSpecialite", "compabilisé");
    };


    /*
    Ici, on vérifie la validité de tous les bonus et on les applique ; et on soustrait les jetons en conséquence.
    */

    let myBonusSupplem = parseInt(myBonusApplique);
    let myMalusSupplem = parseInt(myMalusApplique) - parseInt(myMalusAIgnorer);
    // console.log("2981: myMalusSupplem = ", myMalusSupplem);
    if (myMalusSupplem < 0) {myMalusSupplem = 0;};
    var mySuccesAutoSupplem = parseInt(mySuccesAuto);


    // Application des bonus valides et des malus

    // Si c'est via le prompt débridé, myBonusApplique comptabilise déjà les points de myPlusDeuxDesDAttaque
    if (myShaktiSuffisanteFlag && jetLibel == "attck" && !(myVersionDebloqueeFlag)) {
      myBonusSupplem += 2 * parseInt(myPlusDeuxDesDAttaque);
    }

    // Si c'est via le prompt débridé, myMalusApplique comptabilise déjà les points de myIgnoreMalus
    // et mySuccesAuto, ceux de myPlusUnSuccesAuto
    if (myconvictionSuffisanteFlag && !(myVersionDebloqueeFlag)) {
      myMalusSupplem -= parseInt(myIgnoreMalus);
      if (myMalusSupplem < 0) { myMalusSupplem = 0;};

      mySuccesAutoSupplem += parseInt(myPlusUnSuccesAuto);
    }


    defence += myBonusSupplem;
    // console.log("3003: defence = ", defence);
    defence -= myMalusSupplem;
    // console.log("3005: defence = ", defence);

    d6_A = mySuccesAutoSupplem;



    // Traitement du cas des malus de blessures

    let myNombreDeMalusBlessure = 0;
    if (myMalusBlessureCheck) {
      for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
        if (item.system.subtype == "0") { // si le type est blessure
          myNombreDeMalusBlessure += Math.abs(item.system.value);
        }
      }
    };
    defence -= myNombreDeMalusBlessure;
    // console.log("3026: defence = ", defence);


    // Traitement du cas des malus de statuts

    let myNombreDeMalusStatut = 0;
    if (myMalusStatutCheck) {
      if (myMalusStatutVal.charAt(0) == "-")  {
        myNombreDeMalusStatut = parseInt(myMalusStatutVal);
      }
    };

    defence += myNombreDeMalusStatut; // déjà négatif !
    


    // console.log("defence = ", defence);

    //////////////////////////////////////////////////////////////////
    if (defence <= 0) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error1"));
      return;
      };
    //////////////////////////////////////////////////////////////////


    if (d8check && mySpecialiteFlag) {
      total--;
    }


    // Soustraction des jetons si en nombre suffisant, sinon "return"
    let myErrorTokenNbr = 0;
    if (parseInt(myIgnoreMalus) + parseInt(myPlusUnSuccesAuto)) {
      if (myconvictionSuffisanteFlag) {
        await myActor.update({ "system.conviction.piledejetons":  parseInt(myActor.system.conviction.piledejetons - (parseInt(myIgnoreMalus) + parseInt(myPlusUnSuccesAuto))) });
        ui.notifications.info(game.i18n.localize("DEVASTRA.Info5"));
      } else {
        ui.notifications.error(game.i18n.localize("DEVASTRA.Error5"));
        myErrorTokenNbr++;
      }
    }
    if (myErrorTokenNbr) { return };



    // Ici on traite le cas des dés non-explosifs
    if (myDesNonExplo == 2) {
      myCinqExploFlag = false;
      mySixExploFlag = false;
    } else if ((myDesNonExplo == 1) && myCinqExploFlag) {
      myCinqExploFlag = false;
    } else if ((myDesNonExplo == 1) && !(myCinqExploFlag)) {
      mySixExploFlag = false;
    };


      if (suite.length >= 2) {
      suite += "%";
      suite = suite.replace(', %', ']');
    } else {
      suite = "";
    };

    var n = {
      myReussite: 0,
      myND: nd,
      mySixExplo: mySixExploFlag,
      myCinqExplo: myCinqExploFlag,
      nbrRelance: defence,
      d6_1: 0,
      d6_2: 0,
      d6_3: 0,
      d6_4: 0,
      d6_5: 0,
      d6_6: 0

    };

    // console.log("defence = ", defence)

    // console.log("n.nbrRelance = ", n.nbrRelance)

    // console.log("n.myND = ", n.myND)

    var msg;

    const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer
    // console.log("myTypeOfThrow", myTypeOfThrow);

    
    if (d8check && mySpecialiteFlag) {
      let myRoll8 = "1d8>="+n.myND;
      var r8 = new Roll(myRoll8, myActor.getRollData());
      await r8.evaluate();

      msg = await r8.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        rollMode: myTypeOfThrow
      });

      d8_val = r8._total;
    }


    let myRoll = "";

    do {
      let myRoll = "";
      myRoll += n.nbrRelance+"d6cs>="+n.myND;
      d6_1 = 0;
      d6_2 = 0;
      d6_3 = 0;
      d6_4 = 0;
      d6_5 = 0;
      d6_6 = 0;

      const r = new Roll(myRoll, myActor.getRollData());
      await r.evaluate();
      // console.log(r);
      let myRDice = r.dice;
      // console.log(myRDice);
      // console.log(myRDice[0]);
      for (let key in myRDice) {
        // console.log(myRDice[key]);
        for (let i=0; i<myRDice[key].number; i++) {
          let myD = myRDice[key].results[i].result;
          // console.log(myD);
          switch ( myD ) {
            case 1: d6_1++;
            break;
            case 2: d6_2++;
            break;
            case 3: d6_3++;
            break;
            case 4: d6_4++;
            break;
            case 5: d6_5++;
            break;
            case 6: d6_6++;
            break;
            default: // console.log("C'est bizarre !");
          };
          n.nbrRelance = 0;
          if (n.mySixExplo) {
            n.nbrRelance += d6_6;
              if (n.myCinqExplo && 5 >= n.myND) { // les 5 ne peuvent être explosifs que si ce sont des réussites
              n.nbrRelance += d6_5;
            }
          }
        }
      };


      n.d6_1 += d6_1;
      n.d6_2 += d6_2;
      n.d6_3 += d6_3;
      n.d6_4 += d6_4;
      n.d6_5 += d6_5;
      n.d6_6 += d6_6;


      n.myReussite = parseInt(n.myReussite) + parseInt(r._total);

      // r._total = "0";

      const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer
      // console.log("myTypeOfThrow", myTypeOfThrow);

      msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        rollMode: myTypeOfThrow
      });

      await new Promise(w => setTimeout(w, 2750));

    } while (n.nbrRelance);

    if (d8check && mySpecialiteFlag) {
      if (r8._total >= n.myND) { n.myReussite++ };
    }

    const rModif = new Roll("0[Défense Réussites]", myActor.getRollData());
    await rModif.evaluate();
    rModif._total  = parseInt(n.myReussite) + parseInt(mySuccesAuto); // On ajoute les succès automatiques

    defence = parseInt(n.myReussite) + parseInt(mySuccesAuto);


    msg = await rModif.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: myTypeOfThrow
    });

      
    var d_successes = parseInt(n.myReussite) + parseInt(mySuccesAutoSupplem); // On ajoute les succès automatiques

    // Smart Message
    /*
    let opponentActorId = "";
    let opponentActorName = "";
    if (opponentActor) {
      opponentActorId = opponentActor._id;
      opponentActorName = opponentActor.name;
    };
    */
    let smartTemplate = 'systems/devastra/templates/form/dice-result-defence.html';

    // console.log("d8_val = ", d8_val);

    const myDefence = defence; // calculé (lancer de dés)


    if (d8check && mySpecialiteFlag) {
      if (n.d6_1 > 0 && d8_val == 8) {
        ci108 = 108;
      }
    }

    // console.log("ci108 = ", ci108);
        
    const smartData = {
      d8: parseInt(d8_val),
      ci108: ci108,

      nd: nd,
      total: total,
      attaquantficheId: attaquantficheId,
      opposantficheId: opposantficheId,
      opposanttokenId: opposanttokenId,

      consideropponentprotection: consideropponentprotection,

      isinventory: isinventory,
      weapon: weapon,
      devastra: devastra,
      power: power,
      magic: magic,
  
      selectedinventory: selectedinventory,
      selectedinventorydevastra: selectedinventorydevastra,
      selectedinventorypower: selectedinventorypower,
      selectedinventorymagic: selectedinventorymagic,
      damage: damage,
      damagetype: damagetype,
      
      defence: myDefence,

      shakti: theShakti,

      domaine: domains,
      jet: jet,
      succes: d_successes,
      d1: n.d6_1,
      d2: n.d6_2,
      d3: n.d6_3,
      d4: n.d6_4,
      d5: n.d6_5,
      d6: n.d6_6,
      dA: mySuccesAutoSupplem
    }
    // console.log("smartData avant retour func = ", smartData);
    const smartHtml = await renderTemplate(smartTemplate, smartData);
      
    ChatMessage.create({
      user: game.user.id,
      // speaker: ChatMessage.getSpeaker({ token: this.actor }),
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      content: smartHtml,
      rollMode: myTypeOfThrow
    });


  } else {

    const shaktidefenceTemplate = 'systems/devastra/templates/form/shakti-prompt.html';
    const shaktidefenceTitle = game.i18n.localize("DEVASTRA.ShaktiEnDefense");
    const shaktidefenceDialogOptions  = {
      classes: ["devastra", "sheet"]
    };
    myResultDialog = await _skillEnterShaktiDefence (
      myActor, shaktidefenceTemplate, shaktidefenceTitle, shaktidefenceDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, theDamage, theDamagetype, theDefence, theShakti
    );


    //////////////////////////////////////////////////////////////////
    if (!(myResultDialog)) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
      return;
      };
    //////////////////////////////////////////////////////////////////

    const thisistheShakti = myResultDialog.defenseshakti;
    const thiistheDefence = myDefence.toString();

    _showCalculateShaktiInChat(
      myActor, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, theDamage, theDamagetype, thiistheDefence, thisistheShakti
    );

  };

}


/* -------------------------------------------- */

async function _skillEnterShaktiDefence(
  myActor, shaktidefenceTemplate, shaktidefenceTitle, shaktidefenceDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  ) {

  // Render modal dialog

  const template = shaktidefenceTemplate;
  const myActorID = myActor;
  const title = shaktidefenceTitle;
  const dialogOptions = shaktidefenceDialogOptions;

  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const opposanttokenId = myOpposanttokenId;
  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const defence = myDefence;


  var dialogData = {
    nd: nd,
    /*
    total: rModif._total,
    */
    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,

    consideropponentprotection: consideropponentprotection,
    isinventory: isinventory,
    weapon: weapon,
    devastra: devastra,
    power: power,
    magic: magic,

    selectedinventory: selectedinventory,
    selectedinventorydevastra: selectedinventorydevastra,
    selectedinventorypower: selectedinventorypower,
    selectedinventorymagic: selectedinventorymagic,
    damage: damage,
    damagetype: damagetype,

    defence: parseInt(defence),
  
  }

  const html = await foundry.applications.handlebars.renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 450,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      defenseshakti: await myHtml.find("select[name='defenseshakti']").val(),
    };
    return editedData;
  }
  //////////////////////////////////////////////////////////////



}
  

/* -------------------------------------------- */

async function _skillDiceRollDefenceDialog(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myShakti
  ) {

  // Render modal dialog
  template = template || 'systems/devastra/templates/form/skill-dice-prompt-defence.html';
  const myActorID = myActor;
  const title = myTitle;
  const dialogOptions = myDialogOptions;
  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const opposanttokenId = myOpposanttokenId;


  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const myNbrDeBonusSpecialite = 1;
  const mySpecialiteCheck = false;
  const myBonusDomaineCheck = true;
  const d8check = false;
  const mySixExploFlag = (myActorID.system.prana.value <= myActorID.system.prana.tenace); // si Tenace ou moins
  const myPlus1SuccesAutoFlag = (myActorID.system.prana.value > myActorID.system.prana.tenace); // si Vaillant
  if (myActorID.type == 'character') {
    var myShaktiRestanteFlag = (myActorID.system.shakti.piledejetons); // s'il reste des jetons de Shakti
  } else {
    var myShaktiRestanteFlag = (myActorID.system.shakti_initiale.value);
  };
  const myconvictionRestanteFlag = (myActorID.system.conviction.piledejetons); // s'il reste des jetons de Conviction

  const myNbrDeDomaineDPh = myActorID.system.domains.dph.value;
  const myNbrDeBonusDomaineDPh = myActorID.system.domains.dph.bonusdice;

  const myNbrDeDomaineDMa = myActorID.system.domains.dma.value;
  const myNbrDeBonusDomaineDMa = myActorID.system.domains.dma.bonusdice;

  const myNbrDeDomaineDIn = myActorID.system.domains.din.value;
  const myNbrDeBonusDomaineDIn = myActorID.system.domains.din.bonusdice;

  const myNbrDeDomaineDSo = myActorID.system.domains.dso.value;
  const myNbrDeBonusDomaineDSo = myActorID.system.domains.dso.bonusdice;

  const myNbrDeDomaineDMy = myActorID.system.domains.dmy.value;
  const myNbrDeBonusDomaineDMy = myActorID.system.domains.dmy.bonusdice;


  let myNombreDeMalusBlessure = 0;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "0") { // si le type est blessure
      myNombreDeMalusBlessure += Math.abs(item.system.value);
    }
  };
  myNombreDeMalusBlessure *= -1;
  let myMalusBlessureCheck = false;

  
  let myItemStatute = {};

  function myObject(id, label)
  {
    this.id = id;
    this.label = label;
  };

  myItemStatute["0"] = new myObject("0", game.i18n.localize("DEVASTRA.opt.none"));
  // myItemWeapon["-1"] = new myObject("-1", game.i18n.localize("DEVASTRA.barehands"));
  for (let item of myActorID.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // 1 = statut ; 0 = blessure
    myItemStatute[item.id.toString()] = new myObject(item.id.toString(), item.name.toString());
    };
  };

  let myNombreDeMalusStatut = 0;
  /*
  let myNombreDeMalusStatutDPh = 0;
  let myNombreDeMalusStatutDMa = 0;
  let myNombreDeMalusStatutDIn = 0;
  let myNombreDeMalusStatutDSo = 0;
  let myNombreDeMalusStatutDMy = 0;
  let j;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // si le type est statut
      j = item.system.domain;
      switch (j) {
        case '1': myNombreDeMalusStatutDPh++;
        break;
        case '2': myNombreDeMalusStatutDMa++;
        break;
        case '3': myNombreDeMalusStatutDIn++;
        break;
        case '4': myNombreDeMalusStatutDSo++;
        break;
        case '5': myNombreDeMalusStatutDMy++;
        break;
        default: // console.log(`Sorry, that's an error.`);
      }
    }
  };
  myNombreDeMalusStatutDPh *= -1;
  myNombreDeMalusStatutDMa *= -1;
  myNombreDeMalusStatutDIn *= -1;
  myNombreDeMalusStatutDSo *= -1;
  myNombreDeMalusStatutDMy *= -1;
  */

  let myMalusStatutCheck = true;

    var dialogData = {
    nd: nd,
  
    domains: "dma",
    throw: "defnc",
    actorID: myActorID._id,
    domaine: "dma",
    systemData: myActorID.system,
    nbrdedomainedph: myNbrDeDomaineDPh,
    nbrdedomainedma: myNbrDeDomaineDMa,
    nbrdedomainedin: myNbrDeDomaineDIn,
    nbrdedomainedso: myNbrDeDomaineDSo,
    nbrdedomainedmy: myNbrDeDomaineDMy,
    nbrdebonusdomainedph: myNbrDeBonusDomaineDPh,
    nbrdebonusdomainedma: myNbrDeBonusDomaineDMa,
    nbrdebonusdomainedin: myNbrDeBonusDomaineDIn,
    nbrdebonusdomainedso: myNbrDeBonusDomaineDSo,
    nbrdebonusdomainedmy: myNbrDeBonusDomaineDMy,
    bonusdomainecheck: myBonusDomaineCheck,
    nbrdebonusspecialite: myNbrDeBonusSpecialite,
    specialitecheck: mySpecialiteCheck,
    d8check: d8check,
    defencend: nd,
    malusblessurecheck: myMalusBlessureCheck,
    nbrdemalusblessure: myNombreDeMalusBlessure,
    malusstatutcheck: myMalusStatutCheck,
    statutechoices: myItemStatute,
    nbrdemalusstatut: myNombreDeMalusStatut,

    /*
    nbrdemalusstatutdph: myNombreDeMalusStatutDPh,
    nbrdemalusstatutdma: myNombreDeMalusStatutDMa,
    nbrdemalusstatutdin: myNombreDeMalusStatutDIn,
    nbrdemalusstatutdso: myNombreDeMalusStatutDSo,
    nbrdemalusstatutdmy: myNombreDeMalusStatutDMy,
    */

    shaktirestanteflag: myShaktiRestanteFlag,
    convictionrestanteflag: myconvictionRestanteFlag,
    plus1succesautoflag : myPlus1SuccesAutoFlag,
    sixexplo: mySixExploFlag,
    cinqexplo: false,
    desnonexplo: 0,
    versiondebloquee: false
  };
  const html = await renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 1000,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      nd: await myHtml.find("select[name='nd']").val(),
      
      domains: await myHtml.find("select[name='domains']").val(),
      throw: "defnc",
      ouijet: await myHtml.find("input[value='ouijet']").is(':checked'),
      defencend: await myHtml.find("select[name='defencend']").val(),
      ouishaktidefense: await myHtml.find("input[value='ouishaktidefense']").is(':checked'),
      bonusdomainecheck: await myHtml.find("input[name='bonusdomainecheck']").is(':checked'),
      d8check: await myHtml.find("input[name='d8check']").is(':checked'),
      specialitecheck: await myHtml.find("input[name='specialitecheck']").is(':checked'),
      malusblessurecheck: await myHtml.find("input[name='malusblessurecheck']").is(':checked'),
      malusstatutcheck: await myHtml.find("input[name='malusstatutcheck']").is(':checked'),
      malusstatutval: await myHtml.find("td[class='valeur2 malusstatute']").text(),
      nbrdedomainedph: myDialogData.nbrdedomainedph,
      nbrdedomainedma: myDialogData.nbrdedomainedma,
      nbrdedomainedin: myDialogData.nbrdedomainedin,
      nbrdedomainedso: myDialogData.nbrdedomainedso,
      nbrdedomainedmy: myDialogData.nbrdedomainedmy,
      nbrdebonusdomainedph: myDialogData.nbrdebonusdomainedph,
      nbrdebonusdomainedma: myDialogData.nbrdebonusdomainedma,
      nbrdebonusdomainedin: myDialogData.nbrdebonusdomainedin,
      nbrdebonusdomainedso: myDialogData.nbrdebonusdomainedso,
      nbrdebonusdomainedmy: myDialogData.nbrdebonusdomainedmy,

      /*
      nbrdemalusstatutdph: myDialogData.nbrdemalusstatutdph,
      nbrdemalusstatutdma: myDialogData.nbrdemalusstatutdma,
      nbrdemalusstatutdin: myDialogData.nbrdemalusstatutdin,
      nbrdemalusstatutdso: myDialogData.nbrdemalusstatutdso,
      nbrdemalusstatutdmy: myDialogData.nbrdemalusstatutdmy,
      */

      nbrdebonusspecialite: myDialogData.nbrdebonusspecialite,
      bonusapplique: await myHtml.find("select[name='bonusapplique']").val(),
      plusdeuxdesdattaque: await myHtml.find("select[name='plusdeuxdesdattaque']").val(),
      malususapplique: await myHtml.find("select[name='malususapplique']").val(),
      ignoremalus: await myHtml.find("select[name='ignoremalus']").val(),
      malusaignorer: await myHtml.find("select[name='malusaignorer']").val(),
      succesauto: await myHtml.find("select[name='succesauto']").val(),
      plusunsuccesauto: await myHtml.find("select[name='plusunsuccesauto']").val(),
      sixexplo: await myHtml.find("input[name='sixexplo']").is(':checked'),
      cinqexplo: await myHtml.find("input[name='cinqexplo']").is(':checked'),
      desnonexplo: await myHtml.find("select[name='desnonexplo']").val(),
      versiondebloquee: await myHtml.find("input[name='versiondebloquee']").is(':checked')
    };
    return editedData;

  }
  //////////////////////////////////////////////////////////////

  
}


/* -------------------------------------------- */

async function _skillDiceRollDefenceDialogDeblocked(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  ) {

  // Render modal dialog
  template = template || 'systems/devastra/templates/form/skill-dice-prompt-defence-debride.html';
  const myActorID = myActor;
  const title = myTitle;
  const dialogOptions = myDialogOptions;
  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const myNbrDeBonusSpecialite = 1;
  const mySpecialiteCheck = false;
  const myBonusDomaineCheck = true;
  const mySixExploFlag = (myActorID.system.prana.value <= myActorID.system.prana.tenace); // si Tenace ou moins
  const myPlus1SuccesAutoFlag = (myActorID.system.prana.value > myActorID.system.prana.tenace); // si Vaillant
  if (myActorID.type == 'character') {
    var myShaktiRestanteFlag = (myActorID.system.shakti.piledejetons); // s'il reste des jetons de Shakti
  } else {
    var myShaktiRestanteFlag = (myActorID.system.shakti_initiale.value);
  };
  const myconvictionRestanteFlag = (myActorID.system.conviction.piledejetons); // s'il reste des jetons de Conviction

  const myNbrDeDomaineDPh = myActorID.system.domains.dph.value;
  const myNbrDeBonusDomaineDPh = myActorID.system.domains.dph.bonusdice;

  const myNbrDeDomaineDMa = myActorID.system.domains.dma.value;
  const myNbrDeBonusDomaineDMa = myActorID.system.domains.dma.bonusdice;

  const myNbrDeDomaineDIn = myActorID.system.domains.din.value;
  const myNbrDeBonusDomaineDIn = myActorID.system.domains.din.bonusdice;

  const myNbrDeDomaineDSo = myActorID.system.domains.dso.value;
  const myNbrDeBonusDomaineDSo = myActorID.system.domains.dso.bonusdice;

  const myNbrDeDomaineDMy = myActorID.system.domains.dmy.value;
  const myNbrDeBonusDomaineDMy = myActorID.system.domains.dmy.bonusdice;

  let myNombreDeMalusBlessure = 0;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "0") { // si le type est blessure
      myNombreDeMalusBlessure += Math.abs(item.system.value);
    }
  };
  myNombreDeMalusBlessure *= -1;
  let myMalusBlessureCheck = false;

  let myNombreDeMalusStatut = 0;
  /*
  let j = 0;
  for (let i=0; i<6; i++) {
    if (tabDomainLibel[i] == "@domains." + myDomaine) {
      j = i;
    }
  };
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // si le type est statut
      if (item.system.domain == j) { // si le domaine correspond
        myNombreDeMalusStatut += Math.abs(item.system.value);
      }
      if (item.system.domain2 == j) { // si le domaine correspond
        myNombreDeMalusStatut += Math.abs(item.system.value2);
      }
      if (item.system.domain3 == j) { // si le domaine correspond
        myNombreDeMalusStatut += Math.abs(item.system.value3);
      }
    }
  }
  myNombreDeMalusStatut *= -1;
  */
  let myMalusStatutCheck = false;

  /*
  let myNombreDeMalusStatutDPh = 0;
  let myNombreDeMalusStatutDMa = 0;
  let myNombreDeMalusStatutDIn = 0;
  let myNombreDeMalusStatutDSo = 0;
  let myNombreDeMalusStatutDMy = 0;
  let j;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // si le type est statut
      j = item.system.domain;
      switch (j) {
        case '1': myNombreDeMalusStatutDPh++;
        break;
        case '2': myNombreDeMalusStatutDMa++;
        break;
        case '3': myNombreDeMalusStatutDIn++;
        break;
        case '4': myNombreDeMalusStatutDSo++;
        break;
        case '5': myNombreDeMalusStatutDMy++;
        break;
        default: // console.log(`Sorry, that's an error.`);
      }
    }
  };
  myNombreDeMalusStatutDPh *= -1;
  myNombreDeMalusStatutDMa *= -1;
  myNombreDeMalusStatutDIn *= -1;
  myNombreDeMalusStatutDSo *= -1;
  myNombreDeMalusStatutDMy *= -1;

  let myMalusStatutCheck = true;
  */


  var dialogData = {
    nd: nd,
  
    domains: "dma",
    throw: "defnc",
    actorID: myActorID._id,
    domaine: "dma",
    systemData: myActorID.system,
    nbrdedomainedph: myNbrDeDomaineDPh,
    nbrdedomainedma: myNbrDeDomaineDMa,
    nbrdedomainedin: myNbrDeDomaineDIn,
    nbrdedomainedso: myNbrDeDomaineDSo,
    nbrdedomainedmy: myNbrDeDomaineDMy,
    nbrdebonusdomainedph: myNbrDeBonusDomaineDPh,
    nbrdebonusdomainedma: myNbrDeBonusDomaineDMa,
    nbrdebonusdomainedin: myNbrDeBonusDomaineDIn,
    nbrdebonusdomainedso: myNbrDeBonusDomaineDSo,
    nbrdebonusdomainedmy: myNbrDeBonusDomaineDMy,
    bonusdomainecheck: myBonusDomaineCheck,
    nbrdebonusspecialite: myNbrDeBonusSpecialite,
    specialitecheck: mySpecialiteCheck,
    defencend: nd,
    malusblessurecheck: myMalusBlessureCheck,
    nbrdemalusblessure: myNombreDeMalusBlessure,
    malusstatutcheck: myMalusStatutCheck,
    // nbrdemalusstatut: myNombreDeMalusStatut,

    /*
    nbrdemalusstatutdph: myNombreDeMalusStatutDPh,
    nbrdemalusstatutdma: myNombreDeMalusStatutDMa,
    nbrdemalusstatutdin: myNombreDeMalusStatutDIn,
    nbrdemalusstatutdso: myNombreDeMalusStatutDSo,
    nbrdemalusstatutdmy: myNombreDeMalusStatutDMy,
    */

    shaktirestanteflag: myShaktiRestanteFlag,
    convictionrestanteflag: myconvictionRestanteFlag,
    plus1succesautoflag : myPlus1SuccesAutoFlag,
    sixexplo: mySixExploFlag,
    cinqexplo: false,
    desnonexplo: 0,
    versiondebloquee: false
  };
  const html = await renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 1000,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      nd: await myHtml.find("select[name='nd']").val(),
      
      domains: await myHtml.find("select[name='domains']").val(),
      throw: "defnc",
      ouijet: await myHtml.find("input[value='ouijet']").is(':checked'),
      defencend: await myHtml.find("select[name='defencend']").val(),
      ouishaktidefense: await myHtml.find("input[value='ouishaktidefense']").is(':checked'),
      bonusdomainecheck: await myHtml.find("input[name='bonusdomainecheck']").is(':checked'),
      d8check: await myHtml.find("input[name='d8check']").is(':checked'),
      specialitecheck: await myHtml.find("input[name='specialitecheck']").is(':checked'),
      malusblessurecheck: false,
      malusstatutcheck: false,
      malusstatutval: "0D",

      /*
      malusblessurecheck: await myHtml.find("input[value='malusblessurecheck']").is(':checked'),
      malusstatutcheck: await myHtml.find("input[value='malusstatutcheck']").is(':checked'),
      */

      nbrdedomainedph: myDialogData.nbrdedomainedph,
      nbrdedomainedma: myDialogData.nbrdedomainedma,
      nbrdedomainedin: myDialogData.nbrdedomainedin,
      nbrdedomainedso: myDialogData.nbrdedomainedso,
      nbrdedomainedmy: myDialogData.nbrdedomainedmy,

      // nbrdebonusdomainedph: myDialogData.nbrdebonusdomainedph,
      // nbrdebonusdomainedma: myDialogData.nbrdebonusdomainedma,
      // nbrdebonusdomainedin: myDialogData.nbrdebonusdomainedin,
      // nbrdebonusdomainedso: myDialogData.nbrdebonusdomainedso,
      // nbrdebonusdomainedmy: myDialogData.nbrdebonusdomainedmy,

      /*
      nbrdemalusstatutdph: myDialogData.nbrdemalusstatutdph,
      nbrdemalusstatutdma: myDialogData.nbrdemalusstatutdma,
      nbrdemalusstatutdin: myDialogData.nbrdemalusstatutdin,
      nbrdemalusstatutdso: myDialogData.nbrdemalusstatutdso,
      nbrdemalusstatutdmy: myDialogData.nbrdemalusstatutdmy,
      */

      nbrdebonusspecialite: myDialogData.nbrdebonusspecialite,
      bonusapplique: await myHtml.find("select[name='bonusapplique']").val(),
      plusdeuxdesdattaque: await myHtml.find("select[name='plusdeuxdesdattaque']").val(),
      malususapplique: await myHtml.find("select[name='malususapplique']").val(),
      ignoremalus: await myHtml.find("select[name='ignoremalus']").val(),
      malusaignorer: await myHtml.find("select[name='malusaignorer']").val(),
      succesauto: await myHtml.find("select[name='succesauto']").val(),
      plusunsuccesauto: await myHtml.find("select[name='plusunsuccesauto']").val(),
      sixexplo: await myHtml.find("input[name='sixexplo']").is(':checked'),
      cinqexplo: await myHtml.find("input[name='cinqexplo']").is(':checked'),
      desnonexplo: await myHtml.find("select[name='desnonexplo']").val(),
      versiondebloquee: await myHtml.find("input[name='versiondebloquee']").is(':checked')
    };
    return editedData;
  }
  //////////////////////////////////////////////////////////////
  
}


/* -------------------------------------------- */

async function _treatSkillDiceRollDefenceNPCDialog(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
) {
  // console.log("Il s'agit d'un PNJ ou d'un monstre")
  let myResultDialog = await _skillDiceRollDefenceNPCDialog(
    myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
    myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
    mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  );

  //////////////////////////////////////////////////////////////////
  if (!(myResultDialog)) {
    ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
    return;
  };
  //////////////////////////////////////////////////////////////////



  
  let myVersionDebloqueeFlag = (myResultDialog.versiondebloquee == 1);
  if (myVersionDebloqueeFlag) {


    myResultDialog = await _skillDiceRollDefenceNPCDialogDeblocked (
      myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
    );
 

    //////////////////////////////////////////////////////////////////
    if (!(myResultDialog)) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
      return;
      };
    //////////////////////////////////////////////////////////////////


    var nd = myResultDialog.nd;
    var total = myTotal;
    var attaquantficheId = myAttaquantficheId;
    var opposantficheId = myOpposantficheId;
    var opposanttokenId = myOpposanttokenId;

    var consideropponentprotection = myConsideropponentprotection;
    var isinventory = myIsinventory;
    var weapon = myWeapon;
    var devastra = myDevastra;
    var power = myPower;
    var magic = myMagic;
  
    var selectedinventory = mySelectedinventory;
    var selectedinventorydevastra = mySelectedinventorydevastra;
    var selectedinventorypower = mySelectedinventorypower;
    var selectedinventorymagic = mySelectedinventorymagic;
    var damage = myDamage;
    var damagetype = myDamagetype;

    var domains = myResultDialog.domains;
    var jet = "defnc";
    var ouijet = myResultDialog.ouijet;
    var defencend = myResultDialog.defencend;
    var ouishaktidefense = myResultDialog.ouishaktidefense;
    var bonusdomaineflag = myResultDialog.bonusdomainecheck;
    var specialiteflag = myResultDialog.specialitecheck;
    var malusblessureflag = false;
    var malusstatutflag = false;
    var malusstatutval = "0D";
    var nbrdedomainedph = myResultDialog.nbrdedomainedph;
    var nbrdedomainedma = myResultDialog.nbrdedomainedma;
    var nbrdedomainedin = myResultDialog.nbrdedomainedin;
    var nbrdedomainedso = myResultDialog.nbrdedomainedso;
    var nbrdedomainedmy = myResultDialog.nbrdedomainedmy;
    // var nbrdebonusdomainedph = myResultDialog.nbrdebonusdomainedph;
    // var nbrdebonusdomainedma = myResultDialog.nbrdebonusdomainedma;
    // var nbrdebonusdomainedin = myResultDialog.nbrdebonusdomainedin;
    // var nbrdebonusdomainedso = myResultDialog.nbrdebonusdomainedso;
    // var nbrdebonusdomainedmy = myResultDialog.nbrdebonusdomainedmy;
    
    /*
    var nbrdemalusstatutdph = myResultDialog.nbrdemalusstatutdph;
    var nbrdemalusstatutdma = myResultDialog.nbrdemalusstatutdma;
    var nbrdemalusstatutdin = myResultDialog.nbrdemalusstatutdin;
    var nbrdemalusstatutdso = myResultDialog.nbrdemalusstatutdso;
    var nbrdemalusstatutdmy = myResultDialog.nbrdemalusstatutdmy;
    */

    var nbrdebonusspecialite = myResultDialog.nbrdebonusspecialite;
    var bonusapplique = myResultDialog.bonusapplique;
    var plusdeuxdesdattaque = myResultDialog.plusdeuxdesdattaque; // en fait, uniquement nbre jetons Shakti à enlever
    var malususapplique = myResultDialog.malususapplique;
    var ignoremalus = 0;
    var malusaignorer = 0;
    var succesauto = myResultDialog.succesauto;
    var plusunsuccesauto = myResultDialog.plusunsuccesauto; // en fait, uniquement nbre jetons Conviction à enlever
    var desnonexplo = 0;
    var sixexploflag = myResultDialog.sixexplo;
    var cinqexploflag = myResultDialog.cinqexplo;


    // console.log("myPlusDeuxDesDAttaque", myPlusDeuxDesDAttaque);
    // console.log("myIgnoreMalus", myIgnoreMalus);
    // console.log("myPlusUnSuccesAuto", myPlusUnSuccesAuto);
    // console.log("myActor.system.conviction.piledejetons", myActor.system.conviction.piledejetons);

    var shaktisuffisanteflag = (plusdeuxdesdattaque <= myActor.system.shakti_initiale.value); // s'il reste assez de jetons de Shakti
    // var convictionsuffisanteflag = ((ignoremalus + plusunsuccesauto) <= myActor.system.conviction.piledejetons); // s'il reste assez de jetons de Conviction

  } else {

    var nd = myResultDialog.nd;
    var total = myTotal;
    var attaquantficheId = myAttaquantficheId;
    var opposantficheId = myOpposantficheId;
    var opposanttokenId = myOpposanttokenId;

    var consideropponentprotection = myConsideropponentprotection;
    var isinventory = myIsinventory;
    var weapon = myWeapon;
    var devastra = myDevastra;
    var power = myPower;
    var magic = myMagic;
  
    var selectedinventory = mySelectedinventory;
    var selectedinventorydevastra = mySelectedinventorydevastra;
    var selectedinventorypower = mySelectedinventorypower;
    var selectedinventorymagic = mySelectedinventorymagic;
    var damage = myDamage;
    var damagetype = myDamagetype;

    var domains = myResultDialog.domains;
    var jet = "defnc";
    var ouijet = myResultDialog.ouijet;
    var defencend = myResultDialog.defencend;
    var ouishaktidefense = myResultDialog.ouishaktidefense;
    var bonusdomaineflag = myResultDialog.bonusdomainecheck;
    var specialiteflag = myResultDialog.specialitecheck;
    var malusblessureflag = myResultDialog.malusblessurecheck;
    var malusstatutflag = myResultDialog.malusstatutcheck;
    var malusstatutval = myResultDialog.malusstatutval;
    var nbrdedomainedph = myResultDialog.nbrdedomainedph;
    var nbrdedomainedma = myResultDialog.nbrdedomainedma;
    var nbrdedomainedin = myResultDialog.nbrdedomainedin;
    var nbrdedomainedso = myResultDialog.nbrdedomainedso;
    var nbrdedomainedmy = myResultDialog.nbrdedomainedmy;
    // var nbrdebonusdomainedph = myResultDialog.nbrdebonusdomainedph;
    // var nbrdebonusdomainedma = myResultDialog.nbrdebonusdomainedma;
    // var nbrdebonusdomainedin = myResultDialog.nbrdebonusdomainedin;
    // var nbrdebonusdomainedso = myResultDialog.nbrdebonusdomainedso;
    // var nbrdebonusdomainedmy = myResultDialog.nbrdebonusdomainedmy;

    /*
    var nbrdemalusstatutdph = myResultDialog.nbrdemalusstatutdph;
    var nbrdemalusstatutdma = myResultDialog.nbrdemalusstatutdma;
    var nbrdemalusstatutdin = myResultDialog.nbrdemalusstatutdin;
    var nbrdemalusstatutdso = myResultDialog.nbrdemalusstatutdso;
    var nbrdemalusstatutdmy = myResultDialog.nbrdemalusstatutdmy;
    */

    var nbrdebonusspecialite = myResultDialog.nbrdebonusspecialite;
    var bonusapplique = myResultDialog.bonusapplique;
    var plusdeuxdesdattaque = myResultDialog.plusdeuxdesdattaque;
    var malususapplique = myResultDialog.malususapplique;
    var ignoremalus = 0;
    var malusaignorer = 0;

    /*
    var ignoremalus = myResultDialog.ignoremalus;
    var malusaignorer = myResultDialog.malusaignorer;
    */

    var succesauto = myResultDialog.succesauto;
    var plusunsuccesauto = myResultDialog.plusunsuccesauto;
    var desnonexplo = myResultDialog.desnonexplo;
    var sixexplo = myResultDialog.sixexplo;
    var cinqexplo = myResultDialog.cinqexplo;


    // console.log("myIgnoreMalus", myIgnoreMalus);
    // console.log("myPlusUnSuccesAuto", myPlusUnSuccesAuto);
    // console.log("myActor.system.conviction.piledejetons", myActor.system.conviction.piledejetons);

    var shaktisuffisanteflag = (plusdeuxdesdattaque <= myActor.system.shakti_initiale.value); // s'il reste assez de jetons de Shakti
    // var convictionsuffisanteflag = ((ignoremalus + plusunsuccesauto) <= myActor.system.conviction.piledejetons); // s'il reste assez de jetons de Conviction
  
  }


  let myNbrDeDomaine = 0;
  let myNbrDeBonusDomaine = 0;
  switch (domains) {
    case "dph":
      myNbrDeDomaine = parseInt(nbrdedomainedph);
      // myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedph);

    break;
    case "dma":
      myNbrDeDomaine = parseInt(nbrdedomainedma);
      // myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedma);

    break;
    case "din":
      myNbrDeDomaine = parseInt(nbrdedomainedin);
      // myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedin);

    break;
    case "dso":
      myNbrDeDomaine = parseInt(nbrdedomainedso);
      // myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedso);

    break;
    case "dmy":
      myNbrDeDomaine = parseInt(nbrdedomainedmy);
      // myNbrDeBonusDomaine = parseInt(nbrdebonusdomainedmy);

    break;
    default: // console.log("C'est bizarre !");
  }
  if (!bonusdomaineflag) {
    myNbrDeBonusDomaine = 0;
  }
  let myNbrDeBonusSpecialite = 0;
  if (specialiteflag) {
    myNbrDeBonusSpecialite = parseInt(nbrdebonusspecialite);
  }
  let myBonusApplique = parseInt(bonusapplique);
  let myMalusApplique = parseInt(malususapplique);
  let myIgnoreMalus = parseInt(ignoremalus);
  let myMalusAIgnorer = parseInt(malusaignorer);
  let mySuccesAuto = parseInt(succesauto);
  let myShaktiSuffisanteFlag = parseInt(shaktisuffisanteflag);
  let jetLibel = jet;
  let myPlusDeuxDesDAttaque = parseInt(plusdeuxdesdattaque);
  let myconvictionSuffisanteFlag = false;
  let myPlusUnSuccesAuto = parseInt(plusunsuccesauto);
  let myCinqExploFlag = parseInt(cinqexplo);
  let mySixExploFlag = parseInt(sixexplo);
  let myMalusBlessureCheck = parseInt(malusblessureflag);
  let myMalusStatutCheck = malusstatutflag;
  let myMalusStatutVal = malusstatutval;
  let myDesNonExplo = parseInt(desnonexplo);

  var theDefence = myDefence;
  var theDamage = myDamage;
  var theDamagetype = myDamagetype;
  var theShakti = myShakti;

  
  if (ouijet) {

    /***********************************************************************************
    * 
    * {N} : nombre de dés lancés
    * {S} : seuil à atteindre (Niveau de Difficulté)
    * {A} : nombre de réussites automatiques
    * 
    * /r {N}d6cs>={S} : roll N d6, count successes (>=S), no dice results are explosive
    * /r {N}d6x=6cs>={S} : roll N d6, count successes (>=S), only 6 are explosive
    * /r {N}d6x>=5cs>={S} : roll N d6, count successes (>=S), 5 and 6 are explosive
    * 
    * nombre de 1 = ?
    * nombre de 2 = ?
    * nombre de 3 = ?
    * nombre de 4 = ?
    * nombre de 5 = ?
    * nombre de 6 = ?
    * nombre de réussites automatiques = {A}
    * defence nombre de réussites = roll.result+{A}
    * 
    ************************************************************************************/


    let d6_1 = 0;
    let d6_2 = 0;
    let d6_3 = 0;
    let d6_4 = 0;
    let d6_5 = 0;
    let d6_6 = 0;
    let d6_A = 0;

    let suite = "[";

    let defence = parseInt(myNbrDeDomaine);

    // console.log("myNbrDeBonusDomaine", myNbrDeBonusDomaine);
    if (bonusdomaineflag) {
      defence += parseInt(myNbrDeBonusDomaine);
      // console.log("myNbrDeBonusDomaine", "compabilisé");
    };

    // console.log("myNbrDeBonusSpecialite", myNbrDeBonusSpecialite);
    if (specialiteflag) {
      defence += parseInt(myNbrDeBonusSpecialite);
      // console.log("myNbrDeBonusSpecialite", "compabilisé");
    };


    /*
    Ici, on vérifie la validité de tous les bonus et on les applique ; et on soustrait les jetons en conséquence.
    */

    let myBonusSupplem = parseInt(myBonusApplique);
    let myMalusSupplem = parseInt(myMalusApplique) - parseInt(myMalusAIgnorer);
    if (myMalusSupplem < 0) {myMalusSupplem = 0;};
    var mySuccesAutoSupplem = parseInt(mySuccesAuto);


    // Application des bonus valides et des malus

    // Si c'est via le prompt débridé, myBonusApplique comptabilise déjà les points de myPlusDeuxDesDAttaque
    if (myShaktiSuffisanteFlag && jetLibel == "attck" && !(myVersionDebloqueeFlag)) {
      myBonusSupplem += 2 * parseInt(myPlusDeuxDesDAttaque);
    }

    // Si c'est via le prompt débridé, myMalusApplique comptabilise déjà les points de myIgnoreMalus
    // et mySuccesAuto, ceux de myPlusUnSuccesAuto
    if (myconvictionSuffisanteFlag && !(myVersionDebloqueeFlag)) {
      myMalusSupplem -= parseInt(myIgnoreMalus);
      if (myMalusSupplem < 0) { myMalusSupplem = 0;};

      mySuccesAutoSupplem += parseInt(myPlusUnSuccesAuto);
    }


    defence += myBonusSupplem;
    defence -= myMalusSupplem;

    d6_A = mySuccesAutoSupplem;



    // Traitement du cas des malus de blessures

    let myNombreDeMalusBlessure = 0;
    if (myMalusBlessureCheck) {
      for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
        if (item.system.subtype == "0") { // si le type est blessure
          myNombreDeMalusBlessure += Math.abs(item.system.value);
        }
      }
    };
    defence -= myNombreDeMalusBlessure;


    // Traitement du cas des malus de statuts

    let myNombreDeMalusStatut = 0;
    if (myMalusStatutCheck) {
      if (myMalusStatutVal.charAt(0) == "-")  {
        myNombreDeMalusStatut = parseInt(myMalusStatutVal);
      }
    };
    // console.log("myMalusStatutCheck = ", myMalusStatutCheck);

    // console.log("myMalusStatutVal = ", myMalusStatutVal);

    // console.log("myNombreDeMalusStatut = ", myNombreDeMalusStatut);

    defence += myNombreDeMalusStatut; // déjà négatif !
    


    // console.log("defence = ", defence);

    //////////////////////////////////////////////////////////////////
    if (defence <= 0) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error1"));
      return;
      };
    //////////////////////////////////////////////////////////////////



    // Soustraction des jetons si en nombre suffisant, sinon "return"
    if ((jetLibel == "attck") && parseInt(myPlusDeuxDesDAttaque)) {
      if (myShaktiSuffisanteFlag) {
        await myActor.update({ "system.shakti_initiale.value":  parseInt(myActor.system.shakti_initiale.value) - parseInt(myPlusDeuxDesDAttaque) });
        ui.notifications.info(game.i18n.localize("DEVASTRA.Info4-npc"));
      } else {
        ui.notifications.error(game.i18n.localize("DEVASTRA.Error4-npc"));
      return;
      }
    }



    // Ici on traite le cas des dés non-explosifs
    if (myDesNonExplo == 2) {
      myCinqExploFlag = false;
      mySixExploFlag = false;
    } else if ((myDesNonExplo == 1) && myCinqExploFlag) {
      myCinqExploFlag = false;
    } else if ((myDesNonExplo == 1) && !(myCinqExploFlag)) {
      mySixExploFlag = false;
    };


    if (suite.length >= 2) {
      suite += "%";
      suite = suite.replace(', %', ']');
    } else {
      suite = "";
    };

    var n = {
      myReussite: 0,
      myND: nd,
      mySixExplo: mySixExploFlag,
      myCinqExplo: myCinqExploFlag,
      nbrRelance: defence,
      d6_1: 0,
      d6_2: 0,
      d6_3: 0,
      d6_4: 0,
      d6_5: 0,
      d6_6: 0

    };

    var msg;

    let myRoll = "";

    do {
      let myRoll = "";
      myRoll += n.nbrRelance+"d6cs>="+n.myND;
      d6_1 = 0;
      d6_2 = 0;
      d6_3 = 0;
      d6_4 = 0;
      d6_5 = 0;
      d6_6 = 0;

      const r = new Roll(myRoll, myActor.getRollData());
      await r.evaluate();
      // console.log(r);
      let myRDice = r.dice;
      // console.log(myRDice);
      // console.log(myRDice[0]);
      for (let key in myRDice) {
        // console.log(myRDice[key]);
        for (let i=0; i<myRDice[key].number; i++) {
          let myD = myRDice[key].results[i].result;
          // console.log(myD);
          switch ( myD ) {
            case 1: d6_1++;
            break;
            case 2: d6_2++;
            break;
            case 3: d6_3++;
            break;
            case 4: d6_4++;
            break;
            case 5: d6_5++;
            break;
            case 6: d6_6++;
            break;
            default: // console.log("C'est bizarre !");
          };
          n.nbrRelance = 0;
          if (n.mySixExplo) {
            n.nbrRelance += d6_6;
             if (n.myCinqExplo && 5 >= n.myND) { // les 5 ne peuvent être explosifs que si ce sont des réussites
              n.nbrRelance += d6_5;
            }
          }
        }
      };


      n.d6_1 += d6_1;
      n.d6_2 += d6_2;
      n.d6_3 += d6_3;
      n.d6_4 += d6_4;
      n.d6_5 += d6_5;
      n.d6_6 += d6_6;


      n.myReussite = parseInt(n.myReussite) + parseInt(r._total);

      // r._total = "0";

      const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer
      // console.log("myTypeOfThrow", myTypeOfThrow);

      msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        rollMode: myTypeOfThrow
      });

      await new Promise(w => setTimeout(w, 2750));

    } while (n.nbrRelance);

    const rModif = new Roll("0[Defense Réussites]", myActor.getRollData());
    await rModif.evaluate();
    rModif._total  = parseInt(n.myReussite) + parseInt(mySuccesAuto); // On ajoute les succès automatiques

    defence = parseInt(n.myReussite) + parseInt(mySuccesAuto);


    theDefence = defence;


    const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer
    // console.log("myTypeOfThrow", myTypeOfThrow);

    msg = await rModif.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: myTypeOfThrow
    });

      
    var d_successes = parseInt(n.myReussite) + parseInt(mySuccesAutoSupplem); // On ajoute les succès automatiques

    // Smart Message
    /*
    let opponentActorId = "";
    let opponentActorName = "";
    if (opponentActor) {
      opponentActorId = opponentActor._id;
      opponentActorName = opponentActor.name;
    };
    */

    let smartTemplate = 'systems/devastra/templates/form/dice-result-defence.html';

    /*
    let myDefence = 0;
    */

    const myDefence = theDefence; // calculé (lancer de dés)

    const smartData = {
      nd: nd,
      total: total,
      attaquantficheId: attaquantficheId,
      opposantficheId: opposantficheId,
      opposanttokenId: opposanttokenId,

      consideropponentprotection: consideropponentprotection,

      isinventory: isinventory,
      weapon: weapon,
      devastra: devastra,
      power: power,
      magic: magic,
  
      selectedinventory: selectedinventory,
      selectedinventorydevastra: selectedinventorydevastra,
      selectedinventorypower: selectedinventorypower,
      selectedinventorymagic: selectedinventorymagic,
      damage: damage,
      damagetype: damagetype,
      
      defence: myDefence,

      shakti: theShakti,

      domaine: domains,
      jet: jet,
      succes: d_successes,
      d1: n.d6_1,
      d2: n.d6_2,
      d3: n.d6_3,
      d4: n.d6_4,
      d5: n.d6_5,
      d6: n.d6_6,
      dA: mySuccesAutoSupplem
    }
    // console.log("smartData avant retour func = ", smartData);
    const smartHtml = await renderTemplate(smartTemplate, smartData);
      
    ChatMessage.create({
      user: game.user.id,
      // speaker: ChatMessage.getSpeaker({ token: this.actor }),
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      content: smartHtml,
      rollMode: myTypeOfThrow
    });

  } else {

    const shaktidefenceTemplate = 'systems/devastra/templates/form/shakti-prompt.html';
    const shaktidefenceTitle = game.i18n.localize("DEVASTRA.ShaktiEnDefense");
    const shaktidefenceDialogOptions  = {
      classes: ["devastra", "sheet"]
    };
    myResultDialog = await _skillEnterShaktiDefence(
      myActor, shaktidefenceTemplate, shaktidefenceTitle, shaktidefenceDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, theDamage, theDamagetype, theDefence, theShakti
    );


    //////////////////////////////////////////////////////////////////
    if (!(myResultDialog)) {
      ui.notifications.warn(game.i18n.localize("DEVASTRA.Error2"));
      return;
      };
    //////////////////////////////////////////////////////////////////

    const thisistheShakti = myResultDialog.defenseshakti;
    const thiistheDefence = theDefence.toString();

    _showCalculateShaktiInChat(
      myActor, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
      myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
      mySelectedinventorypower, mySelectedinventorymagic, theDamage, theDamagetype, thiistheDefence, thisistheShakti
    );

    
  };

}


/* -------------------------------------------- */

async function _skillDiceRollDefenceNPCDialog(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype, myDefence, myShakti
  ) {

  // Render modal dialog
  template = template || 'systems/devastra/templates/form/skill-dice-prompt-defence-npc.html';
  const myActorID = myActor;
  const title = myTitle;
  const dialogOptions = myDialogOptions;
  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const opposanttokenId = myOpposanttokenId;


  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const myNbrDeBonusSpecialite = 1;
  const mySpecialiteCheck = false;
  const myBonusDomaineCheck = true;
  const mySixExploFlag = (myActorID.system.prana.value <= myActorID.system.prana.tenace); // si Tenace ou moins
  const myPlus1SuccesAutoFlag = (myActorID.system.prana.value > myActorID.system.prana.tenace); // si Vaillant
  if (myActorID.type == 'character') {
    var myShaktiRestanteFlag = (myActorID.system.shakti.piledejetons); // s'il reste des jetons de Shakti
  } else {
    var myShaktiRestanteFlag = (myActorID.system.shakti_initiale.value);
  };
  const myconvictionRestanteFlag = (myActorID.system.conviction.piledejetons); // s'il reste des jetons de Conviction

  const myNbrDeDomaineDPh = myActorID.system.domains.dph.value;
  const myNbrDeBonusDomaineDPh = myActorID.system.domains.dph.bonusdice;

  const myNbrDeDomaineDMa = myActorID.system.domains.dma.value;
  const myNbrDeBonusDomaineDMa = myActorID.system.domains.dma.bonusdice;

  const myNbrDeDomaineDIn = myActorID.system.domains.din.value;
  const myNbrDeBonusDomaineDIn = myActorID.system.domains.din.bonusdice;

  const myNbrDeDomaineDSo = myActorID.system.domains.dso.value;
  const myNbrDeBonusDomaineDSo = myActorID.system.domains.dso.bonusdice;

  const myNbrDeDomaineDMy = myActorID.system.domains.dmy.value;
  const myNbrDeBonusDomaineDMy = myActorID.system.domains.dmy.bonusdice;


  let myNombreDeMalusBlessure = 0;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "0") { // si le type est blessure
      myNombreDeMalusBlessure += Math.abs(item.system.value);
    }
  };
  myNombreDeMalusBlessure *= -1;
  let myMalusBlessureCheck = false;

  
  let myItemStatute = {};

  function myObject(id, label)
  {
    this.id = id;
    this.label = label;
  };

  myItemStatute["0"] = new myObject("0", game.i18n.localize("DEVASTRA.opt.none"));
  // myItemWeapon["-1"] = new myObject("-1", game.i18n.localize("DEVASTRA.barehands"));
  for (let item of myActorID.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // 1 = statut ; 0 = blessure
    myItemStatute[item.id.toString()] = new myObject(item.id.toString(), item.name.toString());
    };
  };

  let myNombreDeMalusStatut = 0;
  /*
  let myNombreDeMalusStatutDPh = 0;
  let myNombreDeMalusStatutDMa = 0;
  let myNombreDeMalusStatutDIn = 0;
  let myNombreDeMalusStatutDSo = 0;
  let myNombreDeMalusStatutDMy = 0;
  let j;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // si le type est statut
      j = item.system.domain;
      switch (j) {
        case '1': myNombreDeMalusStatutDPh++;
        break;
        case '2': myNombreDeMalusStatutDMa++;
        break;
        case '3': myNombreDeMalusStatutDIn++;
        break;
        case '4': myNombreDeMalusStatutDSo++;
        break;
        case '5': myNombreDeMalusStatutDMy++;
        break;
        default: // console.log(`Sorry, that's an error.`);
      }
    }
  };
  myNombreDeMalusStatutDPh *= -1;
  myNombreDeMalusStatutDMa *= -1;
  myNombreDeMalusStatutDIn *= -1;
  myNombreDeMalusStatutDSo *= -1;
  myNombreDeMalusStatutDMy *= -1;
  */

  let myMalusStatutCheck = true;

    var dialogData = {
    nd: nd,
  
    domains: "dma",
    throw: "defnc",
    actorID: myActorID._id,
    domaine: "dma",
    systemData: myActorID.system,
    nbrdedomainedph: myNbrDeDomaineDPh,
    nbrdedomainedma: myNbrDeDomaineDMa,
    nbrdedomainedin: myNbrDeDomaineDIn,
    nbrdedomainedso: myNbrDeDomaineDSo,
    nbrdedomainedmy: myNbrDeDomaineDMy,
    nbrdebonusdomainedph: myNbrDeBonusDomaineDPh,
    nbrdebonusdomainedma: myNbrDeBonusDomaineDMa,
    nbrdebonusdomainedin: myNbrDeBonusDomaineDIn,
    nbrdebonusdomainedso: myNbrDeBonusDomaineDSo,
    nbrdebonusdomainedmy: myNbrDeBonusDomaineDMy,
    bonusdomainecheck: myBonusDomaineCheck,
    nbrdebonusspecialite: myNbrDeBonusSpecialite,
    specialitecheck: mySpecialiteCheck,
    defencend: nd,
    malusblessurecheck: myMalusBlessureCheck,
    nbrdemalusblessure: myNombreDeMalusBlessure,
    malusstatutcheck: myMalusStatutCheck,
    statutechoices: myItemStatute,
    nbrdemalusstatut: myNombreDeMalusStatut,

    /*
    nbrdemalusstatutdph: myNombreDeMalusStatutDPh,
    nbrdemalusstatutdma: myNombreDeMalusStatutDMa,
    nbrdemalusstatutdin: myNombreDeMalusStatutDIn,
    nbrdemalusstatutdso: myNombreDeMalusStatutDSo,
    nbrdemalusstatutdmy: myNombreDeMalusStatutDMy,
    */

    shaktirestanteflag: myShaktiRestanteFlag,
    convictionrestanteflag: myconvictionRestanteFlag,
    plus1succesautoflag : myPlus1SuccesAutoFlag,
    sixexplo: mySixExploFlag,
    cinqexplo: false,
    desnonexplo: 0,
    versiondebloquee: false
  };
  const html = await renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 1000,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      nd: await myHtml.find("select[name='nd']").val(),
      
      domains: await myHtml.find("select[name='domains']").val(),
      throw: "defnc",
      ouijet: await myHtml.find("input[value='ouijet']").is(':checked'),
      defencend: await myHtml.find("select[name='defencend']").val(),
      ouishaktidefense: await myHtml.find("input[value='ouishaktidefense']").is(':checked'),
      bonusdomainecheck: await myHtml.find("input[name='bonusdomainecheck']").is(':checked'),
      specialitecheck: await myHtml.find("input[name='specialitecheck']").is(':checked'),
      malusblessurecheck: await myHtml.find("input[name='malusblessurecheck']").is(':checked'),
      malusstatutcheck: await myHtml.find("input[name='malusstatutcheck']").is(':checked'),
      malusstatutval: await myHtml.find("td[class='valeur2 malusstatute']").text(),
      nbrdedomainedph: myDialogData.nbrdedomainedph,
      nbrdedomainedma: myDialogData.nbrdedomainedma,
      nbrdedomainedin: myDialogData.nbrdedomainedin,
      nbrdedomainedso: myDialogData.nbrdedomainedso,
      nbrdedomainedmy: myDialogData.nbrdedomainedmy,
      nbrdebonusdomainedph: myDialogData.nbrdebonusdomainedph,
      nbrdebonusdomainedma: myDialogData.nbrdebonusdomainedma,
      nbrdebonusdomainedin: myDialogData.nbrdebonusdomainedin,
      nbrdebonusdomainedso: myDialogData.nbrdebonusdomainedso,
      nbrdebonusdomainedmy: myDialogData.nbrdebonusdomainedmy,

      /*
      nbrdemalusstatutdph: myDialogData.nbrdemalusstatutdph,
      nbrdemalusstatutdma: myDialogData.nbrdemalusstatutdma,
      nbrdemalusstatutdin: myDialogData.nbrdemalusstatutdin,
      nbrdemalusstatutdso: myDialogData.nbrdemalusstatutdso,
      nbrdemalusstatutdmy: myDialogData.nbrdemalusstatutdmy,
      */

      nbrdebonusspecialite: myDialogData.nbrdebonusspecialite,
      bonusapplique: await myHtml.find("select[name='bonusapplique']").val(),
      plusdeuxdesdattaque: await myHtml.find("select[name='plusdeuxdesdattaque']").val(),
      malususapplique: await myHtml.find("select[name='malususapplique']").val(),
      ignoremalus: await myHtml.find("select[name='ignoremalus']").val(),
      malusaignorer: await myHtml.find("select[name='malusaignorer']").val(),
      succesauto: await myHtml.find("select[name='succesauto']").val(),
      plusunsuccesauto: await myHtml.find("select[name='plusunsuccesauto']").val(),
      sixexplo: await myHtml.find("input[name='sixexplo']").is(':checked'),
      cinqexplo: await myHtml.find("input[name='cinqexplo']").is(':checked'),
      desnonexplo: await myHtml.find("select[name='desnonexplo']").val(),
      versiondebloquee: await myHtml.find("input[name='versiondebloquee']").is(':checked')
    };
    return editedData;
  }
}


/* -------------------------------------------- */

async function _skillDiceRollDefenceNPCDialogDeblocked(
  myActor, template, myTitle, myDialogOptions, myND, myTotal, myAttaquantficheId, myOpposantficheId, myOpposanttokenId,
  myConsideropponentprotection, myIsinventory, myWeapon, myDevastra, myPower, myMagic, mySelectedinventory, mySelectedinventorydevastra,
  mySelectedinventorypower, mySelectedinventorymagic, myDamage, myDamagetype
  ) {

  // Render modal dialog
  template = template || 'systems/devastra/templates/form/skill-dice-prompt-defence-debride-npc.html';
  const myActorID = myActor;
  const title = myTitle;
  const dialogOptions = myDialogOptions;
  const nd = myND;
  const total = myTotal;
  const attaquantficheId = myAttaquantficheId;
  const opposantficheId = myOpposantficheId;
  const opposanttokenId = myOpposanttokenId;

  const consideropponentprotection = myConsideropponentprotection;
  const isinventory = myIsinventory;
  const weapon = myWeapon;
  const devastra = myDevastra;
  const power = myPower;
  const magic = myMagic;

  const selectedinventory = mySelectedinventory;
  const selectedinventorydevastra = mySelectedinventorydevastra;
  const selectedinventorypower = mySelectedinventorypower;
  const selectedinventorymagic = mySelectedinventorymagic;
  const damage = myDamage;
  const damagetype = myDamagetype;

  const myNbrDeBonusSpecialite = 1;
  const mySpecialiteCheck = false;
  const myBonusDomaineCheck = true;
  const mySixExploFlag = (myActorID.system.prana.value <= myActorID.system.prana.tenace); // si Tenace ou moins
  const myPlus1SuccesAutoFlag = (myActorID.system.prana.value > myActorID.system.prana.tenace); // si Vaillant
  if (myActorID.type == 'character') {
    var myShaktiRestanteFlag = (myActorID.system.shakti.piledejetons); // s'il reste des jetons de Shakti
  } else {
    var myShaktiRestanteFlag = (myActorID.system.shakti_initiale.value);
  };
  const myNbrDeDomaineDPh = myActorID.system.domains.dph.value;

  const myNbrDeDomaineDMa = myActorID.system.domains.dma.value;

  const myNbrDeDomaineDIn = myActorID.system.domains.din.value;

  const myNbrDeDomaineDSo = myActorID.system.domains.dso.value;

  const myNbrDeDomaineDMy = myActorID.system.domains.dmy.value;

  let myNombreDeMalusBlessure = 0;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "0") { // si le type est blessure
      myNombreDeMalusBlessure += Math.abs(item.system.value);
    }
  };
  myNombreDeMalusBlessure *= -1;

  let myMalusBlessureCheck = false;

  let myNombreDeMalusStatut = 0;
  /*
  let myNombreDeMalusStatutDPh = 0;
  let myNombreDeMalusStatutDMa = 0;
  let myNombreDeMalusStatutDIn = 0;
  let myNombreDeMalusStatutDSo = 0;
  let myNombreDeMalusStatutDMy = 0;
  let j;
  for (let item of myActor.items.filter(item => item.type === 'blessureoustatut')) {
    if (item.system.subtype == "1") { // si le type est statut
      j = item.system.domain;
      switch (j) {
        case '1': myNombreDeMalusStatutDPh++;
        break;
        case '2': myNombreDeMalusStatutDMa++;
        break;
        case '3': myNombreDeMalusStatutDIn++;
        break;
        case '4': myNombreDeMalusStatutDSo++;
        break;
        case '5': myNombreDeMalusStatutDMy++;
        break;
        default: // console.log(`Sorry, that's an error.`);
      }
    }
  };
  myNombreDeMalusStatutDPh *= -1;
  myNombreDeMalusStatutDMa *= -1;
  myNombreDeMalusStatutDIn *= -1;
  myNombreDeMalusStatutDSo *= -1;
  myNombreDeMalusStatutDMy *= -1;
  */

  let myMalusStatutCheck = false;

  var dialogData = {
    nd: nd,
  
    domains: "dma",
    throw: "defnc",
    actorID: myActorID._id,
    domaine: "dma",
    systemData: myActorID.system,
    nbrdedomainedph: myNbrDeDomaineDPh,
    nbrdedomainedma: myNbrDeDomaineDMa,
    nbrdedomainedin: myNbrDeDomaineDIn,
    nbrdedomainedso: myNbrDeDomaineDSo,
    nbrdedomainedmy: myNbrDeDomaineDMy,
    // nbrdebonusdomainedph: myNbrDeBonusDomaineDPh,
    // nbrdebonusdomainedma: myNbrDeBonusDomaineDMa,
    // nbrdebonusdomainedin: myNbrDeBonusDomaineDIn,
    // nbrdebonusdomainedso: myNbrDeBonusDomaineDSo,
    // nbrdebonusdomainedmy: myNbrDeBonusDomaineDMy,
    bonusdomaineflag: myBonusDomaineCheck,
    nbrdebonusspecialite: myNbrDeBonusSpecialite,
    specialiteflag: mySpecialiteCheck,
    defencend: nd,
    malusblessureflag: myMalusBlessureCheck,
    nbrdemalusblessure: myNombreDeMalusBlessure,
    malusstatutflag: myMalusStatutCheck,
    // nbrdemalusstatut: myNombreDeMalusStatut,

    /*
    nbrdemalusstatutdph: myNombreDeMalusStatutDPh,
    nbrdemalusstatutdma: myNombreDeMalusStatutDMa,
    nbrdemalusstatutdin: myNombreDeMalusStatutDIn,
    nbrdemalusstatutdso: myNombreDeMalusStatutDSo,
    nbrdemalusstatutdmy: myNombreDeMalusStatutDMy,
    */

    shaktirestanteflag: myShaktiRestanteFlag,
    // convictionrestanteflag: myconvictionRestanteFlag,
    plus1succesautoflag : myPlus1SuccesAutoFlag,
    sixexplo: mySixExploFlag,
    cinqexplo: false,
    desnonexplo: 0,
    versiondebloquee: false
  };

  const html = await renderTemplate(template, dialogData);
  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('DEVASTRA.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 1000,
      height: "auto"
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  //////////////////////////////////////////////////////////////
  async function _computeResult(myActor, myDialogData, myHtml) {
    const editedData = {
      nd: await myHtml.find("select[name='nd']").val(),
      
      domains: await myHtml.find("select[name='domains']").val(),
      throw: "defnc",
      ouijet: await myHtml.find("input[value='ouijet']").is(':checked'),
      defencend: await myHtml.find("select[name='defencend']").val(),
      ouishaktidefense: await myHtml.find("input[value='ouishaktidefense']").is(':checked'),
      bonusdomainecheck: await myHtml.find("input[name='bonusdomainecheck']").is(':checked'),
      specialitecheck: await myHtml.find("input[name='specialitecheck']").is(':checked'),

      malusblessurecheck: false,
      malusstatutcheck: false,
      malusstatutval: "0D",
      /*
      malusblessurecheck: await myHtml.find("input[value='malusblessurecheck']").is(':checked'),
      malusstatutcheck: await myHtml.find("input[value='malusstatutcheck']").is(':checked'),
      */

      nbrdedomainedph: myDialogData.nbrdedomainedph,
      nbrdedomainedma: myDialogData.nbrdedomainedma,
      nbrdedomainedin: myDialogData.nbrdedomainedin,
      nbrdedomainedso: myDialogData.nbrdedomainedso,
      nbrdedomainedmy: myDialogData.nbrdedomainedmy,
      // nbrdebonusdomainedph: myDialogData.nbrdebonusdomainedph,
      // nbrdebonusdomainedma: myDialogData.nbrdebonusdomainedma,
      // nbrdebonusdomainedin: myDialogData.nbrdebonusdomainedin,
      // nbrdebonusdomainedso: myDialogData.nbrdebonusdomainedso,
      // nbrdebonusdomainedmy: myDialogData.nbrdebonusdomainedmy,

      /*
      nbrdemalusstatutdph: myDialogData.nbrdemalusstatutdph,
      nbrdemalusstatutdma: myDialogData.nbrdemalusstatutdma,
      nbrdemalusstatutdin: myDialogData.nbrdemalusstatutdin,
      nbrdemalusstatutdso: myDialogData.nbrdemalusstatutdso,
      nbrdemalusstatutdmy: myDialogData.nbrdemalusstatutdmy,
      */
     
      nbrdebonusspecialite: myDialogData.nbrdebonusspecialite,
      bonusapplique: await myHtml.find("select[name='bonusapplique']").val(),
      plusdeuxdesdattaque: await myHtml.find("select[name='plusdeuxdesdattaque']").val(),
      malususapplique: await myHtml.find("select[name='malususapplique']").val(),
      ignoremalus: await myHtml.find("select[name='ignoremalus']").val(),
      malusaignorer: await myHtml.find("select[name='malusaignorer']").val(),
      succesauto: await myHtml.find("select[name='succesauto']").val(),
      plusunsuccesauto: await myHtml.find("select[name='plusunsuccesauto']").val(),
      sixexplo: await myHtml.find("input[name='sixexplo']").is(':checked'),
      cinqexplo: await myHtml.find("input[name='cinqexplo']").is(':checked'),
      desnonexplo: await myHtml.find("select[name='desnonexplo']").val(),
      versiondebloquee: await myHtml.find("input[name='versiondebloquee']").is(':checked')
    };
    return editedData;
  }
  //////////////////////////////////////////////////////////////
  
}

async function _showAppliedDamageInChat(
  myActor, nd, total, attaquantficheId, opposantficheId, opposanttokenId,
  consideropponentprotection, isinventory, weapon, devastra, power, magic, selectedinventory, selectedinventorydevastra,
  selectedinventorypower, selectedinventorymagic, damage, damagetype, defence, shakti
) {
// Ici on applique les dégâts individuels reçus

  var myTotal = 0;
  if (total != "") { myTotal = parseInt(total); };
  var myDefence = 0;
  if (defence != "") { myDefence = parseInt(defence); };
  var myShakti = 0;
  if (shakti != "") { myShakti = parseInt(shakti); };
  const youwin = ((myTotal - (myDefence + myShakti)) <= 0);

  var myActorId = "";
  var theActiveActor = null;
  var opponentFlag = false;
  var tokenFlag = false;
  var myToken = null;
  var thatToken = null;
  var thisTokens = null;

  if (opposantficheId == "" || opposantficheId == "0") {
  myActorId = attaquantficheId;
  theActiveActor = game.actors.get(myActorId);
  } else {
    myActorId = opposantficheId;
    opponentFlag = true;
    theActiveActor = game.actors.get(myActorId);
    thisTokens = game.actors.get(myActorId).getActiveTokens(false, false);
    for (let theToken in thisTokens) {
      thatToken = thisTokens[theToken];
      if (thatToken.document.id == opposanttokenId) {
        myToken = thatToken;
        tokenFlag = true;
      };
    }; 
    if (tokenFlag) { theActiveActor = myToken.actor };
  }
  let theAttackantActor = game.actors.get(attaquantficheId);
  let theOpponentActor;
  if (tokenFlag) { theOpponentActor = myToken.actor };

  //// const myOpponent = game.actors.get(opposantficheId);

  const optNone = game.i18n.localize("DEVASTRA.opt.none");
  const myDamage = parseInt(damage);

  var myDamageType = optNone;
  const theDamageType = damagetype.toString();
  switch (theDamageType) {
    case "1": myDamageType = "@domains.dph";
    break;
    case "2": myDamageType = "@domains.dma";
    break;
    case "3": myDamageType = "@domains.din";
    break;
    case "4": myDamageType = "@domains.dso";
    break;
    case "5": myDamageType = "@domains.dmy";
    break;
    default: myDamageType = optNone;
  }

  var sentence1 = "";
  var sentence2 = "";
  var sentence3 = "";
  var sentence4 = "";

  // var pdc = 0; // J'avais oublié de calculer ça ! :
  var pdc = myTotal - (myDefence + myShakti);
  var pdcMinusArmor = 0;


  sentence1 = game.i18n.localize("DEVASTRA.TotalDamageArmorIn");
  // sentence2 = game.i18n.localize("DEVASTRA.ArmorOff");


  // Ici on calcul le total des dommages (hors résistance armure du défenseur) de l'attaquant    
  var item;
  var myItem;

  var myWeaponDamageBase = 0;
  var myWeaponDamage = "";

  var myDevastraDamageBase = 0;
  var myDevastraDamage = "";

  var myPowerDamageBase = 0;
  var myPowerDamage = "";

  var myMagicDamageBase = 0;
  var myMagicDamage = "";

  // console.log("isinventory = ", isinventory);
  if (isinventory === "true") {

    if (devastra === "false") {
      myItem = undefined;

      let myWeaponDamageTab;

      if (selectedinventory == "0" || selectedinventory == "-1") {
        myWeaponDamageBase = 0;
        myWeaponDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'item')) {
          if (item._id == selectedinventory) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myWeaponDamageBase = parseInt(myItem.system.damage_base);
          myWeaponDamage = myItem.system.damage;

          let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

          // console.log("myNewWeaponDamage = ", myNewWeaponDamage);
  
          myWeaponDamageTab = myNewWeaponDamage.split("+");
          // console.log("myWeaponDamageTab = ", myWeaponDamageTab);

          for (let theWeaponDamage in myWeaponDamageTab) {
            // console.log("theWeaponDamage = ", theWeaponDamage);
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myWeaponDamageTab[theWeaponDamage]));
            // console.log("myWeaponDamageTab[theWeaponDamage] = ", myWeaponDamageTab[theWeaponDamage]);
          }
  
        }
      }
      pdc += parseInt(myWeaponDamageBase);
      // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
      // console.log("myWeaponDamage = ", myWeaponDamage);
      sentence2 = game.i18n.localize("DEVASTRA.SentenceIsInventory").replace("^0", myWeaponDamageBase).replace("^1", myWeaponDamage);
    } else {
      myItem = undefined;

      let myDevastraDamageTab;

      if (selectedinventorydevastra == "0") {
        myDevastraDamageBase = 0;
        myDevastraDamage = optNone;
      } else {
        for (item of theAttackantActor.items.filter(item => item.type === 'devastra')) {
          if (item._id == selectedinventorydevastra) {
            myItem = item;
          }
        }
        if (myItem != undefined) {
          myDevastraDamageBase = parseInt(myItem.system.damage_base);
          myDevastraDamage = myItem.system.damage;

          let myNewDevastraDamage = myDevastraDamage.replaceAll(" ", "");
  
          myDevastraDamageTab = myNewDevastraDamage.split("+");

          for (let theDevastraDamage in myDevastraDamageTab) {
            pdc += parseInt(await _computeDomain2Val(theAttackantActor, myDevastraDamageTab[theDevastraDamage]));
          }

        }
      }
      pdc += parseInt(myDevastraDamageBase);
      // console.log("myDevastraDamageBase = ", myDevastraDamageBase);
      // console.log("myDevastraDamage = ", myDevastraDamage);
      sentence2 = game.i18n.localize("DEVASTRA.SentenceIsDevastra").replace("^0", myDevastraDamageBase).replace("^1", myDevastraDamage);

    }

  }

  if (isinventory === "true" && power === "true") {
    myItem = undefined;

    let myPowerDamageTab;

    if (selectedinventorypower == "0") {
      myPowerDamageBase = 0;
      myPowerDamage = optNone;
    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'pouvoir')) {
        if (item._id == selectedinventorypower) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myPowerDamageBase = parseInt(myItem.system.damage_base);
        myPowerDamage = myItem.system.damage;

        let myNewPowerDamage = myPowerDamage.replaceAll(" ", "");

        myPowerDamageTab = myNewPowerDamage.split("+");

        for (let thePowerDamage in myPowerDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myPowerDamageTab[thePowerDamage]));
        }

      }
    }
    pdc += parseInt(myPowerDamageBase);


    // console.log("myPowerDamageBase = ", myPowerDamageBase);
    // console.log("myPowerDamage = ", myPowerDamage);
    sentence3 = game.i18n.localize("DEVASTRA.SentenceIsPower").replace("^0", myPowerDamageBase).replace("^1", myPowerDamage);
  }

  // console.log("magic = ", magic);
  if (isinventory === "true" && magic === "true") {
    myItem = undefined;

    let myMagicDamageTab;

    if (selectedinventorymagic == "0") {
      myMagicDamageBase = 0;
      myMagicDamage = optNone;

    } else {
      for (item of theAttackantActor.items.filter(item => item.type === 'magie')) {
        if (item._id == selectedinventorymagic) {
          myItem = item;
        }
      }
      if (myItem != undefined) {
        myMagicDamageBase = parseInt(myItem.system.damage_base);
        myMagicDamage = myItem.system.damage;
        
        let myNewMagicDamage = myMagicDamage.replaceAll(" ", "");

        myMagicDamageTab = myNewMagicDamage.split("+");

        for (let theMagicDamage in myMagicDamageTab) {
          pdc += parseInt(await _computeDomain2Val(theAttackantActor, myMagicDamageTab[theMagicDamage]));
        }

      }
    }
    pdc += parseInt(myMagicDamageBase);


    // console.log("myMagicDamageBase = ", myMagicDamageBase);
    // console.log("myMagicDamage = ", myMagicDamage);
    sentence4 = game.i18n.localize("DEVASTRA.SentenceIsMagic").replace("^0", myMagicDamageBase).replace("^1", myMagicDamage);

  }


  if (isinventory === "false") {
    myWeaponDamageBase = myDamage;
    myWeaponDamage = myDamageType;

    let myWeaponDamageTab;
        
    let myNewWeaponDamage = myWeaponDamage.replaceAll(" ", "");

    myWeaponDamageTab = myNewWeaponDamage.split("+");

    pdc += parseInt(myWeaponDamageBase);

    for (let theWeaponDamage in myWeaponDamageTab) {
      pdc += parseInt(await _computeDomain2Val(theOpponentActor, myWeaponDamageTab[theWeaponDamage]));
    }

    // console.log("myWeaponDamageBase = ", myWeaponDamageBase);
    // console.log("myWeaponDamage = ", myWeaponDamage);
    sentence2 = game.i18n.localize("DEVASTRA.SentenceIsNoInventory").replace("^0", myWeaponDamageBase).replace("^1", myWeaponDamage);

  }

  async function _computeDomain2Val (theActor, myDamage) {
    let domainValue = 0;
    const theDamage = myDamage;
    switch (theDamage) {
      case "@domains.dph":
        domainValue = parseInt(theActor.system.domains.dph.value);
      break;
      case "@domains.dma":
        domainValue = parseInt(theActor.system.domains.dma.value);
      break;
      case "@domains.din":
        domainValue = parseInt(theActor.system.domains.din.value);
      break;
      case "@domains.dso":
        domainValue = parseInt(theActor.system.domains.dso.value);
      break;
      case "@domains.dmy":
        domainValue = parseInt(theActor.system.domains.dmy.value);
      break;
      default: domainValue = 0;
    }
    return domainValue;
  };

  // Ici on calcul le total d'armure du défenseur
  let totalArmor = 0;


  // console.log("consideropponentprotection = ", consideropponentprotection);
  // console.log("opposantficheId = ", opposantficheId);
  if (consideropponentprotection = "true") {
    totalArmor = theOpponentActor.system.armure_total;
    // console.log("totalArmor = ", totalArmor);
  };
  // console.log("totalArmor = ", totalArmor);
  if ((pdc - totalArmor) > 0) {
    pdcMinusArmor = pdc - totalArmor;
  } else {
    pdcMinusArmor = 0;
  }

  // console.log("pdc = ", pdc);
  // console.log("pdcMinusArmor = ", pdcMinusArmor);

  let totalresist = myDefence + myShakti;

  const smartTemplate = 'systems/devastra/templates/form/result-damage-applied.html';

  const smartData = {
    nd: nd,

    total: myTotal,

    attaquantficheId: attaquantficheId,
    opposantficheId: opposantficheId,
    opposanttokenId: opposanttokenId,

    consideropponentprotection: consideropponentprotection,

    pdc: pdc,
    pdcminusarmor: pdcMinusArmor,

    sentence1: sentence1,
    sentence2: sentence2,
    sentence3: sentence3,
    sentence4: sentence4,

  };
  // console.log("smartData avant retour func = ", smartData);
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  const myTypeOfThrow = game.settings.get("core", "rollMode"); // Type de Lancer


  ChatMessage.create({
    user: game.user.id,
    // speaker: ChatMessage.getSpeaker({ token: this.actor }),
    speaker: ChatMessage.getSpeaker({ actor: myActor }),
    content: smartHtml,
    rollMode: myTypeOfThrow
  });


  if (game.settings.get("devastra", "sonorizedMandalaInterface") && (pdcMinusArmor > 0)) {
    var audio;
    audio = new Audio("systems/devastra/sounds/sword.wav");
    audio.play();
  }

  let newPrana = theOpponentActor.system.prana.value;
  newPrana -= pdcMinusArmor;
  if(newPrana < 0) {
    newPrana = 0;
  }

  await theOpponentActor.update({ "system.prana.value": newPrana });
    
} 
