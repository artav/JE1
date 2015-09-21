

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var osc = require('node-osc');


// App or Page to present to the user - this would be index.html - the login page but we're skipping it for now
app.get('/', function(req, res){
  res.sendFile('motion2.html', { root: __dirname });
});

// Open Webhosts socket with webpage
io.on('connection', function(socket){
    socket.on('data', function(msg){    //need to do data validation here!!!!!!  ********************************************************
    col = msg.col;
    x = msg.x;
    y = msg.y;
    z = msg.z;
    console.log(col,x,y,z);
    var client = new osc.Client('127.0.0.1', 3333); client.send('/col', col, function () { client.kill(); });
  });
});

//listen on port 11111 for osc msg
var oscServer = new osc.Server(11111, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
      console.log("TUIO message:");
      console.log(msg);
});


//Listen on port 3000 for websocket messages - note process.env.PORT and IP are Cloud9 requirmente
http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = http.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

