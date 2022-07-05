import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import type { PlayerState } from "../types";
import mergeStates from "./helpers/mergeStates";
import { randomUUID } from "crypto";

export interface SanitizedPlayer {
  id: string;
  name: string;
  state: PlayerState;
}

class Player {
  socket: Socket | null;
  id: string;
  name: string;
  roomCode: string;
  state: PlayerState;

  constructor(id: string, name: string, roomCode: string) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode;
    this.socket = null;
    this.state = {
      theme: {
        header: {
          textColor: "black",
          backgroundColor: "lightpink",
        },
        main: {
          backgroundColor: "#222233",
        },
      },
      ui: {
        header: {
          text: name,
        },
        main: {
          align: "start" as "start",
          components: [
            {
              type: "TextBox",
              props: {
                text: "Waiting to join the game...",
              }
            }
          ],
        }
      }
    }
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on("msg", (payload) => {
      this.room.host.send("msg", ({ ...payload, userId: this.id }))
    });

    this.updateState();
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  updateState(newState: Partial<PlayerState> = {}) {
    this.state = mergeStates(this.state, newState);
    this.state.ui.main.components = this.state.ui.main.components.map((component) => (
      { ...component, key: randomUUID() }
    ))
    this.send("update", this.state);
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get sanitized(): SanitizedPlayer {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
    };
  }
}

export default Player;
