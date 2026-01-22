// Import the HTTP module
const http = require("http"); 
const cors = require("cors"); 

// Create the http server. The input anonymous function will function as the router for 
// all incoming requests to the server. 
const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/room_management") {
    res.writeHead(200, {"Content-Type": "application/json"});
    handleRoomManagement(req, res); 
  } 
  else {

  }

  res.end(); 

})

// Handle creation / joining of a room. 
function handleRoomManagement(req, res) {
  console.log("Handling room management request...");
  let body = ""; 

  req.on("data", (chunk) => {
    body = body + chunk.toString(); 
  }); 
  req.on("end", () => {
    console.log("Received body: " + body); 
    let request = JSON.parse(body);
    console.log(request.client_id); 
    console.log(request.room_code); 
  }); 
  console.log("hello"); 
}

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


// Define the port to listen on const PORT = 80;
// Start the server and listen on the specified port
// ------------------------------------------------------------------------------------------------
const PORT = 3000; 
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
// ------------------------------------------------------------------------------------------------