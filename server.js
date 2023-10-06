const net = require("net"); // Import net package
const PORT = 8008; // Port that server will run on
const server = new net.Server(); // Initialize Server instance
const connectedClients = []; //array of active clients 

// assignes a name 2 each client in order based on when they connected
function generateUsername() {
  const username = `Friend ${connectedClients.length + 1}`;
  return username;
}

server.on("connection", (client) => {

  console.log("Connection established with:", client.remoteAddress);

  const username = generateUsername();
  //attaching name 2 client in chat
  connectedClients.push({ client, username });

  // tell client their own name
  client.write(`Hi there ${username}!\n`);

  client.on("data", (data) => {
    const receivedAsciiArt = data.toString();
    console.log(`${username} sent:`);
    console.log(receivedAsciiArt);

    // adding name + message into const 2 send to everyone
    const messageToBroadcast = `${username} sent:\n${receivedAsciiArt}`;

    // send message w name to everybody
    connectedClients.forEach((connectedClient) => {
      if (connectedClient.client.writable) {
        if (connectedClient.client === client) {
          // show client what they sent
          connectedClient.client.write(`You sent:\n${receivedAsciiArt}`);
        } else {
          // show everybody else what another client sent S
          connectedClient.client.write(messageToBroadcast);
        }
      }
    });
  });

});

// Server listener
server.listen(PORT, () => console.log("Server is listening on port: ", PORT));
