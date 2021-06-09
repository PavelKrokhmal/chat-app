import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar.js'
import Input from '../Input/Input.js'
import Messages from '../Messages/Messages.js'
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css'

let socket

function Chat({location}) {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([])

    const END_POINT = "localhost:5000"

    useEffect(() => {
        const {name, room} = queryString.parse(location.search)

        socket = io(END_POINT, {"transports" : ["websocket"]})

        setName(name)
        setRoom(room)

        socket.emit('join', {name, room}, (error) => {
            console.log(error)
        })

        return () => {
            socket.off()
        }
    }, [END_POINT, location.search])

    useEffect(()=> {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages])

    const sendMessage = (event) => {

        event.preventDefault()

        if(message.trim()) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input setMessage={setMessage} sendMessage={sendMessage} message={message}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat
