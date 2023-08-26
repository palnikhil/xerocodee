const redis = require("redis");

let redisPort = 6379;  // Replace with your redis port
let redisHost = "65.1.135.129";  // Replace with your redis host
const client = redis.createClient({
    socket: {
      port: redisPort,
      host: redisHost,
    }
  });

(async () => {
    // Connect to redis server
    await client.connect();
})();


console.log("Attempting to connect to redis");
client.on('connect', () => {
    console.log('Connected!');
});

// Log any error that may occur to the console
client.on("error", (err) => {
    console.log(`Error:${err}`);
});

// Close the connection when there is an interrupt sent from keyboard
process.on('SIGINT', () => {
    client.quit();
    console.log('redis client quit');
});

module.exports = client