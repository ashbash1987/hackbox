import { v4 as uuid } from "uuid";

const APP_PREFIX = "hackbox-host";
const USERID_KEY = "userId";
const GAME_STATE_KEY = "gameState";

const getUserId = () => {
  const key = `${APP_PREFIX}-${USERID_KEY}`;
  let userId = window.localStorage.getItem(key);
  if (!userId) {
    userId = uuid();
    window.localStorage.setItem(key, userId);
  }
  return userId;
};

const getGameState = (roomCode: string) => {
  const key = `${APP_PREFIX}-${GAME_STATE_KEY}-${roomCode}`;
  const stateString = window.localStorage.getItem(key);
  return stateString ? JSON.parse(stateString) : null;
};

const setGameState = (roomCode: string, state: object) => {
  const key = `${APP_PREFIX}-${GAME_STATE_KEY}-${roomCode}`;
  const stateString = JSON.stringify(state);
  window.localStorage.setItem(key, stateString);
};

export { getUserId, getGameState, setGameState };
