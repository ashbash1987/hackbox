import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import type { MemberState } from "../types";
import { mergeStates } from "./helpers/stateHelpers";
import { randomUUID } from "crypto";

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
      version: 1,
      theme: {
        header: {
          color: "white",
          background: "#ed729f",
        },
        main: {
          background: "white",
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
              type: "Text",
              props: {
                text: "Waiting for the host to let you in...",
                align: "center",
                border: "none",
                color: "black",
                background: "transparent",
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

    this.sendState();
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  sendState() {
    this.send("state.member", this.state);
  }

  updateState(newState: Partial<MemberState> = {}) {
    this.state = mergeStates(this.state, newState);
    this.state.ui.main.components = this.state.ui.main.components.map(
      (component) => ({ ...component, key: randomUUID() })
    );
    this.sendState();
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }
}

export default Member;
