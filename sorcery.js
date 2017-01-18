$(document).ready(function () {

    const MAX_LIFE = 30;
    const MAX_RESONATORS = 8;

    let buttons = $(".section button");
    let status = $("#status");
    let inventoryList = $("#inventory");
    let life = status.find(".life .value");
    let iAmResistant = $("#i_am_resistant");
    let iAmENL = $("#i_am_enl");

    // Utilisé pour le jeu
    let inventory = [];
    let agentName;
    let isResistant = true;

    let imagesName;
    let colorArray;
    let randomName;

    // Utilisé pour le développement
    let log = true;

    iAmENL.click(function () {
        isResistant = false;
    });

    iAmResistant.click(function () {
        isResistant = true;
    });

    function loadJSONValue(filename) {
        let settings = {
            method: "GET",
            url: "resources/" + filename + ".json",
            dataType: "json"
        };
        let request = $.ajax(settings);
        request.done(function (json) {
            let array = $.map(json, function (el) {
                return el;
            });
            console.log(array);
            switch (filename) {
                case "imagesName":
                    imagesName = array;
                    break;
                case "colorArray":
                    colorArray = array;
                    break;
                case "randomName":
                    randomName = array;
                    break;
                default:
                    alert("Error");
            }
        });
    }

    /**
     * Initialise le jeu avec un nombre de vie par défaut, et un inventaire vide par défaut.
     */
    function init() {
        setLife(MAX_LIFE);
        inventory = [];
        updateItem("resonateur", 3);
    }

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
            exist["count"] = parseInt(getInventory(name)["count"]) + parseInt(count);

        if (getInventory(name)["count"] <= 0) {
            // On set l'item à 0 - pour le moment, pas de suppression prévue.
            getInventory(name)["count"] = 0;
        }

        if (log)
            console.log("Object " + getInventory(name)["name"] + ":" + getInventory(name)["count"]);

        updateInventory();
    }

    /**
     * Permet de mettre à jour visuellement la liste de l'inventaire.
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

    /**
     * Permet d'afficher une section selon son nom.
     * @param name string
     *  Le nom de la section à afficher
     * @param withStatusBar bool
     *  Si l'on doit afficher la section statut ou non.
     */
    function showSection(name, withStatusBar) {
        if (withStatusBar === undefined)
            withStatusBar = true;
        $(".section").hide();
        if (!withStatusBar)
            $("#status").hide();
        else
            $("#status").show();

        let sectionToShow = $("#" + name);

        if (sectionToShow.size() <= 0) {
            if (log)
                console.log("ERROR : " + name + " section is not defined !");
            alert("An error occured, please try again later.");
        } else
            sectionToShow.show();
    }

    /**
     * Permet de mettre à jour une image, ou d'en ajouter une nouvelle dans la div ImageManager.
     *
     * @param rule au choix : add/update/remove
     * @param selector
     *  Pour l'ajout, le selecteur ou ajouter l'image.
     * @param value
     *  La valeur du src de l'image.
     * @param imageDataName
     *  Le dataname de l'image
     * @param newName
     *  Dans le cas de l'update, le nouveau dataname de l'image.
     */
    function updateImage(rule, selector, value, imageDataName, newName) {
        let img;

        if (rule == "add") {
            img = $("<img>");
            img.attr("src", "img/" + value);
            let str = "100px";
            img.css("width", str).css("height", str); // TODO Make a better CSS
            img.data("name", imageDataName);
            $(selector).append(img);
        } else if (rule == "update" || rule == "remove") {
            img = $("img").filter(function () {
                return $(this).data("name") == imageDataName;
            });
            if (img.size() == 0) {
                if (log)
                    console.log("Image not found for " + rule + " rule in image action !");
                return;
            }

            if (rule == "update") {
                // Only for update
                img.attr("src", "img/" + value);
                img.data("name", newName);
            } else {
                img.remove();
            }
        }
    }

    /**
     * Permet de gérer une action.
     * @param action
     *  Le nom de l'action
     *  @see actions.md pour des détails sur les différentes actions disponibles.
     */
    function handleSingleAction(action) {
        let actionName = action.attr("name");
        let showInto;
        let item;

        if (log)
            console.log("J'effectue l'action : " + actionName);

        switch (actionName) {
            case "start":
            case "reset":
                init();
                break;
            case "hit":
                loseOneLife();
                break;
            case "itemUpdate":
                item = action.attr("item");
                let count = parseInt(action.attr("count"));
                updateItem(item, count);
                break;
            case "glyph":
                let glyphLevel = parseInt(action.attr("level"));
                let itemWon = action.attr("itemWon");
                let itemCount = action.attr("itemCount");
                let time = action.attr("time");
                launchGlyphGame(glyphLevel, $(action), itemCount, itemWon, time);
                break;
            case "cssUpdate":
                $(action.attr("element")).css(action.attr("rule"), action.attr("value"));
                break;
            case "setAgentName":
                let message = action.attr("message");
                agentName = prompt(message);
                if (agentName == undefined || agentName.length <= 0)
                    agentName = randomName[getRandom(0, randomName.length - 1)];
                showInto = action.attr("showInto");
                $(showInto).text(agentName);
                break;
            case "image":
                updateImage(action.attr("rule"), action.attr("selector"), action.attr("value"), action.attr("dataName"), action.attr("newName"));
                break;
            case "setFaction":
                showInto = action.attr("showInto");
                isResistant == true ? $(showInto).html("résistance") : $(showInto).html("illuminés");
                break;
            case "deploy":
                item = getInventory(action.attr("item"));

                let divImage = action.siblings("div.image");
                let buttonsAction = action.siblings("button");
                let messageSuccess = action.siblings(".success");
                let messageNoMoreStuff = action.siblings(".warningStuff");

                // On masque le bouton de sortie et le message de succès
                messageSuccess.hide();
                buttonsAction.show();
                buttonsAction.last().hide();
                messageNoMoreStuff.hide();

                if (divImage.children().size() == 0) {
                    // Le déploiement commence juste.
                    updateImage("add", divImage, "resonators/0.jpg", "reso_0", undefined);
                } else if (item["count"] <= 0) {
                    messageNoMoreStuff.find(".item").html(item["name"]);
                    messageNoMoreStuff.show();
                    buttonsAction.first().hide();
                } else {
                    let name = divImage.find("img").first().data("name");
                    let result = name.split("_");
                    let numberOfResoDeployed = parseInt(result[1]);

                    // On déploie un résonateur
                    numberOfResoDeployed++;
                    item["count"]--;
                    updateImage("update", divImage, "resonators/" + numberOfResoDeployed + ".jpg", "reso_" + (numberOfResoDeployed - 1), "reso_" + numberOfResoDeployed);

                    if (numberOfResoDeployed >= MAX_RESONATORS) {
                        // Fin du jeu, on peut afficher le bouton pour partir.
                        buttonsAction.hide();
                        buttonsAction.last().show();
                        messageSuccess.show();
                    }
                }
                break;
            default:
                if (log)
                    console.log("Action has not been defined !");
                alert("Error, define a new action for " + actionName + "!");
        }
    }

    /**
     * Retourne un nombre aléatoire compris
     * @param min {number} le minimum
     * @param max {number} le maximum
     * @returns {number} compris entre min & max
     */
    let getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

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
     @noinspection
     */
    function _arrayRandom(len, min, max, unique) {
        var len = (len) ? len : 10;
        var min = (min !== undefined) ? min : 1;
        var max = (max !== undefined) ? max : 100;
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

    /**
     * Permet d'afficher les images dans un element particulier
     * @param level Le nombre d'image à charger.
     * @param loadInto L'object Jquery dans lequel on ajoute les images.
     */
    function createPictures(level, loadInto) {

        console.log(imagesName);

        for (let i = 1; i <= level; i++) {
            let img = $("<img>");
            img.attr("src", "img/" + imagesName[getRandom(0, imagesName.length - 1)]);
            let str = "100px"; // TODO Better CSS
            img.css("width", str).css("height", str);
            img.addClass("glyphPictures");
            img.attr("id", i);
            loadInto.append(img);
            loadInto.append("<br/>");
        }
    }

    /**
     * A partir des valeurs aléatoires pour l'ordre, permet d'afficher la solution pour une durée donnée.
     * @param time int
     *  Le temps durant lequel la solution sera affichée
     * @param glyphPictures Collection Jquery
     *  Les images
     * @param randomOrder Array
     *  L'ordre de la solution.
     * @param level
     */
    function showSolution(time, glyphPictures, randomOrder, level) {

        let ol = $("<ol>");
        let li;
        let value;

        for (let i = 0; i < level; i++) {
            li = $("<li>");
            li.html(colorArray[i]);
            li.css("background-color", colorArray[i]);
            ol.append(li);
        }
        glyphPictures.first().before(ol);

        glyphPictures.each(function (index, element) {
            value = $(element).data("order");
            $(element).css("border", "5px solid " + colorArray[randomOrder.indexOf(value)]);
        });

        setTimeout(function () {
            glyphPictures.css("border", "none");
            ol.remove();
        }, time);
    }

    /**
     * Fonction qui lance le jeu de glyph.
     * @param level int
     *   Permet d'indiquer le nombre d'image à afficher.
     * @param action JqueryElement
     *   Element Jquery de l'action.
     * @param itemCount int
     *  Le nomber de @param itemGain que l'on gagne
     * @param itemWon
     *  L'item que l'on gagne
     *  @param time
     *   Le temps ou la solution est affichée, en ms.
     */
    function launchGlyphGame(level, action, itemCount, itemWon, time) {
        let section = action.parent(".section");
        section.append("<div id='glyphGame'></div>");
        action.hide();

        // Create pictures
        createPictures(level, $("#glyphGame"));

        let glyphPictures = $("img.glyphPictures");

        // Set random order to solve game
        let randomOrder = _arrayRandom(level, 1, level, true);
        for (let i = 0; i < level; i++) {
            $(glyphPictures[randomOrder[i]]).data("order", randomOrder[i]);
        }

        showSolution(time, $(glyphPictures), randomOrder, level);

        let order = 0;

        /**
         * Lors d'un clic sur une images, on vérifie qu'elle est bien cliquée
         * dans l'ordre. Si oui, on affiche un cadre vert, sinon, un cadre rouge.
         * Si jamais le jeu est terminé, on enlève les images et on affiche le bouton de sortie.
         */
        glyphPictures.click(function () {
            let data = parseInt($(this).data("order"));
            if (randomOrder.indexOf(data) == order) {
                order++;
                $(this).css("border", "solid 5px green");
            } else {
                itemCount > 0 ? itemCount-- : true;
                loseOneLife();
                if (getLife() <= 0)
                    endGame();
                glyphPictures.css("border", "none");
                setTimeout(function () {
                    glyphPictures.css("border", "none");
                }, 300);
                $(this).css("border", "solid 5px red");
                order = 0;
            }

            if (order == level) {
                if (log)
                    console.log("You won " + itemCount + " " + itemWon);
                glyphPictures.remove();
                setLife(MAX_LIFE);
                updateItem(itemWon, itemCount);
                section.find("ol").remove();
                action.show();
            }
        });
    }

    /**
     * Permet de gérer les actions d'une section.
     * @param key string
     *  Le nom de la section
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

    /**
     * Permet de se déplacer dans les différentes section au clic sur un bouton
     */
    buttons.click(function () {
        gotoSection($(this).attr("go"));
    });

    startGame();
    loadJSONValue("imagesName");
    loadJSONValue("colorArray");
    loadJSONValue("randomName");
});
