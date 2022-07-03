import config from "@/config";

const roomExists = async (roomCode: string): Promise<boolean> => {
  const response = await fetch(`${config.backendUri}/rooms/${roomCode}`);
  const body = await response.json();
  return body.exists;
}

export default roomExists;
