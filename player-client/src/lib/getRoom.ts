import config from "@/config";
import type { FindRoomResponse } from "@/types";

const getRoom = async (roomCode: string): Promise<FindRoomResponse> => {
  const response = await fetch(`${config.backendUri}/rooms/${roomCode}`);
  return response.json();
};

export default getRoom;
