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
        inventoryList.empty();
        let li;
        $(inventory).each(function (index, element) {
            li = $("<li>");
            li.data("name", element["name"]);
            li.html(element["name"] + ": " + element["count"]);
            inventoryList.append(li);
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

    function handleSingleAction(action) {
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
            case "glyph":
                // Mini jeu
                let glyphLevel = parseInt(action.attr("level"));
                launchGlyphGame(glyphLevel, $(action));
                break;
            case "cssUpdate":
                $(action.attr("element")).css(action.attr("rule"), action.attr("value"));
                break;
            case "image":
                let imageManager = $("#img-manager");
                let img;
                let rule = action.attr("rule");
                if (rule == "add") {
                    img = $("<img>");
                    img.attr("src", "img/" + action.attr("value"));
                    let str = "100px";
                    img.css("width", str).css("height", str);
                    imageManager.append(img);
                } else if (rule == "update" || rule == "remove") {
                    img = $("img").filter("[src='img/" + action.attr("value") + "']");
                    if (img.size() == 0) {
                        console.log("Image not found for " + rule + " rule in image action !");
                        return;
                    }

                    // Update or remove ?
                    (rule == "update") ? img.attr("src", "img/" + action.attr("new")) : img.remove();
                }

                break;
            default:
                console.log("Action has not been defined !");
                alert("Error, define a new action for " + actionName + "!");
        }
    }

    /* Creates an array of random integers between the range specified
     @param len int
     length of the array you want to generate
     @param min int
     min value you require
     @param max int
     max value you require
     @param unique boolean
     whether you want unique or not (assume 'true' for this answer)
     @source http://stackoverflow.com/a/29613213
     */
    function _arrayRandom(len, min, max, unique) {
        //noinspection JSDuplicatedDeclaration
        var len = (len) ? len : 10;
        //noinspection JSDuplicatedDeclaration
        var min = (min !== undefined) ? min : 1;
        //noinspection JSDuplicatedDeclaration
        var max = (max !== undefined) ? max : 100;
        //noinspection JSDuplicatedDeclaration
        var unique = (unique) ? unique : false;
        var toReturn = [];
        var tempObj = {};
        var i = 0;

        if (unique === true) {
            var randomInt;
            for (; i < len; i++) {
                randomInt = Math.floor(Math.random() * ((max - min) + min));
                if (tempObj['key_' + randomInt] === undefined) {
                    tempObj['key_' + randomInt] = randomInt;
                    toReturn.push(randomInt);
                } else {
                    i--;
                }
            }
        } else {
            for (; i < len; i++) {
                toReturn.push(Math.floor(Math.random() * ((max - min) + min)));
            }
        }

        return toReturn;
    }

    function createHelpNode(glyphPictures, colorArray, level) {
        let ol = $("<ol>");
        let li;

        for (let i = 0; i < level; i++) {
            li = $("<li>");
            li.html(colorArray[i]);
            li.css("background-color", colorArray[i]);
            ol.append(li);
        }
        glyphPictures.first().before(ol);
    }

    function createPictures(level) {
        let loadInto = $("#glyphGame");
        for (let i = 1; i <= level; i++) {
            let img = $("<img>");
            img.attr("src", "img/" + i + ".jpg");
            let str = "100px";
            img.css("width", str).css("height", str);
            img.addClass("glyphPictures");
            img.attr("id", i);
            loadInto.append(img);
            loadInto.append("<br/>");
        }
    }

    /**
     * A partir des valeurs aléatoires pour l'ordre, permet d'afficher la solutio pour une durée donnée.
     * @param time int
     * @param glyphPictures Collection Jquery
     * @param randomOrder Array
     */
    function showSolution(time, glyphPictures, randomOrder, colorArray, section) {

        let value;
        glyphPictures.each(function (index, element) {
            value = $(element).data("order");
            $(element).css("border", "5px solid " + colorArray[randomOrder.indexOf(value)]);
        });

        setTimeout(function () {
            glyphPictures.css("border", "none");
            section.find("ol").remove();
        }, time);
    }

    /**
     * Fonction qui lance le jeu de glyph.
     * @param level int
     *   Permet d'indiquer le nombre d'image à afficher.
     * @param action JqueryElement
     *   Element Jquery de l'action.
     */
    function launchGlyphGame(level, action) {
        let section = action.parent(".section");
        section.append("<div id='glyphGame'></div>");
        action.hide();

        // Create pictures
        createPictures(level);

        let glyphPictures = $("img.glyphPictures");
        let colorArray = ["green", "blue", "red", "pink", "yellow"];

        // Set random order to solve game
        let randomOrder = _arrayRandom(level, 1, level, true);
        for (let i = 0; i < level; i++) {
            $(glyphPictures[randomOrder[i]]).data("order", randomOrder[i]);

        }

        // Set help node
        createHelpNode($(glyphPictures), colorArray, level);
        showSolution(10000, $(glyphPictures), randomOrder, colorArray, $(section));

        let order = 0;
        glyphPictures.click(function () {

            let data = parseInt($(this).data("order"));
            if (randomOrder.indexOf(data) == order) {
                order++;
                $(this).css("border", "solid 5px green");
            } else {
                console.log("Bad combinaison !");
                glyphPictures.css("border", "none");
                setTimeout(function () {
                    glyphPictures.css("border", "none");
                }, 300);
                $(this).css("border", "solid 5px red");
                order = 0;
            }

            if (order == level) {
                glyphPictures.remove();
                section.find("ol").remove();
                action.show();
            }
        });
    }

    /**
     * Permet de gérer l'action d'une section.
     * @param key string
     *  Nom de l'action.
     */
    function handleAction(key) {
        let actions = $("#" + key).find("action");

        if (actions.size() == 0)
            return;

        actions.each(function (index, action) {
            handleSingleAction($(action));
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
