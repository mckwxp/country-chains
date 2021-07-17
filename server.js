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

    socket.on("createroom", (msg) => {
        let maxID = rooms.length > 0 ? Math.max(...rooms.map((x) => x.id)) : 0;
        rooms.push({
            id: maxID + 1,
            players: msg.players,
            mode: msg.mode,
            countries: [],
        });
        io.emit("showRooms", rooms);
    });

    socket.on("begin", (msg) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        io.emit("begin", r.countries);
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
