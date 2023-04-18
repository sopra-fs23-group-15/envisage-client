import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

var stompClient = null;
//var connected = false;

export let connect = () => {
  var url = (getDomain() + `/envisage-ws`);
  // over(ws) creates a WebSocket client that is connected to the STOMP server located at the url
  stompClient = Stomp.over(function(){
    return new SockJS(url);
  });
  // automatic reconnect (delay in milli seconds)
  stompClient.reconnect_delay = 5000;
  stompClient.connect({}, function (frame) {
    console.log("Connected: " + frame);
    //connected = true;
    stompClient.subscribe(`/topic/hallo`, function (response) {
      console.log("Subscribed: " + response);
    });
  });
};

export let subscribe = (mapping, callback) => {
  stompClient.subscribe(mapping, (data) => callback(data));
};

export let disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect(function () {
      console.log("Client disconnected");
    });
    stompClient = null;
    //connected = false;
  }
};
