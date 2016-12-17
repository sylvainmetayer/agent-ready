$(document).ready(function () {
    // VARIABLES
    var buttons = $(".section button");
    var status = $("#status");
    var life = status.find(".life .value");
    var log = false; // Utilisé pour le debug

    // FUNCTIONS
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

    function handleAction(key) {
        if ($("#" + key).find("action").size() == 0)
            return;

        var action = $("#" + key).find("action").attr("name");

        switch (action) {
            case "start":
                setLife(3);
                break;
            case "reset":
                setLife(3);
                break;
            case "hit":
                loseOneLife();
                break;
            default:
                alert("Error, define a new action for " + action + "!");
        }
    }

    function gotoSection(key, withLife) {
        if (withLife === undefined)
            withLife = true;

        if (log) {
            console.log(withLife);
            console.log(key);
            console.log("--------");
        }

        handleAction(key);
        setLife(getLife());
        showSection(key, withLife);

        if (getLife() <= 0 && key != "death")
            endGame();
    }

    function getLife() {
        return parseInt(life.text());
    }

    function setLife(v) {
        life.html(v);
    }

    function loseOneLife() {
        setLife(getLife() - 1);
    }

    function startGame() {
        gotoSection("intro", false);
    }

    function endGame() {
        gotoSection("death", false);
    }

    buttons.click(function () {
        gotoSection($(this).attr("go"));
    });

    startGame();

});
