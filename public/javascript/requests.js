
function connect() {
    $("#connect-button").hide();
    $.ajax({
        type: "GET",
        url: "BlackMouse/Connect",
        success: (msg) => {
            console.log(msg);
            $("#disconnect-button").show();
        },
        error: (err) => {
            console.log(err);
            $("#connect-button").show();
        }
    })
}
function disconnect() {
    $("#disconnect-button").hide();
    $.ajax({
        type: "GET",
        url: "BlackMouse/Disconnect",
        success: (msg) => {
            console.log(msg);
            $("#connect-button").show();
        },
        error: (err) => {
            console.log(err);
            $("#disconnect-button").show();
        }
    })
}


var connectButton = $("#connect-button");
var disconnectButton = $("#disconnect-button");

connectButton.click(connect);

disconnectButton.click(disconnect);



