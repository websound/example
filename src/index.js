var PeerServer = require('peer').PeerServer
var Topics = require('./public/js/Topics.js')
var Hapi = require('hapi')

var server = new Hapi.Server({})

server.connection({
  port: Number(process.env.PORT) || 8000
})

server.register(require('inert'), function (err) {
  if (err) {
    throw err
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: __dirname + '/public'
      }
    }
  })

  server.start(function (err) {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
})

var io = require('socket.io').listen(server.listener)

var peerServer = new PeerServer({ port: 9000, path: '/chat' })

peerServer.on('connection', function (id) {
  io.emit(Topics.USER_CONNECTED, id)
  console.log('User connected with #', id)
})

peerServer.on('disconnect', function (id) {
  io.emit(Topics.USER_DISCONNECTED, id)
  console.log('With #', id, 'user disconnected.')
})
