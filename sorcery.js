/**
 * Agent Ready, an Ingress Story
 * @author Tiphaine GIRARDOT - Sylvain METAYER
 * @version 1.0
 * @see https://github.com/sylvainmetayer/agent-ready
 */
$(document).ready(function () {

    const XM_INITIAL_VALUE = 30;
    const MAX_RESONATORS = 8;
    const BAN_TIME = 1000;
    const KEYBOARD_NAVIGATION = "ABCDEF";
    const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$€?!()/*-+";
    const MAX_CHEAT = 3;

    let buttons = $(".section button");
    let div_status = $("#status");
    let ul_inventoryList = $("#inventory");
    let span_xm = div_status.find(".xm .value");
    let span_xm_max = div_status.find(".xm .max");

    let inventory = [];
    let agentName;

    let imagesName;
    let colorArray;
    let randomName;
    let cheatImage;
    let glyph;

    let cheatAttemptCounter = 0;
    let numberOfCheatAttempFailed = 0;
    let log = true;

    /**
     * This function load a JSON file stored in the /resources folder of the server
     * into an array.
     * @param filename name of the JSON file
     */
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

            // TODO Refactor this ?
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
                case "cheatImage":
                    cheatImage = array;
                    break;
                case "glyph":
                    glyph = array;
                    break;
                default:
                    alert("Error, no array found in loadJSONValue function");
            }
        });
    }

    /**
     * This function initialize the game.
     * - set default XM
     * - set empty inventory
     */
    function init() {
        setXM(XM_INITIAL_VALUE);
        span_xm_max.html(XM_INITIAL_VALUE);
        inventory = [];
        updateItem("resonateur", 6); // TODO Remove me, test only.
    }

    /**
     * This function is used to handle the inventory stock.
     * @param name string
     *  Name of the item to add
     * @param count int
     *  Number of item to add / remove. If the total number of the item is <0, it will be set to 0.
     *  You can specify positive integer to add, and negative to remove.
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

        log == true && console.log("Object " + getInventory(name)["name"] + ":" + getInventory(name)["count"]);

        updateInventory();
    }

    /**
     * This function is used to graphically update the inventory.
     */
    function updateInventory() {
        ul_inventoryList.empty();
        let li;
        $(inventory).each(function (index, element) {
            li = $("<li>");
            li.data("name", element["name"]);
            li.html(element["name"] + ": " + element["count"]);
            ul_inventoryList.append(li);
        });
    }

    /**
     * This function return an item, if existing.
     * @param name string
     *  Name of the seeked item
     * @returns Object{name, count} || undefined
     */
    function getInventory(name) {
        return inventory.find(function (element) {
            return element.name == name;
        });
    }

    /**
     * This function display a section.
     * @param name string
     *  Name of the section to display
     * @param withStatusBar bool
     *  Should we show the status section or not ? Default true.
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
            log && console.log("[FATAL ERROR] " + name + " section is not defined !");
            alert("An error occured, please try again later.");
        } else {
            sectionToShow.show();
            bindKeyEvent($(sectionToShow));
        }
    }

    /**
     * Bind keys to section button.
     * @param section
     *  Section, to find button to bind keys to.
     */
    function bindKeyEvent(section) {
        section.find("button").each(function (index) {
            let char = KEYBOARD_NAVIGATION.charAt(index);
            $(this).data("char", char);

            // Does HTML has been already set ?
            if ($(this).html().indexOf(char + "-") == -1) {
                let oldHTML = $(this).html();
                $(this).html(char + "-" + oldHTML);
            }
        });
    }

    /**
     * This function update, add, or remove an image.
     * @param rule choice : add, remove, update
     * @param selector
     *  CSS Selector where to add the image.
     * @param value string
     *  src attribute of the image.
     * @param imageDataName string
     *  Name to identify the image among the others.
     * @param newName string
     *  In update case, specify the new name of the new image.
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
                log && console.log("Image not found for " + rule + " rule in image action !");
                alert("Oups. An image is missing. Sorry about that.");
                return;
            }

            if (rule == "update") {
                img.attr("src", "img/" + value);
                img.data("name", newName);
            } else {
                img.remove();
            }
        }
    }

    /**
     * Handle a single action
     * @param action
     *  Action element.
     * @see actions.md for details about availables actions.
     */
    function handleSingleAction(action) {
        let actionName = action.attr("name");
        let showInto;
        let item;

        log && console.log("Action received : " + actionName);

        switch (actionName) {
            case "start":
            case "reset":

                init();
                break;
            case "hit":

                looseXM();
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
                let isResistant = action.attr("resistant");
                isResistant == "true" && $(showInto).html("résistance");
                isResistant == "false" && $(showInto).html("illuminés");
                break;
            case "deploy":

                item = getInventory(action.attr("item"));
                let looseXMPerDeploy = parseInt(action.attr("looseXMPerDeploy"));

                let divImage = action.siblings("div.image");
                let buttonsAction = action.siblings("button");
                let messageSuccess = action.siblings(".success");
                let messageNoMoreStuff = action.siblings(".warningStuff");

                // Hide exit and success button
                messageSuccess.hide();
                buttonsAction.show();
                buttonsAction.last().hide();
                messageNoMoreStuff.hide();

                if (divImage.children().size() == 0) {
                    // Starting deploy
                    updateImage("add", divImage, item["name"] + "/0.png", item["name"] + "_0", undefined);
                } else if (item["count"] <= 0) {
                    messageNoMoreStuff.find(".item").html(item["name"]);
                    messageNoMoreStuff.show();
                    buttonsAction.first().hide();
                } else {
                    let name = divImage.find("img").first().data("name");
                    let result = name.split("_");
                    let numberOfResoDeployed = parseInt(result[1]);

                    // Deploy one item
                    numberOfResoDeployed++;
                    item["count"]--;
                    looseXM(looseXMPerDeploy);
                    updateImage("update", divImage, item["name"] + "/" + numberOfResoDeployed + ".png", item["name"] + "_" + (numberOfResoDeployed - 1), item["name"] + "_" + numberOfResoDeployed);

                    if (numberOfResoDeployed >= MAX_RESONATORS) {
                        // End, show exit button and success message
                        buttonsAction.hide();
                        buttonsAction.last().show();
                        messageSuccess.show();
                    }

                    if (getXM() <= 0) {
                        endGame();
                    }
                }
                break;
            default:

                log && console.log("[FATAL ERROR] " + actionName + " has not been defined in handleSingleAction !");
                alert("Oups. Something went wrong. Sorry about that.");
        }
    }

    /**
     * Return a random number between min & max.
     * @param min
     * @param max
     * @returns int
     * @author http://stackoverflow.com/a/7228322
     */
    let getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     * @author http://stackoverflow.com/a/12646864
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Display images in a element.
     * @param glyphSequence
     *  Object that contain images src, name and order
     * @param loadInto
     *  Element where images will be added
     */
    function createPictures(glyphSequence, loadInto) {

        let array = $.map(glyphSequence, function (el) {
            return el;
        });

        array = shuffleArray(array);

        $.each(array, function () {
            let p = $("<p>");
            p.html(this.name + "<br/>");
            let img = $("<img>");
            img.attr("src", "img/glyph/" + this.src);
            let str = "100px"; // TODO Better CSS
            img.css("width", str).css("height", str);
            img.addClass("glyphPictures");
            img.data("order", this.order);
            img.data("name", this.name);
            img.after();
            p.append(img);
            loadInto.prepend(p);
        });
    }

    /**
     * Display solution of a glyph, for a given time.
     * @param time
     * @param glyphPictures
     *  Jquery Collection, containing images.
     * @param level
     *  Complexity of the glyph
     */
    function showSolution(time, glyphPictures, level) {

        let ol = $("<ol>");
        let li;

        for (let i = 0; i < level; i++) {
            li = $("<li>");
            ol.append(li);
        }

        $("#glyphGame").prepend(ol);

        for (let i = 1; i <= level; i++) {
            let item = glyphPictures.filter(function () {
                return $(this).data("order") == i;
            });

            ol.children().eq(i - 1).html(item.data("name"));
        }

        setTimeout(function () {
            ol.remove();
        }, time);
    }

    /**
     * Launch glyph game.
     * @param level
     *  Complexity of the glyph
     * @param action
     *  Action element, containing button
     * @param itemCount
     *  number of item that will be won.
     * @param itemWon
     *  Item that will be won
     * @param time
     * How long the solution will be shown ?
     */
    function launchGlyphGame(level, action, itemCount, itemWon, time) {
        let section = action.parent(".section");
        let buttons = action.siblings("button");
        section.append("<div id='glyphGame'></div>");
        buttons.hide();

        // Get glyph of level x
        let glyphsFilterLevel = $(glyph).filter(function () {
            return this.level = level;
        });

        // Select one random glyph from those available.
        let randomNumber = getRandom(0, glyphsFilterLevel.size() - 1);
        let glyphSelected = glyphsFilterLevel.get(randomNumber).order;

        // Create pictures and affect order
        createPictures(glyphSelected, $("#glyphGame"));
        let glyphPictures = $("img.glyphPictures");
        showSolution(time, $(glyphPictures), level);

        let order = 1;

        glyphPictures.click(function () {
            let data = parseInt($(this).data("order"));

            if (data == order) {
                order++;
                $(this).css("border", "solid 5px green");
            } else {
                itemCount > 0 ? itemCount-- : false;
                looseXM();
                if (getXM() <= 0)
                    endGame();
                glyphPictures.css("border", "none");
                setTimeout(function () {
                    glyphPictures.css("border", "none");
                }, 300);
                $(this).css("border", "solid 5px red");
                order = 1;
            }

            if (order == level + 1) {
                if (log)
                    console.log("You won " + itemCount + " " + itemWon);
                glyphPictures.parents("p").remove();
                setXM(XM_INITIAL_VALUE);
                updateItem(itemWon, itemCount);
                section.find("ol").remove();
                buttons.show();
            }
        });
    }

    /**
     * Handle multiple actions, one after the others.
     * @param key
     *  Section id
     */
    function handleActions(key) {
        let actions = $("#" + key).find("action");
        if (actions.size() == 0)
            return;

        actions.each(function (index, action) {
            handleSingleAction($(action));
        });
    }

    /**
     * Used to change setion, to progress in the story.
     * @param key
     *  Section id
     * @param withLife
     *  Should we display status div ? Default true.
     */
    function gotoSection(key, withLife) {

        if (withLife === undefined)
            withLife = true;

        handleActions(key);
        setXM(getXM());
        updateInventory();

        log && console.log("Display section : " + key);
        showSection(key, withLife);

        if (getXM() <= 0 && key != "death")
            endGame();
    }

    /**
     * Return XM left.
     * @returns {Number}
     */
    function getXM() {
        return parseInt(span_xm.text());
    }

    /**
     * Set XM of the player
     * @param v integer
     */
    function setXM(v) {
        span_xm.html(v);
    }

    /**
     * Loose "value" XM. Default one.
     * @param value int
     */
    function looseXM(value) {
        if (value == undefined)
            value = 1;

        setXM(getXM() - value);
    }

    /**
     * Start game.
     */
    function startGame() {
        gotoSection("intro", false);
    }

    /**
     * End game.
     */
    function endGame() {
        gotoSection("death", false);
    }

    /**
     * Click on button
     */
    buttons.click(function () {
        gotoSection($(this).data("go"));
    });

    // Can't store function in JSON file, we have to set it here.
    let cheatsCodes = [
        {
            "name": "goSomewhere",
            "keys": [73, 78, 71, 82, 69, 83, 83],
            "cpt": 0,
            "success": function () {
                alert("You're ready, agent. Go out, and fight for your faction.");
                location.href = "https://goo.gl/ADym2f";
            }
        },
        {
            "name": "cheatCode",
            "keys": [68, 69, 86],
            "cpt": 0,
            "success": function () {
                let goto = prompt("You found a cheat code ! Enter the id of the section you wanna go to");
                if (goto != undefined && goto.length > 0)
                    gotoSection(goto, true);
            }
        },
        {
            "name": "XMCheat",
            "keys": [88, 77, 88, 77, 88, 77],
            "cpt": 0,
            "success": function () {
                setXM(XM_INITIAL_VALUE);
            }
        }
    ];

    // Enable key navigation & some others features.
    $(document).keyup(function (e) {
        let keyCode = e.keyCode;
        let keyPressed = String.fromCharCode(keyCode);

        // Avoid false positive, such as ALTGR, CTRL, ...
        if (KEYS.indexOf(keyPressed) == -1)
            return;

        log == true && console.log("Someone clicked on '" + keyPressed + "' !");

        // Get active button inside current section.
        $(".section:visible button:visible").each(function () {
            if ($(this).data("char") == keyPressed) {
                gotoSection($(this).data("go"));
            }
        });

        let somethingHappened = false;

        /**
         * Handle cheat codes.
         */
        $(cheatsCodes).each(function () {
            if (keyCode == this.keys[this.cpt]) {
                somethingHappened = true;
                log == true && console.log(this.name + " triggered");
                this.cpt++;
                if (this.cpt == this.keys.length) {
                    this.success();
                    this.cpt = 0;
                }
            }
        });

        if (somethingHappened == true) {
            log == true && console.log("A cheat code was triggered and handled");
        } else if (KEYBOARD_NAVIGATION.indexOf(keyPressed) == -1) {
            log == true && console.log("Someone is trying to cheat !");
            cheatAttemptCounter++;
        } else {
            log == true && console.log("Classic keyboard navigation detected");
            $(cheatsCodes).each(function () {
                this.cpt = 0;
            });
        }

        // Funny little thing :)
        if (cheatAttemptCounter == MAX_CHEAT) {
            let randomImage = cheatImage[getRandom(0, cheatImage.length - 1)];
            cheatAttemptCounter = 0;
            let activeSection = $(".section:visible");
            activeSection.hide();
            div_status.hide();
            if (numberOfCheatAttempFailed == 0)
                alert("Be careful, each time you will fail to find a cheat code, ban time will be doubled");
            numberOfCheatAttempFailed++;
            $("body").css("background-image", "url(img/cheats/" + randomImage + ")");
            setTimeout(function () {
                $("body").css("background-image", "none");
                activeSection.show();
                div_status.show();
            }, BAN_TIME * numberOfCheatAttempFailed);
        }
    });

    startGame();
    loadJSONValue("imagesName");
    loadJSONValue("colorArray");
    loadJSONValue("randomName");
    loadJSONValue("cheatImage");
    loadJSONValue("glyph");
});
