const net = require("net");
//npm module to get client text input from terminal
const readline = require("readline");
//npm module to generate ascii style text from normal text
const figlet = require("figlet");

const PORT = 8008; // Port to connect to
const HOST = "localhost"; // IP address or hostname to connect to -- change this is server on diff machine 

const socket = new net.Socket(); // Initialize a socket

// Connect to server
socket.connect({
  port: PORT,
  host: HOST,
});

//module stuff 4 reading terminal text as input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//get input from user (on the terminal its line that starts w/ >)
rl.prompt();

// Connect event
socket.on("connect", () => {
  console.log("TCP connection made!");
    // title into ascii 
    figlet("tcp ascii chat!", (err, asciiArt) => {
        console.log(asciiArt);
        console.log("Share a word with some friends");
      //where we get input from user
      rl.prompt();
    });
});

rl.on("line", (input) => {
  // turn client text into ascii w figlet + send 2 server
  figlet(input, (err, asciiArt) => {
      socket.write(asciiArt);
    //where we get input from user
    rl.prompt();
  });
});

// Data listener
socket.on("data", (data) => {
  // show what the server sent
  console.log(data.toString());
  //where we get input from user
  rl.prompt();
});

socket.on("end", () => {
  console.log("TCP end.");
  rl.close();
});
