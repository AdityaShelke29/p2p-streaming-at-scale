// Create a WebSocket server on port 4000
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 }); 

// Setup data structures. These include the data structures for Rooms and Clients. 
// ------------------------------------------------------------------------------------------------
class Room {
    constructor(code) {
        this.code = code;
        this.clients = []; 
    }; 
    
    addClient(client) {
        if (client in this.clients) {
            console.log("Client with id " + client.client_id + " already exists!"); 
            return false; 
        }
        
        this.clients.push(client); 
        return true; 
    }

    generateTopology() {
        // Currently, only full mesh topology is supported. 
        return this.generateFullMesh(); 
    }

    generateFullMesh() {
        let topology = {}; 
        topology["type"] = "full_mesh"; 
        topology["clients"] = this.clients.map(c => c.client_id); 
        
        for (let i = 0; i < this.clients.length; i++) {
            let current_client = this.clients[i];

            topology[current_client.client_id] = {
                "connections": [], 
                "download_from": {}, 
                "upload_to": {}
            }

            for (let j = 0; j < this.clients.length; j++) {
                let other_client = this.clients[j]; 
                if (current_client.client_id !== other_client.client_id) {
                    topology[current_client.client_id]["connections"].push(other_client.client_id);
                    topology[current_client.client_id]["download_from"][other_client.client_id] = true; 
                    topology[current_client.client_id]["upload_to"][other_client.client_id] = true; 
                }
                else {

                }
            }
        }

        return topology;
    }
    
    stringify() {
        let details = "\nRoom Code: " + this.code + "\n"; 
        details += this.clients.map(c => c.stringify()).join("\n") + "\n";
        return details; 
    }
}; 

class Client {
    constructor(client_id, client_ws, room_code) {
        this.client_id = client_id; 
        this.client_ws = client_ws; 
        this.room_code = room_code
    }

    stringify() {
        return "Client ID: " + this.client_id + ", Room Code: " + this.room_code; 
    }
}
// ------------------------------------------------------------------------------------------------


// Data Structures to hold Rooms and Client IDs
// ------------------------------------------------------------------------------------------------
const rooms = {}; 
const clients = {}; 
const client_ids = new Set(); 
// ------------------------------------------------------------------------------------------------

// Handling WebSocket Connections
wss.on('connection', (ws) => {
    console.log("New client connected."); 
    setupMessageRouter(ws); 

    ws.onclose = () => {
        console.log('Disconnected from the server.'); 

        let client = clients[ws]; 
        if (client) {
            let roomCode = client.room_code; 
            if (roomCode in rooms) {
                rooms[roomCode].clients = rooms[roomCode].clients.filter(
                    c => c.client_id !== client.client_id); 
                console.log(rooms[roomCode].stringify()); 
            }
            delete clients[ws]; 
            client_ids.delete(client.client_id); 
        }
    };
    
    ws.onerror = error => {
        console.error('WebSocket error:', error);
    }; 
})

// Router for incoming messages from clients.
// ------------------------------------------------------------------------------------------------
function setupMessageRouter(ws) {
    ws.on('message', (message) => {
        let data = JSON.parse(message); 
        console.log("Received message from client: " + JSON.stringify(data));

        switch (data.status) {
            case "request_id": 
                requestClientID(ws, data); 
                break
            
            default: 
                console.log("Unknown Message Status: " + data.status);
        }
    })
}

// Handle New Connection 
// ------------------------------------------------------------------------------------------------
function requestClientID(ws, data) {
    let roomCode = data.room_code; 
    let clientID = generateClientID(ws);

    // Create client if it does not exist.
    if (!(ws in clients)) {
        clients[ws] = new Client(clientID, ws, roomCode); 
    }
    else {
        console.log("Client already exists with id: " + clients[ws].client_id);
        ws.send(JSON.stringify({
            "status": "response_id", 
            "client_id": clients[ws].client_id, 
            "room_code": roomCode
        }))
        return; 
    }

    // Create room if it does not exist.
    if (!(roomCode in rooms)) {
        rooms[roomCode] = new Room(roomCode); 
    }
    
    // Add client to room.
    rooms[roomCode].addClient(clients[ws]); 
    ws.send(JSON.stringify({
        "status": "response_id", 
        "client_id": clientID, 
        "room_code": roomCode
    }))

    // Print room details.
    console.log(rooms[roomCode].stringify()); 

    // Update topology to support new client. 
    topologyUpdate(roomCode);
}

// Topology Update
// ------------------------------------------------------------------------------------------------
function topologyUpdate(roomName) {
    let room = rooms[roomName];
    let topology = room.generateTopology(); 

    console.log("Generated Topology: " + JSON.stringify(topology));

    // Notify all clients in the room about the new topology. 
    room.clients.forEach(client => {
        client.client_ws.send(JSON.stringify({
            "status": "topology_update", 
            "topology": topology
        }))
    })
}

// Generate Unique Client ID
// ------------------------------------------------------------------------------------------------
function generateClientID() {
    let client_id = String(Math.floor(Math.random() * 1000000000));
    while (client_ids.has(client_id)) {
        client_id = String(Math.floor(Math.random() * 1000000000)); 
    }
    client_ids.add(client_id); 
    return client_id; 
}

// Start the server
// ------------------------------------------------------------------------------------------------
console.log("WebSocket server running on port 4000."); 