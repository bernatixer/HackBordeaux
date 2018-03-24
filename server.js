const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const execSync = require('child_process').execSync

setInterval(function() {
    execSync("wget https://www.bicing.cat/availability_map/getJsonObject -O public/getJsonObject", { encoding: 'utf8' });
}, 60000);

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))

io.on('connection', function (socket) {
    // socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
});

server.listen(3000, () => console.log('Example app listening on port 3000!'))