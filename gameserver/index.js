
const io = require('socket.io')();
const port = process.env.PORT || 3000;

var whosit;
//var gamepieces = {};
var taggable = true;
var clearTaggable;

var roundTime = Date.now()
var switchTime = Date.now() 
var gameLength = 1 * 90 * 1000 // minutes * seconds * milliseconds
var playerTimer = {} // uuid: time per player round

function onConnection(socket) {
	//console.log('Connection received: ' + socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort);
	//socket.emit('announce', { switchTime, roundTime, gameLength} )
	socket.broadcast.emit('announce', { switchTime, roundTime, gameLength} )

	if (whosit) {
		socket.emit('it', { "uuid": whosit } )
	}

	socket.on('move', (data) => {
		socket.broadcast.emit('moved', data)
		socket.userid = data.uuid;

		if (!playerTimer[data.uuid]) {
			playerTimer[data.uuid] = { itTime: 0, lastItTime: 0 }
		}

		// determine who's it
		if (!whosit) { 
			whosit = data.uuid; 
			switchTime = Date.now()
			if (!playerTimer[data.uuid]) { playerTimer[data.uuid] = {} }
			playerTimer[data.uuid].lastItTime = switchTime
			
			io.emit('it', { "uuid": whosit, switchTime, roundTime, gameLength} )
			//socket.broadcast.emit('it', { "uuid": whosit } )
		} 
	    //console.log('move received: ');
	    //console.log(data);
	});

	socket.on('tagged', (data) => {
		if (data.olduuid && data.newuuid && getTaggable()) {
			setTaggable(false);
			switchTime = Date.now()

			if (!playerTimer[data.newuuid]) { playerTimer[data.newuuid] = {}}

			playerTimer[data.olduuid].itTime += switchTime - playerTimer[data.olduuid].lastItTime
			playerTimer[data.newuuid].lastItTime = switchTime
			whosit = data.newuuid;
			
			io.emit('it', { "uuid" : data.newuuid,  switchTime, roundTime, gameLength })
			setTimeout(function() { setTaggable(true); },3000);
		}
	})

	socket.on('disconnect', () => {
		if (whosit == socket.userid) { whosit = undefined }
		delete playerTimer[socket.userid]
		socket.broadcast.emit('remove', { "uuid" : socket.userid })
	})
}

function getTaggable() {
	return taggable;
}
function setTaggable(value) {
	if (value != undefined) {
		taggable = value;
	} else { 
		taggable = true; 
	}
	//console.log('Taggable: ' + taggable);
}

io.on('connection', onConnection);

io.listen(port);
console.log('listening on port ',port);

// Start game timer
setInterval(() => {

	switchTime = Date.now()
	roundTime = switchTime
	playerTimer[whosit].itTime += switchTime - playerTimer[whosit].lastItTime
	
	console.log("Round ended; sending timer message: ", playerTimer)
	io.emit('timer', { playerTimer })

	for (var player in playerTimer) {
		playerTimer[player].itTime = 0
		playerTimer[player].lastItTime = 0
	}
	playerTimer[whosit].lastItTime = switchTime
	io.emit('it', { "uuid" : whosit, switchTime, roundTime, gameLength })
}, gameLength)
