import { Schema, defineTypes } from "@colyseus/schema";

export class Game extends Schema {

  constructor(attributes) {
    super();

    this.state = "waiting";
    this.roomName = attributes.roomName;
    this.mapName = attributes.mapName;
    this.maxPlayers = attributes.maxPlayers;
    this.mode = attributes.mode;

    this.onWaitingStart = attributes.onWaitingStart;
    this.onLobbyStart = attributes.onLobbyStart;
    this.onGameStart = attributes.onGameStart;
    this.onGameEnd = attributes.onGameEnd;
  }
  update(players) {
    const now = Date.now();

    // waiting → lobby
    if (this.state === "waiting") {
      if (players.size >= 2) {
        this.state = "lobby";
        this.lobbyEndsAt = now + 3000;

        if (this.onLobbyStart) this.onLobbyStart();
      }
    }

    // lobby → game
    else if (this.state === "lobby") {
      if (this.lobbyEndsAt && now >= this.lobbyEndsAt) {
        this.state = "game";

        this.lobbyEndsAt = 0;

        if (this.onGameStart) this.onGameStart();
      }
    }

    // game → end
    else if (this.state === "game") {
      if (this.gameEndsAt && now >= this.gameEndsAt) {
        this.state = "end";

        if (this.onGameEnd) {
          this.onGameEnd({
            type: "timeout",
            from: "server",
            ts: now,
            params: { reason: "time_up" }
          });
        }
      }
    }

    // console.log(
    //   "[GameUpdate]",
    //   "state:", this.state,
    //   "players:", players.size,
    //   "lobbyEndsAt:", this.lobbyEndsAt,
    //   "gameEndsAt:", this.gameEndsAt
    // );
  }
}

defineTypes(Game, {
  state: "string",
  roomName: "string",
  mapName: "string",
  lobbyEndsAt: "number",
  gameEndsAt: "number",
  maxPlayers: "number",
  mode: "string"
});