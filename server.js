const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const port = 3001;

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
        console.log(rooms);
    });

    socket.on("configureRoom", (msg) => {
        console.log(msg, rooms[msg.roomID - 1]);
        rooms[msg.roomID - 1].players = msg.players;
        rooms[msg.roomID - 1].mode = msg.mode;
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

    socket.on("end", () => {
        io.emit("end");
    });

    socket.on("finish", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        r.countries = [];
        io.emit("finish");
        console.log("finish");
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});
