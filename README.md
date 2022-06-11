# Hackbox

This project should act only as the server with these responsibilities:
- Manages users' connections to their room
- Sends messages between users

## Requirements
### As any User
- When I disconnect/reconnect, I want to reconnect automatically to the room displayed on my screen, not the lobby.
- When I disconnect, I don't want to be kicked from the room automatically. (Maybe show the host a connection status.)
- I want my displays to be accessible on both mobile and desktop.

### As a Host
- I want to send players messages to update the prompt on their display.
- I want to kick a user from the game, sending them back to the lobby.
- I want to manage game state myself, and send that to the server to provide it to all the viewers.

### As a Player

### As a Viewer
- I want the full game state so I can display the game however I feel is appropriate.
- I want to receive events to trigger transitions and animations.

### As an Admin
- I want to see all active rooms.
- I want rooms to destroy themselves automatically after a period of time.
- I want to be able to destroy rooms manually in case they didn't destroy automatically.
