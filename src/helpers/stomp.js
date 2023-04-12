import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {getDomain} from "./getDomain";

var stompClient = null;
var connected = false;




export let connect = (lobbyId) => {
    var socket = new SockJS(getDomain() + `/envisage`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        connected = true;
        stompClient.subscribe(`/topic/${lobbyId}`, function(response){
            console.log("Subscribed: " + response)
        })
    })

}




export let disconnect = () => {
    if (stompClient !== null) {
        stompClient.disconnect(function() {
            console.log("Client disconnected");
        });
        stompClient = null;
        connected = false;
    }
}

