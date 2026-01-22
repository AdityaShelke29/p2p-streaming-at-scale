// Client Side Javascript Code for P2P Video Streaming Proof of Concept V1.
console.log("Client side code...");
WSS = "ws://localhost:4000";

// Global Variables
let clientID = null;
let roomCode = null; 
let webSocket = null; 

// Planning 
/* 
    1. Have the server give each client a unique ID upon connection to a room. 
    2. The server will, upon each new client or disconnection, recompute the topology and 
       broadcase the new topology to all clients in the room. 
    3. Each client will then use the signaling function to establish P2P connections with the 
       other clients in the room based on the topology received from the server. Each client will 
       also forward data channel and media channel data from other clients. 
    4. Essentially, each client will maintain a mapping of which streams it is receiving, and 
       which streams it is forwarding to other clients. 
*/ 

// Room Management
// ------------------------------------------------------------------------------------------------
document.getElementById("roomManagementButton").addEventListener("click", () => {
    roomCode = document.getElementById("roomCode").value
    console.log("Attempting to create / join room with code: " + String(roomCode));
    setupWebSocket(); 
}); 

// WebSocket Setup
// ------------------------------------------------------------------------------------------------ 
function setupWebSocket() {
    webSocket = new WebSocket(WSS); 
    webSocket.onclose = () => {console.log("Disconnected from the server")};
    webSocket.onerror = error => {console.error("WebSocket error:", error)}; 
    webSocket.onmessage = (message) => {messageRouter(message)}; 

    webSocket.onopen = () => {
        console.log('Connected to the WebSocket server.'); 
        requestClientID(); 
    }
}

// Message Router 
// ------------------------------------------------------------------------------------------------
function messageRouter(message) {
    let data = JSON.parse(message.data); 
    console.log("Received message from server: " + JSON.stringify(data));

    switch (data.status) {
        case "response_id": 
            responseClientID(data); 
            break; 

        case "topology_update": 
            receivedTopologyUpdate(data); 
            break; 

        default: 
            console.log("Unknown Message Status: " + data.status); 
    }
}

// Response Client ID
// ------------------------------------------------------------------------------------------------
function responseClientID(data) {
    clientID = data.client_id; 
    console.log("Received client ID from server: " + clientID); 
}

// Received Topology Update
// ------------------------------------------------------------------------------------------------
function receivedTopologyUpdate(data) {
    let topology = data.topology; 
    console.log("Received topology update from server: " + JSON.stringify(topology));

    // Additional Steps Here
    // TODO: Use the topology to establish P2P connections with other clients.

} 

// Request Client ID
// ------------------------------------------------------------------------------------------------
function requestClientID() {
    webSocket.send(JSON.stringify({
        "status": "request_id", 
        "room_code": roomCode
    }))
}

// ------------------------------------------------------------------------------------------------
function signalingHandler() {

    webSocket.send(JSON.stringify({
        "status": "request_id", 
        "room_code": roomCode
    }))

    webSocket.on("message", (message) => {
        let data = JSON.parse(message.data); 
        console.log("Received message from server: " + JSON.stringify(data)); 

        if (data.status === "request_id") {
            clientId = data.client_id; 
            console.log("Received client id from server: " + clientId); 
            details.client_id = clientId; 
        }
    })



}