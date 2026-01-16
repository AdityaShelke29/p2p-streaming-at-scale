// Import the HTTP module
const express = require("express")
const cors = require("cors")

// Setup Room List 
class Room {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

// Create the express application. 
const app = express(); 
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json()); 

// 


// Define the port to listen on const PORT = 80;
// Start the server and listen on the specified port
// ------------------------------------------------------------------------------------------------
const PORT = 80
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
// ------------------------------------------------------------------------------------------------