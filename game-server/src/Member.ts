import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import type { MemberState } from "../types";
import { mergeStates } from "./helpers/stateHelpers";
import { randomUUID } from "crypto";

export interface TwitchData {
  id: string;
  username: string;
  photo: string;
}

class Member {
  socket: Socket | null;
  id: string;
  name: string;
  roomCode: string;
  state: MemberState;
  twitchData?: TwitchData;
  messages: object[];

  constructor(
    id: string,
    name: string,
    roomCode: string,
    twitchData?: TwitchData
  ) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode;
    this.socket = null;
    this.messages = [];
    this.twitchData = twitchData;
    this.state = {
      version: 1,
      theme: {
        header: {
          color: "white",
          background: "#7c2fec",
        },
        main: {
          background: "#120a20",
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
                color: "white",
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
      (component) => ({ key: randomUUID(), ...component })
    );
    this.sendState();
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }
}

export default Member;
