import { v4 as uuid } from "uuid";

const APP_PREFIX = "hackbox-sandbox";
const USERID_KEY = `${APP_PREFIX}-userId`;

const getUserId = () => {
  const key = `${APP_PREFIX}-${USERID_KEY}`;
  let userId = window.localStorage.getItem(key);
  if (!userId) {
    userId = uuid();
    window.localStorage.setItem(key, userId);
  }
  return userId;
};

export { getUserId };
