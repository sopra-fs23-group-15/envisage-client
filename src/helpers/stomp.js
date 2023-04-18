import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "./getDomain";

var stompClient = null;
//var connected = false;

export let connect = (lobbyId) => {
  var url = (getDomain() + `/envisage-ws`);
  stompClient = Stomp.over(function(){
    return new SockJS(url);
  });
  stompClient.connect({}, function (frame) {
    console.log("Connected: " + frame);
    //connected = true;
    stompClient.subscribe(`/topic/${lobbyId}`, function (response) {
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
