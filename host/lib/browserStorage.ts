import { v4 as uuid } from 'uuid';

const USERID_KEY = 'bzzrtv-userid'
const USERNAME_KEY = 'bzzrtv-username'
const ROOMCODE_KEY = 'bzzrtv-roomcode'

const getUserId = () => {
  let userId = window.localStorage.getItem(USERID_KEY);
  if (!userId) {
    userId = uuid();
    window.localStorage.setItem(USERID_KEY, userId);
  }
  return userId;
}

const getUserName = () => window.localStorage.getItem(USERNAME_KEY) || "";
const setUserName = (name: string) => {
  window.localStorage.setItem(USERNAME_KEY, name.slice(0, 12).toUpperCase());
}

const getRoomCode = () => window.localStorage.getItem(ROOMCODE_KEY) || "";
const setRoomCode = (code: string) => {
  window.localStorage.setItem(ROOMCODE_KEY, code.slice(0, 4).toUpperCase());
}

export { getUserId, getUserName, setUserName, getRoomCode, setRoomCode };
