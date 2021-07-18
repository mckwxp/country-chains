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
    io.emit("showRooms", rooms);

    socket.on("createroom", () => {
        let maxID = rooms.length > 0 ? Math.max(...rooms.map((x) => x.id)) : 0;
        rooms.push({
            id: maxID + 1,
            players: null,
            mode: null,
            countries: [],
        });
        io.emit("showRooms", rooms);
        console.log("Room created");
    });

    socket.on("configureRoom", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        console.log("Room configured");
        r.players = msg.players;
        r.mode = msg.mode;
        io.emit("showRooms", rooms);
    });

    socket.on("begin", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        if (r.players === msg.players && r.mode === msg.mode) {
            io.emit("begin", r.countries);
        } else {
            io.emit("joinFailed", r.id);
        }
    });

    socket.on("message", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        r.countries.push(msg.country);
        io.emit("reply", r.countries);
    });

    socket.on("end", (msg) => {
        io.emit("end", msg.roomID);
        // remove the room
        rooms = rooms.filter((r) => r.id !== msg.roomID);
        console.log(`Room ${msg.roomID} removed`);
        io.emit("showRooms", rooms);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});
