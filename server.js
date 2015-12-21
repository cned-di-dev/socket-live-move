var http = require('http'),
    express = require('express'),
    app = express(),
    fs = require('fs'),
    server = http.Server(app),
    io = require('socket.io').listen(server),
    pjson = require('./package.json'),
    publicDir =  __dirname + '/public',
    port = process.env.PORT || 5000,
    connexions = [];

function generateId()
{
    var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
app.use(express.static('public'));

// Server conf / routes
// app.get("/", function (req, res) {
//   console.log('Request on : /');
//   res.sendFile(publicDir+"/index.html");
//   res.end();
// });

// Server launch
server.listen(port, function () {
	console.info(pjson.name +' is running on 127.0.0.1:'+port+' :)');
});


// Socket EVENTS
io.on('connection', function(socket){
  var newID;
  if(socket.handshake.query.id){
    newID = socket.handshake.query.id;
  }
  else {
    newID = generateId();
  }

  io.emit('setID', newID);
  socket.join(newID);
  socket.on('disconnect', function() {
    socket.leave(newID);
  });
  socket.on('sendMove', function(aigVal){
    	aigVal.aigX = aigVal.aigX;
    	aigVal.aigY = aigVal.aigY;
    	aigVal.aigZ = aigVal.aigZ * 15;
    	io.to(newID).emit('getMove', aigVal);
  });
});
