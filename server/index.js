import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import {createServer} from 'http'

const PORT = process.env.PORT || 5000

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

httpServer.listen(PORT, () => console.log(`Server has started on post ${PORT}`))

io.on("connection", (socket) => {
    console.log('socket')
})