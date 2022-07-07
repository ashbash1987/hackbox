import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import type { MemberState } from "../types";
import { mergeStates } from "./helpers/stateHelpers";
import { randomUUID } from "crypto";

export interface SanitizedMember {
  id: string;
  name: string;
  state: MemberState;
}

class Member {
  socket: Socket | null;
  id: string;
  name: string;
  roomCode: string;
  state: MemberState;
  messages: object[];

  constructor(id: string, name: string, roomCode: string) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode;
    this.socket = null;
    this.messages = [];
    this.state = {
      theme: {
        header: {
          textColor: "white",
          backgroundColor: "#4254f4",
        },
        main: {
          backgroundColor: "white",
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
                text: "Waiting for the host to let you in...",
                align: "center",
                borderColor: "white",
                textColor: "white",
                backgroundColor: "#4254f4",
              },
            },
          ],
        },
      },
    };
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on("msg", (payload) => {
      const message = {
        id: randomUUID(),
        from: this.id,
        timestamp: Date.now(),
        event: payload.event,
        message: payload,
      };
      this.messages.push(message);
      this.room.host.send("msg", message);
    });

    this.sendSelfState();
    this.sendRoomState();
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  sendSelfState() {
    this.send("self", this.state);
  }

  sendRoomState() {
    this.send("room", this.room.state);
  }

  updateState(newState: Partial<MemberState> = {}) {
    this.state = mergeStates(this.state, newState);
    this.state.ui.main.components = this.state.ui.main.components.map(
      (component) => ({ ...component, key: randomUUID() })
    );
    this.sendSelfState();
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get sanitized(): SanitizedMember {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
    };
  }
}

export default Member;
