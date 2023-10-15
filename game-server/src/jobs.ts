import { CronJob } from "cron";
import RoomManager from "./RoomManager";

const deleteOldRooms = (
  roomManager: typeof RoomManager,
  expiryHours: number
) => {
  const olderThan = expiryHours * 60 * 60 * 1000; // in milliseconds
  const createdBefore = Date.now() - olderThan;
  roomManager.rooms.forEach((rooms) => {
    if (rooms.createdAt < createdBefore) {
      roomManager.deleteRoom(rooms.id);
    }
  });
};

const initializeJobs = (roomManager: typeof RoomManager) => {
  new CronJob(
    "0 0 */1 * * *",
    () => deleteOldRooms(roomManager, 24),
    null,
    true
  );
};

export default initializeJobs;
