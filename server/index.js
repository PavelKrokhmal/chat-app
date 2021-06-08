import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import {createServer} from 'http'
import router from './router.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(router)

const httpServer = createServer(app)
const io = new Server(httpServer)

httpServer.listen(PORT, () => console.log(`Server has started on post ${PORT}`))

io.on("connection", (socket) => {
    console.log('We have a new connection!')

    socket.on('disconnect', () => {
        console.log('User had left!')
    })
})