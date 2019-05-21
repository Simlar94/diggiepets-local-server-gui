const express = require("express");
const path = require("path");
const app = express();
const request = require("request");
const http = require("http").Server(app);

const io = require("socket.io")(http);

// Middleware-function for serving the images, JS and CSS-files inside the folder "public".
app.use("/static", express.static("public")); 

// Route for "/" (root), responds and delivers the "index.html"-file.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// QR-reading for "leaving" and "retrieving" the diggiepets from the GUI.
const Zbar = require("zbar");
zbar = new Zbar("/dev/video0");

zbar.stdout.on("data", function (buf) {
    var qrCodeString = buf.toString();

    // Remove space from string's end.
    var fixedString = qrCodeString.substring(0, qrCodeString.length - 1);
    console.log(fixedString);

    // Post request with the attached stringified QR-code. 
    request.post({
        url: "https://diggiepet.herokuapp.com/check/qr",
        headers: {
            Authorization: "Basic ZGlnZ2llcGV0X2FkbWluOmRpZ2dpZXBldDEyMzQ1Njc4OTA="
        },
        form: {
            "qr_code": "W1GGVUBljy1558438809838"
        }
    }, function (err, response, body) {
        var obj = JSON.parse(body); // Parses the response (body) to a JSON-object, stores it in the variable "obj".

        // If-statement containing another if-statement, executes code block depending on the server response.
        if (!err) {
            // If-statement with different conditions depending on the value of the "status"-key in the responded object.
            if (obj.status === "deliver") {
                io.emit("deliverPet", obj); // Emits to the socket "deliverPet" with a parameter containing the specific JSON-object.
                console.log("deliver emitted");
            } else {
                io.emit("removePet", obj);
                console.log("remove emitted"); // Emits to the socket "removePet" with a parameter containing the specific JSON-object.
            }
        } else {
            console.log(err);
        }
    });
});

/*
// Test script for the QR-reading and the GUI (with "emits" for socket.io).
var test = true;

if (test === true) {
    request.post({
        url: "https://diggiepet.herokuapp.com/check/qr",
        headers: {
            Authorization: "Basic ZGlnZ2llcGV0X2FkbWluOmRpZ2dpZXBldDEyMzQ1Njc4OTA="
        },
        form: {
            "qr_code": "W1GGVUBljy1558438809838"
        }

    }, function (err, response, body) {
        if (!err) {
            test = false;
            console.log(body);
            var obj = JSON.parse(body);

            if (obj.status === "deliver") {
                io.emit("deliverPet", obj);
                console.log("deliver emitted");
            } else if (obj.status === "remove") {
                io.emit("removePet", obj);
                console.log("remove emitted");
            } else {
                console.log("body.status is undefined");
            }
        } else {
            console.log(err);
        }
    });
}
*/

http.listen(process.env.PORT || 3000, () => console.log("Server is running."));
