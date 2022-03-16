var stompClientQueue = null;

function setConnectedQueue(connected) {
    $("#connect-queue").prop("disabled", connected);
    $("#disconnect-queue").prop("disabled", !connected);
    if (connected) {
        $("#conversation-queue").show();
    }
    else {
        $("#conversation-queue").hide();
    }
    $("#greetings-queue").html("");
}

function connectQueue() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClientQueue = Stomp.over(socket);
    stompClientQueue.connect({}, function (frame) {
        setConnectedQueue(true);
        console.log('Connected-Queue: ' + frame);
        stompClientQueue.subscribe('/user/queue/greetings', function (greeting) {
            showGreetingQueue(JSON.parse(greeting.body).content);
        });
    });
}

function disconnectQueue() {
    if (stompClientQueue !== null) {
        stompClientQueue.disconnect();
    }
    setConnectedQueue(false);
    console.log("Disconnected-Queue");
}

function sendNameQueue() {
    stompClientQueue.send("/app/greetings", {}, JSON.stringify({'name': $("#name-queue").val()}));
}

function showGreetingQueue(message) {
    $("#greetings-queue").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $(".form-queue").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect-queue" ).click(function() { connectQueue(); });
    $( "#disconnect-queue" ).click(function() { disconnectQueue(); });
    $( "#send-queue" ).click(function() { sendNameQueue(); });
});