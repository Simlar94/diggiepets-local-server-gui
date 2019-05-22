// Function for hiding the cursor when idle, runs when the page-window is loading (window.onload).
window.onload = function () {
    var justHidden = false;
    var j;

    function hide() {
        $('html').css({
            cursor: 'none'
        });
        justHidden = true;
        setTimeout(function () {
            justHidden = false;
        }, 500);
    }
    $(document).mousemove(function () {
        if (!justHidden) {
            justHidden = false;
            clearTimeout(j);
            $('html').css({
                cursor: 'default'
            });
            j = setTimeout(hide, 1000);
        }
    });
};

/* Code for the main GUI-functions.
=================================================================================== */

var socket = io();

/* Socket for the pet-delivery (contains passed data from the server-response).  
========================================================== */
socket.on("deliverPet", function (data) {

    var dataArray = []; // Holds the data from the "data"-parameter (JSON-objects).

    dataArray.push(data); // Pushes data (JSON-objects) into the dataArray.

    //Function for looping out divs containing desired data.
    function loopPetDivs() {
        // For-loop for looping out divs with JSON-objects from the "dataArray" on random coordinates inside the "body"-element.
        for (var i = 0; i < dataArray.length; i++) {
            console.log(dataArray[i]);

            // Gets the width and height of the browser-window.
            var windowHeight = $(window).height() - 250;
            var windowWidth = $(window).width() - 200;

            /* Generates random height and width coordinates of the window
            and subtracts the size of the div so it doesn't spawn outside the visible browser-window. */
            var top = Math.floor(Math.random() * windowHeight);
            var left = Math.floor(Math.random() * windowWidth);

            // How the looped divs will be structured.
            $('<div id=' + dataArray[i].qr_code + ' class="petContainer"><h2 class="petHeader">' + dataArray[i].name + '</h2><img src=https://diggiepet.herokuapp.com/images/' + dataArray[i].pet_type + '/idle/' + dataArray[i].pet_type + '.gif' + ' alt="Digital pet" height="200" width="200"></div>').appendTo("body").css({
                left: left,
                top: top
            });
        }
    };

    loopPetDivs(); // Calls the function.

    // Function for playing unique animations for each of the pet-objects, made with a for-loop.
    function loopPetAnimations() {
        for (var i = 0; i < dataArray.length; i++) {
            var currentPetData = dataArray[i];
            animateDiv(currentPetData); // Passes "currentPetData" to the "animateDiv"-function for the data to be accessed.
        }
    };

    loopPetAnimations(); // Calls the function.

    // Function for generating a new random position for the div in the "animateDiv"-function.
    function makeNewPosition() {
        /* Gets viewport dimensions (browser window) then removes the dimension of the div
        to prevent it from moving outside the visible window. */
        var windowHeight = $(window).height() - 250;
        var windowWidth = $(window).width() - 200;

        var nh = Math.floor(Math.random() * windowHeight);
        var nw = Math.floor(Math.random() * windowWidth);

        return [nh, nw];
    };

    /* Function for animating the divs, 
    calls the "loopPetAnimations"-function again for continued moving-animations. */ 
    function animateDiv(petData) {
        var newq = makeNewPosition();
        var oldq = $('#' + petData.qr_code).offset();
        var speed = calcSpeed([oldq.top, oldq.left], newq);

        $('#' + petData.qr_code).animate({
            top: newq[0],
            left: newq[1]
        }, speed, function () {
            loopPetAnimations();
        });
    };

    // Function for modifying the speed of the moving-animations.
    function calcSpeed(prev, next) {

        var x = Math.abs(prev[1] - next[1]);
        var y = Math.abs(prev[0] - next[0]);

        var greatest = x > y ? x : y;

        var speedModifier = 0.1;

        var speed = Math.ceil(greatest / speedModifier);

        return speed;
    };
});

/* Socket for the pet-removal (contains passed data from the server-response).
========================================================== */
socket.on("removePet", function (data) {
    console.log(data);
    /* Removes the element (div) with the id corresponding to the value of the "qr_code"-key in the passed data-object. */
    var element = document.body;
    var child = document.getElementById(data.qr_code);
    element.removeChild(child);
});
