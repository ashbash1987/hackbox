import { v4 as uuid } from "uuid";

const APP_PREFIX = "hackbox-host";
const USERID_KEY = `${APP_PREFIX}-userId`;
const GAME_STATE_KEY = `${APP_PREFIX}-gameState`;
const VOLUME_KEY = `${APP_PREFIX}-volume`;

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
  const key = `${GAME_STATE_KEY}-${roomCode}`;
  const stateString = window.localStorage.getItem(key);
  return stateString ? JSON.parse(stateString) : null;
};

const setGameState = (roomCode: string, state: object) => {
  const key = `${GAME_STATE_KEY}-${roomCode}`;
  const stateString = JSON.stringify(state);
  window.localStorage.setItem(key, stateString);
};

const getVolume = () => {
  let volume = window.localStorage.getItem(VOLUME_KEY);
  if (!volume) {
    volume = "quiet";
    window.localStorage.setItem(VOLUME_KEY, volume);
  }

  return volume;
};

const setVolume = (volume: string) => {
  window.localStorage.setItem(VOLUME_KEY, volume);
};

export { getUserId, getGameState, setGameState, getVolume, setVolume };
