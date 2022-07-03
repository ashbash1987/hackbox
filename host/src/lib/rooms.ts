import config from "@/config";

const roomExists = async (roomCode: string): Promise<boolean> => {
  const response = await fetch(`${config.backendUri}/rooms/${roomCode}`);
  const body = await response.json();
  return body.exists;
}

const createRoom = async (): Promise<string> => {
  const response = fetch(`${config.backendUri}/rooms`, {
    method: 'POST'
  });
}

export default roomExists;
