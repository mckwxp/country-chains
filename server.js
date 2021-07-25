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

function addCountry(countryName, room) {
    // Data for country neighbours
    const myjson =
        room.mode === "Land"
            ? require("./src/countries_land.json")
            : require("./src/countries_maritime.json");

    // Checks if the second country is a neighbour of the first country
    function checkNeighbours(second) {
        const first = room.countries[room.countries.length - 1];
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === first.toLowerCase()
        );

        if (searchResults) {
            const filteredNeighbours = searchResults.neighbours.filter(
                (x) => x.toLowerCase() === second.toLowerCase()
            );
            if (filteredNeighbours.length !== 0) {
                return true;
            }
        }
    }

    // Checks if a country has a neighbour
    function checkNeighbourExists(country) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        return searchResults ? searchResults.neighbours.length !== 0 : false;
    }

    // Checks if a country is in the data object
    function checkCountry(country) {
        const searchResults = myjson.find(
            (c) => c.country.toLowerCase() === country.toLowerCase()
        );
        return searchResults ? searchResults.country : false;
    }

    // Data for country name synonyms
    const synonyms = require("./src/countries_synonyms.json");

    // Checks for synonym of country names
    function checkSynonyms(country) {
        const searchResults = synonyms.find((c) =>
            c.synonyms
                .map((x) => x.toLowerCase())
                .includes(country.toLowerCase())
        );
        return searchResults ? searchResults.country : country;
    }

    // Checks for synonyms and country name validity
    countryName = checkSynonyms(countryName);
    countryName = checkCountry(countryName);

    if (!countryName) {
        return { status: "invalidCountry" };
    } else {
        // array already populated; not the first added country
        if (room.countries.length > 0) {
            return checkNeighbours(countryName)
                ? { status: "validNeighbour", country: countryName }
                : { status: "invalidNeighbour", country: countryName };
        }
        // first added country
        else {
            return checkNeighbourExists(countryName)
                ? { status: "validFirstCountry", country: countryName }
                : { status: "invalidFirstCountry", country: countryName };
        }
    }
}

let rooms = [];

// a bunch of event listeners
io.on("connection", (socket) => {
    console.log("connected");
    socket.emit("updateRooms", rooms); // send rooms data to client

    // create new room
    socket.on("createRoom", () => {
        const maxID =
            rooms.length > 0 ? Math.max(...rooms.map((x) => x.id)) : 0;
        rooms.push({
            id: maxID + 1,
            mode: null,
            countries: [],
            playersInRoom: [],
        });
        io.emit("updateRooms", rooms); // broadcast updated rooms to all clients
        console.log("Room created");
    });

    // add spectator
    socket.on("spectate", (msg) => {
        const r = rooms.filter((r) => r.id === msg.roomID)[0]; // current room
        socket.emit("begin", r.countries); // send country data in room to client
        socket.join(r.id); // add client to room
        io.to(r.id).emit("updatePlayersInRoom", r.playersInRoom); // broadcast player list to room
    });

    // configure room and prepare to start
    socket.on("configureRoom", (msg) => {
        const r = rooms.filter((r) => r.id === msg.roomID)[0]; // current room
        console.log("Room configured");
        r.mode = msg.mode;
        r.playersInRoom.push({
            id: socket.id,
            username: msg.username ?? "guest",
        });
        io.emit("updateRooms", rooms); // broadcast updated rooms to all clients
        socket.emit("begin", r.countries); // send country data in room to client
        socket.join(r.id); // add client to room
        io.to(r.id).emit("updatePlayersInRoom", r.playersInRoom); // broadcast player list to room
    });

    // Attempt to add a new country
    socket.on("addCountry", (msg, callback) => {
        const r = rooms.filter((r) => r.id === msg.roomID)[0]; // current room
        const response = addCountry(msg.country, r);
        callback(response); // client callback function on response
        if (["validNeighbour", "validFirstCountry"].includes(response.status)) {
            r.countries.push(response.country);
            io.to(r.id).emit("reply", r.countries); // send updated country data to client
        }
    });

    // End the game
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
        const inRoom = rooms.filter(
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
