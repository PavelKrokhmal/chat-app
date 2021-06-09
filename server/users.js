const users = []

const addUser = ({id, name, room}) => {
    const parsedName = name.trim().toLowerCase()
    const parsedRoom = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === parsedRoom && user.name === parsedName)

    if (existingUser) {
        return {error: 'Username is taken!'}
    }

    const user = {id, name: parsedName, room: parsedRoom}

    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

export default {addUser, removeUser, getUser, getUsersInRoom}