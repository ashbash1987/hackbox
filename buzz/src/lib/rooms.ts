import config from "@/config";
import { getUserId } from "./browserStorage";

const roomExists = async (roomCode: string): Promise<boolean> => {
  const response = await fetch(`${config.backendUri}/rooms/${roomCode}`);
  const body = await response.json();
  return body.exists;
};

const authorizedToHost = async (
  userId: string,
  roomCode: string
): Promise<boolean> => {
  const response = await fetch(
    `${config.backendUri}/rooms/${roomCode}/auth-host/${userId}`
  );
  const body = await response.json();
  return body.authed;
};

const createRoom = async (): Promise<string> => {
  const response = await fetch(`${config.backendUri}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hostId: getUserId(),
    }),
  });
  const body = await response.json();
  return body.roomCode;
};

export { roomExists, authorizedToHost, createRoom };
