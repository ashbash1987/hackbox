const roomExists = async (roomCode: string): Promise<boolean> => {
  const response = await fetch(`http://localhost:9001/rooms/${roomCode}`);
  const body = await response.json();
  return body.exists;
}

export default roomExists;
