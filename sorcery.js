$(document).ready(function () {
    // VARIABLES
    let buttons = $(".section button");
    let status = $("#status");
    let inventoryList = $("#inventory");
    let life = status.find(".life .value");
    let inventory = [];
    let log = true; // Utilisé pour le debug

    /**
     * Fonction pour gérer l'inventaire.
     * @param name : string
     *  Nom de l'item
     * @param count : int
     *  Nombre d'item présent à ajouter/supprimer. Si le total est <=0, l'item sera mis à 0.
     */
    function updateItem(name, count) {
        let exist = getInventory(name);

        if (exist == undefined)
            inventory.push({name, count});
        else
            exist["count"] = getInventory(name)["count"] + count;

        if (getInventory(name)["count"] <= 0) {
            // On set l'item à 0 - pour le moment, pas de suppression prévue.
            getInventory(name)["count"] = 0;
        }

        if (log)
            console.log("Object " + getInventory(name)["name"] + ":" + getInventory(name)["count"]);
    }

    /**
     * Permet de mettre à jour la liste de l'inventaire visuellement.
     */
    function updateInventory() {
        inventoryList.empty(); // remise à zéro de la liste
        $(inventory).each(function (index, element) {
            inventoryList.append('<li>' + element["name"] + ": " + element["count"] + '</li>');
        });
    }

    /**
     * Retourne un item si existant
     * @param name string
     *  Le nom de l'item recherché
     * @returns Object{name, count} || undefined
     */
    function getInventory(name) {
        return inventory.find(function (element) {
            return element.name == name;
        });
    }

    function showSection(name, withLife) {
        if (withLife === undefined)
            withLife = true;
        $(".section").hide();
        if (!withLife)
            $("#status").hide();
        else
            $("#status").show();
        $("#" + name).show();
    }

    function init() {
        setLife(3);
        inventory = [];
    }

    function handleSingleAction(key, action) {
        let actionName = action.attr("name");

        if (log)
            console.log("J'effectue l'action : " + actionName);

        switch (actionName) {
            case "start":
                init();
                break;
            case "reset":
                init();
                break;
            case "hit":
                loseOneLife();
                break;
            case "itemUpdate":
                let item = action.attr("item");
                let count = parseInt(action.attr("count"));
                updateItem(item, count);
                break;
            default:
                alert("Error, define a new action for " + actionName + "!");
        }
    }

    /**
     * Permet de gérer l'action d'une card.
     * @param key string
     *  Nom de l'action.
     */
    function handleAction(key) {
        let actions = $("#" + key).find("action");

        if (actions.size() == 0)
            return;

        actions.each(function (index, action) {
            handleSingleAction(key, $(action));
        });
    }

    /**
     * Permet de changer de section, afin de progresser dans l'histoire.
     * @param key string
     *  Nom de la carte sur laquelle on souhaite se rendre.
     * @param withLife bool
     *  Permet de savoir si l'on doit afficher ou non le panel de vie / inventaire.
     */
    function gotoSection(key, withLife) {

        if (withLife === undefined)
            withLife = true;

        handleAction(key);
        setLife(getLife());
        updateInventory();

        if (log)
            console.log("Je montre la section : " + key);

        showSection(key, withLife);

        if (getLife() <= 0 && key != "death")
            endGame();
    }

    /**
     * Retourne la vie du joueur.
     * @returns int
     */
    function getLife() {
        return parseInt(life.text());
    }

    /**
     * Permet de définir la vie du joueur.
     * @param v
     */
    function setLife(v) {
        life.html(v);
    }

    /**
     * Permet de faire perdre une vie au joueur.
     */
    function loseOneLife() {
        setLife(getLife() - 1);
    }

    /**
     * Démarre le jeu
     */
    function startGame() {
        gotoSection("intro", false);
    }

    /**
     * Termine le jeu.
     */
    function endGame() {
        gotoSection("death", false);
    }

    buttons.click(function () {
        gotoSection($(this).attr("go"));
    });

    // MAIN
    startGame();

});
