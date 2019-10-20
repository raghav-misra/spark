const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs')
const port = process.env.port || 5500;

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
  });

http.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});





var player = io.of('/player')



player.on('connection', function(socket){// Player Page
  //Send Mapdata Back down
  socket.on('requestGame',function(code){
    try{
    console.log("[Map Request] - " + code)
    let rawdata = fs.readFileSync(`maps/${code}.json`);
    let data = JSON.parse(rawdata);  
    socket.emit("getMap",data)
    }catch(e){
      console.log("Incorrect Code!")
      socket.emit("sendFail")
    }
  })
 
  //Get results and store it in map
  socket.on('sendResults', function(code,res){
    console.log(`[Results Logging] on ${code} for ${res.name}`)
    let rawdata = fs.readFileSync(`maps/${code}.json`);
    let data = JSON.parse(rawdata);  
    data.stats.push(res)
    console.log(res)
    console.log(JSON.stringify(data))
    fs.writeFileSync(`maps/${code}.json`, JSON.stringify(data));
    socket.emit("sendSuccess") 

  })






  
})

var stats = io.of('/stats')

stats.on('connection', function(socket){ // Stats Page

  socket.on('requestStats', function(code){ //Get stats and send it back
    try{
      console.log("[Stats Request] - " + code)
      let rawdata = fs.readFileSync(`maps/${code}.json`);
      let data = JSON.parse(rawdata);  
      socket.emit("getStats",data.stats)
      }catch(e){
        console.log("Incorrect Code!")
        socket.emit("sendFail")
      }

  })
})


var editor = io.of('/editor')

editor.on('connection', function(socket){
  socket.on("uploadMap", function(rawdata){
    data = JSON.parse(rawdata)
    var code = data.metadata.name.replaceAll(" ","-").toLowerCase()
    var i = 1
    console.log("[Map Upload] - " + code)
    while(fs.existsSync(`maps/${code}.json`)){
      code += i;
      i++;
    }
    fs.writeFileSync(`maps/${code}.json`, JSON.stringify(data));
    socket.emit("sendSuccess",code) 

  })
})


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};