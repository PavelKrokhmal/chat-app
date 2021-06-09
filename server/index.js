import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import {createServer} from 'http'
import router from './router.js'
import users from './users.js'


const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(router)

const httpServer = createServer(app)
const io = new Server(httpServer)

httpServer.listen(PORT, () => console.log(`Server has started on post ${PORT}`))

io.on("connection", (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = users.addUser({id: socket.id, name, room})

        if(error) {
            return callback(error)
        }

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`})

        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: users.getUsersInRoom(user.room)})

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = users.getUser(socket.id)

        io.to(user.room).emit('message', {user: user.name, text: message})
        io.to(user.room).emit('roomData', {user: user.room, users: users.getUsersInRoom(user.room)})

        callback()
    })

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left.`})
            io.to(user.room).emit('roomData', {user: user.room, users: users.getUsersInRoom(user.room)})
        }

        console.log('User had left!')
    })
})