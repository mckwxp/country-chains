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

let countries = [];

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("begin", () => {
        io.emit("begin", countries);
    });

    socket.on("message", (msg) => {
        console.log(`message: ${msg}`);
        countries.push(msg);
        console.log(`countries: ${countries}`);
        io.emit("reply", countries);
    });

    socket.on("end", () => {
        io.emit("end");
    });

    socket.on("finish", () => {
        countries = [];
        io.emit("finish");
        console.log("finish");
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});
