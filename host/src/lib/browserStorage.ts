import { v4 as uuid } from 'uuid';

const USERID_KEY = 'hackbox-hostId'

const getUserId = () => {
  let userId = window.localStorage.getItem(USERID_KEY);
  if (!userId) {
    userId = uuid();
    window.localStorage.setItem(USERID_KEY, userId);
  }
  return userId;
}

export { getUserId };
