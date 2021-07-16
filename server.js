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

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("message", (msg) => {
        console.log(`message: ${msg}`);
        io.emit("message", msg);
    });
});
