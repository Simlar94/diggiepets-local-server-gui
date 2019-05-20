var socket = io();

socket.on("deliverPet", function (data) {
    //Fixa: Om device_id redan finns i arrayen - gör inget - annars pusha datan till arrayen? Onödigt?

    var fakeObj1 = {
        status: "deliver",
        pet_type: "dp3s",
        name: "Sven",
        device_id: "dev531"
    };

    var fakeObj2 = {
        status: "deliver",
        pet_type: "dp2s",
        name: "Olle",
        device_id: "dev731"
    };

    var deviceIdArray = [];

    deviceIdArray.push(data); //pushes data into the array.


    //For-loop for looping out divs with JSON-data with random coordinates inside the body.
    for (var i = 0; i < deviceIdArray.length; i++) {
        console.log(deviceIdArray[i]);


        //Gets the width and height of the browser-window.
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        /*Generates random height and width coordinates of the window
        and subtracts the size of the div so it doesn't spawn outside the visible browser-window*/
        var left = Math.floor(Math.random() * (windowWidth - 200));
        var top = Math.floor(Math.random() * (windowHeight - 250));


        //Automatically gets the width and height of the div. - Not working - Try to fix. 
        var divWidth = $('#' + deviceIdArray[i].device_id).width();
        var divHeight = $('#' + deviceIdArray[i].device_id).height();


        //How the divs will be structured.
        $('<div id=' + deviceIdArray[i].device_id + ' class="petContainer"><h2 class="petHeader">' + deviceIdArray[i].name + '</h2><img src=https://digital-pet.herokuapp.com/images/' + deviceIdArray[i].pet_type + '/idle/' + deviceIdArray[i].pet_type + '.gif' + ' alt="Digital pet" height="200" width="200"></div>').appendTo("body").css({
            left: left,
            top: top
        });




        /*
                //Check if created div exists in body.
                var divExists = document.getElementById(deviceIdArray[i].device_id);

                if (divExists) {
                    console.log('Div:' + deviceIdArray[i].device_id + ' exists in body.');

                } else {
                    console.log('Div is not found in body.');
                }

            }
        */

        /*
                

                //How the divs will be structured.
                $('<div id=' + deviceIdArray[i].device_id + ' class="petContainer"><h2 class="petHeader">' + deviceIdArray[i].name + '</h2><img src=https://digital-pet.herokuapp.com/images/' + deviceIdArray[i].pet_type + '/idle/' + deviceIdArray[i].pet_type + '.gif' + ' alt="Digital pet" height="200" width="200"></div>').appendTo("body").css({
                    left: left,
                    top: top
                });
                */

        //random div position testing
        /*
        var width = $(window).width();
        var height = $(window).height();

        var left = Math.floor(Math.random() * (width - divWidth));
        var top = Math.floor(Math.random() * (height - divHeight));
        */

        /*
        var randPosX = Math.floor((Math.random() * bodyWidth -200));
        var randPosY = Math.floor((Math.random() * bodyHeight));
        console.log("height: " + bodyHeight + " width: " + bodyWidth);
        console.log("X: " + randPosX + " Y: " + randPosY);

        $('#' + deviceIdArray[i].device_id).css('left', randPosX);
        $('#' + deviceIdArray[i].device_id).css('top', randPosY);
        */



        /*
            function AnimateIt() {
                var theDiv = $('#' + deviceIdArray[i].device_id),
                    maxLeft = $(window).width() - theDiv.width(),
                    maxTop = $(window).height() - theDiv.height(),
                    leftPos = Math.floor(Math.random() * maxLeft),
                    topPos = Math.floor(Math.random() * maxTop);
                
                    if (theDiv.position().left < leftPos) {
            theDiv.removeClass("left").addClass("right");
        } else {
            theDiv.removeClass("right").addClass("left");
        }

                theDiv.animate({
                    "left": leftPos,
                    "top": topPos
                }, 1200, AnimateIt);
            }*/







    }

});


socket.on("removePet", function (data) {
    console.log(data);
    /*
                //Removes specific object from array:
                var DeviceId = data.device_id;

                //Filtered deviceIdArray
                var filtered = deviceIdArray.filter(function (arrayData) {
                    //console.log(arrayData.device_id);
                    return arrayData.device_id != DeviceId

                });
    
                console.log(filtered);
*/

    var element = document.body;
    var child = document.getElementById(data.device_id);
    element.removeChild(child);

});






//Function for hiding the cursor when idle.
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
