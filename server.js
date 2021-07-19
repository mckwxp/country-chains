const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

const proxy = require("html2canvas-proxy");
app.use("/proxy", proxy());
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
            players: null,
            mode: null,
            countries: [],
        });
        io.emit("updateRooms", rooms);
        console.log("Room created");
    });

    socket.on("configureRoom", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        console.log("Room configured");
        r.players = msg.players;
        r.mode = msg.mode;
        io.emit("updateRooms", rooms);
        socket.emit("begin", r.countries);
        socket.join(r.id);
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
        console.log("disconnected");
    });
});
