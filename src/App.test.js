import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("renders text as expected in the starting page", () => {
    beforeEach(() => {
        render(<App />);
    });

    it("renders the title", () => {
        expect(screen.getByText(/Country Chains/)).toBeInTheDocument();
    });

    it("renders the start page", () => {
        expect(screen.getByText(/Welcome to the game/)).toBeInTheDocument();
        expect(screen.getByText(/In this game/)).toBeInTheDocument();
    });

    it("renders the server connection info", () => {
        const serverMsg = screen.getByText(/Disconnected from server/);
        expect(serverMsg).toBeInTheDocument();
    });

    it("allows mode selection", () => {
        const landLabel = screen.getByLabelText(/Land$/);
        const landAndMaritimeLabel = screen.getByLabelText(/Land and maritime/);

        expect(landLabel).toBeChecked();
        expect(landAndMaritimeLabel).not.toBeChecked();

        userEvent.click(landAndMaritimeLabel);
        expect(landLabel).not.toBeChecked();
        expect(landAndMaritimeLabel).toBeChecked();
    });

    it("allows username input", () => {
        const playerNameInput = screen.getByLabelText(/Enter your player name/);
        userEvent.type(playerNameInput, "testplayer");
        expect(playerNameInput).toHaveValue("testplayer");
    });
});

describe("tests room functionality in starting page", () => {
    beforeEach(() => {
        const mockedRooms = [
            {
                id: 1,
                mode: "Land and maritime",
                countries: [],
                playersInRoom: [{ username: "p1" }, { username: "p2" }],
            },
            {
                id: 2,
                mode: "Land",
                countries: [],
                playersInRoom: [{ username: "p3" }],
            },
            {
                id: 3,
                mode: null,
                countries: [],
                playersInRoom: [],
            },
        ];

        render(<App rooms={mockedRooms} />);
    });

    it("allows room selection", () => {
        expect(screen.getByText(/Online players: p1, p2/)).toBeInTheDocument();
        expect(screen.getByText(/Online players: p3/)).toBeInTheDocument();

        const room1Label = screen.getByLabelText(/Room 1/);
        const room2Label = screen.getByLabelText(/Room 2/);

        expect(room1Label).not.toBeChecked();
        expect(room2Label).not.toBeChecked();

        userEvent.click(room1Label);
        expect(room1Label).toBeChecked();
        expect(room2Label).not.toBeChecked();

        userEvent.click(room2Label);
        expect(room2Label).toBeChecked();
        expect(room1Label).not.toBeChecked();
    });

    it("can create a room", () => {
        userEvent.click(screen.getByText(/Create a new room/));
    });

    it("can view highscore", () => {
        userEvent.click(screen.getByText(/View highscore/));
    });

    it("can spectate a room", () => {
        userEvent.click(screen.getAllByText(/Spectate/)[0]);
    });

    it("alerts when no room is chosen before joining", () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        userEvent.click(screen.getByText(/Play now/));
        expect(alertMock).toHaveBeenCalledWith(
            "Please choose a room (or create one and join if there are no rooms)"
        );
    });

    it("alerts when no username is specified before joining", () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation();
        userEvent.click(screen.getByLabelText(/Room 1/));
        userEvent.click(screen.getByText(/Play now/));
        expect(alertMock).toHaveBeenCalledWith("Please enter your player name");
    });

    it("can join a room", () => {
        userEvent.click(screen.getByLabelText(/Room 1/));
        userEvent.type(
            screen.getByLabelText(/Enter your player name/),
            "testplayer"
        );
        userEvent.click(screen.getByText(/Play now/));
        expect(screen.getByText(/Let's begin/)).toBeInTheDocument();
    });
});

it("renders the game page", () => {
    render(<App page={"GAME"} />);

    expect(screen.getByText(/Enter a country name/)).toBeInTheDocument();
    expect(screen.getByText(/Online players/)).toBeInTheDocument();
});

it("renders the end page", () => {
    render(<App page={"END"} />);

    expect(screen.getByText(/Thanks for playing/)).toBeInTheDocument();
    expect(screen.getByText(/Online players/)).toBeInTheDocument();

    userEvent.click(screen.getByText(/Back to homepage/));
    expect(screen.getByText(/Welcome to the game/)).toBeInTheDocument();
    expect(screen.getByText(/In this game/)).toBeInTheDocument();
});

describe("highscore page", () => {
    it("renders the highscore page", () => {
        render(<App page={"HIGHSCORE"} />);
        expect(screen.getByText(/Highscore/)).toBeInTheDocument();

        userEvent.click(screen.getByText(/Back to homepage/));
        expect(screen.getByText(/In this game/)).toBeInTheDocument();
    });

    it("renders the highscore page with mocked scores", () => {
        const highscore = [
            {
                mode: "Land and maritime",
                countries: ["India", "China", "Russia"],
                playersInRoom: [{ username: "p1" }, { username: "p2" }],
                score: 3,
            },
        ];

        render(<App page={"HIGHSCORE"} highscore={highscore} />);
        expect(screen.getByText(/Land and maritime/)).toBeInTheDocument();
        expect(screen.getByText(/p1, p2/)).toBeInTheDocument();

        userEvent.click(screen.getByText(/View the game/));
        expect(
            screen.getByText(/You are reviewing a game/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Countries: 3/)).toBeInTheDocument();
        expect(screen.getByText(/Russia/)).toBeInTheDocument();
        expect(screen.getByText(/Mode: Land and maritime/)).toBeInTheDocument();

        userEvent.click(screen.getByText(/Back to homepage/));
        expect(screen.getByText(/Welcome to the game/)).toBeInTheDocument();
        expect(screen.getByText(/In this game/)).toBeInTheDocument();
    });
});
