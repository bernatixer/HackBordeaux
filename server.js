const base64ToImage = require('base64-to-image')
const express = require('express')
const cloudinary = require('cloudinary')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

cloudinary.config({ 
  cloud_name: 'easycms', 
  api_key: '835622277612669', 
  api_secret: '*************' 
});

var path = './';
var optionalObj = {'fileName': 'face', 'type':'png'};

app.use(express.static('public'))

app.get('*', (req, res) => res.send('404 Not found'))

io.on('connection', function (socket) {
    socket.on('image', function (data) {
      base64ToImage(data.src, path, optionalObj);
      cloudinary.uploader.upload(path+optionalObj.fileName+"."+optionalObj.type, function(result) {
        // fs.unlink(filePath);
        socket.emit("detect", {url: result.url});
        console.log(result);
      });
    });
});

server.listen(3000, () => console.log('Example app listening on port 3000!'))
