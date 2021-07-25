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
            let filteredNeighbours = searchResults.neighbours.filter(
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

io.on("connection", (socket) => {
    console.log("connected");
    socket.emit("updateRooms", rooms);

    socket.on("createRoom", () => {
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

    socket.on("addCountry", (msg, callback) => {
        let r = rooms.filter((r) => r.id === msg.roomID)[0];
        let response = addCountry(msg.country, r);
        callback(response);
        if (["validNeighbour", "validFirstCountry"].includes(response.status)) {
            r.countries.push(response.country);
            io.to(r.id).emit("reply", r.countries);
        }
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
