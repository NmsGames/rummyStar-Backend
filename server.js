// "use strict";
const express = require('express');
 
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 5000
const io = require("socket.io")(http);
 //IMport 
const {userLogin,forceLogin,userSignUp,userProfile} = require("./services/UserLogin");
const events = require("./Constants").events;
const commonVar = require("./Constants").commonVar;
const MatchMaking = require("./utils/MatchMaking").MatchPlayer;
const playerManager  = require('./utils/PlayerDataManager');
const cors = require('cors')
const debug = require("debug")("test");

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())
const AuthRoute     = require('./src/routes/AuthRoutes')  
const UserRoutes = require('./src/routes/UserRoutes')
 
app.use('/auth',AuthRoute)
app.use('/api/users',UserRoutes) 
 
const webservice = require("./services/WebServices");
// require("./ServerSocket.js").createSocket(io);
io.on("connection", (socket) => {  
    DissConnect(socket);
    UserLogin(socket);
    UserSignUp(socket);
    RegisterToGameRoom(socket)
    ForceLogin(socket),
    UserProfile(socket)
})


function DissConnect(socket) {
    socket.on("disconnect", () => {
        debug("player got dissconnected " + socket.id);
          playerManager.RemovePlayer(socket.id);
    })
}

function UserSignUp(socket){
  socket.on(events.OnSignUp, async(data) =>{
    let result = await userSignUp(data); 
          socket.emit(events.OnSignUp,result);
    })
}
function UserLogin(socket){
  socket.on(events.OnLogin, async(data) =>{
    let result = await userLogin(data);
    if(result.status === 200) addPlayerToRoom(result.data,socket);
          socket.emit(events.OnLogin,result);
    })
}

function UserProfile(socket){
  socket.on(events.OnUserProfile, async(data) =>{
    let result = await userProfile(data);
      socket.emit(events.OnUserProfile,result);
    })
}


function ForceLogin(socket){
  socket.on(events.OnForceLogin, async(data) =>{
    let removePlayer = await forceRemovePlayer(data.user_id);
    let result = await forceLogin(data);
      if(result.status === 200) addPlayerToRoom(result.data,socket);
          socket.emit(events.OnLogin,result);
    })
}

function forceRemovePlayer(playerId){
      let player = playerManager.GetPlayerById(playerId);
      if(player && player.length>0){
        let socket    =  player[0].socket;
        socket.emit(events.OnForceExit);
        playerManager.RemovePlayer(socket.id);
        socket.disconnect();
    }    
      return true;
}


function addPlayerToRoom(data,socket){
    let obj = {
      socket  : socket,
        socketId: socket.id,
        playerId: data.user_id,
        balance : data.coins,
    }
    playerManager.AddPlayer(obj);
    return;
}


function RegisterToGameRoom(socket) {
    socket.on(events.RegisterPlayer,(data) => {
      let playerObj = {
        socket: socket,
        playerId: data[commonVar.playerId],
        gameId: data[commonVar.gameId],
      };
      MatchMaking(playerObj)
    })
  }
 
require("./gameplay").sendSocket(io.sockets);
const path = require("path");


app.use('/',webservice);
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.send('default routes!');
});

app.get("/servertesting", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/test.html'));
});


http.listen(port, () => {
  debug("listening on " + port);
});