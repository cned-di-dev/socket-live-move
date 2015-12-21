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

// Socket EVENTS
io.on('connection', function(socket){
  var newID;
  console.log('socket.handshake.query.id : ' + socket.handshake.query.id);
  if(typeof(socket.handshake.query.id) !== 'undefined'){
    newID = socket.handshake.query.id;
    console.log('Connection using existing ID : '+ newID);
  }
  else {
    newID = generateId();
    console.log('New ID provided : '+ newID);
    io.emit('setID', newID);
  }

  socket.join(newID);
  console.log('Joined room : '+ newID);
  socket.on('disconnect', function() {
    socket.leave(newID);
    console.log('Leaved room : '+ newID);
  });
  socket.on('sendMove', function(aigVal){
    	aigVal.aigX = aigVal.aigX;
    	aigVal.aigY = aigVal.aigY;
    	aigVal.aigZ = aigVal.aigZ * 15;
    	io.to(newID).emit('getMove', aigVal);
  });
});


// Server launch
server.listen(port, function () {
	console.info(pjson.name +' is running on 127.0.0.1:'+port+' :)');
});
