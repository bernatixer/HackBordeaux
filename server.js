const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))

app.get('*', (req, res) => res.send('404 Not found'))

io.on('connection', function (socket) {
    // socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
});

server.listen(3000, () => console.log('Example app listening on port 3000!'))
