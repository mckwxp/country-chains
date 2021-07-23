const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));
const port = process.env.PORT || 3001;

const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let rooms = [];

io.on("connection", (socket) => {
    console.log("connected");
    socket.emit("updateRooms", rooms);

    socket.on("createroom", () => {
        let maxID = rooms.length > 0 ? Math.max(...rooms.map((x) => x.id)) : 0;
        rooms.push({
            id: maxID + 1,
            mode: null,
            countries: [],
            playersInRoom: [],
        });
        io.emit("updateRooms", rooms);
        console.log("Room created");
    });

    socket.on("spectate", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        socket.emit("begin", r.countries);
        socket.join(r.id);
        io.to(r.id).emit("updatePlayersInRoom", r.playersInRoom);
    });

    socket.on("configureRoom", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        console.log("Room configured");
        r.mode = msg.mode;
        r.playersInRoom.push({
            id: socket.id,
            username: msg.username ?? "guest",
        });
        io.emit("updateRooms", rooms);
        socket.emit("begin", r.countries);
        socket.join(r.id);
        io.to(r.id).emit("updatePlayersInRoom", r.playersInRoom);
    });

    socket.on("message", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        r.countries.push(msg.country);
        io.to(r.id).emit("reply", r.countries);
    });

    socket.on("end", (msg) => {
        io.to(msg.roomID).emit("end");
        socket.leave(msg.roomID);
        // remove the room
        rooms = rooms.filter((r) => r.id !== msg.roomID);
        console.log(`Room ${msg.roomID} removed`);
        io.emit("updateRooms", rooms);
    });

    socket.on("disconnect", () => {
        // find which room the user is in
        // (should be just one room, but keep as array just in case)
        let inRoom = rooms.filter(
            (r) =>
                r.playersInRoom.filter((p) => p.id === socket.id).length !== 0
        );

        // remove player from room
        rooms = rooms.map((r) => {
            r.playersInRoom = r.playersInRoom.filter((p) => p.id !== socket.id);
            return r;
        });

        // broadcast updated player list to each room
        inRoom.forEach((r) =>
            io.to(r.id).emit("updatePlayersInRoom", r.playersInRoom)
        );

        console.log("disconnected");
    });
});
