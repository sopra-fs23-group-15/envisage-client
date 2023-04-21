import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

var stompClient = null;
let connected;
connected = false;

export let connect = () => {
  var url = (getDomain() + `/envisage-ws`);
  // over(ws) creates a WebSocket client that is connected to the STOMP server located at the url
  stompClient = Stomp.over(function(){
    return new SockJS(url);
  });
  // automatic reconnect (delay in milli seconds)
  stompClient.reconnect_delay = 5000;
  //~ (void) connect(login, passcode, connectCallback, errorCallback)
  // function frame is called on successful connect or reconnect
  stompClient.connect({}, function (frame) {
    console.log("Connected: " + frame);
    connected = true;
    // # (Object) subscribe(destination, callback, headers = {})
    const subscription = stompClient.subscribe(`/topic/hallo`, function (frame) {
          console.log("Subscribed: " + frame);
        },
        // function frame is called when an error occurred
        function (frame) {
          console.log("Error: " + frame)
        });
    console.log(subscription)
  });
};

export let subscribe = (destination, callback) => {
  // # (Object) subscribe(destination, callback, headers = {})
  stompClient.subscribe(destination, function(data){
    callback(JSON.parse(data.body));
  });
};

export let disconnect = () => {
  if (stompClient !== null) {
    // # (void) disconnect(disconnectCallback, headers = {})
    stompClient.disconnect(function () {
      console.log("Client disconnected");
    });
    stompClient = null;
    connected = false;
  }
};

export let isConnected = () => connected;

export let notifyLobbyJoin = (lobbyId) => {
  // # (void) send(destination, headers = {}, body = '')
  // body must be a STRING
  stompClient.send("/app/lobbies/" + lobbyId +"/lobbyJoin")
}